query_str = "http://api.census.gov/data/2014/intltrade/istnaics?get=GEN_VAL_YR,STATE&YEAR=2014&NAICS=3241&CTY_CODE";

var var_name,
	num_data,
	json_data,
	jsonArr=[];

//Accessors that specify the variables
function val(d) {return d.GEN_VAL_YR;};
function state(d) {return d.STATE;};
function year(d) {return d.year;};
function naics(d) {return d.NAICS;};
function cty(d) {return d.CTY_CODE;};

var margin = {top: 19.5, right: 19.5, bottom: 19.5, left: 80},
    width = 1600 - margin.right,
    height = 800 - margin.top - margin.bottom;

var svg = d3.select("#chart").append("svg").attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom).append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



d3.json(query_str, function(data){
	var_name = data[0];
	num_data = data.splice(1,data.length-1);

	for (i=0; i < num_data.length;i++){
			jsonArr.push({
				GEN_VAL_YR: Number(num_data[i][0]),
				STATE: num_data[i][1],
				YEAR: num_data[i][2],
				NAICS: num_data[i][3],
				CTY_CODE: num_data[i][4]
			})
	}
	
	var NY_json = filterJSON(jsonArr,'STATE','TX');

	NY_json2 = NY_json.map(val).sort(d3.ascending);

	

	var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

	var y = d3.scale.linear().domain([NY_json2[0],NY_json2[NY_json2.length-1]])
    .range([height,0]);

    var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

    var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10);



    x.domain(NY_json.map(function(d) { return d.CTY_CODE; }));

	//console.log(NY_json2);
    //console.log(linear_y(NY_json2.GEN_VAL_YR));

  svg.selectAll(".bar").data(NY_json).enter().append("rect").attr("class","bar")
	.attr("x",function(d) {return x(cty(d));})
	.attr("width", 25)
	.attr("y",function(d) {return y(val(d));})
	.attr("height", function(d) { return height - y(val(d)); });

	svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Total Value");

  //test1();
})







function filterJSON(json, key, value) {
    var result = [];
    for (var indicator in json) {
        if (json[indicator][key] === value) {
            result.push(json[indicator]);
        }
    }
    return result;
}