const fs = require("fs");
const util = require("util");

function processCvstoJson(filePath) {
  var csv = fs.readFileSync(filePath, "utf8");
  var arrGnenerate = 0;

  var result = { Cities0: [], Population0: [], Chunks: [], Citynum: [] };
  var lines = csv.split("\n");

  for (var i = 1; i < lines.length; i++) {
    var currentline = lines[i].split(",");

    if (currentline[currentline.length - 2] != '""') {
      currentline = currentline.map(head => head.replace(/"|\r|\n|\'/gi, "")); // cleaning up the data 

      if (result[`Cities${arrGnenerate}`].length > 99) {
        arrGnenerate += 1;

        result[`Cities${arrGnenerate}`] = [];
        result[`Population${arrGnenerate}`] = [];
      }

      let num = Number(currentline[9]);

      if (num != "" && isNaN(num) != true) {
        result[`Cities${arrGnenerate}`].push(currentline[1]);
        result[`Population${arrGnenerate}`].push(num);
      }
    } else {
      // Moves on to the next csv line that has the data i want
      continue;
    }
  }

  result["Citynum"] =
    arrGnenerate * 100 - (100 - result[`Cities${arrGnenerate}`].length);
  result["Chunks"] = arrGnenerate;
  // - Write simplified data to a new file.
  fs.writeFileSync(
    "Simplified.json",
    util.inspect(JSON.parse(JSON.stringify(result))),
    "utf-8"
  ); // doing this converts from '' to "" which is now valid to parse);

  return result; // Only returns cities that have population
}

module.exports = {
  processCvstoJson: processCvstoJson
};
