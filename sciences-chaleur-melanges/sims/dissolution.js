// dissolution.js — « Dissoudre : solvant, soluté, solution, saturation, concentration » (thème 6).
// Modèle du cours : molécules d'eau claires, molécules de sucre sombres. Second mode : « Fondre ou dissoudre ? ».
// Guidé par étapes : ajouter → agiter et regarder → ajouter jusqu'à la saturation → conclure ; et lancer → glaçon → sucre → à retenir.
import { THREE, C, layout, createStage, panel, explain, beaker, ground, molecules, liquidMaterial, glassMaterial, clamp, lerp, rand } from './kit.js';

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

const MOL_G = 5;            // 1 molécule de sucre dessinée = 0,2 g
const SAT = 20;             // DANS CETTE EXPÉRIENCE : l'eau est saturée à 20 g de sucre dissous par litre
const NS = 300, NW = 280;   // molécules dessinées au maximum : sucre (60 g), eau (2 L)
const RB = 0.95, HB = 1.8, RIN = 0.85, Y0 = 0.34;   // bécher posé sur la balance
const hEau = (V) => V * 0.75;
const fr = (n, d = 2) => n.toLocaleString('fr-BE', { maximumFractionDigits: d });
const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) * 2;
const SUCRE = 0x3b3170, EAU_MOL = 0xeef7ff;

// Les molécules d'un liquide roulent les unes sur les autres : marche au hasard douce dans un cylindre.
// ag (0..1) = agitation : tourbillon + brassage de haut en bas.
function walk(p, v, i, dt, ag, rin, y0, y1) {
  const j = i * 3, tau = 0.6, sv = 0.14 + 0.2 * ag, f = Math.sqrt((2 * sv * sv / tau) * dt);
  for (let a = 0; a < 3; a++) v[j + a] += (-v[j + a] / tau) * dt + f * gauss();
  let x = p[j], y = p[j + 1], z = p[j + 2], dx = 0, dy = 0, dz = 0;
  if (ag > 0.01) {
    const w = 1.8 * ag, rr = Math.hypot(x, z) + 1e-6, yr = (y - y0) / Math.max(0.01, y1 - y0);
    dx = -z * w; dz = x * w; dy = (rr / rin - 0.55) * 1.2 * ag;
    const dr = -(yr - 0.5) * 0.9 * ag; dx += (x / rr) * dr; dz += (z / rr) * dr;
  }
  x += (v[j] + dx) * dt; y += (v[j + 1] + dy) * dt; z += (v[j + 2] + dz) * dt;
  const r = Math.hypot(x, z);
  if (r > rin) {
    x *= rin / r; z *= rin / r;
    const nx = x / rin, nz = z / rin, vn = v[j] * nx + v[j + 2] * nz;
    if (vn > 0) { v[j] -= 2 * vn * nx; v[j + 2] -= 2 * vn * nz; }
  }
  if (y < y0) { y = y0; v[j + 1] = Math.abs(v[j + 1]); } else if (y > y1) { y = y1; v[j + 1] = -Math.abs(v[j + 1]); }
  p[j] = x; p[j + 1] = y; p[j + 2] = z;
}

export default function mount(root) {
  const retirerStyle = gxStyle();
  const { stageEl, panelEl, explainEl } = layout(root);
  const st = createStage(stageEl, { camera: { pos: [0, 2.9, 5.6], target: [0, 1.3, 0], fov: 42 } });
  const S = st.scene, ex = explain(explainEl);
  const std = (color, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color, roughness: 0.55 }, o));
  const mesh = (geo, mat, parent, x = 0, y = 0, z = 0) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); parent.add(m); return m; };
  S.add(ground(12));
  const GA = new THREE.Group(), GB = new THREE.Group(); S.add(GA, GB); GB.visible = false;

  // ===== Mode « Dissoudre » : balance + bécher d'eau =====
  mesh(new THREE.BoxGeometry(2.4, 0.3, 1.9), std(0xdfe2ec), GA, 0, 0.15, 0);
  mesh(new THREE.CylinderGeometry(1.05, 1.05, 0.04, 48), std(C.metal, { metalness: 0.6, roughness: 0.3 }), GA, 0, 0.32, 0);
  mesh(new THREE.BoxGeometry(1.0, 0.2, 0.02), std(0x16142a), GA, 0, 0.15, 0.955);
  const bk = beaker(RB, HB); bk.position.y = Y0; GA.add(bk);
  const tick = std(0xffffff, { transparent: true, opacity: 0.55 }), phi = Math.asin(0.5 / RB);
  for (let v = 0.25; v <= 2.01; v += 0.25) {   // graduations tous les 0,25 L
    const g = mesh(new THREE.BoxGeometry(v % 1 === 0 ? 0.26 : 0.13, 0.012, 0.01), tick, GA, 0.5, Y0 + hEau(v), Math.cos(phi) * RB + 0.004);
    g.rotation.y = phi;
  }
  const eauMat = liquidMaterial(C.eau, 0.26);
  const eau = mesh(new THREE.CylinderGeometry(RB - 0.025, RB - 0.025, 1, 48), eauMat, GA);
  const surf = mesh(new THREE.CircleGeometry(RB - 0.025, 48), liquidMaterial(C.eau, 0.3), GA); surf.rotation.x = -Math.PI / 2;
  const wm = molecules(NW, { radius: 0.05, color: EAU_MOL, segments: 10 }); GA.add(wm.mesh);
  const sm = molecules(NS, { radius: 0.056, color: SUCRE, segments: 10 }); GA.add(sm.mesh);
  // la cuillère
  const spoon = new THREE.Group(); GA.add(spoon); spoon.visible = false;
  const metal = std(C.metal, { metalness: 0.7, roughness: 0.25, side: THREE.DoubleSide });
  mesh(new THREE.BoxGeometry(0.8, 0.035, 0.07), metal, spoon, 0.5, 0.03, 0);
  const bowl = mesh(new THREE.SphereGeometry(0.15, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), metal, spoon); bowl.rotation.x = Math.PI; bowl.scale.set(1, 0.45, 0.8);
  // l'agitateur
  const rod = new THREE.Group(); GA.add(rod); rod.visible = false;
  const rodM = mesh(new THREE.CylinderGeometry(0.025, 0.025, 2.1, 10), glassMaterial({ opacity: 0.55 }), rod, 0.4, Y0 + 1.0, 0); rodM.rotation.z = 0.22;

  // état
  let V = 1, clock = 0, ag = 0, agUntil = 0, added = 0, assigned = 0, nS = 0, nW = 0, mode = 'dis', lastAsp = 0;
  let spoonT = -1, spoonG = 0; const queue = [], clumps = [];
  const Wp = new Float32Array(NW * 3), Wv = new Float32Array(NW * 3);
  const Sp = new Float32Array(NS * 3), Sv = new Float32Array(NS * 3), So = new Float32Array(NS * 3), Sst = new Uint8Array(NS);
  // Sst : 0 libre, 1 dans la cuillère ou en chute, 2 au fond (va se dissoudre), 3 dissous (diffuse), 4 dépôt solide
  const capMol = () => Math.round(SAT * V * MOL_G);
  const h = () => hEau(V);

  // étiquettes
  const pLiq = new THREE.Vector3(), pSol = new THREE.Vector3(), pDep = new THREE.Vector3();
  const lLiq = st.label('', pLiq, { offset: [0.85, 0, 0] });
  const lSol = st.label('le soluté : le sucre', pSol, { offset: [-0.95, 0.2, 0], cls: 'fluo' });
  const lDep = st.label('dépôt : du sucre resté solide', pDep, { offset: [-1.25, 0.05, 0], cls: 'chaud' });
  const lBal = st.label('', new THREE.Vector3(0, 0.15, 0.97), {});
  lBal.el.style.fontSize = '16px';
  const lBec = st.label('le bécher', new THREE.Vector3(-RB, Y0 + HB - 0.1, 0), { offset: [-0.45, 0.1, 0], cls: 'discret' });
  const labelsA = [lLiq, lSol, lDep, lBal, lBec];

  // ===== Mode « Fondre ou dissoudre ? » =====
  mesh(new THREE.BoxGeometry(1.2, 0.2, 1.0), std(0xd9dbe6), GB, -1.35, 0.1, 0);
  const hot = std(0x2b2838, { emissive: new THREE.Color(C.chaud), emissiveIntensity: 1.1 });
  mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.02, 32), hot, GB, -1.35, 0.205, 0);
  mesh(new THREE.CylinderGeometry(0.55, 0.45, 0.05, 40), glassMaterial({ opacity: 0.35 }), GB, -1.35, 0.24, 0);
  const ice = mesh(new THREE.BoxGeometry(0.45, 0.45, 0.45), new THREE.MeshPhysicalMaterial({ color: C.glace, transparent: true, opacity: 0.82, roughness: 0.12 }), GB, -1.35, 0.49, 0);
  const flaque = mesh(new THREE.CylinderGeometry(1, 1, 1, 40), liquidMaterial(C.eau, 0.75), GB, -1.35, 0.27, 0);
  const verre = beaker(0.5, 0.95); verre.position.set(1.35, 0, 0); GB.add(verre);
  const eau2 = mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.7, 40), liquidMaterial(C.eau, 0.3), GB, 1.35, 0.355, 0);
  const cube = mesh(new THREE.BoxGeometry(0.26, 0.26, 0.26), std(0xf7f3ea, { roughness: 0.95 }), GB, 1.35, 0.14, 0);
  const N2 = 120, sm2 = molecules(N2, { radius: 0.035, color: SUCRE, segments: 8 }); GB.add(sm2.mesh);
  const P2 = new Float32Array(N2 * 3), V2 = new Float32Array(N2 * 3);
  let running = false, melt = 0, diss = 0, n2 = 0, rep = { glacon: null, sucre: null }, last = '';
  const lIce = st.label('le glaçon', ice, { offset: [0, 0.5, 0] });
  const lHot = st.label('la chaleur', new THREE.Vector3(-1.35, 0.1, 0.5), { offset: [0, -0.18, 0.2], cls: 'chaud' });
  const lSuc = st.label('le sucre', cube, { offset: [0.85, 0.05, 0] });
  const lEau2 = st.label("l'eau (le solvant)", new THREE.Vector3(0.87, 0.55, 0), { offset: [-0.6, 0.1, 0], cls: 'froid' });
  const lFroid = st.label('pas de chaleur', new THREE.Vector3(1.35, 0, 0.5), { offset: [0, -0.18, 0.2], cls: 'discret' });
  const lFus = st.label('FUSION', new THREE.Vector3(-1.35, 1.4, 0), { cls: 'fluo' });
  const lDis = st.label('DISSOLUTION', new THREE.Vector3(1.35, 1.4, 0), { cls: 'fluo' });
  const labelsB = [lIce, lHot, lSuc, lEau2, lFroid, lFus, lDis];

  // ===== Réglages =====
  const ui = panel(panelEl);
  const part = () => { const e = document.createElement('div'); e.style.cssText = 'display:flex;flex-direction:column;gap:12px'; panelEl.appendChild(e); return e; };
  const modeC = ui.choice({ options: [{ value: 'dis', label: 'Dissoudre' }, { value: 'comp', label: 'Fondre ou dissoudre ?' }], value: 'dis', onChange: (v) => setMode(v) });
  const partA = part(), partB = part(), ua = panel(partA);
  // « Dissoudre », étape par étape : ajouter → agiter et regarder → ajouter jusqu'à la saturation → conclure
  // (les messages « verrouillé » évitent le mot « étape » : le schéma du cours numérote déjà ses étapes, de la 1re à la 5e)
  const EA = etapes(partA, [
    { t: "Ajoute du sucre (le soluté) dans l'eau (le solvant)" },
    { t: 'Agite et regarde le sucre se disperser', pq: "Ajoute d'abord du sucre." },
    { t: "Ajoute du sucre jusqu'à ce qu'il en reste au fond", pq: "Attends d'abord que le sucre soit réparti partout." },
    { t: 'Conclus', pq: "Ajoute d'abord du sucre jusqu'à ce qu'il en reste au fond.", avant: true },
  ]);
  const [bC, bP] = panel(EA.c(0)).buttons([{ label: '+ 1 cuillère de sucre (5 g)', onClick: () => ajouter(5) }, { label: '+ 1 pincée (1 g)', onClick: () => ajouter(1) }]);
  const [bA] = panel(EA.c(1)).buttons([{ label: 'Agiter', onClick: () => { agUntil = clock + 3; } }]);
  const [bC2] = panel(EA.c(2)).buttons([{ label: '+ 1 cuillère de sucre (5 g)', onClick: () => ajouter(5) }]);
  const [bRA] = panel(EA.c(3)).buttons([{ label: 'Recommencer', onClick: () => reset() }]);
  EA.go(0, bC); EA.go(1, bA); EA.go(2, bC2); EA.set(0);
  let vuHomog = false, vuDepot = false, finiA = false, finiB = false;   // étapes franchies (elles le restent)
  // conservation de la masse en tuiles : solvant + soluté = ce que montre la balance
  const grid = document.createElement('div');
  grid.style.cssText = 'display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px';
  partA.appendChild(grid);
  const tile = (name) => {
    const e = document.createElement('div');
    e.style.cssText = 'background:rgba(255,255,255,.07);border-radius:12px;padding:6px 8px;font-size:12px;color:#cfc8ff;line-height:1.25';
    e.innerHTML = name + '<strong style="display:block;font:700 16px/1.25 var(--titre);color:#fff"></strong>';
    grid.appendChild(e);
    const v = e.querySelector('strong');
    return { set(html) { v.innerHTML = html; } };
  };
  const rSolv = tile('masse du solvant (eau)'), rSolu = tile('+ masse du soluté (sucre)'), rTot = tile('= masse sur la balance');
  const conc = ua.note('');
  const jWrap = document.createElement('div');
  jWrap.innerHTML = '<div style="display:flex;justify-content:space-between;font-size:12.5px;color:#cfc8ff;margin-bottom:5px"><span>pas sucré</span><span>de plus en plus sucré →</span></div>'
    + '<div style="height:12px;border-radius:99px;background:rgba(255,255,255,.12);overflow:hidden"><div style="height:100%;width:0;border-radius:99px;background:linear-gradient(90deg,#19c3a6,#ffe45c);transition:width .4s"></div></div>';
  partA.appendChild(jWrap);
  const jauge = jWrap.lastChild.firstChild;
  ua.note('<span style="color:#eef7ff">●</span> molécule d\'eau &nbsp;<span style="color:#8f7fd6">●</span> molécule de sucre (sombre). Modèle : molécules énormément grossies.<br>'
    + '<b>Dans cette expérience</b>, l\'eau est saturée à 20 g de sucre par litre, pour aller vite. En vrai, il en faut beaucoup plus.');
  // le volume d'eau (il sert dans C = m ÷ V) : le changer relance l'expérience
  const volS = ua.slider({ label: "Volume d'eau (le solvant)", min: 0.25, max: 2, step: 0.25, value: 1, unit: 'L', format: (v) => fr(v), onInput: (v) => { V = v; reset(); } });
  // « Fondre ou dissoudre ? », étape par étape
  const EB = etapes(partB, [
    { t: 'Lance les deux expériences et regarde' },
    { t: 'Le glaçon…', pq: "Lance d'abord les expériences, et regarde." },
    { t: "Le sucre dans l'eau…", pq: "Réponds d'abord pour le glaçon." },
    { t: 'À retenir', pq: "Réponds d'abord pour le sucre.", avant: true },
  ]);
  const [bL] = panel(EB.c(0)).buttons([{ label: 'Lancer les deux expériences', onClick: () => { running = true; } }]);
  const qG = panel(EB.c(1)).choice({ options: [{ value: 'fond', label: 'il fond' }, { value: 'dissout', label: 'il se dissout' }], value: '', onChange: (v) => repondre('glacon', v) });
  const qS = panel(EB.c(2)).choice({ options: [{ value: 'fond', label: 'il fond' }, { value: 'dissout', label: 'il se dissout' }], value: '', onChange: (v) => repondre('sucre', v) });
  const [bRB] = panel(EB.c(3)).buttons([{ label: 'Recommencer', onClick: () => resetB() }]);
  EB.go(0, bL); EB.set(0);
  // fin d'un parcours : l'autre parcours clignote (une seule action principale) ; les deux faits → « Recommencer » en jaune
  function suiteMode() {
    const fA = mode === 'dis' && finiA, fB = mode === 'comp' && finiB;
    modeC.el.querySelector('[data-v=comp]').classList.toggle('gx-go', fA && !finiB);
    modeC.el.querySelector('[data-v=dis]').classList.toggle('gx-go', fB && !finiA);
    bRA.classList.toggle('primary', fA && finiB); bRB.classList.toggle('primary', fB && finiA);
  }

  // ===== Dissoudre =====
  function reset() {
    nS = 0; added = 0; assigned = 0; clumps.length = 0; queue.length = 0; spoonT = -1; spoon.visible = false; Sst.fill(0);
    vuHomog = vuDepot = false;
    for (let i = 0; i < NS; i++) sm.setPos(i, 0, -99, 0);
    nW = Math.round(V * 140);
    for (let i = 0; i < NW; i++) {
      if (i >= nW) { wm.setPos(i, 0, -99, 0); continue; }
      const a = rand(0, 6.283), r = RIN * Math.sqrt(Math.random());
      Wp.set([Math.cos(a) * r, rand(0.06, h() - 0.05), Math.sin(a) * r], i * 3); Wv.fill(0, i * 3, i * 3 + 3);
    }
    eau.scale.y = h(); eau.position.y = Y0 + h() / 2; surf.position.y = Y0 + h() + 0.002;
    wm.commit(); sm.commit();
  }
  function ajouter(g) {
    const pending = queue.reduce((a, b) => a + b, 0) + (spoonT >= 0 ? spoonG : 0);
    if (nS + (pending + g) * MOL_G > NS) return;
    queue.push(g);
  }
  // un tas de sucre (molécules serrées) dans la cuillère
  function nouveauTas(g) {
    const c = { ids: [], att: [], tx: rand(-0.35, 0.35), tz: rand(-0.2, 0.35), x: 0, z: 0, y: 0, vy: 0, ph: -1, t: 0, acc: 0, det: 0, g };
    for (let k = 0; k < g * MOL_G; k++) {
      const i = nS++, a = rand(0, 6.283), b = Math.acos(rand(-1, 1)), r = 0.13 * Math.cbrt(Math.random()) * (g === 1 ? 0.5 : 1);
      So.set([Math.sin(b) * Math.cos(a) * r, Math.abs(Math.cos(b)) * r * 0.6, Math.sin(b) * Math.sin(a) * r], i * 3);
      Sst[i] = 1; c.ids.push(i);
    }
    clumps.push(c);
    return c;
  }
  // arrivé au fond : chaque molécule pourra se dissoudre… tant que la solution n'est pas saturée
  function auFond(c) {
    for (const i of c.ids) {
      const j = i * 3;
      Sp.set([c.x + So[j] * 1.3, 0.05 + So[j + 1] * 0.7, c.z + So[j + 2] * 1.3], j);
      if (assigned < capMol()) { assigned++; Sst[i] = 2; c.att.push(i); } else Sst[i] = 4;
    }
    c.att.sort((a, b) => Sp[a * 3 + 1] - Sp[b * 3 + 1]);   // les molécules du dessus partent d'abord
  }

  function stepA(dt) {
    const H = h();
    ag = lerp(ag, clock < agUntil ? 1 : 0, 1 - Math.exp(-dt * 3));
    bA.classList.toggle('on', clock < agUntil);
    // la cuillère : arrive, se penche, verse, repart
    if (spoonT < 0 && queue.length) { spoonG = queue.shift(); spoonT = 0; nouveauTas(spoonG); spoon.scale.setScalar(spoonG === 1 ? 0.7 : 1); }
    const cS = clumps.find((c) => c.ph === -1);
    if (spoonT >= 0) {
      spoonT += dt; spoon.visible = true;
      const tx = cS ? cS.tx : 0, tz = cS ? cS.tz : 0, top = Y0 + HB + 0.45;
      const k = clamp(spoonT / 0.45, 0, 1), back = clamp((spoonT - 0.9) / 0.4, 0, 1), e = k * k * (3 - 2 * k);
      spoon.position.set(lerp(lerp(1.9, tx, e), 1.9, back), top + 0.4 * (1 - e) + 0.4 * back, lerp(tz, 0.3, back));
      spoon.rotation.x = clamp((spoonT - 0.45) / 0.2, 0, 1) * 1.3 * (1 - back);
      if (cS && spoonT >= 0.6) { cS.ph = 0; cS.vy = 0; }
      if (spoonT >= 1.3) { spoonT = -1; spoon.visible = false; }
    }
    for (const c of clumps) {
      if (c.ph === -1) { c.x = spoon.position.x; c.y = spoon.position.y - Y0 + 0.02; c.z = spoon.position.z; }
      else if (c.ph === 0) { c.vy -= 5 * dt; c.y += c.vy * dt; if (c.y <= H) { c.ph = 1; added += c.g; c.vy = -0.55; } }
      else if (c.ph === 1) { c.y += c.vy * dt; if (c.y <= 0.06) { c.ph = 2; auFond(c); } }
      else {
        c.t += dt;
        if (c.t > 1.4) { c.acc += (2.4 + 10 * ag) * dt; while (c.acc >= 1 && c.att.length) { c.acc -= 1; const i = c.att.pop(); Sst[i] = 3; Sv[i * 3 + 1] = 0.12; c.det++; } }
      }
    }
    for (let k = clumps.length - 1; k >= 0; k--) if (clumps[k].ph === 2 && !clumps[k].att.length) clumps.splice(k, 1);

    // molécules
    for (let i = 0; i < nW; i++) { walk(Wp, Wv, i, dt, ag, RIN, 0.06, H - 0.05); wm.setPos(i, Wp[i * 3], Y0 + Wp[i * 3 + 1], Wp[i * 3 + 2]); }
    let nFree = 0, nAtt = 0, nDep = 0, top = 0; pDep.set(0, 0, 0);
    for (let i = 0; i < nS; i++) {
      const s = Sst[i], j = i * 3;
      if (s === 2 || s === 4) {   // au fond : les molécules d'un solide vibrent sur place
        sm.setPos(i, Sp[j] + Math.sin(clock * 15 + i) * 0.004, Y0 + Sp[j + 1], Sp[j + 2]);
        if (s === 2) nAtt++; else { nDep++; pDep.x += Sp[j]; pDep.z += Sp[j + 2]; }
      } else if (s === 3) {
        walk(Sp, Sv, i, dt, ag, RIN, 0.06, H - 0.05); sm.setPos(i, Sp[j], Y0 + Sp[j + 1], Sp[j + 2]);
        nFree++; if (Sp[j + 1] > H / 2) top++;
      }
    }
    for (const c of clumps) if (c.ph < 2) for (const i of c.ids) { const j = i * 3; sm.setPos(i, c.x + So[j], Y0 + c.y + So[j + 1], c.z + So[j + 2]); }
    wm.commit(); sm.commit();

    // l'agitateur tourne dans le bécher
    rod.visible = ag > 0.05; rod.rotation.y += dt * 5 * ag; rodM.position.y = Y0 + 1.05;

    // étiquettes
    const md = nFree / MOL_G, Cg = md / V, sat = assigned >= capMol();
    pLiq.set(RB - 0.05, Y0 + Math.max(0.12, H * 0.55), 0);
    lLiq.set(nFree === 0 ? 'le solvant : ' + fr(V) + " L d'eau" : sat && nAtt === 0 ? 'solution saturée' : "la solution : l'eau sucrée");
    const cl = clumps[clumps.length - 1];
    lSol.show(!!cl); if (cl) pSol.set(cl.x, Y0 + cl.y + 0.08, cl.z);
    lDep.show(nDep > 0); if (nDep) pDep.set(pDep.x / nDep, Y0 + 0.08, pDep.z / nDep);
    put(lBal, '<b>' + fr(V * 1000 + added, 1) + ' g</b>');

    // relevés : conservation de la masse et concentration
    put(rSolv, fr(V * 1000, 0) + ' g');
    put(rSolu, fr(added, 1) + ' g' + (nDep ? '<small style="display:block;font:500 11.5px var(--texte);color:#ffb4a3">dont ' + fr(nDep / MOL_G, 1) + ' g au fond</small>' : ''));
    put(rTot, fr(V * 1000 + added, 1) + ' g');
    put(conc, '<b>Concentration</b> : C = m ÷ V = ' + fr(md, 1) + ' g ÷ ' + fr(V) + ' L = <b style="color:#ffe45c;font-size:16px">' + fr(Cg, 2) + ' g/L</b><br><small>m = la masse de sucre <i>dissous</i> (le sucre resté au fond ne compte pas).</small>');
    jauge.style.width = clamp((Cg / SAT) * 100, 0, 100) + '%';
    const full = nS + queue.reduce((a, b) => a + b, 0) * MOL_G >= NS - 4;
    bC.disabled = full; bP.disabled = full; bC2.disabled = full;
    guiderA(nFree, nAtt, nDep, top, sat, full);
    ex.set(texteA(nFree, nAtt, nDep, top, sat, full, md));
  }

  // Étapes de « Dissoudre » ; le retour cite les étapes du schéma du cours (1re à 5e)
  function guiderA(nFree, nAtt, nDep, top, sat, full) {
    const vol = clumps.some((c) => c.ph < 2) || queue.length > 0 || spoonT >= 0, fond = clumps.find((c) => c.ph === 2);
    if ((nFree > 0 && nAtt === 0 && top / nFree >= 0.36) || nDep > 0) vuHomog = true;
    if (nDep > 0 && nAtt === 0 && !vol) vuDepot = true;     // tout ce qui pouvait se dissoudre l'est, le reste est au fond
    const c = vuDepot ? 3 : vuHomog ? 2 : nS > 0 ? 1 : 0;
    if (c === 3) finiA = true;
    EA.set(c);
    EA.info(0, vol && c < 2 ? "Le sucre tombe dans l'eau…" : '');
    EA.info(1, c > 1 ? '✓ 3e étape du schéma : il est réparti partout.' : c < 1 || vol ? ''
      : fond && fond.det === 0 ? '1re étape du schéma : le sucre est au fond.'
        : '2e étape du schéma : il commence à se disperser.' + (ag < 0.3 ? ' Agite pour aller plus vite.' : ''));
    EA.info(2, c !== 2 ? '' : nDep > 0 ? 'Une partie du sucre ne se dissout plus : regarde le fond…'
      : vol || nAtt > 0 ? 'Le sucre ajouté se dissout… attends, puis ajoute encore.'
      : sat ? 'La solution est <b>saturée</b> : le prochain sucre ne se dissoudra plus. Ajoute-en encore !'
        : '4e étape du schéma : le sucre ajouté peut encore se dissoudre. Ajoute encore !');
    EA.info(3, c !== 3 ? '' : "✓ 5e étape du schéma : le sucre ajouté reste à l'état solide, au fond. La solution est <b>saturée</b> ; avec ce sucre en plus, il y a <b>sursaturation</b> : le mélange devient <b>hétérogène</b>."
      + (full ? '<br>Le bécher est plein.' : '') + (finiB ? '' : '<br>➜ Essaie « Fondre ou dissoudre ? », en haut.'));
    suiteMode();
  }

  function texteA(nFree, nAtt, nDep, top, sat, full, md) {
    const vol = clumps.some((c) => c.ph < 2), fond = clumps.find((c) => c.ph === 2);
    const homog = nFree > 0 && nAtt === 0 && top / nFree >= 0.36;
    if (vol) return sat
      ? "Tu ajoutes encore du sucre… mais la solution est déjà <mark>saturée</mark>. Regarde ce qu'il devient au fond."
      : 'Voici le <mark>soluté</mark> : du sucre. Il tombe dans l\'eau, le <mark>solvant</mark>.';
    if (fond && fond.det === 0) return '1re étape : le sucre est au fond. Le sucre ajouté peut encore se dissoudre : il est <mark>soluble</mark> dans l\'eau.';
    if (nAtt > 0 || (nFree > 0 && !homog)) return '2e étape : il commence à se disperser. Les molécules de sucre se séparent et se dispersent entre les molécules d\'eau : elles <mark>diffusent</mark>.' + (ag < 0.3 ? ' Clique sur « Agiter » pour aller plus vite.' : '');
    if (nDep > 0) return 'Le sucre ajouté reste à l\'état solide : il se dépose au fond. Il y a <mark>sursaturation</mark> : le mélange jusqu\'alors homogène devient <mark>hétérogène</mark>.' + (full ? ' Le bécher est plein : recommence.' : ' Change le volume d\'eau pour recommencer.');
    if (sat) return 'La solution est dite <mark>saturée</mark> : un solvant ne peut dissoudre indéfiniment un soluté. Le prochain sucre ajouté ne se dissoudra plus.';
    const cours = V !== 1 ? '' : Math.abs(md - 1) < 0.01 ? ' Situation 1 du cours : 1 g de sucre dans 1 L → C = 1 g/L.'
      : Math.abs(md - 5) < 0.01 ? ' Situation 2 du cours : 5 g dans 1 L → C = 5 g/L, plus sucrée, car sa concentration en sucre est plus grande.' : '';
    if (homog) return '3e étape : il est réparti partout. On obtient une <mark>solution</mark> (un <mark>mélange homogène</mark>), ici une <mark>solution aqueuse</mark> : le solvant est l\'eau. La disparition du soluté n\'est qu\'apparente : regarde la balance.' + cours;
    return 'Dans le bécher : de l\'eau. C\'est le <mark>solvant</mark>, le liquide qui permet la désagrégation d\'une autre substance. Ajoute du sucre : c\'est le <mark>soluté</mark>, la substance qui se dissout.';
  }

  // ===== Fondre ou dissoudre ? =====
  function resetB() {
    running = false; melt = 0; diss = 0; n2 = 0; rep = { glacon: null, sucre: null }; last = ''; qG.set(''); qS.set('');
    for (let i = 0; i < N2; i++) sm2.setPos(i, 0, -99, 0);
    sm2.commit();
  }
  function repondre(q, v) {
    rep[q] = v;
    if (q === 'glacon') last = v === 'fond'
      ? 'Oui : le glaçon <mark>fond</mark>. La <mark>fusion</mark> est le passage de l\'état solide à l\'état liquide sous l\'effet de la chaleur.'
      : 'Non : aucun liquide ne le désagrège. C\'est la chaleur qui le fait passer de l\'état solide à l\'état liquide : il <mark>fond</mark>, c\'est une <mark>fusion</mark>.';
    else last = v === 'dissout'
      ? 'Oui : le sucre <mark>se dissout</mark>. La <mark>dissolution</mark> est la désagrégation d\'un corps au moyen d\'un solvant (ici, l\'eau).'
      : 'Non ! On dit souvent « le sucre fond dans le café », mais ce n\'est pas la chaleur qui le fait disparaître : c\'est l\'eau, le <mark>solvant</mark>, qui le désagrège. Il <mark>se dissout</mark> : c\'est une <mark>dissolution</mark>.';
  }
  function stepB(dt) {
    if (running) { melt = Math.min(1, melt + dt / 9); diss = Math.min(1, diss + dt / 9); }
    const k = Math.max(0.001, Math.cbrt(1 - melt));
    ice.scale.setScalar(k); ice.position.y = 0.265 + 0.225 * k;
    flaque.visible = melt > 0; flaque.scale.set(0.1 + 0.34 * Math.sqrt(melt), 0.012 + 0.02 * melt, 0.1 + 0.34 * Math.sqrt(melt)); flaque.position.y = 0.27 + flaque.scale.y / 2;
    const kc = Math.max(0.001, Math.cbrt(1 - diss));
    cube.scale.setScalar(kc); cube.position.y = 0.02 + 0.13 * kc;
    while (n2 < Math.floor(diss * N2)) {   // une molécule de sucre quitte le morceau…
      const a = rand(0, 6.283), j = n2 * 3;
      P2.set([Math.cos(a) * 0.15 * kc, 0.05 + rand(0, 0.2) * kc, Math.sin(a) * 0.15 * kc], j); V2.fill(0, j, j + 3); n2++;
    }
    for (let i = 0; i < n2; i++) { walk(P2, V2, i, dt, 0, 0.44, 0.04, 0.66); sm2.setPos(i, 1.35 + P2[i * 3], P2[i * 3 + 1], P2[i * 3 + 2]); }   // …et diffuse dans l'eau
    sm2.commit();
    lIce.show(melt < 0.97); lSuc.show(diss < 0.97); lFus.show(!!rep.glacon); lDis.show(!!rep.sucre);
    // étapes : lancer → répondre pour le glaçon → répondre pour le sucre → à retenir (une bonne réponse fait avancer)
    const okG = rep.glacon === 'fond', okS = rep.sucre === 'dissout', c = !running ? 0 : !okG ? 1 : !okS ? 2 : 3;
    if (c === 3) finiB = true;
    bL.disabled = running; EB.set(c);
    EB.info(1, !rep.glacon ? '' : okG ? "✓ Il fond : c'est une <b>fusion</b>." : "✗ Pas tout à fait : lis l'explication, puis réessaie.");
    EB.info(2, !rep.sucre ? '' : okS ? "✓ Il se dissout : c'est une <b>dissolution</b>." : "✗ Pas tout à fait : lis l'explication, puis réessaie.");
    EB.info(3, c !== 3 ? '' : "✓ La <b>fusion</b> se fait sous l'effet de la chaleur ; la <b>dissolution</b>, au moyen d'un solvant."
      + (finiA ? '' : '<br>➜ Essaie « Dissoudre », en haut.'));
    suiteMode();
    const resume = rep.glacon && rep.sucre ? '<br><b>À retenir :</b> la <mark>fusion</mark> est le passage de l\'état solide à l\'état liquide sous l\'effet de la chaleur ; la <mark>dissolution</mark> est la désagrégation d\'un corps au moyen d\'un solvant.' : '';
    ex.set(last ? last + resume : running
      ? 'Regarde bien : qu\'est-ce qui fait disparaître le glaçon ? Et le sucre ? Réponds aux deux questions.'
      : 'Il faut distinguer <mark>fondre</mark> et <mark>dissoudre</mark>. À gauche, un glaçon sur une plaque chauffante. À droite, un morceau de sucre dans l\'eau, sans chauffer. Lance les deux expériences.');
  }

  // ===== Commun =====
  const put = (o, s) => { if (o._v !== s) { o._v = s; if (o.set) o.set(s); else o.innerHTML = s; } };
  function setMode(m) {
    mode = m; modeC.set(m);
    GA.visible = m === 'dis'; GB.visible = !GA.visible;
    partA.style.display = GA.visible ? 'flex' : 'none'; partB.style.display = GA.visible ? 'none' : 'flex';
    labelsA.forEach((l) => l.show(GA.visible)); labelsB.forEach((l) => l.show(!GA.visible));
    const c = st.controls, off = st.camera.position.clone().sub(c.target);
    c.target.set(GA.visible ? 0 : 0.2, GA.visible ? 1.3 : 0.6, 0); st.camera.position.copy(c.target).add(off); lastAsp = 0;
    if (!GA.visible) resetB();
  }
  function fit() {
    const { w, h: hh } = st.size(), asp = w / hh;
    if (Math.abs(asp - lastAsp) < 0.02) return;
    lastAsp = asp;
    const tn = Math.tan(THREE.MathUtils.degToRad(st.camera.fov / 2));
    const dd = mode === 'dis' ? Math.max(1.6 / tn, 2.45 / (tn * asp)) : Math.max(1.0 / tn, 2.8 / (tn * asp));
    const c = st.controls, dir = st.camera.position.clone().sub(c.target).normalize();
    st.camera.position.copy(c.target).addScaledVector(dir, dd); c.maxDistance = dd * 1.6;
    const fs = w < 500 ? '11px' : '';
    [...labelsA, ...labelsB].forEach((l) => { if (l !== lBal) l.el.style.fontSize = fs; });
  }
  function frame(dt) {
    dt = clamp(dt, 0, 0.05);   // la 1re image peut donner un dt négatif
    clock += dt; fit();
    if (mode === 'dis') stepA(dt); else stepB(dt);
  }

  reset(); setMode('dis');
  st.onFrame(frame);

  // Banc d'essai : ?etat=diffuse | homogene | sature | comp — sans effet sinon
  const etat = new URLSearchParams(location.search).get('etat');
  if (etat) {
    const run = (s) => { for (let i = 0; i < s * 30; i++) frame(1 / 30); };
    if (etat === 'comp') { setMode('comp'); running = true; run(5); repondre('sucre', 'fond'); qS.set('fond'); }
    else if (etat === 'sature') { V = 0.5; volS.set(0.5); reset(); ajouter(5); ajouter(5); run(4); agUntil = clock + 30; run(12); ajouter(5); run(5); }
    else { ajouter(5); run(etat === 'diffuse' ? 6 : 25); }
  }

  return { dispose() { st.dispose(); retirerStyle(); } };
}
