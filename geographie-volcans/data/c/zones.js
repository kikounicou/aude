// Chapitre 4 : Les grandes zones de volcanisme. Source unique : cours/03-types-de-volcanisme.md, page 13 (planisphère 2.4)
// et « Retenons » (texte et grande coupe). Le tableau 2.3 (page 12) est au chapitre 3 : ici, seulement un rappel d'une phrase.
// Formats : voir BRIEF-CHAPITRES.md à la racine du projet.

const pastille = (c) => `<span style="display:inline-block;width:22px;height:14px;border-radius:3px;border:1.5px solid #1d1b2f;vertical-align:-2px;margin-right:6px;background:${c}"></span>`;

export const CHAPITRE = {
  id: 'zones', theme: 3, titre: 'Les grandes zones de volcanisme',
  accroche: 'Où sont les volcans sur la Terre ? Pas n\'importe où : sur une carte, ils dessinent quatre grandes zones.',
  etoiles: 3,
  sims: [{ id: 'zones-globe', titre: 'Les grandes zones de volcanisme sur le globe', sous: 'Allume une zone, puis déroule la Terre en planisphère' }],
  lecon: `
<div class="bloc essentiel">
<h2>L'idée en 20 secondes</h2>
<p>Sur le planisphère, les volcans (les points rouges) sont presque tous le long des <mark>limites de plaques</mark>. Ils
forment <b>quatre grandes zones de volcanisme</b> : la <mark>Ceinture de feu du Pacifique</mark> (CFP), le
<mark>Pourtour méditerranéen</mark> (PM), la <mark>Dorsale médio-Atlantique</mark> (DMA) et le <mark>Rift africain</mark> (RA).</p>
<p>Une carte s'accompagne de ses éléments <mark>TOLES</mark> : Titre, Orientation, Légende, Échelle, Source.</p>
<p>La surface de la Terre est divisée en <b>14 plaques tectoniques</b>. Leurs limites : les zones de <mark>subduction</mark>
et d'<mark>accrétion</mark>. Au milieu des plaques : les volcans de <mark>points chauds</mark>.</p>
</div>

<div class="bloc">
<h2>Le planisphère : les grandes zones de volcanisme</h2>
<p>La carte de l'exercice 2.4 est <b>centrée sur l'océan Pacifique</b> : l'Asie et l'Australie à gauche, les Amériques au
milieu, l'Afrique et l'Europe à droite. Chaque zone a sa couleur dans la légende.</p>
{{schema:zones-planisphere}}
<table class="tab">
<tr><th>Couleur</th><th>Zone de volcanisme</th><th>Où ?</th></tr>
<tr><td>${pastille('#ff7fb2')}rose</td><td><b>Ceinture de feu du Pacifique (CFP)</b></td><td>le pourtour de l'océan Pacifique, sur la majorité de sa longueur : la côte ouest des Amériques, puis le Japon, l'Indonésie, jusqu'à la Nouvelle-Zélande</td></tr>
<tr><td>${pastille('#b57be6')}violet</td><td><b>Pourtour méditerranéen (PM)</b></td><td>autour de la mer Méditerranée</td></tr>
<tr><td>${pastille('#f79a6a')}orange</td><td><b>Dorsale médio-Atlantique (DMA)</b></td><td>la longue ligne au milieu de l'océan Atlantique, du nord au sud</td></tr>
<tr><td>${pastille('#fde21c')}jaune</td><td><b>Rift africain (RA)</b></td><td>à l'est de l'Afrique</td></tr>
</table>
<p>La légende imprimée explique aussi les petits signes : la flèche = <b>mouvement des plaques</b>, le trait =
<b>limite de plaques</b>, le point = <b>volcans</b>.</p>
<p class="astuce">Rappel du tableau 2.3 : <b>PM + CFP</b> = volcanisme de subduction ; <b>DMA + RA</b> = volcanisme d'accrétion.</p>
</div>

<div class="deux">
<div class="bloc">
<h2>Les océans</h2>
<p>Sur la carte, les océans sont écrits en abréviation :</p>
<ul>
<li><b>OP</b> = océan Pacifique</li>
<li><b>OA</b> = océan Atlantique</li>
<li><b>OI</b> = océan Indien, écrit <b>deux fois</b> : à gauche et à droite de la carte</li>
<li><b>OGA</b> = océan Glacial Arctique, en haut</li>
</ul>
<p class="astuce">Pourquoi deux fois l'océan Indien ? La carte est centrée sur le Pacifique : elle coupe l'océan Indien en
deux, un morceau à chaque bord.</p>
</div>
<div class="bloc">
<h2>TOLES</h2>
<p>La consigne dit : « complète les éléments manquants (TOLES) ». Ce sont les cinq éléments qui accompagnent une carte :</p>
<table class="tab">
<tr><th></th><th>Élément</th><th>Sur la carte 2.4</th></tr>
<tr><td><b>T</b></td><td>Titre</td><td>✓ « Les grandes zones de volcanisme »</td></tr>
<tr><td><b>O</b></td><td>Orientation</td><td>✓ la rose des vents : N, E, S, O</td></tr>
<tr><td><b>L</b></td><td>Légende</td><td>✓ les couleurs des quatre zones</td></tr>
<tr><td><b>E</b></td><td>Échelle</td><td>✕ pas écrite</td></tr>
<tr><td><b>S</b></td><td>Source</td><td>✕ pas écrite</td></tr>
</table>
</div>
</div>

<div class="retiens">
<p>Les volcans peuvent être classés en <mark>quatre catégories</mark> d'après leur emplacement : <b>dorsale océanique, rift
continental, fosse océanique, chaîne de volcans.</b></p>
<p>La surface de la <b>Terre</b> est <b>divisée</b> en <mark>14 plaques tectoniques</mark>, rigides, en mouvement les unes
par rapport aux autres. Les limites de plaques sont des <b>zones</b> de moindre résistance qui se <b>fracturent, s'écartent
ou rentrent en collision</b> sous l'effet des mouvements du <b>manteau terrestre</b>. On les appelle les
<mark>zones de subduction</mark> et <mark>zones d'accrétion</mark>.</p>
<p>Certains volcans se forment au milieu des plaques. On les appelle les volcans de <mark>points chauds</mark>.</p>
<p>Les mouvements de convection sont similaires aux rouleaux qui apparaissent dans une casserole d'eau sur le feu, sauf
qu'ils s'effectuent à raison de <b>quelques centimètres par an</b>.</p>
</div>

<div class="bloc">
<h2>La grande coupe du « Retenons »</h2>
<p>En haut du schéma, de gauche à droite, quatre emplacements : la <mark>fosse océanique</mark>, la
<mark>dorsale océanique</mark>, la <mark>cordillère volcanique</mark> (une chaîne de volcans) et le
<mark>rift continental</mark>.</p>
{{schema:zones-coupe}}
<p>Deux couches : la <mark>lithosphère</mark> (la croûte), dessus, et l'<mark>asthénosphère</mark> (le manteau), dessous,
où tourne la <b>convection</b>. Écrits sur le schéma : <b>72 %</b> sur l'océan et <b>28 %</b> sur le continent.</p>
<h3>Les cinq cases du bas : quel volcan ?</h3>
{{schema:zones-cases}}
<table class="tab">
<tr><th>Où est le volcan ?</th><th>Dans la case</th></tr>
<tr><td>1. à la fosse océanique</td><td><b>V. de subduction</b></td></tr>
<tr><td>2. sur l'île au milieu de l'océan</td><td><b>V. de point chaud</b></td></tr>
<tr><td>3. à la dorsale océanique</td><td><b>V. d'accrétion</b></td></tr>
<tr><td>4. sur la cordillère volcanique</td><td><b>V. de subduction</b></td></tr>
<tr><td>5. au rift continental</td><td><b>V. d'accrétion</b></td></tr>
</table>
<p class="astuce">Le truc : là où une plaque <b>plonge</b> (fosse, cordillère) → subduction. Là où les plaques
<b>s'écartent</b> (dorsale, rift) → accrétion. <b>Au milieu</b> d'une plaque (l'île) → point chaud.</p>
</div>

<div class="bloc">
<h2>Le piège : trois types, quatre catégories</h2>
<p>Les deux formulations sont dans ton cours, ne les mélange pas :</p>
<ul>
<li><b>Trois types de volcanisme</b> (tableau 2.3) : subduction, accrétion, point chaud.</li>
<li><b>Quatre catégories d'après l'emplacement</b> (« Retenons ») : dorsale océanique, rift continental, fosse océanique,
chaîne de volcans.</li>
</ul>
</div>`,
  mots: [
    ['Ceinture de feu du Pacifique', 'CFP, en rose sur la carte : elle borde l\'océan Pacifique sur la majorité de son pourtour.'],
    ['Pourtour méditerranéen', 'PM, en violet sur la carte : autour de la mer Méditerranée.'],
    ['Dorsale médio-Atlantique', 'DMA, en orange sur la carte : la longue ligne au milieu de l\'océan Atlantique, du nord au sud.'],
    ['Rift africain', 'RA, en jaune sur la carte : à l\'est de l\'Afrique.'],
    ['TOLES', 'Ce qui accompagne une carte : Titre, Orientation, Légende, Échelle, Source.'],
    ['Les 14 plaques tectoniques', 'Les morceaux qui divisent la surface de la Terre : rigides, en mouvement les uns par rapport aux autres.'],
    ['Zones de subduction et d\'accrétion', 'Les limites de plaques : des zones de moindre résistance qui se fracturent, s\'écartent ou rentrent en collision.'],
    ['Volcans de points chauds', 'Des volcans qui se forment au milieu des plaques.'],
    ['Quatre catégories de volcans', 'D\'après leur emplacement : dorsale océanique, rift continental, fosse océanique, chaîne de volcans.'],
    ['Lithosphère', 'Sur la grande coupe : la couche du dessus (la croûte).'],
    ['Asthénosphère', 'Sur la grande coupe : la couche du dessous (le manteau).'],
    ['Mouvements de convection', 'Similaires aux rouleaux dans une casserole d\'eau sur le feu, mais à raison de quelques centimètres par an.'],
  ],
};

export const QUESTIONS = [
  { type: 'legende', prio: true, q: 'Légende le planisphère : les quatre grandes zones de volcanisme.', schema: 'zones-planisphere',
    expl: 'Rose (1) : la Ceinture de feu du Pacifique (CFP), sur le pourtour de l\'océan Pacifique. Violet (2) : le Pourtour méditerranéen (PM). Orange (3) : la Dorsale médio-Atlantique (DMA), au milieu de l\'océan Atlantique. Jaune (4) : le Rift africain (RA), à l\'est de l\'Afrique.' },
  { type: 'relier', prio: true, q: 'Relie chaque abréviation de la légende à son nom complet.', paires: [['CFP', 'Ceinture de feu du Pacifique'], ['PM', 'Pourtour méditerranéen'], ['DMA', 'Dorsale médio-Atlantique'], ['RA', 'Rift africain']],
    expl: 'CFP = Ceinture de feu du Pacifique ; PM = Pourtour méditerranéen ; DMA = Dorsale médio-Atlantique ; RA = Rift africain.' },
  { type: 'trous', banque: true, prio: true, q: 'Complète le « Retenons ».', texte: 'Les volcans peuvent être classés en {quatre} catégories d\'après leur emplacement : dorsale océanique, rift continental, fosse océanique, chaîne de volcans. La surface de la Terre est divisée en {14} plaques tectoniques, rigides, en mouvement les unes par rapport aux autres. Les limites de plaques sont des zones de moindre résistance qui se fracturent, s\'écartent ou rentrent en collision sous l\'effet des mouvements du manteau terrestre. On les appelle les zones de {subduction} et zones d\'{accrétion}. Certains volcans se forment au milieu des plaques. On les appelle les volcans de {points chauds}.', leurres: ['convection', 'trois'],
    expl: 'Le « Retenons » : quatre catégories, 14 plaques tectoniques, zones de subduction et zones d\'accrétion, volcans de points chauds.' },
  { type: 'legende', prio: true, q: 'Complète les cinq cases sous la grande coupe : quel type de volcan ?', schema: 'zones-cases',
    expl: 'De gauche à droite : à la fosse océanique, V. de subduction ; sur l\'île au milieu de l\'océan, V. de point chaud ; à la dorsale océanique, V. d\'accrétion ; sur la cordillère volcanique, V. de subduction ; au rift continental, V. d\'accrétion.' },
  { type: 'legende', prio: true, q: 'Légende la grande coupe : les quatre emplacements et les deux couches.', schema: 'zones-coupe',
    expl: 'En haut, de gauche à droite : fosse océanique, dorsale océanique, cordillère volcanique (chaîne de volcans), rift continental. Les couches : la lithosphère (la croûte) dessus, l\'asthénosphère (le manteau) dessous.' },
  { type: 'legende', prio: true, q: 'Légende les océans du planisphère.', schema: 'zones-oceans',
    expl: 'OP = océan Pacifique, au centre de la carte. OA = océan Atlantique. OI = océan Indien, deux fois : à gauche et à droite. OGA = océan Glacial Arctique, en haut.' },
  { type: 'trous', prio: true, q: 'Que veut dire TOLES ? Écris les cinq mots.', texte: 'T = {Titre}, O = {Orientation}, L = {Légende}, E = {Échelle}, S = {Source}',
    expl: 'TOLES = Titre, Orientation, Légende, Échelle, Source : les éléments qui accompagnent une carte.' },
  { type: 'qcm', prio: true, q: 'Où se trouve la Ceinture de feu du Pacifique (CFP) ?', vis: 'zones-planisphere', choix: ['Sur le pourtour de l\'océan Pacifique', 'Au milieu de l\'océan Atlantique, du nord au sud', 'Autour de la mer Méditerranée', 'À l\'est de l\'Afrique'], bonne: 0,
    expl: 'La CFP (en rose, n° 1) borde l\'océan Pacifique sur la majorité de son pourtour : la côte ouest des Amériques, puis le Japon, l\'Indonésie, jusqu\'à la Nouvelle-Zélande.' },
  { type: 'classer', prio: true, q: 'Sur la carte, chaque abréviation est une zone de volcanisme ou un océan. Classe-les.', categories: ['zone de volcanisme', 'océan'], items: [{ t: 'CFP', c: 0 }, { t: 'PM', c: 0 }, { t: 'DMA', c: 0 }, { t: 'RA', c: 0 }, { t: 'OP', c: 1 }, { t: 'OA', c: 1 }, { t: 'OI', c: 1 }, { t: 'OGA', c: 1 }],
    expl: 'Les zones : CFP, PM, DMA, RA (les couleurs de la légende). Les océans : OP (Pacifique), OA (Atlantique), OI (Indien), OGA (Glacial Arctique).' },
  { type: 'classer', prio: true, q: 'Sur la grande coupe, quel type de volcan trouve-t-on à chaque endroit ?', vis: 'zones-cases', categories: ['volcan de subduction', 'volcan d\'accrétion', 'volcan de point chaud'], items: [{ t: 'à la fosse océanique', c: 0 }, { t: 'sur la cordillère volcanique', c: 0 }, { t: 'à la dorsale océanique', c: 1 }, { t: 'au rift continental', c: 1 }, { t: 'sur l\'île au milieu de l\'océan', c: 2 }],
    expl: 'Une plaque plonge (fosse océanique, cordillère volcanique) : subduction. Les plaques s\'écartent (dorsale océanique, rift continental) : accrétion. Au milieu d\'une plaque (l\'île) : point chaud.' },
  { type: 'ecrire', q: 'Comment appelle-t-on les volcans qui se forment au milieu des plaques ?', reponses: ['les volcans de points chauds', 'volcans de points chauds', 'des volcans de points chauds', 'volcans de point chaud', 'volcan de point chaud', 'de points chauds', 'points chauds', 'point chaud', 'les points chauds'],
    expl: '« Certains volcans se forment au milieu des plaques. On les appelle les volcans de points chauds. »' },
  { type: 'qcm', q: 'Les limites de plaques sont des zones de moindre résistance. Que font-elles sous l\'effet des mouvements du manteau terrestre ?', choix: ['Elles se fracturent, s\'écartent ou rentrent en collision.', 'Elles fondent et disparaissent.', 'Elles restent toujours immobiles.', 'Elles se transforment en océans.'], bonne: 0,
    expl: 'Les limites de plaques sont des zones de moindre résistance qui se fracturent, s\'écartent ou rentrent en collision sous l\'effet des mouvements du manteau terrestre.' },
  { type: 'vf', q: 'Les plaques tectoniques sont rigides et immobiles.', vrai: false,
    expl: 'Faux. Les 14 plaques tectoniques sont rigides, mais en mouvement les unes par rapport aux autres.' },
  { type: 'qcm', q: 'À quoi les mouvements de convection sont-ils similaires ?', choix: ['Aux rouleaux qui apparaissent dans une casserole d\'eau sur le feu', 'Aux vagues de la mer pendant une tempête', 'Au vent qui souffle sur un volcan', 'À une balle qui rebondit'], bonne: 0,
    expl: 'Les mouvements de convection sont similaires aux rouleaux qui apparaissent dans une casserole d\'eau sur le feu, sauf qu\'ils s\'effectuent à raison de quelques centimètres par an.' },
  { type: 'vf', q: 'Les mouvements de convection s\'effectuent à raison de quelques mètres par jour.', vrai: false,
    expl: 'Faux. Ils s\'effectuent à raison de quelques centimètres par an : beaucoup plus lentement que dans la casserole.' },
  { type: 'legende', q: 'TOLES : sur la carte, montre le titre, l\'orientation et la légende.', schema: 'zones-toles', leurres: ['l\'échelle', 'la source'],
    expl: 'Le titre est écrit en haut, la rose des vents donne l\'orientation (N, E, S, O), la légende explique les couleurs. L\'échelle et la source ne sont pas écrites sur cette carte.' },
  { type: 'vf', q: 'Sur le planisphère, l\'océan Indien (OI) est écrit deux fois.', vrai: true, vis: 'zones-oceans',
    expl: 'Vrai. Sur ta carte, OI est écrit deux fois : à gauche et à droite.' },
  { type: 'ordre', q: 'Les quatre emplacements écrits en haut de la grande coupe : remets-les dans l\'ordre, de gauche à droite.', vis: 'zones-coupe', etapes: ['Fosse océanique', 'Dorsale océanique', 'Cordillère volcanique (chaîne de volcans)', 'Rift continental'],
    expl: 'De gauche à droite : la fosse océanique (1), la dorsale océanique (2), la cordillère volcanique (3), le rift continental (4).' },
  { type: 'qcm', q: 'Sur la grande coupe, comment s\'appelle la couche du dessus, la croûte ?', vis: 'zones-coupe', choix: ['la lithosphère', 'l\'asthénosphère', 'la dorsale', 'la cordillère'], bonne: 0,
    expl: 'La lithosphère (5), c\'est la croûte, dessus. L\'asthénosphère (6), c\'est le manteau, dessous.' },
  { type: 'calcul', q: 'Sur la grande coupe, 72 % est écrit sur l\'océan. Quel pourcentage est écrit sur le continent ?', reponse: 28, unite: '%', tolerance: 0,
    expl: 'Sur ta coupe : 72 % est écrit sur l\'océan, 28 % sur le continent.' },
  { type: 'qcm', q: 'Laquelle de ces réponses n\'est PAS une des quatre catégories d\'emplacement du « Retenons » ?', choix: ['volcan de point chaud', 'dorsale océanique', 'rift continental', 'fosse océanique'], bonne: 0,
    expl: 'Les quatre catégories d\'après l\'emplacement : dorsale océanique, rift continental, fosse océanique, chaîne de volcans. Le point chaud, c\'est un type de volcan : il se forme au milieu des plaques.' },
];

export const PRIO = {
  video: { id: 'zones', titre: 'Les grandes zones de volcanisme', duree: 'à regarder avant tout le reste' },
  minutes: 10,
  prio: [
    ['Les quatre grandes zones de volcanisme', 'Les placer sur le planisphère, avec leur couleur et leur nom complet : CFP, PM, DMA, RA.'],
    ['Les océans', 'OP, OA, OI (deux fois), OGA.'],
    ['TOLES', 'Titre, Orientation, Légende, Échelle, Source.'],
    ['Le « Retenons »', 'Quatre catégories d\'après l\'emplacement, 14 plaques tectoniques, zones de subduction et d\'accrétion, volcans de points chauds.'],
    ['Les cinq cases de la grande coupe', 'V. de subduction, V. de point chaud, V. d\'accrétion, V. de subduction, V. d\'accrétion.'],
  ],
  prof: [
    ['Replace les zones volcaniques sur le planisphère et complète la légende.', 'Rose : Ceinture de feu du Pacifique (CFP). Violet : Pourtour méditerranéen (PM). Orange : Dorsale médio-Atlantique (DMA). Jaune : Rift africain (RA).', 'Carte à compléter', { schema: 'zones-planisphere' }],
    ['Écris le nom des océans sur le planisphère.', 'OP = océan Pacifique ; OA = océan Atlantique ; OI = océan Indien (à gauche et à droite) ; OGA = océan Glacial Arctique.', 'Carte à compléter', { schema: 'zones-oceans' }],
    ['Complète les éléments manquants de la carte (TOLES).', 'Titre : « Les grandes zones de volcanisme ». Orientation : la rose des vents (N, E, S, O). Légende : les couleurs des quatre zones. TOLES = Titre, Orientation, Légende, Échelle, Source.', 'Carte à compléter', { schema: 'zones-toles' }],
    ['Complète : « On les appelle les zones de s… et zones d’a… . Certains volcans se forment au milieu des plaques. On les appelle les volcans de p… . »', 'Les zones de subduction et zones d’accrétion. Les volcans de points chauds.', 'Texte à trous'],
    ['Complète les cinq cases sous la grande coupe.', 'De gauche à droite : V. de subduction, V. de point chaud, V. d’accrétion, V. de subduction, V. d’accrétion.', 'Schéma à compléter', { schema: 'zones-cases' }],
    ['En combien de catégories peut-on classer les volcans d’après leur emplacement ? Lesquelles ?', 'En quatre catégories : dorsale océanique, rift continental, fosse océanique, chaîne de volcans.', 'Question courte'],
  ],
};
