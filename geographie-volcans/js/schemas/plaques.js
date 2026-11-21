// Schémas du chapitre 1 (cours/01) : croquis du Chili, dérive des continents, bloc des plaques à légender.
// SCHEMAS[id] = { titre, labels: [...dans l'ordre des numéros], svg }   ·   labels vide = simple illustration.
import { ENCRE, TXT, pin, wrap } from './outils.js';

/* ---------- croquis : le Chili en Amérique du Sud ---------- */
const AMSUD = '148,34 176,22 214,26 236,40 262,44 296,62 318,84 352,104 372,124 368,148 350,176 340,206 318,226 296,236 284,262 262,274 250,300 236,318 228,344 214,362 212,384 198,388 188,366 182,330 180,296 176,262 172,226 164,196 140,170 120,140 112,112 120,88 132,62';
const CHILI = '164,196 172,226 176,262 180,296 182,330 188,366 198,388 212,384 206,362 198,330 194,296 190,262 186,226 178,196';
const ARGENTINE = '186,226 190,262 194,296 198,330 206,362 212,384 214,362 228,344 236,318 250,300 262,274 250,250 226,232 200,222';
const andes = [[179, 206], [183, 232], [187, 260], [190, 288], [194, 316], [198, 342]].map(([x, y]) => `<path d="M${x} ${y + 8} l7 -14 l7 14z" fill="#8a5a33" stroke="${ENCRE}" stroke-width="1.2" stroke-linejoin="round"/>`).join('');

/* ---------- croquis : la dérive des continents (six globes, mêmes dates que le document 1) ---------- */
const TERRES = [[-45, -14, 16, 12], [-34, 14, 9, 15], [22, -16, 34, 11], [2, 8, 12, 16], [50, 20, 9, 6], [0, 40, 26, 4]];
const DATES = [['-250 000 000', 0.16], ['-200 000 000', 0.34], ['-150 000 000', 0.52], ['-100 000 000', 0.7], ['-50 000 000', 0.88], ['Aujourd\'hui', 1]];
const globe = (cx, cy, [date, f]) =>
  `<rect x="${cx - 66}" y="${cy - 80}" width="132" height="24" rx="7" fill="#2f6fb5"/><text x="${cx}" y="${cy - 63}" text-anchor="middle" font-size="14" fill="#fff" ${TXT}>${date}</text>
   <ellipse cx="${cx}" cy="${cy}" rx="84" ry="50" fill="#1d5f8f" stroke="${ENCRE}" stroke-width="2"/>
   ${TERRES.map(([x, y, rx, ry]) => `<ellipse cx="${cx + x * f}" cy="${cy + (y - 4) * f + 2}" rx="${rx}" ry="${ry}" fill="#f2c230"/>`).join('')}`;

export const SCHEMAS = {
  chili: {
    titre: 'Croquis : où se trouve le Chili',
    labels: ['l\'océan Pacifique', 'le Chili', 'la Cordillère des Andes', 'l\'Argentine'],
    svg: wrap(440, 410,
      `<rect width="440" height="410" rx="12" fill="#cfe8f7"/>
       <polygon points="${AMSUD}" fill="#dfe8c2" stroke="${ENCRE}" stroke-width="2.2" stroke-linejoin="round"/>
       <polygon points="${ARGENTINE}" fill="#f1dcae" stroke="${ENCRE}" stroke-width="1.4" stroke-dasharray="5 4" stroke-linejoin="round"/>
       <polygon points="${CHILI}" fill="#ff8a66" stroke="${ENCRE}" stroke-width="1.6" stroke-linejoin="round"/>
       ${andes}
       <line x1="14" y1="96" x2="426" y2="96" stroke="${ENCRE}" stroke-width="1.4" stroke-dasharray="7 6"/><text x="424" y="90" text-anchor="end" font-size="12.5" fill="${ENCRE}" ${TXT}>équateur</text>
       <text x="18" y="84" font-size="11.5" fill="#5b556f" ${TXT}>↑ hémisphère nord</text><text x="18" y="116" font-size="11.5" fill="#5b556f" ${TXT}>↓ hémisphère sud</text>
       <text x="252" y="160" text-anchor="middle" font-size="14" fill="#5b556f" ${TXT}>AMÉRIQUE DU SUD</text>
       <g transform="translate(396,356)"><path d="M0 -26 L7 0 L0 26 L-7 0z" fill="${ENCRE}"/><path d="M-22 0 L0 -6 L22 0 L0 6z" fill="${ENCRE}" opacity=".45"/><text x="0" y="-31" text-anchor="middle" font-size="13" fill="${ENCRE}" ${TXT}>N</text></g>
       <text x="16" y="398" font-size="11.5" fill="#5b556f" font-family="sans-serif" font-style="italic">croquis simplifié</text>
       ${pin(1, 56, 250, 132, 264)}${pin(2, 84, 336, 190, 326)}${pin(3, 316, 340, 203, 314)}${pin(4, 330, 276, 232, 290)}`),
  },
  derive: {
    titre: 'Document 1 : la dérive des continents',
    labels: [],
    svg: wrap(600, 330,
      `<rect width="600" height="330" rx="12" fill="#fffdf8" stroke="${ENCRE}" stroke-width="2"/>
       ${DATES.map((d, i) => globe(104 + (i % 3) * 196, 104 + Math.floor(i / 3) * 150, d)).join('')}
       <text x="14" y="322" font-size="11.5" fill="#5b556f" font-family="sans-serif" font-style="italic">croquis simplifié du document 1 : les terres (en jaune) s'écartent peu à peu</text>`),
  },
  'bloc-plaques': {
    titre: 'Le mouvement des plaques',
    labels: ['zone de subduction', 'rift océanique', 'faille transformante', 'continent', 'croûte', 'manteau', 'cellule de convection'],
    svg: wrap(660, 420,
      `<!-- manteau : face avant et côté droit -->
       <polygon points="60,206 560,206 560,372 60,372" fill="#b877c9" stroke="${ENCRE}" stroke-width="2"/>
       <polygon points="560,206 624,104 624,270 560,372" fill="#9a5cae" stroke="${ENCRE}" stroke-width="2"/>
       <!-- plaque qui plonge dans le manteau (subduction) -->
       <path d="M166 190 L166 206 L96 300 L80 292 Z" fill="#3f8f4a" stroke="${ENCRE}" stroke-width="1.6" stroke-linejoin="round"/>
       <path d="M134 262 l-18 12" stroke="#fff" stroke-width="3" marker-end="url(#flb)"/>
       <!-- croûte : tranche avant -->
       <polygon points="60,190 470,190 470,206 60,206" fill="#3f8f4a" stroke="${ENCRE}" stroke-width="1.6"/>
       <polygon points="470,180 560,180 560,214 470,206" fill="#e58a2e" stroke="${ENCRE}" stroke-width="1.6"/>
       <polygon points="560,180 624,78 624,112 560,214" fill="#c9741f" stroke="${ENCRE}" stroke-width="1.6"/>
       <!-- dessus : fond de l'océan (vert) et continent (orange) -->
       <polygon points="60,190 470,190 534,88 124,88" fill="#a9df7c" stroke="${ENCRE}" stroke-width="2" stroke-linejoin="round"/>
       <polygon points="470,180 560,180 624,78 534,78" fill="#f6c453" stroke="${ENCRE}" stroke-width="2" stroke-linejoin="round"/>
       ${[[500, 160], [524, 126], [552, 150], [566, 108], [590, 94]].map(([x, y]) => `<path d="M${x - 11} ${y + 8} l11 -18 l11 18z" fill="#2f7d3c" stroke="${ENCRE}" stroke-width="1.2" stroke-linejoin="round"/>`).join('')}
       <!-- zone de subduction : la fosse et ses volcans -->
       <path d="M166 190 L230 88" stroke="#2c6b36" stroke-width="5"/><path d="M166 190 L230 88" stroke="${ENCRE}" stroke-width="1.4" stroke-dasharray="3 5"/>
       ${[[112, 168], [136, 132], [164, 102]].map(([x, y]) => `<path d="M${x - 12} ${y + 8} l12 -19 l12 19z" fill="#2f7d3c" stroke="${ENCRE}" stroke-width="1.2" stroke-linejoin="round"/><path d="M${x} ${y - 13} q-6 -8 2 -13" fill="none" stroke="#8d8799" stroke-width="2.4" stroke-linecap="round"/>`).join('')}
       <!-- rift océanique, coupé en deux par la faille transformante -->
       <path d="M318 190 L344 148" stroke="#2c6b36" stroke-width="6"/><path d="M398 148 L436 88" stroke="#2c6b36" stroke-width="6"/>
       <path d="M300 148 L446 148" stroke="${ENCRE}" stroke-width="1.8"/>
       <!-- flèches blanches : les plaques s'écartent du rift -->
       <path d="M296 172 h-54" stroke="#fff" stroke-width="4" marker-end="url(#flb)"/><path d="M352 172 h54" stroke="#fff" stroke-width="4" marker-end="url(#flb)"/>
       <path d="M380 116 h-50" stroke="#fff" stroke-width="4" marker-end="url(#flb)"/><path d="M438 116 h46" stroke="#fff" stroke-width="4" marker-end="url(#flb)"/>
       <!-- magma qui monte sous le rift -->
       <path d="M318 196 c-11 14 -9 28 0 36 c9 -8 11 -22 0 -36z" fill="#d9478f" stroke="${ENCRE}" stroke-width="1.3"/>
       <!-- cellules de convection (boucles en pointillés) -->
       <g fill="none" stroke="#5a2a78" stroke-width="2.6" stroke-dasharray="9 6">
         <path d="M300 250 C300 226 280 226 232 226 C184 226 166 262 166 292 C166 334 200 348 232 348 C282 348 300 340 300 300" marker-end="url(#flv)"/>
         <path d="M336 300 C336 340 356 348 426 348 C486 348 520 334 520 292 C520 250 490 226 426 226 C366 226 336 226 336 258" marker-start="url(#flv)"/>
       </g>
       <path d="M318 340 v-70" stroke="#5a2a78" stroke-width="2.6" stroke-dasharray="9 6" marker-end="url(#flv)" fill="none"/>
       ${pin(1, 96, 44, 196, 142)}${pin(2, 284, 40, 334, 164)}${pin(3, 372, 30, 372, 148)}${pin(4, 500, 34, 548, 118)}
       ${pin(5, 26, 160, 76, 198)}${pin(6, 26, 396, 86, 350)}${pin(7, 420, 400, 426, 348)}`),
  },
};
