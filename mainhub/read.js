var myJson = require("./hourly.json");
// a quick tool showing how to read the stored hourly forecasts

// compare with current time
var epoch = (new Date).getTime() / 1000;

for (var i in myJson) {
  var forecast = myJson[i];
  var forecastEpoch = forecast.FCTTIME.epoch;
  var futureDiff = forecastEpoch - epoch
  var futureHour = Math.floor(futureDiff / 3600);
  if (futureHour < 0 ) {
    // if forecasts are in the past ignore them
    continue;
  }
  // not sure what you want to do with these data - just logging them out here
  console.log( 'in ' + futureHour + ' hours'
    + ' temp: ' + forecast.temp.english
    + ' wind: ' + forecast.wspd.english
    + ' baro: ' + forecast.mslp.english
    + ' humid: ' + forecast.humidity
  );
}
