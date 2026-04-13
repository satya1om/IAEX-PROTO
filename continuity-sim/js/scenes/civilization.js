export function renderCivilization(engine, state, delta, progress) {
  const { ctx } = engine;
  const centerX = engine.width * 0.5;
  const centerY = engine.height * 0.5;
  const time = performance.now() * 0.001;

  state.particles.forEach((p, i) => {
    const angle = (i / state.particles.length) * Math.PI * 2 + time * 0.12;
    const radius = 80 + ((i % 40) * 8) + Math.sin(time + i) * 6;
    const targetX = centerX + Math.cos(angle) * radius;
    const targetY = centerY + Math.sin(angle) * radius * 0.65;

    p.x += (targetX - p.x) * (delta * (0.6 + progress * 0.3));
    p.y += (targetY - p.y) * (delta * (0.6 + progress * 0.3));

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * 0.85, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(236, 241, 248, 0.66)";
    ctx.fill();
  });

  const rings = 4;
  for (let r = 1; r <= rings; r += 1) {
    ctx.beginPath();
    ctx.ellipse(
      centerX,
      centerY,
      120 + r * 72,
      90 + r * 52,
      0,
      0,
      Math.PI * 2
    );
    ctx.strokeStyle = `rgba(180, 196, 214, ${0.05 + r * 0.03})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}
