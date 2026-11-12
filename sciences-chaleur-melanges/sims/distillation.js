// distillation.js — « L'appareil à distillation » (thème 6, méthode 5 ; schéma « à bien connaître »).
// Le ballon chauffe, la vapeur monte, se condense dans le tube réfrigérant si l'eau froide circule, et tombe dans le berlin.
// Guidé en 5 étapes : le mélange → ouvrir l'eau froide → chauffer → récolter puis arrêter de chauffer → conclure.
import { THREE, C, layout, createStage, panel, explain, glassMaterial, liquidMaterial, beaker, ground, molecules, tempColor, clamp, lerp, rand } from './kit.js';

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

const V3 = (x, y, z = 0) => new THREE.Vector3(x, y, z);
// Les légendes EXACTES du schéma dessiné du cours
const LEG = ['le bouchon', 'le ballon à fond plat', 'le liquide', 'la plaque chauffante', 'le tube réfrigérant',
  "sortie d'eau froide", "entrée d'eau froide", 'le berlin', 'le distillat'];
const ALC = 0xc4a8ff;      // couleur pour suivre l'alcool (en vrai : incolore)
// Température d'ébullition du mélange eau + alcool selon la part d'alcool (valeurs réelles approchées)
const TEB_ALC = [[0, 100], [0.03, 97], [0.1, 91], [0.2, 86.5], [0.3, 84], [0.5, 81], [1, 78]];
function interp(tab, x) {
  for (let i = 1; i < tab.length; i++) if (x <= tab[i][0]) { const [a, ya] = tab[i - 1], [b, yb] = tab[i]; return lerp(ya, yb, (x - a) / (b - a)); }
  return tab[tab.length - 1][1];
}

// Ballon à fond plat : sphère (rayon R, centre YC) coupée à plat en bas, puis le col.
const R = 0.7, YC = 0.55, RCOL = 0.16, YCOL = YC + Math.sqrt(R * R - RCOL * RCOL), HCOL = 1.85;
const rBallon = (y) => (y < YCOL ? Math.sqrt(Math.max(0, R * R - (y - YC) ** 2)) : RCOL);
const volBallon = (h) => Math.PI * (R * R * h - ((h - YC) ** 3 + YC ** 3) / 3);
function hauteur(v) { let a = 0, b = YCOL - 0.02; for (let k = 0; k < 24; k++) { const m = (a + b) / 2; if (volBallon(m) < v) a = m; else b = m; } return (a + b) / 2; }
const XB = -2.3, Y0 = 0.27, H0 = 0.62, V0 = 250, DV = 0.12;   // 250 mL au départ ; une particule de vapeur = 0,12 mL
const A = V3(-1.35, 2.5), B = V3(1.7, 1.25);                     // le tube réfrigérant, du haut (A) vers le bas (B)
const J0 = 0.3, J1 = 2.85, RJ = 0.21, XD = 1.75;                 // double paroi le long de A→B ; berlin en XD

function liquidGeo(h) {
  const pts = [new THREE.Vector2(0, 0.012)];
  for (let i = 0; i <= 18; i++) { const y = 0.012 + (h - 0.012) * i / 18; pts.push(new THREE.Vector2(Math.max(0.01, rBallon(y) - 0.02), y)); }
  pts.push(new THREE.Vector2(0, h));
  return new THREE.LatheGeometry(pts, 40);
}

export default function mount(root) {
  const retirerStyle = gxStyle();
  const { stageEl, panelEl, explainEl } = layout(root);
  const st = createStage(stageEl, { camera: { pos: [-0.4, 2.8, 7.2], target: [-0.4, 1.4, 0], fov: 40 }, maxDistance: 18 });
  const S = st.scene, ex = explain(explainEl);
  const std = (color, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color, roughness: 0.5 }, o));
  const add = (m, x = 0, y = 0, z = 0) => { m.position.set(x, y, z); S.add(m); return m; };
  S.add(ground(13));

  // --- La plaque chauffante
  add(new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.24, 1.25), std(0xd9dbe6)), XB, 0.12);
  const hotMat = std(0x2b2838, { emissive: new THREE.Color(C.chaud), emissiveIntensity: 0 });
  add(new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.03, 40), hotMat), XB, 0.255);
  add(new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.07, 16), std(0x3a3550)), XB + 0.52, 0.12, 0.64).rotation.x = Math.PI / 2;

  // --- Le ballon à fond plat, le liquide, les pierres poreuses, le bouchon
  const prof = [];
  for (let i = 0; i <= 26; i++) { const y = YCOL * i / 26; prof.push(new THREE.Vector2(rBallon(y), y)); }
  prof.push(new THREE.Vector2(RCOL, HCOL));
  const ballon = add(new THREE.Mesh(new THREE.LatheGeometry(prof, 48), glassMaterial({ opacity: 0.22 })), XB, Y0);
  const fond = new THREE.Mesh(new THREE.CircleGeometry(rBallon(0), 40), glassMaterial({ opacity: 0.3 }));
  fond.rotation.x = -Math.PI / 2; fond.position.y = 0.004; ballon.add(fond);
  const liqMat = liquidMaterial(C.eau, 0.62);
  const liq = add(new THREE.Mesh(new THREE.BufferGeometry(), liqMat), XB, Y0);
  let hBuilt = -1;
  const setLevel = (h) => { if (Math.abs(h - hBuilt) < 0.004) return; hBuilt = h; liq.geometry.dispose(); liq.geometry = liquidGeo(h); };
  const pierre = std(0x8d8798, { roughness: 0.95 });
  for (let i = 0; i < 5; i++) add(new THREE.Mesh(new THREE.DodecahedronGeometry(0.035 + (i % 2) * 0.012), pierre), XB + Math.cos(i * 1.3) * 0.22, Y0 + 0.045, Math.sin(i * 1.3) * 0.22);
  const sel = add(new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.41, 1, 32), std(0xf4f4f8, { roughness: 0.95 })), XB, Y0);
  sel.visible = false;
  add(new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.15, 0.3, 32), std(0xa8784a, { roughness: 0.85 })), XB, Y0 + HCOL - 0.08);

  // --- Le chemin de la vapeur : col → tube coudé → tube réfrigérant (A→B)
  const d = B.clone().sub(A).normalize(), nUp = V3(-d.y, d.x), zAx = V3(0, 0, 1);
  const neckBot = V3(XB, Y0 + YCOL), P1 = V3(XB, Y0 + HCOL + 0.32);
  const ctrl = A.clone().addScaledVector(d, -(A.x - XB) / d.x);
  const bend = new THREE.QuadraticBezierCurve3(P1, ctrl, A);
  const path = new THREE.CurvePath(); path.add(new THREE.LineCurve3(neckBot, P1)); path.add(bend); path.add(new THREE.LineCurve3(A, B));
  const glassPath = new THREE.CurvePath(); glassPath.add(new THREE.LineCurve3(V3(XB, Y0 + HCOL - 0.2), P1)); glassPath.add(bend); glassPath.add(new THREE.LineCurve3(A, B));
  S.add(new THREE.Mesh(new THREE.TubeGeometry(glassPath, 140, 0.055, 12, false), glassMaterial({ opacity: 0.34 })));
  const L = path.getLength(), uA = 1 - A.distanceTo(B) / L, uAt = (s) => uA + s / L;
  const jPos = (s) => A.clone().addScaledVector(d, s);
  const q = new THREE.Quaternion().setFromUnitVectors(V3(0, 1, 0), d);
  function cylAlong(r, s0, s1, mat, open = true) {
    const m = add(new THREE.Mesh(new THREE.CylinderGeometry(r, r, s1 - s0, 40, 1, open), mat)); m.position.copy(jPos((s0 + s1) / 2)); m.quaternion.copy(q); return m;
  }
  // --- Le tube réfrigérant : double paroi (la vapeur au centre, l'eau froide autour)
  cylAlong(RJ, J0, J1, glassMaterial({ opacity: 0.2 }));
  const eauMat = liquidMaterial(C.froid, 0); eauMat.depthWrite = false;
  cylAlong(RJ - 0.012, J0 + 0.02, J1 - 0.02, eauMat, false);
  for (const s of [J0, J1]) { const ring = add(new THREE.Mesh(new THREE.RingGeometry(0.055, RJ, 32), glassMaterial({ opacity: 0.4 }))); ring.position.copy(jPos(s)); ring.lookAt(jPos(s).add(d)); }
  const nozMat = glassMaterial({ opacity: 0.45 });
  function embout(s, dir) {
    const len = RJ + 0.16, m = add(new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, len, 16, 1, true), nozMat));
    m.position.copy(jPos(s)).addScaledVector(dir, len / 2); m.quaternion.setFromUnitVectors(V3(0, 1, 0), dir);
    return jPos(s).addScaledVector(dir, len);
  }
  const tipSortie = embout(0.5, nUp), tipEntree = embout(2.62, nUp.clone().negate());   // sortie en haut, entrée en bas
  const hoseGrey = new THREE.Color(0x6f6a85), hoseBlue = new THREE.Color(C.froid);
  const hoseMat = new THREE.MeshStandardMaterial({ color: 0x6f6a85, transparent: true, opacity: 0.85, roughness: 0.6 });
  const hose = (pts) => S.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 60, 0.05, 10, false), hoseMat));
  hose([tipEntree, tipEntree.clone().add(V3(0, -0.2, -0.2)), tipEntree.clone().add(V3(0, -0.45, -0.9)), V3(tipEntree.x, 0.05, -1.7)]);
  hose([tipSortie, tipSortie.clone().add(V3(0, 0.2, -0.2)), tipSortie.clone().add(V3(0, 0.1, -0.9)), V3(tipSortie.x, 0.05, -1.8)]);
  const arrows = [tipEntree, tipSortie].map((p, k) => {   // flèches : l'eau froide monte de l'entrée vers la sortie
    const m = add(new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.18, 16), std(C.froid, { emissive: new THREE.Color(C.froid), emissiveIntensity: 0.5 })));
    m.position.copy(p).add(V3(0, 0, 0.22)).addScaledVector(nUp, k ? 0.12 : -0.15); m.quaternion.setFromUnitVectors(V3(0, 1, 0), nUp); return m;
  });

  // --- Le berlin et le distillat
  add(beaker(0.42, 0.85), XD, 0);
  const distMat = liquidMaterial(C.eau, 0.75);
  const dist = add(new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 1, 40), distMat), XD, 0);
  const hDist = (v) => (v / V0) * 0.6;

  // --- Particules : vapeur / gouttes, bulles d'ébullition, eau froide qui circule
  const NV = 260, vap = molecules(NV, { radius: 0.045, color: C.vapeur, segments: 8 }); S.add(vap.mesh);
  const P = Array.from({ length: NV }, () => ({ st: 0 }));
  const NB = 30, bub = molecules(NB, { radius: 0.028, color: 0xf2f8ff, segments: 6 }); S.add(bub.mesh);
  const bb = Array.from({ length: NB }, () => ({ y: rand(0, 0.5), a: rand(0, 6.28), r: rand(0, 0.8) }));
  const NF = 40, flow = molecules(NF, { radius: 0.028, color: C.froid, segments: 6 }); S.add(flow.mesh);
  const fl = Array.from({ length: NF }, () => ({ s: rand(J0, J1), a: rand(0, 6.28), r: rand(0.09, 0.17) }));

  // --- État de l'expérience
  let mix = 'sel', mode = 'exp', Wb, Ab, Wd, Ad, lost, T, acc, done, cool = 0, waterOn = false, boil = 0, warm = 0;
  let Teq = 20, Teb = 100, boiling = false, lastAsp = 0, fs = '';
  const cV = new THREE.Color(), cD = new THREE.Color(), tmp = new THREE.Vector3();
  const COL = { vap: new THREE.Color(C.vapeur), eau: new THREE.Color(C.eau), vapA: new THREE.Color(0xe4d8ff), alc: new THREE.Color(ALC) };

  // --- Étiquettes (termes exacts du schéma)
  const liqPt = V3(XB + 0.5, Y0 + 0.3), distPt = V3(XD - 0.38, 0.05);
  const spots = [
    [V3(XB + 0.19, Y0 + HCOL - 0.08), [0.5, -0.12, 0], ''],
    [V3(XB + 0.55, Y0 + 1.0), [0.6, 0.12, 0], ''],
    [liqPt, [0.78, 0, 0], ''],
    [V3(XB + 0.2, 0.1, 0.62), [0.3, -0.24, 0.25], 'chaud'],
    [jPos(1.7), [0.3, 0.5, 0], ''],
    [tipSortie, [0, 0.36, 0], 'froid'],
    [tipEntree, [-0.36, -0.42, 0], 'froid'],
    [V3(XD, 0.03, 0.42), [0.05, -0.24, 0.25], ''],
    [distPt, [-0.95, 0, 0], 'fluo'],
  ];
  const labels = spots.map(([p, off, cls], i) => ({ cls, L: st.label(LEG[i], p, { offset: off, cls }) }));
  // traits de rappel : de l'objet vers son étiquette
  const linePos = new Float32Array(spots.length * 6), lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3));
  const leaders = new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 }));
  leaders.frustumCulled = false; S.add(leaders);
  const drawLeaders = () => { spots.forEach(([p, o], i) => linePos.set([p.x, p.y, p.z, p.x + o[0], p.y + o[1], p.z + o[2]], i * 6)); lineGeo.attributes.position.needsUpdate = true; };

  // --- Réglages
  const ui = panel(panelEl);
  const part = () => { const e = document.createElement('div'); e.style.cssText = 'display:flex;flex-direction:column;gap:12px'; panelEl.appendChild(e); return e; };
  const modeC = ui.choice({ options: [{ value: 'exp', label: "Faire l'expérience" }, { value: 'test', label: 'Me tester sur la légende' }], value: 'exp', onChange: (v) => setMode(v) });
  const expEl = part(), testEl = part(), ue = panel(expEl), ut = panel(testEl);
  // L'expérience, étape par étape (l'eau froide AVANT de chauffer, comme au labo ; ensuite tout reste libre)
  const E = etapes(expEl, [
    { t: 'Le mélange dans le ballon' },
    { t: "Ouvre l'eau froide du tube réfrigérant" },
    { t: 'Chauffe : allume la plaque chauffante', pq: "D'abord l'étape 2 : ouvre l'eau froide, sinon la vapeur ne sera pas refroidie." },
    { t: 'Récolte le distillat, puis arrête de chauffer', pq: "D'abord l'étape 3 : chauffe jusqu'à l'ébullition." },
    { t: 'Conclus', pq: "D'abord l'étape 4 : récolte le distillat, puis remets le chauffage à 0.", avant: true },
  ]);
  const ue0 = panel(E.c(0));
  const mixC = ue0.choice({ options: [{ value: 'sel', label: 'Eau de mer (eau salée)' }, { value: 'alcool', label: 'Eau + alcool' }], value: 'sel', onChange: (v) => { mix = v; reset(); } });
  const [btnEau] = panel(E.c(1)).buttons([{ label: "Ouvrir l'eau froide", onClick: () => setWater(!waterOn) }]);
  const heatS = panel(E.c(2)).slider({ label: 'Chauffage (la plaque chauffante)', min: 0, max: 100, step: 5, value: 0, format: (v) => (v ? v + ' %' : 'éteint') });
  const [btnRe] = panel(E.c(4)).buttons([{ label: 'Recommencer', onClick: () => reset() }]);
  E.go(1, btnEau); E.go(2, heatS.el, false); E.set(1);   // le mélange est déjà choisi : on commence par l'eau froide
  let eauOuverte = false, aBouilli = false, etapeFin = false;   // étapes franchies (on peut ensuite fermer l'eau, rechauffer…)
  // relevés en tuiles (compact, pour laisser la place à la scène), sous le chauffage
  const grid = document.createElement('div');
  grid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fit,minmax(84px,1fr));gap:6px';
  E.c(2).appendChild(grid);
  const tile = (name) => {
    const e = document.createElement('div');
    e.style.cssText = 'background:rgba(255,255,255,.07);border-radius:12px;padding:6px 9px;font-size:12px;color:#cfc8ff;line-height:1.25';
    e.innerHTML = name + '<strong style="display:block;font:700 17px/1.2 var(--titre);color:#fff"></strong><small style="display:block"></small>';
    grid.appendChild(e);
    const [v, s] = [e.querySelector('strong'), e.querySelector('small')];
    return { el: e, set(tx, sub = '') { v.textContent = tx; s.textContent = sub; } };
  };
  const rT = tile('Température du liquide'), rB = tile('Dans le ballon'), rD = tile('Distillat récolté'), rL = tile('Vapeur perdue');
  const noteMix = ue0.note('');
  const cours = document.createElement('details');
  cours.className = 'sim-note';
  cours.innerHTML = '<summary style="min-height:40px;display:flex;align-items:center;font-weight:700;color:#fff;cursor:pointer">▸ Ce que dit le cours</summary>'
    + "<p><b>La distillation</b> → Séparation de mélanges homogènes composés de deux liquides miscibles dont les températures d'ébullition sont différentes.</p>"
    + "<p><b>Principe :</b> il faut chauffer le mélange jusqu'à ce que le liquide dont la température d'évaporation est la plus basse s'évapore. Ensuite, il faut condenser cette vapeur en la refroidissant pour pouvoir récolter le liquide évaporé.</p>"
    + "<p>La distillation d'une solution aqueuse conduit à l'obtention d'une eau ne contenant plus aucune substance dissoute : l'eau pure.</p>"
    + '<p>Sur le schéma imprimé de la synthèse, on lit aussi : <i>le ballon à distiller</i>, <i>le réfrigérant</i>, <i>des pierres poreuses</i> (les petits cailloux au fond du ballon), <i>un mélange homogène</i>.</p>';
  expEl.appendChild(cours);
  ut.title('Me tester sur la légende');
  const qEl = ut.note('');
  ut.buttons(LEG.map((n) => ({ label: n, onClick: () => answer(n) })));
  const rScore = ut.readout('Score');
  const [btnTest] = ut.buttons([{ label: 'Recommencer le test', onClick: () => startTest() }]);

  const put = (r, tx, sub = '') => { const k = tx + '|' + sub; if (r._v !== k) { r._v = k; r.set(tx, sub); } };   // n'écrit que si ça change
  function setWater(on) {
    waterOn = on; btnEau.textContent = on ? "Fermer l'eau froide" : "Ouvrir l'eau froide";
    btnEau.classList.toggle('on', on); if (on) eauOuverte = true;
  }
  function reset() {
    Wb = mix === 'sel' ? V0 : V0 * 0.7; Ab = V0 - Wb; Wd = Ad = lost = acc = 0; T = 20; done = false;
    P.forEach((p) => { p.st = 0; }); heatS.set(0); setWater(false); setLevel(H0);
    eauOuverte = aBouilli = etapeFin = false;
    noteMix.innerHTML = mix === 'sel'
      ? "<b>L'eau de mer</b> : du sel dissout dans l'eau, un mélange homogène (une solution aqueuse)."
      : "<b>L'eau et l'alcool</b> sont deux liquides miscibles ; l'alcool a la température d'ébullition la plus basse (pour aller plus loin : environ 78 °C, contre 100 °C pour l'eau). En vrai, les deux sont incolores : les couleurs servent à les suivre.";
  }
  const tEb = () => (mix === 'sel' ? 100 + 6 * (1 - Wb / V0) : interp(TEB_ALC, Ab / Math.max(1e-6, Ab + Wb)));

  // Une « bouffée » de vapeur quitte le liquide (eau ou alcool selon le mélange)
  function emit() {
    let kind = 0;
    if (Ab > DV) { const x = Ab / (Ab + Wb); kind = Math.random() < (9 * x) / (1 + 8 * x) ? 1 : 0; }
    if (kind) Ab -= DV; else Wb = Math.max(0, Wb - DV);
    const p = P.find((o) => o.st === 0);
    if (!p) { if (cool > 0.6) { if (kind) Ad += DV; else Wd += DV; } else lost += DV; return; }
    const h = hBuilt, rr = (rBallon(h) - 0.1) * Math.sqrt(Math.random()), a = rand(0, 6.283), ja = rand(0, 6.283), jr = rand(0, 0.03);
    Object.assign(p, { st: 1, t: 0, kind, dur: rand(0.45, 0.8), sx: XB + Math.cos(a) * rr, sy: Y0 + h, sz: Math.sin(a) * rr,
      jx: Math.cos(ja) * jr, jy: Math.sin(ja) * jr * 0.7, jz: Math.sin(ja) * jr, uc: uAt(J0 + rand(0.1, 1.1)), u: 0, x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0 });
  }

  function fit() {
    const { w, h } = st.size(), asp = w / h;
    if (Math.abs(asp - lastAsp) < 0.02) return;
    lastAsp = asp;
    const tn = Math.tan(THREE.MathUtils.degToRad(st.camera.fov / 2)), dd = Math.max(1.9 / tn, 2.85 / (tn * asp));
    fs = w < 500 ? '11px' : ''; if (mode === 'exp') labels.forEach((o) => { o.L.el.style.fontSize = fs; });
    const c = st.controls, dir = st.camera.position.clone().sub(c.target).normalize();
    st.camera.position.copy(c.target).addScaledVector(dir, dd); c.maxDistance = dd * 1.6;
  }

  function step(dt, t) {
    dt = clamp(dt, 0, 0.05);   // la 1re image peut donner un dt négatif
    fit();
    const heat = heatS.value / 100;
    Teq = 20 + heat * 150; Teb = tEb();
    if (T < Teb || Teq < Teb) T += (Teq - T) * (1 - Math.exp(-dt * 0.3));
    if (Teq >= Teb && T > Teb) T = Teb;
    boiling = !done && Teq > Teb && T >= Teb - 0.05;
    const rate = boiling ? (Teq - Teb) * 0.05 : 0;   // mL par seconde
    acc += rate * dt;
    while (acc >= DV) { acc -= DV; emit(); }
    if (!done && Wb + Ab < 0.12 * V0) { done = true; heatS.set(0); }
    cool = clamp(cool + (waterOn ? dt : -dt) / 1.2, 0, 1);
    boil = lerp(boil, boiling ? 1 : 0, 1 - Math.exp(-dt * 4));
    warm = lerp(warm, boiling && cool > 0.6 ? clamp(rate / 3, 0, 1) : 0, 1 - Math.exp(-dt * 2));

    // plaque, liquide du ballon, dépôt de sel, distillat
    hotMat.emissiveIntensity = lerp(hotMat.emissiveIntensity, heat * 1.5, 1 - Math.exp(-dt * 3));
    tempColor(0.5 + heat * 0.5, hotMat.emissive);
    const vB = Wb + Ab, x = Ab / Math.max(1e-6, vB);
    setLevel(hauteur((vB / V0) * volBallon(H0)));
    liqMat.color.copy(COL.eau).lerp(COL.alc, x);
    const f = Wb / V0;
    sel.visible = mix === 'sel' && f < 0.25;
    if (sel.visible) { sel.scale.y = lerp(0.004, 0.04, clamp((0.25 - f) / 0.13, 0, 1)); sel.position.y = Y0 + 0.006 + sel.scale.y / 2; }
    const vd = Wd + Ad, hd = Math.max(0.0001, hDist(vd));
    dist.visible = vd > 0.05; dist.scale.y = hd; dist.position.y = 0.006 + hd / 2;
    distMat.color.copy(COL.eau).lerp(COL.alc, Ad / Math.max(1e-6, vd));
    liqPt.y = Y0 + hBuilt * 0.5; distPt.y = 0.02 + hd; drawLeaders();

    // eau froide dans la double paroi : elle entre en bas et sort en haut (et se réchauffe un peu)
    eauMat.opacity = 0.55 * cool; hoseMat.color.copy(hoseGrey).lerp(hoseBlue, cool);
    arrows.forEach((m, k) => { m.visible = cool > 0.5; m.scale.setScalar(0.9 + 0.12 * Math.sin(t * 5 + k)); });
    for (let i = 0; i < NF; i++) {
      const o = fl[i];
      if (cool > 0.02) { o.s -= dt * 0.55; if (o.s < J0 + 0.05) o.s = J1 - 0.05; o.a += dt * 0.7; }
      tmp.copy(jPos(o.s)).addScaledVector(nUp, Math.cos(o.a) * o.r).addScaledVector(zAx, Math.sin(o.a) * o.r);
      flow.setPos(i, tmp.x, tmp.y, tmp.z, cool);
      flow.setColor(i, tempColor(0.35 * warm * (1 - (o.s - J0) / (J1 - J0)), cV));
    }
    flow.commit();

    // bulles : l'ébullition se fait au sein même du liquide
    for (let i = 0; i < NB; i++) {
      const o = bb[i];
      o.y += dt * (0.5 + o.r * 0.4);
      if (o.y > hBuilt - 0.03) { o.y = 0.04; o.a = rand(0, 6.28); o.r = rand(0, 0.8); }
      const rr = rBallon(o.y) * 0.75 * o.r;
      bub.setPos(i, XB + Math.cos(o.a) * rr, Y0 + o.y, Math.sin(o.a) * rr, boil * (0.6 + 0.6 * o.y / Math.max(0.1, hBuilt)));
    }
    bub.commit();

    // vapeur → gouttes → distillat (ou vapeur qui s'échappe si l'eau froide ne circule pas)
    for (let i = 0; i < NV; i++) {
      const p = P[i];
      if (p.st === 0) { vap.setPos(i, 0, -99, 0); continue; }
      let s = 1, c = p.kind ? COL.vapA : COL.vap;
      if (p.st === 1) {
        p.t += dt; const k = Math.min(1, p.t / p.dur), e = k * k * (3 - 2 * k);
        p.x = lerp(p.sx, neckBot.x, e) + Math.sin(t * 6 + i) * 0.03 * (1 - k); p.y = lerp(p.sy, neckBot.y, e); p.z = lerp(p.sz, 0, e);
        if (k >= 1) p.st = 2;
      } else if (p.st === 2) {
        p.u += (1.9 * dt) / L;
        if (p.u >= p.uc && cool > 0.6) { p.st = 3; p.t = 0; }
        else if (p.u >= 1) { p.st = 5; p.t = 0; lost += DV; Object.assign(p, { vx: d.x * 0.6 + rand(-0.15, 0.15), vy: 0.15 + rand(0, 0.2), vz: rand(-0.25, 0.25) }); }
        path.getPoint(Math.min(1, p.u), tmp); p.x = tmp.x + p.jx; p.y = tmp.y + p.jy; p.z = tmp.z + p.jz;
      } else if (p.st === 3) {
        p.t += dt; p.u += (1.1 * dt) / L;
        path.getPoint(Math.min(1, p.u), tmp); p.x = tmp.x; p.y = tmp.y - 0.025; p.z = tmp.z;
        c = cD.copy(p.kind ? COL.vapA : COL.vap).lerp(p.kind ? COL.alc : COL.eau, Math.min(1, p.t / 0.3)); s = 0.85;
        if (p.u >= 1) { p.st = 4; p.vy = 0; p.x = B.x; p.y = B.y - 0.04; }
      } else if (p.st === 4) {
        p.vy -= 6 * dt; p.y += p.vy * dt; c = p.kind ? COL.alc : COL.eau; s = 0.85;
        if (p.y <= 0.02 + hd) { if (p.kind) Ad += DV; else Wd += DV; p.st = 0; }
      } else {
        p.t += dt; p.vy += 0.3 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt; s = Math.max(0, 1 - p.t / 1.8);
        if (p.t > 1.8) p.st = 0;
      }
      vap.setPos(i, p.x, p.y, p.z, s); vap.setColor(i, c);
    }
    vap.commit();

    // relevés et explication
    const pur = Ad / Math.max(1e-6, vd);
    const quoi = mix === 'sel' ? "de l'eau pure" : pur >= 0.55 ? "surtout de l'alcool" : pur >= 0.3 ? 'alcool + eau' : "surtout de l'eau";
    put(rT, Math.round(T) + ' °C'); put(rB, Math.round(vB) + ' mL'); put(rD, Math.round(vd) + ' mL', vd >= 1 ? quoi : '');
    put(rL, Math.round(lost) + ' mL'); rL.el.style.display = lost >= 1 ? '' : 'none';
    guider(heat, vd, x, pur);
    if (mode === 'exp') ex.set(texte(heat, vd, x, pur));
  }

  // Étapes : où en est l'élève, et un retour court sous l'étape en cours. Une étape franchie le reste.
  function guider(heat, vd, x, pur) {
    if (boiling) aBouilli = true;
    if (aBouilli && ((vd >= 1 && heat === 0) || done)) etapeFin = true;
    const c = etapeFin ? 4 : aBouilli || vd >= 1 ? 3 : eauOuverte ? 2 : 1, alc = mix === 'alcool', reussie = !alc || pur >= 0.55;
    E.set(c);
    E.titre(3, alc ? 'Récolte le distillat, puis arrête de chauffer avant 100 °C' : 'Récolte le distillat, puis arrête de chauffer');
    E.info(1, waterOn ? "L'eau froide circule : elle entre en bas et sort en haut." : eauOuverte ? "⚠ L'eau froide est fermée : la vapeur n'est plus refroidie." : '');
    E.info(2, c !== 2 || heat === 0 ? '' : Teq <= Teb ? "Trop faible : le liquide n'atteint pas sa température d'ébullition. Pousse le curseur." : 'Le liquide chauffe… il ne bout pas encore.');
    E.info(3, c !== 3 ? '' : boiling && cool <= 0.6 ? "⚠ La vapeur s'échappe : ouvre l'eau froide (étape 2) !"
      : boiling && alc && x <= 0.03 ? "⚠ Presque tout l'alcool est parti, la température monte : remets le chauffage à 0 !"
        : boiling && alc ? "Des gouttes tombent dans le berlin : surtout de l'alcool. Remets le chauffage à 0 avant que la température monte vers 100 °C."
          : boiling ? 'Des gouttes tombent dans le berlin : le distillat. Quand tu en as assez, remets le chauffage à 0.'
            : heat === 0 ? 'Le chauffage est éteint : il ne bout plus.' : '');
    E.info(4, !etapeFin ? '' : (!alc ? "✓ Le distillat est de l'eau pure : le sel est resté dans le ballon."
      : reussie ? "✓ Le distillat est surtout de l'alcool : séparé de l'eau grâce aux températures d'ébullition différentes."
        : "✗ Le distillat contient beaucoup d'eau : tu as chauffé trop longtemps. Recommence et arrête plus tôt.")
      + (reussie ? "<br>➜ Essaie l'autre mélange (étape 1), ou teste-toi sur la légende, en haut." : ''));
    // une seule action principale : recommencer si c'est raté, sinon le test de la légende
    btnRe.classList.toggle('primary', etapeFin && !reussie);
    modeC.el.querySelector('[data-v=test]').classList.toggle('gx-go', mode === 'exp' && etapeFin && reussie);
  }

  function texte(heat, vd, x, pur) {
    const finAlc = pur >= 0.55
      ? "Dans <mark>le berlin</mark>, <mark>le distillat</mark> est surtout de l'alcool : les deux liquides <mark>miscibles</mark> ont été séparés grâce à leurs <mark>températures d'ébullition</mark> différentes."
      : "<mark>Le distillat</mark> contient de l'alcool et beaucoup d'eau : tu as chauffé trop longtemps, l'eau s'est évaporée à son tour. Recommence et arrête quand la température monte vers 100 °C.";
    if (done) return mix === 'sel'
      ? "Il ne reste presque plus de liquide : on arrête de chauffer. Le sel est resté au fond du ballon. La distillation d'une solution aqueuse conduit à l'obtention d'une eau ne contenant plus aucune substance dissoute : <mark>l'eau pure</mark>."
      : finAlc;
    if (boiling && cool <= 0.6) return "Ça bout ! La vapeur monte dans <mark>le tube réfrigérant</mark>… mais l'eau froide ne circule pas : la vapeur n'est pas refroidie, elle ne se <mark>condense</mark> pas et <b>s'échappe</b>. Ouvre l'eau froide !";
    if (boiling) {
      if (mix === 'sel') return "L'eau s'évapore et sa vapeur entre dans <mark>le tube réfrigérant</mark>. Refroidie par l'eau froide, elle se <mark>condense</mark> : des gouttes tombent dans <mark>le berlin</mark>. C'est <mark>le distillat</mark>. Le sel, lui, reste dans le ballon.";
      if (x > 0.03) return "Le mélange bout avant 100 °C : c'est surtout <mark>l'alcool</mark>, le liquide dont la <mark>température d'ébullition</mark> est la plus basse, qui s'évapore. Refroidie, sa vapeur se <mark>condense</mark> : <mark>le distillat</mark> est surtout de l'alcool.";
      return "Presque tout l'alcool est parti : la température monte vers 100 °C et <b>l'eau</b> s'évapore à son tour. Pour récolter surtout l'alcool, il fallait arrêter de chauffer avant.";
    }
    if (heat > 0 && Teq <= Teb) return "Le chauffage est trop faible : le liquide n'atteint pas sa <mark>température d'ébullition</mark>. Pousse le curseur.";
    if (heat > 0) return '<mark>La plaque chauffante</mark> chauffe <mark>le liquide</mark> : sa température monte, mais il ne bout pas encore.';
    if (vd >= 1) return mix === 'sel' ? 'Tu as arrêté de chauffer. Dans <mark>le berlin</mark> : <mark>le distillat</mark>, de l\'eau pure. Le sel est resté dans le ballon.' : finAlc;
    if (waterOn) return "L'eau froide circule dans la double paroi du <mark>tube réfrigérant</mark> : elle entre en bas (<mark>entrée d'eau froide</mark>) et sort en haut (<mark>sortie d'eau froide</mark>). Maintenant, chauffe le ballon.";
    return mix === 'sel'
      ? "Le ballon contient de l'eau de mer : un <mark>mélange homogène</mark>. Pour la distiller, ouvre d'abord l'eau froide du <mark>tube réfrigérant</mark> (étape 2), puis allume <mark>la plaque chauffante</mark>."
      : "Le ballon contient de l'eau et de l'alcool : deux liquides <mark>miscibles</mark>, un <mark>mélange homogène</mark>. Ouvre d'abord l'eau froide du <mark>tube réfrigérant</mark> (étape 2), puis allume <mark>la plaque chauffante</mark>.";
  }

  // --- Mode « Me tester sur la légende » : les étiquettes deviennent des numéros
  let order = [], cur = 0, score = 0, res = {}, retour = '';
  function startTest() {
    order = LEG.map((_, i) => i).sort(() => Math.random() - 0.5); cur = 0; score = 0; res = {}; retour = '';
    ex.set("Les étiquettes sont devenues des numéros. Pour chaque numéro, touche le bon nom dans la liste. Tu peux tourner l'appareil avec le doigt.");
    drawTest();
  }
  function drawTest() {
    labels.forEach((o, i) => {
      const n = order.indexOf(i) + 1, r = res[i];
      Object.assign(o.L.el.style, { minWidth: r === undefined ? '30px' : '', textAlign: 'center', fontSize: r === undefined ? '15px' : fs });
      if (r === undefined) { o.L.set('<b>' + n + '</b>'); o.L.el.className = 'sim-label' + (n === cur + 1 ? ' fluo' : ''); }
      else { o.L.set(n + '. ' + LEG[i] + (r ? ' ✓' : ' ✗')); o.L.el.className = 'sim-label' + (r ? '' : ' chaud'); }
    });
    qEl.innerHTML = retour + (cur < LEG.length ? 'Quel est le nom du <b>n° ' + (cur + 1) + '</b> (en jaune) ? Touche-le dans la liste.' : '<b>Test terminé !</b>');
    rScore.set(score + ' / ' + LEG.length);
    btnTest.classList.toggle('primary', cur >= LEG.length);   // en cours de test, l'action principale est de répondre
  }
  function answer(name) {
    if (mode !== 'test' || cur >= LEG.length) return;
    const i = order[cur], ok = name === LEG[i];
    res[i] = ok; if (ok) score++;
    retour = (ok ? '<b style="color:#7ee2a8">✓ Oui</b> : ' : '<b style="color:#ff9b85">✗ Non</b> : ') + 'le n° ' + (cur + 1) + ', c\'est <b style="color:#fff">' + LEG[i] + '</b>.<br>';
    let msg = ok ? 'Oui ! Le n° ' + (cur + 1) + ', c\'est <mark>' + LEG[i] + '</mark>.' : 'Non : le n° ' + (cur + 1) + ', c\'est <mark>' + LEG[i] + '</mark> (pas « ' + name + ' »).';
    cur++;
    if (cur >= LEG.length) msg += ' <b>Score : ' + score + ' / ' + LEG.length + '.</b> ' + (score === LEG.length ? 'Parfait, tu connais le schéma !' : 'Recommence le test pour viser 9 / 9.');
    ex.set(msg); drawTest();
  }
  function setMode(m) {
    mode = m; modeC.set(m);
    expEl.style.display = m === 'exp' ? 'flex' : 'none'; testEl.style.display = m === 'test' ? 'flex' : 'none';
    if (m === 'test') startTest();
    else labels.forEach((o, i) => { o.L.set(LEG[i]); o.L.el.className = 'sim-label ' + o.cls; Object.assign(o.L.el.style, { minWidth: '', fontSize: fs }); });
  }

  reset(); setMode('exp');
  st.onFrame(step);

  // Banc d'essai : ?etat=distille | fuite | alcool | test (avance l'expérience de 15 s) — sans effet sinon
  const etat = new URLSearchParams(location.search).get('etat');
  if (etat) {
    if (etat === 'alcool') { mixC.set('alcool'); mix = 'alcool'; reset(); }
    heatS.set(85); if (etat !== 'fuite') setWater(true);
    for (let i = 0; i < 450; i++) step(1 / 30, i / 30);
    if (etat === 'test') { setMode('test'); answer(LEG[order[0]]); answer('le berlin'); }
  }

  return { dispose() { st.dispose(); retirerStyle(); } };
}
