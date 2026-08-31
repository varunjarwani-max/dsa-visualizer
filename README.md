# DSA Visualizer

An interactive, step-by-step visualizer for sorting algorithms, graph traversal, and shortest-path search. It is built with HTML5 Canvas, CSS, and vanilla JavaScript ES modules—no framework, runtime dependencies, or build step.

## Run locally

Open `index.html` directly in a modern browser. If the browser blocks ES modules from `file://`, serve the directory with any static file server (for example, `python -m http.server`) and open the displayed localhost URL.

## Architecture: generate, then replay

The project enforces one central separation: **algorithms produce a step log; visualizers replay it**.

- `Algorithm` is the abstract contract. Every implementation exposes `generateSteps(input)` and returns plain state-change objects. Algorithms contain no drawing code and no timing.
- `Visualizer` owns replay state, scheduling, speed, forward/backward stepping, and reset behavior. `SortVisualizer`, `GraphVisualizer`, and `GridVisualizer` only translate steps into Canvas drawing operations.
- `Controls` binds generic controls to any visualizer without knowing which algorithm or renderer is active.
- `Node`, `Edge`, and `Graph` model the graph independently of traversal and presentation.
- `PriorityQueue` is a binary min-heap shared by Dijkstra and A*.

Because a step is plain data, the same output can be rendered as Canvas, DOM, SVG, or a terminal trace without changing algorithm code. Backward stepping is also deterministic and cheap: the renderer simply replays an earlier immutable snapshot.

## Algorithms and complexity

| Algorithm | Best time | Average time | Worst time | Auxiliary space |
|---|---:|---:|---:|---:|
| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) |
| Insertion Sort | O(n) | O(n²) | O(n²) | O(1) |
| Selection Sort | O(n²) | O(n²) | O(n²) | O(1) |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) average stack |
| Breadth-First Search | O(V + E) | O(V + E) | O(V + E) | O(V) |
| Depth-First Search | O(V + E) | O(V + E) | O(V + E) | O(V) |
| Dijkstra (binary heap) | O((V + E) log V) | O((V + E) log V) | O((V + E) log V) | O(V) |
| A* (Manhattan heuristic) | Depends on heuristic | Depends on heuristic | O(E) on this bounded grid | O(V) |

## Project structure

```text
index.html
styles.css
js/
  core/              Algorithm, Visualizer, Controls
  models/            Graph, Node, Edge, PriorityQueue
  algorithms/
    sorting/          Bubble, Insertion, Selection, Merge, Quick
    graph/            BFS, DFS
    pathfinding/      Dijkstra, A*, shared grid helpers
  visualizers/        Canvas renderers for each mode
  main.js             UI composition and event wiring
```

## GitHub Pages

This repository is static and GitHub Pages compatible. In the repository settings, choose **Pages → Deploy from a branch**, select the main branch and `/ (root)`, then save. The published URL can be added here:

**Live demo:** `https://<username>.github.io/<repository>/`

## Interaction guide

- **Sorting:** choose an algorithm, array size, and speed; randomize, play, pause, or step in either direction.
- **Graph traversal:** click empty space to add nodes; click two nodes sequentially to connect them; double-click a node to choose the start. The queue or stack is shown beside the canvas.
- **Pathfinding:** choose whether clicks paint walls, start, end, or erase. Generate random walls or draw them, then run Dijkstra or A*.
