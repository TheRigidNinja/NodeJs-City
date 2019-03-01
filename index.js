const open = require("open");
const express = require("express");
const localFun = require("./LocalFun");
const app = express();

var result = localFun.processCvstoJson("./worldcities.csv");

var totalCitiesNum = result["Citynum"],
  totalSum = null,
  population = { small: [], large: [] };
cities = { small: [], large: [] };

// this for loop is used to combined chunks of data array data
for (let i = 0; i < result["Chunks"] - 1; i++) {
  totalSum += result[`Population${i}`].reduce((a, b) => a + b);
  let small = Math.min(...result[`Population${i}`]);
  let large = Math.max(...result[`Population${i}`]);

  population["small"].push(small);
  population["large"].push(large);
  cities["small"].push(
    result[`Cities${i}`][result[`Population${i}`].indexOf(small)]
  );
  cities["large"].push(
    result[`Cities${i}`][result[`Population${i}`].indexOf(large)]
  );
}

var average = Math.round(totalSum / totalCitiesNum);
var smallestPopulation = Math.min(...population["small"]);
var largestPopulation = Math.max(...population["large"]);
var cityBname = cities["large"][population["large"].indexOf(largestPopulation)];
var citySname =
  cities["small"][population["small"].indexOf(smallestPopulation)];

// creating a basic graphical interface to display the report  
app.set("view engine", "ejs");
app.get("/", function(req, res) {
  res.render("index", {
    largest: largestPopulation,
    smallest: smallestPopulation,
    cityBname: cityBname,
    citySname: citySname,
    average: average
  });
});

app.listen(process.env.PORT || 8080, function() {
  console.log("Server in now active on Port 8080 ( http://localhost:8080/ )");
  open("http://localhost:8080/");
});
