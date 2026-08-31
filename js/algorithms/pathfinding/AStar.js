import { GridAlgorithm } from './GridAlgorithm.js';
import { PriorityQueue } from '../../models/PriorityQueue.js';

export class AStar extends GridAlgorithm {
  constructor() {
    super('A* Search', { best: 'O(E)', average: 'O(E)', worst: 'O(E)', space: 'O(V)' });
  }

  heuristic(a, b) {
    const [ar, ac] = this.parse(a);
    const [br, bc] = this.parse(b);
    return Math.abs(ar - br) + Math.abs(ac - bc);
  }

  generateSteps({ rows, cols, start, end, walls }) {
    const queue = new PriorityQueue();
    const costs = new Map([[start, 0]]);
    const cameFrom = new Map();
    const explored = new Set();
    const frontier = new Set([start]);
    const steps = [this.step('frontier', null, explored, frontier, costs, [], 'Start with Manhattan heuristic')];
    queue.enqueue(start, this.heuristic(start, end));

    while (queue.size) {
      const current = queue.dequeue();
      if (explored.has(current)) continue;
      frontier.delete(current);
      explored.add(current);
      steps.push(this.step('current', current, explored, frontier, costs, [], `Explore lowest f-score cell ${current}`));
      if (current === end) {
        const path = this.reconstruct(cameFrom, end);
        path.forEach((_, index) => steps.push(this.step('path', null, explored, frontier, costs, path.slice(0, index + 1), 'Reconstruct shortest path')));
        return [...steps, this.step('complete', null, explored, frontier, costs, path, `Shortest cost: ${costs.get(end)}`)];
      }

      for (const neighbor of this.neighbors(current, rows, cols, walls)) {
        if (explored.has(neighbor)) continue;
        const tentative = costs.get(current) + 1;
        if (tentative < (costs.get(neighbor) ?? Infinity)) {
          cameFrom.set(neighbor, current);
          costs.set(neighbor, tentative);
          queue.enqueue(neighbor, tentative + this.heuristic(neighbor, end));
          frontier.add(neighbor);
        }
      }
      steps.push(this.step('explore', current, explored, frontier, costs, [], 'Update g-scores and frontier'));
    }
    return [...steps, this.step('complete', null, explored, frontier, costs, [], 'No path found')];
  }
}
