import { Algorithm } from '../../core/Algorithm.js';

export class DFS extends Algorithm {
  constructor() {
    super('Depth-First Search', { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)', space: 'O(V)' });
  }

  generateSteps({ graph, startId }) {
    if (!graph.nodes.has(startId)) return [];
    const frontier = [startId];
    const discovered = new Set([startId]);
    const visited = [];
    const steps = [this.step('frontier', null, frontier, visited, `Push start node ${startId}`)];

    while (frontier.length) {
      const current = frontier.pop();
      steps.push(this.step('current', current, frontier, visited, `Pop ${current}`));
      visited.push(current);
      const neighbors = graph.neighbors(current).reverse();
      for (const neighbor of neighbors) {
        if (!discovered.has(neighbor)) {
          discovered.add(neighbor);
          frontier.push(neighbor);
          steps.push(this.step('discover', current, frontier, visited, `Discover ${neighbor}; push it`));
        }
      }
      steps.push(this.step('visit', null, frontier, visited, `Finish node ${current}`));
    }
    return [...steps, this.step('complete', null, [], visited, 'Traversal complete')];
  }

  step(type, current, frontier, visited, note) {
    return { type, current, frontier: [...frontier], visited: [...visited], note, structure: 'Stack' };
  }
}
