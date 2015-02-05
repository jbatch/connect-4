var COLS = 7;
var ROWS = 6;
var padPercent = 0.055;
var boardCanvas, tokenCanvas;
var boardCtx, tokenCtx;
var h, w;
var p1Score, p2Score;
var xOffset, yOffset;

var following = false;

var token = {
	x: 0,
	y: 0,
	vx: 0,
	vy: 0,
	radius: 20,
	color: 'red',
	draw: function(){
		// console.log('x: ' + this.x + 'y: ' + this.y);
		tokenCtx.beginPath();
		tokenCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
		tokenCtx.closePath();
		tokenCtx.fillStyle = '#000';
		tokenCtx.fill();

		// tokenCtx.fillStyle = '#000';
		// tokenCtx.fillRect(this.x, this.y, 10, 10);
	},
	clear: function(){
		tokenCtx.fillStyle = '#FFF';
		tokenCtx.fillRect(0, 0, w, h);
	}
};

jQuery(document).ready(function(){
	boardCanvas = document.getElementById("boardCanvas");
	boardCanvas.width = $(window).width() * 0.75;
	boardCanvas.height = $(window).height() * 0.5;

	tokenCanvas = document.getElementById("tokenCanvas");
	tokenCanvas.width = $(window).width() * 0.75;
	tokenCanvas.height = $(window).height() * 0.5;

	init();
});

function init() {
	if(boardCanvas.getContext && tokenCanvas.getContext){
		boardCtx = boardCanvas.getContext('2d');
		tokenCtx = tokenCanvas.getContext('2d');

		boardCtx.globalCompositeOperation = 'xor';

		var rect = boardCanvas.getBoundingClientRect();
		xOffset = rect.left;
		yOffset = rect.top;

		h = boardCanvas.height;
		w = boardCanvas.width;

		p1Score = 0;
		p2Score = 0;

		boardCanvas.addEventListener("mousemove", function(e){
			token.clear();
			token.x = e.clientX - xOffset;
			token.y = e.clientY - yOffset;
			token.draw();
		});

		boardCanvas.addEventListener("click", function(e){
			console.log("click");
		});

		boardCanvas.addEventListener("mouseout", function(e){

		});

		tokenCtx.fillStyle = '#000';
		tokenCtx.fillRect(20, 20, 20, 20);

		drawBoard();
	}
	
}

function drawBoard(){
	var len = h > w ? w : h;

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
	boardCtx.font = '20px serif'
	boardCtx.fillText('Player 1: ' + p1Score, 0.1 * w, h - 20);
	boardCtx.fillText('Player 2: ' + p2Score, 0.9 * w - 100, h - 20);
}

function clear(){
	boardCtx.fillStyle = '#FFF';
	boardCtx.fillRect(0, 0, w, h);
}