const express = require('express');
const request = require('request');
const normalizePort = require('normalize-port');

const port          = normalizePort(process.env.PORT || 3001);
const openHABserver = "http://127.0.0.1:8080/rest/items/";
const WUserver      = "https://rtupdate.wunderground.com";
const PWSURI        = "/weatherstation/updateweatherstation.php";
const updatedelay   = 1; //can be used to reduce openHAB update interval

const app = express();
var loop = 0;

app.get(PWSURI, (req, response) => {

   //weatherstation/updateweatherstation.php?ID=YYYYYYYY&PASSWORD=XXXXXX&tempf=70.7&humidity=41&dewptf=45.9&windchillf=70.7&winddir=268&windspeedmph=0.00&windgustmph=0.00&rainin=0.00&dailyrainin=0.00&weeklyrainin=0.00&monthlyrainin=0.00&yearlyrainin=0.00&solarradiation=0.00&UV=0&indoortempf=69.8&indoorhumidity=40&baromin=28.94&lowbatt=0&dateutc=2018-12-25%206:40:24&softwaretype=WH2600GEN_V2.2.5&action=updateraw&realtime=1&rtfreq=5
   //console.log(WUserver + req.originalUrl);

   request(WUserver + req.originalUrl, { method: "GET" }, (err, res, body) => {
      if (err) {
         return console.log(err);
      }
      
      response.send("success");

      if ( (loop == 0) ) {
         if ( (req.query.tempf!=undefined) && (req.query.humidity!=undefined) ) {
            const tempf    = parseFloat(req.query.tempf);
            const humidity = parseFloat(req.query.humidity);
            // https://www.wpc.ncep.noaa.gov/html/heatindex_equation.shtml
            if ( tempf>=80.0 ) {
               var heatindex = -42.379 + 2.04901523*tempf + 10.14333127*humidity - 0.22475541*tempf*humidity - 0.00683783*tempf*tempf - 0.05481717*humidity*humidity + 0.00122874*tempf*tempf*humidity + 0.00085282*tempf*humidity*humidity - 0.00000199*tempf*tempf*humidity*humidity;

               if ( humidity <= 13.0 && tempf >= 80.0 && tempf <= 112.0) {
                  heatindex -= ((13.0 - humidity)/4.0) * (Math.sqrt(17.0-Math.abs(tempf-95.0)/17.0));
               } else if (humidity >= 85.0 && tempf >= 80.0 && tempf <= 87.0) {
                  heatindex += ((humidity - 85.0)/10.0)*((87.0-tempf)/5.0);
               }
            }
            else
            {
               var heatindex = undefined;
            }
         }

         var date = new Date(req.query.dateutc + " UTC");
         date.setHours(date.getHours()+1);
         
         // Unit conversion is done within openHAB using QuantityType
         const WH2600 = [
            ["WH2600_Temperature", req.query.tempf, "°F"],
            ["WH2600_Humidity", req.query.humidity],
            ["WH2600_DewPoint", req.query.dewptf, "°F"],
            ["WH2600_WindChill", req.query.windchillf, "°F"],
            ["WH2600_HeatIndex", heatindex, "°F"],
            ["WH2600_WindDirection2", req.query.winddir],
            ["WH2600_WindSpeed", req.query.windspeedmph, "mph"],
            ["WH2600_WindGust", req.query.windgustmph, "mph"],
            ["WH2600_RainH", req.query.rainin, "in"],
            ["WH2600_RainD", req.query.dailyrainin, "in"],
            ["WH2600_RainW", req.query.weeklyrainin, "in"],
            ["WH2600_RainM", req.query.monthlyrainin, "in"],
            ["WH2600_RainY", req.query.yearlyrainin, "in"],
            ["WH2600_SolarRadiation", req.query.solarradiation],
            ["WH2600_UV", req.query.UV],
            ["WH2600_Indoor_Temperature", req.query.indoortempf, "°F"],
            ["WH2600_Indoor_Humidity", req.query.indoorhumidity],
            ["WH2600_Pressure", req.query.baromin],
            ["WH2600_LowBat", (req.query.lowbatt=="0") ? "OFF":"ON"],
            ["WH2600_SoftwareType", req.query.softwaretype],
            ["WH2600_Date", date.toJSON().replace("Z", "+0100")],
            ["WH2600_Action", req.query.action],
            ["WH2600_RealTime", (req.query.realtime=="0") ? "OFF":"ON"],
            ["WH2600_RTFreq", req.query.rtfreq],
            ["WH2600_PWSState", (body==undefined) ? body:body.trim()],
            ["WH2600_PWSError", (err==undefined) ? err:err.trim()],
            ["WH2600_Station", req.query.ID]
         ];

         //console.log('-------------------------------------');
         WH2600.forEach(function(value, index, item) {
            // console.log(value[0] + " = " + ((value[1]==undefined) ? "" : value[1] + ((value[2]==undefined) ? "" : " " + value[2])) );
            if ( value[1]!=undefined ) {
               request(openHABserver + value[0], { method: "POST", headers: { "content-type" : "text/plain" }, body: value[1] + ((value[2]==undefined) ? "" : value[2]) }, (err, res, body) => {
                  if (err) {
                     return console.log(err);
                  }
               })
            }
         })
      }
      loop = (loop+1) % updatedelay;
   })
     /*
     console.log(body.url)
     console.log(body.explanation)
     */
})

app.listen(port, (err) => {
   if (err) {
      return console.log('Something bad happened', err)
   }

   console.log('Server is listening on ' + port)
})