// Schémas du chapitre 3 (cours/03, page 12 seulement) : les trois types de volcanisme.
//  - les trois schémas imprimés du tableau 2.3 (croquis simplifiés) : subduction, accrétion, point chaud ;
//  - les trois petits schémas dessinés à la main, à savoir refaire : bleu = la surface, les plaques, le volcan ;
//    rouge = le magma qui monte et les boucles de convection. Chacun existe en trois formes : avec numéros (à légender),
//    « pas à pas » (quatre cases, le trait nouveau surligné) et en icône (sans numéros).
// SCHEMAS[id] = { titre, labels: [...dans l'ordre des numéros], svg }   ·   labels vide = simple illustration.
import { ENCRE, TXT, pin, wrap } from './_outils.js';

export const BLEU = '#2747b8';
export const ROUGE = '#d62839';
const FLUO = '#ffe45c';
const GRIS = '#5b556f';
const MENTION = (x, y, t) => `<text x="${x}" y="${y}" font-size="12" fill="${GRIS}" font-family="sans-serif" font-style="italic">${t}</text>`;

// pointes de flèche propres à ce chapitre (bleu stylo, rouge stylo, encre)
const DEFS = `<defs>
  <marker id="volcanisme-fb" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="3.6" markerHeight="3.6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="${BLEU}"/></marker>
  <marker id="volcanisme-fr" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="3.4" markerHeight="3.4" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="${ROUGE}"/></marker>
  <marker id="volcanisme-fe" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="${ENCRE}"/></marker>
</defs>`;

/* =====================================================================================================
   Les trois petits schémas (repère local 300 × 200), copiés des photos de complément de la page 12.
   Chaque trait : { e: étape où on le dessine, d: chemin, c: couleur, w: épaisseur, m: pointe de flèche }.
   ===================================================================================================== */
const fumee = (x, y) => `M${x - 12} ${y - 7} c-9 -1 -9 -13 0 -14 c-1 -9 11 -11 14 -4 c4 -7 15 -4 13 4 c7 2 4 12 -4 11`;
const triangle = (x, yb, h, demi) => `M${x - demi} ${yb} L${x} ${yb - h} L${x + demi} ${yb}`;
/** Boucle fléchée de convection autour de (cx, cy) ; monteADroite = la boucle remonte du côté droit (boucle de gauche) :
 *  les deux boucles remontent le long du magma, au milieu, puis s'en écartent par le haut. */
const boucle = (cx, cy, r, monteADroite) => {
  const p = (deg) => [cx + r * Math.cos((deg * Math.PI) / 180), cy + r * Math.sin((deg * Math.PI) / 180)].map((v) => Math.round(v * 10) / 10);
  const [a0, a1, sens] = monteADroite ? [200, -100, 0] : [-20, 280, 1];   // la flèche finit en haut et part vers l'extérieur
  const [x0, y0] = p(a0), [x1, y1] = p(a1);
  return `M${x0} ${y0} A${r} ${r} 0 1 ${sens} ${x1} ${y1}`;
};

export const MINIS = {
  subduction: {
    nom: 'subduction',
    etapes: ['la surface (2 plaques)', 'la plaque qui plonge', 'le volcan qui fume', 'rouge : magma + boucles'],
    traits: [
      { e: 1, d: 'M14 112 L136 104', c: BLEU, w: 7 },
      { e: 1, d: 'M146 99 L288 91', c: BLEU, w: 7 },
      { e: 2, d: 'M136 107 L168 164', c: BLEU, w: 7, m: 'fb' },
      { e: 3, d: triangle(178, 97, 44, 18), c: BLEU, w: 6 },
      { e: 3, d: fumee(178, 50), c: BLEU, w: 4 },
      { e: 4, d: 'M194 104 L194 176', c: ROUGE, w: 7 },
      { e: 4, d: boucle(70, 160, 20, true), c: ROUGE, w: 5, m: 'fr' },
      { e: 4, d: boucle(250, 156, 20, false), c: ROUGE, w: 5, m: 'fr' },
    ],
  },
  accretion: {
    nom: 'accrétion',
    etapes: ['les plaques s\'écartent', 'le volcan au milieu', 'rouge : le magma', 'rouge : les 2 boucles'],
    traits: [
      { e: 1, d: 'M138 92 L44 96', c: BLEU, w: 6 },
      { e: 1, d: 'M130 104 L50 106', c: BLEU, w: 6 },
      { e: 1, d: 'M56 84 L30 100 L56 116', c: BLEU, w: 6 },
      { e: 1, d: 'M162 92 L256 94', c: BLEU, w: 6 },
      { e: 1, d: 'M170 104 L250 106', c: BLEU, w: 6 },
      { e: 1, d: 'M244 82 L270 98 L244 114', c: BLEU, w: 6 },
      { e: 2, d: triangle(150, 92, 44, 18), c: BLEU, w: 6 },
      { e: 2, d: fumee(150, 45), c: BLEU, w: 4 },
      { e: 3, d: 'M150 100 L150 182', c: ROUGE, w: 7 },
      { e: 4, d: boucle(104, 154, 21, true), c: ROUGE, w: 5, m: 'fr' },
      { e: 4, d: boucle(196, 154, 21, false), c: ROUGE, w: 5, m: 'fr' },
    ],
  },
  'point-chaud': {
    nom: 'point chaud',
    etapes: ['la plaque : 3 traits', 'la flèche : elle bouge', 'deux volcans côte à côte', 'rouge : magma + boucles'],
    traits: [
      { e: 1, d: 'M34 80 L274 80', c: BLEU, w: 9 },
      { e: 1, d: 'M52 104 L214 104', c: BLEU, w: 7 },
      { e: 1, d: 'M26 128 L278 128', c: BLEU, w: 9 },
      { e: 2, d: 'M214 104 L246 104', c: BLEU, w: 7, m: 'fb' },
      { e: 3, d: triangle(112, 76, 40, 16), c: BLEU, w: 6 },
      { e: 3, d: triangle(190, 76, 36, 14), c: BLEU, w: 6 },
      { e: 4, d: 'M112 190 L112 82', c: ROUGE, w: 7 },
      { e: 4, d: 'M89 78 L109 30 Q112 24 115 30 L135 78', c: ROUGE, w: 5 },
      { e: 4, d: boucle(66, 166, 18, true), c: ROUGE, w: 5, m: 'fr' },
      { e: 4, d: boucle(160, 166, 18, false), c: ROUGE, w: 5, m: 'fr' },
    ],
  },
};

const tracer = (t, couleur = t.c, w = t.w, m = t.m) =>
  `<path d="${t.d}" fill="none" stroke="${couleur}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${m ? ` marker-end="url(#volcanisme-${m})"` : ''}/>`;

/** Un petit schéma dans son repère 300 × 200. k = étape montrée (les traits de l'étape k sont surlignés en fluo) ; sans k : tout. */
export function mini(type, k) {
  const traits = MINIS[type].traits.filter((t) => !k || t.e <= k);
  const halo = k ? traits.filter((t) => t.e === k).map((t) => tracer(t, FLUO, t.w + 12, null)).join('') : '';
  return halo + traits.map((t) => tracer(t)).join('');
}

/** Le petit schéma seul, sans numéros (pour l'animation 3D et les réponses des questions de contrôle). */
export const miniSVG = (type) => `<svg viewBox="0 14 300 182" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Petit schéma : ${MINIS[type].nom}">${DEFS}${mini(type)}</svg>`;

/** Quatre cases « pas à pas » : à chaque case, un trait de plus (surligné). */
const pasAPas = (type) => wrap(640, 540, `${DEFS}
  ${MINIS[type].etapes.map((legende, i) => {
    const x = 10 + (i % 2) * 315, y = 10 + Math.floor(i / 2) * 265;
    return `<rect x="${x}" y="${y}" width="305" height="255" rx="14" fill="#fff" stroke="#e3d9c4" stroke-width="2"/>
      <g transform="translate(${x + 3} ${y + 14})">${mini(type, i + 1)}</g>
      <circle cx="${x + 24}" cy="${y + 26}" r="17" fill="${ENCRE}"/><text x="${x + 24}" y="${y + 33}" text-anchor="middle" font-size="19" fill="#fff" ${TXT}>${i + 1}</text>
      <text x="${x + 152}" y="${y + 240}" text-anchor="middle" font-size="22" fill="${ENCRE}" ${TXT}>${legende}</text>`;
  }).join('')}`);

/** Le petit schéma avec ses numéros (à légender). */
const avecNumeros = (type, pins) => wrap(440, 290, `${DEFS}<g transform="translate(70 45)">${mini(type)}</g>${pins}`);

/* =====================================================================================================
   Les trois schémas imprimés du tableau 2.3 (croquis simplifiés)
   ===================================================================================================== */
const vague = (x0, x1, y, pas = 40) => { const n = Math.max(1, Math.round((x1 - x0) / pas)), p = (x1 - x0) / n; let d = `M${x0} ${y}`; for (let i = 0; i < n; i++) d += ` q${p / 4} -7 ${p / 2} 0 t${p / 2} 0`; return d; };
const nuage = (x, y) => `<g fill="#cfcbd8" stroke="${ENCRE}" stroke-width="1.4"><circle cx="${x - 10}" cy="${y}" r="9"/><circle cx="${x + 2}" cy="${y - 7}" r="11"/><circle cx="${x + 13}" cy="${y + 1}" r="8"/></g>`;
const goutte = (x, y, rx, ry) => `<path d="M${x} ${y - ry} C${x + rx * 1.2} ${y - ry * 0.2} ${x + rx} ${y + ry} ${x} ${y + ry} C${x - rx} ${y + ry} ${x - rx * 1.2} ${y - ry * 0.2} ${x} ${y - ry}z" fill="#c2399a" stroke="${ENCRE}" stroke-width="1.3"/>`;

// subduction : orientation du schéma imprimé (la plaque arrive de la droite et plonge vers la gauche, sous les volcans)
const SUBDUCTION = `${DEFS}
  <rect x="16" y="16" width="608" height="368" rx="10" fill="#f6c9d0" stroke="${ENCRE}" stroke-width="2"/>
  <path d="${vague(16, 624, 72)} L624 128 L16 128 Z" fill="#bfe3f7"/>
  <path d="${vague(16, 624, 72)}" fill="none" stroke="#2f6fb5" stroke-width="2"/>
  <!-- bateau à voile -->
  <path d="M498 72 h46 l-7 9 h-32z" fill="#8a5a33" stroke="${ENCRE}" stroke-width="1.4"/><path d="M521 70 V38 L543 68z" fill="#fff" stroke="${ENCRE}" stroke-width="1.4"/>
  <!-- la plaque du dessus (à gauche) -->
  <path d="M16 128 L372 128 Q344 136 330 150 L316 162 L16 162 Z" fill="#9fd4a6" stroke="${ENCRE}" stroke-width="2" stroke-linejoin="round"/>
  <!-- la plaque qui arrive de la droite et plonge -->
  <path d="M624 128 L384 128 Q350 128 328 152 L172 332 L202 354 L354 172 Q374 162 398 162 L624 162 Z" fill="#7cc58b" stroke="${ENCRE}" stroke-width="2" stroke-linejoin="round"/>
  <path d="M572 145 h-84" stroke="#fff" stroke-width="7" marker-end="url(#flb)"/>
  <path d="M292 214 L250 264" stroke="#fff" stroke-width="7" marker-end="url(#flb)"/>
  <!-- les remontées de magma, de la plaque qui fond jusqu'aux volcans -->
  <path d="M224 252 C214 220 186 200 176 132 M236 246 C238 210 250 190 252 134" fill="none" stroke="#c2399a" stroke-width="5" stroke-linecap="round"/>
  ${goutte(222, 246, 11, 13)}${goutte(204, 214, 12, 15)}${goutte(186, 178, 11, 14)}${goutte(240, 216, 10, 13)}${goutte(248, 180, 10, 13)}
  <!-- les volcans d'arc insulaire -->
  <path d="M116 128 L164 52 Q172 46 180 52 L224 128 Z" fill="#c9b27a" stroke="${ENCRE}" stroke-width="2" stroke-linejoin="round"/>
  <path d="M206 128 L246 62 Q253 56 260 62 L298 128 Z" fill="#c9b27a" stroke="${ENCRE}" stroke-width="2" stroke-linejoin="round"/>
  <path d="M172 50 L176 128 M253 60 L252 128" stroke="#c2399a" stroke-width="4"/>
  ${nuage(172, 30)}${nuage(254, 40)}
  <!-- la cellule de convection, ajoutée à la main -->
  <path d="${boucle(540, 300, 30, false)}" fill="none" stroke="${BLEU}" stroke-width="4" stroke-linecap="round" marker-end="url(#volcanisme-fb)"/>
  ${MENTION(24, 376, 'croquis simplifié du schéma de ton cours')}
  ${pin(1, 60, 44, 150, 90)}${pin(2, 92, 236, 202, 214)}${pin(3, 118, 318, 226, 268)}${pin(4, 404, 38, 420, 100)}
  ${pin(5, 604, 200, 596, 152)}${pin(6, 330, 352, 382, 300)}${pin(7, 462, 236, 518, 276)}`;

// accrétion : deux blocs qui s'écartent, une fissure au milieu, le magma qui monte (coupe simplifiée du bloc-diagramme)
const ACCRETION = `
  <rect x="16" y="16" width="608" height="364" rx="10" fill="#eef3f7" stroke="${ENCRE}" stroke-width="2"/>
  <rect x="30" y="232" width="580" height="118" fill="#a568b8" stroke="${ENCRE}" stroke-width="2"/>
  <path d="M30 168 L290 168 Q314 196 320 214 Q326 196 350 168 L610 168 L610 232 L30 232 Z" fill="#79c08a" stroke="${ENCRE}" stroke-width="2" stroke-linejoin="round"/>
  <!-- les deux blocs : jaune dessus, orange dessous -->
  <path d="M30 106 L278 106 L284 120 L292 120 L298 168 L30 168 Z" fill="#f6a43c" stroke="${ENCRE}" stroke-width="2" stroke-linejoin="round"/>
  <path d="M30 106 L278 106 L284 120 L30 120 Z" fill="#f8d96a" stroke="${ENCRE}" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="M610 106 L362 106 L356 120 L348 120 L342 168 L610 168 Z" fill="#f6a43c" stroke="${ENCRE}" stroke-width="2" stroke-linejoin="round"/>
  <path d="M610 106 L362 106 L356 120 L610 120 Z" fill="#f8d96a" stroke="${ENCRE}" stroke-width="1.6" stroke-linejoin="round"/>
  <!-- le magma qui remonte par la fissure -->
  <path d="M320 300 C300 270 304 230 312 196 C314 160 306 132 320 108 C334 132 326 160 328 196 C336 230 340 270 320 300 Z" fill="#c2399a" stroke="${ENCRE}" stroke-width="1.6"/>
  <!-- flèches blanches : les plaques s'écartent -->
  <path d="M232 144 h-120" stroke="#fff" stroke-width="8" marker-end="url(#flb)"/><path d="M408 144 h120" stroke="#fff" stroke-width="8" marker-end="url(#flb)"/>
  <!-- dans le manteau : ça monte et ça s'écarte -->
  <g fill="none" stroke="#3d1a52" stroke-width="3.5" stroke-linecap="round">
    <path d="M300 338 C292 294 250 268 196 268" marker-end="url(#flv)"/><path d="M340 338 C348 294 390 268 444 268" marker-end="url(#flv)"/>
  </g>
  ${MENTION(30, 370, 'croquis simplifié du bloc-diagramme de ton cours')}
  ${pin(1, 92, 52, 170, 142)}${pin(2, 320, 46, 320, 110)}${pin(3, 500, 316, 330, 214)}`;

// point chaud : « Chaînon de volcans », deux coupes l'une sous l'autre (la plaque glisse vers la gauche)
const coupePC = (y, xs, jeune) => `
  <rect x="40" y="${y + 60}" width="560" height="62" fill="#f6c9d0" stroke="${ENCRE}" stroke-width="1.6"/>
  <rect x="40" y="${y + 30}" width="560" height="30" fill="#9fd4a6" stroke="${ENCRE}" stroke-width="1.6"/>
  <line x1="40" y1="${y + 36}" x2="600" y2="${y + 36}" stroke="#3f8f4a" stroke-width="3"/>
  <path d="${vague(40, 600, y + 4, 28)}" fill="none" stroke="#2f6fb5" stroke-width="2"/>
  ${xs.map((x) => `<path d="M${x - 38} ${y + 30} L${x - 4} ${y - 8} Q${x} ${y - 12} ${x + 4} ${y - 8} L${x + 38} ${y + 30} Z" fill="#c9b27a" stroke="${ENCRE}" stroke-width="1.8" stroke-linejoin="round"/>`).join('')}
  <path d="M${jeune} ${y + 118} L${jeune} ${y + 26}" stroke="#c2399a" stroke-width="6"/>
  ${goutte(jeune, y + 104, 9, 12)}${goutte(jeune, y + 80, 10, 12)}${goutte(jeune, y + 54, 9, 11)}
  <path d="M330 ${y + 46} h-90" stroke="${ENCRE}" stroke-width="4" marker-end="url(#volcanisme-fe)"/>`;
const POINT_CHAUD = `${DEFS}
  <rect x="16" y="16" width="608" height="408" rx="10" fill="#fffdf8" stroke="${ENCRE}" stroke-width="2"/>
  <text x="320" y="46" text-anchor="middle" font-size="18" fill="${ENCRE}" ${TXT}>Chaînon de volcans</text>
  ${coupePC(78, [300, 390, 480], 480)}
  ${coupePC(270, [120, 210, 300, 390, 480], 480)}
  ${MENTION(24, 416, 'croquis simplifié du schéma de ton cours')}
  ${pin(1, 74, 232, 112, 274)}${pin(2, 566, 232, 490, 268)}${pin(3, 566, 386, 486, 366)}${pin(4, 200, 232, 286, 316)}`;

export const SCHEMAS = {
  // les trois icônes de « L'idée en 20 secondes »
  'volcanisme-icone-subduction': { titre: 'Subduction', labels: [], svg: `<svg viewBox="0 14 300 182" xmlns="http://www.w3.org/2000/svg" role="img">${DEFS}${mini('subduction')}</svg>` },
  'volcanisme-icone-accretion': { titre: 'Accrétion', labels: [], svg: `<svg viewBox="0 14 300 182" xmlns="http://www.w3.org/2000/svg" role="img">${DEFS}${mini('accretion')}</svg>` },
  'volcanisme-icone-point-chaud': { titre: 'Point chaud', labels: [], svg: `<svg viewBox="0 14 300 182" xmlns="http://www.w3.org/2000/svg" role="img">${DEFS}${mini('point-chaud')}</svg>` },

  // les schémas imprimés du tableau 2.3
  'volcanisme-subduction': {
    titre: 'Ligne 1 : la zone de volcanisme de subduction',
    labels: ['volcans d\'arc insulaire', 'magma', 'fusion partielle de la lithosphère', 'océan (72 %)', 'croûte', 'manteau', 'cellule de convection'],
    svg: wrap(640, 400, SUBDUCTION),
  },
  'volcanisme-accretion': {
    titre: 'Ligne 2 : la zone de volcanisme d\'accrétion',
    labels: ['deux plaques qui s\'écartent', 'la fissure (rift/dorsale)', 'le magma qui remonte'],
    svg: wrap(640, 396, ACCRETION),
  },
  'volcanisme-point-chaud': {
    titre: 'Ligne 3 : le volcanisme de point chaud (« Chaînon de volcans »)',
    labels: ['volcan le plus vieux', 'volcan le plus jeune', 'les remontées de magma', 'le mouvement de la plaque'],
    svg: wrap(640, 440, POINT_CHAUD),
  },

  // les petits schémas à savoir refaire, avec numéros
  'volcanisme-mini-subduction': {
    titre: 'Ton petit schéma : la subduction',
    labels: ['la surface', 'le volcan', 'la plaque qui plonge', 'le magma qui remonte', 'cellule de convection'],
    svg: avecNumeros('subduction', `${pin(1, 40, 92, 110, 155)}${pin(2, 176, 34, 238, 124)}${pin(3, 150, 262, 226, 186)}${pin(4, 296, 262, 264, 200)}${pin(5, 404, 150, 334, 186)}`),
  },
  'volcanisme-mini-accretion': {
    titre: 'Ton petit schéma : l\'accrétion',
    labels: ['deux plaques qui s\'écartent', 'le volcan', 'le magma qui remonte', 'cellule de convection'],
    svg: avecNumeros('accretion', `${pin(1, 36, 70, 116, 141)}${pin(2, 296, 44, 230, 116)}${pin(3, 290, 262, 222, 206)}${pin(4, 70, 262, 153, 199)}`),
  },
  'volcanisme-mini-point-chaud': {
    titre: 'Ton petit schéma : le point chaud',
    labels: ['la plaque', 'la plaque se déplace', 'le volcan alimenté, au-dessus du magma', 'l\'ancien volcan, éteint et décalé', 'le magma qui perce la croûte', 'cellule de convection'],
    svg: avecNumeros('point-chaud', `${pin(1, 30, 100, 102, 125)}${pin(2, 392, 116, 312, 149)}${pin(3, 110, 30, 172, 96)}${pin(4, 330, 40, 262, 100)}${pin(5, 120, 262, 182, 226)}${pin(6, 290, 262, 248, 222)}`),
  },

  // les mêmes, pas à pas
  'volcanisme-pas-subduction': { titre: 'Pas à pas : le schéma de subduction', labels: [], svg: pasAPas('subduction') },
  'volcanisme-pas-accretion': { titre: 'Pas à pas : le schéma d\'accrétion', labels: [], svg: pasAPas('accretion') },
  'volcanisme-pas-point-chaud': { titre: 'Pas à pas : le schéma de point chaud', labels: [], svg: pasAPas('point-chaud') },
};
