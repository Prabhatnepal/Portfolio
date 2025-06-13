/* import './style.css'; */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.176.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.176.0/examples/jsm/controls/OrbitControls.js';
import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3.10.0/index.js'; 
import { ScrollTrigger } from 'https://cdn.jsdelivr.net/npm/gsap@3.10.0/ScrollTrigger.min.js'; 
gsap.registerPlugin(ScrollTrigger); // Register the plugin

//GSAP and ScrollTrigger


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

// Intro animations
gsap.from(".intro h1", {
  y: 50,
  opacity: 0,
  duration: 1,
  ease: "power3.out"
});

gsap.from("#typed-text", {
  opacity: 0,
  delay: 0.3,
  duration: 1,
  ease: "power3.out"
});

// Scroll-triggered normal text animations
const scrollItems = [
  { target: ".galaxy-section h2" },
  { target: ".galaxy-section p", delay: 0.3 },
  { target: ".card", stagger: 0.2, ease: "back.out(1.7)" },
  { target: ".contact-container h2" },
  { target: ".contact-container p", delay: 0.3 },
  { target: ".contact-container form", delay: 0.5 }
];

scrollItems.forEach(({ target, delay = 0, stagger = 0, ease = "power3.out" }) => {
  gsap.from(target, {
    scrollTrigger: {
      trigger: target,
      start: "top 90%",
      toggleActions: "play none none none"
    },
    y: 50,
    opacity: 0,
    delay,
    stagger,
    duration: 1,
    ease
  });
});

// Profile section animations (special)
gsap.from(".profile-img", {
  scrollTrigger: {
    trigger: ".profile",
    start: "top 90%",
    toggleActions: "play none none none"
  },
  y: 80,
  opacity: 0,
  scale: 0.8,
  rotateX: 30,
  duration: 1.2,
  ease: "power4.out"
});

gsap.from(".profile h2, .profile p", {
  scrollTrigger: {
    trigger: ".profile",
    start: "top 90%",
    toggleActions: "play none none none"
  },
  y: 40,
  opacity: 0,
  delay: 0.3,
  duration: 1,
  ease: "power3.out"
});

gsap.from(".profile .socials a", {
  scrollTrigger: {
    trigger: ".profile",
    start: "top 90%",
    toggleActions: "play none none none"
  },
  y: 20,
  opacity: 0,
  scale: 0.8,
  stagger: 0.1,
  delay: 1,
  duration: 0.8,
  ease: "back.out(1.7)"
});


  document.getElementById("more").addEventListener("click", function() {
    window.location.href = "more.html";
  });