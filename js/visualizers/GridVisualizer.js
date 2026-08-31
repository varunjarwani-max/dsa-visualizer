import { Visualizer } from '../core/Visualizer.js';

export class GridVisualizer extends Visualizer {
  constructor(canvas, model) {
    super(canvas);
    this.model = model;
  }

  setModel(model) {
    this.model = model;
    this.renderCurrent();
  }

  cellFromEvent(event) {
    const rect = this.canvas.getBoundingClientRect();
    const col = Math.floor(((event.clientX - rect.left) / rect.width) * this.model.cols);
    const row = Math.floor(((event.clientY - rect.top) / rect.height) * this.model.rows);
    return { row, col, key: `${row},${col}` };
  }

  render(step = { explored: [], frontier: [], path: [], costs: {}, current: null }) {
    this.clear();
    if (!this.model) return;
    const { width, height } = this.canvas.getBoundingClientRect();
    const cellWidth = width / this.model.cols;
    const cellHeight = height / this.model.rows;
    const explored = new Set(step.explored ?? []);
    const frontier = new Set(step.frontier ?? []);
    const path = new Set(step.path ?? []);

    for (let row = 0; row < this.model.rows; row += 1) {
      for (let col = 0; col < this.model.cols; col += 1) {
        const key = `${row},${col}`;
        let color = '#0f172a';
        if (this.model.walls.has(key)) color = '#475569';
        else if (explored.has(key)) color = '#0e7490';
        if (frontier.has(key)) color = '#a16207';
        if (path.has(key)) color = '#059669';
        if (step.current === key) color = '#e11d48';
        if (key === this.model.start) color = '#22c55e';
        if (key === this.model.end) color = '#fb7185';

        const x = col * cellWidth;
        const y = row * cellHeight;
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x + 0.5, y + 0.5, cellWidth - 1, cellHeight - 1);

        if (cellWidth >= 19 && step.costs?.[key] !== undefined && key !== this.model.start) {
          this.ctx.fillStyle = '#e2e8f0';
          this.ctx.font = '9px ui-monospace, SFMono-Regular, monospace';
          this.ctx.textAlign = 'center';
          this.ctx.textBaseline = 'middle';
          this.ctx.fillText(String(step.costs[key]), x + cellWidth / 2, y + cellHeight / 2);
        }
      }
    }

    this.ctx.strokeStyle = '#1e293b';
    this.ctx.lineWidth = 1;
    for (let row = 0; row <= this.model.rows; row += 1) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, row * cellHeight);
      this.ctx.lineTo(width, row * cellHeight);
      this.ctx.stroke();
    }
    for (let col = 0; col <= this.model.cols; col += 1) {
      this.ctx.beginPath();
      this.ctx.moveTo(col * cellWidth, 0);
      this.ctx.lineTo(col * cellWidth, height);
      this.ctx.stroke();
    }
  }
}
