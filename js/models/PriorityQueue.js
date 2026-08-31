/** Small binary min-heap used by Dijkstra and A*. */
export class PriorityQueue {
  constructor() {
    this.heap = [];
  }

  get size() { return this.heap.length; }

  enqueue(value, priority) {
    this.heap.push({ value, priority });
    let index = this.heap.length - 1;
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.heap[parent].priority <= priority) break;
      [this.heap[parent], this.heap[index]] = [this.heap[index], this.heap[parent]];
      index = parent;
    }
  }

  dequeue() {
    if (!this.heap.length) return null;
    const root = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length && last) {
      this.heap[0] = last;
      let index = 0;
      while (true) {
        const left = index * 2 + 1;
        const right = left + 1;
        let smallest = index;
        if (left < this.heap.length && this.heap[left].priority < this.heap[smallest].priority) smallest = left;
        if (right < this.heap.length && this.heap[right].priority < this.heap[smallest].priority) smallest = right;
        if (smallest === index) break;
        [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
        index = smallest;
      }
    }
    return root.value;
  }
}
