    // set the dimensions and margins of the graph
    var margin = { top: 0, right: 20, bottom: 150, left: 60 },
      width = 640 - margin.left - margin.right,
      height = 510 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3
      .select("#my_dataviz")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// Add X axis
      //    var x = d3.scaleTime().domain([new Date(2018, 0, 1), new Date(2018, 11, 30)]).range([1, width]);
      var x = d3.scaleLinear().domain([1, 12]).range([1, width]);
      //    var xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat("%b"));

      svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        //.ticks(function (d) {
        //  return formatDay(d);
        // })
        .call(d3.axisBottom(x));
      // .call(x);

      // Add Y axis
      var y = d3.scaleLinear().domain([93000, 99000]).range([height, 50]);

      svg.append("g").call(d3.axisLeft(y));

      var gridlineX = d3.axisBottom().tickFormat("").tickSize(height).scale(x);

      // svg.append("g").attr("class", "grid").call(gridlineX);

      var gridlineY = d3.axisLeft().tickFormat("").tickSize(-width).scale(y);

      // svg.append("g").attr("class", "grid").call(gridlineY);

      // Add a legend for bubble size
      var z = d3.scaleLinear().domain([50, 70]).range([2, 30]);
      var valuesToShow = [50, 60, 70];
      //location of label
      var xCircle = 50;
      var xLabel = 90;
      var yCircle = 90;

//      add humidity text on the up left of the graph
      svg
        .append("text")
        .attr("x", 30)
        .attr("y", 105)
        .text("Humidity(%)")
        .style("font-size", "9px")
        .attr("alignment-baseline", "middle");
//      up left legend
      svg
        .selectAll("legend")
        .data(valuesToShow)
        .enter()
        .append("circle")
        .attr("cx", xCircle)
        .attr("cy", function (d) {
          return yCircle - z(d);
        })
        .attr("r", function (d) {
          return z(d);
        })
        .style("fill", "none")
        .attr("stroke", "black");

      // Add legend: Size
      svg
        .selectAll("legend")
        .data(valuesToShow)
        .enter()
        .append("line")
        .attr("x1", function (d) {
          return xCircle + z(d);
        })
        .attr("x2", xLabel)
        .attr("y1", function (d) {
          return yCircle - z(d);
        })
        .attr("y2", function (d) {
          return yCircle - z(d);
        })
        .attr("stroke", "black")
        .style("stroke-dasharray", "2,2");

      // Add legend: labels
      svg
        .selectAll("legend")
        .data(valuesToShow)
        .enter()
        .append("text")
        .attr("x", xLabel)
        .attr("y", function (d) {
          return yCircle - z(d);
        })
        .text(function (d) {
          return d;
        })
        .style("font-size", 10)
        .attr("alignment-baseline", "middle");

      //temperature legend
      var mycolor = d3
        .scaleLinear()
        .domain([1, 27])
        .range(["#2c7fb8", "#f03b20"]);

      var legend = d3
        .legendColor()
        .scale(mycolor)
        .orient("horizontal")
        .cells(6)
        .shapePadding(1);

      svg
        .append("g")
        .attr("class", "legendSize")
        .attr("transform", "translate(0, 40)");

      //  var legendColor = d3
      // .legendColor()
      //  .scale(z)
      //   .shape("circle")
      //   .cells(6)
      //   .shapePadding(0)
      //  .labelOffset(2)
      // .orient("horizontal")

      svg
        .append("g")
        .attr("transform", "translate(470,299)")
        .style("font-size", "6px")
        // .call(d3.legend)
        .call(legend);

      svg
        .append("text")
        .attr("x", 470)
        .attr("y", 285)
        .text("Temp(℃)")
        .style("font-size", "9px")
        .attr("alignment-baseline", "middle");

      svg
        .append("text")
        .attr("x", -28)
        .attr("y", 30)
        .text("(Pa)")
        .style("font-size", "9px")
        .attr("alignment-baseline", "middle");

      svg
        .append("line")
        .attr("x1", 50)
        .attr("y1", 240)
        .attr("x2", 50)
        .attr("y2", 280)
        .attr("stroke", "#cce5df")
        .attr("stroke-width", 2)
        .attr("marker-end", "url(#arrow)");

      svg
        .append("text")
        .attr("x", 20)
        .attr("y", 290)
        .text("WindSpeed(m/s)")
        .style("font-size", "9px")
        .attr("alignment-baseline", "middle");

      /*------------------------------------------------smooth legend----------------------------------------*/
      //Set the color for the start (0%)

      //Append a defs (for definition) element to your SVG
      var defs = svg.append("defs");

      //Append a linearGradient element to the defs and give it a unique id
      var linearGradient = defs
        .append("linearGradient")

        .attr("id", "linear-gradient");

      //Horizontal gradient
      linearGradient
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "0%");

      linearGradient
        .append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#2c7fb8"); //blue

      //Set the color for the end (100%)
      linearGradient
        .append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#f03b20"); //red

      //Draw the rectangle and fill with gradient
      svg
        .append("rect")
        .attr("width", 95)
        .attr("height", 20)
        .attr("transform", "translate(470,299)")
        .style("fill", "url(#linear-gradient)");

      /*     var legendSize = d3
                .legendSize()
                .scale(z)
                .shape("circle")
                .shapePadding(40)
                .labelOffset(40)
                //.style("color","#e6f5c9")
                .orient("horizontal");

              svg.select(".legendSize").call(legendSize);*/
      /*------------------------------------------------------Tooltip---------------------------------*/
      //Create a tooltip div that is hidden by default:
      var tooltip = d3
        .select("#my_dataviz")
        .append("div")
        .style("opacity", 0.85)
        .attr("class", "tooltip")
        //   .style("font-size", "1px")
        // .style("background-color", "grey")
        // .style("border-radius", "2px")
        .style("padding", "5px")
        .style("color", "black");

      //  Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
      var showTooltip = function (d) {
        tooltip.transition().duration(2);
        tooltip
          // .style("opacity", 1)
          .style("display", "block")
          .html(
            "<p>" +
              "Humidity:" +
              d[2] +
              ";" +
              "<p>" +
              " Temp: " +
              d[3] +
              ";" +
              "<p>" +
              " WindSpeed: " +
              d[8] +
              ";" +
              "<p>" +
              " AtmosphericPressure: " +
              d[4]
          )
          //添加这一句！！！！
          .style("position", "absolute")
          // .style("font-size", "1px")
          .style("left", +d3.mouse(this)[0] + 30 + "px")
          .style("top", d3.mouse(this)[1] + 30 + "px");
        // console.log(d[2]);
      };
      var moveTooltip = function (d) {
        tooltip

          .style("left", d3.mouse(this)[0] + 30 + "px")
          .style("top", d3.mouse(this)[1] + 30 + "px");
      };
      var hideTooltip = function (d) {
        // tooltip.transition().duration(2).style("opacity", 0);
        tooltip.style("display", "none");
      };


    var bibuble = svg.append("g");
    var group = svg.append("g");
    var area = d3.area()
            .x(function (d) {
              return x(d[0]);
            })
            .y0(function (d) {
              return y(d[9]);
            })
            .y1(function (d) {
              return y(d[10]);
            });;
    var focus = svg.append("g");
    var line = d3.line()
            .x(function (d) {
              return x(d[0]);
            })
            .y(function (d) {
              return y(d[4]);
            })
            .curve(d3.curveMonotoneX);
;
    //Read the data
//    d3.csv("/static/2018MeanBubbleLineInit.csv",draw);

    var httpRequest = new XMLHttpRequest();//第一步：创建需要的对象
    httpRequest.open('POST', '../initData', true); //第二步：打开连接/***发送json格式文件必须设置请求头 ；如下 - */
    httpRequest.send();
    httpRequest.onreadystatechange = function () {//请求后的回调接口，可将请求成功后要执行的程序写在其中
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {//验证请求是否发送成功
            var json = httpRequest.responseText;//获取到服务端返回的数据
            var newData = JSON.parse(json);
            draw(newData);
        }
    };


    function processData(data){
        var points = new Array(data.length);
        for (i = 0; i < data.length; i++) {
          points[i] = [
          data[i].month,
          data[i].PSFC + (data[i].WindSpeedMax-3.685078884874235)/1.189675517114611*800+700,
          data[i].RH,
          data[i].TEMP-273.15,
          data[i].PSFC,
          data[i].upRH,
          data[i].uptemp,
          data[i].uppRH,
          data[i].WindSpeed,
          data[i].PSFC + (data[i].WindSpeed-3.685078884874235)/1.189675517114611*800+100,
          data[i].PSFC - (data[i].WindSpeedMax-3.685078884874235)/1.189675517114611*800+100
          ];
      }
      return points
    }

//--------------------------------------------Init Data-----------------------------------------------------------------------
    function draw (data) {
      var points = processData(data);

//      for (i = 0; i < data.length; i++) {
//        points[i] = [
//          data[i].x,
//          data[i].lo,
//          data[i].RH,
//          data[i].temp,
//          data[i].y,
//          data[i].upRH,
//          data[i].uptemp,
//          data[i].uppRH,
//          data[i].WindSpeed,
//          data[i].CI_right,
//          data[i].CI_left,
//        ];
//      }

      /*----------------------------------------------以下是bubble--------------------------------*/
//      var bibuble = svg.append("g");

      // add big bubble
      bibuble
        .selectAll("circle")
        .data(points)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
          return x(d[0]);
        })
        .attr("cy", function (d) {
          return y(d[1]);
        })
        .attr("r", function (d) {
          return z(d[2]);
        })
        .attr("fill", function (d) {
          return mycolor(d[3]);
        })
        .style("opacity", "0.95")
        .attr("stroke", "white");

      //clickBigBubble
    bibuble.selectAll("circle").on("click", clicked);
    bibuble
    .selectAll("circle")
   // .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut);

      /*----------------------------------------------以下是group--------------------------------*/

      // wide line
      group
        .append("path")
        .datum(points)
        .attr("fill", "#cce5df")
        .attr("stroke", "none")
        .attr("d", area);

      group
        .selectAll("circle1")
        .data(points)
        .enter()
        .append("circle")
        .attr("r", 3.0)
        .attr("cx", function (d) {
          return x(d[0]);
        })
        .attr("cy", function (d) {
          return y(d[9]);
        })
        .style("cursor", "pointer")
        .attr("stroke", "white")
        .style("fill", "#cce5df");

      group.selectAll("circle").call(
        d3
          .drag() // call specific function when circle is dragged
          .on("start", drastarted)
          .on("drag", draged)
          .on("end", draended)
      );


      /*--------------------------以下是focus--------------------------------------------------*/
//      var focus = svg.append("g");

      //压强线（深蓝）
//      var line = d3
//        .line()

      focus
        .append("path")
        .datum(points)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", line);

      // line上的点
      // pressure
      focus
        .selectAll("circle")
        .data(points)
        .enter()
        .append("circle")
        .attr("r", 3.0)
        .attr("cx", function (d) {
          return x(d[0]);
        })
        .attr("cy", function (d) {
          return y(d[4]);
        })
        .style("cursor", "pointer")
        .style("fill", "steelblue")
        .attr("stroke", "white")
        .on("mouseover", showTooltip)
        .on("mousemove", moveTooltip)
        .on("mouseleave", hideTooltip);

      focus.selectAll("circle").call(drag);

    }

    /*----------------------------------------------drag focus function-----------------------------------*/
     let drag = d3
            .drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
      function dragstarted(d) {
        d3.select(this).raise().classed("active", true);
      }
      function dragged(d) {
//        d[0] = x.invert(d3.event.x);
        d[4] = y.invert(d3.event.y);
//        d3.select(this).attr("cx", x(d[0])).attr("cy", y(d[4]));
        d3.select(this).attr("cy", y(d[4]));
        focus.select("path").attr("d", line);
      }
      function dragended(d) {
        d3.select(this).classed("active", false);
        var id = null;
        var value = null;
        d3.select(this).text(function(d,i){id = d[0]; value = d[4]; return null});
        transmitData(id, "PSFC", value);
      }


    /*----------------------------------------------drag group line function-----------------------------------*/
    //drag
    function drastarted(d) {
        d3.select(this).raise().classed("active", true);
    }
    function draged(d) {
    //windspeed
    //todo
    //      console.log(d3.select(this).attr("cx"))
    //        d[0] = x.invert(d3.event.x);
    d[9] = y.invert(d3.event.y);
    //        d3.select(this).attr("cx", x(d[0])).attr("cy", y(d[9]));
    d3.select(this).attr("cy", y(d[9]));

    group.select("path").attr("d", area);
    }
    function draended(d) {//                console.log(json);
        d3.select(this).classed("active", false);
        var id = null;
        var value = null;
        d3.select(this).text(
                function(d,i){
                    id = d[0];
                    d[8] = (d[9]-d[4]-100)/800*1.189675517114611+3.685078884874235;
                    return null
                }
        );

        transmitData(id, "WindSpeed", d[8]);
      }


    /*----------------------------------------------clickBigBubble function-----------------------------------*/
    //todo ???
    var timeout = 0;
    var clickedOnce = false;
    function clicked(event, d) {
        clearTimeout(timeout);
        timeout = setTimeout(function () {
//          console.clear();
          console.log("node was single clicked", new Date());
        }, 250);

        d3.select(this)
          .transition()
         // .attr("fill", function (d) {
        //    console.log(d[6]);

         //   return mycolor(d[6]);

            //   console.log("colour not changed");
       //   })
          .attr(
            "r",
            function (d) {
              //  if (i < 5) {
              console.clear();
              console.log("单击");
              return z(d[2] * 1.1 - 2); //调湿度
              // } else {
              //  return z(d[7]);
            }

            // }
          );

        tooltip.text("Humidity: +3%"); // NEW
        tooltip.style("display", "block");
        tooltip
          .style("left", d3.select(this).attr("cx")+30 + "px")
          .style("top", d3.select(this).attr("cy")+10 + "px");
        // .transition()
        // .attr("r", radius)
        //.attr("fill", d3.schemeCategory10[d.index % 10]);
        //TODO
        var id = null;
        var value = null;
        var obj = d3.select(this);
        obj.text(function(d,i){id = d[0]; value = d[2]*1.1-2; return null});
        transmitData(id, "RH", value);
      }
    function handleMouseOver(d) {

        var change = null;

        d3.select(this).text(
            function(d){
                console.log(d3.select(this).attr("fill"))
                change = (d3.select(this).attr("fill") == mycolor(d[3]));
                console.log(change)
                return null
            }
        )
        if (change){
            d3.select(this)
              //  .transition()
              .attr("fill", function (d) {
                //      console.log("mouseOver");
    //            console.log(d[3] * 1.2);
                    var id = null;
                    var value = null;
                    var obj = d3.select(this);
                    obj.text(function(d,i){id = d[0]; value = d[3] * 0.7; return null});
                    transmitData(id, "TEMP", value+273.15);
                return mycolor(d[3] * 0.7); //调温度
              });
            tooltip.text("Temp: -1℃"); // NEW
            tooltip.style("display", "block");
            tooltip
              .style("left", d3.select(this).attr("cx") + "px")
              .style("top", d3.select(this).attr("cy") + "px");
            d3.select(".tooltip").transition().delay(500).duration(1000);
        }
      }
    function handleMouseOut(d) {
        tooltip.style("display", "none");
        console.log("move out");
    }
//    function DoubleClicked(d) {
//        //   clickedOnce = false;
//        clearTimeout(timeout);
//        d3.select(this)
//          .transition()
//          .attr("fill", function (d) {
//            //console.log("双击");
//            console.clear();
//            return mycolor(d[6]);
//          });
//    // .transition()
//    // .attr("r", radius)
//    //.attr("fill", d3.schemeCategory10[d.index % 10]);
//  }


    /*----------------------------------------------Post changed data function-----------------------------------*/

    function transmitData(id, type, value){
        var httpRequest = new XMLHttpRequest();//第一步：创建需要的对象
        httpRequest.open('POST', 'meteorological', true); //第二步：打开连接/***发送json格式文件必须设置请求头 ；如下 - */
        httpRequest.setRequestHeader("Content-type","application/json");//设置请求头 注：post方式必须设置请求头（在建立连接后设置请求头）var obj = { name: 'zhansgan', age: 18 };
        httpRequest.send(JSON.stringify([id, type, value]));//发送请求 将json写入send中
//        await sleep(100) // async
        httpRequest.onreadystatechange = function () {//请求后的回调接口，可将请求成功后要执行的程序写在其中
            if (httpRequest.readyState == 4 && httpRequest.status == 200) {//验证请求是否发送成功
                var json = httpRequest.responseText;//获取到服务端返回的数据
                console.log(json);
                var newData = JSON.parse(json);
                update(newData);
            }
        };
      }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }


    function update (data) {
      var points = processData(data);

      /*----------------------------------------------以下是bubble--------------------------------*/
//      var bibuble = svg.append("g");

      // add big bubble
      bibuble
        .selectAll("circle")
        .data(points)
        .transition()
        .duration(300)
        .attr("cx", function (d) {
          return x(d[0]);
        })
        .attr("cy", function (d) {
          return y(d[1]);
        })
        .attr("r", function (d) {
          return z(d[2]);
        })
        .attr("fill", function (d) {
          return mycolor(d[3]);
        })
        .style("opacity", "0.95")
        .attr("stroke", "white");

    bibuble.selectAll("circle").on("click", clicked);
    bibuble
    .selectAll("circle")
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut);

      /*----------------------------------------------以下是group--------------------------------*/

      group
        .selectAll("circle")
        .data(points)
        .transition()
        .duration(300)
        .attr("r", 3.0)
        .attr("cx", function (d) {
          return x(d[0]);
        })
        .attr("cy", function (d) {
          return y(d[9]);
        })
        .style("cursor", "pointer")
        .attr("stroke", "white")
        .style("fill", "#cce5df");

        group.select("path")
        .datum(points)
        .transition()
        .duration(300)
        .attr("d", area);

//      group.selectAll("circle").call(
//        d3
//          .drag() // call specific function when circle is dragged
//          .on("start", drastarted)
//          .on("drag", draged)
//          .on("end", draended)
//      );

      /*--------------------------以下是 update focus--------------------------------------------------*/

      focus
        .select("path")
        .datum(points)
        .transition()
        .duration(300)
        .attr("d", line);

      // line上的点
      // pressure
      focus
        .selectAll("circle")
        .data(points)
        .transition()
        .duration(300)
        .attr("r", 3.0)
        .attr("cx", function (d) {
          return x(d[0]);
        })
        .attr("cy", function (d) {
          return y(d[4]);
        })
        .style("cursor", "pointer")
        .style("fill", "steelblue")
        .attr("stroke", "white")
//        .on("mouseover", showTooltip)
//        .on("mousemove", moveTooltip)
//        .on("mouseleave", hideTooltip);
//      focus.selectAll("circle").call(drag);

    }
