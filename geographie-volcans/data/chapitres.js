// Les chapitres : assemblés à partir de data/c/<id>.js (un fichier par chapitre, liste dans data/liste.js).
// Dans les leçons : <mark>mot</mark> = mot à retenir (fluo). {{schema:id}} = schéma légendé (js/schemas/<id>.js).
import { IDS } from './liste.js';

export const THEMES = {
  3: { titre: 'Volcans : vivre dangereusement ?', sous: 'Plaques tectoniques, volcanisme, volcans du Chili' },
};

export const MODULES = await Promise.all(IDS.map((id) => import(`./c/${id}.js`)));
export const CHAPITRES = MODULES.map((m) => m.CHAPITRE);
export const parId = Object.fromEntries(CHAPITRES.map((c) => [c.id, c]));
