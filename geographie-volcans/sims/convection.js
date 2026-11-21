// convection.js — « Le mouvement de convection » (thème 3, cours/01).
// Une tranche de Terre : la croûte dessus, le manteau dessous. Dans le manteau, le magma tourne en deux cellules de
// convection : chaud, il remonte ; il se refroidit sous la croûte ; refroidi, il redescend. Ce mouvement entraîne les plaques :
// elles s'écartent au milieu (rift) et s'enfoncent sur les bords (zones de subduction).
// On règle la chaleur venue du centre de la Terre, et on peut suivre une goutte de magma : le texte dit ce qu'elle fait.
import { THREE, layout, createStage, panel, explain, molecules, clamp, rand } from './kit.js';

const L = 4;            // demi-largeur du bloc
const P = 1.2;          // demi-profondeur
const HM = 2.2;         // hauteur du manteau
const EC = 0.22;        // épaisseur de la croûte
const SD = 2.75;        // distance au rift où la plaque commence à plonger
const FIN = 3.75;       // distance où le morceau de plaque a disparu dans le manteau
const NSEG = 9;         // morceaux de plaque de chaque côté
const N = 150;          // gouttes de magma
const COL = { froid: new THREE.Color(0x8c2b3a), chaud: new THREE.Color(0xffc23d), croute: new THREE.Color(0x4f9d57), neuve: new THREE.Color(0xff7a3d) };

const TEXTES = {
  base: 'Les plaques <mark>tectoniques</mark> se trouvent à la surface de la Terre. Elles bougent à cause des forces qui arrivent du centre de la Terre : regarde le <mark>magma</mark> tourner dans le manteau.',
  arret: '<b>Tu as coupé la chaleur :</b> le magma ne remonte plus et les plaques ne bougent plus. Dans la réalité, cela n\'arrive pas : ce mouvement est <mark>perpétuel</mark>.',
  monte: '<b>La goutte est chaude :</b> le <mark>magma</mark> chaud remonte des profondeurs de la planète tout en se dirigeant vers la surface.',
  haut: '<b>Sous la croûte :</b> le magma perd des degrés et <mark>se refroidit</mark>. En avançant, il entraîne la plaque posée au-dessus de lui.',
  descend: '<b>La goutte est refroidie :</b> elle <mark>redescend</mark> vers le centre de la Terre… où elle va se réchauffer et remonter. C\'est le mouvement de <mark>convection</mark>.',
};

export default function mount(root) {
  const { stageEl, panelEl, explainEl } = layout(root);
  const st = createStage(stageEl, { camera: { pos: [0, 2.9, 7.6], target: [0, 1.45, 0], fov: 40 }, minDistance: 5, maxDistance: 22, background: 0x1b1218 });
  const { scene } = st;
  const ex = explain(explainEl);

  /* ----- le manteau : un bloc translucide, pour voir le magma tourner dedans ----- */
  const manteau = new THREE.Mesh(new THREE.BoxGeometry(2 * L, HM, 2 * P), new THREE.MeshStandardMaterial({ color: 0x7a2f5e, transparent: true, opacity: 0.3, roughness: 0.6, depthWrite: false }));
  manteau.position.y = HM / 2; scene.add(manteau);
  const arete = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(2 * L, HM, 2 * P)), new THREE.LineBasicMaterial({ color: 0xd9a6c8, transparent: true, opacity: 0.45 }));
  arete.position.y = HM / 2; scene.add(arete);
  // la chaleur qui arrive du centre de la Terre : une lueur sous le bloc
  const lueur = new THREE.Mesh(new THREE.BoxGeometry(2 * L, 0.12, 2 * P), new THREE.MeshBasicMaterial({ color: 0xff7a2a, transparent: true, opacity: 0.8 }));
  lueur.position.y = -0.07; scene.add(lueur);

  /* ----- les gouttes de magma : deux cellules de convection ----- */
  const mol = molecules(N, { radius: 0.075, color: 0xffffff, segments: 10 });
  mol.mesh.material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  scene.add(mol.mesh);
  // chaque goutte : côté (-1 gauche, +1 droite), angle, rayon relatif, profondeur
  const G = Array.from({ length: N }, (_, i) => ({ cote: i % 2 ? 1 : -1, a: rand(0, Math.PI * 2), r: rand(0.35, 1), z: rand(-P + 0.15, P - 0.15), v: rand(0.85, 1.15) }));
  // la goutte suivie : devant, sur une grande boucle
  const SUIVIE = 1; Object.assign(G[SUIVIE], { cote: 1, a: Math.PI * 1.45, r: 0.92, z: P - 0.12, v: 1 });
  const halo = new THREE.Mesh(new THREE.SphereGeometry(0.2, 20, 20), new THREE.MeshBasicMaterial({ color: 0xffffff }));
  halo.visible = false; scene.add(halo);
  const AX = 1.62, AY = 0.86, CX = 2, CY = HM / 2;
  const posGoutte = (g, out) => { out.set(g.cote * (CX + AX * g.r * Math.cos(g.a)), CY + AY * g.r * Math.sin(g.a), g.z); return out; };

  /* ----- la croûte : des morceaux de plaque qui naissent au rift et plongent sur les bords ----- */
  const geoSeg = new THREE.BoxGeometry(1, EC, 2 * P);
  const segs = [];
  const pas = FIN / NSEG;
  for (const cote of [-1, 1]) for (let k = 0; k < NSEG; k++) {
    const m = new THREE.Mesh(geoSeg, new THREE.MeshStandardMaterial({ color: COL.croute.clone(), roughness: 0.8 }));
    scene.add(m); segs.push({ m, cote, s: k * pas });
  }
  // plaques fixes des bords, sous lesquelles la plaque plonge : à gauche une plaque avec ses volcans, à droite un continent
  const fixe = (x0, x1, h, couleur) => { const m = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0, h, 2 * P), new THREE.MeshStandardMaterial({ color: couleur, roughness: 0.85 })); m.position.set((x0 + x1) / 2, HM + h / 2, 0); scene.add(m); return m; };
  fixe(-L, -SD - 0.12, 0.3, 0x3f8f4a);
  fixe(SD + 0.12, L, 0.42, 0xe0a13a);
  const cone = (x, z, h, r, couleur) => { const m = new THREE.Mesh(new THREE.ConeGeometry(r, h, 18), new THREE.MeshStandardMaterial({ color: couleur, roughness: 0.9 })); m.position.set(x, HM + (x < 0 ? 0.3 : 0.42) + h / 2, z); scene.add(m); return m; };
  const volcans = [cone(-3.45, -0.5, 0.55, 0.3, 0x6b4a3a), cone(-3.35, 0.45, 0.45, 0.26, 0x6b4a3a)];
  [[3.4, -0.6, 0.5], [3.55, 0.2, 0.62], [3.25, 0.75, 0.4]].forEach(([x, z, h]) => cone(x, z, h, 0.3, 0x3f7d45));
  const laves = volcans.map((v) => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 12), new THREE.MeshBasicMaterial({ color: 0xff5a36 })); m.position.copy(v.position); m.position.y += v.geometry.parameters.height / 2; scene.add(m); return m; });
  // le rift : le magma qui affleure entre les deux plaques
  const rift = new THREE.Mesh(new THREE.BoxGeometry(0.16, EC * 0.9, 2 * P), new THREE.MeshBasicMaterial({ color: 0xff7a2a }));
  rift.position.set(0, HM + EC / 2, 0); scene.add(rift);

  /* ----- étiquettes ----- */
  const etCroute = st.label('croûte', new THREE.Vector3(-1.5, HM + EC, P), { offset: [0, 0.32, 0], cls: 'discret' });
  st.label('manteau', new THREE.Vector3(0, 0.22, P), { cls: 'discret' });
  const etCellule = st.label('cellule de convection', new THREE.Vector3(-CX, CY + 0.15, P), { cls: 'fluo' });
  const etRift = st.label('rift : les plaques s\'écartent', new THREE.Vector3(0, HM + EC, 0), { offset: [0, 0.75, 0], cls: 'discret' });
  const etEnfonce = st.label('la plaque s\'enfonce', new THREE.Vector3(-3.3, HM + 0.3, 0), { offset: [0, 1.05, 0], cls: 'discret' });
  const etContinent = st.label('continent', new THREE.Vector3(3.45, HM + 0.42, 0), { offset: [0, 0.95, 0], cls: 'discret' });
  const etMonte = st.label('chaud : il remonte ↑', new THREE.Vector3(0, 0.5, P), { cls: 'chaud' });
  const etDesc = st.label('refroidi : il redescend ↓', new THREE.Vector3(L - 1.15, 1.2, P), { cls: 'froid' });
  const etGoutte = st.label('la goutte', halo, { offset: [0, 0.38, 0], cls: 'fluo' }); etGoutte.show(false);

  /* ----- réglages ----- */
  const ui = panel(panelEl);
  ui.title('Le mouvement de convection');
  let chaleur = 60, suivre = false;
  ui.slider({ label: 'Chaleur venue du centre de la Terre', min: 0, max: 100, step: 5, value: chaleur, format: (v) => (v === 0 ? 'coupée' : v < 40 ? 'faible' : v < 75 ? 'normale' : 'forte'), onInput: (v) => { chaleur = v; } });
  const [bSuivre] = ui.buttons([{ label: 'Suivre une goutte de magma', primary: true, onClick: () => { suivre = !suivre; bSuivre.textContent = suivre ? 'Ne plus suivre la goutte' : 'Suivre une goutte de magma'; halo.visible = suivre; etGoutte.show(suivre); } }]);
  const lect = ui.readout('Les plaques');
  ui.note('Tourne le bloc avec ton doigt ou ta souris. Les couleurs : <b style="color:#ffc23d">jaune</b> = magma chaud, <b style="color:#e06a7a">rouge sombre</b> = magma refroidi.');
  ui.note('Dans la réalité, tout cela est très lent : les mouvements de convection s\'effectuent à raison de <b>quelques centimètres par an</b>.');

  /* ----- sur un écran étroit, on recule la caméra pour voir tout le bloc ----- */
  let cadre = false;
  const cadrer = () => {
    const { w, h } = st.size(); if (!w || cadre) return; cadre = true;
    const etroit = w < 560;
    const k = clamp((etroit ? 1.7 : 2.0) / (w / h), 1, 2.4);
    st.camera.position.multiplyScalar(k); st.camera.position.y = 2.9 * (1 + (k - 1) * 0.4);
    if (etroit) { // téléphone : on garde les mots du cours, on retire le reste pour que rien ne se chevauche
      etEnfonce.show(false); etContinent.show(false); etCroute.show(false);
      etRift.set('rift'); etMonte.set('chaud ↑'); etDesc.set('refroidi ↓'); etCellule.set('cellule de convection');
    }
  };

  /* ----- animation ----- */
  const v3 = new THREE.Vector3(), col = new THREE.Color(), BLANC = new THREE.Color(0xffffff);
  st.onFrame((dt, t) => {
    cadrer();
    const f = chaleur / 60;                 // 1 = vitesse normale
    const w = 0.42 * f;                     // vitesse angulaire des gouttes
    for (let i = 0; i < N; i++) {
      const g = G[i];
      g.a -= w * g.v * dt * (0.75 + 0.25 / g.r);   // sens : ça remonte au milieu du bloc, ça redescend sur les bords
      posGoutte(g, v3);
      // température : chaud en bas et quand ça remonte, refroidi en haut et quand ça redescend
      const monte = Math.cos(g.a) < 0 ? 1 : 0, haut = (Math.sin(g.a) + 1) / 2;
      const temp = clamp(0.62 * (1 - haut) + 0.38 * monte + (chaleur - 60) / 260, 0, 1);
      col.copy(COL.froid).lerp(COL.chaud, temp);
      mol.setPos(i, v3.x, v3.y, v3.z, i === SUIVIE && suivre ? 0.01 : 1);
      mol.setColor(i, col);
      if (i === SUIVIE) { halo.position.copy(v3); halo.material.color.copy(col).lerp(BLANC, 0.55); halo.scale.setScalar(1.15 + 0.15 * Math.sin(t * 5)); }
    }
    mol.commit();

    // les plaques : entraînées par le magma qui avance sous elles
    const vp = 0.2 * f;
    for (const sg of segs) {
      sg.s += vp * dt; if (sg.s >= FIN) sg.s -= FIN;
      const s = sg.s, plonge = Math.max(0, s - SD);
      const larg = pas * 0.96 * clamp(s / 0.25, 0.15, 1) * clamp((FIN - s) / 0.3, 0.05, 1);
      sg.m.scale.x = larg;
      sg.m.position.set(sg.cote * Math.min(s, SD + plonge * 0.55), HM + EC / 2 - plonge * 0.95, 0);
      sg.m.rotation.z = -sg.cote * clamp(plonge * 1.6, 0, 0.95);
      sg.m.material.color.copy(COL.neuve).lerp(COL.croute, clamp(s / 0.7, 0, 1));
    }
    rift.material.color.setHSL(0.06, 1, 0.45 + 0.12 * Math.sin(t * 3) * Math.min(1, f));
    lueur.material.opacity = 0.15 + 0.75 * (chaleur / 100);
    laves.forEach((m, k) => m.scale.setScalar(chaleur ? 1 + 0.35 * Math.sin(t * 4 + k * 2) : 0.01));
    etMonte.show(chaleur > 0); etDesc.show(chaleur > 0);

    lect.set(chaleur === 0 ? 'immobiles' : chaleur < 40 ? 'bougent lentement' : chaleur < 75 ? 'bougent' : 'bougent plus vite');
    if (chaleur === 0) ex.set(TEXTES.arret);
    else if (!suivre) ex.set(TEXTES.base);
    else { const g = G[SUIVIE], si = Math.sin(g.a), co = Math.cos(g.a); ex.set(si > 0.55 ? TEXTES.haut : co < 0 ? TEXTES.monte : TEXTES.descend); }
  });

  return { dispose() { st.dispose(); } };
}
