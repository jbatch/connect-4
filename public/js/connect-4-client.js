var COLS = 7;
var ROWS = 6;
var padPercent = 0.055;
var boardCanvas, tokenCanvas;
var boardCtx, tokenCtx;
var h, w;
var redScore, yellowScore;
var redName = 'Red', yellowName = 'Yellow';
var xOffset, yOffset;

var following = true;
var animating = false;
var animationTimer;

//For Multiplayer
var multiplayer;
var playerColor;
var socket;
var opponentName;
var username;

var token = {
	x: 0,
	y: 0,
	vx: 0,
	vy: 0,
	radius: 30,
	color: 'Red',
	distanceToFall: 0,
	draw: function(){
		tokenCtx.beginPath();
		tokenCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
		tokenCtx.closePath();
		tokenCtx.fillStyle = this.color;
		tokenCtx.fill();
	},
	clear: function(){
		tokenCtx.fillStyle = '#FFF';
		tokenCtx.fillRect(0, 0, w, h);
	},
	changeColor: function(){
		this.color = this.color == 'Red' ? 'Yellow' : 'Red';
	}
};

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

function init() {
	boardCanvas = document.getElementById("boardCanvas");
	boardCanvas.width = 900;
	boardCanvas.height = Math.min(717, $(window).height() * 0.6);

	tokenCanvas = document.getElementById("tokenCanvas");
	tokenCanvas.width = 900;
	tokenCanvas.height = Math.min(717, $(window).height() * 0.6);

	multiplayer = getQueryVariable('multiplayer') != false;

	if(multiplayer){
		opponentName = getQueryVariable('opponent');
		playerColor = getQueryVariable('red') != false ? 'Red' : 'Yellow';
		redName = playerColor == 'Red' ? 'You' : opponentName;
		yellowName = playerColor == 'Red' ? opponentName : 'You';
		username = getQueryVariable('username');
		socket = io();

		socket.emit('join', {
			username: username,
			status: 'busy'
		});

		socket.on('playMove', function(col){
			playMove(col);
		});

		$('#title').attr("href", "/?username=" + username);
	}

	if(boardCanvas.getContext && tokenCanvas.getContext){
		boardCtx = boardCanvas.getContext('2d');
		tokenCtx = tokenCanvas.getContext('2d');

		boardCtx.globalCompositeOperation = 'xor';

		var rect = boardCanvas.getBoundingClientRect();
		xOffset = rect.left;
		yOffset = rect.top;

		h = boardCanvas.height;
		w = boardCanvas.width;

		redScore = 0;
		yellowScore = 0;

		boardCanvas.addEventListener("mousemove", function(e){
			if(token.color == playerColor || !multiplayer){
				if(following && ! gameOver){
					token.clear();
					token.x = e.clientX - xOffset;
					token.y = e.clientY - yOffset;
					token.draw();
				}
			}
		});

		boardCanvas.addEventListener("click", function(e){
		if(!animating){
			if(!gameOver){
				if(playerColor == token.color || !multiplayer){
					animating = true;
					//determine where they are clicking
					var clickX = e.clientX - xOffset - 0.1 * w;
					var clickY = e.clientY - yOffset - 0.1 * h;
					var col = Math.ceil(clickX / ((0.8 * w) / COLS)) - 1;
					playMove(col);
					if(multiplayer){
						socket.emit('playMove', {
							opponent: opponentName,
							col: col
						});
					}
				}
			}
			else{
				clear();
				token.clear();
				drawBoard();
				restart();
				following = true;
				gameOver = false;
			}
		}
	});
		drawBoard();
	}
	
}

function drawBoard(){
	var len = h > w ? w : h;
	token.radius = padPercent * len;

	//Draw blue board
	boardCtx.fillStyle = "#0066FF"
	boardCtx.fillRect(w * 0.10, h * 0.10, w * 0.8, h * 0.8);

	//draw holes in board
	boardCtx.fillStyle = "rgba(255, 255, 255, 1)";
	for(var x = 0; x < COLS; x++){
		for(var y = 0; y < ROWS; y++){
			boardCtx.beginPath();

			boardCtx.arc(0.1 * w + ((0.8 * w) / COLS) * (x + 0.5), //x
				0.1 * h + ((0.8 * h) / ROWS) * (y + 0.5), //y
				padPercent * len,
				0, //startAngle
				Math.PI * 2,//endAngle
				false//annticlockwise
				);
			boardCtx.closePath();
			boardCtx.fill();
		}
	}

	//draw Player scores
	boardCtx.fillStyle = '#000';
	boardCtx.font = '20px serif';
	boardCtx.fillText(redName + ': ' + redScore, 0.1 * w, h - 20);
	boardCtx.fillText(yellowName + ': ' + yellowScore, 0.9 * w - 100, h - 20);
}

function clear(){
	boardCtx.clearRect(0, 0, w, h);
}

function dropToken(col, row){
	following = false;
	token.clear();
	token.x = 0.1 * w + ((0.8 * w) / COLS) * (col + 0.5);
	token.y = -20;
	token.distanceToFall = 0.1 * h + ((0.8 * h) / ROWS) * (row + 0.5) - token.y;
	animationTimer = setInterval(animateToken, 10);
}

function animateToken(){
	if(token.distanceToFall > 0){
		token.clear();
		if(token.distanceToFall < 10){
			token.y += token.distanceToFall;
			token.distanceToFall = 0;
		}
		else{
			token.y += 10;
			token.distanceToFall -= 10;
		}
		
		token.draw();
	}
	else{
		clearTimeout(animationTimer);
		boardCtx.beginPath();
		boardCtx.arc(token.x, token.y, token.radius, 0, Math.PI * 2, true);
		boardCtx.closePath();
		boardCtx.fillStyle = token.color;
		boardCtx.fill();

		token.changeColor();
		following = true;
		animating = false;
	}
}

function drawWinnerName(player){
	boardCtx.font = '40px serif';
	boardCtx.fillStyle = '#000';
	var winner = player == "Red" ? redName : yellowName;
	boardCtx.fillText(winner + " win!", w / 2 - 50, 0.05 * h);
}












