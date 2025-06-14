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
  document.body.appendChild(renderer.domElement);

  // Heart shape math
  function heartShape(t) {
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    return new THREE.Vector3(x * 10, y * 10, 0);
  }

  const total = 1000;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(total * 3);
  const targets = new Float32Array(total * 3);

  for (let i = 0; i < total; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 2000;
    positions[i3 + 1] = (Math.random() - 0.5) * 2000;
    positions[i3 + 2] = (Math.random() - 0.5) * 2000;

    const t = Math.random() * Math.PI * 2;
    const p = heartShape(t);
    targets[i3] = p.x;
    targets[i3 + 1] = p.y;
    targets[i3 + 2] = p.z;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0xff3399,
    size: 2,
    transparent: true,
    opacity: 0.8,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  const posAttr = geometry.attributes.position;

  function animate() {
    requestAnimationFrame(animate);

    for (let i = 0; i < total * 3; i++) {
      posAttr.array[i] += (targets[i] - posAttr.array[i]) * 0.02;
    }

    posAttr.needsUpdate = true;
    points.rotation.y += 0.002;

    renderer.render(scene, camera);
  }

  animate();
};
