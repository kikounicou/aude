// Schémas du chapitre 5 (cours/04 : le lexique ; note manuscrite du haut de la page 20 : « Pourquoi le Chili ? »).
// Un petit dessin par mot du lexique, mêmes couleurs que le chapitre 1 : croûte verte, manteau violet, magma rouge orangé.
// SCHEMAS[id] = { titre, labels: [...dans l'ordre des numéros], svg }   ·   labels vide = simple illustration.
import { ENCRE, TXT, pin, wrap } from './outils.js';

const CROUTE = '#4f9d57', CROUTE2 = '#3f8f4a', CLAIRE = '#a9df7c', MANTEAU = '#b877c9', MAGMA = '#ff5a36', MER = '#cfe8f7';
const GRIS = '#5b556f';
/** Texte lisible sur n'importe quel fond (liseré blanc). */
const mot = (x, y, t, taille = 17, ancre = 'middle', couleur = ENCRE) =>
  `<text x="${x}" y="${y}" text-anchor="${ancre}" font-size="${taille}" fill="${couleur}" stroke="#fff" stroke-width="4" paint-order="stroke" stroke-linejoin="round" ${TXT}>${t}</text>`;
/** Grosse flèche (pointe dessinée à la main : les marqueurs communs grossissent avec l'épaisseur du trait). */
const fleche = (x1, y1, x2, y2, l = 7, c = ENCRE) => {
  const d = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / d, uy = (y2 - y1) / d, h = l * 2.4, w = l * 1.5;
  const bx = x2 - ux * h, by = y2 - uy * h, r = (v) => Math.round(v * 10) / 10;
  return `<line x1="${x1}" y1="${y1}" x2="${r(bx + ux * 2)}" y2="${r(by + uy * 2)}" stroke="${c}" stroke-width="${l}" stroke-linecap="round"/>` +
    `<polygon points="${x2},${y2} ${r(bx - uy * w)},${r(by + ux * w)} ${r(bx + uy * w)},${r(by - ux * w)}" fill="${c}" stroke="${c}" stroke-width="1.5" stroke-linejoin="round"/>`;
};
const croquis = (x, y) => `<text x="${x}" y="${y}" font-size="12" fill="${GRIS}" font-family="sans-serif" font-style="italic">croquis simplifié</text>`;

/* ---------- deux plaques posées sur le manteau (convergence, divergence) ---------- */
const deuxPlaques = (ecart, fleches, legende) => {
  const g = 180 - ecart / 2, d = 180 + ecart / 2;
  return wrap(360, 220,
    `<rect width="360" height="220" rx="12" fill="#fffdf8"/>
     <rect x="10" y="128" width="340" height="82" rx="6" fill="${MANTEAU}" stroke="${ENCRE}" stroke-width="2"/>
     ${mot(180, 190, 'manteau', 15, 'middle', '#3b1d4a')}
     <rect x="14" y="100" width="${g - 14}" height="28" fill="${CROUTE}" stroke="${ENCRE}" stroke-width="2"/>
     <rect x="${d}" y="100" width="${346 - d}" height="28" fill="${CROUTE}" stroke="${ENCRE}" stroke-width="2"/>
     ${mot(14 + (g - 14) / 2, 120, 'plaque', 14)}${mot(d + (346 - d) / 2, 120, 'plaque', 14)}
     ${fleches}
     ${mot(180, 34, legende, 20)}`);
};

/* ---------- croquis : l'Amérique du Sud (mêmes contours que le croquis du Chili du chapitre 1) ---------- */
const AMSUD = '148,34 176,22 214,26 236,40 262,44 296,62 318,84 352,104 372,124 368,148 350,176 340,206 318,226 296,236 284,262 262,274 250,300 236,318 228,344 214,362 212,384 198,388 188,366 182,330 180,296 176,262 172,226 164,196 140,170 120,140 112,112 120,88 132,62';
const CHILI = '164,196 172,226 176,262 180,296 182,330 188,366 198,388 212,384 206,362 198,330 194,296 190,262 186,226 178,196';
// la limite entre les deux plaques, le long de la côte ouest
const LIMITE = 'M98 96 L104 140 L126 172 L150 198 L158 226 L162 262 L166 296 L168 330 L174 366 L184 402';

/* ---------- croquis : le pourtour de l'océan Pacifique ---------- */
const ASIE = '0,18 150,18 178,38 172,68 152,94 132,110 120,138 96,150 70,136 40,142 0,132';
const AUSTRALIE = '56,232 128,214 160,238 152,290 92,300 54,270';
const AMNORD = '332,14 520,14 520,138 472,150 444,172 424,190 404,178 390,140 370,100 346,70 322,44';
const AMSUD2 = '426,192 446,210 470,214 500,222 520,246 520,320 482,320 466,284 452,250 440,222';
const ANNEAU = 'M214 292 C198 252 168 226 158 200 C150 174 176 150 190 120 C200 90 196 60 216 40 C252 18 302 20 332 40 C352 62 374 110 394 160 C408 190 426 204 440 222 C452 252 462 284 470 318';
const VOLCANS = [[214, 290], [196, 262], [170, 230], [158, 200], [170, 166], [186, 132], [196, 100], [204, 66], [222, 38], [262, 26], [302, 28], [334, 44], [356, 78], [374, 116], [390, 152], [410, 186], [434, 212], [450, 246], [460, 280], [468, 312]];

export const SCHEMAS = {
  'lexique-convergence': {
    titre: 'Convergence : les deux plaques se rapprochent',
    labels: [],
    svg: deuxPlaques(8, `${fleche(52, 72, 150, 72)}${fleche(308, 72, 210, 72)}`, 'rapprochement'),
  },
  'lexique-divergence': {
    titre: 'Divergence : les deux plaques s\'éloignent',
    labels: [],
    svg: deuxPlaques(56, `${fleche(140, 72, 42, 72)}${fleche(220, 72, 318, 72)}`, 'éloignement'),
  },
  'lexique-subduction': {
    titre: 'Subduction : une plaque s\'enfonce sous une autre plaque',
    labels: [],
    svg: wrap(360, 240,
      `<rect width="360" height="240" rx="12" fill="#fffdf8"/>
       <rect x="10" y="132" width="340" height="98" rx="6" fill="${MANTEAU}" stroke="${ENCRE}" stroke-width="2"/>
       <!-- la plaque qui s'enfonce (dessinée d'abord : elle passe sous l'autre) -->
       <path d="M350 108 L214 108 Q196 110 184 124 L118 214 L138 224 L202 146 Q212 132 228 130 L350 130 Z" fill="${CROUTE2}" stroke="${ENCRE}" stroke-width="2" stroke-linejoin="round"/>
       <!-- la plaque de densité plus faible, au-dessus -->
       <path d="M10 92 L204 92 Q214 104 212 122 L190 132 L10 132 Z" fill="${CLAIRE}" stroke="${ENCRE}" stroke-width="2" stroke-linejoin="round"/>
       ${fleche(330, 119, 248, 119, 5, '#fff')}
       ${fleche(178, 158, 146, 202, 5, '#fff')}
       ${mot(100, 118, 'densité plus faible', 15)}
       ${mot(276, 96, 'plaque', 15)}
       ${mot(230, 206, 'elle s\'enfonce', 17)}
       ${mot(180, 34, 'enfoncement', 20)}`),
  },
  'lexique-accretion': {
    titre: 'Accrétion : une nouvelle croûte océanique se crée entre deux plaques qui s\'écartent',
    labels: [],
    svg: wrap(360, 240,
      `<rect width="360" height="240" rx="12" fill="#fffdf8"/>
       <rect x="10" y="20" width="340" height="80" rx="6" fill="${MER}"/>
       <path d="M10 30 q14 -8 28 0 t28 0 t28 0 t28 0 t28 0 t28 0 t28 0 t28 0 t28 0 t28 0 t28 0 t28 0" fill="none" stroke="#2f6fb5" stroke-width="2"/>
       <rect x="10" y="124" width="340" height="106" rx="6" fill="${MANTEAU}" stroke="${ENCRE}" stroke-width="2"/>
       <!-- le magma qui remonte au milieu -->
       <path d="M162 230 C166 190 170 160 172 124 L188 124 C190 160 194 190 198 230 Z" fill="${MAGMA}" stroke="${ENCRE}" stroke-width="2"/>
       <rect x="14" y="100" width="150" height="24" fill="${CROUTE}" stroke="${ENCRE}" stroke-width="2"/>
       <rect x="196" y="100" width="150" height="24" fill="${CROUTE}" stroke="${ENCRE}" stroke-width="2"/>
       <!-- la nouvelle croûte océanique, entre les deux -->
       <rect x="164" y="100" width="32" height="24" fill="${CLAIRE}" stroke="${ENCRE}" stroke-width="2"/>
       ${fleche(150, 80, 66, 80)}${fleche(210, 80, 294, 80)}
       <line x1="180" y1="60" x2="180" y2="98" stroke="${ENCRE}" stroke-width="1.6"/><circle cx="180" cy="100" r="3" fill="${ENCRE}"/>
       ${mot(180, 55, 'nouvelle croûte océanique', 17)}
       ${mot(250, 206, 'magma', 15, 'start', '#7a1d0c')}
       ${mot(70, 206, 'manteau', 15, 'middle', '#3b1d4a')}`),
  },
  'lexique-dorsale': {
    titre: 'Dorsale : une chaîne de montagnes sous la mer',
    labels: [],
    svg: wrap(360, 240,
      `<rect width="360" height="240" rx="12" fill="${MER}"/>
       <path d="M0 44 q15 -8 30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0" fill="none" stroke="#2f6fb5" stroke-width="2.4"/>
       <!-- un petit bateau : on est en surface, la chaîne est sous l'eau -->
       <path d="M36 40 h40 l-7 10 h-26 z" fill="#8a5a33" stroke="${ENCRE}" stroke-width="1.6" stroke-linejoin="round"/><path d="M56 38 v-26 l16 22 z" fill="#fff" stroke="${ENCRE}" stroke-width="1.6" stroke-linejoin="round"/>
       <!-- le magma qui remonte au centre de la chaîne -->
       <path d="M172 240 C174 200 176 170 178 130 L184 130 C186 170 188 200 190 240 Z" fill="${MAGMA}" stroke="${ENCRE}" stroke-width="1.6"/>
       <!-- le fond de la mer et la chaîne de montagnes sous-marines -->
       <path d="M0 206 L50 202 L84 190 L112 168 L132 176 L150 136 L166 150 L174 120 L181 136 L188 120 L196 150 L212 136 L230 176 L250 168 L278 190 L312 202 L360 206 L360 240 L0 240 Z" fill="${CROUTE}" stroke="${ENCRE}" stroke-width="2" stroke-linejoin="round"/>
       <path d="M172 240 C174 210 177 175 181 140 C185 175 188 210 190 240 Z" fill="${MAGMA}"/>
       ${mot(180, 92, 'chaîne de montagnes sous-marines', 17)}
       <line x1="180" y1="98" x2="180" y2="122" stroke="${ENCRE}" stroke-width="1.6"/>
       ${mot(330, 70, 'la mer', 14, 'end', '#1d4f86')}
       ${mot(62, 230, 'croûte océanique', 13, 'start')}`),
  },
  'lexique-rift': {
    titre: 'Rift : un fossé d\'effondrement le long d\'une fracture de l\'écorce',
    labels: [],
    svg: wrap(360, 240,
      `<rect width="360" height="240" rx="12" fill="#fffdf8"/>
       <defs>
         <clipPath id="rift-g"><polygon points="10,90 130,90 160,230 10,230"/></clipPath>
         <clipPath id="rift-m"><polygon points="138.6,130 221.4,130 200,230 160,230"/></clipPath>
         <clipPath id="rift-d"><polygon points="230,90 350,90 350,230 200,230"/></clipPath>
       </defs>
       <g clip-path="url(#rift-g)"><rect x="0" y="90" width="360" height="160" fill="${CROUTE}"/><rect x="0" y="90" width="360" height="18" fill="${CLAIRE}"/></g>
       <g clip-path="url(#rift-d)"><rect x="0" y="90" width="360" height="160" fill="${CROUTE}"/><rect x="0" y="90" width="360" height="18" fill="${CLAIRE}"/></g>
       <g clip-path="url(#rift-m)"><rect x="0" y="130" width="360" height="120" fill="${CROUTE}"/><rect x="0" y="130" width="360" height="18" fill="${CLAIRE}"/></g>
       <polygon points="10,90 130,90 160,230 10,230" fill="none" stroke="${ENCRE}" stroke-width="2" stroke-linejoin="round"/>
       <polygon points="230,90 350,90 350,230 200,230" fill="none" stroke="${ENCRE}" stroke-width="2" stroke-linejoin="round"/>
       <polygon points="138.6,130 221.4,130 200,230 160,230" fill="none" stroke="${ENCRE}" stroke-width="2" stroke-linejoin="round"/>
       <!-- les deux fractures de l'écorce -->
       <line x1="130" y1="90" x2="160" y2="230" stroke="#7a1d0c" stroke-width="5" stroke-linecap="round"/>
       <line x1="230" y1="90" x2="200" y2="230" stroke="#7a1d0c" stroke-width="5" stroke-linecap="round"/>
       <!-- le bloc du milieu s'est effondré -->
       ${fleche(180, 154, 180, 204, 5, '#fff')}
       ${mot(180, 40, 'fossé d\'effondrement', 19)}
       <line x1="180" y1="48" x2="180" y2="126" stroke="${ENCRE}" stroke-width="1.6"/><circle cx="180" cy="128" r="3" fill="${ENCRE}"/>
       ${mot(76, 74, 'fracture', 16)}
       <line x1="98" y1="80" x2="138" y2="130" stroke="${ENCRE}" stroke-width="1.6"/><circle cx="138" cy="130" r="3" fill="${ENCRE}"/>
       ${mot(284, 74, 'fracture', 16)}
       <line x1="262" y1="80" x2="222" y2="130" stroke="${ENCRE}" stroke-width="1.6"/><circle cx="222" cy="130" r="3" fill="${ENCRE}"/>`),
  },
  'lexique-faille': {
    titre: 'Faille : deux blocs rocheux qui se sont déplacés l\'un par rapport à l\'autre',
    labels: [],
    svg: wrap(360, 240,
      `<rect width="360" height="240" rx="12" fill="#fffdf8"/>
       <defs>
         <clipPath id="faille-g"><polygon points="10,70 159,70 207,230 10,230"/></clipPath>
         <clipPath id="faille-d"><polygon points="168,100 350,100 350,230 207,230"/></clipPath>
       </defs>
       <g clip-path="url(#faille-g)">${['#a9df7c', '#6fb563', '#4f9d57', '#2f7d3c'].map((c, k) => `<rect x="0" y="${70 + k * 40}" width="360" height="40" fill="${c}"/>`).join('')}</g>
       <g clip-path="url(#faille-d)">${['#a9df7c', '#6fb563', '#4f9d57', '#2f7d3c'].map((c, k) => `<rect x="0" y="${100 + k * 40}" width="360" height="40" fill="${c}"/>`).join('')}</g>
       <polygon points="10,70 159,70 207,230 10,230" fill="none" stroke="${ENCRE}" stroke-width="2" stroke-linejoin="round"/>
       <polygon points="168,100 350,100 350,230 207,230" fill="none" stroke="${ENCRE}" stroke-width="2" stroke-linejoin="round"/>
       <!-- la faille -->
       <line x1="156" y1="60" x2="210" y2="236" stroke="#7a1d0c" stroke-width="5" stroke-linecap="round"/>
       <!-- les deux blocs ont glissé l'un par rapport à l'autre -->
       ${fleche(150, 206, 132, 146, 6)}${fleche(222, 144, 240, 204, 6)}
       ${mot(84, 128, 'bloc rocheux', 16)}${mot(284, 158, 'bloc rocheux', 16)}
       ${mot(250, 40, 'faille', 19)}
       <line x1="232" y1="46" x2="172" y2="110" stroke="${ENCRE}" stroke-width="1.6"/><circle cx="172" cy="112" r="3" fill="${ENCRE}"/>`),
  },
  'lexique-cfp': {
    titre: 'La Ceinture de Feu du Pacifique',
    labels: [],
    svg: wrap(520, 320,
      `<rect width="520" height="320" rx="12" fill="${MER}"/>
       <polygon points="${ASIE}" fill="#dfe8c2" stroke="${ENCRE}" stroke-width="1.8" stroke-linejoin="round"/>
       <polygon points="${AUSTRALIE}" fill="#dfe8c2" stroke="${ENCRE}" stroke-width="1.8" stroke-linejoin="round"/>
       <polygon points="${AMNORD}" fill="#dfe8c2" stroke="${ENCRE}" stroke-width="1.8" stroke-linejoin="round"/>
       <polygon points="${AMSUD2}" fill="#dfe8c2" stroke="${ENCRE}" stroke-width="1.8" stroke-linejoin="round"/>
       <ellipse cx="193" cy="86" rx="6" ry="18" transform="rotate(20 193 86)" fill="#dfe8c2" stroke="${ENCRE}" stroke-width="1.5"/>
       ${[[146, 168, 12, 6], [118, 190, 14, 5], [160, 200, 10, 5], [206, 284, 6, 12]].map(([x, y, rx, ry]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#dfe8c2" stroke="${ENCRE}" stroke-width="1.5"/>`).join('')}
       <!-- la ceinture : un alignement de volcans tout autour de l'océan Pacifique -->
       <path d="${ANNEAU}" fill="none" stroke="#ff7ab0" stroke-width="24" stroke-linecap="round" opacity=".55"/>
       ${VOLCANS.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#e0262b" stroke="${ENCRE}" stroke-width="1.4"/>`).join('')}
       ${mot(285, 98, 'Ceinture de Feu', 16, 'middle', '#a3124f')}${mot(285, 116, 'du Pacifique', 16, 'middle', '#a3124f')}
       <text x="292" y="140" text-anchor="middle" font-size="15" fill="#1d4f86" font-family="sans-serif" font-style="italic" font-weight="700">océan Pacifique</text>
       ${[['≈ 40 000 km', 158, 17], ['452 volcans', 192, 17], ['75 % des volcans émergés', 226, 15]].map(([t, y, f]) => `<rect x="${306 - (t.length * f * 0.29 + 12)}" y="${y - 6}" width="${(t.length * f * 0.29 + 12) * 2}" height="28" rx="8" fill="#fff" stroke="${ENCRE}" stroke-width="2"/><text x="306" y="${y + 13}" text-anchor="middle" font-size="${f}" fill="${ENCRE}" ${TXT}>${t}</text>`).join('')}
       <text x="12" y="312" font-size="12" fill="${GRIS}" font-family="sans-serif" font-style="italic">croquis simplifié · points rouges = volcans</text>`),
  },
  'lexique-chili': {
    titre: 'Pourquoi le Chili ? Le Chili à la rencontre de deux plaques',
    labels: ['la plaque de Nazca', 'la plaque sud-américaine', 'le Chili', 'la zone de subduction'],
    svg: wrap(440, 410,
      `<rect width="440" height="410" rx="12" fill="${MER}"/>
       <!-- la plaque de Nazca, sous l'océan Pacifique -->
       <path d="M14 96 L98 96 L104 140 L126 172 L150 198 L158 226 L162 262 L166 296 L168 330 L174 366 L184 402 L14 402 Z" fill="#b9e0a0" opacity=".75"/>
       <polygon points="${AMSUD}" fill="#dfe8c2" stroke="${ENCRE}" stroke-width="2.2" stroke-linejoin="round"/>
       <polygon points="${CHILI}" fill="#ff8a66" stroke="${ENCRE}" stroke-width="1.6" stroke-linejoin="round"/>
       <!-- la Ceinture de Feu du Pacifique, le long de la limite -->
       <path d="${LIMITE}" fill="none" stroke="#ff7ab0" stroke-width="26" stroke-linecap="round" stroke-linejoin="round" opacity=".55"/>
       <path d="${LIMITE}" fill="none" stroke="${ENCRE}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
       ${[[124, 120], [140, 176], [180, 238], [184, 276], [188, 312], [192, 346], [200, 372]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#e0262b" stroke="${ENCRE}" stroke-width="1.4"/>`).join('')}
       <line x1="14" y1="96" x2="426" y2="96" stroke="${ENCRE}" stroke-width="1.4" stroke-dasharray="7 6"/><text x="424" y="90" text-anchor="end" font-size="12.5" fill="${ENCRE}" ${TXT}>équateur</text>
       <text x="60" y="140" text-anchor="middle" font-size="14" fill="#1d4f86" font-family="sans-serif" font-style="italic" font-weight="700">océan</text>
       <text x="60" y="157" text-anchor="middle" font-size="14" fill="#1d4f86" font-family="sans-serif" font-style="italic" font-weight="700">Pacifique</text>
       <rect x="262" y="296" width="22" height="14" rx="4" fill="#ff7ab0" opacity=".7"/><text x="290" y="308" font-size="14" fill="${ENCRE}" ${TXT}>Ceinture de Feu</text><text x="290" y="325" font-size="14" fill="${ENCRE}" ${TXT}>du Pacifique</text>
       <circle cx="273" cy="344" r="5" fill="#e0262b" stroke="${ENCRE}" stroke-width="1.4"/><text x="290" y="349" font-size="14" fill="${ENCRE}" ${TXT}>volcans</text>
       <g transform="translate(400,40)"><path d="M0 -22 L6 0 L0 22 L-6 0z" fill="${ENCRE}"/><text x="0" y="-26" text-anchor="middle" font-size="13" fill="${ENCRE}" ${TXT}>N</text></g>
       ${croquis(16, 398)}
       ${pin(1, 52, 316, 104, 300)}${pin(2, 330, 196, 290, 150)}${pin(3, 248, 372, 196, 352)}${pin(4, 52, 204, 148, 200)}`),
  },
};
