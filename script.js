const puzzles = [
  {
    name: "Sunny Garden",
    colors: {
      1: { name: "Sky", value: "#93c5fd" },
      2: { name: "Sun", value: "#facc15" },
      3: { name: "Leaf", value: "#22c55e" },
      4: { name: "Petal", value: "#fb7185" },
      5: { name: "Soil", value: "#92400e" },
      6: { name: "Cloud", value: "#f8fafc" },
    },
    grid: [
      "11111122221111",
      "11111222222111",
      "11611222221161",
      "11111122211111",
      "11111111111111",
      "11114411441111",
      "11144444444111",
      "11334433443311",
      "11333433343311",
      "11133333331111",
      "11113333311111",
      "11555333555111",
      "15555555555511",
      "55555555555555",
    ],
  },
  {
    name: "Rocket Night",
    colors: {
      1: { name: "Space", value: "#172554" },
      2: { name: "Star", value: "#fde68a" },
      3: { name: "Rocket", value: "#e2e8f0" },
      4: { name: "Window", value: "#38bdf8" },
      5: { name: "Flame", value: "#f97316" },
      6: { name: "Fin", value: "#ef4444" },
    },
    grid: [
      "11112111121111",
      "11211111111121",
      "11111133111111",
      "12111333311112",
      "11113344331111",
      "11133344333111",
      "11133333333111",
      "11233333333211",
      "11133333333111",
      "11163333336111",
      "11663333366111",
      "11111555111111",
      "11115555511111",
      "11215555512111",
    ],
  },
  {
    name: "Ocean Turtle",
    colors: {
      1: { name: "Water", value: "#22d3ee" },
      2: { name: "Shell", value: "#16a34a" },
      3: { name: "Skin", value: "#86efac" },
      4: { name: "Spot", value: "#14532d" },
      5: { name: "Sand", value: "#fcd34d" },
    },
    grid: [
      "11111111111111",
      "11111111111111",
      "11113311133111",
      "11133333333311",
      "11332222223331",
      "11332242423331",
      "13322224222331",
      "13322422242331",
      "11332222223331",
      "11133333333311",
      "11113311133111",
      "11111111111111",
      "11555111555111",
      "55555555555555",
    ],
  },
  {
    name: "Rainbow Heart",
    colors: {
      0: { name: "Paper", value: "#f8fafc" },
      1: { name: "Blush", value: "#fb7185" },
      2: { name: "Orange", value: "#fb923c" },
      3: { name: "Lemon", value: "#fde047" },
      4: { name: "Mint", value: "#4ade80" },
      5: { name: "Blue", value: "#60a5fa" },
      6: { name: "Violet", value: "#a78bfa" },
    },
    grid: [
      "00000000000000",
      "00011000011000",
      "00111100111100",
      "01111111111110",
      "01112222211110",
      "00122222222200",
      "00023333332000",
      "00003333330000",
      "00000444400000",
      "00000044000000",
      "00000055000000",
      "00000066000000",
      "00000000000000",
      "00000000000000",
    ],
  },
  {
    name: "Cozy Cat",
    colors: {
      1: { name: "Wall", value: "#bfdbfe" },
      2: { name: "Fur", value: "#f59e0b" },
      3: { name: "Stripe", value: "#92400e" },
      4: { name: "Nose", value: "#f472b6" },
      5: { name: "Eye", value: "#111827" },
      6: { name: "Rug", value: "#14b8a6" },
    },
    grid: [
      "11111111111111",
      "11121111112111",
      "11222111122211",
      "11222222222211",
      "11225222522211",
      "11222244222211",
      "11122222222111",
      "11132233223111",
      "11222222222211",
      "12222222222221",
      "12232222232221",
      "11222222222211",
      "11666666666611",
      "66666666666666",
    ],
  },
  {
    name: "Castle Day",
    colors: {
      1: { name: "Sky", value: "#7dd3fc" },
      2: { name: "Stone", value: "#94a3b8" },
      3: { name: "Flag", value: "#ef4444" },
      4: { name: "Roof", value: "#6366f1" },
      5: { name: "Door", value: "#78350f" },
      6: { name: "Grass", value: "#22c55e" },
    },
    grid: [
      "11111133111111",
      "11111133111111",
      "11114444441111",
      "11114222241111",
      "11444222244411",
      "11222222222211",
      "11222222222211",
      "11225222252211",
      "11222222222211",
      "11222255222211",
      "11222255222211",
      "11222255222211",
      "66666666666666",
      "66666666666666",
    ],
  },
  {
    name: "Cupcake Party",
    colors: {
      1: { name: "Table", value: "#fef3c7" },
      2: { name: "Cake", value: "#f9a8d4" },
      3: { name: "Wrapper", value: "#38bdf8" },
      4: { name: "Cherry", value: "#dc2626" },
      5: { name: "Sprinkle", value: "#7c3aed" },
      6: { name: "Cream", value: "#fff7ed" },
    },
    grid: [
      "11111144111111",
      "11111144111111",
      "11116666661111",
      "11162656562111",
      "11622222222611",
      "16222222222261",
      "12252252252221",
      "12222222222221",
      "11222222222211",
      "11133333333111",
      "11133333333111",
      "11133333333111",
      "11333333333311",
      "11111111111111",
    ],
  },
  {
    name: "Mountain Cabin",
    colors: {
      1: { name: "Sky", value: "#bae6fd" },
      2: { name: "Snow", value: "#f8fafc" },
      3: { name: "Pine", value: "#166534" },
      4: { name: "Cabin", value: "#b45309" },
      5: { name: "Roof", value: "#475569" },
      6: { name: "Path", value: "#d6d3d1" },
    },
    grid: [
      "11111111111111",
      "11111122111111",
      "11111222211111",
      "11112222221111",
      "11122222222111",
      "11333222233311",
      "11333322333311",
      "11133555533111",
      "11135444453111",
      "11134464443111",
      "11144466444111",
      "11344466444311",
      "33366666666333",
      "33366666666333",
    ],
  },
];

const board = document.querySelector("#board");
const palette = document.querySelector("#palette");
const progressFill = document.querySelector("#progressFill");
const progressLabel = document.querySelector("#progressLabel");
const puzzleTitle = document.querySelector("#puzzleTitle");
const puzzleSelect = document.querySelector("#puzzleSelect");
const message = document.querySelector("#message");
const hintButton = document.querySelector("#hintButton");
const resetButton = document.querySelector("#resetButton");

let puzzleIndex = 0;
let selectedNumber = "1";
let filled = new Map();

function puzzleCells(puzzle) {
  return puzzle.grid.flatMap((row) => row.split(""));
}

function countsFor(puzzle) {
  return puzzleCells(puzzle).reduce((counts, number) => {
    counts[number] = (counts[number] || 0) + 1;
    return counts;
  }, {});
}

function loadPuzzle(index) {
  puzzleIndex = index;
  filled = new Map();
  const puzzle = puzzles[puzzleIndex];
  selectedNumber = Object.keys(puzzle.colors)[0];
  puzzleTitle.textContent = puzzle.name;
  message.textContent = "Pick a color, then fill every square with that number.";
  message.classList.remove("win");
  renderPalette();
  renderBoard();
  updateProgress();
}

function renderPuzzleOptions() {
  puzzleSelect.innerHTML = "";
  puzzles.forEach((puzzle, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = puzzle.name;
    puzzleSelect.append(option);
  });
}

function renderPalette() {
  const puzzle = puzzles[puzzleIndex];
  const counts = countsFor(puzzle);
  palette.innerHTML = "";

  Object.entries(puzzle.colors).forEach(([number, color]) => {
    const remaining = counts[number] - [...filled.values()].filter((value) => value === number).length;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "swatch";
    button.classList.toggle("active", selectedNumber === number);
    button.classList.toggle("done", remaining === 0);
    button.dataset.number = number;
    button.innerHTML = `
      <span class="chip" style="background:${color.value}">${number}</span>
      <span class="swatch-name">${color.name}</span>
      <span class="count">${remaining}</span>
    `;
    button.addEventListener("click", () => {
      selectedNumber = number;
      renderPalette();
    });
    palette.append(button);
  });
}

function renderBoard() {
  const puzzle = puzzles[puzzleIndex];
  board.innerHTML = "";
  board.style.setProperty("--size", puzzle.grid.length);

  puzzleCells(puzzle).forEach((number, index) => {
    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = "cell";
    cell.dataset.index = index;
    cell.dataset.number = number;
    paintCell(cell, filled.get(index), number);
    cell.addEventListener("click", () => fillCell(cell));
    board.append(cell);
  });
}

function paintCell(cell, colorNumber, answerNumber) {
  const puzzle = puzzles[puzzleIndex];
  const number = colorNumber || answerNumber;
  const color = puzzle.colors[number];
  cell.textContent = colorNumber ? "" : answerNumber;
  cell.classList.toggle("filled", Boolean(colorNumber));
  cell.style.background = colorNumber ? color.value : "#ffffff";
}

function fillCell(cell) {
  const index = Number(cell.dataset.index);
  const answer = cell.dataset.number;

  if (filled.has(index)) return;

  if (selectedNumber !== answer) {
    cell.classList.remove("wrong");
    requestAnimationFrame(() => cell.classList.add("wrong"));
    message.textContent = `That square needs color ${answer}.`;
    return;
  }

  filled.set(index, selectedNumber);
  paintCell(cell, selectedNumber, answer);
  message.textContent = "Nice. Keep going.";
  message.classList.remove("win");
  renderPalette();
  updateProgress();
}

function updateProgress() {
  const puzzle = puzzles[puzzleIndex];
  const total = puzzleCells(puzzle).length;
  const percent = Math.round((filled.size / total) * 100);
  progressFill.style.width = `${percent}%`;
  progressLabel.textContent = `${percent}%`;

  if (filled.size === total) {
    message.textContent = `${puzzle.name} is complete. Beautiful work.`;
    message.classList.add("win");
  }
}

function fillHint() {
  const cells = [...board.querySelectorAll(".cell")];
  const match = cells.find((cell) => {
    const index = Number(cell.dataset.index);
    return cell.dataset.number === selectedNumber && !filled.has(index);
  });

  if (!match) {
    message.textContent = `No empty squares for color ${selectedNumber}.`;
    return;
  }

  fillCell(match);
  match.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
}

puzzleSelect.addEventListener("change", (event) => loadPuzzle(Number(event.target.value)));
hintButton.addEventListener("click", fillHint);
resetButton.addEventListener("click", () => loadPuzzle(puzzleIndex));

renderPuzzleOptions();
loadPuzzle(0);
