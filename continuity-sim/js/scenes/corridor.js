import { drawParticleGlow } from "./common.js";

export function renderCorridor(engine, state, _delta, progress) {
  const hubs = [
    [0.05, 0.44], [0.16, 0.67], [0.31, 0.3], [0.44, 0.72],
    [0.58, 0.35], [0.73, 0.63], [0.9, 0.45]
  ].map(([x, y]) => ({ x: x * engine.width, y: y * engine.height }));

  hubs.forEach((h) => {
    engine.ctx.beginPath();
    engine.ctx.arc(h.x, h.y, 3.4, 0, Math.PI * 2);
    engine.ctx.fillStyle = "rgba(236, 242, 249, 0.82)";
    engine.ctx.fill();
  });

  for (let i = 0; i < hubs.length; i += 1) {
    for (let j = i + 1; j < hubs.length; j += 1) {
      if ((i + j) % 2 !== 0) continue;
      const a = hubs[i];
      const b = hubs[j];
      const curvature = (Math.sin((i + 1) * (j + 1)) * 45 + 90) * (0.65 + progress);
      const mx = (a.x + b.x) * 0.5;
      const my = (a.y + b.y) * 0.5 - curvature;
      engine.ctx.beginPath();
      engine.ctx.moveTo(a.x, a.y);
      engine.ctx.quadraticCurveTo(mx, my, b.x, b.y);
      engine.ctx.strokeStyle = "rgba(188, 204, 222, 0.28)";
      engine.ctx.lineWidth = 1.1;
      engine.ctx.stroke();
    }
  }

  state.particles.forEach((p, i) => {
    p.x += Math.sin(i * 0.21 + performance.now() * 0.001) * 0.15;
    p.y += Math.cos(i * 0.19 + performance.now() * 0.001) * 0.15;
    drawParticleGlow(engine.ctx, p, 0.24);
  });
}
