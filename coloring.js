const pictures = [
  {
    name: "Happy Flower",
    shapes: [
      { type: "circle", attrs: { cx: 320, cy: 175, r: 72 } },
      { type: "circle", attrs: { cx: 430, cy: 235, r: 72 } },
      { type: "circle", attrs: { cx: 430, cy: 365, r: 72 } },
      { type: "circle", attrs: { cx: 320, cy: 425, r: 72 } },
      { type: "circle", attrs: { cx: 210, cy: 365, r: 72 } },
      { type: "circle", attrs: { cx: 210, cy: 235, r: 72 } },
      { type: "circle", attrs: { cx: 320, cy: 300, r: 82 } },
      { type: "path", attrs: { d: "M315 385 C250 440 230 515 250 585 C315 550 350 475 338 385 Z" } },
      { type: "path", attrs: { d: "M345 438 C420 420 485 455 520 520 C440 542 375 515 345 438 Z" } },
    ],
    lines: [
      { type: "path", attrs: { d: "M290 285 Q305 270 320 285 Q335 270 350 285" } },
      { type: "path", attrs: { d: "M282 330 Q320 360 358 330" } },
      { type: "circle", attrs: { cx: 288, cy: 302, r: 6 } },
      { type: "circle", attrs: { cx: 352, cy: 302, r: 6 } },
    ],
  },
  {
    name: "Little House",
    shapes: [
      { type: "rect", attrs: { x: 170, y: 285, width: 300, height: 240, rx: 8 } },
      { type: "path", attrs: { d: "M130 300 L320 130 L510 300 Z" } },
      { type: "rect", attrs: { x: 285, y: 390, width: 70, height: 135, rx: 6 } },
      { type: "rect", attrs: { x: 210, y: 330, width: 62, height: 58, rx: 5 } },
      { type: "rect", attrs: { x: 368, y: 330, width: 62, height: 58, rx: 5 } },
      { type: "rect", attrs: { x: 405, y: 150, width: 45, height: 95, rx: 6 } },
      { type: "path", attrs: { d: "M35 525 C140 500 210 545 320 520 C430 495 520 530 605 510 L605 620 L35 620 Z" } },
    ],
    lines: [
      { type: "path", attrs: { d: "M241 330 L241 388 M210 359 L272 359" } },
      { type: "path", attrs: { d: "M399 330 L399 388 M368 359 L430 359" } },
      { type: "circle", attrs: { cx: 340, cy: 458, r: 5 } },
    ],
  },
  {
    name: "Smiling Fish",
    shapes: [
      { type: "ellipse", attrs: { cx: 300, cy: 320, rx: 175, ry: 112 } },
      { type: "path", attrs: { d: "M120 320 L40 235 L40 405 Z" } },
      { type: "path", attrs: { d: "M305 208 C350 130 420 130 455 215 Z" } },
      { type: "path", attrs: { d: "M305 432 C350 510 420 510 455 425 Z" } },
      { type: "circle", attrs: { cx: 390, cy: 290, r: 34 } },
      { type: "path", attrs: { d: "M185 245 C235 288 235 352 185 395 C150 345 150 295 185 245 Z" } },
      { type: "path", attrs: { d: "M258 230 C310 282 310 358 258 410 C220 350 220 290 258 230 Z" } },
    ],
    lines: [
      { type: "circle", attrs: { cx: 398, cy: 288, r: 8 } },
      { type: "path", attrs: { d: "M405 346 Q445 365 480 335" } },
      { type: "path", attrs: { d: "M505 280 Q535 320 505 360" } },
    ],
  },
  {
    name: "Space Rocket",
    shapes: [
      { type: "path", attrs: { d: "M320 70 C410 160 410 325 320 430 C230 325 230 160 320 70 Z" } },
      { type: "circle", attrs: { cx: 320, cy: 210, r: 56 } },
      { type: "path", attrs: { d: "M246 332 L150 455 L275 420 Z" } },
      { type: "path", attrs: { d: "M394 332 L490 455 L365 420 Z" } },
      { type: "path", attrs: { d: "M278 420 L320 580 L362 420 Z" } },
      { type: "circle", attrs: { cx: 115, cy: 130, r: 28 } },
      { type: "circle", attrs: { cx: 505, cy: 115, r: 18 } },
      { type: "circle", attrs: { cx: 510, cy: 530, r: 36 } },
    ],
    lines: [
      { type: "path", attrs: { d: "M275 315 L365 315" } },
      { type: "path", attrs: { d: "M298 480 L320 555 L342 480" } },
    ],
  },
];

const colors = [
  "#ef4444",
  "#f97316",
  "#facc15",
  "#22c55e",
  "#14b8a6",
  "#38bdf8",
  "#6366f1",
  "#a855f7",
  "#ec4899",
  "#a16207",
  "#94a3b8",
  "#111827",
];

const svg = document.querySelector("#coloringPage");
const palette = document.querySelector("#palette");
const pictureSelect = document.querySelector("#pictureSelect");
const pictureTitle = document.querySelector("#pictureTitle");
const eraserButton = document.querySelector("#eraserButton");
const clearButton = document.querySelector("#clearButton");
const saveButton = document.querySelector("#saveButton");
const statusLabel = document.querySelector("#status");

let currentPicture = 0;
let currentColor = colors[0];
let erasing = false;

function makeSvgElement(type, attrs, className) {
  const element = document.createElementNS("http://www.w3.org/2000/svg", type);
  Object.entries(attrs).forEach(([name, value]) => element.setAttribute(name, value));
  element.classList.add(className);
  return element;
}

function renderPictureOptions() {
  pictures.forEach((picture, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = picture.name;
    pictureSelect.append(option);
  });
}

function renderPalette() {
  palette.innerHTML = "";
  colors.forEach((color) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "color-button";
    button.classList.toggle("active", currentColor === color && !erasing);
    button.style.background = color;
    button.title = color;
    button.addEventListener("click", () => {
      currentColor = color;
      erasing = false;
      statusLabel.textContent = "Tap a shape to color it.";
      renderPalette();
      renderToolStates();
    });
    palette.append(button);
  });
}

function renderToolStates() {
  eraserButton.classList.toggle("active", erasing);
}

function loadPicture(index) {
  currentPicture = index;
  const picture = pictures[currentPicture];
  pictureTitle.textContent = picture.name;
  svg.innerHTML = "";

  picture.shapes.forEach((shape) => {
    const element = makeSvgElement(shape.type, shape.attrs, "paintable");
    element.addEventListener("click", () => {
      element.style.fill = erasing ? "#ffffff" : currentColor;
      statusLabel.textContent = erasing ? "Shape erased." : "Shape colored.";
    });
    svg.append(element);
  });

  picture.lines.forEach((line) => {
    svg.append(makeSvgElement(line.type, line.attrs, "line"));
  });

  statusLabel.textContent = "Choose a color and tap a shape.";
}

function clearPicture() {
  svg.querySelectorAll(".paintable").forEach((shape) => {
    shape.style.fill = "#ffffff";
  });
  statusLabel.textContent = "Picture cleared.";
}

function savePicture() {
  const clone = svg.cloneNode(true);
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  const data = new XMLSerializer().serializeToString(clone);
  const blob = new Blob([data], { type: "image/svg+xml" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${pictures[currentPicture].name.toLowerCase().replaceAll(" ", "-")}.svg`;
  link.click();
  URL.revokeObjectURL(link.href);
  statusLabel.textContent = "Saved.";
}

pictureSelect.addEventListener("change", (event) => loadPicture(Number(event.target.value)));
eraserButton.addEventListener("click", () => {
  erasing = !erasing;
  statusLabel.textContent = erasing ? "Eraser is on." : "Eraser is off.";
  renderPalette();
  renderToolStates();
});
clearButton.addEventListener("click", clearPicture);
saveButton.addEventListener("click", savePicture);

renderPictureOptions();
renderPalette();
renderToolStates();
loadPicture(0);
