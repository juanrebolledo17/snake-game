const canvas = document.querySelector("#snake-board");
const ctx = canvas.getContext("2d");
const scoreElement = document.querySelector(".score");
const gameOverElement = document.querySelector("#game-over");
const gameStateElement = document.querySelector(".game-state");
const resetButton = document.querySelector("#play-again");
let gameOver = false;
canvas.width = 500;
canvas.height = 500;
const snakeSegments = [];
let snakeLength = 1;
let snakeX = 0;
let snakeY = 0;
let directionX = 10;
let directionY = 0; 
let foodX, foodY;
let score = 0;
let highestScore = localStorage.getItem('highestScore') || 0;
let gameInterval;

function moveSnake() {
  snakeSegments.unshift([snakeX, snakeY]);
  snakeX += directionX;
  snakeY += directionY;
  while (snakeSegments.length > snakeLength) {
    snakeSegments.pop();
  }
}

function drawSnake() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#d2691e';
  snakeSegments.forEach((segment, i) => {
    ctx.fillRect(snakeSegments[i][0], snakeSegments[i][1], 10, 10);
  });
}

function generateFoodCoordinates() {
  foodX = Math.floor(Math.random() * 490);
  foodY = Math.floor(Math.random() * 490);
}

function drawFood() {
  ctx.fillStyle = '#dc143c';
  ctx.fillRect(foodX, foodY, 10, 10);
}

function checkForCollisions() {
  if (snakeX < foodX + 10 && snakeX + 10 > foodX && snakeY < foodY + 10 && snakeY + 10 > foodY) {
    snakeLength++;
    updateScore();
    generateFoodCoordinates();
    drawFood();
  }

  if (snakeX < -10 || snakeY < -10 || snakeX > canvas.width + 5 || snakeY > canvas.height) {
    setGameOver();
  }

  for (let i = 1; i < snakeSegments.length; i++) {
    if (snakeX === snakeSegments[i][0] && snakeY === snakeSegments[i][1]) {
      setGameOver();
    }
  }
}

function updateScore() {
  score++;
  scoreElement.innerHTML = `Score: ${score}`;
}

function gameLoop() {
  moveSnake();
  drawSnake();
  drawFood()
  checkForCollisions();
}

function startGame() {
  gameInterval = setInterval(gameLoop, 100);
  return gameInterval;
}

function setGameOver() {
  gameOver = true;
  clearInterval(gameInterval);
  gameOverElement.style.display = 'flex';
  gameStateElement.innerHTML = 'Game Over!';
  if (score > highestScore) {
    localStorage.setItem('highestScore', score);
    highestScore = score;
    document.querySelector('.highest-score').innerHTML = `Highest Score: ${highestScore}`
  }
}

function resetGame() {
  clearInterval(gameInterval);
  snakeSegments.length = 0;
  snakeLength = 1;
  snakeX = 0;
  snakeY = 0;
  directionX = 10;
  directionY = 0;
  score = 0;
  scoreElement.innerHTML = `Score: ${score}`;
  generateFoodCoordinates();
  drawFood();
  gameOverElement.style.display = 'none';
  gameStateElement.innerHTML = '';
  gameOver = false;
  gameInterval = setInterval(gameLoop, 100);
}

window.addEventListener('load', () => {
  if (!gameOver) {
    generateFoodCoordinates();
    startGame();
  }

  if (highestScore > 0) {
    document.querySelector('.highest-score').innerHTML = `Highest Score: ${highestScore}`
  }
});

resetButton.addEventListener('click', resetGame);

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowLeft': 
      if (directionX !== 10) {
        directionX = -10;
        directionY = 0;
      }
      break;
    case 'ArrowUp': 
      if (directionY !== 10) {
        directionX = 0;
        directionY = -10;
      }
      break;
    case 'ArrowRight': 
      if (directionX !== -10) {
        directionX = 10;
        directionY = 0;
      }
      break;
    case 'ArrowDown': 
      if (directionY !== -10) {
        directionX = 0;
        directionY = 10;
      }
      break;
  }
});