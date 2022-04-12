let gridSize = 500; // Size of the field
let tileSize = 10; //gridSize / 50;
let field = document.getElementById('field');
//field.style.width = field.style.height = SIZE + 'px';
let ctx = field.getContext('2d');
//ctx.scale(2, 2); // Scale the canvas
  
var direction = newDirection = 1; // -2: up, 2: down, -1: left, 1: right
var snakeLength = 1;
var snake = [{x: gridSize / 2, y: gridSize / 2}]; // Snake starts in the center
var food = null;
var end = false;
var score = 0;

function updateSnakeGame() {
  var newSnakeHead = {x: snake[0].x, y: snake[0].y};
  if (Math.abs(direction) !== Math.abs(newDirection)) { // Change directon if the new direction is a new axis
    direction = newDirection;
  }
  var axis = Math.abs(direction) === 1 ? 'x' : 'y'; // 1, -1 are X; 2, -2 are Y
  if (direction < 0) {
    newSnakeHead[axis] -= tileSize; // Move left or down
  } else {
    newSnakeHead[axis] += tileSize; // Move right or up
  }
  if (food && food.x === newSnakeHead.x && food.y === newSnakeHead.y) { // Detect if the head is in the same cell as the food
    food = null;
    snakeLength += 2;
    score++;
  }
  if (end) {
    handleGameEnd();
    if(newDirection == 5){
    location.reload(); 
    }
  } else {
    handleFieldReset();
    handleScoreUpdate();
    handleDrawSnakeAndFood();
    snake.unshift(newSnakeHead); // Add a new head to front
    snake = snake.slice(0, snakeLength);
    if (newSnakeHead.x < 0 || newSnakeHead.x >= gridSize || newSnakeHead.y < 0 || newSnakeHead.y >= gridSize) { // Detect wall collisions
      end = true;
    }
    handleTtailCollisionCheck(newSnakeHead);
  }
}

function randomFood() {
  return Math.floor(Math.random() * gridSize / tileSize) * tileSize;
}

function coordToString(obj) {
  return [obj.x, obj.y].join(',');
}

function handleFieldReset() {
  ctx.fillStyle = '#22424a';
  ctx.fillRect(0, 0, gridSize, gridSize); // Reset the field
}

function handleGameEnd() {
  ctx.fillStyle = '#e8dbb0';
  ctx.font = '30px Monospace';
  ctx.textAlign = 'center';
  ctx.fillText('Game Over - Score: '+score, gridSize / 2, gridSize / 2);
  ctx.fillText('SPACE to continue', gridSize / 2, 300);
}

function handleScoreUpdate() {
  document.getElementById('score').innerHTML = score;
}

function handleTtailCollisionCheck(newSnakeHead) {
  var snakeObj = {};
  for (var i = 0; i < snake.length; i++) {
    var a = snake[i];
    if (i > 0) snakeObj[coordToString(a)] = true; // Build a collision lookup object
  }
  if (snakeObj[coordToString(newSnakeHead)]) end = true; // Collided with the snake tail
}

function handleDrawSnakeAndFood() {
  ctx.fillStyle = '#15b31b';
  var snakeObj = {};
  for (var i = 0; i < snake.length; i++) {
    var a = snake[i];
    ctx.fillRect(a.x, a.y, tileSize-1, tileSize-1); // Paint the snake
  }
  while (!food || snakeObj[coordToString(food)]) { // Place a food if needed
    food = {x: randomFood(), y: randomFood()};
  }
  ctx.fillStyle = '#f2d729';
  ctx.fillRect(food.x, food.y, tileSize, tileSize); // Paint the food
}

window.onload = function() {
  setInterval(updateSnakeGame, 100); // Start the game loop
  window.onkeydown = function(e) {
    newDirection = {37: -1, 38: -2, 39: 1, 40: 2, 32: 5}[e.keyCode] || newDirection; 
    // -2: up Key, 2: down Key, -1: left Key, 1: right Key, 5: Space Key - Restart
  };
};