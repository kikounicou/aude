// Chapitre 6 : la coupe d'un volcan ; volcan explosif et volcan effusif. Source unique : cours/05-coupe-et-types-de-volcans.md.
// Un fichier par chapitre : la leçon et les mots (CHAPITRE), les exercices (QUESTIONS), les priorités et questions de contrôle (PRIO).
// Formats : voir BRIEF-CHAPITRES.md à la racine du projet.

export const CHAPITRE = {
  id: 'volcan', theme: 3, titre: 'La coupe d\'un volcan ; volcan explosif et volcan effusif',
  accroche: 'Qu\'y a-t-il à l\'intérieur d\'un volcan ? Coupe-le en deux, nomme chaque partie, puis compare les deux types de volcans.',
  etoiles: 3,
  sims: [{ id: 'volcan-eruption', titre: 'Volcan explosif ou volcan effusif', sous: 'Choisis le type d\'éruption et regarde la différence' }],
  lecon: `
<div class="bloc essentiel">
<h2>L'idée en 20 secondes</h2>
<p>Coupé en deux, un volcan montre son intérieur : tout en bas, la <mark>chambre magmatique</mark> ; au centre, la
<mark>cheminée volcanique</mark>, par où monte le <mark>magma</mark> ; au sommet, le <mark>cratère</mark>.</p>
<p>Il existe deux types de volcans : le <mark>volcan explosif</mark> (gris) et le <mark>volcan effusif</mark> (rouge).</p>
</div>

<div class="bloc">
<h2>La coupe schématique d'un volcan</h2>
<p>Dix étiquettes à savoir placer : cinq à gauche, cinq à droite, comme sur ta feuille.</p>
{{schema:volcan-coupe}}
<div class="deux" style="margin-top:14px">
<div><p><b>À gauche, de haut en bas :</b> le <mark>cratère</mark>, le <mark>cône secondaire</mark>, la
<mark>cheminée secondaire</mark>, la <mark>coulée de lave</mark>, la <mark>chambre magmatique</mark>.</p></div>
<div><p><b>À droite, de haut en bas :</b> la <mark>nuée ardente</mark>, les <mark>projections volcaniques</mark>, le
<mark>cône volcanique</mark>, la <mark>cheminée volcanique</mark>, le <mark>magma</mark>.</p></div>
</div>
</div>

<div class="bloc">
<h2>Attention : trois mots qui se mélangent facilement</h2>
<p>Sur ce schéma, deux confusions sont fréquentes : le <b>cône</b> et la <b>cheminée</b>, puis la <b>cheminée</b> et le
<b>magma</b>. Pour ne pas te tromper :</p>
<table class="tab">
<tr><th>Le mot</th><th>Ce qu'il montre sur la coupe</th></tr>
<tr><td><mark>le cône volcanique</mark></td><td>la montagne elle-même, ses flancs (n° 8)</td></tr>
<tr><td><mark>la cheminée volcanique</mark></td><td>le conduit vertical, au centre du volcan (n° 9)</td></tr>
<tr><td><mark>le magma</mark></td><td>ce qui monte dans le conduit, en bas, juste au-dessus de la chambre (n° 10)</td></tr>
<tr><td><mark>la chambre magmatique</mark></td><td>la poche tout en bas, sous le volcan (n° 5)</td></tr>
</table>
<p class="astuce">Le <b>cône</b>, c'est la forme de la montagne. La <b>cheminée</b>, c'est un tuyau. Le <b>magma</b>, c'est ce qui
passe dans le tuyau. Et le cône <b>secondaire</b> et la cheminée <b>secondaire</b> sont les « petits » : sur le côté.</p>
</div>

<div class="bloc">
<h2>Deux types de volcans</h2>
<p>Ton cours compare le <mark>volcan explosif</mark> et le <mark>volcan effusif</mark> dans un tableau. C'est ce tableau
qu'il faut savoir compléter.</p>
<table class="tab">
<tr><th></th><th>Volcan explosif</th><th>Volcan effusif</th></tr>
<tr><th>Couleur associée au volcan</th><td><mark>gris</mark></td><td><mark>rouge</mark></td></tr>
<tr><th>Produits rejetés durant l'éruption</th><td>des cendres, du gaz, des nuées ardentes, des projections (pyroclastiques), lahar</td><td>une lave liquide</td></tr>
<tr><th>État du magma</th><td>il est <mark>très visqueux</mark>, épais</td><td>il est <mark>fluide</mark></td></tr>
<tr><th>Conséquences de l'éruption sur le paysage et/ou les habitants</th><td>dangereux pour les habitants et le paysage, grande explosion : <b>DANGER DE MORT</b></td><td>peut faire des dégâts mais ne cause en général pas de victime : les habitants sont évacués</td></tr>
<tr><th>Localisation</th><td><mark>entre les plaques</mark> : à l'intersection des plaques → subduction</td><td><mark>au milieu d'une plaque</mark></td></tr>
</table>
{{schema:volcan-types}}
<p class="astuce" style="border:2px solid var(--chaud)"><b>Vérifie bien dans ta farde</b> la ligne « Localisation » du tableau (volcan explosif :
entre les plaques ; volcan effusif : au milieu d'une plaque) : elle est recopiée d'après une photo de ta feuille, et il n'est
pas sûr qu'elle soit exacte. Si ta feuille dit autre chose, <b>c'est ta feuille qui a raison</b>.</p>
<p style="font-size:14px;color:var(--encre2)">Ton cours cite le mot <i>lahar</i> sans l'expliquer : retiens-le tel quel, dans les produits du volcan explosif.
Les documents A et B de ton cours (et la vidéo) décrivent ces deux types
de volcans : ils ne sont pas repris ici, relis-les dans ta farde.</p>
</div>

<div class="retiens">
<p><b>Volcan explosif</b> : <mark>gris</mark> — des cendres, du gaz, des nuées ardentes, des projections, lahar — magma
<mark>très visqueux, épais</mark> — dangereux pour les habitants et le paysage, grande explosion, danger de mort — entre les
plaques (subduction).</p>
<p><b>Volcan effusif</b> : <mark>rouge</mark> — une lave liquide — magma <mark>fluide</mark> — peut faire des dégâts mais ne
cause en général pas de victime, les habitants sont évacués — au milieu d'une plaque.</p>
</div>`,
  mots: [
    ['Chambre magmatique', 'Sur la coupe : la poche de magma, tout en bas, sous le volcan.'],
    ['Cheminée volcanique', 'Sur la coupe : le conduit vertical au centre du volcan, par où monte le magma.'],
    ['Magma', 'Sur la coupe : ce qui monte dans la cheminée, juste au-dessus de la chambre magmatique.'],
    ['Cratère', 'Sur la coupe : l\'ouverture au sommet du volcan.'],
    ['Cône volcanique', 'Sur la coupe : la montagne elle-même, les flancs du volcan.'],
    ['Cône secondaire', 'Sur la coupe : le petit cône sur le flanc du volcan.'],
    ['Cheminée secondaire', 'Sur la coupe : le conduit plus fin qui part sur le côté, vers le cône secondaire.'],
    ['Coulée de lave', 'Sur la coupe : la lave qui descend sur le flanc du volcan.'],
    ['Projections volcaniques', 'Sur la coupe : les morceaux projetés au-dessus du cratère.'],
    ['Nuée ardente', 'Sur la coupe : le gros nuage gris au-dessus du volcan.'],
    ['Volcan explosif', 'Couleur : gris. Magma très visqueux, épais. Grande explosion : danger de mort. Entre les plaques (subduction).'],
    ['Volcan effusif', 'Couleur : rouge. Magma fluide : une lave liquide. En général pas de victime. Au milieu d\'une plaque.'],
  ],
};

const PIEGE = 'Attention au piège : la cheminée volcanique (9), c\'est le conduit ; le magma (10), c\'est ce qui monte dedans ; le cône volcanique (8), c\'est la montagne.';

export const QUESTIONS = [
  { type: 'legende', prio: true, q: 'Légende la coupe schématique d\'un volcan, comme sur ta feuille.', schema: 'volcan-coupe',
    expl: 'À gauche, de haut en bas : le cratère, le cône secondaire, la cheminée secondaire, la coulée de lave, la chambre magmatique. À droite : la nuée ardente, les projections volcaniques, le cône volcanique, la cheminée volcanique, le magma. ' + PIEGE },
  { type: 'classer', prio: true, q: 'Volcan explosif ou volcan effusif ? Range chaque caractéristique (couleur, produits rejetés, état du magma).', categories: ['Volcan explosif', 'Volcan effusif'],
    items: [{ t: 'gris', c: 0 }, { t: 'rouge', c: 1 }, { t: 'des cendres', c: 0 }, { t: 'du gaz', c: 0 }, { t: 'des nuées ardentes', c: 0 }, { t: 'des projections', c: 0 }, { t: 'lahar', c: 0 }, { t: 'une lave liquide', c: 1 }, { t: 'magma très visqueux, épais', c: 0 }, { t: 'magma fluide', c: 1 }],
    expl: 'Volcan explosif : gris ; des cendres, du gaz, des nuées ardentes, des projections, lahar ; magma très visqueux, épais. Volcan effusif : rouge ; une lave liquide ; magma fluide.' },
  { type: 'classer', prio: true, q: 'Volcan explosif ou volcan effusif ? Range les conséquences et la localisation.', categories: ['Volcan explosif', 'Volcan effusif'],
    items: [{ t: 'grande explosion', c: 0 }, { t: 'danger de mort', c: 0 }, { t: 'dangereux pour les habitants et le paysage', c: 0 }, { t: 'peut faire des dégâts mais ne cause en général pas de victime', c: 1 }, { t: 'les habitants sont évacués', c: 1 }, { t: 'entre les plaques (subduction)', c: 0 }, { t: 'au milieu d\'une plaque', c: 1 }],
    expl: 'Explosif : dangereux pour les habitants et le paysage, grande explosion, danger de mort ; entre les plaques, à l\'intersection des plaques (subduction). Effusif : peut faire des dégâts mais ne cause en général pas de victime, les habitants sont évacués ; au milieu d\'une plaque.' },
  { type: 'relier', prio: true, q: 'Le piège de la coupe : relie chaque description au bon mot.', vis: 'volcan-coupe',
    paires: [['le conduit vertical, au centre du volcan', 'la cheminée volcanique'], ['la montagne elle-même, ses flancs', 'le cône volcanique'], ['ce qui monte dans le conduit', 'le magma'], ['la poche tout en bas, sous le volcan', 'la chambre magmatique']],
    expl: PIEGE + ' La chambre magmatique (5), c\'est la poche tout en bas.' },
  { type: 'qcm', prio: true, q: 'Sur la coupe, que montre le numéro 9 ?', vis: 'volcan-coupe', choix: ['la cheminée volcanique', 'le cône volcanique', 'le magma', 'la cheminée secondaire'], bonne: 0,
    expl: 'Le numéro 9, c\'est le conduit : la cheminée volcanique. Le cône volcanique (8), c\'est la montagne ; le magma (10), c\'est ce qui monte dedans. La cheminée secondaire (3) est le conduit plus fin, sur le côté.' },
  { type: 'qcm', prio: true, q: 'Sur la coupe, que montre le numéro 10 ?', vis: 'volcan-coupe', choix: ['le magma', 'la cheminée volcanique', 'la chambre magmatique', 'le cratère'], bonne: 0,
    expl: 'Le numéro 10, c\'est le magma : ce qui monte dans la cheminée volcanique. La chambre magmatique (5), c\'est la poche tout en bas ; le cratère (1), l\'ouverture au sommet.' },
  { type: 'trous', banque: true, prio: true, texte: 'Le volcan explosif est associé à la couleur {gris}. Son magma est très {visqueux}, épais. Le volcan effusif est associé à la couleur {rouge}. Son magma est {fluide} : il rejette une lave {liquide}.', leurres: ['bleu', 'solide'],
    expl: 'Dans ton tableau : volcan explosif, gris, magma très visqueux, épais ; volcan effusif, rouge, magma fluide, une lave liquide.' },
  { type: 'vf', prio: true, q: 'Le magma d\'un volcan effusif est très visqueux, épais.', vrai: false,
    expl: 'Faux. Le magma du volcan effusif est fluide. C\'est celui du volcan explosif qui est très visqueux, épais.' },
  { type: 'qcm', prio: true, q: 'Quel type de volcan est dangereux pour les habitants et le paysage, avec un danger de mort ?', choix: ['le volcan explosif', 'le volcan effusif', 'les deux de la même manière', 'aucun des deux'], bonne: 0,
    expl: 'Le volcan explosif : dangereux pour les habitants et le paysage, grande explosion, danger de mort. Le volcan effusif peut faire des dégâts mais ne cause en général pas de victime : les habitants sont évacués.' },
  { type: 'ecrire', prio: true, q: 'Quel type de volcan rejette une lave liquide ?', reponses: ['le volcan effusif', 'volcan effusif', 'effusif', 'un volcan effusif', 'effusive', 'volcan effusive'],
    expl: 'Le volcan effusif (rouge) : son magma est fluide, il rejette une lave liquide.' },
  { type: 'trous', prio: true, texte: 'Le volcan explosif rejette des {cendres|cendre}, du {gaz}, des nuées {ardentes|ardente}, des {projections|projection|projections volcaniques|projection volcanique|projections pyroclastiques|projections pyroplastiques}.',
    expl: 'Produits rejetés par le volcan explosif : des cendres, du gaz, des nuées ardentes, des projections (projections pyroclastiques). Le volcan effusif, lui, rejette une lave liquide.' },
  { type: 'ecrire', prio: true, q: 'Comment s\'appelle la poche tout en bas de la coupe, sous le volcan (numéro 5) ?', vis: 'volcan-coupe', reponses: ['la chambre magmatique', 'chambre magmatique'],
    expl: 'C\'est la chambre magmatique (5). Le magma (10) monte de là par la cheminée volcanique (9).' },
  { type: 'ordre', q: 'Sur la coupe, remets ces éléments dans l\'ordre, du plus bas au plus haut.', vis: 'volcan-coupe', etapes: ['la chambre magmatique', 'la cheminée volcanique', 'le cratère', 'les projections volcaniques', 'la nuée ardente'],
    expl: 'Tout en bas, la chambre magmatique (5) ; juste au-dessus, le magma (10) ; puis le conduit, la cheminée volcanique (9) ; au sommet, le cratère (1) ; au-dessus, les projections volcaniques (7) ; tout en haut, la nuée ardente (6).' },
  { type: 'legende', q: 'Légende le dessin : quel volcan est explosif, lequel est effusif, et où se trouvent-ils ?', schema: 'volcan-types',
    expl: 'Le volcan explosif (gris) se trouve entre les plaques, à l\'intersection des plaques : c\'est la subduction. Le volcan effusif (rouge) se trouve au milieu d\'une plaque.' },
  { type: 'vf', q: 'Le volcan explosif se trouve au milieu d\'une plaque.', vrai: false,
    expl: 'Faux. Le volcan explosif se trouve entre les plaques, à l\'intersection des plaques (subduction). C\'est le volcan effusif qui se trouve au milieu d\'une plaque.' },
  { type: 'ecrire', q: 'Sur la coupe, comment s\'appelle le petit cône sur le flanc du volcan (numéro 2) ?', vis: 'volcan-coupe', reponses: ['le cône secondaire', 'cône secondaire', 'un cône secondaire'],
    expl: 'C\'est le cône secondaire (2). La cheminée secondaire (3) y mène depuis la cheminée volcanique.' },
  { type: 'vf', q: 'La cheminée volcanique et le cône volcanique, c\'est la même chose.', vrai: false,
    expl: 'Faux. ' + PIEGE },
  { type: 'qcm', q: 'Sur la coupe, comment s\'appelle la lave qui descend sur le flanc du volcan (numéro 4) ?', vis: 'volcan-coupe', choix: ['la coulée de lave', 'la nuée ardente', 'la cheminée secondaire', 'le magma'], bonne: 0,
    expl: 'C\'est la coulée de lave (4). La nuée ardente (6) est le gros nuage gris au-dessus du volcan.' },
  { type: 'vf', q: 'Un volcan effusif peut faire des dégâts mais ne cause en général pas de victime.', vrai: true,
    expl: 'Vrai. Le volcan effusif peut faire des dégâts mais ne cause en général pas de victime : les habitants sont évacués.' },
  { type: 'qcm', q: 'Quelle est la couleur associée au volcan explosif ?', choix: ['gris', 'rouge', 'jaune', 'noir'], bonne: 0,
    expl: 'Volcan explosif : gris (comme ses cendres). Volcan effusif : rouge (comme sa lave liquide).' },
];

export const PRIO = {
  video: { id: 'volcan', titre: 'La coupe d\'un volcan, volcan explosif et volcan effusif', duree: 'à regarder avant tout le reste' },
  minutes: 10,
  prio: [
    ['Les dix étiquettes de la coupe', 'Gauche : cratère, cône secondaire, cheminée secondaire, coulée de lave, chambre magmatique. Droite : nuée ardente, projections volcaniques, cône volcanique, cheminée volcanique, magma.'],
    ['Le piège de la coupe', 'La cheminée volcanique = le conduit. Le magma = ce qui monte dedans. Le cône volcanique = la montagne.'],
    ['Le volcan explosif', 'Gris. Des cendres, du gaz, des nuées ardentes, des projections. Magma très visqueux, épais. Grande explosion : danger de mort. Entre les plaques (subduction).'],
    ['Le volcan effusif', 'Rouge. Une lave liquide. Magma fluide. Peut faire des dégâts, mais en général pas de victime : les habitants sont évacués. Au milieu d\'une plaque.'],
  ],
  prof: [
    ['Complète la coupe schématique d\'un volcan.', 'Gauche, de haut en bas : le cratère, le cône secondaire, la cheminée secondaire, la coulée de lave, la chambre magmatique. Droite : la nuée ardente, les projections volcaniques, le cône volcanique, la cheminée volcanique, le magma.', 'Schéma à légender', { schema: 'volcan-coupe' }],
    ['Cite les deux types de volcans et leur couleur associée.', 'Le volcan explosif : gris. Le volcan effusif : rouge.', 'Tableau'],
    ['Quels produits sont rejetés durant l\'éruption ?', 'Volcan explosif : des cendres, du gaz, des nuées ardentes, des projections (pyroclastiques), lahar. Volcan effusif : une lave liquide.', 'Tableau'],
    ['Quel est l\'état du magma de chaque volcan ?', 'Volcan explosif : il est très visqueux, épais. Volcan effusif : il est fluide.', 'Tableau'],
    ['Quelles sont les conséquences de l\'éruption sur le paysage et/ou les habitants ?', 'Volcan explosif : dangereux pour les habitants et le paysage, grande explosion, danger de mort. Volcan effusif : peut faire des dégâts mais ne cause en général pas de victime ; les habitants sont évacués.', 'Tableau'],
    ['Où se trouvent ces deux types de volcans ?', 'Volcan explosif : entre les plaques, à l\'intersection des plaques (subduction). Volcan effusif : au milieu d\'une plaque.', 'Tableau', { schema: 'volcan-types' }],
  ],
};
