// Chapitre 2 : La structure de la Terre. Source unique : cours/02-structure-de-la-terre.md.
// Un fichier par chapitre : la leçon et les mots (CHAPITRE), les exercices (QUESTIONS), les priorités et questions de contrôle (PRIO).
// Formats : voir BRIEF-CHAPITRES.md à la racine du projet.
// Chiffres : ceux de l'encadré à compléter (le plus important). Les chiffres du schéma imprimé (profondeurs, températures) sont en
// partie flous sur la photo et ne sont pas utilisés, sauf pour signaler que le schéma écrit « 30-60 km » pour la croûte.
// Les nombres portent des espaces insécables (3 470, 16 %, 20 km) : ils ne se coupent pas en fin de ligne sur téléphone.

export const CHAPITRE = {
  id: 'terre', theme: 3, titre: 'La structure de la Terre',
  accroche: 'Tu en sais un peu plus sur les plaques tectoniques. Et notre Terre, comment est-elle faite à l\'intérieur ? Trois couches, avec leurs chiffres.',
  etoiles: 3,
  sims: [{ id: 'terre-couches', titre: 'La Terre en coupe', sous: 'Enlève un quartier et touche une couche' }],
  lecon: `
<div class="bloc essentiel">
<h2>L'idée en 20 secondes</h2>
<p>Notre Terre est constituée de <b>trois couches principales</b>. Du centre vers la surface : le <mark>noyau</mark>, le
<mark>manteau</mark> et la <mark>croûte</mark> (on dit aussi l'<mark>écorce</mark>).</p>
<p>Le noyau est <b>solide au cœur</b> : c'est la <mark>graine</mark>. Autour, il est <b>liquide</b>.</p>
</div>

<div class="bloc">
<h2>La Terre en coupe</h2>
<p>Sur le schéma de ton cours, on a <b>enlevé un quartier</b> de la Terre pour voir l'intérieur : du jaune au centre jusqu'à
la croûte, tout au-dessus.</p>
{{schema:terre-coupe}}
<p class="astuce">Pour ne pas te tromper d'ordre, pars du centre : la graine, le noyau liquide, le manteau, puis la croûte.</p>
</div>

<div class="bloc">
<h2>Les trois couches, une par une</h2>
<h3>1. Le noyau, au centre</h3>
<ul>
<li>un <b>rayon</b> de <mark>3 470 kilomètres</mark> ;</li>
<li>composé de <b>fer</b> et de <b>nickel</b> ;</li>
<li><b>solide au cœur</b> (c'est la <mark>graine</mark>) et <b>liquide autour</b> ;</li>
<li>il représente <mark>16 %</mark> du volume de la Terre et <mark>67 %</mark> de sa masse.</li>
</ul>
<h3>2. Le manteau, autour du noyau</h3>
<ul>
<li>une <b>épaisseur</b> de <mark>2 900 kilomètres</mark> ;</li>
<li>composé d'une part de <b>silicate de fer</b> et d'autre part de <b>magnésium</b> ;</li>
<li>il constitue <mark>80 %</mark> du volume de la Terre.</li>
</ul>
<h3>3. La croûte (écorce), tout au-dessus</h3>
<ul>
<li>une <b>épaisseur</b> de <mark>30 à 40 kilomètres</mark> sous les continents ;</li>
<li>d'environ <mark>20 kilomètres</mark> sous les océans ;</li>
<li>seulement <mark>quelques kilomètres</mark> au niveau des rifts et des dorsales.</li>
</ul>
<p class="astuce">Le noyau ne prend que 16 % du volume de la Terre, mais il fait 67 % de sa masse. Et attention : pour le noyau, on
donne un <b>rayon</b> (du centre jusqu'au manteau) ; pour le manteau et la croûte, une <b>épaisseur</b>.</p>
</div>

<div class="bloc">
<h2>La croûte n'a pas partout la même épaisseur</h2>
{{schema:terre-croute}}
<p>Sous les continents : <b>30 à 40 kilomètres</b>. Sous les océans : <b>environ 20 kilomètres</b>. Au niveau des rifts et des
dorsales : <b>seulement quelques kilomètres</b>.</p>
</div>

<div class="bloc">
<h2>Sur le schéma de ton cours</h2>
<p>Le schéma imprimé montre aussi ce qui se passe <b>sous la croûte</b>, dans le manteau. Tu retrouveras ces mots dans la suite
du cours.</p>
{{schema:terre-schema}}
<p class="astuce">Sur le schéma imprimé, tu lis aussi des profondeurs et des températures, et « 30-60 km » pour la croûte. Les
chiffres à savoir sont ceux de l'<b>encadré</b> à compléter : 30 à 40 kilomètres sous les continents.</p>
</div>

<div class="retiens">
<p>Celle-ci (notre Terre) est constituée de trois couches principales :</p>
<ul>
<li>Le <mark>noyau</mark> d'un rayon de 3 470 kilomètres, composé de fer et de nickel, solide au cœur (la <mark>graine</mark>) et
liquide autour qui représente 16 % du volume de la Terre et 67 % de sa masse ;</li>
<li>Le <mark>manteau</mark> d'une épaisseur de 2 900 kilomètres composé d'une part de silicate de fer et d'autre part de
magnésium constituant 80 % du volume de la Terre ;</li>
<li>La <mark>croûte (écorce)</mark> d'une épaisseur de 30 à 40 kilomètres sous les continents, d'environ 20 kilomètres sous les
océans et seulement quelques kilomètres au niveau des rifts et des dorsales.</li>
</ul>
</div>`,
  mots: [
    ['Trois couches principales', 'Du centre vers la surface : le noyau, le manteau et la croûte (écorce).'],
    ['Noyau', 'La couche du centre : un rayon de 3 470 km, du fer et du nickel. Solide au cœur (la graine), liquide autour. 16 % du volume de la Terre, 67 % de sa masse.'],
    ['Graine', 'Le cœur solide du noyau.'],
    ['Manteau', 'La couche autour du noyau : 2 900 km d\'épaisseur, du silicate de fer et du magnésium. 80 % du volume de la Terre.'],
    ['Croûte (écorce)', 'La couche tout au-dessus : 30 à 40 km sous les continents, environ 20 km sous les océans, quelques kilomètres au niveau des rifts et des dorsales.'],
  ],
};

export const QUESTIONS = [
  { type: 'trous', banque: true, prio: true, texte: 'La Terre est constituée de trois couches principales. Le {noyau} d\'un rayon de 3 470 kilomètres, composé de fer et de nickel, solide au cœur (la {graine}) et liquide autour, qui représente 16 % du volume de la Terre et 67 % de sa masse. Le {manteau} d\'une épaisseur de 2 900 kilomètres, composé d\'une part de silicate de fer et d\'autre part de magnésium, constituant 80 % du volume de la Terre. La {croûte} (écorce) d\'une épaisseur de 30 à 40 kilomètres sous les continents, d\'environ 20 kilomètres sous les océans et seulement quelques kilomètres au niveau des rifts et des dorsales.', leurres: ['magma', 'plaque'],
    expl: 'C\'est l\'encadré de ton cours. Du centre vers la surface : le noyau (solide au cœur : la graine), le manteau, la croûte (écorce).' },
  { type: 'legende', prio: true, q: 'Légende la Terre en coupe.', schema: 'terre-coupe',
    expl: 'Du dehors vers le centre : la croûte terrestre (écorce), toute fine ; le manteau, la grande couche rouge ; le noyau liquide ; et au cœur, le noyau solide : la graine.' },
  { type: 'ordre', prio: true, q: 'Range les couches de la Terre du centre vers la surface.', etapes: ['la graine (le noyau solide)', 'le noyau liquide', 'le manteau', 'la croûte (écorce)'],
    expl: 'Au centre, le noyau : solide au cœur (la graine), liquide autour. Autour du noyau, le manteau. Tout au-dessus, la croûte (écorce).' },
  { type: 'ecrire', prio: true, q: 'Le noyau est solide au cœur. Comment appelle-t-on ce cœur solide ?', reponses: ['la graine', 'graine'],
    expl: 'Le noyau est solide au cœur : c\'est la graine. Autour, il est liquide.' },
  { type: 'vf', prio: true, q: 'Le noyau de la Terre est entièrement liquide.', vrai: false,
    expl: 'Faux. Le noyau est solide au cœur (la graine) et liquide autour.' },
  { type: 'relier', prio: true, q: 'Relie chaque couche à son chiffre.', paires: [['le noyau', 'un rayon de 3 470 km'], ['le manteau', 'une épaisseur de 2 900 km'], ['la croûte sous les continents', '30 à 40 km d\'épaisseur'], ['la croûte sous les océans', 'environ 20 km d\'épaisseur']],
    expl: 'Le noyau : un rayon de 3 470 kilomètres. Le manteau : une épaisseur de 2 900 kilomètres. La croûte : 30 à 40 kilomètres sous les continents, environ 20 kilomètres sous les océans.' },
  { type: 'classer', prio: true, q: 'Range chaque information dans la bonne couche.', categories: ['le noyau', 'le manteau', 'la croûte (écorce)'],
    items: [{ t: 'fer et nickel', c: 0 }, { t: 'solide au cœur, liquide autour', c: 0 }, { t: '67 % de la masse de la Terre', c: 0 }, { t: 'silicate de fer et magnésium', c: 1 }, { t: '80 % du volume de la Terre', c: 1 }, { t: 'environ 20 km sous les océans', c: 2 }, { t: 'quelques km aux rifts et aux dorsales', c: 2 }],
    expl: 'Le noyau : fer et nickel, solide au cœur et liquide autour, 16 % du volume et 67 % de la masse. Le manteau : silicate de fer et magnésium, 80 % du volume. La croûte : 30 à 40 km sous les continents, environ 20 km sous les océans, quelques kilomètres aux rifts et aux dorsales.' },
  { type: 'qcm', prio: true, q: 'De quoi le noyau est-il composé ?', choix: ['de fer et de nickel', 'de silicate de fer et de magnésium', 'de magma chaud qui remonte', 'de fer et de cuivre'], bonne: 0,
    expl: 'Le noyau est composé de fer et de nickel. Le silicate de fer et le magnésium, c\'est le manteau.' },
  { type: 'calcul', prio: true, q: 'Le noyau a un rayon de combien de kilomètres ?', reponse: 3470, unite: 'km', tolerance: 0,
    expl: 'Le noyau a un rayon de 3 470 kilomètres. Ne le confonds pas avec le manteau : une épaisseur de 2 900 kilomètres.' },
  { type: 'calcul', prio: true, q: 'Quelle est l\'épaisseur du manteau, en kilomètres ?', reponse: 2900, unite: 'km', tolerance: 0,
    expl: 'Le manteau a une épaisseur de 2 900 kilomètres. Le noyau, lui, a un rayon de 3 470 kilomètres.' },
  { type: 'qcm', prio: true, q: 'Quelle couche constitue 80 % du volume de la Terre ?', choix: ['le manteau', 'le noyau', 'la croûte (écorce)', 'la graine'], bonne: 0,
    expl: 'Le manteau constitue 80 % du volume de la Terre. Le noyau, lui, représente 16 % du volume (mais 67 % de la masse).' },
  { type: 'vf', prio: true, q: 'Le noyau représente 16 % du volume de la Terre, mais 67 % de sa masse.', vrai: true,
    expl: 'Vrai. Le noyau représente 16 % du volume de la Terre et 67 % de sa masse.' },
  { type: 'vf', prio: true, q: 'La croûte a partout la même épaisseur.', vrai: false,
    expl: 'Faux. La croûte a une épaisseur de 30 à 40 kilomètres sous les continents, d\'environ 20 kilomètres sous les océans et seulement quelques kilomètres au niveau des rifts et des dorsales.' },
  { type: 'legende', q: 'Place l\'épaisseur de la croûte (écorce) au bon endroit.', schema: 'terre-croute',
    expl: 'Sous les continents : 30 à 40 km. Sous les océans : environ 20 km. Au niveau des rifts et des dorsales : seulement quelques kilomètres.' },
  { type: 'ecrire', q: 'Quel autre mot ton cours donne-t-il pour la croûte ?', reponses: ['l\'écorce', 'écorce', 'l\'écorce terrestre', 'écorce terrestre'],
    expl: 'Dans l\'encadré : « la croûte (écorce) ». Les deux mots désignent la même couche, tout au-dessus.' },
  { type: 'qcm', q: 'Quelle est l\'épaisseur de la croûte sous les océans ?', vis: 'terre-croute', choix: ['environ 20 kilomètres', '30 à 40 kilomètres', 'quelques kilomètres', '2 900 kilomètres'], bonne: 0,
    expl: 'Sous les océans, la croûte a une épaisseur d\'environ 20 kilomètres. 30 à 40 kilomètres, c\'est sous les continents.' },
  { type: 'trous', texte: 'La croûte a une épaisseur de 30 à 40 kilomètres sous les {continents}, d\'environ 20 kilomètres sous les {océans} et seulement quelques kilomètres au niveau des rifts et des {dorsales}.',
    expl: 'Les mots de l\'encadré : sous les continents, sous les océans, au niveau des rifts et des dorsales.' },
  { type: 'calcul', q: 'Le noyau représente combien de pour cent du volume de la Terre ?', reponse: 16, unite: '%', tolerance: 0,
    expl: 'Le noyau représente 16 % du volume de la Terre et 67 % de sa masse. Le manteau, lui, constitue 80 % du volume.' },
  { type: 'legende', q: 'Le schéma de ton cours montre aussi ce qui se passe sous la croûte. Légende-le.', schema: 'terre-schema',
    expl: 'Les boucles en pointillés sont les cellules de convection. Le panache convectif et la chambre magmatique sont placés comme sur le schéma imprimé de ton cours. À droite, la croûte de l\'océan plonge : c\'est la zone de subduction.' },
  { type: 'qcm', q: 'Sur le schéma de ton cours, dans quelle couche tournent les cellules de convection ?', vis: 'terre-schema', choix: ['dans le manteau', 'dans le noyau', 'dans la graine', 'dans la croûte'], bonne: 0,
    expl: 'Les boucles en pointillés (les cellules de convection) sont dessinées dans le manteau, la grande couche rouge sous la croûte.' },
];

export const PRIO = {
  video: { id: 'terre', titre: 'La structure de la Terre : trois couches', duree: 'à regarder avant tout le reste' },
  minutes: 7,
  prio: [
    ['Trois couches, du centre vers la surface', 'Le noyau, le manteau, la croûte (écorce).'],
    ['Le noyau', 'Un rayon de 3 470 km, fer et nickel. Solide au cœur (la graine), liquide autour. 16 % du volume, 67 % de la masse.'],
    ['Le manteau', 'Une épaisseur de 2 900 km, silicate de fer et magnésium. 80 % du volume de la Terre.'],
    ['La croûte (écorce)', '30 à 40 km sous les continents, environ 20 km sous les océans, quelques kilomètres aux rifts et aux dorsales.'],
  ],
  prof: [
    ['Complète l\'encadré : de quelles trois couches principales la Terre est-elle constituée ?', 'Le noyau, d\'un rayon de 3 470 kilomètres, composé de fer et de nickel, solide au cœur (la graine) et liquide autour, qui représente 16 % du volume de la Terre et 67 % de sa masse. Le manteau, d\'une épaisseur de 2 900 kilomètres, composé d\'une part de silicate de fer et d\'autre part de magnésium, constituant 80 % du volume de la Terre. La croûte (écorce), d\'une épaisseur de 30 à 40 kilomètres sous les continents, d\'environ 20 kilomètres sous les océans et seulement quelques kilomètres au niveau des rifts et des dorsales.', 'Texte à compléter'],
    ['Légende la Terre en coupe.', '1. la croûte terrestre (écorce) · 2. le manteau · 3. le noyau liquide · 4. le noyau solide : la graine.', 'Schéma à compléter', { schema: 'terre-coupe' }],
    ['Comment appelle-t-on le cœur solide du noyau ?', 'La graine. Le noyau est solide au cœur (la graine) et liquide autour.', 'Question courte'],
    ['La croûte a-t-elle partout la même épaisseur ?', 'Non. 30 à 40 kilomètres sous les continents, environ 20 kilomètres sous les océans et seulement quelques kilomètres au niveau des rifts et des dorsales.', 'Question courte', { schema: 'terre-croute' }],
    ['Quelle couche constitue 80 % du volume de la Terre ?', 'Le manteau, d\'une épaisseur de 2 900 kilomètres.', 'Question courte'],
  ],
};
