import * as THREE from 'https://cdn.skypack.dev/three@0.150.0';
import { gsap } from 'https://cdn.skypack.dev/gsap';

const canvas = document.getElementById('glass-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio); // Ensures the canvas looks crisp on mobile devices

camera.position.z = 5;

// Create shattered glass pieces
const shards = [];
const shardGeometry = new THREE.PlaneGeometry(1, 1);
const shardMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
  transparent: true,
  opacity: 0.7
});

for (let i = 0; i < 80; i++) {
  const shard = new THREE.Mesh(shardGeometry, shardMaterial.clone());
  shard.scale.set(Math.random() * 0.3, Math.random() * 0.3, 1);
  shard.position.set(
    (Math.random() - 0.5) * 4,
    (Math.random() - 0.5) * 4,
    0
  );
  scene.add(shard);
  shards.push(shard);
}

// Handle window resizing for responsiveness
function onWindowResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  // Update camera aspect ratio and renderer size
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
}

window.addEventListener('resize', onWindowResize, false);

// Animation function
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// Shatter animation
function shatterGlass() {
  shards.forEach(shard => {
    gsap.to(shard.position, {
      x: shard.position.x * 3 + (Math.random() - 0.5) * 5,
      y: shard.position.y * 3 + (Math.random() - 0.5) * 5,
      z: (Math.random() - 0.5) * 5,
      duration: 1,
      ease: "power2.out"
    });
    gsap.to(shard.material, {
      opacity: 0,
      duration: 1,
      ease: "power2.out"
    });
  });
}

// Expose the function to the window object for use elsewhere
window.shatterGlass = shatterGlass;

