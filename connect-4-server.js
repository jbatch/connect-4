var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist/js'));

app.get('/game', function(req, res){
	res.sendFile('public/game.html', {root: __dirname});
});

app.get('/', function(req, res){
	res.sendFile('public/index.html', {root: __dirname});
});

var port = 3001;

var server = app.listen(3001, function(){
	console.log('Server started on port ' + port);
});
