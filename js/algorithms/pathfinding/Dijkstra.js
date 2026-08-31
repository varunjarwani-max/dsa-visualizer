import { GridAlgorithm } from './GridAlgorithm.js';
import { PriorityQueue } from '../../models/PriorityQueue.js';

export class Dijkstra extends GridAlgorithm {
  constructor() {
    super("Dijkstra's Algorithm", { best: 'O((V + E) log V)', average: 'O((V + E) log V)', worst: 'O((V + E) log V)', space: 'O(V)' });
  }

  generateSteps({ rows, cols, start, end, walls }) {
    const queue = new PriorityQueue();
    const distances = new Map([[start, 0]]);
    const cameFrom = new Map();
    const explored = new Set();
    const frontier = new Set([start]);
    const steps = [this.step('frontier', null, explored, frontier, distances, [], 'Start distance is 0')];
    queue.enqueue(start, 0);

    while (queue.size) {
      const current = queue.dequeue();
      if (explored.has(current)) continue;
      frontier.delete(current);
      explored.add(current);
      steps.push(this.step('current', current, explored, frontier, distances, [], `Explore ${current}`));
      if (current === end) {
        const path = this.reconstruct(cameFrom, end);
        path.forEach((_, index) => steps.push(this.step('path', null, explored, frontier, distances, path.slice(0, index + 1), 'Reconstruct shortest path')));
        return [...steps, this.step('complete', null, explored, frontier, distances, path, `Shortest cost: ${distances.get(end)}`)];
      }

      for (const neighbor of this.neighbors(current, rows, cols, walls)) {
        if (explored.has(neighbor)) continue;
        const distance = distances.get(current) + 1;
        if (distance < (distances.get(neighbor) ?? Infinity)) {
          distances.set(neighbor, distance);
          cameFrom.set(neighbor, current);
          queue.enqueue(neighbor, distance);
          frontier.add(neighbor);
        }
      }
      steps.push(this.step('explore', current, explored, frontier, distances, [], 'Relax neighboring distances'));
    }
    return [...steps, this.step('complete', null, explored, frontier, distances, [], 'No path found')];
  }
}
