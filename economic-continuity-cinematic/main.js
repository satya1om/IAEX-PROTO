const canvas = document.getElementById("sim");
const caption = document.getElementById("caption");

if (!(canvas instanceof HTMLCanvasElement) || !(caption instanceof HTMLDivElement)) {
  throw new Error("Missing required DOM elements.");
}

const ctx = canvas.getContext("2d");
if (!ctx) {
  throw new Error("Canvas 2D context not available.");
}

const narrative = await fetch("./narrative.json").then((res) => res.json());

const scenes = [
  { id: "hero", start: 0.0, end: 0.14 },
  { id: "fracture", start: 0.14, end: 0.28 },
  { id: "mesh", start: 0.28, end: 0.42 },
  { id: "chain", start: 0.42, end: 0.56 },
  { id: "gravity", start: 0.56, end: 0.7 },
  { id: "corridor", start: 0.7, end: 0.84 },
  { id: "civilization", start: 0.84, end: 1.0 }
];

const state = {
  w: 0,
  h: 0,
  particles: [],
  time: 0
};

function clamp(x, min, max) {
  return Math.max(min, Math.min(max, x));
}

function ease(t) {
  return t < 0.5 ? 2 * t * t : 1 - ((-2 * t + 2) ** 2) / 2;
}

function resize() {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  state.w = window.innerWidth;
  state.h = window.innerHeight;
  canvas.width = Math.floor(state.w * dpr);
  canvas.height = Math.floor(state.h * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const count = Math.floor((state.w * state.h) / 9300);
  state.particles = Array.from({ length: count }, () => ({
    x: Math.random() * state.w,
    y: Math.random() * state.h,
    vx: (Math.random() - 0.5) * 20,
    vy: (Math.random() - 0.5) * 20,
    size: 0.8 + Math.random() * 1.8
  }));
}

function clear() {
  ctx.fillStyle = "rgba(2,3,4,0.35)";
  ctx.fillRect(0, 0, state.w, state.h);
}

function drawParticle(p, alpha = 0.65) {
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(232,239,246,${alpha})`;
  ctx.fill();
}

function drawLinks(maxDistance, alphaScale) {
  for (let i = 0; i < state.particles.length; i += 1) {
    for (let j = i + 1; j < state.particles.length; j += 1) {
      const a = state.particles[i];
      const b = state.particles[j];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d >= maxDistance) continue;
      const alpha = (1 - d / maxDistance) * alphaScale;
      if (alpha < 0.01) continue;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = `rgba(180,194,210,${alpha})`;
      ctx.lineWidth = 0.7;
      ctx.stroke();
    }
  }
}

function integrate(delta, drag = 0.988) {
  state.particles.forEach((p) => {
    p.x += p.vx * delta;
    p.y += p.vy * delta;
    p.vx *= drag;
    p.vy *= drag;
    if (p.x < -8) p.x = state.w + 8;
    if (p.x > state.w + 8) p.x = -8;
    if (p.y < -8) p.y = state.h + 8;
    if (p.y > state.h + 8) p.y = -8;
  });
}

function applyAttractor(x, y, strength, delta) {
  state.particles.forEach((p) => {
    const dx = x - p.x;
    const dy = y - p.y;
    const d = Math.max(40, Math.hypot(dx, dy));
    const pull = strength / (d * d);
    p.vx += (dx / d) * pull * delta;
    p.vy += (dy / d) * pull * delta;
  });
}

function sceneHero(delta, t) {
  const noise = 0.7 + t * 0.8;
  state.particles.forEach((p, i) => {
    p.vx += Math.sin(state.time * 0.3 + i * 0.15) * noise * delta;
    p.vy += Math.cos(state.time * 0.24 + i * 0.12) * noise * delta;
  });
  integrate(delta, 0.993);
  drawLinks(90 + t * 80, 0.18 + t * 0.1);
  state.particles.forEach((p) => drawParticle(p, 0.45));
}

function sceneFracture(delta, t) {
  const split = 8 + t * 24;
  state.particles.forEach((p, i) => {
    const angle = Math.atan2(p.y - state.h * 0.5, p.x - state.w * 0.5) + Math.sin(state.time + i) * 0.3;
    p.vx += Math.cos(angle) * split * delta;
    p.vy += Math.sin(angle) * split * delta;
  });
  integrate(delta, 0.986);
  state.particles.forEach((p, i) => {
    const sides = 3 + (i % 3);
    ctx.beginPath();
    for (let k = 0; k < sides; k += 1) {
      const a = (Math.PI * 2 * k) / sides + state.time * 0.4;
      const r = p.size * (1.4 + (k % 2) * 0.5);
      const x = p.x + Math.cos(a) * r;
      const y = p.y + Math.sin(a) * r;
      if (k === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = `rgba(212,222,234,${0.2 + t * 0.35})`;
    ctx.fill();
  });
}

function sceneMesh(delta, t) {
  const cols = 16;
  const rows = 10;
  const xGap = state.w / (cols + 1);
  const yGap = state.h / (rows + 1);
  state.particles.forEach((p) => {
    const tx = Math.round(p.x / xGap) * xGap;
    const ty = Math.round(p.y / yGap) * yGap;
    p.x += (tx - p.x) * (0.28 + t * 0.45) * delta;
    p.y += (ty - p.y) * (0.28 + t * 0.45) * delta;
  });
  drawLinks(82, 0.3 + t * 0.15);
  state.particles.forEach((p) => drawParticle(p, 0.72));
}

function sceneChain(delta, t) {
  const flow = 16 + t * 22;
  state.particles.forEach((p, i) => {
    p.vx += flow * delta;
    p.vy += Math.sin(state.time * 2 + i * 0.09) * (4 + t * 7) * delta;
  });
  integrate(delta, 0.99);
  for (let i = 0; i < state.particles.length - 8; i += 4) {
    const a = state.particles[i];
    const b = state.particles[i + 8];
    const mx = (a.x + b.x) * 0.5;
    const my = (a.y + b.y) * 0.5 + Math.sin(state.time + i) * 26;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.quadraticCurveTo(mx, my, b.x, b.y);
    ctx.strokeStyle = `rgba(196,208,224,${0.24 + t * 0.35})`;
    ctx.lineWidth = 1.1;
    ctx.stroke();
  }
  state.particles.forEach((p) => drawParticle(p, 0.55));
}

function sceneGravity(delta, t) {
  const hubs = [
    [state.w * 0.25, state.h * 0.36, 9000],
    [state.w * 0.73, state.h * 0.43, 7800],
    [state.w * 0.52, state.h * 0.71, 8500]
  ];
  hubs.forEach(([x, y, mass], idx) => {
    applyAttractor(x, y, mass * (0.7 + t), delta);
    state.particles.forEach((p) => {
      const dx = p.x - x;
      const dy = p.y - y;
      const d = Math.max(40, Math.hypot(dx, dy));
      const swirl = (idx % 2 === 0 ? 1 : -1) * (130 + t * 80) / d;
      p.vx += -dy * swirl * delta;
      p.vy += dx * swirl * delta;
    });
  });
  integrate(delta, 0.987);
  hubs.forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, 7 + t * 5, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(233,240,248,0.76)";
    ctx.fill();
  });
  state.particles.forEach((p) => drawParticle(p, 0.6));
}

function sceneCorridor(_delta, t) {
  const hubs = [
    [0.05, 0.44], [0.16, 0.67], [0.31, 0.3], [0.44, 0.72],
    [0.58, 0.35], [0.73, 0.63], [0.9, 0.45]
  ].map(([x, y]) => [x * state.w, y * state.h]);

  hubs.forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(236,242,249,0.82)";
    ctx.fill();
  });

  for (let i = 0; i < hubs.length; i += 1) {
    for (let j = i + 1; j < hubs.length; j += 1) {
      if ((i + j) % 2 !== 0) continue;
      const [ax, ay] = hubs[i];
      const [bx, by] = hubs[j];
      const mx = (ax + bx) * 0.5;
      const my = (ay + by) * 0.5 - (80 + Math.sin((i + 1) * (j + 1)) * 45) * (0.7 + t);
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.quadraticCurveTo(mx, my, bx, by);
      ctx.strokeStyle = "rgba(188,204,222,0.28)";
      ctx.lineWidth = 1.1;
      ctx.stroke();
    }
  }
  state.particles.forEach((p) => drawParticle(p, 0.24));
}

function sceneCivilization(delta, t) {
  const cx = state.w * 0.5;
  const cy = state.h * 0.5;
  state.particles.forEach((p, i) => {
    const angle = (i / state.particles.length) * Math.PI * 2 + state.time * 0.45;
    const lane = 120 + (i % 44) * 6;
    const tx = cx + Math.cos(angle) * lane;
    const ty = cy + Math.sin(angle) * lane * 0.62;
    p.x += (tx - p.x) * (0.4 + t * 0.6) * delta;
    p.y += (ty - p.y) * (0.4 + t * 0.6) * delta;
  });
  drawLinks(96, 0.34);
  for (let ring = 1; ring <= 5; ring += 1) {
    ctx.beginPath();
    ctx.ellipse(cx, cy, 120 + ring * 66, 90 + ring * 46, 0, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(176,193,212,${0.16 - ring * 0.02})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  state.particles.forEach((p) => drawParticle(p, 0.68));
}

const renderByScene = {
  hero: sceneHero,
  fracture: sceneFracture,
  mesh: sceneMesh,
  chain: sceneChain,
  gravity: sceneGravity,
  corridor: sceneCorridor,
  civilization: sceneCivilization
};

function sceneFromProgress(progress) {
  return scenes.find((s) => progress >= s.start && progress <= s.end) || scenes[scenes.length - 1];
}

function setCaption(sceneId) {
  if (sceneId === "hero") caption.textContent = narrative.hero;
  else if (sceneId === "mesh") caption.textContent = narrative.mesh;
  else if (sceneId === "civilization") caption.textContent = narrative.civilization;
  else caption.textContent = "";
  caption.style.opacity = sceneId === "hero" || sceneId === "mesh" || sceneId === "civilization" ? "0.9" : "0.65";
}

function scrollProgress() {
  const max = Math.max(document.body.scrollHeight - window.innerHeight, 1);
  return clamp(window.scrollY / max, 0, 1);
}

function setScrollSpace() {
  document.body.style.minHeight = `${window.innerHeight * 8}px`;
}

let progress = 0;
let last = performance.now();

function frame(now) {
  const delta = Math.min((now - last) / 1000, 0.033);
  last = now;
  state.time += delta;
  clear();

  const scene = sceneFromProgress(progress);
  const t = ease(clamp((progress - scene.start) / (scene.end - scene.start || 1), 0, 1));
  setCaption(scene.id);
  renderByScene[scene.id](delta, t);

  requestAnimationFrame(frame);
}

window.addEventListener("resize", () => {
  resize();
  setScrollSpace();
  progress = scrollProgress();
});

window.addEventListener("scroll", () => {
  progress = scrollProgress();
});

resize();
setScrollSpace();
progress = scrollProgress();
requestAnimationFrame(frame);
