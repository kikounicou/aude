// Éléments interactifs des pages « Comprendre » : priorités à cocher, capsule vidéo, triangle vivant,
// cartes « j'observe → je nomme », questions probables de la prof.
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

/* ---------- 2. Capsule vidéo ---------- */
function video(el, c) {
  if (!c.video) return;
  el.className = 'w-video';
  el.innerHTML = `<div class="w-video-tete"><span class="kicker">Capsule</span><h2>${c.video.titre}</h2><span>${c.video.duree || ''}</span></div>
    <video controls playsinline preload="none" poster="video/${c.video.id}.jpg"><source src="video/${c.video.id}.mp4" type="video/mp4"></video>`;
  const v = el.querySelector('video');
  if (c.video.chiffre) { v.remove(); return verrou(el, c.video.id); }
  v.querySelector('source').addEventListener('error', () => { el.style.display = 'none'; });
  // Version réservée à la famille (on y voit et on y entend l'élève) : repliée, et chiffrée.
  let finFamille = null;
  if (c.videoFamille) {
    const d = h('details', 'w-famille', `<summary>🔒 Version de la famille</summary><p>La même capsule, présentée par l'élève. Elle est chiffrée : un enfant ne s'expose pas en ligne.</p>`);
    el.appendChild(d);
    d.addEventListener('toggle', () => { if (d.open && !finFamille) finFamille = verrou(d, c.videoFamille.id); });
  }
  return () => { v.pause(); if (finFamille) finFamille(); };
}
// Capsule chiffrée : en ligne il n'y a qu'un fichier illisible (video/<id>.enc). On demande le mot de passe une fois,
// l'appareil s'en souvient, et la vidéo est déchiffrée ici, dans le navigateur (AES-256-GCM, clé PBKDF2).
function verrou(conteneur, id) {
  const CLE_MDP = 'rs2e-capsules';
  const zone = h('div', 'w-verrou');
  zone.style.backgroundImage = `url(video/${id}.jpg)`;
  zone.innerHTML = `<form><b>🔒 Capsule protégée</b><span>Entre le mot de passe des capsules (une seule fois sur cet appareil).</span>
    <div><input type="password" autocomplete="current-password" aria-label="Mot de passe des capsules" placeholder="mot de passe"><button class="btn chaud petit" type="submit">Voir la capsule</button></div><i></i></form>`;
  conteneur.appendChild(zone);
  const form = zone.querySelector('form'), champ = zone.querySelector('input'), msg = zone.querySelector('i');
  let url = null, video = null;
  async function ouvrir(mdp, silencieux) {
    msg.textContent = 'Déchiffrement…';
    try {
      const buf = new Uint8Array(await (await fetch(`video/${id}.enc`)).arrayBuffer());
      const enc = new TextEncoder();
      const base = await crypto.subtle.importKey('raw', enc.encode(mdp.trim()), 'PBKDF2', false, ['deriveKey']);
      const cle = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt: buf.slice(5, 21), iterations: 600000, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
      const clair = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: buf.slice(21, 33), additionalData: enc.encode('RS2E1') }, cle, buf.slice(33));
      url = URL.createObjectURL(new Blob([clair], { type: 'video/mp4' }));
      video = h('video'); video.controls = true; video.playsInline = true; video.src = url; video.poster = `video/${id}.jpg`;
      zone.replaceWith(video);
      try { localStorage.setItem(CLE_MDP, mdp.trim()); } catch { /* navigation privée */ }
    } catch (e) {
      msg.textContent = silencieux ? '' : 'Mot de passe incorrect.';
      if (silencieux) { try { localStorage.removeItem(CLE_MDP); } catch { /* rien */ } }
    }
  }
  form.addEventListener('submit', (e) => { e.preventDefault(); if (champ.value.trim()) ouvrir(champ.value, false); });
  let garde = null; try { garde = localStorage.getItem(CLE_MDP); } catch { /* rien */ }
  if (garde) ouvrir(garde, true);
  return () => { if (video) video.pause(); if (url) URL.revokeObjectURL(url); };
}

/* ---------- 3. Le triangle vivant (changements d'état) ---------- */
const ETATS = {
  solide: { nom: 'État solide', x: 74, y: 284, coul: '#cfeeff', txt: 'Les molécules sont <b>serrées</b> et <b>rangées</b>. Elles vibrent sur place.' },
  liquide: { nom: 'État liquide', x: 260, y: 36, coul: '#4db8ff', txt: 'Les molécules sont proches mais désordonnées : <b>elles se déplacent</b>. C\'est un <mark>fluide</mark>.' },
  gaz: { nom: 'État gazeux', x: 446, y: 284, coul: '#ffffff', txt: 'Les molécules sont très espacées et occupent tout l\'espace : <b>elles se déplacent</b>. C\'est un <mark>fluide</mark>.' },
};
const PASSAGES = [
  { id: 'fusion', nom: 'fusion', de: 'solide', vers: 'liquide', l: [62, 256, 196, 54], t: [112, 150], def: 'La <mark>fusion</mark> est le passage de l\'état solide à l\'état liquide.', ex: 'Dans ton cours : les glaçons fondent dans le bécher.', chaud: true },
  { id: 'solidification', nom: 'solidification', de: 'liquide', vers: 'solide', l: [226, 64, 98, 256], t: [178, 168], def: 'La <mark>solidification</mark> est le passage de l\'état liquide à l\'état solide.', ex: 'Dans ton cours : les gouttes d\'eau gèlent sur le bloc réfrigérant.', chaud: false },
  { id: 'vaporisation', nom: 'vaporisation', de: 'liquide', vers: 'gaz', l: [294, 64, 422, 256], t: [342, 168], def: 'La <mark>vaporisation</mark> est le passage de l\'état liquide à l\'état gazeux. Elle peut se faire par <mark>évaporation</mark> (à la surface libre du liquide) ou par <mark>ébullition</mark> (au sein même du liquide).', ex: 'Dans ton cours : l\'eau bout (ébullition) ; l\'éther disparaît du verre de montre (évaporation).', chaud: true },
  { id: 'condensation', nom: 'condensation', de: 'gaz', vers: 'liquide', l: [458, 256, 324, 54], t: [408, 150], def: 'La <mark>condensation</mark> est le passage de l\'état gazeux à l\'état liquide…', ex: 'Dans ton cours : des gouttes apparaissent sur le verre de montre.', chaud: false },
  { id: 'sublimation', nom: 'sublimation', de: 'solide', vers: 'gaz', l: [140, 272, 380, 272], t: [260, 258], def: 'La <mark>sublimation</mark> est le passage direct de l\'état solide à l\'état gazeux.', ex: 'Dans ton cours : la tige chaude de la cuillère à combustion posée sur un glaçon, la glace se transforme en vapeur.', chaud: true },
  { id: 'condensation2', nom: 'condensation', de: 'gaz', vers: 'solide', l: [380, 298, 140, 298], t: [260, 318], def: '… et la <mark>condensation</mark> est aussi le passage de l\'état gazeux à l\'état solide. <b>Le même mot sert deux fois : c\'est le piège du contrôle.</b>', ex: 'Dans ton cours : du givre apparaît sur le bloc réfrigérant sorti du congélateur.', chaud: false },
];

function triangle(el) {
  el.className = 'w-tri';
  el.innerHTML = `<div class="w-tri-tete"><span class="kicker">À connaître par cœur</span><h2>Le triangle vivant</h2><p>Touche une <b>flèche</b> ou un <b>état</b> : les molécules te montrent ce qui se passe.</p></div>
    <div class="w-tri-corps"><div class="w-tri-svg"></div><div class="w-tri-cote"><canvas class="w-tri-mol" width="300" height="220"></canvas><div class="w-tri-info"></div></div></div>
    <div class="w-tri-actions"><button type="button" class="btn ghost petit" data-a="cacher">Cacher les noms pour me tester</button><span class="w-tri-score"></span></div>`;
  const svgBox = el.querySelector('.w-tri-svg'), info = el.querySelector('.w-tri-info'), cv = el.querySelector('.w-tri-mol'), score = el.querySelector('.w-tri-score');
  let cache = false; const vus = new Set();
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', '0 0 520 340'); svg.setAttribute('role', 'group'); svg.setAttribute('aria-label', 'Triangle des changements d\'état');
  svg.innerHTML = `<defs><marker id="wfl" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="context-stroke"/></marker></defs>`;
  const gP = {}, gE = {};
  PASSAGES.forEach((p) => {
    const g = document.createElementNS(NS, 'g'); g.setAttribute('class', 'w-fleche'); g.setAttribute('tabindex', '0'); g.setAttribute('role', 'button'); g.setAttribute('aria-label', `${p.de} vers ${p.vers}`);
    const [x1, y1, x2, y2] = p.l; const ang = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI; const rot = ang > 90 || ang < -90 ? ang + 180 : ang;
    g.innerHTML = `<line class="touche" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/><line class="trait" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" marker-end="url(#wfl)"/>
      <g transform="translate(${p.t[0]},${p.t[1]}) rotate(${rot})"><rect class="pastille" x="-54" y="-13" width="108" height="24" rx="12"/><text class="nomf" y="4" text-anchor="middle">${p.nom}</text></g>`;
    g.addEventListener('click', () => choisirPassage(p)); g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choisirPassage(p); } });
    svg.appendChild(g); gP[p.id] = g;
  });
  Object.entries(ETATS).forEach(([k, e]) => {
    const g = document.createElementNS(NS, 'g'); g.setAttribute('class', 'w-etat'); g.setAttribute('tabindex', '0'); g.setAttribute('role', 'button');
    g.innerHTML = `<rect x="${e.x - 64}" y="${e.y - 24}" width="128" height="48" rx="12" fill="${e.coul}"/><text x="${e.x}" y="${e.y + 6}" text-anchor="middle">${k === 'gaz' ? 'GAZ' : k.toUpperCase()}</text>`;
    g.addEventListener('click', () => choisirEtat(k)); g.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); choisirEtat(k); } });
    svg.appendChild(g); gE[k] = g;
  });
  svgBox.appendChild(svg);

  /* --- mini-labo 2D de molécules --- */
  const ctx = cv.getContext('2d'); const W = 300, H = 220, N = 42;
  const M = Array.from({ length: N }, (_, i) => { const col = i % 7, row = Math.floor(i / 7); return { hx: 96 + col * 18, hy: 196 - row * 18, x: 96 + col * 18, y: 196 - row * 18, vx: 0, vy: 0 }; });
  let mode = 'solide', cible = 'solide', bascule = 0, chaleur = 0, chaleurCible = 0, raf = 0, visible = true;
  const PARAM = { solide: 0, liquide: 0.45, gaz: 1 };
  function pas() {
    raf = requestAnimationFrame(pas);
    if (!visible) return;
    if (bascule && performance.now() > bascule) { mode = cible; bascule = 0; }
    chaleurCible = PARAM[mode]; chaleur += (chaleurCible - chaleur) * 0.035;
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < N; i++) {
      const m = M[i];
      if (chaleur < 0.2) { // solide : ressort vers la place rangée + vibration
        m.vx += (m.hx - m.x) * 0.12 + (Math.random() - 0.5) * (0.5 + chaleur * 3); m.vy += (m.hy - m.y) * 0.12 + (Math.random() - 0.5) * (0.5 + chaleur * 3); m.vx *= 0.7; m.vy *= 0.7;
      } else if (chaleur < 0.75) { // liquide : au fond, désordonné, ça roule
        m.vy += 0.16; m.vx += (Math.random() - 0.5) * 0.7; m.vy += (Math.random() - 0.5) * 0.5;
        for (let j = 0; j < N; j++) { if (j === i) continue; const o = M[j], dx = m.x - o.x, dy = m.y - o.y, d2 = dx * dx + dy * dy; if (d2 < 290 && d2 > 0.01) { const d = Math.sqrt(d2), f = (17 - d) * 0.06; m.vx += (dx / d) * f; m.vy += (dy / d) * f; } }
        m.vx *= 0.9; m.vy *= 0.9;
      } else { // gaz : partout, vite
        m.vx += (Math.random() - 0.5) * 0.5; m.vy += (Math.random() - 0.5) * 0.5; const v = Math.hypot(m.vx, m.vy) || 1, vc = 3.2; m.vx = (m.vx / v) * (v + (vc - v) * 0.06); m.vy = (m.vy / v) * (v + (vc - v) * 0.06);
      }
      m.x += m.vx; m.y += m.vy;
      if (m.x < 12) { m.x = 12; m.vx = Math.abs(m.vx); } if (m.x > W - 12) { m.x = W - 12; m.vx = -Math.abs(m.vx); }
      if (m.y < 12) { m.y = 12; m.vy = Math.abs(m.vy); } if (m.y > H - 12) { m.y = H - 12; m.vy = -Math.abs(m.vy) * 0.4; }
      const c = Math.min(1, chaleur * 1.1), R = Math.round(77 + 178 * c), G = Math.round(160 - 60 * c), B = Math.round(255 - 190 * c);
      const q = 4 + chaleur * 16, vv = Math.hypot(m.vx, m.vy) || 1;
      ctx.strokeStyle = `rgba(${R},${G},${B},.6)`; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(m.x, m.y); ctx.lineTo(m.x - (m.vx / vv) * q, m.y - (m.vy / vv) * q); ctx.stroke();
      ctx.fillStyle = `rgb(${R},${G},${B})`; ctx.beginPath(); ctx.arc(m.x, m.y, 6.5, 0, 7); ctx.fill();
    }
    ctx.fillStyle = '#cfc8ff'; ctx.font = '600 12px "Instrument Sans", sans-serif'; ctx.textAlign = 'left';
    ctx.fillText(bascule ? (chaud ? '🔥 on apporte de la chaleur…' : '❄ on retire de la chaleur…') : ETATS[mode].nom, 10, 18);
  }
  let chaud = true;
  const io = new IntersectionObserver((es) => { visible = es[0].isIntersecting; }); io.observe(cv);
  raf = requestAnimationFrame(pas);

  function allume(elActif) { [...Object.values(gP), ...Object.values(gE)].forEach((g) => g.classList.toggle('on', g === elActif)); }
  function choisirEtat(k) { mode = cible = k; bascule = 0; allume(gE[k]); info.innerHTML = `<b class="w-tri-nom">${ETATS[k].nom}</b><p>${ETATS[k].txt}</p>`; }
  function choisirPassage(p) {
    mode = p.de; cible = p.vers; chaud = p.chaud; bascule = performance.now() + 1100; chaleur = PARAM[p.de];
    if (p.de === 'solide') M.forEach((m) => { m.x = m.hx; m.y = m.hy; m.vx = m.vy = 0; });
    allume(gP[p.id]); gP[p.id].classList.add('vu'); vus.add(p.id);
    info.innerHTML = `<b class="w-tri-nom">${p.nom}</b><span class="w-tri-sens">${ETATS[p.de].nom.replace('État ', '')} → ${ETATS[p.vers].nom.replace('État ', '')} · ${p.chaud ? 'la matière <b>reçoit</b> de la chaleur' : 'la matière <b>perd</b> de la chaleur'}</span><p>${p.def}</p><p class="w-tri-ex">${p.ex}</p>`;
    if (cache) score.textContent = `${vus.size} / 6 flèches retrouvées`;
  }
  el.querySelector('[data-a=cacher]').onclick = (e) => {
    cache = !cache; el.classList.toggle('cache', cache); vus.clear(); Object.values(gP).forEach((g) => g.classList.remove('vu', 'on'));
    e.currentTarget.textContent = cache ? 'Remontrer les noms' : 'Cacher les noms pour me tester';
    score.textContent = cache ? 'Dis le nom dans ta tête, puis touche la flèche pour vérifier.' : '';
    info.innerHTML = cache ? '<p>Pour chaque flèche : dis le nom, <b>puis</b> touche-la.</p>' : '';
  };
  choisirPassage(PASSAGES[0]);
  return () => { cancelAnimationFrame(raf); io.disconnect(); };
}

/* ---------- 4. Cartes « j'observe → je nomme » ---------- */
function cartes(el, c) {
  if (!c.cartes) return;
  el.className = 'w-cartes';
  el.innerHTML = `<div class="w-tri-tete"><span class="kicker">La manipulation ⚠</span><h2>J'observe… je nomme</h2><p>Lis l'observation, <b>dis le phénomène</b>, puis retourne la carte.</p></div>`;
  const g = h('div', 'mots');
  c.cartes.forEach(([obs, phen, interp]) => {
    const b = h('button', 'mot', `<div class="in"><div class="f r" style="font-size:17px;font-weight:600">${obs}<small>quel phénomène ?</small></div><div class="f v"><b style="font:800 20px/1.1 var(--titre);color:var(--fluo);margin-bottom:6px">${phen}</b>${interp}</div></div>`);
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
  c.prof.forEach(([q, r, type], i) => {
    const k = c.id + ':' + i;
    const it = h('div', 'w-prof-item' + (P.prof[k] === 1 ? ' ok' : P.prof[k] === 2 ? ' ko' : ''));
    it.innerHTML = `<div class="w-prof-q"><span class="w-prof-type">${type || 'Question'}</span><b>${q}</b></div><button type="button" class="btn ghost petit">Voir une bonne réponse</button><div class="w-prof-r" hidden><p>${r}</p><div class="w-prof-auto"><button type="button" data-v="1">✓ Je savais</button><button type="button" data-v="2">✗ À revoir</button></div></div>`;
    const bt = it.querySelector('.btn'), rep = it.querySelector('.w-prof-r');
    bt.onclick = () => { rep.hidden = !rep.hidden; bt.textContent = rep.hidden ? 'Voir une bonne réponse' : 'Cacher la réponse'; };
    rep.querySelectorAll('[data-v]').forEach((b) => (b.onclick = () => { P.prof[k] = +b.dataset.v; it.classList.toggle('ok', P.prof[k] === 1); it.classList.toggle('ko', P.prof[k] === 2); sauver(); maj(); }));
    el.appendChild(it);
  });
  el.appendChild(compte); maj();
}

export const WIDGETS = { priorites, video, triangle, cartes, prof };

/** Remplace les <div data-w="nom"> d'une leçon par les widgets ; retourne une fonction de nettoyage. */
export function hydrater(racine, chapitre, outils) {
  const fins = [];
  racine.querySelectorAll('[data-w]').forEach((el) => { const f = WIDGETS[el.dataset.w]; if (!f) return; try { const fin = f(el, chapitre, outils); if (fin) fins.push(fin); } catch (e) { console.error(e); } });
  return () => fins.forEach((f) => { try { f(); } catch (e) { /* rien */ } });
}
