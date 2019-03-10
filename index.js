const localFun = require("./LocalFun");
const express = require("express");
const app = express();
const open = require("open");

(async function(){
  let cityData =  await localFun.loader();
  let population = { lowest: [], biggest: [] };
  let cities = { lowest: [], biggest: [] };
  let temp = [];

  cityData.map(pop => temp.push(pop["Pop"]));
  population["lowest"] = Math.min(...temp);
  population["biggest"] = Math.max(...temp); 
  cities["lowest"] = cityData[temp.indexOf(population["lowest"])]["City"];
  cities["biggest"] = cityData[temp.indexOf(population["biggest"])]["City"];
  let totalSum = temp.reduce((a, b) => a + b);
  let average = Math.round(totalSum / cityData.length);
  
  // creating a basic graphical interface to display the report  
  app.set("view engine", "ejs");
  app.get("/", function(req, res) {
    res.render("index", {
      biggest: population["biggest"],
      lowest: population["lowest"],
      cityNameLowest: cities["lowest"],
      cityNameBiggest: cities["biggest"],
      average: average
    });
  });

  app.listen(process.env.PORT || 8080, function() {
    console.log("Server in now active on Port 8080 ( http://localhost:8080/ )");
    open("http://localhost:8080/");
  });
})();




