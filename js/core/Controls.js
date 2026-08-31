/**
 * Binds a generic control surface to any Visualizer instance. Controls know
 * nothing about algorithms or canvas rendering.
 */
export class Controls {
  constructor(root, visualizer) {
    this.root = root;
    this.visualizer = visualizer;
    this.playButton = root.querySelector('[data-action="play"]');
    this.stepBackButton = root.querySelector('[data-action="back"]');
    this.stepForwardButton = root.querySelector('[data-action="forward"]');
    this.resetButton = root.querySelector('[data-action="reset"]');
    this.speedInput = root.querySelector('[data-control="speed"]');
    this.progress = root.querySelector('[data-output="progress"]');
    this.bind();
  }

  bind() {
    this.playButton?.addEventListener('click', () => this.visualizer.toggle());
    this.stepBackButton?.addEventListener('click', () => this.visualizer.stepBackward());
    this.stepForwardButton?.addEventListener('click', () => this.visualizer.stepForward());
    this.resetButton?.addEventListener('click', () => this.visualizer.reset());
    this.speedInput?.addEventListener('input', (event) => {
      this.visualizer.setSpeed(event.target.value);
      const output = this.root.querySelector('[data-output="speed"]');
      if (output) output.textContent = `${event.target.value}%`;
    });

    this.visualizer.onStateChange = (state) => this.sync(state);
    this.sync({ playing: false, index: 0, total: 0 });
  }

  sync({ playing, index, total }) {
    if (this.playButton) {
      this.playButton.textContent = playing ? 'Pause' : 'Play';
      this.playButton.setAttribute('aria-label', playing ? 'Pause animation' : 'Play animation');
    }
    if (this.progress) this.progress.textContent = total ? `${index + 1} / ${total}` : '0 / 0';
    if (this.stepBackButton) this.stepBackButton.disabled = index <= 0;
    if (this.stepForwardButton) this.stepForwardButton.disabled = !total || index >= total - 1;
  }
}
