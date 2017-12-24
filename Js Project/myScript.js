var canvas = document.getElementById('tennisCanvas'),
	canvasContext = canvas.getContext('2d'),
	ballX = 30,
	ballY = 30,
	ballSize = 8,
	leftPaddlePaddingX = 2, 
	leftPaddleY = 50.0, 
	leftPaddleSizeX = 4, 
	leftPaddleSizeY = 40,
	rightPaddlePaddingX = 7,
	rightPaddleY = 50,
	rightPaddleSizeX = 4,
	rightPaddleSizeY = 40,
	ballSpeedX = 2,
	ballSpeedY = Math.random(),
	baseSpeed = 2,
	rightTopBorder = 0,
	playerScore = 0,
	aiScore = 0,
	endDate = 0,
	startButton = document.getElementById("startButton"),
	gameOverButton = document.getElementById("gameOverButton"),
	menu = document.getElementById("gameMenu"),
	menuText = document.getElementById("menuText"),
	durate = 60000,
	interval;

window.onload = function(){
	
	startButton.addEventListener(
		"click", 
		function(evt) {
			menu.style.visibility = "hidden";
			resetVar();
			loadGame();
		}
	)
	
	gameOverButton.addEventListener(
		"click",
		resetAll
	)
	
}

function loadGame() {
	
	console.log("Hello World");
	var fps = 60;
	endDate = new Date(new Date().getTime()  + durate);
	interval = setInterval(startGame, 1000/fps);	
	
	window.addEventListener(
		'mousemove',
		function(evt) {
			var mousePos = calculateMousePos(evt);
			leftPaddleY = mousePos.y;
			if(mousePos.y > leftPaddleY + leftPaddleSizeY/2) {
				if(mousePos.y < canvas.height - leftPaddleSizeY) {
					leftPaddleY = mousePos.y
				} else {
					leftPaddleY = canvas.height - leftPaddleSizeY;
				}
			}
			if(mousePos.y < leftPaddleSizeY + leftPaddleSizeY/2) {
				if(mousePos.y > 0) {
					leftPaddleY = mousePos.y;
				} else {
					leftPaddleSizeY = 0
				}
			}
			
		}
	)
	
}

function resetAll() {
	
	menu.classList.add('startMenu');
	menu.classList.remove('gameOverMenu');
	menuText.createNode = "!WELCOME!";
	gameOverButton.style.display = "none";
	startButton.style.display = "block";
	
}

function gameOver() {
	
	
	var score = document.createElement("p");
	score.innerHTML = " PLAYER SCORE: " + playerScore + ", AI SCORE: " + aiScore;
	score.classList.add("normalText");
	menu.appendChild(score);
	window.clearInterval(interval);
	canvas.style.visibility = "hidden";
	menu.classList.remove('startMenu');
	menu.classList.add('gameOverMenu');
	menuText.textContent = "GAME OVER";
	startButton.style.display = "none";
	gameOverButton.style.display = "block";
	menu.style.visibility = "visible";
	
}

function startGame() {
	
	moveElements();
	drawElements();
	
}

function moveElements() {
	
	ballX = ballX + ballSpeedX;
	ballY = ballY + ballSpeedY;
	
	if(ballX > canvas.width - rightTopBorder - rightPaddleSizeX - rightPaddlePaddingX 
		&& ballY > rightPaddleY 
		&& ballY < rightPaddleY + rightPaddleSizeY) {
		ballSpeedX = -ballSpeedX;
	}
	
	if(ballX > canvas.width - rightTopBorder) {
		ballReset();
		playerScore = playerScore + 1;
	}
	
	if(ballX < leftPaddlePaddingX + leftPaddleSizeX + ballSize/2 
		&& ballY > leftPaddleY 
		&& ballY < leftPaddleY + leftPaddleSizeY) {
		ballSpeedX = -ballSpeedX;
	} 
	
	if(ballX < 0) {
		ballReset();
		aiScore = aiScore + 1;
	}
		
	if(ballY > canvas.height - rightTopBorder) {
		ballSpeedY = -ballSpeedY;
	}
	
	if(ballY < 0) {
		ballSpeedY = -ballSpeedY;
	}
	
	//Introduce AI thinking: AI tries to center to the ball trajectory
	if(ballY > rightPaddleY + rightPaddleSizeY/2) {
		//In this case, AI moves down
		if(rightPaddleY + rightPaddleSizeY < canvas.height)
			rightPaddleY = rightPaddleY + 1;
	} 
	
	if(ballY < rightPaddleY + leftPaddleSizeY/2) {
		//In this case AI moves up
		if(rightPaddleY > 0)
			rightPaddleY = rightPaddleY - 1;
		
	}
	
	if((endDate.getTime() - (new Date().getTime())) / 1000 < 0) {
		gameOver();
	}
	
}

function drawElements() {
	
	
	//Draw canvas
	drawAndColorRect(0, 0, canvas.width, canvas.height, 'black');
	
	//Draw ball
	drawAndColorCirc(ballX, ballY, ballSize/2, 'white');
	
	//Draw  left paddle
	drawAndColorRect(0 + leftPaddlePaddingX, leftPaddleY, leftPaddleSizeX, leftPaddleSizeY, 'blue');
	
	//Draw right paddle
	drawAndColorRect(canvas.width - rightPaddlePaddingX, rightPaddleY, rightPaddleSizeX, rightPaddleSizeY, 'red');
	
	//Draw score boards
	canvasContext.font="italic small-caps bold 15px monospace";
	canvasContext.fillText("Player score:" + playerScore, 20, 20);
	canvasContext.fillText("AI score: " + aiScore, canvas.width - 100, 20);

	//Draw time
	canvasContext.fillText((endDate.getTime() - (new Date().getTime())) / 1000 , canvas.width/2 - 20, 20);
	
	
}

function drawAndColorCirc(cx, cy, radius, color) {
	
	canvasContext.fillStyle = color;
	canvasContext.beginPath();
	canvasContext.arc(cx, cy, radius, 0, 2 * Math.PI, false);
	canvasContext.fill();
	
}

function drawAndColorRect(startX, startY, sizeX, sizeY, color) {
	
	canvasContext.fillStyle = color;
	canvasContext.fillRect(startX, startY, sizeX, sizeY);
	
}

function ballReset() {
	ballSpeedX = -ballSpeedX;
	if(ballSpeedX < 0)
		ballSpeedX = - baseSpeed - Math.random();
	else
		ballSpeedX = baseSpeed + Math.random();
	ballSpeedY = Math.random();
	ballX = canvas.width / 2;
	ballY = canvas.height / 2;
}

function calculateMousePos(evt) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	var mouseX = canvas.width * evt.clientX / window.outerWidth;
	var mouseY = canvas.height * evt.clientY / window.outerHeight;
	return {
		x:mouseX,
		y:mouseY
	};
}

function resetVar() {
	canvas = document.getElementById('tennisCanvas'),
	canvasContext = canvas.getContext('2d'),
	ballX = 30,
	ballY = 30,
	ballSize = 8,
	leftPaddlePaddingX = 2, 
	leftPaddleY = 50.0, 
	leftPaddleSizeX = 4, 
	leftPaddleSizeY = 40,
	rightPaddlePaddingX = 7,
	rightPaddleY = 50,
	rightPaddleSizeX = 4,
	rightPaddleSizeY = 40,
	ballSpeedX = 2,
	ballSpeedY = Math.random(),
	baseSpeed = 2,
	rightTopBorder = 0,
	playerScore = 0,
	aiScore = 0,
	endDate = 0;
	
	canvas.style.visibility = "visible";
}