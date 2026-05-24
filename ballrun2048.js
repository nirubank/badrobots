const canvas = document.querySelector("#gameCanvas");
const ctx = canvas.getContext("2d");
const valueLabel = document.querySelector("#valueLabel");
const bestLabel = document.querySelector("#bestLabel");
const startButton = document.querySelector("#startButton");
const restartButton = document.querySelector("#restartButton");
const statusLabel = document.querySelector("#status");

const lanes = [110, 210, 310, 410];
const ball = { lane: 1, x: lanes[1], y: 595, radius: 34, value: 2 };
const colors = {
  2: "#38bdf8",
  4: "#22c55e",
  8: "#f59e0b",
  16: "#f97316",
  32: "#ef4444",
  64: "#ec4899",
  128: "#a855f7",
  256: "#6366f1",
  512: "#14b8a6",
  1024: "#facc15",
  2048: "#f8fafc",
};

let items = [];
let running = false;
let gameOver = false;
let won = false;
let speed = 2.9;
let spawnTimer = 0;
let distance = 0;
let best = Number(localStorage.getItem("ballrun2048Best") || 2);
let animationFrame = null;
let leftHeld = false;
let rightHeld = false;

bestLabel.textContent = best;

function resetGame() {
  cancelAnimationFrame(animationFrame);
  ball.lane = 1;
  ball.x = lanes[1];
  ball.value = 2;
  items = [];
  running = false;
  gameOver = false;
  won = false;
  speed = 2.9;
  spawnTimer = 0;
  distance = 0;
  leftHeld = false;
  rightHeld = false;
  updateHud();
  statusLabel.textContent = "Steer into matching numbers to merge. Reach 2048.";
  draw();
}

function startGame() {
  if (running || gameOver) return;
  running = true;
  statusLabel.textContent = "Use arrows, A/D, or the buttons to change lanes.";
  loop();
}

function loop() {
  if (!running) return;
  update();
  draw();
  animationFrame = requestAnimationFrame(loop);
}

function update() {
  distance += speed;
  spawnTimer -= speed;
  speed = Math.min(5.8, speed + 0.0009);
  moveTowardLane();

  if (spawnTimer <= 0) {
    spawnRow();
    spawnTimer = 122 - Math.min(38, distance / 180);
  }

  items.forEach((item) => {
    item.y += speed;
  });

  items = items.filter((item) => item.y < canvas.height + 70 && !item.used);
  checkCollisions();
}

function moveTowardLane() {
  if (leftHeld) moveLane(-1);
  if (rightHeld) moveLane(1);

  const target = lanes[ball.lane];
  ball.x += (target - ball.x) * 0.22;
}

function moveLane(delta) {
  const nextLane = Math.max(0, Math.min(lanes.length - 1, ball.lane + delta));
  if (nextLane === ball.lane) return;
  ball.lane = nextLane;
  leftHeld = false;
  rightHeld = false;
}

function spawnRow() {
  const openLane = Math.floor(Math.random() * lanes.length);
  const matchingLane = Math.random() < 0.58 ? openLane : Math.floor(Math.random() * lanes.length);

  lanes.forEach((x, lane) => {
    if (lane === openLane && Math.random() < 0.35) return;
    const isMatch = lane === matchingLane;
    const blocker = !isMatch && Math.random() < 0.24;
    items.push({
      lane,
      x,
      y: -42,
      radius: blocker ? 24 : 29,
      value: blocker ? 0 : pickValue(isMatch),
      type: blocker ? "blocker" : "number",
      used: false,
    });
  });
}

function pickValue(preferMatch) {
  if (preferMatch) return ball.value;

  const values = [2, 4, 8, 16, 32, 64, 128].filter((value) => value <= Math.max(8, ball.value * 2));
  let value = values[Math.floor(Math.random() * values.length)];
  if (value === ball.value && Math.random() < 0.7) {
    value = values[(values.indexOf(value) + 1) % values.length];
  }
  return value;
}

function checkCollisions() {
  items.forEach((item) => {
    if (item.used || Math.hypot(item.x - ball.x, item.y - ball.y) > item.radius + ball.radius) return;
    item.used = true;

    if (item.type === "blocker") {
      endGame("Game over. A blocker stopped the run.");
      return;
    }

    if (item.value === ball.value) {
      ball.value *= 2;
      statusLabel.textContent = `Merged to ${ball.value}.`;
      updateHud();
      if (ball.value >= 2048) {
        won = true;
        endGame("You reached 2048. Beautiful run.");
      }
      return;
    }

    if (item.value < ball.value) {
      statusLabel.textContent = `${item.value} bounced away. Keep rolling.`;
      return;
    }

    endGame(`Game over. ${item.value} was too big to merge.`);
  });
}

function endGame(message) {
  running = false;
  gameOver = true;
  cancelAnimationFrame(animationFrame);
  statusLabel.textContent = message;
  draw();
}

function updateHud() {
  valueLabel.textContent = ball.value;
  if (ball.value > best) {
    best = ball.value;
    bestLabel.textContent = best;
    localStorage.setItem("ballrun2048Best", String(best));
  }
}

function draw() {
  drawTrack();
  items.forEach(drawItem);
  drawBall(ball.x, ball.y, ball.radius, ball.value);

  if (gameOver) {
    ctx.fillStyle = "rgba(15, 23, 42, 0.72)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = won ? "#facc15" : "#f8fafc";
    ctx.font = "bold 40px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(won ? "2048!" : "Game Over", canvas.width / 2, canvas.height / 2);
  }
}

function drawTrack() {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#172033");
  gradient.addColorStop(1, "#0f172a");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(15, 23, 42, 0.45)";
  ctx.fillRect(64, 0, canvas.width - 128, canvas.height);

  ctx.strokeStyle = "rgba(248, 250, 252, 0.16)";
  ctx.lineWidth = 3;
  for (let i = 0; i <= lanes.length; i += 1) {
    const x = 60 + i * 100;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  ctx.strokeStyle = "rgba(56, 189, 248, 0.18)";
  ctx.lineWidth = 2;
  for (let y = (distance % 80) - 80; y < canvas.height; y += 80) {
    ctx.beginPath();
    ctx.moveTo(64, y);
    ctx.lineTo(canvas.width - 64, y);
    ctx.stroke();
  }
}

function drawItem(item) {
  if (item.type === "blocker") {
    ctx.fillStyle = "#475569";
    ctx.fillRect(item.x - 28, item.y - 22, 56, 44);
    ctx.strokeStyle = "#f8fafc";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(item.x - 16, item.y - 12);
    ctx.lineTo(item.x + 16, item.y + 12);
    ctx.moveTo(item.x + 16, item.y - 12);
    ctx.lineTo(item.x - 16, item.y + 12);
    ctx.stroke();
    return;
  }

  drawBall(item.x, item.y, item.radius, item.value);
}

function drawBall(x, y, radius, value) {
  ctx.fillStyle = colors[value] || "#f8fafc";
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(255, 255, 255, 0.32)";
  ctx.beginPath();
  ctx.arc(x - radius * 0.28, y - radius * 0.3, radius * 0.22, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(15, 23, 42, 0.35)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = value >= 1024 ? "#172033" : "#f8fafc";
  ctx.font = `bold ${value >= 1000 ? 20 : 23}px system-ui`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(value, x, y + 1);
}

function setHeld(direction, held) {
  if (direction === "left") leftHeld = held;
  if (direction === "right") rightHeld = held;
  if (held) startGame();
}

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
    event.preventDefault();
    setHeld("left", true);
  }
  if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
    event.preventDefault();
    setHeld("right", true);
  }
});

document.addEventListener("keyup", (event) => {
  if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") setHeld("left", false);
  if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") setHeld("right", false);
});

document.querySelectorAll("[data-dir]").forEach((button) => {
  button.addEventListener("pointerdown", () => setHeld(button.dataset.dir, true));
  button.addEventListener("pointerup", () => setHeld(button.dataset.dir, false));
  button.addEventListener("pointerleave", () => setHeld(button.dataset.dir, false));
  button.addEventListener("pointercancel", () => setHeld(button.dataset.dir, false));
});

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", resetGame);

resetGame();
