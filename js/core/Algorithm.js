/**
 * Abstract contract for every algorithm.
 * Implementations transform input data into an immutable step log; they never draw
 * or control animation timing.
 */
export class Algorithm {
  constructor(name, complexity) {
    if (new.target === Algorithm) {
      throw new TypeError('Algorithm is abstract and cannot be instantiated directly.');
    }
    this.name = name;
    this.complexity = complexity;
  }

  generateSteps() {
    throw new Error(`${this.constructor.name} must implement generateSteps(input).`);
  }
}

/** Create a defensive array snapshot for a replayable step. */
export const snapshot = (array) => [...array];

/** Standard sorting step shape used by every sorting algorithm. */
export const sortStep = (type, array, options = {}) => ({
  type,
  array: snapshot(array),
  indices: options.indices ? [...options.indices] : [],
  sorted: options.sorted ? [...options.sorted] : [],
  comparisons: options.comparisons ?? 0,
  swaps: options.swaps ?? 0,
  note: options.note ?? '',
});
