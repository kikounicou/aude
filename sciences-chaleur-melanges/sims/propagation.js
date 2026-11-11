// propagation.js — « Comment la chaleur se propage : conduction, convection, rayonnement » (thème 5)
import { THREE, C, layout, createStage, panel, explain, ground, molecules, tempColor, clamp, lerp, rand } from './kit.js';

const fl = (w) => '<b style="color:var(--fluo)">' + w + '</b>';
const DEF = {
  convection: 'On appelle ' + fl('convection') + ' le transport de chaleur par la matière avec ' + fl('déplacement') + ' de la matière. Les ' + fl('fluides') + ' (liquides et gaz) sont des ' + fl('convecteurs thermiques') + '.',
  conduction: 'Dans la ' + fl('conduction') + ', la matière ' + fl('ne se déplace pas') + ' mais constitue le ' + fl('support') + ' nécessaire à la propagation de la chaleur. Elle est liée à l\'état solide. Les mauvais conducteurs thermiques sont appelés ' + fl('isolants thermiques') + '.',
  rayonnement: 'La chaleur peut aussi se propager ' + fl('dans le vide') + ' ou dans la matière sans que celle-ci ne serve de support ni se déplace : c\'est le ' + fl('rayonnement') + '.',
};

// Bec Bunsen dont la flamme se règle (0 = éteint)
function makeBurner() {
  const g = new THREE.Group();
  const metal = new THREE.MeshStandardMaterial({ color: C.metal, metalness: 0.55, roughness: 0.35 });
  const sombre = new THREE.MeshStandardMaterial({ color: 0x4a4766, metalness: 0.4, roughness: 0.55 });
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 0.08, 32), sombre); base.position.y = 0.04;
  const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.62, 20), metal); tube.position.y = 0.39;
  const flame = new THREE.Group(); flame.position.y = 0.7;
  const fm = (c, o) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, blending: THREE.AdditiveBlending, depthWrite: false });
  const fo = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.42, 20, 1, true), fm(0xff7a2e, 0.8)); fo.position.y = 0.21;
  const fi = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.2, 16, 1, true), fm(0xffe08a, 0.95)); fi.position.y = 0.1;
  flame.add(fo, fi);
  const light = new THREE.PointLight(0xff8a3d, 0, 3); light.position.y = 0.95;
  g.add(base, tube, flame, light);
  return {
    g, tube,
    set(p, time) { // p entre 0 et 1
      flame.visible = p > 0.01;
      const fk = 1 + Math.sin(time * 23) * 0.05 + Math.sin(time * 37) * 0.04;
      flame.scale.set(0.6 + 0.5 * p, (0.35 + 0.95 * p) * fk, 0.6 + 0.5 * p);
      light.intensity = 2 * p * fk;
    },
  };
}

// Spirale de papier suspendue par son centre (bandes de couleur pour voir qu'elle tourne)
function makeSpiral() {
  const n = 180, pos = [], col = [], idx = [], c1 = new THREE.Color(0xf5efe0), c2 = new THREE.Color(0xffc94d);
  for (let k = 0; k <= n; k++) {
    const s = k / n, a = s * 3 * Math.PI * 2, r = 0.07 + 0.5 * s, y = -0.8 * s, w = 0.065;
    pos.push(Math.cos(a) * (r - w), y + 0.018, Math.sin(a) * (r - w), Math.cos(a) * (r + w), y - 0.018, Math.sin(a) * (r + w));
    const c = Math.floor(s * 14) % 2 ? c2 : c1;
    col.push(c.r, c.g, c.b, c.r, c.g, c.b);
    if (k < n) idx.push(2 * k, 2 * k + 1, 2 * k + 2, 2 * k + 1, 2 * k + 3, 2 * k + 2);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  geo.setIndex(idx); geo.computeVertexNormals();
  return new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, side: THREE.DoubleSide, roughness: 0.9 }));
}

// Ondes : lignes ondulées qui avancent de A vers B
function makeRays(group, n, color) {
  const rays = [];
  for (let i = 0; i < n; i++) {
    const arr = new Float32Array(70 * 3), geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(arr, 3));
    const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.9 }));
    line.frustumCulled = false; group.add(line);
    rays.push({ line, arr, a: new THREE.Vector3(), b: new THREE.Vector3(), ph: rand(6.28) });
  }
  const d = new THREE.Vector3(), p = new THREE.Vector3(), up = new THREE.Vector3();
  return {
    rays,
    update(time, amp = 0.07) {
      for (const r of rays) {
        d.subVectors(r.b, r.a); const len = d.length(); d.normalize();
        up.set(0, 1, 0).addScaledVector(d, -d.y).normalize();
        for (let k = 0; k < 70; k++) {
          const s = k / 69, env = Math.min(1, s * 8, (1 - s) * 8);
          p.copy(r.a).addScaledVector(d, s * len).addScaledVector(up, amp * env * Math.sin((s * len) / 0.55 * 6.28 - time * 7 + r.ph));
          r.arr[k * 3] = p.x; r.arr[k * 3 + 1] = p.y; r.arr[k * 3 + 2] = p.z;
        }
        r.line.geometry.attributes.position.needsUpdate = true;
      }
    },
  };
}

function canvasTex(w, h, draw) {
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
  draw(cv.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
}

export default function mount(root) {
  const { stageEl, panelEl, explainEl } = layout(root);
  const st = createStage(stageEl, { lights: false, camera: { pos: [0, 2.4, 7], target: [0, 1.8, 0] }, minDistance: 3, maxDistance: 18 });
  const scene = st.scene, ex = explain(explainEl);

  // lumières de laboratoire (comme le kit) ; dans l'espace, seul le Soleil éclaire
  const labo = new THREE.Group(); scene.add(labo);
  labo.add(new THREE.HemisphereLight(0xdfe8ff, 0x2a2440, 1.15));
  const key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(4, 7, 5); labo.add(key);
  const rim = new THREE.DirectionalLight(0x8f6bff, 0.7); rim.position.set(-5, 3, -4); labo.add(rim);
  const sol = ground(40); scene.add(sol);

  // ---------- CONVECTION : spirale au-dessus d'un bec Bunsen + molécules d'air ----------
  const gConv = new THREE.Group(); scene.add(gConv);
  const bConv = makeBurner(); gConv.add(bConv.g);
  const spiral = makeSpiral(); spiral.position.y = 2.75; gConv.add(spiral);
  const metal = new THREE.MeshStandardMaterial({ color: C.metal, metalness: 0.55, roughness: 0.35 });
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 3.6, 10), metal); rod.position.set(2.2, 1.8, -0.3);
  const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 2.2, 8), metal); arm.rotation.z = Math.PI / 2; arm.position.set(1.1, 3.55, -0.3);
  const foot = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.05, 0.4), new THREE.MeshStandardMaterial({ color: 0x4a4766 })); foot.position.set(2.2, 0.025, -0.3);
  const fil = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 3.55, -0.3), new THREE.Vector3(0, 2.75, 0)]), new THREE.LineBasicMaterial({ color: 0xffffff }));
  gConv.add(rod, arm, foot, fil);
  const NA = 280, W = 2.5, YB = 0.3, H = 3.2, Z0 = -0.65, Z1 = 0.3;
  const air = molecules(NA, { radius: 0.04, color: C.froid, segments: 8 }); gConv.add(air.mesh);
  const AP = new Float32Array(NA * 3), AJ = new Float32Array(NA * 3), AT = new Float32Array(NA);
  for (let i = 0; i < NA; i++) { AP[i * 3] = rand(-W, W); AP[i * 3 + 1] = rand(YB, YB + H); AP[i * 3 + 2] = rand(Z0, Z1); }
  // deux boucles fléchées : l'air chaud monte au centre (rouge), l'air plus froid redescend sur les côtés (bleu)
  const boucles = new THREE.Group(); gConv.add(boucles);
  const loopMat = new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.4, depthWrite: false });
  for (const sx of [-1, 1]) {
    const curve = new THREE.CatmullRomCurve3([[0.3, 1.25], [0.35, 2.4], [0.8, 3.3], [1.7, 3.3], [2.15, 2.4], [2.15, 1.3], [1.7, 0.55], [0.8, 0.5]].map(([x, y]) => new THREE.Vector3(sx * x, y, -0.3)));
    const TS = 90, RS = 6, tube = new THREE.TubeGeometry(curve, TS, 0.03, RS, false), cols = [], cc = new THREE.Color();
    for (let i = 0; i <= TS; i++) { const u = i / TS; tempColor(u < 0.3 ? 1 : u < 0.65 ? 1 - (u - 0.3) / 0.35 : 0, cc); for (let r = 0; r <= RS; r++) cols.push(cc.r, cc.g, cc.b); }
    tube.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
    boucles.add(new THREE.Mesh(tube, loopMat));
    for (const u of [0.12, 0.62, 0.97]) { // pointes de flèche
      const head = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.2, 12), new THREE.MeshBasicMaterial({ color: tempColor(u < 0.3 ? 1 : 0.1), transparent: true, opacity: 0.6 }));
      head.position.copy(curve.getPointAt(u)); head.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), curve.getTangentAt(u)); boucles.add(head);
    }
  }
  let heatC = 0.6, omega = 0;
  const cA = new THREE.Color();
  function updateConv(dt, time) {
    bConv.set(heatC, time);
    const A = 0.8 * heatC;
    for (let i = 0; i < NA; i++) {
      const o = i * 3; let x = AP[o], y = AP[o + 1], z = AP[o + 2];
      const sx = x < 0 ? -1 : 1, xx = Math.min(1, Math.abs(x) / W), yy = clamp((y - YB) / H, 0, 1);
      // boucle de convection : monte au centre (air chaud), redescend sur les côtés (air plus froid)
      const vx = -sx * A * (Math.PI / H) * Math.sin(Math.PI * xx) * Math.cos(Math.PI * yy);
      const vy = A * (Math.PI / W) * Math.cos(Math.PI * xx) * Math.sin(Math.PI * yy);
      // les molécules chauffées près de la flamme s'agitent ; ailleurs elles refroidissent
      const dF = Math.hypot(x, y - 0.95, z * 0.6);
      if (heatC > 0.01 && dF < 0.7) AT[i] = Math.min(1, AT[i] + (0.6 + heatC * 2.4) * dt);
      else AT[i] -= (0.04 + 0.3 * xx) * AT[i] * dt;
      const mag = 0.05 + 0.4 * AT[i];
      for (let k = 0; k < 3; k++) AJ[o + k] += rand(-1, 1) * 10 * dt;
      const jl = Math.hypot(AJ[o], AJ[o + 1], AJ[o + 2]) || 1;
      x += (vx + AJ[o] * mag / jl) * dt; y += (vy + AJ[o + 1] * mag / jl) * dt; z += (AJ[o + 2] * mag / jl) * dt;
      if (x < -W) x = -W; if (x > W) x = W; if (y < YB) y = YB; if (y > YB + H) y = YB + H; if (z < Z0) z = Z0; if (z > Z1) z = Z1;
      AP[o] = x; AP[o + 1] = y; AP[o + 2] = z;
      air.setPos(i, x, y, z); air.setColor(i, tempColor(AT[i], cA));
    }
    air.commit();
    boucles.visible = heatC > 0.01; loopMat.opacity = 0.15 + 0.35 * heatC;
    omega = lerp(omega, 2.6 * heatC, 1 - Math.exp(-1.2 * dt));
    spiral.rotation.y += omega * dt;
  }

  // ---------- CONDUCTION : casserole sur une plaque de cuisson ----------
  const gCond = new THREE.Group(); scene.add(gCond);
  const plaque = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.3, 1.6), new THREE.MeshStandardMaterial({ color: 0x24212f, roughness: 0.4 })); plaque.position.y = 0.15;
  const foyerMat = new THREE.MeshStandardMaterial({ color: 0x2a2230, emissive: 0x000000, roughness: 0.6 });
  const foyer = new THREE.Mesh(new THREE.CylinderGeometry(0.66, 0.66, 0.02, 48), foyerMat); foyer.position.y = 0.31;
  gCond.add(plaque, foyer);
  const pan = new THREE.Group(); pan.position.y = 0.32; gCond.add(pan);
  const panMat = (vc) => new THREE.MeshStandardMaterial({ color: 0xffffff, vertexColors: vc, metalness: 0.35, roughness: 0.35, side: THREE.DoubleSide });
  const fond = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.04, 48), panMat(false)); fond.position.y = 0.02;
  const wallGeo = new THREE.CylinderGeometry(0.62, 0.6, 0.46, 48, 6, true);
  wallGeo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(wallGeo.attributes.position.count * 3), 3));
  const wall = new THREE.Mesh(wallGeo, panMat(true)); wall.position.y = 0.25;
  pan.add(fond, wall);
  const M = 16, JG = 5, S = 3 + M; // cellules : 0 fond, 1-2 paroi, 3… manche
  const handle = new THREE.Group(); handle.position.set(0.6, 0.4, 0); handle.rotation.z = 0.1; pan.add(handle);
  const segs = [], grips = [];
  for (let j = 0; j < M; j++) {
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.07, 0.13), panMat(false)); s.position.x = 0.05 + j * 0.1; handle.add(s); segs.push(s);
    if (j >= JG) { const gp = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.13, 0.17), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 })); gp.position.x = s.position.x; gp.visible = false; handle.add(gp); grips.push(gp); }
  }
  // loupe : les particules du solide vibrent sur place
  const loupe = new THREE.Group(); loupe.position.set(0.6, 1.35, 0); gCond.add(loupe);
  const fond2 = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 0.52), new THREE.MeshBasicMaterial({ color: 0x141226, transparent: true, opacity: 0.75 })); fond2.position.set(0.8, 0.11, -0.06);
  const bord = new THREE.LineSegments(new THREE.EdgesGeometry(fond2.geometry), new THREE.LineBasicMaterial({ color: C.fluo }));
  bord.position.copy(fond2.position); loupe.add(fond2, bord);
  const parts = molecules(M * 3, { radius: 0.035, color: C.froid, segments: 8 }); loupe.add(parts.mesh);
  // deux traits relient la loupe au manche
  const lien = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0.5, 1.22, 0), new THREE.Vector3(0.62, 0.75, 0), new THREE.Vector3(2.3, 1.22, 0), new THREE.Vector3(2.19, 0.9, 0)]),
  new THREE.LineBasicMaterial({ color: C.fluo, transparent: true, opacity: 0.5 }));
  gCond.add(lien);
  const T = new Float32Array(S), dT = new Float32Array(S); let Tp = 0, heatP = 0.8, iso = false, touchMsg = '', touchUntil = 0;
  const cT = new THREE.Color(), cM = new THREE.Color(C.metal), cG = new THREE.Color(0x2b2633);
  const kOf = (i) => (iso && i >= 3 + JG ? 0.08 : 20);
  function updateCond(dt, time) {
    Tp = lerp(Tp, heatP, 1 - Math.exp(-1.2 * dt));
    foyerMat.emissive.setRGB(1, 0.23, 0.1).multiplyScalar(Tp * 0.9);
    // la chaleur passe d'une cellule à sa voisine (conduction), un peu se perd dans l'air
    const h = dt / 5;
    for (let n = 0; n < 5; n++) {
      dT.fill(0);
      dT[0] += 2.5 * (Tp - T[0]);
      for (let i = 0; i < S - 1; i++) { const F = Math.min(kOf(i), kOf(i + 1)) * (T[i] - T[i + 1]); dT[i] -= F; dT[i + 1] += F; }
      for (let i = 0; i < S; i++) T[i] = clamp(T[i] + h * (dT[i] - 0.015 * T[i]), 0, 1);
    }
    const metalCol = (t, out) => out.copy(cM).lerp(tempColor(t, cT), 0.9);
    metalCol(T[0], fond.material.color);
    const pa = wallGeo.attributes.position, ca = wallGeo.attributes.color;
    for (let v = 0; v < pa.count; v++) { const f = (pa.getY(v) + 0.23) / 0.46; metalCol(f < 0.5 ? lerp(T[0], T[1], f * 2) : lerp(T[1], T[2], f * 2 - 1), cT); ca.setXYZ(v, cT.r, cT.g, cT.b); }
    ca.needsUpdate = true;
    segs.forEach((s, j) => metalCol(T[3 + j], s.material.color));
    grips.forEach((gp, j) => { gp.visible = iso; gp.material.color.copy(cG).lerp(tempColor(T[3 + JG + j], cT), 0.6); });
    for (let j = 0; j < M; j++) for (let r = 0; r < 3; r++) {
      const i = j * 3 + r, t = T[3 + j], a = 0.004 + 0.035 * t;
      parts.setPos(i, 0.08 + j * 0.1 + a * Math.sin(time * 31 + i * 1.7), r * 0.11 + a * Math.sin(time * 27 + i * 2.3), a * Math.sin(time * 23 + i));
      parts.setColor(i, tempColor(t, cT));
    }
    parts.commit();
  }

  // ---------- RAYONNEMENT : Soleil → Terre dans le vide, ou feu ouvert → visage d'Églantine ----------
  const gRay = new THREE.Group(); scene.add(gRay);
  const gSun = new THREE.Group(), gFire = new THREE.Group(); gRay.add(gSun, gFire);
  const SUN = new THREE.Vector3(-3.4, 1.6, 0), EARTH = new THREE.Vector3(3.0, 1.6, 0);
  const soleil = new THREE.Mesh(new THREE.SphereGeometry(1.0, 40, 24), new THREE.MeshBasicMaterial({ color: 0xffc94d })); soleil.position.copy(SUN);
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ blending: THREE.AdditiveBlending, depthWrite: false, map: canvasTex(128, 128, (c, w) => {
    const gr = c.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2);
    gr.addColorStop(0, 'rgba(255,210,90,1)'); gr.addColorStop(0.35, 'rgba(255,150,50,.55)'); gr.addColorStop(1, 'rgba(255,90,54,0)');
    c.fillStyle = gr; c.fillRect(0, 0, w, w);
  }) }));
  halo.scale.set(4.4, 4.4, 1); halo.position.copy(SUN);
  // Terre : texture dessinée (océans, continents, pôles)
  let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const earthTex = canvasTex(256, 128, (c, w, h) => {
    c.fillStyle = '#2763b8'; c.fillRect(0, 0, w, h);
    for (let k = 0; k < 16; k++) { c.fillStyle = k % 3 ? '#3f9b5a' : '#b89a55'; c.beginPath(); c.ellipse(rnd() * w, 25 + rnd() * (h - 50), 8 + rnd() * 26, 6 + rnd() * 16, rnd() * 3, 0, 7); c.fill(); }
    c.fillStyle = '#eef6ff'; c.fillRect(0, 0, w, 9); c.fillRect(0, h - 9, w, 9);
  });
  const terre = new THREE.Mesh(new THREE.SphereGeometry(0.6, 40, 24), new THREE.MeshStandardMaterial({ map: earthTex, roughness: 0.8 })); terre.position.copy(EARTH);
  const pin = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 8), new THREE.MeshBasicMaterial({ color: C.fluo })); pin.position.set(-0.62, 0, 0); terre.add(pin);
  const jour = new THREE.Mesh(new THREE.SphereGeometry(0.615, 32, 16, 0, Math.PI), new THREE.MeshBasicMaterial({ color: 0xff7a2e, transparent: true, opacity: 0.25, blending: THREE.AdditiveBlending, depthWrite: false }));
  jour.rotation.y = -Math.PI / 2; jour.position.copy(EARTH);
  const sunLight = new THREE.PointLight(0xfff1d0, 3, 0, 0); sunLight.position.copy(SUN);
  const nuitLight = new THREE.HemisphereLight(0x9fb0ff, 0x101020, 0.25);
  const starPos = []; for (let k = 0; k < 400; k++) { const v = new THREE.Vector3(rand(-1, 1), rand(-0.3, 1), rand(-1, 0.3)).normalize().multiplyScalar(rand(28, 40)); starPos.push(v.x, v.y, v.z); }
  const stars = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(starPos, 3)), new THREE.PointsMaterial({ color: 0xcfd8ff, size: 0.14 }));
  gSun.add(soleil, halo, terre, jour, sunLight, nuitLight, stars);
  const raysSun = makeRays(gSun, 7, 0xffb347);
  raysSun.rays.forEach((r, i) => { const dy = (i - 3) * 0.16, dz = ((i * 5) % 7 - 3) * 0.06; r.a.set(SUN.x + 1.05, SUN.y + dy * 1.6, dz * 2); r.b.set(EARTH.x - 0.6, EARTH.y + dy * 0.9, dz); });
  let earthAngle = 0;

  // feu ouvert : mur du fond, tablette, bûches, flammes ; Églantine devant
  const pierre = new THREE.MeshStandardMaterial({ color: 0x6d6377, roughness: 0.9 });
  const FX = -2.75;
  const box = (w, h, d, mat, x, y, z) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); gFire.add(m); return m; };
  box(0.2, 1.6, 1.8, pierre, -3.35, 0.8, 0); box(1.1, 0.16, 2.0, pierre, -2.9, 1.68, 0); box(1.1, 0.08, 1.6, new THREE.MeshStandardMaterial({ color: 0x3a3442 }), -2.9, 0.04, 0);
  const bois = new THREE.MeshStandardMaterial({ color: C.bois, roughness: 0.9 });
  for (const a of [0.5, -0.5]) { const b = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.9, 12), bois); b.rotation.set(Math.PI / 2, a, 0); b.position.set(FX, 0.16, 0); gFire.add(b); }
  const flames = [];
  for (let k = 0; k < 4; k++) {
    const f = new THREE.Mesh(new THREE.ConeGeometry(0.16 - k * 0.02, 0.7 - k * 0.08, 16, 1, true), new THREE.MeshBasicMaterial({ color: k % 2 ? 0xffc94d : 0xff6a2e, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false }));
    f.position.set(FX + rand(-0.1, 0.1), 0.5, (k - 1.5) * 0.18); gFire.add(f); flames.push(f);
  }
  const fireLight = new THREE.PointLight(0xff8a3d, 3, 6); fireLight.position.set(FX + 0.3, 0.7, 0); gFire.add(fireLight);
  const egl = new THREE.Group(); gFire.add(egl);
  const corps = new THREE.Mesh(new THREE.CapsuleGeometry(0.27, 0.6, 6, 16), new THREE.MeshStandardMaterial({ color: C.violet, roughness: 0.8 })); corps.position.y = 0.72;
  const peau = new THREE.MeshStandardMaterial({ color: 0xf3c6a5, roughness: 0.7 });
  const tete = new THREE.Mesh(new THREE.SphereGeometry(0.25, 28, 20), peau); tete.position.y = 1.5;
  const cheveux = new THREE.Mesh(new THREE.SphereGeometry(0.265, 28, 20, 0, Math.PI * 2, 0, Math.PI * 0.55), new THREE.MeshStandardMaterial({ color: 0x6b3e26, roughness: 0.9 }));
  cheveux.position.set(0.04, 1.52, 0); cheveux.rotation.z = -0.5;
  egl.add(corps, tete, cheveux);
  for (const z of [-0.09, 0.09]) { const oe = new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 8), new THREE.MeshBasicMaterial({ color: C.encre })); oe.position.set(-0.225, 1.55, z); egl.add(oe); }
  const raysFire = makeRays(gFire, 5, 0xffb347);
  let dist = 1.5;
  const peauFroide = new THREE.Color(0xf3c6a5), peauChaude = new THREE.Color(0xff6a4a);
  const intensite = () => clamp((0.8 / dist) ** 2, 0, 1);
  const midFire = new THREE.Vector3();

  function updateRay(dt, time) {
    if (gSun.visible) {
      terre.rotation.y = lerp(terre.rotation.y, earthAngle, 1 - Math.exp(-6 * dt));
      jour.material.opacity = 0.2 + 0.07 * Math.sin(time * 3);
      raysSun.update(time, 0.08);
    }
    if (gFire.visible) {
      flames.forEach((f, k) => { f.scale.set(1, 1 + 0.18 * Math.sin(time * (9 + k * 3) + k), 1); });
      fireLight.intensity = 3 + 0.5 * Math.sin(time * 17);
      egl.position.x = lerp(egl.position.x, FX + 0.45 + dist, 1 - Math.exp(-6 * dt));
      const I = intensite();
      peau.color.copy(peauFroide).lerp(peauChaude, I * 0.65); peau.emissive.setRGB(0.5, 0.08, 0.02).multiplyScalar(I * 0.6);
      raysFire.rays.forEach((r, i) => { r.a.set(FX + 0.25, 0.45 + i * 0.1, (i - 2) * 0.15); r.b.set(egl.position.x - 0.24, 1.42 + i * 0.04, (i - 2) * 0.05); });
      raysFire.update(time, 0.06);
      midFire.set((FX + egl.position.x) / 2, 0.55, 0);
    }
  }

  // ---------- étiquettes ----------
  const Lb = {
    source: st.label('source de chaleur', bConv.tube, { offset: [-0.8, -0.25, 0.4], cls: 'discret' }),
    spirale: st.label('spirale de papier', new THREE.Vector3(0.6, 2.2, 0), { offset: [0.55, 0, 0] }),
    monte: st.label('air chaud : il monte', new THREE.Vector3(-1.0, 2.95, 0), { cls: 'chaud' }),
    descend: st.label('air plus froid : il descend', new THREE.Vector3(-1.75, 1.35, 0), { cls: 'froid' }),
    plaque: st.label('plaque de cuisson', new THREE.Vector3(-0.7, 0.15, 0.8), { cls: 'discret' }),
    manche: st.label('manche', new THREE.Vector3(2.1, 0.95, 0), { offset: [0.2, -0.2, 0] }),
    loupe: st.label('loupe : les particules vibrent sur place', new THREE.Vector3(1.35, 1.95, 0), { cls: 'fluo' }),
    soleil: st.label('Soleil', SUN, { offset: [0, 1.35, 0], cls: 'chaud' }),
    terre: st.label('Terre', EARTH, { offset: [0, 0.9, 0] }),
    vide: st.label('le vide de l\'espace : aucune matière', new THREE.Vector3(-0.2, 2.75, 0), { cls: 'fluo' }),
    raySun: st.label('rayonnement', new THREE.Vector3(-0.2, 0.95, 0), { cls: 'chaud' }),
    toi: st.label('toi', pin, { offset: [0, 0.22, 0], cls: 'fluo' }),
    feu: st.label('feu ouvert', new THREE.Vector3(FX, 2.0, 0)),
    egl: st.label('Églantine', tete, { offset: [0, 0.5, 0] }),
    rayFire: st.label('rayonnement', midFire, { offset: [0, -0.35, 0], cls: 'chaud' }),
  };
  const groupesLb = {
    convection: ['source', 'spirale', 'monte', 'descend'], conduction: ['plaque', 'manche', 'loupe'],
    soleil: ['soleil', 'terre', 'vide', 'raySun', 'toi'], feu: ['feu', 'egl', 'rayFire'],
  };

  // ---------- ligne de synthèse toujours visible ----------
  const synth = document.createElement('div');
  synth.style.cssText = 'position:absolute;left:10px;right:10px;top:10px;display:flex;flex-wrap:wrap;gap:6px;align-items:center;font:600 13px/1.2 var(--texte);color:#cfc8ff;pointer-events:none';
  const pill = (m, tx) => '<span data-m="' + m + '" style="padding:4px 9px;border-radius:99px;border:1px solid rgba(255,255,255,.25);background:rgba(20,18,38,.78);color:#fff">' + tx + '</span>';
  synth.innerHTML = '<span>Avec matière :</span>' + pill('conduction', 'conduction (elle ne se déplace pas)') + pill('convection', 'convection (elle se déplace)') + '<span>Sans matière :</span>' + pill('rayonnement', 'rayonnement');
  stageEl.appendChild(synth);

  // ---------- réglages ----------
  let mode = 'convection', ex2 = 'soleil', userCam = false;
  const ui = panel(panelEl);
  ui.title('Comment la chaleur se propage');
  const cMode = ui.choice({ label: 'Mode de propagation', value: mode, options: [{ value: 'convection', label: 'Convection' }, { value: 'conduction', label: 'Conduction' }, { value: 'rayonnement', label: 'Rayonnement' }], onChange: (v) => setMode(v) });
  const sec = {}, inSec = (name, ...els) => { if (!sec[name]) { sec[name] = document.createElement('div'); sec[name].style.cssText = 'display:flex;flex-direction:column;gap:12px'; panelEl.appendChild(sec[name]); } els.forEach((e) => sec[name].appendChild(e)); };
  inSec('convection', ui.slider({ label: 'Chauffage', min: 0, max: 100, step: 1, value: 60, unit: '%', onInput: (v) => { heatC = v / 100; refresh(); } }).el);
  inSec('conduction', ui.slider({ label: 'Plaque de cuisson', min: 0, max: 100, step: 1, value: 80, unit: '%', onInput: (v) => { heatP = v / 100; refresh(); } }).el);
  const cManche = ui.choice({ label: 'Le manche', value: 'metal', options: [{ value: 'metal', label: 'Manche en métal' }, { value: 'iso', label: 'Poignée isolante' }], onChange: (v) => { iso = v === 'iso'; T.fill(0); refresh(); } });
  inSec('conduction', cManche.el);
  const [bTouch] = ui.buttons([{ label: '✋ Toucher le manche', primary: true, onClick: () => toucher() }, { label: '↺ Recommencer', onClick: () => { T.fill(0); Tp = 0; touchUntil = 0; refresh(); } }]);
  inSec('conduction', bTouch.parentElement);
  const rBout = ui.readout('Au bout du manche'); inSec('conduction', rBout.el);
  const cEx = ui.choice({ label: 'Exemple', value: ex2, options: [{ value: 'soleil', label: 'Soleil et Terre' }, { value: 'feu', label: 'Feu ouvert d\'Églantine' }], onChange: (v) => { ex2 = v; setMode('rayonnement'); } });
  inSec('rayonnement', cEx.el);
  const sRot = ui.slider({ label: 'Faire tourner la Terre', min: 0, max: 360, step: 5, value: 0, unit: '°', onInput: (v) => { earthAngle = THREE.MathUtils.degToRad(v); refresh(); } });
  const rToi = ui.readout('Là où tu es');
  const sDist = ui.slider({ label: 'Distance au feu', min: 0.5, max: 3.5, step: 0.1, value: dist, unit: 'm', format: (v) => String(v).replace('.', ','), onInput: (v) => { dist = v; refresh(); } });
  const rVis = ui.readout('Sur son visage');
  inSec('rayonnement', sRot.el, rToi.el, sDist.el, rVis.el);
  const defNote = ui.note('');

  const mots = (t) => (t < 0.15 ? 'froid' : t < 0.35 ? 'tiède' : t < 0.6 ? 'chaud' : 'très chaud');
  function toucher() {
    const t = T[S - 1];
    touchMsg = iso && t < 0.35 ? 'Tu peux la prendre : la <mark>poignée isolante</mark> est restée froide. La chaleur ne la traverse presque pas.'
      : t >= 0.35 ? 'Aïe ! Le bout du manche est ' + mots(t) + ' : il ne possède pas de poignée isolante. La chaleur est arrivée jusqu\'à ta main par <mark>conduction</mark>.'
        : 'Pour l\'instant, le bout du manche est ' + mots(t) + '… mais la chaleur avance dans le métal. Attends un peu et réessaie.';
    touchUntil = performance.now() + 4500; refresh();
  }

  function texte() {
    if (mode === 'convection') {
      if (heatC < 0.01) return 'Sans source de chaleur, l\'air ne monte pas : la spirale s\'arrête et les molécules de l\'air restent froides. Pousse le curseur « Chauffage ».';
      if (heatC < 0.45) return 'La spirale tourne : elle semble entraînée par l\'air chaud. Il y a un <mark>mouvement ascendant de l\'air chaud</mark>. Chauffe plus fort pour voir la différence.';
      return 'En s\'échauffant, les molécules de l\'air (un <mark>fluide</mark>) sont plus <mark>agitées</mark>. Elles <mark>montent</mark> et sont <mark>remplacées</mark> par des molécules à température plus basse : la chaleur est <mark>transportée</mark>.';
    }
    if (mode === 'conduction') {
      if (touchUntil > performance.now()) return touchMsg;
      const tMax = Math.max(...T), tEnd = T[S - 1];
      if (heatP < 0.01) return tMax < 0.05 ? 'Allume la <b>plaque de cuisson</b> avec le curseur, puis regarde le manche.' : 'Plaque éteinte : la casserole cède sa chaleur à l\'air et refroidit doucement.';
      if (iso) return 'La casserole chauffe, mais la poignée reste froide : c\'est un mauvais conducteur thermique, un <mark>isolant thermique</mark>.';
      if (tEnd < 0.35) return 'La chaleur avance dans le métal, de proche en proche, jusqu\'au manche : c\'est la <mark>conduction</mark>. Dans la loupe, les particules vibrent de plus en plus fort mais <mark>ne se déplacent pas</mark>.';
      return 'Le bout du manche est ' + mots(tEnd) + ' : il ne possède pas de poignée isolante. La chaleur est répartie sur toute la casserole : il y a <mark>conduction</mark>. Le métal est un bon <mark>conducteur thermique</mark>.';
    }
    if (ex2 === 'soleil') {
      const day = Math.cos(earthAngle) > 0;
      return 'Entre le Soleil et la Terre, il n\'y a que le <mark>vide</mark> : aucune matière pour servir de support. La chaleur arrive quand même : c\'est le <mark>rayonnement</mark>. '
        + (day ? 'Là où tu es, il fait jour : le rayonnement du Soleil te chauffe.' : 'Là où tu es, il fait nuit : le rayonnement du Soleil n\'arrive pas sur ta face de la Terre.');
    }
    const I = intensite();
    return 'Le feu ouvert chauffe le visage d\'Églantine par <mark>rayonnement</mark> : la chaleur lui arrive sans que l\'air serve de <mark>support</mark> ni se déplace. '
      + (I > 0.5 ? 'Si près du feu, son visage devient très chaud !' : I < 0.1 ? 'Si loin, elle sent à peine la chaleur.' : 'Approche-la ou éloigne-la avec le curseur.');
  }

  function refresh() {
    ex.set(texte());
    rBout.set(mots(T[S - 1]));
    const day = Math.cos(earthAngle) > 0;
    rToi.set(day ? 'jour : chauffé' : 'nuit'); Lb.toi.el.className = 'sim-label ' + (day ? 'chaud' : 'froid');
    const I = intensite(); rVis.set(I > 0.5 ? 'très chaud' : I > 0.2 ? 'chaud' : I > 0.08 ? 'tiède' : 'à peine tiède');
  }

  function setMode(m) {
    mode = m; userCam = false;
    cMode.set(m); cEx.set(ex2); cManche.set(iso ? 'iso' : 'metal');
    gConv.visible = m === 'convection'; gCond.visible = m === 'conduction'; gRay.visible = m === 'rayonnement';
    gSun.visible = ex2 === 'soleil'; gFire.visible = ex2 === 'feu';
    const espace = m === 'rayonnement' && ex2 === 'soleil';
    labo.visible = !espace; sol.visible = !espace;
    Object.entries(sec).forEach(([k, el]) => (el.style.display = k === m ? 'flex' : 'none'));
    [sRot.el, rToi.el].forEach((e) => (e.style.display = ex2 === 'soleil' ? '' : 'none'));
    [sDist.el, rVis.el].forEach((e) => (e.style.display = ex2 === 'feu' ? '' : 'none'));
    const vis = m === 'rayonnement' ? groupesLb[ex2] : groupesLb[m];
    Object.entries(Lb).forEach(([k, L]) => L.show(vis.includes(k)));
    synth.querySelectorAll('[data-m]').forEach((s) => { const on = s.dataset.m === m; s.style.background = on ? 'var(--fluo)' : 'rgba(20,18,38,.78)'; s.style.color = on ? 'var(--encre)' : '#fff'; });
    defNote.innerHTML = DEF[m];
    refresh();
  }

  // cadrage : la scène tient dans l'écran quelle que soit sa forme (tant que l'élève n'a pas tourné la caméra)
  const CAD = { convection: { c: [0, 2.05, 0], w: 5.4, h: 4.5, dir: [0, 0.2, 1] }, conduction: { c: [0.6, 0.85, 0], w: 4.3, h: 2.9, dir: [0.15, 0.55, 1] }, soleil: { c: [-0.2, 1.75, 0], w: 8.6, h: 4.0, dir: [0, 0.12, 1] }, feu: { c: [-1.2, 1.1, 0], w: 5.2, h: 2.9, dir: [0.25, 0.25, 1] } };
  const camPos = new THREE.Vector3(), camTgt = new THREE.Vector3(), camDir = new THREE.Vector3();
  function fitCam(dt) {
    const c = CAD[mode === 'rayonnement' ? ex2 : mode];
    const tf = Math.tan(THREE.MathUtils.degToRad(st.camera.fov / 2)), a = Math.max(0.3, st.camera.aspect);
    const d = Math.max(c.h / (2 * tf), c.w / (2 * tf * a));
    camTgt.set(...c.c); camPos.copy(camTgt).addScaledVector(camDir.set(...c.dir).normalize(), d);
    const k = 1 - Math.exp(-4 * dt);
    st.camera.position.lerp(camPos, k); st.controls.target.lerp(camTgt, k);
  }

  const step = st.onFrame((dt, time) => {
    if (mode === 'convection') updateConv(dt, time);
    if (mode === 'conduction') { updateCond(dt, time); if (Math.floor(time * 4) !== Math.floor((time - dt) * 4)) refresh(); }
    if (mode === 'rayonnement') updateRay(dt, time);
    if (!userCam) fitCam(dt);
  });
  const stopCam = () => (userCam = true);
  st.renderer.domElement.addEventListener('pointerdown', stopCam);
  st.renderer.domElement.addEventListener('wheel', stopCam, { passive: true });

  // paramètres d'URL pour le banc d'essai (sans effet sur le site) : ?pr_mode=conduction&pr_ex=feu&pr_iso=1&pr_warm=1
  const q = new URLSearchParams(location.search);
  if (q.get('pr_ex') === 'feu') ex2 = 'feu';
  if (q.get('pr_iso') === '1') iso = true;
  setMode(['convection', 'conduction', 'rayonnement'].includes(q.get('pr_mode')) ? q.get('pr_mode') : 'convection');
  egl.position.x = FX + 0.45 + dist;
  // capture sans écran : laisse la scène évoluer une fois la page mise en place
  let warmT = 0;
  if (q.has('pr_warm')) warmT = setTimeout(() => { for (let i = 0; i < 900; i++) step(1 / 60, i / 60); refresh(); }, 300);

  return {
    dispose() {
      clearTimeout(warmT);
      st.renderer.domElement.removeEventListener('pointerdown', stopCam);
      st.renderer.domElement.removeEventListener('wheel', stopCam);
      synth.remove();
      st.dispose();
    },
  };
}
