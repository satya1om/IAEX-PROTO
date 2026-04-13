export class Engine {
  constructor(canvas) {
    this.canvas = canvas;
    const context = this.canvas.getContext("2d");
    if (!context) {
      throw new Error("2D canvas context is not available.");
    }
    this.ctx = context;
    this.lastTime = performance.now();
    this.resize();
  }

  resize() {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = Math.floor(this.width * dpr);
    this.canvas.height = Math.floor(this.height * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  clear(alpha = 0.35) {
    this.ctx.fillStyle = `rgba(2, 3, 4, ${alpha})`;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  frame(loopFn) {
    const tick = (time) => {
      const delta = Math.min((time - this.lastTime) / 1000, 0.033);
      this.lastTime = time;
      loopFn(delta);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
}
