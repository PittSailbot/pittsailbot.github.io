import * as THREE from 'https://unpkg.com/three@0.166.0/build/three.module.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 6);
camera.lookAt(0, 1, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// --- the calculus part ---
// f(x) = radius at height x. This is literally the function you'd
// plug into pi * integral( f(x)^2 ) dx for the disk-method volume.
// 核心
function f(x) {
  return Math.sin(x * 2) * 0.4 + 0.8;
}

const points = [];
const steps = 40;
const height = 3;
for (let i = 0; i <= steps; i++) {
  const x = (i / steps) * height;   // sample height from 0 to `height`
  const radius = f(x);
  points.push(new THREE.Vector2(radius, x));
}

// 核心

const geometry = new THREE.LatheGeometry(points, 48); // 48 = how round it looks
const material = new THREE.MeshStandardMaterial({
  color: 0x3388ff,
  side: THREE.DoubleSide,
  flatShading: false,
});
const solid = new THREE.Mesh(geometry, material);
scene.add(solid);

// lights, since MeshStandardMaterial needs them to show anything
const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(5, 10, 5);
scene.add(light);
scene.add(new THREE.AmbientLight(0xffffff, 0.3)); // soft fill light so the back isn't pure black

function animate() {
  requestAnimationFrame(animate);
  solid.rotation.y += 0.005; // slow spin so you can see the whole profile
  renderer.render(scene, camera);
}
animate();