import { renderHero } from "./scenes/hero.js";
import { renderFracture } from "./scenes/fracture.js";
import { renderMesh } from "./scenes/mesh.js";
import { renderChain } from "./scenes/chain.js";
import { renderGravity } from "./scenes/gravity.js";
import { renderCorridor } from "./scenes/corridor.js";
import { renderCivilization } from "./scenes/civilization.js";
import { clamp, easeInOut } from "./scenes/common.js";

const renderers = {
  hero: renderHero,
  fracture: renderFracture,
  mesh: renderMesh,
  chain: renderChain,
  gravity: renderGravity,
  corridor: renderCorridor,
  civilization: renderCivilization
};

export class SceneManager {
  constructor(engine, sceneRanges, content, lineElement) {
    this.engine = engine;
    this.sceneRanges = sceneRanges;
    this.content = content;
    this.lineElement = lineElement;
    this.progress = 0;
    this.lastSceneId = "hero";
    this.state = this.createState();
  }

  createState() {
    const count = Math.floor((this.engine.width * this.engine.height) / 9500);
    const particles = [];
    for (let i = 0; i < count; i += 1) {
      particles.push({
        x: Math.random() * this.engine.width,
        y: Math.random() * this.engine.height,
        vx: (Math.random() - 0.5) * 24,
        vy: (Math.random() - 0.5) * 24,
        size: 0.8 + Math.random() * 1.8
      });
    }
    return { particles };
  }

  onResize() {
    this.state = this.createState();
  }

  setProgress(value) {
    this.progress = Math.max(0, Math.min(1, value));
  }

  resolveScene() {
    return (
      this.sceneRanges.find(
        (scene) => this.progress >= scene.start && this.progress <= scene.end
      ) || this.sceneRanges[this.sceneRanges.length - 1]
    );
  }

  render(delta) {
    this.engine.clear(0.33);
    const scene = this.resolveScene();
    const localProgress = clamp(
      (this.progress - scene.start) / Math.max(scene.end - scene.start, 0.0001),
      0,
      1
    );
    const eased = easeInOut(localProgress);

    const renderer = renderers[scene.id];
    if (renderer) {
      renderer(this.engine, this.state, delta, eased);
    }

    if (scene.id === "hero") {
      this.lineElement.textContent = this.content.hero;
    } else if (scene.id === "mesh") {
      this.lineElement.textContent = this.content.mesh;
    } else if (scene.id === "civilization") {
      this.lineElement.textContent = this.content.final;
    } else {
      this.lineElement.textContent = "";
    }

    const intensity = scene.id === this.lastSceneId ? 0.85 : 0.95;
    this.lineElement.style.opacity = String(intensity);
    this.lastSceneId = scene.id;
  }
}
