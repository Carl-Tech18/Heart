window.onload = () => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
  );
  camera.position.z = 500;

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);

  // Heart shape formula
  function heartShape(t) {
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y =
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t);
    return new THREE.Vector3(x * 10, y * 10, 0);
  }

  const total = 1000;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(total * 3);
  const initialPositions = new Float32Array(total * 3);
  const heartPositions = new Float32Array(total * 3);

  for (let i = 0; i < total; i++) {
    const i3 = i * 3;

    // start scattered
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = (Math.random() - 0.5) * 2000;
    positions[i3] = initialPositions[i3] = x;
    positions[i3 + 1] = initialPositions[i3 + 1] = y;
    positions[i3 + 2] = initialPositions[i3 + 2] = z;

    // target = heart point
    const t = Math.random() * Math.PI * 2;
    const p = heartShape(t);
    heartPositions[i3] = p.x;
    heartPositions[i3 + 1] = p.y;
    heartPositions[i3 + 2] = p.z;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0xff3399,
    size: 2,
    transparent: true,
    opacity: 0.8,
    depthWrite: false,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  const posAttr = geometry.attributes.position;
  let progress = 0;
  let direction = 1; // 1 = scatter to heart, -1 = heart to scatter

  const mouse = new THREE.Vector2(0, 0);
  window.addEventListener("mousemove", (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  function animate() {
    requestAnimationFrame(animate);

    // Lerp control
    progress += 0.005 * direction;
    if (progress >= 1) {
      progress = 1;
      direction = -1;
    } else if (progress <= 0) {
      progress = 0;
      direction = 1;
    }

    // Update particle positions
    for (let i = 0; i < total * 3; i++) {
      const from = direction === 1 ? initialPositions : heartPositions;
      const to = direction === 1 ? heartPositions : initialPositions;
      posAttr.array[i] += (to[i] - posAttr.array[i]) * 0.05;

      // Mouse interaction — nudge z slightly
      if (i % 3 === 2) {
        const mx = mouse.x * 50;
        const my = mouse.y * 50;
        posAttr.array[i] += (Math.sin(i + mx + my) * 0.2 - posAttr.array[i]) * 0.05;
      }
    }
    posAttr.needsUpdate = true;

    // Heartbeat scale effect
    const scale = 1 + Math.sin(Date.now() * 0.005) * 0.05;
    points.scale.set(scale, scale, scale);

    // Twinkle (size + opacity)
    material.size = 1.5 + Math.sin(Date.now() * 0.01) * 0.5;
    material.opacity = 0.6 + Math.sin(Date.now() * 0.007) * 0.4;

    // Color shift (HSL)
    material.color.setHSL((Date.now() * 0.0001) % 1, 1, 0.6);

    renderer.render(scene, camera);
  }

  animate();

  // Responsive resizing
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
};
