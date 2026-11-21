import { schemaSVG, SCHEMAS } from './schemas.js';
// Éléments interactifs des pages « Comprendre » : priorités à cocher, capsule vidéo,
// cartes à retourner, questions probables au contrôle.
// Chaque widget : (el, chapitre, outils) -> fonction de nettoyage (ou rien).
const h = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html !== undefined) e.innerHTML = html; return e; };

/* ---------- 1. « Si tu n'as que 10 minutes » ---------- */
function priorites(el, c, { P, sauver }) {
  if (!c.prio) return;
  P.coche = P.coche || {};
  el.className = 'w-prio';
  el.innerHTML = `<div class="w-prio-tete"><span class="kicker">Priorité contrôle</span><h2>Si tu n'as que 10 minutes</h2><p>Les ${c.prio.length} choses à savoir absolument dans ce chapitre. Coche quand tu sais le dire sans regarder.</p></div>`;
  const liste = h('div', 'w-prio-liste');
  const compte = h('div', 'w-prio-compte');
  const maj = () => { const n = c.prio.filter((_, i) => P.coche[c.id + ':' + i]).length; compte.innerHTML = n === c.prio.length ? '<b>Tout est coché.</b> Vérifie avec « L\'essentiel ★ » dans S\'entraîner.' : `<b>${n} / ${c.prio.length}</b> acquis`; };
  c.prio.forEach((p, i) => {
    const k = c.id + ':' + i;
    const b = h('button', 'w-prio-item' + (P.coche[k] ? ' ok' : ''), `<i></i><span><b>${p[0]}</b>${p[1] ? `<small>${p[1]}</small>` : ''}</span>`);
    b.type = 'button'; b.setAttribute('aria-pressed', !!P.coche[k]);
    b.onclick = () => { P.coche[k] = !P.coche[k]; b.classList.toggle('ok', P.coche[k]); b.setAttribute('aria-pressed', P.coche[k]); sauver(); maj(); };
    liste.appendChild(b);
  });
  el.append(liste, compte); maj();
}

/* ---------- 2. Capsule vidéo (video/<id>.mp4 + video/<id>.jpg) ---------- */
function video(el, c) {
  if (!c.video) return;
  el.className = 'w-video';
  el.innerHTML = `<div class="w-video-tete"><span class="kicker">Capsule</span><h2>${c.video.titre}</h2><span>${c.video.duree || ''}</span></div>
    <video controls playsinline preload="none" poster="video/${c.video.id}.jpg"><source src="video/${c.video.id}.mp4" type="video/mp4"></video>`;
  const v = el.querySelector('video');
  v.querySelector('source').addEventListener('error', () => { el.style.display = 'none'; });
  return () => { v.pause(); };
}

/* ---------- 4. Cartes « j'observe → je nomme » ---------- */
function cartes(el, c) {
  if (!c.cartes) return;
  el.className = 'w-cartes';
  el.innerHTML = `<div class="w-tri-tete"><span class="kicker">À savoir dire</span><h2>Je lis… je nomme</h2><p>Lis la phrase, <b>dis le mot du cours</b>, puis retourne la carte.</p></div>`;
  const g = h('div', 'mots');
  c.cartes.forEach(([obs, phen, interp]) => {
    const b = h('button', 'mot', `<div class="in"><div class="f r" style="font-size:17px;font-weight:600">${obs}<small>quel mot du cours ?</small></div><div class="f v"><b style="font:800 20px/1.1 var(--titre);color:var(--fluo);margin-bottom:6px">${phen}</b>${interp}</div></div>`);
    b.type = 'button'; b.onclick = () => b.classList.toggle('vu'); g.appendChild(b);
  });
  el.appendChild(g);
}

/* ---------- 5. « Ce que la prof peut te demander » ---------- */
function prof(el, c, { P, sauver }) {
  if (!c.prof) return;
  P.prof = P.prof || {};
  el.className = 'w-prof';
  el.innerHTML = `<div class="w-tri-tete"><span class="kicker">Questions de contrôle</span><h2>Ce qu'on peut te demander au contrôle</h2><p>Réponds à voix haute ou sur une feuille, <b>puis</b> regarde la réponse. Sois honnête avec toi-même.</p></div>`;
  const compte = h('div', 'w-prio-compte');
  const maj = () => { const n = c.prof.filter((_, i) => P.prof[c.id + ':' + i] === 1).length; compte.innerHTML = `<b>${n} / ${c.prof.length}</b> questions que tu sais répondre`; };
  c.prof.forEach(([q, r, type, vis], i) => {
    const k = c.id + ':' + i;
    const it = h('div', 'w-prof-item' + (P.prof[k] === 1 ? ' ok' : P.prof[k] === 2 ? ' ko' : ''));
    it.innerHTML = `<div class="w-prof-q"><span class="w-prof-type">${type || 'Question'}</span><b>${q}</b></div>${visuelQuestion(vis)}<button type="button" class="btn ghost petit">Voir une bonne réponse</button><div class="w-prof-r" hidden><p>${r}</p>${visuelReponse(vis)}<div class="w-prof-auto"><button type="button" data-v="1">✓ Je savais</button><button type="button" data-v="2">✗ À revoir</button></div></div>`;
    const bt = it.querySelector('.btn'), rep = it.querySelector('.w-prof-r');
    bt.onclick = () => { rep.hidden = !rep.hidden; bt.textContent = rep.hidden ? 'Voir une bonne réponse' : 'Cacher la réponse'; };
    rep.querySelectorAll('[data-v]').forEach((b) => (b.onclick = () => { P.prof[k] = +b.dataset.v; it.classList.toggle('ok', P.prof[k] === 1); it.classList.toggle('ko', P.prof[k] === 2); sauver(); maj(); }));
    el.appendChild(it);
  });
  el.appendChild(compte); maj();
}

/* ---------- visuels des questions de contrôle : le schéma muet dans la question, sa légende dans la réponse ---------- */
function visuelQuestion(vis) {
  if (!vis) return '';
  if (vis.schema) return `<div class="w-prof-vis">${schemaSVG(vis.schema)}</div>`;
  return '';
}
function visuelReponse(vis) {
  if (!vis) return '';
  if (vis.schema && SCHEMAS[vis.schema]) return `<div class="legende-liste">${SCHEMAS[vis.schema].labels.map((l, i) => `<div class="l"><i>${i + 1}</i><b>${l}</b></div>`).join('')}</div>`;
  return '';
}

export const WIDGETS = { priorites, video, cartes, prof };

/** Remplace les <div data-w="nom"> d'une leçon par les widgets ; retourne une fonction de nettoyage. */
export function hydrater(racine, chapitre, outils) {
  const fins = [];
  racine.querySelectorAll('[data-w]').forEach((el) => { const f = WIDGETS[el.dataset.w]; if (!f) return; try { const fin = f(el, chapitre, outils); if (fin) fins.push(fin); } catch (e) { console.error(e); } });
  return () => fins.forEach((f) => { try { f(); } catch (e) { /* rien */ } });
}
