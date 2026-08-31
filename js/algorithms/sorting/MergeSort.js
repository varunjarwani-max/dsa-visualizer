import { Algorithm, sortStep } from '../../core/Algorithm.js';

export class MergeSort extends Algorithm {
  constructor() {
    super('Merge Sort', { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' });
  }

  generateSteps(input) {
    const array = [...input];
    const steps = [sortStep('initial', array, { note: 'Recursively divide, then merge sorted halves' })];
    let comparisons = 0;
    let swaps = 0;

    const merge = (left, middle, right) => {
      const first = array.slice(left, middle + 1);
      const second = array.slice(middle + 1, right + 1);
      let i = 0;
      let j = 0;
      let k = left;

      while (i < first.length && j < second.length) {
        comparisons += 1;
        steps.push(sortStep('compare', array, { indices: [left + i, middle + 1 + j], comparisons, swaps, note: `Merge ranges [${left}…${middle}] and [${middle + 1}…${right}]` }));
        if (first[i] <= second[j]) array[k] = first[i++];
        else array[k] = second[j++];
        swaps += 1;
        steps.push(sortStep('write', array, { indices: [k], comparisons, swaps, note: `Write ${array[k]} at index ${k}` }));
        k += 1;
      }
      while (i < first.length) {
        array[k] = first[i++];
        swaps += 1;
        steps.push(sortStep('write', array, { indices: [k], comparisons, swaps, note: 'Copy remaining left value' }));
        k += 1;
      }
      while (j < second.length) {
        array[k] = second[j++];
        swaps += 1;
        steps.push(sortStep('write', array, { indices: [k], comparisons, swaps, note: 'Copy remaining right value' }));
        k += 1;
      }
    };

    const sort = (left, right) => {
      if (left >= right) return;
      const middle = Math.floor((left + right) / 2);
      sort(left, middle);
      sort(middle + 1, right);
      merge(left, middle, right);
    };

    sort(0, array.length - 1);
    return [...steps, sortStep('complete', array, { sorted: array.map((_, i) => i), comparisons, swaps, note: 'Array sorted' })];
  }
}
