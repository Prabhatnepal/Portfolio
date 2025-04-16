import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// === THREE.js Setup ===
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 30);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#canvas'),
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// === Orbit Controls (optional for debugging) ===
const controls = new OrbitControls(camera, renderer.domElement);
controls.enabled = false;

// === Torus ===
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(10, 3, 16, 100),
  new THREE.MeshBasicMaterial({ color: 0xff6347, wireframe: true })
);
scene.add(torus);

// === Stars ===
function addStars() {
  const starGeometry = new THREE.SphereGeometry(0.25, 24, 24);
  const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

  for (let i = 0; i < 200; i++) {
    const star = new THREE.Mesh(starGeometry, starMaterial);
    const [x, y, z] = Array(3)
      .fill()
      .map(() => THREE.MathUtils.randFloatSpread(100));
    star.position.set(x, y, z);
    scene.add(star);
  }
}
addStars();

// === Profile Cubes ===
const texture = new THREE.TextureLoader().load('img/Prabhat.jpg');

const prabhat = new THREE.Mesh(
  new THREE.BoxGeometry(2, 2, 2),
  new THREE.MeshBasicMaterial({ map: texture })
);
prabhat.position.set(15, 5, 5);
scene.add(prabhat);

const prabhat1 = new THREE.Mesh(
  new THREE.BoxGeometry(2, 2, 2),
  new THREE.MeshBasicMaterial({ map: texture })
);
prabhat1.position.set(-15, 5, 5);
scene.add(prabhat1);

// === Animation Loop ===
function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x -= 0.005;
  torus.rotation.y -= 0.005;
  torus.rotation.z -= 0.005;

  prabhat.rotation.x += 0.01;
  prabhat.rotation.y += 0.01;

  prabhat1.rotation.x += 0.01;
  prabhat1.rotation.y += 0.01;

  renderer.render(scene, camera);
}
animate();

// === Resize Handling ===
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// === Section Scroll Camera Animation ===
const sections = document.querySelectorAll(".scroll-page");

sections.forEach((section, index) => {
  const zoomZ = 30 - index * 8; // Adjust depth
  const moveY = index * 6;      // Adjust height

  ScrollTrigger.create({
    trigger: section,
    start: "top center",
    onEnter: () => {
      gsap.to(camera.position, {
        z: zoomZ,
        y: moveY,
        duration: 1.5,
        ease: "power2.inOut",
        onUpdate: () => {
          camera.lookAt(torus.position);
        },
      });
    },
    onEnterBack: () => {
      gsap.to(camera.position, {
        z: zoomZ,
        y: moveY,
        duration: 1.5,
        ease: "power2.inOut",
        onUpdate: () => {
          camera.lookAt(torus.position);
        },
      });
    }
  });
});

// === GSAP Content Reveal ===
gsap.from(".intro h1", {
  y: 50,
  opacity: 0,
  duration: 1,
  ease: "power3.out",
});

gsap.from(".intro p", {
  y: 30,
  opacity: 0,
  delay: 0.3,
  duration: 1,
  ease: "power3.out",
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
