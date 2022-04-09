var SIZE = 500; // Size of the field
var GRID_SIZE = SIZE / 50;
var field = document.getElementById('field');
field.style.width = field.style.height = SIZE + 'px';
var ctx = field.getContext('2d');
ctx.scale(2, 2); // Scale the canvas
  
var direction = newDirection = 1; // -2: up, 2: down, -1: left, 1: right
var snakeLength = 1;
var snake = [{x: SIZE / 2, y: SIZE / 2}]; // Snake starts in the center
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
    newSnakeHead[axis] -= GRID_SIZE; // Move left or down
  } else {
    newSnakeHead[axis] += GRID_SIZE; // Move right or up
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
    if (newSnakeHead.x < 0 || newSnakeHead.x >= SIZE || newSnakeHead.y < 0 || newSnakeHead.y >= SIZE) { // Detect wall collisions
      end = true;
    }
    handleTtailCollisionCheck(newSnakeHead);
  }
}

function randomFood() {
  return Math.floor(Math.random() * SIZE / GRID_SIZE) * GRID_SIZE;
}

function coordToString(obj) {
  return [obj.x, obj.y].join(',');
}

function handleFieldReset() {
  ctx.fillStyle = '#22424a';
  ctx.fillRect(0, 0, SIZE, SIZE); // Reset the field
}

function handleGameEnd() {
  ctx.fillStyle = '#e8dbb0';
    ctx.font = '30px Monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over - Score: '+score, SIZE / 2, SIZE / 2);
    ctx.fillText('SPACE to continue', SIZE / 2, 300);
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
    ctx.fillRect(a.x, a.y, GRID_SIZE-1, GRID_SIZE-1); // Paint the snake
  }
  while (!food || snakeObj[coordToString(food)]) { // Place a food if needed
    food = {x: randomFood(), y: randomFood()};
  }
  ctx.fillStyle = '#f2d729';
  ctx.fillRect(food.x, food.y, GRID_SIZE, GRID_SIZE); // Paint the food
}

window.onload = function() {
  setInterval(updateSnakeGame, 100); // Start the game loop
  window.onkeydown = function(e) {
    newDirection = {37: -1, 38: -2, 39: 1, 40: 2, 32: 5}[e.keyCode] || newDirection; //32 = 5 for space restart
  };
};