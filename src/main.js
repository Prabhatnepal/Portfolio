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

// Stars
function addStars() {
  const starGeometry = new THREE.SphereGeometry(0.25, 24, 24);
  const starMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

  for (let i = 0; i < 200; i++) {
    const star = new THREE.Mesh(starGeometry, starMaterial);
    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
    star.position.set(x, y, z);
    scene.add(star);
  }
}
addStars();


// Texture cube
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
  new THREE.MeshBasicMaterial({ map: prabhatTexture })
);
prabhat1.position.set(-15, 5, 5);
scene.add(prabhat1);


// Orbit Controls (optional if scroll only)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.enableRotate = false;

// Scroll-based animation
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  // Camera movement
  camera.position.z = 30 - scrollY * 0.05;
  camera.position.y = scrollY * 0.01;
  camera.lookAt(torus.position);

  // Rotation effects based on scroll
  torus.rotation.x = scrollY * 0.005;
  torus.rotation.y = scrollY * 0.005;

  prabhat.rotation.x = scrollY * 0.005;
  prabhat.rotation.y = scrollY * 0.005;

  prabhat1.rotation.x = scrollY * 0.005;
  prabhat1.rotation.y = scrollY * 0.005;

  // RGB torus color cycling
  const time = scrollY * 0.01;
  const r = Math.sin(time * 0.3) * 0.5 + 0.5;
  const g = Math.sin(time * 0.4 + 2) * 0.5 + 0.5;
  const b = Math.sin(time * 0.5 + 4) * 0.5 + 0.5;
  torus.material.color.setRGB(r, g, b);

  renderer.render(scene, camera);
});

function animate() {
  requestAnimationFrame(animate);

  // Rotate the prabhat cube continuously
  prabhat.rotation.x += 0.01;
  prabhat.rotation.y += 0.01; 


  prabhat1.rotation.x += 0.01;
  prabhat1.rotation.y += 0.01;

  // Optional: You can still rotate the torus too
  torus.rotation.x -= 0.005;
  torus.rotation.y -= 0.005;
  torus.rotation.z -= 0.005;

  renderer.render(scene, camera);
}
animate();


// Initial render
renderer.render(scene, camera);

// Resize handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
});

// GSAP animations
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