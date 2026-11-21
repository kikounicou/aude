// Les exercices, par chapitre : assemblés à partir de data/c/<id>.js.
import { MODULES } from './chapitres.js';
export const QUESTIONS = Object.fromEntries(MODULES.map((m) => [m.CHAPITRE.id, m.QUESTIONS || []]));
