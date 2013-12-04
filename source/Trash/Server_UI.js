var fs = require('fs');
var http = require('http');

var express = require('express');
var app = express();

var server = http.createServer(app);

var BinaryServer = require('./node_modules/binaryjs').BinaryServer;
var bs = BinaryServer({server: server});

bs.on('connection', function(client) {
	console.log('connected!');	
});

app.get('/', function(req, res) {
	console.log("GET" + req.path);
	res.sendfile("HalfMoon_UI.html", {root:__dirname});
});

app.get(/^(.+)$/, function(req, res) {
	console.log("GET" + req.path);
	res.sendfile('HalfMoon_src/UI' + req.params[0]); 
});


server.listen(9000);
console.log('HTTP and BinaryJS server started on port 9000');