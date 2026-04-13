export function renderGravity(engine, state, delta, progress) {
  const { ctx } = engine;
  const hubs = [
    { x: engine.width * 0.28, y: engine.height * 0.35, mass: 1.3 },
    { x: engine.width * 0.72, y: engine.height * 0.4, mass: 1.05 },
    { x: engine.width * 0.5, y: engine.height * 0.7, mass: 1.25 }
  ];

  hubs.forEach((h) => {
    ctx.beginPath();
    ctx.arc(h.x, h.y, 22 + progress * 26, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(238, 242, 248, 0.06)";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(h.x, h.y, 5 + progress * 4, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(228, 235, 246, 0.72)";
    ctx.fill();
  });

  state.particles.forEach((p) => {
    hubs.forEach((h) => {
      const dx = h.x - p.x;
      const dy = h.y - p.y;
      const dist = Math.max(40, Math.hypot(dx, dy));
      const pull = ((h.mass * 130) / (dist * dist)) * (0.65 + progress);
      p.vx += (dx / dist) * pull * delta * 60;
      p.vy += (dy / dist) * pull * delta * 60;
    });
    p.x += p.vx * delta;
    p.y += p.vy * delta;
    p.vx *= 0.985;
    p.vy *= 0.985;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * 0.85, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(227, 235, 245, 0.55)";
    ctx.fill();
  });
}
