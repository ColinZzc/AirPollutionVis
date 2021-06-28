import json
import time
from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
from flask import render_template
from prophet import Prophet
from datetime import datetime
from autogluon.tabular import TabularPredictor


app = Flask(__name__)
app.jinja_env.auto_reload = True
app.config['TEMPLATES_AUTO_RELOAD'] = True

@app.route('/', methods=['GET', 'POST'])
def index():
    return render_template('vis.html')


@app.route('/text', methods=['GET', 'POST'])
def text():
    global textList
    global textListUpdate
    
    while textListUpdate==False:
        time.sleep(2)
    textListUpdate = False
    print('update text', textList)

    return jsonify({'textList': textList})


@app.route('/initData', methods=['GET', 'POST'])
def initData():

    return to_bubble_line().to_json(orient='records')

@app.route('/SRApool', methods=['GET', 'POST'])
def SRApool():

    global GlobalMonthMean
    global update
    global textList
    global textListUpdate
    global firstTime
    global isFromMap
    global FromMap
    
    while update==False:
        time.sleep(2)

    if isFromMap:
        print('SRA polling map...')
        isFromMap = False
        update = False
        return FromMap.to_json(orient='records')

    print('SRA polling...')
    test_data = GlobalMonthMean[(GlobalMonthMean['year']==2018)]
    pollutions = ['PM2.5', 'PM10', 'SO2', 'NO2', 'CO', 'O3']
    for index, label in enumerate(pollutions):
        test_data_nolab = test_data.drop(columns=[label])
        COpredictor = TabularPredictor.load("../../agModels-"+label)
        y_pred = COpredictor.predict(test_data_nolab)
        GlobalMonthMean.loc[y_pred.index, label] = y_pred
        textTemp = (np.mean(y_pred) - np.mean(test_data[label]))/np.mean(test_data[label])
        textList[index] = str("%.2f" % textTemp)
    if firstTime:
        textList = ['0.00', '0.00', '0.00', '0.00', '0.00', '0.00']
        firstTime = False
    textListUpdate = True
    # key, value, time
    # PM2.5, 0.26851, 0
    # PM10, 0.43461, 0
    # SO2, 0.27497, 0
    # NO2, 0.73228, 0
    # CO, 0.65222, 0
    # O3, 0.12992, 0
    sra = pd.DataFrame(columns=['key', 'value', 'time'])
    for index, row in GlobalMonthMean.loc[y_pred.index].iterrows():
        for label in pollutions:
            sra = sra.append([{'key': label, 'value': row[label], 'time': int(row['month'])-1}], ignore_index=True)
    update = False
    
    return sra.to_json(orient='records')


def to_map_data():
    global YearMonthLocationMean
    filter_result = YearMonthLocationMean.query('year ==  2018')
    res = pd.pivot_table(filter_result.reset_index(), index=["year", "name"],
                                 values=['PM2.5', 'PM10', 'SO2', 'NO2',
                                         'CO', 'O3', 'TEMP', 'RH', 'PSFC',
                                         'lat', 'lon'],
                                 aggfunc={"PM2.5": "mean", "PM10": "mean",
                                          "SO2": "mean", "NO2": "mean",
                                          "CO": "mean", "O3": "mean",
                                          "TEMP": "mean", "RH": "mean",
                                          "PSFC": "mean",
                                          'lat': "mean", 'lon': "mean"}).reset_index()
    res[['CO', 'NO2', 'O3', 'PM10', 'PM2.5', 'PSFC', 'RH', 'SO2', 'TEMP']] = res[
        ['CO', 'NO2', 'O3', 'PM10', 'PM2.5', 'PSFC', 'RH', 'SO2', 'TEMP']].apply(
        lambda x: (x - np.min(x)) / (np.max(x) - np.min(x)))
    jd = res.to_json(orient="records", force_ascii=False)
    jd = json.loads(jd)
    nn_jd = {'name': '地点'}
    location = []
    for i in jd:
        temp = {}
        temp['name'] = i['name']
        temp['lat'] = i['lat']
        temp['log'] = i['lon']
        temp['name'] = i['name']
        temp['group'] = 'A'
        temp['size'] = i['PM2.5']
        location.append(temp.copy())
        temp['group'] = 'B'
        temp['size'] = i['PM10']
        location.append(temp.copy())
        temp['group'] = 'C'
        temp['size'] = i['SO2']
        location.append(temp.copy())
        temp['group'] = 'D'
        temp['size'] = i['NO2']
        location.append(temp.copy())
        temp['group'] = 'E'
        temp['size'] = i['CO']
        location.append(temp.copy())
        temp['group'] = 'F'
        temp['size'] = i['O3']
        location.append(temp.copy())
    nn_jd['location'] = location
    return json.dumps(nn_jd, ensure_ascii=False)

@app.route('/map', methods=['GET', 'POST'])
def map():
    global textList
    global textListUpdate
    global update
    global isFromMap
    global FromMap
    
    city = request.get_json()['name']
    print(city)
    change = difference.copy()
    if city in ['南京', '广州', '北京']: 

        filter_result = YearMonthLocationMean.query('name == "' + city + '"')
        # train_data = filter_result.query('year != 2018').reset_index(drop=True)
        test_data = filter_result.query('year == 2018').copy()
        change.index = test_data.index
        test_data.loc[test_data.index, ['PSFC', 'RH', 'TEMP', 'WindSpeed']] = test_data.loc[test_data.index, ['PSFC', 'RH', 'TEMP', 'WindSpeed']]+change
        pollutions = ['PM2.5', 'PM10', 'SO2', 'NO2', 'CO', 'O3']

        sra = pd.DataFrame(columns=['key', 'value', 'time'])
        
        for index, label in enumerate(pollutions):
            test_data_nolab = test_data.drop(columns=[label])

            if city == '北京':
                predictor = TabularPredictor.load("../../Beijing-agModels-" + label)
            elif city == '广州':
                predictor = TabularPredictor.load("../../Guangzhou-agModels-" + label)
            elif city == '南京':
                predictor = TabularPredictor.load("../../Nanjing-agModels-" + label)

            y_pred = predictor.predict(test_data_nolab)
            YearMonthLocationMean.loc[y_pred.index, label] = y_pred
            
            for i,value in enumerate(y_pred):
                sra = sra.append([{'key': label, 'value': value, 'time': int(i)}], ignore_index=True)

            textTemp = (np.mean(y_pred) - np.mean(test_data[label])) / np.mean(test_data[label])
            textList[index] = str("%.2f" % textTemp)
        textListUpdate = True
        print(city, textList)

        isFromMap = True
        FromMap = sra
        update = True

    return to_map_data()



@app.route('/static/meteorological', methods=['GET', 'POST'])
def meteorological():
    global update
    changes = request.get_json()
    print(changes)

    # todo
    forecast_meteorological(changes)
    update = True

    return to_bubble_line().to_json(orient='records')


def to_bubble_line():
    global GlobalMonthMean
    global month_min
    global month_max

    GlobalMonthMean2018 = GlobalMonthMean.query('year ==  ' + str(2018)).reset_index()

    bubbleline = pd.concat(
        [GlobalMonthMean2018[['month', 'CO', 'NO2', 'O3', 'PM10', 'PM2.5', 'PSFC', 'RH', 'SO2', 'TEMP', 'WindSpeed']],
         month_max['WindSpeed'], month_min['WindSpeed']], axis=1)
    bubbleline.columns = ['month', 'CO', 'NO2', 'O3', 'PM10', 'PM2.5', 'PSFC', 'RH', 'SO2', 'TEMP', 'WindSpeed',
                          'WindSpeedMax', 'WindSpeedMin']
    return bubbleline[['month', 'PSFC', 'RH', 'TEMP', 'WindSpeed', 'WindSpeedMax', 'WindSpeedMin']]


def forecast_meteorological(changes):
    global GlobalMonthMean
    global prophet
    global difference

    month_index = 12 * 5 + changes[0] - 1

    diff = changes[2] - GlobalMonthMean.loc[month_index, changes[1]]
    difference.loc[changes[0], changes[1]] = difference.loc[changes[0], changes[1]] + diff
    print(difference)
    GlobalMonthMean.loc[month_index, changes[1]] = changes[2]

    prophet['y'] = GlobalMonthMean[changes[1]]
    m = Prophet()
    m.fit(prophet[:month_index+1])
    forecast = m.predict(prophet[month_index+1:][['ds']])
    for yhatindex, oldindex in enumerate(range(month_index+1, len(GlobalMonthMean))):
        GlobalMonthMean.loc[oldindex, changes[1]] = forecast['yhat'][yhatindex]


GlobalMonthMean = None
month_max = None
month_min = None
prophet = None
difference = None
update = True
YearMonthLocationMean = None
textListUpdate = True
textList = ['0.99', '0.99', '0.98', '0.99', '0.67', '0.99']
firstTime = True
isFromMap = False
FromMap = []

if __name__ == '__main__':
    GlobalMonthMean = pd.read_csv("./data/GlobalMonthMean.csv")
    difference = pd.DataFrame(columns=GlobalMonthMean.columns[7:], index=range(1, 13)).fillna(value=0).drop(columns=['SO2'])
    month_max = pd.pivot_table(GlobalMonthMean, index=["month"],
                               values=['WindSpeed'],
                               aggfunc=np.max).reset_index()
    month_min = pd.pivot_table(GlobalMonthMean, index=["month"],
                               values=['WindSpeed'],
                               aggfunc=np.min).reset_index()
    prophet = pd.DataFrame(columns=['ds', 'y'])
    ds = []
    for y in range(2013, 2019):
        for m in range(1, 13):
            ds.append(datetime(y, m, 1))
    prophet['ds'] = ds

    YearMonthLocationMean = pd.read_csv('./data/YearMonthLocationMean.csv')

    change = difference.copy()
    for city in ['南京', '广州', '北京']: 

        filter_result = YearMonthLocationMean.query('name == "' + city + '"')
        # train_data = filter_result.query('year != 2018').reset_index(drop=True)
        test_data = filter_result.query('year == 2018').copy()
        change.index = test_data.index
        test_data.loc[test_data.index, ['PSFC', 'RH', 'TEMP', 'WindSpeed']] = test_data.loc[test_data.index, ['PSFC', 'RH', 'TEMP', 'WindSpeed']]+change
        pollutions = ['PM2.5', 'PM10', 'SO2', 'NO2', 'CO', 'O3']
        for index, label in enumerate(pollutions):
            test_data_nolab = test_data.drop(columns=[label])

            if city == '北京':
                predictor = TabularPredictor.load("../../Beijing-agModels-" + label)
            elif city == '广州':
                predictor = TabularPredictor.load("../../Guangzhou-agModels-" + label)
            elif city == '南京':
                predictor = TabularPredictor.load("../../Nanjing-agModels-" + label)

            y_pred = predictor.predict(test_data_nolab)
            YearMonthLocationMean.loc[y_pred.index, label] = y_pred

    
    
    app.run('0.0.0.0')
