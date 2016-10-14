var board = new Array();
var has_conflicted = new Array();
var score = 0;
var best = 0;
$(document).ready(function(){
	new_game();
});
function new_game(){
	//初始化棋盘
	init();
	//在随机两个格子生成数字
	generate_one_number();
	generate_one_number();
}
function init(){
	for(var i=0;i<4;i++){
		for(var j=0;j<4;j++){
			var gird_cell = $('#gird-cell_'+i+'_'+j);
			gird_cell.css('margin-top',get_top(i));
			gird_cell.css('margin-left',get_left(j));
		}
	}
	for (var i = 0; i < 4; i++) {
		board[i] = new Array();
		has_conflicted[i] = new Array();
		for (var j =0; j < 4; j++) {
			board[i][j] = 0;
			has_conflicted[i][j] = false;
		}
	}
	score=0;
	update_score(score,best);
	update_board_view();
	var game_over = $('#game-over');
		game_over.animate({
		opacity:0
	},100);
}
function update_board_view(){
	$('.number_cell').remove();
	for(var i=0;i<4;i++){
		for(var j=0;j<4;j++){
			$('#gird-container').append('<div class="number_cell" id="number_cell_'+i+'_'+j+'"></div>');
			var number_cell = $('#number_cell_'+i+'_'+j);
			if(board[i][j]===0){
				number_cell.css('width','0');
				number_cell.css('height','0');
				number_cell.css('top',get_top(i)+(106.25/2));
				number_cell.css('left',get_left(j)+(106.25/2));
			}else{
				number_cell.css('width',106.25);
				number_cell.css('height',106.25);
				number_cell.css('top',get_top(i));
				number_cell.css('left',get_left(j));
				number_cell.css('background-color',get_background_color(board[i][j]));
				number_cell.css('color',get_number_color(board[i][j]));
				number_cell.text(board[i][j]);
			}
			has_conflicted[i][j]=false;
		}
	}
	update_score(score,best);
}
function get_top(i){
	return ((i+1)*15+i*106.25);
}
function get_left(j){
	return ((j+1)*15+j*106.25);
}
function get_background_color(num){
	switch (num) {
		case 2: return '#eee4da'; break;
		case 4: return '#ede0c8'; break;
		case 8: return '#f2b179'; break;
		case 16: return '#f59563'; break;
		case 32: return '#f67c5f'; break;
		case 64: return '#f65e3b'; break;
		case 128: return '#edcf72'; break;
		case 256: return '#edcc61'; break;
		case 512: return ' #edc850'; break;
		case 1024: return '#edc53f'; break;
		case 2048: return '#edc22e'; break;
		case 4096: return '#a6c'; break;
		case 8192: return '#93c'; break;
	}
	return 'black';
}
function get_number_color(num){
	if (num <= 4)
		return '#776e65';
	return '#fff';
}
function update_score(score,best){
	$('#score p').text(score);
	$('#best p').text(best);
}
function generate_one_number(){
	if(nospace(board)){
		return false;
	}
	var x=Math.floor(Math.random()*4);
	var y=Math.floor(Math.random()*4);
	var time=0;
	while (time < 50) {
		if (board[x][y] == 0) {
			break;
		}
		x = Math.floor(Math.random() * 4);
		y = Math.floor(Math.random() * 4);
		time++;
	}
	if (time == 50) {
		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 4; j++) {
				if (board[i][j] == 0) {
					x = i;
					y = j;
				}
			}
		}
	}
	var num = Math.random()>0.4? 2 : 4;
	board[x][y]=num;
	show_number(x,y,num);
}
function nospace(board){
	for(var i=0;i<4;i++){
		for(var j=0;j<4;j++){
			if(board[i][j]===0){
				return false;
			}
		}
	}
}
function show_number(x,y,num){
	var number_cell=$('#number_cell_'+x+'_'+y);
	number_cell.css('background-color',get_background_color(num));
	number_cell.css('color',get_number_color(num));
	number_cell.text(num);
	number_cell.animate({
		width:106.25,
		height:106.25,
		top:get_top(x),
		left:get_left(y)
	},200);
}
$(document).keydown(function (event){
	switch(event.keyCode){
		case 37://左
			if(move_left()){
				setTimeout('generate_one_number()',210);
				setTimeout('is_gameover()',250);
			}
			break;
		case 38://上
			if(move_up()){
				setTimeout('generate_one_number()',210);
				setTimeout('is_gameover()',250);
			}
			break;
		case 39://右
			if(move_right()){
				setTimeout('generate_one_number()',210);
				setTimeout('is_gameover()',250);
			}
			break;
		case 40://下
			if(move_down()){
				setTimeout('generate_one_number()',210);
				setTimeout('is_gameover()',250);
			}
			break;
		default: break;
	}
});
function move_left(){
	if(!can_move_left()){
		return false;
	}
	for(var i=0;i<4;i++){
		for(var j=1;j<4;j++){
			if(board[i][j]!==0){
				for(var k=0;k<j;k++){
					if(board[i][k]==0 && no_block_horizontal(i,k,j)){
						show_move_animation(i,j,i,k);
						board[i][k]=board[i][j];
						board[i][j]=0;
						break;
					}else if(board[i][k]==board[i][j] && no_block_horizontal(i,k,j) && !has_conflicted[i][k]){
						show_move_animation(i,j,i,k);
						board[i][k]+=board[i][j];
						board[i][j]=0;
						has_conflicted[i][k]=true;
						score+=board[i][k];
						if(score>best){
							best=score;
						}
						break;
					}
				}
			}
		}
	}
	setTimeout('update_board_view()',200);
	return true;
}
function move_right(){
	if(!can_move_right()){
		return false;
	}
	for(var i=0;i<4;i++){
		for(var j=2;j>=0;j--){
			if(board[i][j]!==0){
				for(var k=3;k>j;k--){
					if(board[i][k]==0 && no_block_horizontal(i,j,k)){
						show_move_animation(i,j,i,k);
						board[i][k]=board[i][j];
						board[i][j]=0;
						break;
					}else if(board[i][k]==board[i][j] && no_block_horizontal(i,j,k) && !has_conflicted[i][k]){
						show_move_animation(i,j,i,k);
						board[i][k]+=board[i][j];
						board[i][j]=0;
						has_conflicted[i][k]=true;
						score+=board[i][k];
						if(score>best){
							best=score;
						}
						break;
					}
				}
			}
		}
	}
	setTimeout('update_board_view()',200);
	return true;
}
function move_up(){
	if(!can_move_up()){
		return false;
	}
	for(var j=0;j<4;j++){
		for(var i=1;i<4;i++){
			if(board[i][j]!==0){
				for(var k=0;k<i;k++){
					if(board[k][j]==0 && no_block_vertical(j,k,i)){
						show_move_animation(i,j,k,j);
						board[k][j]=board[i][j];
						board[i][j]=0;
						break;
					}else if(board[k][j]==board[i][j] && no_block_vertical(j,k,i) && !has_conflicted[k][j]){
						show_move_animation(i,j,k,j);
						board[k][j]+=board[i][j];
						board[i][j]=0;
						has_conflicted[k][j]=true;
						score+=board[k][j];
						if(score>best){
							best=score;
						}
						break;
					}
				}
			}
		}
	}
	setTimeout('update_board_view()',200);
	return true;
}
function move_down(){
	if(!can_move_down()){
		return false;
	}
	for(var j=0;j<4;j++){
		for(var i=2;i>=0;i--){
			if(board[i][j]!==0){
				for(var k=3;k>i;k--){
					if(board[k][j]==0 && no_block_vertical(j,i,k)){
						show_move_animation(i,j,k,j);
						board[k][j]=board[i][j];
						board[i][j]=0;
						break;
					}else if(board[k][j]==board[i][j] && no_block_vertical(j,i,k) && !has_conflicted[k][j]){
						show_move_animation(i,j,k,j);
						board[k][j]+=board[i][j];
						board[i][j]=0;
						has_conflicted[k][j]=true;
						score+=board[k][j];
						if(score>best){
							best=score;
						}
						break;
					}
				}
			}
		}
	}
	setTimeout('update_board_view()',200);
	return true;
}
function can_move_left(){
	for(var i=0;i<4;i++){
		for(var j=1;j<4;j++){
			if(board[i][j]!==0){
				if(board[i][j-1]===0 || board[i][j]===board[i][j-1]){
					return true;
				}
			}
		}
	}
	return false;
}
function can_move_right(){
	for(var i=0;i<4;i++){
		for(var j=2;j>=0;j--){
			if(board[i][j]!==0){
				if(board[i][j+1]===0 || board[i][j]===board[i][j+1]){
					return true;
				}
			}
		}
	}
	return false;
}
function can_move_up(){
	for(var j=0;j<4;j++){
		for(var i=1;i<4;i++){
			if(board[i][j]!==0){
				if(board[i-1][j]===0 || board[i][j]===board[i-1][j]){
					return true;
				}
			}
		}
	}
	return false;
}
function can_move_down(){
	for(var j=0;j<4;j++){
		for(var i=2;i>=0;i--){
			if(board[i][j]!==0){
				if(board[i+1][j]===0 || board[i][j]===board[i+1][j]){
					return true;
				}
			}
		}
	}
	return false;
}
function no_block_horizontal(i,left,right){
	for(var j=left+1;j<right;j++){
		if(board[i][j]!==0)return false;
	}
	return true;
}
function no_block_vertical(j,up,down){
	for(var i=up+1;i<down;i++){
		if(board[i][j]!==0)return false;
	}
	return true;
}
function show_move_animation(fromx,fromy,tox,toy){
	var number_cell=$('#number_cell_'+fromx+'_'+fromy);
	number_cell.animate({
		top:get_top(tox),
		left:get_left(toy)
	},200);
}
function is_gameover(){
	if(nomove() && nospace()){
		var game_over = $('#game-over');
		game_over.animate({
			opacity:1
		},300);
	}
}
function nomove(){
	if(can_move_down()||can_move_left()||can_move_right()||can_move_up()){
		return false;
	}
	return true;
}
function nospace(){
	for(var i=0;i<4;i++){
		for(var j=0;j<4;j++){
			if(board[i][j]===0)return false;
		}
	}
	return true;
}
