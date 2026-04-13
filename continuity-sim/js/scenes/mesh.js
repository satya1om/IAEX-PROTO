export function renderMesh(engine, state, delta, progress) {
  const { ctx } = engine;
  const cols = 14;
  const rows = 9;
  const xGap = engine.width / (cols + 1);
  const yGap = engine.height / (rows + 1);

  state.particles.forEach((p) => {
    const gx = Math.round(p.x / xGap) * xGap;
    const gy = Math.round(p.y / yGap) * yGap;
    p.x += (gx - p.x) * (0.8 * delta + progress * 0.02);
    p.y += (gy - p.y) * (0.8 * delta + progress * 0.02);
  });

  for (let i = 0; i < state.particles.length; i += 1) {
    const a = state.particles[i];
    ctx.beginPath();
    ctx.arc(a.x, a.y, a.size * 0.9, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(232, 238, 245, 0.72)";
    ctx.fill();

    for (let j = i + 1; j < state.particles.length; j += 1) {
      const b = state.particles[j];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < 70) {
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(180, 192, 208, ${(1 - d / 70) * 0.45})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }
    }
  }
}
