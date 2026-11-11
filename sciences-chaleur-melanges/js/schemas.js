// Schémas à légender (SVG dessinés à la main, mêmes légendes que le cours).
// SCHEMAS[id] = { titre, labels: [...dans l'ordre des numéros], svg }
const pin = (n, x, y, tx, ty) =>
  `<line x1="${x}" y1="${y}" x2="${tx}" y2="${ty}" stroke="#1d1b2f" stroke-width="1.5"/><circle cx="${tx}" cy="${ty}" r="3" fill="#1d1b2f"/>` +
  `<circle cx="${x}" cy="${y}" r="13" fill="#ff5a36"/><text x="${x}" y="${y + 5}" text-anchor="middle" font-size="14" font-weight="800" fill="#fff" font-family="sans-serif">${n}</text>`;
const wrap = (w, h, inner) =>
  `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" role="img"><defs><marker id="fl" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#1d1b2f"/></marker></defs>${inner}</svg>`;
const ST = 'fill="none" stroke="#1d1b2f" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"';

export const SCHEMAS = {
  thermometre: {
    titre: 'Le thermomètre',
    labels: ['le tube capillaire', 'le vide d\'air', 'une graduation', 'le réservoir de mercure ou d\'alcool coloré'],
    svg: wrap(420, 330,
      `<rect x="90" y="14" width="90" height="302" rx="10" fill="#fffaf2" stroke="#1d1b2f" stroke-width="2"/>
       <rect x="128" y="30" width="14" height="236" rx="7" fill="#fff" stroke="#1d1b2f" stroke-width="2.5"/>
       <rect x="131" y="150" width="8" height="118" fill="#e23b2e"/>
       <circle cx="135" cy="278" r="20" fill="#e23b2e" stroke="#1d1b2f" stroke-width="2.5"/>
       ${[60, 80, 100, 120, 140, 160, 180, 200, 220, 240].map((y) => `<line x1="146" y1="${y}" x2="${y % 40 === 20 ? 162 : 156}" y2="${y}" stroke="#1d1b2f" stroke-width="2"/>`).join('')}
       ${pin(1, 270, 40, 141, 50)}${pin(2, 270, 100, 135, 100)}${pin(3, 270, 160, 162, 140)}${pin(4, 270, 278, 152, 278)}`),
  },
  triangle: {
    titre: 'Les changements d\'état',
    labels: ['fusion', 'solidification', 'vaporisation', 'condensation', 'sublimation', 'condensation'],
    svg: wrap(520, 330,
      `<g font-family="sans-serif" font-weight="800" font-size="17" text-anchor="middle">
        <rect x="200" y="14" width="120" height="44" rx="10" fill="#4db8ff" stroke="#1d1b2f" stroke-width="2.5"/><text x="260" y="42">LIQUIDE</text>
        <rect x="14" y="262" width="120" height="44" rx="10" fill="#cfeeff" stroke="#1d1b2f" stroke-width="2.5"/><text x="74" y="290">SOLIDE</text>
        <rect x="386" y="262" width="120" height="44" rx="10" fill="#fff" stroke="#1d1b2f" stroke-width="2.5"/><text x="446" y="290">GAZ</text>
       </g>
       <g stroke="#1d1b2f" stroke-width="2.5" fill="none" marker-end="url(#fl)">
        <line x1="62" y1="256" x2="196" y2="54"/><line x1="226" y1="64" x2="98" y2="256"/>
        <line x1="294" y1="64" x2="422" y2="256"/><line x1="458" y1="256" x2="324" y2="54"/>
        <line x1="140" y1="272" x2="380" y2="272"/><line x1="380" y1="298" x2="140" y2="298"/>
       </g>
       ${pin(1, 96, 140, 124, 160)}${pin(2, 196, 176, 166, 158)}${pin(3, 324, 176, 354, 158)}${pin(4, 424, 140, 396, 160)}${pin(5, 260, 248, 260, 270)}${pin(6, 260, 322, 260, 300).replace('cy="322"', 'cy="316"').replace('y="327"', 'y="321"')}`),
  },
  ampoule: {
    titre: 'L\'ampoule à décanter',
    labels: ['une ampoule à décanter', 'le liquide 1', 'le liquide 2', 'le robinet'],
    svg: wrap(420, 330,
      `<path d="M150 40 h40 v22 c46 14 62 60 44 104 c-10 26 -34 40 -50 60 v64 h-28 v-64 c-16 -20 -40 -34 -50 -60 c-18 -44 -2 -90 44 -104z" fill="#fff" ${ST.replace('fill="none" ', '')}/>
       <path d="M108 118 h124 c4 18 2 34 -4 48 h-116 c-6 -14 -8 -30 -4 -48z" fill="#ffe45c" opacity=".95"/>
       <path d="M112 166 h116 c-10 22 -30 36 -44 54 v20 h-28 v-20 c-14 -18 -34 -32 -44 -54z" fill="#4db8ff" opacity=".9"/>
       <rect x="140" y="250" width="60" height="12" rx="4" fill="#1d1b2f"/><rect x="194" y="246" width="26" height="20" rx="4" fill="#5b556f"/>
       <rect x="158" y="24" width="24" height="18" rx="3" fill="#8a5a33" stroke="#1d1b2f" stroke-width="2"/>
       ${pin(1, 330, 60, 222, 86)}${pin(2, 330, 140, 200, 142)}${pin(3, 330, 200, 180, 196)}${pin(4, 330, 262, 222, 256)}`),
  },
  filtration: {
    titre: 'La filtration',
    labels: ['un agitateur', 'un entonnoir', 'un filtre', 'le filtrat'],
    svg: wrap(440, 330,
      `<line x1="96" y1="20" x2="186" y2="130" stroke="#1d1b2f" stroke-width="4" stroke-linecap="round"/>
       <path d="M110 86 h160 l-66 86 v54 h-28 v-54z" fill="#eaf6ff" ${ST.replace('fill="none" ', '')}/>
       <path d="M124 92 h132 l-58 76 h-16z" fill="#fffaf2" stroke="#8a5a33" stroke-width="2.5" stroke-dasharray="5 4"/>
       <path d="M140 100 h100 l-42 56 h-16z" fill="#8a5a33" opacity=".55"/>
       <path d="M130 236 v70 a8 8 0 0 0 8 8 h104 a8 8 0 0 0 8 -8 v-70" ${ST}/>
       <path d="M132 276 h116 v30 a6 6 0 0 1 -6 6 h-104 a6 6 0 0 1 -6 -6z" fill="#4db8ff" opacity=".8"/>
       <line x1="190" y1="230" x2="190" y2="270" stroke="#4db8ff" stroke-width="3" stroke-dasharray="4 6"/>
       ${pin(1, 40, 40, 108, 36)}${pin(2, 350, 110, 262, 100)}${pin(3, 350, 170, 222, 140)}${pin(4, 350, 292, 240, 292)}`),
  },
  distillation: {
    titre: 'L\'appareil à distillation',
    labels: ['le bouchon', 'le ballon à fond plat', 'le liquide', 'la plaque chauffante', 'le tube réfrigérant', 'sortie d\'eau froide', 'entrée d\'eau froide', 'le berlin', 'le distillat'],
    svg: wrap(640, 380,
      `<rect x="60" y="300" width="150" height="34" rx="6" fill="#5b556f" stroke="#1d1b2f" stroke-width="2.5"/>
       <path d="M30 334 h580" stroke="#1d1b2f" stroke-width="2.5"/>
       <path d="M118 108 h34 v70 c44 14 62 44 62 72 c0 30 -20 50 -40 50 h-78 c-20 0 -40 -20 -40 -50 c0 -28 18 -58 62 -72z" fill="#fff" ${ST.replace('fill="none" ', '')}/>
       <path d="M60 240 h150 c4 6 4 14 4 14 c0 28 -20 46 -40 46 h-78 c-20 0 -40 -18 -40 -46 c0 0 0 -8 4 -14z" fill="#4db8ff" opacity=".85"/>
       <rect x="114" y="92" width="42" height="20" rx="4" fill="#8a5a33" stroke="#1d1b2f" stroke-width="2.5"/>
       <path d="M135 94 v-22 q0 -14 14 -14 h60 l250 170" fill="none" stroke="#1d1b2f" stroke-width="9" stroke-linecap="round"/>
       <path d="M135 94 v-22 q0 -14 14 -14 h60 l250 170" fill="none" stroke="#fff" stroke-width="4.5" stroke-linecap="round"/>
       <path d="M250 70 l170 116 l-16 24 l-170 -116z" fill="#cfeeff" opacity=".9" ${ST.replace('fill="none" ', '')}/>
       <path d="M280 90 v-32" ${ST}/><path d="M385 197 v34" ${ST}/>
       <path d="M440 250 v70 a8 8 0 0 0 8 8 h64 a8 8 0 0 0 8 -8 v-70" ${ST}/>
       <path d="M442 296 h76 v24 a6 6 0 0 1 -6 6 h-64 a6 6 0 0 1 -6 -6z" fill="#4db8ff" opacity=".8"/>
       <line x1="462" y1="234" x2="470" y2="286" stroke="#4db8ff" stroke-width="3" stroke-dasharray="3 7"/>
       ${pin(1, 60, 60, 116, 100)}${pin(2, 26, 190, 92, 206)}${pin(3, 26, 262, 84, 266)}${pin(4, 26, 360, 76, 320).replace('cy="360"', 'cy="358"').replace('y="365"', 'y="363"')}
       ${pin(5, 420, 60, 350, 128)}${pin(6, 330, 34, 282, 58)}${pin(7, 330, 262, 383, 230)}${pin(8, 590, 250, 520, 262)}${pin(9, 590, 310, 510, 310)}`),
  },
};

/** Schéma seul (numéros) — pour les exercices. */
export function schemaSVG(id) { const s = SCHEMAS[id]; return s ? `<div class="schema">${s.svg}</div>` : ''; }

/** Schéma + légende complète — pour la leçon. */
export function schemaAvecLegende(id) {
  const s = SCHEMAS[id];
  if (!s) return '';
  return `<div class="schema">${s.svg}</div><div class="legende-liste">${s.labels.map((l, i) => `<div class="l"><i>${i + 1}</i><b>${l}</b></div>`).join('')}</div>`;
}
