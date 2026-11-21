// Schémas du chapitre 7 (cours/06) : les trois volcans du Chili, d'après les photos du cours (Osorno, Calbuco, Villarica),
// ce que chacun rejette, et le bouchon du Villarica.
// SCHEMAS[id] = { titre, labels: [...dans l'ordre des numéros], svg }   ·   labels vide = simple illustration.
import { ENCRE, TXT, pin, wrap } from './outils.js';

const NOTE = (x, y, t, c = '#5b556f') => `<text x="${x}" y="${y}" font-size="11.5" fill="${c}" font-family="sans-serif" font-style="italic">${t}</text>`;
/** Nuage en boules : ombre décalée, corps, reflet. l = [[cx, cy, r], …] */
const nuage = (l, ombre, corps, reflet) =>
  l.map(([x, y, r]) => `<circle cx="${x + r * 0.18}" cy="${y + r * 0.2}" r="${r}" fill="${ombre}"/>`).join('') +
  l.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${corps}"/>`).join('') +
  l.map(([x, y, r]) => `<circle cx="${x - r * 0.25}" cy="${y - r * 0.28}" r="${r * 0.45}" fill="${reflet}"/>`).join('');
/** Coulée de lave : bord orange, cœur jaune. */
const lave = (d, w = 7) => `<path d="${d}" fill="none" stroke="#ff5a36" stroke-width="${w}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#ffc94d" stroke-width="${w * 0.35}" stroke-linecap="round"/>`;
/** Bas arrondi d'un panneau (sol ou lac) : de y à yb, entre x0 et x1. */
const bas = (x0, x1, y, yb, r = 10) => `M${x0} ${y} H${x1} V${yb - r} Q${x1} ${yb} ${x1 - r} ${yb} H${x0 + r} Q${x0} ${yb} ${x0} ${yb - r} Z`;
const etoiles = (pts) => pts.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" opacity=".85"/>`).join('');
/** Pastille numérotée pour un fond de nuit : même dessin que pin(), avec un trait clair. */
const pinNuit = (n, x, y, tx, ty) => pin(n, x, y, tx, ty).replace(`stroke="${ENCRE}"`, 'stroke="#fff"').replace(`r="3" fill="${ENCRE}"`, 'r="3.5" fill="#fff"');

/* ---------- les trois volcans côte à côte (d'après les photos du cours) ---------- */
const TROIS = `
  <!-- 1. Osorno : un cône parfait, sommet enneigé, au bord d'un lac -->
  <rect x="8" y="8" width="192" height="250" rx="10" fill="#cfe8f7"/>
  <polygon points="22,204 96,74 112,74 186,204" fill="#6f6258" stroke="${ENCRE}" stroke-width="2" stroke-linejoin="round"/>
  <polygon points="96,74 112,74 134,113 125,107 118,117 110,108 102,118 94,108 85,116 74,113" fill="#fff" stroke="${ENCRE}" stroke-width="1.4" stroke-linejoin="round"/>
  <rect x="8" y="198" width="192" height="10" fill="#5f8f4e"/>
  <path d="${bas(8, 200, 206, 258)}" fill="#3d8bd9"/>
  <polygon points="22,207 186,207 104,252" fill="#2f6fb5" opacity=".5"/>
  <path d="M36 224 h34 M128 232 h44 M56 246 h50" stroke="#a9d6ff" stroke-width="3" stroke-linecap="round"/>
  <!-- 2. Calbuco : un énorme panache de cendres gris -->
  <rect x="204" y="8" width="192" height="250" rx="10" fill="#dfe5ec"/>
  <path d="${bas(204, 396, 222, 258)}" fill="#6f8f55"/>
  <polygon points="214,224 276,152 324,152 386,224" fill="#6b5a4e" stroke="${ENCRE}" stroke-width="2" stroke-linejoin="round"/>
  ${nuage([[300, 140, 16], [292, 118, 22], [308, 98, 25], [294, 76, 28], [320, 58, 28], [272, 56, 26], [300, 42, 30], [344, 40, 24], [250, 38, 22], [362, 66, 20], [236, 62, 16]], '#7e7889', '#a29cad', '#c7c2cf')}
  <!-- 3. Villarica : de nuit, un volcan enneigé, de la lave orange au sommet et un panache -->
  <rect x="400" y="8" width="192" height="250" rx="10" fill="#1d1a3a"/>
  ${etoiles([[418, 30, 1.6], [440, 64, 1.2], [566, 26, 1.5], [580, 74, 1.2], [430, 110, 1.3], [572, 124, 1.4], [458, 22, 1.1]])}
  <path d="${bas(400, 592, 222, 258)}" fill="#2a2a33"/>
  <polygon points="412,224 492,94 510,94 588,224" fill="#3c3644" stroke="#0d0b18" stroke-width="2" stroke-linejoin="round"/>
  <polygon points="492,94 510,94 539,141 530,135 522,145 512,136 502,146 492,135 482,144 463,141" fill="#c9d3e6"/>
  ${nuage([[506, 74, 12], [514, 54, 15], [528, 34, 16]], '#3a3040', '#5a4a55', '#7a5a50')}
  <circle cx="501" cy="94" r="22" fill="#ff7a2a" opacity=".3"/><circle cx="501" cy="94" r="12" fill="#ffb347" opacity=".75"/>
  <ellipse cx="501" cy="95" rx="10" ry="4" fill="#ffe08a"/>
  ${lave('M497 98 q-6 18 -16 30 q-5 8 -6 18', 4)}
  ${NOTE(10, 280, 'croquis simplifié, d\'après les photos du cours')}
  ${pin(1, 28, 30, 76, 150)}${pin(2, 224, 112, 262, 190)}${pinNuit(3, 420, 152, 482, 170)}`;

/* ---------- Osorno : éruptions effusives ---------- */
const OSORNO = `
  <rect width="520" height="320" rx="12" fill="#cfe8f7"/>
  <polygon points="60,250 246,70 274,70 460,250" fill="#6f6258" stroke="${ENCRE}" stroke-width="2.5" stroke-linejoin="round"/>
  <!-- la neige du sommet -->
  <polygon points="220,96 300,96 346,140 332,132 320,146 306,134 292,148 278,135 264,147 250,134 236,146 222,133 208,144 194,134 174,140" fill="#fff" stroke="${ENCRE}" stroke-width="1.4" stroke-linejoin="round"/>
  <!-- les produits solides noirs, accumulés en couches près du cratère -->
  <polygon points="232,84 288,84 300,96 220,96" fill="#3a3335" stroke="${ENCRE}" stroke-width="1.2"/>
  <polygon points="246,70 274,70 288,84 232,84" fill="#221d1f" stroke="${ENCRE}" stroke-width="1.2"/>
  <ellipse cx="260" cy="71" rx="14" ry="4" fill="#ff5a36"/>
  <!-- … et ceux qui sont projetés -->
  <g fill="none" stroke="${ENCRE}" stroke-width="1.6" stroke-dasharray="3 4"><path d="M256 66 q-14 -40 -30 -8"/><path d="M264 66 q14 -46 32 -6"/></g>
  ${[[226, 52, 5], [240, 34, 6], [262, 26, 4.5], [282, 36, 5.5], [296, 58, 4.5], [214, 72, 4]].map(([x, y, r]) => `<rect x="${x - r}" y="${y - r}" width="${2 * r}" height="${2 * r}" rx="1.5" transform="rotate(${x % 40} ${x} ${y})" fill="#1d1b1e"/>`).join('')}
  <!-- la lave : des coulées peu épaisses -->
  ${lave('M262 72 C 268 120, 250 170, 262 248')}
  ${lave('M268 72 C 300 120, 320 180, 352 248')}
  <!-- le lac -->
  <rect x="0" y="244" width="520" height="10" fill="#5f8f4e"/>
  <path d="${bas(0, 520, 252, 320, 12)}" fill="#3d8bd9"/>
  <polygon points="60,253 460,253 260,314" fill="#2f6fb5" opacity=".45"/>
  <path d="M40 272 h70 M380 280 h90 M150 298 h110" stroke="#a9d6ff" stroke-width="3.5" stroke-linecap="round"/>
  ${NOTE(14, 312, 'croquis simplifié', '#e8f4ff')}
  ${pin(1, 446, 118, 310, 152)}${pin(2, 116, 52, 230, 88)}`;

/* ---------- Calbuco : éruptions explosives, mais également effusives ---------- */
const CALBUCO = `
  <rect width="520" height="340" rx="12" fill="#dfe5ec"/>
  <path d="${bas(0, 520, 270, 340, 12)}" fill="#6f8f55"/>
  <polygon points="70,276 210,170 310,170 450,276" fill="#6b5a4e" stroke="${ENCRE}" stroke-width="2.5" stroke-linejoin="round"/>
  <ellipse cx="260" cy="171" rx="48" ry="6" fill="#4a3d35"/>
  ${lave('M300 172 C 320 200, 330 230, 372 276')}
  <!-- les cendres qui retombent sous le panache -->
  ${[[168, 104], [178, 122], [160, 132], [186, 142], [372, 106], [384, 126], [364, 136], [392, 146], [176, 160], [380, 162]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.4" fill="#6d6873"/>`).join('')}
  <!-- l'énorme panache : des cendres et des nuages de poussières -->
  ${nuage([[260, 150, 22], [250, 126, 28], [272, 102, 32], [252, 78, 34], [288, 62, 36], [228, 54, 32], [322, 50, 34], [196, 62, 28], [356, 66, 30], [168, 80, 22], [388, 84, 22], [262, 44, 34]], '#7e7889', '#a29cad', '#c7c2cf')}
  ${NOTE(14, 330, 'croquis simplifié', '#eef5e6')}
  ${pin(1, 40, 38, 178, 72)}${pin(2, 474, 196, 328, 217)}`;

/* ---------- Villarica : le bouchon, puis l'explosion ---------- */
const VILLARICA = `
  <!-- avant : les laves visqueuses forment un bouchon, la pression monte -->
  <rect x="6" y="6" width="250" height="294" rx="10" fill="#1d1a3a"/>
  ${etoiles([[24, 60, 1.4], [220, 70, 1.3], [200, 104, 1.1], [36, 110, 1.2]])}
  <polygon points="16,290 112,120 150,120 246,290" fill="#4a4352" stroke="#0d0b18" stroke-width="2" stroke-linejoin="round"/>
  <polygon points="112,120 150,120 172,159 160,152 150,163 140,153 122,163 112,152 101,161 90,159" fill="#c9d3e6"/>
  <rect x="118" y="146" width="26" height="146" fill="#e0662a" stroke="#0d0b18" stroke-width="1.5"/>
  ${[[124, 200], [136, 236], [128, 262], [137, 180]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="#ffb347"/>`).join('')}
  <path d="M114 148 L114 124 Q131 100 148 124 L148 148 Z" fill="#3a2626" stroke="#0d0b18" stroke-width="2"/>
  <path d="M125 190 v-28" stroke="#fff" stroke-width="3.5" marker-end="url(#flb)"/><path d="M137 190 v-28" stroke="#fff" stroke-width="3.5" marker-end="url(#flb)"/>
  <text x="131" y="34" text-anchor="middle" font-size="16" fill="#fff" ${TXT}>la pression monte…</text>
  <!-- après : l'éruption devient explosive, les coulées pyroclastiques dévalent les pentes -->
  <rect x="264" y="6" width="250" height="294" rx="10" fill="#1d1a3a"/>
  ${etoiles([[490, 40, 1.3], [286, 92, 1.2], [500, 110, 1.4]])}
  <polygon points="274,290 370,140 408,140 504,290" fill="#4a4352" stroke="#0d0b18" stroke-width="2" stroke-linejoin="round"/>
  <polygon points="370,140 408,140 426,170 414,164 404,174 392,165 380,174 370,164 360,172 351,170" fill="#c9d3e6"/>
  <circle cx="389" cy="128" r="26" fill="#ff7a2a" opacity=".45"/>
  ${nuage([[389, 112, 18], [372, 92, 20], [404, 86, 22], [388, 66, 24]], '#4a3a3a', '#7a6660', '#9a8478')}
  ${[[344, 74, 5], [430, 60, 6], [452, 92, 4.5], [330, 110, 4], [420, 44, 4]].map(([x, y, r]) => `<rect x="${x - r}" y="${y - r}" width="${2 * r}" height="${2 * r}" rx="1.5" transform="rotate(${x % 50} ${x} ${y})" fill="#1d1b1e" stroke="#ff7a2a" stroke-width="1"/>`).join('')}
  <!-- les coulées pyroclastiques : des nuées de gaz brûlants, de roches et de poussières qui dévalent les pentes -->
  ${[[418, 172, 10], [436, 200, 13], [456, 232, 15], [476, 264, 15], [356, 176, 9], [340, 206, 11]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#ff7a2a" opacity=".55"/>`).join('')}
  ${nuage([[412, 152, 10], [420, 166, 12], [430, 182, 14], [440, 200, 15], [450, 218, 17], [462, 238, 18], [474, 258, 19], [486, 276, 16], [366, 152, 9], [358, 168, 11], [350, 186, 12], [340, 206, 13], [330, 226, 11]], '#4e403f', '#8a7a70', '#a89488')}
  <path d="M404 206 L438 256" stroke="#fff" stroke-width="3.5" marker-end="url(#flb)"/>
  <text x="389" y="34" text-anchor="middle" font-size="15" fill="#ffe45c" ${TXT}>l'éruption devient explosive</text>
  <!-- la flèche entre les deux : quand la pression est trop forte -->
  <path d="M236 66 h36" stroke="#ffe45c" stroke-width="5" fill="none"/><path d="M270 56 l16 10 l-16 10 z" fill="#ffe45c" stroke="#1d1a3a" stroke-width="1.5"/>
  ${NOTE(8, 320, 'croquis simplifié')}
  ${pinNuit(1, 32, 150, 131, 226)}${pinNuit(2, 60, 82, 131, 116)}${pinNuit(3, 226, 140, 140, 172)}${pinNuit(4, 500, 128, 458, 222)}`;

export const SCHEMAS = {
  'chili-trois': {
    titre: 'Les trois volcans du Chili, d\'après les photos du cours',
    labels: ['le volcan d\'Osorno', 'le volcan Calbuco', 'le volcan Villarica'],
    svg: wrap(600, 290, TROIS),
  },
  'chili-osorno': {
    titre: 'Le volcan d\'Osorno : éruptions effusives',
    labels: ['la lave (généralement moins de deux mètres d\'épaisseur)', 'les produits solides noirs (projections volcaniques)'],
    svg: wrap(520, 320, OSORNO),
  },
  'chili-calbuco': {
    titre: 'Le volcan Calbuco : éruptions explosives, mais également effusives',
    labels: ['des cendres et des nuages de poussières', 'des coulées de lave'],
    svg: wrap(520, 340, CALBUCO),
  },
  'chili-villarica': {
    titre: 'Le volcan Villarica : le bouchon, puis l\'explosion',
    labels: ['la lave visqueuse (pâteuse)', 'le bouchon', 'la pression', 'la coulée pyroclastique'],
    svg: wrap(520, 330, VILLARICA),
  },
};
