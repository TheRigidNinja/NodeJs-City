const fs = require("fs");
const csv = require("csvtojson");
const util = require("util");

async function loader(){
  const promise = new Promise((resolve,reject)=>{
    csv().fromFile("worldcities.csv").then((jsonObj)=>{

      for (let i = 0; i < jsonObj.length; i++) {
        if (Number(jsonObj[i]["population"].replace(/\s/g,'')) &&
        isNaN(jsonObj[i]["population"].replace(/\s/g,'')) == false &&
        Number(jsonObj[i]["population"].replace(/\s/g,'')) != undefined &&
        jsonObj[i]["city"].replace(/\s/g,'') !=""){
          jsonObj[i] = {
            "City":jsonObj[i]["city"],
            "Pop":Number(jsonObj[i]["population"])
          };
        }else{
          delete jsonObj[i]
        }
      }
      // Remove all nulls
      let formatedJson = JSON.stringify(jsonObj).replace(/null,/g,"");
      fs.writeFileSync("Simplified.json",formatedJson,"utf-8");

      resolve(JSON.parse(formatedJson));
    })
  })

  return await promise;
}

module.exports = {
  loader: loader
};
