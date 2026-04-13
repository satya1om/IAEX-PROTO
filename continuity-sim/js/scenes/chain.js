import { drawParticleGlow, integrateParticles } from "./common.js";

export function renderChain(engine, state, delta, progress) {
  const t = performance.now() * 0.0015;
  const flow = 16 + progress * 26;

  state.particles.forEach((p, i) => {
    const band = (i % 12) / 12;
    p.vx += flow * (0.45 + band) * delta;
    p.vy += Math.sin(t + i * 0.1) * (4 + progress * 8) * delta;
  });
  integrateParticles(state, delta, 0.99);

  for (let i = 0; i < state.particles.length - 8; i += 4) {
    const a = state.particles[i];
    const b = state.particles[i + 8];
    const mx = (a.x + b.x) * 0.5;
    const my = (a.y + b.y) * 0.5 + Math.sin(t + i) * 30;
    engine.ctx.beginPath();
    engine.ctx.moveTo(a.x, a.y);
    engine.ctx.quadraticCurveTo(mx, my, b.x, b.y);
    engine.ctx.strokeStyle = `rgba(196, 208, 224, ${0.2 + progress * 0.45})`;
    engine.ctx.lineWidth = 1.1;
    engine.ctx.stroke();
  }

  state.particles.forEach((p) => {
    if (p.x > engine.width + 20) p.x = -20;
    if (p.y < -20) p.y = engine.height + 20;
    if (p.y > engine.height + 20) p.y = -20;
    drawParticleGlow(engine.ctx, p, 0.56);
  });
}
