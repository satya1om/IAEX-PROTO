function drawParticle(ctx, p, glow = 0.75) {
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(230, 235, 242, ${glow})`;
  ctx.fill();
}

export function renderHero(engine, state, delta, progress) {
  const { ctx } = engine;
  const slow = 0.28 + progress * 0.22;

  state.particles.forEach((p) => {
    p.x += p.vx * slow * delta;
    p.y += p.vy * slow * delta;

    if (p.x < 0 || p.x > engine.width) p.vx *= -1;
    if (p.y < 0 || p.y > engine.height) p.vy *= -1;
    drawParticle(ctx, p, 0.56 + (p.size / 3) * 0.35);
  });

  for (let i = 0; i < state.particles.length; i += 1) {
    for (let j = i + 1; j < state.particles.length; j += 1) {
      const a = state.particles[i];
      const b = state.particles[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const d = Math.hypot(dx, dy);
      const max = 90 + progress * 90;
      if (d < max) {
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(170, 178, 190, ${(1 - d / max) * 0.18})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  }
}
