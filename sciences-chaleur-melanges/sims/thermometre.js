// thermometre.js — « Du thermoscope au thermomètre : graduer avec 2 repères » (thème 5, partie C).
// Un thermomètre sans graduation : glace fondante → repère 0, vapeur de l'eau en ébullition → repère 100,
// 100 parties égales → échelle Celsius. Ensuite, mode libre : on mesure les objets du cours.
import { THREE, C, layout, createStage, panel, explain, beaker, ground, molecules, liquidMaterial, glassMaterial, tempColor, rand } from './kit.js';

// Hauteur du liquide dans le tube (repère local du thermomètre) : de −20 °C (Y0) à 120 °C (Y1).
const TMIN = -20, TMAX = 120, Y0 = 0.2, Y1 = 2.55;
const yOf = (T) => Y0 + ((T - TMIN) / (TMAX - TMIN)) * (Y1 - Y0);
const nb = (v) => String(Math.round(v * 10) / 10).replace('.', ',').replace('-', '−');
const Y_RES = { none: 0.85, ice: 0.3, boil: 1.15 }; // hauteur du réservoir selon le poste
const Y_HAUT = 1.62;                                 // thermomètre levé, au-dessus des béchers
const T_POSTE = { ice: 0, boil: 100 };
const ease = (p) => p * p * (3 - 2 * p);
const BOUTON = ['1. Plonger dans la glace fondante', 'Marquer le repère 0', "2. Placer dans la vapeur de l'eau en ébullition", 'Marquer le repère 100', '3. Diviser en 100 parties égales'];
const ETAPE = ['1 sur 3 : repère 0', '1 sur 3 : repère 0', '2 sur 3 : repère 100', '2 sur 3 : repère 100', '3 sur 3 : 100 parties', '3 sur 3 : 100 parties', 'gradué ✓'];

const TXT = {
  start: "Ce thermomètre n'a pas encore de graduation : pour l'instant, c'est un simple <mark>thermoscope</mark>. Pour <mark>uniformiser les comparaisons</mark>, il faut une <mark>échelle</mark>, donc <mark>deux repères</mark>.",
  move: 'On déplace le thermomètre…',
  iceMove: "Le liquide se <mark>contracte</mark> : son niveau descend dans le <mark>tube capillaire</mark>. Attends qu'il se stabilise.",
  iceOk: "Le niveau ne bouge plus : c'est la température de la <mark>glace fondante</mark> (mélange eau + glace). Marque le <mark>repère 0</mark>.",
  mark0: "Premier repère marqué. Pour une échelle, il faut un <mark>deuxième repère</mark> : la vapeur de l'eau en ébullition.",
  boilMove: "Le liquide se <mark>dilate</mark> : il monte dans le <mark>tube capillaire</mark>. Au-dessus de lui, c'est le <mark>vide d'air</mark>.",
  boilOk: "Le niveau est stable : c'est la température de l'<mark>eau en ébullition</mark> (la vapeur juste au-dessus de l'eau qui bout). Marque le <mark>repère 100</mark>.",
  mark100: "Tu as tes <mark>deux repères</mark>. Il reste à diviser l'espace entre 0 et 100 en 100 parties égales.",
  divide: 'On divise en 100 parties égales…',
  done: "Pour aller plus loin : chaque partie vaut 1 degré. C'est l'<mark>échelle Celsius</mark> (°C). Le <mark>thermomètre</mark> est un <mark>thermoscope gradué</mark> qui permet de <mark>repérer la température</mark>. À la <mark>pression atmosphérique normale</mark> : repère 0 = glace fondante, repère 100 = eau en ébullition.",
  corps: "37,6 °C est la <mark>température</mark> du corps humain. Lis-la sur la <mark>graduation</mark> : le liquide s'arrête un peu au-dessus de 37.",
  glace: "Dans la <mark>glace fondante</mark>, le liquide s'arrête pile au <mark>repère 0</mark> : 0 °C.",
  ebul: "Dans la vapeur de l'<mark>eau en ébullition</mark>, le liquide s'arrête au <mark>repère 100</mark> : 100 °C.",
  montagne: "Les « −10 degrés » de la montagne d'Églantine : le liquide se <mark>contracte</mark> et descend sous le repère 0. Sur la graduation prolongée, tu lis <mark>−10 °C</mark>.",
  air: 'Quand la température du milieu monte, le liquide se <mark>dilate</mark> et monte dans le <mark>tube capillaire</mark>. Quand elle baisse, il se <mark>contracte</mark> et descend.',
};

// Halo doux (vapeur, ambiance)
function softTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d'), gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.45, 'rgba(255,255,255,.4)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
// Grille métallique avec centre en céramique
function wireTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d');
  g.strokeStyle = 'rgba(200,205,220,.7)'; g.lineWidth = 2;
  for (let i = 6; i < 256; i += 12) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, 256); g.moveTo(0, i); g.lineTo(256, i); g.stroke(); }
  g.lineWidth = 8; g.strokeStyle = 'rgba(160,165,180,.95)'; g.strokeRect(4, 4, 248, 248);
  g.fillStyle = 'rgba(235,232,225,.9)'; g.beginPath(); g.arc(128, 128, 64, 0, 7); g.fill();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
const UP = new THREE.Vector3(0, 1, 0);
function rod(a, b, r, mat) {
  const d = new THREE.Vector3().subVectors(b, a), m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, d.length(), 8), mat);
  m.position.addVectors(a, b).multiplyScalar(0.5); m.quaternion.setFromUnitVectors(UP, d.normalize()); return m;
}

export default function mount(root) {
  const { stageEl, panelEl, explainEl } = layout(root);
  const st = createStage(stageEl, { camera: { pos: [0, 2.8, 6.2], target: [0, 2.05, 0] }, minDistance: 3, maxDistance: 11 });
  const ex = explain(explainEl), scene = st.scene, ctl = st.controls;
  let userMoved = false, lastAsp = 0, gone = false;
  const onStart = () => { userMoved = true; };
  if (ctl) { ctl.minAzimuthAngle = -0.75; ctl.maxAzimuthAngle = 0.75; ctl.addEventListener('start', onStart); }
  scene.add(ground());
  const soft = softTexture();
  const iron = new THREE.MeshStandardMaterial({ color: 0x5d6170, metalness: 0.5, roughness: 0.5 });
  const metal = new THREE.MeshStandardMaterial({ color: C.metal, metalness: 0.6, roughness: 0.35 });
  const s = { step: 0, mark0: false, mark100: false, div: 0, ext: 0, drawn: '', want: 'none', cur: 'none', T: 20, air: 20, obj: null, stable: false };
  const label = (html, parent, pos, cls = '') => { const a = new THREE.Object3D(); a.position.set(...pos); parent.add(a); return st.label(html, a, { cls }); };

  // ---------- Statif (pied + tige) ----------
  const foot = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.06, 0.42), iron); foot.position.set(0, 0.03, -0.85);
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 4.8, 12), iron); pole.position.set(0, 2.4, -0.85);
  scene.add(foot, pole);

  // ---------- Thermomètre ----------
  const th = new THREE.Group(); th.position.y = Y_RES.none; scene.add(th);
  // planchette : vierge au départ, on y trace les repères puis la graduation (canvas)
  const BW = 0.62, BX = 0.17, BB = 0.1, BT = 2.72, PX = 800;
  const cv = document.createElement('canvas'); cv.width = Math.round(BW * PX); cv.height = Math.round((BT - BB) * PX);
  const ctx = cv.getContext('2d');
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = st.renderer.capabilities.getMaxAnisotropy();
  const board = new THREE.Mesh(new THREE.PlaneGeometry(BW, BT - BB), new THREE.MeshBasicMaterial({ map: tex, alphaTest: 0.5 }));
  board.position.set(BX, (BB + BT) / 2, -0.1); th.add(board);
  const px = (x) => (x - (BX - BW / 2)) * PX, py = (y) => (BT - y) * PX;
  const FONT = (n) => `700 ${n}px "Bricolage Grotesque", "Instrument Sans", sans-serif`;
  function drawBoard() {
    const W = cv.width, H = cv.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#efe8d6'; ctx.beginPath(); ctx.roundRect(2, 2, W - 4, H - 4, 46); ctx.fill();
    ctx.fillStyle = 'rgba(29,27,47,.09)'; ctx.fillRect(px(-0.075), py(BT - 0.04), 0.15 * PX, (BT - BB - 0.08) * PX);
    ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
    // les repères, tracés au marqueur
    const rep = (T, txt) => {
      const y = py(yOf(T)); ctx.strokeStyle = '#2b3fd6'; ctx.lineWidth = 10;
      ctx.beginPath(); ctx.moveTo(px(-0.12), y); ctx.lineTo(px(0.24), y); ctx.stroke();
      if (s.div === 0) { ctx.fillStyle = '#2b3fd6'; ctx.font = FONT(96); ctx.fillText(txt, px(0.27), y); }
    };
    if (s.mark0) rep(0, '0');
    if (s.mark100) rep(100, '100');
    // la graduation : 100 parties égales entre les deux repères, puis prolongée de 10 de chaque côté
    ctx.strokeStyle = ctx.fillStyle = '#1d1b2f';
    const tick = (T) => {
      const y = py(yOf(T)), big = T % 10 === 0, mid = T % 5 === 0;
      ctx.lineWidth = big ? 6 : 3.5; ctx.beginPath(); ctx.moveTo(px(0.075), y); ctx.lineTo(px(0.075 + (big ? 0.15 : mid ? 0.1 : 0.06)), y); ctx.stroke();
      if (big) { ctx.font = FONT(84); ctx.fillText(nb(T), px(0.26), y); }
    };
    if (s.div > 0) for (let T = 0, n = Math.floor(s.div * 100 + 1e-6); T <= n; T++) tick(T);
    for (let k = 1, e = Math.floor(s.ext * 10 + 1e-6); k <= e; k++) { tick(-k); tick(100 + k); }
    if (s.ext >= 1) { ctx.font = FONT(100); ctx.fillText('°C', px(0.24), py(2.6)); }
    tex.needsUpdate = true;
  }
  drawBoard();
  if (document.fonts) document.fonts.ready.then(() => { if (!gone) drawBoard(); });

  const glass = glassMaterial({ opacity: 0.3 });
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 2.83, 32, 1, true), glass); stem.position.y = 0.12 + 2.83 / 2;
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.07, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), glass); cap.position.y = 2.95;
  const bulbGlass = new THREE.Mesh(new THREE.SphereGeometry(0.125, 32, 20), glass); bulbGlass.scale.set(1, 1.45, 1);
  const liqMat = new THREE.MeshStandardMaterial({ color: 0xe23a2e, emissive: 0x4a0804, roughness: 0.3 });
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.1, 32, 20), liqMat); bulb.scale.set(1, 1.45, 1);
  const bore = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 2.82, 12, 1, true), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.18, depthWrite: false }));
  bore.position.y = 0.1 + 1.41;
  const colGeo = new THREE.CylinderGeometry(0.022, 0.022, 1, 16); colGeo.translate(0, 0.5, 0);
  const column = new THREE.Mesh(colGeo, liqMat); column.position.y = 0.1;
  // pince du statif (elle glisse le long de la tige avec le thermomètre)
  const clampRing = new THREE.Mesh(new THREE.TorusGeometry(0.085, 0.022, 8, 24), iron); clampRing.rotation.x = Math.PI / 2; clampRing.position.y = 2.82;
  const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.76, 10), iron); arm.rotation.x = Math.PI / 2; arm.position.set(0, 2.82, -0.47);
  const boss = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.13, 0.13), iron); boss.position.set(0, 2.82, -0.85);
  th.add(stem, cap, bulbGlass, bulb, bore, column, clampRing, arm, boss);
  // halo autour du réservoir : la température du milieu (mode libre)
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: soft, color: 0xffffff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
  halo.scale.set(1.1, 1.1, 1); th.add(halo);

  // ---------- Étiquettes des 4 parties (comme dans le cours, de haut en bas) ----------
  const lineMat = new THREE.LineBasicMaterial({ color: 0xd9d3ff, transparent: true, opacity: 0.6 });
  function callout(html, from, to) {
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(...from), new THREE.Vector3(...to)]), lineMat);
    th.add(line); const L = label(html, th, to);
    return { show(on) { line.visible = on; L.show(on); } };
  }
  callout('le tube capillaire', [-0.06, 2.9, 0.03], [-0.95, 3.02, 0.03]);
  callout("le vide d'air", [-0.02, 2.58, 0.03], [-0.95, 2.45, 0.03]);
  const cGrad = callout('une graduation', [0.12, yOf(70), -0.07], [-0.95, yOf(70), 0.03]);
  callout("le réservoir de mercure<br>ou d'alcool coloré", [-0.11, 0, 0.03], [-1.05, 0, 0.03]);
  cGrad.show(false);
  const L0 = label('repère 0', th, [0.85, yOf(0), 0], 'fluo'), L100 = label('repère 100', th, [0.85, yOf(100), 0], 'fluo');
  const aV = new THREE.Object3D(); aV.position.x = 0.85; th.add(aV);
  const LV = st.label('', aV, { cls: 'fluo' });
  const objL = label('', scene, [1.3, 0.45, 0.3]);
  [L0, L100, LV, objL].forEach((L) => L.show(false));

  // ---------- Poste 1 : bécher de glace fondante ----------
  function makeIce() {
    const g = new THREE.Group(); scene.add(g);
    g.add(beaker(0.5, 0.8));
    const water = new THREE.Mesh(new THREE.CylinderGeometry(0.485, 0.485, 0.55, 40), liquidMaterial(0x6cc0ff, 0.5));
    water.position.y = 0.28; water.renderOrder = 2; g.add(water);
    const iceMat = new THREE.MeshStandardMaterial({ color: C.glace, transparent: true, opacity: 0.88, roughness: 0.12, emissive: 0x2a4f70, emissiveIntensity: 0.35 });
    const cubes = [];
    for (let i = 0; i < 8; i++) {
      const sz = rand(0.13, 0.16), a = (i / 8) * Math.PI * 2 + rand(-0.2, 0.2), r = rand(0.25, 0.31);
      const m = new THREE.Mesh(new THREE.BoxGeometry(sz, sz, sz), iceMat);
      m.position.set(Math.cos(a) * r, 0.555 - sz * 0.38, Math.sin(a) * r); m.rotation.set(rand(-0.3, 0.3), rand(3), rand(-0.3, 0.3));
      m.renderOrder = 1; g.add(m); cubes.push({ m, y: m.position.y, ph: rand(6) });
    }
    const labels = [label('glace fondante<br>(mélange eau + glace)', g, [1.3, 0.3, 0.3])];
    return { g, side: -1, p: 0, labels, update(dt, t) { for (const c of cubes) c.m.position.y = c.y + Math.sin(t * 1.3 + c.ph) * 0.006; } };
  }
  // ---------- Poste 2 : eau en ébullition sur un bec Bunsen ----------
  function makeBoil() {
    const g = new THREE.Group(); scene.add(g);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.19, 0.05, 28), metal); base.position.y = 0.025;
    const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.048, 0.34, 16), metal); tube.position.y = 0.22;
    const fm = (c, o) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
    const fOut = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.21, 18, 1, true), fm(0x4f6dff, 0.6)); fOut.position.y = 0.495;
    const fIn = new THREE.Mesh(new THREE.ConeGeometry(0.032, 0.1, 14, 1, true), fm(0x9fe6ff, 0.85)); fIn.position.y = 0.44;
    g.add(base, tube, fOut, fIn);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.017, 8, 48), iron); ring.rotation.x = Math.PI / 2; ring.position.y = 0.6; g.add(ring);
    for (const a of [-Math.PI / 2, Math.PI / 6, (5 * Math.PI) / 6]) g.add(rod(new THREE.Vector3(Math.cos(a) * 0.42, 0.6, Math.sin(a) * 0.42), new THREE.Vector3(Math.cos(a) * 0.55, 0, Math.sin(a) * 0.55), 0.016, iron));
    const grid = new THREE.Mesh(new THREE.PlaneGeometry(0.96, 0.96), new THREE.MeshBasicMaterial({ map: wireTexture(), transparent: true, depthWrite: false, side: THREE.DoubleSide }));
    grid.rotation.x = -Math.PI / 2; grid.position.y = 0.607; g.add(grid);
    const B0 = 0.612, LVL = 0.3;
    const bk = beaker(0.48, 0.75); bk.position.y = B0; g.add(bk);
    const water = new THREE.Mesh(new THREE.CylinderGeometry(0.465, 0.465, LVL, 40), liquidMaterial(0x6cc0ff, 0.5));
    water.position.y = B0 + LVL / 2 + 0.004; water.renderOrder = 2; g.add(water);
    // bulles qui se forment au sein du liquide
    const NB = 28, bub = molecules(NB, { radius: 0.028, color: 0xffffff, segments: 8 });
    Object.assign(bub.mesh.material, { transparent: true, opacity: 0.55, depthWrite: false }); bub.mesh.renderOrder = 1; g.add(bub.mesh);
    const BP = new Float32Array(NB * 4);
    const newBub = (i, y) => { const a = rand(6.283), r = Math.sqrt(Math.random()) * 0.4; BP[i * 4] = Math.cos(a) * r; BP[i * 4 + 1] = y; BP[i * 4 + 2] = Math.sin(a) * r; BP[i * 4 + 3] = rand(0.25, 0.45); };
    for (let i = 0; i < NB; i++) newBub(i, rand(0, LVL));
    // vapeur qui monte (le réservoir du thermomètre est dedans)
    const puffs = [];
    for (let i = 0; i < 16; i++) {
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: soft, color: C.vapeur, transparent: true, opacity: 0, depthWrite: false }));
      sp.renderOrder = 3; g.add(sp); puffs.push({ sp, life: i / 16, x: rand(-0.25, 0.25), z: rand(-0.25, 0.25), ph: rand(6) });
    }
    const labels = [label('eau en ébullition', g, [1.25, 0.8, 0.3]), label("vapeur d'eau", g, [-0.85, 1.95, 0.2]), label('bec Bunsen', g, [-0.8, 0.3, 0.3], 'discret')];
    return {
      g, side: 1, p: 0, labels,
      update(dt, t) {
        fOut.scale.y = 0.92 + 0.08 * Math.sin(t * 27) + 0.04 * Math.sin(t * 61); fIn.scale.y = 0.95 + 0.05 * Math.sin(t * 43);
        for (let i = 0; i < NB; i++) {
          const k = i * 4; BP[k + 1] += BP[k + 3] * dt; if (BP[k + 1] > LVL - 0.02) newBub(i, 0.02);
          bub.setPos(i, BP[k], B0 + BP[k + 1], BP[k + 2], 0.5 + (BP[k + 1] / LVL) * 0.9);
        }
        bub.commit();
        for (const P of puffs) {
          P.life += dt / 2.4; if (P.life > 1) { P.life -= 1; P.x = rand(-0.25, 0.25); P.z = rand(-0.25, 0.25); }
          const l = P.life, sc = 0.14 + l * 0.5;
          P.sp.position.set(P.x + Math.sin(l * 4 + P.ph) * 0.06, B0 + LVL + 0.04 + l * 1.05, P.z); P.sp.scale.set(sc, sc, 1);
          P.sp.material.opacity = Math.sin(l * Math.PI) * 0.3;
        }
      },
    };
  }
  const ice = makeIce(), boil = makeBoil(), POSTES = { ice, boil };

  // neige de la montagne d'Églantine
  const SN = 120, snow = molecules(SN, { radius: 0.022, color: 0xffffff, segments: 6 }), SP = new Float32Array(SN * 3);
  for (let i = 0; i < SN; i++) { SP[i * 3] = rand(-2.2, 2.2); SP[i * 3 + 1] = rand(0, 4.4); SP[i * 3 + 2] = rand(-1.2, 1.2); }
  snow.mesh.visible = false; scene.add(snow.mesh);

  // ---------- Réglages ----------
  const ui = panel(panelEl);
  ui.title('Gradue ton thermomètre');
  const rStep = ui.readout('Étape');
  const [bMain] = ui.buttons([{ label: BOUTON[0], primary: true, onClick: action }, { label: 'Recommencer', onClick: reset }]);
  const freeBox = document.createElement('div'); freeBox.style.cssText = 'display:none;flex-direction:column;gap:12px'; panelEl.appendChild(freeBox);
  const fu = panel(freeBox);
  const cObj = fu.choice({ label: 'Repère la température avec ton thermomètre', value: null, onChange: pick, options: [
    { value: 'corps', label: 'corps humain' }, { value: 'glace', label: 'glace fondante' },
    { value: 'ebul', label: 'eau en ébullition' }, { value: 'montagne', label: "montagne d'Églantine" }] });
  const sAir = fu.slider({ label: 'Ou règle la température du milieu', min: -10, max: 110, step: 0.1, value: 20, unit: '°C', format: nb, onInput: setAir });
  fu.note("Chez nous, c'est l'échelle <b>Celsius</b> qui est utilisée ; l'échelle Fahrenheit est d'application dans d'autres pays.");
  const rLevel = ui.readout('Niveau du liquide');
  const rTemp = ui.readout('Le thermomètre indique'); rTemp.el.style.display = 'none';
  const cLiq = ui.choice({ label: 'Liquide du réservoir', value: 'alcool', onChange: setLiquid, options: [{ value: 'alcool', label: 'alcool coloré' }, { value: 'mercure', label: 'mercure' }] });
  [cObj, cLiq].forEach((c) => c.el.querySelectorAll('button').forEach((b) => { b.style.minHeight = '40px'; }));

  let cache = {};
  const once = (k, v, fn) => { if (cache[k] !== v) { cache[k] = v; fn(v); } };

  function action() {
    // un repère ne se marque que si le thermomètre est stable DANS le bon poste
    if (s.step === 0) { s.want = 'ice'; s.step = 1; s.stable = false; }
    else if (s.step === 1 && s.stable && s.cur === 'ice') { s.mark0 = true; s.step = 2; L0.show(true); drawBoard(); }
    else if (s.step === 2) { s.want = 'boil'; s.step = 3; s.stable = false; }
    else if (s.step === 3 && s.stable && s.cur === 'boil') { s.mark100 = true; s.step = 4; L100.show(true); drawBoard(); }
    else if (s.step === 4) { s.step = 5; s.div = 0; s.ext = 0; }
  }
  function enterFree() {
    s.step = 6; freeBox.style.display = 'flex'; rTemp.el.style.display = '';
    cGrad.show(true); L0.show(false); L100.show(false); LV.show(true);
    cObj.set(s.want === 'boil' ? 'ebul' : null); cache.temp = null;
  }
  function reset() {
    Object.assign(s, { step: 0, mark0: false, mark100: false, div: 0, ext: 0, drawn: '', want: 'none', air: 20, obj: null });
    freeBox.style.display = 'none'; rTemp.el.style.display = 'none';
    cGrad.show(false); [L0, L100, LV, objL].forEach((L) => L.show(false));
    cObj.set(null); sAir.set(20); drawBoard();
  }
  function pick(k) {
    s.obj = k;
    if (k === 'glace') s.want = 'ice';
    else if (k === 'ebul') s.want = 'boil';
    else { s.want = 'none'; s.air = k === 'corps' ? 37.6 : -10; }
    sAir.set(k === 'glace' ? 0 : k === 'ebul' ? 100 : s.air);
    objL.set(k === 'corps' ? 'corps humain' : "montagne d'Églantine<br>« −10 degrés »");
  }
  function setAir(v) { s.obj = 'air'; s.air = v; s.want = 'none'; cObj.set(null); }
  function setLiquid(v) {
    const hg = v === 'mercure';
    liqMat.color.set(hg ? 0x9aa3b2 : 0xe23a2e); liqMat.emissive.set(hg ? 0x22262e : 0x4a0804);
    liqMat.metalness = hg ? 0.5 : 0; liqMat.roughness = hg ? 0.2 : 0.3;
  }
  function texte(inPlace) {
    const ok = s.stable;
    switch (s.step) {
      case 0: return TXT.start;
      case 1: return !inPlace ? TXT.move : ok ? TXT.iceOk : TXT.iceMove;
      case 2: return TXT.mark0;
      case 3: return !inPlace ? TXT.move : ok ? TXT.boilOk : TXT.boilMove;
      case 4: return TXT.mark100;
      case 5: return TXT.divide;
      default: return !s.obj ? TXT.done : !inPlace && s.obj !== 'air' ? TXT.move : TXT[s.obj];
    }
  }
  // cadrage : tout le thermomètre et ses étiquettes, quelle que soit la forme de l'écran
  function fit() {
    const { w, h } = st.size(), asp = w / h || 1.3, tn = Math.tan((st.camera.fov * Math.PI) / 360);
    const d = Math.max(2.25 / tn, 2.05 / (tn * asp)) * 1.05, e = 0.13;
    st.camera.position.set(0, 2.05 + d * Math.sin(e), d * Math.cos(e));
    if (ctl) { ctl.target.set(0, 2.05, 0); ctl.update(); } else st.camera.lookAt(0, 2.05, 0);
    lastAsp = asp;
  }
  fit();

  st.onFrame((dt, t) => {
    // 1) postes et hauteur du thermomètre : on le lève, on change de bécher, on le replonge
    let target;
    if (s.cur !== s.want) {
      target = Y_HAUT;
      if (th.position.y > Y_HAUT - 0.02) { const P = POSTES[s.cur]; if (P) P.p = Math.max(0, P.p - dt * 2); if (!P || P.p === 0) s.cur = s.want; }
    } else {
      const P = POSTES[s.cur];
      if (P && P.p < 1) { target = Y_HAUT; if (th.position.y > Y_HAUT - 0.02) P.p = Math.min(1, P.p + dt * 2); } else target = Y_RES[s.cur];
    }
    th.position.y += (target - th.position.y) * (1 - Math.exp(-dt * 6));
    if (Math.abs(target - th.position.y) < 0.002) th.position.y = target;
    for (const k in POSTES) {
      const P = POSTES[k]; P.g.visible = P.p > 0; P.g.position.x = P.side * 4.3 * (1 - ease(P.p));
      P.labels.forEach((L) => L.show(P.p > 0.97)); if (P.g.visible) P.update(dt, t);
    }
    const inPlace = s.cur === s.want && th.position.y === Y_RES[s.cur];
    // 2) le liquide se dilate ou se contracte jusqu'à se stabiliser
    const Te = s.cur === 'none' ? s.air : T_POSTE[s.cur];
    if (inPlace) { s.T += (Te - s.T) * (1 - Math.exp(-dt / 0.55)); if (Math.abs(Te - s.T) < 0.05) s.T = Te; }
    s.stable = inPlace && s.T === Te;
    column.scale.y = yOf(s.T) - 0.1; aV.position.y = yOf(s.T);
    // 3) graduation en cours
    if (s.step === 5) {
      if (s.div < 1) s.div = Math.min(1, s.div + dt / 1.8); else s.ext = Math.min(1, s.ext + dt / 0.6);
      const key = Math.floor(s.div * 100 + 1e-6) + ':' + Math.floor(s.ext * 10 + 1e-6);
      if (key !== s.drawn) { s.drawn = key; drawBoard(); }
      if (s.ext >= 1) enterFree();
    }
    // 4) décor du mode libre : halo du milieu, neige de la montagne
    const free = s.step === 6, open = free && s.cur === 'none' && s.want === 'none';
    halo.material.opacity += ((open ? 0.55 : 0) - halo.material.opacity) * Math.min(1, dt * 4);
    halo.visible = halo.material.opacity > 0.01;
    if (halo.visible) tempColor((s.air + 10) / 120, halo.material.color);
    snow.mesh.visible = open && s.obj === 'montagne';
    if (snow.mesh.visible) {
      for (let i = 0; i < SN; i++) {
        const k = i * 3; SP[k + 1] -= dt * (0.32 + (i % 5) * 0.05); SP[k] += Math.sin(t * 0.8 + i) * dt * 0.08;
        if (SP[k + 1] < 0) SP[k + 1] = 4.4; snow.setPos(i, SP[k], SP[k + 1], SP[k + 2]);
      }
      snow.commit();
    }
    objL.show(open && inPlace && (s.obj === 'corps' || s.obj === 'montagne'));
    // 5) réglages et explication
    once('btn', s.step < 5 ? BOUTON[s.step] : '', (v) => { bMain.textContent = v; bMain.style.display = v ? '' : 'none'; });
    once('dis', (s.step === 1 || s.step === 3) && !s.stable, (v) => { bMain.disabled = v; });
    once('etape', ETAPE[s.step], (v) => rStep.set(v));
    once('lvl', !inPlace ? 'on le déplace' : s.stable ? 'stable ✓' : s.T > Te ? 'il descend ▼' : 'il monte ▲', (v) => rLevel.set(v));
    if (free) once('temp', nb(s.T) + ' °C', (v) => { rTemp.set(v); LV.set('◀ ' + v); });
    ex.set(texte(inPlace));
    if (!userMoved) { const { w, h } = st.size(); if (Math.abs(w / h - lastAsp) > 0.02) fit(); }
  });

  // Banc d'essai : ?essai=3 saute à l'étape 3 ; ?essai=6,corps (corps|glace|ebul|montagne) ouvre le mode libre.
  const [e0, obj] = (new URLSearchParams(location.search).get('essai') || '').split(','), etat = +e0 || 0;
  if (etat > 0) {
    const snap = (k, T) => { s.want = s.cur = k; ice.p = k === 'ice' ? 1 : 0; boil.p = k === 'boil' ? 1 : 0; th.position.y = Y_RES[k]; s.T = T; };
    if (etat >= 1) { s.step = 1; snap('ice', 6); }
    if (etat >= 2) { s.step = 2; s.mark0 = true; L0.show(true); s.T = 0; }
    if (etat >= 3) { s.step = 3; snap('boil', 100); }
    if (etat >= 4) { s.step = 4; s.mark100 = true; L100.show(true); }
    if (etat >= 5) { s.div = 1; s.ext = 1; enterFree(); }
    if (etat >= 5 && ['corps', 'glace', 'ebul', 'montagne'].includes(obj)) { cObj.set(obj); pick(obj); snap(s.want, obj === 'glace' ? 0 : obj === 'ebul' ? 100 : s.air); }
    drawBoard();
  }

  return { dispose() { gone = true; if (ctl) ctl.removeEventListener('start', onStart); st.dispose(); } };
}
