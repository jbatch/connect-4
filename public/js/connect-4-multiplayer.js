var socket;
var username;
var opponentName;

function init(){
	socket = io();
	username = $('#name').val();
	socket.emit('join', {
		username: username,
		status: 'ready'
	});

	socket.on('sound-off', function(){
		socket.emit('sound-off-ack', username);
	})

	socket.on('usersUpdate', function(users){
		console.log('Got user update');
		$('#users').empty();
		for(var i = 0; i < users.length; i++){
			if(users[i].username != username){
				$('#users').append(getUserDiv(users[i].username, 
					users[i].status == 'ready'));
			}
			
		}
		$('#online-count').text('Online: ' + users.length);
	});

	socket.on('challenge', function(opponent){
		showChallengeModal(opponent);
	});

	socket.on('acceptChallenge', function(opponent){
		window.location.replace("game?multiplayer&opponent=" + 
			opponent + '&username=' + username + '&red');
	});

	socket.on('declineChallenge', function(){
		$('#waitingModal').modal('hide');
		$('#declineModal').modal('show');
	});

	if(getQueryVariable('username') != false){
		$('#name').val(getQueryVariable('username'));
		changeName();
	}
}

function getUserDiv(username, ready){
	return "<div class=\"row button-row  \">" +
				"<div class=\"btn btn-success user\"" +
	 			"onclick=\"challenge(this)\" " +
	 			(ready ? "" : " disabled=true") + ">" +
	 			username + 
	 			"</div>" +
	 		"</div>";
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
	socket.emit('declineChallenge', opponentName);
	opponentName = null;
}

function changeName(){
	username = $('#name').val();
	socket.emit('changeName', username);
}


//http://css-tricks.com/snippets/javascript/get-url-variables/
function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}