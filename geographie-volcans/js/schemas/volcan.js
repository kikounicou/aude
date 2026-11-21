// Schémas du chapitre 6 (cours/05) : la coupe schématique d'un volcan (10 étiquettes) et les deux types de volcans.
// SCHEMAS[id] = { titre, labels: [...dans l'ordre des numéros], svg }   ·   labels vide = simple illustration.
import { ENCRE, TXT, wrap } from './_outils.js';

// Pastille un peu plus grande que pin() d'_outils.js : dix étiquettes doivent rester lisibles sur un téléphone.
const gpin = (n, x, y, tx, ty) =>
  `<line x1="${x}" y1="${y}" x2="${tx}" y2="${ty}" stroke="${ENCRE}" stroke-width="2"/><circle cx="${tx}" cy="${ty}" r="4" fill="${ENCRE}" stroke="#fff" stroke-width="1.2"/>` +
  `<circle cx="${x}" cy="${y}" r="17" fill="#ff5a36" stroke="#fff" stroke-width="2.5"/><text x="${x}" y="${y + 6}" text-anchor="middle" font-size="${n > 9 ? 15 : 17}" font-weight="800" fill="#fff" font-family="sans-serif">${n}</text>`;

// Couleurs (les mêmes dans l'animation 3D et la capsule)
export const COUL = { lave: '#e8431f', laveVive: '#ff8a2a', roche: '#9a6a44', roche2: '#7d5232', sol: '#6e4a30', ciel: '#d6ecf7', gris: '#a5a1b1', gris2: '#8d8799' };

/* ---------- la coupe : un volcan coupé en deux, comme sur la feuille du cours ---------- */
const nuage = [[262, 52, 26], [298, 36, 32], [340, 40, 30], [380, 56, 24], [318, 64, 26], [278, 66, 22]]
  .map(([x, y, r], i) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${i % 2 ? COUL.gris : '#b8b4c3'}"/>`).join('');
const projections = [[262, 110, 6, ENCRE], [248, 92, 5, ENCRE], [276, 96, 4, COUL.lave], [344, 106, 7, ENCRE], [362, 92, 5, ENCRE], [326, 118, 4, COUL.lave], [330, 94, 4, COUL.lave]]
  .map(([x, y, r, c]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`).join('');
const bulles = [[300, 412, 4], [297, 392, 3], [303, 372, 3], [258, 450, 5], [338, 444, 6], [300, 462, 4], [222, 452, 3], [372, 456, 3]]
  .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#ffc23d" opacity=".9"/>`).join('');

const COUPE = wrap(600, 500, `
  <rect width="600" height="500" rx="12" fill="${COUL.ciel}"/>
  <!-- le sol en coupe -->
  <path d="M0 332 H600 V488 Q600 500 588 500 H12 Q0 500 0 488 Z" fill="${COUL.sol}"/>
  <path d="M0 380 Q150 372 300 384 T600 378 M0 430 Q150 422 300 434 T600 428" fill="none" stroke="#5a3b25" stroke-width="3"/>
  <path d="M0 333 H600" stroke="#5f9e4a" stroke-width="5"/>
  <!-- la colonne grise et le nuage au-dessus du cratère -->
  <path d="M291 130 Q286 104 262 76 L342 76 Q314 104 309 130 Z" fill="#b8b4c3"/>
  ${nuage}
  <!-- le cône volcanique, coupé en deux -->
  <path d="M90 334 Q200 270 280 126 L292 140 L308 140 L320 126 Q400 270 510 334 Z" fill="${COUL.roche}" stroke="${ENCRE}" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M124 334 Q214 282 284 156 M476 334 Q388 282 316 156 M170 334 Q236 296 288 196 M430 334 Q366 296 312 196" fill="none" stroke="${COUL.roche2}" stroke-width="3" opacity=".7"/>
  <!-- la chambre magmatique et la cheminée volcanique -->
  <ellipse cx="300" cy="448" rx="120" ry="34" fill="${COUL.lave}" stroke="${ENCRE}" stroke-width="2.5"/>
  <rect x="290" y="139" width="20" height="282" fill="${COUL.lave}" stroke="${ENCRE}" stroke-width="2.5"/>
  <rect x="291.3" y="404" width="17.4" height="30" fill="${COUL.lave}"/>
  ${bulles}
  <!-- le cône secondaire (un petit volcan sur le flanc), sa fumée et la cheminée secondaire -->
  <path d="M136 300 L174 214 L180 221 L188 221 L194 214 L234 266 Z" fill="#7a5236" stroke="${ENCRE}" stroke-width="2.5" stroke-linejoin="round"/>
  <circle cx="182" cy="202" r="8" fill="${COUL.gris2}"/><circle cx="192" cy="187" r="10" fill="${COUL.gris}"/><circle cx="185" cy="170" r="8" fill="${COUL.gris2}"/>
  <path d="M296 300 Q236 284 184 222" fill="none" stroke="${ENCRE}" stroke-width="11" stroke-linecap="round"/>
  <path d="M296 300 Q236 284 184 222" fill="none" stroke="${COUL.lave}" stroke-width="6.5" stroke-linecap="round"/>
  <!-- la coulée de lave : du cône secondaire jusqu'au pied du volcan -->
  <path d="M138 292 Q118 304 102 313 Q86 323 68 326 Q46 328 36 335 Q38 345 60 345 L100 343 Q118 331 134 317 Q144 309 150 302 Z" fill="${COUL.laveVive}" stroke="${ENCRE}" stroke-width="2.2" stroke-linejoin="round"/>
  <!-- le cratère et les projections -->
  <path d="M282 128 L292 140 L308 140 L318 128 Z" fill="${COUL.laveVive}" stroke="${ENCRE}" stroke-width="2"/>
  <path d="M296 128 Q276 96 262 110 M300 126 Q288 84 248 92 M304 126 Q330 86 362 92 M302 128 Q326 100 344 106" fill="none" stroke="${ENCRE}" stroke-width="1.4" stroke-dasharray="3 4" opacity=".7"/>
  ${projections}
  <text x="300" y="494" text-anchor="middle" font-size="12" fill="#f3e6d6" font-family="sans-serif" font-style="italic">croquis simplifié</text>
  ${gpin(1, 30, 112, 288, 133)}${gpin(2, 30, 190, 166, 250)}${gpin(3, 30, 262, 250, 284)}<line x1="30" y1="372" x2="112" y2="314" stroke="${ENCRE}" stroke-width="2"/><circle cx="112" cy="314" r="4" fill="${ENCRE}" stroke="#fff" stroke-width="1.2"/>${gpin(4, 30, 372, 62, 336)}${gpin(5, 30, 450, 186, 452)}
  ${gpin(6, 570, 40, 392, 52)}${gpin(7, 570, 118, 350, 108)}${gpin(8, 570, 220, 431, 273)}${gpin(9, 570, 320, 310, 252)}${gpin(10, 570, 400, 300, 398)}`);

/* ---------- les deux types de volcans et leur localisation ---------- */
const cone = (cx) => `M${cx - 112} 250 Q${cx - 44} 206 ${cx - 14} 122 L${cx - 6} 132 L${cx + 6} 132 L${cx + 14} 122 Q${cx + 44} 206 ${cx + 112} 250 Z`;
const maison = (x, y, c = '#f6efe2') => `<rect x="${x}" y="${y - 12}" width="16" height="12" fill="${c}" stroke="${ENCRE}" stroke-width="1.5"/><path d="M${x - 2} ${y - 12} L${x + 8} ${y - 21} L${x + 18} ${y - 12} Z" fill="#b5523b" stroke="${ENCRE}" stroke-width="1.5" stroke-linejoin="round"/>`;
const fleche = (x1, x2, y) => `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="#fff" stroke-width="4" marker-end="url(#flb)"/>`;

const TYPES = wrap(600, 420, `
  <rect width="296" height="420" rx="12" fill="${COUL.ciel}"/><rect x="304" width="296" height="420" rx="12" fill="${COUL.ciel}"/>
  <!-- en dessous : le manteau -->
  <path d="M0 300 H296 V408 Q296 420 284 420 H12 Q0 420 0 408 Z M304 300 H600 V408 Q600 420 588 420 H316 Q304 420 304 408 Z" fill="#c79ad6"/>
  <!-- À GAUCHE : deux plaques se rencontrent, l'une s'enfonce sous l'autre -->
  <path d="M0 250 H118 Q150 250 176 282 L226 346 L204 362 L154 300 Q134 280 112 280 H0 Z" fill="#3f8f4a" stroke="${ENCRE}" stroke-width="2"/>
  <path d="M132 250 H296 V296 H186 Q160 280 132 250 Z" fill="#e0a13a" stroke="${ENCRE}" stroke-width="2"/>
  ${fleche(40, 92, 266)}${fleche(276, 222, 272)}
  <path d="M190 322 Q170 300 158 256" fill="none" stroke="${ENCRE}" stroke-width="10" stroke-linecap="round"/><path d="M190 322 Q170 300 158 256" fill="none" stroke="${COUL.lave}" stroke-width="6" stroke-linecap="round"/>
  <path d="${cone(150)}" fill="${COUL.roche}" stroke="${ENCRE}" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M145 124 Q136 96 108 70 L196 70 Q166 96 157 124 Z" fill="#b8b4c3"/>
  ${[[106, 56, 30], [150, 34, 36], [196, 52, 30], [128, 78, 24], [176, 80, 24], [236, 66, 20], [72, 74, 18]].map(([x, y, r], i) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${i % 2 ? COUL.gris : '#b8b4c3'}"/>`).join('')}
  ${[[116, 112, 5], [186, 104, 6], [200, 124, 4], [102, 128, 4], [170, 118, 4]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${ENCRE}"/>`).join('')}
  ${maison(16, 250, '#c9c5d1')}${maison(268, 250, '#c9c5d1')}
  ${[[24, 228], [36, 214], [276, 224], [262, 212], [48, 236], [254, 236]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="${COUL.gris2}"/>`).join('')}
  <!-- À DROITE : une seule plaque, le volcan est au milieu -->
  <path d="M304 250 H600 V296 H304 Z" fill="#3f8f4a" stroke="${ENCRE}" stroke-width="2"/>
  <ellipse cx="452" cy="356" rx="70" ry="22" fill="${COUL.lave}" stroke="${ENCRE}" stroke-width="2"/>
  <rect x="445" y="128" width="14" height="210" fill="${COUL.lave}" stroke="${ENCRE}" stroke-width="2"/><rect x="446.2" y="320" width="11.6" height="24" fill="${COUL.lave}"/>
  <path d="${cone(452)}" fill="${COUL.roche}" stroke="${ENCRE}" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M448 134 Q440 170 428 190 Q414 214 404 246 M456 134 Q468 172 482 194 Q494 216 500 246" fill="none" stroke="${ENCRE}" stroke-width="19" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M448 134 Q440 170 428 190 Q414 214 404 246 M456 134 Q468 172 482 194 Q494 216 500 246" fill="none" stroke="${COUL.laveVive}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M438 124 Q446 98 452 92 Q458 98 466 124 Z" fill="${COUL.laveVive}" stroke="${ENCRE}" stroke-width="2" stroke-linejoin="round"/>
  ${maison(574, 250)}${maison(318, 250)}
  <text x="12" y="412" font-size="12" fill="#3b2a4a" font-family="sans-serif" font-style="italic">croquis simplifié</text>
  ${gpin(1, 34, 168, 100, 210)}${gpin(2, 566, 160, 520, 222)}${gpin(3, 120, 392, 150, 278)}${gpin(4, 540, 392, 540, 276)}`);

export const SCHEMAS = {
  'volcan-coupe': {
    titre: 'Coupe schématique d\'un volcan',
    labels: ['le cratère', 'le cône secondaire', 'la cheminée secondaire', 'la coulée de lave', 'la chambre magmatique',
      'la nuée ardente', 'les projections volcaniques', 'le cône volcanique', 'la cheminée volcanique', 'le magma'],
    svg: COUPE,
  },
  'volcan-types': {
    titre: 'Volcan explosif et volcan effusif : où se trouvent-ils ?',
    labels: ['le volcan explosif (gris)', 'le volcan effusif (rouge)', 'entre les plaques (subduction)', 'au milieu d\'une plaque'],
    svg: TYPES,
  },
};
