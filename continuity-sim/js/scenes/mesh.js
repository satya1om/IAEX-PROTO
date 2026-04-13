import { drawFieldLinks, drawParticleGlow, lerp } from "./common.js";

export function renderMesh(engine, state, delta, progress) {
  const cols = 16;
  const rows = 10;
  const xGap = engine.width / (cols + 1);
  const yGap = engine.height / (rows + 1);
  const settle = 0.35 + progress * 0.45;

  state.particles.forEach((p) => {
    const gx = Math.round(p.x / xGap) * xGap;
    const gy = Math.round(p.y / yGap) * yGap;
    p.x = lerp(p.x, gx, settle * delta);
    p.y = lerp(p.y, gy, settle * delta);
  });

  drawFieldLinks(engine.ctx, state.particles, 82, 0.3 + progress * 0.18);
  state.particles.forEach((p) => drawParticleGlow(engine.ctx, p, 0.72));
}
