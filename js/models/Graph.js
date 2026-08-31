/** A vertex in a canvas graph. */
export class Node {
  constructor(id, x, y) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.neighbors = new Set();
  }

  connect(nodeId) {
    this.neighbors.add(nodeId);
  }
}

/** An undirected connection between two graph vertices. */
export class Edge {
  constructor(source, target, weight = 1) {
    this.source = source;
    this.target = target;
    this.weight = weight;
  }
}

/** Mutable graph model, deliberately independent of traversal and rendering. */
export class Graph {
  constructor() {
    this.nodes = new Map();
    this.edges = [];
  }

  addNode(node) {
    this.nodes.set(node.id, node);
    return node;
  }

  addEdge(sourceId, targetId, weight = 1) {
    if (sourceId === targetId || this.hasEdge(sourceId, targetId)) return null;
    const source = this.nodes.get(sourceId);
    const target = this.nodes.get(targetId);
    if (!source || !target) return null;
    source.connect(targetId);
    target.connect(sourceId);
    const edge = new Edge(sourceId, targetId, weight);
    this.edges.push(edge);
    return edge;
  }

  hasEdge(a, b) {
    return this.edges.some(
      (edge) =>
        (edge.source === a && edge.target === b) ||
        (edge.source === b && edge.target === a),
    );
  }

  neighbors(id) {
    return [...(this.nodes.get(id)?.neighbors ?? [])].sort((a, b) => a - b);
  }

  clone() {
    const copy = new Graph();
    this.nodes.forEach((node) => copy.addNode(new Node(node.id, node.x, node.y)));
    this.edges.forEach((edge) => copy.addEdge(edge.source, edge.target, edge.weight));
    return copy;
  }
}
