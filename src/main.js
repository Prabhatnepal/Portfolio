import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Create scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 30;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#canvas'),
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.render(scene, camera);

// Torus
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshBasicMaterial({ color: 0xff6347, wireframe: true });
const torus = new THREE.Mesh(geometry, material);
scene.add(torus);

// Stars
function addStars() {
  const starGeometry = new THREE.SphereGeometry(0.25, 24, 24);
  const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

  for (let i = 0; i < 200; i++) {
    const star = new THREE.Mesh(starGeometry, starMaterial);
    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
    star.position.set(x, y, z);
    scene.add(star);
  }
}
addStars();

// Image texture
const prabhatTexture = new THREE.TextureLoader().load('img/Prabhat.jpg');
const prabhat = new THREE.Mesh(
  new THREE.BoxGeometry(2, 2, 2),
  new THREE.MeshBasicMaterial({ map: prabhatTexture })
);
prabhat.position.set(10, 5, 5);
scene.add(prabhat);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);

// Animate
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const time = Date.now() * 0.001;

  // Animate torus rotation
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.01;

  // Animate prabhat cube
  prabhat.rotation.x += 0.01;
  prabhat.rotation.y += 0.01;
  prabhat.rotation.z += 0.01;

  // Animate camera in a subtle circle
  const t = clock.getElapsedTime();
  camera.position.z = 30 + Math.sin(t) * 5;
  camera.position.y = Math.cos(t) * 2;
  camera.lookAt(torus.position);

  // 🌈 Animate torus color
  const r = Math.sin(time * 0.3) * 0.5 + 0.5;
const g = Math.sin(time * 0.4 + 2) * 0.5 + 0.5;
const b = Math.sin(time * 0.5 + 4) * 0.5 + 0.5;

  torus.material.color.setRGB(r, g, b);

  controls.update();
  renderer.render(scene, camera);
}
animate();


// Scroll event
window.addEventListener('scroll', () => {
  const t = window.scrollY;
  camera.position.z = 30 - t * 0.05;
  camera.position.y = t * 0.01;
  torus.rotation.x += 0.005;
  torus.rotation.y += 0.005;
});

// Optional: handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});



import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Animate intro
gsap.from(".intro h1", {
  y: 50,
  opacity: 0,
  duration: 1,
  ease: "power3.out"
});

gsap.from(".intro p", {
  y: 30,
  opacity: 0,
  delay: 0.3,
  duration: 1,
  ease: "power3.out"
});

// Animate cards on scroll
gsap.from(".card", {
  scrollTrigger: {
    trigger: ".card",
    start: "top 90%",
    toggleActions: "play none none none",
  },
  y: 50,
  opacity: 0,
  duration: 1,
  stagger: 0.2,
  ease: "back.out(1.7)",
});
