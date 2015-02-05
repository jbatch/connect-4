var COLS = 7;
var ROWS = 6;

jQuery(document).ready(function(){
	canvas.width = $(window).width() * 0.75;
	canvas.height = $(window).height() * 0.5;
});

function drawBoard(){
	var canvas = document.getElementById("canvas");

	if(canvas.getContext){
		var ctx = canvas.getContext('2d');

		var h = canvas.height;
		var w = canvas.width;
	
		ctx.fillStyle = "#0066FF"
		ctx.fillRect(w * 0.10, h * 0.10, w * 0.8, h * 0.8);

		ctx.fillStyle = "#FFFFFF";
		for(var x = 0; x < COLS; x++){
			for(var y = 0; y < ROWS; y++){
				ctx.beginPath();

				ctx.arc(0.1 * w + ((0.8 * w) / COLS) * (x + 0.5), //x
					0.1 * h + ((0.8 * h) / ROWS) * (y + 0.5), //y
					30, //radius
					0, //startAngle
					Math.PI * 2,//endAngle
					true//annticlockwise
					);

				ctx.fill();
			}
		}
	}
}