//require('./wunderground.js');
var sensorReadings = require('../common/sensorReadings.js');

var mraa = require("mraa"); // A new object of class "mraa"
// Load i2clcd module
var LCD = require('jsupm_i2clcd');
//Grove Temperature module, plugged into Analog pin 0
var temperature = new mraa.Aio(0);
//Grove light module, plugged into Analog pin 1
var light = new mraa.Aio(1);

var button = new mraa.Gpio(8);


var date = new Date();
//Initialize Jhd1313m1 at 0x62 (RGB_ADDRESS) and 0x3E (LCD_ADDRESS) 
var myLcd = new LCD.Jhd1313m1(0, 0x3E, 0x62);
myLcd.setColor(64,255,64);

var listOfStuffToDisplay = [];

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

setInterval(function() {
	myLcd.setCursor(0,0);
	myLcd.write(fixedLengthString(getDateTime())); 
	displayReadings();
},1000);

var currentIndexToDisplay = 0;
setInterval(function() {
	if (button.read()) {
		currentIndexToDisplay++;
		if (currentIndexToDisplay > listOfStuffToDisplay.length) {
			currentIndexToDisplay = 0;
		}
		console.log('displaying: ' + currentIndexToDisplay)
	}
},100);

function displayReadings()
{
	updateLocal();

	var sr = listOfStuffToDisplay["local"];

	myLcd.setCursor(1,0);
	myLcd.setCursor(1,0);
	myLcd.write(getDisplayString(sr));
}

function getDisplayString(sr) {
	var val = "F: " + sr.temperature;
	val += " ";
	val += sr.light;

	return fixedLengthString(val);
}

function updateLocal() {
	listOfStuffToDisplay["local"].temperature = getTemp();
	listOfStuffToDisplay["local"].light = getLight();
}

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