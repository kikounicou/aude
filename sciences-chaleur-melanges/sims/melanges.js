// melanges.js — « Homogène ou hétérogène ? » (cours, thème 6, p. 1)
// Guidé en 5 étapes : 1 choisir ce qu'on ajoute à l'eau du tube à essai → 2 agiter → 3 prédire → 4 laisser reposer → 5 conclure
// (et regarder à la loupe). Les étapes faites restent manipulables ; « Autre mélange » relance le parcours.
import { THREE, C, layout, createStage, panel, explain, glassMaterial, liquidMaterial, ground, molecules, clamp, lerp, rand, messageSousScene } from './kit.js';

// ---------- Guidage par étapes : composant local, IDENTIQUE dans melanges, separations, distillation et dissolution
// (candidat pour kit.js). Chaque étape est un bloc numéroté qui porte ses commandes : l'étape en cours est surlignée et sa
// commande principale clignote doucement, les étapes faites sont cochées (et restent manipulables), les suivantes sont
// grisées ; si on touche une commande grisée, elle dit pourquoi et l'étape en cours s'allume. ----------
const GX_CSS = `
.gx-etapes{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}
.gx-e{border:1.5px solid rgba(255,255,255,.13);border-radius:14px;padding:9px 10px 10px;display:flex;flex-direction:column;gap:9px;transition:border-color .25s,background-color .25s}
.gx-t{display:flex;align-items:center;gap:9px;font:600 14.5px/1.25 var(--texte);color:#cfc8ff}
.gx-n{flex:none;display:inline-grid;place-items:center;width:26px;height:26px;border-radius:50%;border:1.5px solid rgba(255,255,255,.4);font:800 13px/1 var(--texte);color:#fff}
.gx-c{display:flex;flex-direction:column;gap:10px}.gx-c:empty{display:none}
.gx-info{margin:0;font-size:14px;line-height:1.4;color:#f4f1ff}.gx-info:empty{display:none}.gx-info mark{color:var(--encre)}
.gx-pq{margin:0;font-size:13px;line-height:1.35;color:#b9b1e6;display:none}
.gx-e.cur{border-color:var(--fluo);background:rgba(255,228,92,.07)}
.gx-e.cur .gx-n{background:var(--fluo);border-color:var(--fluo);color:var(--encre)}
.gx-e.cur .gx-t{color:#fff;font-weight:700}
.gx-e.fait .gx-n{border-color:var(--fluo);color:var(--fluo)}
.gx-e.verrou .gx-t{color:#8f88bf}.gx-e.verrou .gx-n{border-style:dashed;border-color:#6f6a9a;color:#8f88bf}
.gx-e.verrou .gx-c{opacity:.42;filter:saturate(.3)}
.gx-e.verrou:not(.suite):not(.dit) .gx-c,.gx-e.fait .gx-c:not(:has(button:enabled,input:enabled)){display:none}
.gx-e.verrou.suite .gx-pq,.gx-e.verrou.dit .gx-pq{display:block}.gx-e.dit .gx-pq{color:#fff;font-weight:700}
.gx-e.appel{animation:gx-appel .9s ease-out}@keyframes gx-appel{25%{box-shadow:0 0 0 6px rgba(255,228,92,.45)}}
.gx-go{animation:gx-go 1.7s ease-in-out infinite}.gx-go:disabled{animation:none}.sim-seg button.gx-go{border-color:var(--fluo)}.sim-slider.gx-go{border-radius:12px}
@keyframes gx-go{50%{box-shadow:0 0 0 6px rgba(255,228,92,.3)}}
.gx-fin{font-weight:700;color:var(--fluo)}
`;
function gxStyle() {      // injecté une fois, retiré au dernier dispose() (plusieurs expériences peuvent partager la page)
  let s = document.getElementById('gx-style');
  if (!s) { s = document.createElement('style'); s.id = 'gx-style'; s.textContent = GX_CSS; document.head.appendChild(s); }
  s.dataset.n = (+s.dataset.n || 0) + 1;
  return () => { s.dataset.n = +s.dataset.n - 1; if (+s.dataset.n <= 0) s.remove(); };
}
/**
 * const E = etapes(parent, [{ t:'Agite le tube', pq:"D'abord l'étape 1 : …", avant:false }, …]);   (avant : le retour au-dessus des commandes)
 * E.c(i) : conteneur des commandes de l'étape i (à donner à panel()) ; E.go(i, el, jaune=true) : commande principale ;
 * E.set(i) : étape en cours (i = nombre d'étapes → tout est fait) ; E.info(i, html) : retour sous l'étape ; E.titre(i, html).
 */
function etapes(parent, liste) {
  const ol = document.createElement('ol'); ol.className = 'gx-etapes'; parent.appendChild(ol);
  let cur = -1;
  const B = liste.map((e, i) => {
    const li = document.createElement('li');
    li.innerHTML = '<div class="gx-t"><span class="gx-n" aria-hidden="true"></span><span></span></div><div class="gx-c"></div><p class="gx-info" aria-live="polite"></p><p class="gx-pq"></p>';
    const [t, c, info, pq] = li.children;
    t.lastChild.innerHTML = e.t; pq.textContent = '🔒 ' + (e.pq || `D'abord l'étape ${i}.`);
    if (e.avant) li.insertBefore(info, c);
    const signaler = () => {      // une commande grisée ne fait rien… mais dit pourquoi, et l'étape en cours s'allume
      li.classList.add('dit'); const k = B[cur]; if (k) { k.li.classList.remove('appel'); void k.li.offsetWidth; k.li.classList.add('appel'); }
    };
    li.addEventListener('click', (ev) => { if (li.classList.contains('verrou')) { ev.stopPropagation(); ev.preventDefault(); signaler(); } }, true);
    li.addEventListener('pointerdown', () => { if (li.classList.contains('verrou')) signaler(); }, true);   // un curseur désactivé n'émet pas de click
    ol.appendChild(li);
    return { li, t: t.lastChild, n: t.firstChild, c, info, go: [] };
  });
  const api = {
    el: ol,
    c: (i) => B[i].c,
    titre(i, html) { const b = B[i]; if (b.vt !== html) { b.vt = html; b.t.innerHTML = html; } },      // n'écrit que si ça change
    info(i, html) { const b = B[i]; if (b.vi !== html) { b.vi = html; b.info.innerHTML = html; } },
    go(i, el, jaune = true) { B[i].go.push([el, jaune]); const c = cur; cur = -1; api.set(c); },
    get cur() { return cur; },
    set(c) {
      if (c === cur) return; cur = c;
      B.forEach((b, i) => {
        const st = i < c ? 'fait' : i === c ? 'cur' : 'verrou';
        b.li.className = 'gx-e ' + st + (i === c + 1 ? ' suite' : '');
        b.n.textContent = i < c ? '✓' : String(i + 1);
        if (i === c) b.li.setAttribute('aria-current', 'step'); else b.li.removeAttribute('aria-current');
        b.c.querySelectorAll('input').forEach((x) => { x.disabled = st === 'verrou'; });
        for (const [el, jaune] of b.go) { el.classList.toggle('gx-go', i === c); if (jaune) el.classList.toggle('primary', i === c); }
      });
    },
  };
  return api;
}

const RI = 0.36, RO = 0.385, HT = 2.5, HE = 1.3; // rayon intérieur / extérieur du tube, hauteur du tube, hauteur d'eau
const COL_EAU_MOL = 0x8fd0ff;
// Les ajouts : les exemples du cours (+ le sable)
const AJ = {
  huile: { label: 'Huile', nom: "de l'huile", type: 'hetero', genre: 'gouttes', col: 0xf2c230, extra: 0.4, mol: "molécules d'huile" },
  boue: { label: 'Boue (terre)', nom: 'de la terre', type: 'hetero', genre: 'grains', col: 0x9a6236, extra: 0.28, mol: 'grains de terre', n: 170, r0: 0.011, r1: 0.026 },
  sable: { label: 'Sable', nom: 'du sable', type: 'hetero', genre: 'grains', col: 0xd6b26e, extra: 0.17, mol: 'grains de sable', n: 90, r0: 0.026, r1: 0.042 },
  sel: { label: 'Sel', nom: 'du sel', type: 'homo', genre: 'cristaux', col: 0xffffff, extra: 0, mol: 'particules de sel', liq: 'eau salée' },
  sucre: { label: 'Sucre', nom: 'du sucre', type: 'homo', genre: 'cristaux', col: 0xffe2b8, extra: 0, mol: 'molécules de sucre', liq: 'eau sucrée' },
  sirop: { label: 'Sirop de menthe', nom: 'du sirop de menthe', type: 'homo', genre: 'sirop', col: C.menthe, extra: 0.22, mol: 'molécules du sirop', liq: 'eau + sirop<br>de menthe' },
};
const DETAIL = {
  huile: "Deux couches : l'huile au-dessus, l'eau en dessous. À la loupe, les molécules d'huile restent groupées.",
  boue: 'En haut, l\'eau plus claire ; au fond, le dépôt solide (boue). À la loupe, les grains de terre restent groupés au fond.',
  sable: 'Le sable forme un dépôt bien visible au fond. À la loupe, les grains restent groupés.',
  sel: "La disparition du sel n'est qu'apparente : à la loupe, ses particules sont réparties partout entre les molécules d'eau.",
  sucre: "La disparition du sucre n'est qu'apparente : à la loupe, ses molécules sont réparties partout entre les molécules d'eau.",
  sirop: "Le sirop colore tout le liquide en vert, partout pareil. À la loupe, ses molécules sont réparties partout entre celles de l'eau.",
};
const REPOS = {
  huile: "Le temps passe… Les gouttes d'huile remontent et se rassemblent au-dessus de l'eau : l'huile flotte sur l'eau.",
  boue: 'Le temps passe… Les particules de terre en suspension se déposent dans le fond.',
  sable: 'Le temps passe… Le sable tombe vite au fond.',
  sel: "Le temps passe… À l'œil nu, rien ne réapparaît.", sucre: "Le temps passe… À l'œil nu, rien ne réapparaît.",
  sirop: 'Le temps passe… La couleur verte reste la même partout.',
};
const DEF = {
  homo: '<mark>mélange homogène</mark> : <mark>on ne peut distinguer les différents constituants à l’œil nu</mark>',
  hetero: '<mark>mélange hétérogène</mark> : <mark>différents constituants sont visibles à l’œil nu</mark>',
};

const sm = (x) => x * x * (3 - 2 * x);
const rIn = (y) => (y >= RI ? RI : Math.sqrt(Math.max(0, RI * RI - (RI - y) ** 2)));      // rayon intérieur à la hauteur y
const fond = (rho) => RI - Math.sqrt(Math.max(0, RI * RI - rho * rho));                   // hauteur du fond arrondi
const HEMI = Array.from({ length: 13 }, (_, i) => RI * (1 - Math.cos((i / 12) * Math.PI / 2)));
function tranche(y0, y1) { // profil d'une couche de liquide entre y0 et y1 (pour LatheGeometry)
  const ys = [y0, ...HEMI.filter((y) => y > y0 + 1e-4 && y < y1 - 1e-4), y1];
  return [new THREE.Vector2(0, y0), ...ys.map((y) => new THREE.Vector2(Math.max(0.003, rIn(y) - 0.007), y)), new THREE.Vector2(0, y1)];
}
function couche(mat, parent) {
  const mesh = new THREE.Mesh(new THREE.BufferGeometry(), mat);
  mesh.renderOrder = 1; parent.add(mesh);
  let k = '';
  return { mesh, set(y0, y1) {
    mesh.visible = y1 - y0 > 0.006; if (!mesh.visible) return;
    const key = Math.round(y0 * 400) + ':' + Math.round(y1 * 400); if (key === k) return; k = key;
    mesh.geometry.dispose(); mesh.geometry = new THREE.LatheGeometry(tranche(y0, y1), 40);
  } };
}
function pool(geo, n, parent) { // particules (gouttes, grains, cristaux)
  const mesh = new THREE.InstancedMesh(geo, new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.55 }), n);
  mesh.frustumCulled = false; parent.add(mesh);
  const P = Array.from({ length: n }, () => ({ x: 0, y: 0, z: 0, r: 0.02, s: 0, h: 0, st: 'off', vy: 0, vt: 0, tx: 0, ty: 0, tz: 0, a: rand(6.3) }));
  const c = new THREE.Color(), m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), p3 = new THREE.Vector3(), s3 = new THREE.Vector3();
  const api = {
    mesh, P,
    tint(hex, v) { const b = new THREE.Color(hex); for (let i = 0; i < n; i++) mesh.setColorAt(i, c.copy(b).multiplyScalar(1 - v + rand(2 * v))); mesh.instanceColor.needsUpdate = true; },
    commit() {
      for (let i = 0; i < n; i++) {
        const p = P[i]; e.set(p.a, p.a * 1.3, 0); q.setFromEuler(e);
        s3.setScalar(p.st === 'off' ? 1e-5 : Math.max(1e-5, p.r * p.s)); m4.compose(p3.set(p.x, p.y, p.z), q, s3); mesh.setMatrixAt(i, m4);
      }
      mesh.instanceMatrix.needsUpdate = true;
    },
  };
  api.tint(0xffffff, 0); api.commit(); // toutes cachées au départ
  return api;
}

// ---------- la loupe : un réseau de places (hexagonal) dans un disque ----------
const RL = 0.95, A = 0.128, SLOTS = [];
for (let r = -9; r <= 9; r++) for (let c = -9; c <= 9; c++) {
  const x = (c + (r & 1) * 0.5) * A, y = r * A * 0.866;
  if (x * x + y * y < 0.8 * 0.8) SLOTS.push([x, y]);
}
const NL = SLOTS.length;
const VOIS = SLOTS.map(([x, y]) => SLOTS.map(([u, v], k) => [k, (u - x) ** 2 + (v - y) ** 2]).filter(([, dd]) => dd > 1e-6 && dd < (A * 1.15) ** 2).map(([k]) => k));
const melanger = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };

export default function mount(root) {
  const retirerStyle = gxStyle();
  const { stageEl, panelEl, explainEl } = layout(root);
  messageSousScene(root, stageEl, explainEl); // essai : le message reste visible, sous la scène
  const st = createStage(stageEl, { camera: { pos: [0.9, 2.2, 6.5], target: [0.9, 1.4, 0] } });
  const { scene, camera } = st;
  const ex = explain(explainEl);
  if (st.controls) { st.controls.minAzimuthAngle = -0.75; st.controls.maxAzimuthAngle = 0.75; }
  const sol = ground(12); sol.position.y = -0.1; scene.add(sol);

  // --- support de tubes en bois (le tube en sort pour être agité) ---
  const bois = new THREE.MeshStandardMaterial({ color: C.bois, roughness: 0.8 });
  const base = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.07, 0.6), bois); base.position.y = -0.065; scene.add(base);
  for (const sx of [-1, 1]) { const mt = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.62, 0.5), bois); mt.position.set(sx * 0.54, 0.24, 0); scene.add(mt); }
  const forme = new THREE.Shape(); forme.moveTo(-0.575, -0.3); forme.lineTo(0.575, -0.3); forme.lineTo(0.575, 0.3); forme.lineTo(-0.575, 0.3); forme.lineTo(-0.575, -0.3);
  const trou = new THREE.Path(); trou.absarc(0, 0, RO + 0.03, 0, Math.PI * 2, true); forme.holes.push(trou);
  const planche = new THREE.Mesh(new THREE.ExtrudeGeometry(forme, { depth: 0.06, bevelEnabled: false, curveSegments: 32 }), bois);
  planche.rotation.x = -Math.PI / 2; planche.position.y = 0.5; scene.add(planche);

  // --- le tube à essai et son contenu ---
  const tube = new THREE.Group(); scene.add(tube);
  const prof = [];
  for (let i = 0; i <= 16; i++) { const a = (i / 16) * Math.PI / 2; prof.push(new THREE.Vector2(RO * Math.sin(a) + 1e-4, RI - RO * Math.cos(a))); }
  prof.push(new THREE.Vector2(RO, HT));
  const verre = new THREE.Mesh(new THREE.LatheGeometry(prof, 48), glassMaterial({ opacity: 0.22 })); verre.renderOrder = 2; tube.add(verre);
  const rebord = new THREE.Mesh(new THREE.TorusGeometry(RO, 0.02, 8, 48), new THREE.MeshStandardMaterial({ color: 0xe8f6ff, transparent: true, opacity: 0.7 }));
  rebord.rotation.x = Math.PI / 2; rebord.position.y = HT; tube.add(rebord);
  const eau = couche(liquidMaterial(C.eau, 0.5), tube);
  const huile = couche(liquidMaterial(AJ.huile.col, 0.85), tube);
  const sirop = couche(liquidMaterial(C.menthe, 0.88), tube);
  const depot = couche(new THREE.MeshStandardMaterial({ color: AJ.boue.col, roughness: 1 }), tube);
  const filet = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 1, 10), liquidMaterial(AJ.huile.col, 0.9)); filet.visible = false; tube.add(filet);
  const gouttes = pool(new THREE.SphereGeometry(1, 12, 10), 90, tube);
  const grains = pool(new THREE.IcosahedronGeometry(1, 0), 170, tube);
  const cristaux = pool(new THREE.BoxGeometry(1.5, 1.5, 1.5), 70, tube);

  // --- la loupe (toujours tournée vers toi) ---
  const loupe = new THREE.Group(); loupe.position.set(1.62, 1.5, 0); scene.add(loupe);
  const fondL = new THREE.Mesh(new THREE.CircleGeometry(RL, 56), new THREE.MeshBasicMaterial({ color: 0x1c1838 })); loupe.add(fondL);
  const metal = new THREE.MeshStandardMaterial({ color: C.metal, metalness: 0.6, roughness: 0.3 });
  const cercle = new THREE.Mesh(new THREE.TorusGeometry(RL, 0.055, 12, 64), metal); loupe.add(cercle);
  const manche = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.62, 16), new THREE.MeshStandardMaterial({ color: C.bois, roughness: 0.7 }));
  manche.position.set(0.9, -0.9, 0); manche.rotation.z = Math.PI / 4; loupe.add(manche);
  const mol = molecules(NL, { radius: 0.05 }); loupe.add(mol.mesh);
  const repere = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.012, 8, 40), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 })); scene.add(repere);
  const lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(12), 3));
  const lignes = new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35 })); lignes.frustumCulled = false; scene.add(lignes);
  const lp = { kind: new Uint8Array(NL), g: new Int32Array(NL), dsp: new Int32Array(NL), occG: new Int32Array(NL), occD: new Int32Array(NL), th: new Float32Array(NL), px: new Float32Array(NL), py: new Float32Array(NL), ph: new Float32Array(NL) };

  // --- étiquettes (à gauche du tube, alignées à droite) ---
  const aHaut = new THREE.Object3D(), aBas = new THREE.Object3D(), aTube = new THREE.Object3D(); tube.add(aHaut, aBas, aTube);
  aTube.position.set(-RO - 0.05, HT - 0.12, 0);
  const gauche = (L) => { L.el.style.translate = '-50% 0'; return L; };
  const lTube = gauche(st.label('un tube à essai', aTube, { cls: 'discret' }));
  const lHaut = gauche(st.label('', aHaut)), lBas = gauche(st.label('', aBas));
  const aVerd = new THREE.Object3D(), aLeg = new THREE.Object3D(); scene.add(aVerd, aLeg); // placés par cadrer()
  const lHaut2 = st.label('', aVerd, { cls: 'fluo' });
  const lLeg = st.label('', aLeg, { cls: 'discret' });
  const txt = new Map();
  const dit = (L, s) => { if (txt.get(L) !== s) { txt.set(L, s); L.set(s); } L.show(!!s); };

  // --- état ---
  const qs = new URLSearchParams(location.search), demo = AJ[qs.get('demo')] ? qs.get('demo') : null, etape = +(qs.get('etape') || 3), vite = Math.min(20, +(qs.get('vite') || 1));
  let avance = Math.min(60, +(qs.get('avance') || 0));
  let key = 'huile', aj = AJ.huile, phase = 'attente', tPhase = 0, pred = null, bonnes = 0, total = 0;
  const essayes = new Set();   // ajouts déjà menés jusqu'à la conclusion
  let verse = 0, spawned = 0, d = 0, turb = 0, nAct = 0, swapT = 0, loupeOn = true;
  let yTop = HE, oilH = 0, dep = 0, sirH = 0, mix = 0, nFondu = 0, nVol = 0;
  const pl = () => (aj.genre === 'gouttes' ? gouttes : aj.genre === 'grains' ? grains : aj.genre === 'cristaux' ? cristaux : null);

  function cible(q, y0, y1) { q.ty = rand(y0, y1); const rr = Math.max(0.01, rIn(q.ty) - q.r - 0.02) * Math.sqrt(Math.random()), a = rand(6.283); q.tx = Math.cos(a) * rr; q.tz = Math.sin(a) * rr; }
  function garder(q, y0, y1) {
    const lim = Math.max(0.005, rIn(q.y) - q.r - 0.01), rho = Math.hypot(q.x, q.z);
    if (rho > lim) { q.x *= lim / rho; q.z *= lim / rho; }
    q.y = clamp(q.y, Math.max(y0, fond(Math.hypot(q.x, q.z))) + q.r, y1 - q.r);
  }

  function construireLoupe(vide = false) {   // vide : rien n'est encore ajouté, la loupe ne montre que des molécules d'eau
    const nS = vide ? 0 : aj.genre === 'gouttes' ? SLOTS.filter(([, y]) => y > 0.02).length : aj.genre === 'grains' ? SLOTS.filter(([, y]) => y < -0.36).length : 26;
    const ordre = SLOTS.map((s, k) => k).sort((a, b) => (aj.genre === 'gouttes' ? SLOTS[b][1] - SLOTS[a][1] : SLOTS[a][1] - SLOTS[b][1]));
    const cS = new THREE.Color(aj.col), cW = new THREE.Color(COL_EAU_MOL);
    for (let j = 0; j < NL; j++) {
      lp.kind[j] = j < nS ? 1 : 0; lp.g[j] = ordre[j]; lp.occG[ordre[j]] = j;
      lp.th[j] = rand(0, 0.6); lp.ph[j] = rand(6.28); lp.px[j] = SLOTS[ordre[j]][0]; lp.py[j] = SLOTS[ordre[j]][1];
      mol.setColor(j, lp.kind[j] ? cS : cW);
    }
    dispersion();
  }
  function dispersion() { // homogène : partout au hasard ; hétérogène : en petits groupes (gouttelettes, amas)
    const nS = lp.kind.reduce((s, k) => s + k, 0);
    let libres = melanger(SLOTS.map((s, k) => k));
    if (aj.type === 'homo') { for (let j = 0; j < NL; j++) lp.dsp[j] = libres[j]; }
    else {
      const centres = libres.slice(0, aj.genre === 'gouttes' ? 6 : 8), pris = new Uint8Array(NL);
      for (let j = 0; j < nS; j++) {
        const [cx, cy] = SLOTS[centres[j % centres.length]]; let best = -1, bd = 1e9;
        for (let s = 0; s < NL; s++) if (!pris[s]) { const dd = (SLOTS[s][0] - cx) ** 2 + (SLOTS[s][1] - cy) ** 2; if (dd < bd) { bd = dd; best = s; } }
        pris[best] = 1; lp.dsp[j] = best;
      }
      libres = libres.filter((s) => !pris[s]);
      for (let j = nS; j < NL; j++) lp.dsp[j] = libres[j - nS];
    }
    for (let j = 0; j < NL; j++) lp.occD[lp.dsp[j]] = j;
  }
  function echange(disp) { // deux voisines changent de place : le liquide bouge
    const slotOf = disp ? lp.dsp : lp.g, occ = disp ? lp.occD : lp.occG;
    const j = (Math.random() * NL) | 0, s = slotOf[j], vs = VOIS[s]; if (!vs.length) return;
    const s2 = vs[(Math.random() * vs.length) | 0], k = occ[s2];
    const liquideS = aj.genre === 'gouttes' || aj.genre === 'sirop' || (aj.genre === 'cristaux' && disp);
    if (!((aj.type === 'homo' && disp) || (lp.kind[j] === lp.kind[k] && (lp.kind[j] === 0 || liquideS)))) return;
    slotOf[j] = s2; slotOf[k] = s; occ[s2] = j; occ[s] = k;
  }

  function choisir(k) {
    key = k; aj = AJ[k];
    for (const p of [gouttes, grains, cristaux]) { for (const q of p.P) q.st = 'off'; p.commit(); }
    d = 0; verse = 0; spawned = 0; pred = null; turb = 0; tube.position.y = 0; tube.rotation.set(0, 0, 0);
    const p = pl(); nAct = aj.genre === 'gouttes' ? 90 : aj.genre === 'grains' ? aj.n : aj.genre === 'cristaux' ? 70 : 0;
    if (p) p.tint(aj.col, aj.genre === 'grains' ? 0.18 : 0.06);
    for (let i = 0; i < nAct; i++) {
      const q = p.P[i]; q.s = 0;
      if (aj.genre === 'gouttes') { q.st = 'fondu'; q.r = rand(0.022, 0.062); }
      else if (aj.genre === 'grains') { q.r = rand(aj.r0, aj.r1); q.vt = 0.2 + q.r * q.r * 900; }
      else { q.r = rand(0.022, 0.04); q.vt = 0.9; q.h = rand(0, 0.06); }
    }
    depot.mesh.material.color.set(aj.col); filet.material.color.set(aj.col);
    chAj.set(k); construireLoupe(); setPhase('verse');
  }
  // « Autre mélange » : le tube redevient de l'eau seule, on repart à l'étape 1
  function vider() {
    for (const p of [gouttes, grains, cristaux]) { for (const q of p.P) q.st = 'off'; p.commit(); }
    d = 0; verse = 0; spawned = 0; pred = null; turb = 0; nAct = 0; nFondu = 0; nVol = 0; tube.position.y = 0; tube.rotation.set(0, 0, 0);
    chAj.set(''); construireLoupe(true); setPhase('attente');
  }
  function setPhase(ph) {
    phase = ph; tPhase = 0;
    const p = pl();
    if (ph === 'agite') {
      pred = null;   // on réagite : nouvelle prédiction à faire
      if (mix < 0.05 && aj.type === 'hetero') dispersion();
      if (p) for (let i = 0; i < nAct; i++) { const q = p.P[i]; if (q.st === 'pose' || q.st === 'chute') { q.st = 'libre'; cible(q, 0.05, yTop - 0.05); } }
    }
    if (ph === 'repos' && p) for (let i = 0; i < nAct; i++) {
      const q = p.P[i]; if (q.st !== 'libre') continue;
      if (aj.genre === 'gouttes') { q.st = 'monte'; q.vt = 0.3 + q.r * 5; } else if (aj.genre === 'grains') { q.st = 'chute'; q.vy = 0; }
    }
    if (ph === 'fini' && pred) { total++; if (pred === aj.type) bonnes++; score.set(`${bonnes} / ${total}`); }
    if (ph === 'fini') essayes.add(key);
    majBoutons(); dire();
  }
  function dire() {
    const n = { homo: 'homogène', hetero: 'hétérogène' };
    let h = '';
    if (phase === 'attente') h = "Un tube à essai rempli d'eau. Commence par l'<b>étape 1</b> : choisis ce que tu ajoutes à l'eau.";
    else if (phase === 'verse') h = `Tu verses ${aj.nom} dans l'eau du tube à essai…`;
    else if (phase === 'pret') h = `Tu as ajouté ${aj.nom} dans l'eau. Appuie sur <b>Agiter</b> pour bien mélanger.`;
    else if (phase === 'agite') h = 'Ça secoue ! Tout se mélange…';
    else if (phase === 'melange') h = pred ? `Ta prédiction : <b>${n[pred]}</b>. Appuie sur <b>Laisser reposer</b> pour vérifier.`
      : "Tout est mélangé… pour l'instant. <b>Ta prédiction</b> : après un moment de repos, ce mélange sera-t-il <b>homogène</b> ou <b>hétérogène</b> ?";
    else if (phase === 'repos') h = REPOS[key];
    else h = (pred ? (pred === aj.type ? '<b>Bien vu !</b> ' : '<b>Raté, cette fois.</b> ') : '') + `C'est un ${DEF[aj.type]}. ${DETAIL[key]}`;
    ex.set(h);
  }

  // --- réglages : les étapes de l'expérience, dans l'ordre où il faut les faire ---
  const ui = panel(panelEl);
  ui.title('Homogène ou hétérogène ?');
  const E = etapes(panelEl, [
    { t: "Choisis ce que tu ajoutes à l'eau du tube" },
    { t: 'Agite le tube', pq: "D'abord l'étape 1 : choisis ce que tu ajoutes à l'eau." },
    { t: 'Prédis : après un moment de repos, ce mélange sera…', pq: "D'abord l'étape 2 : agite le tube." },
    { t: 'Laisse reposer et observe', pq: "D'abord l'étape 3 : fais ta prédiction." },
    { t: 'Conclus', pq: "D'abord l'étape 4 : laisse reposer.", avant: true },
  ]);
  const chAj = panel(E.c(0)).choice({ options: Object.entries(AJ).map(([value, a]) => ({ value, label: a.label })), value: '', onChange: (v) => choisir(v) });
  const [bAgiter] = panel(E.c(1)).buttons([{ label: 'Agiter', onClick: () => setPhase('agite') }]);
  const predire = (v) => { pred = v; majBoutons(); dire(); };
  const [bHomo, bHetero] = panel(E.c(2)).buttons([{ label: 'Homogène', onClick: () => predire('homo') }, { label: 'Hétérogène', onClick: () => predire('hetero') }]);
  const [bRepos] = panel(E.c(3)).buttons([{ label: 'Laisser reposer', onClick: () => setPhase('repos') }]);
  const [bAutre] = panel(E.c(4)).buttons([{ label: 'Autre mélange →', onClick: () => vider() }]);
  E.go(1, bAgiter); E.go(2, bHomo, false); E.go(2, bHetero, false); E.go(3, bRepos); E.go(4, bAutre);
  ui.buttons([{ label: 'Loupe : oui', onClick: (b) => { loupeOn = !loupeOn; b.textContent = loupeOn ? 'Loupe : oui' : 'Loupe : non'; } }]);
  const score = ui.readout('Bonnes prédictions'); score.set('0 / 0');
  const NOM = { homo: 'homogène', hetero: 'hétérogène' };
  function majBoutons() {
    bAgiter.disabled = !['pret', 'melange', 'fini'].includes(phase);
    bRepos.disabled = !(phase === 'melange' && pred);
    bHomo.disabled = bHetero.disabled = phase !== 'melange';
    bHomo.classList.toggle('on', pred === 'homo'); bHetero.classList.toggle('on', pred === 'hetero');
    // l'étape en cours d'après la phase, et un retour court sous chaque étape
    E.set(phase === 'attente' ? 0 : ['verse', 'pret', 'agite'].includes(phase) ? 1 : phase === 'melange' ? (pred ? 3 : 2) : phase === 'repos' ? 3 : 4);
    E.info(0, phase === 'attente' ? '' : phase === 'verse' ? `Tu verses ${aj.nom}…` : `Tu as ajouté ${aj.nom} à l'eau.`);
    E.info(1, phase === 'agite' ? 'Ça secoue…' : phase === 'melange' && !pred ? 'Tout est mélangé… pour l\'instant.' : '');
    E.info(2, pred ? `Ta prédiction : <b>${NOM[pred]}</b>.` : '');
    E.info(3, phase === 'repos' ? 'Le temps passe… regarde le tube et la loupe.' : '');
    E.info(4, phase !== 'fini' ? '' : (pred ? (pred === aj.type ? '✓ Bien vu ! ' : '✗ Raté, cette fois. ') : '')
      + `C'est un <span class="gx-fin">mélange ${NOM[aj.type]}</span>.<br>`
      + (essayes.size < 6 ? `Ajouts essayés : ${essayes.size} / 6. Essaie les autres !` : 'Tu as essayé les 6 ajouts du cours !'));
    // les ajouts déjà essayés jusqu'au bout sont cochés
    chAj.el.querySelectorAll('button').forEach((b) => { const s = AJ[b.dataset.v].label + (essayes.has(b.dataset.v) ? ' ✓' : ''); if (b.textContent !== s) b.textContent = s; });
  }

  // --- cadrage : le tube, la loupe, et la place des étiquettes à gauche ---
  // écran large : la loupe à droite du tube ; écran étroit (téléphone) : la loupe au-dessus, à droite
  let fw = 0, fh = 0, etroit = false;
  function cadrer() {
    const { w, h } = st.size(); if (w < 10 || h < 10 || (w === fw && h === fh)) return; fw = w; fh = h;
    etroit = w < 560; txt.delete(lLeg);
    if (etroit) { loupe.position.set(0.75, 3.75, 0); aLeg.position.set(1.72, 4.95, 0); aVerd.position.set(-0.3, 3.75, 0); }
    else { loupe.position.set(1.62, 1.5, 0); aLeg.position.set(1.62, 0.14, 0); aVerd.position.set(1.62, 2.72, 0); }
    lLeg.el.style.translate = lHaut2.el.style.translate = etroit ? '-50% 0' : '0 0';
    const P = 130, m = 12, xL = -0.6, xR = etroit ? 1.95 : 2.65, yB = -0.12, yT = etroit ? 5.3 : 3.15;
    const Wc = xR - xL, Hc = yT - yB, yc = (yT + yB) / 2;
    const k = Math.min((w - P - 2 * m) / Wc, (h - 2 * m) / Hc), reste = Math.max(0, w - P - 2 * m - Wc * k);
    const cx = xL - (P + m + reste / 2) / k + w / (2 * k);
    const dist = (h / k) / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
    const dir = new THREE.Vector3(0, 0.22, 1).normalize();
    st.controls.target.set(cx, yc, 0); camera.position.copy(st.controls.target).addScaledVector(dir, dist);
    st.controls.minDistance = dist * 0.55; st.controls.maxDistance = dist * 1.5; st.controls.update();
  }

  // mélange de deux couleurs « à l'œil » (en sRGB, pas en linéaire : sinon bleu + brun = gris)
  const sa = { r: 0, g: 0, b: 0 }, sb = { r: 0, g: 0, b: 0 }, tA = new THREE.Color(), tB = new THREE.Color(), SRGB = THREE.SRGBColorSpace;
  const teinte = (out, a, b, k) => { tA.set(a).getRGB(sa, SRGB); tB.set(b).getRGB(sb, SRGB); return out.setRGB(lerp(sa.r, sb.r, k), lerp(sa.g, sb.g, k), lerp(sa.b, sb.b, k), SRGB); };
  const cEau = new THREE.Color(), v3 = new THREE.Vector3(), up = new THREE.Vector3(), z3 = new THREE.Vector3();
  st.onFrame((dt, t) => {
    cadrer();
    if (avance > 0) { for (let i = 0; i < avance * 50; i++) pas(0.02, t); avance = 0; } // banc d'essai : ?avance=<s>
    for (let i = 0; i < vite; i++) pas(dt, t + i * dt);
  });
  function pas(dt, t) {
    tPhase += dt;
    const p = pl();
    // grandeurs de la scène (d'après l'image précédente)
    const ext = aj.genre === 'gouttes' || aj.genre === 'sirop' ? verse : nAct ? spawned / nAct : 0;
    yTop = HE + aj.extra * ext;
    oilH = aj.genre === 'gouttes' && nAct ? aj.extra * verse * (nFondu / nAct) : 0;
    dep = aj.genre === 'grains' && nAct ? aj.extra * (nFondu / nAct) : 0;
    sirH = aj.genre === 'sirop' ? aj.extra * verse * (1 - d) : 0;

    // déroulement
    if (phase === 'verse') {
      if (aj.genre === 'gouttes' || aj.genre === 'sirop') { verse = Math.min(1, verse + dt / 1.1); if (verse >= 1 && tPhase > 1.3) setPhase('pret'); }
      else {
        const veut = Math.min(nAct, Math.floor((tPhase / 0.9) * nAct));
        while (spawned < veut) {
          const q = p.P[spawned++], a = rand(6.283), rr = rand(0.13);
          q.x = Math.cos(a) * rr; q.z = Math.sin(a) * rr; q.y = HT + 0.3 + rand(0.25); q.vy = -rand(0.3, 0.9); q.st = 'chute'; q.s = 1;
        }
        if (spawned >= nAct && tPhase > 1.4) setPhase('pret');
      }
    } else if (phase === 'agite') {
      const D = 1.8, e = sm(clamp(tPhase / 0.3, 0, 1)) * sm(clamp((D - tPhase) / 0.3, 0, 1));
      tube.position.y = 0.64 * e;
      tube.rotation.z = Math.sin(tPhase * Math.PI * 9) * 0.22 * e;
      tube.rotation.x = Math.sin(tPhase * Math.PI * 6.2) * 0.06 * e;
      turb = 1;
      if (aj.type === 'homo') d = Math.min(1, d + dt / (key === 'sucre' ? 1.5 : 1.3));
      else { // on libère les gouttes (ou les grains) de leur couche
        let lib = nAct - nFondu; const veut = Math.round(nAct * clamp(tPhase / 0.6, 0, 1));
        for (let i = 0; i < nAct && lib < veut; i++) {
          const q = p.P[i]; if (q.st !== 'fondu') continue;
          q.y = aj.genre === 'gouttes' ? rand(yTop - Math.max(oilH, 0.05), yTop - 0.03) : rand(0.03, Math.max(dep, 0.06));
          const rr = Math.max(0.01, rIn(q.y) - q.r - 0.02) * Math.sqrt(Math.random()), a = rand(6.283);
          q.x = Math.cos(a) * rr; q.z = Math.sin(a) * rr; q.st = 'libre'; cible(q, 0.05, yTop - 0.05); lib++;
        }
      }
      if (tPhase >= D) { tube.position.y = 0; tube.rotation.set(0, 0, 0); setPhase('melange'); }
    } else {
      turb = Math.max(phase === 'melange' ? 0.08 : 0, turb - dt * 0.7);
      if (aj.genre === 'sirop' && phase !== 'attente') d = Math.min(1, d + dt * 0.006); // diffusion lente, même sans agiter
      if (phase === 'repos' && ((aj.type === 'homo' && tPhase > 2.6) || (aj.type === 'hetero' && nVol === 0 && tPhase > 0.5) || tPhase > 10)) setPhase('fini');
    }

    // particules
    nFondu = 0; nVol = 0;
    if (p) {
      const yEau = yTop - oilH;
      for (let i = 0; i < nAct; i++) {
        const q = p.P[i];
        if (q.st === 'chute') {
          if (q.y > yTop) q.vy -= 7 * dt; else q.vy = lerp(q.vy, -q.vt * (phase === 'verse' ? 2.5 : 1), Math.min(1, dt * 8));
          q.y += q.vy * dt; q.a += dt * 2;
          if (aj.genre === 'cristaux') { const fl = fond(Math.hypot(q.x, q.z)) + q.r + q.h; if (q.y <= fl) { q.y = fl; q.st = 'pose'; } }
          else if (q.y - q.r <= dep) q.st = 'fondu';
        } else if (q.st === 'monte') {
          q.y += q.vt * dt; q.a += dt;
          if (q.y + q.r >= yEau) q.st = 'fondu';
        } else if (q.st === 'libre') {
          const sp = 0.2 + 1.7 * turb, dx = q.tx - q.x, dy = q.ty - q.y, dz = q.tz - q.z, dd = Math.hypot(dx, dy, dz);
          if (dd < 0.04) cible(q, dep + 0.04, yEau - 0.04);
          else { const s = Math.min(dd, sp * dt) / dd; q.x += dx * s; q.y += dy * s; q.z += dz * s; }
          const an = turb * 4 * dt, c = Math.cos(an), sn = Math.sin(an), x = q.x; q.x = x * c - q.z * sn; q.z = x * sn + q.z * c;
          garder(q, dep, yEau); q.a += dt * (0.6 + 4 * turb);
        }
        if (q.st === 'fondu') nFondu++;
        if (q.st === 'chute' || q.st === 'monte' || q.st === 'libre') nVol++;
        if (aj.genre === 'cristaux') q.s = Math.pow(1 - d, 0.6);
        else q.s = q.st === 'fondu' ? Math.max(0, q.s - dt * 6) : Math.min(1, q.s + dt * 6);
      }
      p.commit();
    }
    // degré de mélange visible (0 = séparé, 1 = tout dispersé)
    mix = aj.type === 'homo' ? d : phase === 'verse' || phase === 'pret' ? 0 : nAct ? (nAct - nFondu) / nAct : 0;

    // couches de liquide
    const yEau = yTop - oilH;
    eau.set(dep || sirH, yEau); huile.set(yEau, yTop); sirop.set(0, sirH); depot.set(0, dep);
    cEau.set(C.eau); let op = 0.5;
    if (aj.genre === 'gouttes') { teinte(cEau, C.eau, 0xfff1c4, 0.55 * mix); op = 0.5 + 0.28 * mix; }
    else if (aj.genre === 'grains') { const boue = key === 'boue'; teinte(cEau, C.eau, boue ? 0x7a5230 : aj.col, Math.min(0.9, (boue ? 0.3 : 0.04) * ext + (boue ? 0.62 : 0.25) * mix)); op = 0.5 + (boue ? 0.42 : 0.15) * mix + (boue ? 0.1 : 0) * ext; }
    else if (aj.genre === 'sirop') { teinte(cEau, C.eau, 0x2fd39a, 0.92 * d); op = 0.5 + 0.32 * d; }
    eau.mesh.material.color.copy(cEau); eau.mesh.material.opacity = op;
    const versant = phase === 'verse' && (aj.genre === 'gouttes' || aj.genre === 'sirop') && verse < 1;
    filet.visible = versant;
    if (versant) { const yb = aj.genre === 'sirop' ? sirH : yTop, yh = HT + 0.55; filet.scale.y = yh - yb; filet.position.set(0, (yh + yb) / 2, 0); }

    // étiquettes
    const xs = -RO - 0.05;
    let hh = '', bb = '';
    if (phase === 'attente') { bb = 'eau'; aBas.position.set(xs, yTop * 0.5, 0); }
    else if (aj.genre === 'gouttes') {
      if (mix > 0.5) { hh = "gouttes d'huile<br>dans l'eau"; aHaut.position.set(xs, yTop * 0.55, 0); }
      else { hh = oilH > 0.06 ? 'huile' : ''; bb = 'eau'; aHaut.position.set(xs, yTop - oilH / 2, 0); aBas.position.set(xs, yEau * 0.5, 0); }
    } else if (aj.genre === 'grains') {
      const boue = key === 'boue';
      if (mix > 0.5) { hh = boue ? 'eau boueuse' : 'eau + sable'; aHaut.position.set(xs, yTop * 0.5, 0); }
      else {
        hh = boue && (phase === 'fini' || phase === 'repos') ? 'eau plus claire' : 'eau';
        bb = dep > 0.05 ? (boue ? 'dépôt solide<br>(boue)' : 'dépôt solide<br>(sable)') : '';
        aHaut.position.set(xs, (dep + yTop) * 0.55, 0); aBas.position.set(xs, Math.max(0.08, dep * 0.5), 0);
      }
    } else if (aj.genre === 'cristaux') {
      if (d > 0.92) { hh = aj.liq; aHaut.position.set(xs, yTop * 0.5, 0); }
      else { hh = 'eau'; bb = phase !== 'verse' || tPhase > 0.8 ? (key === 'sel' ? 'sel' : 'sucre') : ''; aHaut.position.set(xs, yTop * 0.6, 0); aBas.position.set(xs, 0.08, 0); }
    } else {
      if (d > 0.92) { hh = aj.liq; aHaut.position.set(xs, yTop * 0.5, 0); }
      else { hh = 'eau'; bb = sirH > 0.05 ? 'sirop<br>de menthe' : ''; aHaut.position.set(xs, (sirH + yTop) * 0.55, 0); aBas.position.set(xs, Math.max(0.08, sirH * 0.5), 0); }
    }
    dit(lHaut, hh); dit(lBas, bb); lTube.show(phase !== 'agite');
    dit(lHaut2, !loupeOn ? '' : phase === 'repos' ? 'temps accéléré…' : phase === 'fini' ? (aj.type === 'homo' ? 'mélange homogène' : 'mélange hétérogène') : '');
    lHaut2.el.classList.toggle('fluo', phase === 'fini'); lHaut2.el.classList.toggle('discret', phase !== 'fini');
    dit(lLeg, loupeOn ? `à la loupe :${etroit ? '<br>' : ''} <span style="color:#${COL_EAU_MOL.toString(16)}">●</span> molécules d'eau` + (phase === 'attente' ? '' : ` &nbsp;<span style="color:#${new THREE.Color(aj.col).getHexString()}">●</span> ${aj.mol}`) : '');

    // loupe
    loupe.visible = repere.visible = lignes.visible = loupeOn;
    if (loupeOn) {
      loupe.quaternion.copy(camera.quaternion); repere.quaternion.copy(camera.quaternion);
      tube.localToWorld(v3.set(0, aj.genre === 'gouttes' ? HE : 0.3, 0)); repere.position.copy(v3);
      up.set(0, 1, 0).applyQuaternion(camera.quaternion);
      const a = lg.attributes.position.array;
      z3.copy(v3).addScaledVector(up, 0.17).toArray(a, 0); z3.copy(loupe.position).addScaledVector(up, RL).toArray(a, 3);
      z3.copy(v3).addScaledVector(up, -0.17).toArray(a, 6); z3.copy(loupe.position).addScaledVector(up, -RL).toArray(a, 9);
      lg.attributes.position.needsUpdate = true;
      const mL = mix;
      swapT += dt; while (swapT > 0.05) { swapT -= 0.05; for (let n = 0; n < 5; n++) echange(mL > 0.5); }
      const kk = Math.min(1, dt * 4);
      for (let j = 0; j < NL; j++) {
        const w = sm(clamp((mL - lp.th[j]) / 0.35, 0, 1)), g = SLOTS[lp.g[j]], ds = SLOTS[lp.dsp[j]];
        lp.px[j] += (lerp(g[0], ds[0], w) - lp.px[j]) * kk; lp.py[j] += (lerp(g[1], ds[1], w) - lp.py[j]) * kk;
        const solide = lp.kind[j] && (aj.genre === 'grains' || (aj.genre === 'cristaux' && w < 0.5));
        const amp = solide ? 0.006 : 0.016, ph = lp.ph[j] + t * (solide ? 9 : 2.2);
        mol.setPos(j, lp.px[j] + Math.sin(ph) * amp, lp.py[j] + Math.cos(ph * 1.3) * amp, 0.04, lp.kind[j] && aj.genre === 'grains' ? 1.45 : 1);
      }
      mol.commit();
    }
    // banc d'essai : ?demo=<ajout>&etape=1|2|3 enchaîne les gestes tout seul
    if (demo) {
      if (phase === 'pret' && etape >= 2) setPhase('agite');
      else if (phase === 'melange' && etape >= 3) { if (!pred) predire(aj.type); setPhase('repos'); }
    }
  }

  if (demo) choisir(demo); else vider();   // au départ : de l'eau seule, l'élève choisit ce qu'elle ajoute
  return { dispose() { st.dispose(); retirerStyle(); } };
}
