  const margin = { left: 30, right: 28, top: 80, bottom: 40 };

    var formatMonth = d3.time.format("%b"),
      formatDay = function (d) {
        return formatMonth(new Date(2018, d, 0));
      };

    var width = 210,
      height = 160,
      outerRadius = height / 2 - 5,
      innerRadius = 20;

    var angle = d3.time.scale().range([0, 2 * Math.PI]);

    var radius = d3.scale.linear().range([innerRadius, outerRadius]);
    //6种污染物颜色
    var z = d3.scale
      .ordinal()
      .range([
        "#e5999c",
        "#97d0b5",
        "#00b386",
        "#faed98",
        "#ffbf80",
        "#8db9d8",
      ]);

    //d3.scale.category20();

    //var z = d3.scaleBand().domain(data).range(["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462"]);

    //   ordinalScale('PM2.5');  // returns 'black';
    //  ordinalScale('PM10');  // returns '#ccc';
    //  ordinalScale('SO2');  // returns '#ccc';
    //  ordinalScale('NO2');
    //  ordinalScale('CO');
    //  ordinalScale('O3');

    var stack = d3.layout
      .stack()
      .offset("zero")
      .values(function (d) {
        return d.values;
      })
      .x(function (d) {
        return d.time;
      })
      .y(function (d) {
        return d.value;
      });

    var nest = d3.nest().key(function (d) {
      return d.key;
    });

    var line = d3.svg.line
      .radial()
      .interpolate("cardinal-closed")
      .angle(function (d) {
        return angle(d.time);
      })
      .radius(function (d) {
        return radius(d.y0 + d.y);
      });

    var area = d3.svg.area
      .radial()
      .interpolate("cardinal-closed")
      .angle(function (d) {
        return angle(d.time);
      })
      .innerRadius(function (d) {
        return radius(d.y0);
      })
      .outerRadius(function (d) {
        return radius(d.y0 + d.y);
      });

    var svg = d3
      .select("body")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom+30)
      .append("g")
      .attr(
        "transform",
        "translate(" + width / 2 + "," + (height + 80) / 2 + ")"
      );

    function type(d) {
      d.time = +d.time;
      d.value = +d.value;
      return d;
    }

    function draw(data) {

      var layers = stack(nest.entries(data));

      // Extend the domain slightly to match the range of [0, 2π].
      angle.domain([
        0,
        d3.max(data, function (d) {
          return d.time + 1;
        }),
      ]);
      radius.domain([
        0,
        d3.max(data, function (d) {
          return d.y0 + d.y;
        }),
      ]);

      svg
        .selectAll(".axis")
        .data(d3.range(angle.domain()[1]))
        .enter()
        .append("g")
        .attr("class", "axis")
        .attr("transform", function (d) {
          return "rotate(" + (angle(d) * 180) / Math.PI + ")";
        })
        //  .call(d3.svg.axis()
        //  .scale(radius.copy().range([-innerRadius, -outerRadius]))
        //  .orient("left"))
        .append("text")
        .attr("y", -innerRadius - 87)
        .attr("dy", ".91em")
        .attr("text-anchor", "middle")
        .text(function (d) {
          return formatDay(d);
        });

//      addCircleAxes = function () {
        var circleAxes, i;

        // svg.selectAll('.circle-ticks').remove();

        circleAxes = svg
          .selectAll(".layer")
          .data(data)
          .enter()
          .append("svg:g")
          .attr("class", "circle");

        circleAxes
          .append("svg:circle")
          .attr("r", 80)
          .attr("class", "circle")
          .style("stroke", "#ccc")
          .style("stroke-dasharray", "3,3")
          .style("opacity", 0.5)
          .style("fill", "none");

        circleAxes
          .append("svg:circle")
          .attr("r", 56)
          .attr("class", "circle")
          .style("stroke", "#ccc")
          .style("stroke-dasharray", "3,3")
          .style("opacity", 0.5)
          .style("fill", "none");

        circleAxes
          .append("svg:circle")
          .attr("r", 33)
          .attr("class", "circle")
          .style("stroke", "#ccc")
          .style("stroke-dasharray", "3,3")
          .style("opacity", 0.5)
          .style("fill", "none");

        circleAxes
          .append("svg:circle")
          .attr("r", 10)
          .attr("class", "circle")
          .style("stroke", "#ccc")
          .style("stroke-dasharray", "3,3")
          .style("opacity", 0.5)
          .style("fill", "none");

      //------------------------------------------ create a tooltip---------------------------------------------------------
      var Tooltip = svg
        .append("text")
        .attr("x", -18)
        .attr("y", 10)
        .style("opacity", 0)
        .style("font-size", 12);

      // Three function that change the tooltip when user hover / move / leave a cell
      var mouseover = function (d) {
        Tooltip.style("opacity", 1);
        d3.selectAll(".layer").style("opacity", 0.2);
        d3.select(this).style("stroke", "white").style("opacity", 1);
      };
      var mousemove = function (d, i) {
        grp = d.key;
        Tooltip.text(grp);
      };
      var mouseleave = function (d) {
        Tooltip.style("opacity", 0);
        d3.selectAll(".layer").style("opacity", 1).style("stroke", "none");
      };

      svg
        .selectAll(".layer")
        .data(layers)
        .enter()
        .append("path")
        .attr("class", "layer")
        .attr("d", function (d) {
          return area(d.values);
        })
        .style("fill", function (d, i) {
          return z(i);
        })
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave);
    };


//------------------------------------------ create a tooltip---------------------------------------------------------
      var Tooltip = svg
        .append("text")
        .attr("x", -13)
        .attr("y", 10)
        .style("opacity", 0)
        .style("font-size", 9);

      // Three function that change the tooltip when user hover / move / leave a cell
      var mouseover = function (d) {
        Tooltip.style("opacity", 1);
        d3.selectAll(".layer").style("opacity", 0.2);
        d3.select(this).style("stroke", "white").style("opacity", 1);
      };
      var mousemove = function (d, i) {
        grp = d.key;
        Tooltip.text(grp);
      };
      var mouseleave = function (d) {
        Tooltip.style("opacity", 0);
        d3.selectAll(".layer").style("opacity", 1).style("stroke", "none");
      };


    var httpRequest = new XMLHttpRequest();
        httpRequest.open('POST', '../SRApool', true);
        httpRequest.send();
        httpRequest.onreadystatechange = function () {//请求后的回调接口，可将请求成功后要执行的程序写在其中
            if (httpRequest.readyState == 4 && httpRequest.status == 200) {//验证请求是否发送成功
                var json = httpRequest.responseText;//获取到服务端返回的数据
                var newData = JSON.parse(json);
                draw(newData);
                polling()
            }
    };

    function polling(){
        var httpRequest = new XMLHttpRequest();
        httpRequest.open('POST', '../SRApool', true);
        httpRequest.setRequestHeader("Content-type","application/json");
        httpRequest.send();
        httpRequest.onreadystatechange = function () {//请求后的回调接口，可将请求成功后要执行的程序写在其中
            if (httpRequest.readyState == 4 && httpRequest.status == 200) {//验证请求是否发送成功
                var json = httpRequest.responseText;//获取到服务端返回的数据
                console.log(json);
                var newData = JSON.parse(json);
                update(newData);
                polling()
            }
        };
      }



    function update (data) {

      var layers = stack(nest.entries(data));

      // Extend the domain slightly to match the range of [0, 2π].
      angle.domain([
        0,
        d3.max(data, function (d) {
          return d.time + 1;
        }),
      ]);
      radius.domain([
        0,
        d3.max(data, function (d) {
          return d.y0 + d.y;
        }),
      ]);

      svg
        .selectAll(".axis")
        .data(d3.range(angle.domain()[1]))
        .selectAll("g")
        .transition()
        .duration(300)
        .attr("class", "axis")
        .attr("transform", function (d) {
          return "rotate(" + (angle(d) * 180) / Math.PI + ")";
        })
        .selectAll("text")
        .transition()
        .duration(300)
        .attr("y", -innerRadius - 87)
        .attr("dy", ".91em")
        .attr("text-anchor", "middle")
        .text(function (d) {
          return formatDay(d);
        });

//      addCircleAxes = function () {
        var circleAxes, i;

        // svg.selectAll('.circle-ticks').remove();

        circleAxes = svg
          .selectAll(".layer")
          .data(data)
          .enter()
          .append("svg:g")
          .attr("class", "circle");

        circleAxes
          .append("svg:circle")
          .attr("r", 80)
          .attr("class", "circle")
          .style("stroke", "#ccc")
          .style("stroke-dasharray", "3,3")
          .style("opacity", 0.5)
          .style("fill", "none");

        circleAxes
          .append("svg:circle")
          .attr("r", 56)
          .attr("class", "circle")
          .style("stroke", "#ccc")
          .style("stroke-dasharray", "3,3")
          .style("opacity", 0.5)
          .style("fill", "none");

        circleAxes
          .append("svg:circle")
          .attr("r", 33)
          .attr("class", "circle")
          .style("stroke", "#ccc")
          .style("stroke-dasharray", "3,3")
          .style("opacity", 0.5)
          .style("fill", "none");

        circleAxes
          .append("svg:circle")
          .attr("r", 10)
          .attr("class", "circle")
          .style("stroke", "#ccc")
          .style("stroke-dasharray", "3,3")
          .style("opacity", 0.5)
          .style("fill", "none");

      svg
        .selectAll("path")
        .data(layers)
//        .selectAll("path")
        .transition()
        .duration(300)
        .attr("class", "layer")
        .attr("d", function (d) {
          return area(d.values);
        })
        .style("fill", function (d, i) {
          return z(i);
        });
    };

