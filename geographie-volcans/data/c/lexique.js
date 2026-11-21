// Chapitre 5 : Le lexique, et pourquoi le Chili ? Source unique : cours/04-lexique.md (le lexique, triangle ⚠ imprimé, pas de
// croix rouge) ; pour « Pourquoi le Chili ? » : les deux notes manuscrites du haut de la page 20 (cours/06-volcans-du-chili.md).
// Les pages 16 et 17 (les questions de « Pourquoi le Chili ? ») n'ont pas été photographiées : rien n'est ajouté au-delà des notes.
// Formats : voir BRIEF-CHAPITRES.md à la racine du projet.

/** Une définition du lexique, mot pour mot, bien en vue. */
const def = (t) => `<p style="font-size:18px;font-weight:600;line-height:1.4;border-left:5px solid var(--chaud);padding:2px 0 2px 12px;margin:0 0 12px">${t}</p>`;

export const CHAPITRE = {
  id: 'lexique', theme: 3, titre: 'Le lexique, et pourquoi le Chili ?',
  accroche: 'Huit mots à connaître pour parler des plaques et des volcans. Et une question : pourquoi le Chili ?',
  etoiles: 2,
  sims: [],
  lecon: `
<div class="bloc essentiel">
<h2>L'idée en 20 secondes</h2>
<p>Ce chapitre, c'est le <b>vocabulaire</b> du thème : huit définitions à connaître, dans les mots de ton cours (la page porte
un triangle ⚠).</p>
<p>Deux plaques peuvent se <mark>rapprocher</mark> (convergence) ou s'<mark>éloigner</mark> (divergence). Une plaque qui
s'enfonce sous une autre : la <mark>subduction</mark>. Une nouvelle croûte océanique qui se crée : l'<mark>accrétion</mark>.</p>
<p>Et le Chili ? Il est à la rencontre de deux plaques, dans la <mark>Ceinture de Feu du Pacifique</mark> : une zone de
subduction.</p>
</div>

<div class="deux">
<div class="bloc">
<h2>Convergence</h2>
${def('Rapprochement entre deux plaques.')}
{{schema:lexique-convergence}}
</div>
<div class="bloc">
<h2>Divergence</h2>
${def('Éloignement entre deux plaques.')}
{{schema:lexique-divergence}}
</div>
</div>
<p class="astuce">Pour ne pas les mélanger : <b>di</b>vergence, comme « <b>di</b>verger » : partir chacun de son côté. Les
plaques s'<b>éloignent</b>.</p>

<div class="deux">
<div class="bloc">
<h2>Subduction</h2>
${def('Processus d\'enfoncement d\'une plaque tectonique sous une autre plaque de densité plus faible.')}
{{schema:lexique-subduction}}
</div>
<div class="bloc">
<h2>Accrétion</h2>
${def('Frontière de plaques le long de laquelle se crée une nouvelle croûte océanique. Les plaques s\'écartent l\'une de l\'autre à partir d\'une zone d\'accrétion.')}
{{schema:lexique-accretion}}
</div>
</div>
<p class="astuce">Tu as déjà vu ces deux mots au chapitre des types de volcanisme : le volcanisme de <b>subduction</b> et le
volcanisme d'<b>accrétion</b>.</p>

<div class="deux">
<div class="bloc">
<h2>Dorsale</h2>
${def('Chaîne de montagnes sous-marines où se forme la croûte océanique.')}
{{schema:lexique-dorsale}}
</div>
<div class="bloc">
<h2>Rift</h2>
${def('Le rift est un fossé d\'effondrement se localisant le long d\'une fracture de l\'écorce.')}
{{schema:lexique-rift}}
</div>
</div>

<div class="deux">
<div class="bloc">
<h2>Faille</h2>
${def('Déplacement de l\'écorce terrestre le long de laquelle des blocs rocheux se sont déplacés l\'un par rapport à l\'autre.')}
{{schema:lexique-faille}}
</div>
<div class="bloc">
<h2>Pour tout ranger</h2>
<table class="tab">
<tr><th>Les plaques se rapprochent</th><th>Les plaques s'éloignent</th></tr>
<tr><td><b>convergence</b> : rapprochement entre deux plaques</td><td><b>divergence</b> : éloignement entre deux plaques</td></tr>
<tr><td><b>subduction</b> : là où les plaques se chevauchent, l'une s'enfonce sous l'autre</td><td><b>accrétion</b> : les plaques s'écartent, une nouvelle croûte océanique se crée</td></tr>
<tr><td></td><td><b>dorsale</b> et <b>rift</b> : « quand deux plaques s'écartent, une fissure (rift/dorsale) se crée »</td></tr>
</table>
<p class="astuce">La phrase entre guillemets et « se chevauchent » viennent de ton tableau des types de volcanisme.</p>
</div>
</div>

<div class="bloc">
<h2>La Ceinture de Feu du Pacifique</h2>
${def('Alignement de volcans qui borde l\'océan Pacifique sur la majorité de son pourtour, soit environ 40 000 km (452 volcans, soit 75 % des volcans émergés de la planète, qu\'ils soient actifs ou éteints).')}
{{schema:lexique-cfp}}
<p class="astuce">Trois chiffres à retenir : environ <b>40 000 km</b> de long, <b>452 volcans</b>, <b>75 %</b> des volcans
émergés. 75 %, c'est trois volcans émergés sur quatre.</p>
</div>

<div class="retiens">
<p><b>Lexique</b> (à savoir mot pour mot) :</p>
<p><b>Accrétion :</b> frontière de plaques le long de laquelle se crée une nouvelle croûte océanique. Les plaques s'écartent
l'une de l'autre à partir d'une zone d'accrétion.</p>
<p><b>Convergence :</b> rapprochement entre deux plaques.</p>
<p><b>Divergence :</b> éloignement entre deux plaques.</p>
<p><b>Dorsale :</b> chaîne de montagnes sous-marines où se forme la croûte océanique.</p>
<p><b>Faille :</b> déplacement de l'écorce terrestre le long de laquelle des blocs rocheux se sont déplacés l'un par rapport à
l'autre.</p>
<p><b>Rift :</b> est un fossé d'effondrement se localisant le long d'une fracture de l'écorce.</p>
<p><b>Subduction :</b> processus d'enfoncement d'une plaque tectonique sous une autre plaque de densité plus faible.</p>
<p><b>La Ceinture de Feu du Pacifique :</b> alignement de volcans qui borde l'océan Pacifique sur la majorité de son pourtour,
soit environ 40 000 km (452 volcans, soit 75 % des volcans émergés de la planète, qu'ils soient actifs ou éteints).</p>
</div>

<div class="bloc">
<h2>Pourquoi le Chili ?</h2>
<p>Rappel du chapitre 1 : le Chili est sur la côte <b>ouest</b> de l'Amérique du Sud, le long de l'océan <b>Pacifique</b>.
Les deux réponses notées dans ton cours :</p>
<table class="tab">
<tr><th>Quelles plaques ?</th><td>La plaque de <mark>Nazca</mark> et la plaque <mark>sud-américaine</mark>.</td></tr>
<tr><th>Quelle zone ?</th><td>La <mark>Ceinture de Feu du Pacifique</mark> (CFP) : une zone de <mark>subduction</mark>.</td></tr>
</table>
{{schema:lexique-chili}}
<p style="margin-top:12px">Souviens-toi de la définition : la <b>subduction</b>, c'est le processus d'enfoncement d'une plaque tectonique sous une
autre plaque de densité plus faible.</p>
</div>`,
  mots: [
    ['Accrétion', 'Frontière de plaques le long de laquelle se crée une nouvelle croûte océanique.'],
    ['Convergence', 'Rapprochement entre deux plaques.'],
    ['Divergence', 'Éloignement entre deux plaques.'],
    ['Dorsale', 'Chaîne de montagnes sous-marines où se forme la croûte océanique.'],
    ['Faille', 'Déplacement de l\'écorce terrestre le long de laquelle des blocs rocheux se sont déplacés l\'un par rapport à l\'autre.'],
    ['Rift', 'Fossé d\'effondrement se localisant le long d\'une fracture de l\'écorce.'],
    ['Subduction', 'Processus d\'enfoncement d\'une plaque tectonique sous une autre plaque de densité plus faible.'],
    ['Ceinture de Feu du Pacifique', 'Alignement de volcans qui borde l\'océan Pacifique : environ 40 000 km, 452 volcans, 75 % des volcans émergés.'],
  ],
};

export const QUESTIONS = [
  { type: 'relier', prio: true, q: 'Relie chaque mot à sa définition.', paires: [['Convergence', 'Rapprochement entre deux plaques'], ['Divergence', 'Éloignement entre deux plaques'], ['Dorsale', 'Chaîne de montagnes sous-marines où se forme la croûte océanique'], ['Rift', 'Fossé d\'effondrement se localisant le long d\'une fracture de l\'écorce']],
    expl: 'Convergence = rapprochement ; divergence = éloignement (entre deux plaques). La dorsale est sous la mer : une chaîne de montagnes sous-marines. Le rift est un fossé d\'effondrement.' },
  { type: 'relier', prio: true, q: 'Relie chaque mot à sa définition.', paires: [['Accrétion', 'Frontière de plaques le long de laquelle se crée une nouvelle croûte océanique'], ['Subduction', 'Enfoncement d\'une plaque tectonique sous une autre plaque de densité plus faible'], ['Faille', 'Des blocs rocheux se sont déplacés l\'un par rapport à l\'autre'], ['Ceinture de Feu du Pacifique', 'Alignement de volcans qui borde l\'océan Pacifique']],
    expl: 'Accrétion : une nouvelle croûte océanique se crée. Subduction : une plaque s\'enfonce sous une autre plaque de densité plus faible. Faille : des blocs rocheux se sont déplacés l\'un par rapport à l\'autre.' },
  { type: 'ecrire', prio: true, q: 'Quel mot du lexique correspond à cette définition ? « Processus d\'enfoncement d\'une plaque tectonique sous une autre plaque de densité plus faible. »', reponses: ['la subduction', 'subduction', 'une subduction', 'zone de subduction'],
    expl: 'C\'est la subduction : une plaque s\'enfonce sous une autre plaque, de densité plus faible.' },
  { type: 'ecrire', prio: true, q: 'Quel mot du lexique correspond à cette définition ? « Frontière de plaques le long de laquelle se crée une nouvelle croûte océanique. »', reponses: ['l\'accrétion', 'accrétion', 'une accrétion', 'zone d\'accrétion', 'une zone d\'accrétion'],
    expl: 'C\'est l\'accrétion. Les plaques s\'écartent l\'une de l\'autre à partir d\'une zone d\'accrétion.' },
  { type: 'trous', banque: true, prio: true, texte: 'Convergence : {rapprochement} entre deux plaques. Divergence : {éloignement} entre deux plaques.', leurres: ['enfoncement', 'effondrement'],
    expl: 'Convergence : les plaques se rapprochent. Divergence : elles s\'éloignent. L\'enfoncement, c\'est la subduction ; le fossé d\'effondrement, c\'est le rift.' },
  { type: 'classer', prio: true, q: 'Range chaque mot : les plaques se rapprochent, ou elles s\'éloignent ?', categories: ['Les plaques se rapprochent', 'Les plaques s\'éloignent'],
    items: [{ t: 'convergence', c: 0 }, { t: 'subduction (les plaques se chevauchent)', c: 0 }, { t: 'divergence', c: 1 }, { t: 'accrétion', c: 1 }, { t: 'dorsale', c: 1 }, { t: 'rift', c: 1 }],
    expl: 'Convergence = rapprochement entre deux plaques ; là où les plaques se chevauchent, l\'une s\'enfonce sous l\'autre : subduction. Divergence = éloignement : les plaques s\'écartent à partir d\'une zone d\'accrétion, et une fissure (rift/dorsale) se crée.' },
  { type: 'trous', banque: true, prio: true, texte: 'La Ceinture de Feu du Pacifique : alignement de {volcans} qui borde l\'océan {Pacifique} sur la majorité de son pourtour, soit environ {40 000} km ({452} volcans, soit {75} % des volcans émergés de la planète, qu\'ils soient actifs ou éteints).', leurres: ['4 000', 'Atlantique', '25'],
    expl: 'Les trois chiffres : environ 40 000 km, 452 volcans, 75 % des volcans émergés de la planète. (4 000 km, c\'est la longueur du Chili.)' },
  { type: 'trous', prio: true, q: 'Pourquoi le Chili ? Complète.', texte: 'Le Chili se trouve à la rencontre de deux plaques : la plaque de {Nazca|Nasca} et la plaque {sud-américaine|sud américaine|sudaméricaine}.',
    expl: 'Note de ton cours : « plaques ? Nazca et sud-américaine ».' },
  { type: 'qcm', prio: true, q: 'Pourquoi le Chili ? Dans quelle zone se trouve-t-il ?', choix: ['La Ceinture de Feu du Pacifique : une zone de subduction', 'La dorsale médio-Atlantique : une zone d\'accrétion', 'Le Rift africain : une zone d\'accrétion', 'Le Pourtour méditerranéen, au bord de la mer Méditerranée'], bonne: 0,
    expl: 'Note de ton cours : « Zone ? CFP (subduction) ». Le Chili borde l\'océan Pacifique : il est dans la Ceinture de Feu du Pacifique, une zone de subduction.' },
  { type: 'legende', q: 'Pourquoi le Chili ? Légende le croquis.', schema: 'lexique-chili', leurres: ['la zone d\'accrétion', 'la dorsale'],
    expl: 'Les deux plaques de ta note : la plaque de Nazca (1) et la plaque sud-américaine (2). Le Chili longe la limite entre les deux : la zone de subduction, dans la Ceinture de Feu du Pacifique (en rose).' },
  { type: 'vf', q: 'La divergence, c\'est le rapprochement entre deux plaques.', vrai: false,
    expl: 'Faux. Divergence : éloignement entre deux plaques. Le rapprochement, c\'est la convergence.' },
  { type: 'vf', q: 'Lors d\'une subduction, une plaque tectonique s\'enfonce sous une autre plaque de densité plus faible.', vrai: true,
    expl: 'Vrai. Subduction : processus d\'enfoncement d\'une plaque tectonique sous une autre plaque de densité plus faible.' },
  { type: 'vf', q: 'Le Chili se trouve dans une zone d\'accrétion.', vrai: false,
    expl: 'Faux. Le Chili est dans la Ceinture de Feu du Pacifique : une zone de subduction. À une zone d\'accrétion, les plaques s\'écartent.' },
  { type: 'qcm', q: 'Quel mot du lexique ce schéma illustre-t-il ?', vis: 'lexique-rift', choix: ['un rift', 'une dorsale', 'une subduction', 'une convergence'], bonne: 0,
    expl: 'Un fossé d\'effondrement le long d\'une fracture de l\'écorce : c\'est un rift. La dorsale, elle, est une chaîne de montagnes sous-marines.' },
  { type: 'ecrire', q: 'Comment s\'appelle cette chaîne de montagnes sous-marines où se forme la croûte océanique ?', vis: 'lexique-dorsale', reponses: ['une dorsale', 'dorsale', 'la dorsale', 'dorsale océanique', 'une dorsale océanique'],
    expl: 'Dorsale : chaîne de montagnes sous-marines où se forme la croûte océanique.' },
  { type: 'qcm', q: 'Sur ce schéma, que s\'est-il passé le long de la faille ?', vis: 'lexique-faille', choix: ['Des blocs rocheux se sont déplacés l\'un par rapport à l\'autre.', 'Une nouvelle croûte océanique s\'est créée.', 'Une plaque s\'est enfoncée sous une autre plaque.', 'Deux plaques se sont rapprochées.'], bonne: 0,
    expl: 'Faille : déplacement de l\'écorce terrestre le long de laquelle des blocs rocheux se sont déplacés l\'un par rapport à l\'autre. Regarde les couches : elles sont décalées.' },
  { type: 'ordre', q: 'Remets la définition de la faille dans l\'ordre.', etapes: ['Déplacement de l\'écorce terrestre', 'le long de laquelle', 'des blocs rocheux', 'se sont déplacés', 'l\'un par rapport à l\'autre.'],
    expl: 'Faille : déplacement de l\'écorce terrestre le long de laquelle des blocs rocheux se sont déplacés l\'un par rapport à l\'autre.' },
  { type: 'trous', q: 'Complète les définitions de la dorsale et du rift.', texte: 'Dorsale : chaîne de {montagnes} sous-marines où se forme la croûte {océanique}. Rift : fossé d\'{effondrement} se localisant le long d\'une {fracture} de l\'écorce.',
    expl: 'Dorsale : chaîne de montagnes sous-marines où se forme la croûte océanique. Rift : fossé d\'effondrement se localisant le long d\'une fracture de l\'écorce.' },
  { type: 'calcul', q: 'Combien de volcans compte la Ceinture de Feu du Pacifique ?', reponse: 452, unite: 'volcans', tolerance: 0,
    expl: 'La Ceinture de Feu du Pacifique : 452 volcans, soit 75 % des volcans émergés de la planète.' },
  { type: 'ecrire', q: 'La Ceinture de Feu du Pacifique mesure environ combien de kilomètres ?', reponses: ['40 000 km', '40 000', '40000', '40000 km', '40.000', '40.000 km', 'environ 40 000 km', 'environ 40 000', 'quarante mille', 'quarante mille kilomètres', '40 000 kilomètres', 'environ 40 000 kilomètres', 'environ 40000 km', 'environ 40000 kilomètres', '40000 kilomètres', 'environ quarante mille kilomètres'],
    expl: 'Environ 40 000 km. Attention : 4 000 km, c\'est la longueur du Chili.' },
  { type: 'calcul', q: '75 % des volcans émergés de la planète sont dans la Ceinture de Feu du Pacifique. Quel pourcentage des volcans émergés se trouve ailleurs ?', reponse: 25, unite: '%', tolerance: 0,
    expl: '100 % − 75 % = 25 %. Trois volcans émergés sur quatre sont dans la Ceinture de Feu du Pacifique ; un sur quatre est ailleurs.' },
];

export const PRIO = {
  video: { id: 'lexique', titre: 'Le lexique : un dessin pour chaque mot', duree: 'à regarder avant tout le reste' },
  minutes: 8,
  prio: [
    ['Convergence et divergence', 'Convergence : rapprochement entre deux plaques. Divergence : éloignement entre deux plaques.'],
    ['Subduction et accrétion', 'Subduction : enfoncement d\'une plaque tectonique sous une autre plaque de densité plus faible. Accrétion : frontière de plaques où se crée une nouvelle croûte océanique.'],
    ['Dorsale, rift, faille', 'Dorsale : chaîne de montagnes sous-marines. Rift : fossé d\'effondrement. Faille : des blocs rocheux se sont déplacés l\'un par rapport à l\'autre.'],
    ['La Ceinture de Feu du Pacifique', 'Un alignement de volcans autour de l\'océan Pacifique : environ 40 000 km, 452 volcans, 75 % des volcans émergés.'],
    ['Pourquoi le Chili ?', 'Plaques de Nazca et sud-américaine. Ceinture de Feu du Pacifique : zone de subduction.'],
  ],
  prof: [
    ['Définis : subduction.', 'Processus d\'enfoncement d\'une plaque tectonique sous une autre plaque de densité plus faible.', 'Définition'],
    ['Définis : convergence et divergence.', 'Convergence : rapprochement entre deux plaques. Divergence : éloignement entre deux plaques.', 'Définitions'],
    ['Définis : accrétion.', 'Frontière de plaques le long de laquelle se crée une nouvelle croûte océanique. Les plaques s\'écartent l\'une de l\'autre à partir d\'une zone d\'accrétion.', 'Définition'],
    ['Définis : dorsale, rift et faille.', 'Dorsale : chaîne de montagnes sous-marines où se forme la croûte océanique. Rift : fossé d\'effondrement se localisant le long d\'une fracture de l\'écorce. Faille : déplacement de l\'écorce terrestre le long de laquelle des blocs rocheux se sont déplacés l\'un par rapport à l\'autre.', 'Définitions'],
    ['Qu\'est-ce que la Ceinture de Feu du Pacifique ?', 'Un alignement de volcans qui borde l\'océan Pacifique sur la majorité de son pourtour, soit environ 40 000 km (452 volcans, soit 75 % des volcans émergés de la planète, qu\'ils soient actifs ou éteints).', 'Définition avec des chiffres'],
    ['Pourquoi le Chili ? Nomme les plaques 1 et 2, et dis dans quelle zone il se trouve.', 'Le Chili est à la rencontre de la plaque de Nazca (1) et de la plaque sud-américaine (2). Il est dans la Ceinture de Feu du Pacifique : une zone de subduction (4).', 'Croquis et explication', { schema: 'lexique-chili' }],
  ],
};
