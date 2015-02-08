var board = [[],[],[],[],[],[],[]];
var gameOver = false;

function restart(){
	for(var i = 0; i < 7; i++){
		for(var j = 0; j < 6; j++){
			board[i][j] = '-';
		}
	}
}

function playMove(col){
	console.log('playMove');
	if(col > -1 && col < 7){
		var row = getTopRow(col);
		if(row != -1){
			board[col][row] = token.color[0];
			dropToken(col, row);
			if(checkWin(col, row)){
				if(token.color == "Red"){
					p1Score++;
				}
				else{
					p2Score++;
				}
				console.log('win!');
				gameOver = true;
				drawWinnerName(token.color);
			}
		}
	}
}

function getTopRow(col){
	var top = -1;
	var i = 5;
	var found = false;
	while(i >= 0 && !found){
		if(board[col][i] == '-'){
			found = true;
			top = i;
		}
		else{
			i--;
		}
	}

	return top;
}

function checkWin(col, row){
	console.log('checkWin');
	var win = false;
	var inARow = 1;

	//check check diag /
	inARow += checkLine(-1, 1, col, row);
	inARow += checkLine(1, -1, col, row);
	if(inARow >= 4){
		win = true;
	}
	else{
		console.log('inARow: ' + inARow);
		inARow = 1
	}
	//check diag \
	inARow += checkLine(-1, -1, col, row);
	inARow += checkLine(1, 1, col, row);
	if(inARow >= 4){
		win = true;
	}
	else{
		console.log('inARow: ' + inARow);
		inARow = 1
	}
	//check left/right
	inARow += checkLine(-1, 0, col, row);
	inARow += checkLine(1, 0, col, row);
	if(inARow >= 4){
		win = true;
	}
	else{
		console.log('inARow: ' + inARow);
		inARow = 1
	}
	//check up/down
	inARow += checkLine(0, 1, col, row);
	inARow += checkLine(0, -1, col, row);
	if(inARow >= 4){
		win = true;
	}
	else{
		console.log('inARow: ' + inARow);
		inARow = 1
	}

	return win;
}

function checkLine(dx, dy, startX, startY){
	var found = 0;
	var x = startX;
	var y = startY;
	var next;
	do{
		try{
			x += dx;
			y += dy
			next = board[x][y];
			if(next == token.color[0]){
				found++;
			}
		}
		catch(err){next = '-';}
	}while(next == token.color[0]);

	return found;
}

restart()

















