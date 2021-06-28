//--------------------------------------------------legend--------------------------------------------------------------

    var margin = { top: 20, right: 30, bottom: 0, left: 10 },
      width = 200 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3
      .select("#my_dataviz")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var allgroups = ["+0.10", "-0.02", "-0.11", "-0.09", "-0.01", "0.00"];
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

    var legend = d3
      .select("body")
      .append("svg")
      .attr("class", "legend")
      .style("width",100)
      .style("height",165)
      .selectAll("g")
      .data(allgroups)
      .enter()
      .append("g")
      .attr("transform", function (d, i) {
        return "translate(20," + i * 20 + ")";
      });

    legend
      .append("circle")
      .attr("cx", 28)
      .attr("cy", function (d, i) {
        console.log(25 + i * 5);
        return 25 + i * 5;
      })
      .attr("r", 7)
      .style("fill", function (d, i) {
        return z(i);
      });


    legend
      .data(allgroups)
      .append("text")
      .attr("x", 45)
      .attr("y", function (d, i) {
        //    console.log(30 + i * 5);
        return 25 + i * 5;
      })
      .attr("dy", ".35em")
      .style("font-size", "10px")
      //      .attr("text-anchor", "right")
      .attr("font-family", "Karla")
      .text(function (d) {
        return d + "%";
      })
      .style(
        "fill",
        function (d, i) {
          d = +d;
          if (+d > 0) {
            console.log("colour:" + d);
            return "red";
          } else {
            console.log(d);
            return "green";
          }
        }
      );

    d3.select("#title") // select the <body> tag
      // .append("p") // create and append a <p> tag
      // .text("Eureka!")
      .attr("font-size", "32px")
      .attr("x", 10)
      .attr("y", 40);
    var summ = 0;
    d3.select("body")
      //  .selectAll("div")
      //   .data(allgroups)
      //   .enter()
      .append("div2")
      .text(function (d) {
        summ = d3.sum(allgroups)
        return (summ/6).toFixed(2)+"%";
      })
      .style("fill", function (d) {
        console.log("colour:" + summ);
        summ = +summ;
        if (summ > 0) {
          console.log("colour:" + summ);
          return "red";
        } else {
          console.log(summ);
          return "green";
        }
      })
      ;

    svg.append("svg:image")
      .attr({
        'xlink:href': "down.svg",  // can also add svg file here
        x: 10,
        y: 30,
        width: 20,
        height: 20
      });

function polling(){
         var httpRequest = new XMLHttpRequest();
         httpRequest.open('POST', '../text', true);
         httpRequest.setRequestHeader("Content-type","application/json");
         httpRequest.send();
         httpRequest.onreadystatechange = function () {//请求后的回调接口，可将请求成功后要执行的程序写在其中
             if (httpRequest.readyState == 4 && httpRequest.status == 200) {//验证请求是否发送成功
                 var newallgroups = httpRequest.responseText;//获取到服务端返回的数据
                 console.log(newallgroups);
                 newallgroups = JSON.parse(newallgroups);
                 newallgroups = newallgroups.textList;
                 d3.select("body")
                  .select("div2")
                  .text(function (d) {
                    summ = d3.sum(newallgroups)
                    ans =  (summ/6).toFixed(2);
                    if (ans<0){
                        return -1*ans+"%";
                    }else{
                        return "+"+ans+"%";
                    }
                  })



                  d3.selectAll("text")
                  .data(newallgroups)
                  .transition()
                  .duration(300)
                  .attr("x", 45)
                  .attr("y", function (d, i) {
                    //    console.log(30 + i * 5);
                    return 25 + i * 5;
                  })
                  .attr("dy", ".35em")
                  .style("font-size", "10px")
                  .attr("font-family", "Karla")
                  .text(function (d) {
                    return d + "%";
                  })
                  .style(
                    "fill",
                    function (d, i) {
                      d = +d;
                      if (+d > 0) {
                        console.log("colour:" + d);
                        return "red";
                      } else {
                        console.log(d);
                        return "green";
                      }
                    }
                  );

                 polling()
             }
         };
       }
    polling()