import { drawFieldLinks, drawParticleGlow, integrateParticles, wrapParticle } from "./common.js";

export function renderHero(engine, state, delta, progress) {
  const t = performance.now() * 0.00015;
  state.particles.forEach((p, i) => {
    p.vx += Math.sin(t + i * 0.17) * 0.6 * delta;
    p.vy += Math.cos(t + i * 0.11) * 0.6 * delta;
    p.vx += (Math.random() - 0.5) * 0.3 * delta;
    p.vy += (Math.random() - 0.5) * 0.3 * delta;
  });

  integrateParticles(state, delta, 0.992);
  state.particles.forEach((p) => wrapParticle(p, engine.width, engine.height));

  const linkDistance = 70 + progress * 70;
  drawFieldLinks(engine.ctx, state.particles, linkDistance, 0.15 + progress * 0.1);

  state.particles.forEach((p) => drawParticleGlow(engine.ctx, p, 0.45 + (p.size / 3) * 0.25));
}
