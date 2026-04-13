export function renderFracture(engine, state, delta, progress) {
  const { ctx } = engine;
  const splitIntensity = 0.4 + progress * 1.5;

  state.particles.forEach((p, idx) => {
    const angle = (idx * 0.37 + performance.now() * 0.00025) % (Math.PI * 2);
    p.vx += Math.cos(angle) * 0.2 * splitIntensity * delta;
    p.vy += Math.sin(angle) * 0.2 * splitIntensity * delta;
    p.x += p.vx * delta * 0.9;
    p.y += p.vy * delta * 0.9;

    if (p.x < 0 || p.x > engine.width) p.vx *= -0.92;
    if (p.y < 0 || p.y > engine.height) p.vy *= -0.92;

    const shard = 3 + ((idx + Math.floor(progress * 10)) % 3);
    ctx.beginPath();
    for (let k = 0; k < shard; k += 1) {
      const a = (Math.PI * 2 * k) / shard + angle;
      const r = p.size * (1.4 + (k % 2) * 0.7);
      const x = p.x + Math.cos(a) * r;
      const y = p.y + Math.sin(a) * r;
      if (k === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = `rgba(214, 222, 234, ${0.2 + progress * 0.45})`;
    ctx.fill();
  });
}
