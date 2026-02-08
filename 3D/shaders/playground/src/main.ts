import * as THREE from "three";

import { Sizes } from "./types";

import vertexShader from "./shaders/000-shaping-functions/vertex.glsl?raw";
import fragmentShader from "./shaders/000-shaping-functions/fragment.glsl?raw";

// Canvas
const canvas: HTMLElement = document.querySelector(
  "canvas.webgl",
) as HTMLElement;

// Scene
const scene = new THREE.Scene();

// Sizes
const sizes: Sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  pixelRatio: Math.min(window.devicePixelRatio, 2),
};

sizes.resolution = new THREE.Vector2(
  sizes.width * sizes.pixelRatio,
  sizes.height * sizes.pixelRatio,
);

// Camera
const camera = new THREE.PerspectiveCamera(
  25,
  sizes.width / sizes.height,
  0.1,
  100,
);
camera.position.set(0, 0, 3);
scene.add(camera);

// Geometry
const geometry = new THREE.PlaneGeometry(2, 2);

// Uniforms
const uniforms = {
  u_time: new THREE.Uniform(1.0),
  u_resolution: new THREE.Uniform(sizes.resolution),
  u_mouse: new THREE.Uniform(new THREE.Vector2()),
};

// Material
const material = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  uniforms: uniforms,
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  sizes.pixelRatio = Math.min(window.devicePixelRatio, 2);

  sizes.resolution?.set(
    sizes.width * sizes.pixelRatio,
    sizes.height * sizes.pixelRatio,
  );

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(sizes.pixelRatio);
});

window.addEventListener("mousemove", (mouseEvent: MouseEvent) => {
  // Update mouse position
  uniforms.u_mouse.value.x = mouseEvent.x;
  uniforms.u_mouse.value.y = mouseEvent.y;
});

// Animate
const clock = new THREE.Clock();

const animate = () => {
  // Update time
  uniforms.u_time.value = clock.getElapsedTime();

  // Render
  renderer.render(scene, camera);

  // Call animate on the next frame
  window.requestAnimationFrame(animate);
};

animate();
