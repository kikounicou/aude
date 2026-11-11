// Moteur d'exercices : QCM, vrai/faux, texte à trous (à écrire ou avec banque de mots), réponse à écrire,
// classer, relier, remettre dans l'ordre, calcul, schéma à légender. Chaque réponse donne une explication.
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

/* ---------- composant « cases à remplir + banque de mots » (trous avec banque, légendes) ---------- */
function casesEtBanque(cibles, mots) {
  // Un seul geste : toucher un mot le pose dans la première case libre ; toucher une case remplie la vide.
  const banque = h('div', 'banque');
  const puces = melange(mots).map((m) => { const p = h('button', 'puce', m); p.type = 'button'; p.dataset.m = m; banque.appendChild(p); return p; });
  let fige = false;
  const vider = (c) => { if (c._puce) { c._puce.classList.remove('pris'); c._puce = null; } c.textContent = ''; c.classList.remove('pleine'); };
  const poser = (c, p) => { c._puce = p; c.textContent = p.dataset.m; c.classList.add('pleine'); p.classList.add('pris'); };
  puces.forEach((p) => p.addEventListener('click', () => { if (fige) return; const libre = cibles.find((c) => !c._puce); if (libre) poser(libre, p); }));
  cibles.forEach((c) => { c.tabIndex = 0; c.setAttribute('role', 'button'); c.addEventListener('click', () => { if (!fige && c._puce) vider(c); }); });
  return { banque, valeurs: () => cibles.map((c) => c.textContent), figer: () => { fige = true; puces.forEach((p) => (p.disabled = true)); } };
}

/* ---------- rendu d'une question : retourne { el, verifier() -> {ok, bonne:html, note?} | null si incomplet } ---------- */
function rendre(q) {
  const el = h('div');
  const T = {
    qcm() {
      const ordre = melange(q.choix.map((c, i) => i));
      const box = h('div', 'choix'); let sel = -1;
      const bts = ordre.map((i) => { const b = h('button', '', q.choix[i]); b.type = 'button'; b.addEventListener('click', () => { if (box.classList.contains('fige')) return; sel = i; bts.forEach((x) => x.classList.remove('sel')); b.classList.add('sel'); }); box.appendChild(b); return b; });
      el.appendChild(box);
      return () => { if (sel < 0) return null; box.classList.add('fige'); bts.forEach((b, k) => { if (ordre[k] === q.bonne) b.classList.add('juste'); else if (ordre[k] === sel) b.classList.add('faux'); }); return { ok: sel === q.bonne, bonne: q.choix[q.bonne] }; };
    },
    vf() {
      const box = h('div', 'vf'); let sel = null;
      const bts = [true, false].map((v) => { const b = h('button', '', v ? 'Vrai' : 'Faux'); b.type = 'button'; b.addEventListener('click', () => { if (box.classList.contains('fige')) return; sel = v; bts.forEach((x) => x.classList.remove('sel')); b.classList.add('sel'); }); box.appendChild(b); return b; });
      el.appendChild(box);
      return () => { if (sel === null) return null; box.classList.add('fige'); bts[q.vrai ? 0 : 1].classList.add('juste'); if (sel !== q.vrai) bts[sel ? 0 : 1].classList.add('faux'); return { ok: sel === q.vrai, bonne: q.vrai ? 'Vrai' : 'Faux' }; };
    },
    trous() {
      const p = h('p', 'texte-trous'); const attendus = [];
      const parts = q.texte.split(/\{([^}]+)\}/g);
      const champs = [];
      parts.forEach((part, i) => {
        if (i % 2 === 0) { p.appendChild(document.createTextNode(part)); return; }
        const alts = part.split('|'); attendus.push(alts);
        if (q.banque) { const c = h('span', 'cible'); p.appendChild(c); champs.push(c); }
        else { const inp = h('input', 'trou'); inp.type = 'text'; inp.autocomplete = 'off'; inp.autocapitalize = 'off'; inp.spellcheck = false; inp.setAttribute('aria-label', 'mot manquant ' + (champs.length + 1)); p.appendChild(inp); champs.push(inp); }
      });
      el.appendChild(p);
      let cb = null;
      if (q.banque) { cb = casesEtBanque(champs, attendus.map((a) => a[0]).concat(q.leurres || [])); el.append(cb.banque, h('p', 'aide', "Touche les mots dans l'ordre du texte. Touche une case pour la vider.")); }
      return () => {
        const vals = q.banque ? cb.valeurs() : champs.map((c) => c.value);
        if (vals.some((v) => !String(v).trim())) return null;
        let ok = true, presque = false;
        vals.forEach((v, i) => { const r = compare(v, attendus[i]); champs[i].classList.add(r === 'non' ? 'faux' : 'juste'); if (r === 'non') ok = false; if (r === 'presque') presque = true; if (!q.banque) champs[i].readOnly = true; });
        if (cb) cb.figer();
        const bonne = q.texte.replace(/\{([^}]+)\}/g, (_, a) => `<mark>${a.split('|')[0]}</mark>`);
        return { ok, bonne, note: presque ? 'Attention à l\'orthographe des mots surlignés.' : '' };
      };
    },
    ecrire() {
      const inp = h('input'); inp.type = 'text'; inp.autocomplete = 'off'; inp.autocapitalize = 'off'; inp.spellcheck = false; inp.placeholder = 'Ta réponse…'; inp.style.width = '100%';
      el.appendChild(inp);
      return () => { if (!inp.value.trim()) return null; const r = compare(inp.value, q.reponses); inp.readOnly = true; inp.classList.add(r === 'non' ? 'faux' : 'juste'); return { ok: r !== 'non', bonne: q.reponses[0], note: r === 'presque' ? 'Presque : vérifie l\'orthographe → « ' + q.reponses[0] + ' ».' : '' }; };
    },
    calcul() {
      const box = h('div', 'calc'); const inp = h('input'); inp.type = 'text'; inp.inputMode = 'decimal'; inp.placeholder = '?'; inp.autocomplete = 'off';
      box.append(inp, h('b', '', q.unite || '')); el.appendChild(box);
      return () => { const v = parseFloat(inp.value.replace(',', '.').replace(/[^0-9.\-]/g, '')); if (isNaN(v)) return null; const ok = Math.abs(v - q.reponse) <= (q.tolerance ?? 0.011); inp.readOnly = true; inp.classList.add(ok ? 'juste' : 'faux'); return { ok, bonne: String(q.reponse).replace('.', ',') + ' ' + (q.unite || '') }; };
    },
    classer() {
      const banque = h('div', 'banque'); banque.style.borderTop = '0'; banque.style.paddingTop = '0'; banque.style.marginTop = '0';
      const bacs = h('div', 'bacs'); let sel = null;
      const puces = melange(q.items).map((it) => { const p = h('button', 'puce', it.t); p.type = 'button'; p._it = it; p._bac = -1; banque.appendChild(p); p.addEventListener('click', (e) => { e.stopPropagation(); if (el.classList.contains('fige')) return; if (sel === p) { p.classList.remove('sel'); sel = null; return; } if (sel) sel.classList.remove('sel'); sel = p; p.classList.add('sel'); }); return p; });
      const bx = q.categories.map((c, i) => { const b = h('div', 'bac', `<b>${c}</b>`); b.addEventListener('click', () => { if (el.classList.contains('fige') || !sel) return; b.appendChild(sel); sel._bac = i; sel.classList.remove('sel'); sel = null; }); bacs.appendChild(b); return b; });
      banque.addEventListener('click', () => { if (sel && sel._bac >= 0 && !el.classList.contains('fige')) { banque.appendChild(sel); sel._bac = -1; sel.classList.remove('sel'); sel = null; } });
      el.append(h('p', 'aide', 'Touche un mot, puis la case où il va.'), banque, bacs);
      return () => { if (puces.some((p) => p._bac < 0)) return null; el.classList.add('fige'); let ok = true; puces.forEach((p) => { const j = p._bac === p._it.c; p.classList.add(j ? 'juste' : 'faux'); if (!j) ok = false; }); return { ok, bonne: q.categories.map((c, i) => `<b>${c}</b> : ${q.items.filter((it) => it.c === i).map((it) => it.t).join(', ')}`).join('<br>') }; };
    },
    relier() {
      const box = h('div', 'paires'); const G = q.paires.map((p, i) => ({ t: p[0], i })), D = melange(q.paires.map((p, i) => ({ t: p[1], i })));
      let selG = null; const liens = new Map(); // bouton gauche -> bouton droit
      const maj = () => { [...bg, ...bd].forEach((b) => { b.classList.remove('lie'); const n = b.querySelector('.n'); if (n) n.remove(); }); let k = 1; liens.forEach((d, g) => { [g, d].forEach((b) => { b.classList.add('lie'); b.insertAdjacentHTML('afterbegin', `<span class="n">${k}</span>`); }); k++; }); };
      const bg = [], bd = [];
      G.forEach((g, k) => {
        const a = h('button', '', g.t); a.type = 'button'; a._i = g.i; bg.push(a);
        const b = h('button', '', D[k].t); b.type = 'button'; b._i = D[k].i; bd.push(b);
        box.append(a, b);
      });
      bg.forEach((a) => a.addEventListener('click', () => { if (box.classList.contains('fige')) return; if (liens.has(a)) { liens.delete(a); maj(); } bg.forEach((x) => x.classList.remove('sel')); selG = a; a.classList.add('sel'); }));
      bd.forEach((b) => b.addEventListener('click', () => { if (box.classList.contains('fige') || !selG) return; liens.forEach((d, g) => { if (d === b) liens.delete(g); }); liens.set(selG, b); selG.classList.remove('sel'); selG = null; maj(); }));
      el.append(h('p', 'aide', 'Touche un élément à gauche, puis celui qui va avec à droite.'), box);
      return () => { if (liens.size < G.length) return null; box.classList.add('fige'); let ok = true; liens.forEach((d, g) => { const j = d._i === g._i || q.paires[d._i][1] === q.paires[g._i][1]; [g, d].forEach((x) => x.classList.add(j ? 'juste' : 'faux')); if (!j) ok = false; }); return { ok, bonne: q.paires.map((p) => `${p[0]} → <b>${p[1]}</b>`).join('<br>') }; };
    },
    ordre() {
      const box = h('div', 'ordre'); let cur = melange(q.etapes.map((t, i) => i));
      if (cur.every((v, i) => v === i)) cur.reverse();
      const dessine = () => { box.innerHTML = ''; cur.forEach((idx, pos) => { const l = h('div', 'ligne'); const up = h('button', '', '↑'), dn = h('button', '', '↓'); up.type = dn.type = 'button'; up.setAttribute('aria-label', 'monter'); dn.setAttribute('aria-label', 'descendre'); up.disabled = pos === 0; dn.disabled = pos === cur.length - 1; up.onclick = () => { [cur[pos - 1], cur[pos]] = [cur[pos], cur[pos - 1]]; dessine(); }; dn.onclick = () => { [cur[pos + 1], cur[pos]] = [cur[pos], cur[pos + 1]]; dessine(); }; l.append(h('span', '', q.etapes[idx]), up, dn); l._idx = idx; box.appendChild(l); }); };
      dessine(); el.appendChild(box);
      return () => { const ok = cur.every((v, i) => v === i); [...box.children].forEach((l, i) => { l.querySelectorAll('button').forEach((b) => (b.disabled = true)); l.style.borderColor = l._idx === i ? 'var(--ok)' : 'var(--ko)'; }); return { ok, bonne: '<ol style="margin:4px 0 0;padding-left:1.2em">' + q.etapes.map((e) => `<li>${e}</li>`).join('') + '</ol>' }; };
    },
    legende() {
      const s = SCHEMAS[q.schema]; el.insertAdjacentHTML('beforeend', schemaSVG(q.schema));
      const liste = h('div', 'legende-liste'); const cibles = s.labels.map((_, i) => { const l = h('div', 'l', `<i>${i + 1}</i>`); const c = h('span', 'cible'); l.appendChild(c); liste.appendChild(l); return c; });
      const cb = casesEtBanque(cibles, s.labels.concat(q.leurres || []));
      el.append(h('p', 'aide', "Touche les mots dans l'ordre des numéros. Touche une case pour la vider."), liste, cb.banque);
      return () => { const v = cb.valeurs(); if (v.some((x) => !x)) return null; cb.figer(); let ok = true; v.forEach((x, i) => { const j = x === s.labels[i]; cibles[i].classList.add(j ? 'juste' : 'faux'); if (!j) ok = false; }); return { ok, bonne: s.labels.map((l, i) => `${i + 1}. ${l}`).join(' · ') }; };
    },
  };
  const verifier = (T[q.type] || T.qcm)();
  return { el, verifier };
}

/**
 * Lance une série d'exercices dans `root`.
 * opts : { titre, onReponse(q, ok), onFin({bonnes, total, ratees}), examen: bool (pas de 2e essai, minuteur discret) }
 */
export function lancerQuiz(root, questions, opts = {}) {
  let i = 0, bonnes = 0; const ratees = [];
  root.innerHTML = '';
  const box = h('div', 'quiz'); root.appendChild(box);

  function fin() {
    const pct = Math.round((bonnes / questions.length) * 100);
    const msg = pct === 100 ? 'Sans faute. Tu peux être fière.' : pct >= 80 ? 'Très solide. Encore un petit tour sur tes erreurs et c\'est bon.' : pct >= 50 ? 'C\'est en route. Refais tes erreurs : c\'est là que tu gagnes des points.' : 'Pas grave : relis « Comprendre », refais l\'expérience, puis reviens.';
    box.innerHTML = `<div class="q fin"><div class="score">${bonnes}/${questions.length}</div><p>${msg}</p>
      ${ratees.length ? `<div class="revoir"><b>À revoir :</b><ul>${ratees.map((q) => `<li>${q.q || (q.texte ? q.texte.replace(/\{([^}]+)\}/g, '…') : 'Schéma')}</li>`).join('')}</ul></div>` : ''}
      <div class="q-actions" style="justify-content:center"></div></div>`;
    const act = box.querySelector('.q-actions');
    if (ratees.length) { const b = h('button', 'btn chaud', 'Refaire mes erreurs'); b.onclick = () => lancerQuiz(root, ratees.slice(), opts); act.appendChild(b); }
    const r = h('button', 'btn ghost', 'Recommencer'); r.onclick = () => lancerQuiz(root, melange(questions), opts); act.appendChild(r);
    if (opts.onFin) opts.onFin({ bonnes, total: questions.length, ratees, actions: act });
    if (pct >= 80) confettis();
    box.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function montre() {
    if (i >= questions.length) return fin();
    const q = questions[i];
    box.innerHTML = '';
    const tete = h('div', 'quiz-tete', `<span>${i + 1} / ${questions.length}</span><div class="jauge"><i style="width:${(i / questions.length) * 100}%"></i></div><span>${bonnes} ✓</span>`);
    const carte = h('div', 'q');
    carte.appendChild(h('div', 'type', `${NOMS[q.type] || ''}${q.prio ? ' <span class="etoile">essentiel</span>' : ''}${q.chap ? ` <span>· ${q.chap}</span>` : ''}`));
    if (q.q) carte.appendChild(h('h3', '', q.q));
    const { el, verifier } = rendre(q);
    carte.appendChild(el);
    const actions = h('div', 'q-actions');
    const bv = h('button', 'btn', 'Vérifier'); bv.type = 'button';
    const manque = h('span', '', ''); manque.style.color = 'var(--ko)'; manque.style.fontWeight = '600';
    actions.append(bv, manque);
    carte.appendChild(actions);
    box.append(tete, carte);
    const premier = carte.querySelector('input'); if (premier && window.matchMedia('(min-width: 861px)').matches) premier.focus();
    carte.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.tagName === 'INPUT') bv.click(); });
    bv.addEventListener('click', function valider() {
      const r = verifier();
      if (!r) { manque.textContent = 'Il manque une réponse.'; return; }
      manque.textContent = '';
      bv.removeEventListener('click', valider);
      if (r.ok) bonnes++; else ratees.push(q);
      if (opts.onReponse) opts.onReponse(q, r.ok);
      const ret = h('div', 'retour ' + (r.ok ? 'ok' : 'ko'));
      ret.innerHTML = `<b class="v">${r.ok ? ['Exact !', 'Bien joué !', 'Oui !', 'C\'est ça !'][i % 4] : 'Pas tout à fait.'}</b>` +
        (r.ok ? '' : `<span class="bonne">Bonne réponse : ${r.bonne}</span>`) + (r.note ? `<i>${r.note}</i><br>` : '') + (q.expl ? `<span>${q.expl}</span>` : '');
      carte.appendChild(ret);
      bv.textContent = i === questions.length - 1 ? 'Voir mon score' : 'Suivant →';
      bv.addEventListener('click', () => { i++; montre(); box.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
      bv.focus();
      ret.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }
  montre();
}

function confettis() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const c = document.createElement('canvas'); c.className = 'confetti'; document.body.appendChild(c);
  const x = c.getContext('2d'); c.width = innerWidth; c.height = innerHeight;
  const cols = ['#ff5a36', '#2f7bff', '#ffe45c', '#0fa98f', '#7a56f0'];
  const P = Array.from({ length: 110 }, () => ({ x: Math.random() * c.width, y: -20 - Math.random() * c.height * 0.5, vx: (Math.random() - 0.5) * 3, vy: 2 + Math.random() * 4, s: 5 + Math.random() * 6, r: Math.random() * 6, c: cols[(Math.random() * cols.length) | 0] }));
  let t = 0; (function f() { x.clearRect(0, 0, c.width, c.height); P.forEach((p) => { p.x += p.vx; p.y += p.vy; p.r += 0.1; x.save(); x.translate(p.x, p.y); x.rotate(p.r); x.fillStyle = p.c; x.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6); x.restore(); }); if (++t < 170) requestAnimationFrame(f); else c.remove(); })();
}
