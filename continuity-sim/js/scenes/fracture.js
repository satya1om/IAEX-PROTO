import { drawParticleGlow, integrateParticles, wrapParticle } from "./common.js";

export function renderFracture(engine, state, delta, progress) {
  const t = performance.now() * 0.001;
  const split = 8 + progress * 24;

  state.particles.forEach((p, i) => {
    const angle = Math.atan2(p.y - engine.height * 0.5, p.x - engine.width * 0.5) + Math.sin(t + i) * 0.3;
    p.vx += Math.cos(angle) * split * delta;
    p.vy += Math.sin(angle) * split * delta;
  });

  integrateParticles(state, delta, 0.986);
  state.particles.forEach((p, i) => {
    wrapParticle(p, engine.width, engine.height);
    const sides = 3 + (i % 3);
    engine.ctx.beginPath();
    for (let k = 0; k < sides; k += 1) {
      const a = (Math.PI * 2 * k) / sides + t * 0.2;
      const r = p.size * (1.6 + (k % 2) * 0.6);
      const x = p.x + Math.cos(a) * r;
      const y = p.y + Math.sin(a) * r;
      if (k === 0) engine.ctx.moveTo(x, y);
      else engine.ctx.lineTo(x, y);
    }
    engine.ctx.closePath();
    engine.ctx.fillStyle = `rgba(214, 222, 234, ${0.18 + progress * 0.4})`;
    engine.ctx.fill();
    drawParticleGlow(engine.ctx, p, 0.25);
  });
}
