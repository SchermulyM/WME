//main sources:
// https://bl.ocks.org/alanvillalobos/14e9f0d80ea6b0d8083ba95a9d571d13
// https://bl.ocks.org/d3noob/bdf28027e0ce70bd132edc64f1dd7ea4
//(https://d3indepth.com/)
// https://bl.ocks.org/mbostock/4403522
// https://bl.ocks.org/mbostock/3808218
// https://bl.ocks.org/syncopika/f1c9036b0deb058454f825238a95b6be


//evt listener
function bar_evtlistener(e){
  console.log(e.__data__.name)
}

// selection box
const select1 = $("#chart1_select");
select1.on("change", () => {
  $.ajax({url: '/items', success: data => {update_barchart(data, "#chart1", select1.val())}});
});
const select2 = $("#chart2_select");
select2.on("change", () => {
  $.ajax({url: '/items', success: data => {update_barchart(data, "#chart2", select2.val())}});
});
$.ajax({
  url: "/properties",
  success: (data) => {
    select1.innerHTML = "";
    for (const d of data){
      if (d === "name") {continue;}
      select1.append('<option>'+d+'</option>');
    }
    //select1.change();
  }
})
$.ajax({
  url: "/properties",
  success: (data) => {
    select2.innerHTML = "";
    for (const d of data){
      if (d === "name") {continue;}
      select2.append('<option>'+d+'</option>');
    }
    //select2.change();
  }
})

var margin = { top: 20, right: 20, bottom: 30, left: 20 },
    width = 500,
    height = 150;

// set the ranges
var x = d3.scaleBand()
.range([0, width])
.padding(0.1);
var y = d3.scaleLinear()
.range([height, 0]);

function init_barchart(data, chart_id){

    // append the svg object to the body of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select(chart_id).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    // Scale the range of the data in the domains
    x.domain(data.map(function(d) { return d.name; }));
    y.domain([0, d3.max(data, function(d) { return d.id; })]);

    // append the rectangles for the bar chart
    svg.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.name); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d.id); })
        .attr("height", function(d) { return height - y(d.id); })
        .attr("onmouseover", "bar_evtlistener(this)");

    // add the x Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
      .selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("transform", "rotate(90)")
        .style("text-anchor", "start");

    // add the y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y));

    // svg.append("text")
    //   .attr("transform", "rotate(-90)")
    //   .attr("y", 6)
    //   .attr("dy", "0.71em")
    //   .attr("text-anchor", "end")
    //   .text("value");
}

function update_barchart(data, chart_id, property_name) {
  // d3 update pattern:
  //  join new data to existing chart
  //  update existing elements
  //  update new elements as needed
  //  merge old and new elements

  // DATA JOIN
  var svg = d3.select(chart_id).select('svg'),
      bars = svg.selectAll(".bar").data(data);

  // update
  bars.attr("update", "true");
  y.domain([0, d3.max(data, function(d) { return d[property_name]; })]);
  // svg.select(".y axis").call(d3.axisLeft(y));
  svg.selectAll(".y").call(d3.axisLeft(y));

  // update new elements

  // update both
  // update the rectangles for the bar chart
  bars.append("rect")
      .enter()
      .merge(bars)
      .attr("y", function(d) { return y(d[property_name]); })
      .attr("height", function(d) { return height - y(d[property_name]); })


  svg.exit()
   .remove();
}

$.ajax({url: '/items', success: data => {init_barchart(data, "#chart1"); init_barchart(data, "#chart2")}})
// init_barchart(csvData, "#chart1")
// init_barchart(csvData, "#chart2")

// update_barchart(csvData, "#chart1", "birth_rate_per_1000")
// update_barchart(csvData, "#chart2", "children_per_woman")
