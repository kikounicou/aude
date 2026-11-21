// Schémas et croquis à légender : assemblés à partir de js/schemas/<id>.js (un fichier par chapitre).
// SCHEMAS[id] = { titre, labels: [...dans l'ordre des numéros], svg }   ·   labels vide = simple illustration.
import { IDS } from '../data/liste.js';

export const SCHEMAS = Object.assign({}, ...(await Promise.all(IDS.map((id) => import(`./schemas/${id}.js`).then((m) => m.SCHEMAS, () => ({}))))));

/** Schéma seul (numéros) — pour les exercices. */
export function schemaSVG(id) { const s = SCHEMAS[id]; return s ? `<div class="schema">${s.svg}</div>` : ''; }

/** Schéma + légende complète — pour la leçon. */
export function schemaAvecLegende(id) {
  const s = SCHEMAS[id];
  if (!s) return '';
  if (!s.labels.length) return `<div class="schema">${s.svg}</div>`;
  return `<div class="schema">${s.svg}</div><div class="legende-liste">${s.labels.map((l, i) => `<div class="l"><i>${i + 1}</i><b>${l}</b></div>`).join('')}</div>`;
}
