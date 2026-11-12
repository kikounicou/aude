// Moteur d'exercices : QCM, vrai/faux, texte à trous (à écrire ou avec banque de mots), réponse à écrire,
// classer, relier, remettre dans l'ordre, calcul, schéma à légender. Chaque réponse donne une explication.
//
// Parcours d'une question :
// - on répond au toucher (le plus fiable sur téléphone) ; tout ce qui se range peut AUSSI se glisser (souris, doigt,
//   stylet) : classer, cases + banque de mots, relier, remettre dans l'ordre ;
// - « Vérifier » reste visible mais pâli tant qu'il manque quelque chose ; un clic dit alors ce qui manque ;
// - deux actions discrètes à côté :
//     « Voir la réponse » : la réponse et l'explication s'affichent ; la question compte comme NON réussie
//                           (onReponse(q, false)) et rejoint « À revoir », sans reproche ;
//     « Passer »          : question suivante, RIEN n'est enregistré (ni réussite ni erreur) : la question reste
//                           « non faite » dans la progression ; le score les compte à part (« 5/8 · 2 passées ») et
//                           propose de les faire ;
// - après la vérification, un seul gros bouton « Question suivante → », juste sous l'explication. Si la carte dépasse
//   l'écran, la barre d'actions reste collée en bas de la fenêtre (émulé en JS : `position: sticky` ne fonctionne pas
//   sur ce site, car `html, body { overflow-x: hidden }` fait de body un conteneur de défilement).
// Tant qu'une question est affichée, <body> porte la classe `quiz-en-cours` (retirée à l'écran de score et dès que le
// quiz quitte la page). Styles : css/quiz-plus.css (à charger après app.css).
import { schemaSVG, SCHEMAS } from './schemas.js';

const h = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html !== undefined) e.innerHTML = html; return e; };
export const melange = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

/** Normalise une réponse écrite : minuscules, sans accents, sans article, sans ponctuation. */
export function norm(s) {
  return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’`]/g, "'")
    .replace(/[.,;:!?()«»"]/g, ' ').replace(/\s+/g, ' ').trim()
    .replace(/^(le |la |les |l'|un |une |des |du |de la |de l'|de |d')/, '').trim();
}
function distance(a, b) {
  if (Math.abs(a.length - b.length) > 2) return 9;
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}
/** 'ok' | 'presque' (une faute de frappe) | 'non' */
export function compare(saisie, attendues) {
  const s = norm(saisie);
  if (!s) return 'non';
  let presque = false;
  for (const a of attendues) {
    const n = norm(a);
    if (s === n || s.replace(/ /g, '') === n.replace(/ /g, '')) return 'ok';
    if (n.length >= 6 && distance(s, n) <= 1) presque = true;
    else if (n.length >= 10 && distance(s, n) <= 2) presque = true;
  }
  return presque ? 'presque' : 'non';
}

const NOMS = { qcm: 'Choisis la bonne réponse', vf: 'Vrai ou faux ?', trous: 'Complète', ecrire: 'Écris la réponse', classer: 'Classe', relier: 'Relie', ordre: 'Remets dans l\'ordre', calcul: 'Calcule', legende: 'Légende le schéma' };
const AIDE_BANQUE = 'Touche un mot : il va dans la case bleue. Touche une case pour la choisir ou la vider. Tu peux aussi glisser les mots.';
const BRAVO = ['Exact !', 'Bien joué !', 'Oui !', 'C\'est ça !'];

const reduit = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const auDoigt = () => window.matchMedia('(pointer: coarse)').matches;
const texteDe = (html) => h('div', '', html).textContent.replace(/\s+/g, ' ').trim();

/* ---------- défilement : tient compte des barres collées en haut (en-tête, onglets) si elles le sont ---------- */
function hautCouvert() {
  let b = 0;
  document.querySelectorAll('.top, .onglets').forEach((e) => { const r = e.getBoundingClientRect(); if (r.top <= 1 && r.bottom > b && r.bottom < innerHeight / 2) b = r.bottom; });
  return b;
}
function defiler(dy) { if (Math.abs(dy) > 2) window.scrollBy({ top: dy, behavior: reduit() ? 'instant' : 'smooth' }); }
/** Amène le haut de `el` en haut de l'écran, seulement s'il n'y est pas déjà (pas de saut inutile). */
function voirHaut(el) {
  const haut = hautCouvert() + 10, t = el.getBoundingClientRect().top;
  if (t < haut || t > innerHeight * 0.45) defiler(t - haut);
}
/** Après « Vérifier » : le verdict ET le bouton pour continuer à l'écran, sans cacher le début du verdict. */
function voirRetour(ret, carte) {
  const haut = hautCouvert() + 8, bas = innerHeight - 8;
  const t = ret.getBoundingClientRect().top, fond = carte.getBoundingClientRect().bottom;
  if (t >= haut && fond <= bas) return;
  let dy = fond - bas;
  if (t - dy < haut) dy = t - haut;
  defiler(dy);
}

/* ---------- body.quiz-en-cours : tant qu'une question est affichée ---------- */
// Le routeur vide simplement #app : un MutationObserver (actif seulement pendant une série) retire la classe dès que
// le quiz n'est plus dans la page. Un seul quiz actif à la fois : relancer une série ailleurs prend le relais.
let quizActif = null, veille = null;
function synchro() {
  if (quizActif && !quizActif.isConnected) quizActif = null;
  document.body.classList.toggle('quiz-en-cours', !!quizActif);
  if (quizActif && !veille) { veille = new MutationObserver(synchro); veille.observe(document.body, { childList: true, subtree: true }); }
  else if (!quizActif && veille) { veille.disconnect(); veille = null; }
}
function marquer(box, enCours) {
  if (enCours) quizActif = box; else if (quizActif === box) quizActif = null;
  synchro();
}

/* ---------- barre d'actions : à sa place sous la question, collée en bas de la fenêtre si sa place est plus bas ---------- */
// La place garde la hauteur de la barre quand celle-ci devient fixe : la page ne bouge pas. Rien n'est masqué pour
// de bon : en descendant, la barre retrouve sa place à la fin de la carte. Pendant la saisie au clavier d'un
// téléphone, elle ne se colle pas (elle se mettrait par-dessus le clavier ou le champ).
let barreActive = null;
function barreCollante(carte, place, barre) {
  if (barreActive) barreActive.arreter();
  let raf = 0;
  const calc = () => {
    raf = 0;
    if (!carte.isConnected) { arreter(); return; }
    const vh = window.innerHeight, hb = barre.offsetHeight, ae = document.activeElement;
    const saisie = auDoigt() && ae && ae.tagName === 'INPUT' && !ae.readOnly && carte.contains(ae);
    const rp = place.getBoundingClientRect(), rc = carte.getBoundingClientRect();
    const colle = !saisie && rp.top + hb > vh + 2 && rc.top < vh - hb - 60;
    barre.classList.toggle('colle', colle);
    place.style.minHeight = colle ? hb + 'px' : '';
    barre.style.left = colle ? rp.left + 'px' : '';
    barre.style.width = colle ? rp.width + 'px' : '';
  };
  const planifier = () => { if (!raf) raf = requestAnimationFrame(calc); };
  const ro = new ResizeObserver(planifier);
  const api = {
    planifier,
    arreter() {
      window.removeEventListener('scroll', planifier); window.removeEventListener('resize', planifier);
      document.removeEventListener('focusin', planifier); document.removeEventListener('focusout', planifier);
      ro.disconnect(); if (raf) cancelAnimationFrame(raf); raf = 0;
      barre.classList.remove('colle'); place.style.minHeight = ''; barre.style.left = barre.style.width = '';
      if (barreActive === api) barreActive = null;
    },
  };
  const arreter = api.arreter;
  ro.observe(carte); ro.observe(barre);
  window.addEventListener('scroll', planifier, { passive: true }); window.addEventListener('resize', planifier);
  document.addEventListener('focusin', planifier); document.addEventListener('focusout', planifier);
  barreActive = api;
  calc();
  return api;
}

/* ---------- glisser-déposer au pointeur (souris, doigt, stylet), EN PLUS des touches ----------
   Pointer Events (le glisser-déposer HTML5 ne marche pas au doigt). Un toucher reste un toucher : le glisser ne commence
   qu'au-delà de quelques pixels. Un fantôme suit le pointeur (au doigt, il flotte juste au-dessus pour rester visible),
   la cible visée porte la classe `vise`, les bords de l'écran font défiler la page, Échap annule, et le clic qui suit
   un glisser est avalé. `touch-action: none` seulement sur ce qui glisse (css) : ailleurs, la page défile.
   o = { cibles(): où déposer · deposer(cible) · debut() · actif() · texte(): texte du fantôme · large: fantôme à la
         largeur de la source · poignee: sélecteur (au doigt, seule la poignée glisse) · exclure: sélecteur qui ne glisse
         pas · horizontal: au doigt, un geste vertical fait défiler la page · survol(x, y) -> cible ou null, et
         quitter() : pour dessiner soi-même le repère (remettre dans l'ordre) } */
let avalerClic = 0;
window.addEventListener('click', (e) => { if (performance.now() < avalerClic) { avalerClic = 0; e.stopPropagation(); e.preventDefault(); } }, true);

function glissable(src, o) {
  src.classList.add('glissable');
  if (o.horizontal) src.classList.add('glisse-x');
  src.addEventListener('pointerdown', (e) => {
    if (!e.isPrimary || e.button !== 0 || src.closest('.fige') || (o.actif && !o.actif())) return;
    if (o.exclure && e.target.closest(o.exclure)) return;
    const doigt = e.pointerType === 'touch';
    if (doigt && o.poignee && !e.target.closest(o.poignee)) return;
    const id = e.pointerId, x0 = e.clientX, y0 = e.clientY;
    let x = x0, y = y0, g = null;

    const viser = () => {
      let c = null;
      if (o.survol) c = o.survol(x, y);
      else {
        const cs = o.cibles().filter((t) => t !== src && t.isConnected);
        const sous = document.elementFromPoint(x, y);
        c = (sous && cs.find((t) => t.contains(sous))) || null;
        if (!c) { // tolérance : la cible la plus proche à quelques pixels (un doigt n'est pas une pointe)
          let mieux = doigt ? 24 : 10;
          for (const t of cs) { const r = t.getBoundingClientRect(); const d = Math.hypot(Math.max(r.left - x, 0, x - r.right), Math.max(r.top - y, 0, y - r.bottom)); if (d < mieux) { mieux = d; c = t; } }
        }
        if (c !== g.cible) { if (g.cible) g.cible.classList.remove('vise'); if (c) c.classList.add('vise'); }
      }
      g.cible = c;
    };
    const placer = () => { g.f.style.transform = `translate3d(${Math.round(x - g.dx)}px, ${Math.round(y - g.dy)}px, 0)`; };
    const boucle = () => {
      if (!g) return;
      g.raf = requestAnimationFrame(boucle);
      if (y > g.haut) g.armeH = true;
      if (y < g.bas) g.armeB = true;
      let v = 0; // défilement automatique près des bords (seulement après être sorti de la zone : pas de départ en trombe)
      if (g.armeH && y < g.haut) v = -Math.min(18, 3 + (g.haut - y) / 4);
      else if (g.armeB && y > g.bas) v = Math.min(18, 3 + (y - g.bas) / 4);
      if (v) window.scrollBy({ top: v, behavior: 'instant' });
      placer(); viser();
    };
    const commencer = () => {
      const r = src.getBoundingClientRect();
      const f = h('div', 'fantome' + (o.large ? ' large' : ''));
      f.textContent = o.texte ? o.texte() : src.textContent.trim();
      f.setAttribute('aria-hidden', 'true');
      Object.assign(f.style, { position: 'fixed', left: '0', top: '0', zIndex: '1000', pointerEvents: 'none', margin: '0' });
      if (o.large) f.style.width = r.width + 'px';
      document.body.appendChild(f);
      const fw = f.offsetWidth, fh = f.offsetHeight, barre = document.querySelector('.q-actions.colle');
      g = {
        f, cible: null, raf: 0,
        dx: Math.max(10, Math.min(fw - 10, x0 - r.left)),
        dy: doigt ? fh + 14 : Math.max(8, Math.min(fh - 8, y0 - r.top)),
        haut: hautCouvert() + 46,
        bas: (barre ? barre.getBoundingClientRect().top : innerHeight) - 36,
      };
      g.armeH = y0 > g.haut; g.armeB = y0 < g.bas;
      src.classList.add('en-glisse'); document.body.classList.add('glisse-en-cours');
      try { src.setPointerCapture(id); } catch (err) { /* pointeur déjà relâché */ }
      if (o.debut) o.debut();
      placer(); boucle();
    };
    const finir = (deposer) => {
      ecoute(false);
      if (!g) return;
      cancelAnimationFrame(g.raf); g.f.remove();
      src.classList.remove('en-glisse'); document.body.classList.remove('glisse-en-cours');
      if (o.survol) { if (o.quitter) o.quitter(); } else if (g.cible) g.cible.classList.remove('vise');
      const c = g.cible; g = null;
      avalerClic = performance.now() + 150;
      if (deposer && c != null) o.deposer(c);
    };
    const bouge = (ev) => {
      if (ev.pointerId !== id) return;
      x = ev.clientX; y = ev.clientY;
      if (!g) {
        const dx = x - x0, dy = y - y0;
        if (Math.hypot(dx, dy) < (doigt ? 10 : 6)) return;
        if (doigt && o.horizontal && Math.abs(dy) > Math.abs(dx)) { ecoute(false); return; } // geste vertical : la page défile
        commencer();
      }
      ev.preventDefault();
    };
    const lache = (ev) => { if (ev.pointerId === id) finir(true); };
    const annule = (ev) => { if (ev.pointerId === id) finir(false); };
    const clavier = (ev) => {
      if (ev.key !== 'Escape' || !g) return;
      ev.preventDefault(); ev.stopPropagation();
      try { src.releasePointerCapture(id); } catch (err) { /* rien */ }
      finir(false);
      window.addEventListener('pointerup', () => { avalerClic = performance.now() + 150; }, { once: true, capture: true });
    };
    function ecoute(on) {
      const f = on ? 'addEventListener' : 'removeEventListener';
      window[f]('pointermove', bouge, { passive: false }); window[f]('pointerup', lache); window[f]('pointercancel', annule); window[f]('keydown', clavier, true);
    }
    ecoute(true);
  });
}

/* ---------- composant « cases à remplir + banque de mots » (trous avec banque, légendes) ---------- */
// Toucher un mot le pose dans la case bleue (la première case libre, ou celle qu'on a choisie en la touchant).
// Toucher une case remplie la vide (et la choisit pour le mot suivant). On peut aussi glisser un mot sur la case de son
// choix, d'une case à une autre (échange) ou d'une case vers la banque (pour la vider).
function casesEtBanque(cibles, mots, maj) {
  const banque = h('div', 'banque');
  let fige = false, choisie = null;
  const prochaine = () => (choisie && !choisie._puce ? choisie : cibles.find((c) => !c._puce) || null);
  const signaler = () => {
    const p = fige ? null : prochaine();
    cibles.forEach((c, k) => { c.classList.toggle('prochaine', c === p); c.setAttribute('aria-label', c._puce ? `case ${k + 1} : ${c._puce.dataset.m}` : `case ${k + 1}, vide`); });
    if (maj) maj();
  };
  const vider = (c) => { if (c._puce) { c._puce.classList.remove('pris'); c._puce = null; } c.textContent = ''; c.classList.remove('pleine'); };
  const poser = (c, p) => { if (c._puce) vider(c); c._puce = p; c.textContent = p.dataset.m; c.classList.add('pleine'); p.classList.add('pris'); };
  const puces = melange(mots).map((m) => {
    const p = h('button', 'puce', m); p.type = 'button'; p.dataset.m = m; banque.appendChild(p);
    p.addEventListener('click', () => { if (fige) return; const c = prochaine(); if (c) { poser(c, p); choisie = null; signaler(); } });
    glissable(p, { actif: () => !fige, cibles: () => cibles, deposer: (c) => { poser(c, p); choisie = null; signaler(); } });
    return p;
  });
  cibles.forEach((c) => {
    c.tabIndex = 0; c.setAttribute('role', 'button');
    c.addEventListener('click', () => { if (fige) return; if (c._puce) { vider(c); choisie = c; } else choisie = choisie === c ? null : c; signaler(); });
    c.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); c.click(); } });
    glissable(c, {
      actif: () => !fige && !!c._puce, texte: () => c.textContent,
      cibles: () => [...cibles, banque],
      deposer: (t) => {
        const p = c._puce; if (!p) return;
        if (t === banque) vider(c);
        else { const autre = t._puce; vider(c); if (autre) { vider(t); poser(c, autre); } poser(t, p); }
        choisie = null; signaler();
      },
    });
  });
  const figer = () => { fige = true; puces.forEach((p) => (p.disabled = true)); banque.classList.add('fige'); signaler(); };
  signaler();
  return {
    banque, figer,
    valeurs: () => cibles.map((c) => c.textContent),
    reveler: (liste) => {
      cibles.forEach(vider);
      liste.forEach((m, k) => { const p = puces.find((x) => x.dataset.m === m && !x.classList.contains('pris')); if (p) poser(cibles[k], p); else cibles[k].textContent = m; cibles[k].classList.add('revele'); });
      figer();
    },
  };
}

/* ---------- rendu d'une question ----------
   Retourne { el, manque() -> '' ou ce qui manque, verifier() -> {ok, bonne:html, note?, partiel?} | null si incomplet,
   reveler() -> {bonne} (montre la réponse dans l'exercice et le fige) }. `maj` : à appeler quand la réponse change. */
function rendre(q, maj) {
  const el = h('div');
  const T = {
    qcm() {
      const ordre = melange(q.choix.map((c, i) => i));
      const box = h('div', 'choix'); let sel = -1;
      const bts = ordre.map((i) => {
        const b = h('button', '', q.choix[i]); b.type = 'button'; b.setAttribute('aria-pressed', 'false');
        b.addEventListener('click', () => { if (box.classList.contains('fige')) return; sel = i; bts.forEach((x) => { x.classList.remove('sel'); x.setAttribute('aria-pressed', 'false'); }); b.classList.add('sel'); b.setAttribute('aria-pressed', 'true'); maj(); });
        box.appendChild(b); return b;
      });
      el.appendChild(box);
      return {
        manque: () => (sel < 0 ? 'Choisis une réponse.' : ''),
        verifier: () => { if (sel < 0) return null; box.classList.add('fige'); bts.forEach((b, k) => { if (ordre[k] === q.bonne) b.classList.add('juste'); else if (ordre[k] === sel) b.classList.add('faux'); }); return { ok: sel === q.bonne, bonne: q.choix[q.bonne] }; },
        reveler: () => { box.classList.add('fige'); bts[ordre.indexOf(q.bonne)].classList.add('revele'); return { bonne: q.choix[q.bonne] }; },
      };
    },
    vf() {
      const box = h('div', 'vf'); let sel = null;
      const bts = [true, false].map((v) => {
        const b = h('button', '', v ? 'Vrai' : 'Faux'); b.type = 'button'; b.setAttribute('aria-pressed', 'false');
        b.addEventListener('click', () => { if (box.classList.contains('fige')) return; sel = v; bts.forEach((x) => { x.classList.remove('sel'); x.setAttribute('aria-pressed', 'false'); }); b.classList.add('sel'); b.setAttribute('aria-pressed', 'true'); maj(); });
        box.appendChild(b); return b;
      });
      el.appendChild(box);
      return {
        manque: () => (sel === null ? 'Choisis Vrai ou Faux.' : ''),
        verifier: () => { if (sel === null) return null; box.classList.add('fige'); bts[q.vrai ? 0 : 1].classList.add('juste'); if (sel !== q.vrai) bts[sel ? 0 : 1].classList.add('faux'); return { ok: sel === q.vrai, bonne: q.vrai ? 'Vrai' : 'Faux' }; },
        reveler: () => { box.classList.add('fige'); bts[q.vrai ? 0 : 1].classList.add('revele'); return { bonne: q.vrai ? 'Vrai' : 'Faux' }; },
      };
    },
    trous() {
      const p = h('p', 'texte-trous'); const attendus = [], champs = [];
      q.texte.split(/\{([^}]+)\}/g).forEach((part, i) => {
        if (i % 2 === 0) { p.appendChild(document.createTextNode(part)); return; }
        const alts = part.split('|'); attendus.push(alts);
        if (q.banque) { const c = h('span', 'cible'); p.appendChild(c); champs.push(c); }
        else { const inp = h('input', 'trou'); inp.type = 'text'; inp.autocomplete = 'off'; inp.autocapitalize = 'off'; inp.spellcheck = false; inp.enterKeyHint = 'next'; inp.setAttribute('aria-label', 'mot manquant ' + (champs.length + 1)); p.appendChild(inp); champs.push(inp); }
      });
      if (!q.banque && champs.length) champs[champs.length - 1].enterKeyHint = 'done';
      let cb = null;
      if (q.banque) { cb = casesEtBanque(champs, attendus.map((a) => a[0]).concat(q.leurres || []), maj); el.append(h('p', 'aide', AIDE_BANQUE), p, cb.banque); }
      else el.appendChild(p);
      const valeurs = () => (q.banque ? cb.valeurs() : champs.map((c) => c.value));
      const bonne = q.texte.replace(/\{([^}]+)\}/g, (_, a) => `<mark>${a.split('|')[0]}</mark>`);
      return {
        manque: () => { const n = valeurs().filter((v) => !String(v).trim()).length; return !n ? '' : n === 1 ? 'Il reste une case vide.' : `Il reste ${n} cases vides.`; },
        verifier: () => {
          const vals = valeurs();
          if (vals.some((v) => !String(v).trim())) return null;
          let ok = true, presque = false, justes = 0;
          vals.forEach((v, i) => { const r = compare(v, attendus[i]); champs[i].classList.add(r === 'non' ? 'faux' : 'juste'); if (r === 'non') ok = false; else justes++; if (r === 'presque') presque = true; if (!q.banque) champs[i].readOnly = true; });
          if (cb) cb.figer();
          return { ok, bonne, partiel: [justes, vals.length, vals.length > 1 ? 'justes' : 'juste'], note: presque ? `Attention à l'orthographe : ${bonne}` : '' };
        },
        reveler: () => { if (cb) cb.reveler(attendus.map((a) => a[0])); else champs.forEach((c, k) => { c.value = attendus[k][0]; c.readOnly = true; c.classList.add('revele'); }); return { bonne }; },
      };
    },
    ecrire() {
      const inp = h('input'); inp.type = 'text'; inp.autocomplete = 'off'; inp.autocapitalize = 'off'; inp.spellcheck = false; inp.enterKeyHint = 'done'; inp.placeholder = 'Ta réponse…'; inp.setAttribute('aria-label', 'ta réponse'); inp.style.width = '100%';
      el.appendChild(inp);
      return {
        manque: () => (inp.value.trim() ? '' : 'Écris ta réponse.'),
        verifier: () => { if (!inp.value.trim()) return null; const r = compare(inp.value, q.reponses); inp.readOnly = true; inp.classList.add(r === 'non' ? 'faux' : 'juste'); return { ok: r !== 'non', bonne: q.reponses[0], note: r === 'presque' ? 'Presque : vérifie l\'orthographe → « ' + q.reponses[0] + ' ».' : '' }; },
        reveler: () => { inp.value = q.reponses[0]; inp.readOnly = true; inp.classList.add('revele'); return { bonne: q.reponses[0] }; },
      };
    },
    calcul() {
      const box = h('div', 'calc'); const inp = h('input'); inp.type = 'text'; inp.inputMode = 'decimal'; inp.enterKeyHint = 'done'; inp.placeholder = '?'; inp.autocomplete = 'off'; inp.setAttribute('aria-label', 'ta réponse' + (q.unite ? ' en ' + q.unite : ''));
      box.append(inp, h('b', '', q.unite || '')); el.appendChild(box);
      const lire = () => parseFloat(inp.value.replace(',', '.').replace(/[^0-9.\-]/g, ''));
      const bonne = String(q.reponse).replace('.', ',') + ' ' + (q.unite || '');
      return {
        manque: () => (!inp.value.trim() ? 'Écris un nombre.' : isNaN(lire()) ? 'Écris un nombre, par exemple 12,5.' : ''),
        verifier: () => { const v = lire(); if (isNaN(v)) return null; const ok = Math.abs(v - q.reponse) <= (q.tolerance ?? 0.011); inp.readOnly = true; inp.classList.add(ok ? 'juste' : 'faux'); return { ok, bonne }; },
        reveler: () => { inp.value = String(q.reponse).replace('.', ','); inp.readOnly = true; inp.classList.add('revele'); return { bonne }; },
      };
    },
    classer() {
      const banque = h('div', 'banque'); banque.style.borderTop = '0'; banque.style.paddingTop = '0'; banque.style.marginTop = '0';
      const bacs = h('div', 'bacs'); let sel = null;
      const fige = () => el.classList.contains('fige');
      const choisir = (p) => { if (sel) sel.classList.remove('sel'); sel = p; if (p) p.classList.add('sel'); el.classList.toggle('attend', !!p); el.classList.toggle('attend-retour', !!(p && p._bac >= 0)); };
      const ranger = (p, k) => { (k < 0 ? banque : bx[k]).appendChild(p); p._bac = k; choisir(null); maj(); };
      const puces = melange(q.items).map((it) => {
        const p = h('button', 'puce', it.t); p.type = 'button'; p._it = it; p._bac = -1; banque.appendChild(p);
        p.addEventListener('click', (e) => {
          e.stopPropagation(); if (fige()) return;
          // un mot est choisi et on touche un mot déjà posé dans un AUTRE bac : on vise ce bac, pas ce mot
          if (sel && sel !== p && p._bac >= 0 && p._bac !== sel._bac) { ranger(sel, p._bac); return; }
          choisir(sel === p ? null : p);
        });
        p.addEventListener('keydown', (e) => { if ((e.key === 'Delete' || e.key === 'Backspace') && p._bac >= 0 && !fige()) { e.preventDefault(); ranger(p, -1); p.focus(); } else if (e.key === 'Escape' && sel === p) choisir(null); });
        glissable(p, {
          cibles: () => (p._bac >= 0 ? [...bx.filter((_, k) => k !== p._bac), banque] : bx),
          deposer: (t) => { const k = t === banque ? -1 : bx.indexOf(t); if (k !== p._bac) ranger(p, k); },
          debut: () => choisir(null),
        });
        return p;
      });
      const bx = q.categories.map((c, i) => {
        const b = h('div', 'bac'); const t = h('button', 'bac-t', `<b>${c}</b>`); t.type = 'button'; t.setAttribute('aria-label', `Ranger le mot choisi dans « ${texteDe(c)} »`);
        b.appendChild(t);
        b.addEventListener('click', () => { if (fige() || !sel) return; ranger(sel, i); });
        bacs.appendChild(b); return b;
      });
      banque.addEventListener('click', () => { if (sel && sel._bac >= 0 && !fige()) ranger(sel, -1); });
      el.append(h('p', 'aide', 'Touche un mot, puis la case où il va. Tu peux aussi le glisser.'), banque, bacs);
      const bonne = q.categories.map((c, i) => `<b>${c}</b> : ${q.items.filter((it) => it.c === i).map((it) => it.t).join(', ')}`).join('<br>');
      return {
        manque: () => { const n = puces.filter((p) => p._bac < 0).length; return !n ? '' : n === 1 ? 'Il reste un mot à ranger.' : `Il reste ${n} mots à ranger.`; },
        verifier: () => { if (puces.some((p) => p._bac < 0)) return null; choisir(null); el.classList.add('fige'); let ok = true, justes = 0; puces.forEach((p) => { const j = p._bac === p._it.c; p.classList.add(j ? 'juste' : 'faux'); if (j) justes++; else ok = false; }); return { ok, bonne, partiel: [justes, puces.length, 'bien rangés'] }; },
        reveler: () => { puces.forEach((p) => { ranger(p, p._it.c); p.classList.add('revele'); }); el.classList.add('fige'); return { bonne }; },
      };
    },
    relier() {
      const box = h('div', 'paires'); const G = q.paires.map((p, i) => ({ t: p[0], i })), D = melange(q.paires.map((p, i) => ({ t: p[1], i })));
      let selG = null, selD = null; const liens = new Map(); // bouton gauche -> bouton droit
      const bg = [], bd = [];
      const numeroter = () => { [...bg, ...bd].forEach((b) => { b.classList.remove('lie'); const n = b.querySelector('.n'); if (n) n.remove(); }); let k = 1; liens.forEach((d, g) => { [g, d].forEach((b) => { b.classList.add('lie'); b.insertAdjacentHTML('afterbegin', `<span class="n">${k}</span>`); }); k++; }); maj(); };
      const choisir = (a, b) => { [...bg, ...bd].forEach((x) => x.classList.remove('sel')); selG = a; selD = b; if (a) a.classList.add('sel'); if (b) b.classList.add('sel'); };
      const delier = (b) => liens.forEach((d, g) => { if (d === b) liens.delete(g); });
      const lier = (a, b) => { liens.delete(a); delier(b); liens.set(a, b); choisir(null, null); numeroter(); };
      G.forEach((g, k) => {
        const a = h('button', '', g.t); a.type = 'button'; a._i = g.i; a._t = g.t; bg.push(a);
        const b = h('button', '', D[k].t); b.type = 'button'; b._i = D[k].i; b._t = D[k].t; bd.push(b);
        box.append(a, b);
      });
      const fige = () => box.classList.contains('fige');
      bg.forEach((a) => {
        a.addEventListener('click', () => { if (fige()) return; if (selD) { lier(a, selD); return; } if (selG === a) { choisir(null, null); return; } if (liens.has(a)) { liens.delete(a); numeroter(); } choisir(a, null); });
        glissable(a, { horizontal: true, texte: () => a._t, cibles: () => bd, deposer: (t) => lier(a, t), debut: () => choisir(null, null) });
      });
      bd.forEach((b) => {
        b.addEventListener('click', () => { if (fige()) return; if (selG) { lier(selG, b); return; } if (selD === b) { choisir(null, null); return; } if ([...liens.values()].includes(b)) { delier(b); numeroter(); } choisir(null, b); });
        glissable(b, { horizontal: true, texte: () => b._t, cibles: () => bg, deposer: (t) => lier(t, b), debut: () => choisir(null, null) });
      });
      el.append(h('p', 'aide', 'Touche un élément à gauche, puis celui qui va avec à droite. Tu peux aussi glisser de l\'un à l\'autre.'), box);
      const bonne = q.paires.map((p) => `${p[0]} → <b>${p[1]}</b>`).join('<br>');
      return {
        manque: () => { const n = G.length - liens.size; return !n ? '' : n === 1 ? 'Il reste une paire à relier.' : `Il reste ${n} paires à relier.`; },
        verifier: () => { if (liens.size < G.length) return null; choisir(null, null); box.classList.add('fige'); let ok = true, justes = 0; liens.forEach((d, g) => { const j = d._i === g._i || q.paires[d._i][1] === q.paires[g._i][1]; [g, d].forEach((x) => x.classList.add(j ? 'juste' : 'faux')); if (j) justes++; else ok = false; }); return { ok, bonne, partiel: [justes, G.length, 'bien reliés'] }; },
        reveler: () => { liens.clear(); choisir(null, null); bg.forEach((a) => liens.set(a, bd.find((d) => d._i === a._i))); numeroter(); box.classList.add('fige'); [...bg, ...bd].forEach((x) => x.classList.add('revele')); return { bonne }; },
      };
    },
    ordre() {
      const box = h('div', 'ordre'); let cur = melange(q.etapes.map((t, i) => i));
      if (cur.every((v, i) => v === i)) cur.reverse();
      let fini = false;
      const marque = (k) => { [...box.children].forEach((l, j) => { l.classList.toggle('insere-avant', j === k); l.classList.toggle('insere-apres', k === box.children.length && j === k - 1); }); };
      const deplacer = (de, vers, bouton) => {
        if (fini || vers < 0 || vers >= cur.length || de === vers) return;
        const [x] = cur.splice(de, 1); cur.splice(vers, 0, x);
        dessine({ pos: vers, bouton }); maj();
      };
      const dessine = (f) => {
        box.innerHTML = '';
        cur.forEach((idx, pos) => {
          const l = h('div', 'ligne'); const txt = q.etapes[idx];
          const poi = h('span', 'poignee', '⠿'); poi.setAttribute('aria-hidden', 'true');
          const up = h('button', '', '↑'), dn = h('button', '', '↓'); up.type = dn.type = 'button';
          up.setAttribute('aria-label', 'monter : ' + texteDe(txt)); dn.setAttribute('aria-label', 'descendre : ' + texteDe(txt));
          up.disabled = fini || pos === 0; dn.disabled = fini || pos === cur.length - 1;
          up.onclick = () => deplacer(pos, pos - 1, 0); dn.onclick = () => deplacer(pos, pos + 1, 1);
          l.append(poi, h('span', 'etape', txt), up, dn); l._idx = idx; box.appendChild(l);
          glissable(l, {
            poignee: '.poignee', exclure: 'button', large: true, texte: () => texteDe(txt), actif: () => !fini,
            survol: (x, y) => {
              const r = box.getBoundingClientRect();
              if (x < r.left - 80 || x > r.right + 80 || y < r.top - 70 || y > r.bottom + 70) { marque(-1); return null; }
              const ls = [...box.children]; let k = ls.length;
              for (let j = 0; j < ls.length; j++) { const rr = ls[j].getBoundingClientRect(); if (y < rr.top + rr.height / 2) { k = j; break; } }
              const utile = k !== pos && k !== pos + 1; // déposer juste avant ou juste après soi : rien ne change
              marque(utile ? k : -1);
              return utile ? k : null;
            },
            quitter: () => marque(-1),
            deposer: (k) => deplacer(pos, k > pos ? k - 1 : k),
          });
        });
        if (f) { // la ligne déplacée clignote ; le focus clavier la suit
          const l = box.children[f.pos]; l.classList.add('bouge');
          if (f.bouton !== undefined) { const bs = l.querySelectorAll('button'); (bs[f.bouton].disabled ? bs[1 - f.bouton] : bs[f.bouton]).focus({ preventScroll: true }); }
        }
      };
      dessine(); el.append(h('p', 'aide', 'Utilise ↑ et ↓, ou attrape une étape par ses points ⠿ pour la glisser.'), box);
      const bonne = '<ol style="margin:4px 0 0;padding-left:1.2em">' + q.etapes.map((e) => `<li>${e}</li>`).join('') + '</ol>';
      return {
        manque: () => '',
        verifier: () => { fini = true; const ok = cur.every((v, i) => v === i); let justes = 0; [...box.children].forEach((l, i) => { l.querySelectorAll('button').forEach((b) => (b.disabled = true)); l.style.borderColor = l._idx === i ? 'var(--ok)' : 'var(--ko)'; if (l._idx === i) justes++; }); return { ok, bonne, partiel: [justes, cur.length, 'à la bonne place'] }; },
        reveler: () => { fini = true; cur = q.etapes.map((t, i) => i); dessine(); [...box.children].forEach((l) => l.classList.add('revele')); return { bonne }; },
      };
    },
    legende() {
      const s = SCHEMAS[q.schema]; el.insertAdjacentHTML('beforeend', schemaSVG(q.schema));
      const liste = h('div', 'legende-liste'); const cibles = s.labels.map((_, i) => { const l = h('div', 'l', `<i>${i + 1}</i>`); const c = h('span', 'cible'); l.appendChild(c); liste.appendChild(l); return c; });
      const cb = casesEtBanque(cibles, s.labels.concat(q.leurres || []), maj);
      el.append(h('p', 'aide', AIDE_BANQUE), liste, cb.banque);
      const bonne = s.labels.map((l, i) => `${i + 1}. ${l}`).join(' · ');
      return {
        manque: () => { const n = cb.valeurs().filter((x) => !x).length; return !n ? '' : n === 1 ? 'Il reste une case vide.' : `Il reste ${n} cases vides.`; },
        verifier: () => { const v = cb.valeurs(); if (v.some((x) => !x)) return null; cb.figer(); let ok = true, justes = 0; v.forEach((x, i) => { const j = x === s.labels[i]; cibles[i].classList.add(j ? 'juste' : 'faux'); if (j) justes++; else ok = false; }); return { ok, bonne, partiel: [justes, v.length, 'justes'] }; },
        reveler: () => { cb.reveler(s.labels); return { bonne }; },
      };
    },
  };
  const api = (T[q.type] || T.qcm)();
  api.el = el;
  return api;
}

/** Le verdict sous la question. mode : 'ok' | 'ko' | 'vu' (« Voir la réponse »). */
function contenuRetour(mode, r, q, k) {
  let titre;
  if (mode === 'ok') titre = BRAVO[k % BRAVO.length];
  else if (mode === 'vu') titre = 'Voici la réponse';
  else if (r.partiel && r.partiel[0] > 0) titre = (r.partiel[1] >= 3 && r.partiel[0] === r.partiel[1] - 1 ? 'Presque ! ' : 'Pas tout à fait : ') + `${r.partiel[0]} sur ${r.partiel[1]} ${r.partiel[2]}.`;
  else titre = 'Pas tout à fait.';
  return `<b class="v">${titre}</b>` +
    (mode === 'ok' ? '' : `<span class="bonne">${mode === 'vu' ? '' : '<span class="lib">Bonne réponse :</span> '}${r.bonne}</span>`) +
    (r.note ? `<i class="note">${r.note}</i>` : '') +
    (q.expl ? `<span class="expl">${q.expl}</span>` : '') +
    (mode === 'vu' ? '<small class="revoir-note">Elle s\'ajoute à tes questions à revoir.</small>' : '');
}

/**
 * Lance une série d'exercices dans `root`.
 * opts : { onReponse(q, ok), onFin({bonnes, total, ratees, passees, actions}) }
 * - ratees : questions ratées ou dont la réponse a été vue ; passees : questions passées (rien d'enregistré).
 */
export function lancerQuiz(root, questions, opts = {}) {
  let i = 0, bonnes = 0; const ratees = [], passees = [], vues = new Set();
  root.innerHTML = '';
  const box = h('div', 'quiz'); root.appendChild(box);
  // annonce discrète du verdict pour les lecteurs d'écran
  const annonce = h('div', 'q-annonce'); annonce.setAttribute('aria-live', 'polite');
  Object.assign(annonce.style, { position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clipPath: 'inset(50%)', whiteSpace: 'nowrap' });
  const scene = h('div'); box.append(annonce, scene);

  function fin() {
    if (barreActive) barreActive.arreter();
    marquer(box, false);
    const total = questions.length, faites = total - passees.length, pct = Math.round((bonnes / total) * 100), pctFaites = faites ? Math.round((bonnes / faites) * 100) : 0;
    let msg = !faites ? 'Aucune réponse cette fois. Reprends quand tu veux.'
      : pctFaites === 100 ? (passees.length ? 'Sans faute sur tes réponses. Bravo !' : 'Sans faute. Bravo !')
        : pctFaites >= 80 ? 'Très solide. Encore un petit tour sur tes erreurs et c\'est bon.'
          : pctFaites >= 50 ? 'C\'est en route. Refais tes erreurs : c\'est là que tu gagnes des points.'
            : 'Pas grave : relis « Comprendre », refais l\'expérience, puis reviens.';
    if (passees.length && faites) msg += passees.length === 1 ? ' Il te reste une question passée.' : ` Il te reste ${passees.length} questions passées.`;
    const intitule = (q) => q.q || (q.texte ? q.texte.replace(/\{([^}]+)\}/g, '…') : 'Schéma');
    scene.innerHTML = `<div class="q fin"><div class="score" tabindex="-1">${bonnes}/${total}${passees.length ? `<small> · ${passees.length} passée${passees.length > 1 ? 's' : ''}</small>` : ''}</div><p>${msg}</p>
      ${ratees.length ? `<div class="revoir"><b>À revoir :</b><ul>${ratees.map((q) => `<li>${intitule(q)}${vues.has(q) ? ' <small>(réponse vue)</small>' : ''}</li>`).join('')}</ul></div>` : ''}
      <div class="q-actions" style="justify-content:center"></div></div>`;
    const act = scene.querySelector('.q-actions');
    const bouton = (txt, cls, f) => { const b = h('button', 'btn ' + cls, txt); b.type = 'button'; b.onclick = f; act.appendChild(b); };
    if (ratees.length) bouton('Refaire mes erreurs', 'chaud', () => lancerQuiz(root, ratees.slice(), opts));
    if (passees.length) bouton(passees.length === 1 ? 'Faire la question passée' : `Faire les ${passees.length} passées`, ratees.length ? 'ghost' : 'chaud', () => lancerQuiz(root, passees.slice(), opts));
    bouton('Recommencer', 'ghost', () => lancerQuiz(root, melange(questions), opts));
    if (opts.onFin) opts.onFin({ bonnes, total, ratees, passees, actions: act });
    if (pct >= 80) confettis();
    scene.querySelector('.score').focus({ preventScroll: true });
    voirHaut(box);
  }

  function montre(nav) {
    if (i >= questions.length) return fin();
    const q = questions[i]; let repondu = false, api = null;
    scene.innerHTML = '';
    marquer(box, true);
    const tete = h('div', 'quiz-tete', `<span>${i + 1} / ${questions.length}</span><div class="jauge"><i style="width:${(i / questions.length) * 100}%"></i></div><span>${bonnes} ✓</span>`);
    const bStop = h('button', 'q-stop', 'Arrêter'); bStop.type = 'button'; bStop.title = 'Arrêter la série et voir ton score';
    tete.appendChild(bStop);
    const carte = h('div', 'q'); carte._q = q; // (pour les tests de bout en bout)
    carte.appendChild(h('div', 'type', `${NOMS[q.type] || ''}${q.prio ? ' <span class="etoile">essentiel</span>' : ''}${q.chap ? ` <span>· ${q.chap}</span>` : ''}`));
    const titre = q.q ? h('h3', '', q.q) : null;
    if (titre) carte.appendChild(titre);
    const bv = h('button', 'btn', 'Vérifier'); bv.type = 'button';
    const manque = h('span', 'q-manque'); manque.setAttribute('aria-live', 'polite');
    const maj = () => {
      if (!api || repondu) return;
      const m = api.manque();
      bv.classList.toggle('pas-pret', !!m); bv.setAttribute('aria-disabled', m ? 'true' : 'false');
      if (!m) manque.textContent = '';
      api.el.querySelectorAll('.a-completer').forEach((x) => { if ((x.tagName === 'INPUT' ? x.value : x.textContent).trim()) x.classList.remove('a-completer'); });
    };
    api = rendre(q, maj);
    const el = api.el;
    carte.appendChild(el);
    // barre d'actions : Vérifier (1er bouton .btn, c'est lui que le test clique), puis les deux actions discrètes
    const actions = h('div', 'q-actions barre');
    const sec = h('div', 'q-sec');
    const bVoir = h('button', 'q-lien', 'Voir la réponse'); bVoir.type = 'button';
    const bPasser = h('button', 'q-lien', 'Passer'); bPasser.type = 'button'; bPasser.title = 'Question suivante, sans rien compter';
    sec.append(bVoir, bPasser);
    actions.append(manque, bv, sec);
    const place = h('div', 'q-actions-place'); place.appendChild(actions);
    carte.appendChild(place);
    scene.append(tete, carte);
    maj();
    carte.addEventListener('input', maj); carte.addEventListener('click', maj);

    const suivante = () => { i++; montre(true); };
    const repondre = (mode, r) => {
      repondu = true;
      el.classList.add('fige'); carte.classList.add('repondue');
      const ret = h('div', 'retour ' + mode); ret.innerHTML = contenuRetour(mode, r, q, i);
      place.before(ret);
      sec.remove(); manque.textContent = '';
      bv.classList.remove('pas-pret'); bv.removeAttribute('aria-disabled'); bv.classList.add('suivant');
      bv.textContent = i === questions.length - 1 ? 'Voir mon score →' : 'Question suivante →';
      annonce.textContent = ret.querySelector('.v').textContent + (mode === 'ok' ? '' : ' Réponse : ' + texteDe(r.bonne));
      bv.focus({ preventScroll: true });
      voirRetour(ret, carte);
    };
    const signalerManque = (m) => {
      manque.textContent = m || 'Il manque une réponse.';
      manque.classList.remove('secoue'); void manque.offsetWidth; manque.classList.add('secoue');
      const vides = [...el.querySelectorAll('input:not([readonly]), .cible')].filter((x) => !(x.tagName === 'INPUT' ? x.value : x.textContent).trim());
      vides.forEach((x) => x.classList.add('a-completer'));
      if (vides[0] && vides[0].tagName === 'INPUT' && !auDoigt()) vides[0].focus();
    };

    bv.addEventListener('click', (e) => {
      if (e.detail > 1) return; // double clic : le 2e clic ne doit pas sauter l'explication
      if (repondu) { suivante(); return; }
      const m = api.manque(), r = m ? null : api.verifier();
      if (!r) { signalerManque(m); return; }
      if (r.ok) bonnes++; else ratees.push(q);
      if (opts.onReponse) opts.onReponse(q, r.ok);
      repondre(r.ok ? 'ok' : 'ko', r);
    });
    bVoir.addEventListener('click', () => {
      if (repondu) return;
      const r = api.reveler();
      ratees.push(q); vues.add(q);
      if (opts.onReponse) opts.onReponse(q, false);
      repondre('vu', r);
    });
    bPasser.addEventListener('click', () => { if (repondu) return; passees.push(q); suivante(); });
    bStop.addEventListener('click', () => { for (let k = repondu ? i + 1 : i; k < questions.length; k++) passees.push(questions[k]); fin(); });

    // Entrée dans un champ : passe au champ vide suivant, sinon vérifie (ou continue)
    carte.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' || e.target.tagName !== 'INPUT') return;
      e.preventDefault();
      if (!repondu && e.target.value.trim()) {
        const champs = [...carte.querySelectorAll('input:not([readonly])')], k = champs.indexOf(e.target);
        const vide = champs.slice(k + 1).concat(champs.slice(0, k)).find((x) => !x.value.trim());
        if (vide) { vide.focus(); return; }
      }
      bv.click();
    });

    barreCollante(carte, place, actions);
    const premier = carte.querySelector('input');
    if (premier && !auDoigt() && window.matchMedia('(min-width: 861px)').matches) premier.focus({ preventScroll: true });
    else { const f = titre || carte; f.tabIndex = -1; f.focus({ preventScroll: true }); }
    if (nav) voirHaut(box);
  }
  montre(false);
}

function confettis() {
  if (reduit()) return;
  const c = document.createElement('canvas'); c.className = 'confetti'; document.body.appendChild(c);
  const x = c.getContext('2d'); c.width = innerWidth; c.height = innerHeight;
  const cols = ['#ff5a36', '#2f7bff', '#ffe45c', '#0fa98f', '#7a56f0'];
  const P = Array.from({ length: 110 }, () => ({ x: Math.random() * c.width, y: -20 - Math.random() * c.height * 0.5, vx: (Math.random() - 0.5) * 3, vy: 2 + Math.random() * 4, s: 5 + Math.random() * 6, r: Math.random() * 6, c: cols[(Math.random() * cols.length) | 0] }));
  let t = 0; (function f() { x.clearRect(0, 0, c.width, c.height); P.forEach((p) => { p.x += p.vx; p.y += p.vy; p.r += 0.1; x.save(); x.translate(p.x, p.y); x.rotate(p.r); x.fillStyle = p.c; x.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6); x.restore(); }); if (++t < 170) requestAnimationFrame(f); else c.remove(); })();
}
