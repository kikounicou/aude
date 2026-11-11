// thermoscope.js — « Le thermoscope : dilatation et contraction » (thème 5, partie B).
// On déplace le thermoscope d'un bécher à l'autre : le niveau d'eau colorée monte (dilatation) ou descend
// (contraction). Une loupe montre l'agitation moléculaire. Bonus « dans la vraie vie » : l'espace entre 2 rails.
import { THREE, C, layout, createStage, panel, explain, beaker, ground, molecules, glassMaterial, liquidMaterial, tempColor, clamp, rand } from './kit.js';

const BX = [-2.4, 0, 2.4];            // les 3 béchers
const T_DEF = [0.18, 0.5, 0.82];      // froid, tiède, chaud : pas de °C, le thermoscope COMPARE
const LEVEL0 = 1.62, GAIN = 1.25;     // niveau au repère (bain de départ) et sensibilité, exagérée mais plausible
const VIOLET = 0x9b6bff;              // eau colorée
const mot = (T) => (T < 0.1 ? 'très froid' : T < 0.36 ? 'froid' : T < 0.64 ? 'tiède' : T < 0.9 ? 'chaud' : 'très chaud');
const clsT = (T) => (T < 0.36 ? 'froid' : T < 0.64 ? '' : 'chaud');
const PALE = new THREE.Color(0xd6ecff), FROID = new THREE.Color(C.froid), CHAUD = new THREE.Color(C.chaud);
const bathColor = (T, out) => (T < 0.5 ? out.copy(FROID).lerp(PALE, T * 2) : out.copy(PALE).lerp(CHAUD, (T - 0.5) * 2));
const ease = (v, to, dt, k) => (Math.abs(to - v) < 0.002 ? to : v + (to - v) * (1 - Math.exp(-k * dt)));
const std = (color, o) => new THREE.MeshStandardMaterial(Object.assign({ color, roughness: 0.6 }, o));
function put(parent, geo, mat, x = 0, y = 0, z = 0) { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); parent.add(m); return m; }

// Phrases du texte à trous du cours (p. 4) et de la recherche à domicile (p. 5).
const TXT = {
  transit: (i) => `Le thermoscope sort de l'eau et passe dans le <b>bécher ${i + 1}</b>…`,
  monte: "La <mark>chaleur</mark> de l'eau du bécher se transmet au <mark>thermoscope</mark> : <mark>élévation</mark> du niveau d'eau colorée. Les <mark>molécules</mark> d'eau colorée reçoivent un supplément d'<mark>énergie</mark> : leur <mark>agitation moléculaire</mark> augmente, elles occupent plus d'espace. C'est le phénomène de <mark>dilatation</mark>.",
  descend: "C'est l'eau colorée qui <mark>transmet</mark> son énergie à l'eau du bécher : <mark>diminution</mark> de l'agitation moléculaire. Le liquide coloré occupe moins de place, donc le niveau d'eau colorée <mark>descend</mark>. C'est le phénomène de <mark>contraction</mark>.",
  depart: "Le thermoscope est dans le <b>bécher 2</b> : le niveau d'eau colorée est au <mark>repère</mark> de départ. Déplace-le dans le bécher 3 ou le bécher 1 pour <mark>comparer</mark>.",
  egal: "Le niveau est au <mark>repère</mark> : la température de ce bain est la même que celle du bain de départ.",
  haut: "Le niveau s'est arrêté <b>plus haut que le repère</b> : l'eau colorée s'est <mark>dilatée</mark>. La température de ce bain est plus élevée que celle du bain de départ. Le thermoscope permet de <mark>comparer</mark>.",
  bas: "Le niveau s'est arrêté <b>plus bas que le repère</b> : l'eau colorée s'est <mark>contractée</mark>. La température de ce bain est moins élevée que celle du bain de départ. Le thermoscope permet de <mark>comparer</mark>.",
  railFroid: "Il fait froid : les rails sont plus courts et l'<mark>espace entre 2 rails</mark> est large. Monte la température pour voir ce qui se passe.",
  railChaud: "La température monte : le métal des rails se <mark>dilate</mark>, les rails s'allongent et l'espace se referme. Cet espace sert <mark>à éviter que les rails se déforment</mark> lors d'une élévation importante de la température.",
  sansFroid: "Ici, les rails sont posés <b>sans espace</b>. Monte la température…",
  sansChaud: "Sans espace, les rails n'ont pas la place de s'allonger : ils <mark>se déforment</mark> ! Voilà pourquoi on laisse un espace entre 2 rails : à cause de la <mark>dilatation</mark>.",
};

export default function mount(root) {
  const { stageEl, panelEl, explainEl } = layout(root);
  const st = createStage(stageEl, { camera: { pos: [0, 2.9, 8.5], target: [0, 1.35, 0], fov: 40 }, maxDistance: 24 });
  const { scene, camera, controls } = st;
  scene.add(ground(26));
  const q = new URLSearchParams(location.search);
  const ex = explain(explainEl);
  const labels = [];
  const lab = (tx, obj, cls) => { const l = st.label(tx, obj, { cls }); labels.push(l); return l; };
  // étiquette posée à droite (s > 0) ou à gauche (s < 0) de son point d'accroche
  const side = (l, s) => { l.el.style.translate = s > 0 ? 'calc(50% + 6px) 0' : 'calc(-50% - 6px) 0'; };
  const anchor = (parent, x, y) => { const o = new THREE.Object3D(); o.position.set(x, y, 0); parent.add(o); return o; };
  const tmpC = new THREE.Color();

  // ---------- Les 3 béchers d'eau ----------
  const thermoWorld = new THREE.Group(); scene.add(thermoWorld);
  const baths = T_DEF.slice(), waters = [], ices = [], bLabels = [];
  const glaceMat = new THREE.MeshStandardMaterial({ color: C.glace, transparent: true, opacity: 0.85, roughness: 0.15 });
  BX.forEach((x, i) => {
    const b = beaker(0.62, 1.0); b.position.x = x; thermoWorld.add(b);
    b.traverse((o) => { o.renderOrder = 3; });
    const w = put(thermoWorld, new THREE.CylinderGeometry(0.6, 0.6, 0.72, 40), liquidMaterial(C.eau, 0.42), x, 0.37, 0);
    w.renderOrder = 2; waters.push(w);
    ices.push({ amt: 0, cubes: [0, 1, 2].map(() => { const c = put(thermoWorld, new THREE.BoxGeometry(0.13, 0.13, 0.13), glaceMat); c.renderOrder = 1; return c; }) });
    bLabels.push(lab('', new THREE.Vector3(x, -0.34, 0.45)));
  });
  function refreshBaths() {
    baths.forEach((T, i) => {
      waters[i].material.color.copy(bathColor(T, tmpC));
      bLabels[i].set(`Bécher ${i + 1}<br>${mot(T)}`);
      bLabels[i].el.className = 'sim-label ' + clsT(T);
    });
  }

  // ---------- Le thermoscope : erlenmeyer + bouchon + tube en verre fin + eau colorée ----------
  const thermo = new THREE.Group(); thermoWorld.add(thermo);
  const V2 = (a) => a.map(([x, y]) => new THREE.Vector2(x, y));
  const flask = put(thermo, new THREE.LatheGeometry(V2([[0, 0], [0.4, 0], [0.43, 0.025], [0.44, 0.07], [0.14, 0.6], [0.11, 0.66], [0.11, 0.84], [0.125, 0.86]]), 40), glassMaterial({ opacity: 0.25 }));
  flask.renderOrder = 3;
  const colMat = new THREE.MeshStandardMaterial({ color: VIOLET, emissive: VIOLET, emissiveIntensity: 0.35, roughness: 0.3 });
  put(thermo, new THREE.LatheGeometry(V2([[0, 0.015], [0.385, 0.015], [0.415, 0.06], [0.125, 0.6], [0.096, 0.66], [0.096, 0.76], [0, 0.76]]), 40), colMat);
  put(thermo, new THREE.CylinderGeometry(0.118, 0.098, 0.17, 20), std(0xb5895a, { roughness: 0.9 }), 0, 0.8, 0); // bouchon
  put(thermo, new THREE.CylinderGeometry(0.058, 0.058, 2.0, 18, 1, true), glassMaterial({ opacity: 0.4 }), 0, 1.72, 0).renderOrder = 3;
  const col = put(thermo, new THREE.CylinderGeometry(0.042, 0.042, 1, 14), colMat);
  const repere = put(thermo, new THREE.TorusGeometry(0.068, 0.014, 6, 28), new THREE.MeshBasicMaterial({ color: C.fluo }), 0, LEVEL0, 0);
  repere.rotation.x = Math.PI / 2;
  const aTube = anchor(thermo, 0.07, 2.6), aCol = anchor(thermo, 0.05, LEVEL0), aErl = anchor(thermo, 0.44, 0.3);
  const aRep = anchor(thermo, -0.07, LEVEL0), aBou = anchor(thermo, -0.13, 0.82);
  const lTube = lab('tube en verre fin', aTube), lCol = lab('eau colorée', aCol), lErl = lab('erlenmeyer', aErl);
  const lRep = lab('repère', aRep, 'fluo'), lBou = lab('bouchon', aBou);
  const thermoLabels = [lTube, lCol, lErl, lRep, lBou, ...bLabels];
  function setSide(s) { // les étiquettes vont du côté où il y a de la place
    aTube.position.x = s * 0.1; aCol.position.x = s * 0.09; aErl.position.x = s * 0.44; aRep.position.x = -s * 0.1; aBou.position.x = -s * 0.13;
    [lTube, lCol, lErl].forEach((l) => side(l, s)); [lRep, lBou].forEach((l) => side(l, -s));
  }

  // vapeur au-dessus des bains chauds
  const NS = 45, steam = molecules(NS, { radius: 0.04, color: C.vapeur, segments: 8 });
  steam.mesh.material.dispose();
  steam.mesh.material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4, depthWrite: false });
  thermoWorld.add(steam.mesh);
  const sp = Array.from({ length: NS }, () => ({ age: 1, life: 1, x: 0, y: 0, z: 0 }));
  let steamAcc = 0;

  // ---------- Bonus : les rails de chemin de fer ----------
  const railsWorld = new THREE.Group(); railsWorld.visible = false; scene.add(railsWorld);
  const RL = 3.0, G0 = 0.36, GAUGE = 0.55, EMAX = 0.16 / RL; // espace à froid exagéré pour qu'on le voie
  put(railsWorld, new THREE.BoxGeometry(7.6, 0.14, 2.1), std(0x4a4558, { roughness: 1 }), 0, 0.07, 0);
  const traverse = std(0x6b4a2e, { roughness: 0.9 });
  for (let x = -3.025; x < 3.1; x += 0.55) put(railsWorld, new THREE.BoxGeometry(0.24, 0.09, 1.6), traverse, x, 0.185, 0);
  const railMat = std(0xb8bcc8, { metalness: 0.65, roughness: 0.35, emissive: C.chaud, emissiveIntensity: 0 });
  const segs = [];
  for (const z of [-GAUGE, GAUGE]) for (const k of [-1, 1]) {
    const xFar = k * (G0 / 2 + RL), xJ = k * G0 / 2;
    for (const [w, h, y] of [[0.16, 0.035, 0.2475], [0.04, 0.1, 0.315], [0.09, 0.05, 0.39]]) { // patin, âme, champignon
      const geo = new THREE.BoxGeometry(RL, h, w, 32, 1, 1);
      geo.translate((xFar + xJ) / 2, y, z);
      railsWorld.add(new THREE.Mesh(geo, railMat));
      segs.push({ geo, base: geo.attributes.position.array.slice(), xFar });
    }
  }
  const sun = put(railsWorld, new THREE.SphereGeometry(0.3, 24, 16), new THREE.MeshBasicMaterial({ color: 0xffd23f }), -2.6, 2.3, -1.6);
  // halo doux du soleil : dégradé radial dessiné sur un canevas (texture procédurale)
  const hc = document.createElement('canvas'); hc.width = hc.height = 128;
  const hx = hc.getContext('2d'), gr = hx.createRadialGradient(64, 64, 8, 64, 64, 64);
  gr.addColorStop(0, 'rgba(255,200,80,1)'); gr.addColorStop(0.45, 'rgba(255,150,40,.35)'); gr.addColorStop(1, 'rgba(255,120,30,0)');
  hx.fillStyle = gr; hx.fillRect(0, 0, 128, 128);
  const haloTex = new THREE.CanvasTexture(hc); haloTex.colorSpace = THREE.SRGBColorSpace;
  const sunHalo = new THREE.Sprite(new THREE.SpriteMaterial({ map: haloTex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  sunHalo.position.set(-2.6, 2.3, -1.6); railsWorld.add(sunHalo);
  let railT = 0.2, sansEspace = q.get('sans') === '1', railKey = '';
  function deformRails() {
    const key = railT.toFixed(3) + sansEspace;
    if (key === railKey) return; railKey = key;
    const e = EMAX * railT, A = sansEspace ? 0.55 * Math.pow(clamp((railT - 0.3) / 0.7, 0, 1), 1.5) : 0;
    for (const s of segs) {
      const p = s.geo.attributes.position.array, b = s.base;
      for (let i = 0; i < p.length; i += 3) {
        const x = sansEspace ? s.xFar + (b[i] - s.xFar) * ((RL + G0 / 2) / RL) : s.xFar + (b[i] - s.xFar) * (1 + e);
        p[i] = x; p[i + 2] = b[i + 2] + A * Math.exp(-((x / 0.9) ** 2)); // sans espace : les rails se déforment
      }
      s.geo.attributes.position.needsUpdate = true; s.geo.computeVertexNormals();
    }
    railMat.emissiveIntensity = 0.18 * railT * railT;
    sun.scale.setScalar(0.6 + 0.7 * railT); sunHalo.scale.setScalar(0.8 + 2.4 * railT);
    sunHalo.material.opacity = 0.25 + 0.75 * railT;
  }
  const gapNow = () => (sansEspace ? 0 : G0 - 2 * RL * EMAX * railT);
  const lGap = lab("espace entre 2 rails", new THREE.Vector3(0, 0.62, GAUGE + 0.05), 'fluo');
  const lRail = lab('rail', new THREE.Vector3(-1.9, 0.6, GAUGE));
  const railLabels = [lGap, lRail];

  // ---------- Réglages ----------
  let mode = q.get('mode') === 'rails' ? 'rails' : 'thermo';
  const ui = panel(panelEl);
  ui.title('Le thermoscope');
  const modeCh = ui.choice({ label: 'Expérience', options: [{ value: 'thermo', label: 'Le thermoscope' }, { value: 'rails', label: 'Dans la vraie vie : les rails' }], value: mode, onChange: (v) => setMode(v) });
  const sub = () => { const d = document.createElement('div'); d.style.cssText = 'display:flex;flex-direction:column;gap:12px'; panelEl.appendChild(d); return d; };
  const boxT = sub(), boxR = sub();
  const uiT = panel(boxT), uiR = panel(boxR);
  const bBtns = uiT.buttons([0, 1, 2].map((i) => ({ label: `Bécher ${i + 1}`, onClick: () => goTo(i) })));
  // la loupe : un médaillon 2D avec les molécules d'eau colorée (la « queue » = agitation, comme dans le cours)
  const cv = document.createElement('canvas');
  cv.style.cssText = 'width:100%;height:170px;display:block;border-radius:14px;background:#1b1838';
  const cap = document.createElement('p'); cap.className = 'sim-note';
  cap.innerHTML = '<b>Loupe</b> : les molécules d\'eau colorée dans le tube. La petite « queue » montre leur agitation.';
  boxT.append(cv, cap);
  const ctx = cv.getContext('2d');
  const LM = [];
  for (let r = 0; r < 5; r++) for (let c = 0; c < 3; c++) LM.push({ r, c, jx: rand(-4, 4), jy: rand(-2.5, 2.5), a: rand(0.7, 1.3), b: rand(0.7, 1.3), p: rand(0, 6.3), q: rand(0, 6.3) });
  const sl = uiT.slider({ label: 'Température du bain', min: 0, max: 100, value: 50, format: (v) => mot(v / 100), onInput: (v) => { baths[cur] = v / 100; refreshBaths(); } });
  uiT.buttons([{ label: 'Remettre les béchers', onClick() { T_DEF.forEach((T, i) => { baths[i] = T; }); sl.set(baths[cur] * 100); refreshBaths(); } }]);
  const roNiv = uiT.readout("Niveau d'eau colorée"), roAg = uiT.readout('Agitation moléculaire');
  uiT.note('<b style="color:#ffe45c">Je retiens</b> : le thermoscope permet de <b>comparer</b> de façon objective le niveau de chaud et de froid de différents corps. Il n\'a pas de graduations (le thermomètre, lui, est un thermoscope gradué).');
  const slR = uiR.slider({ label: 'Température', min: 0, max: 100, value: railT * 100, format: (v) => mot(v / 100), onInput: (v) => { railT = v / 100; } });
  const chR = uiR.choice({ label: 'Les rails sont posés…', options: [{ value: 'avec', label: 'avec un espace' }, { value: 'sans', label: 'sans espace' }], value: sansEspace ? 'sans' : 'avec', onChange: (v) => { sansEspace = v === 'sans'; } });
  const roGap = uiR.readout('Espace entre les 2 rails');
  uiR.note('<b style="color:#ffe45c">Pourquoi existe-t-il un espace entre 2 rails ?</b> Pour éviter que les rails se déforment lors d\'une élévation importante de la température (à cause de la dilatation). <i>Mouvements exagérés pour qu\'on les voie.</i>');

  // ---------- Déplacer le thermoscope ----------
  let cur = 1, tgtX = BX[1], px = BX[1], py = 0.03, Tl = 0.5;
  function goTo(i) {
    cur = i; tgtX = BX[i];
    setSide(i === 2 ? -1 : 1);
    sl.set(Math.round(baths[i] * 100));
    bBtns.forEach((b, k) => b.classList.toggle('on', k === i));
  }

  // ---------- Cadrage (tout tient dans l'écran, téléphone compris) ----------
  const VIEWS = { thermo: { target: [0, 1.35, 0], pos: [0, 2.9, 8.5], w: 7.6, h: 4.8 }, rails: { target: [0, 0.3, 0], pos: [0, 4.4, 4.6], w: 7.4, h: 3.2 } };
  let lastAsp = 0, narrow = null;
  function fit(force) {
    const { w, h } = st.size(), asp = w / h;
    if (!force && Math.abs(asp - lastAsp) < 0.005) return;
    lastAsp = asp;
    const Vw = VIEWS[mode], vt = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const d = Math.max(Vw.h / 2 / vt, Vw.w / 2 / (vt * asp)) + 0.4;
    const dir = force ? new THREE.Vector3(...Vw.pos).sub(new THREE.Vector3(...Vw.target)).normalize() : camera.position.clone().sub(controls.target).normalize();
    controls.target.set(...Vw.target);
    camera.position.copy(controls.target).addScaledVector(dir, d);
    controls.minDistance = d * 0.45; controls.maxDistance = d * 1.6;
    const nar = w < 560;
    if (nar !== narrow) { narrow = nar; labels.forEach((l) => { l.el.style.fontSize = nar ? '11.5px' : ''; }); }
  }
  function setMode(m) {
    mode = m; modeCh.set(m);
    thermoWorld.visible = m === 'thermo'; railsWorld.visible = m === 'rails';
    boxT.style.display = m === 'thermo' ? 'flex' : 'none'; boxR.style.display = m === 'rails' ? 'flex' : 'none';
    thermoLabels.forEach((l) => l.show(m === 'thermo')); railLabels.forEach((l) => l.show(m === 'rails'));
    fit(true);
  }

  // ---------- La loupe ----------
  function drawLoupe(t) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2), W = cv.clientWidth || 300, H = 170;
    if (cv.width !== Math.round(W * dpr)) { cv.width = Math.round(W * dpr); cv.height = H * dpr; }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const cx = W / 2, cy = H / 2, R = H / 2 - 9, wl = cx - 48, wr = cx + 48;
    const s = 1 + 0.5 * (Tl - 0.5), dy = 23 * s, base = cy + R + 6, top = base - 5 * dy, yr = base - 5 * 23;
    ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.clip();
    ctx.fillStyle = '#241f47'; ctx.fillRect(cx - R, cy - R, 2 * R, 2 * R);
    ctx.fillStyle = 'rgba(155,107,255,.22)'; ctx.fillRect(wl, top, wr - wl, H);
    ctx.strokeStyle = 'rgba(200,180,255,.85)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(wl, top - 5); ctx.quadraticCurveTo(cx, top + 6, wr, top - 5); ctx.stroke(); // ménisque
    const A = 1 + 7 * Tl, w = 3 + 12 * Tl, pts = [];
    for (const m of LM) {
      const p1 = w * m.a * t + m.p, p2 = w * m.b * t + m.q;
      const x = cx + (m.c - 1) * 30 + m.jx + A * Math.sin(p1), y = base - (m.r + 0.5) * dy + m.jy * s + A * Math.sin(p2);
      const vx = A * w * m.a * Math.cos(p1), vy = A * w * m.b * Math.cos(p2), v = Math.hypot(vx, vy) || 1;
      pts.push([x, y, vx / v, vy / v, clamp(v * 0.09, 2, 22)]);
    }
    ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 4; ctx.lineCap = 'round';
    for (const [x, y, ux, uy, L] of pts) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - ux * (L + 8), y - uy * (L + 8)); ctx.stroke(); }
    for (const [x, y] of pts) {
      ctx.fillStyle = '#9b6bff'; ctx.beginPath(); ctx.arc(x, y, 8.5, 0, 7); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.beginPath(); ctx.arc(x - 2.6, y - 2.6, 2.6, 0, 7); ctx.fill();
    }
    ctx.setLineDash([6, 5]); ctx.strokeStyle = '#ffe45c'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(wl - 16, yr); ctx.lineTo(wr + 16, yr); ctx.stroke(); ctx.setLineDash([]);
    ctx.strokeStyle = 'rgba(191,227,255,.8)'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(wl, 0); ctx.lineTo(wl, H); ctx.moveTo(wr, 0); ctx.lineTo(wr, H); ctx.stroke();
    ctx.restore();
    ctx.strokeStyle = '#b8bcc8'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();
    ctx.lineWidth = 11; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(cx + R * 0.74, cy + R * 0.74); ctx.lineTo(cx + R * 1.2, cy + R * 1.2); ctx.stroke();
    const F = '"Instrument Sans", sans-serif';
    ctx.fillStyle = '#ffe45c'; ctx.font = '600 12px ' + F; ctx.textAlign = 'left'; ctx.fillText('repère', cx + R + 8, yr + 4);
    if (cx - R - 14 < 70) return; // canevas trop étroit : les compteurs du panneau suffisent
    const xl = cx - R - 12;
    ctx.textAlign = 'right'; ctx.fillStyle = '#cfc8ff'; ctx.font = '500 11px ' + F;
    ctx.fillText('agitation', xl, cy - 30); ctx.fillText('espace occupé', xl, cy + 16);
    ctx.font = '700 15px ' + F; ctx.fillStyle = '#' + tempColor(Tl, tmpC).getHexString();
    ctx.fillText(Tl > 0.6 ? 'forte' : Tl < 0.36 ? 'faible' : 'moyenne', xl, cy - 12);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(Tl > 0.54 ? 'plus grand' : Tl < 0.46 ? 'plus petit' : 'le même', xl, cy + 34);
  }

  // ---------- Animation ----------
  let tt = 0, lastNiv = '', lastAg = '', lastGap = '';
  function frame(dt) {
    tt += dt; const t = tt;
    fit(false);
    if (mode === 'thermo') {
      // le thermoscope sort du bain, se déplace, puis replonge
      const LIFT = 1.2;
      if (Math.abs(px - tgtX) > 0.02) { py = ease(py, LIFT, dt, 9); if (py > LIFT - 0.1) px = ease(px, tgtX, dt, 6); }
      else { px = tgtX; py = ease(py, 0.03, dt, 7); }
      thermo.position.set(px, py, 0);
      const inBath = py < 0.35 && Math.abs(px - BX[cur]) < 0.01;
      const Tb = inBath ? baths[cur] : 0.5;
      Tl += (Tb - Tl) * (1 - Math.exp(-(inBath ? 0.45 : 0.05) * dt)); // la chaleur passe peu à peu
      const level = LEVEL0 + GAIN * (Tl - 0.5), h = level - 0.76;
      col.scale.y = h; col.position.y = 0.76 + h / 2;
      aCol.position.y = level;
      // explication : ce qui se passe maintenant
      const diff = Tb - Tl, rel = Tl - 0.5;
      let key;
      if (!inBath) key = 'transit';
      else if (diff > 0.02) key = 'monte';
      else if (diff < -0.02) key = 'descend';
      else if (Math.abs(rel) < 0.035) key = cur === 1 && Math.abs(baths[1] - 0.5) < 0.02 ? 'depart' : 'egal';
      else key = rel > 0 ? 'haut' : 'bas';
      ex.set(key === 'transit' ? TXT.transit(cur) : TXT[key]);
      const niv = (Math.abs(rel) < 0.035 ? 'au repère' : rel > 0 ? 'au-dessus du repère' : 'en dessous du repère') + (key === 'monte' ? ' ▲' : key === 'descend' ? ' ▼' : '');
      const ag = (Tl > 0.6 ? 'forte' : Tl < 0.36 ? 'faible' : 'moyenne') + (key === 'monte' ? ' (augmente)' : key === 'descend' ? ' (diminue)' : '');
      if (niv !== lastNiv) { lastNiv = niv; roNiv.set(niv); }
      if (ag !== lastAg) { lastAg = ag; roAg.set(ag); }
      // glaçons dans un bain froid, vapeur au-dessus d'un bain chaud
      ices.forEach((ic, i) => {
        ic.amt = ease(ic.amt, baths[i] < 0.24 ? 1 : 0, dt, 3);
        ic.cubes.forEach((c, k) => {
          const a = k * 2.1 + i + 0.6;
          c.position.set(BX[i] + Math.cos(a) * 0.42, 0.69 + Math.sin(t * 1.5 + k) * 0.015, Math.sin(a) * 0.42);
          c.rotation.set(0.2 * k, a + t * 0.1, 0.1); c.scale.setScalar(Math.max(0.0001, ic.amt)); c.visible = ic.amt > 0.01;
        });
      });
      baths.forEach((T, i) => {
        if (T <= 0.62) return;
        steamAcc += dt * (T - 0.62) * 50;
        while (steamAcc >= 1) {
          steamAcc -= 1;
          const p = sp.find((o) => o.age >= o.life); if (!p) break;
          const a = rand(0, 6.283), r = rand(0.18, 0.5);
          Object.assign(p, { age: 0, life: rand(1.4, 2.4), x: BX[i] + Math.cos(a) * r, y: 0.76, z: Math.sin(a) * r });
        }
      });
      sp.forEach((p, i) => {
        if (p.age < p.life) { p.age += dt; p.y += 0.32 * dt; p.x += Math.sin(t * 2 + i) * 0.05 * dt; steam.setPos(i, p.x, p.y, p.z, Math.sin(Math.PI * Math.min(1, p.age / p.life)) * 1.3); }
        else steam.setPos(i, 0, -99, 0, 0.0001);
      });
      steam.commit();
      drawLoupe(t);
    } else {
      deformRails();
      const g = gapNow(), A = sansEspace ? clamp((railT - 0.3) / 0.7, 0, 1) : 0;
      const gtx = sansEspace ? (A > 0.05 ? '<span style="color:#ff8a6a">aucun</span>' : 'aucun') : g > 0.25 ? 'large' : g > 0.12 ? 'il se referme' : 'presque fermé';
      if (gtx !== lastGap) { lastGap = gtx; roGap.set(gtx); }
      lGap.set(sansEspace ? 'pas d\'espace' : 'espace entre 2 rails');
      lGap.el.className = 'sim-label ' + (sansEspace ? 'chaud' : 'fluo');
      ex.set(sansEspace ? (A > 0.05 ? TXT.sansChaud : TXT.sansFroid) : railT > 0.45 ? TXT.railChaud : TXT.railFroid);
    }
  }
  st.onFrame(frame);

  // ---------- Départ ----------
  refreshBaths(); setSide(1); goTo(1); setMode(mode);
  if (q.get('T')) { railT = clamp(+q.get('T') / 100, 0, 1); slR.set(railT * 100); }
  chR.set(sansEspace ? 'sans' : 'avec');
  const b0 = +q.get('b');
  if (b0 >= 1 && b0 <= 3) goTo(b0 - 1);
  // Banc d'essai : ?avance=3 fait tourner 3 s de simulation tout de suite (captures sans écran).
  for (let i = 0, n = clamp(+q.get('avance') || 0, 0, 20) * 60; i < n; i++) frame(1 / 60);
  return { dispose() { st.dispose(); } };
}
