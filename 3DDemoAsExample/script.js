import * as THREE from 'three';

// === REAL-TIME AUDIO ENGINE ===
// Using Web Audio API to generate spring sound effects based on physics simulation
// The audio engine uses multiple oscillators, filters, and gain nodes to create a rich, dynamic spring sound that responds to the ball's movement and interactions with the wall.
// 这就是生成弹簧声音的实时音频引擎。它使用Web Audio API，通过多个振荡器、滤波器和增益节点来创建丰富的动态弹簧声音，响应球的运动和与墙壁的交互。
let audioCtx = null;

// Continuous oscillators for real-time spring sound
let springOsc1 = null;
let springOsc2 = null;
let springGain = null;
let springFilter = null;
let isAudioRunning = false;

// Sound toggle
let soundEnabled = false;

// Additional audio nodes for richer sound
let springOsc3 = null;
let springLowpass = null;
let springHighpass = null;
let reverbGain = null;
let reverbConvolver = null;

async function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // === SPRING OSCILLATORS ===
    // Main tone - soft sine for warmth
    springOsc1 = audioCtx.createOscillator();
    springOsc1.type = 'sine';
    springOsc1.frequency.value = 180;
    
    // Harmonic - adds metallic shimmer
    springOsc2 = audioCtx.createOscillator();
    springOsc2.type = 'sine';
    springOsc2.frequency.value = 360; // Octave up
    
    // Sub harmonic - body/weight
    springOsc3 = audioCtx.createOscillator();
    springOsc3.type = 'sine';
    springOsc3.frequency.value = 90; // Octave down
    
    // === FILTERS ===
    // Bandpass for resonant metallic character
    springFilter = audioCtx.createBiquadFilter();
    springFilter.type = 'bandpass';
    springFilter.frequency.value = 600;
    springFilter.Q.value = 2; // Gentler resonance
    
    // Lowpass to remove harshness
    springLowpass = audioCtx.createBiquadFilter();
    springLowpass.type = 'lowpass';
    springLowpass.frequency.value = 2000;
    springLowpass.Q.value = 0.5;
    
    // Highpass to remove mud
    springHighpass = audioCtx.createBiquadFilter();
    springHighpass.type = 'highpass';
    springHighpass.frequency.value = 80;
    springHighpass.Q.value = 0.5;
    
    // === SIMPLE REVERB (delay-based) ===
    const reverbDelay = audioCtx.createDelay(0.5);
    reverbDelay.delayTime.value = 0.03;
    const reverbFeedback = audioCtx.createGain();
    reverbFeedback.gain.value = 0.2;
    reverbGain = audioCtx.createGain();
    reverbGain.gain.value = 0.15;
    
    // === MASTER GAIN ===
    springGain = audioCtx.createGain();
    springGain.gain.value = 0;
    
    // === MIXER for oscillators ===
    const osc1Gain = audioCtx.createGain();
    osc1Gain.gain.value = 0.5; // Main tone
    const osc2Gain = audioCtx.createGain();
    osc2Gain.gain.value = 0.15; // Harmonic (subtle)
    const osc3Gain = audioCtx.createGain();
    osc3Gain.gain.value = 0.25; // Sub (moderate)
    
    // Connect oscillators through individual gains
    springOsc1.connect(osc1Gain);
    springOsc2.connect(osc2Gain);
    springOsc3.connect(osc3Gain);
    
    // Mix into filter chain
    osc1Gain.connect(springFilter);
    osc2Gain.connect(springFilter);
    osc3Gain.connect(springFilter);
    
    // Filter chain
    springFilter.connect(springHighpass);
    springHighpass.connect(springLowpass);
    springLowpass.connect(springGain);
    
    // Reverb path
    springLowpass.connect(reverbDelay);
    reverbDelay.connect(reverbFeedback);
    reverbFeedback.connect(reverbDelay);
    reverbDelay.connect(reverbGain);
    reverbGain.connect(springGain);
    
    // Output
    springGain.connect(audioCtx.destination);
    
    // Start oscillators
    springOsc1.start();
    springOsc2.start();
    springOsc3.start();
    
    isAudioRunning = true;
  }
  
  if (audioCtx.state === 'suspended') {
    await audioCtx.resume();
  }
}

// Update sound in real-time based on spring state
function updateSpringSound(velocity, displacement, isMoving) {
  if (!soundEnabled || !isAudioRunning || !springGain) return;
  
  const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
  const stretch = Math.abs(displacement.x);
  const bend = Math.abs(displacement.y);
  
  const now = audioCtx.currentTime;
  
  if (isMoving && speed > 0.3) {
    // === PITCH ===
    // Base frequency rises with tension (stretch + bend)
    const tension = stretch * 0.5 + bend * 0.3;
    const baseFreq = 150 + tension * 30 + speed * 5;
    
    // Smooth frequency transitions
    springOsc1.frequency.setTargetAtTime(baseFreq, now, 0.05);
    springOsc2.frequency.setTargetAtTime(baseFreq * 2.0, now, 0.05); // Perfect octave
    springOsc3.frequency.setTargetAtTime(baseFreq * 0.5, now, 0.08); // Sub octave
    
    // === FILTER - creates "twang" character ===
    // Higher speed = brighter, more resonant
    const filterFreq = 400 + speed * 80 + tension * 40;
    springFilter.frequency.setTargetAtTime(Math.min(filterFreq, 1500), now, 0.03);
    springFilter.Q.setTargetAtTime(1 + speed * 0.3, now, 0.05); // Gentle resonance
    
    // Lowpass opens up with intensity
    springLowpass.frequency.setTargetAtTime(1200 + speed * 200, now, 0.04);
    
    // === VOLUME ===
    // Gentle curve - not too loud, pleasant
    const targetVol = Math.min(0.12, speed * 0.008 + tension * 0.01);
    springGain.gain.setTargetAtTime(targetVol, now, 0.02);
    
  } else {
    // Shorter fade out for snappier boing
    springGain.gain.setTargetAtTime(0, now, 0.08);
  }
}

// One-shot impact sounds - using noise for realistic impacts
function createNoise(duration) {
  const bufferSize = audioCtx.sampleRate * duration;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  // Fill with random noise using Array.from
  Array.from({ length: bufferSize }, (_, i) => {
    data[i] = Math.random() * 2 - 1;
  });
  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;
  return noise;
}

function playWallHitSound(velocity) {
  if (!soundEnabled || !audioCtx) return;
  
  const now = audioCtx.currentTime;
  const intensity = Math.min(1, Math.abs(velocity) * 0.1);
  const vol = 0.15 + intensity * 0.2;
  
  // === SOFT THUMP (main impact) ===
  const thump = audioCtx.createOscillator();
  const thumpGain = audioCtx.createGain();
  const thumpFilter = audioCtx.createBiquadFilter();
  
  thump.type = 'sine';
  thump.frequency.setValueAtTime(100 + intensity * 30, now);
  thump.frequency.exponentialRampToValueAtTime(40, now + 0.08);
  
  thumpFilter.type = 'lowpass';
  thumpFilter.frequency.value = 200;
  
  thumpGain.gain.setValueAtTime(vol * 0.6, now);
  thumpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
  
  thump.connect(thumpFilter);
  thumpFilter.connect(thumpGain);
  thumpGain.connect(audioCtx.destination);
  thump.start(now);
  thump.stop(now + 0.12);
  
  // === SOFT CLICK (attack transient) ===
  const click = audioCtx.createOscillator();
  const clickGain = audioCtx.createGain();
  const clickFilter = audioCtx.createBiquadFilter();
  
  click.type = 'triangle';
  click.frequency.setValueAtTime(800, now);
  click.frequency.exponentialRampToValueAtTime(200, now + 0.02);
  
  clickFilter.type = 'bandpass';
  clickFilter.frequency.value = 500;
  clickFilter.Q.value = 1;
  
  clickGain.gain.setValueAtTime(vol * 0.2, now);
  clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
  
  click.connect(clickFilter);
  clickFilter.connect(clickGain);
  clickGain.connect(audioCtx.destination);
  click.start(now);
  click.stop(now + 0.04);
  
  // === SUBTLE METALLIC RING ===
  if (intensity > 0.3) {
    const ring = audioCtx.createOscillator();
    const ringGain = audioCtx.createGain();
    
    ring.type = 'sine';
    ring.frequency.setValueAtTime(600 + intensity * 200, now);
    
    ringGain.gain.setValueAtTime(vol * 0.08, now);
    ringGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    
    ring.connect(ringGain);
    ringGain.connect(audioCtx.destination);
    ring.start(now);
    ring.stop(now + 0.2);
  }
}

function playReleaseSound(stretch) {
  if (!soundEnabled || !audioCtx) return;
  
  const now = audioCtx.currentTime;
  const intensity = Math.min(1, stretch * 0.15);
  const vol = 0.08 + intensity * 0.12;
  
  // === SOFT PLUCK/TWANG ===
  const pluck = audioCtx.createOscillator();
  const pluckGain = audioCtx.createGain();
  const pluckFilter = audioCtx.createBiquadFilter();
  
  // Pitch based on stretch
  const baseFreq = 200 + stretch * 40;
  pluck.type = 'triangle';
  pluck.frequency.setValueAtTime(baseFreq, now);
  pluck.frequency.exponentialRampToValueAtTime(baseFreq * 0.7, now + 0.1);
  
  pluckFilter.type = 'lowpass';
  pluckFilter.frequency.setValueAtTime(1500, now);
  pluckFilter.frequency.exponentialRampToValueAtTime(400, now + 0.1);
  pluckFilter.Q.value = 2;
  
  pluckGain.gain.setValueAtTime(vol, now);
  pluckGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
  
  pluck.connect(pluckFilter);
  pluckFilter.connect(pluckGain);
  pluckGain.connect(audioCtx.destination);
  pluck.start(now);
  pluck.stop(now + 0.15);
  
  // === HARMONIC SHIMMER ===
  const shimmer = audioCtx.createOscillator();
  const shimmerGain = audioCtx.createGain();
  
  shimmer.type = 'sine';
  shimmer.frequency.setValueAtTime(baseFreq * 2.5, now);
  shimmer.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.08);
  
  shimmerGain.gain.setValueAtTime(vol * 0.15, now);
  shimmerGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
  
  shimmer.connect(shimmerGain);
  shimmerGain.connect(audioCtx.destination);
  shimmer.start(now);
  shimmer.stop(now + 0.1);
}

// === THREE.JS SETUP ===
const scene = new THREE.Scene();

// Create HDR-like environment cubemap for realistic glass reflections
let cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
  format: THREE.RGBAFormat,
  generateMipmaps: true,
  minFilter: THREE.LinearMipmapLinearFilter
});

// PMREMGenerator for proper glass reflections/refractions
let pmremGenerator = null;

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 10);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
document.body.appendChild(renderer.domElement);

// Setup PMREM for realistic glass reflections
pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();

// === ENVIRONMENT / BACKGROUND ===
// Industrial workshop background with gradient, fog and particles
const bgGeometry = new THREE.SphereGeometry(50, 64, 64);
const bgMaterial = new THREE.ShaderMaterial({
  side: THREE.BackSide,
  uniforms: {
    colorTop: { value: new THREE.Color(0x0d1117) },
    colorMid: { value: new THREE.Color(0x1a1f2e) },
    colorBottom: { value: new THREE.Color(0x2d1f1a) }
  },
  vertexShader: `
    varying vec3 vWorldPosition;
    void main() {
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 colorTop;
    uniform vec3 colorMid;
    uniform vec3 colorBottom;
    varying vec3 vWorldPosition;
    
    // Simple noise function
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }
    
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
        mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
        f.y
      );
    }
    
    void main() {
      vec3 dir = normalize(vWorldPosition);
      float h = dir.y * 0.5 + 0.5;
      
      // Three-way gradient
      vec3 color;
      if (h > 0.5) {
        color = mix(colorMid, colorTop, (h - 0.5) * 2.0);
      } else {
        color = mix(colorBottom, colorMid, h * 2.0);
      }
      
      // Add subtle noise texture
      float n = noise(dir.xz * 8.0) * 0.03;
      color += vec3(n);
      
      // Vignette
      float vignette = 1.0 - length(dir.xz) * 0.3;
      color *= vignette;
      
      gl_FragColor = vec4(color, 1.0);
    }
  `
});
const bgSphere = new THREE.Mesh(bgGeometry, bgMaterial);
scene.add(bgSphere);

// Generate environment map from scene for glass reflections
const envScene = new THREE.Scene();
const envBg = new THREE.Mesh(bgGeometry.clone(), bgMaterial.clone());
envScene.add(envBg);

// Add bright spots to environment for realistic glass highlights
const envLights = [
  { pos: [5, 5, 5], color: 0xfff5e6, intensity: 2 },
  { pos: [-3, 3, -3], color: 0xe6f0ff, intensity: 1.5 },
  { pos: [0, -3, 5], color: 0xffe6cc, intensity: 1 }
];
envLights.forEach(({ pos, color, intensity }) => {
  const lightSphere = new THREE.Mesh(
    new THREE.SphereGeometry(2, 16, 16),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: intensity * 0.3 })
  );
  lightSphere.position.set(...pos);
  lightSphere.position.multiplyScalar(8);
  envScene.add(lightSphere);
});

// Render environment cubemap
const glassCubeCamera = new THREE.CubeCamera(0.1, 100, cubeRenderTarget);
glassCubeCamera.update(renderer, envScene);
const envMap = pmremGenerator.fromCubemap(cubeRenderTarget.texture).texture;
scene.environment = envMap;

// Add subtle fog
scene.fog = new THREE.FogExp2(0x1a1f2e, 0.02);

// Floating dust particles
const particleCount = 100;
const particleGeometry = new THREE.BufferGeometry();
const particlePositions = new Float32Array(
  Array.from({ length: particleCount }, () => [
    (Math.random() - 0.5) * 20,
    (Math.random() - 0.5) * 15,
    (Math.random() - 0.5) * 10
  ]).flat()
);
particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
const particleMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.03,
  transparent: true,
  opacity: 0.4,
  sizeAttenuation: true
});
const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

// === LIGHTING ===
// Soft ambient
const ambientLight = new THREE.AmbientLight(0x404060, 0.4);
scene.add(ambientLight);

// Key light (warm)
const keyLight = new THREE.DirectionalLight(0xfff5e6, 1.2);
keyLight.position.set(5, 8, 10);
keyLight.castShadow = true;
keyLight.shadow.mapSize.width = 1024;
keyLight.shadow.mapSize.height = 1024;
keyLight.shadow.camera.near = 1;
keyLight.shadow.camera.far = 30;
keyLight.shadow.camera.left = -10;
keyLight.shadow.camera.right = 10;
keyLight.shadow.camera.top = 10;
keyLight.shadow.camera.bottom = -10;
keyLight.shadow.bias = -0.001;
scene.add(keyLight);

// Fill light (cool blue)
const fillLight = new THREE.DirectionalLight(0x6088ff, 0.4);
fillLight.position.set(-5, 2, 5);
scene.add(fillLight);

// Rim light
const rimLight = new THREE.DirectionalLight(0xff8866, 0.3);
rimLight.position.set(0, -3, -5);
scene.add(rimLight);

// === CONCRETE WALL ===
const wallGeometry = new THREE.PlaneGeometry(8, 12);

// Create procedural concrete texture
const wallCanvas = document.createElement('canvas');
wallCanvas.width = 512;
wallCanvas.height = 512;
const ctx = wallCanvas.getContext('2d');

// Base concrete color
ctx.fillStyle = '#4a4a4a';
ctx.fillRect(0, 0, 512, 512);

// Add noise/grain
Array.from({ length: 50000 }, () => {
  const x = Math.random() * 512;
  const y = Math.random() * 512;
  const brightness = Math.random() * 30 - 15;
  ctx.fillStyle = `rgba(${128 + brightness}, ${128 + brightness}, ${128 + brightness}, 0.1)`;
  ctx.fillRect(x, y, 2, 2);
});

// Add some darker patches
Array.from({ length: 20 }, () => {
  const x = Math.random() * 512;
  const y = Math.random() * 512;
  const size = Math.random() * 60 + 20;
  ctx.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.1})`;
  ctx.beginPath();
  ctx.ellipse(x, y, size, size * 0.6, Math.random() * Math.PI, 0, Math.PI * 2);
  ctx.fill();
});

const wallTexture = new THREE.CanvasTexture(wallCanvas);
wallTexture.wrapS = THREE.RepeatWrapping;
wallTexture.wrapT = THREE.RepeatWrapping;

// Liquid Glass material - Apple-style frosted glass
const wallMaterial = new THREE.MeshPhysicalMaterial({ 
  color: 0xffffff,
  metalness: 0.0,
  roughness: 0.0,
  transmission: 1.0,
  thickness: 2.0,
  ior: 1.45,
  clearcoat: 1.0,
  clearcoatRoughness: 0.0,
  envMapIntensity: 2.5,
  transparent: true,
  side: THREE.DoubleSide,
  attenuationColor: new THREE.Color(0.95, 0.97, 1.0),
  attenuationDistance: 0.5,
  specularIntensity: 1.0,
  specularColor: new THREE.Color(1, 1, 1),
  sheen: 0.1,
  sheenRoughness: 0.2,
  sheenColor: new THREE.Color(0.9, 0.95, 1.0)
});
const wall = new THREE.Mesh(wallGeometry, wallMaterial);
wall.rotation.y = Math.PI / 2;
wall.position.set(-4.5, 0, 0);
wall.receiveShadow = true;
scene.add(wall);

// Colored panel behind glass for refraction visibility
const backPanelGeometry = new THREE.PlaneGeometry(10, 10);
const backPanelMaterial = new THREE.MeshStandardMaterial({
  color: 0x1a2535,
  roughness: 0.7,
  metalness: 0.2
});
const backPanel = new THREE.Mesh(backPanelGeometry, backPanelMaterial);
backPanel.rotation.y = Math.PI / 2;
backPanel.position.set(-6, 0, 0);
scene.add(backPanel);

// === FLOOR (subtle) ===
const floorGeometry = new THREE.PlaneGeometry(20, 20);
const floorMaterial = new THREE.MeshStandardMaterial({
  color: 0x2a2a3a,
  roughness: 0.8,
  metalness: 0.1
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -5;
floor.receiveShadow = true;
scene.add(floor);

// === METAL ANCHOR PLATE ===
const plateGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.08, 32);
const plateMaterial = new THREE.MeshStandardMaterial({
  color: 0x888888,
  roughness: 0.3,
  metalness: 0.9
});
const plate = new THREE.Mesh(plateGeometry, plateMaterial);
plate.rotation.z = Math.PI / 2;
plate.position.set(-4.4, 0, 0);
plate.castShadow = true;
scene.add(plate);

// Anchor bolt
const boltGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.3, 16);
const boltMaterial = new THREE.MeshStandardMaterial({
  color: 0x555555,
  roughness: 0.2,
  metalness: 1.0
});
const bolt = new THREE.Mesh(boltGeometry, boltMaterial);
bolt.rotation.z = Math.PI / 2;
bolt.position.set(-4.2, 0, 0);
bolt.castShadow = true;
scene.add(bolt);

// === REALISTIC CHROME BALL ===
const BALL_RADIUS = 0.5;
const ballGeometry = new THREE.SphereGeometry(BALL_RADIUS, 64, 64);

// Create environment map for reflections
const ballCubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
  format: THREE.RGBAFormat,
  generateMipmaps: true,
  minFilter: THREE.LinearMipmapLinearFilter
});
const ballCubeCamera = new THREE.CubeCamera(0.1, 100, ballCubeRenderTarget);

const ballMaterial = new THREE.MeshStandardMaterial({
  color: 0xcc3333,
  roughness: 0.15,
  metalness: 0.8,
  envMap: ballCubeRenderTarget.texture,
  envMapIntensity: 1.0
});
const ball = new THREE.Mesh(ballGeometry, ballMaterial);
ball.castShadow = true;
ball.receiveShadow = true;
scene.add(ball);

// === METALLIC SPRING (tube geometry) ===
const SPRING_COILS = 20;
const COIL_RADIUS = 0.15;
const WIRE_RADIUS = 0.025;

let springMesh;
const springMaterial = new THREE.MeshStandardMaterial({
  color: 0xaaaaaa,
  roughness: 0.25,
  metalness: 0.95
});

function updateSpring(startPos, endPos) {
  // Remove old spring
  if (springMesh) {
    scene.remove(springMesh);
    springMesh.geometry.dispose();
  }
  
  // Vector from anchor to ball
  const dx = endPos.x - startPos.x;
  const dy = endPos.y - startPos.y;
  const dz = endPos.z - startPos.z;
  const length = Math.sqrt(dx * dx + dy * dy + dz * dz);
  
  if (length < 0.1) return;
  
  // Spring direction
  const dirX = dx / length;
  const dirY = dy / length;
  const dirZ = dz / length;
  
  // Perpendicular vectors for helix
  let perpX, perpY, perpZ;
  if (Math.abs(dirY) < 0.9) {
    perpX = dirZ; perpY = 0; perpZ = -dirX;
  } else {
    perpX = 0; perpY = -dirZ; perpZ = dirY;
  }
  const perpLen = Math.sqrt(perpX * perpX + perpY * perpY + perpZ * perpZ);
  if (perpLen > 0.001) {
    perpX /= perpLen; perpY /= perpLen; perpZ /= perpLen;
  }
  
  // Second perpendicular (cross product)
  const perp2X = dirY * perpZ - dirZ * perpY;
  const perp2Y = dirZ * perpX - dirX * perpZ;
  const perp2Z = dirX * perpY - dirY * perpX;
  
  // Bending: calculate how much spring curves based on Y offset
  // Use cantilever beam curve for realistic bending
  const bendY = endPos.y - startPos.y;
  const bendZ = endPos.z - startPos.z;
  
  const segments = SPRING_COILS * 24;
  
  const points = Array.from({ length: segments + 1 }, (_, i) => {
    const t = i / segments;
    const angle = t * SPRING_COILS * Math.PI * 2;
    const cosA = Math.cos(angle) * COIL_RADIUS;
    const sinA = Math.sin(angle) * COIL_RADIUS;
    
    // Cantilever curve: fixed at wall (t=0), free at ball (t=1)
    // Cubic deflection curve: δ(t) = δmax * (3t² - t³) / 2
    // This gives: slope=0 at t=0 (fixed), max deflection at t=1
    const bendFactor = (3 * t * t - t * t * t) / 2;
    
    // Position along spring center line
    // Interpolate X linearly (stretch), Y/Z with bending curve
    const centerX = startPos.x + dx * t;
    const centerY = startPos.y + bendY * bendFactor;
    const centerZ = startPos.z + bendZ * bendFactor;
    
    // Add helix coils around center line
    return new THREE.Vector3(
      centerX + perpX * cosA + perp2X * sinA,
      centerY + perpY * cosA + perp2Y * sinA,
      centerZ + perpZ * cosA + perp2Z * sinA
    );
  });
  
  const curve = new THREE.CatmullRomCurve3(points);
  const tubeGeometry = new THREE.TubeGeometry(curve, segments, WIRE_RADIUS, 8, false);
  springMesh = new THREE.Mesh(tubeGeometry, springMaterial);
  springMesh.castShadow = true;
  scene.add(springMesh);
}

// === PHYSICS STATE ===
const ANCHOR_X = -4.0;
const ANCHOR_Y = 0;
const ANCHOR_Z = 0;

// Spring natural length (relaxed state)
const SPRING_REST_LENGTH = 3.5;

// Rest position of ball (at end of relaxed spring)
const REST_X = ANCHOR_X + SPRING_REST_LENGTH;
const REST_Y = 0;
const REST_Z = 0;

// Wall collision boundary
const WALL_X = -3.5; // Ball center can't go past this (spring can compress to ~0.5)

// Position - start at rest
let posX = REST_X;
let posY = REST_Y;
let posZ = REST_Z;

// Velocity
let velX = 0;
let velY = 0;
let velZ = 0;

// Spring parameters - extra stiff for sharp response
const SPRING_K = 720;       // Main spring stiffness (along spring axis)
const SPRING_K_BEND = 220;  // Bending stiffness (perpendicular to spring)
const DAMPING = 7;          // Damping raised to tame high energy
const DAMPING_BEND = 5;     // Bending damping - still allows wobble
const MASS = 1;

// Wall bounce
let WALL_RESTITUTION = 0.7; // Bounciness off wall

// === INTERACTION STATE ===
let isDragging = false;
let releaseCount = 0;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const dragPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

// For velocity calculation during drag
let prevDragX = 0;
let prevDragY = 0;
let prevDragTime = 0;
let dragVelX = 0;
let dragVelY = 0;

// === UI ===
const iconSoundOff = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>';
const iconSoundOn = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>';

const ui = document.createElement('div');
ui.innerHTML = `
  <button class="sound-toggle" title="Toggle sound">${iconSoundOff}</button>
  <div class="counter">
    <div class="counter-content">
      <span class="counter-value">0</span>
      <span class="counter-label">releases</span>
    </div>
  </div>
  <div class="hint">drag the ball</div>
`;
document.body.appendChild(ui);

const soundToggle = document.querySelector('.sound-toggle');
soundToggle.addEventListener('click', () => {
  soundEnabled = !soundEnabled;
  
  if (soundEnabled) {
    initAudio();
  }
  
  soundToggle.innerHTML = soundEnabled ? iconSoundOn : iconSoundOff;
  soundToggle.classList.toggle('enabled');
});

function updateCounter() {
  const counterEl = document.querySelector('.counter-value');
  counterEl.textContent = releaseCount;
  counterEl.classList.remove('pop');
  void counterEl.offsetWidth; // Trigger reflow
  counterEl.classList.add('pop');
}

function getPointerCoords(event) {
  const clientX = event.touches ? event.touches[0].clientX : event.clientX;
  const clientY = event.touches ? event.touches[0].clientY : event.clientY;
  mouse.x = (clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(clientY / window.innerHeight) * 2 + 1;
}

function onPointerDown(event) {
  event.preventDefault();
  
  getPointerCoords(event);
  raycaster.setFromCamera(mouse, camera);
  
  // Check if we hit the ball
  const intersects = raycaster.intersectObject(ball);
  if (intersects.length > 0) {
    // Initialize audio on drag start (fixes iOS/browser autoplay policy)
    initAudio();
    
    isDragging = true;
    velX = 0;
    velY = 0;
    velZ = 0;
    prevDragX = posX;
    prevDragY = posY;
    prevDragTime = performance.now();
    dragVelX = 0;
    dragVelY = 0;
  }
}

function onPointerMove(event) {
  if (!isDragging) return;
  event.preventDefault();
  
  getPointerCoords(event);
  raycaster.setFromCamera(mouse, camera);
  
  const intersectPoint = new THREE.Vector3();
  if (raycaster.ray.intersectPlane(dragPlane, intersectPoint)) {
    let newX = intersectPoint.x;
    let newY = intersectPoint.y;
    let newZ = 0;
    
    // Can't go into wall
    if (newX < WALL_X) newX = WALL_X;
    
    // Limit maximum stretch
    const MAX_STRETCH = 7;
    if (newX > MAX_STRETCH) newX = MAX_STRETCH;
    
    // Limit vertical displacement
    const MAX_Y = 5;
    if (newY > MAX_Y) newY = MAX_Y;
    if (newY < -MAX_Y) newY = -MAX_Y;
    
    // Calculate drag velocity
    const now = performance.now();
    const dt = (now - prevDragTime) / 1000;
    if (dt > 0.001) {
      const newVelX = (newX - prevDragX) / dt;
      const newVelY = (newY - prevDragY) / dt;
      dragVelX = dragVelX * 0.5 + newVelX * 0.5;
      dragVelY = dragVelY * 0.5 + newVelY * 0.5;
      prevDragX = newX;
      prevDragY = newY;
      prevDragTime = now;
    }
    
    posX = newX;
    posY = newY;
    posZ = newZ;
  }
}

// === PROGRESSION SYSTEM (secret milestones) ===
let currentPhase = 0;
const confettiParticles = [];

function spawnConfetti(count, color1, color2) {
  const colors = [color1, color2, 0xffffff];
  Array.from({ length: count }, () => {
    const geo = new THREE.PlaneGeometry(0.1, 0.1);
    const mat = new THREE.MeshBasicMaterial({ 
      color: colors[Math.floor(Math.random() * colors.length)],
      side: THREE.DoubleSide
    });
    const particle = new THREE.Mesh(geo, mat);
    particle.position.set(
      posX + (Math.random() - 0.5) * 2,
      posY + (Math.random() - 0.5) * 2,
      posZ + Math.random()
    );
    particle.velocity = new THREE.Vector3(
      (Math.random() - 0.5) * 0.3,
      Math.random() * 0.2 + 0.1,
      (Math.random() - 0.5) * 0.2
    );
    particle.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    particle.life = 1;
    scene.add(particle);
    confettiParticles.push(particle);
  });
}

function playMilestoneSound(phase) {
  if (!soundEnabled || !audioCtx) return;
  const now = audioCtx.currentTime;
  
  // Ascending chime based on phase
  const baseNote = 220 * Math.pow(1.1, phase);
  
  Array.from({ length: 3 }, (_, i) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseNote * (1 + i * 0.25), now + i * 0.1);
    gain.gain.setValueAtTime(0.2, now + i * 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.5);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now + i * 0.1);
    osc.stop(now + i * 0.1 + 0.5);
  });
}

function checkMilestone() {
  const newPhase = Math.floor(releaseCount / 10);
  if (newPhase > currentPhase && releaseCount <= 100) {
    currentPhase = newPhase;
    applyPhaseEffects(currentPhase);
  }
  
  // Special 100 celebration
  if (releaseCount === 100) {
    celebrate100();
  }
}

function applyPhaseEffects(phase) {
  playMilestoneSound(phase);
  
  // Each phase brings subtle but satisfying changes
  switch(phase) {
    case 1: // 10 releases - ball starts glowing warmer
      ballMaterial.color.setHex(0xff5544);
      ballMaterial.emissive = new THREE.Color(0x331111);
      spawnConfetti(15, 0xff5544, 0xffaa44);
      break;
      
    case 2: // 20 - spring turns gold
      springMaterial.color.setHex(0xddaa44);
      spawnConfetti(20, 0xddaa44, 0xffdd77);
      break;
      
    case 3: // 30 - ball becomes more metallic
      ballMaterial.metalness = 0.95;
      ballMaterial.roughness = 0.05;
      ballMaterial.color.setHex(0xff3333);
      spawnConfetti(25, 0xff3333, 0xff7777);
      break;
      
    case 4: // 40 - background warms up
      bgMaterial.uniforms.colorBottom.value.setHex(0x3d2f2a);
      bgMaterial.uniforms.colorMid.value.setHex(0x2a2535);
      spawnConfetti(30, 0xff6644, 0xffaa66);
      break;
      
    case 5: // 50 - spring gets bouncier!
      WALL_RESTITUTION = 0.85;
      springMaterial.color.setHex(0xff8844);
      spawnConfetti(40, 0xff8844, 0xffcc44);
      break;
      
    case 6: // 60 - ball turns hot orange
      ballMaterial.color.setHex(0xff6600);
      ballMaterial.emissive.setHex(0x442200);
      pointLight.color.setHex(0xff8844);
      spawnConfetti(45, 0xff6600, 0xffaa00);
      break;
      
    case 7: // 70 - spring becomes white-hot
      springMaterial.color.setHex(0xffffaa);
      springMaterial.emissive = new THREE.Color(0x333300);
      spawnConfetti(50, 0xffffaa, 0xffffff);
      break;
      
    case 8: // 80 - intense atmosphere
      bgMaterial.uniforms.colorTop.value.setHex(0x1a1020);
      pointLight.intensity = 2;
      pointLight2.intensity = 1.5;
      spawnConfetti(55, 0xff4400, 0xffff44);
      break;
      
    case 9: // 90 - ball turns white, everything intense
      ballMaterial.color.setHex(0xffffff);
      ballMaterial.emissive.setHex(0x444444);
      WALL_RESTITUTION = 0.9;
      spawnConfetti(60, 0xffffff, 0xffff88);
      break;
  }
}

function celebrate100() {
  // Epic finale - rainbow explosion
  spawnConfetti(150, 0xff0000, 0x00ff00);
  spawnConfetti(150, 0x0000ff, 0xffff00);
  
  // Flash effect
  scene.background = new THREE.Color(0xffffff);
  setTimeout(() => { scene.background = null; }, 100);
  
  // Ball becomes rainbow cycling (handled in animate)
  ballMaterial.userData.rainbow = true;
  
  // Play epic sound
  if (audioCtx) {
    const now = audioCtx.currentTime;
    Array.from({ length: 8 }, (_, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(220 * Math.pow(1.2, i), now + i * 0.08);
      gain.gain.setValueAtTime(0.15, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.8);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.8);
    });
  }
}

function updateConfetti(dt) {
  confettiParticles.forEach((p, idx) => {
    p.position.add(p.velocity);
    p.velocity.y -= 0.008; // Gravity
    p.rotation.x += 0.1;
    p.rotation.z += 0.05;
    p.life -= dt * 0.8;
    p.material.opacity = p.life;
    p.material.transparent = true;
    
    if (p.life <= 0) {
      scene.remove(p);
      p.geometry.dispose();
      p.material.dispose();
      confettiParticles.splice(idx, 1);
    }
  });
}

function onPointerUp() {
  if (isDragging) {
    isDragging = false;
    
    // Increment counter
    releaseCount++;
    updateCounter();
    
    // Check for milestone
    checkMilestone();
    
    // Hide hint after first release
    document.querySelector('.hint').style.opacity = '0';
    
    // Let the spring physics take over - just add small drag velocity
    velX = dragVelX * 0.3;
    velY = dragVelY * 0.3;
    velZ = 0;
    
    // Play release sound
    const stretch = Math.sqrt((posX - REST_X) ** 2 + (posY - REST_Y) ** 2);
    playReleaseSound(stretch);
  }
}

// Event listeners
renderer.domElement.addEventListener('mousedown', onPointerDown);
renderer.domElement.addEventListener('mousemove', onPointerMove);
renderer.domElement.addEventListener('mouseup', onPointerUp);
renderer.domElement.addEventListener('mouseleave', onPointerUp);
renderer.domElement.addEventListener('touchstart', onPointerDown, { passive: false });
renderer.domElement.addEventListener('touchmove', onPointerMove, { passive: false });
renderer.domElement.addEventListener('touchend', onPointerUp);
renderer.domElement.addEventListener('touchcancel', onPointerUp);

// === ANIMATION ===
let lastTime = 0;
let lastSoundTime = 0;
let prevVelSign = 0; // For detecting direction changes

function animate(time) {
  requestAnimationFrame(animate);
  
  // Delta time in seconds, capped for stability
  const dt = Math.min((time - lastTime) / 1000, 0.033); // Cap at ~30fps worth
  lastTime = time;
  
  if (!isDragging && dt > 0) {
    // === SPRING PHYSICS with substeps for stability ===
    const SUBSTEPS = 8;
    const subDt = dt / SUBSTEPS;
    
    // Perform physics substeps functionally
    Array.from({ length: SUBSTEPS }, () => {
      // Vector from anchor to ball
      const dx = posX - ANCHOR_X;
      const dy = posY - ANCHOR_Y;
      const dz = posZ - ANCHOR_Z;
      
      // Current distance from anchor
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      
      // Prevent division by zero
      if (dist < 0.01) return;
      
      // Normalized direction from anchor to ball
      const nx = dx / dist;
      const ny = dy / dist;
      const nz = dz / dist;
      
      // === SPRING STRETCH FORCE ===
      // Force along spring axis - tries to return to rest length
      const stretch = dist - SPRING_REST_LENGTH;
      const stretchForce = -SPRING_K * stretch;
      
      // === BENDING FORCE ===
      // Force perpendicular to rest axis (spring wants to be horizontal)
      // Rest direction is (1, 0, 0) - horizontal from wall
      // Bending displacement is how far off-axis the ball is
      const bendY = posY - ANCHOR_Y; // Vertical offset from anchor
      const bendZ = posZ - ANCHOR_Z;
      const bendForceY = -SPRING_K_BEND * bendY;
      const bendForceZ = -SPRING_K_BEND * bendZ;
      
      // === TOTAL SPRING FORCE ===
      // Stretch force acts along current spring direction
      // Bend force acts perpendicular
      const springForceX = stretchForce * nx;
      const springForceY = stretchForce * ny + bendForceY;
      const springForceZ = stretchForce * nz + bendForceZ;
      
      // === DAMPING ===
      // Velocity component along spring axis
      const velAlongSpring = velX * nx + velY * ny + velZ * nz;
      // Velocity perpendicular to spring
      const velPerpX = velX - velAlongSpring * nx;
      const velPerpY = velY - velAlongSpring * ny;
      const velPerpZ = velZ - velAlongSpring * nz;
      
      // Damping along spring axis (for stretch oscillation)
      const dampAlongX = -DAMPING * velAlongSpring * nx;
      const dampAlongY = -DAMPING * velAlongSpring * ny;
      const dampAlongZ = -DAMPING * velAlongSpring * nz;
      
      // Damping perpendicular (for bend oscillation) - less damping for wobble
      const dampPerpX = -DAMPING_BEND * velPerpX;
      const dampPerpY = -DAMPING_BEND * velPerpY;
      const dampPerpZ = -DAMPING_BEND * velPerpZ;
      
      // Total force
      const forceX = springForceX + dampAlongX + dampPerpX;
      const forceY = springForceY + dampAlongY + dampPerpY;
      const forceZ = springForceZ + dampAlongZ + dampPerpZ;
      
      // Acceleration
      const accX = forceX / MASS;
      const accY = forceY / MASS;
      const accZ = forceZ / MASS;
      
      // Semi-implicit Euler integration
      velX += accX * subDt;
      velY += accY * subDt;
      velZ += accZ * subDt;
      
      posX += velX * subDt;
      posY += velY * subDt;
      posZ += velZ * subDt;
      
      // === WALL COLLISION ===
      if (posX < WALL_X) {
        posX = WALL_X;
        if (velX < 0) {
          velX = -velX * WALL_RESTITUTION;
          // Add wobble on wall hit
          velY += (Math.random() - 0.5) * Math.abs(velX) * 0.2;
          
          // Wall hit sound
          if (time - lastSoundTime > 50) {
            playWallHitSound(velX);
            lastSoundTime = time;
          }
        }
      }
    });
    
    // === REAL-TIME SPRING SOUND ===
    const speed = Math.sqrt(velX * velX + velY * velY);
    const dx = posX - ANCHOR_X;
    const dy = posY - ANCHOR_Y;
    const currentLength = Math.sqrt(dx * dx + dy * dy);
    const stretch = currentLength - SPRING_REST_LENGTH;
    updateSpringSound(
      { x: velX, y: velY },
      { x: stretch, y: dy },
      speed > 0.5
    );
  } else {
    // Silence when dragging or still
    updateSpringSound({ x: 0, y: 0 }, { x: 0, y: 0 }, false);
  }
  
  // === UPDATE VISUALS ===
  ball.position.set(posX, posY, posZ);
  ball.scale.set(1, 1, 1);
  
  // Update ball reflections periodically
  if (Math.floor(time / 100) % 3 === 0) {
    ball.visible = false;
    ballCubeCamera.position.copy(ball.position);
    ballCubeCamera.update(renderer, scene);
    ball.visible = true;
  }
  
  // Update spring
  updateSpring(
    new THREE.Vector3(ANCHOR_X, ANCHOR_Y, ANCHOR_Z),
    new THREE.Vector3(posX, posY, posZ)
  );
  
  // Animate dust particles
  const positions = particles.geometry.attributes.position.array;
  Array.from({ length: particleCount }, (_, i) => {
    positions[i * 3 + 1] += 0.002; // Slow rise
    if (positions[i * 3 + 1] > 8) positions[i * 3 + 1] = -8;
  });
  particles.geometry.attributes.position.needsUpdate = true;
  particles.rotation.y += 0.0003;
  
  // Update confetti
  updateConfetti(dt);
  
  // Rainbow ball after 100
  if (ballMaterial.userData.rainbow) {
    const hue = (time * 0.001) % 1;
    ballMaterial.color.setHSL(hue, 1, 0.6);
    ballMaterial.emissive.setHSL(hue, 1, 0.2);
  }
  
  renderer.render(scene, camera);
}

// === RESIZE & RESPONSIVE ===
function updateCameraForScreenSize() {
  const aspect = window.innerWidth / window.innerHeight;
  camera.aspect = aspect;
  
  // Adjust camera distance based on aspect ratio (mobile = closer to fit scene)
  if (aspect < 0.7) {
    // Portrait mobile
    camera.position.z = 14;
    camera.fov = 55;
  } else if (aspect < 1) {
    // Tablet portrait
    camera.position.z = 12;
    camera.fov = 52;
  } else {
    // Landscape / desktop
    camera.position.z = 10;
    camera.fov = 50;
  }
  
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', updateCameraForScreenSize);
updateCameraForScreenSize(); // Initial call

// Start
requestAnimationFrame(animate);
