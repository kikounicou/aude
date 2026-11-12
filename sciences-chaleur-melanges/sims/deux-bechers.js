// deux-bechers.js — « Chaleur et température : deux grandeurs différentes » (thème 5 : manipulations 4 et 5,
// « J'apprends à interpréter des données »). Les températures suivent exactement les tableaux du cours.
import { THREE, C, layout, createStage, panel, explain, beaker, ground, molecules, liquidMaterial, tempColor, clamp, lerp, rand } from './kit.js';

// ---------- Guide pas à pas ----------
// Composant local, IDENTIQUE dans chaine-energie, thermoscope, thermometre et deux-bechers (à mettre en commun dans kit.js).
//   const g = guide(panelEl, ['Étape 1', 'Étape 2'], { avant: noeud, onRecommencer });
//   g.set(cur, faits, html, fin) : étape en cours (−1 = fini), Set des étapes faites, retour + consigne (HTML)
//   g.appel(bouton, on) : l'action principale pulse · g.zone(el, on) : cadre la zone à manipuler
//   g.verrou(el, on, pourquoi, apres) : grise une commande ET dit pourquoi, juste en dessous (ou sous `apres`)
const GD_CSS = `
.gd{background:rgba(20,18,38,.6);border:1.5px solid rgba(255,228,92,.55);border-radius:14px;padding:10px 12px;display:flex;flex-direction:column;gap:8px}
.gd.gd-fini{background:rgba(255,228,92,.1)}
.gd-pas{display:flex;flex-wrap:wrap;gap:6px;margin:0;padding:0;list-style:none}
.gd-pas li{display:flex;align-items:center;gap:6px;padding:3px 10px 3px 3px;border-radius:99px;font:600 13px/1.2 var(--texte);color:#9d96cc;border:1.5px solid rgba(255,255,255,.14)}
.gd-pas li b{display:inline-grid;place-items:center;width:22px;height:22px;border-radius:50%;background:rgba(255,255,255,.12);color:#cfc8ff;font-size:12.5px}
.gd-pas li.fait{color:#fff;border-color:rgba(255,228,92,.45)}.gd-pas li.fait b{background:var(--fluo);color:var(--encre)}
.gd-pas li.cur{color:var(--encre);background:var(--fluo);border-color:var(--fluo)}.gd-pas li.cur b{background:var(--encre);color:var(--fluo)}
.gd-msg{margin:0;font:500 14.5px/1.4 var(--texte);color:#fff}.gd-msg b{color:var(--fluo)}.gd mark{color:var(--encre)}
.gd .sim-btn{align-self:flex-start}
.gd-appel{box-shadow:0 0 0 3px rgba(255,228,92,.85);animation:gd-appel 1.4s ease-in-out infinite}
@keyframes gd-appel{50%{box-shadow:0 0 0 8px rgba(255,228,92,.22)}}
.gd-zone{outline:2px dashed rgba(255,228,92,.75);outline-offset:3px;border-radius:12px}
.gd-lock{opacity:.45}.gd-lock button{cursor:not-allowed}
.gd-pourquoi{flex-basis:100%;margin:-4px 0 0;font-size:13.5px;color:#ffd9a8}
`;
function guide(parent, noms, o = {}) {
  let css = document.getElementById('gd-style');
  if (!css) { css = document.createElement('style'); css.id = 'gd-style'; css.textContent = GD_CSS; document.head.appendChild(css); }
  css.dataset.n = (+css.dataset.n || 0) + 1;
  const box = document.createElement('div'); box.className = 'gd';
  box.innerHTML = `<ol class="gd-pas" aria-label="Les étapes">${noms.map((n, i) => `<li><b>${i + 1}</b><span>${n}</span></li>`).join('')}</ol><p class="gd-msg" aria-live="polite"></p>`;
  const lis = [...box.querySelectorAll('li')], msg = box.querySelector('.gd-msg'), raisons = new Map();
  let bR = null, cle = '';
  if (o.onRecommencer) {
    bR = document.createElement('button'); bR.type = 'button'; bR.className = 'sim-btn'; bR.textContent = '↺ Recommencer'; bR.hidden = true;
    bR.addEventListener('click', o.onRecommencer); box.appendChild(bR);
  }
  parent.insertBefore(box, o.avant || null);
  return {
    el: box,
    set(cur, faits, html, fin = false) {
      const k = cur + '|' + [...faits].join(',') + '|' + html + fin; if (k === cle) return; cle = k;
      lis.forEach((li, i) => { const f = faits.has(i); li.className = f ? 'fait' : i === cur ? 'cur' : ''; li.firstChild.textContent = f ? '✓' : i + 1; if (i === cur) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current'); });
      msg.innerHTML = html; box.classList.toggle('gd-fini', fin); if (bR) bR.hidden = !fin;
    },
    appel(b, on) { b.classList.toggle('gd-appel', !!on); },
    zone(e, on) { e.classList.toggle('gd-zone', !!on); },
    verrou(e, on, pourquoi = '', apres = e) {
      e.classList.toggle('gd-lock', !!on);
      (e.tagName === 'BUTTON' ? [e] : e.querySelectorAll('button')).forEach((b) => { b.disabled = !!on; });
      let p = raisons.get(e);
      if (on && !p) { p = document.createElement('p'); p.className = 'gd-pourquoi'; raisons.set(e, p); apres.after(p); }
      if (p) { p.hidden = !on; p.textContent = '🔒 ' + pourquoi; }
    },
    dispose() { box.remove(); raisons.forEach((p) => p.remove()); css.dataset.n = +css.dataset.n - 1; if (+css.dataset.n <= 0) css.remove(); },
  };
}

// Manipulation 4 : [minute, thermomètre 1 (50 mL), thermomètre 2 (100 mL)]
const TAB4 = [[0, 17, 17], [1, 30, 28], [2, 62, 47], [3, 80, 56], [4, 95, 66], [5, 95, 81]];
const LIGNES4 = ['Avant de chauffer', '1 minute', '2 minutes', '3 minutes', '4 minutes', '5 minutes'];
const LIGNES5 = ["Au début de l'ébullition", '30 secondes', '60 secondes', '90 secondes'];
// J'apprends à interpréter des données : 5 minutes de chauffe, départ à 20 °C
const DONNEES = [
  { liq: 'eau', m: 250, Tf: 69, level: 0.28, n: 44 },
  { liq: 'eau', m: 500, Tf: 45, level: 0.56, n: 88 },
  { liq: 'huile', m: 250, Tf: 93, level: 0.3, n: 46 },
];
const MODES = {
  A: { dur: 5, speed: 1 / 2.5, step: 0.05 }, // minutes ; 1 minute ≈ 2,5 s
  B: { dur: 120, speed: 12, step: 1 },       // secondes ; 30 s ≈ 2,5 s ; l'ébullition commence à 30 s
  C: { dur: 5, speed: 1 / 2.5, step: 0.05 },
};
const EB = 30;      // début de l'ébullition (manipulation 5, en secondes)
const YB = 0.618;   // fond des béchers (posés sur la grille)
const VIEW = { A: { tg: [0, 1.1, 0], hw: 1.25, hh: 1.3 }, B: { tg: [0, 1.15, 0], hw: 1.15, hh: 1.3 }, C: { tg: [0, 1.1, 0], hw: 2.2, hh: 1.3 } };

const TXT = {
  A0: "Bécher 1 : 50 mL d'eau. Bécher 2 : 100 mL d'eau. Les deux sont à 17 °C, sur la même <mark>source de chaleur</mark>. Appuie sur « Chauffer » : on relève les deux températures toutes les minutes.",
  A1: 'Même flamme, même durée : les deux béchers reçoivent la <mark>même quantité de chaleur</mark>. Et pourtant, la <mark>température</mark> ne varie pas de la même manière dans les deux béchers.',
  A5: 'Après 5 minutes, la température est plus élevée sur le thermomètre 1 (95 °C contre 81 °C). Même <mark>quantité de chaleur</mark> apportée, températures différentes : <mark>chaleur et température sont deux grandeurs différentes</mark>.',
  B0: "On prolonge le temps de chauffe jusqu'à l'<mark>ébullition</mark> de l'eau du bécher 1 (il est à 95 °C). Appuie sur « Chauffer ».",
  B1: "On chauffe encore : la température monte, les molécules <mark>s'agitent</mark> de plus en plus.",
  B2: "C'est l'<mark>ébullition</mark> : des bulles se forment au sein du liquide. La <mark>chaleur fournie</mark> augmente… et pourtant la température reste à 100 °C : c'est un <mark>palier</mark>.",
  Bp: 'En pause : sans flamme, plus de bulles. Appuie sur « Reprendre » pour continuer à chauffer.',
  B3: "La <mark>quantité de chaleur</mark> fournie à l'eau augmente et pourtant sa température ne varie plus. <mark>Chaleur et température sont deux notions différentes mais liées.</mark>",
  C0: 'Eau 250 g, eau 500 g, huile 250 g : les trois partent de 20 °C, sous trois flammes identiques. Appuie sur « Chauffer » pour 5 minutes.',
  C1: 'Le <mark>temps de chauffe est identique</mark> : les trois liquides reçoivent la <mark>même quantité de chaleur</mark>. Regarde les thermomètres : ils ne montent pas de la même façon.',
  C5: 'Eau 250 g : 69 °C. Eau 500 g : 45 °C. Huile 250 g : 93 °C. Une même quantité de <mark>chaleur</mark> provoque une élévation de <mark>température</mark> différente suivant la <mark>masse</mark> du liquide chauffé et suivant sa <mark>nature</mark>.',
};
// Le parcours guidé : les trois expériences dans l'ordre du cours (la manipulation 5 prolonge la 4)
const PAS = ['Manip. 4', 'Manip. 5', 'Interpréter'];
const ORDRE = ['A', 'B', 'C'], NOM = { A: 'manipulation 4', B: 'manipulation 5', C: 'interpréter des données' };
const CONS = {
  A0: '<b>1.</b> Les deux béchers sont sur la même flamme. Touche « Chauffer » et regarde les deux thermomètres.',
  A1: '🔥 On chauffe… Le tableau se remplit : les deux températures montent-elles de la même façon ?',
  Afin: '✓ Après 5 minutes : 95 °C dans le bécher 1, 81 °C dans le bécher 2.',
  B0: "<b>2.</b> On prolonge jusqu'à l'ébullition du bécher 1. Touche « Chauffer » et surveille le thermomètre.",
  B1: '🔥 On chauffe… la température monte vers 100 °C.',
  B2: "L'eau bout et on chauffe toujours… que fait la température ?",
  Bfin: "✓ L'eau bout et la température reste à 100 °C : c'est un palier.",
  C0: '<b>3.</b> Trois liquides, trois flammes identiques. Touche « Chauffer » pour 5 minutes.',
  C1: '🔥 Même temps de chauffe pour les trois : regarde les thermomètres.',
  Cfin: '✓ Eau 250 g : 69 °C · eau 500 g : 45 °C · huile 250 g : 93 °C.',
  p: 'En pause. Touche « Reprendre » pour continuer à chauffer.',
};
const FIN = "<b>✓ Bravo, les trois expériences sont faites !</b> Même quantité de chaleur, températures différentes : <mark>chaleur et température sont deux grandeurs différentes</mark>. La quantité de chaleur fournie augmente et la température ne varie plus : ce sont <mark>deux notions différentes mais liées</mark>. Une même quantité de <mark>chaleur</mark> provoque une élévation de <mark>température</mark> différente suivant la <mark>masse</mark> du liquide chauffé et suivant sa <mark>nature</mark>.";

function interp(col, t) {
  if (t <= 0) return TAB4[0][col];
  for (let i = 0; i < TAB4.length - 1; i++) if (t <= TAB4[i + 1][0]) return lerp(TAB4[i][col], TAB4[i + 1][col], t - TAB4[i][0]);
  return TAB4[TAB4.length - 1][col];
}
function temperatures(mode, t) {
  if (mode === 'A') return [interp(1, t), interp(2, t)];
  if (mode === 'B') return [t < EB ? 95 + (5 * t) / EB : 100];
  return DONNEES.map((d) => 20 + ((d.Tf - 20) * t) / 5);
}
const minSec = (v) => { const tot = Math.round(v * 60), m = Math.floor(tot / 60), s = tot % 60; return m ? (s ? `${m} min ${s} s` : `${m} min`) : `${s} s`; };
const fmtT = (mode, v) => (mode === 'B' ? `${Math.round(v)} s` : minSec(v));
const yT = (T) => 0.16 + ((clamp(T, -10, 110) + 10) / 120) * 1.06; // hauteur du liquide des petits thermomètres
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const UP = V(0, 1, 0);
function rod(a, b, r, mat) {
  const d = new THREE.Vector3().subVectors(b, a), m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, d.length(), 8), mat);
  m.position.addVectors(a, b).multiplyScalar(0.5); m.quaternion.setFromUnitVectors(UP, d.normalize()); return m;
}
function canvasTex(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
const softTex = () => canvasTex(128, 128, (g) => {
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.45, 'rgba(255,255,255,.4)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
});
const wireTex = (w, d, disc) => canvasTex(Math.round(256 * w), Math.round(256 * d), (g, W, H) => {
  g.strokeStyle = 'rgba(200,205,220,.7)'; g.lineWidth = 2;
  for (let i = 6; i < Math.max(W, H); i += 12) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, H); g.moveTo(0, i); g.lineTo(W, i); g.stroke(); }
  g.lineWidth = 8; g.strokeStyle = 'rgba(160,165,180,.95)'; g.strokeRect(4, 4, W - 8, H - 8);
  if (disc) { g.fillStyle = 'rgba(235,232,225,.9)'; g.beginPath(); g.arc(W / 2, H / 2, 64, 0, 7); g.fill(); }
});
const scaleTex = () => canvasTex(64, 1024, (g) => {
  g.fillStyle = '#efe8d6'; g.fillRect(0, 0, 64, 1024); g.strokeStyle = '#1d1b2f';
  for (let T = -10; T <= 110; T += 5) { const y = 1024 - ((T + 10) / 120) * 1024; g.lineWidth = T % 10 === 0 ? 6 : 3; g.beginPath(); g.moveTo(0, y); g.lineTo(T % 10 === 0 ? 46 : 26, y); g.stroke(); }
});

// petite jauge horizontale (HTML)
function gauge(parent, label, grad) {
  const w = document.createElement('div'); w.style.cssText = 'display:flex;flex-direction:column;gap:5px;font-size:14px;color:#cfc8ff';
  w.innerHTML = `<div style="display:flex;justify-content:space-between;gap:8px;align-items:baseline"><span>${label}</span><strong style="color:#fff;font-size:15px;white-space:nowrap"></strong></div><div style="height:14px;border-radius:99px;background:rgba(255,255,255,.12);overflow:hidden"><div style="height:100%;width:0;border-radius:99px;background:${grad}"></div></div>`;
  parent.appendChild(w);
  const val = w.firstElementChild.lastElementChild, bar = w.lastElementChild.firstElementChild;
  return { set(f, tx) { bar.style.width = clamp(f, 0, 1) * 100 + '%'; val.textContent = tx; } };
}
function table(parent, head, rows) {
  const tb = document.createElement('table'); tb.className = 'sim-table';
  tb.innerHTML = `<thead><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c, i) => (i === 0 ? `<th>${c}</th>` : `<td>${c}</td>`)).join('')}</tr>`).join('')}</tbody>`;
  parent.appendChild(tb);
  return [...tb.tBodies[0].rows];
}

export default function mount(root) {
  const { stageEl, panelEl, explainEl } = layout(root);
  const st = createStage(stageEl, { camera: { pos: [0, 2.2, 4.6], target: [0, 1.12, 0] }, minDistance: 2.5, maxDistance: 12 });
  const ex = explain(explainEl), ctl = st.controls;
  let userMoved = false, lastAsp = 0, rig = null, P = null;
  const onStart = () => { userMoved = true; };
  if (ctl) { ctl.minAzimuthAngle = -0.8; ctl.maxAzimuthAngle = 0.8; ctl.addEventListener('start', onStart); }
  st.scene.add(ground());
  const s = { mode: 'A', t: 0, play: false };

  // ---------- Matériel (reconstruit à chaque changement d'expérience) ----------
  function newRig() {
    const g = new THREE.Group(); st.scene.add(g);
    const std = (color, metalness, roughness) => new THREE.MeshStandardMaterial({ color, metalness, roughness });
    const M = {
      iron: std(0x5d6170, 0.5, 0.5), metal: std(C.metal, 0.6, 0.35), brass: std(0xb08a4a, 0.5, 0.4),
      red: new THREE.MeshStandardMaterial({ color: 0xe23a2e, emissive: 0x4a0804, roughness: 0.3 }),
      glass: new THREE.MeshPhysicalMaterial({ color: C.verre, transparent: true, opacity: 0.32, roughness: 0.1, depthWrite: false }),
      soft: softTex(), scale: scaleTex(),
    };
    return { g, M, units: [], burners: [], labels: [], extra: [] };
  }
  function clearRig() {
    if (!rig) return;
    rig.labels.forEach((L) => L.remove());
    rig.g.traverse((o) => {
      if (o.isInstancedMesh) o.dispose();
      if (o.geometry) o.geometry.dispose();
      if (o.material) [].concat(o.material).forEach((m) => { if (m.map) m.map.dispose(); m.dispose(); });
    });
    st.scene.remove(rig.g); rig = null;
  }
  function labelAt(R, html, pos, cls = '', parent = R.g) {
    const a = new THREE.Object3D(); a.position.set(...pos); parent.add(a);
    const L = st.label(html, a, { cls }); R.labels.push(L); return L;
  }
  function callout(R, html, from, to) {
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([V(...from), V(...to)]), new THREE.LineBasicMaterial({ color: 0xd9d3ff, transparent: true, opacity: 0.6 }));
    R.g.add(line); const L = labelAt(R, html, to);
    return { show(on) { line.visible = on; L.show(on); } };
  }
  // bec Bunsen : la flamme ne brûle que pendant la chauffe
  function burner(R, x) {
    const M = R.M, g = new THREE.Group(); g.position.x = x; R.g.add(g);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.19, 0.05, 28), M.metal); base.position.y = 0.025;
    const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.048, 0.34, 16), M.metal); tube.position.y = 0.22;
    const bague = new THREE.Mesh(new THREE.CylinderGeometry(0.058, 0.058, 0.05, 16), M.brass); bague.position.y = 0.12;
    const fm = (c, o) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
    const out = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.22, 18, 1, true), fm(0x4f6dff, 0.6));
    const inn = new THREE.Mesh(new THREE.ConeGeometry(0.032, 0.11, 14, 1, true), fm(0x9fe6ff, 0.85));
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: M.soft, color: 0xff7a3a, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
    glow.position.y = 0.63; glow.scale.set(0.75, 0.75, 1);
    g.add(base, tube, bague, out, inn, glow);
    let k = 0;
    R.burners.push((dt, t, on) => {
      k = clamp(k + (on ? dt : -dt) * 4, 0, 1);
      const f = k * (0.92 + 0.08 * Math.sin(t * 27 + x * 5) + 0.04 * Math.sin(t * 61));
      out.visible = inn.visible = k > 0.01;
      out.scale.set(1, Math.max(f, 0.01), 1); out.position.y = 0.39 + 0.11 * f;
      inn.scale.set(1, Math.max(k, 0.01), 1); inn.position.y = 0.39 + 0.055 * k;
      glow.material.opacity = 0.45 * k;
    });
  }
  function tripod(R, x) {
    const M = R.M, g = new THREE.Group(); g.position.x = x; R.g.add(g);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.017, 8, 48), M.iron); ring.rotation.x = Math.PI / 2; ring.position.y = 0.6; g.add(ring);
    for (const a of [-Math.PI / 2, Math.PI / 6, (5 * Math.PI) / 6]) g.add(rod(V(Math.cos(a) * 0.42, 0.6, Math.sin(a) * 0.42), V(Math.cos(a) * 0.55, 0, Math.sin(a) * 0.55), 0.016, M.iron));
    g.add(grille(0.96, 0.96, true));
  }
  // grand support (4 pieds) : les deux béchers sur la même grille, au-dessus du même bec Bunsen
  function support(R, w, d) {
    const M = R.M, hw = w / 2, hd = d / 2, c = [[-hw, -hd], [hw, -hd], [hw, hd], [-hw, hd]];
    for (let i = 0; i < 4; i++) {
      const [x1, z1] = c[i], [x2, z2] = c[(i + 1) % 4];
      R.g.add(rod(V(x1, 0.6, z1), V(x2, 0.6, z2), 0.017, M.iron), rod(V(x1, 0.6, z1), V(x1 * 1.05, 0, z1 * 1.15), 0.016, M.iron));
    }
    R.g.add(grille(w, d, false));
  }
  function grille(w, d, disc) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshBasicMaterial({ map: wireTex(w, d, disc), transparent: true, depthWrite: false, side: THREE.DoubleSide }));
    m.rotation.x = -Math.PI / 2; m.position.y = 0.612; return m;
  }
  // petit thermomètre gradué (le liquide monte avec la température)
  function smallThermo(parent, M, x, z) {
    const g = new THREE.Group(); g.position.set(x, 0, z); parent.add(g);
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.28, 14, 1, true), M.glass); stem.position.y = 0.71;
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.03, 12, 6, 0, 6.283, 0, Math.PI / 2), M.glass); cap.position.y = 1.35;
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.042, 16, 12), M.red); bulb.scale.y = 1.5; bulb.position.y = 0.07;
    const colGeo = new THREE.CylinderGeometry(0.016, 0.016, 1, 10); colGeo.translate(0, 0.5, 0);
    const col = new THREE.Mesh(colGeo, M.red); col.position.y = 0.1;
    const sc = new THREE.Mesh(new THREE.PlaneGeometry(0.05, 1.06), new THREE.MeshBasicMaterial({ map: M.scale })); sc.position.set(0.055, 0.69, -0.012);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.012, 6, 16), M.iron); ring.rotation.x = Math.PI / 2; ring.position.y = 1.25;
    g.add(stem, cap, bulb, col, sc, ring);
    return { set(T) { col.scale.y = yT(T) - 0.1; } };
  }
  // un bécher : liquide, molécules, thermomètre sur statif, étiquette (nom + température lue)
  function unit(R, { x, level, liq = 'eau', n, name, side = 1, boil = false }) {
    const M = R.M, RB = 0.4, g = new THREE.Group(); g.position.set(x, YB, 0); R.g.add(g);
    g.add(beaker(RB, 0.9));
    const base = new THREE.Color(liq === 'huile' ? 0xf0b429 : C.eau), cm = new THREE.Color(), cGas = new THREE.Color(0xffe2d6);
    const lm = liquidMaterial(base.getHex(), liq === 'huile' ? 0.62 : 0.48);
    const liquid = new THREE.Mesh(new THREE.CylinderGeometry(RB - 0.012, RB - 0.012, level, 40), lm);
    liquid.position.y = level / 2 + 0.006; liquid.renderOrder = 2; g.add(liquid);
    // molécules : elles roulent les unes sur les autres, d'autant plus vite que la température est élevée
    const mol = molecules(n, { radius: 0.03, segments: 8 }); g.add(mol.mesh);
    const Pp = new Float32Array(n * 3), Vv = new Float32Array(n * 3), gas = new Uint8Array(n);
    const place = (i) => { const a = rand(6.283), r = Math.sqrt(Math.random()) * (RB - 0.05); Pp[i * 3] = Math.cos(a) * r; Pp[i * 3 + 1] = rand(0.035, level - 0.035); Pp[i * 3 + 2] = Math.sin(a) * r; };
    for (let i = 0; i < n * 3; i++) Vv[i] = rand(-1, 1);
    for (let i = 0; i < n; i++) place(i);
    // thermomètre fixé à un statif
    const tx = side * 0.16, tz = -0.14, th = smallThermo(g, M, tx, tz), sx = x + tx, armY = YB + 1.25;
    const foot = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.04, 0.3), M.iron); foot.position.set(sx, 0.02, -0.9);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 2.1, 10), M.iron); pole.position.set(sx, 1.05, -0.9);
    const boss = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.09, 0.09), M.iron); boss.position.set(sx, armY, -0.9);
    R.g.add(foot, pole, boss, rod(V(sx, armY, -0.9), V(sx, armY, tz), 0.018, M.iron));
    const L = labelAt(R, '', [tx, 1.62, tz], '', g); L.el.style.textAlign = 'center';
    // ébullition (manipulation 5) : bulles au sein du liquide + vapeur au-dessus
    let bub = null, BP = null; const puffs = [];
    const newBub = (i, y) => { const a = rand(6.283), r = Math.sqrt(Math.random()) * 0.33; BP[i * 4] = Math.cos(a) * r; BP[i * 4 + 1] = y; BP[i * 4 + 2] = Math.sin(a) * r; BP[i * 4 + 3] = rand(0.25, 0.45); };
    if (boil) {
      bub = molecules(26, { radius: 0.034, color: 0xeaf6ff, segments: 10 });
      Object.assign(bub.mesh.material, { transparent: true, opacity: 0.72, depthWrite: false }); bub.mesh.renderOrder = 1; g.add(bub.mesh);
      BP = new Float32Array(26 * 4); for (let i = 0; i < 26; i++) newBub(i, rand(0, level));
      for (let i = 0; i < 14; i++) {
        const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: M.soft, color: C.vapeur, transparent: true, opacity: 0, depthWrite: false }));
        spr.renderOrder = 3; g.add(spr); puffs.push({ spr, life: i / 14, x: rand(-0.22, 0.22), z: rand(-0.22, 0.22), ph: rand(6) });
      }
    }
    let lastR = null, boilK = 0;
    const u = {
      reset() { gas.fill(0); for (let i = 0; i < n; i++) place(i); },
      update(dt, T, boiling) {
        th.set(T);
        tempColor((T - 10) / 90, cm);
        if (liq === 'huile') lm.color.copy(base).lerp(cm, 0.3); else lm.color.copy(cm).lerp(base, 0.25);
        boilK = clamp(boilK + (boiling ? dt : -dt) * 1.5, 0, 1);
        const sp = 0.05 + 0.75 * Math.pow(clamp(T / 100, 0, 1), 1.6), j = sp * 9 * dt, lim = RB - 0.045, top = level - 0.035;
        for (let i = 0; i < n; i++) {
          const k = i * 3;
          if (gas[i]) { // molécule qui s'échappe : elle quitte le liquide
            Pp[k] += Vv[k] * 0.12 * dt; Pp[k + 1] += 0.6 * dt; Pp[k + 2] += Vv[k + 2] * 0.12 * dt;
            if (Pp[k + 1] > level + 1.1) { gas[i] = 0; place(i); }
            mol.setColor(i, cGas);
          } else {
            let vx = Vv[k] + rand(-j, j), vy = Vv[k + 1] + rand(-j, j), vz = Vv[k + 2] + rand(-j, j);
            const m = Math.hypot(vx, vy, vz) || 1; vx *= sp / m; vy *= sp / m; vz *= sp / m;
            let px = Pp[k] + vx * dt, py = Pp[k + 1] + vy * dt, pz = Pp[k + 2] + vz * dt;
            const r = Math.hypot(px, pz); if (r > lim) { px *= lim / r; pz *= lim / r; vx = -vx; vz = -vz; }
            if (py < 0.035) { py = 0.035; vy = Math.abs(vy); } else if (py > top) { py = top; vy = -Math.abs(vy); }
            Pp[k] = px; Pp[k + 1] = py; Pp[k + 2] = pz; Vv[k] = vx; Vv[k + 1] = vy; Vv[k + 2] = vz;
            if (boiling && py > top - 0.03 && Math.random() < dt * 0.3) gas[i] = 1;
            mol.setColor(i, cm);
          }
          mol.setPos(i, Pp[k], Pp[k + 1], Pp[k + 2]);
        }
        mol.commit();
        if (bub) {
          bub.mesh.visible = boilK > 0.01;
          if (bub.mesh.visible) {
            for (let i = 0; i < 26; i++) { const k = i * 4; BP[k + 1] += BP[k + 3] * dt; if (BP[k + 1] > level - 0.02) newBub(i, 0.02); bub.setPos(i, BP[k], BP[k + 1], BP[k + 2], (0.5 + (BP[k + 1] / level) * 0.9) * boilK); }
            bub.commit();
          }
          for (const p of puffs) {
            p.life += dt / 2.4; if (p.life > 1) { p.life -= 1; p.x = rand(-0.22, 0.22); p.z = rand(-0.22, 0.22); }
            const l = p.life, sc = 0.14 + l * 0.5;
            p.spr.position.set(p.x + Math.sin(l * 4 + p.ph) * 0.06, level + 0.04 + l * 1.1, p.z); p.spr.scale.set(sc, sc, 1);
            p.spr.material.opacity = Math.sin(l * Math.PI) * 0.32 * boilK;
          }
        }
        const rr = Math.round(T);
        if (rr !== lastR) {
          lastR = rr; L.set(`${name}<br><b style="font-size:18px">${rr} °C</b>`);
          const c = tempColor((T - 10) / 90, new THREE.Color());
          L.el.style.background = '#' + c.getHexString(); L.el.style.borderColor = 'transparent';
          L.el.style.color = 0.299 * c.r + 0.587 * c.g + 0.114 * c.b > 0.5 ? '#1d1b2f' : '#fff';
        }
      },
    };
    R.units.push(u); return u;
  }
  function build(m) {
    const R = newRig();
    if (m === 'A') {
      support(R, 2.0, 0.95); burner(R, 0);
      unit(R, { x: -0.45, level: 0.22, n: 36, name: 'bécher 1 · 50 mL', side: -1 });
      unit(R, { x: 0.45, level: 0.44, n: 72, name: 'bécher 2 · 100 mL', side: 1 });
      labelAt(R, 'un seul bec Bunsen : même source de chaleur', [0, 0.1, 0.75], 'discret');
    } else if (m === 'B') {
      tripod(R, 0); burner(R, 0);
      unit(R, { x: 0, level: 0.22, n: 36, name: 'bécher 1 · 50 mL', side: 1, boil: true });
      labelAt(R, 'bec Bunsen', [0.78, 0.22, 0.4], 'discret');
      const cb = callout(R, 'bulles', [-0.2, YB + 0.11, 0.15], [-0.85, YB + 0.11, 0.15]);
      const cv = callout(R, "vapeur d'eau", [-0.12, YB + 0.75, 0], [-0.85, YB + 0.95, 0]);
      R.extra.push((boiling) => { cb.show(boiling); cv.show(boiling); });
    } else {
      DONNEES.forEach((d, i) => { const x = (i - 1) * 1.5; tripod(R, x); burner(R, x); unit(R, { x, level: d.level, liq: d.liq, n: d.n, name: `${d.liq} · ${d.m} g` }); });
      labelAt(R, 'trois becs Bunsen identiques', [0, 0.1, 0.95], 'discret');
    }
    return R;
  }

  // ---------- Réglages ----------
  const ui = panel(panelEl);
  ui.title('Chaleur et température');
  const faits = new Set();
  const gd = guide(panelEl, PAS, { onRecommencer: () => { faits.clear(); setMode('A'); } });
  const cMode = ui.choice({ label: 'Expérience', value: 'A', onChange: (v) => setMode(v), options: [
    { value: 'A', label: 'Manip. 4' }, { value: 'B', label: 'Manip. 5' }, { value: 'C', label: 'Interpréter des données' }] });
  const bModeB = cMode.el.querySelectorAll('button')[1];
  const box = document.createElement('div'); box.style.cssText = 'display:flex;flex-direction:column;gap:12px'; panelEl.appendChild(box);

  function buildPanel(m) {
    box.innerHTML = '';
    const mu = panel(box), Md = MODES[m];
    // « Continuer » (3e bouton, près de « Chauffer ») mène à la prochaine expérience pas encore faite ; il n'apparaît qu'à la fin
    const [bPlay, , bNext] = mu.buttons([{ label: 'Chauffer', primary: true, onClick: togglePlay }, { label: 'Remettre à zéro', onClick: restart },
      { label: '', onClick: () => { const n = ORDRE.find((x, i) => !faits.has(i)); if (n) setMode(n); } }]);
    bNext.style.display = 'none';
    const sT = mu.slider({ label: 'Temps de chauffe', min: 0, max: Md.dur, step: Md.step, value: s.t, format: (v) => fmtT(m, v), onInput: (v) => { s.play = false; s.t = v; } });
    const gHeat = gauge(box, m === 'A' ? 'Chaleur fournie à chaque bécher' : m === 'B' ? 'Chaleur fournie au bécher 1' : 'Chaleur fournie à chaque récipient', 'linear-gradient(90deg,#ffe45c,#ff5a36)');
    const gTemp = m === 'B' ? gauge(box, 'Température du bécher 1', 'linear-gradient(90deg,#3d8bff,#ffc94d,#ff5a36)') : null;
    let rows;
    if (m === 'A') rows = table(box, ['', 'thermomètre 1<br>(50 mL)', 'thermomètre 2<br>(100 mL)'], LIGNES4.map((l) => [l, '…', '…']));
    else if (m === 'B') rows = table(box, ['Temps', 'Température (°C)'], LIGNES5.map((l) => [l, '…']));
    else rows = table(box, ['Liquide', 'Masse', 'Durée', 'Temp. initiale', 'Temp. finale'], DONNEES.map((d) => [d.liq, d.m + ' g', '5 min', '20 °C', '…']));
    P = { bPlay, sT, gHeat, gTemp, rows, bNext, cache: {} };
  }
  // Le guide : ce qui se passe, puis la prochaine action (une seule mise en avant : Chauffer, puis Continuer)
  function majGuide(end) {
    const c = P.cache, i = ORDRE.indexOf(s.mode);
    if (end) faits.add(i);
    const suivant = ORDRE.find((x, k) => !faits.has(k)), fini = !suivant;
    const k = end ? 'fin' : s.t <= 0 && !s.play ? '0' : !s.play ? 'p' : s.mode === 'B' && s.t >= EB ? '2' : '1';
    let html = k === 'p' ? CONS.p : CONS[s.mode + k];
    if (end && !fini) html += ` <b>${ORDRE.indexOf(suivant) + 1}.</b> Touche « Continuer : ${NOM[suivant]} ».`;
    if (end && fini) html = FIN;
    gd.set(fini && end ? -1 : end ? ORDRE.indexOf(suivant) : i, faits, html, fini && end);
    const next = end && !fini && suivant !== s.mode, cle = [next, end, k, suivant, faits.has(0)].join();
    if (c.guide === cle) return; c.guide = cle;
    P.bNext.style.display = next ? '' : 'none';
    if (next) P.bNext.textContent = `Continuer : ${NOM[suivant]} →`;
    P.bNext.classList.toggle('primary', next); gd.appel(P.bNext, next);
    P.bPlay.classList.toggle('primary', !end); gd.appel(P.bPlay, k === '0' || k === 'p');
    gd.verrou(bModeB, !faits.has(0) && s.mode !== 'B', "Manip. 5 : fais d'abord la manip. 4, elle la prolonge.", cMode.el);
  }
  function togglePlay() {
    if (s.t >= MODES[s.mode].dur - 1e-6) { s.t = 0; rig.units.forEach((u) => u.reset()); }
    s.play = !s.play;
  }
  function restart() { s.t = 0; s.play = false; P.sT.set(0); rig.units.forEach((u) => u.reset()); }
  function setMode(m) {
    s.mode = m; s.t = 0; s.play = false; cMode.set(m);
    clearRig(); rig = build(m); buildPanel(m); fit();
  }
  function refreshPanel(T) {
    const c = P.cache, d = MODES[s.mode].dur, end = s.t >= d - 1e-6;
    const lab = s.play ? 'Pause' : s.t <= 0 ? 'Chauffer' : end ? 'Rejouer' : 'Reprendre';
    if (c.lab !== lab) { c.lab = lab; P.bPlay.textContent = lab; }
    if (c.t !== s.t) { c.t = s.t; P.gHeat.set(s.t / d, fmtT(s.mode, s.t)); }
    if (P.gTemp) { const r = Math.round(T[0]); if (c.tg !== r) { c.tg = r; P.gTemp.set(r / 110, r + ' °C'); } }
    // le tableau se remplit au fil des relevés
    let nR;
    if (s.mode === 'A') nR = Math.min(6, Math.floor(s.t + 1e-6) + 1);
    else if (s.mode === 'B') nR = s.t < EB - 1e-6 ? 0 : Math.min(4, Math.floor((s.t - EB) / 30 + 1e-6) + 1);
    else nR = end ? 3 : 0;
    if (c.nR !== nR) {
      c.nR = nR;
      P.rows.forEach((r, i) => {
        const on = i < nR;
        if (s.mode === 'A') { r.cells[1].textContent = on ? TAB4[i][1] + ' °C' : '…'; r.cells[2].textContent = on ? TAB4[i][2] + ' °C' : '…'; }
        else if (s.mode === 'B') r.cells[1].textContent = on ? '100 °C' : '…';
        else r.cells[4].innerHTML = on ? `<b>${DONNEES[i].Tf} °C</b>` : '…';
        r.style.background = s.mode !== 'C' && on && i === nR - 1 ? 'rgba(255,228,92,.16)' : '';
      });
    }
    majGuide(end);
  }
  function phase() {
    const d = MODES[s.mode].dur;
    if (s.t <= 0 && !s.play) return '0';
    if (s.t >= d - 1e-6) return s.mode === 'B' ? '3' : '5';
    if (s.mode === 'B') return s.t < EB ? '1' : s.play ? '2' : 'p';
    return '1';
  }
  // cadrage : tout le matériel et les étiquettes, quelle que soit la forme de l'écran
  function fit() {
    const v = VIEW[s.mode], { w, h } = st.size(), asp = w / h || 1.3, tn = Math.tan((st.camera.fov * Math.PI) / 360);
    const d = Math.max(v.hh / tn, v.hw / (tn * asp)) * 1.08, e = 0.24;
    st.camera.position.set(v.tg[0], v.tg[1] + d * Math.sin(e), v.tg[2] + d * Math.cos(e));
    if (ctl) { ctl.target.set(...v.tg); ctl.update(); } else st.camera.lookAt(...v.tg);
    lastAsp = asp; userMoved = false;
  }

  st.onFrame((dt, time) => {
    const Md = MODES[s.mode];
    if (s.play) { s.t = Math.min(Md.dur, s.t + dt * Md.speed); if (s.t >= Md.dur) s.play = false; P.sT.set(s.t); }
    const T = temperatures(s.mode, s.t), boiling = s.mode === 'B' && s.t >= EB && s.play;
    rig.units.forEach((u, i) => u.update(dt, T[i], boiling));
    rig.burners.forEach((fn) => fn(dt, time, s.play));
    rig.extra.forEach((fn) => fn(boiling));
    refreshPanel(T);
    ex.set(TXT[s.mode + phase()]);
    if (!userMoved) { const { w, h } = st.size(); if (Math.abs(w / h - lastAsp) > 0.02) fit(); }
  });

  // Banc d'essai : ?essai=B,40,1 ouvre l'expérience B à t = 40 (s ou min selon le mode), flamme allumée.
  const [em, et, ep] = (new URLSearchParams(location.search).get('essai') || '').split(',');
  setMode(MODES[em] ? em : 'A');
  if (et) { s.t = clamp(+et || 0, 0, MODES[s.mode].dur); P.sT.set(s.t); }
  if (ep === '1') s.play = true;

  return { dispose() { if (ctl) ctl.removeEventListener('start', onStart); clearRig(); gd.dispose(); st.dispose(); } };
}
