let blockSize = 30;
let board;
let context;

let rows = 20;
let cols = 20;
let editSize = false;
let showButtons = false;

let score = 0;
let gameOver = false;
let bestScore = 0;

let snakeX = Math.floor(Math.random() * cols) * blockSize;
let snakeY = Math.floor(Math.random() * rows) * blockSize;

let snake = [];

let velocityX = 0;
let velocityY = 0;
let canChangeDirection = true;
let editSpeed = false;
let speed = 1;
let gameInterval;

let foodX = blockSize * 10;
let foodY = blockSize * 10;

let snakeColor = "#11D76A";
let foodColor = "#DD2222";
let editMode = false;

window.onload = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const urlRows = urlParams.get("row");
  const urlCols = urlParams.get("column");
  const urlSpeed = urlParams.get("speed");

  if (urlRows && !isNaN(parseInt(urlRows))) {
    rows = parseInt(urlRows);
  }
  if (urlCols && !isNaN(parseInt(urlCols))) {
    cols = parseInt(urlCols);
  }
  if (urlSpeed && !isNaN(parseFloat(urlSpeed))) {
    speed = parseFloat(urlSpeed);
  }

  const speedRange = document.getElementById("changeSpeed");
  const speedValue = document.getElementById("changeSpeedOutput");

  if (speedValue && speedRange) {
    speedRange.addEventListener("input", (e) => {
      speed = parseFloat(e.target.value);
      speedValue.innerHTML = speed;
      clearInterval(gameInterval);
      gameInterval = setInterval(update, 100 / speed);
    });
    speedValue.innerHTML = speedRange.value;
  }

  board = document.getElementById("board");
  board.height = blockSize * rows;
  board.width = blockSize * cols;
  context = board.getContext("2d");

  gameInterval = setInterval(update, 100 / speed);

  placeFood();
  document.addEventListener("keydown", moveSnake);
};

const update = () => {
  if (gameOver) {
    velocityX = 0;
    velocityY = 0;
    return;
  }

  context.fillStyle = "#000000";
  context.fillRect(0, 0, board.width, board.height);

  context.fillStyle = foodColor;
  context.beginPath();
  context.arc(
    foodX + blockSize / 2,
    foodY + blockSize / 2,
    blockSize / 2,
    0,
    2 * Math.PI,
  );
  context.fill();

  for (let i = snake.length - 1; i > 0; i--) {
    snake[i] = snake[i - 1];
  }
  if (snake.length) {
    snake[0] = [snakeX, snakeY];
  }

  if (snakeX === foodX) {
    if (snakeY === foodY) {
      score++;
      snake.push([foodX, foodY]);
      placeFood();
    }
  }

  document.getElementById("score").innerHTML = score;
  document.getElementById("bestScore").innerHTML = bestScore;

  context.fillStyle = snakeColor;
  snakeX += velocityX * blockSize;
  snakeY += velocityY * blockSize;
  context.fillRect(snakeX, snakeY, blockSize, blockSize);
  context.strokeStyle = "#000000";
  context.lineWidth = 2;
  context.strokeRect(snakeX, snakeY, blockSize, blockSize);
  for (let i = 0; i < snake.length; i++) {
    context.fillRect(snake[i][0], snake[i][1], blockSize, blockSize);
    context.strokeRect(snake[i][0], snake[i][1], blockSize, blockSize);
  }

  if (
    snakeX < 0 ||
    snakeX >= cols * blockSize ||
    snakeY < 0 ||
    snakeY >= rows * blockSize
  ) {
    gameOver = true;
  }

  if (snake.length + 1 === rows * cols) {
    gameOver = true;
  }

  for (let i = 0; i < snake.length; i++) {
    if (snakeX === snake[i][0] && snakeY === snake[i][1]) {
      gameOver = true;
    }
  }

  if (gameOver) {
    if (score > bestScore) {
      bestScore = score;
    }
    if (snake.length + 1 < rows * cols) {
      alert("Game Over!\nYour score: " + score + "\nYour best: " + bestScore);
    } else if (snake.length + 1 === rows * cols) {
      alert("You Win!");
    }
  }

  canChangeDirection = true;
};

const placeFood = () => {
  foodX = Math.floor(Math.random() * cols) * blockSize;
  foodY = Math.floor(Math.random() * rows) * blockSize;
  for (let i = 0; i < snake.length; i++) {
    if (foodX === snake[i][0] && foodY === snake[i][1]) {
      placeFood();
    }
  }
};

const moveSnake = (e) => {
  if (document.activeElement.tagName !== "INPUT") {
    e.preventDefault();
  }

  if (e.code === "KeyR") {
    restart();
  } else if (e.code === "KeyC") {
    size();
  } else if (e.code === "KeyE") {
    edit();
  } else if (e.code === "KeyG") {
    if (editMode) {
      random();
    }
  } else if (e.code === "KeyV") {
    Speed();
  }

  if (!canChangeDirection) {
    return;
  }

  if ((e.code === "ArrowUp" || e.code === "KeyW") && velocityY !== 1) {
    velocityX = 0;
    velocityY = -1;
  } else if (
    (e.code === "ArrowDown" || e.code === "KeyS") &&
    velocityY !== -1
  ) {
    velocityX = 0;
    velocityY = 1;
  } else if ((e.code === "ArrowLeft" || e.code === "KeyA") && velocityX !== 1) {
    velocityX = -1;
    velocityY = 0;
  } else if (
    (e.code === "ArrowRight" || e.code === "KeyD") &&
    velocityX !== -1
  ) {
    velocityX = 1;
    velocityY = 0;
  }
  canChangeDirection = false;
};

const restart = () => {
  if (gameOver) {
    score = 0;
    gameOver = false;
    snake = [];
    snakeX = Math.floor(Math.random() * cols) * blockSize;
    snakeY = Math.floor(Math.random() * rows) * blockSize;
    velocityX = 0;
    velocityY = 0;

    placeFood();
    update();
  }
};

const size = () => {
  if (velocityX === 0 && velocityY === 0) {
    if (!editSize) {
      editSize = true;
      document.getElementById("rowLabel").style.display = "inline-block";
      document.getElementById("row").style.display = "inline-block";
      document.getElementById("colLabel").style.display = "inline-block";
      document.getElementById("col").style.display = "inline-block";
      document.getElementById("submit").style.display = "inline-block";
    } else {
      editSize = false;
      document.getElementById("rowLabel").style.display = "none";
      document.getElementById("row").style.display = "none";
      document.getElementById("colLabel").style.display = "none";
      document.getElementById("col").style.display = "none";
      document.getElementById("submit").style.display = "none";

      board.clearRect(0, 0, board.width, board.height);

      rows = parseInt(document.getElementById("row").value);
      cols = parseInt(document.getElementById("col").value);
      board.height = blockSize * rows;
      board.width = blockSize * cols;
      restart();
      update();
    }
  }
};

const edit = () => {
  if (velocityX === 0 && velocityY === 0) {
    if (!editMode) {
      editMode = true;
      document.getElementById("backgroundLabel").style.display = "inline-block";
      document.getElementById("background").style.display = "inline-block";
      document.getElementById("snakeLabel").style.display = "inline-block";
      document.getElementById("snake").style.display = "inline-block";
      document.getElementById("foodLabel").style.display = "inline-block";
      document.getElementById("food").style.display = "inline-block";
      document.getElementById("random").style.display = "inline-block";
      document.getElementById("br1").style.display = "inline-block";
      document.getElementById("br2").style.display = "inline-block";
    } else {
      editMode = false;
      document.getElementById("backgroundLabel").style.display = "none";
      document.getElementById("background").style.display = "none";
      document.getElementById("snakeLabel").style.display = "none";
      document.getElementById("snake").style.display = "none";
      document.getElementById("foodLabel").style.display = "none";
      document.getElementById("food").style.display = "none";
      document.getElementById("random").style.display = "none";
      document.getElementById("br1").style.display = "none";
      document.getElementById("br2").style.display = "none";
    }
  }
};

const changeBackground = () => {
  document.getElementById("body").style.backgroundColor =
    document.getElementById("background").value;
};

const changeSnake = () => {
  snakeColor = document.getElementById("snake").value;
};

const changeFood = () => {
  foodColor = document.getElementById("food").value;
};

const random = () => {
  snakeColor = randomColor();
  foodColor = randomColor();
  document.getElementById("body").style.backgroundColor = randomColor();
};

const randomColor = () => {
  let r = Math.floor(Math.random() * 256);
  let g = Math.floor(Math.random() * 256);
  let b = Math.floor(Math.random() * 256);

  return `rgb(${r}, ${g}, ${b})`;
};

const showButton = () => {
  if (!showButtons) {
    showButtons = true;
    document.getElementById("functions").style.display = "inline-block";
    document.getElementById("buttons").innerHTML = "Hide other Functions";
  } else {
    showButtons = false;
    document.getElementById("functions").style.display = "none";
    document.getElementById("buttons").innerHTML = "Show other Functions";
  }
};

const Speed = () => {
  if (velocityX === 0 && velocityY === 0) {
    if (!editSpeed) {
      editSpeed = true;
      document.getElementById("speedLabel").style.display = "inline-block";
      document.getElementById("changeSpeed").style.display = "inline-block";
      document.getElementById("changeSpeedOutput").style.display =
        "inline-block";
      document.getElementById("submitSpeed").style.display = "inline-block";
    } else {
      editSpeed = false;
      document.getElementById("speedLabel").style.display = "none";
      document.getElementById("changeSpeed").style.display = "none";
      document.getElementById("changeSpeedOutput").style.display = "none";
      document.getElementById("submitSpeed").style.display = "none";
    }
  }
};

const setSpeed = () => {
  if (velocityX === 0 && velocityY === 0) {
  }
};
