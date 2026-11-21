// zones-globe.js — « Les grandes zones de volcanisme » (thème 3, cours/03, page 13).
// Un globe en points : les terres en vert, les quatre zones de volcanisme dans les couleurs de la légende de l'élève
// (rose CFP, violet PM, orange DMA, jaune RA), les volcans en rouge. On allume une zone : le globe tourne pour la montrer et
// le texte la décrit avec les mots du cours. On peut aussi « dérouler » la Terre en planisphère centré sur l'océan
// Pacifique, comme la carte du cours : on voit alors pourquoi l'océan Indien est coupé en deux, à gauche et à droite.
// Même géographie que les croquis du site (js/schemas/zones.js). Aucune texture, aucun fichier chargé.
import { THREE, layout, createStage, panel, explain, clamp } from './kit.js';
import { GEO, ZONES, deplie } from '../js/schemas/zones.js';

const R = 1.6;                       // rayon du globe
const LONC = -112.5;                 // longitude face à la caméra : le centre du planisphère du cours
const S = 6.4 / 345;                 // planisphère : unités par degré (de 75° E à 60° E, 345°)
const NORD = 76, SUD = -60;
const miller = (lat) => 1.25 * Math.log(Math.tan(Math.PI / 4 + 0.4 * lat * Math.PI / 180)) * 180 / Math.PI;
const MILIEU = (miller(NORD) + miller(SUD)) / 2;
const RAD = Math.PI / 180;

/** Un lieu : sa place sur le globe, sa place sur le planisphère, et s'il est dans le cadre du planisphère. */
function lieu(lon, lat, r = R) {
  const a = (lon - LONC) * RAD, b = lat * RAD;
  const u = deplie(lon);
  return {
    sx: r * Math.cos(b) * Math.sin(a), sy: r * Math.sin(b), sz: r * Math.cos(b) * Math.cos(a),
    px: (u - 247.5) * S, py: (miller(clamp(lat, -80, 84)) - MILIEU) * S,
    dedans: u >= 75 && u <= 420 && lat <= NORD && lat >= SUD,
  };
}
const aVec = ([lon, lat]) => new THREE.Vector3(Math.cos(lat * RAD) * Math.sin(lon * RAD), Math.sin(lat * RAD), Math.cos(lat * RAD) * Math.cos(lon * RAD));
const aLonLat = (v) => [Math.atan2(v.x, v.z) / RAD, Math.asin(clamp(v.y, -1, 1)) / RAD];
/** Points le long d'une ligne, en suivant la surface du globe (un point tous les `pas` degrés). */
function echantillonner(ligne, pas) {
  const out = [ligne[0]];
  for (let i = 1; i < ligne.length; i++) {
    const a = aVec(ligne[i - 1]), b = aVec(ligne[i]);
    const ang = a.angleTo(b) / RAD, n = Math.max(1, Math.ceil(ang / pas));
    for (let k = 1; k <= n; k++) {
      const t = k / n, s = Math.sin(ang * RAD);
      const v = s < 1e-6 ? b.clone() : a.clone().multiplyScalar(Math.sin((1 - t) * ang * RAD) / s).add(b.clone().multiplyScalar(Math.sin(t * ang * RAD) / s));
      out.push(aLonLat(v.normalize()));
    }
  }
  return out;
}
/** Le point est-il dans le polygone ? (longitudes « dépliées », comme sur le planisphère) */
function dansPoly(poly, lon, lat) {
  const u = deplie(lon);
  let ok = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if ((yi > lat) !== (yj > lat) && u < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) ok = !ok;
  }
  return ok;
}

const TEXTES = {
  toutes: 'Sur le planisphère, les volcans (points rouges) sont presque tous le long des <mark>limites de plaques</mark>. Ils dessinent quatre grandes zones de volcanisme : <b>CFP</b> (rose), <b>PM</b> (violet), <b>DMA</b> (orange) et <b>RA</b> (jaune). Allume une zone pour la voir.',
  cfp: '<b>Ceinture de feu du Pacifique (CFP)</b>, en rose : <mark>tout le tour de l\'océan Pacifique</mark> : la côte ouest des Amériques, puis le Japon, l\'Indonésie, jusqu\'à la Nouvelle-Zélande. Rappel : volcanisme de subduction.',
  pm: '<b>Pourtour méditerranéen (PM)</b>, en violet : <mark>autour de la mer Méditerranée</mark>. Rappel : volcanisme de subduction (ex : l\'Etna).',
  dma: '<b>Dorsale médio-Atlantique (DMA)</b>, en orange : <mark>la longue ligne au milieu de l\'océan Atlantique</mark>, du nord au sud. Rappel : volcanisme d\'accrétion, les plaques s\'écartent (ex : l\'Islande).',
  ra: '<b>Rift africain (RA)</b>, en jaune : <mark>à l\'est de l\'Afrique</mark>. Rappel : volcanisme d\'accrétion.',
  pc: 'Au milieu des plaques : les volcans de <mark>points chauds</mark> (ex : Hawaï, au milieu de l\'océan Pacifique). Ils ne sont dans aucune des quatre zones.',
  carte: ' <br><b>Planisphère :</b> centré sur l\'océan Pacifique, comme ta carte. L\'océan Indien (<b>OI</b>) est coupé en deux : à gauche et à droite.',
};
/** Où regarder pour chaque zone (longitude, latitude). */
const VISEE = { toutes: [LONC, 12], cfp: [-168, 8], pm: [20, 36], dma: [-30, 18], ra: [36, 2], pc: [-155.5, 19.6] };
const ETIQ = { cfp: [-178, 47], pm: [24, 44], dma: [-38, 24], ra: [42, -4] };

export default function mount(root) {
  const { stageEl, panelEl, explainEl } = layout(root);
  const st = createStage(stageEl, { camera: { pos: [0, 0.4, 5.4], target: [0, 0, 0], fov: 40 }, minDistance: 3.2, maxDistance: 12, background: 0x17142b });
  const { scene, camera, controls } = st;
  controls.minPolarAngle = Math.PI * 0.1; controls.maxPolarAngle = Math.PI * 0.9;
  controls.autoRotate = true; controls.autoRotateSpeed = 0.55;
  const ex = explain(explainEl);
  const tmp = new THREE.Object3D();

  /* ----- l'océan : un globe bleu, puis un rectangle bleu quand la Terre est déroulée ----- */
  const ocean = new THREE.Mesh(new THREE.SphereGeometry(R * 0.985, 64, 48), new THREE.MeshStandardMaterial({ color: 0x2b64a8, roughness: 0.75, transparent: true }));
  scene.add(ocean);
  const mer = new THREE.Mesh(new THREE.PlaneGeometry(345 * S, (miller(NORD) - miller(SUD)) * S), new THREE.MeshBasicMaterial({ color: 0x2b64a8, transparent: true, opacity: 0, depthWrite: false }));
  mer.position.z = -0.03; mer.visible = false; scene.add(mer);
  const cadre = new THREE.LineSegments(new THREE.EdgesGeometry(mer.geometry), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false }));
  cadre.position.z = -0.02; cadre.visible = false; scene.add(cadre);

  /* ----- les terres : une grille de points, gardés s'ils tombent sur un continent ----- */
  const boite = (p) => Object.assign(p, { u0: Math.min(...p.map((q) => q[0])), u1: Math.max(...p.map((q) => q[0])), l0: Math.min(...p.map((q) => q[1])), l1: Math.max(...p.map((q) => q[1])) });
  const polys = Object.values(GEO.TERRES).map((p) => boite(p.map(([lo, la]) => [deplie(lo), la])));
  const lacs = Object.values(GEO.MERS).map((p) => boite(p.map(([lo, la]) => [deplie(lo), la])));
  const dans = (p, lon, lat) => { const u = deplie(lon); return u >= p.u0 && u <= p.u1 && lat >= p.l0 && lat <= p.l1 && dansPoly(p, lon, lat); };
  const terre = [];
  for (let lat = -88; lat <= 84; lat += 1.8) {
    const n = Math.max(1, Math.round((360 * Math.cos(lat * RAD)) / 1.8));
    for (let k = 0; k < n; k++) {
      const lon = -180 + (k + (Math.round(lat / 1.8) % 2) * 0.5) * (360 / n);
      const antarctique = lat < -68 + 5 * Math.exp(-(((lon + 62) / 10) ** 2));
      if (antarctique || (polys.some((p) => dans(p, lon, lat)) && !lacs.some((p) => dans(p, lon, lat)))) terre.push(lieu(lon, lat, R * 1.003));
    }
  }
  const mTerre = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.019, 0), new THREE.MeshStandardMaterial({ color: 0x8fd27a, roughness: 0.8 }), terre.length);
  scene.add(mTerre);

  /* ----- les limites de plaques : un trait fin ----- */
  const segs = [];
  for (const l of [...GEO.LIMITES, ...Object.values(GEO.TRACES).flat()]) {
    const e = echantillonner(l, 2).map(([lo, la]) => lieu(lo, la, R * 1.004));
    for (let i = 1; i < e.length; i++) segs.push([e[i - 1], e[i]]);
  }
  const gLim = new THREE.BufferGeometry();
  gLim.setAttribute('position', new THREE.BufferAttribute(new Float32Array(segs.length * 6), 3));
  const limites = new THREE.LineSegments(gLim, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.45 }));
  scene.add(limites);

  /* ----- les quatre zones : des perles serrées, dans les couleurs de la légende ----- */
  const zones = {};
  for (const [k, z] of Object.entries(ZONES)) {
    const perles = GEO.TRACES[k].flatMap((l) => echantillonner(l, 0.9)).map(([lo, la]) => lieu(lo, la, R * 1.012));
    const mat = new THREE.MeshBasicMaterial({ color: z.couleur, transparent: true, opacity: 1 });
    const mesh = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.034, 1), mat, perles.length);
    scene.add(mesh);
    zones[k] = { perles, mesh, mat, base: new THREE.Color(z.couleur), allume: 1 };
  }

  /* ----- les volcans ----- */
  const volcans = GEO.VOLCANS.map(([lo, la]) => lieu(lo, la, R * 1.02));
  const mVolc = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.026, 1), new THREE.MeshBasicMaterial({ color: 0xff3b2f }), volcans.length);
  scene.add(mVolc);
  const hawai = lieu(...GEO.HAWAI, R * 1.03);
  const halo = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.012, 8, 32), new THREE.MeshBasicMaterial({ color: 0xffe45c }));
  scene.add(halo);

  /* ----- étiquettes : les océans (écrits comme sur la carte) et les zones ----- */
  const etiquettes = [];
  const etiq = (texte, [lo, la], cls, r = R * 1.05) => { const p = lieu(lo, la, r), v = new THREE.Vector3(); const e = st.label(texte, v, { cls }); etiquettes.push({ p, v, e, cle: texte }); return etiquettes[etiquettes.length - 1]; };
  for (const [k, pos] of Object.entries(GEO.OCEANS)) etiq(k.replace(/\d/, '').toUpperCase(), pos, 'discret');
  const etZones = Object.fromEntries(Object.entries(ETIQ).map(([k, pos]) => [k, etiq(ZONES[k].abr, pos, 'fluo', R * 1.09)]));
  const etHawai = etiq('Hawaï : point chaud', GEO.HAWAI, 'chaud', R * 1.12);

  /* ----- réglages ----- */
  let zone = 'toutes', vue = 'globe', k = 0, kCible = 0, anim = null, touche = false;
  const ui = panel(panelEl);
  ui.title('Les grandes zones de volcanisme');
  ui.choice({ label: 'Allume une zone', options: [{ value: 'toutes', label: 'Toutes' }, { value: 'cfp', label: 'CFP' }, { value: 'pm', label: 'PM' }, { value: 'dma', label: 'DMA' }, { value: 'ra', label: 'RA' }, { value: 'pc', label: 'Point chaud' }], value: zone, onChange: (v) => { zone = v; if (vue === 'globe') viser(v); } });
  ui.choice({ label: 'La Terre', options: [{ value: 'globe', label: 'Globe' }, { value: 'carte', label: 'Planisphère (déroulé)' }], value: vue, onChange: (v) => { vue = v; kCible = v === 'carte' ? 1 : 0; if (v === 'carte') { controls.autoRotate = false; partir(new THREE.Vector3(0, 0, distances().carte)); } else viser(zone); controls.enableRotate = v === 'globe'; controls.enableZoom = v === 'globe'; } });
  ui.note('Tourne le globe avec ton doigt ou ta souris. Les couleurs sont celles de la légende de ta carte : <b style="color:#ff7fb2">rose</b> CFP, <b style="color:#c99bf0">violet</b> PM, <b style="color:#f79a6a">orange</b> DMA, <b style="color:#fde21c">jaune</b> RA.');
  controls.addEventListener('start', () => { touche = true; controls.autoRotate = false; anim = null; });

  /* ----- caméra : vers une zone (globe) ou face au planisphère ----- */
  const distances = () => {
    const { w, h } = st.size(); const a = w && h ? w / h : 1.5, t = Math.tan((camera.fov / 2) * RAD);
    return { globe: (R * 1.28) / (t * Math.min(1, a)), carte: Math.max(3.55 / (t * a), 1.85 / t) };
  };
  function partir(fin) { anim = { de: camera.position.clone(), a: fin, t: 0 }; }
  function viser(z) {
    if (z === 'toutes' && !touche && vue === 'globe') controls.autoRotate = true; else controls.autoRotate = false;
    const [lo, la] = VISEE[z]; const p = lieu(lo, la, 1);
    partir(new THREE.Vector3(p.sx, p.sy, p.sz).normalize().multiplyScalar(distances().globe));
  }
  let cadreFait = false;
  const cadrer = () => { const { w } = st.size(); if (!w || cadreFait) return; cadreFait = true; camera.position.setLength(distances().globe); if (w < 560) etHawai.e.set('Hawaï'); };

  /* ----- placer tout ce qui bouge (k = 0 : globe, k = 1 : planisphère) ----- */
  const ou = (p, out) => out.set(p.sx + (p.px - p.sx) * k, p.sy + (p.py - p.sy) * k, p.sz * (1 - k));
  const v3 = new THREE.Vector3();
  function poser(mesh, liste, taille) {
    for (let i = 0; i < liste.length; i++) {
      const p = liste[i];
      ou(p, tmp.position); tmp.scale.setScalar(p.dedans ? taille : taille * (1 - k));
      tmp.updateMatrix(); mesh.setMatrixAt(i, tmp.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }
  function toutPoser() {
    poser(mTerre, terre, 1); poser(mVolc, volcans, 1);
    for (const z of Object.values(zones)) poser(z.mesh, z.perles, 1);
    const pos = gLim.attributes.position.array;
    segs.forEach(([a, b], i) => {
      const cache = k > 0.5 && !(a.dedans && b.dedans);
      ou(a, v3); pos.set([v3.x, v3.y, v3.z], i * 6);
      if (!cache) ou(b, v3);
      pos.set([v3.x, v3.y, v3.z], i * 6 + 3);
    });
    gLim.attributes.position.needsUpdate = true;
    ou(hawai, halo.position);
    ocean.material.opacity = 1 - k; ocean.visible = k < 0.999; ocean.scale.setScalar(1 - 0.4 * k);
    mer.material.opacity = k; cadre.material.opacity = 0.5 * k; mer.visible = cadre.visible = k > 0.001;
  }
  let kPose = -1;

  /* ----- animation ----- */
  st.onFrame((dt, t) => {
    cadrer();
    // déroulement
    if (k !== kCible) k = kCible > k ? Math.min(kCible, k + dt / 1.3) : Math.max(kCible, k - dt / 1.3);
    if (k !== kPose) { toutPoser(); kPose = k; }
    // caméra
    if (anim) {
      anim.t = Math.min(1, anim.t + dt / 1.1);
      const e = anim.t < 0.5 ? 2 * anim.t * anim.t : 1 - (-2 * anim.t + 2) ** 2 / 2;
      if (vue === 'globe') { const lg = anim.de.length() + (anim.a.length() - anim.de.length()) * e; camera.position.copy(anim.de).normalize().lerp(anim.a.clone().normalize(), e).normalize().multiplyScalar(lg); }
      else camera.position.lerpVectors(anim.de, anim.a, e);
      camera.lookAt(0, 0, 0);
      if (anim.t >= 1) anim = null;
    }
    // la zone allumée brille, les autres s'effacent
    for (const [cle, z] of Object.entries(zones)) {
      const cible = zone === 'toutes' ? 1 : zone === cle ? 1 : 0.16;
      z.allume += (cible - z.allume) * Math.min(1, dt * 6);
      z.mat.opacity = z.allume;
      z.mat.color.copy(z.base);
      if (zone === cle) z.mat.color.lerp(new THREE.Color(0xffffff), 0.18 + 0.18 * Math.sin(t * 5));
    }
    halo.visible = zone === 'pc'; halo.scale.setScalar(1 + 0.3 * Math.sin(t * 5));
    halo.lookAt(camera.position);
    // étiquettes : seulement celles qui sont face à nous (sur le globe) ou dans le cadre (sur le planisphère)
    const cam = camera.position.clone().normalize();
    for (const L of etiquettes) {
      ou(L.p, L.v);
      let voir = k > 0.5 ? L.p.dedans : L.v.clone().normalize().dot(cam) > 0.35;
      if (etZones[L.cle?.toLowerCase()] === L) voir = voir && (zone === 'toutes' || zone === L.cle.toLowerCase());
      if (L === etHawai) voir = voir && zone === 'pc';
      L.e.show(voir);
    }
    ex.set(TEXTES[zone] + (vue === 'carte' ? TEXTES.carte : ''));
  });

  return { dispose() { st.dispose(); } };
}
