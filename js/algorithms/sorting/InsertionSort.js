import { Algorithm, sortStep } from '../../core/Algorithm.js';

export class InsertionSort extends Algorithm {
  constructor() {
    super('Insertion Sort', { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' });
  }

  generateSteps(input) {
    const array = [...input];
    const steps = [sortStep('initial', array, { sorted: [0], note: 'First item forms the sorted prefix' })];
    let comparisons = 0;
    let swaps = 0;

    for (let i = 1; i < array.length; i += 1) {
      let j = i;
      while (j > 0) {
        comparisons += 1;
        steps.push(sortStep('compare', array, { indices: [j - 1, j], sorted: Array.from({ length: i }, (_, k) => k), comparisons, swaps, note: `Insert ${array[j]} into the sorted prefix` }));
        if (array[j - 1] <= array[j]) break;
        [array[j - 1], array[j]] = [array[j], array[j - 1]];
        swaps += 1;
        steps.push(sortStep('swap', array, { indices: [j - 1, j], comparisons, swaps, note: 'Shift larger value right' }));
        j -= 1;
      }
      steps.push(sortStep('mark', array, { sorted: Array.from({ length: i + 1 }, (_, k) => k), comparisons, swaps, note: 'Sorted prefix expanded' }));
    }

    return [...steps, sortStep('complete', array, { sorted: array.map((_, i) => i), comparisons, swaps, note: 'Array sorted' })];
  }
}
