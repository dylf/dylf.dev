import { Universe } from "@dylf/wasm-game-of-life";
// @ts-expect-error - wasm-pack doesn't export memory
import { memory } from "@dylf/wasm-game-of-life/wasm_game_of_life_bg.wasm";

const CELL_SIZE = 6; // px
const GRID_COLOR = "#333";
const ALIVE_COLOR = "cyan";
const DEAD_COLOR = "#222";

// const universe = Universe.new_spaceship();
let universe = Universe.new();
const width = universe.width();
const height = universe.height();

// Draw the canvas
const canvas = document.getElementById(
  "game-of-life-canvas"
) as HTMLCanvasElement;
canvas.height = (CELL_SIZE + 1) * height + 1;
canvas.width = (CELL_SIZE + 1) * width + 1;

const ctx = canvas.getContext("2d");

const drawGrid = () => {
  if (ctx === null) {
    return;
  }
  ctx.beginPath();
  ctx.strokeStyle = GRID_COLOR;

  for (let i = 0; i <= width; i++) {
    ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
    ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
  }

  for (let j = 0; j <= height; j++) {
    ctx.moveTo(0, j * (CELL_SIZE + 1) + 1);
    ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1);
  }

  ctx.stroke();
};

const getIndex = (row: number, column: number) => {
  return row * width + column;
};

const bitIsSet = (n: number, byteArray: Uint8Array) => {
  const byte = Math.floor(n / 8);
  const mask = 1 << n % 8;
  return (byteArray[byte] & mask) === mask;
};

const drawCells = () => {
  if (ctx === null) {
    return;
  }

  const cellsPtr = universe.cells();
  const cells = new Uint8Array(memory.buffer, cellsPtr, (width * height) / 8);

  ctx.beginPath();

  ctx.fillStyle = ALIVE_COLOR;
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const idx = getIndex(row, col);
      if (!bitIsSet(idx, cells)) {
        continue;
      }

      ctx.fillRect(
        col * (CELL_SIZE + 1) + 1,
        row * (CELL_SIZE + 1) + 1,
        CELL_SIZE,
        CELL_SIZE
      );
    }
  }

  ctx.fillStyle = DEAD_COLOR;
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const idx = getIndex(row, col);
      if (bitIsSet(idx, cells)) {
        continue;
      }

      ctx.fillRect(
        col * (CELL_SIZE + 1) + 1,
        row * (CELL_SIZE + 1) + 1,
        CELL_SIZE,
        CELL_SIZE
      );
    }
  }

  ctx.stroke();
};

class FpsCounter {
  fpsContainer: HTMLElement;
  avgFpsContainer: HTMLElement;
  minFpsContainer: HTMLElement;
  maxFpsContainer: HTMLElement;
  frames: number[];
  lastFrameTimeStamp: number;

  constructor() {
    this.fpsContainer = document.getElementById("fps-value") as HTMLElement;
    this.avgFpsContainer = document.getElementById(
      "avg-fps-value"
    ) as HTMLElement;
    this.minFpsContainer = document.getElementById(
      "min-fps-value"
    ) as HTMLElement;
    this.maxFpsContainer = document.getElementById(
      "max-fps-value"
    ) as HTMLElement;
    this.frames = [];
    this.lastFrameTimeStamp = performance.now();
  }

  render() {
    const now = performance.now();
    const delta = now - this.lastFrameTimeStamp;
    this.lastFrameTimeStamp = now;
    const fps = (1 / delta) * 1000;

    this.frames.push(fps);
    if (this.frames.length > 100) {
      this.frames.shift();
    }

    let min = Infinity;
    let max = -Infinity;
    let sum = 0;

    for (let i = 0; i < this.frames.length; i++) {
      sum += this.frames[i];
      min = Math.min(this.frames[i], min);
      max = Math.max(this.frames[i], max);
    }

    let mean = sum / this.frames.length;

    this.fpsContainer.textContent = Math.round(fps).toString();
    this.avgFpsContainer.textContent = Math.round(mean).toString();
    this.minFpsContainer.textContent = Math.round(min).toString();
    this.maxFpsContainer.textContent = Math.round(max).toString();
  }
}

// Handle fps
const fps = new FpsCounter();

let animationId: number | null = null;

const ticksPerFrame = document.getElementById(
  "ticks-per-frame"
) as HTMLInputElement;

const renderLoop = () => {
  // debugger;
  for (let i = 0; i < Number(ticksPerFrame.value); i++) {
    universe.tick();
  }

  fps.render();

  universe.tick();
  drawGrid();
  drawCells();

  animationId = requestAnimationFrame(renderLoop);
};

/**
 *  Add interactivity with pause/play.
 */
const isPaused = () => {
  return animationId === null;
};

const playPauseButton = document.getElementById(
  "play-pause"
) as HTMLButtonElement;

const play = () => {
  playPauseButton.textContent = "⏸";
  renderLoop();
};

const pause = () => {
  playPauseButton.textContent = "▶";
  if (animationId === null) {
    return;
  }
  cancelAnimationFrame(animationId);
  animationId = null;
};

playPauseButton.addEventListener("click", (_event) => {
  if (isPaused()) {
    play();
  } else {
    pause();
  }
});

// Allow clicking on cells to toggle them
canvas.addEventListener("click", (event) => {
  const boundingRect = canvas.getBoundingClientRect();

  const scaleX = canvas.width / boundingRect.width;
  const scaleY = canvas.height / boundingRect.height;

  const canvasLeft = (event.clientX - boundingRect.left) * scaleX;
  const canvasTop = (event.clientY - boundingRect.top) * scaleY;

  const row = Math.min(Math.floor(canvasTop / (CELL_SIZE + 1)), height - 1);
  const col = Math.min(Math.floor(canvasLeft / (CELL_SIZE + 1)), width - 1);

  if (event.ctrlKey) {
    universe.add_glider_at_point(row, col);
  } else if (event.shiftKey) {
    universe.add_pulsar_at_point(row, col);
  } else {
    universe.toggle_cell(row, col);
  }

  drawGrid();
  drawCells();
});

const randomizeButton = document.getElementById(
  "randomize"
) as HTMLButtonElement;

randomizeButton.addEventListener("click", (_event) => {
  universe = Universe.new_random();
  drawGrid();
  drawCells();
});

const resetButton = document.getElementById(
  "reset-universe"
) as HTMLButtonElement;

resetButton.addEventListener("click", () => {
  universe.clear_cells();
  drawGrid();
  drawCells();
});

// Add debug toggle
let debug = false;
const debugButton = document.getElementById(
  "toggle-debug"
) as HTMLButtonElement;
debugButton.addEventListener("click", () => {
  debug = !debug;
  universe.set_debug(debug);
});

// Initialize with play()
play();
