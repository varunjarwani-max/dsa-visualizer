/**
 * Replays a precomputed step log. Subclasses only implement render(step): all
 * scheduling lives here, keeping animation concerns out of algorithms.
 */
export class Visualizer {
  constructor(canvas) {
    if (new.target === Visualizer) {
      throw new TypeError('Visualizer is abstract and cannot be instantiated directly.');
    }
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.steps = [];
    this.index = 0;
    this.playing = false;
    this.speed = 60;
    this.lastFrame = 0;
    this.frameRequest = null;
    this.onStep = () => {};
    this.onStateChange = () => {};
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas.parentElement);
  }

  setSteps(steps) {
    this.pause();
    this.steps = steps;
    this.index = 0;
    this.renderCurrent();
    this.emitState();
  }

  play() {
    if (!this.steps.length || this.index >= this.steps.length - 1) return;
    this.playing = true;
    this.lastFrame = 0;
    this.emitState();
    this.frameRequest = requestAnimationFrame((time) => this.tick(time));
  }

  pause() {
    this.playing = false;
    if (this.frameRequest) cancelAnimationFrame(this.frameRequest);
    this.frameRequest = null;
    this.emitState();
  }

  toggle() {
    this.playing ? this.pause() : this.play();
  }

  tick(time) {
    if (!this.playing) return;
    const interval = this.getInterval();
    if (!this.lastFrame || time - this.lastFrame >= interval) {
      this.index = Math.min(this.index + 1, this.steps.length - 1);
      this.renderCurrent();
      this.lastFrame = time;
      if (this.index >= this.steps.length - 1) {
        this.pause();
        return;
      }
    }
    this.frameRequest = requestAnimationFrame((nextTime) => this.tick(nextTime));
  }

  getInterval() {
    // Slider 1–100 maps to 900–20ms. Algorithms remain timing-agnostic.
    return 920 - this.speed * 9;
  }

  stepForward() {
    this.pause();
    if (this.index < this.steps.length - 1) this.index += 1;
    this.renderCurrent();
  }

  stepBackward() {
    this.pause();
    if (this.index > 0) this.index -= 1;
    this.renderCurrent();
  }

  reset() {
    this.pause();
    this.index = 0;
    this.renderCurrent();
  }

  setSpeed(speed) {
    this.speed = Number(speed);
  }

  renderCurrent() {
    if (!this.steps.length) return;
    const step = this.steps[this.index];
    this.render(step);
    this.onStep(step, this.index, this.steps.length);
    this.emitState();
  }

  emitState() {
    this.onStateChange({
      playing: this.playing,
      index: this.index,
      total: this.steps.length,
    });
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.max(1, Math.floor(rect.width * ratio));
    this.canvas.height = Math.max(1, Math.floor(rect.height * ratio));
    this.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    this.renderCurrent();
  }

  clear() {
    const { width, height } = this.canvas.getBoundingClientRect();
    this.ctx.clearRect(0, 0, width, height);
  }

  render() {
    throw new Error(`${this.constructor.name} must implement render(step).`);
  }
}
