// volcanisme-mecanismes.js — « Les trois types de volcanisme » (thème 3, cours/03, page 12, tableau 2.3).
// Une tranche de Terre : la croûte (les plaques) dessus, le manteau dessous, avec ses boucles de convection.
// On choisit un des trois types et on règle la vitesse des plaques :
//   - subduction : la plaque océanique (la plus lourde) plonge sous la plaque continentale (la plus légère) et devient du
//     magma qui remonte → volcan ;
//   - accrétion : deux plaques s'écartent, une fissure (rift/dorsale) se crée, le magma remonte ;
//   - point chaud : le magma perce la plaque et forme un volcan ; la plaque bouge, le volcan n'est plus alimenté, il s'éteint,
//     se décale, et un autre se forme : une chaîne de volcans.
// Le texte « ce qui se passe » reprend les mots du cours et suit ce qu'on voit. Le petit schéma à refaire est rappelé à côté.
import { THREE, layout, createStage, panel, explain, molecules, clamp, rand } from './kit.js';
import { miniSVG } from '../js/schemas/volcanisme.js';

const L = 4;            // demi-largeur du bloc
const P = 1.1;          // demi-profondeur
const HM = 2.2;         // hauteur du manteau
const EC = 0.22;        // épaisseur de la croûte
const N = 70;           // gouttes des boucles de convection
const NB = 12;          // gouttes de magma qui remontent
const COL = { croute: new THREE.Color(0x4f9d57), neuve: new THREE.Color(0xff7a3d), magma: new THREE.Color(0xff5a36), conv: new THREE.Color(0xd62839), eteint: new THREE.Color(0x6b6470), actif: new THREE.Color(0x8a5a33) };

// subduction
const XT = -0.9, ANG = 0.66, XV = 0.6, HC = 0.43;   // fosse, angle de plongée, volcan, épaisseur de la plaque continentale
// point chaud
const XPC = 1.6, ECART = 1.15;                      // place du point chaud, écart entre deux volcans

const TYPES = {
  subduction: {
    nom: 'Subduction', ex: 'Villarica, Etna', zones: 'PM + CFP', cellules: [-0.6, 1.8],
    bouge: '<b>Zone de volcanisme de subduction.</b> Là où les plaques se <mark>chevauchent</mark>, la plus lourde (océanique) <mark>plonge</mark> sous la plus légère (continentale). En s\'enfonçant dans le manteau terrestre, la plaque devient du <mark>magma</mark> qui remonte… → volcan.',
    arret: '<b>Tu as arrêté les plaques :</b> la plaque océanique ne plonge plus sous la plaque continentale. Remets-les en mouvement pour voir le <mark>magma</mark> remonter.',
  },
  accretion: {
    nom: 'Accrétion', ex: 'Islande', zones: 'DMA + RA', cellules: [-1.2, 1.2],
    bouge: '<b>Zone de volcanisme d\'accrétion.</b> Quand deux plaques <mark>s\'écartent</mark>, une <mark>fissure</mark> (rift/dorsale) se crée, par laquelle le <mark>magma</mark> remonte…',
    arret: '<b>Tu as arrêté les plaques :</b> elles ne s\'écartent plus. Remets-les en mouvement : la fissure s\'ouvre et le <mark>magma</mark> remonte.',
  },
  'point-chaud': {
    nom: 'Point chaud', ex: 'Hawaï', zones: '—', cellules: [0.4, 2.8],
    forme: '<b>Volcanisme de point chaud.</b> Les remontées de <mark>magma</mark> <mark>percent</mark> la croûte terrestre et forment le volcan effusif.',
    quitte: 'Suite aux mouvements des plaques, le premier volcan n\'est plus <mark>alimenté</mark> : il <mark>s\'éteint</mark>, se décale… et un <mark>autre</mark> se forme, jusqu\'à épuisement du point chaud.',
    arret: '<b>Tu as arrêté la plaque :</b> le volcan reste au-dessus du point chaud, il reste <mark>alimenté</mark>. C\'est parce que la plaque bouge qu\'une chaîne de volcans se forme.',
  },
};

export default function mount(root) {
  const { stageEl, panelEl, explainEl } = layout(root);
  const st = createStage(stageEl, { camera: { pos: [0, 3.1, 8.2], target: [0, 1.55, 0], fov: 40 }, minDistance: 5, maxDistance: 22, background: 0x1b1218 });
  const { scene } = st;
  const ex = explain(explainEl);
  const mat = (color, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color, roughness: 0.85 }, o));
  const boite = (w, h, d, color, o) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color, o));

  /* ----- le manteau : un bloc translucide, pour voir le magma dedans ----- */
  const manteau = boite(2 * L, HM, 2 * P, 0x7a2f5e, { transparent: true, opacity: 0.3, roughness: 0.6, depthWrite: false });
  manteau.position.y = HM / 2; scene.add(manteau);
  const arete = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(2 * L, HM, 2 * P)), new THREE.LineBasicMaterial({ color: 0xd9a6c8, transparent: true, opacity: 0.45 }));
  arete.position.y = HM / 2; scene.add(arete);
  const lueur = new THREE.Mesh(new THREE.BoxGeometry(2 * L, 0.1, 2 * P), new THREE.MeshBasicMaterial({ color: 0xff7a2a, transparent: true, opacity: 0.55 }));
  lueur.position.y = -0.06; scene.add(lueur);

  /* ----- les boucles de convection (en rouge, comme sur tes petits schémas) ----- */
  const conv = molecules(N, { radius: 0.05, segments: 8 });
  conv.mesh.material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.75 });
  scene.add(conv.mesh);
  const G = Array.from({ length: N }, (_, i) => ({ k: i % 2, a: rand(0, Math.PI * 2), r: rand(0.45, 1), z: rand(-P + 0.12, P - 0.12) }));
  for (let i = 0; i < N; i++) conv.setColor(i, COL.conv);
  const AX = 1.05, AY = 0.42, CY = 0.62;

  /* ----- les gouttes de magma qui remontent (communes aux trois types) ----- */
  const bulles = molecules(NB, { radius: 0.1, segments: 12 });
  bulles.mesh.material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  scene.add(bulles.mesh);
  const B = Array.from({ length: NB }, (_, i) => ({ u: i / NB, dx: rand(-0.12, 0.12), z: rand(-0.35, 0.35) }));
  const chaud = new THREE.Color(0xffc23d);

  const lave = (r = 0.12) => new THREE.Mesh(new THREE.SphereGeometry(r, 14, 14), new THREE.MeshBasicMaterial({ color: 0xff5a36 }));
  const cone = (r, h, color) => new THREE.Mesh(new THREE.ConeGeometry(r, h, 22), mat(color, { roughness: 0.9 }));

  /* ================= 1. subduction ================= */
  const gSub = new THREE.Group(); scene.add(gSub);
  const S0 = L + XT, FIN = S0 + 1.9, NS = 13, pasS = FIN / NS;
  const geoSeg = new THREE.BoxGeometry(1, EC, 2 * P);
  const segSub = Array.from({ length: NS }, (_, k) => { const m = new THREE.Mesh(geoSeg, mat(COL.croute.clone(), { roughness: 0.8 })); gSub.add(m); return { m, s: k * pasS }; });
  const continent = boite(L - XT - 0.05, HC, 2 * P, 0xe0a13a); continent.position.set((L + XT + 0.05) / 2, HM - 0.05 + HC / 2, 0); gSub.add(continent);
  const eau = boite(S0, 0.26, 2 * P, 0x2f8fd6, { transparent: true, opacity: 0.45, roughness: 0.2, depthWrite: false }); eau.position.set(-L + S0 / 2, HM + EC + 0.13, 0); gSub.add(eau);
  const volcanSub = cone(0.5, 0.78, 0x6b4a3a); volcanSub.position.set(XV, HM - 0.05 + HC + 0.39, 0); gSub.add(volcanSub);
  const laveSub = lave(); laveSub.position.set(XV, HM - 0.05 + HC + 0.8, 0); gSub.add(laveSub);
  const fumees = Array.from({ length: 4 }, (_, i) => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 12), new THREE.MeshBasicMaterial({ color: 0xbfb8c8, transparent: true, opacity: 0.5, depthWrite: false })); gSub.add(m); return { m, u: i / 4 }; });
  const posSeg = (s) => { // position et inclinaison d'un morceau de plaque océanique
    if (s < S0) return [-L + s, HM + EC / 2, 0];
    const p = s - S0; return [XT + p * Math.cos(ANG), HM + EC / 2 - p * Math.sin(ANG), -Math.min(ANG, p * 2.2)];
  };

  /* ================= 2. accrétion ================= */
  const gAcc = new THREE.Group(); scene.add(gAcc);
  const NA = 10, pasA = L / NA;
  const segAcc = [];
  for (const cote of [-1, 1]) for (let k = 0; k < NA; k++) { const m = new THREE.Mesh(geoSeg, mat(COL.croute.clone(), { roughness: 0.8 })); gAcc.add(m); segAcc.push({ m, cote, s: k * pasA }); }
  const fissure = new THREE.Mesh(new THREE.BoxGeometry(0.14, EC * 0.9, 2 * P), new THREE.MeshBasicMaterial({ color: 0xff7a2a })); fissure.position.set(0, HM + EC / 2, 0); gAcc.add(fissure);
  const volcanAcc = cone(0.38, 0.5, 0x6b4a3a); volcanAcc.position.set(0, HM + EC + 0.25, 0); gAcc.add(volcanAcc);
  const laveAcc = lave(0.1); laveAcc.position.set(0, HM + EC + 0.52, 0); gAcc.add(laveAcc);
  const fleches = [-1, 1].map((c) => { const a = new THREE.ArrowHelper(new THREE.Vector3(c, 0, 0), new THREE.Vector3(c * 0.75, HM + EC + 0.32, P - 0.05), 1.5, 0x2747b8, 0.42, 0.3); gAcc.add(a); return a; });

  /* ================= 3. point chaud ================= */
  const gPC = new THREE.Group(); scene.add(gPC);
  const NP = 16, pasP = (2 * L) / NP;
  const segPC = Array.from({ length: NP }, (_, k) => { const m = new THREE.Mesh(geoSeg, mat(COL.croute.clone(), { roughness: 0.8 })); gPC.add(m); return { m, s: k * pasP }; });
  const panache = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.24, HM, 18, 1, true), new THREE.MeshBasicMaterial({ color: 0xff7a2a, transparent: true, opacity: 0.35, depthWrite: false, side: THREE.DoubleSide }));
  panache.position.set(XPC, HM / 2, 0); gPC.add(panache);
  const geoCone = new THREE.ConeGeometry(1, 1, 22);
  const volcans = Array.from({ length: 8 }, () => { const m = new THREE.Mesh(geoCone, mat(COL.actif.clone(), { roughness: 0.9 })); m.visible = false; gPC.add(m); const l = lave(0.1); l.visible = false; gPC.add(l); return { m, l, x: 0, h: 0, actif: false, vivant: false, age: 0 }; });
  const ancreJeune = new THREE.Object3D(), ancreVieux = new THREE.Object3D(); gPC.add(ancreJeune, ancreVieux);
  const chaine = () => { // une chaîne déjà formée au départ : cinq volcans, comme sur le schéma de ton cours
    volcans.forEach((v) => { v.vivant = false; v.m.visible = false; v.l.visible = false; });
    for (let k = 0; k < 5; k++) Object.assign(volcans[k], { x: XPC - k * ECART, h: k ? 0.62 - k * 0.03 : 0.5, actif: k === 0, vivant: true, age: k * 5 });
  };
  chaine();

  /* ----- étiquettes ----- */
  const E = {
    oceanique: st.label('plaque océanique (la plus lourde)', new THREE.Vector3(-2.7, HM + EC, P), { offset: [0, 0.55, 0], cls: 'discret' }),
    continentale: st.label('plaque continentale (la plus légère)', new THREE.Vector3(2.6, HM + HC, P), { offset: [0, 0.4, 0], cls: 'discret' }),
    plonge: st.label('elle plonge', new THREE.Vector3(XT + 0.45, HM - 0.35, P), { offset: [-0.75, -0.2, 0], cls: 'froid' }),
    magmaSub: st.label('magma qui remonte', new THREE.Vector3(XV, 1.75, P), { offset: [1.2, -0.1, 0], cls: 'chaud' }),
    ecartent: st.label('les plaques s\'écartent', new THREE.Vector3(0, HM + EC, 0), { offset: [0, 1.25, 0], cls: 'fluo' }),
    fissure: st.label('fissure (rift/dorsale)', new THREE.Vector3(0, HM, P), { offset: [0.95, -0.25, 0], cls: 'discret' }),
    magmaAcc: st.label('magma', new THREE.Vector3(0, 1.1, P), { offset: [0.45, 0, 0], cls: 'chaud' }),
    pointChaud: st.label('point chaud', new THREE.Vector3(XPC, 0.35, P), { offset: [0.7, 0, 0], cls: 'chaud' }),
    jeune: st.label('volcan le plus jeune', ancreJeune, { offset: [0, 0.45, 0], cls: 'fluo' }),
    vieux: st.label('volcan le plus vieux', ancreVieux, { offset: [0, 0.45, 0], cls: 'discret' }),
    deplace: st.label('la plaque se déplace ←', new THREE.Vector3(-1.2, HM, P), { offset: [0, -0.3, 0], cls: 'discret' }),
    manteau: st.label('manteau', new THREE.Vector3(-3.1, 0.2, P), { cls: 'discret' }),
  };
  const PAR_TYPE = { subduction: ['oceanique', 'continentale', 'plonge', 'magmaSub'], accretion: ['ecartent', 'fissure', 'magmaAcc'], 'point-chaud': ['pointChaud', 'jeune', 'vieux', 'deplace'] };

  /* ----- réglages ----- */
  const ui = panel(panelEl);
  ui.title('Les trois types de volcanisme');
  let type = 'subduction', vitesse = 50;
  ui.choice({ label: 'Type de volcanisme', options: Object.entries(TYPES).map(([value, t]) => ({ value, label: t.nom })), value: type, onChange: (v) => choisir(v) });
  ui.slider({ label: 'Vitesse des plaques', min: 0, max: 100, step: 5, value: vitesse, format: (v) => (v === 0 ? 'arrêtées' : v < 40 ? 'lente' : v < 75 ? 'normale' : 'rapide'), onInput: (v) => { vitesse = v; } });
  const lEx = ui.readout('Exemple'), lZones = ui.readout('Zones');
  const noteSchema = ui.note('');
  ui.note('Tourne le bloc avec ton doigt ou ta souris. Dans la réalité, tout cela est très lent : <b>quelques centimètres par an</b>.');

  let etroit = false;
  function choisir(v) {
    type = v;
    gSub.visible = v === 'subduction'; gAcc.visible = v === 'accretion'; gPC.visible = v === 'point-chaud';
    Object.entries(E).forEach(([k, e]) => e.show(k === 'manteau' ? !etroit : PAR_TYPE[v].includes(k)));
    if (etroit) { E.oceanique.show(false); E.continentale.show(false); }
    lEx.set(TYPES[v].ex); lZones.set(TYPES[v].zones);
    noteSchema.innerHTML = `<b>Ton petit schéma à refaire</b> (bleu : surface, plaques, volcan ; rouge : magma et convection) :<span style="display:block;background:#fff;border-radius:10px;padding:4px;margin-top:6px">${miniSVG(v).replace('<svg ', '<svg style="display:block;width:100%;height:auto;max-height:150px" ')}</span>`;
    if (v === 'point-chaud') chaine();
  }
  choisir(type);

  /* ----- sur un écran étroit, on recule la caméra et on allège les étiquettes ----- */
  let cadre = false;
  const cadrer = () => {
    const { w, h } = st.size(); if (!w || cadre) return; cadre = true;
    etroit = w < 560;
    const k = clamp((etroit ? 1.55 : 1.7) / (w / h), 1, 2.4);
    st.camera.position.multiplyScalar(k); st.camera.position.y = 3.1 * (1 + (k - 1) * 0.4);
    if (etroit) {
      E.plonge.set('plonge'); E.magmaSub.set('magma'); E.ecartent.set('elles s\'écartent'); E.fissure.set('fissure');
      E.jeune.set('le plus jeune'); E.vieux.set('le plus vieux'); E.deplace.set('← la plaque bouge'); E.pointChaud.set('point chaud');
      choisir(type);
    }
  };

  /* ----- animation ----- */
  const v3 = new THREE.Vector3(), col = new THREE.Color();
  st.onFrame((dt, t) => {
    cadrer();
    const f = vitesse / 50, vp = (type === 'point-chaud' ? 0.15 : 0.25) * f;   // vitesse des plaques (plus lente au point chaud : le temps de lire)
    const [c0, c1] = TYPES[type].cellules;

    // boucles de convection : elles remontent toutes deux le long du magma, au milieu, puis s'en écartent par le haut
    for (let i = 0; i < N; i++) {
      const g = G[i];
      g.a += (g.k ? -1 : 1) * (0.3 + 0.5 * f) * dt * (0.8 + 0.2 / g.r);
      conv.setPos(i, (g.k ? c1 : c0) + AX * g.r * Math.cos(g.a), CY + AY * g.r * Math.sin(g.a), g.z);
    }
    conv.commit();

    // gouttes de magma : d'où elles partent, où elles arrivent
    let x0 = 0, y0 = 0.3, y1 = HM + EC + 0.5, actifPC = null;
    if (type === 'subduction') { x0 = XV - 0.05; y0 = 1.05; y1 = HM - 0.05 + HC + 0.7; }
    if (type === 'point-chaud') { actifPC = volcans.find((v) => v.vivant && v.actif); x0 = XPC; y0 = 0.15; y1 = actifPC ? HM + EC + actifPC.h * 0.9 : HM - 0.05; }
    const debit = type === 'point-chaud' ? 1 : f;     // le point chaud alimente toujours ; ailleurs, ça suit les plaques
    for (let i = 0; i < NB; i++) {
      const b = B[i];
      b.u += dt * 0.32 * Math.max(0.15, debit); if (b.u >= 1) { b.u -= 1; b.dx = rand(-0.12, 0.12); }
      const y = y0 + (y1 - y0) * b.u, x = x0 + b.dx * (1 - b.u) + 0.04 * Math.sin(t * 3 + i);
      const vis = type !== 'subduction' || f > 0 ? 1 : (b.u < 0.15 ? 1 : 0.01);
      bulles.setPos(i, x, y, b.z * (1 - b.u * 0.6), vis * (0.75 + 0.35 * (1 - b.u)));
      bulles.setColor(i, col.copy(COL.magma).lerp(chaud, b.u));
    }
    bulles.commit();

    if (type === 'subduction') {
      for (const sg of segSub) {
        sg.s += vp * dt; if (sg.s >= FIN) sg.s -= FIN;
        const [x, y, r] = posSeg(sg.s);
        sg.m.position.set(x, y, 0); sg.m.rotation.z = r;
        sg.m.scale.x = pasS * 0.97 * clamp(sg.s / 0.3, 0.1, 1) * clamp((FIN - sg.s) / 0.35, 0.05, 1);
        sg.m.material.color.copy(COL.croute).lerp(COL.magma, clamp((sg.s - (FIN - 1.1)) / 1.1, 0, 1));   // la plaque devient du magma
      }
      laveSub.scale.setScalar(f > 0 ? 1 + 0.35 * Math.sin(t * 4) : 0.6);
      for (const fu of fumees) {
        fu.u += dt * 0.25; if (fu.u >= 1) fu.u -= 1;
        fu.m.position.set(XV + 0.25 * fu.u, HM - 0.05 + HC + 0.85 + fu.u * 1.1, 0);
        fu.m.scale.setScalar(0.6 + fu.u * 1.6); fu.m.material.opacity = (f > 0 ? 0.5 : 0.2) * (1 - fu.u);
      }
      ex.set(f > 0 ? TYPES.subduction.bouge : TYPES.subduction.arret);
    } else if (type === 'accretion') {
      for (const sg of segAcc) {
        sg.s += vp * dt; if (sg.s >= L) sg.s -= L;
        sg.m.position.set(sg.cote * sg.s, HM + EC / 2, 0);
        sg.m.scale.x = pasA * 0.97 * clamp(sg.s / 0.25, 0.1, 1) * clamp((L - sg.s) / 0.25, 0.05, 1);
        sg.m.material.color.copy(COL.neuve).lerp(COL.croute, clamp(sg.s / 0.8, 0, 1));
      }
      fissure.material.color.setHSL(0.06, 1, 0.45 + 0.12 * Math.sin(t * 3) * Math.min(1, f));
      laveAcc.scale.setScalar(f > 0 ? 1 + 0.35 * Math.sin(t * 4) : 0.6);
      fleches.forEach((a) => { a.visible = f > 0; });
      ex.set(f > 0 ? TYPES.accretion.bouge : TYPES.accretion.arret);
    } else {
      for (const sg of segPC) {
        sg.s += vp * dt; if (sg.s >= 2 * L) sg.s -= 2 * L;
        sg.m.position.set(L - sg.s, HM + EC / 2, 0);
        sg.m.scale.x = pasP * 1.01 * clamp(sg.s / 0.25, 0.1, 1) * clamp((2 * L - sg.s) / 0.25, 0.05, 1);
      }
      // les volcans suivent la plaque ; celui qui est au-dessus du point chaud grandit, les autres s'éteignent
      let jeune = null, vieux = null;
      for (const v of volcans) {
        if (!v.vivant) continue;
        v.x -= vp * dt; v.age += dt;
        if (v.actif && Math.abs(v.x - XPC) > 0.45) v.actif = false;
        if (v.actif) v.h = Math.min(0.66, v.h + dt * 0.2);
        if (v.x < -L + 0.35) { v.vivant = false; v.m.visible = false; v.l.visible = false; continue; }
        const bord = clamp((v.x + L - 0.35) / 0.5, 0, 1);
        v.m.visible = true; v.m.scale.set(0.4 * bord, v.h * bord, 0.4 * bord); v.m.position.set(v.x, HM + EC + (v.h * bord) / 2, 0);
        v.m.material.color.copy(v.actif ? COL.actif : COL.eteint);
        v.l.visible = v.actif; v.l.position.set(v.x, HM + EC + v.h, 0); v.l.scale.setScalar(1 + 0.35 * Math.sin(t * 4));
        if (!jeune || v.x > jeune.x) jeune = v;
        if (!vieux || v.x < vieux.x) vieux = v;
      }
      if (!jeune || jeune.x < XPC - ECART) { // un autre volcan se forme au-dessus du point chaud
        const libre = volcans.find((v) => !v.vivant);
        if (libre) { Object.assign(libre, { x: XPC, h: 0.04, actif: true, vivant: true, age: 0 }); jeune = libre; }
      }
      if (jeune) ancreJeune.position.set(jeune.x, HM + EC + jeune.h, 0);
      if (vieux && vieux !== jeune) ancreVieux.position.set(vieux.x, HM + EC + vieux.h, 0);
      E.jeune.show(!!jeune); E.vieux.show(!!vieux && vieux !== jeune);
      const P3 = TYPES['point-chaud'];
      ex.set(f === 0 ? P3.arret : jeune && jeune.actif ? P3.forme : P3.quitte);
    }
  });

  return { dispose() { st.dispose(); } };
}
