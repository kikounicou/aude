// etats-matiere.js — Les 3 états de l'eau et les changements d'état (cours, thème 5, partie D).
// 256 molécules d'eau dans une enceinte de verre, pilotées DANS la scène : la plaque chauffe ou refroidit (toucher ou glisser),
// le thermomètre se tire vers la température visée, chaque flèche du triangle se touche pour jouer son changement d'état.
// Deux modes : « Mission guidée » (6 étapes : fais → observe → réponds) et « Libre ». Paliers réels à 0 °C et 100 °C.
import { THREE, C, layout, createStage, panel, explain, glassMaterial, ground, molecules, tempColor, clamp, lerp, rand } from './kit.js';

const W = 1.5, H = 2.6, D = 0.6;              // intérieur de l'enceinte
const R = 0.05, S = 0.12;                      // rayon d'une molécule, écart entre voisines dans la glace
const NX = 8, NY = 8, NZ = 4, N = NX * NY * NZ;
const SOL = 0, LIQ = 1, GAZ = 2, BUL = 3;      // BUL : molécule dans une bulle (déjà à l'état gazeux)
const X0 = -W / 2 + R, X1 = W / 2 - R, Y1 = H - R, Z0 = -D / 2 + R, Z1 = D / 2 - R;
const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) * 2;
const fmt = (T) => (Math.round(T) < 0 ? '−' : '') + Math.abs(Math.round(T));
const melanger = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

// Chaleur reçue (0 à 100) → température et part de chaque état. Tv = 100 °C (ébullition) ou 20 °C (évaporation).
function etatDe(E, Tv) {
  if (E <= 10) return { T: lerp(-30, 0, E / 10), fS: 1, fG: 0 };
  if (E <= 28) return { T: 0, fS: 1 - (E - 10) / 18, fG: 0 };                  // palier de fusion
  if (E <= 52) return { T: lerp(0, Tv, (E - 28) / 24), fS: 0, fG: 0 };
  if (E <= 90) return { T: Tv, fS: 0, fG: (E - 52) / 38 };                     // palier de vaporisation
  return { T: lerp(Tv, Tv + 30, (E - 90) / 10), fS: 0, fG: 1 };
}
// Température visée sur le thermomètre → chaleur reçue. Sur un palier, on vise son milieu : deux états ensemble.
function chaleurPour(T, Tv) {
  if (T < -2) return Math.max(0, (T + 30) / 30 * 10);
  if (T <= 2) return 19;
  if (T < Tv - 2) return 28 + T / Tv * 24;
  if (T <= Tv + 2) return 71;
  return Math.min(100, 90 + (T - Tv) / 30 * 10);
}

const NOMS = {
  fusion: 'FUSION · solide → liquide', solidification: 'SOLIDIFICATION · liquide → solide',
  vaporisation: 'VAPORISATION · liquide → gaz', condL: 'CONDENSATION · gaz → liquide',
  sublimation: 'SUBLIMATION · solide → gaz', condS: 'CONDENSATION · gaz → solide',
};
const TXT = {
  debut: "L'eau est à l'état <mark>solide</mark> : ses molécules sont <mark>serrées</mark> et <mark>rangées</mark>, elles <mark>vibrent sur place</mark>. Une matière qui <mark>reçoit ou perd de la chaleur</mark> peut changer d'état : touche « 🔥 Chauffer » sous l'enceinte.",
  solide: "État <mark>solide</mark> : les molécules sont <mark>serrées</mark> et <mark>rangées</mark>, en bloc. Elles ne se déplacent pas : elles <mark>vibrent sur place</mark>, d'autant plus fort que la température monte.",
  fusion: "<mark>Fusion</mark> : passage de l'état solide à l'état liquide. La glace fond par les bords. La température reste à 0&nbsp;°C : c'est un <mark>palier</mark>, la chaleur reçue sert au changement d'état.",
  solidification: "<mark>Solidification</mark> : passage de l'état liquide à l'état solide. Les molécules perdent de l'énergie et se rangent (palier à 0&nbsp;°C). C'est l'inverse de la fusion : les changements d'état sont des <mark>phénomènes réversibles</mark>.",
  liquide: "État <mark>liquide</mark> : les molécules sont <mark>proches mais désordonnées</mark>, au fond de l'enceinte. Elles <mark>roulent les unes sur les autres</mark> : elles se déplacent, un liquide est un <mark>fluide</mark>.",
  liquideChauffe: "État <mark>liquide</mark> : molécules proches mais désordonnées, qui roulent les unes sur les autres. Tu chauffes : la température <mark>s'élève</mark> et les molécules <mark>s'agitent</mark> de plus en plus.",
  ebullition: "<mark>Vaporisation</mark> par <mark>ébullition</mark> : des bulles se forment <mark>au sein même du liquide</mark>. L'eau bout : la température reste à 100&nbsp;°C, c'est un <mark>palier</mark>.",
  evaporation: "<mark>Vaporisation</mark> par <mark>évaporation</mark> : l'eau ne bout pas (20&nbsp;°C, comme sur la table de la classe). Les molécules s'échappent une à une par la <mark>surface libre du liquide</mark>.",
  condL: "<mark>Condensation</mark> : passage de l'état gazeux à l'état liquide. Les molécules perdent de l'énergie, ralentissent et se rapprochent. C'est l'inverse de la vaporisation : un <mark>phénomène réversible</mark>.",
  gaz: "État <mark>gazeux</mark> : les molécules sont <mark>très espacées</mark>, rapides, et <mark>occupent tout l'espace</mark>. Comme dans un liquide, elles se déplacent : un gaz est aussi un <mark>fluide</mark>.",
  palierFusion: "Glace et eau liquide ensemble, à 0&nbsp;°C : tu es au milieu du <mark>palier</mark> de fusion. Chauffe pour faire fondre la glace, refroidis pour la faire grandir.",
  palierEbu: "Eau liquide et vapeur ensemble, à 100&nbsp;°C : tu es au milieu du <mark>palier</mark> d'ébullition. Chauffe encore : la température ne bougera pas tant qu'il reste du liquide.",
  palierEvap: "Eau liquide et vapeur ensemble, à 20&nbsp;°C : une partie de l'eau s'est <mark>évaporée</mark> par la surface libre, sans bouillir.",
  melange: "Plusieurs états en même temps. Une matière qui <mark>reçoit ou perd de la chaleur</mark> peut changer d'état : chauffe ou refroidis, et regarde quelle flèche s'allume.",
  condS: "<mark>Condensation</mark> : passage de l'état gazeux à l'état solide. Il fait très froid : la vapeur se dépose directement en glace, comme le givre.",
  subliAttente: "Expérience du cours : on chauffe la tige d'une <mark>cuillère à combustion</mark> et on la dépose rapidement sur un glaçon. Touche la tige (ou tire-la vers le bas) pour la poser.",
  subliDebut: "Expérience du cours : on chauffe la tige d'une <mark>cuillère à combustion</mark> et on la dépose rapidement sur un glaçon. Regarde ce que deviennent les molécules qu'elle touche.",
  sublimation: "<mark>Sublimation</mark> : passage direct de l'état solide à l'état gazeux. Là où la tige chaude touche le glaçon, la glace se transforme en vapeur sans passer par l'état liquide.",
  subliFin: "La glace touchée par la tige est passée directement de l'état solide à l'état gazeux : c'est la <mark>sublimation</mark>. Touche la plaque pour reprendre la main.",
  givreAttente: "Expérience du cours : l'air de la classe contient de l'eau à l'état <mark>gazeux</mark>. Touche le bloc réfrigérant pour le sortir du congélateur.",
  givreDebut: "Expérience du cours : on sort un <mark>bloc réfrigérant</mark> du congélateur. L'air de la classe contient de l'eau à l'état gazeux…",
  givre: "<mark>Condensation</mark> : l'eau contenue dans l'air passe de l'état gazeux à l'état solide sur le bloc très froid : du <mark>givre</mark> apparaît.",
  givreFin: "Le bloc est couvert de <mark>givre</mark> : de l'eau gazeuse devenue solide, c'est une <mark>condensation</mark>. Touche la plaque pour reprendre la main.",
};
// Définitions du cours (« JE RETIENS »), affichées quand on touche une flèche du triangle.
const DEF = {
  fusion: "La <mark>fusion</mark> est le passage de l'état solide à l'état liquide.",
  solidification: "La <mark>solidification</mark> est le passage de l'état liquide à l'état solide.",
  vaporisation: "La <mark>vaporisation</mark> est le passage de l'état liquide à l'état gazeux. Elle se fait par <mark>évaporation</mark> (à la surface libre du liquide) ou par <mark>ébullition</mark> (au sein même du liquide).",
  condL: "La <mark>condensation</mark> est le passage de l'état gazeux à l'état liquide.",
  sublimation: "La <mark>sublimation</mark> est le passage direct de l'état solide à l'état gazeux.",
  condS: "La <mark>condensation</mark> est aussi le passage de l'état gazeux à l'état solide (le givre).",
};
const DEF0 = "👆 Touche une flèche : l'expérience la joue devant toi.";
// Mission guidée : les 6 flèches dans l'ordre du cours. Fais → Observe → Réponds (les leurres sont d'autres noms du cours).
const ETAPES = [
  { fl: 'fusion', faire: "Chauffe le glaçon jusqu'à ce qu'il ait fondu.", obs: 'le thermomètre pendant la fonte.',
    q: "La glace est devenue de l'eau liquide. Ce passage s'appelle…", bon: 'fusion',
    leurres: { solidification: "Non : la solidification, c'est l'inverse (liquide → solide). Ici, le solide devient liquide.",
      sublimation: "Non : la sublimation va du solide directement au gaz. Ici, la glace devient de l'eau liquide." },
    ok: "Oui ! La <mark>fusion</mark> est le passage de l'état solide à l'état liquide. Le thermomètre est resté à 0&nbsp;°C pendant la fonte : un <mark>palier</mark>." },
  { fl: 'solidification', faire: "Refroidis l'eau jusqu'à ce qu'elle redevienne de la glace.", obs: 'les molécules se rangent et se serrent.',
    q: "L'eau liquide est redevenue de la glace. Ce passage s'appelle…", bon: 'solidification',
    leurres: { condensation: "Non : la condensation part toujours de l'état gazeux. Ici, on part du liquide.",
      fusion: "Non : la fusion, c'est l'inverse (solide → liquide)." },
    ok: "Oui ! La <mark>solidification</mark> est le passage de l'état liquide à l'état solide. C'est l'inverse de la fusion : un <mark>phénomène réversible</mark>." },
  { fl: 'vaporisation', faire: "Chauffe l'eau jusqu'à ce qu'elle bouille.", obs: 'où naissent les bulles ?',
    q: 'Les bulles naissent au fond, dans le liquide. Cette vaporisation se fait par…', bon: 'ébullition',
    leurres: { 'évaporation': "Piège ! L'évaporation se fait à la surface libre du liquide, sans bulles. Ici, les bulles naissent au sein même du liquide.",
      condensation: "Non : la condensation, c'est gaz → liquide (ou solide). Ici, le liquide devient gaz." },
    ok: "Oui ! <mark>Vaporisation</mark> par <mark>ébullition</mark> : elle se fait au sein même du liquide. Sans bulles, à la surface libre, ce serait une <mark>évaporation</mark>." },
  { fl: 'condL', faire: "Refroidis jusqu'à ce que toute la vapeur soit redevenue liquide.", obs: 'les molécules ralentissent et se rapprochent.',
    q: "La vapeur est redevenue de l'eau liquide. Ce passage s'appelle…", bon: 'condensation',
    leurres: { solidification: "Non : la solidification part du liquide pour donner du solide. Ici, on part du gaz.",
      vaporisation: "Non : la vaporisation, c'est l'inverse (liquide → gaz)." },
    ok: "Oui ! La <mark>condensation</mark> est le passage de l'état gazeux à l'état liquide. C'est l'inverse de la vaporisation." },
  { fl: 'sublimation', scen: true, faire: 'Touche la tige chaude pour la poser sur le glaçon.', obs: 'y a-t-il une goutte de liquide ?',
    q: "La glace est passée à l'état gazeux sans devenir liquide. Ce passage s'appelle…", bon: 'sublimation',
    leurres: { fusion: "Non : la fusion donnerait du liquide. Ici, la glace devient directement de la vapeur.",
      vaporisation: "Non : la vaporisation part d'un liquide. Ici, on part du solide." },
    ok: "Oui ! La <mark>sublimation</mark> est le passage direct de l'état solide à l'état gazeux." },
  { fl: 'condS', scen: true, faire: 'Touche le bloc réfrigérant pour le sortir du congélateur.', obs: 'ce qui se dépose sur le bloc.',
    q: "L'eau gazeuse de l'air est devenue du givre (solide). Ce passage gaz → solide s'appelle…", bon: 'condensation',
    leurres: { solidification: "Piège ! La solidification part du liquide. Ici, on part du gaz : dans ton cours, gaz → solide s'appelle aussi condensation.",
      sublimation: "Non : la sublimation, c'est l'inverse (solide → gaz). Gaz → solide, c'est la condensation." },
    ok: "Oui ! Dans ton cours, la <mark>condensation</mark> sert deux fois : gaz → liquide ET gaz → solide." },
];
const TOUTES = new Set(ETAPES.map((e) => e.fl)), AUCUNE = new Set();
const SENS = { fusion: 1, solidification: -1, vaporisation: 1, condL: -1 };   // bouton à mettre en avant : 1 Chauffer, −1 Refroidir
const CLE = 'sciences2e.etats-matiere';
const lire = () => { try { return JSON.parse(localStorage.getItem(CLE)) || {}; } catch { return {}; } };
const ecrire = (o) => { try { localStorage.setItem(CLE, JSON.stringify(Object.assign(lire(), o))); } catch { /* navigation privée */ } };

// Styles propres à cette expérience (couleurs du site : app.css). Injectés une fois, retirés au dernier dispose().
const CSS = `
.em-bandeau{position:absolute;left:10px;right:10px;top:10px;z-index:3;pointer-events:none;background:rgba(20,18,38,.9);border:1.5px solid rgba(255,228,92,.55);border-radius:14px;padding:7px 12px 8px;color:#fff;font:500 14.5px/1.3 var(--texte);box-shadow:0 6px 18px rgba(0,0,0,.35)}
.em-bandeau .em-l1,.em-bandeau .em-l2{display:block}.em-bandeau .em-l2{color:#cfc8ff;font-size:13.5px;margin-top:2px}
.em-bandeau b{color:var(--fluo);font-weight:700}
.em-num{display:inline-block;background:var(--fluo);color:var(--encre);border-radius:6px;padding:0 6px;margin-right:5px;font-weight:800}
.em-prog{display:flex;gap:4px;margin-top:6px}.em-prog i{flex:1;height:5px;border-radius:99px;background:rgba(255,255,255,.16)}
.em-prog i.ok{background:var(--fluo)}.em-prog i.cur{background:rgba(255,228,92,.42)}
.em-carte{position:absolute;left:10px;right:10px;top:10px;z-index:4;max-height:calc(100% - 20px);overflow:auto;background:#fffdf8;color:var(--encre);border-radius:16px;padding:11px 12px 12px;box-shadow:0 12px 30px rgba(0,0,0,.45);font:500 14.5px/1.38 var(--texte)}
.em-carte p{margin:0 0 8px}.em-carte .em-tete{font:700 12px/1 var(--texte);letter-spacing:.06em;text-transform:uppercase;color:var(--encre2);margin-bottom:6px}
.em-carte .em-q{font:700 16.5px/1.25 var(--titre)}
.em-reps{display:flex;flex-wrap:wrap;gap:8px}
.em-reps button{flex:1 1 92px;min-height:46px;padding:6px 8px;border-radius:12px;border:2px solid var(--encre);background:#fff;color:var(--encre);font:700 15px/1.1 var(--texte);cursor:pointer}
.em-reps button.ko{background:var(--ko-bg);border-color:var(--ko);color:var(--ko);text-decoration:line-through}
.em-reps button.ok{background:var(--ok-bg);border-color:var(--ok);color:var(--ok)}.em-reps button:disabled{cursor:default}
.em-carte .em-fb{margin:8px 0 0}.em-fb:empty{display:none}.em-fb.ko{color:var(--ko)}.em-fb.ok{color:var(--ok)}
.em-suite{display:block;margin:10px 0 0 auto;min-height:46px;padding:8px 18px;border-radius:99px;border:0;background:var(--encre);color:#fff;font:700 15px/1 var(--texte);cursor:pointer}
.em-carte.sombre{background:var(--nuit);color:#fff;border:1.5px solid var(--fluo)}.em-carte.sombre mark{color:var(--encre)}
.em-carte.sombre .em-reps button{border-color:#fff}.em-tri-bilan .em-tri{max-width:290px}
.sim-labels .sim-label.em-plaque{background:none;border:0;padding:0;display:flex;gap:10px;margin-top:34px;pointer-events:none}
.em-z{pointer-events:auto;touch-action:none;-webkit-user-select:none;user-select:none;min-height:44px;padding:0 15px;border-radius:99px;border:2px solid;color:#fff;font:700 15px/1 var(--texte);cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,.35)}
.em-z.froid{border-color:var(--froid);background:rgba(28,44,96,.9)}.em-z.chaud{border-color:var(--chaud);background:rgba(96,32,26,.9)}
.em-z.froid.on{background:var(--froid)}.em-z.chaud.on{background:var(--chaud)}
.em-z.appel{animation:em-appel 1.3s ease-in-out infinite}@keyframes em-appel{50%{box-shadow:0 0 0 8px rgba(255,90,54,.4)}}
.em-z.froid.appel{animation-name:em-appel-f}@keyframes em-appel-f{50%{box-shadow:0 0 0 8px rgba(61,139,255,.5)}}
.sim-labels .sim-label.cliquable.em-attend{animation:em-appel-l 1.3s ease-in-out infinite}@keyframes em-appel-l{50%{box-shadow:0 0 0 7px rgba(255,228,92,.55)}}
.sim-labels .sim-label.em-indice{background:var(--fluo);color:var(--encre);border-color:var(--fluo);margin-top:-20px;font-weight:700;animation:em-doux 1.6s ease-in-out infinite}
@keyframes em-doux{50%{opacity:.55}}
.em-vise{font-weight:600;opacity:.75}
.em-tri{width:100%;max-width:360px;margin:0 auto;display:block;font-family:inherit;-webkit-tap-highlight-color:transparent}
.em-tri g[role=button]{cursor:pointer;outline:none}.em-tri g[role=button]:hover .em-hit{fill:rgba(255,255,255,.07)}
.em-tri g.em-sel .em-hit{fill:rgba(255,255,255,.07)}.em-tri g[role=button]:focus-visible .em-hit{stroke:#fff;stroke-width:1.5;stroke-dasharray:4 3}
.em-tri g.em-cur{animation:em-doux 1.2s ease-in-out infinite}
.em-def{min-height:40px;color:#e9e5ff}.em-def mark,.em-savoir mark{color:var(--encre)}
.em-savoir{border-left:4px solid var(--fluo);background:rgba(255,228,92,.09);border-radius:0 10px 10px 0;padding:7px 10px;color:#fff;line-height:1.4}.em-savoir b{color:var(--fluo)}
.em-sous{font:700 12px/1 var(--texte);letter-spacing:.07em;text-transform:uppercase;color:#b9b1e6}
.em-ctl{display:flex;align-items:center;gap:10px}.em-ctl .sim-slider{flex:1;min-width:0}.em-ctl .sim-btn{padding:0 12px;font-size:19px;line-height:1}
.em-p2 .sim-seg button:disabled{opacity:.45}
@media (max-width:860px){.em-sim .sim-stage{height:min(66vh,470px)}}
`;
function injecterStyle() {
  let s = document.getElementById('em-style');
  if (!s) { s = document.createElement('style'); s.id = 'em-style'; s.textContent = CSS; document.head.appendChild(s); }
  s.dataset.n = (+s.dataset.n || 0) + 1;
  return () => { s.dataset.n = +s.dataset.n - 1; if (+s.dataset.n <= 0) s.remove(); };
}

// Triangle du cours SOLIDE – LIQUIDE – GAZ et ses 6 flèches (SVG). Chaque flèche a une large zone de touche (42 unités ≈ 42 px sur téléphone)
// de son côté de l'arête. set(flèche en cours, états présents, flèche choisie, flèches faites, étape en cours).
function triangle(parent, onPick) {
  const c = [160, 147], GRIS = '#8f88bf';
  const fl = (id, A, B, off, lo, txt, aria) => {
    const L = Math.hypot(B[0] - A[0], B[1] - A[1]), ux = (B[0] - A[0]) / L, uy = (B[1] - A[1]) / L;
    let nx = -uy, ny = ux; const mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2;
    if (nx * (mx - c[0]) + ny * (my - c[1]) < 0) { nx = -nx; ny = -ny; }   // normale vers l'extérieur
    const ax = A[0] + ux * 4 + nx * off, ay = A[1] + uy * 4 + ny * off, bx = B[0] - ux * 4 + nx * off, by = B[1] - uy * 4 + ny * off;
    const hx = bx - ux * 10, hy = by - uy * 10, tx = mx + nx * lo, ty = my + ny * lo;
    let a = Math.atan2(uy, ux) * 180 / Math.PI; if (a > 90) a -= 180; if (a < -90) a += 180;
    const s = Math.sign(off), p = (t, o) => `${(A[0] + ux * t + nx * o).toFixed(1)},${(A[1] + uy * t + ny * o).toFixed(1)}`;
    const zone = `<polygon class="em-hit" points="${p(16, s)} ${p(L - 16, s)} ${p(L - 16, s * 42)} ${p(16, s * 42)}" fill="transparent" pointer-events="all"/>`;
    return `<g data-a="${id}" color="${GRIS}"${onPick ? ` tabindex="0" role="button" aria-label="${aria}"` : ''}>${zone}` +
      `<line x1="${ax}" y1="${ay}" x2="${hx}" y2="${hy}" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>` +
      `<polygon points="${bx},${by} ${hx - uy * 5},${hy + ux * 5} ${hx + uy * 5},${hy - ux * 5}" fill="currentColor"/>` +
      `<text x="${tx}" y="${ty}" transform="rotate(${a.toFixed(1)} ${tx} ${ty})" text-anchor="middle" dominant-baseline="middle" font-size="12.5" fill="currentColor">${txt}</text></g>`;
  };
  const nd = (k, x, y, t) => `<g data-n="${k}" pointer-events="none"><rect x="${x - 44}" y="${y - 16}" width="88" height="32" rx="10" fill="rgba(255,255,255,.06)" stroke="rgba(255,255,255,.45)" stroke-width="1.5"/>` +
    `<text x="${x}" y="${y + 1}" text-anchor="middle" dominant-baseline="middle" font-size="14" font-weight="700" fill="#fff" letter-spacing="1">${t}</text></g>`;
  const box = document.createElement('div');
  box.innerHTML = `<svg class="em-tri" viewBox="0 0 320 252" role="group" aria-label="Triangle des changements d'état${onPick ? ' : touche une flèche' : ''}">` +
    // même disposition que le schéma du cours : LIQUIDE en haut, SOLIDE en bas à gauche, GAZ en bas à droite
    fl('fusion', [70, 190], [136, 46], 8, 21, 'fusion', 'fusion : solide vers liquide') + fl('solidification', [136, 46], [70, 190], -8, -20, 'solidification', 'solidification : liquide vers solide') +
    fl('vaporisation', [184, 46], [250, 190], 8, 21, 'vaporisation', 'vaporisation : liquide vers gaz') + fl('condL', [250, 190], [184, 46], -8, -20, 'condensation', 'condensation : gaz vers liquide') +
    fl('sublimation', [98, 206], [222, 206], -8, -20, 'sublimation', 'sublimation : solide vers gaz') + fl('condS', [222, 206], [98, 206], 8, 21, 'condensation', 'condensation : gaz vers solide') +
    nd('L', 160, 30, 'LIQUIDE') + nd('S', 52, 206, 'SOLIDE') + nd('G', 268, 206, 'GAZ') + '</svg>';
  parent.appendChild(box);
  const fleches = [...box.querySelectorAll('[data-a]')], noeuds = [...box.querySelectorAll('[data-n]')];
  if (onPick) for (const g of fleches) {
    g.addEventListener('click', () => onPick(g.dataset.a));
    g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPick(g.dataset.a); } });
  }
  const fond = { S: 'rgba(207,238,255,.3)', L: 'rgba(77,184,255,.35)', G: 'rgba(232,244,255,.22)' };
  let cle = '';
  return {
    el: box,
    set(act, pres, sel, faits, cur) {
      const k = [act, sel, cur, +pres.S, +pres.L, +pres.G, ...faits].join('|'); if (k === cle) return; cle = k;
      for (const g of fleches) {
        const id = g.dataset.a, on = id === act, fait = faits.has(id), vise = id === sel || id === cur;
        g.setAttribute('color', on || fait ? '#ffe45c' : vise ? '#ffffff' : GRIS);
        g.querySelector('line').setAttribute('stroke-width', on ? 4.5 : vise ? 3.6 : fait ? 3 : 2.5);
        g.querySelector('text').setAttribute('font-weight', on || vise ? 800 : fait ? 700 : 500);
        g.classList.toggle('em-sel', vise); g.classList.toggle('em-cur', id === cur && !fait && !on);
      }
      for (const n of noeuds) n.querySelector('rect').setAttribute('fill', pres[n.dataset.n] ? fond[n.dataset.n] : 'rgba(255,255,255,.06)');
    },
  };
}

export default function mount(root) {
  const retirerStyle = injecterStyle();
  const { stageEl, panelEl, explainEl } = layout(root);
  root.classList.add('em-sim');       // sur téléphone, la scène est un peu plus haute : elle porte le bandeau et les boutons
  const st = createStage(stageEl, { camera: { pos: [0.25, 1.75, 4.9], target: [0.2, 1.2, 0], fov: 42 }, maxDistance: 12 });
  const scene = st.scene, ex = explain(explainEl), q = new URLSearchParams(location.search), canvas = st.renderer.domElement;
  const invisible = new THREE.MeshBasicMaterial({ visible: false });     // zones de touche (raycasting), jamais dessinées

  // ---------- décor : sol, plaque (moitié bleue = refroidir, moitié rouge = chauffer), enceinte de verre ----------
  const sol = ground(4.4); sol.position.y = -0.1; scene.add(sol);
  const plaqueMat = new THREE.MeshStandardMaterial({ color: 0x2b2840, roughness: 0.55, metalness: 0.3 });
  const plaque = new THREE.Mesh(new THREE.BoxGeometry(W + 0.36, 0.1, D + 0.36), plaqueMat);
  plaque.position.y = -0.05; scene.add(plaque);
  const demiG = new THREE.BoxGeometry((W + 0.36) / 2 - 0.06, 0.014, D + 0.28);
  const froidMat = new THREE.MeshStandardMaterial({ color: 0x23305a, emissive: C.froid, emissiveIntensity: 0.12, roughness: 0.5 });
  const chaudMat = new THREE.MeshStandardMaterial({ color: 0x4a2630, emissive: C.chaud, emissiveIntensity: 0.12, roughness: 0.5 });
  const demiF = new THREE.Mesh(demiG, froidMat), demiC = new THREE.Mesh(demiG, chaudMat);
  demiF.position.set(-(W + 0.36) / 4, 0.007, 0); demiC.position.set((W + 0.36) / 4, 0.007, 0); scene.add(demiF, demiC);
  const hitPlaque = new THREE.Mesh(new THREE.BoxGeometry(W + 0.5, 0.34, D + 0.6), invisible); hitPlaque.position.y = -0.04; scene.add(hitPlaque);
  const boiteG = new THREE.BoxGeometry(W, H, D);
  const boite = new THREE.Mesh(boiteG, glassMaterial({ opacity: 0.1 })); boite.position.y = H / 2; scene.add(boite);
  const aretes = new THREE.LineSegments(new THREE.EdgesGeometry(boiteG), new THREE.LineBasicMaterial({ color: C.verre, transparent: true, opacity: 0.5 }));
  aretes.position.y = H / 2; scene.add(aretes);

  // ---------- thermomètre (repères 0 °C et 100 °C), avec une poignée qu'on tire ----------
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
    st.label(T + '&nbsp;°C', new THREE.Vector3(TX, yT(T), 0), { offset: [0.4, 0, 0], cls: 'discret' });
  }
  const lblT = st.label('', new THREE.Vector3(TX, 2.44, 0), { cls: 'fluo' });
  const poignee = new THREE.Mesh(new THREE.SphereGeometry(0.055, 14, 10), new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.45 }));
  poignee.position.x = TX; scene.add(poignee);
  const anneau = new THREE.Mesh(new THREE.TorusGeometry(0.085, 0.016, 8, 28), new THREE.MeshBasicMaterial({ color: C.fluo }));
  anneau.rotation.x = Math.PI / 2; anneau.position.x = TX; anneau.visible = false; scene.add(anneau);
  const hitThermo = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 2.45, 8), invisible); hitThermo.position.set(TX, 1.2, 0); scene.add(hitThermo);

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
  const viderBulles = () => { for (const b of bulles) { b.on = false; b.mols.length = 0; b.m.visible = false; } };

  // Matériel des deux expériences du cours (tige chaude, bloc réfrigérant), avec leurs zones de touche
  const tige = new THREE.Group();
  const tigeMat = new THREE.MeshStandardMaterial({ color: 0xb8bcc8, metalness: 0.6, roughness: 0.35, transparent: true, opacity: 0 });
  const boutMat = new THREE.MeshStandardMaterial({ color: C.chaud, emissive: C.chaud, emissiveIntensity: 1.2, transparent: true, opacity: 0 });
  const t1 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.5, 12), boutMat); t1.position.y = 0.25;
  const t2 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.1, 12), tigeMat); t2.position.y = 1.05;
  const hitTige = new THREE.Mesh(new THREE.BoxGeometry(0.42, 1.7, 0.42), invisible); hitTige.position.y = 0.8;
  tige.add(t1, t2, hitTige); tige.position.set(0.05, 2.45, 0); tige.visible = false; scene.add(tige);
  const blocMat = new THREE.MeshStandardMaterial({ color: C.froid, emissive: C.froid, emissiveIntensity: 0.3, roughness: 0.4, transparent: true, opacity: 0 });
  const bloc = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.16, 0.5), blocMat); bloc.position.y = 0.08; bloc.visible = false; scene.add(bloc);
  const hitBloc = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.5, 0.8), invisible); hitBloc.position.y = 0.2; scene.add(hitBloc);

  // ---------- étiquettes ----------
  const lblPhen = st.label('', new THREE.Vector3(0, H + 0.24, 0), { cls: 'fluo' });
  const pS = new THREE.Vector3(), pL = new THREE.Vector3(), pG = new THREE.Vector3(X0 + 0.34, H - 0.22, D / 2);
  const lblS = st.label('état solide', pS), lblL = st.label('état liquide', pL), lblG = st.label('état gazeux', pG);
  const lblTige = st.label('', tige, { offset: [-0.45, 0.5, 0], cls: 'chaud', onClick: () => poserTige() });
  const pBloc = new THREE.Vector3(0, -0.16, 0.3);      // sous le bloc tant qu'il attend, puis à gauche (les boutons de la plaque sont en bas)
  const lblBloc = st.label('', pBloc, { cls: 'froid', onClick: () => sortirBloc() });
  const lblGivre = st.label('givre', new THREE.Vector3(0.78, 0.42, D / 2), { cls: 'fluo' });
  // Les deux grandes zones posées sur la plaque, et l'indice du premier affichage
  const pPlaque = new THREE.Vector3(0, -0.05, D / 2 + 0.18), pIndice = pPlaque.clone();
  const lblZones = st.label('<button type="button" class="em-z froid" aria-pressed="false">❄ Refroidir</button><button type="button" class="em-z chaud appel" aria-pressed="false">🔥 Chauffer</button>', pPlaque, { cls: 'em-plaque' });
  const zoneF = lblZones.el.querySelector('.froid'), zoneC = lblZones.el.querySelector('.chaud');
  const lblIndice = st.label('👆 Touche la plaque pour chauffer', pIndice, { cls: 'em-indice' });

  // Bandeau de consigne et carte de question (mission), posés DANS la scène
  const bandeau = document.createElement('div'); bandeau.className = 'em-bandeau'; bandeau.hidden = true; bandeau.setAttribute('aria-live', 'polite');
  const carteEl = document.createElement('div'); carteEl.className = 'em-carte'; carteEl.hidden = true;
  stageEl.append(bandeau, carteEl);

  // ---------- état du modèle ----------
  let E = 4, cible = 4, Tv = 100, mode = 'ebullition', auto = 0, autoStop = null, budget = 0, tps = 0, touche = false, rate = 0;
  let T = -18, Taff = -18, Tsol = -18, Tliq = -18, Tgaz = -18, tS = N, tL = 0, tG = 0, nS = N, nL = 0, nG = 0, haut = R;
  let scen = null, fade = null, fadeS = 1, choisi = '', viseT = null, indice = 1, tIndice = 0, geste = null, zonesOn = true;
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

  // ---------- les deux expériences du cours (manuel : l'élève pose la tige / sort le bloc elle-même) ----------
  function fondu(fn) { fade = { t: 0, fn, fait: false }; }
  function lancer(type, manuel = false) {
    setAuto(0); touche = true; viseT = null;
    scen = { type, t: 0, pret: false, fin: false, n: 0, acc: 0, go: !manuel, tGo: 0, vise: null };
    viderBulles();
    fondu(() => {
      if (type === 'subli') { latY = 0; toutSolide(); sl.set(4); E = cible = 4; tige.position.y = manuel ? 1.75 : 2.45; }   // à la main : bien visible sous le bandeau
      else {
        latY = 0.16; occ.fill(-1);
        for (let i = 0; i < N; i++) { site[i] = -1; ph[i] = GAZ; P[i * 3] = rand(X0, X1); P[i * 3 + 1] = rand(0.3, Y1); P[i * 3 + 2] = rand(Z0, Z1); const v = new THREE.Vector3(gauss(), gauss(), gauss()).setLength(1.1); setV(i, v.x, v.y, v.z); }
      }
      compter(); scen.pret = true;
    });
  }
  function quitter() { if (!scen) return; scen = null; E = cible; }
  function poserTige() { if (scen && scen.type === 'subli' && !scen.fin) { scen.go = true; premierGeste('autre'); } }
  function sortirBloc() { if (scen && scen.type === 'givre' && !scen.go) { scen.go = true; premierGeste('autre'); } }
  function scenario(dt) {
    const s = scen; if (!s.pret) return; s.t += dt;
    if (s.type === 'subli') {
      Tsol = -18; Tliq = 0; Tgaz = 60; T = -18;
      const tip = tige.position;
      if (!s.fin) {
        const k = siteAFondre(tip), dk = k < 0 ? 9 : Math.hypot(SX[k] - tip.x, SY[k] - tip.y, SZ[k] - tip.z), contact = dk <= 0.13;
        if (contact) { s.acc += dt * 14; while (s.acc >= 1) { s.acc -= 1; if (sublimer(tip)) s.n++; } compter(); }
        if (s.vise !== null) { const v = clamp(s.vise, 0.3, 2.6); if (v > tip.y || !contact) tip.y += clamp(v - tip.y, -2.4 * dt, 2.4 * dt); }   // tirée au doigt : la glace l'arrête
        else if (s.go && !contact) tip.y = Math.max(0.3, tip.y - 0.55 * dt);
        if (s.n >= 36 || tip.y <= 0.3) s.fin = true;
      } else if (tip.y < 3.2) tip.y += 0.6 * dt;
    } else {
      Tsol = -18; Tliq = 0; Tgaz = 20; T = 20;
      if (s.go) s.tGo += dt;
      if (!s.fin && s.tGo > 0.8) { s.acc += dt * 16; while (s.acc >= 1) { s.acc -= 1; if (condenserS(0.9)) s.n++; } compter(); if (s.n >= 96) s.fin = true; }
    }
  }

  // Place l'eau d'un coup dans un état de départ (glace, liquide ou vapeur), en fondu, puis lance la suite.
  function placer(kind, E0, suite) {
    quitter(); setAuto(0); cible = E; viseT = null; viderBulles();
    fondu(() => {
      latY = 0; occ.fill(-1); site.fill(-1);
      if (kind === 'glace') toutSolide();
      else for (let i = 0; i < N; i++) {
        const o = i * 3;
        if (kind === 'liquide') { ph[i] = LIQ; P[o] = X0 + 0.02 + (i % 12) * 0.124 + rand(-0.01, 0.01); P[o + 1] = R + Math.floor(i / 48) * 0.105 + rand(0.01); P[o + 2] = Z0 + 0.02 + (Math.floor(i / 12) % 4) * 0.153; setV(i, 0, 0, 0); }
        else { ph[i] = GAZ; P[o] = rand(X0, X1); P[o + 1] = rand(0.2, Y1); P[o + 2] = rand(Z0, Z1); const v = new THREE.Vector3(gauss(), gauss(), gauss()).setLength(1.3); setV(i, v.x, v.y, v.z); }
      }
      E = cible = E0; sl.set(E0);
      const e = etatDe(E0, Tv); T = Tsol = Tliq = Tgaz = Taff = e.T;
      for (const k in derniere) delete derniere[k];
      compter(); if (suite) suite();
    });
  }
  // Mode libre : toucher une flèche joue ce changement d'état (bon état de départ, puis chauffe ou refroidit tout seul).
  function jouer(id) {
    choisi = id; defEl.innerHTML = DEF[id];
    if (id === 'sublimation') return lancer('subli');
    if (id === 'condS') return lancer('givre');
    const [kind, E0, sens, fin] = { fusion: ['glace', 7, 1, 34], solidification: ['liquide', 31, -1, 7], condL: ['gaz', 95, -1, 44],
      vaporisation: ['liquide', mode === 'ebullition' ? 47 : 40, 1, 94] }[id];
    placer(kind, E0, () => setAuto(sens, fin));
  }

  // ---------- panneau 1 : mode, « à savoir absolument », triangle cliquable ----------
  const ui = panel(panelEl);
  const memo = lire(), essai = q.has('e') || q.has('scen') || q.has('auto');
  // la mission est proposée à la première visite ; ensuite on reprend le dernier mode choisi (libre si la mission est réussie)
  let modeUI = q.get('m') === 'libre' || q.get('m') === 'mission' ? q.get('m') : essai ? 'libre' : memo.mode || (memo.fini ? 'libre' : 'mission');
  const modeSel = ui.choice({ options: [{ value: 'mission', label: '🎯 Mission guidée' }, { value: 'libre', label: 'Libre' }], value: modeUI, onChange: (v) => changerMode(v) });
  ui.note('<b>★ À savoir absolument</b> : <b>fusion</b> · <b>solidification</b> · <b>vaporisation</b> (par évaporation ou ébullition) · <b>condensation</b> · <b>sublimation</b>. Piège : la condensation sert deux fois (gaz → liquide et gaz → solide).').classList.add('em-savoir');
  const tri = triangle(panelEl, (id) => choisirFleche(id));
  const defEl = ui.note(DEF0); defEl.classList.add('em-def'); defEl.setAttribute('aria-live', 'polite');

  // ---------- panneau 2 (après l'explication) : les mêmes commandes, compactes, au clavier ----------
  const panel2 = document.createElement('div'); panel2.className = 'sim-panel em-p2'; panelEl.parentElement.appendChild(panel2);
  const ui2 = panel(panel2);
  ui2.note('Réglages (aussi au clavier)').className = 'em-sous';
  const ctl = document.createElement('div'); ctl.className = 'em-ctl'; panel2.appendChild(ctl);
  const [bR, bC] = ui2.buttons([{ label: '❄', onClick: () => basculer(-1) }, { label: '🔥', onClick: () => basculer(1) }]);
  const mots = (v) => (v < 1 ? 'aucune' : v < 25 ? 'un peu' : v < 55 ? 'moyenne' : v < 85 ? 'beaucoup' : 'énormément');
  const sl = ui2.slider({ label: "Chaleur reçue par l'eau", min: 0, max: 100, step: 'any', value: 4, format: mots,
    onInput: (v) => { if (!zonesOn) return; cible = v; quitter(); setAuto(0); touche = true; choisi = ''; viseT = null; premierGeste('autre'); } });
  const rangee = bR.parentElement; ctl.append(bR, sl.el, bC); rangee.remove();
  bR.setAttribute('aria-label', 'Refroidir'); bC.setAttribute('aria-label', 'Chauffer'); bR.title = 'Refroidir'; bC.title = 'Chauffer';
  const roT = ui2.readout('Thermomètre');
  const choix = ui2.choice({ label: 'La vaporisation se fait par…', options: [{ value: 'ebullition', label: 'ébullition' }, { value: 'evaporation', label: 'évaporation' }], value: 'ebullition',
    onChange: (v) => { mode = v; Tv = v === 'ebullition' ? 100 : 20; quitter(); touche = true; } });
  ui2.note(`<b>À retenir</b> : les changements d'état sont des <b style="color:#ffe45c">phénomènes réversibles</b>. Liquides et gaz (molécules qui se déplacent) sont des <b style="color:#ffe45c">fluides</b>.`);

  function setAuto(a, stop = null) {
    auto = a; autoStop = a ? stop : null; if (a) touche = true;
    zoneC.classList.toggle('on', a === 1); zoneF.classList.toggle('on', a === -1);
    zoneC.textContent = a === 1 ? '⏸ Arrêter' : '🔥 Chauffer'; zoneF.textContent = a === -1 ? '⏸ Arrêter' : '❄ Refroidir';
    zoneC.setAttribute('aria-pressed', a === 1); zoneF.setAttribute('aria-pressed', a === -1);
    bC.classList.toggle('on', a === 1); bR.classList.toggle('on', a === -1);
    bC.setAttribute('aria-pressed', a === 1); bR.setAttribute('aria-pressed', a === -1);
  }
  function basculer(dir) { if (!zonesOn) return; quitter(); choisi = ''; viseT = null; setAuto(auto === dir ? 0 : dir); premierGeste('plaque'); }
  function forcerEbu() { if (mode !== 'ebullition') { mode = 'ebullition'; Tv = 100; choix.set('ebullition'); } }
  function premierGeste(kind) {          // l'indice disparaît au premier geste ; ensuite, un mot sur le thermomètre
    if (indice === 1) {
      zoneC.classList.remove('appel');
      if (kind === 'plaque') { indice = 2; tIndice = tps; lblIndice.set('Tu peux aussi tirer le thermomètre ↕'); } else indice = 0;
    } else if (indice === 2 && kind === 'thermo') indice = 0;
  }

  // ---------- mission guidée ----------
  const mis = { i: 0, phase: 'faire', faits: new Set(), t: 0 };
  const DEPART = {     // état de départ de chaque étape (on garde l'état présent s'il convient : l'expérience continue)
    fusion: () => { if (!(nS === N && !scen)) placer('glace', 4); },
    solidification: () => { if (!(nL === N && !scen)) placer('liquide', 33); },
    vaporisation: () => { if (!(nL === N && !scen && E > 36)) placer('liquide', 47); },
    condL: () => { if (!(nG >= 40 && nS === 0 && !scen)) placer('gaz', 95); },
    sublimation: () => lancer('subli', true),
    condS: () => lancer('givre', true),
  };
  const FAIT = {       // détection automatique : l'action demandée est faite
    fusion: () => !scen && nL === N,
    solidification: () => !scen && nS === N,
    vaporisation: () => !scen && mode === 'ebullition' && nG >= 110,
    condL: () => !scen && nL === N,
    sublimation: () => !!scen && scen.type === 'subli' && scen.fin,
    condS: () => !!scen && scen.type === 'givre' && scen.fin,
  };
  const premiere = () => Math.max(0, ETAPES.findIndex((e) => !mis.faits.has(e.fl)));
  function allerEtape(i) {
    mis.i = i; mis.phase = 'faire'; mis.t = 0; carteEl.hidden = true; choisi = ''; viseT = null;
    forcerEbu(); DEPART[ETAPES[i].fl]();
    majZones(); majBandeau();
  }
  function majZones() {
    zonesOn = modeUI === 'libre' || (mis.phase === 'faire' && !ETAPES[mis.i].scen);
    bR.disabled = bC.disabled = sl.input.disabled = !zonesOn;
    choix.el.querySelectorAll('button').forEach((b) => { b.disabled = modeUI === 'mission'; });
  }
  function majBandeau() {
    const vu = mis.phase === 'vu', on = modeUI === 'mission' && (mis.phase === 'faire' || vu);
    bandeau.hidden = !on; if (!on) return;
    const e = ETAPES[mis.i];
    bandeau.innerHTML = `<span class="em-l1"><span class="em-num">${mis.i + 1}/6</span>${vu ? '✓ Bien joué ! Regarde le résultat…' : '<b>Fais :</b> ' + e.faire}</span>` +
      (vu ? '' : `<span class="em-l2"><b>Observe :</b> ${e.obs}</span>`) +
      `<span class="em-prog">${ETAPES.map((x, k) => `<i class="${mis.faits.has(x.fl) ? 'ok' : k === mis.i ? 'cur' : ''}"></i>`).join('')}</span>`;
  }
  function poserQuestion() {
    const e = ETAPES[mis.i]; mis.phase = 'question'; majZones(); majBandeau();
    carteEl.className = 'em-carte';
    carteEl.innerHTML = `<p class="em-tete">Étape ${mis.i + 1}/6 · Réponds</p><p class="em-q">${e.q}</p>` +
      `<div class="em-reps">${melanger([e.bon, ...Object.keys(e.leurres)]).map((o) => `<button type="button" data-r="${o}">${o}</button>`).join('')}</div><p class="em-fb" aria-live="polite"></p>`;
    carteEl.hidden = false;
    carteEl.querySelectorAll('[data-r]').forEach((b) => b.addEventListener('click', () => repondre(b)));
  }
  function repondre(b) {
    const e = ETAPES[mis.i], r = b.dataset.r, fb = carteEl.querySelector('.em-fb');
    if (r !== e.bon) { b.classList.add('ko'); b.disabled = true; fb.className = 'em-fb ko'; fb.innerHTML = e.leurres[r] + ' Réessaie.'; return; }
    b.classList.add('ok'); carteEl.querySelectorAll('[data-r]').forEach((x) => { x.disabled = true; });
    fb.className = 'em-fb ok'; fb.innerHTML = e.ok; mis.faits.add(e.fl);
    const fin = mis.faits.size === ETAPES.length, suite = document.createElement('button');
    suite.type = 'button'; suite.className = 'em-suite'; suite.textContent = fin ? 'Voir le bilan →' : 'Étape suivante →';
    suite.addEventListener('click', () => (fin ? bilan() : allerEtape(premiere())));
    carteEl.appendChild(suite); suite.focus({ preventScroll: true });
  }
  function bilan() {
    mis.phase = 'fin'; ecrire({ fini: true }); majZones(); majBandeau();
    carteEl.className = 'em-carte sombre';
    carteEl.innerHTML = '<p class="em-q">Mission réussie : 6/6 ✓</p><div class="em-tri-bilan"></div>' +
      "<p>Une matière qui reçoit ou perd de la chaleur peut changer d'état. Les changements d'état sont donc des <mark>phénomènes réversibles</mark>.</p>" +
      '<p>★ La <mark>condensation</mark> sert deux fois : gaz → liquide et gaz → solide.</p>' +
      '<div class="em-reps"><button type="button" data-x="refaire">Refaire la mission</button><button type="button" data-x="libre">Passer en mode libre</button></div>';
    carteEl.hidden = false;
    triangle(carteEl.querySelector('.em-tri-bilan'), null).set('', { S: true, L: true, G: true }, '', TOUTES, '');
    carteEl.querySelector('[data-x=refaire]').addEventListener('click', () => { mis.faits.clear(); allerEtape(0); });
    carteEl.querySelector('[data-x=libre]').addEventListener('click', () => changerMode('libre'));
  }
  function changerMode(v) {
    modeUI = v; modeSel.set(v); ecrire({ mode: v });
    if (v === 'mission') { if (mis.faits.size === ETAPES.length) mis.faits.clear(); allerEtape(premiere()); }
    else { carteEl.hidden = true; mis.phase = 'faire'; majZones(); majBandeau(); }
    defEl.innerHTML = v === 'mission' ? 'En mission, touche une flèche pour aller à son étape.' : choisi ? DEF[choisi] : DEF0;
  }
  function choisirFleche(id) {
    premierGeste('autre');
    if (modeUI === 'mission') allerEtape(ETAPES.findIndex((e) => e.fl === id)); else jouer(id);
  }

  // ---------- gestes dans la scène : plaque, thermomètre, tige, bloc (au doigt comme à la souris) ----------
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), plan = new THREE.Plane(), pI = new THREE.Vector3(), nP = new THREE.Vector3();
  function rayon(e) { const r = canvas.getBoundingClientRect(); ndc.set((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1); ray.setFromCamera(ndc, st.camera); }
  function hauteurSous(e, x, z) {      // hauteur du doigt sur le plan vertical (face à la caméra) qui passe par (x, z)
    rayon(e); nP.set(st.camera.position.x - x, 0, st.camera.position.z - z).normalize();
    plan.setFromNormalAndCoplanarPoint(nP, pI.set(x, 0, z)); return ray.ray.intersectPlane(plan, pI) ? pI.y : null;
  }
  function cibleSous(e) {
    rayon(e); const objs = [];
    if (zonesOn) objs.push(hitPlaque, hitThermo);
    if (scen && scen.type === 'subli' && scen.pret && !scen.fin) objs.push(hitTige);
    if (scen && scen.type === 'givre' && scen.pret && !scen.go) objs.push(hitBloc);
    const h = ray.intersectObjects(objs, false)[0]; return h || null;
  }
  function thermoVers(e) {
    const y = hauteurSous(e, TX, 0); if (y === null) return;
    let Tc = clamp((y - 0.36) / 1.8 * 160 - 30, -30, 130);
    if (Math.abs(Tc) < 3) Tc = 0; else if (Math.abs(Tc - Tv) < 3) Tc = Tv;      // les repères attirent le doigt
    viseT = Tc; cible = chaleurPour(Tc, Tv); sl.set(cible); touche = true;
  }
  function onDown(e) {      // en capture sur la scène : passe AVANT l'orbite de la caméra
    if (e.target !== canvas || geste || !e.isPrimary) return;
    const h = cibleSous(e); if (!h) return;
    const o = h.object;
    if (o === hitPlaque) geste = { type: 'plaque', x0: e.clientX, c0: cible, cote: h.point.x < 0 ? -1 : 1, bouge: false };
    else if (o === hitThermo) { geste = { type: 'thermo' }; quitter(); choisi = ''; setAuto(0); thermoVers(e); premierGeste('thermo'); }
    else if (o === hitTige) { const y = hauteurSous(e, 0.05, 0); geste = { type: 'tige', y0: e.clientY, bouge: false, dy: tige.position.y - (y === null ? tige.position.y : y) }; }
    else { sortirBloc(); geste = { type: 'tap' }; }
    geste.id = e.pointerId; if (st.controls) st.controls.enabled = false;
    try { canvas.setPointerCapture(e.pointerId); } catch { /* rien */ }
    e.preventDefault();
  }
  function onMove(e) {
    if (!geste) { if (e.pointerType === 'mouse' && e.target === canvas) { const h = cibleSous(e); canvas.style.cursor = !h ? '' : h.object === hitThermo ? 'ns-resize' : 'pointer'; } return; }
    if (e.pointerId !== geste.id) return;
    if (geste.type === 'plaque' || geste.type === 'zone') {       // glisser : à droite on chauffe, à gauche on refroidit
      const dx = e.clientX - geste.x0;
      if (!geste.bouge && Math.abs(dx) > 10) { geste.bouge = true; quitter(); choisi = ''; viseT = null; setAuto(0); touche = true; premierGeste('plaque'); }
      if (geste.bouge) { cible = clamp(geste.c0 + dx * 120 / Math.max(260, st.size().w), 0, 100); sl.set(cible); }
    } else if (geste.type === 'thermo') thermoVers(e);
    else if (geste.type === 'tige' && scen) {
      if (Math.abs(e.clientY - geste.y0) > 6) geste.bouge = true;
      const y = hauteurSous(e, 0.05, 0); if (geste.bouge && y !== null) { scen.vise = y + geste.dy; premierGeste('autre'); }
    }
  }
  function onUp(e) {
    if (!geste || e.pointerId !== geste.id) return;
    const g = geste; geste = null; if (st.controls) st.controls.enabled = true;
    if ((g.type === 'plaque' || g.type === 'zone') && !g.bouge) basculer(g.cote);
    if (g.type === 'tige' && scen && scen.type === 'subli') { scen.vise = null; poserTige(); }
  }
  for (const [el, cote] of [[zoneF, -1], [zoneC, 1]]) {
    el.addEventListener('pointerdown', (e) => {
      if (geste || !e.isPrimary) return;
      geste = { type: 'zone', id: e.pointerId, x0: e.clientX, c0: cible, cote, bouge: false };
      try { el.setPointerCapture(e.pointerId); } catch { /* rien */ }
      e.preventDefault();
    });
    el.addEventListener('click', (e) => { if (e.detail === 0) basculer(cote); });   // clavier (Entrée, Espace)
  }
  stageEl.addEventListener('pointerdown', onDown, true);
  window.addEventListener('pointermove', onMove); window.addEventListener('pointerup', onUp); window.addEventListener('pointercancel', onUp);

  // Paramètres d'essai (banc d'essai) : ?e=60 (chaleur), &mode=evaporation, &scen=subli|givre, &auto=1, &m=libre|mission, &etape=1..6
  if (q.get('mode') === 'evaporation') { choix.set('evaporation'); mode = 'evaporation'; Tv = 20; }
  if (q.get('e')) {
    sl.set(clamp(+q.get('e'), 0, 100)); E = cible = sl.value; touche = true;
    const e = etatDe(E, Tv); tS = Math.round(e.fS * N); tG = Math.round(e.fG * N); tL = N - tS - tG;
    const m = mode; mode = 'evaporation'; for (let k = 0; k < 2000 && convertir(); k++); mode = m;
  }
  if (q.get('scen')) lancer(q.get('scen') === 'givre' ? 'givre' : 'subli');
  if (q.get('auto')) setAuto(+q.get('auto') > 0 ? 1 : -1);
  if (modeUI === 'mission') { defEl.innerHTML = 'En mission, touche une flèche pour aller à son étape.'; allerEtape(clamp((+q.get('etape') || 1) - 1, 0, ETAPES.length - 1)); }
  else majZones();

  // Cadrage selon la forme de la scène (tant que l'élève n'a pas tourné la vue) : place pour le bandeau en haut
  // et pour les boutons de la plaque en bas.
  let bouge = false, w0 = 0, h0 = 0;
  if (st.controls) st.controls.addEventListener('start', () => { bouge = true; });
  function cadrer() {
    const { w, h } = st.size(); if (bouge || !st.controls || (w === w0 && h === h0)) return; w0 = w; h0 = h;
    const tel = w < 520, hautPx = tel ? 108 : 86, basPx = tel ? 72 : 82, util = (h - hautPx - basPx) / h;
    const visH = Math.max(3.0 / util, 3.25 * h / w), dist = visH / (2 * Math.tan(st.camera.fov * Math.PI / 360)), u = visH / h;
    const tgt = new THREE.Vector3(0.42, 1.4 + (hautPx - basPx) / 2 * u, 0), dir = new THREE.Vector3(0.05, 0.1, 1).normalize();
    st.camera.position.copy(tgt).addScaledVector(dir, dist); st.controls.target.copy(tgt); st.controls.update();
  }

  // ---------- boucle ----------
  const m4 = new THREE.Matrix4(), qt = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0), dir = new THREE.Vector3(), pos = new THREE.Vector3(), sc = new THREE.Vector3();
  const cS = new THREE.Color(), cL = new THREE.Color(), cG = new THREE.Color(), cTmp = new THREE.Color();
  let txtT = '', txtE = '', txtPh = '', txtTige = '', txtBloc = '';
  function image(dt) {
    tps += dt; const t = tps; cadrer();
    if (fade) {
      fade.t += dt; if (!fade.fait && fade.t >= 0.25) { fade.fn(); fade.fait = true; }
      fadeS = fade.t < 0.25 ? 1 - fade.t / 0.25 : Math.min(1, (fade.t - 0.25) / 0.35); if (fade.t >= 0.6) { fade = null; fadeS = 1; }
    }
    if (auto) {
      cible = clamp(cible + auto * 5 * dt, 0, 100);
      if (autoStop !== null && (auto > 0 ? cible >= autoStop : cible <= autoStop)) { cible = autoStop; setAuto(0); }
      else if (cible <= 0 || cible >= 100) setAuto(0);
      sl.set(cible);
    }
    if (!scen) {
      // l'énergie n'avance que si les molécules suivent : la température reste sur le palier tant que le changement d'état n'est pas fini
      const E0 = E; if (Math.abs(nS - tS) + Math.abs(nG - tG) < 10) E += clamp(cible - E, -8 * dt, 8 * dt);
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

    // matériel des expériences : apparaît / disparaît en douceur (bloc « fantôme » tant qu'on ne l'a pas sorti)
    const tigeOn = scen && scen.type === 'subli' && scen.pret && tige.position.y < 3.1;
    const blocBut = scen && scen.type === 'givre' && scen.pret ? (scen.go ? 1 : 0.35) : 0;
    tigeMat.opacity = boutMat.opacity = clamp(tigeMat.opacity + (tigeOn ? 3 : -3) * dt, 0, 1); tige.visible = tigeMat.opacity > 0.01;
    blocMat.opacity = clamp(blocMat.opacity + clamp(blocBut - blocMat.opacity, -2 * dt, 3 * dt), 0, 1); bloc.visible = blocMat.opacity > 0.01;
    blocMat.emissiveIntensity = scen && scen.type === 'givre' && !scen.go ? 0.3 + 0.25 * Math.sin(t * 5) : 0.3;
    // plaque : la moitié rouge s'allume quand on chauffe, la bleue quand on refroidit
    const chauffe = rate > 0.3, froid = rate < -0.3;
    plaqueMat.emissive.set(chauffe ? C.chaud : froid ? C.froid : 0x000000); plaqueMat.emissiveIntensity = clamp(Math.abs(rate) / 8, 0.3, 1);
    chaudMat.emissiveIntensity = lerp(chaudMat.emissiveIntensity, chauffe ? 1.1 : 0.12, 0.15); froidMat.emissiveIntensity = lerp(froidMat.emissiveIntensity, froid ? 1.1 : 0.12, 0.15);

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

    // thermomètre : colonne, poignée, et la température visée (anneau jaune) tant qu'elle n'est pas atteinte
    const Th = scen ? T : Taff; colonne.scale.y = yT(Th) - 0.25; tempColor((Th + 30) / 160, alcool.color); alcool.emissive.copy(alcool.color);
    poignee.position.y = yT(Th); poignee.scale.setScalar(indice === 2 && zonesOn ? 1 + 0.3 * Math.abs(Math.sin(t * 4)) : 1); poignee.visible = !scen;
    if (viseT !== null && (scen || (!geste && Math.abs(cible - E) < 0.3))) viseT = null;
    anneau.visible = viseT !== null; if (anneau.visible) anneau.position.y = yT(viseT);
    const tt = fmt(Th) + '&nbsp;°C' + (viseT !== null ? ` <span class="em-vise">→ ${fmt(viseT)}&nbsp;°C</span>` : ''); if (tt !== txtT) { txtT = tt; lblT.set(tt); }

    // changement d'état en cours (dernière conversion il y a moins de 0,7 s)
    let act = '', best = -1; for (const k in derniere) if (derniere[k] > best) { best = derniere[k]; act = k; }
    if (tps - best > 0.7) act = '';
    const pres = { S: nS > 0, L: nL > 0, G: nG > 0 }, mission = modeUI === 'mission';
    tri.set(act, pres, mission ? '' : choisi, mission ? mis.faits : AUCUNE, mission && mis.phase !== 'fin' ? ETAPES[mis.i].fl : '');
    const ph2 = act ? NOMS[act] + (act === 'vaporisation' ? (mode === 'ebullition' ? ' (ébullition)' : ' (évaporation)') : '') : '';
    if (ph2 !== txtPh) { txtPh = ph2; lblPhen.set(ph2); } lblPhen.show(!!act);
    // étiquettes des états
    let sx = 0, sy = 0; for (let i = 0; i < N; i++) if (ph[i] === SOL) { sx += P[i * 3]; sy = Math.max(sy, P[i * 3 + 1]); }
    // pendant la fonte, l'eau liquide coule au pied du bloc : son étiquette reste en bas, sous celle du solide
    pS.set(scen && scen.type === 'subli' ? -0.36 : nS ? sx / nS : 0, sy + 0.17, D / 2); pL.set(X1 - 0.3, (nS > 8 ? Math.min(haut, 0.3) : haut) + 0.13, D / 2);
    lblS.show(nS > 8); lblL.show(nL > 8); lblG.show(nG > 8);
    const attend = scen && !scen.go && scen.vise === null;
    const tx1 = attend ? 'tige chaude · <b>touche-la</b>' : 'tige chaude<br>(cuillère à combustion)'; if (tx1 !== txtTige) { txtTige = tx1; lblTige.set(tx1); }
    const tx2 = attend ? '❄ bloc réfrigérant · <b>touche-le</b>' : 'bloc réfrigérant'; if (tx2 !== txtBloc) { txtBloc = tx2; lblBloc.set(tx2); }
    if (attend) pBloc.set(0, -0.16, 0.3); else pBloc.set(-0.5, 0.36, 0.3);
    lblTige.show(tige.visible && tigeMat.opacity > 0.5 && !!scen && !scen.fin); lblBloc.show(bloc.visible && blocMat.opacity > 0.2);
    lblTige.el.classList.toggle('em-attend', !!attend && scen.type === 'subli'); lblBloc.el.classList.toggle('em-attend', !!attend && scen.type === 'givre');
    lblGivre.show(!!(scen && scen.type === 'givre' && scen.n > 12));
    // zones de la plaque et indice
    if (indice === 2 && tps - tIndice > 7) indice = 0;
    lblZones.show(zonesOn); lblIndice.show(zonesOn && indice > 0);
    // le bon bouton clignote tant que l'élève n'agit pas dans le sens demandé par l'étape (une seule action mise en avant)
    const sens = mission && mis.phase === 'faire' && !scen ? SENS[ETAPES[mis.i].fl] || 0 : 0, agit = sens && (auto === sens || rate * sens > 0.3 || !!geste);
    zoneC.classList.toggle('appel', zonesOn && (sens ? sens === 1 && !agit : indice === 1));
    zoneF.classList.toggle('appel', zonesOn && sens === -1 && !agit);
    // panneau
    const te = scen ? (scen.type === 'subli' ? '−18&nbsp;°C (glaçon)' : 'air 20&nbsp;°C · bloc très froid') : fmt(Taff) + '&nbsp;°C';
    const etat = [pres.S && 'solide', pres.L && 'liquide', pres.G && 'gazeux'].filter(Boolean).join(' + ');
    if (te + etat !== txtE) { txtE = te + etat; roT.set(te + ' · ' + etat); }
    // mission : détection automatique, puis la question
    if (mission) {
      if (mis.phase === 'faire' && !fade && FAIT[ETAPES[mis.i].fl]()) { mis.phase = 'vu'; mis.t = 0; if (!scen) { setAuto(0); cible = E; viseT = null; } majZones(); majBandeau(); }
      else if (mis.phase === 'vu' && (mis.t += dt) > 1.1) poserQuestion();
    }
    // explication
    let k;
    if (scen) k = scen.type === 'subli' ? (scen.fin ? 'subliFin' : act === 'sublimation' ? 'sublimation' : attend ? 'subliAttente' : 'subliDebut') : (scen.fin ? 'givreFin' : act === 'condS' ? 'givre' : attend ? 'givreAttente' : 'givreDebut');
    else if (act === 'vaporisation') k = mode === 'ebullition' ? 'ebullition' : 'evaporation';
    else if (act) k = act;
    else if (nS === N) k = touche ? 'solide' : 'debut';
    else if (nL === N) k = chauffe ? 'liquideChauffe' : 'liquide';
    else if (nG === N) k = 'gaz';
    else if (nS && nL && !nG) k = 'palierFusion';
    else if (nL && nG && !nS) k = mode === 'ebullition' ? 'palierEbu' : 'palierEvap';
    else k = 'melange';
    ex.set(mission && (k === 'subliFin' || k === 'givreFin') ? TXT[k].replace(' Touche la plaque pour reprendre la main.', '') : TXT[k]);
  }
  st.onFrame(image);
  for (let k = 0; k < (+q.get('ff') || 0) * 60; k++) image(1 / 60);   // essai : avance rapide de ff secondes

  return {
    dispose() {
      stageEl.removeEventListener('pointerdown', onDown, true);
      window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp); window.removeEventListener('pointercancel', onUp);
      st.dispose(); bandeau.remove(); carteEl.remove(); panel2.remove(); root.classList.remove('em-sim'); retirerStyle();
    },
    // pour le banc d'essai : état du modèle et position à l'écran d'un point de la scène
    etat: () => ({ E, cible, T: Math.round(Taff), nS, nL, nG, mode, auto, modeUI, viseT, zonesOn, tige: tige.position.y,
      scen: scen && { type: scen.type, go: scen.go, fin: scen.fin, n: scen.n }, mission: { i: mis.i, phase: mis.phase, faits: [...mis.faits] } }),
    ecran: (x, y, z) => { const v = new THREE.Vector3(x, y, z).project(st.camera), r = canvas.getBoundingClientRect(); return [r.left + (v.x + 1) / 2 * r.width, r.top + (1 - v.y) / 2 * r.height]; },
  };
}
