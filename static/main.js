let canvas = document.getElementById("canvas");
let button_stop = document.getElementById("stop_button");
let clear_button = document.getElementById("clear_button");
let context = canvas.getContext("2d");

let dimension = 100;
let square_width = 8;

let aliveCells = new Set();
let near_cells = new Set();
let interval;
let speed = 150;
let drawing = false;
let stopped = true;
canvas.width= dimension*square_width;
canvas.height= dimension*square_width;

const get_near_cells = (initial_set) => {
  let near_cells = new Set();
  initial_set.forEach((value) => {
    let arr = [-1, 0, +1];
    arr.forEach((x) => {
      arr.forEach((y) => {
        let column = (value % dimension) + y;
        let row = Math.floor(value / dimension) + x;
        let index = row * dimension + column;
        if (
          row >= 0 &&
          column >= 0 &&
          row <= dimension &&
          column < dimension &&
          !initial_set.has(index) &&
          index >= 0
        ) {
          near_cells.add(index);
        }
      });
    });
  });
  return near_cells;
};

const get_live_neighbors = (cell, alive) => {
  let arr = [-1, 0, +1];
  let current_live_neighbors = 0;
  arr.forEach((x) => {
    arr.forEach((y) => {
      let column = (cell % dimension) + y;
      let row = Math.floor(cell / dimension) + x;
      let index = row * dimension + column;
      if (index !== cell && alive.has(index)) {
        current_live_neighbors += 1;
      }
    });
  });
  return current_live_neighbors;
};
const update_alive_cells = (alive, other_cells) => {
  let new_alive = new Set();
  alive.forEach((element) => {
    let current_live_neighbors = get_live_neighbors(element, alive);
    if (current_live_neighbors >= 2 && current_live_neighbors <= 3) {
      new_alive.add(element);
    }
  });
  other_cells.forEach((element) => {
    let current_live_neighbors = get_live_neighbors(element, alive);
    if (current_live_neighbors === 3) {
      new_alive.add(element);
    }
  });
  return new_alive;
};

const click = (event) => {
  if (event.type === "mousedown") {
    drawing = true;
  } else if (event.type === "mouseup") {
    drawing = false;
  }
  if (drawing) {
    let column = Math.floor(
      (event.pageX - canvas.offsetLeft - canvas.clientLeft) / square_width
    );
    let row = Math.floor(
      (event.pageY - canvas.offsetTop - canvas.clientTop) / square_width
      );
    aliveCells.add(row * dimension + column);
  }
  aliveCells = new Set(aliveCells);
  render_cells();
};
const stop = () => {
  if (!stopped) {
    button_stop.innerHTML='RESUME';
    clearInterval(interval);
  } else {
    button_stop.innerHTML='STOP';
    interval = setInterval(() => run_game(), parseInt(speed) || 150);
  }
  stopped = !stopped;
};
const clear = () => {
  aliveCells = new Set();
  render_cells();
};
const render_cells = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#00FF00";
  aliveCells.forEach((key) => render_cell(key));
};
const render_cell = (value) => {
  context.fillRect(
    square_width * (value % dimension),
    square_width * Math.floor(value / dimension),
    square_width,
    square_width
  );
};
const run_game = () => {
  near_cells = get_near_cells(aliveCells);
  aliveCells = update_alive_cells(aliveCells, near_cells);
  render_cells();
};


canvas.addEventListener("mousedown", click);
canvas.addEventListener("mousemove", click);
canvas.addEventListener("mouseup", click);
stop_button.addEventListener("mousedown", stop);
clear_button.addEventListener("mousedown", clear);
