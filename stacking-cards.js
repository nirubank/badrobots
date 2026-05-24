const canvas = document.querySelector("#gameCanvas");
const ctx = canvas.getContext("2d");
const cardsLabel = document.querySelector("#cardsLabel");
const bestLabel = document.querySelector("#bestLabel");
const balanceFill = document.querySelector("#balanceFill");
const dropButton = document.querySelector("#dropButton");
const restartButton = document.querySelector("#restartButton");
const statusLabel = document.querySelector("#status");

const cardWidth = 176;
const cardHeight = 54;
const baseY = canvas.height - 86;
const centerX = canvas.width / 2;
const suits = ["♥", "♦", "♣", "♠"];
const ranks = ["A", "2", "3", "4", "5", "7", "9", "J", "Q", "K"];

let stack = [];
let movingCard;
let direction = 1;
let speed = 3.2;
let wobble = 0;
let cards = 0;
let best = Number(localStorage.getItem("stackingCardsBest") || 0);
let running = false;
let gameOver = false;
let animationFrame = null;

bestLabel.textContent = best;

function resetGame() {
  cancelAnimationFrame(animationFrame);
  stack = [
    {
      x: centerX,
      y: baseY,
      angle: 0,
      rank: "Base",
      suit: "",
      color: "#e2e8f0",
    },
  ];
  direction = 1;
  speed = 3.2;
  wobble = 0;
  cards = 0;
  running = false;
  gameOver = false;
  createMovingCard();
  updateHud();
  statusLabel.textContent = "Drop cards as close to center as you can.";
  draw();
}

function createMovingCard() {
  const top = stack[stack.length - 1];
  movingCard = {
    x: direction > 0 ? 92 : canvas.width - 92,
    y: Math.max(86, top.y - cardHeight - 10),
    angle: 0,
    rank: ranks[Math.floor(Math.random() * ranks.length)],
    suit: suits[Math.floor(Math.random() * suits.length)],
    color: "#ffffff",
  };
}

function startGame() {
  if (running || gameOver) return;
  running = true;
  statusLabel.textContent = "Drop when the moving card lines up with the stack.";
  loop();
}

function loop() {
  if (!running) return;
  movingCard.x += speed * direction;
  if (movingCard.x > canvas.width - 94) {
    movingCard.x = canvas.width - 94;
    direction = -1;
  }
  if (movingCard.x < 94) {
    movingCard.x = 94;
    direction = 1;
  }
  wobble *= 0.985;
  draw();
  animationFrame = requestAnimationFrame(loop);
}

function dropCard() {
  if (gameOver) {
    resetGame();
    startGame();
    return;
  }

  if (!running) {
    startGame();
    return;
  }

  const top = stack[stack.length - 1];
  const offset = movingCard.x - top.x;
  const absOffset = Math.abs(offset);
  const allowed = 86 - Math.min(cards * 1.2, 34);

  if (absOffset > allowed) {
    endGame("The card slipped off the tower.");
    return;
  }

  const quality = Math.max(0, 1 - absOffset / allowed);
  wobble += offset / 34;
  cards += quality > 0.82 ? 2 : 1;
  speed = Math.min(7.5, speed + 0.18);

  const placed = {
    ...movingCard,
    x: top.x + offset * 0.32,
    y: top.y - cardHeight + 6,
    angle: clamp(offset / 220 + wobble * 0.025, -0.18, 0.18),
  };
  stack.push(placed);

  if (Math.abs(wobble) > 8.5) {
    endGame("Too much wobble. The tower fell.");
    return;
  }

  if (placed.y < 112) {
    stack = stack.map((card) => ({ ...card, y: card.y + cardHeight - 6 }));
  }

  updateHud();
  statusLabel.textContent = quality > 0.82 ? "Clean stack. Bonus card!" : "Stacked.";
  direction *= -1;
  createMovingCard();
}

function endGame(message) {
  running = false;
  gameOver = true;
  cancelAnimationFrame(animationFrame);
  statusLabel.textContent = message;
  draw();
}

function updateHud() {
  cardsLabel.textContent = cards;
  const balance = Math.max(0, Math.round((1 - Math.abs(wobble) / 8.5) * 100));
  balanceFill.style.width = `${balance}%`;
  if (cards > best) {
    best = cards;
    bestLabel.textContent = best;
    localStorage.setItem("stackingCardsBest", String(best));
  }
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function draw() {
  drawBackground();
  stack.forEach(drawCard);
  if (!gameOver) drawCard(movingCard, true);

  if (gameOver) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.76)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#172033";
    ctx.font = "bold 40px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
  }
}

function drawBackground() {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#eef2ff");
  gradient.addColorStop(1, "#ecfeff");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#cbd5e1";
  ctx.fillRect(65, baseY + cardHeight / 2 + 12, canvas.width - 130, 18);

  ctx.strokeStyle = "rgba(15, 23, 42, 0.12)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(centerX, 70);
  ctx.lineTo(centerX, canvas.height - 70);
  ctx.stroke();
}

function drawCard(card, moving = false) {
  ctx.save();
  ctx.translate(card.x, card.y);
  ctx.rotate(card.angle + (moving ? Math.sin(Date.now() / 140) * 0.015 : 0));

  ctx.fillStyle = moving ? "#fefce8" : card.color;
  ctx.strokeStyle = "#172033";
  ctx.lineWidth = 3;
  roundRect(-cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight, 8);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = card.suit === "♥" || card.suit === "♦" ? "#dc2626" : "#172033";
  ctx.font = card.rank === "Base" ? "bold 18px system-ui" : "bold 24px system-ui";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(card.rank, -cardWidth / 2 + 14, -cardHeight / 2 + 10);
  ctx.textAlign = "right";
  ctx.fillText(card.suit, cardWidth / 2 - 14, -cardHeight / 2 + 10);

  if (card.rank !== "Base") {
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 28px system-ui";
    ctx.fillText(card.suit, 0, 3);
  }

  ctx.restore();
}

function roundRect(x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

dropButton.addEventListener("click", dropCard);
restartButton.addEventListener("click", resetGame);

document.addEventListener("keydown", (event) => {
  if (event.code === "Space" || event.key === "Enter") {
    event.preventDefault();
    dropCard();
  }
});

canvas.addEventListener("pointerdown", dropCard);

resetGame();
