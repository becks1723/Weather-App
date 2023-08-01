'use strict';

//React Components For Lab7 (Data visualization)
function visualButtons(props) {
  const [pressed, setPressed] = React.useState(false);

  if(pressed) {
    setPressed(false);
  }

  return React.createElement(
    'button',
    {
      onClick: () => displayVisuals(props.function),
      className: 'btn btn-primary',
    },
    props.element
  );
}

var buttons = "generate graph";
const rootNode1 = document.getElementById("visualbutton1");
const root1 = ReactDOM.createRoot(rootNode1);
root1.render(React.createElement(visualButtons, {element: buttons, function: 'getTemp'}))
const rootNode2 = document.getElementById("visualbutton2");
const root2 = ReactDOM.createRoot(rootNode2);
root2.render(React.createElement(visualButtons, {element: buttons, function: 'getWorld'}))


//Grabbing the data from the database to display in the graphs
async function displayVisuals(visual) {
//add /node for 
  var allData;
  await fetch("/node/db", {method: "GET"})
  .then((res) => res.json())
  .then(data => {allData = data;});
  if(visual == 'getTemp') {
    console.log(allData);
    getTemperatures(allData);
  }
  if (visual == 'getWorld') {
    getWorldLocations(allData);

  }
}
function getTemperatures(allData) {
    var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3.select("#reactvisual1")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

  // Parse the Data
    // Add X axis
    var x = d3.scaleLinear()
    .domain([-90, 90])
    .range([ 0, width ]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([-180, 180])
    .range([ height, 0]);
  svg.append("g") 
    .call(d3.axisLeft(y));

  // Add dots
  svg.append('g')
    .selectAll("dot")
    .data(allData)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d.latitude); } )
      .attr("cy", function (d) { return y(d.longitude); } )
      .attr("r", 1.5)
      .style("fill", "#69b3a2")
}


function getWorldLocations(allData) {
  // The svg
  var margin = {top: 30, right: 30, bottom: 30, left: 50},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#reactvisual2")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// get the data
  // add the x Axis
  var x = d3.scaleLinear()
            .domain([-10, 100])
            .range([0, width]);
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // add the y Axis
  var y = d3.scaleLinear()
            .range([height, 0])
            .domain([0, 0.03]);
  svg.append("g")
      .call(d3.axisLeft(y));

  // Compute kernel density estimation
  var kde = kernelDensityEstimator(kernelEpanechnikov(7), x.ticks(300))
  var density =  kde( allData.map(function(d){return d.temperature; }) )

  // Plot the area
  svg.append("path")
      .attr("class", "mypath")
      .datum(density)
      .attr("fill", "#69b3a2")
      .attr("opacity", ".8")
      .attr("stroke", "#000")
      .attr("stroke-width", 1)
      .attr("stroke-linejoin", "round")
      .attr("d",  d3.line()
        .curve(d3.curveBasis)
          .x(function(d) { return x(d[0]); })
          .y(function(d) { return y(d[1]); })
      );

};


// Function to compute density
function kernelDensityEstimator(kernel, X) {
  return function(V) {
    return X.map(function(x) {
      return [x, d3.mean(V, function(v) { return kernel(x - v); })];
    });
  };
}
function kernelEpanechnikov(k) {
  return function(v) {
    return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
  };
}


