const canvas = document.querySelector("#gameCanvas");
const ctx = canvas.getContext("2d");
const scoreLabel = document.querySelector("#score");
const livesLabel = document.querySelector("#lives");
const startButton = document.querySelector("#startButton");
const restartButton = document.querySelector("#restartButton");
const statusLabel = document.querySelector("#status");

const keys = new Set();
const player = { x: 80, y: 240, size: 30, speed: 4 };
const cherry = { x: 430, y: 180, size: 18 };
const jars = [
  { x: 230, y: 120, radius: 18, vx: 2.4, vy: 2.1 },
  { x: 470, y: 320, radius: 20, vx: -2.7, vy: 1.8 },
  { x: 350, y: 245, radius: 16, vx: 2.2, vy: -2.6 },
];

let score = 0;
let lives = 3;
let running = false;
let gameOver = false;
let animationFrame = null;

function resetGame() {
  cancelAnimationFrame(animationFrame);
  player.x = 80;
  player.y = 240;
  score = 0;
  lives = 3;
  running = false;
  gameOver = false;
  keys.clear();
  placeCherry();
  updateHud();
  statusLabel.textContent = "Collect cherries and dodge the bouncing jars.";
  draw();
}

function startGame() {
  if (running || gameOver) return;
  running = true;
  statusLabel.textContent = "Use arrows or WASD to move Tom.";
  loop();
}

function loop() {
  if (!running) return;
  updatePlayer();
  updateJars();
  checkCherry();
  checkHazards();
  draw();
  animationFrame = requestAnimationFrame(loop);
}

function updatePlayer() {
  let dx = 0;
  let dy = 0;

  if (keys.has("ArrowUp") || keys.has("w")) dy -= 1;
  if (keys.has("ArrowDown") || keys.has("s")) dy += 1;
  if (keys.has("ArrowLeft") || keys.has("a")) dx -= 1;
  if (keys.has("ArrowRight") || keys.has("d")) dx += 1;

  if (dx !== 0 && dy !== 0) {
    dx *= Math.SQRT1_2;
    dy *= Math.SQRT1_2;
  }

  player.x = clamp(player.x + dx * player.speed, 20, canvas.width - 20);
  player.y = clamp(player.y + dy * player.speed, 20, canvas.height - 20);
}

function updateJars() {
  jars.forEach((jar) => {
    jar.x += jar.vx;
    jar.y += jar.vy;

    if (jar.x - jar.radius < 0 || jar.x + jar.radius > canvas.width) {
      jar.vx *= -1;
    }
    if (jar.y - jar.radius < 0 || jar.y + jar.radius > canvas.height) {
      jar.vy *= -1;
    }
  });
}

function checkCherry() {
  if (distance(player, cherry) > player.size / 2 + cherry.size) return;
  score += 10;
  player.speed = Math.min(player.speed + 0.12, 6.2);
  placeCherry();
  updateHud();
  statusLabel.textContent = "Cherry collected.";
}

function checkHazards() {
  const hit = jars.some((jar) => distance(player, jar) < player.size / 2 + jar.radius);
  if (!hit) return;

  lives -= 1;
  updateHud();
  player.x = 80;
  player.y = 240;
  statusLabel.textContent = lives > 0 ? "Ouch. Try again." : "Game over. Press Restart.";

  if (lives <= 0) {
    running = false;
    gameOver = true;
    cancelAnimationFrame(animationFrame);
  }
}

function placeCherry() {
  let safe = false;
  while (!safe) {
    cherry.x = 50 + Math.random() * (canvas.width - 100);
    cherry.y = 50 + Math.random() * (canvas.height - 100);
    safe =
      distance(player, cherry) > 100 &&
      jars.every((jar) => distance(jar, cherry) > jar.radius + cherry.size + 40);
  }
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function updateHud() {
  scoreLabel.textContent = score;
  livesLabel.textContent = lives;
}

function draw() {
  drawBackground();
  drawCherry();
  jars.forEach(drawJar);
  drawPlayer();

  if (gameOver) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.76)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#1f2937";
    ctx.font = "bold 42px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
  }
}

function drawBackground() {
  ctx.fillStyle = "#fff7ed";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#dcfce7";
  ctx.fillRect(0, 370, canvas.width, 110);

  ctx.strokeStyle = "rgba(148, 163, 184, 0.26)";
  ctx.lineWidth = 2;
  for (let x = 0; x < canvas.width; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 370);
    ctx.lineTo(x + 24, canvas.height);
    ctx.stroke();
  }
}

function drawPlayer() {
  ctx.fillStyle = "#2563eb";
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.size / 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#fbbf24";
  ctx.beginPath();
  ctx.arc(player.x - 7, player.y - 7, 5, 0, Math.PI * 2);
  ctx.arc(player.x + 7, player.y - 7, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#111827";
  ctx.beginPath();
  ctx.arc(player.x - 5, player.y - 4, 2, 0, Math.PI * 2);
  ctx.arc(player.x + 5, player.y - 4, 2, 0, Math.PI * 2);
  ctx.fill();
}

function drawCherry() {
  ctx.strokeStyle = "#15803d";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(cherry.x, cherry.y - 10);
  ctx.quadraticCurveTo(cherry.x + 10, cherry.y - 30, cherry.x + 26, cherry.y - 34);
  ctx.stroke();

  ctx.fillStyle = "#e11d48";
  ctx.beginPath();
  ctx.arc(cherry.x - 8, cherry.y + 4, cherry.size, 0, Math.PI * 2);
  ctx.arc(cherry.x + 10, cherry.y + 4, cherry.size, 0, Math.PI * 2);
  ctx.fill();
}

function drawJar(jar) {
  ctx.fillStyle = "#94a3b8";
  ctx.fillRect(jar.x - jar.radius, jar.y - jar.radius, jar.radius * 2, jar.radius * 2.2);

  ctx.fillStyle = "#475569";
  ctx.fillRect(jar.x - jar.radius * 0.7, jar.y - jar.radius - 6, jar.radius * 1.4, 8);
}

function setDirection(direction, active) {
  const map = {
    up: "ArrowUp",
    down: "ArrowDown",
    left: "ArrowLeft",
    right: "ArrowRight",
  };
  if (active) {
    keys.add(map[direction]);
    startGame();
  } else {
    keys.delete(map[direction]);
  }
}

document.addEventListener("keydown", (event) => {
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d"].includes(key)) {
    event.preventDefault();
    keys.add(key);
    startGame();
  }
});

document.addEventListener("keyup", (event) => {
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
  keys.delete(key);
});

document.querySelectorAll("[data-dir]").forEach((button) => {
  button.addEventListener("pointerdown", () => setDirection(button.dataset.dir, true));
  button.addEventListener("pointerup", () => setDirection(button.dataset.dir, false));
  button.addEventListener("pointerleave", () => setDirection(button.dataset.dir, false));
  button.addEventListener("pointercancel", () => setDirection(button.dataset.dir, false));
});

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", resetGame);

resetGame();
