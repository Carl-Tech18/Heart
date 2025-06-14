// ====== 1. Floating background hearts ======
const bgHeartsCount = 18;
const bgHearts = [];
const bgHeartsDiv = document.getElementById('background-hearts');
for (let i = 0; i < bgHeartsCount; ++i) {
  let d = document.createElement('div');
  d.className = 'bg-heart';
  d.style.position = 'absolute';
  d.style.left = `${Math.random() * 100}vw`;
  d.style.top = `${Math.random() * 100}vh`;
  d.style.opacity = 0.2 + Math.random() * 0.3;
  d.style.fontSize = `${30 + Math.random() * 70}px`;
  d.innerHTML = '❤';
  bgHearts.push({el: d, speed: 0.2 + Math.random() * 0.4, phase: Math.random() * Math.PI * 2});
  bgHeartsDiv.appendChild(d);
}
function animateBgHearts(ts) {
  bgHearts.forEach((h, i) => {
    let top = parseFloat(h.el.style.top);
    top += h.speed * (0.7 + Math.sin(ts/2500 + h.phase));
    if(top > 100) top = -5;
    h.el.style.top = `${top}vh`;
    h.el.style.transform = `scale(${0.9 + 0.2*Math.sin(ts/1800 + h.phase)}) rotate(${Math.sin(ts/1600 + i)*15}deg)`;
  });
  requestAnimationFrame(animateBgHearts);
}
requestAnimationFrame(animateBgHearts);

// ====== 2. Particle trail on click ======
// We'll use a simple effect: show a burst of particles at the click location, fading out.
let clickTrails = [];
function spawnClickTrail(x, y) {
  for (let i = 0; i < 18; i++) {
    let a = Math.random() * Math.PI * 2;
    let r = 30 + Math.random() * 40;
    clickTrails.push({
      x: x + Math.cos(a) * r,
      y: y + Math.sin(a) * r,
      alpha: 1,
      vx: Math.cos(a) * (0.8 + Math.random()),
      vy: Math.sin(a) * (0.8 + Math.random())
    });
  }
}
function drawClickTrails() {
  let c = clickTrailCanvas;
  let ctx = c.getContext('2d');
  ctx.clearRect(0, 0, c.width, c.height);
  clickTrails.forEach(trail => {
    ctx.globalAlpha = trail.alpha;
    ctx.font = 'bold 32px Arial';
    ctx.fillStyle = '#ff3579';
    ctx.fillText('❤', trail.x, trail.y);
  });
  ctx.globalAlpha = 1;
}
function animateClickTrails() {
  clickTrails.forEach(trail => {
    trail.x += trail.vx;
    trail.y += trail.vy;
    trail.alpha *= 0.90;
  });
  clickTrails = clickTrails.filter(t => t.alpha > 0.06);
  drawClickTrails();
  requestAnimationFrame(animateClickTrails);
}
const clickTrailCanvas = document.createElement('canvas');
clickTrailCanvas.width = window.innerWidth;
clickTrailCanvas.height = window.innerHeight;
clickTrailCanvas.style.position = 'fixed';
clickTrailCanvas.style.pointerEvents = 'none';
clickTrailCanvas.style.left = '0';
clickTrailCanvas.style.top = '0';
clickTrailCanvas.style.zIndex = '2';
document.body.appendChild(clickTrailCanvas);
window.addEventListener('resize', () => {
  clickTrailCanvas.width = window.innerWidth;
  clickTrailCanvas.height = window.innerHeight;
});
animateClickTrails();

// ====== 4. Auto-rotation ======
let autoRotate = true;
let rotationY = 0;

// ====== 6. Gradient background is in CSS ======

// ====== 7. Typewriter effect ======
const typewriterText = "Click anywhere to reshuffle the heart!";
const typewriterDiv = document.getElementById('typewriter');
let twIdx = 0;
function typewriter() {
  if(twIdx <= typewriterText.length){
    typewriterDiv.innerHTML = typewriterText.slice(0, twIdx) + "<span style='opacity:0.5;'>|</span>";
    twIdx++;
    setTimeout(typewriter, 55 + (Math.random()*60));
  } else {
    typewriterDiv.innerHTML = typewriterText;
  }
}
typewriter();

// ====== 8. Adaptive particle count ======
let PARTICLE_COUNT = 5000;
if(window.innerWidth < 700 || window.innerHeight < 500) PARTICLE_COUNT = 1800;
else if(window.innerWidth < 1100) PARTICLE_COUNT = 3000;

// ====== 10. Random heart shape variants ======
const heartVariants = [
  function(t,s){ // classic
    const phi = t * 2 * Math.PI;
    const x = 16 * Math.pow(Math.sin(phi), 3);
    const y = 13 * Math.cos(phi) - 5 * Math.cos(2 * phi) - 2 * Math.cos(3 * phi) - Math.cos(4 * phi);
    return { x: x * s, y: -y * s, z: 0 };
  },
  function(t,s){ // tall
    const phi = t * 2 * Math.PI;
    const x = 13 * Math.pow(Math.sin(phi), 3);
    const y = 16 * Math.cos(phi) - 6 * Math.cos(2 * phi) - 2 * Math.cos(3 * phi) - Math.cos(4 * phi);
    return { x: x * s * 1.2, y: -y * s * 0.8, z: 0 };
  },
  function(t,s){ // wide
    const phi = t * 2 * Math.PI;
    const x = 18 * Math.pow(Math.sin(phi), 3);
    const y = 12 * Math.cos(phi) - 4 * Math.cos(2 * phi) - 2 * Math.cos(3 * phi) - Math.cos(4 * phi);
    return { x: x * s * 0.9, y: -y * s * 1.1, z: 0 };
  }
];
let currentHeart = 0;

// ====== 11. Valentine mode ======
let isValentine = false;
const now = new Date();
if(now.getMonth() === 1 && now.getDate() === 14) isValentine = true;

// ====== 12. AI/random love messages ======
const loveMessages = [
  "You are my heart's favorite melody.",
  "Every beat of my heart belongs to you.",
  "With you, every day is Valentine’s Day.",
  "Love is the heart’s way of smiling.",
  "You light up my world like nobody else.",
  "Forever and always, you have my heart.",
  "You are the reason my heart beats.",
  "Sending you all my love, today and always.",
  "My love for you is infinite.",
  "You make my heart skip a beat.",
  "To love and to be loved is everything."
];
if(isValentine) loveMessages.push("Happy Valentine's Day! 💖");
const loveMessageDiv = document.getElementById('love-message');
function setRandomLoveMessage() {
  loveMessageDiv.innerText = loveMessages[Math.floor(Math.random() * loveMessages.length)];
}
setRandomLoveMessage();

// ====== 3D PARTICLE HEART ======
// CONFIG
const HEART_SCALE = 16;
const Z_VOLUME = 18;
const GLOW_SIZE = isValentine ? 24 : 18;
const MORPH_SPEED = isValentine ? 0.45 : 0.32;
const FADE_SPEED = 0.9;
const glowDataUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAVFBMVEUAAABGRkZGSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKS..."; // truncated for brevity

let scene, camera, renderer, particles = [];
let targets = [], starts = [];
let progress = 0, morphing = true;

function createScene() {
  scene = new THREE.Scene();
  const w = window.innerWidth, h = window.innerHeight;
  camera = new THREE.PerspectiveCamera(60, w / h, 20, 4000);
  camera.position.set(0, 0, 1550);
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setClearColor(0x18121e, 0); // use transparent so gradient shows
  renderer.setSize(w, h);
  document.body.appendChild(renderer.domElement);
}
function createParticles() {
  for (let p of particles) scene.remove(p);
  particles = [], targets = [], starts = [];
  const tex = new THREE.TextureLoader().load(glowDataUrl);
  let heartFormula = heartVariants[currentHeart];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const t = Math.random();
    const base = heartFormula(t, HEART_SCALE);
    const z = (Math.random() - 0.5) * Z_VOLUME;
    targets.push({ x: base.x, y: base.y, z });
    starts.push({
      x: (Math.random() - 0.5) * 2000,
      y: (Math.random() - 0.5) * 1600,
      z: (Math.random() - 0.5) * 1200
    });
    const mat = new THREE.SpriteMaterial({
      map: tex,
      color: isValentine ? 0xff6eb4 : 0xff3579,
      transparent: true,
      opacity: 0
    });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(GLOW_SIZE, GLOW_SIZE, 1);
    scene.add(sprite);
    particles.push(sprite);
  }
}
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
function animate() {
  if (morphing) {
    progress += MORPH_SPEED * 0.008;
    if (progress >= 1) {
      morphing = false;
      progress = 1;
    }
  }
  if(autoRotate){
    scene.rotation.y += 0.0022;
    scene.rotation.x = Math.sin(Date.now()/7000) * 0.08;
  }
  updateParticles();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
function onResize() {
  const w = window.innerWidth, h = window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
  clickTrailCanvas.width = w;
  clickTrailCanvas.height = h;
}
window.addEventListener('resize', onResize);

// ====== Click to reshuffle ======
function reshuffle(ev) {
  // Pick random heart variant
  currentHeart = Math.floor(Math.random() * heartVariants.length);
  createParticles();
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    starts[i].x = (Math.random() - 0.5) * 2000;
    starts[i].y = (Math.random() - 0.5) * 1600;
    starts[i].z = (Math.random() - 0.5) * 1200;
    particles[i].material.opacity = 0;
  }
  progress = 0;
  morphing = true;
  setRandomLoveMessage();
  // 2. Particle trail at click
  if(ev && ev.clientX !== undefined && ev.clientY !== undefined){
    spawnClickTrail(ev.clientX, ev.clientY);
  }
  // Valentine mode: burst more trails
  if(isValentine){
    for(let i=0;i<3;i++) setTimeout(()=>spawnClickTrail(ev.clientX,ev.clientY),i*120);
  }
}
window.addEventListener('click', reshuffle);

// ====== Main ======
createScene();
createParticles();
animate();
