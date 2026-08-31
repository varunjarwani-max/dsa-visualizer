import { Algorithm, sortStep } from '../../core/Algorithm.js';

export class QuickSort extends Algorithm {
  constructor() {
    super('Quick Sort', { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)' });
  }

  generateSteps(input) {
    const array = [...input];
    const steps = [sortStep('initial', array, { note: 'Partition around a pivot' })];
    const sorted = new Set();
    let comparisons = 0;
    let swaps = 0;

    const partition = (low, high) => {
      const pivot = array[high];
      let boundary = low;
      for (let i = low; i < high; i += 1) {
        comparisons += 1;
        steps.push(sortStep('compare', array, { indices: [i, high], sorted: [...sorted], comparisons, swaps, note: `Compare ${array[i]} to pivot ${pivot}` }));
        if (array[i] < pivot) {
          if (i !== boundary) {
            [array[i], array[boundary]] = [array[boundary], array[i]];
            swaps += 1;
            steps.push(sortStep('swap', array, { indices: [i, boundary], sorted: [...sorted], comparisons, swaps, note: 'Move value into lower partition' }));
          }
          boundary += 1;
        }
      }
      if (boundary !== high) {
        [array[boundary], array[high]] = [array[high], array[boundary]];
        swaps += 1;
        steps.push(sortStep('swap', array, { indices: [boundary, high], sorted: [...sorted], comparisons, swaps, note: `Place pivot ${pivot}` }));
      }
      sorted.add(boundary);
      return boundary;
    };

    const sort = (low, high) => {
      if (low > high) return;
      if (low === high) {
        sorted.add(low);
        return;
      }
      const pivot = partition(low, high);
      sort(low, pivot - 1);
      sort(pivot + 1, high);
    };

    sort(0, array.length - 1);
    return [...steps, sortStep('complete', array, { sorted: array.map((_, i) => i), comparisons, swaps, note: 'Array sorted' })];
  }
}
