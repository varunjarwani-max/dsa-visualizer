import { Controls } from './core/Controls.js';
import { Graph, Node } from './models/Graph.js';
import { BubbleSort } from './algorithms/sorting/BubbleSort.js';
import { InsertionSort } from './algorithms/sorting/InsertionSort.js';
import { SelectionSort } from './algorithms/sorting/SelectionSort.js';
import { MergeSort } from './algorithms/sorting/MergeSort.js';
import { QuickSort } from './algorithms/sorting/QuickSort.js';
import { BFS } from './algorithms/graph/BFS.js';
import { DFS } from './algorithms/graph/DFS.js';
import { Dijkstra } from './algorithms/pathfinding/Dijkstra.js';
import { AStar } from './algorithms/pathfinding/AStar.js';
import { SortVisualizer } from './visualizers/SortVisualizer.js';
import { GraphVisualizer } from './visualizers/GraphVisualizer.js';
import { GridVisualizer } from './visualizers/GridVisualizer.js';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function fillAlgorithmSelect(select, algorithms) {
  algorithms.forEach((algorithm, index) => {
    const option = document.createElement('option');
    option.value = String(index);
    option.textContent = algorithm.name;
    select.append(option);
  });
}

function showComplexity(root, algorithm) {
  const labels = [['Best', 'best'], ['Average', 'average'], ['Worst', 'worst'], ['Space', 'space']];
  root.replaceChildren(...labels.map(([label, key]) => {
    const wrapper = document.createElement('div');
    const term = document.createElement('dt');
    const value = document.createElement('dd');
    term.textContent = label;
    value.textContent = algorithm.complexity[key];
    wrapper.append(term, value);
    return wrapper;
  }));
}

// ---------- Sorting ----------
const sortView = $('[data-view="sorting"]');
const sortAlgorithms = [new BubbleSort(), new InsertionSort(), new SelectionSort(), new MergeSort(), new QuickSort()];
const sortCanvas = $('[data-canvas="sorting"]');
const sortVisualizer = new SortVisualizer(sortCanvas);
new Controls($('[data-controls="sorting"]'), sortVisualizer);
let sortArray = [];

const randomArray = (size) => Array.from({ length: size }, () => Math.floor(Math.random() * 94) + 6);

function prepareSort() {
  const algorithm = sortAlgorithms[Number($('[data-control="algorithm"]', sortView).value)];
  sortVisualizer.setSteps(algorithm.generateSteps(sortArray));
  showComplexity($('[data-output="complexity"]', sortView), algorithm);
}

fillAlgorithmSelect($('[data-control="algorithm"]', sortView), sortAlgorithms);
$('[data-control="algorithm"]', sortView).addEventListener('change', prepareSort);
$('[data-control="size"]', sortView).addEventListener('input', (event) => {
  $('[data-output="size"]', sortView).textContent = event.target.value;
  sortArray = randomArray(Number(event.target.value));
  prepareSort();
});
$('[data-control="shuffle"]', sortView).addEventListener('click', () => {
  sortArray = randomArray(Number($('[data-control="size"]', sortView).value));
  prepareSort();
});
sortVisualizer.onStep = (step) => {
  $('[data-output="comparisons"]', sortView).textContent = step.comparisons ?? 0;
  $('[data-output="swaps"]', sortView).textContent = step.swaps ?? 0;
  $('[data-output="note"]', sortView).textContent = step.note ?? '';
};
sortArray = randomArray(40);
prepareSort();

// ---------- Graph traversal ----------
const graphView = $('[data-view="graph"]');
const graphAlgorithms = [new BFS(), new DFS()];
const graphCanvas = $('[data-canvas="graph"]');
let graph = new Graph();
let startNodeId = 0;
const graphVisualizer = new GraphVisualizer(graphCanvas, graph);
new Controls($('[data-controls="graph"]'), graphVisualizer);

function generateGraph() {
  graph = new Graph();
  const rect = graphCanvas.getBoundingClientRect();
  const width = Math.max(rect.width, 600);
  const height = Math.max(rect.height, 400);
  const points = [
    [.13, .25], [.38, .16], [.64, .19], [.85, .36],
    [.22, .65], [.49, .52], [.73, .71], [.42, .83],
  ];
  points.forEach(([x, y], id) => graph.addNode(new Node(id, width * x, height * y)));
  [[0,1],[0,4],[1,2],[1,5],[2,3],[2,5],[3,6],[4,5],[4,7],[5,6],[5,7],[6,7]].forEach(([a,b]) => graph.addEdge(a,b));
  startNodeId = 0;
  graphVisualizer.selectedNodeId = startNodeId;
  graphVisualizer.setGraph(graph);
  prepareTraversal();
}

function prepareTraversal() {
  const algorithm = graphAlgorithms[Number($('[data-control="algorithm"]', graphView).value)];
  graphVisualizer.setSteps(algorithm.generateSteps({ graph, startId: startNodeId }));
  showComplexity($('[data-output="complexity"]', graphView), algorithm);
  $('[data-output="structure-label"]', graphView).textContent = algorithm instanceof BFS ? 'Queue · front → back' : 'Stack · bottom → top';
}

fillAlgorithmSelect($('[data-control="algorithm"]', graphView), graphAlgorithms);
$('[data-control="algorithm"]', graphView).addEventListener('change', prepareTraversal);
$('[data-control="random-graph"]', graphView).addEventListener('click', generateGraph);
$('[data-control="run"]', graphView).addEventListener('click', prepareTraversal);

graphVisualizer.onStep = (step) => {
  $('[data-output="note"]', graphView).textContent = step.note ?? '';
  const track = $('[data-output="structure"]', graphView);
  const items = step.frontier?.length ? step.frontier.map((id) => {
    const element = document.createElement('span');
    element.className = 'structure-item';
    element.textContent = id;
    return element;
  }) : [Object.assign(document.createElement('span'), { className: 'structure-empty', textContent: 'Empty' })];
  track.replaceChildren(...items);
};

function graphNodeAt(x, y) {
  return [...graph.nodes.values()].find((node) => Math.hypot(node.x - x, node.y - y) <= 24);
}

graphCanvas.addEventListener('click', (event) => {
  graphVisualizer.pause();
  const rect = graphCanvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const clicked = graphNodeAt(x, y);
  if (!clicked) {
    const id = graph.nodes.size ? Math.max(...graph.nodes.keys()) + 1 : 0;
    graph.addNode(new Node(id, x, y));
    graphVisualizer.selectedNodeId = id;
  } else if (graphVisualizer.selectedNodeId !== null && graphVisualizer.selectedNodeId !== clicked.id) {
    graph.addEdge(graphVisualizer.selectedNodeId, clicked.id);
    graphVisualizer.selectedNodeId = clicked.id;
  } else {
    graphVisualizer.selectedNodeId = clicked.id;
  }
  graphVisualizer.setGraph(graph);
  prepareTraversal();
});

graphCanvas.addEventListener('dblclick', (event) => {
  event.preventDefault();
  const rect = graphCanvas.getBoundingClientRect();
  const clicked = graphNodeAt(event.clientX - rect.left, event.clientY - rect.top);
  if (clicked) {
    startNodeId = clicked.id;
    graphVisualizer.selectedNodeId = clicked.id;
    prepareTraversal();
  }
});

// ---------- Pathfinding ----------
const pathView = $('[data-view="pathfinding"]');
const pathAlgorithms = [new Dijkstra(), new AStar()];
const pathCanvas = $('[data-canvas="pathfinding"]');
const grid = { rows: 30, cols: 30, start: '15,4', end: '15,25', walls: new Set() };
const gridVisualizer = new GridVisualizer(pathCanvas, grid);
new Controls($('[data-controls="pathfinding"]'), gridVisualizer);
let painting = false;

function blankGridStep(note = 'Place walls, then find a path') {
  return { type: 'initial', current: null, explored: [], frontier: [], path: [], costs: {}, note };
}

function preparePath() {
  const algorithm = pathAlgorithms[Number($('[data-control="algorithm"]', pathView).value)];
  gridVisualizer.setSteps(algorithm.generateSteps(grid));
  showComplexity($('[data-output="complexity"]', pathView), algorithm);
}

function previewGrid(note) {
  gridVisualizer.setSteps([blankGridStep(note)]);
}

fillAlgorithmSelect($('[data-control="algorithm"]', pathView), pathAlgorithms);
$('[data-control="algorithm"]', pathView).addEventListener('change', () => {
  showComplexity($('[data-output="complexity"]', pathView), pathAlgorithms[Number($('[data-control="algorithm"]', pathView).value)]);
  previewGrid('Algorithm changed. Press Find path.');
});
$('[data-control="run"]', pathView).addEventListener('click', preparePath);
$('[data-control="clear"]', pathView).addEventListener('click', () => {
  grid.walls.clear();
  previewGrid('Grid cleared');
});
$('[data-control="maze"]', pathView).addEventListener('click', () => {
  grid.walls.clear();
  for (let row = 0; row < grid.rows; row += 1) {
    for (let col = 0; col < grid.cols; col += 1) {
      const key = `${row},${col}`;
      if (key !== grid.start && key !== grid.end && Math.random() < 0.23) grid.walls.add(key);
    }
  }
  previewGrid('Random walls generated');
});

gridVisualizer.onStep = (step) => {
  $('[data-output="note"]', pathView).textContent = step.note ?? '';
  $('[data-output="explored"]', pathView).textContent = step.explored?.length ?? 0;
  $('[data-output="path-length"]', pathView).textContent = step.path?.length ? Math.max(0, step.path.length - 1) : '—';
};

function paintGrid(event) {
  const { key } = gridVisualizer.cellFromEvent(event);
  const mode = $('[data-control="paint"]', pathView).value;
  if (mode === 'start' && key !== grid.end) {
    grid.walls.delete(key);
    grid.start = key;
  } else if (mode === 'end' && key !== grid.start) {
    grid.walls.delete(key);
    grid.end = key;
  } else if (mode === 'wall' && key !== grid.start && key !== grid.end) {
    grid.walls.add(key);
  } else if (mode === 'erase') {
    grid.walls.delete(key);
  }
  previewGrid(`${mode[0].toUpperCase()}${mode.slice(1)} updated`);
}

pathCanvas.addEventListener('pointerdown', (event) => { painting = true; pathCanvas.setPointerCapture(event.pointerId); paintGrid(event); });
pathCanvas.addEventListener('pointermove', (event) => { if (painting) paintGrid(event); });
pathCanvas.addEventListener('pointerup', () => { painting = false; });
pathCanvas.addEventListener('pointercancel', () => { painting = false; });

showComplexity($('[data-output="complexity"]', pathView), pathAlgorithms[0]);
previewGrid();

// ---------- Shared mode navigation ----------
$$('[data-mode]').forEach((tab) => tab.addEventListener('click', () => {
  const mode = tab.dataset.mode;
  $$('.tab').forEach((item) => item.setAttribute('aria-selected', String(item === tab)));
  $$('.view').forEach((view) => { view.hidden = view.dataset.view !== mode; });
  [sortVisualizer, graphVisualizer, gridVisualizer].forEach((visualizer) => visualizer.pause());
  requestAnimationFrame(() => {
    if (mode === 'sorting') sortVisualizer.resize();
    if (mode === 'graph') graphVisualizer.resize();
    if (mode === 'pathfinding') gridVisualizer.resize();
  });
}));

requestAnimationFrame(() => {
  sortVisualizer.resize();
  generateGraph();
  gridVisualizer.resize();
});
