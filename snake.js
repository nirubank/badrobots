const canvas = document.querySelector("#gameCanvas");
const ctx = canvas.getContext("2d");
const scoreLabel = document.querySelector("#score");
const bestScoreLabel = document.querySelector("#bestScore");
const startButton = document.querySelector("#startButton");
const pauseButton = document.querySelector("#pauseButton");
const restartButton = document.querySelector("#restartButton");
const statusLabel = document.querySelector("#status");

const tileCount = 20;
const tileSize = canvas.width / tileCount;
const startSnake = [
  { x: 9, y: 10 },
  { x: 8, y: 10 },
  { x: 7, y: 10 },
];

let snake = [];
let food = { x: 14, y: 10 };
let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };
let score = 0;
let bestScore = Number(localStorage.getItem("snakeBestScore") || 0);
let timer = null;
let running = false;
let paused = false;

bestScoreLabel.textContent = bestScore;

function resetGame() {
  snake = startSnake.map((part) => ({ ...part }));
  direction = { x: 1, y: 0 };
  nextDirection = { x: 1, y: 0 };
  score = 0;
  running = false;
  paused = false;
  placeFood();
  updateScore();
  statusLabel.textContent = "Press Start to play.";
  draw();
}

function startGame() {
  if (running && !paused) return;
  running = true;
  paused = false;
  statusLabel.textContent = "Eat the red food. Do not hit walls or yourself.";
  clearInterval(timer);
  timer = setInterval(tick, 110);
}

function pauseGame() {
  if (!running) return;
  paused = !paused;
  statusLabel.textContent = paused ? "Paused." : "Back in motion.";
}

function restartGame() {
  clearInterval(timer);
  resetGame();
  startGame();
}

function tick() {
  if (paused) return;

  direction = nextDirection;
  const head = snake[0];
  const nextHead = {
    x: head.x + direction.x,
    y: head.y + direction.y,
  };

  if (hasCrashed(nextHead)) {
    endGame();
    return;
  }

  snake.unshift(nextHead);

  if (nextHead.x === food.x && nextHead.y === food.y) {
    score += 10;
    updateScore();
    placeFood();
  } else {
    snake.pop();
  }

  draw();
}

function hasCrashed(head) {
  const hitWall = head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount;
  const hitSelf = snake.some((part) => part.x === head.x && part.y === head.y);
  return hitWall || hitSelf;
}

function endGame() {
  clearInterval(timer);
  running = false;
  paused = false;
  statusLabel.textContent = "Game over. Press Restart to try again.";
  draw(true);
}

function updateScore() {
  scoreLabel.textContent = score;
  if (score > bestScore) {
    bestScore = score;
    bestScoreLabel.textContent = bestScore;
    localStorage.setItem("snakeBestScore", String(bestScore));
  }
}

function placeFood() {
  do {
    food = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount),
    };
  } while (snake.some((part) => part.x === food.x && part.y === food.y));
}

function setDirection(name) {
  const directions = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 },
  };
  const requested = directions[name];
  if (!requested) return;

  const reversing =
    requested.x + direction.x === 0 && requested.y + direction.y === 0;
  if (!reversing) {
    nextDirection = requested;
  }
}

function draw(gameOver = false) {
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  drawFood();
  drawSnake();

  if (gameOver) {
    ctx.fillStyle = "rgba(15, 23, 42, 0.72)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 40px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
  }
}

function drawGrid() {
  ctx.strokeStyle = "rgba(148, 163, 184, 0.12)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= tileCount; i += 1) {
    const position = i * tileSize;
    ctx.beginPath();
    ctx.moveTo(position, 0);
    ctx.lineTo(position, canvas.height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, position);
    ctx.lineTo(canvas.width, position);
    ctx.stroke();
  }
}

function drawFood() {
  ctx.fillStyle = "#f43f5e";
  ctx.beginPath();
  ctx.arc(
    food.x * tileSize + tileSize / 2,
    food.y * tileSize + tileSize / 2,
    tileSize * 0.34,
    0,
    Math.PI * 2,
  );
  ctx.fill();
}

function drawSnake() {
  snake.forEach((part, index) => {
    const inset = index === 0 ? 3 : 4;
    ctx.fillStyle = index === 0 ? "#86efac" : "#22c55e";
    ctx.fillRect(
      part.x * tileSize + inset,
      part.y * tileSize + inset,
      tileSize - inset * 2,
      tileSize - inset * 2,
    );
  });
}

document.addEventListener("keydown", (event) => {
  const keyDirections = {
    ArrowUp: "up",
    w: "up",
    W: "up",
    ArrowDown: "down",
    s: "down",
    S: "down",
    ArrowLeft: "left",
    a: "left",
    A: "left",
    ArrowRight: "right",
    d: "right",
    D: "right",
  };

  if (keyDirections[event.key]) {
    event.preventDefault();
    setDirection(keyDirections[event.key]);
    if (!running) startGame();
  }

  if (event.key === " ") {
    event.preventDefault();
    pauseGame();
  }
});

document.querySelectorAll("[data-dir]").forEach((button) => {
  button.addEventListener("click", () => {
    setDirection(button.dataset.dir);
    if (!running) startGame();
  });
});

startButton.addEventListener("click", startGame);
pauseButton.addEventListener("click", pauseGame);
restartButton.addEventListener("click", restartGame);

resetGame();
