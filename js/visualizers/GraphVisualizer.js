import { Visualizer } from '../core/Visualizer.js';

export class GraphVisualizer extends Visualizer {
  constructor(canvas, graph) {
    super(canvas);
    this.graph = graph;
    this.selectedNodeId = null;
  }

  setGraph(graph) {
    this.graph = graph;
    this.renderCurrent();
  }

  render(step = { visited: [], frontier: [], current: null }) {
    this.clear();
    if (!this.graph) return;

    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = '#334155';
    for (const edge of this.graph.edges) {
      const source = this.graph.nodes.get(edge.source);
      const target = this.graph.nodes.get(edge.target);
      this.ctx.beginPath();
      this.ctx.moveTo(source.x, source.y);
      this.ctx.lineTo(target.x, target.y);
      this.ctx.stroke();
    }

    for (const node of this.graph.nodes.values()) {
      let color = '#64748b';
      if (step.visited?.includes(node.id)) color = '#38bdf8';
      if (step.frontier?.includes(node.id)) color = '#fbbf24';
      if (step.current === node.id) color = '#fb7185';
      if (this.selectedNodeId === node.id) color = '#34d399';

      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, 20, 0, Math.PI * 2);
      this.ctx.fillStyle = color;
      this.ctx.fill();
      this.ctx.lineWidth = 3;
      this.ctx.strokeStyle = '#0f172a';
      this.ctx.stroke();
      this.ctx.fillStyle = '#f8fafc';
      this.ctx.font = '600 13px ui-monospace, SFMono-Regular, monospace';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(String(node.id), node.x, node.y);
    }
  }

  resize() {
    const previous = this.canvas.getBoundingClientRect();
    super.resize();
    const next = this.canvas.getBoundingClientRect();
    if (this.graph && previous.width && previous.height && (previous.width !== next.width || previous.height !== next.height)) {
      const scaleX = next.width / previous.width;
      const scaleY = next.height / previous.height;
      this.graph.nodes.forEach((node) => {
        node.x *= scaleX;
        node.y *= scaleY;
      });
      this.renderCurrent();
    }
  }
}
