// ebullition-graphique.js — « Le graphique de l'ébullition : palier ou pas ? » (thème 5)
// Le bécher chauffe, le thermomètre monte et le graphique θ = f(t) se trace point par point avec les tableaux du cours.
import { THREE, C, layout, createStage, panel, explain, beaker, ground, molecules, liquidMaterial, glassMaterial, miniGraph, tempColor, clamp, lerp, rand } from './kit.js';

// Tableaux du cours, valeurs exactes (t en min, θ en °C)
const DATA = {
  pure: { t: [0, 3, 5, 7, 9, 10, 12, 14], th: [20, 49, 69, 89, 96, 99, 99, 99], palier: [10, 14] },
  salee: { t: [0, 2, 4, 6, 8, 9, 10], th: [48, 67, 92, 100, 103, 104, 105] },
  grenadine: { t: [0, 2, 4, 6, 8, 10, 12, 14, 18, 20], th: [18, 42, 57, 89, 100, 102, 103, 104, 106, 110] },
  // Solidification : le cours ne donne pas de tableau → seulement l'allure de la courbe (palier à 0 °C)
  solid: { t: [0, 1, 2, 3, 4, 10, 11, 12, 14], th: [20, 13, 7.5, 3, 0, 0, -5, -9, -14], palier: [4, 10], allure: true },
};
const INFO = {
  pure: { nom: 'eau pure', titre: 'Évolution de la température de l\'eau pure en fonction du temps', trait: '#ff5a36', liq: C.eau, op: 0.24 },
  salee: { nom: 'eau salée', titre: 'Évolution de la température de l\'eau salée en fonction du temps', trait: '#8f6bff', liq: 0xa8dcff, op: 0.26 },
  grenadine: { nom: 'eau-grenadine', titre: 'Évolution de la température du mélange eau-grenadine en fonction du temps', trait: '#e0457b', liq: 0xd7265f, op: 0.42 },
  solid: { nom: 'eau', titre: 'Solidification de l\'eau : <i>allure de la courbe</i> (le cours ne donne pas de valeurs chiffrées)', trait: '#3d8bff', liq: C.eau, op: 0.24 },
};
const SPEED = 0.85; // minutes du cours par seconde
const tMaxOf = (k) => DATA[k].t[DATA[k].t.length - 1];
const fmt = (v) => String(Math.round(v * 10) / 10).replace('.', ',').replace('-', '−');

// Parcours guidé, dans l'ordre du cours. Une étape est faite quand sa courbe est tracée jusqu'au bout.
const ETAPES = [
  { k: 'pure', nom: 'Eau pure', obs: 'la température à partir de 10 minutes.', bravo: "Eau pure : un <mark>palier</mark>, la température reste constante pendant que l'eau bout." },
  { k: 'salee', nom: 'Eau salée', obs: 'y a-t-il un palier ?', bravo: "Eau salée : pas de palier, la température <mark>continue de monter</mark>." },
  { k: 'cmp', nom: 'Comparer', obs: 'les deux courbes, sur la même échelle.', bravo: "Un palier pour l'eau pure, pas pour l'eau salée : le premier est un <mark>corps pur</mark>, le deuxième un <mark>mélange</mark>." },
  { k: 'grenadine', nom: 'Eau-grenadine', obs: "combien d'états pendant l'ébullition ? Un palier ?", bravo: "Eau-grenadine : 2 états (liquide et gazeux), mais pas de palier : c'est un <mark>mélange</mark>." },
  { k: 'solid', nom: 'Solidification', obs: 'la courbe descend, puis un palier.', bravo: "Solidification : un <mark>palier</mark>, l'eau passe de l'état liquide à l'état solide." },
];
const FIN = '<p class="gd-q">Parcours réussi : 5/5 ✓</p><p>Quand la température n\'évolue plus, on parle de <mark>palier</mark>. Lors de l\'ébullition, on observe simultanément 2 états : liquide et gazeux. ' +
  'Si en plus on observe un palier, on est en présence d\'un <mark>corps pur</mark> (l\'eau pure) ; sinon, d\'un <mark>mélange</mark> (l\'eau salée, l\'eau-grenadine).</p><p class="gd-l2">Tu peux maintenant tout manipuler librement.</p>';
const CLE = 'sciences2e.ebullition-graphique';
const lireMemo = () => { try { return JSON.parse(localStorage.getItem(CLE)) || {}; } catch { return {}; } };
const ecrireMemo = (o) => { try { localStorage.setItem(CLE, JSON.stringify(Object.assign(lireMemo(), o))); } catch { /* navigation privée */ } };

// ---------- Guide pas à pas : copie locale, IDENTIQUE dans cycle-eau.js, ebullition-graphique.js et propagation.js
// (même allure que la mission d'etats-matiere ; à mettre en commun dans kit.js) ----------
const GD_CSS = `
.gd{background:rgba(20,18,38,.6);border:1.5px solid rgba(255,228,92,.55);border-radius:14px;padding:9px 12px 10px;color:#fff;font:500 14.5px/1.35 var(--texte)}
.gd p{margin:0}.gd b{color:var(--fluo);font-weight:700}.gd .gd-l2{color:#cfc8ff;font-size:13.5px;margin-top:3px}
.gd-num{display:inline-block;background:var(--fluo);color:var(--encre);border-radius:6px;padding:0 6px;margin-right:6px;font-weight:800}
.gd-ok{margin-top:6px;color:#8fe3bb;font-size:13.5px}.gd-ok.ko{color:#ffb4a3}.gd mark{color:var(--encre)}
.gd-prog{display:flex;gap:4px;margin-top:8px}.gd-prog i{flex:1;height:5px;border-radius:99px;background:rgba(255,255,255,.16)}
.gd-prog i.ok{background:var(--fluo)}.gd-prog i.cur{background:rgba(255,228,92,.42)}
.gd-aide{margin-top:6px;color:#a9a2d6;font-size:12.5px}
.gd.gd-fin{background:var(--nuit);border-color:var(--fluo)}.gd .gd-q{font:700 16.5px/1.25 var(--titre);margin-bottom:6px}.gd.gd-fin p+p{margin-top:6px}
.gd .sim-btns{margin-top:10px}
.gd-n{display:inline-grid;place-items:center;min-width:20px;height:20px;padding:0 5px;margin-right:6px;border-radius:99px;background:rgba(255,255,255,.2);color:#fff;font:800 12px/1 var(--texte);vertical-align:1px}.gd-n[hidden]{display:none}
.gd-appel .gd-n{background:var(--fluo);color:var(--encre)}.on>.gd-n,.primary>.gd-n{background:var(--encre);color:#fff}.gd-fait .gd-n{background:var(--ok);color:#fff}
.gd-tard{opacity:.5}
.gd-appel{outline:2px solid var(--fluo);outline-offset:2px;animation:gd-appel 1.3s ease-in-out infinite}@keyframes gd-appel{50%{box-shadow:0 0 0 7px rgba(255,228,92,.45)}}
.sim-slider.gd-appel{border-radius:12px;padding:4px 8px;margin:-4px -8px}
`;
function injecterGuide(id) {
  let s = document.getElementById(id);
  if (!s) { s = document.createElement('style'); s.id = id; s.textContent = GD_CSS; document.head.appendChild(s); }
  s.dataset.n = (+s.dataset.n || 0) + 1;
  return () => { s.dataset.n = +s.dataset.n - 1; if (+s.dataset.n <= 0) s.remove(); };
}
// Carte du parcours, posée juste après `apres` : étape en cours (Fais / Observe), retour de la dernière action, progression ; puis la conclusion.
function guide(parent, apres) {
  const el = document.createElement('div'); el.className = 'gd'; el.setAttribute('aria-live', 'polite');
  parent.insertBefore(el, apres ? apres.nextSibling : parent.firstChild);
  let cle = '';
  return {
    el,
    etape({ i, total, faits, fais, obs = '', ok = '', aide = '' }) {
      const k = [i, total, [...faits], fais, obs, ok, aide].join('|'); if (k === cle) return; cle = k;
      el.className = 'gd';
      el.innerHTML = `<p><span class="gd-num">${i + 1}/${total}</span><b>Fais :</b> ${fais}</p>` + (obs ? `<p class="gd-l2"><b>Observe :</b> ${obs}</p>` : '') +
        (ok ? `<p class="gd-ok${ok[0] === '✗' ? ' ko' : ''}">${ok}</p>` : '') + `<span class="gd-prog">${Array.from({ length: total }, (_, j) => `<i class="${faits.has(j) ? 'ok' : j === i ? 'cur' : ''}"></i>`).join('')}</span>` +
        (aide ? `<p class="gd-aide">${aide}</p>` : '');
    },
    fin(html, refaire) {
      if (cle === 'fin' + html) return; cle = 'fin' + html;
      el.className = 'gd gd-fin'; el.innerHTML = html + '<div class="sim-btns"><button type="button" class="sim-btn">↺ Refaire le parcours</button></div>';
      el.querySelector('button').addEventListener('click', refaire);
    },
  };
}
// Numéro d'étape posé sur une commande. États : 'fait' (✓), 'appel' (prochaine action : clignote), 'tard' (pâle, étape à venir,
// mais toujours utilisable), '' (neutre), 'off' (parcours terminé : plus de numéro).
function marquer(elt, n) { const s = document.createElement('span'); s.className = 'gd-n'; s.textContent = n; s.setAttribute('aria-hidden', 'true'); (elt.querySelector('.sim-slider-top > span') || elt).prepend(s); return { el: elt, n: String(n), s }; }
function etatMarque(m, etat, pourquoi = '') {
  m.el.classList.toggle('gd-fait', etat === 'fait'); m.el.classList.toggle('gd-appel', etat === 'appel'); m.el.classList.toggle('gd-tard', etat === 'tard');
  m.s.hidden = etat === 'off'; const tx = etat === 'fait' ? '✓' : m.n; if (m.s.textContent !== tx) m.s.textContent = tx;
  if (etat === 'tard') m.el.title = pourquoi; else m.el.removeAttribute('title');
}
const AIDE = 'Boutons pâles : étapes à venir (tu peux déjà les essayer).';

// Interpolation linéaire entre les points du tableau
function theta(k, t) {
  const T = DATA[k].t, H = DATA[k].th;
  if (t <= T[0]) return H[0];
  for (let i = 1; i < T.length; i++) if (t <= T[i]) return lerp(H[i - 1], H[i], (t - T[i - 1]) / (T[i] - T[i - 1]));
  return H[H.length - 1];
}
function phase(k, t) {
  if (k === 'solid') return t < 4 ? 'refroidit' : t < 10 ? 'palier' : 'solide';
  if (DATA[k].palier) return t < DATA[k].palier[0] ? 'chauffe' : 'palier';
  return theta(k, t) < 100 ? 'chauffe' : 'bout';
}
function etat(k, ph) {
  if (k === 'solid') return ph === 'refroidit' ? 'liquide' : ph === 'palier' ? 'liquide + solide' : 'solide';
  return ph === 'chauffe' ? 'liquide' : 'liquide + gazeux';
}

// Dimensions du montage
const BR = 0.55, BH = 1.05, Y0 = 1.135, YL = 0.62, RM = BR - 0.09;

// Sites du réseau quand l'eau devient solide : molécules serrées, rangées (rangées du bas d'abord)
const SITES = (() => {
  const s = [], a = 0.165, n = Math.floor((2 * RM) / a) + 1;
  for (let y = 0.08; y < YL - 0.05; y += 0.15)
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      const x = (i - (n - 1) / 2) * a, z = (j - (n - 1) / 2) * a;
      if (x * x + z * z <= RM * RM) s.push([x, y, z]);
    }
  return s.sort((p, q) => p[1] - q[1] || (p[0] ** 2 + p[2] ** 2) - (q[0] ** 2 + q[2] ** 2));
})();
const N = SITES.length; // ≈ 96 molécules par bécher

// Un montage complet : bec Bunsen, trépied + grille, bécher, thermomètre sur statif, molécules, bulles
function makeRig(st) {
  const g = new THREE.Group(); st.scene.add(g);
  const metal = new THREE.MeshStandardMaterial({ color: C.metal, metalness: 0.55, roughness: 0.35 });
  const sombre = new THREE.MeshStandardMaterial({ color: 0x4a4766, metalness: 0.4, roughness: 0.55 });
  const mesh = (geo, mat, x, y, z, parent = g) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); parent.add(m); return m; };

  // bec Bunsen
  const burner = new THREE.Group(); g.add(burner);
  mesh(new THREE.CylinderGeometry(0.24, 0.28, 0.08, 32), sombre, 0, 0.04, 0, burner);
  const tube = mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.62, 20), metal, 0, 0.39, 0, burner);
  mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.08, 20), sombre, 0, 0.2, 0, burner);
  const flame = new THREE.Group(); flame.position.y = 0.7; burner.add(flame);
  const fmat = (c, o) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, blending: THREE.AdditiveBlending, depthWrite: false });
  mesh(new THREE.ConeGeometry(0.1, 0.4, 20, 1, true), fmat(0xff7a2e, 0.8), 0, 0.2, 0, flame);
  mesh(new THREE.ConeGeometry(0.05, 0.2, 16, 1, true), fmat(0xffe08a, 0.95), 0, 0.1, 0, flame);
  const fl = new THREE.PointLight(0xff8a3d, 0, 3); fl.position.y = 0.95; burner.add(fl);

  // trépied + grille
  const ring = mesh(new THREE.TorusGeometry(0.5, 0.02, 8, 40), metal, 0, 1.11, 0); ring.rotation.x = Math.PI / 2;
  for (let k = 0; k < 3; k++) { const a = k * 2.094 + 0.6; mesh(new THREE.CylinderGeometry(0.018, 0.018, 1.11, 8), metal, Math.cos(a) * 0.5, 0.555, Math.sin(a) * 0.5); }
  mesh(new THREE.BoxGeometry(1.3, 0.012, 1.3), new THREE.MeshStandardMaterial({ color: 0x6d6a80, metalness: 0.4, roughness: 0.6 }), 0, 1.122, 0);
  mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.012, 32), new THREE.MeshStandardMaterial({ color: 0xe8e2d6, roughness: 0.9 }), 0, 1.13, 0);

  // bécher et contenu
  const bk = beaker(BR, BH); bk.position.y = Y0; g.add(bk);
  const cyl = new THREE.CylinderGeometry(BR - 0.02, BR - 0.02, 1, 40); cyl.translate(0, 0.5, 0);
  const liqMat = liquidMaterial(C.eau, 0.3); liqMat.depthWrite = false;
  const liq = mesh(cyl, liqMat, 0, Y0 + 0.006, 0); liq.scale.y = YL;
  const ice = mesh(cyl.clone(), new THREE.MeshStandardMaterial({ color: C.glace, transparent: true, opacity: 0.5, roughness: 0.15, depthWrite: false }), 0, Y0 + 0.006, 0);
  ice.visible = false;

  // thermomètre (alcool coloré) tenu par un statif
  const th = new THREE.Group(); th.position.set(0.24, Y0, 0.16); g.add(th);
  const TB = 0.1, TT = 2.0;
  mesh(new THREE.CylinderGeometry(0.04, 0.04, TT - TB, 16), glassMaterial({ opacity: 0.35 }), 0, (TB + TT) / 2, 0, th);
  mesh(new THREE.SphereGeometry(0.055, 16, 12), new THREE.MeshStandardMaterial({ color: C.chaud, emissive: 0x551100 }), 0, TB, 0, th);
  const colGeo = new THREE.CylinderGeometry(0.018, 0.018, 1, 10); colGeo.translate(0, 0.5, 0);
  const col = mesh(colGeo, new THREE.MeshStandardMaterial({ color: C.chaud, emissive: 0x661a00 }), 0, TB, 0, th);
  const colH = (θ) => 0.12 + (TT - TB - 0.25) * clamp((θ + 20) / 130, 0, 1);
  // les 2 repères de la graduation : 0 °C et 100 °C
  for (const r of [0, 100]) { const m = mesh(new THREE.TorusGeometry(0.045, 0.008, 6, 20), new THREE.MeshBasicMaterial({ color: C.fluo }), 0, TB + colH(r), 0, th); m.rotation.x = Math.PI / 2; }
  const thTop = new THREE.Object3D(); thTop.position.y = TT + 0.16; th.add(thTop);
  const thMid = new THREE.Object3D(); thMid.position.y = 1.45; th.add(thMid);
  mesh(new THREE.BoxGeometry(0.5, 0.05, 0.4), sombre, 1.05, 0.025, 0.16);
  mesh(new THREE.CylinderGeometry(0.025, 0.025, 3.3, 10), metal, 1.15, 1.65, 0.16);
  const arm = mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.91, 8), metal, 0.695, Y0 + 1.8, 0.16); arm.rotation.z = Math.PI / 2;
  mesh(new THREE.BoxGeometry(0.1, 0.08, 0.1), sombre, 0.24, Y0 + 1.8, 0.16);

  // énergie cédée au milieu extérieur (solidification) : flèches bleues vers l'extérieur
  const fleches = new THREE.Group(); fleches.visible = false; g.add(fleches);
  const arrows = [];
  for (let k = 0; k < 4; k++) {
    const a = k * Math.PI / 2 + Math.PI / 4, d = new THREE.Vector3(Math.cos(a), 0, Math.sin(a));
    const ar = new THREE.ArrowHelper(d, new THREE.Vector3(), 0.45, C.froid, 0.16, 0.12); fleches.add(ar); arrows.push({ ar, d });
  }

  // molécules + leurs « queues » (plus la queue est longue, plus la molécule s'agite)
  const mol = molecules(N, { radius: 0.036, color: C.eau, segments: 10 }); g.add(mol.mesh);
  mol.mesh.material.emissive = new THREE.Color(0x1c1c24);
  const tailPos = new Float32Array(N * 6), tailCol = new Float32Array(N * 6);
  const tg = new THREE.BufferGeometry();
  tg.setAttribute('position', new THREE.BufferAttribute(tailPos, 3)); tg.setAttribute('color', new THREE.BufferAttribute(tailCol, 3));
  const tails = new THREE.LineSegments(tg, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.8 }));
  tails.frustumCulled = false; g.add(tails);
  const P = new Float32Array(N * 3), V = new Float32Array(N * 3), gas = new Uint8Array(N), ph0 = new Float32Array(N * 3);
  for (let i = 0; i < N * 3; i++) ph0[i] = rand(Math.PI * 2);

  // bulles (au sein du liquide pendant l'ébullition)
  const NB = 16, bub = molecules(NB, { radius: 0.065, color: 0xffffff, segments: 12 });
  Object.assign(bub.mesh.material, { transparent: true, opacity: 0.75, depthWrite: false, emissive: new THREE.Color(0xb8d4f0), roughness: 0.1 });
  g.add(bub.mesh);
  const B = Array.from({ length: NB }, () => ({ on: false, x: 0, y: 0, z: 0, s: 0 }));
  let bubTimer = 0;

  function liquidSpot(i, yMin = 0.06) {
    const a = rand(Math.PI * 2), r = RM * Math.sqrt(Math.random());
    P[i * 3] = Math.cos(a) * r; P[i * 3 + 1] = rand(yMin, YL - 0.05); P[i * 3 + 2] = Math.sin(a) * r; gas[i] = 0;
    V[i * 3] = rand(-1, 1); V[i * 3 + 1] = rand(-1, 1); V[i * 3 + 2] = rand(-1, 1);
  }
  function reset() { for (let i = 0; i < N; i++) liquidSpot(i); B.forEach((b) => (b.on = false)); }
  reset();

  const cMol = new THREE.Color(), cTail = new THREE.Color();
  let flameOn = false;

  function update(dt, time, θ, ph, k) {
    const u = clamp((θ + 20) / 130, 0, 1);             // niveau d'agitation 0 → 1
    const speed = 0.04 + 0.95 * u * u;
    const boil = (k !== 'solid' && ph === 'palier') || ph === 'bout';
    const f = k !== 'solid' ? 0 : ph === 'refroidit' ? 0 : ph === 'palier' ? clamp(phaseFrac, 0, 1) : 1;
    const nSolid = Math.round(f * N);
    const yMin = nSolid ? SITES[nSolid - 1][1] + 0.08 : 0.06;
    tempColor(clamp(θ / 100, 0, 1), cMol);
    let nGas = 0; for (let i = 0; i < N; i++) nGas += gas[i];

    for (let i = 0; i < N; i++) {
      const o = i * 3;
      let x = P[o], y = P[o + 1], z = P[o + 2];
      if (i < nSolid) {
        // solide : la molécule rejoint sa place et vibre sur place
        const s = SITES[i], amp = 0.008 + 0.06 * u, w = 9;
        const tx = s[0] + amp * Math.sin(w * time + ph0[o]), ty = s[1] + amp * Math.sin(w * time + ph0[o + 1]), tz = s[2] + amp * Math.sin(w * time + ph0[o + 2]);
        const kk = 1 - Math.exp(-5 * dt);
        const nx = lerp(x, tx, kk), ny = lerp(y, ty, kk), nz = lerp(z, tz, kk);
        V[o] = (nx - x) / Math.max(dt, 1e-3); V[o + 1] = (ny - y) / Math.max(dt, 1e-3); V[o + 2] = (nz - z) / Math.max(dt, 1e-3);
        x = nx; y = ny; z = nz;
      } else if (gas[i]) {
        // gaz : la molécule s'échappe et occupe tout l'espace au-dessus
        V[o] += rand(-1, 1) * 1.2 * dt; V[o + 2] += rand(-1, 1) * 1.2 * dt;
        x += V[o] * dt; y += V[o + 1] * dt; z += V[o + 2] * dt;
        const r = Math.hypot(x, z);
        if (y < BH && r > BR - 0.04) { x *= (BR - 0.04) / r; z *= (BR - 0.04) / r; V[o] *= -0.5; V[o + 2] *= -0.5; }
        if (y > BH + 1.15 || r > 2.2) { liquidSpot(i, yMin); x = P[o]; y = P[o + 1]; z = P[o + 2]; }
      } else {
        // liquide : les molécules roulent les unes sur les autres, de plus en plus vite
        V[o] += rand(-1, 1) * 6 * dt; V[o + 1] += rand(-1, 1) * 6 * dt; V[o + 2] += rand(-1, 1) * 6 * dt;
        const vl = Math.hypot(V[o], V[o + 1], V[o + 2]) || 1;
        V[o] *= speed / vl; V[o + 1] *= speed / vl; V[o + 2] *= speed / vl;
        x += V[o] * dt; y += V[o + 1] * dt; z += V[o + 2] * dt;
        const r = Math.hypot(x, z);
        if (r > RM) { const nx = x / r, nz = z / r, vn = V[o] * nx + V[o + 2] * nz; if (vn > 0) { V[o] -= 2 * vn * nx; V[o + 2] -= 2 * vn * nz; } x = nx * RM; z = nz * RM; }
        if (y < yMin) { y = yMin; V[o + 1] = Math.abs(V[o + 1]); }
        if (y > YL - 0.04) { y = YL - 0.04; V[o + 1] = -Math.abs(V[o + 1]); }
        if (boil && y > YL - 0.12 && nGas < N * 0.2 && Math.random() < 1.4 * dt) {
          gas[i] = 1; nGas++; V[o] = rand(-0.2, 0.2); V[o + 1] = rand(0.55, 0.85); V[o + 2] = rand(-0.2, 0.2);
        }
      }
      P[o] = x; P[o + 1] = y; P[o + 2] = z;
      mol.setPos(i, x, Y0 + y, z); mol.setColor(i, cMol);
      const q = i * 6, kq = gas[i] ? 0.22 : 0.16;
      tailPos[q] = x; tailPos[q + 1] = Y0 + y; tailPos[q + 2] = z;
      tailPos[q + 3] = x - V[o] * kq; tailPos[q + 4] = Y0 + y - V[o + 1] * kq; tailPos[q + 5] = z - V[o + 2] * kq;
      cTail.copy(cMol).multiplyScalar(0.25);
      tailCol[q] = cMol.r; tailCol[q + 1] = cMol.g; tailCol[q + 2] = cMol.b; tailCol[q + 3] = cTail.r; tailCol[q + 4] = cTail.g; tailCol[q + 5] = cTail.b;
    }
    mol.commit(); tg.attributes.position.needsUpdate = true; tg.attributes.color.needsUpdate = true;

    // bulles
    bubTimer += dt;
    if (boil && bubTimer > 0.13) { bubTimer = 0; const b = B.find((bb) => !bb.on); if (b) { const a = rand(6.28), r = rand(0.35); Object.assign(b, { on: true, x: Math.cos(a) * r, y: 0.05, z: Math.sin(a) * r, s: 0.4 }); } }
    B.forEach((b, i) => {
      if (b.on) { b.y += (0.3 + b.s * 0.35) * dt; b.s = Math.min(1.5, b.s + 0.9 * dt); b.x += Math.sin(time * 7 + i) * 0.1 * dt; if (b.y > YL - 0.03) b.on = false; }
      bub.setPos(i, b.x, b.on ? Y0 + b.y : -99, b.z, b.s);
    });
    bub.commit();

    // glace qui monte depuis le fond pendant le palier de solidification
    ice.visible = f > 0.001; ice.scale.y = Math.max(0.001, f * YL);
    liq.visible = f < 0.999; liq.position.y = Y0 + 0.006 + f * YL; liq.scale.y = Math.max(0.001, (1 - f) * YL);

    // thermomètre, flamme, flèches
    col.scale.y = lerp(col.scale.y, colH(θ), 1 - Math.exp(-8 * dt));
    flame.visible = flameOn;
    if (flameOn) { const fk = 1 + Math.sin(time * 23) * 0.05 + Math.sin(time * 37) * 0.04; flame.scale.set(1, fk, 1); fl.intensity = 1.6 * fk; } else fl.intensity = 0;
    if (fleches.visible) arrows.forEach(({ ar, d }, j) => { const s = 0.62 + ((time * 0.5 + j * 0.25) % 1) * 0.25; ar.position.set(d.x * s, Y0 + 0.32, d.z * s); });
  }
  let phaseFrac = 0;

  return {
    g, update, reset, thTop, thMid, tube,
    anchors: { bulles: new THREE.Vector3(-BR, Y0 + 0.3, 0), gaz: new THREE.Vector3(-0.25, Y0 + BH + 0.8, 0), glace: new THREE.Vector3(-BR, Y0 + 0.15, 0), froid: new THREE.Vector3(0, 0.55, 0.3) },
    setFrac(v) { phaseFrac = v; },
    setFlame(on) { flameOn = on; },
    setKind(k) {
      liqMat.color.set(INFO[k].liq); liqMat.opacity = INFO[k].op;
      burner.visible = k !== 'solid'; fleches.visible = k === 'solid';
      reset();
    },
  };
}

export default function mount(root) {
  const { stageEl, panelEl, explainEl } = layout(root);
  const st = createStage(stageEl, { camera: { pos: [0.8, 2.7, 6.3], target: [0.2, 1.7, 0] }, minDistance: 3, maxDistance: 13 });
  st.scene.add(ground(40));
  const rigs = [makeRig(st), makeRig(st)];
  const ex = explain(explainEl);

  // étiquettes
  const L = {
    bec: st.label('bec Bunsen', rigs[0].tube, { offset: [-0.75, 0.1, 0], cls: 'discret' }),
    thermo: st.label('thermomètre', rigs[0].thMid, { offset: [0.55, 0, 0], cls: 'discret' }),
    th0: st.label('θ', rigs[0].thTop, { cls: 'chaud' }),
    th1: st.label('θ', rigs[1].thTop, { cls: 'chaud' }),
    bulles: st.label('bulles', rigs[0].anchors.bulles, { offset: [-0.45, 0, 0] }),
    gaz: st.label('molécules qui s\'échappent', rigs[0].anchors.gaz, { offset: [-0.55, 0, 0] }),
    glace: st.label('état solide', rigs[0].anchors.glace, { offset: [-0.55, 0, 0] }),
    froid: st.label('énergie cédée au milieu extérieur', rigs[0].anchors.froid, { cls: 'froid' }),
  };

  // état de l'expérience
  let key = 'pure', cmp = false, t = 0, playing = false, tMax = 14, lastDrawn = -1, userCam = false;
  const camGoal = { pos: new THREE.Vector3(), tgt: new THREE.Vector3() };
  // cadrage : tout le montage (ou les deux montages) tient dans l'écran, quelle que soit sa forme
  function fitCam() {
    const tf = Math.tan(THREE.MathUtils.degToRad(st.camera.fov / 2)), a = Math.max(0.3, st.camera.aspect);
    const [w, h] = cmp ? [5.4, 3.9] : [3.3, 3.9];
    const d = Math.max(h / (2 * tf), w / (2 * tf * a));
    camGoal.tgt.set(cmp ? 0.3 : 0.15, 1.7, 0);
    camGoal.pos.copy(camGoal.tgt).addScaledVector(new THREE.Vector3(cmp ? 0 : 0.12, 0.17, 1).normalize(), d);
  }
  const keys = () => (cmp ? ['pure', 'salee'] : [key]);

  // réglages (la carte du parcours vient juste sous le titre)
  const retirerGuide = injecterGuide('gd-style-eb');
  const ui = panel(panelEl);
  const gd = guide(panelEl, ui.title('Le graphique de l\'ébullition : palier ou pas ?'));
  const choice = ui.choice({
    label: 'Le liquide', value: 'pure',
    options: [{ value: 'pure', label: 'Eau pure' }, { value: 'salee', label: 'Eau salée' }, { value: 'grenadine', label: 'Eau-grenadine' }, { value: 'solid', label: 'Solidification' }],
    onChange: (v) => setMode(v, false),
  });
  // un seul bouton Chauffer ↔ Pause
  const [bPlay, , bCmp] = ui.buttons([
    { label: '▶ Chauffer', primary: true, onClick: () => { if (playing) playing = false; else { if (t >= tMax - 1e-6) restart(); playing = true; } refresh(true); } },
    { label: '↺ Recommencer', onClick: () => { restart(); refresh(true); } },
    { label: '⇄ Comparer', onClick: () => setMode('pure', !cmp) },
  ]);
  const sT = ui.slider({ label: 'Temps écoulé (t)', min: 0, max: 14, step: 0.1, value: 0, unit: 'min', format: fmt, onInput: (v) => { playing = false; t = Math.min(v, tMax); refresh(true); } });
  const rTh = ui.readout('Température (θ)');
  const rEt = ui.readout('État de l\'eau');
  const gTitle = ui.note('');
  const gWrap = document.createElement('div'); panelEl.appendChild(gWrap);
  const legend = ui.note('');
  const vocab = document.createElement('details'); vocab.className = 'sim-note';
  vocab.innerHTML = '<summary style="cursor:pointer;min-height:28px"><b>Les variables du graphique</b></summary><b>Variable contrôlée</b> : le temps (axe horizontal, en minutes).<br><b>Variable dépendante</b> : la température (axe vertical, en °C).<br><b>Variables maintenues constantes</b> : le débit d\'énergie thermique et la masse d\'eau chauffée.';
  panelEl.appendChild(vocab);
  let graph = null, graphCfg = '';
  // le graphique remonte juste sous les boutons : il reste à l'écran pendant qu'il se trace
  bPlay.parentElement.after(gTitle, gWrap, legend);

  // parcours guidé : un numéro par étape sur sa commande (les 4 liquides et « Comparer »)
  const opt = {}; choice.el.querySelectorAll('button').forEach((b) => { opt[b.dataset.v] = b; });
  const M = ETAPES.map((e, j) => marquer(e.k === 'cmp' ? bCmp : opt[e.k], j + 1));
  let guideOn = !lireMemo().fini, dernier = '';
  const faits = new Set();
  function majGuide() {
    const finCourbe = t >= tMax - 1e-6, cle = cmp ? 'cmp' : key;
    if (guideOn && finCourbe) {          // la courbe est tracée jusqu'au bout : l'étape de ce liquide est faite
      const j = ETAPES.findIndex((e) => e.k === cle);
      if (j >= 0 && !faits.has(j)) { faits.add(j); dernier = '✓ ' + ETAPES[j].bravo; }
      if (faits.size === ETAPES.length) { guideOn = false; ecrireMemo({ fini: true }); }
    }
    const i = guideOn ? ETAPES.findIndex((_, j) => !faits.has(j)) : -1, e = ETAPES[i];
    const pret = i >= 0 && e.k === cle;                 // le bon liquide est choisi : il reste à chauffer
    ETAPES.forEach((x, j) => etatMarque(M[j], i < 0 ? 'off' : faits.has(j) ? 'fait' : j === i ? (pret ? '' : 'appel') : x.k === cle ? '' : 'tard',
      `Étape ${j + 1} : après « ${j ? ETAPES[j - 1].nom : ''} »`));
    // une seule action principale : Chauffer seulement quand c'est la prochaine chose à faire
    bPlay.classList.toggle('primary', i < 0 || (pret && !playing)); bPlay.classList.toggle('gd-appel', pret && !playing);
    if (i < 0) { gd.fin(FIN, refaireParcours); return; }
    // consignes courtes (une ligne) : la carte ne change pas de hauteur au moment du clic, les boutons ne bougent pas sous le doigt
    const verbe = e.k === 'solid' ? 'Refroidir' : 'Chauffer';
    const fais = !pret ? (e.k === 'cmp' ? 'Appuie sur « ⇄ Comparer ».' : `Choisis « ${e.nom} ».`)
      : playing ? 'Regarde la courbe se tracer.' : t > 0 ? `▶ ${verbe} pour continuer.` : `Appuie sur ▶ ${verbe}.`;
    gd.etape({ i, total: ETAPES.length, faits, fais, obs: e.obs, ok: dernier, aide: i < ETAPES.length - 1 ? AIDE : '' });
  }
  function refaireParcours() { faits.clear(); dernier = ''; guideOn = true; ecrireMemo({ fini: false }); setMode('pure', false); }

  function makeGraph() {
    const solid = !cmp && key === 'solid';
    const cfg = solid ? 'solid' : !cmp && key === 'grenadine' ? 'g' : 'h';
    if (cfg === graphCfg) return;
    graphCfg = cfg; if (graph) graph.dispose();
    graph = miniGraph(gWrap, solid
      ? { xMax: 14, xStep: 1, yMin: -20, yMax: 30, yStep: 10, xLabel: 't (min)', yLabel: 'θ (°C)', height: 185 }
      : { xMax: cfg === 'g' ? 20 : 14, xStep: cfg === 'g' ? 2 : 1, yMin: 0, yMax: 110, yStep: 10, xLabel: 't (min)', yLabel: 'θ (°C)', height: 185 });
  }

  function drawGraph() {
    graph.clear();
    const series = [];
    for (const k of keys()) {
      const d = DATA[k], tt = Math.min(t, tMaxOf(k));
      const meas = d.t.map((x, i) => [x, d.th[i]]).filter(([x]) => x <= tt + 1e-6);
      const line = meas.slice(); if (!meas.length || meas[meas.length - 1][0] < tt) line.push([tt, theta(k, tt)]);
      series.push({ points: line, color: INFO[k].trait });
      if (!d.allure) series.push({ points: meas, color: INFO[k].trait, dots: true });
      if (d.palier && t >= d.palier[0]) graph.mark({ x0: d.palier[0], x1: Math.min(t, d.palier[1]), label: 'palier' });
    }
    graph.setSeries(series);
  }

  function restart() { t = 0; playing = false; rigs.forEach((r) => r.reset()); }

  function setMode(k, compare) {
    key = k; cmp = compare; restart();
    choice.set(cmp ? null : k); bCmp.classList.toggle('on', cmp);
    tMax = cmp ? 14 : tMaxOf(k);
    sT.input.max = tMax; sT.set(0);
    rigs[0].setKind(k); rigs[1].setKind('salee');
    rigs[1].g.visible = cmp;
    rigs[0].g.position.x = cmp ? -1.35 : 0; rigs[1].g.position.x = 1.35;
    userCam = false;
    gTitle.innerHTML = cmp ? '<b>Eau pure et eau salée, sur la même échelle</b>' : '<b>' + INFO[k].titre + '</b>';
    legend.innerHTML = cmp
      ? '<b style="color:#ff8a6b">━ eau pure</b> &nbsp; <b style="color:#b49cff">━ eau salée</b> (le tableau de l\'eau salée s\'arrête à 10 min)'
      : k === 'solid' ? 'Pas de points mesurés : seulement l\'allure de la courbe.' : '';
    legend.style.display = legend.innerHTML ? '' : 'none';
    makeGraph(); lastDrawn = -1; refresh(true);
  }

  function texte() {
    const started = t > 0 || playing, fin = t >= tMax - 1e-6;
    if (cmp) {
      if (!started) return 'Appuie sur <b>Chauffer</b> : les deux courbes se tracent sur le <mark>même graphique</mark>, avec la même échelle.';
      if (fin) return 'Sur le premier graphique (eau pure), on constate la présence d\'un <mark>palier</mark> qui n\'apparaît pas sur le deuxième (eau salée). Le premier est un <mark>corps pur</mark>, le deuxième un <mark>mélange</mark>.';
      if (t >= 10) return 'L\'eau pure <mark>bout</mark> et sa température reste constante : <mark>palier</mark>. L\'eau salée, elle, n\'a pas de palier : sa température a continué de monter.';
      if (t >= 6) return 'L\'eau salée <mark>bout</mark> (des bulles se forment au sein du liquide) mais sa température <mark>continue de monter</mark>. L\'eau pure, elle, chauffe encore.';
      return 'On fournit de l\'<mark>énergie</mark> aux deux liquides : leur température <mark>augmente</mark> et les molécules <mark>s\'agitent</mark> de plus en plus.';
    }
    const ph = phase(key, t), nom = INFO[key].nom;
    if (key === 'solid') {
      if (!started) return 'Ici, on refroidit l\'eau. Appuie sur <b>Refroidir</b> : l\'eau cède son énergie au <mark>milieu extérieur</mark>.';
      if (ph === 'refroidit') return 'En abaissant la température, il y a une <mark>diminution de l\'agitation moléculaire</mark> : les molécules perdent de l\'énergie, elles la cèdent au milieu ambiant. État <mark>liquide</mark>.';
      if (ph === 'palier') return 'La température reste constante : <mark>palier</mark>. L\'énergie cédée au milieu extérieur permet le <mark>changement d\'état</mark> : l\'eau passe de l\'état liquide à l\'état <mark>solide</mark>.';
      return 'Toute l\'eau est à l\'état <mark>solide</mark> : les molécules sont rangées et vibrent sur place. La température peut à nouveau descendre.';
    }
    if (!started) return 'Appuie sur <b>Chauffer</b> : le bec Bunsen fournit de l\'énergie à l\'' + nom + ' et le graphique se trace <mark>point par point</mark>, comme sur ta feuille.';
    if (ph === 'chauffe') return 'En chauffant l\'' + nom + ', on fournit de l\'<mark>énergie</mark> : la température <mark>augmente</mark> et ses molécules <mark>s\'agitent</mark> de plus en plus. État <mark>liquide</mark>.';
    if (key === 'pure') {
      if (fin) return 'Pendant le palier, l\'eau <mark>bout</mark> : c\'est la <mark>température d\'ébullition</mark>, environ 100 °C (le tableau indique 99 °C). Un palier → l\'eau pure est un <mark>corps pur</mark>.';
      return 'À un moment donné, la température reste constante : on note la présence d\'un <mark>palier</mark>. Durant ce laps de temps, l\'énergie apportée est utilisée pour effectuer le <mark>changement d\'état</mark> : l\'eau passe de l\'état liquide à l\'état gazeux.';
    }
    if (fin) return 'Pas de palier → l\'' + nom + ' n\'est pas un corps pur : c\'est un <mark>mélange</mark>.' + (key === 'salee' ? ' Appuie sur <b>Comparer</b> pour la voir à côté de l\'eau pure.' : ' S\'il y avait eu un palier, on aurait été en présence d\'un corps pur.');
    if (key === 'grenadine') return 'Lors de l\'ébullition, on observe simultanément <mark>2 états</mark> de la matière : l\'état liquide et l\'état gazeux. Mais la température continue de monter : <mark>pas de palier</mark>.';
    return 'Des <mark>bulles</mark> se forment au sein du liquide : l\'eau salée bout… mais sa température <mark>continue de monter</mark> : pas de palier.';
  }

  function refresh(force) {
    if (force || Math.abs(t - lastDrawn) >= 0.04) { drawGraph(); lastDrawn = t; }
    const ks = keys(), ths = ks.map((k) => theta(k, Math.min(t, tMaxOf(k))));
    rTh.set(ths.map((v) => fmt(Math.round(v)) + ' °C').join(' / '));
    const ets = ks.map((k) => etat(k, phase(k, Math.min(t, tMaxOf(k)))));
    rEt.set(ets.length > 1 && ets[0] === ets[1] ? 'les deux : ' + ets[0] : ets.join(' / '));
    ex.set(texte());
    // étiquettes
    const k0 = ks[0], ph0 = phase(k0, t), boil0 = (ph0 === 'palier' && k0 !== 'solid') || ph0 === 'bout';
    const lab = (Lb, k, v) => { Lb.set((cmp ? INFO[k].nom + ' · ' : '') + 'θ = ' + fmt(Math.round(v)) + ' °C'); Lb.el.className = 'sim-label ' + (v < 30 ? 'froid' : 'chaud'); };
    lab(L.th0, k0, ths[0]); L.th1.show(cmp); if (cmp) lab(L.th1, 'salee', ths[1]);
    L.bec.show(!cmp && key !== 'solid'); L.thermo.show(!cmp);
    L.bulles.show(!cmp && boil0); L.gaz.show(!cmp && boil0);
    L.glace.show(!cmp && key === 'solid' && ph0 !== 'refroidit'); L.froid.show(!cmp && key === 'solid' && (t > 0 || playing));
    bPlay.textContent = playing ? '❚❚ Pause' : key === 'solid' && !cmp ? '▶ Refroidir' : '▶ Chauffer';
    majGuide();
  }

  const step = st.onFrame((dt, time) => {
    if (playing) {
      t = Math.min(tMax, t + dt * SPEED); sT.set(t);
      if (t >= tMax) playing = false;
      refresh(!playing);
    }
    const ks = keys();
    ks.forEach((k, i) => {
      const r = rigs[i], tt = Math.min(t, tMaxOf(k)), ph = phase(k, tt);
      r.setFlame(k !== 'solid' && (t > 0 || playing));
      r.setFrac(DATA[k].palier ? clamp((tt - DATA[k].palier[0]) / (DATA[k].palier[1] - DATA[k].palier[0]), 0, 1) : 0);
      r.update(dt, time, theta(k, tt), ph, k);
    });
    // cadrage automatique tant que l'élève n'a pas tourné la caméra (suit aussi les changements de taille)
    if (!userCam) {
      fitCam();
      const a = 1 - Math.exp(-4 * dt);
      st.camera.position.lerp(camGoal.pos, a); st.controls.target.lerp(camGoal.tgt, a);
    }
  });

  // paramètres d'URL pour le banc d'essai (sans effet sur le site) : ?eb_liq=salee&eb_cmp=1&eb_t=8
  const q = new URLSearchParams(location.search);
  setMode(DATA[q.get('eb_liq')] ? q.get('eb_liq') : 'pure', q.get('eb_cmp') === '1');
  let warmT = 0;
  if (q.has('eb_t')) {
    t = clamp(+q.get('eb_t') || 0, 0, tMax); sT.set(t); refresh(true);
    // capture sans écran : laisse la scène se stabiliser une fois la page mise en place
    warmT = setTimeout(() => { for (let i = 0; i < 240; i++) step(1 / 60, i / 60); }, 300);
  }

  // l'utilisateur tourne la caméra : on arrête le recadrage automatique
  const stopCam = () => (userCam = true);
  st.renderer.domElement.addEventListener('pointerdown', stopCam);
  st.renderer.domElement.addEventListener('wheel', stopCam, { passive: true });

  return {
    dispose() {
      clearTimeout(warmT);
      st.renderer.domElement.removeEventListener('pointerdown', stopCam);
      st.renderer.domElement.removeEventListener('wheel', stopCam);
      if (graph) graph.dispose();
      st.dispose(); retirerGuide();
    },
  };
}
