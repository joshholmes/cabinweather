var http = require('http');
http.createServer(function (req, res) {
  console.log(req.headers);
  req.on('data', function (chunk) {
    console.log('BODY: ' + chunk);

    var sensorData = JSON.parse(chunk);

    console.log("Light: " + sensorData.light);
  });

  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(1337);

console.log('Server running at *:1337/');