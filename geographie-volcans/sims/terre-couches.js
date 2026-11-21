// terre-couches.js — « La Terre en coupe » (thème 3, cours/02).
// Notre Terre vue de l'extérieur. On enlève un quartier (comme sur le schéma du cours) et on voit ses trois couches
// principales : le noyau (solide au cœur : la graine, liquide autour), le manteau, la croûte (écorce).
// On touche une couche (sur la coupe ou dans les réglages) : le texte donne ce que dit l'encadré du cours sur elle.
// Mesures du dessin : noyau 3 470 km sur un rayon terrestre de 6 370 km (0,545) ; graine d'après le schéma du cours
// (noyau liquide jusqu'à 5 200 km de profondeur) ; la croûte est dessinée beaucoup plus épaisse qu'en vrai.
import { THREE, layout, createStage, panel, explain, molecules, clamp } from './kit.js';

const R = 2;                  // la Terre
const RC = 1.88;              // bas de la croûte (épaissie pour être visible)
const RN = 0.545 * R;         // le noyau
const RG = 0.18 * R;          // la graine
const COUCHES = [             // du dehors vers le centre ; « groupe » = la couche principale du cours
  { id: 'croute', groupe: 'croute', r0: RC, r1: R, couleur: 0xf4c26b },
  { id: 'manteau', groupe: 'manteau', r0: RN, r1: RC, couleur: 0xd8432c },
  { id: 'liquide', groupe: 'noyau', r0: RG, r1: RN, couleur: 0xf08a2c },
  { id: 'graine', groupe: 'noyau', r0: 0, r1: RG, couleur: 0xffd93d },
];

const TEXTES = {
  ferme: 'Voici notre Terre, vue de l\'extérieur. Celle-ci est constituée de <mark>trois couches principales</mark>. Enlève un quartier pour voir l\'intérieur.',
  ouvert: 'On a enlevé un quartier. Du centre vers la surface : le <mark>noyau</mark>, le <mark>manteau</mark> et la <mark>croûte</mark> (écorce). Touche une couche.',
  croute: '<b>La croûte (écorce)</b>, tout au-dessus : une épaisseur de <mark>30 à 40 kilomètres</mark> sous les continents, d\'environ <mark>20 kilomètres</mark> sous les océans et seulement <mark>quelques kilomètres</mark> au niveau des rifts et des dorsales.',
  manteau: '<b>Le manteau</b> : une épaisseur de <mark>2 900 kilomètres</mark>, composé d\'une part de silicate de fer et d\'autre part de magnésium. Il constitue <mark>80 % du volume</mark> de la Terre. Les boucles blanches : les cellules de convection, comme sur le schéma de ton cours.',
  noyau: '<b>Le noyau</b>, au centre : un rayon de <mark>3 470 kilomètres</mark>, composé de fer et de nickel. Il est solide au cœur (la <mark>graine</mark>) et liquide autour. Il représente 16 % du volume de la Terre et <mark>67 % de sa masse</mark>.',
};
const CHIFFRES = { croute: '30 à 40 km sous les continents', manteau: '2 900 km d\'épaisseur · 80 % du volume', noyau: 'rayon de 3 470 km · 67 % de la masse' };

/* Continents dessinés à la main (croquis, pas une vraie carte) : des taches autour de quelques centres [longitude, latitude, rayon en degrés]. */
const TACHES = [[20, 5, 30], [28, 46, 16], [88, 44, 30], [112, 22, 18], [-62, -16, 24], [-98, 42, 26], [134, -25, 15], [-42, 70, 12]];
const DEG = Math.PI / 180;
const versDir = (lon, lat) => new THREE.Vector3(Math.cos(lat * DEG) * Math.cos(lon * DEG), Math.sin(lat * DEG), Math.cos(lat * DEG) * Math.sin(lon * DEG));
const CENTRES = TACHES.map(([lon, lat, r]) => ({ d: versDir(lon, lat), r: r * DEG }));
const OCEAN = new THREE.Color(0x2f6fb5), TERRE = new THREE.Color(0x6fae5a), GLACE = new THREE.Color(0xf2f6fb);
const lisse = (a, b, x) => { const u = clamp((x - a) / (b - a), 0, 1); return u * u * (3 - 2 * u); };
function couleurSurface(v, out) {
  const d = v.clone().normalize();
  const bruit = 0.07 * Math.sin(5 * d.x + 1) * Math.sin(4 * d.y + 2) * Math.sin(6 * d.z);
  const s = Math.max(...CENTRES.map((c) => c.r + bruit - d.angleTo(c.d)));   // > 0 : sur un continent
  out.copy(OCEAN).lerp(TERRE, lisse(-0.025, 0.025, s));
  return out.lerp(GLACE, lisse(0.9, 0.94, Math.abs(d.y)));                    // les glaces des pôles
}

/** Un morceau de la surface (océans, continents) entre deux longitudes, au format de SphereGeometry. */
function surface(phi0, dphi, mat) {
  const g = new THREE.SphereGeometry(R, Math.max(24, Math.round(dphi / (Math.PI * 2) * 200)), 120, phi0, dphi);
  const pos = g.attributes.position, col = new Float32Array(pos.count * 3), c = new THREE.Color(), v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) { couleurSurface(v.fromBufferAttribute(pos, i), c); col.set([c.r, c.g, c.b], i * 3); }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const m = new THREE.Mesh(g, mat); m.userData.couche = 'croute';
  return m;
}
/** Direction horizontale de la longitude phi (même convention que SphereGeometry). */
const hDir = (phi) => new THREE.Vector3(-Math.cos(phi), 0, Math.sin(phi));
/** La face de coupe d'une couche : un demi-anneau dans le plan vertical de la longitude phi. */
function face(c, phi, mat) {
  const g = c.r0 > 0 ? new THREE.RingGeometry(c.r0, c.r1, 96, 1, -Math.PI / 2, Math.PI) : new THREE.CircleGeometry(c.r1, 64, -Math.PI / 2, Math.PI);
  const m = new THREE.Mesh(g, mat);
  m.rotation.y = phi + Math.PI;             // l'axe x du demi-disque devient la direction hDir(phi)
  m.userData.couche = c.groupe;
  return m;
}
const matCouche = (c, transparent = false) => new THREE.MeshStandardMaterial({ color: c.couleur, emissive: c.couleur, emissiveIntensity: 0.18, roughness: 0.7, side: THREE.DoubleSide, transparent, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 });
/** Les traits d'encre de la coupe : un demi-cercle par limite de couche, et l'axe (comme sur le croquis du site). */
function traits(phi, mat) {
  const g = new THREE.Group();
  for (const r of [R, RC, RN, RG]) {
    const pts = []; for (let i = 0; i <= 96; i++) { const a = -Math.PI / 2 + (i / 96) * Math.PI; pts.push(new THREE.Vector3(r * Math.cos(a), r * Math.sin(a), 0)); }
    g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat));
  }
  g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -R, 0), new THREE.Vector3(0, R, 0)]), mat));
  g.rotation.y = phi + Math.PI;
  return g;
}

export default function mount(root) {
  const { stageEl, panelEl, explainEl } = layout(root);
  const CAM = [3.4, 2.3, 5.2];
  const st = createStage(stageEl, { camera: { pos: CAM, target: [0, 0.05, 0], fov: 40 }, minDistance: 4.2, maxDistance: 13, background: 0x1b1218 });
  const { scene, camera } = st;
  const ex = explain(explainEl);

  // le quartier enlevé est presque face à la caméra (un peu tourné : on voit une face de coupe de face, l'autre de biais)
  const phiMid = Math.atan2(CAM[2], -CAM[0]) + 22 * DEG;
  const phiA = phiMid + Math.PI / 4, phiB = phiMid - Math.PI / 4;

  /* ----- la Terre sans son quartier : la surface (trois quarts) et les deux faces de coupe ----- */
  const terre = new THREE.Group(); scene.add(terre);
  const matSurf = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85 });
  const corps = surface(phiA, Math.PI * 1.5, matSurf); terre.add(corps);
  const mats = {};
  const faces = [];
  for (const c of COUCHES) {
    mats[c.id] = matCouche(c);
    for (const phi of [phiA, phiB]) { const f = face(c, phi, mats[c.id]); terre.add(f); faces.push(f); }
  }
  const encre = new THREE.LineBasicMaterial({ color: 0x1d1b2f, transparent: true, opacity: 0.75 });
  const lignes = [traits(phiA, encre), traits(phiB, encre)]; terre.add(...lignes);

  /* ----- le quartier : sa surface et ses faces, qui s'en vont quand on l'enlève ----- */
  const quartier = new THREE.Group(); scene.add(quartier);
  const matQSurf = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85, transparent: true });
  const qSurf = surface(phiB, Math.PI / 2, matQSurf); quartier.add(qSurf);
  const matsQ = COUCHES.map((c) => matCouche(c, true));
  COUCHES.forEach((c, i) => { for (const phi of [phiA, phiB]) quartier.add(face(c, phi, matsQ[i])); });

  /* ----- les cellules de convection dans le manteau (sur la face vue de face), comme sur le schéma du cours ----- */
  const nB = new THREE.Vector3(Math.sin(phiA + Math.PI), 0, Math.cos(phiA + Math.PI));
  if (nB.dot(new THREE.Vector3(...CAM)) < 0) nB.negate();          // vers la caméra
  const hB = hDir(phiA), Y = new THREE.Vector3(0, 1, 0);
  const BOUCLES = [{ e: 22 * DEG, s: 1 }, { e: 58 * DEG, s: -1 }];
  const NP = 12;
  const points = molecules(BOUCLES.length * NP, { radius: 0.035, color: 0xffffff, segments: 8 });
  points.mesh.material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  scene.add(points.mesh);
  const rm = (RN + RC) / 2, v3 = new THREE.Vector3(), rad = new THREE.Vector3(), tan = new THREE.Vector3();
  const placeBoucle = (b, a, out) => {
    rad.copy(hB).multiplyScalar(Math.cos(b.e)).addScaledVector(Y, Math.sin(b.e));
    tan.copy(hB).multiplyScalar(-Math.sin(b.e)).addScaledVector(Y, Math.cos(b.e));
    return out.copy(rad).multiplyScalar(rm).addScaledVector(rad, 0.27 * Math.cos(a)).addScaledVector(tan, 0.3 * Math.sin(a)).addScaledVector(nB, 0.03);
  };

  /* ----- étiquettes ----- */
  const sur = (phi, r, e) => hDir(phi).multiplyScalar(r * Math.cos(e * DEG)).addScaledVector(Y, r * Math.sin(e * DEG));
  const ET = {
    croute: st.label('croûte (écorce)', sur(phiA, R + 0.34, 64)),
    manteau: st.label('manteau', sur(phiA, (RN + RC) / 2, -58)),
    liquide: st.label('noyau liquide', sur(phiA, (RG + RN) / 2 + 0.06, -38)),
    graine: st.label('la graine', sur(phiA, 0.05, 10)),
  };
  const etCellules = st.label('cellules de convection', sur(phiA, rm, 40));   // entre les deux boucles

  /* ----- réglages ----- */
  const ui = panel(panelEl);
  ui.title('La Terre en coupe');
  let ouvert = false, k = 0, choix = null;
  const [bOuvrir] = ui.buttons([{ label: 'Enlever un quartier', primary: true, onClick: () => ouvrir(!ouvert) }]);
  const sel = ui.choice({ label: 'Touche une couche (sur la coupe ou ici)', options: [{ value: 'croute', label: 'la croûte' }, { value: 'manteau', label: 'le manteau' }, { value: 'noyau', label: 'le noyau' }], value: null, onChange: (v) => choisir(v) });
  const lect = ui.readout('Son chiffre');
  ui.note('Tourne la Terre avec ton doigt ou ta souris. Les couleurs sont celles du schéma de ton cours ; la croûte est dessinée plus épaisse qu\'en vrai.');

  function ouvrir(on) {
    ouvert = on; bOuvrir.textContent = on ? 'Remettre le quartier' : 'Enlever un quartier';
    if (!on) { choix = null; sel.set(null); }
  }
  function choisir(v) {
    choix = v; sel.set(v);
    if (!ouvert) ouvrir(true);
  }

  /* ----- toucher une couche sur la coupe (un appui court, pas un glissé) ----- */
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  let appui = null;
  const cv = st.renderer.domElement;
  const bas = (e) => { appui = { x: e.clientX, y: e.clientY, t: performance.now() }; };
  const haut = (e) => {
    if (!appui) return;
    const bouge = Math.hypot(e.clientX - appui.x, e.clientY - appui.y), duree = performance.now() - appui.t; appui = null;
    if (bouge > 8 || duree > 600) return;
    const r = cv.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const cibles = k > 0.95 ? [corps, ...faces] : [corps, qSurf];
    const hit = ray.intersectObjects(cibles, false)[0];
    if (hit) choisir(hit.object.userData.couche);
  };
  cv.addEventListener('pointerdown', bas); cv.addEventListener('pointerup', haut);

  /* ----- sur un écran étroit, on recule la caméra et on raccourcit les étiquettes ----- */
  let cadre = false;
  const cadrer = () => {
    const { w, h } = st.size(); if (!w || cadre) return; cadre = true;
    const kz = clamp(1.12 / (w / h), 1, 2.2);
    camera.position.multiplyScalar(kz);
    if (w < 560) { ET.croute.set('croûte'); ET.graine.set('graine'); }
  };

  /* ----- animation ----- */
  const BLANC = new THREE.Color(0xffffff), GRIS = new THREE.Color(0x4a4252), tmp = new THREE.Color();
  const hMid = hDir(phiMid);
  st.onFrame((dt, t) => {
    cadrer();
    // le quartier s'en va (vers le haut) ou revient
    k = clamp(k + (ouvert ? 1 : -1) * dt / 0.9, 0, 1);
    const e = k * k * (3 - 2 * k);
    quartier.position.copy(hMid).multiplyScalar(0.9 * e).addScaledVector(Y, 3.4 * e);
    const op = 1 - clamp((e - 0.45) / 0.45, 0, 1);
    matQSurf.opacity = op; matsQ.forEach((m) => (m.opacity = op));
    quartier.visible = op > 0.01;
    terre.rotation.y = 0; // la Terre reste en place : c'est la caméra qui tourne

    // la couche choisie brille, les autres s'éteignent
    for (const c of COUCHES) {
      const m = mats[c.id], on = choix === c.groupe;
      tmp.set(c.couleur);
      if (choix && !on) tmp.lerp(GRIS, 0.6);
      m.color.copy(tmp);
      m.emissive.copy(tmp);
      m.emissiveIntensity = on ? 0.45 + 0.25 * Math.sin(t * 4) : 0.18;
    }
    matSurf.color.copy(choix === 'croute' ? tmp.copy(BLANC).lerp(new THREE.Color(0xfff2c0), 0.5 + 0.5 * Math.sin(t * 4)) : BLANC);

    // les cellules de convection : des points qui tournent dans le manteau
    BOUCLES.forEach((b, j) => {
      for (let i = 0; i < NP; i++) { placeBoucle(b, b.s * t * 0.9 + (i / NP) * Math.PI * 2, v3); points.setPos(j * NP + i, v3.x, v3.y, v3.z, k > 0.95 ? 1 : 0.001); }
    });
    points.commit();

    // étiquettes : seulement quand la Terre est ouverte
    const vu = k > 0.95;
    lignes.forEach((l) => (l.visible = k > 0.02));
    for (const c of COUCHES) {
      const L = ET[c.id]; L.show(vu);
      L.el.classList.toggle('fluo', choix === c.groupe);
    }
    etCellules.show(vu && choix === 'manteau');

    lect.set(choix ? CHIFFRES[choix] : '—');
    ex.set(choix ? TEXTES[choix] : vu ? TEXTES.ouvert : ouvert ? TEXTES.ouvert : TEXTES.ferme);
  });

  return { dispose() { cv.removeEventListener('pointerdown', bas); cv.removeEventListener('pointerup', haut); st.dispose(); } };
}
