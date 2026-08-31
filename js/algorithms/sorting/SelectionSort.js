import { Algorithm, sortStep } from '../../core/Algorithm.js';

export class SelectionSort extends Algorithm {
  constructor() {
    super('Selection Sort', { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' });
  }

  generateSteps(input) {
    const array = [...input];
    const steps = [sortStep('initial', array, { note: 'Find the minimum for each position' })];
    const sorted = [];
    let comparisons = 0;
    let swaps = 0;

    for (let i = 0; i < array.length - 1; i += 1) {
      let minimum = i;
      for (let j = i + 1; j < array.length; j += 1) {
        comparisons += 1;
        steps.push(sortStep('compare', array, { indices: [minimum, j], sorted, comparisons, swaps, note: `Compare current minimum ${array[minimum]} with ${array[j]}` }));
        if (array[j] < array[minimum]) minimum = j;
      }
      if (minimum !== i) {
        [array[i], array[minimum]] = [array[minimum], array[i]];
        swaps += 1;
        steps.push(sortStep('swap', array, { indices: [i, minimum], sorted, comparisons, swaps, note: `Place minimum ${array[i]} at index ${i}` }));
      }
      sorted.push(i);
      steps.push(sortStep('mark', array, { sorted, comparisons, swaps, note: `${array[i]} is finalized` }));
    }

    return [...steps, sortStep('complete', array, { sorted: array.map((_, i) => i), comparisons, swaps, note: 'Array sorted' })];
  }
}
