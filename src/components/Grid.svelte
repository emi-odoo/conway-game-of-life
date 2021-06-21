<script>
  //import {Layer, t} from "svelte-canvas";
  import {onMount} from "svelte";

  export let dimension;

  let aliveCells = new Set();
  let interval;
  let canvas;
  let context;
  let speed;
  let drawing = false;
  let stopped = true;

  $: count_cells = aliveCells.size;

  onMount(async () => {
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    render_cells();
  });

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

  let near_cells = get_near_cells(aliveCells);

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
        (event.pageX - canvas.offsetLeft - canvas.clientLeft) / 10
      );
      let row = Math.floor((event.pageY - canvas.offsetTop - canvas.clientTop) / 10);
      aliveCells.add(row * dimension + column);
    }
    aliveCells = new Set(aliveCells);
    render_cells();
  };
  const stop = () => {
    if (!stopped) {
      clearInterval(interval);
    } else {
      interval = setInterval(() => run_game(), parseInt(speed) || 150);
    }
    stopped = !stopped;
  };
  const clear = () => {
    aliveCells = new Set();
    render_cells();
  };
  const render_cells = () => {
    context.clearRect(0, 0, 10 * dimension, 10 * dimension);
    context.fillStyle = "#00FF00";
    aliveCells.forEach((key) => render_cell(key));
  };
  const render_cell = (value) => {
    context.fillRect(
      10 * (value % dimension),
      10 * Math.floor(value / dimension),
      10,
      10
    );
  };
  const run_game = () => {
    near_cells = get_near_cells(aliveCells);
    aliveCells = update_alive_cells(aliveCells, near_cells);
    render_cells();
  };
  const big_click = (event) => {
    console.log(event);
  };
</script>

<h1>Conway Game of Life</h1>
<p>Start by drawing a figure in the canvas</p>
<button on:click={stop}>{stopped ? "RESUME" : "STOP"} </button>
<button on:click={clear}>CLEAR</button>
<p>Interval (in ms): <input bind:value={speed} /></p>
<p>Alive cells: {count_cells}</p>
<div>
  <canvas
    width={10 * dimension}
    height={10 * dimension}
    id="canvas"
    style="border: 1px solid blue;"
    on:mousedown={click}
    on:mousemove={click}
    on:mouseup={click}
    on:click={big_click}
  />
</div>
