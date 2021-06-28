//创建svg
var width = 640, height = 538;
//放大地图
var body = d3.select("#body")

var h1 = body.append("h1")
var svg = body.append("svg")
        .attr("width", width)
        .attr("height", height)
        .call(d3.zoom().scaleExtent([1, 8]).on("zoom", function () {
     svg.attr("transform", d3.event.transform)
}))             .on("dblclick.zoom", null)//禁用双击放大
        //.on('mousedown.zoom',null)//禁用拖拽
.append("g");



var color = d3.scaleOrdinal()
  .domain(["A", "B", "C" , "D", "E","F"])
  .range([
      "#e08589",
      "#99ffcc",
      "#ffd633",
      "#4a9758",
      "#fd7e31",
      "#66ccff"
  ])

// Add a scale for bubble size
var size = d3.scaleLinear()
  .domain([0,1])  // What's in the data
  .range([ 4, 30])  // Size in pixel


let L_json = "china.json";
let P_json = "2018.json";

 //创建投影(projection)
 var projection = d3.geoMercator().translate([width / 2, height / 2]).center([105, 38]).scale(575);
 //创建path
 var path = d3.geoPath().projection(projection);


 //解析地理位置json
 d3.json(L_json, function(json) {
    svg.selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr('fill', function(d, i){return 'rgb(203,203,203)'})
            .attr('stroke', 'rgb(255,255,255)')
            .attr('stroke-width', 1)
 })

 //插入坐标点
 d3.json(P_json, function(error, places) {
     //插入分组元素
    var location = svg.selectAll(".location")
                        .data(places.location)
                        .enter()
                        .append("g")
                        .attr("class","location")
                        .attr("transform",function(d){
                            //计算标注点的位置
                            var coor = projection([d.log, d.lat]);
                            return "translate("+ coor[0] + "," + coor[1] +")";
                        });

    //插入一个圆
    location.append("circle")
            //.attr("class","location")
            .attr("class" , function(d){ return d.group })
            .attr("r", function(d){ return size(d.size) })
            .style("fill", function(d){ return color(d.group) })
            .attr("stroke", function(d){ return color(d.group) })
            .attr("stroke-width", 0)
            .attr("fill-opacity", .4)
            .on("mouseover", function(d){
                tooltip.html("当前城市：" + d.name)
                        .style("left", d3.event.pageX + 20+ "px")
                        .style("top", d3.event.pageY + 20 + "px")
                        .style("opacity", 1)
                //d3.select(this).transition().duration(150).attr("r", function(d){ return size(d.size)*1.1 })
            })
            .on("mouseout", function(){
                tooltip.style("opacity", 0)
               //d3.select(this).transition().duration(150).attr("r", function(d){ return size(d.size) })
            })
            .on("click", function() {
                console.log("click");
                var cityName = null;
                d3.select(this)
                    .text(
                        function(d){
                            cityName = d.name;
                            return null;
                        }
                    )


                var httpRequest = new XMLHttpRequest();
                httpRequest.open('POST', '../map', true);
                httpRequest.setRequestHeader("Content-type","application/json");
                httpRequest.send(JSON.stringify({"name":cityName}));
                httpRequest.onreadystatechange = function () {
                    if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                        var json = httpRequest.responseText;//获取到服务端返回的数据
//                        console.log(json);
//                        json.
                        var newData = JSON.parse(json);

                        svg.selectAll(".location").data(newData.location)

                    }
                };

                d3.selectAll("circle").transition().duration(150).attr("r", function(d){ return size(d.size)*1})
                            .attr("stroke", function(d){ return color(d.group) })
            .attr("stroke-width", 0)
                d3.select(this).transition().duration(150).attr("r", function(d){ return size(d.size)*1.2})
                            .attr("stroke","white")
            .attr("stroke-width", 2)
                });
 });

  //添加提示框
  var tooltip = d3.select("#body")
                        .append("div")
                        .attr("class", "tooltip")
                        .style("opacity", 0)


function update(){

  // For each check box:
  d3.selectAll("#b").each(function(d){
    cb = d3.select(this);
    grp = cb.property("value")

    // If the box is check, I show the group
    if(cb.property("checked")){
      svg.selectAll("."+grp).transition().duration(1000).style("opacity", 1).attr("r", function(d){ return size(d.size) })

    // Otherwise I hide it
    }else{
      svg.selectAll("."+grp).transition().duration(1000).style("opacity", 0).attr("r", 0)
    }
  })
}

// When a button change, I run the update function
d3.selectAll("#b").on("change",update);

// And I initialize it at the beginning
update()