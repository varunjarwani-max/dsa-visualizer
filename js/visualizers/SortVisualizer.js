import { Visualizer } from '../core/Visualizer.js';

export class SortVisualizer extends Visualizer {
  render(step) {
    this.clear();
    const { width, height } = this.canvas.getBoundingClientRect();
    const values = step.array;
    const maximum = Math.max(...values, 1);
    const gap = values.length > 60 ? 1 : 2;
    const barWidth = Math.max(1, (width - gap * (values.length - 1)) / values.length);
    const baseline = height - 12;
    const drawableHeight = height - 32;

    values.forEach((value, index) => {
      const barHeight = (value / maximum) * drawableHeight;
      let color = '#64748b';
      if (step.sorted.includes(index) || step.type === 'complete') color = '#34d399';
      if (step.indices.includes(index)) {
        color = step.type === 'compare' ? '#fbbf24' : '#fb7185';
      }

      this.ctx.fillStyle = color;
      const x = index * (barWidth + gap);
      this.ctx.fillRect(x, baseline - barHeight, barWidth, barHeight);

      if (values.length <= 28) {
        this.ctx.fillStyle = '#94a3b8';
        this.ctx.font = '11px ui-monospace, SFMono-Regular, monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(String(value), x + barWidth / 2, height - 1);
      }
    });
  }
}
