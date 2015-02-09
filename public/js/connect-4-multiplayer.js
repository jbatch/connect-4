var socket;
var username;

function init(){
	socket = io();
	username = $('#name').val();
	socket.emit('join', username);

	socket.on('sound-off', function(){
		console.log('sound-off')
		socket.emit('sound-off-ack', username);
	})

	socket.on('usersUpdate', function(users){
		console.log(users);
		$('#users').empty();
		for(var i = 0; i < users.length; i++){
			if(users[i] != username){
				$('#users').append(getUserDiv(users[i]));
			}
			
		}
		$('#online-count').text('Online: ' + users.length);
	});
}

function getUserDiv(username){
	return "<div class=\"row\"><div class=\"btn btn-success user\" onclick=\"challenge(this)\">" + username + "</div></div>";
}

function challenge(opponent){
	socket.emit('challenge', opponent.innerHTML);
}

function test(){
	socket.emit('test');
}

function newa(){
	socket.emit('new');
}