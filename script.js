// heart.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
camera.position.z = 500;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Create particles
const particleCount = 5000;
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i++) {
  positions[i * 3 + 0] = (Math.random() - 0.5) * 2000;
  positions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 2000;

  colors[i * 3 + 0] = 1.0; // R
  colors[i * 3 + 1] = 0.2; // G
  colors[i * 3 + 2] = 0.5; // B
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const material = new THREE.PointsMaterial({
  size: 4,
  vertexColors: true,
  transparent: true,
  opacity: 0.8,
});

const particles = new THREE.Points(geometry, material);
scene.add(particles);

// Heart parametric path (2D to 3D)
function heartPoint(t) {
  const x = 16 * Math.sin(t) ** 3;
  const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
  return new THREE.Vector3( x * 10, y * 10, 0 );
}

// Store target heart positions
const targetPositions = [];
for (let i = 0; i < particleCount; i++) {
  const t = (i / particleCount) * Math.PI * 2;
  targetPositions.push(heartPoint(t));
}

// Animate particles from random scatter to heart
let progress = 0;
function animate() {
  requestAnimationFrame(animate);

  progress += 0.005;
  if (progress > 1) progress = 1;

  const pos = geometry.attributes.position.array;
  for (let i = 0; i < particleCount; i++) {
    const idx = i * 3;
    pos[idx] += (targetPositions[i].x - pos[idx]) * 0.02 * progress;
    pos[idx + 1] += (targetPositions[i].y - pos[idx + 1]) * 0.02 * progress;
    pos[idx + 2] += (targetPositions[i].z - pos[idx + 2]) * 0.02 * progress;
  }
  geometry.attributes.position.needsUpdate = true;

  controls.update();
  renderer.render(scene, camera);
}
animate();
