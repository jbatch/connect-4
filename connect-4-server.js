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


	socket.on('join', function(user){
		socket.username = user.username;
		socket.status = user.status;
		io.emit('usersUpdate', getUsers())
	})

	socket.on('changeName', function(username){
		socket.username = username;
		io.emit('usersUpdate', getUsers());
	});

	socket.on('disconnect', function(){
		socket.broadcast.emit('usersUpdate', getUsers());
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
			//Error
		}
	});

	socket.on('acceptChallenge', function(opponent){
		var oppSock = getOpponentSocket(opponent);
		oppSock.emit('acceptChallenge', socket.username);
	});

	socket.on('declineChallenge', function(opponent){
		var oppSock = getOpponentSocket(opponent);
		if(!oppSock){
			//Error
		}
		oppSock.emit('declineChallenge');
	});

	socket.on('playMove', function(d){
		var oppSock = getOpponentSocket(d.opponent);
		oppSock.emit('playMove', d.col);
	});
});

server.listen(port, function(){
	console.log('listening on port ' + port)
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

function getUsers(){
	var usernames = [];
	var clients = findClientsSocket();

	for(var i = 0; i < clients.length; i++){
		usernames.push({
			username: clients[i].username,
			status: clients[i].status
		});
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