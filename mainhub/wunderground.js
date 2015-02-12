//var Wunderground = require('wunderground-api');
var Wunderground = require('wundergroundnode');
var fs = require("fs");

var myKey = 'f84a42eeb50f0783';
var client = new Wunderground(myKey);

var opts = '98101';
/*
what wundergroud-api expects for opts
var opts = {
  city:'Seattle',
  state: 'WA'
}
*/

// run once immediatel;y
updateHourlyForecasts();
// loop every 30 min getting most recent hourly forecast
setInterval(updateHourlyForecasts, 30 * 60 * 1000);

function updateHourlyForecasts() {
    client.hourlyForecast().request(opts, function(err, data) {
    if (err) {
      // should update an error log here
      // do not stop executing - try again next time
    }
    else {
      // write the hourly forecasts to a file
      fs.writeFile( "hourly.json", JSON.stringify( data.hourly_forecast ), "utf8" );
    }
  });
}
