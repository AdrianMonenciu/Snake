const gridSize = 500; // Size of the field
const tileSize = 25; // Size of the tiles
let field = document.getElementById('field');
let ctx = field.getContext('2d');
  
var direction = newDirection = 1; // -2: up, 2: down, -1: left, 1: right
var snakeLength = 1;
var snake = [{x: gridSize / 2, y: gridSize / 2}]; // Snake starts in the center
var food = {x: randomFood(), y: randomFood()};
var score = 0;

function updateSnakeGame() {
  updateSnakeHead();
  eatFoodCheck();
  updateSnakeTail();
  if (collisionCheck()) {
    gameEndUpdate();
    if(newDirection == 5){
    location.reload(); 
    }
  } else {
    gameFieldReset();
    scoreUpdate();
    gameFieldUpdate();
  }
}

function updateSnakeHead() {
  let newSnakeHead = {x: snake[0].x, y: snake[0].y};
  if (Math.abs(direction) !== Math.abs(newDirection)) { // Change directon if the new direction is a new axis
    direction = newDirection;
  }
  let axis = Math.abs(direction) === 1 ? 'x' : 'y'; // 1, -1 are X; 2, -2 are Y
  if (direction < 0) {
    newSnakeHead[axis] -= tileSize; // Move left or down
  } else {
    newSnakeHead[axis] += tileSize; // Move right or up
  }
  snake.unshift(newSnakeHead); // Add a new head to front
}

function eatFoodCheck() {
  if (food.x === snake[0].x && food.y === snake[0].y) { // Detect if the head is in the same cell as the food
    snakeLength += 1;
    score++;
    let newFoodOk = false;
    while (newFoodOk === false) {
      newFoodOk = true;
      food = {x: randomFood(), y: randomFood()};
      for (let i = 0; i < snake.length; i++) {
        if (snake[i].x === food.x && snake[i].y === food.y) newFoodOk = false;
      }
    }
  }
}

function updateSnakeTail() {
  snake = snake.slice(0, snakeLength);
}

function collisionCheck() {
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) return true;  // Detect head with tail collision
  }
  if (snake[0].x < 0 || snake[0].x >= gridSize || snake[0].y < 0 || snake[0].y >= gridSize) return true; // Detect wall collisions
  return false;
}

function randomFood() {
  return Math.floor(Math.random() * gridSize / tileSize) * tileSize;
}

function gameFieldReset() {
  ctx.fillStyle = '#22424a';
  ctx.fillRect(0, 0, gridSize, gridSize); // Reset the field
}

function gameEndUpdate() {
  ctx.fillStyle = '#e8dbb0';
  ctx.font = '30px Monospace';
  ctx.textAlign = 'center';
  ctx.fillText('Game Over - Score: '+score, gridSize / 2, gridSize / 2);
  ctx.fillText('SPACE to continue', gridSize / 2, 300);
}

function scoreUpdate() {
  document.getElementById('score').innerHTML = score;
}

function gameFieldUpdate() {
  ctx.fillStyle = '#15b31b';
  for (var i = 0; i < snake.length; i++) {
    var a = snake[i];
    ctx.fillRect(snake[i].x, snake[i].y, tileSize-1, tileSize-1); // Paint the snake
  }
  ctx.fillStyle = '#f2d729';
  ctx.fillRect(food.x, food.y, tileSize, tileSize); // Paint the food
}

window.onload = function() {
  setInterval(updateSnakeGame, 150); // Start the game loop
  window.onkeydown = function(e) {
    newDirection = {37: -1, 38: -2, 39: 1, 40: 2, 32: 5}[e.keyCode] || newDirection; 
    // -2: up Key, 2: down Key, -1: left Key, 1: right Key, 5: Space Key - Restart
  };
};