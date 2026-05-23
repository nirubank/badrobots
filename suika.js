const canvas = document.querySelector("#gameCanvas");
const ctx = canvas.getContext("2d");
const nextCanvas = document.querySelector("#nextCanvas");
const nextCtx = nextCanvas.getContext("2d");
const scoreLabel = document.querySelector("#score");
const bestScoreLabel = document.querySelector("#bestScore");
const dropButton = document.querySelector("#dropButton");
const restartButton = document.querySelector("#restartButton");
const statusLabel = document.querySelector("#status");

const fruits = [
  { name: "Cherry", radius: 17, color: "#ef4444", points: 2 },
  { name: "Berry", radius: 23, color: "#a855f7", points: 5 },
  { name: "Lime", radius: 29, color: "#84cc16", points: 9 },
  { name: "Orange", radius: 36, color: "#f97316", points: 15 },
  { name: "Apple", radius: 44, color: "#dc2626", points: 24 },
  { name: "Peach", radius: 54, color: "#fb7185", points: 38 },
  { name: "Melon", radius: 65, color: "#22c55e", points: 60 },
  { name: "Watermelon", radius: 78, color: "#15803d", points: 100 },
];

const gravity = 0.22;
const friction = 0.985;
const wallBounce = 0.42;
const mergeCooldown = 12;
const spawnY = 72;
const loseLine = 118;

let fruitBodies = [];
let aimX = canvas.width / 2;
let currentLevel = 0;
let nextLevel = 0;
let score = 0;
let bestScore = Number(localStorage.getItem("suikaBestScore") || 0);
let canDrop = true;
let gameOver = false;
let animationFrame = null;

bestScoreLabel.textContent = bestScore;

function resetGame() {
  cancelAnimationFrame(animationFrame);
  fruitBodies = [];
  aimX = canvas.width / 2;
  currentLevel = randomStarter();
  nextLevel = randomStarter();
  score = 0;
  canDrop = true;
  gameOver = false;
  updateScore();
  drawNext();
  statusLabel.textContent = "Move with arrows or your pointer. Drop fruit to merge matches.";
  loop();
}

function randomStarter() {
  return Math.floor(Math.random() * 4);
}

function loop() {
  stepPhysics();
  checkLoseLine();
  draw();
  animationFrame = requestAnimationFrame(loop);
}

function stepPhysics() {
  if (gameOver) return;

  fruitBodies.forEach((fruit) => {
    fruit.vy += gravity;
    fruit.x += fruit.vx;
    fruit.y += fruit.vy;
    fruit.vx *= friction;
    fruit.vy *= friction;
    fruit.cooldown = Math.max(0, fruit.cooldown - 1);
    resolveWalls(fruit);
  });

  for (let pass = 0; pass < 3; pass += 1) {
    for (let i = 0; i < fruitBodies.length; i += 1) {
      for (let j = i + 1; j < fruitBodies.length; j += 1) {
        resolvePair(fruitBodies[i], fruitBodies[j]);
      }
    }
  }
}

function resolveWalls(fruit) {
  if (fruit.x - fruit.radius < 28) {
    fruit.x = 28 + fruit.radius;
    fruit.vx = Math.abs(fruit.vx) * wallBounce;
  }
  if (fruit.x + fruit.radius > canvas.width - 28) {
    fruit.x = canvas.width - 28 - fruit.radius;
    fruit.vx = -Math.abs(fruit.vx) * wallBounce;
  }
  if (fruit.y + fruit.radius > canvas.height - 28) {
    fruit.y = canvas.height - 28 - fruit.radius;
    fruit.vy = -Math.abs(fruit.vy) * 0.24;
    fruit.vx *= 0.9;
  }
}

function resolvePair(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const distance = Math.hypot(dx, dy) || 1;
  const minimum = a.radius + b.radius;
  if (distance >= minimum) return;

  if (a.level === b.level && a.cooldown === 0 && b.cooldown === 0) {
    mergeFruits(a, b);
    return;
  }

  const overlap = minimum - distance;
  const nx = dx / distance;
  const ny = dy / distance;
  a.x -= nx * overlap * 0.5;
  a.y -= ny * overlap * 0.5;
  b.x += nx * overlap * 0.5;
  b.y += ny * overlap * 0.5;

  const push = 0.045;
  a.vx -= nx * push * overlap;
  a.vy -= ny * push * overlap;
  b.vx += nx * push * overlap;
  b.vy += ny * push * overlap;
}

function mergeFruits(a, b) {
  const level = Math.min(a.level + 1, fruits.length - 1);
  const merged = createFruit(level, (a.x + b.x) / 2, (a.y + b.y) / 2);
  merged.vx = (a.vx + b.vx) * 0.35;
  merged.vy = -2.2;
  merged.cooldown = mergeCooldown;
  fruitBodies = fruitBodies.filter((fruit) => fruit !== a && fruit !== b);
  fruitBodies.push(merged);
  score += fruits[level].points;
  updateScore();
  statusLabel.textContent = `${fruits[level].name} made.`;
}

function createFruit(level, x, y) {
  const fruit = fruits[level];
  return {
    level,
    x,
    y,
    radius: fruit.radius,
    vx: 0,
    vy: 0,
    cooldown: mergeCooldown,
  };
}

function dropFruit() {
  if (gameOver) {
    resetGame();
    return;
  }
  if (!canDrop) return;

  const fruit = createFruit(currentLevel, aimX, spawnY);
  fruitBodies.push(fruit);
  currentLevel = nextLevel;
  nextLevel = randomStarter();
  canDrop = false;
  drawNext();
  setTimeout(() => {
    canDrop = !gameOver;
  }, 520);
}

function checkLoseLine() {
  if (gameOver || fruitBodies.length < 4) return;

  const danger = fruitBodies.some((fruit) => {
    const slow = Math.abs(fruit.vx) + Math.abs(fruit.vy) < 0.75;
    return slow && fruit.y - fruit.radius < loseLine;
  });

  if (danger) {
    gameOver = true;
    canDrop = false;
    statusLabel.textContent = "Game over. Press Drop or Restart to play again.";
  }
}

function updateScore() {
  scoreLabel.textContent = score;
  if (score > bestScore) {
    bestScore = score;
    bestScoreLabel.textContent = bestScore;
    localStorage.setItem("suikaBestScore", String(bestScore));
  }
}

function setAimFromClientX(clientX) {
  const rect = canvas.getBoundingClientRect();
  const scale = canvas.width / rect.width;
  const x = (clientX - rect.left) * scale;
  aimX = clamp(x, 28 + fruits[currentLevel].radius, canvas.width - 28 - fruits[currentLevel].radius);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function draw() {
  drawBoard();
  fruitBodies.forEach((fruit) => drawFruit(ctx, fruit.level, fruit.x, fruit.y, fruit.radius));
  if (!gameOver) {
    drawDropper();
  } else {
    drawGameOver();
  }
}

function drawBoard() {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#eff6ff");
  gradient.addColorStop(1, "#fefce8");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#334155";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(28, 36);
  ctx.lineTo(28, canvas.height - 28);
  ctx.lineTo(canvas.width - 28, canvas.height - 28);
  ctx.lineTo(canvas.width - 28, 36);
  ctx.stroke();

  ctx.setLineDash([10, 10]);
  ctx.strokeStyle = "rgba(225, 29, 72, 0.55)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(34, loseLine);
  ctx.lineTo(canvas.width - 34, loseLine);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawDropper() {
  const fruit = fruits[currentLevel];
  ctx.strokeStyle = "rgba(15, 23, 42, 0.24)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(aimX, 30);
  ctx.lineTo(aimX, spawnY);
  ctx.stroke();
  drawFruit(ctx, currentLevel, aimX, spawnY, fruit.radius);
}

function drawFruit(target, level, x, y, radius) {
  const fruit = fruits[level];
  target.fillStyle = fruit.color;
  target.beginPath();
  target.arc(x, y, radius, 0, Math.PI * 2);
  target.fill();

  target.fillStyle = "rgba(255, 255, 255, 0.34)";
  target.beginPath();
  target.arc(x - radius * 0.28, y - radius * 0.3, radius * 0.24, 0, Math.PI * 2);
  target.fill();

  target.strokeStyle = "rgba(15, 23, 42, 0.24)";
  target.lineWidth = Math.max(2, radius * 0.06);
  target.beginPath();
  target.arc(x, y, radius, 0, Math.PI * 2);
  target.stroke();

  if (radius > 26) {
    target.fillStyle = "rgba(15, 23, 42, 0.72)";
    target.beginPath();
    target.arc(x - radius * 0.22, y - radius * 0.08, 3, 0, Math.PI * 2);
    target.arc(x + radius * 0.22, y - radius * 0.08, 3, 0, Math.PI * 2);
    target.fill();
  }
}

function drawNext() {
  nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
  drawFruit(nextCtx, nextLevel, nextCanvas.width / 2, nextCanvas.height / 2, fruits[nextLevel].radius);
}

function drawGameOver() {
  ctx.fillStyle = "rgba(255, 255, 255, 0.76)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#172033";
  ctx.font = "bold 42px system-ui";
  ctx.textAlign = "center";
  ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
}

canvas.addEventListener("pointermove", (event) => setAimFromClientX(event.clientX));
canvas.addEventListener("pointerdown", (event) => {
  setAimFromClientX(event.clientX);
  dropFruit();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
    event.preventDefault();
    aimX = clamp(aimX - 18, 28 + fruits[currentLevel].radius, canvas.width - 28 - fruits[currentLevel].radius);
  }
  if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
    event.preventDefault();
    aimX = clamp(aimX + 18, 28 + fruits[currentLevel].radius, canvas.width - 28 - fruits[currentLevel].radius);
  }
  if (event.code === "Space" || event.key === "Enter") {
    event.preventDefault();
    dropFruit();
  }
});

dropButton.addEventListener("click", dropFruit);
restartButton.addEventListener("click", resetGame);

resetGame();
