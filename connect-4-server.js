var express = require('express')
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var port = 3001;

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist/js'));

app.get('/game', function(req, res){
	res.sendFile('public/game.html', {root: __dirname});
});

app.get('/', function(req, res){
	res.sendFile('public/index.html', {root: __dirname});
});

io.on('connection', function(socket){

	socket.emit('sound-off');

	//io.emit('usersUpdate', getUsernames());

	socket.on('join', function(username){
		console.log(username + ' connected');
		socket.username = username;
		//io.emit('usersOnlineUpdate', usersOnline);
		io.emit('usersUpdate', getUsernames())
	})

	socket.on('disconnect', function(){
		console.log('disconnected');
		socket.broadcast.emit('usersUpdate', getUsernames());
	});

	socket.on('sound-off-ack', function(username){
		socket.username = username;
	});

	socket.on('challenge', function(opponent){
		var oppSock = getOpponentSocket(opponent);
		if(oppSock){
			oppSock.emit('challenge', socket.username);
		}
		else{
			console.log("ERROR - could not find opponent socket")
		}
	});

	socket.on('acceptChallenge', function(opponent){
		var oppSock = getOpponentSocket(opponent);
		oppSock.emit('acceptChallenge', socket.username);
	});

	socket.on('declineChallenge', function(opponent){
		console.log('declined ' + opponent);
		var oppSock = getOpponentSocket(opponent);
		if(!oppSock){
			console.log('error');
		}
		oppSock.emit('declineChallenge');
	});

	socket.on('playMove', function(d){
		console.log(d);
		var oppSock = getOpponentSocket(d.opponent);
		oppSock.emit('playMove', d.col);
	});

	socket.on('test', function(){
		var c = findClientsSocket();
		console.log('clients ' + getUsernames());
	})

	socket.on('new', function(){
		console.log('new');
		io.emit('sound-off');
	})
});

server.listen(port, function(){
	console.log('Server started on port ' + port);
});


// http://stackoverflow.com/a/24145381/2956312
function findClientsSocket(roomId, namespace) { 
    var res = []
    , ns = io.of(namespace ||"/");    // the default namespace is "/"

    if (ns) {
        for (var id in ns.connected) {
            if(roomId) {
                var index = ns.connected[id].rooms.indexOf(roomId) ;
                if(index !== -1) {
                    res.push(ns.connected[id]);
                }
            } else {
                res.push(ns.connected[id]);
            }
        }
    }
    return res;
}

function getUsernames(){
	var usernames = [];
	var clients = findClientsSocket();

	for(var i = 0; i < clients.length; i++){
		usernames.push(clients[i].username);
	}

	return usernames;
}

function getOpponentSocket(username){
	var clients = findClientsSocket();
	var oppSock;
	for(var i = 0; i < clients.length; i++){
		if(clients[i].username == username){
			oppSock = clients[i];
		}
	}

	return oppSock;
}