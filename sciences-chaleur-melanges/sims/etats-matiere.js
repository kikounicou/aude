// etats-matiere.js — Les 3 états de l'eau et les changements d'état (cours, thème 5, partie D).
// 256 molécules d'eau dans une enceinte de verre. Le curseur « chaleur reçue » fait passer l'eau par les 3 états,
// avec les paliers à 0 °C et 100 °C. Deux expériences du cours en plus : la sublimation et le givre.
import { THREE, C, layout, createStage, panel, explain, glassMaterial, ground, molecules, tempColor, clamp, lerp, rand } from './kit.js';

const W = 1.5, H = 2.6, D = 0.6;              // intérieur de l'enceinte
const R = 0.05, S = 0.12;                      // rayon d'une molécule, écart entre voisines dans la glace
const NX = 8, NY = 8, NZ = 4, N = NX * NY * NZ;
const SOL = 0, LIQ = 1, GAZ = 2, BUL = 3;      // BUL : molécule dans une bulle (déjà à l'état gazeux)
const X0 = -W / 2 + R, X1 = W / 2 - R, Y1 = H - R, Z0 = -D / 2 + R, Z1 = D / 2 - R;
const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) * 2;
const fmt = (T) => (Math.round(T) < 0 ? '−' : '') + Math.abs(Math.round(T));

// Chaleur reçue (0 à 100) → température et part de chaque état. Tv = 100 °C (ébullition) ou 20 °C (évaporation).
function etatDe(E, Tv) {
  if (E <= 10) return { T: lerp(-30, 0, E / 10), fS: 1, fG: 0 };
  if (E <= 28) return { T: 0, fS: 1 - (E - 10) / 18, fG: 0 };                  // palier de fusion
  if (E <= 52) return { T: lerp(0, Tv, (E - 28) / 24), fS: 0, fG: 0 };
  if (E <= 90) return { T: Tv, fS: 0, fG: (E - 52) / 38 };                     // palier de vaporisation
  return { T: lerp(Tv, Tv + 30, (E - 90) / 10), fS: 0, fG: 1 };
}

const NOMS = {
  fusion: 'FUSION · solide → liquide', solidification: 'SOLIDIFICATION · liquide → solide',
  vaporisation: 'VAPORISATION · liquide → gaz', condL: 'CONDENSATION · gaz → liquide',
  sublimation: 'SUBLIMATION · solide → gaz', condS: 'CONDENSATION · gaz → solide',
};
const TXT = {
  debut: "L'eau est à l'état <mark>solide</mark> : ses molécules sont <mark>serrées</mark> et <mark>rangées</mark>, elles <mark>vibrent sur place</mark>. Une matière qui <mark>reçoit ou perd de la chaleur</mark> peut changer d'état : glisse le curseur ou appuie sur « Chauffer ».",
  solide: "État <mark>solide</mark> : les molécules sont <mark>serrées</mark> et <mark>rangées</mark>, en bloc. Elles ne se déplacent pas : elles <mark>vibrent sur place</mark>, d'autant plus fort que la température monte.",
  fusion: "<mark>Fusion</mark> : passage de l'état solide à l'état liquide. La glace fond par les bords. La température reste à 0 °C : c'est un <mark>palier</mark>, la chaleur reçue sert au changement d'état.",
  solidification: "<mark>Solidification</mark> : passage de l'état liquide à l'état solide. Les molécules perdent de l'énergie et se rangent (palier à 0 °C). C'est l'inverse de la fusion : les changements d'état sont des <mark>phénomènes réversibles</mark>.",
  liquide: "État <mark>liquide</mark> : les molécules sont <mark>proches mais désordonnées</mark>, au fond de l'enceinte. Elles <mark>roulent les unes sur les autres</mark> : elles se déplacent, un liquide est un <mark>fluide</mark>.",
  liquideChauffe: "État <mark>liquide</mark> : molécules proches mais désordonnées, qui roulent les unes sur les autres. Tu chauffes : la température <mark>s'élève</mark> et les molécules <mark>s'agitent</mark> de plus en plus.",
  ebullition: "<mark>Vaporisation</mark> par <mark>ébullition</mark> : des bulles se forment <mark>au sein même du liquide</mark>. L'eau bout : la température reste à 100 °C, c'est un <mark>palier</mark>.",
  evaporation: "<mark>Vaporisation</mark> par <mark>évaporation</mark> : l'eau ne bout pas (20 °C, comme sur la table de la classe). Les molécules s'échappent une à une par la <mark>surface libre du liquide</mark>.",
  condL: "<mark>Condensation</mark> : passage de l'état gazeux à l'état liquide. Les molécules perdent de l'énergie, ralentissent et se rapprochent. C'est l'inverse de la vaporisation : un <mark>phénomène réversible</mark>.",
  gaz: "État <mark>gazeux</mark> : les molécules sont <mark>très espacées</mark>, rapides, et <mark>occupent tout l'espace</mark>. Comme dans un liquide, elles se déplacent : un gaz est aussi un <mark>fluide</mark>.",
  palierFusion: "Glace et eau liquide ensemble, à 0 °C : tu es au milieu du <mark>palier</mark> de fusion. Chauffe pour faire fondre la glace, refroidis pour la faire grandir.",
  palierEbu: "Eau liquide et vapeur ensemble, à 100 °C : tu es au milieu du <mark>palier</mark> d'ébullition. Chauffe encore : la température ne bougera pas tant qu'il reste du liquide.",
  palierEvap: "Eau liquide et vapeur ensemble, à 20 °C : une partie de l'eau s'est <mark>évaporée</mark> par la surface libre, sans bouillir.",
  melange: "Plusieurs états en même temps. Une matière qui <mark>reçoit ou perd de la chaleur</mark> peut changer d'état : bouge le curseur et regarde quelle flèche s'allume.",
  condS: "<mark>Condensation</mark> : passage de l'état gazeux à l'état solide. Il fait très froid : la vapeur se dépose directement en glace, comme le givre.",
  subliDebut: "Expérience du cours : on chauffe la tige d'une <mark>cuillère à combustion</mark> et on la dépose rapidement sur un glaçon. Regarde ce que deviennent les molécules qu'elle touche.",
  sublimation: "<mark>Sublimation</mark> : passage direct de l'état solide à l'état gazeux. Là où la tige chaude touche le glaçon, la glace se transforme en vapeur sans passer par l'état liquide.",
  subliFin: "La glace touchée par la tige est passée directement de l'état solide à l'état gazeux : c'est la <mark>sublimation</mark>. Bouge le curseur pour reprendre la main.",
  givreDebut: "Expérience du cours : on sort un <mark>bloc réfrigérant</mark> du congélateur. L'air de la classe contient de l'eau à l'état gazeux…",
  givre: "<mark>Condensation</mark> : l'eau contenue dans l'air passe de l'état gazeux à l'état solide sur le bloc très froid : du <mark>givre</mark> apparaît.",
  givreFin: "Le bloc est couvert de <mark>givre</mark> : de l'eau gazeuse devenue solide, c'est une <mark>condensation</mark>. Bouge le curseur pour reprendre la main.",
};

// Triangle du cours SOLIDE – LIQUIDE – GAZ et ses 6 flèches (SVG). set(flèche active, états présents).
function triangle(parent) {
  const c = [160, 147];
  const fl = (id, A, B, off, lo, txt) => {
    const L = Math.hypot(B[0] - A[0], B[1] - A[1]), ux = (B[0] - A[0]) / L, uy = (B[1] - A[1]) / L;
    let nx = -uy, ny = ux; const mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2;
    if (nx * (mx - c[0]) + ny * (my - c[1]) < 0) { nx = -nx; ny = -ny; }   // normale vers l'extérieur
    const ax = A[0] + ux * 4 + nx * off, ay = A[1] + uy * 4 + ny * off, bx = B[0] - ux * 4 + nx * off, by = B[1] - uy * 4 + ny * off;
    const hx = bx - ux * 10, hy = by - uy * 10, tx = mx + nx * lo, ty = my + ny * lo;
    let a = Math.atan2(uy, ux) * 180 / Math.PI; if (a > 90) a -= 180; if (a < -90) a += 180;
    return `<g data-a="${id}" color="#8f88bf"><line x1="${ax}" y1="${ay}" x2="${hx}" y2="${hy}" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>` +
      `<polygon points="${bx},${by} ${hx - uy * 5},${hy + ux * 5} ${hx + uy * 5},${hy - ux * 5}" fill="currentColor"/>` +
      `<text x="${tx}" y="${ty}" transform="rotate(${a.toFixed(1)} ${tx} ${ty})" text-anchor="middle" dominant-baseline="middle" font-size="12.5" fill="currentColor">${txt}</text></g>`;
  };
  const nd = (k, x, y, t) => `<g data-n="${k}"><rect x="${x - 44}" y="${y - 16}" width="88" height="32" rx="10" fill="rgba(255,255,255,.06)" stroke="rgba(255,255,255,.45)" stroke-width="1.5"/>` +
    `<text x="${x}" y="${y + 1}" text-anchor="middle" dominant-baseline="middle" font-size="14" font-weight="700" fill="#fff" letter-spacing="1">${t}</text></g>`;
  const box = document.createElement('div');
  box.innerHTML = `<svg viewBox="0 0 320 240" style="width:100%;max-width:290px;margin:0 auto;display:block;font-family:inherit" role="img" aria-label="Triangle des changements d'état">` +
    // même disposition que le schéma du cours : LIQUIDE en haut, SOLIDE en bas à gauche, GAZ en bas à droite
    fl('fusion', [70, 190], [136, 46], 8, 21, 'fusion') + fl('solidification', [136, 46], [70, 190], -8, -20, 'solidification') +
    fl('vaporisation', [184, 46], [250, 190], 8, 21, 'vaporisation') + fl('condL', [250, 190], [184, 46], -8, -20, 'condensation') +
    fl('sublimation', [98, 206], [222, 206], -8, -20, 'sublimation') + fl('condS', [222, 206], [98, 206], 8, 21, 'condensation') +
    nd('L', 160, 30, 'LIQUIDE') + nd('S', 52, 206, 'SOLIDE') + nd('G', 268, 206, 'GAZ') + '</svg>';
  parent.appendChild(box);
  const fleches = [...box.querySelectorAll('[data-a]')], noeuds = [...box.querySelectorAll('[data-n]')];
  const fond = { S: 'rgba(207,238,255,.3)', L: 'rgba(77,184,255,.35)', G: 'rgba(232,244,255,.22)' };
  let cle = '';
  return {
    set(act, pres) {
      const k = act + pres.S + pres.L + pres.G; if (k === cle) return; cle = k;
      for (const g of fleches) {
        const on = g.dataset.a === act;
        g.setAttribute('color', on ? '#ffe45c' : '#8f88bf');
        g.querySelector('line').setAttribute('stroke-width', on ? 4.5 : 2.5);
        g.querySelector('text').setAttribute('font-weight', on ? 800 : 500);
      }
      for (const n of noeuds) n.querySelector('rect').setAttribute('fill', pres[n.dataset.n] ? fond[n.dataset.n] : 'rgba(255,255,255,.06)');
    },
  };
}

export default function mount(root) {
  const { stageEl, panelEl, explainEl } = layout(root);
  const st = createStage(stageEl, { camera: { pos: [0.25, 1.75, 4.9], target: [0.2, 1.2, 0], fov: 42 }, maxDistance: 10 });
  const scene = st.scene, ex = explain(explainEl), q = new URLSearchParams(location.search);

  // ---------- décor : sol, plaque (chauffe / refroidit), enceinte de verre ----------
  const sol = ground(4.4); sol.position.y = -0.1; scene.add(sol);
  const plaqueMat = new THREE.MeshStandardMaterial({ color: 0x2b2840, roughness: 0.55, metalness: 0.3 });
  const plaque = new THREE.Mesh(new THREE.BoxGeometry(W + 0.36, 0.1, D + 0.36), plaqueMat);
  plaque.position.y = -0.05; scene.add(plaque);
  const boiteG = new THREE.BoxGeometry(W, H, D);
  const boite = new THREE.Mesh(boiteG, glassMaterial({ opacity: 0.1 })); boite.position.y = H / 2; scene.add(boite);
  const aretes = new THREE.LineSegments(new THREE.EdgesGeometry(boiteG), new THREE.LineBasicMaterial({ color: C.verre, transparent: true, opacity: 0.5 }));
  aretes.position.y = H / 2; scene.add(aretes);

  // ---------- thermomètre (repères 0 °C et 100 °C) ----------
  const TX = W / 2 + 0.32, yT = (T) => 0.36 + (clamp(T, -30, 130) + 30) / 160 * 1.8;
  const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 2.05, 16, 1, true), glassMaterial({ opacity: 0.3 }));
  tube.position.set(TX, 1.27, 0); scene.add(tube);
  const alcool = new THREE.MeshStandardMaterial({ color: C.froid, emissive: C.froid, emissiveIntensity: 0.35 });
  const bulbe = new THREE.Mesh(new THREE.SphereGeometry(0.085, 16, 12), alcool); bulbe.position.set(TX, 0.25, 0); scene.add(bulbe);
  const colG = new THREE.CylinderGeometry(0.022, 0.022, 1, 10); colG.translate(0, 0.5, 0);
  const colonne = new THREE.Mesh(colG, alcool); colonne.position.set(TX, 0.25, 0); scene.add(colonne);
  for (const T of [0, 100]) {
    const tick = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.01, 0.01), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    tick.position.set(TX, yT(T), 0); scene.add(tick);
    st.label(T + ' °C', new THREE.Vector3(TX, yT(T), 0), { offset: [0.3, 0, 0], cls: 'discret' });
  }
  const lblT = st.label('', new THREE.Vector3(TX, 2.44, 0), { cls: 'fluo' });

  // ---------- molécules : une sphère + une petite queue dont la longueur montre l'agitation ----------
  const mol = molecules(N, { radius: R, color: C.glace, segments: 14 }); scene.add(mol.mesh);
  const queues = new THREE.InstancedMesh(new THREE.ConeGeometry(R * 0.62, 1, 7), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.55, depthWrite: false }), N);
  queues.frustumCulled = false; queues.setColorAt(0, new THREE.Color()); scene.add(queues);
  const ph = new Uint8Array(N), site = new Int16Array(N).fill(-1);
  const P = new Float32Array(N * 3), V = new Float32Array(N * 3), SV = new Float32Array(N * 3), RP = new Float32Array(N * 3);
  const vib = Array.from({ length: N }, () => [rand(14, 24), rand(14, 24), rand(14, 24), rand(7), rand(7), rand(7)]);

  // Sites de la glace (réseau rangé). rangFonte : petit = au bord (fond en premier) ; rangGivre : couche du bas d'abord.
  const SX = new Float32Array(N), SY = new Float32Array(N), SZ = new Float32Array(N), occ = new Int16Array(N).fill(-1);
  const rangFonte = new Float32Array(N), rangGivre = new Float32Array(N);
  for (let ix = 0, k = 0; ix < NX; ix++) for (let iy = 0; iy < NY; iy++) for (let iz = 0; iz < NZ; iz++, k++) {
    SX[k] = (ix - (NX - 1) / 2) * S; SY[k] = R + iy * S; SZ[k] = (iz - (NZ - 1) / 2) * S;
    rangFonte[k] = Math.min(ix, NX - 1 - ix, NY - 1 - iy) + 0.5 * Math.min(iz, NZ - 1 - iz) + rand(0.45);
    rangGivre[k] = iy + Math.abs(ix - (NX - 1) / 2) * 0.05 + rand(0.3);
  }
  let latY = 0;                                   // le réseau monte sur le bloc réfrigérant (givre)
  const setV = (i, x, y, z) => { V[i * 3] = x; V[i * 3 + 1] = y; V[i * 3 + 2] = z; };
  function prendreSite(i, k) { site[i] = k; occ[k] = i; ph[i] = SOL; setV(i, 0, 0, 0); }
  function libererSite(i) { if (site[i] >= 0) { occ[site[i]] = -1; site[i] = -1; } }
  function toutSolide() { occ.fill(-1); for (let i = 0; i < N; i++) { prendreSite(i, i); P[i * 3] = SX[i]; P[i * 3 + 1] = latY + SY[i]; P[i * 3 + 2] = SZ[i]; } }
  toutSolide();

  // Bulles (ébullition) : elles naissent au fond, grossissent, montent et éclatent à la surface.
  const bulleMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x9fd4ff, emissiveIntensity: 0.35, transparent: true, opacity: 0.38, roughness: 0.1, depthWrite: false });
  const bulleG = new THREE.SphereGeometry(1, 18, 12);
  const bulles = Array.from({ length: 12 }, () => { const m = new THREE.Mesh(bulleG, bulleMat); m.visible = false; scene.add(m); return { on: false, x: 0, y: 0, z: 0, r: 0, t: 0, mols: [], m }; });

  // Matériel des deux expériences du cours
  const tige = new THREE.Group();
  const tigeMat = new THREE.MeshStandardMaterial({ color: 0xb8bcc8, metalness: 0.6, roughness: 0.35, transparent: true, opacity: 0 });
  const boutMat = new THREE.MeshStandardMaterial({ color: C.chaud, emissive: C.chaud, emissiveIntensity: 1.2, transparent: true, opacity: 0 });
  const t1 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.5, 12), boutMat); t1.position.y = 0.25;
  const t2 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.1, 12), tigeMat); t2.position.y = 1.05;
  tige.add(t1, t2); tige.position.set(0.05, 2.45, 0); tige.visible = false; scene.add(tige);
  const blocMat = new THREE.MeshStandardMaterial({ color: C.froid, emissive: C.froid, emissiveIntensity: 0.3, roughness: 0.4, transparent: true, opacity: 0 });
  const bloc = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.16, 0.5), blocMat); bloc.position.y = 0.08; bloc.visible = false; scene.add(bloc);

  // ---------- étiquettes ----------
  const lblPhen = st.label('', new THREE.Vector3(0, H + 0.24, 0), { cls: 'fluo' });
  const pS = new THREE.Vector3(), pL = new THREE.Vector3(), pG = new THREE.Vector3(X0 + 0.34, H - 0.22, D / 2);
  const lblS = st.label('état solide', pS), lblL = st.label('état liquide', pL), lblG = st.label('état gazeux', pG);
  const lblPlaque = st.label('', new THREE.Vector3(0, -0.05, D / 2 + 0.18));
  const lblTige = st.label('tige chaude<br>(cuillère à combustion)', tige, { offset: [-0.58, 0.85, 0], cls: 'chaud' });
  const lblBloc = st.label('bloc réfrigérant (sorti du congélateur)', bloc, { offset: [0, -0.24, 0.3], cls: 'froid' });
  const lblGivre = st.label('givre', new THREE.Vector3(0.78, 0.42, D / 2), { cls: 'fluo' });

  // ---------- état du modèle ----------
  let E = 4, cible = 4, Tv = 100, mode = 'ebullition', auto = 0, budget = 0, tps = 0, touche = false, rate = 0;
  let T = -18, Taff = -18, Tsol = -18, Tliq = -18, Tgaz = -18, tS = N, tL = 0, tG = 0, nS = N, nL = 0, nG = 0, haut = R;
  let scen = null, fade = null, fadeS = 1;
  const derniere = {};
  const vl = () => 0.42 + 0.35 * clamp(Tliq / 100, 0, 1);              // agitation du liquide
  const vg = () => 0.95 + 0.55 * clamp((Tgaz + 30) / 160, 0, 1);     // vitesse des molécules du gaz
  const note = (type) => { derniere[type] = tps; };
  const d2 = (i, x, y, z) => (P[i * 3] - x) ** 2 + (P[i * 3 + 1] - y) ** 2 + (P[i * 3 + 2] - z) ** 2;

  function siteAFondre(pt) {     // site occupé le plus au bord (ou le plus proche de la pointe de la tige)
    let best = -1, bv = 1e9;
    for (let k = 0; k < N; k++) {
      if (occ[k] < 0) continue;
      const v = pt ? (SX[k] - pt.x) ** 2 + (latY + SY[k] - pt.y) ** 2 + (SZ[k] - pt.z) ** 2 : rangFonte[k];
      if (v < bv) { bv = v; best = k; }
    }
    return best;
  }
  function siteARemplir() {      // site libre : le cœur d'abord (la couche du bas pour le givre)
    let best = -1, bv = -1e9;
    for (let k = 0; k < N; k++) {
      if (occ[k] >= 0) continue;
      const v = scen && scen.type === 'givre' ? -rangGivre[k] : rangFonte[k];
      if (v > bv) { bv = v; best = k; }
    }
    return best;
  }
  function plusProche(phase, x, y, z, max = 99) {
    let best = -1, bv = max * max;
    for (let i = 0; i < N; i++) if (ph[i] === phase) { const v = d2(i, x, y, z); if (v < bv) { bv = v; best = i; } }
    return best;
  }
  function extreme(phase, signe, bruit) {   // molécule la plus haute (signe 1) ou la plus basse (signe −1)
    let best = -1, bv = -1e9;
    for (let i = 0; i < N; i++) if (ph[i] === phase) { const v = signe * P[i * 3 + 1] + rand(bruit); if (v > bv) { bv = v; best = i; } }
    return best;
  }

  // ---------- les six changements d'état ----------
  function fusion() { const k = siteAFondre(); if (k < 0) return false; const i = occ[k]; libererSite(i); ph[i] = LIQ; setV(i, rand(-0.1, 0.1), 0, rand(-0.1, 0.1)); note('fusion'); return true; }
  function sublimer(pt) {
    const k = siteAFondre(pt); if (k < 0) return false; const i = occ[k]; libererSite(i); ph[i] = GAZ;
    const v = vg() * 1.3; setV(i, rand(-0.6, 0.6) * v, v, rand(-0.4, 0.4) * v); note('sublimation'); return true;
  }
  function vaporiser() {
    if (mode === 'ebullition') {                 // au sein même du liquide : une bulle naît au fond
      const i = extreme(LIQ, -1, 0.12); if (i < 0) return false;
      let b = bulles.find((b) => b.on && b.t < 0.25 && b.mols.length < 4);
      if (!b) {
        b = bulles.find((b) => !b.on); if (!b) return false;
        Object.assign(b, { on: true, t: 0, x: clamp(P[i * 3], X0 + 0.15, X1 - 0.15), y: R + 0.04, z: rand(-0.1, 0.1), r: 0.04 }); b.mols.length = 0;
      }
      b.mols.push(i); ph[i] = BUL;
    } else {                                     // à la surface libre : la molécule la plus haute s'échappe
      const i = extreme(LIQ, 1, 0.05); if (i < 0) return false;
      ph[i] = GAZ; const v = new THREE.Vector3(gauss(), Math.abs(gauss()) + 0.8, gauss()).setLength(vg()); setV(i, v.x, v.y, v.z);
    }
    note('vaporisation'); return true;
  }
  function solidifier() { const k = siteARemplir(); if (k < 0) return false; const i = plusProche(LIQ, SX[k], latY + SY[k], SZ[k]); if (i < 0) return false; prendreSite(i, k); note('solidification'); return true; }
  function condenserL() {
    let i = extreme(GAZ, -1, 0.3);
    if (i < 0) { const b = bulles.find((b) => b.on && b.mols.length); if (!b) return false; i = b.mols.pop(); }
    ph[i] = LIQ; setV(i, V[i * 3] * 0.3, 0, V[i * 3 + 2] * 0.3); note('condL'); return true;
  }
  function condenserS(max) { const k = siteARemplir(); if (k < 0) return false; const i = plusProche(GAZ, SX[k], latY + SY[k], SZ[k], max); if (i < 0) return false; prendreSite(i, k); note('condS'); return true; }
  function convertir() {          // un pas vers les parts visées, toujours par le changement d'état qui convient
    const dS = nS - tS, dL = nL - tL, dG = nG - tG; let ok = false;
    if (dS > 0) ok = dL < 0 ? fusion() : dG < 0 && sublimer();
    else if (dL > 0) ok = dG < 0 ? vaporiser() : dS < 0 && solidifier();
    else if (dG > 0) ok = dL < 0 ? condenserL() : dS < 0 && condenserS();
    if (ok) compter();
    return ok;
  }
  function compter() { nS = nL = nG = 0; for (let i = 0; i < N; i++) { if (ph[i] === SOL) nS++; else if (ph[i] === LIQ) nL++; else nG++; } }

  // ---------- physique des molécules (liquide et gaz) ----------
  const CELL = 0.17, GX = Math.ceil(W / CELL), GY = Math.ceil(H / CELL), GZ = Math.ceil(D / CELL);
  const head = new Int16Array(GX * GY * GZ), nxt = new Int16Array(N), ys = new Float32Array(N), surGlace = new Uint8Array(N);
  const cx = (x) => clamp(Math.floor((x + W / 2) / CELL), 0, GX - 1), cy = (y) => clamp(Math.floor(y / CELL), 0, GY - 1), cz = (z) => clamp(Math.floor((z + D / 2) / CELL), 0, GZ - 1);
  function pas(h, blocOn) {
    head.fill(-1); surGlace.fill(0);
    for (let i = 0; i < N; i++) { if (ph[i] === BUL) continue; const c = (cx(P[i * 3]) * GY + cy(P[i * 3 + 1])) * GZ + cz(P[i * 3 + 2]); nxt[i] = head[c]; head[c] = i; }
    for (let i = 0; i < N; i++) {
      const pi = ph[i]; if (pi === BUL) continue;
      const xi = P[i * 3], yi = P[i * 3 + 1], zi = P[i * 3 + 2], gx = cx(xi), gy = cy(yi), gz = cz(zi);
      for (let a = Math.max(0, gx - 1); a <= Math.min(GX - 1, gx + 1); a++) for (let b = Math.max(0, gy - 1); b <= Math.min(GY - 1, gy + 1); b++) for (let c = Math.max(0, gz - 1); c <= Math.min(GZ - 1, gz + 1); c++) {
        for (let j = head[(a * GY + b) * GZ + c]; j >= 0; j = nxt[j]) {
          if (j <= i) continue; const pj = ph[j]; if (pi === SOL && pj === SOL) continue;
          const dx = P[j * 3] - xi, dy = P[j * 3 + 1] - yi, dz = P[j * 3 + 2] - zi, dd = dx * dx + dy * dy + dz * dz;
          if (dd > 0.0289 || dd < 1e-10) continue;
          const d = Math.sqrt(dd), gaz = pi === GAZ || pj === GAZ, r0 = gaz ? 0.1 : 0.112;
          let f;
          if (d < r0) f = -700 * (r0 - d);                    // répulsion : deux molécules ne se traversent pas
          else if (pi === LIQ && pj === LIQ && d < 0.165) f = 6 * (d - r0);    // le liquide reste groupé
          else continue;
          if (pi === LIQ && pj === SOL && dy < -0.02) surGlace[i] = 1; else if (pj === LIQ && pi === SOL && dy > 0.02) surGlace[j] = 1;
          f *= h / d;
          if (pi !== SOL) { V[i * 3] += dx * f; V[i * 3 + 1] += dy * f; V[i * 3 + 2] += dz * f; }
          if (pj !== SOL) { V[j * 3] -= dx * f; V[j * 3 + 1] -= dy * f; V[j * 3 + 2] -= dz * f; }
        }
      }
    }
    const kSite = 1 - Math.exp(-7 * h), vL = vl(), vG = vg(), kick = Math.sqrt(3 * h) * vL * 0.58, jit = vG * 1.4 * Math.sqrt(h);
    for (let i = 0; i < N; i++) {
      const p = ph[i], o = i * 3;
      if (p === SOL) { const k = site[i]; P[o] += (SX[k] - P[o]) * kSite; P[o + 1] += (latY + SY[k] - P[o + 1]) * kSite; P[o + 2] += (SZ[k] - P[o + 2]) * kSite; continue; }
      if (p === BUL) continue;
      if (p === LIQ) {            // pesanteur + agitation au hasard (les molécules roulent les unes sur les autres)
        V[o + 1] -= 9 * h; const dmp = 1 - 1.5 * h;
        if (surGlace[i]) { V[o] += Math.sign(P[o] || 1) * 3 * h; V[o + 2] += Math.sign(P[o + 2] || 1) * 1.5 * h; }   // l'eau de fonte coule sur les bords de la glace
        V[o] = V[o] * dmp + gauss() * kick; V[o + 1] = V[o + 1] * dmp + gauss() * kick; V[o + 2] = V[o + 2] * dmp + gauss() * kick;
      } else {                    // gaz : vitesse ramenée vers celle que donne la température
        V[o] += gauss() * jit; V[o + 1] += gauss() * jit; V[o + 2] += gauss() * jit;   // chocs : la direction change sans cesse
        const sp = Math.hypot(V[o], V[o + 1], V[o + 2]) || 1e-3, k = 1 + (vG / sp - 1) * Math.min(1, 2 * h);
        V[o] *= k; V[o + 1] *= k; V[o + 2] *= k;
      }
      P[o] += V[o] * h; P[o + 1] += V[o + 1] * h; P[o + 2] += V[o + 2] * h;
      const e = p === GAZ ? 1 : 0.3;
      if (P[o] < X0) { P[o] = X0; V[o] = Math.abs(V[o]) * e; } else if (P[o] > X1) { P[o] = X1; V[o] = -Math.abs(V[o]) * e; }
      if (P[o + 1] < R) { P[o + 1] = R; V[o + 1] = Math.abs(V[o + 1]) * e; } else if (P[o + 1] > Y1) { P[o + 1] = Y1; V[o + 1] = -Math.abs(V[o + 1]) * e; }
      if (P[o + 2] < Z0) { P[o + 2] = Z0; V[o + 2] = Math.abs(V[o + 2]) * e; } else if (P[o + 2] > Z1) { P[o + 2] = Z1; V[o + 2] = -Math.abs(V[o + 2]) * e; }
      if (blocOn && Math.abs(P[o]) < 0.55 + R && Math.abs(P[o + 2]) < 0.25 + R && P[o + 1] < 0.16 + R) { P[o + 1] = 0.16 + R; V[o + 1] = Math.abs(V[o + 1]); }
    }
  }
  function majBulles(dt) {
    for (const b of bulles) {
      if (!b.on) continue;
      b.t += dt; b.r = Math.min(0.12, 0.045 + 0.12 * b.t + 0.012 * b.mols.length);
      if (b.t > 0.18) b.y += (0.35 + 1.6 * (b.t - 0.18)) * dt;
      b.y = Math.max(b.y, R + b.r * 0.6);
      b.mols.forEach((i, n) => { const a = tps * 9 + n * 2.1; P[i * 3] = b.x + Math.cos(a) * b.r * 0.35; P[i * 3 + 1] = b.y + Math.sin(a * 1.3) * b.r * 0.3; P[i * 3 + 2] = b.z + Math.sin(a) * b.r * 0.35; });
      if (!b.mols.length) b.on = false;
      else if (b.y + b.r * 0.2 >= haut || b.t > 2.5) {           // la bulle éclate : ses molécules partent en gaz
        for (const i of b.mols) { ph[i] = GAZ; setV(i, rand(-0.4, 0.4), vg(), rand(-0.3, 0.3)); }
        b.mols.length = 0; b.on = false;
      }
      if (b.on) for (let i = 0; i < N; i++) {                   // la bulle écarte le liquide autour d'elle
        if (ph[i] !== LIQ) continue; const o = i * 3, dx = P[o] - b.x, dy = P[o + 1] - b.y, dz = P[o + 2] - b.z, dd = dx * dx + dy * dy + dz * dz, rr = b.r + R * 0.9;
        if (dd < rr * rr && dd > 1e-8) { const k = rr / Math.sqrt(dd); P[o] = b.x + dx * k; P[o + 1] = b.y + dy * k; P[o + 2] = b.z + dz * k; }
      }
      b.m.visible = b.on; b.m.position.set(b.x, b.y, b.z); b.m.scale.setScalar(b.r);
    }
  }
  function niveau() { let n = 0; for (let i = 0; i < N; i++) if (ph[i] === LIQ) ys[n++] = P[i * 3 + 1]; if (!n) return R; const a = ys.subarray(0, n).sort(); return a[Math.floor((n - 1) * 0.9)] + R; }

  // ---------- les deux expériences du cours ----------
  function fondu(fn) { fade = { t: 0, fn, fait: false }; }
  function lancer(type) {
    setAuto(0); touche = true;
    scen = { type, t: 0, pret: false, fin: false, n: 0, acc: 0 };
    for (const b of bulles) { b.on = false; b.mols.length = 0; b.m.visible = false; }
    fondu(() => {
      if (type === 'subli') { latY = 0; toutSolide(); sl.set(4); E = cible = 4; tige.position.y = 2.45; }
      else {
        latY = 0.16; occ.fill(-1);
        for (let i = 0; i < N; i++) { site[i] = -1; ph[i] = GAZ; P[i * 3] = rand(X0, X1); P[i * 3 + 1] = rand(0.3, Y1); P[i * 3 + 2] = rand(Z0, Z1); const v = new THREE.Vector3(gauss(), gauss(), gauss()).setLength(1.1); setV(i, v.x, v.y, v.z); }
      }
      compter(); scen.pret = true;
    });
  }
  function quitter() { if (!scen) return; scen = null; E = cible; }
  function scenario(dt) {
    const s = scen; if (!s.pret) return; s.t += dt;
    if (s.type === 'subli') {
      Tsol = -18; Tliq = 0; Tgaz = 60; T = -18;
      const tip = tige.position;
      if (!s.fin) {
        const k = siteAFondre(tip), dk = k < 0 ? 9 : Math.hypot(SX[k] - tip.x, SY[k] - tip.y, SZ[k] - tip.z);
        if (dk > 0.13) tip.y = Math.max(0.3, tip.y - 0.55 * dt);
        else { s.acc += dt * 14; while (s.acc >= 1) { s.acc -= 1; if (sublimer(tip)) s.n++; } compter(); }
        if (s.n >= 36 || tip.y <= 0.3) s.fin = true;
      } else if (tip.y < 3.2) tip.y += 0.6 * dt;
    } else {
      Tsol = -18; Tliq = 0; Tgaz = 20; T = 20;
      if (!s.fin && s.t > 0.8) { s.acc += dt * 16; while (s.acc >= 1) { s.acc -= 1; if (condenserS(0.9)) s.n++; } compter(); if (s.n >= 96) s.fin = true; }
    }
  }

  // ---------- réglages ----------
  const ui = panel(panelEl);
  ui.title("Chauffe ou refroidis l'eau");
  const mots = (v) => (v < 1 ? 'aucune' : v < 25 ? 'un peu' : v < 55 ? 'moyenne' : v < 85 ? 'beaucoup' : 'énormément');
  const sl = ui.slider({ label: "Chaleur reçue par l'eau", min: 0, max: 100, step: 'any', value: 4, format: mots, onInput: (v) => { cible = v; quitter(); setAuto(0); touche = true; } });
  const [bC, bR] = ui.buttons([{ label: 'Chauffer', primary: true, onClick: () => { quitter(); setAuto(auto === 1 ? 0 : 1); } }, { label: 'Refroidir', onClick: () => { quitter(); setAuto(auto === -1 ? 0 : -1); } }]);
  function setAuto(a) {
    auto = a; if (a) touche = true;
    bC.textContent = a === 1 ? 'Pause' : 'Chauffer'; bR.textContent = a === -1 ? 'Pause' : 'Refroidir';
    bC.classList.toggle('on', a === 1); bR.classList.toggle('on', a === -1);
  }
  const roT = ui.readout('Température'), roE = ui.readout("État de l'eau");
  const tri = triangle(panelEl);
  const choix = ui.choice({ label: 'La vaporisation se fait par…', options: [{ value: 'ebullition', label: 'ébullition' }, { value: 'evaporation', label: 'évaporation' }], value: 'ebullition',
    onChange: (v) => { mode = v; Tv = v === 'ebullition' ? 100 : 20; quitter(); touche = true; } });
  ui.note('Deux expériences du cours :');
  ui.buttons([{ label: 'Sublimation', onClick: () => lancer('subli') }, { label: 'Givre', onClick: () => lancer('givre') }]);
  ui.note(`<b>À retenir</b> : les changements d'état sont des <b style="color:#ffe45c">phénomènes réversibles</b>. Liquides et gaz (molécules qui se déplacent) sont des <b style="color:#ffe45c">fluides</b>.`);

  // Paramètres d'essai (banc d'essai) : ?e=60 (chaleur), &mode=evaporation, &scen=subli|givre
  if (q.get('mode') === 'evaporation') { choix.set('evaporation'); mode = 'evaporation'; Tv = 20; }
  if (q.get('e')) {
    sl.set(clamp(+q.get('e'), 0, 100)); E = cible = sl.value; touche = true;
    const e = etatDe(E, Tv); tS = Math.round(e.fS * N); tG = Math.round(e.fG * N); tL = N - tS - tG;
    const m = mode; mode = 'evaporation'; for (let k = 0; k < 2000 && convertir(); k++); mode = m;
  }
  if (q.get('scen')) lancer(q.get('scen') === 'givre' ? 'givre' : 'subli');
  if (q.get('auto')) setAuto(+q.get('auto') > 0 ? 1 : -1);

  // Cadrage selon la forme de la scène (tant que l'élève n'a pas tourné la vue)
  let bouge = false, asp0 = 0;
  if (st.controls) st.controls.addEventListener('start', () => { bouge = true; });
  function cadrer() {
    const { w, h } = st.size(), a = w / h; if (bouge || !st.controls || Math.abs(a - asp0) < 0.01) return; asp0 = a;
    const tgt = new THREE.Vector3(0.33, 1.35, 0), dir = new THREE.Vector3(0.05, 0.1, 1).normalize();
    st.camera.position.copy(tgt).addScaledVector(dir, Math.max(4.7, 4.0 / a)); st.controls.target.copy(tgt); st.controls.update();
  }

  // ---------- boucle ----------
  const m4 = new THREE.Matrix4(), qt = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0), dir = new THREE.Vector3(), pos = new THREE.Vector3(), sc = new THREE.Vector3();
  const cS = new THREE.Color(), cL = new THREE.Color(), cG = new THREE.Color(), cTmp = new THREE.Color();
  let txtT = '', txtE = '', txtPh = '', txtPl = '';
  function image(dt) {
    tps += dt; const t = tps; cadrer();
    if (fade) {
      fade.t += dt; if (!fade.fait && fade.t >= 0.25) { fade.fn(); fade.fait = true; }
      fadeS = fade.t < 0.25 ? 1 - fade.t / 0.25 : Math.min(1, (fade.t - 0.25) / 0.35); if (fade.t >= 0.6) { fade = null; fadeS = 1; }
    }
    if (auto) { cible = clamp(cible + auto * 5 * dt, 0, 100); sl.set(cible); if (cible <= 0 || cible >= 100) setAuto(0); }
    if (!scen) {
      // l'énergie n'avance que si les molécules suivent : la température reste sur le palier tant que le changement d'état n'est pas fini
      const E0 = E; if (Math.abs(nS - tS) + Math.abs(nG - tG) < 10) E += clamp(cible - E, -12 * dt, 12 * dt);
      rate = lerp(rate, clamp((cible - E0) / dt, -12, 12), 0.1);
      const e = etatDe(E, Tv); T = Tsol = Tliq = Tgaz = e.T;
      tS = Math.round(e.fS * N); tG = Math.round(e.fG * N); tL = N - tS - tG;
      budget = Math.min(budget + dt * 160, 5); while (budget >= 1 && convertir()) budget -= 1;
    } else { rate = lerp(rate, 0, 0.1); scenario(dt); }
    latY += ((scen && scen.type === 'givre' ? 0.16 : 0) - latY) * (1 - Math.exp(-3 * dt));
    haut = niveau();
    const blocOn = blocMat.opacity > 0.5;
    for (let s = 0; s < 3; s++) pas(dt / 3, blocOn);
    majBulles(dt); compter();
    Taff += (T - Taff) * (1 - Math.exp(-6 * dt));

    // matériel des expériences : apparaît / disparaît en douceur
    const tigeOn = scen && scen.type === 'subli' && scen.pret && tige.position.y < 3.1, blocVis = scen && scen.type === 'givre' && scen.pret;
    tigeMat.opacity = boutMat.opacity = clamp(tigeMat.opacity + (tigeOn ? 3 : -3) * dt, 0, 1); tige.visible = tigeMat.opacity > 0.01;
    blocMat.opacity = clamp(blocMat.opacity + (blocVis ? 3 : -2) * dt, 0, 1); bloc.visible = blocMat.opacity > 0.01;
    // plaque : orange quand on chauffe, bleue quand on refroidit
    const chauffe = rate > 0.3, froid = rate < -0.3;
    plaqueMat.emissive.set(chauffe ? C.chaud : froid ? C.froid : 0x000000); plaqueMat.emissiveIntensity = clamp(Math.abs(rate) / 8, 0.3, 1);

    // dessin des molécules et de leurs queues
    const aS = clamp((Tsol + 30) / 30, 0, 1), amp = 0.004 + 0.014 * aS, ivd = 1 / Math.max(dt, 1e-3);
    tempColor((Tsol + 30) / 160, cS); tempColor((Tliq + 30) / 160, cL); tempColor((Tgaz + 30) / 160, cG);
    const lS = 0.02 + 0.025 * aS, lL = 0.045 + 0.075 * clamp(Tliq / 100, 0, 1), lG = 0.13 + 0.09 * clamp((Tgaz + 30) / 160, 0, 1);
    for (let i = 0; i < N; i++) {
      const o = i * 3, p = ph[i]; let x = P[o], y = P[o + 1], z = P[o + 2];
      if (p === SOL) { const w = vib[i]; x += Math.sin(w[0] * t + w[3]) * amp; y += Math.sin(w[1] * t + w[4]) * amp; z += Math.sin(w[2] * t + w[5]) * amp; }
      SV[o] = lerp(SV[o], (x - RP[o]) * ivd, 0.18); SV[o + 1] = lerp(SV[o + 1], (y - RP[o + 1]) * ivd, 0.18); SV[o + 2] = lerp(SV[o + 2], (z - RP[o + 2]) * ivd, 0.18);
      RP[o] = x; RP[o + 1] = y; RP[o + 2] = z;
      const col = p === SOL ? cS : p === LIQ ? cL : cG, L = p === SOL ? lS : p === LIQ ? lL : lG;
      mol.setPos(i, x, y, z, fadeS); mol.setColor(i, col);
      dir.set(-SV[o], -SV[o + 1], -SV[o + 2]); const n = dir.length(); if (n < 1e-4) dir.set(0, -1, 0); else dir.multiplyScalar(1 / n);
      qt.setFromUnitVectors(up, dir); pos.set(x + dir.x * (R * 0.4 + L / 2), y + dir.y * (R * 0.4 + L / 2), z + dir.z * (R * 0.4 + L / 2));
      sc.set(fadeS, L * fadeS, fadeS); m4.compose(pos, qt, sc); queues.setMatrixAt(i, m4); queues.setColorAt(i, cTmp.copy(col).multiplyScalar(0.9));
    }
    mol.commit(); queues.instanceMatrix.needsUpdate = true; queues.instanceColor.needsUpdate = true;

    // thermomètre
    const Th = scen ? T : Taff; colonne.scale.y = yT(Th) - 0.25; tempColor((Th + 30) / 160, alcool.color); alcool.emissive.copy(alcool.color);
    const tt = fmt(Th) + ' °C'; if (tt !== txtT) { txtT = tt; lblT.set(tt); }

    // changement d'état en cours (dernière conversion il y a moins de 0,7 s)
    let act = '', best = -1; for (const k in derniere) if (derniere[k] > best) { best = derniere[k]; act = k; }
    if (tps - best > 0.7) act = '';
    const pres = { S: nS > 0, L: nL > 0, G: nG > 0 };
    tri.set(act, pres);
    const ph2 = act ? NOMS[act] + (act === 'vaporisation' ? (mode === 'ebullition' ? ' (ébullition)' : ' (évaporation)') : '') : '';
    if (ph2 !== txtPh) { txtPh = ph2; lblPhen.set(ph2); } lblPhen.show(!!act);
    const pl = chauffe ? 'on chauffe' : froid ? 'on refroidit' : '';
    if (pl !== txtPl) { txtPl = pl; lblPlaque.set(pl); lblPlaque.el.className = 'sim-label ' + (chauffe ? 'chaud' : 'froid'); } lblPlaque.show(!!pl && !scen);
    // étiquettes des états
    let sx = 0, sy = 0; for (let i = 0; i < N; i++) if (ph[i] === SOL) { sx += P[i * 3]; sy = Math.max(sy, P[i * 3 + 1]); }
    pS.set(scen && scen.type === 'subli' ? -0.36 : nS ? sx / nS : 0, sy + 0.17, D / 2); pL.set(X1 - 0.3, haut + 0.13, D / 2);
    lblS.show(nS > 8); lblL.show(nL > 8); lblG.show(nG > 8);
    lblTige.show(tige.visible && tigeMat.opacity > 0.5 && !!scen && !scen.fin); lblBloc.show(bloc.visible && blocMat.opacity > 0.5);
    lblGivre.show(!!(scen && scen.type === 'givre' && scen.n > 12));
    // panneau
    const te = scen ? (scen.type === 'subli' ? '−18 °C (glaçon)' : 'air 20 °C · bloc très froid') : fmt(Taff) + ' °C';
    const etat = [pres.S && 'solide', pres.L && 'liquide', pres.G && 'gazeux'].filter(Boolean).join(' + ');
    if (te + etat !== txtE) { txtE = te + etat; roT.set(te); roE.set(etat); }
    // explication
    let k;
    if (scen) k = scen.type === 'subli' ? (scen.fin ? 'subliFin' : act === 'sublimation' ? 'sublimation' : 'subliDebut') : (scen.fin ? 'givreFin' : act === 'condS' ? 'givre' : 'givreDebut');
    else if (act === 'vaporisation') k = mode === 'ebullition' ? 'ebullition' : 'evaporation';
    else if (act) k = act;
    else if (nS === N) k = touche ? 'solide' : 'debut';
    else if (nL === N) k = chauffe ? 'liquideChauffe' : 'liquide';
    else if (nG === N) k = 'gaz';
    else if (nS && nL && !nG) k = 'palierFusion';
    else if (nL && nG && !nS) k = mode === 'ebullition' ? 'palierEbu' : 'palierEvap';
    else k = 'melange';
    ex.set(TXT[k]);
  }
  st.onFrame(image);
  for (let k = 0; k < (+q.get('ff') || 0) * 60; k++) image(1 / 60);   // essai : avance rapide de ff secondes

  return { dispose() { st.dispose(); } };
}
