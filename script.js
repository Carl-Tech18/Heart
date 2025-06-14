// ====== CONFIG ======
const PARTICLE_COUNT = 5000;
const HEART_SCALE = 16;
const Z_VOLUME = 18;
const GLOW_SIZE = 18;
const MORPH_SPEED = 0.32;
const FADE_SPEED = 0.9;

// ====== GLOW TEXTURE ======
const glowDataUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAVFBMVEUAAABGRkZGSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkqY4M8AAAAF3RSTlMAAAAAAAIDBAUGBwgJCgsMDxAUFxcYGRobH5Gk5QAAAG1JREFUGJVjYMAJZGBhYmRgYWFiZGBgYGBgYmJgYGBgZGJgYGBgYGBgYGJhYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGJgYGBgYGBgYGBgYGBgYGJiYGBgYGJgYGBgYGJgYGBgYGBgYGBgYGBgYGJgYGBgYGJgYGBgYGAAAwC4dR8O+8I5cAAAAABJRU5ErkJggg==";

// ====== HEART FORMULA ======
function heart3D(t, s = HEART_SCALE) {
  const phi = t * 2 * Math.PI;
  const x = 16 * Math.pow(Math.sin(phi), 3);
  const y = 13 * Math.cos(phi) - 5 * Math.cos(2 * phi) - 2 * Math.cos(3 * phi) - Math.cos(4 * phi);
  return { x: x * s, y: -y * s, z: 0 };
}

// ====== SCENE SETUP ======
let scene, camera, renderer, particles = [];
let targets = [], starts = [];
let progress = 0, morphing = true;

function createScene() {
  scene = new THREE.Scene();
  const w = window.innerWidth, h = window.innerHeight;
  camera = new THREE.PerspectiveCamera(60, w / h, 20, 4000);
  camera.position.set(0, 0, 1550);
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setClearColor(0x18121e, 1);
  renderer.setSize(w, h);
  document.body.appendChild(renderer.domElement);
}

// ====== PARTICLES ======
function createParticles() {
  for (let p of particles) scene.remove(p);
  particles = [], targets = [], starts = [];

  const tex = new THREE.TextureLoader().load(glowDataUrl);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const t = Math.random();
    const base = heart3D(t);
    const z = (Math.random() - 0.5) * Z_VOLUME;
    targets.push({ x: base.x, y: base.y, z });

    starts.push({
      x: (Math.random() - 0.5) * 2000,
      y: (Math.random() - 0.5) * 1600,
      z: (Math.random() - 0.5) * 1200
    });

    const mat = new THREE.SpriteMaterial({
      color: 0xff3579,
      transparent: true,
      opacity: 0
    });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(GLOW_SIZE, GLOW_SIZE, 1);
    scene.add(sprite);
    particles.push(sprite);
  }
}

// ====== MORPH LOGIC ======
function easeOutQuad(t) {
  return t * (2 - t);
}

function updateParticles() {
  const eased = easeOutQuad(progress);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const s = starts[i], t = targets[i], p = particles[i];
    p.position.x = s.x + (t.x - s.x) * eased;
    p.position.y = s.y + (t.y - s.y) * eased;
    p.position.z = s.z + (t.z - s.z) * eased;

    let targetOpacity = Math.min(1, eased * 1.2);
    p.material.opacity += (targetOpacity - p.material.opacity) * FADE_SPEED;
  }
}

// ====== RENDER LOOP ======
function animate() {
  if (morphing) {
    progress += MORPH_SPEED * 0.008;
    if (progress >= 1) {
      morphing = false;
      progress = 1;
    }
  }
  updateParticles();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

// ====== RESIZE ======
function onResize() {
  const w = window.innerWidth, h = window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}
window.addEventListener('resize', onResize);

// ====== CLICK TO RESHUFFLE ======
function reshuffle() {
  console.log('Click detected! Reshuffling...');
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    starts[i].x = (Math.random() - 0.5) * 2000;
    starts[i].y = (Math.random() - 0.5) * 1600;
    starts[i].z = (Math.random() - 0.5) * 1200;
    particles[i].material.opacity = 0;
  }
  progress = 0;
  morphing = true;
}
window.addEventListener('click', reshuffle);

// ====== MAIN ======
createScene();
createParticles();
animate();
