// chili-volcans.js — « Trois volcans du Chili » (thème 3, cours/06).
// Les trois volcans côte à côte, d'après les photos du cours : Osorno (cône parfait enneigé, au bord d'un lac), Calbuco
// (énorme panache de cendres gris), Villarica (enneigé, lave orange au sommet). On en choisit un : il entre en éruption à sa
// façon, et le texte dit, dans les mots du cours, son type d'éruption et ce qu'il rejette (les mots-clés du tableau 4.4).
//   Osorno    : éruptions effusives — la lave coule, des produits solides noirs s'accumulent en couches près du cratère.
//   Calbuco   : principalement explosives (cendres, nuages de poussières), mais également effusives (coulées de lave).
//   Villarica : explosives — la lave visqueuse forme un bouchon, la pression monte, explosion, coulées pyroclastiques.
import { THREE, layout, createStage, panel, explain, molecules, clamp, rand } from './kit.js';

const VOLCANS = {
  osorno: { nom: 'Osorno', x: -3.4, H: 2.15, R: 1.55, top: 0.1, k: 1.08, couleur: 0x6f6258, neige: [0.56, 0xf4f8ff], type: 'effusives', mots: ['lave', 'projections volcaniques'] },
  calbuco: { nom: 'Calbuco', x: 0, H: 1.45, R: 1.8, top: 0.42, k: 1.3, couleur: 0x6b5a4e, neige: null, type: 'explosives et effusives', mots: ['lave', 'nuée ardente'] },
  villarica: { nom: 'Villarica', x: 3.4, H: 2.0, R: 1.6, top: 0.13, k: 1.22, couleur: 0x4a4352, neige: [0.52, 0xc9d3e6], type: 'explosives', mots: ['lave pâteuse', 'coulée pyroclastique'] },
};
const ORDRE = ['osorno', 'calbuco', 'villarica'];
const FACE = Math.PI / 2;                     // azimut qui regarde la caméra (+z)

/** Rayon du volcan à la hauteur y, et hauteur de sa pente à la distance r de l'axe. */
const rayon = (v, y) => v.top + (v.R - v.top) * Math.pow(clamp(1 - y / v.H, 0, 1), v.k);
const hauteur = (v, r) => (r <= v.top ? v.H : r >= v.R ? 0 : v.H * (1 - Math.pow((r - v.top) / (v.R - v.top), 1 / v.k)));

const TEXTES = {
  o1: 'Le volcan d\'Osorno se caractérise par des <mark>éruptions effusives</mark> : la <mark>lave</mark> sort du cratère et coule sur les pentes.',
  o2: 'Osorno, éruptions <mark>effusives</mark>. Les principaux produits rejetés : de la <mark>lave</mark>, généralement inférieure à deux mètres d\'épaisseur, et des <mark>produits solides</mark> normalement noirs qui s\'accumulent en couches de plusieurs mètres près du cratère.',
  c1: 'Le volcan Calbuco se caractérise principalement par des <mark>éruptions explosives</mark> : il rejette des <mark>cendres</mark> et des <mark>nuages de poussières</mark> pouvant faire des dizaines de mètres de hauteur.',
  c2: '… mais également des <mark>éruptions effusives</mark> : des <mark>coulées de lave</mark> descendent les pentes. Il est considéré comme l\'un des volcans les plus dangereux du Chili.',
  v1: 'Le volcan Villarica se caractérise par des éruptions explosives. Les laves qu\'il émet, <mark>visqueuses</mark>, coulent mal et forment des <mark>bouchons</mark>. Sous le bouchon, la pression monte…',
  v2: 'Quand la <mark>pression</mark> est trop forte, l\'éruption devient <mark>explosive</mark> !',
  v3: 'Des nuées de gaz brûlants, de roches et de poussières dévalent les pentes : les <mark>coulées pyroclastiques</mark>. Le Villarica est le volcan le plus dangereux du Chili.',
};

export default function mount(root) {
  const { stageEl, panelEl, explainEl } = layout(root);
  const st = createStage(stageEl, { camera: { pos: [0, 4.6, 12], target: [0, 2, 0], fov: 40 }, minDistance: 4, maxDistance: 22, background: 0x16142a });
  const { scene } = st;
  const ex = explain(explainEl);

  /* ----- le décor : sol, ciel étoilé, lac d'Osorno ----- */
  const sol = new THREE.Mesh(new THREE.CircleGeometry(11, 64), new THREE.MeshStandardMaterial({ color: 0x2c3528, roughness: 0.95 }));
  sol.rotation.x = -Math.PI / 2; scene.add(sol);
  const pts = [];
  for (let i = 0; i < 170; i++) { const a = rand(0, Math.PI * 2), e = rand(0.1, 1.25), r = 40; pts.push(r * Math.cos(e) * Math.cos(a), 1 + r * Math.sin(e), r * Math.cos(e) * Math.sin(a)); }
  const geoEt = new THREE.BufferGeometry(); geoEt.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
  scene.add(new THREE.Points(geoEt, new THREE.PointsMaterial({ color: 0xffffff, size: 2, sizeAttenuation: false, transparent: true, opacity: 0.8 })));
  const lac = new THREE.Mesh(new THREE.CircleGeometry(1, 48), new THREE.MeshStandardMaterial({ color: 0x2f6fb5, roughness: 0.15, metalness: 0.2 }));
  lac.rotation.x = -Math.PI / 2; lac.scale.set(1.35, 0.85, 1); lac.position.set(VOLCANS.osorno.x - 0.95, 0.015, 1.75); scene.add(lac);

  /* ----- les trois volcans ----- */
  const profil = (v, de, a, plus = 0) => Array.from({ length: 25 }, (_, i) => { const y = v.H * (de + ((a - de) * i) / 24); return new THREE.Vector2(rayon(v, y) + plus, y); });
  const crateres = {};
  for (const id of ORDRE) {
    const v = VOLCANS[id];
    const g = new THREE.Group(); g.position.x = v.x; scene.add(g); v.groupe = g;
    const p = profil(v, 0, 1); p.push(new THREE.Vector2(v.top * 0.7, v.H - 0.09), new THREE.Vector2(0.001, v.H - 0.11));
    g.add(new THREE.Mesh(new THREE.LatheGeometry(p, 64), new THREE.MeshStandardMaterial({ color: v.couleur, roughness: 0.92, side: THREE.DoubleSide })));
    if (v.neige) g.add(new THREE.Mesh(new THREE.LatheGeometry(profil(v, v.neige[0], 0.97, 0.012), 64), new THREE.MeshStandardMaterial({ color: v.neige[1], roughness: 0.7, side: THREE.DoubleSide })));
    const c = new THREE.Mesh(new THREE.CircleGeometry(v.top * 0.92, 32), new THREE.MeshBasicMaterial({ color: id === 'villarica' ? 0xff7a2a : 0x3a2c26 }));
    c.rotation.x = -Math.PI / 2; c.position.y = v.H - 0.075; g.add(c); crateres[id] = c;
  }
  // Osorno : les couches de produits solides noirs, près du cratère (elles apparaissent l'une après l'autre)
  const couches = [0, 1, 2].map((j) => {
    const v = VOLCANS.osorno;
    const m = new THREE.Mesh(new THREE.LatheGeometry(profil(v, 0.74 - 0.08 * j, 0.975, 0.02 + 0.02 * j), 64), new THREE.MeshStandardMaterial({ color: [0x2a2426, 0x352e30, 0x221d1f][j], roughness: 1, transparent: true, opacity: 0, side: THREE.DoubleSide }));
    VOLCANS.osorno.groupe.add(m); return m;
  });
  // Villarica : le bouchon de lave visqueuse, dans le cratère
  const bouchon = new THREE.Mesh(new THREE.SphereGeometry(VOLCANS.villarica.top * 1.7, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0x3a2626, emissive: 0xff4a12, emissiveIntensity: 0.2, roughness: 0.9 }));
  bouchon.position.y = VOLCANS.villarica.H - 0.08; VOLCANS.villarica.groupe.add(bouchon);
  // la lueur du cratère actif
  const feu = new THREE.PointLight(0xff7a2a, 0, 7, 1.4); scene.add(feu);

  /* ----- les produits rejetés : lave, produits solides (roches), cendres et nuées ----- */
  const NL = 360, NR = 140, NC = 420;
  const lav = molecules(NL, { radius: 0.055, color: 0xffffff, segments: 8 });
  { const m = lav.mesh.material; lav.mesh.material = new THREE.MeshBasicMaterial({ color: 0xffffff }); m.dispose(); }
  const roc = molecules(NR, { radius: 0.045, color: 0x1d1b1e, segments: 6 });
  const cen = molecules(NC, { radius: 0.12, color: 0x9a94a6, segments: 10 });
  cen.mesh.material.roughness = 1;
  scene.add(lav.mesh, roc.mesh, cen.mesh);
  const L = Array.from({ length: NL }, () => ({ age: -1, vis: false, phi: 0, v: 0.15, len: 1, w: rand(0, 6.28), d: rand(-0.035, 0.035) }));
  const RO = Array.from({ length: NR }, () => ({ on: false, p: new THREE.Vector3(), u: new THREE.Vector3(), pose: false, t: 0, chaud: 0 }));
  const A = Array.from({ length: NC }, () => ({ on: false, mode: 0, age: 0, life: 6, a: 0, k: 1, gris: 0.6, phi: 0, vit: 1 }));
  const coul = { on: false, v: null };
  const em = { proj: 0, colonne: 0, nuees: 0, accP: 0, accC: 0, accN: 0 };

  const cacher = (m, i) => m.setPos(i, 0, -99, 0, 0.001);
  function vider() {
    L.forEach((p) => { p.vis = false; p.age = -1; }); RO.forEach((r) => { r.on = false; }); A.forEach((a) => { a.on = false; });
    coul.on = false; Object.assign(em, { proj: 0, colonne: 0, nuees: 0, accP: 0, accC: 0, accN: 0 });
  }
  /** Coulées de lave : les gouttes sont réparties sur les coulées, décalées pour former des rivières continues. */
  function demarrerLave(v, coulees) {
    coul.on = true; coul.v = v;
    const n = Math.floor(NL / coulees.length);
    L.forEach((p, i) => {
      const c = coulees[Math.min(coulees.length - 1, Math.floor(i / n))], j = i % n;
      Object.assign(p, { vis: true, phi: c.phi, v: c.v, len: c.len, age: -(j / n) * (c.len / c.v) });
    });
  }
  function lancerRoche(v, hmin, hmax, vmin, vmax, chaud = 0) {
    const r = RO.find((x) => !x.on); if (!r) return;
    const a = rand(0, Math.PI * 2), hz = rand(hmin, hmax);
    r.on = true; r.pose = false; r.t = 0; r.chaud = chaud;
    r.p.set(v.x + Math.cos(a) * v.top * 0.4, v.H - 0.02, Math.sin(a) * v.top * 0.4);
    r.u.set(Math.cos(a) * hz, rand(vmin, vmax), Math.sin(a) * hz);
  }
  function lancerCendre(v, mode, dir = FACE) {
    const c = A.find((x) => !x.on); if (!c) return;
    Object.assign(c, mode === 0
      ? { on: true, mode, age: 0, life: rand(5.5, 7.5), a: rand(0, Math.PI * 2), k: rand(0.25, 1), gris: rand(0.42, 0.78), vit: rand(0.85, 1.15) }
      : { on: true, mode, age: 0, life: rand(2.6, 3.4), phi: dir + rand(-0.2, 0.2), k: rand(-0.1, 0.1), gris: rand(0.45, 0.62), vit: rand(0.45, 0.6) });
  }

  /* ----- étiquettes : le nom des volcans (au pied), et les produits rejetés quand ils apparaissent ----- */
  const noms = {};
  for (const id of ORDRE) { const v = VOLCANS[id]; noms[id] = st.label(v.nom, new THREE.Vector3(v.x + (id === 'osorno' ? 0.35 : 0), 0.08, v.R + 0.12), { cls: 'discret' }); }
  const pLave = new THREE.Vector3();
  const etLave = st.label('lave', pLave, { cls: 'chaud', offset: [0.55, 0.15, 0] });
  const etProj = st.label('projections volcaniques', new THREE.Vector3(VOLCANS.osorno.x + 0.5, VOLCANS.osorno.H + 0.55, 0.2), { cls: 'fluo' });
  const etCendres = st.label('cendres, nuages de poussières', new THREE.Vector3(1.3, VOLCANS.calbuco.H + 3.0, 0), { cls: 'fluo' });
  const etBouchon = st.label('bouchon', new THREE.Vector3(VOLCANS.villarica.x + 0.55, VOLCANS.villarica.H + 0.22, 0.2), { cls: 'fluo' });
  const etNuee = st.label('coulée pyroclastique', new THREE.Vector3(VOLCANS.villarica.x + 1.05, 0.75, 1.05), { cls: 'fluo' });
  [etLave, etProj, etCendres, etBouchon, etNuee].forEach((e) => e.show(false));

  /* ----- réglages ----- */
  const ui = panel(panelEl);
  ui.title('Trois volcans du Chili');
  let sel = 'osorno', te = 0, cyclePrec = 0, explose = false;
  const choix = ui.choice({ label: 'Choisis un volcan', options: ORDRE.map((id) => ({ value: id, label: VOLCANS[id].nom })), value: sel, onChange: (id) => choisir(id) });
  ui.buttons([{ label: 'Relancer l\'éruption', primary: true, onClick: () => choisir(sel) }]);
  const rType = ui.readout('Type d\'éruption');
  const rPression = ui.readout('Pression sous le bouchon');
  const noteMots = ui.note('');
  ui.note('Tourne la scène avec ton doigt ou ta souris. Les noms sont au pied des volcans.');

  /* ----- caméra : vers le volcan choisi (sur un écran étroit, on le cadre seul) ----- */
  let anim = null, cadre = false;
  function viser(instant) {
    const { w, h } = st.size(); if (!w || !h) return false;
    const v = VOLCANS[sel], asp = w / h, tan = Math.tan(THREE.MathUtils.degToRad(st.camera.fov / 2));
    const etroit = w < 560;
    const d = Math.max((etroit ? 7.4 : 6.6) / (2 * tan), (etroit ? 4.6 : 11.4) / (2 * tan * asp));
    const tx = etroit ? v.x : 0, ty = etroit ? 2.5 : 2.3;
    const cible = new THREE.Vector3(tx, ty, 0), pos = new THREE.Vector3(tx, ty + d * 0.14, d);
    if (instant) { st.controls.target.copy(cible); st.camera.position.copy(pos); anim = null; }
    else anim = { t0: st.controls.target.clone(), p0: st.camera.position.clone(), t1: cible, p1: pos, k: 0 };
    return true;
  }
  const etroit = () => st.size().w < 560;
  function etiquettesEtroites() {
    etCendres.set(etroit() ? 'cendres' : 'cendres, nuages de poussières');
    for (const k of ORDRE) noms[k].show(!etroit() || k === sel);   // écran étroit : seul le volcan choisi est cadré
  }

  function choisir(id) {
    sel = id; te = 0; cyclePrec = 0; explose = false;
    choix.set(id); vider();
    couches.forEach((m) => { m.material.opacity = 0; });
    bouchon.visible = id === 'villarica'; bouchon.scale.setScalar(0.5);
    for (const k of ORDRE) { noms[k].el.className = 'sim-label ' + (k === id ? 'fluo' : 'discret'); VOLCANS[k].groupe.position.set(VOLCANS[k].x, 0, 0); }
    if (cadre) etiquettesEtroites();
    const v = VOLCANS[id];
    rType.set(v.type);
    rPression.el.style.display = id === 'villarica' ? '' : 'none';
    noteMots.innerHTML = `<b style="color:#fff">Dans le tableau, en mots-clés :</b><br>${v.mots.map((m) => `<b style="color:var(--fluo);font-size:16px">- ${m}</b>`).join('<br>')}`;
    // la lave d'Osorno et de Calbuco : où accrocher l'étiquette (au milieu de la première coulée)
    const s = 0.5, r = v.top + (v.R - v.top) * s;
    pLave.set(v.x + Math.cos(id === 'osorno' ? 1.25 : 1.4) * r, hauteur(v, r), Math.sin(id === 'osorno' ? 1.25 : 1.4) * r);
    etLave.set(id === 'osorno' ? 'lave' : 'coulée de lave');
    feu.position.set(v.x, v.H + 0.35, 0.2);
    if (cadre) viser(false);
  }
  choisir(sel);

  /* ----- animation ----- */
  const col = new THREE.Color(), CH = new THREE.Color(0xffe066), OR = new THREE.Color(0xff5a1a), FR = new THREE.Color(0x7a2412);
  const NUEE_CH = new THREE.Color(0xd9733a), NUEE = new THREE.Color(0x8a7a70);
  st.onFrame((dt, t) => {
    if (!cadre && viser(true)) { cadre = true; etiquettesEtroites(); }
    if (anim) {
      anim.k = Math.min(1, anim.k + dt / 0.9); const e = anim.k < 0.5 ? 2 * anim.k * anim.k : 1 - Math.pow(-2 * anim.k + 2, 2) / 2;
      st.controls.target.lerpVectors(anim.t0, anim.t1, e); st.camera.position.lerpVectors(anim.p0, anim.p1, e);
      if (anim.k >= 1) anim = null;
    }
    te += dt;
    const v = VOLCANS[sel];
    let phase = '', pression = 0, lueur = 0.4;

    if (sel === 'osorno') {
      if (!coul.on) demarrerLave(v, [{ phi: 1.25, len: 0.98, v: 0.16 }, { phi: 2.05, len: 0.88, v: 0.14 }]);
      em.proj = 7; em.colonne = 0; em.nuees = 0;
      couches.forEach((m, j) => { m.material.opacity = clamp((te - 2.5 - 3 * j) / 1.5, 0, 1); });
      phase = te < 4.5 ? 'o1' : 'o2'; lueur = 1;
    } else if (sel === 'calbuco') {
      const c = te % 18, explosive = c < 8;
      em.colonne = explosive ? 48 : 5; em.proj = 0; em.nuees = 0;   // le cours ne cite pas de projections pour le Calbuco
      if (!explosive && !coul.on) demarrerLave(v, [{ phi: 1.4, len: 0.86, v: 0.15 }, { phi: 2.3, len: 0.72, v: 0.13 }]);
      if (explosive && coul.on) coul.on = false;
      phase = explosive ? 'c1' : 'c2'; lueur = explosive ? 0.6 : 1;
      etCendres.show(explosive && c > 2.2);
    } else {
      const c = te % 20;
      if (c < cyclePrec) explose = false;      // nouveau cycle : un nouveau bouchon se forme
      cyclePrec = c;
      if (c < 6) {
        pression = Math.pow(c / 6, 1.4);
        bouchon.visible = true; bouchon.scale.set(0.7 + 0.8 * pression, 0.8 + 1.4 * pression, 0.7 + 0.8 * pression);
        bouchon.material.emissiveIntensity = 0.15 + 1.3 * pression;
        const tremble = pression > 0.65 ? (pression - 0.65) * 0.09 : 0;
        v.groupe.position.x = v.x + Math.sin(t * 57) * tremble; v.groupe.position.z = Math.cos(t * 43) * tremble * 0.6;
        em.colonne = 0; em.nuees = 0; em.proj = 0; phase = 'v1'; lueur = 0.5 + pression;
      } else {
        v.groupe.position.set(v.x, 0, 0);
        if (!explose) { // l'explosion : le bouchon saute
          explose = true; bouchon.visible = false;
          for (let k = 0; k < 45; k++) lancerRoche(v, 0.5, 2.1, 2.8, 4.8, 1);
          for (let k = 0; k < 60; k++) lancerCendre(v, 0);
        }
        em.colonne = c < 12 ? 22 : 3; em.nuees = c < 11.5 ? 40 : 0; em.proj = 0;
        phase = c < 7.6 ? 'v2' : 'v3'; lueur = c < 7 ? 3 : 1;
      }
      rPression.set(c < 6 ? (pression < 0.35 ? 'faible' : pression < 0.7 ? 'elle monte' : pression < 0.95 ? 'forte' : 'trop forte !') : c < 7.6 ? 'trop forte : explosion !' : '—');
      etBouchon.show(c < 6); etNuee.show(c > 7.6 && c < 14);
    }
    etProj.show(sel === 'osorno' && te > 1.5);
    etLave.show(coul.on && (sel === 'osorno' ? te > 2.5 : (te % 18) > 10));
    if (sel !== 'calbuco') etCendres.show(false);
    if (sel !== 'villarica') { etBouchon.show(false); etNuee.show(false); }
    ex.set(TEXTES[phase]);
    crateres.calbuco.material.color.setHex(sel === 'calbuco' ? 0xff6a2a : 0x3a2c26);
    crateres.osorno.material.color.setHex(sel === 'osorno' ? 0xff6a2a : 0x3a2c26);
    feu.intensity = lueur * (2.2 + 0.6 * Math.sin(t * 7));

    /* lave : des rivières qui descendent les pentes, chaudes en haut, refroidies en bas */
    for (let i = 0; i < NL; i++) {
      const p = L[i];
      if (!p.vis) { cacher(lav, i); continue; }
      p.age += dt;
      if (p.age < 0) { cacher(lav, i); continue; }
      let s = p.age * p.v;
      if (s >= p.len) { if (coul.on) { p.age -= p.len / p.v; s = p.age * p.v; } else { p.vis = false; cacher(lav, i); continue; } }
      const cv = coul.v, r = cv.top + (cv.R - cv.top) * s, phi = p.phi + p.d + 0.05 * Math.sin(s * 10 + p.w);
      lav.setPos(i, cv.x + Math.cos(phi) * r, hauteur(cv, r) + 0.035, Math.sin(phi) * r, 1 - 0.25 * (s / p.len));
      const f = s / p.len;
      lav.setColor(i, f < 0.35 ? col.copy(CH).lerp(OR, f / 0.35) : col.copy(OR).lerp(FR, (f - 0.35) / 0.65));
    }
    lav.commit();

    /* produits solides : lancés hors du cratère, ils retombent et restent près du cratère */
    em.accP += em.proj * dt;
    while (em.accP >= 1) { em.accP -= 1; lancerRoche(v, 0.25, 0.75, 1.9, 2.9); }
    for (let i = 0; i < NR; i++) {
      const r = RO[i];
      if (!r.on) { cacher(roc, i); continue; }
      if (!r.pose) {
        r.u.y -= 5.5 * dt; r.p.addScaledVector(r.u, dt);
        const vv = VOLCANS[sel], ys = hauteur(vv, Math.hypot(r.p.x - vv.x, r.p.z)) + 0.03;
        if (r.p.y <= ys && r.u.y < 0) { r.p.y = ys; r.pose = true; r.t = 0; }
      } else { r.t += dt; if (r.t > (sel === 'osorno' ? 9 : 6)) { r.on = false; cacher(roc, i); continue; } }
      r.chaud = Math.max(0, r.chaud - dt * 0.5);
      roc.setPos(i, r.p.x, r.p.y, r.p.z, r.chaud > 0 ? 1.5 : 1);
      roc.setColor(i, col.setHex(0x1d1b1e).lerp(OR, r.chaud));
    }
    roc.commit();

    /* cendres (colonne qui monte et s'étale) et nuées (coulées pyroclastiques qui dévalent les pentes) */
    em.accC += em.colonne * dt; em.accN += em.nuees * dt;
    while (em.accC >= 1) { em.accC -= 1; lancerCendre(v, 0); }
    while (em.accN >= 1) { em.accN -= 1; lancerCendre(v, 1, FACE + [-0.75, 0, 0.75][Math.floor(rand(0, 3))]); }
    const Hc = sel === 'calbuco' ? 3.7 : 2.6;
    for (let i = 0; i < NC; i++) {
      const a = A[i];
      if (!a.on) { cacher(cen, i); continue; }
      a.age += dt;
      if (a.age >= a.life) { a.on = false; cacher(cen, i); continue; }
      const fin = clamp((a.life - a.age) / 1.1, 0, 1);
      if (a.mode === 0) {
        const f = 1 - Math.exp((-a.age * a.vit) / 1.6), hh = Hc * f;
        const rad = 0.08 + 0.75 * Math.pow(f, 1.6) * a.k + (f > 0.72 ? (f - 0.72) * 3.2 * a.k : 0);
        const vent = Math.max(0, f - 0.6) * a.age * 0.22;
        cen.setPos(i, v.x + Math.cos(a.a) * rad + vent, v.H - 0.05 + hh, Math.sin(a.a) * rad * 0.8, (0.55 + 2.0 * f) * fin);
        const g = a.gris * (0.72 + 0.28 * f); cen.setColor(i, col.setRGB(g, g * 0.97, g * 1.04));
      } else {
        const s = a.age * a.vit, rr = v.top + (v.R - v.top) * Math.min(s, 1) + Math.max(0, s - 1) * (v.R - v.top) * 0.8;
        const y = (s < 1 ? hauteur(v, rr) : 0) + 0.08 + 0.3 * Math.min(1, a.age * 0.9);
        const phi = a.phi + a.k * Math.min(1, s);
        cen.setPos(i, v.x + Math.cos(phi) * rr, y, Math.sin(phi) * rr, (0.7 + 1.7 * Math.min(1, a.age / 1.8)) * fin);
        cen.setColor(i, col.copy(NUEE_CH).lerp(NUEE, clamp(a.age / 1.3, 0, 1)).multiplyScalar(a.gris / 0.55));
      }
    }
    cen.commit();
  });

  return { dispose() { st.dispose(); } };
}
