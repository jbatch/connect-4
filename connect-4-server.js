var express = require('express');
var server = express();
var http = require('http').Server(server);

server.use(express.static(__dirname + '/public'));

server.get('/', function(req, res){
	res.sendFile(__dirname + '/public/index.html');
});

http.listen(3000, function(){
	console.log('listening on port 3000');
});