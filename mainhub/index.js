//require('./wunderground.js');

var mraa = require("mraa"); // A new object of class "mraa"
// Load i2clcd module
var LCD = require('jsupm_i2clcd');
//Grove Temperature module, plugged into Analog pin 0
var temperature = new mraa.Aio(0);

var date = new Date();
//Initialize Jhd1313m1 at 0x62 (RGB_ADDRESS) and 0x3E (LCD_ADDRESS) 
var myLcd = new LCD.Jhd1313m1(0, 0x3E, 0x62);
myLcd.setColor(64,255,64);

setInterval(function() {
	myLcd.setCursor(0,0);
	myLcd.write(getDateTime()); // doesn't work for some reason
	tempDisplay();
},1000);


var B = 3975;
var clearString = "                "; // Will be called when we want to clear a line on the LCD

function tempDisplay()
{
	var fahrenheit_temperature = getTemp();  // ask for the temperature
	myLcd.setCursor(1,0);
	myLcd.setCursor(1,0);
	var val = "F: " + parseInt(fahrenheit_temperature*100,10)/100;
	myLcd.write(fixedLengthString(val));  // This shows the temperature to 2 decimal places
	setTimeout(tempDisplay,1000);  // ... every second
}

function getTemp()
{
	var a = temperature.read();

	var resistance = (1023 - a) * 10000 / a; // get the resistance of the sensor;
	var celsius_temperature = 1 / (Math.log(resistance / 10000) / B + 1 / 298.15) - 273.15; // convert to temperature, based on Grove's datasheet
	var fahrenheit_temperature = (celsius_temperature * (9 / 5)) + 32; // convert to fahrenheit

	return fahrenheit_temperature; // return the temperature
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

var screenWidth = 16;
function fixedLengthString(var string) {
    return String.format("%1$"+screenWidth+ "s", string);
}