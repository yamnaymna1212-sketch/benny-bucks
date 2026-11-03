// Animated 2.5D cutout character: one subdivided plane warped on the CPU (breath, weight-shift sway, head tilt/nod, talk bob, surprise pop).
// Usage: const ch = await makeCutout(THREE, 'chars/char_cutout.png', {height:1.8}); scene.add(ch.group); each frame: ch.update(t, {talk:0..1, react:0..1, turn:-1..1});
// Anchored at the feet (y=0). Deterministic in t (no internal clock) so stills and renders match.
export async function makeCutout(THREE, url, {height = 1.8, aspect = 1024 / 1536, segX = 20, segY = 60} = {}) {
  const tex = await new THREE.TextureLoader().loadAsync(url);
  tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  const w = height * aspect;
  const geo = new THREE.PlaneGeometry(w, height, segX, segY); geo.translate(0, height / 2, 0);
  const base = geo.attributes.position.array.slice();
  const mat = new THREE.MeshStandardMaterial({map: tex, transparent: true, alphaTest: 0.04, roughness: 0.85, metalness: 0, side: THREE.DoubleSide});
  const mesh = new THREE.Mesh(geo, mat); mesh.castShadow = true; mesh.receiveShadow = false;
  // depth material so the cutout casts a correctly shaped shadow
  mesh.customDepthMaterial = new THREE.MeshDepthMaterial({depthPacking: THREE.RGBADepthPacking, map: tex, alphaTest: 0.5});
  const group = new THREE.Group(); group.add(mesh);
  const sm = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  const NECK = 0.835;      // normalised height of the neck pivot in the image (head top ~0.99)
  const CHEST0 = 0.58, CHEST1 = 0.80;
  function update(t, s = {}) {
    const talk = s.talk || 0, react = s.react || 0, turn = s.turn || 0;
    const p = geo.attributes.position.array;
    const breath = Math.sin(t * 1.7) * 0.5 + 0.5;                       // 0..1, ~3.7 s cycle
    const sway = Math.sin(t * 0.9) * 0.010 + Math.sin(t * 2.3) * 0.002; // weight shift (m)
    const tilt = Math.sin(t * 0.7) * 0.03 + turn * 0.10 + react * -0.05;// head roll (rad)
    const nod = (Math.sin(t * 9.0) * 0.5 + 0.5) * 0.020 * talk + Math.sin(t * 0.5) * 0.004 + react * 0.03; // head dip (m)
    const pop = 1 + react * 0.04;                                       // surprise scale-up of the head
    const pivX = 0, pivY = NECK * height;
    for (let i = 0; i < p.length; i += 3) {
      let x = base[i], y = base[i + 1], v = Math.min(1, Math.max(0, y / height));
      // 1) weight shift: feet planted, offset grows with height
      x += sway * Math.pow(v, 1.4);
      // 2) breathing: chest widens + rises slightly
      const cw = sm(CHEST0 - 0.06, CHEST0 + 0.04, v) * (1 - sm(CHEST1, CHEST1 + 0.06, v));
      x += (x / (w / 2)) * cw * 0.010 * (0.4 + breath) * (w / 2);
      y += cw * 0.006 * breath;
      // 3) head: rotate about the neck, blended in over the neck band
      const hw = sm(NECK - 0.035, NECK + 0.035, v);
      if (hw > 0) {
        const dx = x - pivX, dy = y - pivY, a = tilt * hw, c = Math.cos(a), sn = Math.sin(a);
        const rx = dx * c - dy * sn, ry = dx * sn + dy * c, k = 1 + (pop - 1) * hw;
        x = pivX + rx * k; y = pivY + ry * k - nod * hw;
      }
      p[i] = x; p[i + 1] = y;
    }
    geo.attributes.position.needsUpdate = true; geo.computeVertexNormals();
    // slight 3D yaw so the camera sees parallax; turn pushes the whole body a bit
    mesh.rotation.y = Math.sin(t * 0.45) * 0.05 + turn * 0.18;
  }
  update(0);
  return {group, mesh, update, width: w, height};
}
