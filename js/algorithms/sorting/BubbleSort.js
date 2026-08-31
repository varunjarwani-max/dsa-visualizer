import { Algorithm, sortStep } from '../../core/Algorithm.js';

export class BubbleSort extends Algorithm {
  constructor() {
    super('Bubble Sort', { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' });
  }

  generateSteps(input) {
    const array = [...input];
    const steps = [sortStep('initial', array, { note: 'Ready to compare adjacent values' })];
    const sorted = [];
    let comparisons = 0;
    let swaps = 0;

    for (let end = array.length - 1; end > 0; end -= 1) {
      let changed = false;
      for (let i = 0; i < end; i += 1) {
        comparisons += 1;
        steps.push(sortStep('compare', array, { indices: [i, i + 1], sorted, comparisons, swaps, note: `Compare ${array[i]} and ${array[i + 1]}` }));
        if (array[i] > array[i + 1]) {
          [array[i], array[i + 1]] = [array[i + 1], array[i]];
          swaps += 1;
          changed = true;
          steps.push(sortStep('swap', array, { indices: [i, i + 1], sorted, comparisons, swaps, note: 'Swap out-of-order pair' }));
        }
      }
      sorted.push(end);
      steps.push(sortStep('mark', array, { sorted, comparisons, swaps, note: `${array[end]} is in its final position` }));
      if (!changed) break;
    }

    return [...steps, sortStep('complete', array, { sorted: array.map((_, i) => i), comparisons, swaps, note: 'Array sorted' })];
  }
}
