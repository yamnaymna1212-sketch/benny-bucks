// Animated 2.5D cutout character: one subdivided plane warped on the CPU (breath, weight-shift sway, head tilt/nod, talk bob, surprise pop).
// Arms: state {shrug,flex,tap} override the automatic motion (shrug defaults to react, tap to talk).
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
  // Arm rig: soft Gaussian pins in IMAGE pixel space (1024x1536). Crossed arms cannot be lifted (no pixels behind them),
  // so the arms move by shrug / elbow flex / forearm bob while talking / finger tap on the visible right hand.
  const PX = 1024, PY = 1536, K = height / PY;                   // image px -> plane units
  const PINS = {SL: [305, 360, 85], SR: [745, 360, 85], EL: [300, 505, 70], ER: [748, 470, 70], FL: [450, 545, 90], FR: [620, 470, 95], HL: [445, 450, 45], HR: [672, 424, 38]};
  const g = (px, py, c) => Math.exp(-((px - c[0]) ** 2 + (py - c[1]) ** 2) / (2 * c[2] * c[2]));
  function update(t, s = {}) {
    const talk = s.talk || 0, react = s.react || 0, turn = s.turn || 0;
    const p = geo.attributes.position.array;
    const breath = Math.sin(t * 1.7) * 0.5 + 0.5;                       // 0..1, ~3.7 s cycle
    const sway = Math.sin(t * 0.9) * 0.010 + Math.sin(t * 2.3) * 0.002; // weight shift (m)
    const tilt = Math.sin(t * 0.7) * 0.03 + turn * 0.10 + react * -0.05;// head roll (rad)
    const nod = (Math.sin(t * 9.0) * 0.5 + 0.5) * 0.020 * talk + Math.sin(t * 0.5) * 0.004 + react * 0.03; // head dip (m)
    const pop = 1 + react * 0.04;                                       // surprise scale-up of the head
    const pivX = 0, pivY = NECK * height;
    // arm motion amounts in image px (deterministic in t)
    const shrug = (s.shrug ?? react) * 40 + (Math.sin(t * 1.7) * 0.5 + 0.5) * 3;            // shoulders up
    const flex = (s.flex ?? 0) * 22 + (Math.sin(t * 0.8) * 0.5 + 0.5) * 3;                    // elbows out + forearms squeeze up
    const bob = talk * Math.sin(t * 4.6) * 10;                                                // forearm emphasis while talking
    const tapY = (s.tap ?? talk) * Math.max(0, Math.sin(t * 7.5)) * 13;                       // fingers tapping on the sleeve
    for (let i = 0; i < p.length; i += 3) {
      let x = base[i], y = base[i + 1], v = Math.min(1, Math.max(0, y / height));
      // 0) arms (puppet-warp pins), gated to the torso band so head/legs are untouched
      const gate = sm(0.60, 0.64, v) * (1 - sm(0.80, 0.84, v));
      if (gate > 0) {
        const ax = (x / w + 0.5) * PX, ay = (1 - y / height) * PY;
        const wSL = g(ax, ay, PINS.SL), wSR = g(ax, ay, PINS.SR), wEL = g(ax, ay, PINS.EL), wER = g(ax, ay, PINS.ER);
        const wFL = g(ax, ay, PINS.FL), wFR = g(ax, ay, PINS.FR), wHL = g(ax, ay, PINS.HL), wHR = g(ax, ay, PINS.HR);
        const dx = (-wEL + wER) * flex * 0.8;
        const dy = (wSL + wSR) * shrug + (wEL + wER) * (flex * 0.6) + (wFL + wFR) * (flex * 0.5 + bob) + wHL * bob * 0.8 + wHR * tapY;
        x += dx * K * gate; y += dy * K * gate;
      }
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
