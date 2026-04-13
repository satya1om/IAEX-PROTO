import { applyAttractor, applyVortex, drawParticleGlow, integrateParticles } from "./common.js";

export function renderGravity(engine, state, delta, progress) {
  const hubs = [
    { x: engine.width * 0.24, y: engine.height * 0.38, mass: 9500 },
    { x: engine.width * 0.73, y: engine.height * 0.44, mass: 7800 },
    { x: engine.width * 0.5, y: engine.height * 0.72, mass: 8600 }
  ];

  hubs.forEach((hub, index) => {
    applyAttractor(state, hub.x, hub.y, hub.mass * (0.75 + progress), delta);
    applyVortex(state, hub.x, hub.y, (index % 2 === 0 ? 1 : -1) * 220 * (0.5 + progress), delta);
  });
  integrateParticles(state, delta, 0.987);

  hubs.forEach((hub) => {
    engine.ctx.beginPath();
    engine.ctx.arc(hub.x, hub.y, 7 + progress * 5, 0, Math.PI * 2);
    engine.ctx.fillStyle = "rgba(232, 240, 248, 0.75)";
    engine.ctx.fill();
    for (let ring = 1; ring < 4; ring += 1) {
      engine.ctx.beginPath();
      engine.ctx.arc(hub.x, hub.y, ring * (24 + progress * 12), 0, Math.PI * 2);
      engine.ctx.strokeStyle = `rgba(175, 190, 208, ${0.13 - ring * 0.02})`;
      engine.ctx.lineWidth = 1;
      engine.ctx.stroke();
    }
  });

  state.particles.forEach((p) => drawParticleGlow(engine.ctx, p, 0.58));
}
