// Chapitre 1 : Le Chili et les plaques tectoniques. Source unique : cours/01-chili-et-plaques-tectoniques.md.
// Un fichier par chapitre : la leçon et les mots (CHAPITRE), les exercices (QUESTIONS), les priorités et questions de contrôle (PRIO).
// Formats : voir BRIEF-CHAPITRES.md à la racine du projet.

export const CHAPITRE = {
  id: 'plaques', theme: 3, titre: 'Le Chili et les plaques tectoniques',
  accroche: 'Pourquoi y a-t-il des volcans sur notre planète ? Tout commence sous nos pieds : la surface de la Terre bouge.',
  etoiles: 3,
  sims: [{ id: 'convection', titre: 'Le mouvement de convection', sous: 'Règle la chaleur et suis une goutte de magma' }],
  lecon: `
<div class="bloc essentiel">
<h2>L'idée en 20 secondes</h2>
<p>La surface de la Terre est divisée en grands morceaux appelés <mark>plaques tectoniques</mark> qui déplacent les
continents depuis des millions d'années.</p>
<p>Elles bougent à cause des forces qui arrivent du centre de la Terre : un <mark>magma</mark> chaud remonte, se refroidit,
redescend. Ce mouvement perpétuel se nomme le mouvement de <mark>convection</mark>.</p>
</div>

<div class="bloc">
<h2>D'abord : où se trouve le Chili ?</h2>
<p>Le Chili est un pays situé sur la côte <b>ouest</b> de l'Amérique du Sud. Il s'étire du nord au sud sur plus de
<b>4 000 kilomètres</b>, le long de l'océan <b>Pacifique</b>. À <b>l'est</b>, il est bordé par la
<mark>Cordillère des Andes</mark>, qui marque la frontière avec l'<b>Argentine</b>. Le Chili se trouve en grande partie dans
l'hémisphère <b>sud</b>.</p>
{{schema:chili}}
<p class="astuce">Les <b>repères spatiaux</b> de ce texte : un continent (l'Amérique du Sud), un océan (le Pacifique),
des points cardinaux (ouest, est, nord, sud), un hémisphère, un pays voisin (l'Argentine).</p>
</div>

<div class="bloc">
<h2>La dérive des continents</h2>
<p>Regarde le document 1 de ton cours : de <b>-250 000 000</b> à <b>aujourd'hui</b>, les continents ne sont pas restés à la
même place.</p>
{{schema:derive}}
<p><b>Ce qu'on observe :</b> la surface de la Terre est divisée en grands morceaux appelés
<mark>plaques tectoniques</mark> qui déplacent les continents depuis des millions d'années.</p>
</div>

<div class="bloc">
<h2>Les plaques ne bougent pas toutes de la même manière</h2>
<p>Le mouvement des plaques est <mark>aléatoire</mark>. Certaines <b>s'enfoncent</b>, d'autres <b>s'écartent</b>.</p>
{{schema:bloc-plaques}}
<p>Sur le schéma de ton cours, trois mots sont à écrire à la main : la <mark>croûte</mark> (la fine couche du dessus), le
<mark>manteau</mark> (la grande couche du dessous) et la <mark>cellule de convection</mark> (les boucles en pointillés).</p>
</div>

<div class="retiens">
<p>Les plaques <mark>tectoniques</mark> se trouvent à la surface de la Terre. Elles bougent à cause des forces qui arrivent
du centre de la Terre.</p>
<p>En effet, un <mark>magma</mark> chaud remonte des profondeurs de la planète tout en se dirigeant vers la surface. Le magma
perd ensuite des degrés et se refroidit. Il redescend alors vers le centre de la Terre.</p>
<p>Il faut savoir que ce mouvement est perpétuel et se nomme le mouvement de <mark>convection</mark> et ce mouvement fait
ainsi bouger les plaques tectoniques.</p>
</div>`,
  mots: [
    ['Plaques tectoniques', 'Les grands morceaux qui divisent la surface de la Terre. Elles déplacent les continents depuis des millions d\'années.'],
    ['Mouvement de convection', 'Le mouvement perpétuel du magma : chaud, il remonte des profondeurs ; il se refroidit, puis redescend vers le centre de la Terre. Il fait bouger les plaques tectoniques.'],
    ['Cellule de convection', 'Sur le schéma : la boucle (en pointillés) que fait le magma dans le manteau.'],
    ['Croûte', 'Sur le schéma : la fine couche du dessus, à la surface de la Terre.'],
    ['Manteau', 'Sur le schéma : la grande couche sous la croûte, là où tournent les cellules de convection.'],
    ['Cordillère des Andes', 'La chaîne de montagnes qui borde le Chili à l\'est et marque la frontière avec l\'Argentine.'],
  ],
};

export const QUESTIONS = [
  { type: 'trous', banque: true, prio: true, texte: 'Les plaques {tectoniques} se trouvent à la surface de la Terre. Elles bougent à cause des forces qui arrivent du centre de la Terre. En effet, un {magma} chaud remonte des profondeurs de la planète tout en se dirigeant vers la surface. Le magma perd ensuite des degrés et se refroidit. Il redescend alors vers le centre de la Terre. Il faut savoir que ce mouvement est perpétuel et se nomme le mouvement de {convection}.', leurres: ['subduction', 'continents'],
    expl: 'C\'est le texte à trous de ton cours (croix rouge). Les trois mots : tectoniques, magma, convection.' },
  { type: 'trous', prio: true, texte: 'La surface de la Terre est divisée en grands morceaux appelés plaques {tectoniques} qui déplacent les {continents} depuis des {millions} d\'années.',
    expl: 'C\'est ta réponse à la question a) : les plaques tectoniques déplacent les continents depuis des millions d\'années.' },
  { type: 'legende', prio: true, q: 'Légende le schéma du mouvement des plaques, comme dans ton cours.', schema: 'bloc-plaques',
    expl: 'Imprimés dans ton cours : zone de subduction, rift océanique, faille transformante, continent. À écrire à la main : croûte, manteau, cellule de convection.' },
  { type: 'ordre', prio: true, q: 'Remets le mouvement de convection dans l\'ordre.', etapes: ['Un magma chaud remonte des profondeurs de la planète, en se dirigeant vers la surface', 'Il perd des degrés et se refroidit', 'Il redescend vers le centre de la Terre'],
    expl: 'Chaud, le magma remonte ; près de la surface il se refroidit ; refroidi, il redescend. Puis ça recommence : le mouvement est perpétuel.' },
  { type: 'ecrire', prio: true, q: 'Comment se nomme le mouvement perpétuel du magma, qui fait bouger les plaques tectoniques ?', reponses: ['le mouvement de convection', 'mouvement de convection', 'la convection', 'convection'],
    expl: 'Ce mouvement est perpétuel et se nomme le mouvement de convection.' },
  { type: 'qcm', prio: true, q: 'Que remarques-tu à propos du mouvement des plaques tectoniques ?', choix: ['Il est aléatoire : certaines s\'enfoncent, d\'autres s\'écartent.', 'Elles se déplacent toutes dans le même sens.', 'Elles ne bougent plus depuis des millions d\'années.', 'Elles tournent toutes autour du Chili.'], bonne: 0,
    expl: 'Réponse de ton cours : « Le mouvement des plaques est aléatoire. Certaines s\'enfoncent, d\'autres s\'écartent. »' },
  { type: 'vf', q: 'Les plaques tectoniques se déplacent toutes de la même manière.', vrai: false,
    expl: 'Faux. Le mouvement des plaques est aléatoire : certaines s\'enfoncent, d\'autres s\'écartent.' },
  { type: 'qcm', prio: true, q: 'Pourquoi les plaques tectoniques bougent-elles ?', choix: ['À cause des forces qui arrivent du centre de la Terre.', 'À cause du vent qui souffle sur les océans.', 'À cause des vagues de l\'océan Pacifique.', 'À cause de la rotation de la Lune.'], bonne: 0,
    expl: 'Les plaques bougent à cause des forces qui arrivent du centre de la Terre : le magma chaud remonte, se refroidit, redescend.' },
  { type: 'vf', prio: true, q: 'Le mouvement de convection finit par s\'arrêter quand le magma s\'est refroidi.', vrai: false,
    expl: 'Faux. Ce mouvement est perpétuel : le magma refroidi redescend vers le centre de la Terre, et un magma chaud remonte à nouveau.' },
  { type: 'relier', q: 'Relie ce qui se passe à l\'endroit du schéma.', vis: 'bloc-plaques', paires: [['deux plaques s\'écartent', 'rift océanique'], ['une plaque s\'enfonce sous une autre', 'zone de subduction'], ['le magma tourne en boucle dans le manteau', 'cellule de convection']],
    expl: 'Au rift océanique (2), les flèches blanches s\'écartent. À la zone de subduction (1), une plaque plonge. Les boucles en pointillés (7) sont les cellules de convection.' },
  { type: 'qcm', q: 'Sur le schéma, dans quelle couche se trouvent les cellules de convection ?', vis: 'bloc-plaques', choix: ['dans le manteau', 'dans la croûte', 'dans le continent', 'dans l\'océan'], bonne: 0,
    expl: 'Les boucles en pointillés sont dessinées dans la grande couche du dessous : le manteau. La croûte, c\'est la fine couche du dessus.' },
  { type: 'ordre', q: 'Document 1, la dérive des continents : remets les dates dans l\'ordre, de la plus ancienne à la plus récente.', etapes: ['-250 000 000', '-200 000 000', '-150 000 000', '-100 000 000', '-50 000 000', 'Aujourd\'hui'],
    expl: 'Plus le nombre après le signe « moins » est grand, plus c\'est loin dans le passé : -250 000 000 est la date la plus ancienne.' },
  { type: 'qcm', q: 'Sur le document 1, que font les terres (en jaune) entre -250 000 000 et aujourd\'hui ?', vis: 'derive', choix: ['Elles s\'écartent peu à peu les unes des autres.', 'Elles restent exactement à la même place.', 'Elles se rapprochent pour ne former qu\'un seul bloc.', 'Elles disparaissent sous les océans.'], bonne: 0,
    expl: 'À -250 000 000, les terres sont regroupées. Ensuite elles s\'écartent : les plaques tectoniques déplacent les continents depuis des millions d\'années.' },
  { type: 'trous', banque: true, texte: 'Le Chili est un pays situé sur la côte {ouest} de l\'Amérique du Sud. Il s\'étire du nord au sud sur plus de 4 000 kilomètres, le long de l\'océan {Pacifique}. À l\'{est}, il est bordé par la {Cordillère des Andes}, qui marque la frontière avec l\'{Argentine}. Le Chili se trouve en grande partie dans l\'hémisphère {sud}.', leurres: ['Atlantique', 'nord'],
    expl: 'Dans ton cours, tu as barré « est » (côte), « Atlantique », « l\'ouest » (bordé par) et « nord » (hémisphère).' },
  { type: 'legende', q: 'Situe le Chili : légende le croquis.', schema: 'chili',
    expl: 'L\'océan Pacifique est à l\'ouest du Chili. À l\'est : la Cordillère des Andes, puis l\'Argentine.' },
  { type: 'calcul', q: 'Le Chili s\'étire du nord au sud sur plus de combien de kilomètres ?', reponse: 4000, unite: 'km', tolerance: 0,
    expl: 'Le Chili s\'étire du nord au sud sur plus de 4 000 kilomètres, le long de l\'océan Pacifique.' },
  { type: 'vf', q: 'Le Chili se trouve en grande partie dans l\'hémisphère nord.', vrai: false,
    expl: 'Faux. Le Chili se trouve en grande partie dans l\'hémisphère sud.' },
  { type: 'ecrire', q: 'Quelle chaîne de montagnes borde le Chili à l\'est et marque la frontière avec l\'Argentine ?', reponses: ['la Cordillère des Andes', 'Cordillère des Andes', 'les Andes', 'Andes'],
    expl: 'À l\'est, le Chili est bordé par la Cordillère des Andes, qui marque la frontière avec l\'Argentine.' },
];

export const PRIO = {
  video: { id: 'plaques', titre: 'Les plaques tectoniques et le mouvement de convection', duree: 'à regarder avant tout le reste' },
  minutes: 8,
  prio: [
    ['Les plaques tectoniques', 'La surface de la Terre est divisée en grands morceaux qui déplacent les continents depuis des millions d\'années.'],
    ['Le mouvement de convection', 'Un magma chaud remonte, perd des degrés, se refroidit, redescend. C\'est perpétuel, et ça fait bouger les plaques.'],
    ['Trois mots à placer sur le schéma', 'La croûte, le manteau, la cellule de convection.'],
    ['Le mouvement des plaques est aléatoire', 'Certaines s\'enfoncent, d\'autres s\'écartent.'],
  ],
  prof: [
    ['Qu\'observes-tu sur le document « La dérive des continents » ?', 'La surface de la Terre est divisée en grands morceaux appelés plaques tectoniques qui déplacent les continents depuis des millions d\'années.', 'Observation d\'un document', { schema: 'derive' }],
    ['Explique pourquoi les plaques tectoniques bougent.', 'Elles bougent à cause des forces qui arrivent du centre de la Terre. Un magma chaud remonte des profondeurs de la planète en se dirigeant vers la surface. Il perd ensuite des degrés et se refroidit, puis redescend vers le centre de la Terre. Ce mouvement perpétuel se nomme le mouvement de convection : il fait bouger les plaques tectoniques.', 'Explication'],
    ['Complète le schéma du mouvement des plaques.', 'Les trois mots écrits à la main dans ton cours sont : croûte (5), manteau (6) et cellule de convection (7).', 'Schéma à compléter', { schema: 'bloc-plaques' }],
    ['Les plaques se déplacent-elles toutes de la même manière ?', 'Non. Le mouvement des plaques est aléatoire. Certaines s\'enfoncent, d\'autres s\'écartent.', 'Question courte'],
    ['Décris la situation géographique du Chili à l\'aide des repères spatiaux.', 'Le Chili est situé sur la côte ouest de l\'Amérique du Sud. Il s\'étire du nord au sud sur plus de 4 000 kilomètres, le long de l\'océan Pacifique. À l\'est, il est bordé par la Cordillère des Andes, qui marque la frontière avec l\'Argentine. Il se trouve en grande partie dans l\'hémisphère sud.', 'Situation géographique', { schema: 'chili' }],
  ],
};
