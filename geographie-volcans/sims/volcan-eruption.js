// volcan-eruption.js — « Volcan explosif ou volcan effusif » (thème 3, cours/05).
// Un volcan coupé en deux, comme la coupe schématique du cours : la chambre magmatique tout en bas, la cheminée volcanique
// au centre, le cratère au sommet. On choisit le type d'éruption et on regarde la différence :
//   effusive : le magma est fluide, une lave liquide sort du cratère et descend les flancs (coulée de lave), couleur rouge ;
//   explosive : le magma est très visqueux, épais ; grande explosion : cendres, gaz, nuée ardente, projections, couleur grise.
// Le texte « ce qui se passe » suit l'éruption, dans les mots du tableau du cours.
import { THREE, layout, createStage, panel, explain, molecules, clamp, rand } from './kit.js';

const R0 = 3.4;          // rayon du pied du volcan
const YC = 2.36;         // fond du cratère (haut de la cheminée)
const YCH = -1.75;       // centre de la chambre magmatique
const BAS = YCH + 0.32;  // bas de la cheminée (haut de la chambre)
// profil du volcan, du pied au bord du cratère puis au fond du cratère : [rayon, hauteur]
const PROFIL = [[R0, 0], [2.7, 0.3], [2.1, 0.65], [1.6, 1.05], [1.2, 1.5], [0.85, 1.95], [0.6, 2.3], [0.45, 2.55], [0.3, 2.48], [0.14, YC]];
const BORD = 7;          // indice du bord du cratère dans PROFIL
const COUL = { roche: 0x8a5a3a, coupe: 0x9a6a44, strate: 0x7d5232, sol: 0x6e4a30, herbe: 0x5f8f45, lave: 0xff6a1a, laveSombre: 0xb3261e, gris: 0xb8b4c3, grisFonce: 0x4a4550, maison: 0xf6efe2, toit: 0xb5523b };

const TEXTES = {
  monte: '<b>Le magma monte</b> de la <mark>chambre magmatique</mark> par la <mark>cheminée volcanique</mark>, vers le <mark>cratère</mark>.',
  effusif: '<b>Volcan effusif :</b> son magma est <mark>fluide</mark>. Il rejette <mark>une lave liquide</mark> qui descend les flancs : c\'est la <mark>coulée de lave</mark>. Couleur associée : <mark>rouge</mark>.',
  effusifSuite: '<b>Conséquences :</b> la lave <mark>peut faire des dégâts</mark>, mais ne cause en général <mark>pas de victime</mark> : les habitants sont évacués. Ce volcan se trouve <mark>au milieu d\'une plaque</mark>.',
  visqueux: '<b>Volcan explosif :</b> son magma est <mark>très visqueux, épais</mark>. Il monte dans la cheminée volcanique… attention, le volcan va exploser !',
  explosion: '<b>Grande explosion !</b> Le volcan rejette des <mark>cendres</mark>, du <mark>gaz</mark>, des <mark>nuées ardentes</mark>, des <mark>projections</mark>. Couleur associée : <mark>gris</mark>.',
  explosifSuite: '<b>Conséquences :</b> dangereux pour les habitants et le paysage : <mark>danger de mort</mark>. Ce volcan se trouve <mark>entre les plaques</mark>, à l\'intersection des plaques (subduction).',
};

/** Point de la surface du volcan : s = 0 au bord du cratère, 1 au pied ; au-delà, la lave s'étale sur le sol. */
const LONG = (() => { const l = [0]; for (let i = BORD; i > 0; i--) l.push(l[l.length - 1] + Math.hypot(PROFIL[i][0] - PROFIL[i - 1][0], PROFIL[i][1] - PROFIL[i - 1][1])); return l; })();
function surface(s) {
  if (s >= 1) return [R0 + (s - 1) * 2.2, 0.02];
  const d = s * LONG[LONG.length - 1];
  let k = 1; while (k < LONG.length - 1 && LONG[k] < d) k++;
  const f = (d - LONG[k - 1]) / (LONG[k] - LONG[k - 1]);
  const a = PROFIL[BORD - (k - 1)], b = PROFIL[BORD - k];
  return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
}

/** Hauteur du volcan à la distance r de l'axe (0 hors du volcan) : une projection qui la passe est retombée. */
function hauteur(r) {
  if (r >= R0) return 0;
  for (let i = 1; i <= BORD; i++) if (r >= PROFIL[i][0]) { const [r1, y1] = PROFIL[i - 1], [r2, y2] = PROFIL[i]; return y1 + (y2 - y1) * (r1 - r) / (r1 - r2); }
  return PROFIL[BORD][1];
}

export default function mount(root) {
  const { stageEl, panelEl, explainEl } = layout(root);
  const CIBLE = [0, 1.75, -0.6];
  const st = createStage(stageEl, { camera: { pos: [2.3, 3.4, 11.4], target: CIBLE, fov: 40 }, minDistance: 6, maxDistance: 22, background: 0x1a1626 });
  const { scene } = st;
  const ex = explain(explainEl);
  const mat = (color, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color, roughness: 0.9 }, o));
  const plat = (color, o = {}) => new THREE.MeshBasicMaterial(Object.assign({ color }, o));

  /* ----- le sol, coupé lui aussi : on voit dessous la chambre magmatique ----- */
  const sol = new THREE.Mesh(new THREE.BoxGeometry(10, 2.6, 4.6), [mat(COUL.sol), mat(COUL.sol), mat(COUL.herbe), mat(COUL.sol), mat(0x7a5236), mat(COUL.sol)]);
  sol.position.set(0, -1.3, -2.3); scene.add(sol);
  [-0.75, -1.25].forEach((y) => { const l = new THREE.Mesh(new THREE.PlaneGeometry(10, 0.05), plat(0x5a3b25)); l.position.set(0, y, 0.003); scene.add(l); });

  /* ----- le volcan : la moitié arrière du cône, et la face coupée ----- */
  const cone = new THREE.Mesh(new THREE.LatheGeometry(PROFIL.map(([r, y]) => new THREE.Vector2(r, y)), 48, Math.PI / 2, Math.PI), mat(COUL.roche, { side: THREE.DoubleSide, flatShading: true }));
  scene.add(cone);
  const forme = new THREE.Shape();
  PROFIL.forEach(([r, y], i) => (i ? forme.lineTo(-r, y) : forme.moveTo(-r, y)));
  [...PROFIL].reverse().forEach(([r, y]) => forme.lineTo(r, y));
  const coupe = new THREE.Mesh(new THREE.ShapeGeometry(forme), mat(COUL.coupe, { roughness: 1 }));
  coupe.position.z = 0.002; scene.add(coupe);
  for (const k of [0.78, 0.55]) { // strates de la face coupée
    const pts = PROFIL.slice(0, BORD - 1).map(([r, y]) => new THREE.Vector3(-r * k, y * k, 0.004));
    const pts2 = PROFIL.slice(0, BORD - 1).map(([r, y]) => new THREE.Vector3(r * k, y * k, 0.004));
    [pts, pts2].forEach((p) => scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(p), new THREE.LineBasicMaterial({ color: COUL.strate }))));
  }

  /* ----- la chambre magmatique et la cheminée volcanique, sur la face coupée ----- */
  const chambre = new THREE.Mesh(new THREE.CircleGeometry(1, 48), plat(COUL.lave));
  chambre.scale.set(1.5, 0.42, 1); chambre.position.set(0, YCH, 0.006); scene.add(chambre);
  const conduit = new THREE.Mesh(new THREE.PlaneGeometry(0.28, YC - BAS), plat(0x2b1a14));
  conduit.position.set(0, (YC + BAS) / 2, 0.005); scene.add(conduit);
  const geoMagma = new THREE.PlaneGeometry(0.22, 1); geoMagma.translate(0, 0.5, 0);
  const magma = new THREE.Mesh(geoMagma, plat(COUL.lave)); magma.position.set(0, BAS - 0.05, 0.008); scene.add(magma);
  const lac = new THREE.Mesh(new THREE.CircleGeometry(0.3, 24), plat(COUL.lave)); // la lave dans le cratère
  lac.rotation.x = -Math.PI / 2; lac.position.set(0, YC + 0.06, -0.12); scene.add(lac);

  /* ----- les maisons au pied du volcan ----- */
  const maisons = [[4.25, -0.95], [-4.3, -2.5], [2.9, -3.9]].map(([x, z]) => {
    const g = new THREE.Group(), mur = mat(COUL.maison), toit = mat(COUL.toit);
    const b = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.3, 0.38), mur); b.position.y = 0.15;
    const t = new THREE.Mesh(new THREE.ConeGeometry(0.34, 0.26, 4), toit); t.position.y = 0.43; t.rotation.y = Math.PI / 4;
    g.add(b, t); g.position.set(x, 0, z); scene.add(g);
    return { mur, toit };
  });

  /* ----- la lave (éruption effusive) : quatre coulées sur les flancs ----- */
  const NL = 240, COULEES = [Math.PI / 2 + 0.22, Math.PI * 0.8, Math.PI * 1.22, Math.PI * 1.5 - 0.22];
  const lave = molecules(NL, { radius: 0.13, segments: 8 });
  lave.mesh.material = plat(0xffffff); scene.add(lave.mesh);
  const L = Array.from({ length: NL }, (_, i) => ({ k: [0, 3, 0, 3, 1, 2][i % 6],   // surtout les deux coulées qu'on voit de face
    s0: rand(0, 1.35), dphi: rand(-1, 1), c: new THREE.Color().setHSL(rand(0.02, 0.08), 1, rand(0.45, 0.58)) }));

  /* ----- le panache (éruption explosive) : cendres et gaz, la nuée ardente ----- */
  const NP = 150, VIE = 4.4;
  const panache = molecules(NP, { radius: 0.26, segments: 10 }); scene.add(panache.mesh);
  const Pn = Array.from({ length: NP }, (_, i) => ({ off: (i / NP) * VIE, th: rand(0, Math.PI * 2), r: rand(0.35, 1), v: rand(0.85, 1.15) }));
  const NJ = 44;
  const proj = molecules(NJ, { radius: 0.1, segments: 8 }); proj.mesh.material = plat(0xffffff); scene.add(proj.mesh);
  const J = Array.from({ length: NJ }, (_, i) => ({ t0: -i * 0.09, v: [0, 0, 0], c: new THREE.Color(i % 3 ? 0x2b2020 : 0xff7a2a) }));
  const lancer = (j, t) => { j.t0 = t; j.v = [(Math.random() < 0.5 ? -1 : 1) * rand(0.9, 2.6), rand(2.2, 3.6), rand(-0.9, 0.8)]; };
  const eclair = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 24), plat(0xffe2a0, { transparent: true, opacity: 0, depthWrite: false }));
  eclair.position.set(0, YC + 0.3, -0.1); scene.add(eclair);

  /* ----- étiquettes ----- */
  const etChambre = st.label('chambre magmatique', new THREE.Vector3(0, YCH - 0.62, 0), {});
  const etCheminee = st.label('cheminée volcanique', new THREE.Vector3(0, 0.55, 0), { offset: [1.35, 0, 0] });
  const etCratere = st.label('cratère', new THREE.Vector3(0, 2.55, 0), { offset: [-1.05, 0.15, 0] });
  const etCone = st.label('cône volcanique', new THREE.Vector3(2.0, 0.9, -0.8), { offset: [0.9, 0.2, 0], cls: 'discret' });
  const posMagma = new THREE.Vector3(0, BAS, 0);
  const etMagma = st.label('magma', posMagma, { offset: [-0.7, 0, 0], cls: 'chaud' });
  const etCoulee = st.label('coulée de lave', new THREE.Vector3(...(() => { const [r, y] = surface(0.62), p = COULEES[0]; return [r * Math.sin(p), y, r * Math.cos(p)]; })()), { offset: [0.95, 0.35, 0], cls: 'chaud' });
  const etNuee = st.label('nuée ardente', new THREE.Vector3(0.9, 5.3, -0.4), { cls: 'fluo' });
  const etProj = st.label('projections volcaniques', new THREE.Vector3(-1.7, 3.9, 0), { cls: 'discret' });

  /* ----- réglages ----- */
  const ui = panel(panelEl);
  ui.title('Volcan explosif ou volcan effusif ?');
  let type = 'effusif', t0 = 0, temps = 0;
  const relancer = () => {
    t0 = temps;
    J.forEach((j, i) => { j.t0 = -1 - i * 0.09; });
    maisons.forEach((m) => { m.mur.color.set(COUL.maison); m.toit.color.set(COUL.toit); });
  };
  ui.choice({ label: 'Type d\'éruption', value: type, options: [{ value: 'effusif', label: 'Effusive' }, { value: 'explosif', label: 'Explosive' }], onChange: (v) => { type = v; relancer(); } });
  ui.buttons([{ label: 'Relancer l\'éruption', primary: true, onClick: relancer }]);
  const lCouleur = ui.readout('Couleur associée');
  const lMagma = ui.readout('État du magma');
  const lHab = ui.readout('Pour les habitants');
  ui.note('Tourne le volcan avec ton doigt ou ta souris. La face avant est coupée, comme la coupe schématique de ton cours.');

  /* ----- sur un écran étroit, on recule et on allège les étiquettes ----- */
  let cadre = false, cacherCone = false;
  const cadrer = () => {
    const { w, h } = st.size(); if (!w || cadre) return; cadre = true;
    const etroit = w < 560;
    const k = clamp((etroit ? 1.5 : 1.25) / (w / h), 1, 2);
    const c = new THREE.Vector3(...CIBLE);
    st.camera.position.sub(c).multiplyScalar(k).add(c);
    if (etroit) { etCone.show(false); etCratere.show(false); etCheminee.set('cheminée'); etChambre.set('chambre magmatique'); etProj.set('projections'); }
    cacherCone = etroit;
  };

  /* ----- animation ----- */
  const v3 = new THREE.Vector3(), col = new THREE.Color(), GRIS = new THREE.Color(COUL.gris), FONCE = new THREE.Color(COUL.grisFonce), BRULE = new THREE.Color(0x3a2a26), CENDRE = new THREE.Color(0x9a96a2);
  const MAISON = new THREE.Color(COUL.maison), TOIT = new THREE.Color(COUL.toit);
  st.onFrame((dt, t) => {
    cadrer();
    temps = t;
    const e = t - t0;                                   // temps depuis le début de l'éruption
    const eff = type === 'effusif';
    // 1. le magma monte dans la cheminée (plus lentement quand il est très visqueux, épais)
    const montee = eff ? clamp(e / 2.6, 0, 1) : clamp(e / 3.8, 0, 1) * 0.93;
    const niveau = BAS + (YC - BAS) * (1 - (1 - montee) * (1 - montee));
    const tBoom = 5.2, apres = e - tBoom;               // explosion
    const pression = !eff && e > 3.8 && e < tBoom ? Math.sin((e - 3.8) * 14) * 0.03 : 0;
    magma.scale.y = Math.max(0.01, niveau - BAS + 0.05 + pression);
    magma.material.color.set(eff ? COUL.lave : COUL.laveSombre);
    chambre.material.color.set(eff ? COUL.lave : COUL.laveSombre);
    posMagma.set(0, Math.min(niveau, YC) - 0.25, 0);
    etMagma.show(e > 0.2 && (eff ? e < 2.9 : e < tBoom));

    // 2a. effusive : une lave liquide sort du cratère et descend les flancs
    const tLave = 2.6, front = eff ? clamp((e - tLave) * 0.17, 0, 1.35) : 0;
    lac.visible = eff ? e > tLave - 0.1 : e > 3.6 && e < tBoom;
    lac.material.color.set(eff ? COUL.lave : COUL.laveSombre);
    for (let i = 0; i < NL; i++) {
      const p = L[i];
      const s = (p.s0 + Math.max(0, e - tLave) * 0.17) % 1.35;
      if (!eff || s > front) { lave.setPos(i, 0, -99, 0, 0.01); continue; }
      const [r, y] = surface(s), phi = COULEES[p.k] + p.dphi * (0.04 + 0.08 * s), R = r + 0.07;
      lave.setPos(i, R * Math.sin(phi), y + 0.06, R * Math.cos(phi), s > 1 ? 1.25 : 1);
      lave.setColor(i, col.copy(p.c).lerp(BRULE, clamp((s - 1.05) * 1.6, 0, 0.55)));
    }
    lave.commit();

    // 2b. explosive : grande explosion, panache gris (cendres, gaz, nuée ardente), projections
    eclair.material.opacity = !eff && apres > 0 && apres < 0.7 ? 1 - apres / 0.7 : 0;
    eclair.scale.setScalar(0.3 + clamp(apres, 0, 0.7) * 4);
    for (let i = 0; i < NP; i++) {
      const p = Pn[i];
      let a = apres * p.v - p.off;
      if (eff || a < 0) { panache.setPos(i, 0, -99, 0, 0.01); continue; }
      a %= VIE;
      const h = YC + 0.2 + 3.3 * (1 - Math.exp(-0.8 * a)), rad = 0.12 + p.r * 0.8 * Math.pow(a, 1.05);
      panache.setPos(i, rad * Math.cos(p.th) + 0.22 * a, h, rad * Math.sin(p.th) * 0.7 - 0.35, 0.55 + 0.95 * (a / VIE));
      panache.setColor(i, col.copy(FONCE).lerp(GRIS, clamp(a / 2.2, 0, 1)));
    }
    panache.commit();
    for (let i = 0; i < NJ; i++) {
      const j = J[i];
      if (eff || apres < 0) { proj.setPos(i, 0, -99, 0, 0.01); continue; }
      let u = apres - j.t0;
      if (j.t0 < 0 || u > 1.9) { lancer(j, apres + (apres > 7 ? rand(0, 1.5) : rand(0, 0.25))); u = apres - j.t0; }
      if (u < 0) { proj.setPos(i, 0, -99, 0, 0.01); continue; }
      const y = YC + 0.15 + j.v[1] * u - 2.6 * u * u;
      const px = j.v[0] * u, pz = j.v[2] * u;
      if (y < hauteur(Math.hypot(px, pz)) + 0.05 && u > 0.2) { proj.setPos(i, 0, -99, 0, 0.01); continue; }
      proj.setPos(i, px, y, pz, 1);
      proj.setColor(i, j.c);
    }
    proj.commit();

    // 3. les maisons : la lave en abîme une (effusive), la cendre les recouvre toutes (explosive)
    if (eff) {
      const k = clamp((front - 1.2) / 0.12, 0, 1);
      maisons[0].mur.color.copy(MAISON).lerp(BRULE, k); maisons[0].toit.color.copy(TOIT).lerp(BRULE, k);
    } else {
      const k = clamp((apres - 1.5) / 4, 0, 1);
      maisons.forEach((m) => { m.mur.color.copy(MAISON).lerp(CENDRE, k); m.toit.color.copy(TOIT).lerp(CENDRE, k); });
    }

    // 4. étiquettes et textes, dans les mots du cours
    etCoulee.show(eff && front > 0.7);
    etNuee.show(!eff && apres > 1.2);
    etProj.show(!eff && apres > 0.4);
    etCone.show(!cacherCone && (eff || apres < 0.5));
    lCouleur.set(eff ? '<span style="color:#ff6a1a">rouge</span>' : '<span style="color:#b8b4c3">gris</span>');
    lMagma.set(eff ? 'fluide' : 'très visqueux, épais');
    if (eff) {
      lHab.set(front > 1.25 ? 'évacués' : '…');
      ex.set(e < tLave ? TEXTES.monte : front < 1.25 ? TEXTES.effusif : TEXTES.effusifSuite);
    } else {
      lHab.set(apres > 3 ? 'danger de mort' : '…');
      ex.set(e < 2.6 ? TEXTES.monte : apres < 0 ? TEXTES.visqueux : apres < 6 ? TEXTES.explosion : TEXTES.explosifSuite);
    }
  });

  relancer();
  return { dispose() { st.dispose(); } };
}
