export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export function wrapParticle(p, width, height) {
  if (p.x < -8) p.x = width + 8;
  if (p.x > width + 8) p.x = -8;
  if (p.y < -8) p.y = height + 8;
  if (p.y > height + 8) p.y = -8;
}

export function integrateParticles(state, delta, drag = 0.985) {
  state.particles.forEach((p) => {
    p.x += p.vx * delta;
    p.y += p.vy * delta;
    p.vx *= drag;
    p.vy *= drag;
  });
}

export function drawParticleGlow(ctx, p, alpha = 0.8) {
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(232, 239, 246, ${alpha})`;
  ctx.fill();
}

export function drawFieldLinks(ctx, particles, maxDistance, alphaScale = 0.2) {
  for (let i = 0; i < particles.length; i += 1) {
    for (let j = i + 1; j < particles.length; j += 1) {
      const a = particles[i];
      const b = particles[j];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < maxDistance) {
        const alpha = (1 - d / maxDistance) * alphaScale;
        if (alpha < 0.01) continue;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(178, 193, 210, ${alpha})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }
    }
  }
}

export function applyAttractor(state, x, y, strength, delta) {
  state.particles.forEach((p) => {
    const dx = x - p.x;
    const dy = y - p.y;
    const d = Math.max(40, Math.hypot(dx, dy));
    const pull = strength / (d * d);
    p.vx += (dx / d) * pull * delta;
    p.vy += (dy / d) * pull * delta;
  });
}

export function applyVortex(state, x, y, strength, delta) {
  state.particles.forEach((p) => {
    const dx = p.x - x;
    const dy = p.y - y;
    const d = Math.max(40, Math.hypot(dx, dy));
    const swirl = strength / d;
    p.vx += (-dy / d) * swirl * delta;
    p.vy += (dx / d) * swirl * delta;
  });
}
