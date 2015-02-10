var socket;
var username;
var opponentName;

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

	socket.on('challenge', function(opponent){
		console.log('You have been challenged by ' + opponent);
		showChallengeModal(opponent);
	});

	socket.on('acceptChallenge', function(opponent){
		console.log('challenge accepted');
		window.location.replace("game?multiplayer&opponent=" + 
			opponent + '&username=' + username + '&red');
	});

	socket.on('declineChallenge', function(){
		console.log('declined');
		$('#waitingModal').modal('hide');
		$('#declineModal').modal('show');
	});
}

function getUserDiv(username){
	return "<div class=\"row\"><div class=\"btn btn-success user\" onclick=\"challenge(this)\">" + username + "</div></div>";
}

function challenge(opponent){
	socket.emit('challenge', opponent.innerHTML);
	$('#waitingModal').modal('show');
}

function showChallengeModal(opponent){
	opponentName = opponent;
	$('#challengeText').text('You have been challenged by ' + opponent);
	$('#challengeModal').modal('show');
}

function acceptChallenge(){
	socket.emit('acceptChallenge', opponentName);
	window.location.replace("game?multiplayer&opponent=" + opponentName
	 + '&username=' + username);
}

function declineChallenge(){
	console.log(opponentName)
	socket.emit('declineChallenge', opponentName);
	opponentName = null;
}

function changeName(){
	username = $('#name').val();
	socket.emit('changeName', username);
}

function test(){
	socket.emit('test');
}

function newa(){
	socket.emit('new');
}