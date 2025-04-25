import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// THREE.js Setup
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  100, window.innerWidth / window.innerHeight, 0.1, 1000
);
camera.position.z = 30;

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#canvas'),
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Torus
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshBasicMaterial({ color: 0xff6347, wireframe: true });
const torus = new THREE.Mesh(geometry, material);
scene.add(torus);

// Wireframe sphere
const geometry1 = new THREE.SphereGeometry(100, 100, 100);
const wireframe = new THREE.WireframeGeometry(geometry1);
const line = new THREE.LineSegments(wireframe);
line.material.depthTest = false;
line.material.opacity = 0.25;
line.material.transparent = true;
scene.add(line);

// Galaxy
let galaxy;
function createGalaxy() {
  const parameters = {
    count: 3000,
    size: 0.02,
    radius: 15,
    branches: 5,
    spin: 1,
    randomness: 1,
    randomnessPower: 3,
    insideColor: '#ffffcc',
    outsideColor: '#3399ff',
  };

  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(parameters.count * 3);
  const colors = new Float32Array(parameters.count * 3);

  const colorInside = new THREE.Color(parameters.insideColor);
  const colorOutside = new THREE.Color(parameters.outsideColor);

  for (let i = 0; i < parameters.count; i++) {
    const i3 = i * 3;
    const radius = Math.random() * parameters.radius;
    const spinAngle = radius * parameters.spin;
    const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2;

    const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);
    const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);
    const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);

    positions[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius + randomX;
    positions[i3 + 1] = randomY;
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

    const mixedColor = colorInside.clone();
    mixedColor.lerp(colorOutside, radius / parameters.radius);

    colors[i3 + 0] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  });

  galaxy = new THREE.Points(geometry, material);
  scene.add(galaxy);
}
createGalaxy();

// Texture cubes
const prabhatTexture = new THREE.TextureLoader().load('img/Prabhat.jpg');
const prabhat = new THREE.Mesh(
  new THREE.BoxGeometry(2, 2, 2),
  new THREE.MeshBasicMaterial({ map: prabhatTexture })
);
prabhat.position.set(15, 5, 5);
scene.add(prabhat);

const prabhat1Texture = new THREE.TextureLoader().load('img/Prabhat.jpg');
const prabhat1 = new THREE.Mesh(
  new THREE.BoxGeometry(2, 2, 2),
  new THREE.MeshBasicMaterial({ map: prabhat1Texture })
);
prabhat1.position.set(-15, 5, 5);
scene.add(prabhat1);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.enableRotate = true;
controls.enabled = false; // Initially disabled

// Toggle OrbitControls in galaxy section
let controlsEnabled = false;

ScrollTrigger.create({
  trigger: ".galaxy-section",
  start: "top center",
  end: "bottom center",
  onEnter: () => {
    controlsEnabled = true;
    controls.enabled = true;
  },
  onLeave: () => {
    controlsEnabled = false;
    controls.enabled = false;
  },
  onEnterBack: () => {
    controlsEnabled = true;
    controls.enabled = true;
  },
  onLeaveBack: () => {
    controlsEnabled = false;
    controls.enabled = false;
  }
});

// Scroll-based animation
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  camera.position.z = 30 - scrollY * 0.05;
  camera.position.y = scrollY * 0.01;
  camera.lookAt(torus.position);

  torus.rotation.x = scrollY * 0.005;
  torus.rotation.y = scrollY * 0.005;

  prabhat.rotation.x = scrollY * 0.005;
  prabhat.rotation.y = scrollY * 0.005;

  prabhat1.rotation.x = scrollY * 0.005;
  prabhat1.rotation.y = scrollY * 0.005;

  const time = scrollY * 0.01;
  const r = Math.sin(time * 0.3) * 0.5 + 0.5;
  const g = Math.sin(time * 0.4 + 2) * 0.5 + 0.5;
  const b = Math.sin(time * 0.5 + 4) * 0.5 + 0.5;
  torus.material.color.setRGB(r, g, b);
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  if (controlsEnabled) controls.update();

  if (galaxy) galaxy.rotation.y += 0.0015;

  prabhat.rotation.x += 0.01;
  prabhat.rotation.y += 0.01;

  prabhat1.rotation.x += 0.01;
  prabhat1.rotation.y += 0.01;

  torus.rotation.x -= 0.005;
  torus.rotation.y -= 0.005;
  torus.rotation.z -= 0.005;

  line.rotation.x -= 0.00005;
  line.rotation.y -= 0.00005;
  line.rotation.z -= 0.00005;

  renderer.render(scene, camera);
}
animate();

// Resize handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// GSAP Animations
ScrollTrigger.refresh();

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

gsap.from(".galaxy-section h2", {
  scrollTrigger: {
    trigger: ".galaxy-section",
    start: "top 90%",
    toggleActions: "play none none none",
  },
  y: 50,
  opacity: 0,
  duration: 1,
  ease: "power3.out"
});

gsap.from(".galaxy-section p", {
  scrollTrigger: {
    trigger: ".galaxy-section",
    start: "top 90%",
    toggleActions: "play none none none",
  },
  y: 30,
  opacity: 0,
  duration: 1,
  delay: 0.3,
  ease: "power3.out"
});

gsap.from(".galaxy-section .card", {
  scrollTrigger: {
    trigger: ".galaxy-section .card",
    start: "top 90%",
    toggleActions: "play none none none",
  },
  y: 50,
  opacity: 0,
  duration: 1,
  stagger: 0.2,
  ease: "back.out(1.7)",
});

gsap.from(".footer", {
  scrollTrigger: {
    trigger: ".footer",
    start: "top 90%",
    toggleActions: "play none none none",
  },
  y: 50,
  opacity: 0,
  duration: 1,
  ease: "power3.out"
});
