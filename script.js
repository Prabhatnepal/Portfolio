import * as THREE from 'https://cdn.skypack.dev/three@0.150.0';
import { gsap } from 'https://cdn.skypack.dev/gsap';

particlesJS.load('particles-js', '/particles.json', function () {
  console.log('loaded');
});


const canvas = document.getElementById('glass-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio); // Ensures the canvas looks crisp on mobile devices

camera.position.z = 10;

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

// Shatter animation with additional effects
function shatterGlass() {
  // Glass-breaking sound effect
  const glassSound = new Audio('/sound/glass_break.wav');
  glassSound.play();

  shards.forEach(shard => {
    // Shard movement and scaling animation
    gsap.to(shard.position, {
      x: shard.position.x * 3 + (Math.random() - 0.5) * 5,
      y: shard.position.y * 3 + (Math.random() - 0.5) * 5,
      z: (Math.random() - 0.5) * 5,
      duration: 1,
      ease: "power2.out"
    });

    gsap.to(shard.scale, {
      x: shard.scale.x * 2,
      y: shard.scale.y * 2,
      z: shard.scale.z * 2,
      duration: 1,
      ease: "power2.out"
    });

    // Fade-out effect
    gsap.to(shard.material, {
      opacity: 0,
      duration: 1,
      ease: "power2.out"
    });
  });

  // Camera shake for impact effect
  gsap.to(camera.position, {
    x: camera.position.x + (Math.random() - 0.5) * 0.2,
    y: camera.position.y + (Math.random() - 0.5) * 0.2,
    z: camera.position.z + (Math.random() - 0.5) * 0.2,
    duration: 0.1,
    ease: "back.out(1.7)"
  });

  // Adding background blur effect (optional)
  const blurMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x000000, 
    side: THREE.BackSide, 
    transparent: true, 
    opacity: 0.2
  });
  const blurGeometry = new THREE.SphereGeometry(50, 32, 32);
  const blurSphere = new THREE.Mesh(blurGeometry, blurMaterial);
  scene.add(blurSphere);
  gsap.to(blurMaterial, { opacity: 0, duration: 1 });
}

// Expose the function to the window object for use elsewhere
window.shatterGlass = shatterGlass;