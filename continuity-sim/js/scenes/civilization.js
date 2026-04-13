import { drawFieldLinks, drawParticleGlow, easeInOut, lerp } from "./common.js";

export function renderCivilization(engine, state, delta, progress) {
  const eased = easeInOut(progress);
  const t = performance.now() * 0.0007;
  const cx = engine.width * 0.5;
  const cy = engine.height * 0.5;

  state.particles.forEach((p, i) => {
    const angle = (i / state.particles.length) * Math.PI * 2 + t;
    const lane = 120 + (i % 44) * 6;
    const tx = cx + Math.cos(angle) * lane;
    const ty = cy + Math.sin(angle) * lane * 0.62;
    p.x = lerp(p.x, tx, delta * (0.5 + eased * 0.8));
    p.y = lerp(p.y, ty, delta * (0.5 + eased * 0.8));
  });

  drawFieldLinks(engine.ctx, state.particles, 96, 0.33);
  state.particles.forEach((p) => drawParticleGlow(engine.ctx, p, 0.68));

  for (let ring = 1; ring <= 5; ring += 1) {
    engine.ctx.beginPath();
    engine.ctx.ellipse(cx, cy, 120 + ring * 66, 90 + ring * 46, 0, 0, Math.PI * 2);
    engine.ctx.strokeStyle = `rgba(176, 193, 212, ${0.16 - ring * 0.02})`;
    engine.ctx.lineWidth = 1;
    engine.ctx.stroke();
  }
}
