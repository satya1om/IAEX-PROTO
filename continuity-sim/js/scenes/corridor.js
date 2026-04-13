export function renderCorridor(engine, state, _delta, progress) {
  const { ctx } = engine;
  const hubs = [
    [0.08, 0.45],
    [0.16, 0.68],
    [0.33, 0.31],
    [0.48, 0.74],
    [0.64, 0.37],
    [0.78, 0.61],
    [0.91, 0.43]
  ].map(([x, y]) => ({ x: x * engine.width, y: y * engine.height }));

  hubs.forEach((h) => {
    ctx.beginPath();
    ctx.arc(h.x, h.y, 3.2, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(232, 239, 246, 0.8)";
    ctx.fill();
  });

  for (let i = 0; i < hubs.length; i += 1) {
    for (let j = i + 1; j < hubs.length; j += 1) {
      if ((i + j) % 2 !== 0) continue;
      const a = hubs[i];
      const b = hubs[j];
      const midX = (a.x + b.x) * 0.5;
      const bulge = Math.sin((i + j) * 0.8) * (60 + progress * 70);
      const midY = (a.y + b.y) * 0.5 - bulge;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.quadraticCurveTo(midX, midY, b.x, b.y);
      ctx.strokeStyle = "rgba(185, 200, 218, 0.23)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }
}
