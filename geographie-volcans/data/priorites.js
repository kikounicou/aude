// Priorités et questions de contrôle, par chapitre : assemblées à partir de data/c/<id>.js.
import { MODULES } from './chapitres.js';
export const PRIO = Object.fromEntries(MODULES.map((m) => [m.CHAPITRE.id, m.PRIO || {}]));
