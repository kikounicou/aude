// La liste des chapitres, dans l'ordre du cours. Un chapitre = data/c/<id>.js + js/schemas/<id>.js (+ sims/, video/).
// Pendant la fabrication d'un chapitre pas encore dans la liste : index.html?dev=<id> le charge en plus (lui seul).
const PUBLIES = ['plaques', 'terre', 'volcanisme', 'zones', 'lexique', 'volcan', 'chili'];
const dev = typeof location !== 'undefined' ? new URLSearchParams(location.search).get('dev') : null;
export const IDS = dev && !PUBLIES.includes(dev) ? [...PUBLIES, dev] : PUBLIES;
