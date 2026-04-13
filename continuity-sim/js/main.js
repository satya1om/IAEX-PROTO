import { Engine } from "./engine.js";
import { SceneManager } from "./scene-manager.js";

const canvas = document.getElementById("field");
const line = document.getElementById("line");

if (!(canvas instanceof HTMLCanvasElement) || !(line instanceof HTMLParagraphElement)) {
  throw new Error("Required elements are missing in DOM.");
}

const [content, scenes] = await Promise.all([
  fetch("./data/content.json").then((response) => response.json()),
  fetch("./data/scenes.json").then((response) => response.json())
]);

const engine = new Engine(canvas);
const manager = new SceneManager(engine, scenes, content, line);

function updateDocumentHeight() {
  document.body.style.minHeight = `${window.innerHeight * 8}px`;
}

function scrollProgress() {
  const max = Math.max(document.body.scrollHeight - window.innerHeight, 1);
  return window.scrollY / max;
}

updateDocumentHeight();
manager.setProgress(scrollProgress());

window.addEventListener("resize", () => {
  engine.resize();
  manager.onResize();
  updateDocumentHeight();
  manager.setProgress(scrollProgress());
});

window.addEventListener("scroll", () => {
  manager.setProgress(scrollProgress());
});

engine.frame((delta) => manager.render(delta));
