import { Algorithm } from '../../core/Algorithm.js';

export class GridAlgorithm extends Algorithm {
  key(row, col) { return `${row},${col}`; }

  parse(key) { return key.split(',').map(Number); }

  neighbors(key, rows, cols, walls) {
    const [row, col] = this.parse(key);
    return [[row - 1, col], [row + 1, col], [row, col - 1], [row, col + 1]]
      .filter(([r, c]) => r >= 0 && c >= 0 && r < rows && c < cols)
      .map(([r, c]) => this.key(r, c))
      .filter((candidate) => !walls.has(candidate));
  }

  reconstruct(cameFrom, end) {
    const path = [];
    let current = end;
    while (current !== undefined) {
      path.unshift(current);
      current = cameFrom.get(current);
    }
    return path;
  }

  step(type, current, explored, frontier, costs, path = [], note = '') {
    return {
      type,
      current,
      explored: [...explored],
      frontier: [...frontier],
      costs: Object.fromEntries(costs),
      path: [...path],
      note,
    };
  }
}
