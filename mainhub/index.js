//require('./wunderground.js');

//var LCD = require('jsupm_i2clcd');

// Load i2clcd module
var LCD = require('jsupm_i2clcd');
//Initialize Jhd1313m1 at 0x62 (RGB_ADDRESS) and 0x3E (LCD_ADDRESS) 
var myLcd = new LCD.Jhd1313m1(0, 0x3E, 0x62);
myLcd.setColor(64,255,64);
setTimeout(function() {
	console.log("Attempting to say hi");
	myLcd.setCursor(0,0);
	myLcd.write('Hello World'); // doesn't work for some reason
	console.log("Done saying hi");
},1000);
