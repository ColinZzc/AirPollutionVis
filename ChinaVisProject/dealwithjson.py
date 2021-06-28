import json
with open(r'./static/2018.json', "r", encoding="utf-8") as f:
    json_data = json.load(f)
    list1= []
    new_key = "log"
    a = "lon"
    b = "O3"
    C = "F"
    new = "size"
    for i in json_data:
        i[new_key] = i.pop(a)
        i[new] = i.pop(b)
        i.pop("PM2.5")
        i.pop("PM10")
        i.pop("SO2")
        i.pop("NO2")
        i.pop("CO")
        #i.pop("O3")
        i["group"] = C
        i.pop("RH")
        i.pop("TEMP")
        i.pop("PSFC")
        i.pop("year")
        list1.append(i)
with open(r'./China1.json', "w", encoding="UTF-8") as e:
    json_new_data = json.dumps(list1, ensure_ascii=False, indent=4)
    e.write(json_new_data)

    print(json_new_data)