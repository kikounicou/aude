// separations.js — « Séparer un mélange » : décantation, tamisage, filtration, évaporation (cours, thème 6, méthodes 1 à 4).
// Quatre mini-labos manipulables + un petit défi « quel mélange → quelle méthode ? ». (La distillation est dans un autre fichier.)
import { THREE, C, layout, createStage, panel, explain, glassMaterial, liquidMaterial, beaker, ground, clamp, lerp, rand } from './kit.js';

const sm = (x) => x * x * (3 - 2 * x);
const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const DIR = V3(0, 0.26, 1).normalize();
const HUILE = 0xf2c230, BOUE = 0x7a5230;

// Les phrases du cours, mot pour mot
const COURS = {
  decantation: '→ Séparation de mélanges hétérogènes composés : d\'un solide et d\'un liquide ; de deux liquides non miscibles.',
  decL: '<b>Principe</b> (liquide + liquide) : il faut laisser reposer le mélange des deux liquides dans une ampoule à décanter et laisser s\'écouler le liquide qui s\'est déposé dans le fond.',
  decS: '<b>Principe</b> (solide + liquide) : il faut laisser reposer le mélange pour que les particules en suspension dans le liquide se déposent dans le fond du récipient.',
  tamisage: '→ Séparation de mélanges hétérogènes composés de deux solides dont l\'un est sous forme de morceaux plus petits que l\'autre.',
  tamP: '<b>Principe</b> : il faut faire passer les solides au travers d\'un tamis qui retiendra les éléments les plus gros.',
  filtration: '→ Séparation de mélanges hétérogènes composés d\'un liquide et d\'un solide.',
  filP: '<b>Principe</b> : il faut faire passer le mélange à travers un filtre qui retiendra les particules solides. <b>Filtrat</b> = résultat d\'une filtration.',
  evaporation: '→ Séparation de mélanges homogènes formés d\'un solide dissout dans un liquide.',
  evaP: '<b>Principe</b> : méthode consistant à transformer le liquide du mélange homogène en vapeur afin de récupérer le solide qui était dissout.',
};
const METHODES = [{ value: 'decantation', label: 'Décantation' }, { value: 'tamisage', label: 'Tamisage' }, { value: 'filtration', label: 'Filtration' }, { value: 'evaporation', label: 'Évaporation' }];
const DEFI = [
  { q: 'Eau + huile', ok: ['decantation'], pq: 'deux liquides non miscibles → décantation (ampoule à décanter).' },
  { q: 'Sable + cailloux', ok: ['tamisage'], pq: 'deux solides, l\'un en morceaux plus petits que l\'autre → tamisage.' },
  { q: 'Eau salée', ok: ['evaporation'], pq: 'un solide dissout dans un liquide (mélange homogène) → évaporation.' },
  { q: 'Eau + sable', ok: ['filtration', 'decantation'], pq: 'un solide et un liquide → filtration ou décantation.' },
  { q: 'Eau boueuse', ok: ['filtration', 'decantation'], pq: 'un solide et un liquide → filtration ou décantation.' },
  { q: 'Eau sucrée', ok: ['evaporation'], pq: 'un solide dissout dans un liquide (mélange homogène) → évaporation.' },
];

// ---------- petits outils ----------
function tranche(rFn, y0, y1, n) { // profil d'une couche de liquide (LatheGeometry)
  const pts = [new THREE.Vector2(0, y0)];
  for (let i = 0; i <= n; i++) { const y = lerp(y0, y1, i / n); pts.push(new THREE.Vector2(Math.max(0.002, rFn(y)), y)); }
  pts.push(new THREE.Vector2(0, y1));
  return pts;
}
function couche(mat, parent, rFn, n = 30) {
  const mesh = new THREE.Mesh(new THREE.BufferGeometry(), mat); mesh.renderOrder = 1; parent.add(mesh);
  let k = '';
  return { mesh, set(y0, y1) {
    mesh.visible = y1 - y0 > 0.003; if (!mesh.visible) return;
    const key = Math.round(y0 * 600) + ':' + Math.round(y1 * 600); if (key === k) return; k = key;
    mesh.geometry.dispose(); mesh.geometry = new THREE.LatheGeometry(tranche(rFn, y0, y1, n), 40);
  } };
}
function tableVolume(rFn, y0, y1, n = 400) { // volume en fonction de la hauteur, et l'inverse
  const ys = new Float32Array(n + 1), vs = new Float32Array(n + 1), dy = (y1 - y0) / n; let v = 0;
  for (let i = 0; i <= n; i++) { if (i) v += Math.PI * rFn(y0 + (i - 0.5) * dy) ** 2 * dy; ys[i] = y0 + i * dy; vs[i] = v; }
  return {
    V: (y) => vs[clamp(Math.round((y - y0) / dy), 0, n)],
    Y(v) { if (v <= 0) return y0; let lo = 0, hi = n; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (vs[m] < v) lo = m; else hi = m; } return lerp(ys[lo], ys[hi], clamp((v - vs[lo]) / Math.max(1e-9, vs[hi] - vs[lo]), 0, 1)); },
  };
}
function entre(mesh, a, b) { // un cylindre de hauteur 1 tendu entre deux points
  const d = b.clone().sub(a), L = d.length();
  mesh.position.copy(a).addScaledVector(d, 0.5); mesh.scale.y = Math.max(L, 1e-4);
  mesh.quaternion.setFromUnitVectors(V3(0, 1, 0), d.normalize());
}
function nuage(geo, n, parent) { // particules (gouttes, grains, cailloux, cristaux)
  const mesh = new THREE.InstancedMesh(geo, new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 }), n);
  mesh.frustumCulled = false; parent.add(mesh);
  const P = Array.from({ length: n }, () => ({ x: 0, y: 0, z: 0, r: 0.02, s: 0, st: 'off', vy: 0, vt: 0, a: rand(6.3), h: 0, th: Math.random(), lx: 0, lz: 0, tx: 0, ty: 0, tz: 0 }));
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), p3 = V3(0, 0, 0), s3 = V3(0, 0, 0), c = new THREE.Color();
  const api = {
    mesh, P,
    tint(hex, v) { const b = new THREE.Color(hex); for (let i = 0; i < n; i++) mesh.setColorAt(i, c.copy(b).multiplyScalar(1 - v + rand(2 * v))); mesh.instanceColor.needsUpdate = true; },
    commit() {
      for (let i = 0; i < n; i++) {
        const p = P[i]; e.set(p.a, p.a * 1.3, p.a * 0.7); q.setFromEuler(e);
        s3.setScalar(p.st === 'off' ? 1e-5 : Math.max(1e-5, p.r * p.s)); m4.compose(p3.set(p.x, p.y, p.z), q, s3); mesh.setMatrixAt(i, m4);
      }
      mesh.instanceMatrix.needsUpdate = true;
    },
  };
  api.tint(0xffffff, 0); api.commit();
  return api;
}
const SRGB = THREE.SRGBColorSpace, sa = { r: 0, g: 0, b: 0 }, sb = { r: 0, g: 0, b: 0 }, tA = new THREE.Color(), tB = new THREE.Color();
const teinte = (out, a, b, k) => { tA.set(a).getRGB(sa, SRGB); tB.set(b).getRGB(sb, SRGB); return out.setRGB(lerp(sa.r, sb.r, k), lerp(sa.g, sb.g, k), lerp(sa.b, sb.b, k), SRGB); };
function texture(w, h, dessin) { const cv = document.createElement('canvas'); cv.width = w; cv.height = h; dessin(cv.getContext('2d')); const t = new THREE.CanvasTexture(cv); t.colorSpace = SRGB; return t; }
function jeter(o) {
  o.traverse((ob) => {
    if (ob.geometry) ob.geometry.dispose();
    if (ob.material) (Array.isArray(ob.material) ? ob.material : [ob.material]).forEach((m) => { if (m.map) m.map.dispose(); m.dispose(); });
  });
}

export default function mount(root) {
  const { stageEl, panelEl, explainEl } = layout(root);
  const st = createStage(stageEl, { camera: { pos: [0, 2.2, 7], target: [0, 1.4, 0] } });
  const { scene, camera, controls } = st;
  st.renderer.localClippingEnabled = true; // pour la surface du liquide dans le bécher qu'on penche
  const ex = explain(explainEl);
  const sol = ground(14); sol.position.y = -0.001; scene.add(sol);
  const metal = new THREE.MeshStandardMaterial({ color: C.metal, metalness: 0.5, roughness: 0.35 });
  const qs = new URLSearchParams(location.search), vite = Math.min(20, +(qs.get('vite') || 1)); // banc d'essai

  // ---------- réglages communs ----------
  const ui = panel(panelEl);
  ui.title('Séparer un mélange');
  const chM = ui.choice({ label: 'Méthode', options: METHODES, value: 'decantation', onChange: (v) => ouvrir(v) });
  const zone = document.createElement('div'); zone.style.cssText = 'display:flex;flex-direction:column;gap:12px'; panelEl.appendChild(zone);

  // ---------- gestion des mini-labos ----------
  let lab = null, grp = null, labels = [], box = null, fw = 0, fh = 0, tw = null;
  function lbl(text, obj, side = 'c', cls = '') { // side : 'g' = à gauche du point, 'd' = à droite
    const L = st.label(text, obj, { cls }); L.el.style.translate = side === 'g' ? '-50% 0' : side === 'd' ? '50% 0' : '0 0';
    labels.push(L); return L;
  }
  const txt = new Map();
  const dit = (L, s) => { if (txt.get(L) !== s) { txt.set(L, s); L.set(s); } L.show(!!s); };
  function ouvrir(id, v) {
    if (grp) { scene.remove(grp); jeter(grp); }
    labels.forEach((L) => L.remove()); labels = []; txt.clear();
    grp = new THREE.Group(); scene.add(grp);
    zone.innerHTML = '';
    chM.set(id);
    lab = LABS[id](grp, panel(zone), v);
    box = lab.box; fw = 0;
  }
  function cadrer() { // la caméra cadre la boîte du labo (en perspective) + la place des étiquettes à gauche et à droite
    const { w, h } = st.size(); if (!box || w < 10 || h < 10 || (w === fw && h === fh)) return; fw = w; fh = h;
    const b = box, m = 10, pl = 108, pr = 108, T = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const dir = V3(...(b.dir || [0, 0.26, 1])).normalize(), dr = V3(0, 1, 0).cross(dir).normalize(), up = dir.clone().cross(dr);
    const c0 = V3((b.xL + b.xR) / 2, (b.yB + b.yT) / 2, 0), pts = [];
    for (const x of [b.xL, b.xR]) for (const y of [b.yB, b.yT]) for (const z of [-b.z, b.z]) pts.push(V3(x, y, z).sub(c0));
    let d = 6, k = 100, u0 = 0, u1 = 0, v0 = 0, v1 = 0;
    for (let it = 0; it < 8; it++) {
      u0 = v0 = 1e9; u1 = v1 = -1e9;
      for (const p of pts) { const f = d / Math.max(0.1, d - p.dot(dir)), u = p.dot(dr) * f, v = p.dot(up) * f; u0 = Math.min(u0, u); u1 = Math.max(u1, u); v0 = Math.min(v0, v); v1 = Math.max(v1, v); }
      k = Math.min((w - pl - pr - 2 * m) / (u1 - u0), (h - 2 * m) / (v1 - v0)); d = (h / k) / (2 * T);
    }
    const reste = Math.max(0, w - pl - pr - 2 * m - (u1 - u0) * k), du = u0 - (pl + m + reste / 2 - w / 2) / k;
    const tgt = c0.clone().addScaledVector(dr, du).addScaledVector(up, (v0 + v1) / 2);
    controls.minDistance = d * 0.5; controls.maxDistance = d * 1.6;
    tw = { t: 0, t0: controls.target.clone(), p0: camera.position.clone(), t1: tgt, p1: tgt.clone().addScaledVector(dir, d) };
  }
  st.onFrame((dt, t) => {
    cadrer();
    if (tw) { tw.t = Math.min(1, tw.t + dt / 0.6); const e = sm(tw.t); controls.target.lerpVectors(tw.t0, tw.t1, e); camera.position.lerpVectors(tw.p0, tw.p1, e); if (tw.t >= 1) tw = null; }
    if (lab) for (let i = 0; i < vite; i++) lab.maj(dt, t + i * dt);
  });
  const note = (u, a, b) => u.note(`<b style="color:#ffe45c">${a}</b><br>${b}`);
  const pct = (x) => Math.round(clamp(x, 0, 1) * 100) + ' %';

  // ===================== 1a. DÉCANTATION : deux liquides (ampoule à décanter) =====================
  function ampoule(g, u) {
    const Y0 = 1.6; // hauteur du robinet
    const rA = (y) => (y < 0.25 ? 0.03 : y < 1.2 ? 0.03 + 0.5 * (y - 0.25) / 0.95 : y < 1.78 ? Math.max(0.075, 0.53 * Math.sqrt(Math.max(0, 1 - ((y - 1.2) / 0.6) ** 2))) : 0.075);
    const tv = tableVolume(rA, 0, 1.76);
    const amp = new THREE.Group(); amp.position.y = Y0; g.add(amp);
    const prof = []; for (let i = 0; i <= 90; i++) { const y = lerp(-0.62, 2.0, i / 90); prof.push(new THREE.Vector2(rA(Math.max(0, y)) + 0.022, y)); }
    const verre = new THREE.Mesh(new THREE.LatheGeometry(prof, 40), glassMaterial({ opacity: 0.2 })); verre.renderOrder = 2; amp.add(verre);
    const blanc = new THREE.MeshStandardMaterial({ color: 0xeef0f6, roughness: 0.3 });
    const corps = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.2, 16), blanc); corps.rotation.z = Math.PI / 2; amp.add(corps);
    const cle = new THREE.Group(); cle.position.x = 0.12; amp.add(cle);
    cle.add(new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.28, 0.07), blanc));
    const rmax = (y) => rA(y) - 0.006;
    const bas = couche(liquidMaterial(C.eau, 0.6), amp, rmax, 40), haut = couche(liquidMaterial(HUILE, 0.85), amp, rmax, 30);
    const gouttes = nuage(new THREE.SphereGeometry(1, 10, 8), 70, amp); gouttes.tint(HUILE, 0.06);
    // statif, anneau, bécher
    const tige = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 3.7, 12), metal); tige.position.set(0.82, 1.85, -0.05); g.add(tige);
    const socle = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.06, 0.95), new THREE.MeshStandardMaterial({ color: 0x3b3566, roughness: 0.6 })); socle.position.set(0.18, 0.03, -0.05); g.add(socle);
    const ann = new THREE.Mesh(new THREE.TorusGeometry(0.44, 0.02, 8, 40), metal); ann.rotation.x = Math.PI / 2; ann.position.y = Y0 + 0.95; g.add(ann);
    const bras = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 1, 8), metal); entre(bras, V3(0.44, Y0 + 0.95, 0), V3(0.82, Y0 + 0.95, -0.05)); g.add(bras);
    const bk = beaker(0.3, 0.8); bk.position.y = 0.06; g.add(bk);
    const bEau = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 1, 40), liquidMaterial(C.eau, 0.6)), bHuile = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 1, 40), liquidMaterial(HUILE, 0.85));
    bEau.renderOrder = bHuile.renderOrder = 1; g.add(bEau, bHuile);
    const filet = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1, 10), liquidMaterial(C.eau, 0.85)); g.add(filet);
    // étiquettes
    const aMel = new THREE.Object3D(), a1 = new THREE.Object3D(), a2 = new THREE.Object3D(); amp.add(aMel, a1, a2);
    lbl('une ampoule<br>à décanter', V3(rA(1.5) + 0.07, Y0 + 1.5, 0), 'd');
    lbl('le robinet', V3(0.2, Y0, 0), 'd');
    lbl('un bécher', V3(0.33, 0.45, 0), 'd', 'discret');
    const lMel = lbl('', aMel, 'g'), l1 = lbl('', a1, 'g'), l2 = lbl('', a2, 'g');
    // réglages
    note(u, COURS.decantation, COURS.decL);
    u.choice({ label: 'Le mélange', options: [{ value: 'L', label: 'Eau + huile' }, { value: 'S', label: 'Eau boueuse' }], value: 'L', onChange: (v) => v === 'S' && ouvrir('decantation', 'S') });
    const [bRepos, bRe] = u.buttons([{ label: 'Laisser reposer', primary: true, onClick: () => { if (phase === 'agite') phase = 'repos'; } }, { label: 'Recommencer', onClick: () => init() }]);
    const chR = u.choice({ label: 'Le robinet', options: [{ value: 'ferme', label: 'Fermé' }, { value: 'entre', label: 'Entrouvert' }, { value: 'ouvert', label: 'Ouvert' }], value: 'ferme', onChange: (v) => robinet(v) });
    const lu = u.readout('Dans le bécher');
    void bRe;
    const VW0 = tv.V(0.92), VO0 = tv.V(1.42) - VW0;
    let Vw, Vo, Bw, Bo, phase, rob, msg, ang = Math.PI / 2;
    function init() {
      Vw = VW0; Vo = VO0; Bw = 0; Bo = 0; phase = 'agite'; rob = 'ferme'; chR.set('ferme'); msg = '';
      for (const q of gouttes.P) { q.st = 'libre'; q.r = rand(0.018, 0.042); q.s = 1; q.y = rand(0.4, 1.35); const lim = rA(q.y) - q.r - 0.02, a = rand(6.28), rr = lim * Math.sqrt(Math.random()); q.x = Math.cos(a) * rr; q.z = Math.sin(a) * rr; q.vt = 0.22 + q.r * 6; }
    }
    function robinet(v) {
      if (phase === 'agite' || phase === 'repos') { chR.set('ferme'); msg = 'Attends ! Il faut d\'abord <b>laisser reposer</b> : les deux liquides doivent se séparer.'; return; }
      if (phase !== 'separe') { chR.set('ferme'); return; }
      rob = v; msg = '';
      if (v !== 'ferme' || Bw <= 0) return;
      if (Bo > 0.05 * VO0) phase = 'rate';
      else if (Vw <= 0.1 * VW0) phase = 'fini';
      else msg = 'Il reste encore du <mark>liquide 2</mark> (l\'eau) dans l\'ampoule : rouvre un peu le robinet.';
    }
    init();
    const cEau = new THREE.Color();
    return {
      box: { xL: -0.58, xR: 0.86, yB: -0.02, yT: Y0 + 2.04, z: 0.45 },
      maj(dt) {
        // les gouttes d'huile remontent pendant le repos
        let fondu = 0;
        const yMel = tv.Y(Vw + Vo * (1 - gouttes.P.filter((q) => q.st === 'fondu').length / gouttes.P.length));
        for (const q of gouttes.P) {
          if (q.st === 'libre') { q.y += Math.sin(q.a += dt * 0.8) * 0.02 * dt; q.x += Math.cos(q.a * 1.3) * 0.02 * dt; if (phase === 'repos') q.st = 'monte'; }
          else if (q.st === 'monte') { q.y += q.vt * dt; if (q.y + q.r >= yMel) q.st = 'fondu'; }
          const lim = Math.max(0.005, rA(q.y) - q.r - 0.01), rho = Math.hypot(q.x, q.z); if (rho > lim) { q.x *= lim / rho; q.z *= lim / rho; }
          if (q.st === 'fondu') { fondu++; q.s = Math.max(0, q.s - dt * 6); }
        }
        gouttes.commit();
        const sp = fondu / gouttes.P.length; // part de l'huile déjà rassemblée en haut
        if (phase === 'repos' && sp >= 1) phase = 'separe';
        // écoulement par le robinet
        let coule = '';
        if (phase === 'separe' && rob !== 'ferme') {
          let reste = (rob === 'ouvert' ? 0.016 : 0.0045) * dt;
          if (Vw > 0) { const d = Math.min(Vw, reste); Vw -= d; Bw += d; reste -= d; coule = 'eau'; }
          if (reste > 0 && Vo > 0) { const d = Math.min(Vo, reste); Vo -= d; Bo += d; coule = 'huile'; }
          if (Vo <= 0) { phase = 'rate'; rob = 'ferme'; chR.set('ferme'); }
        }
        ang = lerp(ang, rob === 'ferme' ? Math.PI / 2 : rob === 'entre' ? Math.PI / 4 : 0, Math.min(1, dt * 8)); cle.rotation.x = ang;
        // liquides dans l'ampoule
        const yI = phase === 'agite' || phase === 'repos' ? tv.Y(Vw + Vo * (1 - sp)) : tv.Y(Vw), yT = tv.Y(Vw + Vo);
        bas.set(0, yI); haut.set(yI, yT);
        teinte(cEau, C.eau, 0xfff1c4, 0.55 * (1 - sp)); bas.mesh.material.color.copy(cEau); bas.mesh.material.opacity = 0.6 + 0.22 * (1 - sp);
        // bécher
        const S = Math.PI * 0.28 * 0.28, hw = Bw / S, ho = Bo / S; // même volume que ce qui a quitté l'ampoule
        bEau.visible = hw > 0.002; bEau.scale.y = Math.max(hw, 1e-3); bEau.position.y = 0.065 + hw / 2;
        bHuile.visible = ho > 0.002; bHuile.scale.y = Math.max(ho, 1e-3); bHuile.position.y = 0.065 + hw + ho / 2;
        filet.visible = !!coule;
        if (coule) { const r = rob === 'ouvert' ? 0.026 : 0.013; filet.material.color.set(coule === 'eau' ? C.eau : HUILE); entre(filet, V3(0, Y0, 0), V3(0, 0.065 + hw + ho, 0)); filet.scale.x = filet.scale.z = r; }
        lu.set(`eau ${pct(Bw / VW0)} · huile ${pct(Bo / VO0)}`);
        // étiquettes
        const mel = phase === 'agite' || phase === 'repos';
        aMel.position.set(-rA(0.9) - 0.05, 0.9, 0); dit(lMel, mel && sp < 0.5 ? 'le mélange<br>eau + huile' : '');
        const y1 = (yI + yT) / 2, y2 = Math.max(0.3, yI * 0.62);
        a1.position.set(-rA(y1) - 0.05, y1, 0); a2.position.set(-rA(y2) - 0.05, y2, 0);
        dit(l1, (!mel || sp >= 0.5) && yT - yI > 0.05 ? 'le liquide 1<br>(huile)' : '');
        dit(l2, (!mel || sp >= 0.5) && yI > 0.3 ? 'le liquide 2<br>(eau)' : '');
        bRepos.disabled = phase !== 'agite';
        // ce qui se passe
        let h;
        if (phase === 'agite') h = 'Eau + huile : deux liquides <mark>non miscibles</mark>, qu\'on vient d\'agiter dans <mark>une ampoule à décanter</mark>. Appuie sur <b>Laisser reposer</b>.';
        else if (phase === 'repos') h = 'On laisse reposer… Les gouttes d\'huile remontent : l\'huile flotte sur l\'eau.';
        else if (phase === 'fini') h = '<b>Bravo !</b> Le <mark>liquide 2</mark> (l\'eau) est dans le bécher, le <mark>liquide 1</mark> (l\'huile) est resté dans l\'ampoule : les deux liquides sont séparés par <mark>décantation</mark>.';
        else if (phase === 'rate') h = '<b>Trop tard !</b> De l\'huile est passée dans le bécher : il fallait fermer le robinet juste avant. Appuie sur <b>Recommencer</b>.';
        else if (msg) h = msg;
        else if (rob === 'ferme') h = 'Les deux liquides se sont séparés : <mark>le liquide 1</mark> (l\'huile) au-dessus, <mark>le liquide 2</mark> (l\'eau) en dessous. Ouvre <mark>le robinet</mark> pour laisser s\'écouler le liquide qui s\'est déposé dans le fond.';
        else if (coule === 'huile') h = '<b>Stop !</b> C\'est l\'huile qui coule maintenant : ferme le robinet !';
        else if (Vw < 0.3 * VW0 && rob === 'ouvert') h = 'Attention, la limite entre les deux liquides approche du robinet : <b>entrouvre</b> pour ralentir !';
        else h = 'Le liquide 2 (l\'eau) s\'écoule dans le bécher. Surveille la limite entre les deux liquides et <b>ferme le robinet</b> au bon moment.';
        ex.set(h);
        if (auto && phase === 'separe' && rob === 'ferme' && Bw === 0) { rob = 'entre'; chR.set('entre'); }
        if (auto && phase === 'agite') phase = 'repos';
      },
    };
  }

  // ===================== 1b. DÉCANTATION : solide + liquide (bécher d'eau boueuse) =====================
  function becherBoue(g, u) {
    const R = 0.6, NIV = 0.95, DEP = 0.11;
    const bk = beaker(R, 1.25); g.add(bk);
    const liq = new THREE.Mesh(new THREE.CylinderGeometry(R - 0.02, R - 0.02, 1, 48), liquidMaterial(C.eau, 0.6)); liq.renderOrder = 1; g.add(liq);
    const dep = new THREE.Mesh(new THREE.CylinderGeometry(R - 0.02, R - 0.02, 1, 48), new THREE.MeshStandardMaterial({ color: 0x8a5a33, roughness: 1 })); g.add(dep);
    const grains = nuage(new THREE.IcosahedronGeometry(1, 0), 240, g); grains.tint(0x8a5530, 0.22);
    const agit = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.5, 10), glassMaterial({ opacity: 0.5 })); agit.visible = false; g.add(agit);
    const aLiq = new THREE.Object3D(), aSol = new THREE.Object3D(); g.add(aLiq, aSol);
    const lLiq = lbl('', aLiq, 'g'), lSol = lbl('', aSol, 'd'), lT = lbl('', V3(0, 1.42, 0), 'c', 'discret');
    lbl('un bécher', V3(R + 0.02, 1.15, 0), 'd', 'discret');
    note(u, COURS.decantation, COURS.decS);
    u.choice({ label: 'Le mélange', options: [{ value: 'L', label: 'Eau + huile' }, { value: 'S', label: 'Eau boueuse' }], value: 'S', onChange: (v) => v === 'L' && ouvrir('decantation', 'L') });
    const [bAtt, bRem] = u.buttons([{ label: 'On attend', primary: true, onClick: () => { if (phase === 'suspension') phase = 'attente'; } }, { label: 'Remuer', onClick: () => remuer() }]);
    let phase = 'suspension', tRem = 0;
    function remuer() { tRem = 1.2; phase = 'suspension'; for (const q of grains.P) { q.st = 'libre'; q.r = rand(0.011, 0.028); q.vt = 0.08 + q.r * q.r * 500; q.s = 1; q.y = rand(0.05, NIV - 0.05); const a = rand(6.28), rr = (R - 0.06) * Math.sqrt(Math.random()); q.x = Math.cos(a) * rr; q.z = Math.sin(a) * rr; } }
    remuer(); tRem = 0;
    const c = new THREE.Color();
    return {
      box: { xL: -0.65, xR: 0.65, yB: 0, yT: 1.45, z: 0.6, dir: [0, 0.4, 1] },
      maj(dt, t) {
        let fondu = 0;
        const hd = DEP * grains.P.filter((q) => q.st === 'fondu').length / grains.P.length;
        tRem = Math.max(0, tRem - dt); agit.visible = tRem > 0;
        if (tRem > 0) { const a = t * 9; agit.position.set(Math.cos(a) * 0.3, 0.85, Math.sin(a) * 0.3); agit.rotation.z = 0.25; }
        for (const q of grains.P) {
          if (q.st === 'libre') {
            const tb = tRem > 0 ? 2.5 : 0.25, a = (tRem > 0 ? 3 : 0.3) * dt, x = q.x; q.x = x * Math.cos(a) - q.z * Math.sin(a); q.z = x * Math.sin(a) + q.z * Math.cos(a);
            q.y = clamp(q.y + Math.sin(q.a += dt * 2) * 0.03 * dt * tb, 0.03, NIV - 0.03);
            if (phase === 'attente') q.st = 'chute';
          } else if (q.st === 'chute') { q.y -= q.vt * dt; if (q.y - q.r <= hd) q.st = 'fondu'; }
          if (q.st === 'fondu') { fondu++; q.s = Math.max(0, q.s - dt * 5); }
        }
        grains.commit();
        const susp = 1 - fondu / grains.P.length;
        if (phase === 'attente' && susp <= 0) phase = 'fini';
        dep.visible = hd > 0.003; dep.scale.y = Math.max(hd, 1e-3); dep.position.y = 0.005 + hd / 2;
        liq.scale.y = NIV - hd; liq.position.y = hd + (NIV - hd) / 2;
        teinte(c, C.eau, BOUE, 0.2 + 0.62 * susp); liq.material.color.copy(c); liq.material.opacity = 0.55 + 0.35 * susp;
        const avant = phase === 'suspension';
        aLiq.position.set(-R - 0.03, 0.72, 0); aSol.position.set(R + 0.03, avant ? 0.45 : Math.max(0.06, hd / 2), 0);
        dit(lLiq, avant ? 'le liquide' : 'le liquide<br>au-dessus'); dit(lSol, avant ? 'le solide<br>en suspension' : susp < 0.5 ? 'le solide<br>au fond' : '');
        dit(lT, phase === 'attente' ? 'temps accéléré : quelques minutes…' : '');
        bAtt.disabled = phase !== 'suspension'; void bRem;
        ex.set(phase === 'suspension' ? 'Eau boueuse : un solide et un liquide. Les particules de terre sont <mark>en suspension</mark> dans le liquide. Appuie sur <b>On attend</b>.'
          : phase === 'attente' ? 'On laisse reposer le mélange : les particules en suspension dans le liquide <mark>se déposent dans le fond du récipient</mark>.'
            : 'Fini : <mark>le liquide au-dessus</mark>, <mark>le solide au fond</mark>. C\'est la <mark>décantation</mark> d\'un mélange solide + liquide.');
        if (auto && phase === 'suspension' && tRem <= 0) phase = 'attente';
      },
    };
  }

  // ===================== 2. TAMISAGE =====================
  function tamisage(g, u) {
    const YT = 1.12, RT = 0.78, RB = 0.9;
    const bacM = new THREE.MeshStandardMaterial({ color: 0x4a4390, roughness: 0.5, side: THREE.DoubleSide });
    const paroi = new THREE.Mesh(new THREE.CylinderGeometry(RB + 0.08, RB, 0.34, 48, 1, true), bacM); paroi.position.y = 0.17; g.add(paroi);
    const fondB = new THREE.Mesh(new THREE.CircleGeometry(RB, 48), bacM); fondB.rotation.x = -Math.PI / 2; fondB.position.y = 0.01; g.add(fondB);
    const tamis = new THREE.Group(); tamis.position.y = YT; g.add(tamis);
    const cadre = new THREE.Mesh(new THREE.CylinderGeometry(RT + 0.03, RT + 0.03, 0.13, 48, 1, true), new THREE.MeshStandardMaterial({ color: C.bois, roughness: 0.7, side: THREE.DoubleSide })); cadre.position.y = 0.065; tamis.add(cadre);
    const grille = texture(256, 256, (x) => { x.strokeStyle = '#d6d9e4'; x.lineWidth = 3; for (let i = 0; i <= 256; i += 16) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, 256); x.stroke(); x.beginPath(); x.moveTo(0, i); x.lineTo(256, i); x.stroke(); } });
    const toile = new THREE.Mesh(new THREE.CircleGeometry(RT + 0.03, 48), new THREE.MeshStandardMaterial({ map: grille, alphaTest: 0.5, side: THREE.DoubleSide, metalness: 0.3, roughness: 0.4 })); toile.rotation.x = -Math.PI / 2; tamis.add(toile);
    // trous de ~0,08 : le sable (Ø 0,03 à 0,045) passe, les cailloux (Ø 0,14 à 0,22) restent
    const sable = nuage(new THREE.IcosahedronGeometry(1, 0), 260, g); sable.tint(0xd9b56f, 0.14);
    const caillou = nuage(new THREE.IcosahedronGeometry(1, 0), 22, g); caillou.tint(0x9a96a6, 0.28);
    const aG = new THREE.Object3D(); aG.position.set(-RT - 0.05, 0.2, 0); tamis.add(aG);
    lbl('un tamis', V3(RT + 0.06, YT + 0.12, 0), 'd', 'fluo');
    const lHaut = lbl('', aG, 'g'), lBas = lbl('', V3(-RB - 0.1, 0.18, 0), 'g');
    note(u, COURS.tamisage, COURS.tamP);
    const [bV, bS, bR] = u.buttons([{ label: 'Verser le mélange', primary: true, onClick: () => verser() }, { label: 'Secouer', onClick: () => { if (verse) tSec = 1.8; } }, { label: 'Recommencer', onClick: () => init() }]);
    const lu = u.readout('Sable passé à travers le tamis');
    let verse = false, tSec = 0, tV = 0, nb = 0, secoue = false, fPrev = 0;
    function init() { verse = false; tSec = 0; secoue = false; nb = 0; fPrev = 0; for (const p of [sable, caillou]) { for (const q of p.P) q.st = 'off'; p.commit(); } tamis.position.set(0, YT, 0); }
    function verser() {
      if (verse) return; verse = true; tV = 0;
      for (const [p, gros] of [[sable, false], [caillou, true]]) for (const q of p.P) {
        q.r = gros ? rand(0.07, 0.11) : rand(0.015, 0.022); const a = rand(6.28), rr = (gros ? 0.5 : 0.55) * Math.sqrt(Math.random());
        q.lx = Math.cos(a) * rr; q.lz = Math.sin(a) * rr; q.h = gros ? q.r * 0.75 + 0.05 + rand(0.04) : q.r + rand(0.07) * (1 - rr / 0.6);
        q.x = q.lx; q.z = q.lz; q.y = 2.3 + rand(0.6) + (gros ? 0.2 : 0); q.vy = 0; q.s = 1; q.st = 'chute';
      }
    }
    init();
    return {
      box: { xL: -1.0, xR: 1.0, yB: 0, yT: 1.4, z: 0.95, dir: [0, 0.85, 1] },
      maj(dt, t) {
        tV += dt;
        tSec = Math.max(0, tSec - dt); const env = sm(clamp(tSec / 0.25, 0, 1)) * sm(clamp((1.8 - tSec) / 0.2, 0, 1));
        tamis.position.x = Math.sin(t * Math.PI * 9) * 0.085 * env; tamis.position.z = Math.sin(t * Math.PI * 6.2) * 0.035 * env;
        if (tSec > 0) secoue = true;
        let passe = 0, tot = 0;
        for (const [p, gros] of [[sable, false], [caillou, true]]) {
          for (const q of p.P) {
            if (q.st === 'chute') { q.vy -= 5 * dt; q.y += q.vy * dt; if (q.y <= YT + q.h) q.st = 'tamis'; }
            if (q.st === 'tamis') {
              const j = env * (gros ? 0.012 : 0.02);
              q.x = tamis.position.x + q.lx + Math.sin(q.a + t * 40) * j; q.z = tamis.position.z + q.lz + Math.cos(q.a + t * 37) * j; q.y = YT + (gros ? lerp(q.h, q.r * 0.85, fPrev) : q.h);
              if (gros) q.a += env * dt * 3;
              else if (env > 0.3 && Math.random() < 1.3 * dt) { q.st = 'passe'; q.vy = 0; q.h = 0.012 + q.r + rand(0.05) + nb * 0.00012; nb++; }
            } else if (q.st === 'passe') { q.vy -= 5 * dt; q.y += q.vy * dt; q.a += dt * 4; if (q.y <= q.h) { q.y = q.h; q.st = 'bac'; } }
            if (!gros) { tot++; if (q.st === 'passe' || q.st === 'bac') passe++; }
          }
          p.commit();
        }
        const f = tot ? passe / tot : 0; fPrev = f;
        lu.set(verse ? pct(f) : '—');
        dit(lHaut, !verse ? '' : f > 0.6 ? 'les éléments<br>les plus gros' : 'le mélange :<br>sable + cailloux');
        dit(lBas, f > 0.15 ? 'les morceaux<br>plus petits' : '');
        bV.disabled = verse; bS.disabled = !verse || tSec > 0; void bR;
        ex.set(!verse ? 'Le mélange : du sable et des cailloux, deux solides de tailles différentes. Appuie sur <b>Verser le mélange</b>.'
          : !secoue ? 'Le mélange est sur le tamis. Appuie sur <b>Secouer</b>.'
            : tSec > 0 ? 'Le sable, en morceaux plus petits que les trous du tamis, passe au travers…'
              : f < 0.97 ? 'Il reste du sable sur le tamis : secoue encore !'
                : 'Le tamis a retenu <mark>les éléments les plus gros</mark> (les cailloux) ; le sable, en <mark>morceaux plus petits</mark>, est passé au travers. C\'est le <mark>tamisage</mark>.');
        if (auto && !verse) verser();
        if (auto && verse && tV > 1.4 && tSec <= 0 && f < 0.97) tSec = 1.8;
      },
    };
  }

  // ===================== 3. FILTRATION =====================
  function filtration(g, u) {
    const XT = 1.05, YA = 2.035; // tige du statif ; pointe du filtre
    const tige = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 3.2, 12), metal); tige.position.set(XT, 1.6, -0.05); g.add(tige);
    const socle = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.06, 0.95), new THREE.MeshStandardMaterial({ color: 0x3b3566, roughness: 0.6 })); socle.position.set(0.3, 0.03, -0.05); g.add(socle);
    const ann = new THREE.Mesh(new THREE.TorusGeometry(0.47, 0.02, 8, 40), metal); ann.rotation.x = Math.PI / 2; ann.position.y = 2.42; g.add(ann);
    const bras = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 1, 8), metal); entre(bras, V3(0.47, 2.42, 0), V3(XT, 2.42, -0.05)); g.add(bras);
    const ent = new THREE.Mesh(new THREE.LatheGeometry([new THREE.Vector2(0.035, 0.85), new THREE.Vector2(0.035, 1.98), new THREE.Vector2(0.62, 2.6), new THREE.Vector2(0.65, 2.62)], 40), glassMaterial({ opacity: 0.22 }));
    ent.renderOrder = 2; g.add(ent);
    const papier = new THREE.MeshStandardMaterial({ color: 0xf7f3ea, roughness: 1, side: THREE.DoubleSide, transparent: true, opacity: 0.88 });
    const filtre = new THREE.Mesh(new THREE.ConeGeometry(0.55, 0.55, 32, 1, true), papier); filtre.rotation.x = Math.PI; filtre.position.y = YA + 0.275; g.add(filtre);
    const dansF = new THREE.Mesh(new THREE.ConeGeometry(1, 1, 32), liquidMaterial(BOUE, 0.8)); dansF.rotation.x = Math.PI; dansF.renderOrder = 1; g.add(dansF);
    const boue = nuage(new THREE.IcosahedronGeometry(1, 0), 150, g); boue.tint(0x6b4423, 0.2);
    boue.P.forEach((q, i) => { const h = 0.03 + 0.34 * Math.pow(Math.random(), 1.5), a = rand(6.28); q.x = Math.cos(a) * h * 0.93; q.z = Math.sin(a) * h * 0.93; q.y = YA + h + 0.006; q.r = rand(0.014, 0.026); q.th = i / 150; q.st = 'on'; });
    const bk = beaker(0.5, 0.95); bk.position.y = 0.06; g.add(bk);
    const filtrat = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 1, 40), liquidMaterial(0x9fdcff, 0.45)); filtrat.renderOrder = 1; g.add(filtrat);
    // le bécher de mélange qu'on penche, et l'agitateur
    const P = V3(-0.36, 2.95, 0), A = V3(-0.45, 3.28, 0), B = V3(-0.14, 2.17, 0.0);
    const pivot = new THREE.Group(); pivot.position.copy(P); g.add(pivot);
    const src = beaker(0.3, 0.62); src.position.set(-0.3, -0.62, 0); pivot.add(src);
    const plan = new THREE.Plane(V3(0, -1, 0), 3);
    const melM = liquidMaterial(BOUE, 0.85); melM.clippingPlanes = [plan]; melM.side = THREE.DoubleSide;
    const mel = new THREE.Mesh(new THREE.CylinderGeometry(0.285, 0.285, 0.6, 32), melM); mel.position.y = 0.31; src.add(mel);
    const agit = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 1, 12), glassMaterial({ opacity: 0.55 })); entre(agit, A, B); g.add(agit);
    const coulee = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 1, 8), liquidMaterial(BOUE, 0.9)); g.add(coulee);
    const goutteM = liquidMaterial(0x9fdcff, 0.8), gouttes = Array.from({ length: 6 }, () => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.022, 10, 8), goutteM); m.visible = false; g.add(m); return m; });
    const filet = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 1, 8), goutteM); g.add(filet);
    lbl('un agitateur', A, 'g');
    lbl('le mélange<br>(eau boueuse)', V3(-0.98, 2.6, 0), 'g');
    lbl('un filtre', V3(0.6, 2.62, 0), 'd');
    lbl('un entonnoir', V3(0.06, 1.55, 0), 'd');
    const lPart = lbl('', V3(0.2, 2.14, 0), 'd'), aF = new THREE.Object3D(); g.add(aF);
    const lFiltrat = lbl('', aF, 'd', 'fluo');
    note(u, COURS.filtration, COURS.filP);
    const [bV, bR] = u.buttons([{ label: 'Verser', primary: true, onClick: () => { versant = !versant && L > 0; } }, { label: 'Recommencer', onClick: () => init() }]);
    const VS = 0.16;
    let L, Vf, F, versant, tilt, tg;
    function init() { L = 1; Vf = 0; F = 0; versant = false; tilt = 0; tg = 0; }
    init();
    const cP = new THREE.Color(), lo = V3(0, 0, 0), lo2 = V3(0, 0, 0);
    return {
      box: { xL: -1.0, xR: 1.1, yB: 0, yT: 3.35, z: 0.45 },
      maj(dt) {
        tilt = lerp(tilt, versant ? 1.15 : 0, Math.min(1, dt * 3)); pivot.rotation.z = -tilt;
        const verse = versant && tilt > 0.95 && L > 0;
        if (verse) { const d = Math.min(L * VS, 0.045 * dt); L -= d / VS; Vf += d; }
        if (L <= 0) { L = 0; versant = false; }
        const yL = Math.cbrt(3 * Vf / Math.PI);
        if (yL > 0.45) versant = false; // le filtre ne déborde pas
        const qd = Vf > 0 ? Math.min(Vf, (0.035 * (yL / 0.4) ** 2 + 0.006) * dt) : 0;
        Vf -= qd; F += qd;
        // dessin
        src.localToWorld(lo.set(-0.285, 0.01, 0)); src.localToWorld(lo2.set(0.285, 0.01, 0));
        const low = Math.min(lo.y, lo2.y), tf = tilt / 1.15;
        plan.constant = low + clamp(0.78 * L + 0.95 * tf * Math.sqrt(L), 0, 0.98) * (P.y - low); mel.visible = L > 0.005;
        coulee.visible = verse; if (verse) { entre(coulee, V3(P.x + 0.02, P.y - 0.01, 0.025), V3(B.x + 0.01, B.y + 0.02, 0.025)); coulee.scale.x = coulee.scale.z = 1; }
        dansF.visible = yL > 0.01; dansF.scale.set(yL * 0.97, Math.max(yL, 1e-3), yL * 0.97); dansF.position.y = YA + yL / 2;
        const ff = F / VS; boue.P.forEach((q) => { q.s = lerp(q.s, ff > q.th ? 1 : 0, Math.min(1, dt * 4)); }); boue.commit();
        teinte(cP, 0xf7f3ea, 0xb89a78, 0.5 * ff); papier.color.copy(cP);
        const hF = F / (Math.PI * 0.48 * 0.48); filtrat.visible = hF > 0.002; filtrat.scale.y = Math.max(hF, 1e-3); filtrat.position.y = 0.065 + hF / 2;
        const surf = 0.065 + hF, debit = qd / Math.max(dt, 1e-4);
        filet.visible = debit > 0.02; if (filet.visible) entre(filet, V3(0, 0.85, 0), V3(0, surf, 0));
        for (const m of gouttes) { if (m.visible) { m.userData.v -= 6 * dt; m.position.y += m.userData.v * dt; if (m.position.y < surf) m.visible = false; } }
        tg += dt;
        if (debit > 0.001 && debit <= 0.02 && tg > 0.012 / debit) { tg = 0; const m = gouttes.find((x) => !x.visible); if (m) { m.visible = true; m.position.set(0, 0.84, 0); m.userData.v = 0; } }
        aF.position.set(0.52, 0.065 + hF / 2 + 0.04, 0);
        dit(lFiltrat, F > 0.004 ? 'le filtrat' : ''); dit(lPart, ff > 0.15 ? 'les particules<br>solides' : '');
        bV.textContent = versant ? 'Arrêter' : 'Verser'; bV.disabled = L <= 0; void bR;
        const fini = L <= 0 && Vf < 0.0005;
        ex.set(fini ? 'Fini ! Les <mark>particules solides</mark> (la boue) sont restées sur le filtre ; le liquide limpide dans le bécher, c\'est <mark>le filtrat</mark>. C\'est la <mark>filtration</mark>.'
          : F > 0.01 ? 'Le liquide limpide qui tombe dans le bécher, c\'est <mark>le filtrat</mark> (filtrat = résultat d\'une filtration). Le filtre retient les particules solides.'
            : versant || Vf > 0 ? 'Le mélange coule le long de <mark>l\'agitateur</mark> dans <mark>le filtre</mark>, posé dans <mark>l\'entonnoir</mark>…'
              : 'Le mélange : de l\'eau boueuse (un liquide + un solide). Appuie sur <b>Verser</b> : il va couler le long de l\'agitateur, dans le filtre.');
        if (auto && L > 0 && !versant) versant = true;
      },
    };
  }

  // ===================== 4. ÉVAPORATION =====================
  function evaporation(g, u) {
    const GT = 1.255, R = 1.6, A0 = 0.62, S = R - Math.sqrt(R * R - A0 * A0); // dessus de la toile ; verre de montre (calotte)
    const rV = (y) => Math.sqrt(Math.max(0, R * R - (R - y) ** 2));
    const tv = tableVolume(rV, 0, S);
    // bec Bunsen
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.3, 0.06, 32), metal); base.position.y = 0.03; g.add(base);
    const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.065, 0.75, 20), metal); tube.position.y = 0.435; g.add(tube);
    const bague = new THREE.Mesh(new THREE.CylinderGeometry(0.078, 0.078, 0.08, 20), new THREE.MeshStandardMaterial({ color: 0x6f6a86, metalness: 0.4, roughness: 0.4 })); bague.position.y = 0.2; g.add(bague);
    const flamme = new THREE.Group(); flamme.position.y = 0.81; g.add(flamme);
    const fl = (r, hgt, col, op) => { const m = new THREE.Mesh(new THREE.ConeGeometry(r, hgt, 20, 1, true), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: op, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })); m.position.y = hgt / 2; flamme.add(m); return m; };
    fl(0.1, 0.5, C.chaud, 0.7); fl(0.055, 0.24, 0x4d8bff, 0.85);
    const lum = new THREE.PointLight(0xff7a3d, 0, 3); lum.position.set(0, 1.0, 0.2); g.add(lum);
    // trépied + toile métallique
    const ann = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.02, 8, 40), metal); ann.rotation.x = Math.PI / 2; ann.position.y = 1.22; g.add(ann);
    for (let i = 0; i < 3; i++) { const a = i * 2.094 + 0.5, p = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 1, 8), metal); entre(p, V3(Math.cos(a) * 0.42, 1.22, Math.sin(a) * 0.42), V3(Math.cos(a) * 0.56, 0, Math.sin(a) * 0.56)); g.add(p); }
    const toileT = texture(128, 128, (x) => { x.fillStyle = '#5d5a6c'; x.fillRect(0, 0, 128, 128); x.strokeStyle = '#a9a6b8'; x.lineWidth = 1.5; for (let i = 0; i <= 128; i += 8) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, 128); x.stroke(); x.beginPath(); x.moveTo(0, i); x.lineTo(128, i); x.stroke(); } });
    const toile = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.015, 1.05), new THREE.MeshStandardMaterial({ map: toileT, metalness: 0.3, roughness: 0.6 })); toile.position.y = GT - 0.0075; g.add(toile);
    const disque = new THREE.Mesh(new THREE.CircleGeometry(0.3, 32), new THREE.MeshStandardMaterial({ color: 0xd8d4dc, roughness: 0.9, emissive: C.chaud, emissiveIntensity: 0 })); disque.rotation.x = -Math.PI / 2; disque.position.y = GT + 0.001; g.add(disque);
    // verre de montre + eau salée + cristaux
    const vm = new THREE.Mesh(new THREE.SphereGeometry(R, 64, 12, 0, Math.PI * 2, Math.PI - Math.asin(A0 / R), Math.asin(A0 / R)), glassMaterial({ opacity: 0.26 }));
    vm.position.y = GT + 0.004 + R; vm.renderOrder = 2; g.add(vm);
    const vmG = new THREE.Group(); vmG.position.y = GT + 0.006; g.add(vmG);
    const eau = couche(liquidMaterial(C.eau, 0.55), vmG, (y) => rV(y) - 0.004, 24);
    const crist = nuage(new THREE.BoxGeometry(1, 1, 1), 170, vmG); crist.tint(0xffffff, 0.06);
    crist.P.forEach((q) => { const rho = 0.53 * Math.sqrt(Math.random()), a = rand(6.28); q.lx = rho; q.x = Math.cos(a) * rho; q.z = Math.sin(a) * rho; q.r = rand(0.012, 0.028); q.y = R - Math.sqrt(R * R - rho * rho) + q.r * 0.4; q.st = 'on'; });
    // vapeur : des sprites doux qui montent
    const vapT = texture(64, 64, (x) => { const gr = x.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(240,248,255,1)'); gr.addColorStop(1, 'rgba(240,248,255,0)'); x.fillStyle = gr; x.fillRect(0, 0, 64, 64); });
    const vap = Array.from({ length: 28 }, () => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: vapT, transparent: true, depthWrite: false, opacity: 0 })); s.visible = false; s.userData = { age: 0, vie: 1 }; g.add(s); return s; });
    lbl('une source<br>de chaleur', V3(-0.12, 0.5, 0), 'g', 'chaud');
    lbl('un verre<br>de montre', V3(0.66, GT + 0.13, 0), 'd');
    const lEau = lbl('', V3(-0.6, GT + 0.08, 0), 'g'), lCr = lbl('', V3(0.42, GT - 0.1, 0), 'd', 'fluo'), lVap = lbl('', V3(0.28, GT + 0.8, 0), 'd', 'discret');
    note(u, COURS.evaporation, COURS.evaP);
    const sl = u.slider({ label: 'Chaleur', min: 0, max: 100, step: 1, value: 0, unit: '%', onInput: () => {} });
    const [bR] = u.buttons([{ label: 'Recommencer', onClick: () => init() }]);
    const lu = u.readout('Liquide restant');
    void bR;
    const V0 = tv.V(0.095);
    let V, tSp;
    function init() { V = V0; tSp = 0; crist.P.forEach((q) => { q.s = 0; }); }
    init();
    return {
      box: { xL: -0.68, xR: 0.68, yB: 0, yT: 2.2, z: 0.5, dir: [0, 0.5, 1] },
      maj(dt, t) {
        if (auto && sl.value === 0) sl.set(80);
        const ch = sl.value / 100;
        V = Math.max(0, V - 0.0055 * (0.015 + ch) * dt);
        const h = tv.Y(V), f = V / V0, rs = V > 0 ? rV(h) : 0;
        eau.set(0, h); eau.mesh.visible = V > 1e-5 && h > 0.002;
        let nC = 0;
        for (const q of crist.P) { const on = q.lx > rs - 0.006 || f < 0.3 * q.th; q.s = Math.min(1, q.s + (on ? dt * 2 : 0)); if (q.s > 0.3) nC++; }
        crist.commit();
        // flamme, lueur
        flamme.visible = ch > 0.02; flamme.scale.set(0.6 + 0.5 * ch, ch * (0.85 + 0.08 * Math.sin(t * 31)), 0.6 + 0.5 * ch);
        lum.intensity = 2.2 * ch; disque.material.emissiveIntensity = 0.45 * ch;
        // vapeur
        tSp += dt * 10 * ch * (V > 0 ? 1 : 0);
        while (tSp > 1) { tSp -= 1; const s = vap.find((x) => !x.visible); if (!s) break; const a = rand(6.28), r = rs * 0.8 * Math.sqrt(Math.random()); s.position.set(Math.cos(a) * r, GT + h + 0.03, Math.sin(a) * r); s.userData = { age: 0, vie: rand(1.8, 2.6), v: rand(0.3, 0.55), ph: rand(6.28) }; s.visible = true; }
        let nV = 0;
        for (const s of vap) {
          if (!s.visible) continue; const d = s.userData; d.age += dt; if (d.age > d.vie) { s.visible = false; continue; }
          nV++; const k = d.age / d.vie; s.position.y += d.v * dt; s.position.x += Math.sin(d.ph + d.age * 2) * 0.05 * dt;
          s.scale.setScalar(0.12 + 0.5 * k); s.material.opacity = 0.42 * Math.min(1, d.age / 0.3) * (1 - k);
        }
        lu.set(pct(f));
        dit(lEau, f > 0.02 ? 'eau salée' : ''); dit(lCr, nC > 12 ? 'cristaux<br>de sel' : ''); dit(lVap, nV > 3 ? 'vapeur d\'eau' : '');
        ex.set(f <= 0 ? 'Tout le liquide s\'est transformé en vapeur : il ne reste que les <mark>cristaux de sel</mark>. On a récupéré le solide qui était dissout : c\'est l\'<mark>évaporation</mark>.'
          : ch < 0.02 && f > 0.98 ? 'Dans le verre de montre : de l\'eau salée, un <mark>mélange homogène</mark> (le sel est dissout : on ne le voit pas). Fais chauffer avec le curseur.'
            : ch < 0.02 ? 'Sans chaleur, le liquide s\'évapore très lentement. Remonte le curseur.'
              : nC > 12 ? 'Des <mark>cristaux de sel</mark> apparaissent là où il n\'y a plus de liquide…'
                : 'Le liquide se transforme en <mark>vapeur</mark> : le niveau baisse. Le sel, lui, ne s\'évapore pas : il reste dans le verre de montre.');
      },
    };
  }

  const LABS = { decantation: (g, u, v) => (v === 'S' ? becherBoue(g, u) : ampoule(g, u)), tamisage, filtration, evaporation };

  // ---------- défi : quel mélange → quelle méthode ? ----------
  const [bDefi] = ui.buttons([{ label: 'Défi : quel mélange → quelle méthode ?', onClick: () => { const on = defi.style.display === 'none'; defi.style.display = on ? 'flex' : 'none'; bDefi.classList.toggle('on', on); if (on && !dq.innerHTML) suivante(); } }]);
  const defi = document.createElement('div'); defi.style.cssText = 'display:none;flex-direction:column;gap:10px'; panelEl.appendChild(defi);
  const dp = panel(defi);
  const dq = dp.note('');
  const dB = dp.buttons(METHODES.map((m) => ({ label: m.label, onClick: () => repondre(m.value) })));
  const dRes = dp.note('');
  dp.buttons([{ label: 'Question suivante', onClick: () => suivante() }]);
  const dScore = dp.readout('Bonnes réponses'); dScore.set('0 / 0');
  let ordre = [], iq = -1, bons = 0, faits = 0, repondu = false;
  function suivante() {
    if (!ordre.length || iq >= ordre.length - 1) { ordre = DEFI.map((d, i) => i).sort(() => Math.random() - 0.5); iq = -1; }
    iq++; repondu = false; const d = DEFI[ordre[iq]];
    dq.innerHTML = `Quelle méthode pour séparer : <b style="color:#fff;font-size:17px">${d.q}</b> ?`; dRes.innerHTML = '';
    dB.forEach((b) => b.classList.remove('on'));
  }
  function repondre(m) {
    if (repondu) return; repondu = true; faits++;
    const d = DEFI[ordre[iq]], ok = d.ok.includes(m); if (ok) bons++;
    dB.forEach((b, i) => b.classList.toggle('on', d.ok.includes(METHODES[i].value)));
    dRes.innerHTML = (ok ? '<b style="color:#7ee2a8">Oui !</b> ' : '<b style="color:#ff9b85">Non.</b> ') + d.q + ' : ' + d.pq;
    dScore.set(`${bons} / ${faits}`);
  }

  // banc d'essai : ?lab=<méthode>&v=S&auto=1 ouvre un labo et lance le geste principal
  const auto = qs.get('auto') === '1';
  ouvrir(LABS[qs.get('lab')] ? qs.get('lab') : 'decantation', qs.get('v') || 'L');
  return { dispose() { if (grp) jeter(grp); st.dispose(); } };
}
