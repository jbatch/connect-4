var COLS = 7;
var ROWS = 6;
var padPercent = 0.055;
var boardCanvas, tokenCanvas;
var boardCtx, tokenCtx;
var h, w;
var p1Score, p2Score;

var following = false;

var token = {
	x: 0,
	y: 0,
	vx: 0,
	vy: 0,
	radius: 20,
	color: 'red',
	draw: function(){
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.fillStyle = this.color;
		ctx.fill();
	},
	clear: function(){

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
	if(boardCanvas.getContext){
		boardCtx = boardCanvas.getContext('2d');
		tokenCtx = tokenCanvas.getContext('2d');

		h = boardCanvas.height;
		w = boardCanvas.width;

		p1Score = 0;
		p2Score = 0;

		boardCanvas.addEventListener("mousemove", function(e){

		});

		boardCanvas.addEventListener("click", function(e){

		});

		boardCanvas.addEventListener("mouseout", function(e){

		});

		drawBoard();
	}
	
}

function drawBoard(){
	var len = h > w ? w : h;

	//Draw blue board
	boardCtx.fillStyle = "#0066FF"
	boardCtx.fillRect(w * 0.10, h * 0.10, w * 0.8, h * 0.8);

	//draw holes in board
	boardCtx.fillStyle = "#FFFFFF";
	for(var x = 0; x < COLS; x++){
		for(var y = 0; y < ROWS; y++){
			boardCtx.beginPath();

			boardCtx.arc(0.1 * w + ((0.8 * w) / COLS) * (x + 0.5), //x
				0.1 * h + ((0.8 * h) / ROWS) * (y + 0.5), //y
				padPercent * len,
				0, //startAngle
				Math.PI * 2,//endAngle
				true//annticlockwise
				);

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