// Schémas du chapitre 2 (cours/02) : la Terre en coupe (trois couches), l'épaisseur de la croûte, le schéma du cours.
// SCHEMAS[id] = { titre, labels: [...dans l'ordre des numéros], svg }   ·   labels vide = simple illustration.
// Aucun identifiant SVG (clipPath, dégradé) : un même schéma peut être affiché deux fois sur une page.
import { ENCRE, TXT, pin, wrap } from './outils.js';

/* Couleurs du schéma du cours : jaune au centre, orange, rouge, puis la croûte plus claire. Mêmes couleurs dans l'animation 3D et la capsule. */
const COUL = { graine: '#ffd93d', liquide: '#f08a2c', manteau: '#d8432c', croute: '#f4c26b', ocean: '#3d7fc4', terre: '#7fb25d' };

/* ---------- la Terre en coupe : on a enlevé un quartier (en haut à droite) ---------- */
const CX = 200, CY = 215, R = 175;           // la Terre
const RC = 163, RN = 95, RG = 32;            // bas de la croûte (épaissie pour être visible), noyau, graine
const quartier = (r, fill) => `<path d="M${CX} ${CY} L${CX} ${CY - r} A${r} ${r} 0 0 1 ${CX + r} ${CY} Z" fill="${fill}" stroke="${ENCRE}" stroke-width="1.6" stroke-linejoin="round"/>`;
// continents dessinés à la main, tous dans les trois quarts visibles de la Terre
const CONTINENTS = [
  'M70 150 C84 118 120 104 138 118 C150 128 132 150 140 168 C150 188 128 214 104 206 C84 198 62 178 70 150 Z',
  'M112 252 C134 236 172 244 178 268 C184 292 162 318 150 344 C140 362 116 352 112 330 C108 306 92 272 112 252 Z',
  'M236 300 C262 282 300 290 318 306 C334 320 312 344 286 346 C262 348 248 334 240 322 C234 314 228 306 236 300 Z',
  'M150 70 C166 58 190 60 192 76 C194 90 176 96 162 94 C150 92 140 82 150 70 Z',
];

/* ---------- l'épaisseur de la croûte : continent, océan, dorsale ---------- */
const CROUTE = '30,84 240,84 262,140 430,140 460,128 490,140 580,140 580,204 500,204 472,152 460,150 448,152 420,204 30,204';
const EAU = '240,84 580,84 580,140 490,140 460,128 430,140 262,140';
const fleche2 = (x, y1, y2) => `<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" stroke="${ENCRE}" stroke-width="2.4" marker-start="url(#fl)" marker-end="url(#fl)"/>`;

/* ---------- le schéma du cours (le haut de la coupe) ---------- */
const fumee = (x, y) => [[0, 0, 9], [7, -13, 11], [16, -27, 13]].map(([dx, dy, r]) => `<circle cx="${x + dx}" cy="${y + dy}" r="${r}" fill="#a39cae" opacity=".8"/>`).join('');
const volcan = (x, base, haut, demi) => `<path d="M${x - demi} ${base} L${x - 5} ${haut} L${x + 5} ${haut} L${x + demi} ${base} Z" fill="#8a5a33" stroke="${ENCRE}" stroke-width="1.8" stroke-linejoin="round"/><path d="M${x - 5} ${haut} L${x + 5} ${haut} L${x + 2} ${haut + 8} L${x - 2} ${haut + 8} Z" fill="${COUL.liquide}"/>${fumee(x + 2, haut - 12)}`;
// les cellules de convection : boucles blanches en pointillés, avec le sens du mouvement
const boucle = (cx, cy, rx, ry) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="10 7"/>`;
const sens = (x, y1, y2) => `<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" stroke="#fff" stroke-width="3.4" marker-end="url(#flb)"/>`;

export const SCHEMAS = {
  'terre-coupe': {
    titre: 'La Terre en coupe : ses trois couches',
    labels: ['croûte terrestre (écorce)', 'manteau', 'noyau liquide', 'noyau solide : la graine'],
    svg: wrap(460, 410,
      `<!-- les trois quarts de la Terre que l'on voit de l'extérieur : océans et continents -->
       <path d="M${CX} ${CY} L${CX + R} ${CY} A${R} ${R} 0 1 1 ${CX} ${CY - R} Z" fill="${COUL.ocean}"/>
       ${CONTINENTS.map((d) => `<path d="${d}" fill="${COUL.terre}" stroke="#2c6b36" stroke-width="1.4"/>`).join('')}
       <circle cx="${CX}" cy="${CY}" r="${R - 9}" fill="none" stroke="#fff" stroke-width="10" opacity=".12"/>
       <!-- le quartier enlevé : on voit les couches, du jaune au centre jusqu'à la croûte -->
       ${quartier(R, COUL.croute)}${quartier(RC, COUL.manteau)}${quartier(RN, COUL.liquide)}${quartier(RG, COUL.graine)}
       <path d="M${CX} ${CY} L${CX + R} ${CY} A${R} ${R} 0 1 1 ${CX} ${CY - R} Z" fill="none" stroke="${ENCRE}" stroke-width="2.6" stroke-linejoin="round"/>
       <path d="M${CX} ${CY - R} L${CX} ${CY} L${CX + R} ${CY}" fill="none" stroke="${ENCRE}" stroke-width="2.2"/>
       <text x="12" y="402" font-size="11.5" fill="#5b556f" font-family="sans-serif" font-style="italic">croquis simplifié : la croûte est dessinée plus épaisse qu'en vrai</text>
       ${pin(1, 432, 48, 297, 77)}${pin(2, 432, 112, 300, 131)}${pin(3, 432, 168, 259, 188)}${pin(4, 432, 206, 212, 207)}`),
  },
  'terre-croute': {
    titre: 'L\'épaisseur de la croûte (écorce)',
    labels: ['30 à 40 km', 'environ 20 km', 'quelques kilomètres'],
    svg: wrap(600, 320,
      `<rect x="30" y="140" width="550" height="150" fill="${COUL.manteau}" stroke="${ENCRE}" stroke-width="2"/>
       <polygon points="${EAU}" fill="${COUL.ocean}" stroke="${ENCRE}" stroke-width="1.6" stroke-linejoin="round"/>
       <polygon points="${CROUTE}" fill="${COUL.croute}" stroke="${ENCRE}" stroke-width="2" stroke-linejoin="round"/>
       <line x1="30" y1="84" x2="238" y2="84" stroke="#3f8f4a" stroke-width="7" stroke-linecap="round"/>
       ${[[200, 84], [226, 84]].map(([x, y]) => `<path d="M${x - 12} ${y - 2} l12 -16 l12 16z" fill="#3f8f4a" stroke="${ENCRE}" stroke-width="1.2" stroke-linejoin="round"/>`).join('')}
       <path d="M460 151 L457 140 L460 131 L463 140 Z" fill="${COUL.liquide}" stroke="${ENCRE}" stroke-width="1"/>
       ${fleche2(90, 89, 199)}${fleche2(380, 145, 199)}
       <text x="130" y="60" text-anchor="middle" font-size="15" fill="${ENCRE}" ${TXT}>continent</text>
       <text x="330" y="60" text-anchor="middle" font-size="15" fill="${ENCRE}" ${TXT}>océan</text>
       <text x="480" y="60" text-anchor="middle" font-size="15" fill="${ENCRE}" ${TXT}>dorsale</text>
       <text x="175" y="186" text-anchor="middle" font-size="13" fill="${ENCRE}" ${TXT}>croûte (écorce)</text>
       <text x="300" y="262" text-anchor="middle" font-size="14" fill="#fff" ${TXT}>manteau</text>
       <text x="12" y="312" font-size="11.5" fill="#5b556f" font-family="sans-serif" font-style="italic">croquis simplifié, pas à l'échelle</text>
       ${pin(1, 40, 26, 90, 144)}${pin(2, 420, 26, 380, 172)}${pin(3, 575, 26, 462, 140)}`),
  },
  'terre-schema': {
    titre: 'Le schéma de ton cours : sous la surface',
    labels: ['cellules de convection', 'panache convectif', 'chambre magmatique', 'volcanisme de dorsale océanique', 'zone de subduction'],
    svg: wrap(630, 400,
      `<!-- manteau, noyau (en bas), croûte, océan et continent -->
       <rect x="50" y="124" width="550" height="196" fill="${COUL.manteau}" stroke="${ENCRE}" stroke-width="2"/>
       <rect x="50" y="318" width="550" height="34" fill="${COUL.liquide}" stroke="${ENCRE}" stroke-width="2"/>
       <rect x="50" y="108" width="550" height="16" fill="${COUL.croute}" stroke="${ENCRE}" stroke-width="1.8"/>
       <polygon points="50,84 462,84 470,108 50,108" fill="${COUL.ocean}" stroke="${ENCRE}" stroke-width="1.6" stroke-linejoin="round"/>
       <polygon points="452,108 472,84 600,80 600,108" fill="${COUL.terre}" stroke="${ENCRE}" stroke-width="1.8" stroke-linejoin="round"/>
       <!-- les cellules de convection -->
       ${boucle(180, 225, 80, 55)}${boucle(405, 225, 70, 55)}
       ${sens(260, 240, 210)}${sens(100, 210, 240)}${sens(335, 240, 210)}${sens(475, 210, 240)}
       <!-- le panache convectif monte du noyau jusqu'à la chambre magmatique, sous un volcan de dorsale océanique -->
       <path d="M288 320 C292 260 295 200 296 132 L304 132 C305 200 308 260 312 320 Z" fill="${COUL.graine}" stroke="${ENCRE}" stroke-width="1.6"/>
       <rect x="296" y="106" width="8" height="20" fill="${COUL.graine}"/>
       <ellipse cx="300" cy="128" rx="24" ry="9" fill="${COUL.graine}" stroke="${ENCRE}" stroke-width="1.6"/>
       ${volcan(300, 108, 72, 26)}
       <!-- la zone de subduction : la croûte de l'océan plonge sous le continent -->
       <path d="M446 108 C470 116 488 150 500 188 C506 210 494 224 482 216 C474 210 478 198 472 178 C464 150 452 134 440 124 Z" fill="${COUL.croute}" stroke="${ENCRE}" stroke-width="1.8" stroke-linejoin="round"/>
       ${volcan(522, 84, 56, 22)}
       <text x="70" y="101" font-size="13" fill="#fff" ${TXT}>océan</text>
       <text x="590" y="102" text-anchor="end" font-size="13" fill="${ENCRE}" ${TXT}>continent</text>
       <text x="62" y="310" font-size="13" fill="#fff" ${TXT}>manteau</text>
       <text x="62" y="341" font-size="13" fill="#fff" ${TXT}>noyau</text>
       <text x="12" y="394" font-size="11.5" fill="#5b556f" font-family="sans-serif" font-style="italic">croquis simplifié du haut du schéma de ton cours</text>
       ${pin(1, 24, 225, 100, 225)}${pin(2, 340, 380, 304, 270)}${pin(3, 200, 30, 280, 126)}${pin(4, 390, 30, 318, 92)}${pin(5, 585, 30, 492, 180)}`),
  },
};
