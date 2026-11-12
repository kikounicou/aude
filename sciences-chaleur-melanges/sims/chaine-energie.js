// chaine-energie.js — « La chaîne d'énergie » (thème 5, partie A, texte d'Églantine).
// L'élève choisit un réservoir et un transformateur du texte ; le receveur est le salon d'Églantine.
// Particules : violet = énergie chimique, orange = énergie thermique, jaune pâle = énergie lumineuse,
// rouge = énergie thermique non désirée (forme dégradée d'énergie).
import { THREE, C, layout, createStage, panel, explain, ground, molecules, clamp, rand } from './kit.js';

// ---------- Le contenu (mots du cours) ----------
const RES = {
  bois: { label: 'Bûches de bois', nom: 'Bûches de bois', le: 'les <b>bûches de bois</b>', du: 'des <b>bûches de bois</b>' },
  mazout: { label: 'Mazout', nom: 'Mazout', le: 'le <b>mazout</b>', du: 'du <b>mazout</b>' },
  charbon: { label: 'Charbon', nom: 'Charbon', le: 'le <b>charbon</b>', du: 'du <b>charbon</b>' },
  soleil: { label: 'Soleil', nom: 'Soleil', le: 'le <b>soleil</b>', du: 'du <b>soleil</b>' },
  aliments: { label: 'Aliments (raclette, fondue)', nom: 'Raclette, fondue<br>(aliments)', le: 'les <b>aliments</b>', du: 'des <b>aliments</b>' },
};
const TRA = {
  feu: { label: 'Feu ouvert', nom: 'Feu ouvert', attend: 'bois', sortie: 'énergie thermique<br>et énergie lumineuse',
    regle: 'Dans le texte, le <b>feu ouvert</b> brûle des <b>bûches de bois</b>.', perte: 'par la cheminée, avec la fumée,' },
  chaudiere: { label: 'Chaudière + radiateurs', nom: 'Chaudière<br>et radiateurs', attend: null, sortie: 'énergie thermique',
    regle: 'Dans le texte, la <b>chaudière</b> marche au <b>mazout</b>.', perte: 'par la cheminée de la chaudière, par les tuyaux' },
  poele: { label: 'Poêle à charbon', nom: 'Poêle à charbon', attend: null, sortie: 'énergie thermique',
    regle: 'Dans le texte, le <b>poêle</b> est un poêle à <b>charbon</b>.', perte: 'par le tuyau du poêle, avec la fumée,' },
  cuisiniere: { label: 'Cuisinière électrique', nom: 'Cuisinière<br>électrique', attend: null },
  elle: { label: 'Églantine', nom: 'Églantine', attend: 'aliments', sortie: 'énergie thermique' },
};
const OK = {
  feu: "Les <b>bûches de bois</b> sont le <mark>réservoir</mark> : elles contiennent de l'<mark>énergie chimique</mark>. Le <b>feu ouvert</b> est le <mark>transformateur</mark> : il la restitue sous une autre forme, en <mark>énergie thermique</mark> et <mark>énergie lumineuse</mark>. Le salon est le <mark>receveur</mark> : c'est la chaîne du cours !",
  chaudiere: "Le <b>mazout</b> est le <mark>réservoir</mark> (<mark>énergie chimique</mark>). La <b>chaudière</b> la transforme en <mark>énergie thermique</mark>, puis les radiateurs la restituent <mark>sous la même forme</mark> : deux <mark>transformateurs</mark> à la suite. Le salon est le <mark>receveur</mark>.",
  poele: "Le <b>charbon</b> est le <mark>réservoir</mark> (<mark>énergie chimique</mark>). Le <b>poêle à charbon</b> est le <mark>transformateur</mark> : il la restitue en <mark>énergie thermique</mark>. Le salon est le <mark>receveur</mark>.",
  elle: "La raclette et la fondue sont des <b>aliments</b> : un <mark>réservoir</mark> d'<mark>énergie chimique</mark>. Églantine est le <mark>transformateur</mark> : son corps produit de l'<mark>énergie thermique</mark>. Ici, le <mark>receveur</mark>, c'est elle (elle se réchauffe), pas le salon !",
};

// Combinaison incohérente : on le dit gentiment, avec la raison tirée du texte.
function pasBon(r, t) {
  const R = RES[r], T = TRA[t];
  if (r === 'soleil') return "Le <b>soleil</b> est bien un <mark>réservoir naturel</mark> d'énergie, mais aucun de ces <mark>transformateurs</mark> ne fonctionne avec lui. Dans le texte, il réchauffe Églantine sur les pistes. Pour le salon, essaie un autre réservoir.";
  if (t === 'cuisiniere') return `La <b>cuisinière électrique</b> est bien un <mark>transformateur</mark>, mais elle reçoit de l'<mark>énergie électrique</mark> : ${R.le} ne la lui ${R.le.startsWith('les') ? 'donnent' : 'donne'} pas directement. Dans le texte, elle sert à préparer la raclette, pas à chauffer le salon.`;
  if (t === 'elle') return `Églantine ne transforme pas l'énergie ${R.du} : son corps transforme l'<mark>énergie chimique</mark> des <b>aliments</b> qu'elle mange. Change le <mark>réservoir</mark> ou le <mark>transformateur</mark>.`;
  if (r === 'mazout' && t === 'chaudiere') return "Le <b>mazout</b> est bien le <mark>réservoir</mark> de la <b>chaudière</b>, un <mark>transformateur</mark>. Mais dans le texte, la chaudière et ses radiateurs chauffent <b>les chambres</b>, pas le salon. Dans le salon, c'est le <b>feu ouvert</b> qui chauffe.";
  if (t === 'poele') return "Dans le texte, papa a remplacé le vieux <b>poêle à charbon</b> par des radiateurs : il n'y a plus de poêle. Pour le salon, regarde ce qui brûle dans le feu ouvert.";
  if (r === 'aliments') return "On ne chauffe pas le salon en brûlant de la raclette ! L'<mark>énergie chimique</mark> des aliments, c'est le corps d'Églantine qui la transforme.";
  return `${T.regle} Avec ${R.le}, la chaîne ne fonctionne pas : change le <mark>réservoir</mark> ou le <mark>transformateur</mark>.`;
}
function txtDegrade(t) {
  if (t === 'elle') return "Les particules rouges : de l'<mark>énergie thermique</mark> qui s'échappe de son corps vers l'air froid, perdue pour elle. Sa doudoune <mark>ralentit les échanges de chaleur</mark> entre son corps et l'extérieur.";
  return `Les particules rouges : de l'<mark>énergie thermique non désirée</mark> qui s'échappe ${TRA[t].perte} et par l'échauffement des objets. Perdue pour le montage, c'est une <mark>forme dégradée d'énergie</mark>.`;
}

// ---------- Petits outils 3D ----------
const std = (color, o) => new THREE.MeshStandardMaterial(Object.assign({ color, roughness: 0.65 }, o));
const glow = (color, opacity = 0.9) => new THREE.MeshBasicMaterial({ color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false });
const Box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const Cyl = (a, b, h, s = 20, open = false) => new THREE.CylinderGeometry(a, b, h, s, 1, open);
function put(parent, geo, mat, x = 0, y = 0, z = 0) { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); parent.add(m); return m; }

// ---------- Les réservoirs ----------
function buildBois() {
  const g = new THREE.Group(), ecorce = std(0x7a4a26, { roughness: 0.9 }), coupe = std(0xd9a86a);
  [[-0.21, 0.2], [0.21, 0.2], [0, 0.54]].forEach(([x, y]) => { put(g, Cyl(0.2, 0.2, 1.0, 16), [ecorce, coupe, coupe], x, y, 0).rotation.x = Math.PI / 2; });
  g.rotation.y = 0.35;
  return g;
}
function buildMazout() {
  const g = new THREE.Group(), vert = std(0x4f7a5a, { roughness: 0.5, metalness: 0.2 }), fonce = std(0x3a5a44);
  put(g, Cyl(0.4, 0.4, 1.1, 28), vert, 0, 0.5, 0).rotation.z = Math.PI / 2;
  [-0.35, 0.35].forEach((x) => { put(g, new THREE.TorusGeometry(0.405, 0.025, 8, 32), fonce, x, 0.5, 0).rotation.y = Math.PI / 2; put(g, Box(0.1, 0.12, 0.5), fonce, x, 0.06, 0); });
  put(g, Cyl(0.06, 0.06, 0.12, 12), std(0x2f2f36), 0.2, 0.94, 0);
  const goutte = new THREE.Group(); g.add(goutte);
  const huile = std(0x3b2a14, { roughness: 0.15, metalness: 0.3 });
  put(goutte, new THREE.SphereGeometry(0.12, 16, 12), huile);
  put(goutte, new THREE.ConeGeometry(0.115, 0.2, 16), huile, 0, 0.13, 0);
  g.userData.tick = (dt, t) => { goutte.position.y = 1.25 + Math.sin(t * 2) * 0.05; };
  return g;
}
function buildCharbon() {
  const g = new THREE.Group(), met = std(0x707888, { metalness: 0.6, roughness: 0.4, side: THREE.DoubleSide });
  put(g, Cyl(0.42, 0.32, 0.55, 24, true), met, 0, 0.29, 0);
  put(g, new THREE.CircleGeometry(0.32, 24), met, 0, 0.02, 0).rotation.x = -Math.PI / 2;
  put(g, new THREE.TorusGeometry(0.42, 0.02, 6, 24, Math.PI), met, 0, 0.56, 0);
  const noir = std(0x1c1c22, { roughness: 0.45, metalness: 0.25 });
  for (let i = 0; i < 11; i++) {
    const a = i * 2.4, r = i === 0 ? 0 : 0.12 + (i % 3) * 0.08;
    put(g, new THREE.DodecahedronGeometry(0.1 + (i % 4) * 0.015), noir, Math.cos(a) * r, 0.55 + (i % 2) * 0.06 + (i === 0 ? 0.08 : 0), Math.sin(a) * r).rotation.set(i, i * 2, i * 3);
  }
  return g;
}
function buildSoleil() {
  const g = new THREE.Group();
  put(g, new THREE.SphereGeometry(0.42, 28, 20), new THREE.MeshBasicMaterial({ color: 0xffd23f }), 0, 1.0, 0);
  put(g, new THREE.SphereGeometry(0.6, 28, 20), glow(0xffa31a, 0.22), 0, 1.0, 0);
  const rayons = new THREE.Group(); rayons.position.y = 1.0; g.add(rayons);
  const rm = glow(0xffd23f, 0.85);
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; put(rayons, new THREE.ConeGeometry(0.06, 0.26, 10), rm, Math.cos(a) * 0.74, Math.sin(a) * 0.74, 0).rotation.z = a - Math.PI / 2; }
  g.userData.tick = (dt, t) => { rayons.rotation.z = t * 0.3; const s = 1 + 0.06 * Math.sin(t * 2.5); rayons.scale.set(s, s, 1); };
  return g;
}
function buildAliments() {
  const g = new THREE.Group();
  put(g, Cyl(0.3, 0.34, 0.14, 20), std(0x3a3644, { metalness: 0.5 }), 0, 0.07, 0); // réchaud
  put(g, Cyl(0.42, 0.3, 0.36, 26), std(0xb3402a, { roughness: 0.5 }), 0, 0.32, 0); // caquelon
  put(g, Cyl(0.39, 0.39, 0.03, 26), std(0xffcf5a, { roughness: 0.4, emissive: 0x6a4a00, emissiveIntensity: 0.3 }), 0, 0.49, 0); // fromage
  put(g, Box(0.36, 0.06, 0.08), std(0x5a2a1a), 0.55, 0.42, 0);
  const metal = std(C.metal, { metalness: 0.7, roughness: 0.3 });
  [[-0.5, -0.08, 0.05], [0.45, 0.1, -0.05]].forEach(([a, tx, z]) => { // fourchettes à fondue
    put(g, Cyl(0.012, 0.012, 0.75, 6), metal, tx - 0.375 * Math.sin(a), 0.5 + 0.375 * Math.cos(a), z).rotation.z = a;
  });
  const pdt = std(0xd8b56a);
  put(g, new THREE.SphereGeometry(0.1, 12, 10), pdt, -0.56, 0.09, 0.25).scale.set(1.2, 0.9, 1);
  put(g, new THREE.SphereGeometry(0.09, 12, 10), pdt, -0.4, 0.08, 0.42).scale.set(1.1, 0.9, 1);
  return g;
}

// ---------- Les transformateurs ----------
function buildFeu() {
  const g = new THREE.Group(), pierre = std(0x9b93ab, { roughness: 0.9 }), fond = std(0x2a2232, { roughness: 1 });
  put(g, Box(1.5, 0.12, 0.7), pierre, 0, 0.06, 0);
  put(g, Box(0.26, 0.95, 0.6), pierre, -0.6, 0.595, 0);
  put(g, Box(0.26, 0.95, 0.6), pierre, 0.6, 0.595, 0);
  put(g, Box(1.6, 0.24, 0.7), pierre, 0, 1.19, 0);
  put(g, Box(0.96, 0.95, 0.08), fond, 0, 0.595, -0.26);
  put(g, Box(0.62, 1.0, 0.5), pierre, 0, 1.8, -0.05); // cheminée
  const ecorce = std(0x6e4424);
  put(g, Cyl(0.07, 0.07, 0.62, 10), ecorce, 0, 0.19, 0.02).rotation.set(0, 0.3, Math.PI / 2);
  put(g, Cyl(0.07, 0.07, 0.62, 10), ecorce, 0, 0.19, -0.06).rotation.set(0, -0.3, Math.PI / 2);
  const flammes = [[-0.17, 0xff6a1f], [0, 0xffd04a], [0.17, 0xff6a1f], [0.07, 0xffb43a]].map(([x, c]) => put(g, new THREE.ConeGeometry(0.11, 0.42, 12), glow(c), x, 0.33, 0.04));
  g.userData.tick = (dt, t, on) => flammes.forEach((f, i) => {
    const k = Math.max(0.001, on * (0.85 + 0.2 * Math.sin(t * 9 + i * 1.7) + 0.08 * Math.sin(t * 23 + i)));
    f.scale.set(Math.max(0.001, on), k, Math.max(0.001, on)); f.position.y = 0.12 + 0.21 * k;
  });
  g.userData.emit = [{ p: [0, 2.32, -0.05], d: [0, 1, 0] }, { p: [-0.76, 0.7, 0.2], d: [-1, 0.4, 0.3] }, { p: [0.76, 0.7, 0.2], d: [1, 0.4, 0.3] }];
  g.userData.lightPos = [0, 0.5, 0.45];
  return g;
}
function buildChaudiere() {
  const g = new THREE.Group(), blanc = std(0xe9ecf2, { roughness: 0.4 });
  put(g, Box(0.62, 1.0, 0.5), blanc, -0.42, 0.5, 0);
  const fen = put(g, Box(0.22, 0.14, 0.02), glow(0xff7a2a, 0), -0.42, 0.35, 0.26); // brûleur
  put(g, Box(0.4, 0.08, 0.02), std(0x9aa3b5), -0.42, 0.82, 0.26);
  put(g, Cyl(0.07, 0.07, 0.8, 12), std(0x8a8f9c, { metalness: 0.5 }), -0.42, 1.4, -0.05); // conduit de fumée
  put(g, Cyl(0.03, 0.03, 0.32, 8), std(0xc77b4a, { metalness: 0.6, roughness: 0.3 }), 0.03, 0.2, 0.05).rotation.z = Math.PI / 2;
  const radMat = std(0xf4f4f6, { roughness: 0.45, emissive: C.chaud, emissiveIntensity: 0 });
  for (let i = 0; i < 6; i++) put(g, Box(0.075, 0.62, 0.2), radMat, 0.22 + i * 0.1, 0.5, 0);
  put(g, Box(0.6, 0.04, 0.12), radMat, 0.47, 0.2, 0);
  put(g, Box(0.6, 0.04, 0.12), radMat, 0.47, 0.8, 0);
  g.userData.tick = (dt, t, on) => { fen.material.opacity = on * (0.75 + 0.2 * Math.sin(t * 13)); radMat.emissiveIntensity = on * 0.32; };
  g.userData.emit = [{ p: [-0.42, 1.85, -0.05], d: [0, 1, 0] }, { p: [-0.76, 0.6, 0], d: [-1, 0.3, 0.2] }, { p: [0.03, 0.24, 0.1], d: [0, 0.6, 1] }];
  g.userData.pipe = [new THREE.Vector3(-0.11, 0.2, 0.1), new THREE.Vector3(0.18, 0.2, 0.1)];
  g.userData.lightPos = [-0.42, 0.4, 0.55];
  return g;
}
function buildPoele() {
  const g = new THREE.Group(), fonte = std(0x2b2b33, { metalness: 0.55, roughness: 0.45 });
  put(g, Cyl(0.34, 0.34, 0.75, 24), fonte, 0, 0.6, 0);
  put(g, Cyl(0.38, 0.38, 0.06, 24), fonte, 0, 1.0, 0);
  put(g, Cyl(0.36, 0.3, 0.08, 24), fonte, 0, 0.2, 0);
  for (let i = 0; i < 3; i++) { const a = i * 2.094 + 0.5; put(g, Cyl(0.035, 0.035, 0.2, 8), fonte, Math.cos(a) * 0.25, 0.08, Math.sin(a) * 0.25); }
  const fen = put(g, new THREE.CircleGeometry(0.13, 20), glow(0xff7a2a, 0), 0, 0.58, 0.345);
  put(g, Cyl(0.075, 0.075, 1.15, 12), fonte, 0, 1.6, 0); // tuyau
  g.userData.tick = (dt, t, on) => { fen.material.opacity = on * (0.8 + 0.2 * Math.sin(t * 11)); };
  g.userData.emit = [{ p: [0, 2.22, 0], d: [0, 1, 0] }, { p: [-0.38, 0.6, 0.1], d: [-1, 0.3, 0.3] }, { p: [0.38, 0.6, 0.1], d: [1, 0.3, 0.3] }];
  g.userData.lightPos = [0, 0.55, 0.6];
  return g;
}
function buildCuisiniere() {
  const g = new THREE.Group(), noir = std(0x1f1f26, { roughness: 0.3 });
  put(g, Box(0.95, 0.86, 0.62), std(0xeef0f4, { roughness: 0.35 }), 0, 0.43, 0);
  put(g, Box(0.93, 0.02, 0.6), std(0x30303a, { roughness: 0.2 }), 0, 0.87, 0);
  [[-0.22, -0.14, 0.13], [0.22, -0.14, 0.1], [-0.22, 0.14, 0.1], [0.22, 0.14, 0.13]].forEach(([x, z, r]) => put(g, Cyl(r, r, 0.02, 20), noir, x, 0.89, z));
  put(g, Box(0.66, 0.34, 0.02), noir, 0, 0.38, 0.315); // porte du four
  for (let i = 0; i < 4; i++) put(g, Cyl(0.035, 0.035, 0.04, 10), noir, -0.3 + i * 0.2, 0.72, 0.32).rotation.x = Math.PI / 2;
  return g;
}
function buildEglantine() {
  const g = new THREE.Group(), jean = std(0x2b3a6b), doudoune = std(0x8f6bff, { roughness: 0.5 }), peau = std(0xf1c7a1);
  put(g, Cyl(0.075, 0.07, 0.5, 10), jean, -0.1, 0.25, 0);
  put(g, Cyl(0.075, 0.07, 0.5, 10), jean, 0.1, 0.25, 0);
  put(g, new THREE.CapsuleGeometry(0.25, 0.4, 6, 14), doudoune, 0, 0.88, 0);
  put(g, new THREE.CapsuleGeometry(0.075, 0.38, 4, 10), doudoune, -0.3, 0.86, 0).rotation.z = -0.35;
  put(g, new THREE.CapsuleGeometry(0.075, 0.38, 4, 10), doudoune, 0.3, 0.86, 0).rotation.z = 0.35;
  put(g, new THREE.SphereGeometry(0.2, 20, 16), peau, 0, 1.42, 0);
  put(g, new THREE.SphereGeometry(0.212, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), std(0x19c3a6), 0, 1.45, 0); // bonnet
  put(g, new THREE.SphereGeometry(0.06, 10, 8), std(0xffffff), 0, 1.68, 0);
  put(g, new THREE.SphereGeometry(0.025, 8, 6), std(0x1d1b2f), -0.07, 1.43, 0.185);
  put(g, new THREE.SphereGeometry(0.025, 8, 6), std(0x1d1b2f), 0.07, 1.43, 0.185);
  g.userData.emit = [{ p: [0, 0.9, 0], r: 0.36 }];
  return g;
}

// ---------- Le receveur : le salon d'Églantine ----------
function buildSalon() {
  const g = new THREE.Group();
  put(g, Box(1.9, 0.08, 1.5), std(0x9a6b45, { roughness: 0.8 }), 0, 0.04, 0);
  const mur = std(0xcfc4e6, { roughness: 0.95, emissive: 0xff7a3c, emissiveIntensity: 0 });
  put(g, Box(1.9, 1.35, 0.07), mur, 0, 0.75, -0.72);
  put(g, Box(0.07, 1.35, 1.5), mur, 0.92, 0.75, 0);
  put(g, Box(0.6, 0.48, 0.02), std(0x22306a, { emissive: 0x1a2250, emissiveIntensity: 0.6 }), -0.3, 0.88, -0.68); // fenêtre (nuit)
  const cadre = std(0xffffff);
  [[0, 1.13, 0.66, 0.04], [0, 0.63, 0.66, 0.04], [-0.31, 0.88, 0.04, 0.52], [0.31, 0.88, 0.04, 0.52], [0, 0.88, 0.03, 0.5]].forEach(([x, y, w, h]) => put(g, Box(w, h, 0.03), cadre, -0.3 + x, y, -0.67));
  const tissu = std(0x2f8f7f, { roughness: 0.9 });
  put(g, Box(0.95, 0.22, 0.42), tissu, 0.3, 0.19, -0.44); // canapé
  put(g, Box(0.95, 0.38, 0.12), tissu, 0.3, 0.42, -0.62);
  put(g, Box(0.12, 0.3, 0.42), tissu, -0.15, 0.3, -0.44);
  put(g, Box(0.12, 0.3, 0.42), tissu, 0.75, 0.3, -0.44);
  put(g, Cyl(0.42, 0.42, 0.02, 32), std(0xc9a0ff, { roughness: 1 }), -0.15, 0.09, 0.28); // tapis de laine
  return { g, mur };
}

// ---------- Une flèche courbe entre deux objets ----------
function arrow(p0, p2, apex) {
  const c = new THREE.Vector3((p0.x + p2.x) / 2, 2 * apex - (p0.y + p2.y) / 2, (p0.z + p2.z) / 2);
  const curve = new THREE.QuadraticBezierCurve3(p0, c, p2);
  const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.26, depthWrite: false });
  const g = new THREE.Group();
  g.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 48, 0.022, 8), mat));
  const tan = curve.getTangent(1), head = new THREE.Mesh(new THREE.ConeGeometry(0.085, 0.24, 14), mat);
  head.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tan);
  head.position.copy(p2).addScaledVector(tan, -0.1);
  g.add(head);
  return { g, curve, mat, apex: curve.getPoint(0.5) };
}

export default function mount(root) {
  const { stageEl, panelEl, explainEl } = layout(root);
  const st = createStage(stageEl, { camera: { pos: [0, 3.9, 9], target: [0, 0.85, 0], fov: 40 }, maxDistance: 22 });
  const { scene, camera, controls } = st;
  scene.add(ground(26));
  const q = new URLSearchParams(location.search);
  const ex = explain(explainEl);
  const XR = -2.6, XT = 0, XS = 2.6;

  const resObjs = { bois: buildBois(), mazout: buildMazout(), charbon: buildCharbon(), soleil: buildSoleil(), aliments: buildAliments() };
  const traObjs = { feu: buildFeu(), chaudiere: buildChaudiere(), poele: buildPoele(), cuisiniere: buildCuisiniere(), elle: buildEglantine() };
  for (const g of Object.values(resObjs)) { g.position.x = XR; g.scale.setScalar(0.0001); scene.add(g); }
  for (const g of Object.values(traObjs)) { g.position.x = XT; g.scale.setScalar(0.0001); scene.add(g); }
  const salon = buildSalon(); salon.g.position.x = XS; scene.add(salon.g);
  // Deux lumières seulement, toujours présentes (pas de recompilation des matériaux quand on change d'objet).
  const feuLight = new THREE.PointLight(0xff8a3c, 0, 5, 1.6); scene.add(feuLight);
  const salonLight = new THREE.PointLight(0xff9a5a, 0, 4, 1.4); salonLight.position.set(XS - 0.1, 0.9, 0.25); scene.add(salonLight);

  const a1 = arrow(new THREE.Vector3(XR + 0.55, 1.05, 0), new THREE.Vector3(XT - 0.85, 1.05, 0), 2.05);
  const a2 = arrow(new THREE.Vector3(XT + 0.85, 1.05, 0), new THREE.Vector3(XS - 0.7, 0.75, 0.1), 2.05);
  scene.add(a1.g, a2.g);

  // ---------- Étiquettes (termes du cours) ----------
  const labels = [];
  const lab = (tx, pos, cls) => { const l = st.label(tx, pos, { cls }); labels.push(l); return l; };
  const V = (x, y, z = 0.3) => new THREE.Vector3(x, y, z);
  const lRoleR = lab('Réservoir', V(XR, -0.3), 'fluo'), lRoleT = lab('Transformateur', V(XT, -0.3), 'fluo'), lRoleS = lab('Receveur', V(XS, -0.3), 'fluo');
  const lNomR = lab('', V(XR, -0.86)), lNomT = lab('', V(XT, -0.86)), lNomS = lab("Salon d'Églantine", V(XS, -0.86));
  const lE1 = lab('énergie chimique', a1.apex), lE2 = lab('', a2.apex);
  const lX = lab('✕', V(XT - 1.0, 1.4, 0), 'chaud');
  const lHalo = lab('énergie thermique', V(XT + 1.15, 1.1, 0));
  const posDeg = V(XT, 3.0, 0), lDeg = lab('', posDeg, 'chaud');

  // ---------- Particules d'énergie (une seule InstancedMesh) ----------
  const N1 = 34, N2 = 34, NI = 8, ND = 70, D0 = N1 + N2 + NI;
  const P = molecules(D0 + ND, { radius: 0.055, segments: 10 });
  P.mesh.material.dispose();
  P.mesh.material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
  scene.add(P.mesh);
  const COL = { chimique: new THREE.Color(0xa58bff), thermique: new THREE.Color(0xff9a3c), lumineuse: new THREE.Color(0xfff1a8), soleil: new THREE.Color(0xffe27a), degrade: new THREE.Color(0xff2e2e) };
  const dp = [], dv = [], dage = new Float32Array(ND), dlife = new Float32Array(ND);
  for (let i = 0; i < ND; i++) { dp.push(new THREE.Vector3()); dv.push(new THREE.Vector3()); P.setColor(D0 + i, COL.degrade); }

  // ---------- État ----------
  let res = RES[q.get('r')] ? q.get('r') : 'bois';
  let tra = TRA[q.get('t')] ? q.get('t') : 'feu';
  let degOn = q.get('d') === '1';
  let ok = false, onAmt = 0, warm = 0, amp1 = 0, amp2 = 0, degAmt = 0, spawnAcc = 0;

  // ---------- Réglages ----------
  const ui = panel(panelEl);
  ui.title("Construis la chaîne du salon d'Églantine");
  ui.note('Schéma du cours : <b>(E) Réservoir → transformateur(s) → receveur</b>. Ici, le receveur est le salon.');
  const chR = ui.choice({ label: '1. Choisis un réservoir', options: Object.entries(RES).map(([v, o]) => ({ value: v, label: o.label })), value: res, onChange: (v) => { res = v; changed(); } });
  const chT = ui.choice({ label: '2. Choisis un transformateur', options: Object.entries(TRA).map(([v, o]) => ({ value: v, label: o.label })), value: tra, onChange: (v) => { tra = v; changed(); } });
  const [bDeg] = ui.buttons([
    { label: "Montrer l'énergie dégradée", onClick() { degOn = !degOn; refresh(); } },
    { label: 'La chaîne du cours', onClick() { res = 'bois'; tra = 'feu'; chR.set(res); chT.set(tra); changed(); } },
  ]);
  const roChaine = ui.readout('La chaîne'), roSalon = ui.readout('Le salon');

  function changed() { amp1 = 0; refresh(); }
  function refresh() {
    ok = TRA[tra].attend === res;
    const R = RES[res], T = TRA[tra], elle = ok && tra === 'elle';
    lNomR.set(R.nom);
    lNomT.set(elle ? 'Églantine<br>(receveur : elle-même)' : T.nom);
    lRoleT.set(tra === 'chaudiere' ? 'Transformateurs' : 'Transformateur');
    lE1.set(res === 'soleil' ? 'énergie du soleil' : 'énergie chimique');
    lE2.set(T.sortie || ''); lE2.show(ok && tra !== 'elle');
    lHalo.show(elle); lX.show(!ok);
    lRoleS.el.style.opacity = lNomS.el.style.opacity = ok && !elle ? '1' : '0.45';
    lDeg.set(elle ? 'énergie thermique perdue' : "énergie thermique non désirée<br>= forme dégradée d'énergie");
    if (elle) posDeg.set(XT + 0.95, 2.05, 0); else posDeg.set(tra === 'chaudiere' ? XT - 0.42 : XT, 3.0, 0);
    lDeg.show(degOn && ok);
    bDeg.classList.toggle('on', degOn);
    bDeg.textContent = degOn ? "Cacher l'énergie dégradée" : "Montrer l'énergie dégradée";
    roChaine.set(ok ? (elle ? '✓ receveur : Églantine' : '✓ elle fonctionne') : '<span style="color:#ff8a6a">✕ à revoir</span>');
    roSalon.set(ok && !elle ? 'se réchauffe' : 'reste froid');
    let html;
    if (!ok) html = pasBon(res, tra) + (degOn ? " <i>L'énergie dégradée apparaîtra quand la chaîne fonctionnera.</i>" : '');
    else if (degOn) html = (elle ? 'Aliments (<mark>réservoir</mark>) → Églantine (<mark>transformateur</mark>). ' : `${R.label} (<mark>réservoir</mark>) → ${T.label} (<mark>transformateur</mark>) → salon (<mark>receveur</mark>). `) + txtDegrade(tra);
    else html = OK[tra];
    ex.set(html);
  }

  // Une particule rouge s'échappe du transformateur ou du trajet vers le salon.
  function spawn() {
    let i = -1;
    for (let k = 0; k < ND; k++) if (dage[k] >= dlife[k]) { i = k; break; }
    if (i < 0) return;
    const em = traObjs[tra].userData.emit || [];
    if (tra !== 'elle' && Math.random() < 0.3) {
      a2.curve.getPoint(rand(0.15, 0.85), dp[i]);
      dv[i].set(rand(-0.25, 0.25), rand(0.25, 0.55), rand(0.15, 0.45));
    } else if (em.length) {
      const e = em[(Math.random() * em.length) | 0];
      if (e.r) { const a = rand(0, Math.PI * 2); dp[i].set(XT + Math.cos(a) * e.r, e.p[1] + rand(-0.35, 0.45), Math.sin(a) * e.r); dv[i].set(Math.cos(a) * 0.45, rand(0, 0.25), Math.sin(a) * 0.45); }
      else { dp[i].set(XT + e.p[0] + rand(-0.08, 0.08), e.p[1] + rand(-0.08, 0.08), e.p[2] + rand(-0.08, 0.08)); dv[i].set(e.d[0] * 0.5 + rand(-0.15, 0.15), e.d[1] * 0.5 + rand(0.05, 0.25), e.d[2] * 0.5 + rand(-0.1, 0.1)); }
    } else return;
    dage[i] = 0; dlife[i] = rand(1.3, 2.2);
  }

  // Cadrage : toute la chaîne tient dans l'écran, même sur téléphone.
  let lastAsp = 0, narrow = null;
  function fit() {
    const { w, h } = st.size(), asp = w / h;
    if (Math.abs(asp - lastAsp) < 0.005) return;
    lastAsp = asp;
    const vt = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const d = Math.max(2.6 / vt, 3.95 / (vt * asp)) + 0.3;
    const dir = camera.position.clone().sub(controls.target).normalize();
    camera.position.copy(controls.target).addScaledVector(dir, d);
    controls.minDistance = d * 0.45; controls.maxDistance = d * 1.6;
    const nar = w < 560;
    if (nar !== narrow) { narrow = nar; labels.forEach((l) => { l.el.style.fontSize = nar ? '11.5px' : ''; }); }
  }

  const tmp = new THREE.Vector3();
  function grow(g, sel, k, dt, t) {
    const s = g.scale.x + ((sel ? 1 : 0) - g.scale.x) * k;
    g.scale.setScalar(Math.max(0.0001, s));
    g.visible = s > 0.01;
    if (g.visible && g.userData.tick) g.userData.tick(dt, t, sel ? onAmt : 0);
  }

  let tt = 0;
  function frame(dt) {
    tt += dt; const t = tt;
    fit();
    const k = 1 - Math.exp(-8 * dt), slow = (r) => 1 - Math.exp(-r * dt);
    const elle = ok && tra === 'elle';
    onAmt += ((ok ? 1 : 0) - onAmt) * slow(3);
    warm += ((ok && !elle ? 1 : 0) - warm) * slow(0.9);
    amp1 += (1 - amp1) * slow(2.5);
    amp2 += ((ok ? 1 : 0) - amp2) * slow(2.5);
    degAmt += ((degOn && ok ? 1 : 0) - degAmt) * k;
    for (const [key, g] of Object.entries(resObjs)) grow(g, key === res, k, dt, t);
    for (const [key, g] of Object.entries(traObjs)) grow(g, key === tra, k, dt, t);

    // le salon se réchauffe ; la lumière du feu (ou du brûleur) vacille
    salon.mur.emissiveIntensity = warm * 0.3;
    salonLight.intensity = warm * (tra === 'feu' ? 5 : 3.5);
    const lp = traObjs[tra].userData.lightPos;
    if (lp) feuLight.position.set(XT + lp[0], lp[1], lp[2]);
    feuLight.intensity = lp ? onAmt * (2.5 + 0.6 * Math.sin(t * 11) + 0.3 * Math.sin(t * 27)) : 0;
    a2.mat.opacity = 0.05 + 0.21 * (elle ? 0 : amp2);

    // 1. réservoir → transformateur (bloqué si la chaîne ne colle pas)
    for (let i = 0; i < N1; i++) {
      const u = (t * 0.3 + i / N1) % 1;
      a1.curve.getPoint(u, tmp);
      let s = amp1 * Math.min(1, u / 0.06);
      s *= ok ? Math.min(1, (1 - u) / 0.06) : clamp((0.9 - u) / 0.15, 0, 1);
      P.setPos(i, tmp.x, tmp.y + Math.sin(t * 3 + i) * 0.03, tmp.z + Math.cos(t * 2.3 + i * 1.7) * 0.05, s);
      P.setColor(i, res === 'soleil' ? COL.soleil : COL.chimique);
    }
    // 2. transformateur → receveur (ou halo autour d'Églantine)
    for (let j = 0; j < N2; j++) {
      let s = amp2;
      if (tra === 'elle') {
        const a = t * 1.2 + (j / N2) * Math.PI * 2;
        tmp.set(XT + Math.cos(a) * 0.5, 0.45 + ((j * 0.37 + t * 0.2) % 1), Math.sin(a) * 0.5);
      } else {
        const u = (t * 0.3 + j / N2) % 1;
        a2.curve.getPoint(u, tmp);
        s *= Math.min(1, u / 0.06, (1 - u) / 0.06);
        tmp.y += Math.sin(t * 3 + j) * 0.03; tmp.z += Math.cos(t * 2.3 + j * 1.7) * 0.05;
      }
      P.setPos(N1 + j, tmp.x, tmp.y, tmp.z, s);
      P.setColor(N1 + j, tra === 'feu' && j % 2 ? COL.lumineuse : COL.thermique);
    }
    // 3. de la chaudière vers les radiateurs (énergie thermique, sous la même forme)
    const pipe = traObjs.chaudiere.userData.pipe;
    for (let j = 0; j < NI; j++) {
      tmp.lerpVectors(pipe[0], pipe[1], (t * 0.6 + j / NI) % 1);
      P.setPos(N1 + N2 + j, XT + tmp.x, tmp.y, tmp.z + 0.02, tra === 'chaudiere' ? onAmt * 0.7 : 0);
      P.setColor(N1 + N2 + j, COL.thermique);
    }
    // 4. énergie thermique non désirée : forme dégradée d'énergie
    if (degAmt > 0.3) { spawnAcc += dt * 32 * degAmt; while (spawnAcc >= 1) { spawn(); spawnAcc -= 1; } }
    for (let i = 0; i < ND; i++) {
      if (dage[i] < dlife[i]) {
        dage[i] += dt; dv[i].y += 0.1 * dt; dp[i].addScaledVector(dv[i], dt);
        P.setPos(D0 + i, dp[i].x, dp[i].y, dp[i].z, Math.sin(Math.PI * Math.min(1, dage[i] / dlife[i])) * 1.1);
      } else P.setPos(D0 + i, 0, -99, 0, 0.0001);
    }
    P.commit();
  }
  st.onFrame(frame);

  refresh();
  // Banc d'essai : ?avance=3 fait tourner 3 s de simulation tout de suite (captures sans écran).
  for (let i = 0, n = clamp(+q.get('avance') || 0, 0, 10) * 60; i < n; i++) frame(1 / 60);
  return { dispose() { st.dispose(); } };
}
