// Application : routeur à ancres, accueil, pages chapitre, mots à retenir, contrôle blanc, progression locale.
import { CHAPITRES, THEMES, parId } from '../data/chapitres.js';
import { QUESTIONS } from '../data/questions.js';
import { AUDIO } from '../data/audio.js';
import { lancerQuiz, melange } from './quiz.js';
import { schemaAvecLegende } from './schemas.js';
import { PRIO } from '../data/priorites.js';
import { hydrater } from './widgets.js';

for (const c of CHAPITRES) Object.assign(c, PRIO[c.id] || {});

const app = document.getElementById('app');
const h = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html !== undefined) e.innerHTML = html; return e; };

/* ---------- questions : identifiants stables ---------- */
const TOUTES = [];
for (const c of CHAPITRES) (QUESTIONS[c.id] || []).forEach((q, i) => { q.id = c.id + ':' + i; q.chapId = c.id; TOUTES.push(q); });

/* ---------- progression (localStorage) ---------- */
const CLE = 'rs2e-progression-v1';
const P = (() => { try { return JSON.parse(localStorage.getItem(CLE)) || {}; } catch { return {}; } })();
P.q = P.q || {}; P.sims = P.sims || {}; P.lu = P.lu || {}; P.coche = P.coche || {}; P.prof = P.prof || {};
const sauver = () => { try { localStorage.setItem(CLE, JSON.stringify(P)); } catch { /* navigation privée */ } };
const noter = (q, ok) => { const r = (P.q[q.id] = P.q[q.id] || { ok: 0, ko: 0 }); ok ? r.ok++ : r.ko++; r.dernier = ok; sauver(); };
const reussie = (q) => P.q[q.id] && P.q[q.id].dernier === true;
const ratee = (q) => P.q[q.id] && P.q[q.id].dernier === false;
function avancement(c) {
  const qs = QUESTIONS[c.id] || [];
  const ok = qs.filter(reussie).length;
  return { ok, total: qs.length, pct: qs.length ? Math.round((ok / qs.length) * 100) : 0 };
}

/* ---------- expériences 3D : montage paresseux, démontage propre ---------- */
let simsActives = [];
let finWidgets = null;
function demonterSims() { simsActives.forEach((s) => { try { s && s.dispose && s.dispose(); } catch (e) { console.warn(e); } }); simsActives = []; }
function carteSim(sim) {
  const carte = h('section', 'sim-carte', `<header><h3>${sim.titre}</h3><span>${sim.sous || ''}</span></header>`);
  const zone = h('div', '', '<div class="sim-attente">Préparation de l\'expérience…</div>');
  carte.appendChild(zone);
  let monte = false;
  const io = new IntersectionObserver(async (es) => {
    if (!es[0].isIntersecting || monte) return;
    monte = true; io.disconnect();
    try {
      const mod = await import(`../sims/${sim.id}.js`);
      zone.innerHTML = '';
      simsActives.push(mod.default(zone));
      P.sims[sim.id] = true; sauver();
    } catch (e) {
      console.error(e);
      zone.innerHTML = '<div class="sim-attente">Cette expérience n\'a pas pu démarrer sur cet appareil. La leçon et les exercices fonctionnent quand même.</div>';
    }
  }, { rootMargin: '200px' });
  io.observe(carte);
  return carte;
}

/* ---------- lecteur audio (résumé raconté) ---------- */
let audioEnCours = null;
function lecteurAudio(c) {
  if (!AUDIO.includes(c.id) || c.video) return null; // la capsule vidéo remplace le résumé audio
  const box = h('div', 'audio', `<button type="button" aria-label="Écouter le résumé">▶</button><div class="t"><b>Écoute le résumé</b><span>L'essentiel du chapitre, raconté</span><progress value="0" max="1"></progress></div>`);
  const bt = box.querySelector('button'), pr = box.querySelector('progress');
  const a = new Audio(`audio/${c.id}.mp3`); a.preload = 'none';
  bt.onclick = () => { if (a.paused) { if (audioEnCours && audioEnCours !== a) audioEnCours.pause(); audioEnCours = a; a.play(); } else a.pause(); };
  a.onplay = () => (bt.textContent = '❚❚'); a.onpause = () => (bt.textContent = '▶'); a.onended = () => { bt.textContent = '▶'; pr.value = 0; };
  a.ontimeupdate = () => { if (a.duration) pr.value = a.currentTime / a.duration; };
  return box;
}

/* ---------- cartes de mots ---------- */
function grilleMots(liste) {
  const g = h('div', 'mots');
  liste.forEach(([mot, def]) => {
    const b = h('button', 'mot', `<div class="in"><div class="f r">${mot}<small>touche pour voir la définition</small></div><div class="f v">${def}</div></div>`);
    b.type = 'button'; b.onclick = () => b.classList.toggle('vu');
    g.appendChild(b);
  });
  return g;
}
/** Fabrique un QCM « quelle est la définition de… » à partir des mots à retenir. */
function quizMots(liste, n = 12) {
  const pool = liste.filter(([m]) => m.length < 40);
  return melange(pool).slice(0, n).map(([mot, def]) => {
    const autres = melange(pool.filter(([m]) => m !== mot)).slice(0, 3).map(([m]) => m);
    return { type: 'qcm', q: `Quel mot correspond à cette définition ? « ${def} »`, choix: [mot, ...autres], bonne: 0, expl: `<b>${mot}</b> : ${def}`, id: 'mot:' + mot };
  });
}

/* ---------- pages ---------- */
function accueil() {
  document.body.dataset.theme = '5';
  const nbQ = TOUTES.length, nbOk = TOUTES.filter(reussie).length;
  const nbSims = CHAPITRES.reduce((n, c) => n + c.sims.length, 0), simsVues = Object.keys(P.sims).length;
  const w = h('div', 'wrap');
  w.innerHTML = `
  <section class="hero">
    <div>
      <span class="kicker">Sciences · 2e secondaire</span>
      <h1 style="margin-top:14px"><em>Ça va chauffer…</em><br>et <b>les mélanges</b></h1>
      <p>Tout ton cours des thèmes 5 et 6 : expliqué en clair, avec des expériences 3D à manipuler et des exercices qui t'expliquent
      tes erreurs. Les mots surlignés <mark>comme ça</mark> sont ceux à retenir.</p>
      <div class="hero-cta">
        <a class="btn chaud" href="#/examen">Contrôle blanc</a>
        <a class="btn ghost" href="#/c/${prochainChapitre().id}">${nbOk ? 'Continuer' : 'Commencer'} : ${prochainChapitre().titre}</a>
      </div>
    </div>
    <div class="hero-art"><canvas id="heroCanvas"></canvas><span>Glisse ton doigt : tu chauffes les molécules.</span></div>
  </section>
  <section class="bilan">
    <div class="tuile"><b>${nbOk}<small style="font-size:16px;color:var(--encre2)"> / ${nbQ}</small></b><span>exercices réussis</span></div>
    <div class="tuile"><b>${simsVues}<small style="font-size:16px;color:var(--encre2)"> / ${nbSims}</small></b><span>expériences essayées</span></div>
    <div class="tuile"><b>${CHAPITRES.filter((c) => avancement(c).pct >= 80).length}<small style="font-size:16px;color:var(--encre2)"> / ${CHAPITRES.length}</small></b><span>chapitres maîtrisés</span></div>
    <div class="tuile"><b>${TOUTES.filter(ratee).length}</b><span>erreurs à refaire</span></div>
  </section>`;
  // Plan express : dans quel ordre réviser la veille, et combien de temps
  const plan = h('section', 'plan');
  const ordre = CHAPITRES.slice().sort((a, b) => b.etoiles - a.etoiles || CHAPITRES.indexOf(a) - CHAPITRES.indexOf(b));
  const total = CHAPITRES.reduce((n, c) => n + (c.minutes || 0), 0);
  const total3 = ordre.filter((c) => c.etoiles === 3).reduce((n, c) => n + (c.minutes || 0), 0);
  plan.innerHTML = `<div class="theme-titre"><span class="kicker">Pour demain</span><h2>Le plan express</h2></div>
    <p class="plan-intro">Tu as déjà travaillé le cours : inutile de tout relire. Fais les chapitres <b>★★★ d'abord</b>. Pour chacun : la case
    « Si tu n'as que 10 minutes », puis « L'essentiel ★ » dans S'entraîner. Compte environ <b>${total} minutes</b> pour tout, ou
    <b>${total3} minutes</b> pour les ★★★ seulement.</p>`;
  const lp = h('div', 'plan-liste');
  ordre.forEach((c) => {
    const ess = (QUESTIONS[c.id] || []).filter((q) => q.prio), okE = ess.filter(reussie).length, fait = ess.length && okE === ess.length;
    const coches = (c.prio || []).filter((_, i) => P.coche[c.id + ':' + i]).length;
    const a = h('a', 'plan-item' + (fait ? ' fait' : ''), `<span class="plan-et">${'★'.repeat(c.etoiles)}</span><span class="plan-t"><b>${c.titre}</b><small>${(c.prio || []).map((p) => p[0]).join(' · ')}</small></span><span class="plan-m">${c.minutes || 5} min</span><span class="plan-a">${fait ? '✓ acquis' : `${coches}/${(c.prio || []).length} cochés · ${okE}/${ess.length} ★`}</span>`);
    a.href = '#/c/' + c.id; a.dataset.theme = c.theme; lp.appendChild(a);
  });
  plan.appendChild(lp); w.appendChild(plan);

  for (const t of [5, 6]) {
    const sec = h('section'); sec.dataset.theme = t;
    sec.innerHTML = `<div class="theme-titre"><span class="kicker">Thème ${t}</span><h2>${THEMES[t].titre}</h2></div>`;
    const cartes = h('div', 'cartes');
    CHAPITRES.filter((c) => c.theme === t).forEach((c) => {
      const a = avancement(c), n = CHAPITRES.indexOf(c) + 1;
      const el = h('a', 'carte', `<div class="num">${String(n).padStart(2, '0')}</div><h3>${c.titre}</h3><p>${c.accroche}</p>
        <div class="pied"><span title="Importance pour le contrôle">${'★'.repeat(c.etoiles)}${'☆'.repeat(3 - c.etoiles)}</span><div class="jauge"><i style="width:${a.pct}%"></i></div><span>${a.ok}/${a.total}</span></div>`);
      el.href = '#/c/' + c.id; el.dataset.theme = t;
      cartes.appendChild(el);
    });
    sec.appendChild(cartes); w.appendChild(sec);
  }
  app.appendChild(w);
  heroAnimation(document.getElementById('heroCanvas'));
}
function prochainChapitre() { return CHAPITRES.find((c) => avancement(c).pct < 80) || CHAPITRES[0]; }

function chapitre(id, onglet) {
  const c = parId[id];
  if (!c) return accueil();
  document.body.dataset.theme = String(c.theme);
  const idx = CHAPITRES.indexOf(c), suivant = CHAPITRES[idx + 1], prec = CHAPITRES[idx - 1];
  const tete = h('div', 'wrap chap-tete', `<a class="fil" href="#/">← Thème ${c.theme} · ${THEMES[c.theme].titre}</a>
    <h1>${c.titre}</h1><p>${c.accroche} <span title="Importance pour le contrôle" style="color:var(--chaud);white-space:nowrap">${'★'.repeat(c.etoiles)}</span></p>`);
  const ONG = [['comprendre', 'Comprendre'], ...(c.sims.length ? [['experience', c.sims.length > 1 ? 'Expériences 3D' : 'Expérience 3D']] : []), ['exercices', 'S\'entraîner'], ['mots', 'Mots à retenir']];
  if (!ONG.some((o) => o[0] === onglet)) onglet = 'comprendre';
  const barre = h('div', 'onglets'); const bw = h('div', 'wrap'); barre.appendChild(bw);
  ONG.forEach(([k, nom]) => { const b = h('button', k === onglet ? 'on' : '', nom); b.type = 'button'; b.onclick = () => { location.hash = `#/c/${id}/${k}`; }; bw.appendChild(b); });
  const corps = h('div', 'wrap');
  app.append(tete, barre, corps);

  if (onglet === 'comprendre') {
    const la = lecteurAudio(c); if (la) corps.appendChild(la);
    let source = c.lecon;
    if (c.prio && !source.includes('{{w:priorites}}')) source = '{{w:priorites}}' + source;
    if (c.prof && !source.includes('{{w:prof}}')) source += '{{w:prof}}';
    const lec = h('div', '', source.replace(/\{\{schema:([\w-]+)\}\}/g, (_, s) => schemaAvecLegende(s)).replace(/\{\{w:([\w-]+)\}\}/g, '<div data-w="$1"></div>'));
    corps.appendChild(lec);
    finWidgets = hydrater(lec, c, { P, sauver });
    const nav = h('div', 'hero-cta'); nav.style.margin = '8px 0 30px';
    nav.innerHTML = (c.sims.length ? `<a class="btn chaud" href="#/c/${id}/experience">Faire l'expérience →</a>` : '') + `<a class="btn ${c.sims.length ? 'ghost' : 'chaud'}" href="#/c/${id}/exercices">M'entraîner</a>`;
    corps.appendChild(nav);
    P.lu[id] = true; sauver();
  } else if (onglet === 'experience') {
    c.sims.forEach((s) => corps.appendChild(carteSim(s)));
    const nav = h('div', 'hero-cta'); nav.style.margin = '8px 0 30px';
    nav.innerHTML = `<a class="btn chaud" href="#/c/${id}/exercices">Je passe aux exercices →</a>`;
    corps.appendChild(nav);
  } else if (onglet === 'exercices') {
    const qs = QUESTIONS[id] || [];
    const zone = h('div');
    const choisir = () => {
      zone.innerHTML = '';
      const a = avancement(c), err = qs.filter(ratee), ess = qs.filter((q) => q.prio);
      const modes = h('div', 'modes');
      const mode = (titre, sous, liste, ordreFixe) => { const b = h('button', 'mode', `<b>${titre}</b><span>${sous}</span>`); b.type = 'button'; b.disabled = !liste.length; if (!liste.length) b.style.opacity = .45; b.onclick = () => jouer(ordreFixe ? liste : melange(liste)); modes.appendChild(b); };
      mode('L\'essentiel ★', `${ess.length} questions à ne pas rater`, ess, true);
      mode('Tout le chapitre', `${qs.length} questions · ${a.ok} déjà réussies`, qs, true);
      mode('Mes erreurs', err.length ? `${err.length} à refaire` : 'Aucune erreur en attente', err, false);
      mode('Les définitions', 'Retrouve le mot à partir de sa définition', c.mots.length >= 4 ? quizMots(c.mots, 8) : [], false);
      zone.append(modes);
    };
    const jouer = (liste) => lancerQuiz(zone, liste, {
      onReponse: (q, ok) => { if (!String(q.id).startsWith('mot:')) noter(q, ok); },
      onFin: ({ actions }) => {
        const b = h('button', 'btn ghost', 'Autres exercices'); b.onclick = choisir; actions.appendChild(b);
        if (suivant) { const s = h('a', 'btn', `Chapitre suivant : ${suivant.titre} →`); s.href = '#/c/' + suivant.id; actions.appendChild(s); }
      },
    });
    corps.appendChild(zone); choisir();
  } else if (onglet === 'mots') {
    corps.appendChild(h('p', '', 'Touche une carte pour la retourner. Essaie de dire la définition <b>avant</b> de regarder.'));
    corps.appendChild(grilleMots(c.mots));
  }
  const bas = h('div', 'wrap hero-cta'); bas.style.margin = '26px auto 0'; bas.style.justifyContent = 'space-between';
  bas.innerHTML = (prec ? `<a class="btn ghost petit" href="#/c/${prec.id}">← ${prec.titre}</a>` : '<span></span>') + (suivant ? `<a class="btn ghost petit" href="#/c/${suivant.id}">${suivant.titre} →</a>` : '<a class="btn ghost petit" href="#/examen">Contrôle blanc →</a>');
  app.appendChild(bas);
}

function pageMots() {
  document.body.dataset.theme = '5';
  const w = h('div', 'wrap');
  w.innerHTML = `<div class="chap-tete" style="padding-left:0;padding-right:0"><span class="kicker">Vocabulaire</span><h1>Les mots à retenir</h1>
    <p>Ce sont les termes exacts de ton cours. Si tu sais définir chacun d'eux, tu as déjà la moitié des points.</p></div>`;
  const zoneQuiz = h('div'); const tous = CHAPITRES.flatMap((c) => c.mots);
  const cta = h('div', 'hero-cta'); cta.style.marginBottom = '24px';
  const b = h('button', 'btn chaud', 'Teste-moi sur 12 définitions'); b.onclick = () => { lancerQuiz(zoneQuiz, quizMots(tous, 12), {}); zoneQuiz.scrollIntoView({ behavior: 'smooth' }); };
  cta.appendChild(b); w.append(cta, zoneQuiz);
  CHAPITRES.forEach((c) => { const s = h('section'); s.dataset.theme = c.theme; s.innerHTML = `<div class="theme-titre"><span class="kicker">Thème ${c.theme}</span><h2 style="font-size:24px">${c.titre}</h2></div>`; s.appendChild(grilleMots(c.mots)); w.appendChild(s); });
  app.appendChild(w);
}

function examen() {
  document.body.dataset.theme = '5';
  const w = h('div', 'wrap');
  w.innerHTML = `<div class="chap-tete" style="padding-left:0;padding-right:0"><span class="kicker">Comme au contrôle</span><h1>Contrôle blanc</h1>
    <p>Des questions tirées au hasard dans tous les chapitres, avec plus de questions « essentielles ». Chaque réponse est expliquée.</p></div>`;
  const zone = h('div'); w.appendChild(zone);
  const tirage = (pool, n) => {
    const ess = melange(pool.filter((q) => q.prio)), reste = melange(pool.filter((q) => !q.prio));
    const k = Math.min(ess.length, Math.round(n * 0.65));
    return melange([...ess.slice(0, k), ...reste.slice(0, n - k)]).map((q) => Object.assign({}, q, { chap: parId[q.chapId].titre }));
  };
  const choisir = () => {
    zone.innerHTML = '';
    const modes = h('div', 'modes');
    const mode = (titre, sous, f) => { const b = h('button', 'mode', `<b>${titre}</b><span>${sous}</span>`); b.type = 'button'; b.onclick = () => jouer(f()); modes.appendChild(b); };
    const t = (n) => TOUTES.filter((q) => parId[q.chapId].theme === n);
    mode('Les deux thèmes', '20 questions, comme demain', () => tirage(TOUTES, 20));
    mode('Thème 5 seulement', '15 questions · Ça va chauffer…', () => tirage(t(5), 15));
    mode('Thème 6 seulement', '15 questions · Les mélanges', () => tirage(t(6), 15));
    mode('Révision express', '10 questions essentielles, 5 minutes', () => melange(TOUTES.filter((q) => q.prio)).slice(0, 10).map((q) => Object.assign({}, q, { chap: parId[q.chapId].titre })));
    const err = TOUTES.filter(ratee);
    if (err.length) mode('Toutes mes erreurs', `${err.length} questions ratées la dernière fois`, () => melange(err).map((q) => Object.assign({}, q, { chap: parId[q.chapId].titre })));
    zone.appendChild(modes);
  };
  const jouer = (liste) => lancerQuiz(zone, liste, {
    onReponse: (q, ok) => noter(q, ok),
    onFin: ({ actions, ratees }) => {
      const b = h('button', 'btn ghost', 'Choisir un autre contrôle'); b.onclick = choisir; actions.appendChild(b);
      const chaps = [...new Set(ratees.map((q) => q.chapId))];
      if (chaps.length) { const p = h('p', '', 'Chapitres à revoir : ' + chaps.map((id) => `<a href="#/c/${id}"><b>${parId[id].titre}</b></a>`).join(' · ')); p.style.marginTop = '14px'; actions.after(p); }
    },
  });
  app.appendChild(w); choisir();
}

/* ---------- animation d'accueil : des molécules qu'on chauffe du doigt (canvas 2D, léger) ---------- */
let heroStop = null;
function heroAnimation(cv) {
  if (!cv) return;
  const x = cv.getContext('2d'); let W, H, d = Math.min(devicePixelRatio || 1, 2), raf, chaleur = 0.25, cible = 0.25, px = -1, py = -1;
  const M = Array.from({ length: 70 }, () => ({ x: Math.random(), y: Math.random(), vx: (Math.random() - 0.5), vy: (Math.random() - 0.5), r: 5 + Math.random() * 5 }));
  const taille = () => { const r = cv.getBoundingClientRect(); W = r.width; H = r.height; cv.width = W * d; cv.height = H * d; };
  taille(); const ro = new ResizeObserver(taille); ro.observe(cv);
  const bouge = (e) => { const r = cv.getBoundingClientRect(); px = (e.clientX - r.left) / r.width; py = (e.clientY - r.top) / r.height; cible = 1; };
  cv.addEventListener('pointermove', bouge); cv.addEventListener('pointerdown', bouge); cv.addEventListener('pointerleave', () => { cible = 0.2; px = -1; });
  const mix = (a, b, t) => a + (b - a) * t;
  (function f() {
    raf = requestAnimationFrame(f);
    chaleur += (cible - chaleur) * 0.03; if (px < 0) cible = 0.2 + 0.15 * Math.sin(performance.now() / 2500);
    x.setTransform(d, 0, 0, d, 0, 0); x.clearRect(0, 0, W, H);
    const g = x.createRadialGradient(W / 2, H * 0.2, 10, W / 2, H / 2, W); g.addColorStop(0, '#241f47'); g.addColorStop(1, '#141226'); x.fillStyle = g; x.fillRect(0, 0, W, H);
    for (const m of M) {
      const pres = px >= 0 ? Math.max(0, 1 - Math.hypot(m.x - px, m.y - py) * 2.2) : 0, c = Math.min(1, chaleur * 0.7 + pres);
      const v = 0.0012 + c * 0.012;
      m.vx += (Math.random() - 0.5) * 0.4; m.vy += (Math.random() - 0.5) * 0.4; const n = Math.hypot(m.vx, m.vy) || 1; m.vx /= n; m.vy /= n;
      m.x += m.vx * v; m.y += m.vy * v;
      if (m.x < 0.03 || m.x > 0.97) { m.vx *= -1; m.x = Math.min(0.97, Math.max(0.03, m.x)); } if (m.y < 0.03 || m.y > 0.97) { m.vy *= -1; m.y = Math.min(0.97, Math.max(0.03, m.y)); }
      const R = Math.round(mix(61, 255, c)), G = Math.round(mix(139, 90, c)), B = Math.round(mix(255, 54, c));
      x.beginPath(); x.arc(m.x * W, m.y * H, m.r * (1 + c * 0.35), 0, 7); x.fillStyle = `rgb(${R},${G},${B})`; x.shadowColor = `rgba(${R},${G},${B},.8)`; x.shadowBlur = 8 + c * 22; x.fill();
      x.beginPath(); x.moveTo(m.x * W, m.y * H); x.lineTo((m.x - m.vx * (0.02 + c * 0.07)) * W, (m.y - m.vy * (0.02 + c * 0.07)) * H); x.strokeStyle = `rgba(${R},${G},${B},.55)`; x.lineWidth = 3; x.shadowBlur = 0; x.stroke();
    }
  })();
  heroStop = () => { cancelAnimationFrame(raf); ro.disconnect(); };
}

/* ---------- routeur ---------- */
function route() {
  demonterSims(); if (finWidgets) { finWidgets(); finWidgets = null; } if (heroStop) { heroStop(); heroStop = null; } if (audioEnCours) audioEnCours.pause();
  app.innerHTML = '';
  const [, r, a, b] = location.hash.replace(/^#/, '').split('/');
  const actif = r === 'c' ? 'accueil' : r === 'mots' ? 'mots' : r === 'examen' ? 'examen' : 'accueil';
  document.querySelectorAll('#nav a').forEach((l) => l.classList.toggle('on', l.dataset.r === actif));
  if (r === 'c') chapitre(a, b); else if (r === 'mots') pageMots(); else if (r === 'examen') examen(); else accueil();
  if (!b || b === 'comprendre') window.scrollTo(0, 0);
}
window.addEventListener('hashchange', route);
route();
