// cycle-eau.js — Le cycle de l'eau (cours, thème 5, fin de la partie D).
// Paysage low-poly fidèle au schéma du cours : mer, rivière, lac, montagne enneigée et glacier, nuages, soleil.
// Des particules d'eau font le cycle ; le curseur « Soleil » règle l'apport d'énergie (sans soleil, le cycle s'arrête).
import { THREE, C, layout, createStage, panel, explain, clamp, lerp, rand } from './kit.js';

const MONT = [3.6, -0.9], LAC = [0.6, 1.0], LANGUE = [2.55, -0.35];   // sommet, lac, bas du glacier
const RIV = [[2.55, -0.35], [1.95, 0.15], [1.3, 0.65], [0.6, 1.0], [-0.2, 1.35], [-1.0, 1.6], [-2.0, 1.75]];
const XMIN = -2.2, XMAX = 5.8, ZMIN = -3, ZMAX = 3, FOND = -1.2, MER0 = -5.2, MER1 = -1.3, COTE = -1.45;
const CACHE = 0, VAP = 1, PLUIE = 2, NEIGE = 3, RIVIERE = 4;           // états d'une particule visible
const NP = 360;

const hash = (x, z) => { const s = Math.sin(x * 127.1 + z * 311.7) * 43758.5453; return s - Math.floor(s); };
const g2 = (x, z, cx, cz, s) => Math.exp(-((x - cx) ** 2 + (z - cz) ** 2) / s);
function dSeg(px, pz, a, b) {
  const dx = b[0] - a[0], dz = b[1] - a[1], t = clamp(((px - a[0]) * dx + (pz - a[1]) * dz) / (dx * dx + dz * dz), 0, 1);
  return Math.hypot(px - a[0] - dx * t, pz - a[1] - dz * t);
}
function dRiv(x, z) { let d = 9; for (let i = 0; i < RIV.length - 1; i++) d = Math.min(d, dSeg(x, z, RIV[i], RIV[i + 1])); return d; }
const dLac = (x, z) => Math.hypot(x - LAC[0], z - LAC[1]);
function hSol(x, z) {                       // relief : plage, montagne (et un 2e sommet), creux du lac, lit de la rivière
  let h = 0.25 - 0.6 * clamp((-0.9 - x) / 1.3, 0, 1);
  h += 3.0 * g2(x, z, MONT[0], MONT[1], 2.4) + 1.5 * g2(x, z, 5.3, -2.0, 1.3);
  return h - 0.22 * g2(x, z, LAC[0], LAC[1], 0.3) - 0.1 * Math.exp(-(dRiv(x, z) ** 2) / 0.02);
}
function couleurSol(x, y, z, c) {
  const n = hash(x * 3.1, z * 2.7) > 0.5;
  if (y < 0.07) return c.set(0xd9c48e);                                   // sable
  if (y > 1.6 && dSeg(x, z, MONT, LANGUE) < 0.4) return c.set(0x8fd3f4);     // glacier (glace bleutée)
  if (y > 2.4) return c.set(0xf4f8ff);                                    // neige
  if (y > 1.5) return c.set(n ? 0x8a8174 : 0x7b7368);                     // roche
  if (y > 0.85) return c.set(n ? 0x6f8f4e : 0x66854a);
  return c.set(n ? 0x4f9a4a : 0x58a653);                                  // prairie
}

const NOMS = { solidification: 'solidification', fusion: 'fusion', evaporation: 'évaporation / vaporisation', condensation: 'condensation' };
const NOMS2 = Object.assign({}, NOMS, { evaporation: 'évaporation /<br>vaporisation' });   // sur deux lignes dans la scène
const BONNE = { solidification: 'la <mark>solidification</mark>', fusion: 'la <mark>fusion</mark>', evaporation: "l'<mark>évaporation</mark> (une vaporisation)", condensation: 'la <mark>condensation</mark>' };
const POINTS = [
  { id: 'solid', rep: 'solidification', p: [3.6, 3.75, -0.9] },
  { id: 'fusion', rep: 'fusion', p: [2.7, 2.2, -0.4] },
  { id: 'evapRiv', rep: 'evaporation', p: [1.0, 1.95, 1.45] },
  { id: 'evapMer', rep: 'evaporation', p: [-3.4, 2.55, 1.2] },
  { id: 'cond', rep: 'condensation', p: [-0.4, 3.45, 1.0] },
];
const EXP = {
  intro: "L'eau circule entre <mark>cinq grands réservoirs</mark> en effectuant un <mark>cycle</mark>, et elle change d'état en chemin. Touche une étiquette jaune pour voir quel changement d'état se produit à cet endroit.",
  solid: "Au sommet de la montagne, il fait très froid : l'eau passe de l'état liquide à l'état solide et tombe en neige ou en grêle. C'est la <mark>solidification</mark>.",
  fusion: "Le glacier fond : l'eau passe de l'état solide à l'état liquide. C'est la <mark>fusion</mark>. L'eau de fonte alimente la rivière, qui retourne à la mer.",
  evapRiv: "Au-dessus de la rivière et du lac, l'eau passe de l'état liquide à l'état gazeux à la <mark>surface libre</mark> du liquide : c'est l'<mark>évaporation</mark>, une forme de <mark>vaporisation</mark>. L'eau des végétaux s'évapore aussi.",
  evapMer: "Le soleil chauffe la mer : à sa surface libre, l'eau passe de l'état liquide à l'état gazeux. C'est l'<mark>évaporation</mark>, une forme de <mark>vaporisation</mark>. La vapeur d'eau monte dans l'atmosphère.",
  cond: "En altitude, la vapeur d'eau perd de l'énergie : elle passe de l'état gazeux à l'état liquide, en fines gouttelettes. C'est la <mark>condensation</mark> : les nuages se forment, puis il pleut.",
  soleil: "Tous ces changements d'états ont lieu grâce à un <mark>échange d'énergie</mark> (apport ou retrait). L'apport d'énergie dans le cycle de l'eau provient du <mark>SOLEIL</mark>. Plus de soleil : le cycle va plus vite.",
  sansSoleil: "Sans <mark>soleil</mark>, plus d'apport d'énergie : plus d'évaporation, plus de fusion. Les nuages se vident, les rivières s'arrêtent : le <mark>cycle</mark> s'arrête.",
  test: "Mode « Me tester » : touche un <b>?</b> et choisis le changement d'état qui se produit à cet endroit. Il y a 5 points à trouver.",
};
const RESERVOIRS = [['mers et océans', 'liquide'], ['glaciers et calottes glaciaires', 'solide'], ['eaux souterraines', 'liquide'], ['lacs et rivières', 'liquide'], ['atmosphère', 'gazeux']];

export default function mount(root) {
  const { stageEl, panelEl, explainEl } = layout(root);
  const st = createStage(stageEl, { camera: { pos: [0.1, 6.5, 13], target: [0.1, 1.9, 0], fov: 42 }, lights: false, minDistance: 6, maxDistance: 30 });
  const scene = st.scene, ex = explain(explainEl), q = new URLSearchParams(location.search);
  let soleil = 0.7;

  // ---------- lumières : le soleil éclaire plus ou moins ----------
  scene.add(new THREE.HemisphereLight(0xcfe0ff, 0x2a2440, 0.8));
  const SOL_POS = new THREE.Vector3(-3.9, 5.0, -2.2);
  const lumSoleil = new THREE.DirectionalLight(0xfff0d0, 1.4); lumSoleil.position.copy(SOL_POS).multiplyScalar(2); scene.add(lumSoleil);
  const fill = new THREE.DirectionalLight(0x8f6bff, 0.35); fill.position.set(6, 3, 6); scene.add(fill);

  // ---------- terrain low-poly (une couleur par facette) ----------
  const tg = new THREE.PlaneGeometry(XMAX - XMIN, ZMAX - ZMIN, 46, 34); tg.rotateX(-Math.PI / 2); tg.translate((XMIN + XMAX) / 2, 0, (ZMIN + ZMAX) / 2);
  const tp = tg.attributes.position;
  for (let i = 0; i < tp.count; i++) {
    const x = tp.getX(i), z = tp.getZ(i), bord = x < XMIN + 1e-3 || x > XMAX - 1e-3 || z < ZMIN + 1e-3 || z > ZMAX - 1e-3;
    tp.setY(i, hSol(x, z) + (bord || dRiv(x, z) < 0.35 || dLac(x, z) < 0.9 ? 0 : (hash(x, z) - 0.5) * 0.09));
  }
  const terrain = tg.toNonIndexed(), np = terrain.attributes.position, cols = new Float32Array(np.count * 3), c = new THREE.Color();
  for (let t = 0; t < np.count; t += 3) {
    couleurSol((np.getX(t) + np.getX(t + 1) + np.getX(t + 2)) / 3, (np.getY(t) + np.getY(t + 1) + np.getY(t + 2)) / 3, (np.getZ(t) + np.getZ(t + 1) + np.getZ(t + 2)) / 3, c);
    for (let k = 0; k < 3; k++) c.toArray(cols, (t + k) * 3);
  }
  terrain.setAttribute('color', new THREE.BufferAttribute(cols, 3)); terrain.computeVertexNormals(); tg.dispose();
  scene.add(new THREE.Mesh(terrain, new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.9 })));
  // côtés du bloc (coupe du sol) et nappe d'eaux souterraines
  const jupeMat = new THREE.MeshStandardMaterial({ color: 0x7a5a40, emissive: 0x3a2618, roughness: 1, side: THREE.DoubleSide });
  const jupe = (a, b) => {
    const v = [];
    for (let k = 0; k < 48; k++) {
      const x0 = lerp(a[0], b[0], k / 48), z0 = lerp(a[1], b[1], k / 48), x1 = lerp(a[0], b[0], (k + 1) / 48), z1 = lerp(a[1], b[1], (k + 1) / 48), h0 = hSol(x0, z0), h1 = hSol(x1, z1);
      v.push(x0, h0, z0, x0, FOND, z0, x1, h1, z1, x1, h1, z1, x0, FOND, z0, x1, FOND, z1);
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(v, 3)); g.computeVertexNormals();
    scene.add(new THREE.Mesh(g, jupeMat));
  };
  jupe([XMIN, ZMAX], [XMAX, ZMAX]); jupe([XMAX, ZMAX], [XMAX, ZMIN]); jupe([XMAX, ZMIN], [XMIN, ZMIN]);
  const nappe = new THREE.Mesh(new THREE.PlaneGeometry(XMAX - COTE, 0.32), new THREE.MeshStandardMaterial({ color: 0x2f7fd0, emissive: 0x0a2a55, roughness: 0.6 }));
  nappe.position.set((XMAX + COTE) / 2, -0.7, ZMAX + 0.005); scene.add(nappe);

  // ---------- mer (bloc d'eau + vagues) ----------
  const merBloc = new THREE.Mesh(new THREE.BoxGeometry(MER1 - MER0, -0.09 - FOND, ZMAX - ZMIN), new THREE.MeshStandardMaterial({ color: 0x1d5fa6, transparent: true, opacity: 0.85, roughness: 0.3 }));
  merBloc.position.set((MER0 + MER1) / 2, (FOND - 0.09) / 2, 0); scene.add(merBloc);
  const vg = new THREE.PlaneGeometry(MER1 - MER0, ZMAX - ZMIN, 13, 18); vg.rotateX(-Math.PI / 2); vg.translate((MER0 + MER1) / 2, 0, 0);
  const vagues = new THREE.Mesh(vg, new THREE.MeshStandardMaterial({ color: C.eau, emissive: 0x0b3a66, emissiveIntensity: 0.8, flatShading: true, transparent: true, opacity: 0.92, roughness: 0.25, metalness: 0.1 }));
  scene.add(vagues);

  // ---------- rivière (ruban) et lac ----------
  const courbe = new THREE.CatmullRomCurve3(RIV.map(([x, z]) => new THREE.Vector3(x, 0, z)));
  const NR = 140, RX = new Float32Array(NR + 1), RY = new Float32Array(NR + 1), RZ = new Float32Array(NR + 1), PX = new Float32Array(NR + 1), PZ = new Float32Array(NR + 1);
  const rv = []; let uMer = 1, uLac = 0, dl = 9;
  courbe.getSpacedPoints(NR).forEach((p, k) => {
    const t = courbe.getTangentAt(k / NR), n = Math.hypot(t.x, t.z) || 1, w = lerp(0.1, 0.24, k / NR);
    RX[k] = p.x; RZ[k] = p.z; PX[k] = -t.z / n; PZ[k] = t.x / n;
    RY[k] = dLac(p.x, p.z) < 0.6 ? 0.15 : Math.max(hSol(p.x, p.z), hSol(p.x + PX[k] * w / 2, p.z + PZ[k] * w / 2), hSol(p.x - PX[k] * w / 2, p.z - PZ[k] * w / 2)) + 0.03;
    if (p.x < COTE && uMer === 1) uMer = k / NR;
    if (dLac(p.x, p.z) < dl) { dl = dLac(p.x, p.z); uLac = k / NR; }
    if (k) { const j = k - 1, wj = lerp(0.1, 0.24, j / NR); rv.push(RX[j] + PX[j] * wj / 2, RY[j], RZ[j] + PZ[j] * wj / 2, RX[j] - PX[j] * wj / 2, RY[j], RZ[j] - PZ[j] * wj / 2, RX[k] + PX[k] * w / 2, RY[k], RZ[k] + PZ[k] * w / 2,
      RX[k] + PX[k] * w / 2, RY[k], RZ[k] + PZ[k] * w / 2, RX[j] - PX[j] * wj / 2, RY[j], RZ[j] - PZ[j] * wj / 2, RX[k] - PX[k] * w / 2, RY[k], RZ[k] - PZ[k] * w / 2); }
  });
  const eauMat = new THREE.MeshStandardMaterial({ color: 0x3fa9f5, emissive: 0x0b3a66, emissiveIntensity: 0.6, roughness: 0.3, side: THREE.DoubleSide });
  const rg = new THREE.BufferGeometry(); rg.setAttribute('position', new THREE.Float32BufferAttribute(rv, 3)); rg.computeVertexNormals();
  scene.add(new THREE.Mesh(rg, eauMat));
  const lac = new THREE.Mesh(new THREE.CircleGeometry(0.62, 10), eauMat); lac.rotation.x = -Math.PI / 2; lac.position.set(LAC[0], 0.15, LAC[1]); scene.add(lac);
  const LONG = courbe.getLength();
  function posRiv(uu, i, out) {
    const f = clamp(uu, 0, 1) * NR, k = Math.min(NR - 1, Math.floor(f)), a = f - k, o = off[i] * lerp(0.05, 0.11, uu);
    return out.set(lerp(RX[k], RX[k + 1], a) + PX[k] * o, lerp(RY[k], RY[k + 1], a) + 0.04, lerp(RZ[k], RZ[k + 1], a) + PZ[k] * o);
  }
  function procheRiv(x, z) { let best = 0, bd = 9; for (let k = 0; k <= NR; k++) { const d = Math.hypot(RX[k] - x, RZ[k] - z); if (d < bd) { bd = d; best = k; } } return [best / NR, bd]; }

  // ---------- arbres (végétaux) ----------
  const cone = new THREE.ConeGeometry(0.2, 0.55, 6), tronc = new THREE.CylinderGeometry(0.035, 0.05, 0.2, 5);
  const feuille = new THREE.MeshStandardMaterial({ color: 0x2e7d4f, flatShading: true }), bois = new THREE.MeshStandardMaterial({ color: C.bois });
  const arbres = [];
  for (const [x, z] of [[-0.6, -0.5], [-0.2, -1.5], [0.5, -0.6], [1.0, -1.7], [-0.7, 2.5], [0.2, 2.4], [1.5, 2.0], [2.3, 1.4], [-0.5, 0.4], [1.6, -0.7], [0.0, -2.4], [2.9, 1.9], [-0.9, 1.0], [2.2, 0.75]]) {
    if (dRiv(x, z) < 0.35 || dLac(x, z) < 0.85) continue;
    const y = hSol(x, z), a = new THREE.Mesh(cone, feuille), b = new THREE.Mesh(tronc, bois);
    a.position.set(x, y + 0.45, z); b.position.set(x, y + 0.1, z); scene.add(a, b); arbres.push(new THREE.Vector3(x, y + 0.75, z));
  }

  // ---------- nuages (grossissent avec l'eau qu'ils contiennent) et soleil ----------
  const boule = new THREE.IcosahedronGeometry(1, 1);
  function nuage(x, y, z, r) {
    const g = new THREE.Group(), mat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x8a8aa0, emissiveIntensity: 0.45, flatShading: true, transparent: true, opacity: 0.95, roughness: 0.9 });
    for (const [a, b, d, s] of [[0, 0, 0, 0.55], [0.55, -0.05, 0.1, 0.42], [-0.55, -0.08, 0, 0.45], [0.2, 0.25, -0.1, 0.42], [-0.25, 0.2, 0.15, 0.38], [0.9, -0.12, -0.05, 0.3], [-0.9, -0.15, 0.05, 0.3]]) {
      const m = new THREE.Mesh(boule, mat); m.position.set(a * r, b * r, d * r); m.scale.setScalar(s * r); g.add(m);
    }
    g.position.set(x, y, z); scene.add(g);
    return { g, mat, r, c: new THREE.Vector3(x, y, z), stock: [], s: 1 };
  }
  const nuages = [nuage(-0.4, 3.5, 0.4, 1.25), nuage(3.2, 4.45, -1.0, 0.95)];
  const soleilMat = new THREE.MeshBasicMaterial({ color: 0xffd84d });
  const disque = new THREE.Mesh(new THREE.IcosahedronGeometry(0.55, 2), soleilMat); disque.position.copy(SOL_POS); scene.add(disque);
  const cv = document.createElement('canvas'); cv.width = cv.height = 128;
  const cx2 = cv.getContext('2d'), grd = cx2.createRadialGradient(64, 64, 4, 64, 64, 64);
  grd.addColorStop(0, 'rgba(255,228,120,1)'); grd.addColorStop(0.35, 'rgba(255,200,80,.45)'); grd.addColorStop(1, 'rgba(255,180,60,0)');
  cx2.fillStyle = grd; cx2.fillRect(0, 0, 128, 128);
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(cv), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  halo.position.copy(SOL_POS); scene.add(halo);

  // ---------- flèches ondulées de l'évaporation ----------
  const flecheMat = new THREE.MeshBasicMaterial({ color: C.vapeur, transparent: true, opacity: 0.5, depthWrite: false });
  function fleche(x, z, y0, y1) {
    const pts = []; for (let k = 0; k <= 24; k++) { const t = k / 24; pts.push(new THREE.Vector3(x + 0.12 * Math.sin(t * Math.PI * 4), lerp(y0, y1, t), z)); }
    scene.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 48, 0.028, 6), flecheMat));
    const tete = new THREE.Mesh(new THREE.ConeGeometry(0.085, 0.22, 10), flecheMat); tete.position.set(x, y1 + 0.09, z); scene.add(tete);
  }
  fleche(-3.4, 1.2, 0.25, 2.2); fleche(-4.4, -0.6, 0.25, 2.0); fleche(1.0, 1.45, 0.45, 1.6); fleche(-0.7, 2.5, 1.05, 2.0);

  // ---------- particules d'eau ----------
  const pm = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.07, 0), new THREE.MeshBasicMaterial({ color: 0xffffff }), NP);
  pm.frustumCulled = false; pm.setColorAt(0, c); scene.add(pm);
  const et = new Uint8Array(NP), src = new Uint8Array(NP), cib = new Uint8Array(NP);
  const u = new Float32Array(NP), dur = new Float32Array(NP), ph = new Float32Array(NP), off = new Float32Array(NP), A = new Float32Array(NP * 3), B = new Float32Array(NP * 3);
  const mer = [], veg = [], sout = [], glacier = [], acc = {};
  const setP = (T, i, x, y, z) => { T[i * 3] = x; T[i * 3 + 1] = y; T[i * 3 + 2] = z; };
  function evaporer(i, x, y, z, s) {              // s : 0 mer, 1 rivière/lac, 2 végétaux
    const k = Math.random() < 0.35 ? 1 : 0, n = nuages[k];
    et[i] = VAP; src[i] = s; cib[i] = k; u[i] = 0; ph[i] = rand(7);
    setP(A, i, x, y, z); setP(B, i, n.c.x + rand(-0.6, 0.6) * n.r, n.c.y + rand(-0.15, 0.2) * n.r, n.c.z + rand(-0.4, 0.4) * n.r);
    dur[i] = Math.hypot(B[i * 3] - x, B[i * 3 + 1] - y, B[i * 3 + 2] - z) / 0.85;
  }
  function pleuvoir(i) {
    const n = nuages[0], x = n.c.x + rand(-1, 1) * n.r * 0.85, z = n.c.z + rand(-0.6, 0.6) * n.r, y0 = n.c.y - 0.3 * n.r;
    const y = x < COTE ? 0.02 : dLac(x, z) < 0.6 ? 0.15 : hSol(x, z) + 0.03;
    et[i] = PLUIE; u[i] = 0; setP(A, i, x, y0, z); setP(B, i, x, y, z); dur[i] = (y0 - y) / 3.4;
  }
  function neiger(i) {
    const n = nuages[1], a = rand(6.28), r = rand(0.5), x = MONT[0] + Math.cos(a) * r, z = MONT[1] + Math.sin(a) * r, y0 = n.c.y - 0.3 * n.r;
    et[i] = NEIGE; u[i] = 0; ph[i] = rand(7); setP(A, i, n.c.x + rand(-0.6, 0.6) * n.r, y0, n.c.z + rand(-0.4, 0.4) * n.r); setP(B, i, x, hSol(x, z) + 0.04, z);
    dur[i] = (y0 - B[i * 3 + 1]) / 0.8;
  }
  const couler = (i, u0, s) => { et[i] = RIVIERE; u[i] = u0; src[i] = s; off[i] = rand(-1, 1); };   // s : 3 glacier, 4 pluie
  function atterrir(i) {                          // la pluie touche la mer, le lac, la rivière ou le sol
    const x = B[i * 3], z = B[i * 3 + 2];
    if (x < COTE) { et[i] = CACHE; mer.push(i); return; }
    if (dLac(x, z) < 0.6) { couler(i, uLac, 4); return; }
    const [ur, dr] = procheRiv(x, z);
    if (dr < 0.3) { couler(i, ur, 4); return; }
    et[i] = CACHE; (Math.random() < 0.5 ? veg : sout).push(i);   // bue par les végétaux ou infiltrée (eaux souterraines)
  }
  function flux(k, taux, pool, fn, dt) {
    acc[k] = Math.min((acc[k] || 0) + taux * dt, 3);
    while (acc[k] >= 1 && pool.length) { acc[k] -= 1; fn(pool.pop()); }
  }
  const POS = new THREE.Vector3();
  function maj(dt) {
    const s = soleil;   // l'apport d'énergie du soleil commande l'évaporation et la fusion ; la pluie et la rivière ne font que descendre
    flux('mer', s * 16, mer, (i) => evaporer(i, rand(-4.9, -1.9), 0.04, rand(-2.6, 2.6), 0), dt);
    flux('veg', s * veg.length * 0.5, veg, (i) => { const a = arbres[Math.floor(Math.random() * arbres.length)]; evaporer(i, a.x + rand(-0.1, 0.1), a.y, a.z + rand(-0.1, 0.1), 2); }, dt);
    flux('gla', s * glacier.length * 0.22, glacier, (i) => couler(i, 0, 3), dt);
    flux('sout', sout.length * 0.25, sout, (i) => mer.push(i), dt);
    const n0 = nuages[0].stock.length, n1 = nuages[1].stock.length;
    flux('pluie', n0 * 0.35 + (n0 ? 0.6 : 0), nuages[0].stock, pleuvoir, dt);
    flux('neige', n1 * 0.3 + (n1 ? 0.5 : 0), nuages[1].stock, neiger, dt);
    for (let i = 0; i < NP; i++) {
      const e = et[i]; if (e === CACHE) continue;
      if (e === RIVIERE) {
        u[i] += dt * 0.75 / LONG;
        if (u[i] >= uMer) { et[i] = CACHE; mer.push(i); }
        else if (u[i] > 0.12 && Math.random() < s * 0.1 * dt) { posRiv(u[i], i, POS); evaporer(i, POS.x, POS.y, POS.z, 1); }
        continue;
      }
      u[i] += dt / dur[i];
      if (u[i] < 1) continue;
      if (e === VAP) { et[i] = CACHE; nuages[cib[i]].stock.push(i); }     // condensation : la vapeur rejoint le nuage
      else if (e === PLUIE) atterrir(i);
      else { et[i] = CACHE; glacier.push(i); }                               // la neige s'ajoute au glacier
    }
  }
  // départ : la plupart des particules dans la mer, quelques-unes ailleurs, puis 13 s de cycle déjà joué
  for (let i = 0; i < NP; i++) (i < 25 ? nuages[0].stock : i < 40 ? nuages[1].stock : i < 70 ? glacier : i < 80 ? veg : i < 90 ? sout : mer).push(i);
  for (let k = 0; k < 400; k++) maj(1 / 30);

  // ---------- étiquettes : 5 points du schéma du cours, réservoirs, soleil ----------
  let mode = 'decouvrir', rep = {}, ouvert = null, sel = null, selT = 0;
  for (const pt of POINTS) {
    pt.lbl = st.label('', new THREE.Vector3(...pt.p), { onClick: () => clic(pt) });
    pt.lbl.el.classList.add('ce-pt');
  }
  const lblSoleil = st.label('SOLEIL', SOL_POS, { offset: [0, -0.95, 0], cls: 'fluo', onClick: () => { sel = null; ex.set(EXP.soleil); } });
  lblSoleil.el.classList.add('ce-pt');
  // zone de toucher agrandie (≥ 40 px) sans grossir l'étiquette
  const css = document.createElement('style'); css.textContent = '.ce-pt{text-align:center}.ce-pt::after{content:"";position:absolute;inset:-9px -4px}'; stageEl.appendChild(css);
  const resLbl = [
    st.label('mers et océans (liquide)', new THREE.Vector3(-3.5, -0.55, ZMAX), { cls: 'discret' }),
    st.label('glaciers (solide)', new THREE.Vector3(4.5, 2.25, -0.4), { cls: 'discret' }),
    st.label('eaux souterraines (liquide)', new THREE.Vector3(2.6, -0.7, ZMAX), { cls: 'discret' }),
    st.label('lacs et rivières (liquide)', new THREE.Vector3(LAC[0] - 0.1, 0.15, LAC[1] + 0.95), { cls: 'discret' }),
    st.label('atmosphère (gazeux)', new THREE.Vector3(1.4, 5.3, -1.6), { cls: 'discret' }),
  ];

  // ---------- réglages ----------
  const ui = panel(panelEl);
  ui.title("Le cycle de l'eau");
  const choixMode = ui.choice({ label: 'Mode', options: [{ value: 'decouvrir', label: 'Découvrir' }, { value: 'tester', label: 'Me tester' }], value: 'decouvrir', onChange: (v) => setMode(v) });
  const slS = ui.slider({ label: "Soleil (apport d'énergie)", min: 0, max: 100, step: 1, value: 70, unit: '%', onInput: (v) => { soleil = v / 100; sel = null; ex.set(v === 0 ? EXP.sansSoleil : EXP.soleil); } });
  const roScore = ui.readout('Score');
  const [bRe] = ui.buttons([{ label: 'Recommencer le test', onClick: () => setMode('tester') }]);
  const tab = document.createElement('table'); tab.className = 'sim-table';
  tab.innerHTML = '<tr><th style="text-align:left">Les cinq grands réservoirs</th><th>état de l\'eau</th></tr>' + RESERVOIRS.map(([r, e]) => `<tr><td style="text-align:left">${r}</td><td>${e}</td></tr>`).join('');
  panelEl.appendChild(tab);
  ui.note("Au cours de ce cycle, l'eau subit plusieurs changements d'état : l'évaporation (océans, végétaux…), la condensation (nuages…), la solidification (neige, grêle…), la fusion (glaciers…).");

  // Fenêtre de question (mode « Me tester »), posée sur la scène, du côté opposé au point touché
  const quiz = document.createElement('div');
  Object.assign(quiz.style, { position: 'absolute', left: '8px', right: '8px', bottom: '8px', zIndex: 5, display: 'none', background: 'rgba(20,18,38,.94)', border: '1px solid rgba(255,255,255,.28)', borderRadius: '16px', padding: '8px 10px 10px', color: '#fff' });
  quiz.innerHTML = `<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px"><b style="flex:1">Quel changement d'état se produit ici ?</b>` +
    '<button type="button" class="sim-btn" aria-label="Fermer" style="min-width:40px;padding:0">✕</button></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:6px"></div>';
  quiz.querySelector('button').onclick = () => fermer();
  const qb = quiz.lastChild;
  for (const v of Object.keys(NOMS)) { const b = document.createElement('button'); b.type = 'button'; b.className = 'sim-btn'; b.style.padding = '6px 8px'; b.textContent = NOMS[v]; b.onclick = () => repondre(v); qb.appendChild(b); }
  stageEl.appendChild(quiz);

  function majLabel(pt) {
    const e = pt.lbl.el; e.classList.remove('juste', 'faux', 'fluo');
    if (mode === 'decouvrir') { pt.lbl.set(NOMS2[pt.rep]); e.classList.add('fluo'); e.style.fontSize = ''; e.style.padding = ''; }
    else if (pt.id in rep) { pt.lbl.set(NOMS2[pt.rep]); e.classList.add(rep[pt.id] ? 'juste' : 'faux'); e.style.fontSize = ''; e.style.padding = ''; }
    else { pt.lbl.set('?'); e.style.fontSize = '18px'; e.style.padding = '6px 13px'; }
    e.style.borderColor = mode === 'tester' && !(pt.id in rep) ? '#ffe45c' : ''; e.style.borderWidth = mode === 'tester' && !(pt.id in rep) ? '2px' : '';
  }
  const score = () => Object.values(rep).filter(Boolean).length;
  function setMode(m) {
    mode = m; rep = {}; sel = null; fermer();
    POINTS.forEach(majLabel);
    roScore.el.style.display = bRe.parentElement.style.display = m === 'tester' ? '' : 'none';
    roScore.set('0 / 5'); ex.set(m === 'tester' ? EXP.test : EXP.intro);
  }
  function fermer() { quiz.style.display = 'none'; if (ouvert) ouvert.lbl.el.style.outline = ''; ouvert = null; }
  function clic(pt) {
    if (mode === 'decouvrir' || pt.id in rep) { sel = pt.id; selT = 6; ex.set(EXP[pt.id]); return; }
    fermer(); ouvert = pt; pt.lbl.el.style.outline = '3px solid #ffe45c'; quiz.style.display = '';
    const r = pt.lbl.el.getBoundingClientRect(), rs = stageEl.getBoundingClientRect(), enBas = r.top + r.height / 2 - rs.top > rs.height * 0.5;
    quiz.style.top = enBas ? '8px' : ''; quiz.style.bottom = enBas ? '' : '8px';
  }
  function repondre(v) {
    const pt = ouvert; if (!pt) return; fermer();
    const ok = v === pt.rep; rep[pt.id] = ok; majLabel(pt); roScore.set(score() + ' / 5');
    let html = (ok ? '<b>Juste !</b> ' : `<b>Pas tout à fait.</b> Ici, c'est ${BONNE[pt.rep]}. `) + EXP[pt.id];
    if (Object.keys(rep).length === POINTS.length) html += `<br><b>Résultat : ${score()} / 5.</b> ${score() === 5 ? 'Parfait !' : 'Appuie sur « Recommencer le test » pour faire mieux.'}`;
    ex.set(html);
  }
  if (q.get('mode') === 'tester') choixMode.set('tester');
  setMode(choixMode.value);
  if (q.get('soleil')) { slS.set(clamp(+q.get('soleil'), 0, 100)); soleil = slS.value / 100; }

  // Cadrage selon la forme de la scène (tant que l'élève n'a pas tourné la vue)
  let bouge = false, asp0 = 0;
  if (st.controls) st.controls.addEventListener('start', () => { bouge = true; });
  function cadrer() {
    const { w, h } = st.size(), a = w / h; if (bouge || !st.controls || Math.abs(a - asp0) < 0.01) return; asp0 = a;
    // on recule la caméra jusqu'à ce que les coins du paysage tiennent dans l'image
    const petit = w < 520, cam = st.camera, tgt = new THREE.Vector3(0.3, 1.7, 0), dir = new THREE.Vector3(0, petit ? 0.85 : 0.62, 1).normalize(), v = new THREE.Vector3();
    cam.fov = 36; cam.aspect = a; cam.updateProjectionMatrix();
    for (let d = 9; d < 40; d += 0.5) {
      cam.position.copy(tgt).addScaledVector(dir, d); cam.lookAt(tgt); cam.updateMatrixWorld();
      let ok = true;
      for (const x of petit ? [-3.5, 4.4] : [-4.4, 5.3]) for (const y of [-1.2, 5.5]) for (const z of [-3, 3]) { v.set(x, y, z).project(cam); if (Math.abs(v.x) > 1 || Math.abs(v.y) > 0.94) ok = false; }
      if (ok) break;
    }
    st.controls.target.copy(tgt); st.controls.update();
    for (const L of resLbl) L.show(w >= 560);
  }

  // ---------- boucle ----------
  const m4 = new THREE.Matrix4(), qI = new THREE.Quaternion(), P = new THREE.Vector3(), S = new THREE.Vector3();
  const COUL = [null, new THREE.Color(C.vapeur), new THREE.Color(C.eau), new THREE.Color(0xffffff), new THREE.Color(0x5cc0ff)];
  const FLUO = new THREE.Color(C.fluo), BLANC = new THREE.Color(0xffffff), GRIS = new THREE.Color(0x98a1b4), SOMBRE = new THREE.Color(0x5a5340), JAUNE = new THREE.Color(0xffd84d);
  const vpos = vg.attributes.position;
  function image(dt, t) {
    cadrer(); maj(dt);
    selT = Math.max(0, selT - dt); if (!selT) sel = null;
    for (let i = 0; i < NP; i++) {                 // particules
      const e = et[i], o = i * 3; let sx = 0.85, sy = 0.85, col = COUL[e];
      if (e === CACHE) { m4.makeScale(0, 0, 0); pm.setMatrixAt(i, m4); continue; }
      const k = u[i];
      if (e === RIVIERE) posRiv(k, i, P);
      else P.set(lerp(A[o], B[o], k), lerp(A[o + 1], B[o + 1], k), lerp(A[o + 2], B[o + 2], k));
      if (e === VAP) { P.x += 0.13 * Math.sin(k * 16 + ph[i]) * (1 - k * 0.6); P.z += 0.05 * Math.cos(k * 12 + ph[i]); sx = sy = 0.75; }
      else if (e === PLUIE) { sx = 0.5; sy = 2.0; }
      else if (e === NEIGE) { P.x += 0.14 * Math.sin(k * 10 + ph[i]); sx = sy = 0.75; }
      const vis = sel && ((sel === 'solid' && e === NEIGE) || (sel === 'fusion' && e === RIVIERE && src[i] === 3) || (sel === 'evapRiv' && e === VAP && src[i] > 0) || (sel === 'evapMer' && e === VAP && src[i] === 0) || (sel === 'cond' && e === VAP && k > 0.7));
      if (vis) { col = FLUO; sx *= 1.5; sy *= 1.5; }
      m4.compose(P, qI, S.set(sx, sy, sx)); pm.setMatrixAt(i, m4); pm.setColorAt(i, col);
    }
    pm.instanceMatrix.needsUpdate = true; pm.instanceColor.needsUpdate = true;
    for (const [j, n] of nuages.entries()) {        // nuages : taille et couleur selon l'eau qu'ils portent
      const m = n.stock.length; n.s += (0.5 + 0.55 * Math.min(1, m / 30) - n.s) * (1 - Math.exp(-2 * dt));
      n.g.scale.setScalar(n.s); n.g.position.x = n.c.x + Math.sin(t * 0.3 + j * 2) * 0.1;
      n.mat.opacity = 0.2 + 0.75 * Math.min(1, m / 10); n.mat.color.copy(BLANC).lerp(GRIS, Math.min(1, m / 45));
      n.mat.emissive.copy(sel === 'cond' ? FLUO : GRIS); n.mat.emissiveIntensity = sel === 'cond' ? 0.5 : 0.45;
    }
    for (let i = 0; i < vpos.count; i++) { const x = vpos.getX(i), z = vpos.getZ(i); vpos.setY(i, 0.035 * Math.sin(x * 2.2 + t * 1.6) + 0.025 * Math.sin(z * 3.1 + t * 1.2)); }
    vpos.needsUpdate = true;
    soleilMat.color.copy(SOMBRE).lerp(JAUNE, soleil); halo.material.opacity = 0.1 + 0.9 * soleil; halo.scale.setScalar(1.6 + 2.2 * soleil);
    lumSoleil.intensity = 0.25 + 1.5 * soleil; flecheMat.opacity = 0.08 + 0.5 * soleil;
  }
  st.onFrame(image);
  for (let k = 0; k < (+q.get('ff') || 0) * 30; k++) maj(1 / 30);   // essai : avance rapide

  return { dispose() { st.dispose(); quiz.remove(); css.remove(); } };
}
