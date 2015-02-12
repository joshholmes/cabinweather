var sensorData = require('../common/sensorReadings.js');

var request = require('request');
//var serverIP = "http://10.65.18.129";
var serverIP = "http://localhost";

sensorData.light = 10;

console.log(sensorData);

request.post(serverIP + ':1337', {form: JSON.stringify(sensorData)}, 
	function(err,httpResponse,body){ 
		console.log("httpResponse: " + httpResponse);
		console.log("body: " + body);
		console.log("error: " + err);
	});
