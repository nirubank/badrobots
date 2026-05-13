const canvas = document.querySelector("#gameCanvas");
const ctx = canvas.getContext("2d");
const scoreLabel = document.querySelector("#score");
const bestScoreLabel = document.querySelector("#bestScore");
const dropButton = document.querySelector("#dropButton");
const restartButton = document.querySelector("#restartButton");
const statusLabel = document.querySelector("#status");

const blockHeight = 34;
const startWidth = 280;
const baseY = canvas.height - 70;
const colors = ["#f59e0b", "#14b8a6", "#60a5fa", "#f472b6", "#a78bfa", "#22c55e"];

let tower = [];
let movingBlock;
let direction = 1;
let speed = 3;
let score = 0;
let bestScore = Number(localStorage.getItem("stackingBestScore") || 0);
let running = false;
let gameOver = false;
let animationFrame = null;

bestScoreLabel.textContent = bestScore;

function resetGame() {
  cancelAnimationFrame(animationFrame);
  tower = [
    {
      x: (canvas.width - startWidth) / 2,
      y: baseY,
      width: startWidth,
      color: "#64748b",
    },
  ];
  score = 0;
  speed = 3;
  direction = 1;
  running = false;
  gameOver = false;
  createMovingBlock();
  updateScore();
  statusLabel.textContent = "Press Drop or Space to start.";
  draw();
}

function createMovingBlock() {
  const previous = tower[tower.length - 1];
  movingBlock = {
    x: direction > 0 ? -previous.width : canvas.width,
    y: previous.y - blockHeight,
    width: previous.width,
    color: colors[tower.length % colors.length],
  };
}

function startGame() {
  if (running || gameOver) return;
  running = true;
  statusLabel.textContent = "Line it up, then drop.";
  loop();
}

function loop() {
  if (!running) return;
  movingBlock.x += speed * direction;

  if (movingBlock.x + movingBlock.width > canvas.width) {
    movingBlock.x = canvas.width - movingBlock.width;
    direction = -1;
  }

  if (movingBlock.x < 0) {
    movingBlock.x = 0;
    direction = 1;
  }

  draw();
  animationFrame = requestAnimationFrame(loop);
}

function dropBlock() {
  if (gameOver) {
    resetGame();
    startGame();
    return;
  }

  if (!running) {
    startGame();
    return;
  }

  const previous = tower[tower.length - 1];
  const overlapStart = Math.max(movingBlock.x, previous.x);
  const overlapEnd = Math.min(movingBlock.x + movingBlock.width, previous.x + previous.width);
  const overlap = overlapEnd - overlapStart;

  if (overlap <= 0) {
    endGame();
    return;
  }

  const perfect = Math.abs(movingBlock.x - previous.x) < 5;
  const placed = {
    x: perfect ? previous.x : overlapStart,
    y: movingBlock.y,
    width: perfect ? previous.width : overlap,
    color: movingBlock.color,
  };

  tower.push(placed);
  score += perfect ? 2 : 1;
  speed = Math.min(speed + 0.18, 8);
  direction *= -1;
  updateScore();
  statusLabel.textContent = perfect ? "Perfect drop!" : "Nice stack.";
  scrollTowerIfNeeded();
  createMovingBlock();
}

function scrollTowerIfNeeded() {
  if (tower[tower.length - 1].y > 130) return;
  tower = tower.map((block) => ({
    ...block,
    y: block.y + blockHeight,
  }));
}

function endGame() {
  running = false;
  gameOver = true;
  cancelAnimationFrame(animationFrame);
  statusLabel.textContent = "Game over. Press Drop or Restart to play again.";
  draw(true);
}

function updateScore() {
  scoreLabel.textContent = score;
  if (score > bestScore) {
    bestScore = score;
    bestScoreLabel.textContent = bestScore;
    localStorage.setItem("stackingBestScore", String(bestScore));
  }
}

function draw(gameOverOverlay = false) {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#0f172a");
  gradient.addColorStop(1, "#172033");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawGuide();
  tower.forEach(drawBlock);
  if (!gameOver) drawBlock(movingBlock);

  if (gameOverOverlay) {
    ctx.fillStyle = "rgba(15, 23, 42, 0.72)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 42px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
  }
}

function drawGuide() {
  ctx.strokeStyle = "rgba(248, 250, 252, 0.08)";
  ctx.lineWidth = 1;
  for (let y = baseY; y > 80; y -= blockHeight) {
    ctx.beginPath();
    ctx.moveTo(60, y + blockHeight);
    ctx.lineTo(canvas.width - 60, y + blockHeight);
    ctx.stroke();
  }
}

function drawBlock(block) {
  ctx.fillStyle = block.color;
  ctx.fillRect(block.x, block.y, block.width, blockHeight);
  ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
  ctx.fillRect(block.x, block.y, block.width, 7);
  ctx.strokeStyle = "rgba(15, 23, 42, 0.35)";
  ctx.lineWidth = 2;
  ctx.strokeRect(block.x, block.y, block.width, blockHeight);
}

dropButton.addEventListener("click", dropBlock);
restartButton.addEventListener("click", resetGame);

document.addEventListener("keydown", (event) => {
  if (event.code === "Space" || event.code === "Enter") {
    event.preventDefault();
    dropBlock();
  }
});

resetGame();
