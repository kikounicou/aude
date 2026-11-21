// kit.js — boîte à outils commune à toutes les expériences 3D.
// Chaque expérience : export default function mount(root) { ... return { dispose() {} } }
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export { THREE };

// Couleurs partagées (les mêmes rôles partout sur le site)
export const C = {
  nuit: 0x141226,      // fond des scènes
  nuit2: 0x241f47,
  froid: 0x3d8bff,     // bleu = froid
  tiede: 0xffc94d,
  chaud: 0xff5a36,     // rouge orangé = chaud
  eau: 0x4db8ff,
  glace: 0xcfeeff,
  vapeur: 0xe8f4ff,
  verre: 0xbfe3ff,
  metal: 0xb8bcc8,
  bois: 0x8a5a33,
  fluo: 0xffe45c,      // jaune fluo = mot à retenir
  menthe: 0x19c3a6,    // thème 6
  violet: 0x8f6bff,
  blanc: 0xffffff,
  encre: 0x1d1b2f,
};

// Dégradé froid -> chaud. t entre 0 et 1.
export function tempColor(t, out = new THREE.Color()) {
  t = Math.min(1, Math.max(0, t));
  const a = new THREE.Color(C.froid), b = new THREE.Color(C.tiede), c = new THREE.Color(C.chaud);
  return t < 0.5 ? out.copy(a).lerp(b, t * 2) : out.copy(b).lerp(c, (t - 0.5) * 2);
}

export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const rand = (a = 1, b) => (b === undefined ? Math.random() * a : a + Math.random() * (b - a));

function el(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html !== undefined) e.innerHTML = html;
  return e;
}

/**
 * Prépare la structure d'une expérience dans `root` :
 *   .sim-main (.sim-stage = la scène 3D, .sim-explain = « ce qui se passe »)  +  .sim-side (.sim-panel = réglages)
 * Retourne { stageEl, panelEl, explainEl }.
 */
export function layout(root) {
  root.classList.add('sim');
  root.innerHTML = '';
  const stageEl = el('div', 'sim-stage');
  const side = el('div', 'sim-side');
  const panelEl = el('div', 'sim-panel');
  const explainEl = el('div', 'sim-explain');
  explainEl.setAttribute('aria-live', 'polite');
  // Le message « ce qui se passe » est placé juste SOUS la scène : le bloc scène + message reste à l'écran pendant qu'on
  // manipule les réglages (ordinateur, tablette, téléphone). Styles : .sim-v2 dans css/widgets.css.
  const main = el('div', 'sim-main');
  main.append(stageEl, explainEl);
  side.append(panelEl);
  root.append(main, side);
  root.classList.add('sim-v2');
  return { stageEl, panelEl, explainEl };
}

/** Conservée pour compatibilité : layout() place déjà le message sous la scène. */
export function messageSousScene() {}

/**
 * Crée la scène three.js dans `stageEl`.
 * opts : { camera: {pos:[x,y,z], target:[x,y,z], fov}, orbit: true, background: couleur|null, lights: true,
 *          minDistance, maxDistance }
 * Retourne { scene, camera, renderer, controls, onFrame(fn(dt, t)), labels, dispose(), size() }.
 * La boucle se met en pause quand la scène n'est pas visible (batterie des tablettes).
 */
export function createStage(stageEl, opts = {}) {
  const o = Object.assign({ orbit: true, lights: true, background: C.nuit }, opts);
  const cam = Object.assign({ pos: [0, 2.2, 6], target: [0, 1, 0], fov: 42 }, o.camera || {});

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: o.background === null });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = false;
  stageEl.appendChild(renderer.domElement);
  renderer.domElement.classList.add('sim-canvas');

  const scene = new THREE.Scene();
  if (o.background !== null) {
    scene.background = new THREE.Color(o.background);
    scene.fog = null;
  }
  const camera = new THREE.PerspectiveCamera(cam.fov, 1, 0.05, 200);
  camera.position.set(...cam.pos);
  const target = new THREE.Vector3(...cam.target);
  camera.lookAt(target);

  let controls = null;
  if (o.orbit) {
    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.copy(target);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.minDistance = o.minDistance ?? 2.5;
    controls.maxDistance = o.maxDistance ?? 14;
    controls.maxPolarAngle = Math.PI * 0.52;
    controls.update();
  }

  if (o.lights) {
    scene.add(new THREE.HemisphereLight(0xdfe8ff, 0x2a2440, 1.15));
    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(4, 7, 5);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x8f6bff, 0.7);
    rim.position.set(-5, 3, -4);
    scene.add(rim);
  }

  // Couche d'étiquettes HTML (texte toujours net)
  const labelLayer = el('div', 'sim-labels');
  stageEl.appendChild(labelLayer);
  const labels = [];
  const v = new THREE.Vector3();

  let w = 0, h = 0;
  function resize() {
    const r = stageEl.getBoundingClientRect();
    const nw = Math.max(1, Math.round(r.width)), nh = Math.max(1, Math.round(r.height));
    if (nw === w && nh === h) return;
    w = nw; h = nh;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(stageEl);
  resize();

  const frameFns = [];
  let running = false, visible = true, raf = 0, last = 0, t = 0, disposed = false;
  function loop(now) {
    if (!running) return;
    raf = requestAnimationFrame(loop);
    const dt = Math.max(0.001, Math.min(0.05, (now - last) / 1000 || 0.016));
    last = now; t += dt;
    for (const fn of frameFns) fn(dt, t);
    if (controls) controls.update();
    renderer.render(scene, camera);
    // étiquettes
    for (const L of labels) {
      if (!L.visible) { L.el.style.display = 'none'; continue; }
      if (L.obj.isVector3) v.copy(L.obj); else L.obj.getWorldPosition(v);
      v.add(L.offset).project(camera);
      const behind = v.z > 1;
      L.el.style.display = behind ? 'none' : '';
      L.el.style.transform = `translate(-50%,-50%) translate(${((v.x + 1) / 2) * w}px, ${((1 - v.y) / 2) * h}px)`;
    }
  }
  function setRunning(on) {
    if (on && !running && !disposed) { running = true; last = performance.now(); raf = requestAnimationFrame(loop); }
    else if (!on && running) { running = false; cancelAnimationFrame(raf); }
  }
  const io = new IntersectionObserver((es) => { visible = es[0].isIntersecting; setRunning(visible && !document.hidden); }, { threshold: 0.05 });
  io.observe(stageEl);
  const onVis = () => setRunning(visible && !document.hidden);
  document.addEventListener('visibilitychange', onVis);
  setRunning(true);

  return {
    scene, camera, renderer, controls, el: stageEl,
    onFrame(fn) { frameFns.push(fn); return fn; },
    size: () => ({ w, h }),
    /**
     * Étiquette HTML accrochée à un objet 3D ou à un THREE.Vector3.
     * opts : { offset:[x,y,z], cls:'fluo'|'chaud'|'froid'|'discret', onClick }
     * Retourne { el, set(texte), show(bool), remove() }.
     */
    label(text, obj, opts = {}) {
      const e = el(opts.onClick ? 'button' : 'div', 'sim-label ' + (opts.cls || ''), text);
      if (opts.onClick) { e.type = 'button'; e.addEventListener('click', opts.onClick); e.classList.add('cliquable'); }
      labelLayer.appendChild(e);
      const L = { el: e, obj, offset: new THREE.Vector3(...(opts.offset || [0, 0, 0])), visible: true };
      labels.push(L);
      return {
        el: e,
        set(tx) { e.innerHTML = tx; },
        show(on = true) { L.visible = on; },
        remove() { e.remove(); const i = labels.indexOf(L); if (i >= 0) labels.splice(i, 1); },
      };
    },
    dispose() {
      disposed = true; setRunning(false);
      ro.disconnect(); io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      if (controls) controls.dispose();
      scene.traverse((ob) => {
        if (ob.geometry) ob.geometry.dispose();
        if (ob.material) (Array.isArray(ob.material) ? ob.material : [ob.material]).forEach((m) => { if (m.map) m.map.dispose(); m.dispose(); });
      });
      renderer.dispose();
      renderer.domElement.remove();
      labelLayer.remove();
    },
  };
}

/**
 * Constructeur de réglages dans `panelEl`.
 *   const ui = panel(panelEl);
 *   ui.title('Chauffe le bécher');
 *   const s = ui.slider({ label:'Température', min:0, max:100, step:1, value:20, unit:'°C', onInput:v=>{} });  // s.set(v), s.value
 *   ui.buttons([{ label:'Chauffer', onClick(){}, primary:true }, ...])   // retourne les <button>
 *   const c = ui.choice({ label:'Liquide', options:[{value:'pure',label:'Eau pure'},...], value:'pure', onChange:v=>{} }); // c.set(v)
 *   const r = ui.readout('Niveau');  r.set('12 cm')
 *   ui.note('<b>Astuce</b> ...')
 */
export function panel(panelEl) {
  return {
    el: panelEl,
    title(tx) { const h = el('h4', 'sim-titre', tx); panelEl.appendChild(h); return h; },
    note(html) { const p = el('p', 'sim-note', html); panelEl.appendChild(p); return p; },
    slider({ label, min = 0, max = 100, step = 1, value = 0, unit = '', onInput, format }) {
      const wrap = el('label', 'sim-slider');
      const top = el('span', 'sim-slider-top');
      const name = el('span', '', label);
      const val = el('output', 'sim-val');
      top.append(name, val);
      const input = el('input');
      input.type = 'range'; input.min = min; input.max = max; input.step = step; input.value = value;
      const show = (v) => { val.textContent = (format ? format(v) : v) + (unit ? ' ' + unit : ''); input.style.setProperty('--p', ((v - min) / (max - min)) * 100 + '%'); };
      show(+value);
      input.addEventListener('input', () => { show(+input.value); onInput && onInput(+input.value); });
      wrap.append(top, input);
      panelEl.appendChild(wrap);
      return { el: wrap, input, get value() { return +input.value; }, set(v, fire = false) { input.value = v; show(+v); if (fire && onInput) onInput(+v); } };
    },
    buttons(list) {
      const row = el('div', 'sim-btns');
      const out = list.map((b) => {
        const bt = el('button', 'sim-btn' + (b.primary ? ' primary' : ''), b.label);
        bt.type = 'button';
        bt.addEventListener('click', () => b.onClick && b.onClick(bt));
        row.appendChild(bt);
        return bt;
      });
      panelEl.appendChild(row);
      return out;
    },
    choice({ label, options, value, onChange }) {
      const wrap = el('div', 'sim-choice');
      if (label) wrap.appendChild(el('span', 'sim-choice-label', label));
      const row = el('div', 'sim-seg');
      const btns = options.map((op) => {
        const bt = el('button', '', op.label);
        bt.type = 'button'; bt.dataset.v = op.value;
        bt.addEventListener('click', () => { api.set(op.value); onChange && onChange(op.value); });
        row.appendChild(bt);
        return bt;
      });
      wrap.appendChild(row);
      panelEl.appendChild(wrap);
      const api = { el: wrap, value, set(v) { api.value = v; btns.forEach((b) => b.classList.toggle('on', b.dataset.v === String(v))); } };
      api.set(value);
      return api;
    },
    readout(label) {
      const wrap = el('div', 'sim-readout');
      const l = el('span', '', label), v = el('strong', '', '—');
      wrap.append(l, v);
      panelEl.appendChild(wrap);
      return { el: wrap, set(tx) { v.innerHTML = tx; } };
    },
  };
}

/**
 * Zone « ce qui se passe » : explain(explainEl).set('<b>Dilatation</b> : ...')
 * Les mots du cours à retenir s'écrivent <mark>comme ceci</mark> (rendu fluo).
 */
export function explain(explainEl) {
  let cur = '';
  return { set(html) { if (html !== cur) { cur = html; explainEl.innerHTML = html; explainEl.classList.remove('flash'); void explainEl.offsetWidth; explainEl.classList.add('flash'); } } };
}

/** Verre transparent (béchers, ballons, tubes). */
export function glassMaterial(opts = {}) {
  return new THREE.MeshPhysicalMaterial(Object.assign({
    color: C.verre, transparent: true, opacity: 0.18, roughness: 0.08, metalness: 0, side: THREE.DoubleSide, depthWrite: false,
  }, opts));
}

/** Liquide translucide. */
export function liquidMaterial(color = C.eau, opacity = 0.72) {
  return new THREE.MeshStandardMaterial({ color, transparent: true, opacity, roughness: 0.25, metalness: 0 });
}

/** Bécher simple : cylindre de verre ouvert. Retourne un Group (origine au fond, centre). */
export function beaker(radius = 0.8, height = 1.4) {
  const g = new THREE.Group();
  const wall = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, 48, 1, true), glassMaterial());
  wall.position.y = height / 2;
  const bottom = new THREE.Mesh(new THREE.CircleGeometry(radius, 48), glassMaterial({ opacity: 0.28 }));
  bottom.rotation.x = -Math.PI / 2; bottom.position.y = 0.005;
  const rim = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.018, 8, 48), new THREE.MeshStandardMaterial({ color: 0xe8f6ff, transparent: true, opacity: 0.7 }));
  rim.rotation.x = Math.PI / 2; rim.position.y = height;
  g.add(wall, bottom, rim);
  return g;
}

/** Table / sol discret sous l'expérience. */
export function ground(size = 14, color = 0x1d1938) {
  const m = new THREE.Mesh(new THREE.CircleGeometry(size / 2, 64), new THREE.MeshStandardMaterial({ color, roughness: 0.95 }));
  m.rotation.x = -Math.PI / 2;
  return m;
}

/**
 * Nuage de molécules (InstancedMesh de sphères).
 *   const mol = molecules(200, { radius:0.05, color:C.eau });
 *   scene.add(mol.mesh);  mol.setPos(i, x,y,z);  mol.setColor(i, color);  mol.commit();
 */
export function molecules(count, { radius = 0.05, color = C.eau, segments = 12 } = {}) {
  const mesh = new THREE.InstancedMesh(new THREE.SphereGeometry(radius, segments, segments), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35 }), count);
  const m4 = new THREE.Matrix4(), col = new THREE.Color(color);
  for (let i = 0; i < count; i++) { m4.setPosition(0, -99, 0); mesh.setMatrixAt(i, m4); mesh.setColorAt(i, col); }
  mesh.frustumCulled = false;
  return {
    mesh, count,
    setPos(i, x, y, z, s = 1) { m4.makeScale(s, s, s); m4.setPosition(x, y, z); mesh.setMatrixAt(i, m4); },
    setColor(i, c) { mesh.setColorAt(i, c.isColor ? c : col.set(c)); },
    commit() { mesh.instanceMatrix.needsUpdate = true; if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true; },
  };
}

/**
 * Petit graphique 2D (canvas) pour tracer une courbe en direct, style papier millimétré.
 *   const g = miniGraph(parentEl, { xLabel:'temps (min)', yLabel:'θ (°C)', xMax:14, yMin:0, yMax:110, xStep:2, yStep:10 });
 *   g.clear(); g.setSeries([{ points:[[0,20],[3,49]], color:'#ff5a36', dots:true }]); g.mark({ x0:10, x1:14, label:'palier' })
 */
export function miniGraph(parent, o) {
  o = Object.assign({ xMax: 10, yMin: 0, yMax: 100, xStep: 1, yStep: 10, height: 190, xLabel: '', yLabel: '' }, o);
  const cv = el('canvas', 'sim-graph');
  parent.appendChild(cv);
  const ctx = cv.getContext('2d');
  let series = [], marks = [];
  function draw() {
    const W = cv.clientWidth || 300, H = o.height, d = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = W * d; cv.height = H * d; cv.style.height = H + 'px';
    ctx.setTransform(d, 0, 0, d, 0, 0);
    const L = 38, R = 10, T = 12, B = 30, pw = W - L - R, ph = H - T - B;
    const X = (x) => L + (x / o.xMax) * pw, Y = (y) => T + ph - ((y - o.yMin) / (o.yMax - o.yMin)) * ph;
    ctx.fillStyle = '#fffaf2'; ctx.fillRect(0, 0, W, H);
    ctx.lineWidth = 1; ctx.font = '11px "Instrument Sans", sans-serif'; ctx.fillStyle = '#5b556f';
    ctx.strokeStyle = 'rgba(255,90,54,.22)';
    for (let x = 0; x <= o.xMax + 1e-6; x += o.xStep) { ctx.beginPath(); ctx.moveTo(X(x), T); ctx.lineTo(X(x), T + ph); ctx.stroke(); ctx.textAlign = 'center'; ctx.fillText(String(Math.round(x * 10) / 10), X(x), T + ph + 13); }
    for (let y = o.yMin; y <= o.yMax + 1e-6; y += o.yStep) { ctx.beginPath(); ctx.moveTo(L, Y(y)); ctx.lineTo(L + pw, Y(y)); ctx.stroke(); ctx.textAlign = 'right'; ctx.fillText(String(y), L - 5, Y(y) + 4); }
    ctx.strokeStyle = '#1d1b2f'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(L, T); ctx.lineTo(L, T + ph); ctx.lineTo(L + pw, T + ph); ctx.stroke();
    ctx.fillStyle = '#1d1b2f'; ctx.textAlign = 'right'; ctx.fillText(o.xLabel, L + pw, H - 4); ctx.textAlign = 'left'; ctx.fillText(o.yLabel, 2, 10);
    for (const m of marks) {
      ctx.fillStyle = 'rgba(255,228,92,.55)'; ctx.fillRect(X(m.x0), T, X(m.x1) - X(m.x0), ph);
      ctx.fillStyle = '#1d1b2f'; ctx.textAlign = 'center'; ctx.font = 'bold 12px "Instrument Sans", sans-serif'; ctx.fillText(m.label, (X(m.x0) + X(m.x1)) / 2, T + 14); ctx.font = '11px "Instrument Sans", sans-serif';
    }
    for (const s of series) {
      if (!s.points.length) continue;
      ctx.strokeStyle = s.color || '#ff5a36'; ctx.lineWidth = 2.2; ctx.lineJoin = 'round'; ctx.beginPath();
      s.points.forEach(([x, y], i) => (i ? ctx.lineTo(X(x), Y(y)) : ctx.moveTo(X(x), Y(y)))); ctx.stroke();
      if (s.dots) { ctx.fillStyle = s.color || '#ff5a36'; for (const [x, y] of s.points) { ctx.beginPath(); ctx.arc(X(x), Y(y), 3, 0, 7); ctx.fill(); } }
    }
  }
  const ro = new ResizeObserver(draw); ro.observe(cv);
  return {
    el: cv,
    setSeries(s) { series = s; draw(); },
    mark(m) { marks.push(m); draw(); },
    clear() { series = []; marks = []; draw(); },
    dispose() { ro.disconnect(); cv.remove(); },
  };
}
