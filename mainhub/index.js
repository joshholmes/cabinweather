require('./wunderground.js');
var sensorReadings = require('../common/sensorReadings.js');

var mraa = require("mraa"); // A new object of class "mraa"
// Load i2clcd module
var LCD = require('jsupm_i2clcd');
//Grove Temperature module, plugged into Analog pin 0
var temperature = new mraa.Aio(0);
//Grove light module, plugged into Analog pin 1
var light = new mraa.Aio(1);

var button = new mraa.Gpio(8);
var wbutton = new mraa.Gpio(4);


var date = new Date();
//Initialize Jhd1313m1 at 0x62 (RGB_ADDRESS) and 0x3E (LCD_ADDRESS) 
var myLcd = new LCD.Jhd1313m1(0, 0x3E, 0x62);
myLcd.setColor(64,255,64);

var listOfStuffToDisplay = [];
var listOfWundergroundToDisplay = [];

listOfStuffToDisplay["local"] = sensorReadings;

var http = require('http');
http.createServer(function (req, res) {
  req.on('data', function (chunk) {
    console.log('BODY: ' + chunk);

    var sensorData = JSON.parse(chunk);
	listOfStuffToDisplay["remote"] = sensorData;

    console.log("Light: " + listOfStuffToDisplay["remote"].light);
  });


  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(1337);
console.log('Server running *:1337/');

var currentIndexToDisplay = 0;
var currentIndexOfWundergroundToDisplay = 0;

var readingButton = false;
setInterval(function() {
	if (!readingButton) {
		readingButton = true;
		if (button.read()) {
			currentIndexToDisplay++;
			if (currentIndexToDisplay >= Object.keys(listOfStuffToDisplay).length) {
				currentIndexToDisplay = 0;
			}
			console.log('displaying: ' + currentIndexToDisplay + " of " + Object.keys(listOfStuffToDisplay).length)
		}
		readingButton = false;
	}
},100);

setInterval(function() {
	if (!readingButton) {
		readingButton = true;
		if (wbutton.read()) {
			currentIndexOfWundergroundToDisplay++;
			if (currentIndexOfWundergroundToDisplay >= Object.keys(listOfWundergroundToDisplay).length) {
				currentIndexOfWundergroundToDisplay = 0;
			}
			console.log('displaying: ' + currentIndexOfWundergroundToDisplay + " of " + Object.keys(listOfWundergroundToDisplay).length)
		}
		readingButton = false;
	}
},100);


setInterval(function() {
	var key = Object.keys(listOfWundergroundToDisplay)[currentIndexOfWundergroundToDisplay];
	var sr = listOfWundergroundToDisplay[key];
//	console.log("Displaying " + key);

	myLcd.setCursor(0,0);
	myLcd.write(getWundergroundDisplayString(sr)); 
	displayReadings();
},1000);

function displayReadings()
{
	updateLocal();

	var key = Object.keys(listOfStuffToDisplay)[currentIndexToDisplay];
	var sr = listOfStuffToDisplay[key];
	console.log("Displaying " + key);

	myLcd.setCursor(1,0);
	myLcd.setCursor(1,0);
	myLcd.write(getDisplayString(sr));
}

function getDisplayString(sr) {
	var val = "";
	val += sr.where + " ";
	val += "F: " + sr.temperature;
	val += " ";
	val += sr.light;

	return fixedLengthString(val);
}

function getWundergroundDisplayString(sr) {
	var val = "+";
	val += sr.hour + " ";
	val += "F" + sr.temperature;
	val += " W" + sr.wind;
	val += " B" + sr.baro;

	return fixedLengthString(val);
}

function updateLocal() {
	listOfStuffToDisplay["local"].where = "I";
	listOfStuffToDisplay["local"].temperature = getTemp();
	listOfStuffToDisplay["local"].light = getLight();
}

function updateWeatherUnderground() {
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

	  var readings = {};
	  readings.hour = futureHour;
	  readings.temperature = forecast.temp.english;
	  readings.wind = forecast.wspd.english;
	  readings.baro = forecast.mslp.english;

	  listOfWundergroundToDisplay[futureHour] = readings;

	  // not sure what you want to do with these data - just logging them out here
	  console.log( 'in ' + futureHour + ' hours'
	    + ' temp: ' + forecast.temp.english
	    + ' wind: ' + forecast.wspd.english
	    + ' baro: ' + forecast.mslp.english
	    + ' humid: ' + forecast.humidity
	  );
	}
}

setTimeout(function{
	setInterval(function() {
		updateWeatherUnderground();
	}, 10000);
}, 10000);

var B = 3975;
function getTemp()
{
	var a = temperature.read();

	var resistance = (1023 - a) * 10000 / a; // get the resistance of the sensor;
	var celsius_temperature = 1 / (Math.log(resistance / 10000) / B + 1 / 298.15) - 273.15; // convert to temperature, based on Grove's datasheet
	var fahrenheit_temperature = (celsius_temperature * (9 / 5)) + 32; // convert to fahrenheit

	return parseInt(fahrenheit_temperature*100,10)/100
}

function getLight()
{
	var a = light.read();

	return a; // return the light
}


function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return hour + ":" + min + ":" + sec + " " + year + ":" + month + "/" + day;
}

var clearString = "                "; //used to make sure that LCD is cleared.  
function fixedLengthString(string) {
    return (string + clearString).substring(0, 16);
}