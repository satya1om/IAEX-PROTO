export function renderChain(engine, state, delta, progress) {
  const { ctx } = engine;
  const time = performance.now() * 0.0015;

  for (let i = 0; i < state.particles.length; i += 1) {
    const p = state.particles[i];
    p.x += Math.sin(time + i * 0.17) * delta * 6;
    p.y += Math.cos(time + i * 0.11) * delta * 6;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * 0.8, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(230, 236, 245, 0.6)";
    ctx.fill();

    if (i % 3 === 0 && i + 3 < state.particles.length) {
      const q = state.particles[i + 3];
      const mx = (p.x + q.x) * 0.5;
      const my = (p.y + q.y) * 0.5 + Math.sin(time * 2 + i) * 18 * progress;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.quadraticCurveTo(mx, my, q.x, q.y);
      ctx.strokeStyle = `rgba(196, 208, 224, ${0.28 + progress * 0.4})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }
  }
}
