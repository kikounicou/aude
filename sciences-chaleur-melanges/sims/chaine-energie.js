// chaine-energie.js — « La chaîne d'énergie » (thème 5, partie A, texte d'Églantine).
// L'élève choisit un réservoir et un transformateur du texte ; le receveur est le salon d'Églantine.
// Particules : violet = énergie chimique, orange = énergie thermique, jaune pâle = énergie lumineuse,
// rouge = énergie thermique non désirée (forme dégradée d'énergie).
import { THREE, C, layout, createStage, panel, explain, ground, molecules, clamp, rand } from './kit.js';

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

// ---------- Le contenu (mots du cours) ----------
const RES = {
  bois: { label: 'Bûches de bois', nom: 'Bûches de bois', le: 'les <b>bûches de bois</b>', du: 'des <b>bûches de bois</b>' },
  mazout: { label: 'Mazout', nom: 'Mazout', le: 'le <b>mazout</b>', du: 'du <b>mazout</b>' },
  charbon: { label: 'Charbon', nom: 'Charbon', le: 'le <b>charbon</b>', du: 'du <b>charbon</b>' },
  soleil: { label: 'Soleil', nom: 'Soleil', le: 'le <b>soleil</b>', du: 'du <b>soleil</b>' },
  aliments: { label: 'Aliments (raclette, fondue)', nom: 'Raclette, fondue<br>(aliments)', le: 'les <b>aliments</b>', du: 'des <b>aliments</b>' },
};
const TRA = {
  feu: { label: 'Feu ouvert', nom: 'Feu ouvert', attend: 'bois', sortie: 'énergie thermique<br>et énergie lumineuse',
    regle: 'Dans le texte, le <b>feu ouvert</b> brûle des <b>bûches de bois</b>.', perte: 'par la cheminée, avec la fumée,' },
  chaudiere: { label: 'Chaudière + radiateurs', nom: 'Chaudière<br>et radiateurs', attend: null, sortie: 'énergie thermique',
    regle: 'Dans le texte, la <b>chaudière</b> marche au <b>mazout</b>.', perte: 'par la cheminée de la chaudière, par les tuyaux' },
  poele: { label: 'Poêle à charbon', nom: 'Poêle à charbon', attend: null, sortie: 'énergie thermique',
    regle: 'Dans le texte, le <b>poêle</b> est un poêle à <b>charbon</b>.', perte: 'par le tuyau du poêle, avec la fumée,' },
  cuisiniere: { label: 'Cuisinière électrique', nom: 'Cuisinière<br>électrique', attend: null },
  elle: { label: 'Églantine', nom: 'Églantine', attend: 'aliments', sortie: 'énergie thermique' },
};
const OK = {
  feu: "Les <b>bûches de bois</b> sont le <mark>réservoir</mark> : elles contiennent de l'<mark>énergie chimique</mark>. Le <b>feu ouvert</b> est le <mark>transformateur</mark> : il la restitue sous une autre forme, en <mark>énergie thermique</mark> et <mark>énergie lumineuse</mark>. Le salon est le <mark>receveur</mark> : c'est la chaîne du cours !",
  chaudiere: "Le <b>mazout</b> est le <mark>réservoir</mark> (<mark>énergie chimique</mark>). La <b>chaudière</b> la transforme en <mark>énergie thermique</mark>, puis les radiateurs la restituent <mark>sous la même forme</mark> : deux <mark>transformateurs</mark> à la suite. Le salon est le <mark>receveur</mark>.",
  poele: "Le <b>charbon</b> est le <mark>réservoir</mark> (<mark>énergie chimique</mark>). Le <b>poêle à charbon</b> est le <mark>transformateur</mark> : il la restitue en <mark>énergie thermique</mark>. Le salon est le <mark>receveur</mark>.",
  elle: "La raclette et la fondue sont des <b>aliments</b> : un <mark>réservoir</mark> d'<mark>énergie chimique</mark>. Églantine est le <mark>transformateur</mark> : son corps produit de l'<mark>énergie thermique</mark>. Ici, le <mark>receveur</mark>, c'est elle (elle se réchauffe), pas le salon !",
};

// Combinaison incohérente : on le dit gentiment, avec la raison tirée du texte.
function pasBon(r, t) {
  const R = RES[r], T = TRA[t];
  if (r === 'soleil') return "Le <b>soleil</b> est bien un <mark>réservoir naturel</mark> d'énergie, mais aucun de ces <mark>transformateurs</mark> ne fonctionne avec lui. Dans le texte, il réchauffe Églantine sur les pistes. Pour le salon, essaie un autre réservoir.";
  if (t === 'cuisiniere') return `La <b>cuisinière électrique</b> est bien un <mark>transformateur</mark>, mais elle reçoit de l'<mark>énergie électrique</mark> : ${R.le} ne la lui ${R.le.startsWith('les') ? 'donnent' : 'donne'} pas directement. Dans le texte, elle sert à préparer la raclette, pas à chauffer le salon.`;
  if (t === 'elle') return `Églantine ne transforme pas l'énergie ${R.du} : son corps transforme l'<mark>énergie chimique</mark> des <b>aliments</b> qu'elle mange. Change le <mark>réservoir</mark> ou le <mark>transformateur</mark>.`;
  if (r === 'mazout' && t === 'chaudiere') return "Le <b>mazout</b> est bien le <mark>réservoir</mark> de la <b>chaudière</b>, un <mark>transformateur</mark>. Mais dans le texte, la chaudière et ses radiateurs chauffent <b>les chambres</b>, pas le salon. Dans le salon, c'est le <b>feu ouvert</b> qui chauffe.";
  if (t === 'poele') return "Dans le texte, papa a remplacé le vieux <b>poêle à charbon</b> par des radiateurs : il n'y a plus de poêle. Pour le salon, regarde ce qui brûle dans le feu ouvert.";
  if (r === 'aliments') return "On ne chauffe pas le salon en brûlant de la raclette ! L'<mark>énergie chimique</mark> des aliments, c'est le corps d'Églantine qui la transforme.";
  return `${T.regle} Avec ${R.le}, la chaîne ne fonctionne pas : change le <mark>réservoir</mark> ou le <mark>transformateur</mark>.`;
}
function txtDegrade(t) {
  if (t === 'elle') return "Les particules rouges : de l'<mark>énergie thermique</mark> qui s'échappe de son corps vers l'air froid, perdue pour elle. Sa doudoune <mark>ralentit les échanges de chaleur</mark> entre son corps et l'extérieur.";
  return `Les particules rouges : de l'<mark>énergie thermique non désirée</mark> qui s'échappe ${TRA[t].perte} et par l'échauffement des objets. Perdue pour le montage, c'est une <mark>forme dégradée d'énergie</mark>.`;
}
// Avant que la chaîne soit construite (phrases du cours, p. 2 et « Je retiens »)
const DEBUT = "Construis une chaîne ayant pour <mark>receveur</mark> le salon d'Églantine. Il est nécessaire de partir d'un <mark>réservoir</mark> d'énergie accompagné d'un ou de plusieurs <mark>transformateurs</mark>.";
const avecRes = (R) => `Ton <mark>réservoir</mark> : ${R.le}. Il te faut maintenant un <mark>transformateur</mark> : il reçoit de l'énergie sous une certaine forme et la restitue sous la même forme ou sous une autre forme.`;
// Le parcours guidé : choisir → choisir → observer → montrer l'énergie perdue
const PAS = ['Réservoir', 'Transformateur', 'Le salon chauffe ?', 'Énergie dégradée'];
const FIN = "<b>✓ Chaîne complète !</b> La production d'énergie thermique a pour but de fournir cette énergie à un <mark>receveur</mark>. Il faut partir d'un <mark>réservoir</mark> d'énergie accompagné d'un ou de plusieurs <mark>transformateurs</mark>. L'énergie thermique non désirée, perdue pour le montage, est une <mark>forme dégradée d'énergie</mark>. À toi : essaie les autres réservoirs du texte.";

// ---------- Petits outils 3D ----------
const std = (color, o) => new THREE.MeshStandardMaterial(Object.assign({ color, roughness: 0.65 }, o));
const glow = (color, opacity = 0.9) => new THREE.MeshBasicMaterial({ color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false });
const Box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const Cyl = (a, b, h, s = 20, open = false) => new THREE.CylinderGeometry(a, b, h, s, 1, open);
function put(parent, geo, mat, x = 0, y = 0, z = 0) { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); parent.add(m); return m; }

// ---------- Les réservoirs ----------
function buildBois() {
  const g = new THREE.Group(), ecorce = std(0x7a4a26, { roughness: 0.9 }), coupe = std(0xd9a86a);
  [[-0.21, 0.2], [0.21, 0.2], [0, 0.54]].forEach(([x, y]) => { put(g, Cyl(0.2, 0.2, 1.0, 16), [ecorce, coupe, coupe], x, y, 0).rotation.x = Math.PI / 2; });
  g.rotation.y = 0.35;
  return g;
}
function buildMazout() {
  const g = new THREE.Group(), vert = std(0x4f7a5a, { roughness: 0.5, metalness: 0.2 }), fonce = std(0x3a5a44);
  put(g, Cyl(0.4, 0.4, 1.1, 28), vert, 0, 0.5, 0).rotation.z = Math.PI / 2;
  [-0.35, 0.35].forEach((x) => { put(g, new THREE.TorusGeometry(0.405, 0.025, 8, 32), fonce, x, 0.5, 0).rotation.y = Math.PI / 2; put(g, Box(0.1, 0.12, 0.5), fonce, x, 0.06, 0); });
  put(g, Cyl(0.06, 0.06, 0.12, 12), std(0x2f2f36), 0.2, 0.94, 0);
  const goutte = new THREE.Group(); g.add(goutte);
  const huile = std(0x3b2a14, { roughness: 0.15, metalness: 0.3 });
  put(goutte, new THREE.SphereGeometry(0.12, 16, 12), huile);
  put(goutte, new THREE.ConeGeometry(0.115, 0.2, 16), huile, 0, 0.13, 0);
  g.userData.tick = (dt, t) => { goutte.position.y = 1.25 + Math.sin(t * 2) * 0.05; };
  return g;
}
function buildCharbon() {
  const g = new THREE.Group(), met = std(0x707888, { metalness: 0.6, roughness: 0.4, side: THREE.DoubleSide });
  put(g, Cyl(0.42, 0.32, 0.55, 24, true), met, 0, 0.29, 0);
  put(g, new THREE.CircleGeometry(0.32, 24), met, 0, 0.02, 0).rotation.x = -Math.PI / 2;
  put(g, new THREE.TorusGeometry(0.42, 0.02, 6, 24, Math.PI), met, 0, 0.56, 0);
  const noir = std(0x1c1c22, { roughness: 0.45, metalness: 0.25 });
  for (let i = 0; i < 11; i++) {
    const a = i * 2.4, r = i === 0 ? 0 : 0.12 + (i % 3) * 0.08;
    put(g, new THREE.DodecahedronGeometry(0.1 + (i % 4) * 0.015), noir, Math.cos(a) * r, 0.55 + (i % 2) * 0.06 + (i === 0 ? 0.08 : 0), Math.sin(a) * r).rotation.set(i, i * 2, i * 3);
  }
  return g;
}
function buildSoleil() {
  const g = new THREE.Group();
  put(g, new THREE.SphereGeometry(0.42, 28, 20), new THREE.MeshBasicMaterial({ color: 0xffd23f }), 0, 1.0, 0);
  put(g, new THREE.SphereGeometry(0.6, 28, 20), glow(0xffa31a, 0.22), 0, 1.0, 0);
  const rayons = new THREE.Group(); rayons.position.y = 1.0; g.add(rayons);
  const rm = glow(0xffd23f, 0.85);
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; put(rayons, new THREE.ConeGeometry(0.06, 0.26, 10), rm, Math.cos(a) * 0.74, Math.sin(a) * 0.74, 0).rotation.z = a - Math.PI / 2; }
  g.userData.tick = (dt, t) => { rayons.rotation.z = t * 0.3; const s = 1 + 0.06 * Math.sin(t * 2.5); rayons.scale.set(s, s, 1); };
  return g;
}
function buildAliments() {
  const g = new THREE.Group();
  put(g, Cyl(0.3, 0.34, 0.14, 20), std(0x3a3644, { metalness: 0.5 }), 0, 0.07, 0); // réchaud
  put(g, Cyl(0.42, 0.3, 0.36, 26), std(0xb3402a, { roughness: 0.5 }), 0, 0.32, 0); // caquelon
  put(g, Cyl(0.39, 0.39, 0.03, 26), std(0xffcf5a, { roughness: 0.4, emissive: 0x6a4a00, emissiveIntensity: 0.3 }), 0, 0.49, 0); // fromage
  put(g, Box(0.36, 0.06, 0.08), std(0x5a2a1a), 0.55, 0.42, 0);
  const metal = std(C.metal, { metalness: 0.7, roughness: 0.3 });
  [[-0.5, -0.08, 0.05], [0.45, 0.1, -0.05]].forEach(([a, tx, z]) => { // fourchettes à fondue
    put(g, Cyl(0.012, 0.012, 0.75, 6), metal, tx - 0.375 * Math.sin(a), 0.5 + 0.375 * Math.cos(a), z).rotation.z = a;
  });
  const pdt = std(0xd8b56a);
  put(g, new THREE.SphereGeometry(0.1, 12, 10), pdt, -0.56, 0.09, 0.25).scale.set(1.2, 0.9, 1);
  put(g, new THREE.SphereGeometry(0.09, 12, 10), pdt, -0.4, 0.08, 0.42).scale.set(1.1, 0.9, 1);
  return g;
}

// ---------- Les transformateurs ----------
function buildFeu() {
  const g = new THREE.Group(), pierre = std(0x9b93ab, { roughness: 0.9 }), fond = std(0x2a2232, { roughness: 1 });
  put(g, Box(1.5, 0.12, 0.7), pierre, 0, 0.06, 0);
  put(g, Box(0.26, 0.95, 0.6), pierre, -0.6, 0.595, 0);
  put(g, Box(0.26, 0.95, 0.6), pierre, 0.6, 0.595, 0);
  put(g, Box(1.6, 0.24, 0.7), pierre, 0, 1.19, 0);
  put(g, Box(0.96, 0.95, 0.08), fond, 0, 0.595, -0.26);
  put(g, Box(0.62, 1.0, 0.5), pierre, 0, 1.8, -0.05); // cheminée
  const ecorce = std(0x6e4424);
  put(g, Cyl(0.07, 0.07, 0.62, 10), ecorce, 0, 0.19, 0.02).rotation.set(0, 0.3, Math.PI / 2);
  put(g, Cyl(0.07, 0.07, 0.62, 10), ecorce, 0, 0.19, -0.06).rotation.set(0, -0.3, Math.PI / 2);
  const flammes = [[-0.17, 0xff6a1f], [0, 0xffd04a], [0.17, 0xff6a1f], [0.07, 0xffb43a]].map(([x, c]) => put(g, new THREE.ConeGeometry(0.11, 0.42, 12), glow(c), x, 0.33, 0.04));
  g.userData.tick = (dt, t, on) => flammes.forEach((f, i) => {
    const k = Math.max(0.001, on * (0.85 + 0.2 * Math.sin(t * 9 + i * 1.7) + 0.08 * Math.sin(t * 23 + i)));
    f.scale.set(Math.max(0.001, on), k, Math.max(0.001, on)); f.position.y = 0.12 + 0.21 * k;
  });
  g.userData.emit = [{ p: [0, 2.32, -0.05], d: [0, 1, 0] }, { p: [-0.76, 0.7, 0.2], d: [-1, 0.4, 0.3] }, { p: [0.76, 0.7, 0.2], d: [1, 0.4, 0.3] }];
  g.userData.lightPos = [0, 0.5, 0.45];
  return g;
}
function buildChaudiere() {
  const g = new THREE.Group(), blanc = std(0xe9ecf2, { roughness: 0.4 });
  put(g, Box(0.62, 1.0, 0.5), blanc, -0.42, 0.5, 0);
  const fen = put(g, Box(0.22, 0.14, 0.02), glow(0xff7a2a, 0), -0.42, 0.35, 0.26); // brûleur
  put(g, Box(0.4, 0.08, 0.02), std(0x9aa3b5), -0.42, 0.82, 0.26);
  put(g, Cyl(0.07, 0.07, 0.8, 12), std(0x8a8f9c, { metalness: 0.5 }), -0.42, 1.4, -0.05); // conduit de fumée
  put(g, Cyl(0.03, 0.03, 0.32, 8), std(0xc77b4a, { metalness: 0.6, roughness: 0.3 }), 0.03, 0.2, 0.05).rotation.z = Math.PI / 2;
  const radMat = std(0xf4f4f6, { roughness: 0.45, emissive: C.chaud, emissiveIntensity: 0 });
  for (let i = 0; i < 6; i++) put(g, Box(0.075, 0.62, 0.2), radMat, 0.22 + i * 0.1, 0.5, 0);
  put(g, Box(0.6, 0.04, 0.12), radMat, 0.47, 0.2, 0);
  put(g, Box(0.6, 0.04, 0.12), radMat, 0.47, 0.8, 0);
  g.userData.tick = (dt, t, on) => { fen.material.opacity = on * (0.75 + 0.2 * Math.sin(t * 13)); radMat.emissiveIntensity = on * 0.32; };
  g.userData.emit = [{ p: [-0.42, 1.85, -0.05], d: [0, 1, 0] }, { p: [-0.76, 0.6, 0], d: [-1, 0.3, 0.2] }, { p: [0.03, 0.24, 0.1], d: [0, 0.6, 1] }];
  g.userData.pipe = [new THREE.Vector3(-0.11, 0.2, 0.1), new THREE.Vector3(0.18, 0.2, 0.1)];
  g.userData.lightPos = [-0.42, 0.4, 0.55];
  return g;
}
function buildPoele() {
  const g = new THREE.Group(), fonte = std(0x2b2b33, { metalness: 0.55, roughness: 0.45 });
  put(g, Cyl(0.34, 0.34, 0.75, 24), fonte, 0, 0.6, 0);
  put(g, Cyl(0.38, 0.38, 0.06, 24), fonte, 0, 1.0, 0);
  put(g, Cyl(0.36, 0.3, 0.08, 24), fonte, 0, 0.2, 0);
  for (let i = 0; i < 3; i++) { const a = i * 2.094 + 0.5; put(g, Cyl(0.035, 0.035, 0.2, 8), fonte, Math.cos(a) * 0.25, 0.08, Math.sin(a) * 0.25); }
  const fen = put(g, new THREE.CircleGeometry(0.13, 20), glow(0xff7a2a, 0), 0, 0.58, 0.345);
  put(g, Cyl(0.075, 0.075, 1.15, 12), fonte, 0, 1.6, 0); // tuyau
  g.userData.tick = (dt, t, on) => { fen.material.opacity = on * (0.8 + 0.2 * Math.sin(t * 11)); };
  g.userData.emit = [{ p: [0, 2.22, 0], d: [0, 1, 0] }, { p: [-0.38, 0.6, 0.1], d: [-1, 0.3, 0.3] }, { p: [0.38, 0.6, 0.1], d: [1, 0.3, 0.3] }];
  g.userData.lightPos = [0, 0.55, 0.6];
  return g;
}
function buildCuisiniere() {
  const g = new THREE.Group(), noir = std(0x1f1f26, { roughness: 0.3 });
  put(g, Box(0.95, 0.86, 0.62), std(0xeef0f4, { roughness: 0.35 }), 0, 0.43, 0);
  put(g, Box(0.93, 0.02, 0.6), std(0x30303a, { roughness: 0.2 }), 0, 0.87, 0);
  [[-0.22, -0.14, 0.13], [0.22, -0.14, 0.1], [-0.22, 0.14, 0.1], [0.22, 0.14, 0.13]].forEach(([x, z, r]) => put(g, Cyl(r, r, 0.02, 20), noir, x, 0.89, z));
  put(g, Box(0.66, 0.34, 0.02), noir, 0, 0.38, 0.315); // porte du four
  for (let i = 0; i < 4; i++) put(g, Cyl(0.035, 0.035, 0.04, 10), noir, -0.3 + i * 0.2, 0.72, 0.32).rotation.x = Math.PI / 2;
  return g;
}
function buildEglantine() {
  const g = new THREE.Group(), jean = std(0x2b3a6b), doudoune = std(0x8f6bff, { roughness: 0.5 }), peau = std(0xf1c7a1);
  put(g, Cyl(0.075, 0.07, 0.5, 10), jean, -0.1, 0.25, 0);
  put(g, Cyl(0.075, 0.07, 0.5, 10), jean, 0.1, 0.25, 0);
  put(g, new THREE.CapsuleGeometry(0.25, 0.4, 6, 14), doudoune, 0, 0.88, 0);
  put(g, new THREE.CapsuleGeometry(0.075, 0.38, 4, 10), doudoune, -0.3, 0.86, 0).rotation.z = -0.35;
  put(g, new THREE.CapsuleGeometry(0.075, 0.38, 4, 10), doudoune, 0.3, 0.86, 0).rotation.z = 0.35;
  put(g, new THREE.SphereGeometry(0.2, 20, 16), peau, 0, 1.42, 0);
  put(g, new THREE.SphereGeometry(0.212, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), std(0x19c3a6), 0, 1.45, 0); // bonnet
  put(g, new THREE.SphereGeometry(0.06, 10, 8), std(0xffffff), 0, 1.68, 0);
  put(g, new THREE.SphereGeometry(0.025, 8, 6), std(0x1d1b2f), -0.07, 1.43, 0.185);
  put(g, new THREE.SphereGeometry(0.025, 8, 6), std(0x1d1b2f), 0.07, 1.43, 0.185);
  g.userData.emit = [{ p: [0, 0.9, 0], r: 0.36 }];
  return g;
}

// ---------- Le receveur : le salon d'Églantine ----------
function buildSalon() {
  const g = new THREE.Group();
  put(g, Box(1.9, 0.08, 1.5), std(0x9a6b45, { roughness: 0.8 }), 0, 0.04, 0);
  const mur = std(0xcfc4e6, { roughness: 0.95, emissive: 0xff7a3c, emissiveIntensity: 0 });
  put(g, Box(1.9, 1.35, 0.07), mur, 0, 0.75, -0.72);
  put(g, Box(0.07, 1.35, 1.5), mur, 0.92, 0.75, 0);
  put(g, Box(0.6, 0.48, 0.02), std(0x22306a, { emissive: 0x1a2250, emissiveIntensity: 0.6 }), -0.3, 0.88, -0.68); // fenêtre (nuit)
  const cadre = std(0xffffff);
  [[0, 1.13, 0.66, 0.04], [0, 0.63, 0.66, 0.04], [-0.31, 0.88, 0.04, 0.52], [0.31, 0.88, 0.04, 0.52], [0, 0.88, 0.03, 0.5]].forEach(([x, y, w, h]) => put(g, Box(w, h, 0.03), cadre, -0.3 + x, y, -0.67));
  const tissu = std(0x2f8f7f, { roughness: 0.9 });
  put(g, Box(0.95, 0.22, 0.42), tissu, 0.3, 0.19, -0.44); // canapé
  put(g, Box(0.95, 0.38, 0.12), tissu, 0.3, 0.42, -0.62);
  put(g, Box(0.12, 0.3, 0.42), tissu, -0.15, 0.3, -0.44);
  put(g, Box(0.12, 0.3, 0.42), tissu, 0.75, 0.3, -0.44);
  put(g, Cyl(0.42, 0.42, 0.02, 32), std(0xc9a0ff, { roughness: 1 }), -0.15, 0.09, 0.28); // tapis de laine
  return { g, mur };
}

// ---------- Une flèche courbe entre deux objets ----------
function arrow(p0, p2, apex) {
  const c = new THREE.Vector3((p0.x + p2.x) / 2, 2 * apex - (p0.y + p2.y) / 2, (p0.z + p2.z) / 2);
  const curve = new THREE.QuadraticBezierCurve3(p0, c, p2);
  const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.26, depthWrite: false });
  const g = new THREE.Group();
  g.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 48, 0.022, 8), mat));
  const tan = curve.getTangent(1), head = new THREE.Mesh(new THREE.ConeGeometry(0.085, 0.24, 14), mat);
  head.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tan);
  head.position.copy(p2).addScaledVector(tan, -0.1);
  g.add(head);
  return { g, curve, mat, apex: curve.getPoint(0.5) };
}

export default function mount(root) {
  const { stageEl, panelEl, explainEl } = layout(root);
  const st = createStage(stageEl, { camera: { pos: [0, 3.9, 9], target: [0, 0.85, 0], fov: 40 }, maxDistance: 22 });
  const { scene, camera, controls } = st;
  scene.add(ground(26));
  const q = new URLSearchParams(location.search);
  const ex = explain(explainEl);
  const XR = -2.6, XT = 0, XS = 2.6;

  const resObjs = { bois: buildBois(), mazout: buildMazout(), charbon: buildCharbon(), soleil: buildSoleil(), aliments: buildAliments() };
  const traObjs = { feu: buildFeu(), chaudiere: buildChaudiere(), poele: buildPoele(), cuisiniere: buildCuisiniere(), elle: buildEglantine() };
  for (const g of Object.values(resObjs)) { g.position.x = XR; g.scale.setScalar(0.0001); scene.add(g); }
  for (const g of Object.values(traObjs)) { g.position.x = XT; g.scale.setScalar(0.0001); scene.add(g); }
  const salon = buildSalon(); salon.g.position.x = XS; scene.add(salon.g);
  // Deux lumières seulement, toujours présentes (pas de recompilation des matériaux quand on change d'objet).
  const feuLight = new THREE.PointLight(0xff8a3c, 0, 5, 1.6); scene.add(feuLight);
  const salonLight = new THREE.PointLight(0xff9a5a, 0, 4, 1.4); salonLight.position.set(XS - 0.1, 0.9, 0.25); scene.add(salonLight);

  const a1 = arrow(new THREE.Vector3(XR + 0.55, 1.05, 0), new THREE.Vector3(XT - 0.85, 1.05, 0), 2.05);
  const a2 = arrow(new THREE.Vector3(XT + 0.85, 1.05, 0), new THREE.Vector3(XS - 0.7, 0.75, 0.1), 2.05);
  scene.add(a1.g, a2.g);

  // ---------- Étiquettes (termes du cours) ----------
  const labels = [];
  const lab = (tx, pos, cls) => { const l = st.label(tx, pos, { cls }); labels.push(l); return l; };
  const V = (x, y, z = 0.3) => new THREE.Vector3(x, y, z);
  const lRoleR = lab('Réservoir', V(XR, -0.3), 'fluo'), lRoleT = lab('Transformateur', V(XT, -0.3), 'fluo'), lRoleS = lab('Receveur', V(XS, -0.3), 'fluo');
  const lNomR = lab('', V(XR, -0.86)), lNomT = lab('', V(XT, -0.86)), lNomS = lab("Salon d'Églantine", V(XS, -0.86));
  const lE1 = lab('énergie chimique', a1.apex), lE2 = lab('', a2.apex);
  const lX = lab('✕', V(XT - 1.0, 1.4, 0), 'chaud');
  const lHalo = lab('énergie thermique', V(XT + 1.15, 1.1, 0));
  const posDeg = V(XT, 3.0, 0), lDeg = lab('', posDeg, 'chaud');

  // ---------- Particules d'énergie (une seule InstancedMesh) ----------
  const N1 = 34, N2 = 34, NI = 8, ND = 70, D0 = N1 + N2 + NI;
  const P = molecules(D0 + ND, { radius: 0.055, segments: 10 });
  P.mesh.material.dispose();
  P.mesh.material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
  scene.add(P.mesh);
  const COL = { chimique: new THREE.Color(0xa58bff), thermique: new THREE.Color(0xff9a3c), lumineuse: new THREE.Color(0xfff1a8), soleil: new THREE.Color(0xffe27a), degrade: new THREE.Color(0xff2e2e) };
  const dp = [], dv = [], dage = new Float32Array(ND), dlife = new Float32Array(ND);
  for (let i = 0; i < ND; i++) { dp.push(new THREE.Vector3()); dv.push(new THREE.Vector3()); P.setColor(D0 + i, COL.degrade); }

  // ---------- État ----------
  // Au départ, rien n'est choisi : c'est l'élève qui construit la chaîne (?r=bois&t=feu&d=1 pour le banc d'essai).
  let res = RES[q.get('r')] ? q.get('r') : null;
  let tra = TRA[q.get('t')] ? q.get('t') : null;
  let degOn = q.get('d') === '1';
  let ok = false, onAmt = 0, warm = 0, amp1 = 0, amp2 = 0, degAmt = 0, spawnAcc = 0;
  const faits = new Set();

  // ---------- Réglages ----------
  const ui = panel(panelEl);
  ui.title("Construis la chaîne du salon d'Églantine");
  const gd = guide(panelEl, PAS, { onRecommencer: recommencer });
  ui.note('Schéma du cours : <b>(E) Réservoir → transformateur(s) → receveur</b>. Ici, le receveur est le salon.');
  const chR = ui.choice({ label: '1. Choisis un réservoir', options: Object.entries(RES).map(([v, o]) => ({ value: v, label: o.label })), value: res, onChange: (v) => { res = v; changed(); } });
  const chT = ui.choice({ label: '2. Choisis un transformateur', options: Object.entries(TRA).map(([v, o]) => ({ value: v, label: o.label })), value: tra, onChange: (v) => { tra = v; changed(); } });
  const [bDeg] = ui.buttons([
    { label: "Montrer l'énergie dégradée", onClick() { degOn = !degOn; refresh(); } },
    { label: 'La chaîne du cours', onClick() { res = 'bois'; tra = 'feu'; chR.set(res); chT.set(tra); changed(); } },
  ]);
  const roChaine = ui.readout('La chaîne'), roSalon = ui.readout('Le salon');

  function changed() { amp1 = 0; refresh(); }
  function recommencer() { res = tra = null; degOn = false; faits.clear(); chR.set(null); chT.set(null); changed(); }
  function refresh() {
    const R = res && RES[res], T = tra && TRA[tra];
    ok = !!(R && T) && T.attend === res;
    const elle = ok && tra === 'elle';
    lNomR.set(R ? R.nom : '? à choisir');
    lNomT.set(elle ? 'Églantine<br>(receveur : elle-même)' : T ? T.nom : '? à choisir');
    lRoleT.set(tra === 'chaudiere' ? 'Transformateurs' : 'Transformateur');
    lE1.set(res === 'soleil' ? 'énergie du soleil' : 'énergie chimique'); lE1.show(!!R);
    lE2.set((T && T.sortie) || ''); lE2.show(ok && tra !== 'elle');
    lHalo.show(elle); lX.show(!!(R && T) && !ok);
    lRoleS.el.style.opacity = lNomS.el.style.opacity = ok && !elle ? '1' : '0.45';
    lDeg.set(elle ? 'énergie thermique perdue' : "énergie thermique non désirée<br>= forme dégradée d'énergie");
    if (elle) posDeg.set(XT + 0.95, 2.05, 0); else posDeg.set(tra === 'chaudiere' ? XT - 0.42 : XT, 3.0, 0);
    lDeg.show(degOn && ok);
    bDeg.classList.toggle('on', degOn);
    bDeg.textContent = degOn ? "Cacher l'énergie dégradée" : "Montrer l'énergie dégradée";
    roChaine.set(!(R && T) ? 'à construire' : ok ? (elle ? '✓ receveur : Églantine' : '✓ elle fonctionne') : '<span style="color:#ff8a6a">✕ à revoir</span>');
    roSalon.set(ok && !elle ? 'se réchauffe' : 'reste froid');
    let html;
    if (!R) html = DEBUT;
    else if (!T) html = avecRes(R);
    else if (!ok) html = pasBon(res, tra) + (degOn ? " <i>L'énergie dégradée apparaîtra quand la chaîne fonctionnera.</i>" : '');
    else if (degOn) html = (elle ? 'Aliments (<mark>réservoir</mark>) → Églantine (<mark>transformateur</mark>). ' : `${R.label} (<mark>réservoir</mark>) → ${T.label} (<mark>transformateur</mark>) → salon (<mark>receveur</mark>). `) + txtDegrade(tra);
    else html = OK[tra];
    ex.set(html);
    majGuide();
  }
  // Le guide : ce qui vient de se passer, puis la prochaine action ; une seule action mise en avant à la fois.
  function majGuide() {
    if (res) faits.add(0);
    if (tra) faits.add(1);
    if (ok && tra !== 'elle') faits.add(2);
    if (faits.has(2) && degOn && ok) faits.add(3);
    const cur = [0, 1, 2, 3].find((i) => !faits.has(i)) ?? -1, R = res && RES[res];
    let html;
    if (cur === 0) html = '<b>1.</b> Choisis un <b>réservoir</b> d\'énergie repris dans le texte.';
    else if (cur === 1) html = `✓ Réservoir : ${R ? R.label.toLowerCase() : '?'}. <b>2.</b> Choisis maintenant un <b>transformateur</b>.`;
    else if (cur === 2) html = ok ? '✓ Chaîne juste, mais son receveur est Églantine, pas le salon. <b>3.</b> Cherche la chaîne qui chauffe le salon.'
      : "✕ Cette chaîne ne chauffe pas le salon (pourquoi : plus bas). <b>3.</b> Change le réservoir ou le transformateur jusqu'à ce que le salon se réchauffe.";
    else if (cur === 3) html = '✓ Le salon se réchauffe : ta chaîne fonctionne ! <b>4.</b> Touche « Montrer l\'énergie dégradée » et regarde ce qui s\'échappe.';
    else html = FIN;
    gd.set(cur, faits, html, cur < 0);
    gd.zone(chR.el, cur === 0 || cur === 2); gd.zone(chT.el, cur === 1 || cur === 2);
    gd.verrou(chT.el, !res && !faits.has(1), "Choisis d'abord un réservoir (étape 1).");
    gd.verrou(bDeg, !faits.has(2), "D'abord une chaîne qui chauffe le salon (étape 3).");
    gd.appel(bDeg, cur === 3); bDeg.classList.toggle('primary', cur === 3);
  }

  // Une particule rouge s'échappe du transformateur ou du trajet vers le salon.
  function spawn() {
    if (!tra) return;              // « Recommencer » : l'énergie dégradée s'éteint en douceur, sans transformateur
    let i = -1;
    for (let k = 0; k < ND; k++) if (dage[k] >= dlife[k]) { i = k; break; }
    if (i < 0) return;
    const em = traObjs[tra].userData.emit || [];
    if (tra !== 'elle' && Math.random() < 0.3) {
      a2.curve.getPoint(rand(0.15, 0.85), dp[i]);
      dv[i].set(rand(-0.25, 0.25), rand(0.25, 0.55), rand(0.15, 0.45));
    } else if (em.length) {
      const e = em[(Math.random() * em.length) | 0];
      if (e.r) { const a = rand(0, Math.PI * 2); dp[i].set(XT + Math.cos(a) * e.r, e.p[1] + rand(-0.35, 0.45), Math.sin(a) * e.r); dv[i].set(Math.cos(a) * 0.45, rand(0, 0.25), Math.sin(a) * 0.45); }
      else { dp[i].set(XT + e.p[0] + rand(-0.08, 0.08), e.p[1] + rand(-0.08, 0.08), e.p[2] + rand(-0.08, 0.08)); dv[i].set(e.d[0] * 0.5 + rand(-0.15, 0.15), e.d[1] * 0.5 + rand(0.05, 0.25), e.d[2] * 0.5 + rand(-0.1, 0.1)); }
    } else return;
    dage[i] = 0; dlife[i] = rand(1.3, 2.2);
  }

  // Cadrage : toute la chaîne tient dans l'écran, même sur téléphone.
  let lastAsp = 0, narrow = null;
  function fit() {
    const { w, h } = st.size(), asp = w / h;
    if (Math.abs(asp - lastAsp) < 0.005) return;
    lastAsp = asp;
    const vt = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const d = Math.max(2.6 / vt, 3.95 / (vt * asp)) + 0.3;
    const dir = camera.position.clone().sub(controls.target).normalize();
    camera.position.copy(controls.target).addScaledVector(dir, d);
    controls.minDistance = d * 0.45; controls.maxDistance = d * 1.6;
    const nar = w < 560;
    if (nar !== narrow) { narrow = nar; labels.forEach((l) => { l.el.style.fontSize = nar ? '11.5px' : ''; }); }
  }

  const tmp = new THREE.Vector3();
  function grow(g, sel, k, dt, t) {
    const s = g.scale.x + ((sel ? 1 : 0) - g.scale.x) * k;
    g.scale.setScalar(Math.max(0.0001, s));
    g.visible = s > 0.01;
    if (g.visible && g.userData.tick) g.userData.tick(dt, t, sel ? onAmt : 0);
  }

  let tt = 0;
  function frame(dt) {
    tt += dt; const t = tt;
    fit();
    const k = 1 - Math.exp(-8 * dt), slow = (r) => 1 - Math.exp(-r * dt);
    const elle = ok && tra === 'elle';
    onAmt += ((ok ? 1 : 0) - onAmt) * slow(3);
    warm += ((ok && !elle ? 1 : 0) - warm) * slow(0.9);
    amp1 += ((res ? 1 : 0) - amp1) * slow(2.5);
    amp2 += ((ok ? 1 : 0) - amp2) * slow(2.5);
    degAmt += ((degOn && ok ? 1 : 0) - degAmt) * k;
    for (const [key, g] of Object.entries(resObjs)) grow(g, key === res, k, dt, t);
    for (const [key, g] of Object.entries(traObjs)) grow(g, key === tra, k, dt, t);

    // le salon se réchauffe ; la lumière du feu (ou du brûleur) vacille
    salon.mur.emissiveIntensity = warm * 0.3;
    salonLight.intensity = warm * (tra === 'feu' ? 5 : 3.5);
    const lp = tra && traObjs[tra].userData.lightPos;
    if (lp) feuLight.position.set(XT + lp[0], lp[1], lp[2]);
    feuLight.intensity = lp ? onAmt * (2.5 + 0.6 * Math.sin(t * 11) + 0.3 * Math.sin(t * 27)) : 0;
    a2.mat.opacity = 0.05 + 0.21 * (elle ? 0 : amp2);

    // 1. réservoir → transformateur (bloqué si la chaîne ne colle pas)
    for (let i = 0; i < N1; i++) {
      const u = (t * 0.3 + i / N1) % 1;
      a1.curve.getPoint(u, tmp);
      let s = amp1 * Math.min(1, u / 0.06);
      s *= ok ? Math.min(1, (1 - u) / 0.06) : clamp((0.9 - u) / 0.15, 0, 1);
      P.setPos(i, tmp.x, tmp.y + Math.sin(t * 3 + i) * 0.03, tmp.z + Math.cos(t * 2.3 + i * 1.7) * 0.05, s);
      P.setColor(i, res === 'soleil' ? COL.soleil : COL.chimique);
    }
    // 2. transformateur → receveur (ou halo autour d'Églantine)
    for (let j = 0; j < N2; j++) {
      let s = amp2;
      if (tra === 'elle') {
        const a = t * 1.2 + (j / N2) * Math.PI * 2;
        tmp.set(XT + Math.cos(a) * 0.5, 0.45 + ((j * 0.37 + t * 0.2) % 1), Math.sin(a) * 0.5);
      } else {
        const u = (t * 0.3 + j / N2) % 1;
        a2.curve.getPoint(u, tmp);
        s *= Math.min(1, u / 0.06, (1 - u) / 0.06);
        tmp.y += Math.sin(t * 3 + j) * 0.03; tmp.z += Math.cos(t * 2.3 + j * 1.7) * 0.05;
      }
      P.setPos(N1 + j, tmp.x, tmp.y, tmp.z, s);
      P.setColor(N1 + j, tra === 'feu' && j % 2 ? COL.lumineuse : COL.thermique);
    }
    // 3. de la chaudière vers les radiateurs (énergie thermique, sous la même forme)
    const pipe = traObjs.chaudiere.userData.pipe;
    for (let j = 0; j < NI; j++) {
      tmp.lerpVectors(pipe[0], pipe[1], (t * 0.6 + j / NI) % 1);
      P.setPos(N1 + N2 + j, XT + tmp.x, tmp.y, tmp.z + 0.02, tra === 'chaudiere' ? onAmt * 0.7 : 0);
      P.setColor(N1 + N2 + j, COL.thermique);
    }
    // 4. énergie thermique non désirée : forme dégradée d'énergie
    if (degAmt > 0.3) { spawnAcc += dt * 32 * degAmt; while (spawnAcc >= 1) { spawn(); spawnAcc -= 1; } }
    for (let i = 0; i < ND; i++) {
      if (dage[i] < dlife[i]) {
        dage[i] += dt; dv[i].y += 0.1 * dt; dp[i].addScaledVector(dv[i], dt);
        P.setPos(D0 + i, dp[i].x, dp[i].y, dp[i].z, Math.sin(Math.PI * Math.min(1, dage[i] / dlife[i])) * 1.1);
      } else P.setPos(D0 + i, 0, -99, 0, 0.0001);
    }
    P.commit();
  }
  st.onFrame(frame);

  refresh();
  // Banc d'essai : ?avance=3 fait tourner 3 s de simulation tout de suite (captures sans écran).
  for (let i = 0, n = clamp(+q.get('avance') || 0, 0, 10) * 60; i < n; i++) frame(1 / 60);
  return { dispose() { gd.dispose(); st.dispose(); } };
}
