// Chapitre 7 : Trois volcans du Chili (Osorno, Calbuco, Villarica). Source unique : cours/06-volcans-du-chili.md.
// Un fichier par chapitre : la leçon et les mots (CHAPITRE), les exercices (QUESTIONS), les priorités et questions de contrôle (PRIO).
// Formats : voir BRIEF-CHAPITRES.md à la racine du projet.
// Orthographe : « Villarica » partout (le cours imprimé écrit une fois « Villaria »), « pyroclastique » (orthographe du cours
// imprimé ; « pyroplastique » est accepté dans les réponses écrites).

/* Petits styles en ligne de la leçon. Couleurs du cours (tableau volcan explosif / effusif) : gris = explosif, rouge = effusif. */
const pastille = (fond) => (t) => `<span style="display:inline-block;background:${fond};color:#fff;border-radius:8px;padding:0 8px 1px;font-weight:700;white-space:nowrap">${t}</span>`;
const EFF = pastille('#e0482a');
const EXP = pastille('#6f6a7a');
const SOUL = (t) => `<u style="text-decoration-color:#ff5a36;text-decoration-thickness:3px;text-underline-offset:3px">${t}</u>`;
const ETIQ = (html) => `<div style="background:#fffdf8;border:2px dashed #b9ad94;border-radius:12px;padding:12px 14px;margin:10px 0 12px;line-height:1.55">${html}</div>`;
const MC = (lignes, titre = 'Dans le tableau : mots-clés') => `<div style="display:inline-block;border:2px solid var(--encre);border-radius:12px;padding:8px 16px 10px;background:#fff;margin:4px 0 6px;box-shadow:3px 3px 0 var(--encre)"><div style="font:700 11px/1 var(--texte);letter-spacing:.1em;text-transform:uppercase;color:var(--encre2);margin-bottom:6px">${titre}</div>${lignes.map((l) => `<div style="font:700 18px/1.45 var(--titre)">- ${l}</div>`).join('')}</div>`;
const CASE = (bord, fond) => `style="border:${bord};border-radius:14px;padding:12px 14px;background:${fond}"`;

export const CHAPITRE = {
  id: 'chili', theme: 3, titre: 'Trois volcans du Chili : Osorno, Calbuco, Villarica',
  accroche: 'Trois volcans, trois façons d\'entrer en éruption. Et au contrôle, un tableau à remplir… en mots-clés !',
  etoiles: 2,
  sims: [{ id: 'chili-volcans', titre: 'Trois volcans côte à côte', sous: 'Choisis un volcan et regarde son éruption' }],
  lecon: `
<div class="bloc essentiel">
<h2>L'idée en 20 secondes</h2>
<p>Trois volcans du Chili, trois types d'éruption :</p>
<ul>
<li>le volcan d'<b>Osorno</b> : des ${EFF('éruptions effusives')} ;</li>
<li>le volcan <b>Calbuco</b> : principalement des ${EXP('éruptions explosives')} mais également des ${EFF('éruptions effusives')} ;</li>
<li>le volcan <b>Villarica</b> : des ${EXP('éruptions explosives')}. C'est <mark>le volcan le plus dangereux du Chili</mark>.</li>
</ul>
<p>Au contrôle, dans un tableau : <mark>tableau = mots-clés ! (tiret)</mark> Pas de phrases : un mot-clé après chaque tiret.</p>
<p style="font-size:14px;color:var(--encre2);margin-bottom:0">Les couleurs sont celles de ton cours : gris pour explosif, rouge pour effusif.</p>
</div>

<p class="astuce"><b>Rappel</b> (note en haut de la page du cours) : les plaques ? <b>Nazca</b> et <b>sud-américaine</b>. La zone ? La <b>CFP</b>
(Ceinture de Feu du Pacifique) : une zone de <b>subduction</b>.</p>

<div class="bloc">
<h2>Trois volcans, trois photos</h2>
<p>Dans ton cours, chaque volcan a sa photo et sa petite étiquette de texte. Retiens à quoi ils ressemblent.</p>
{{schema:chili-trois}}
<p class="astuce"><b>Exercice 4.3</b> : « Dans les étiquettes ci-dessous, souligne les produits rejetés par les volcans. Ensuite,
complète le tableau de la page suivante. » Dans les trois étiquettes ci-dessous, les produits rejetés sont
${SOUL('soulignés en rouge')}.</p>
</div>

<div class="bloc">
<h2>1. Le volcan d'Osorno</h2>
${ETIQ(`Le volcan d'Osorno se caractérise par <b>des éruptions effusives</b>. Les principaux produits rejetés sont ${SOUL('de la lave')},
généralement inférieure à deux mètres d'épaisseur, ${SOUL('des produits solides normalement noirs')} de tailles centimétriques et
décimétriques qui s'accumulent en couches de plusieurs mètres près du cratère.`)}
{{schema:chili-osorno}}
<p style="margin:14px 0 6px"><b>Type d'éruption :</b> ${EFF('effusives')}</p>
${MC(['lave', 'projections volcaniques'])}
</div>

<div class="bloc">
<h2>2. Le volcan Calbuco</h2>
${ETIQ(`Le volcan Calbuco se caractérise principalement par des éruptions explosives mais également des éruptions effusives. Les
principaux produits rejetés sont ${SOUL('des cendres')}, ${SOUL('des nuages de poussières')} pouvant faire des dizaines de mètres de
hauteur, ${SOUL('des coulées de lave')}. Il est considéré comme l'un des volcans les plus dangereux du Chili.`)}
{{schema:chili-calbuco}}
<p style="margin:14px 0 6px"><b>Type d'éruption :</b> ${EXP('explosives')} et ${EFF('effusives')}</p>
${MC(['lave', 'nuée ardente'])}
</div>

<div class="bloc">
<h2>3. Le volcan Villarica</h2>
${ETIQ(`Le volcan Villarica se caractérise par des éruptions explosives. Il est le volcan le plus dangereux du Chili. Les
${SOUL('laves')} qu'il émet, visqueuses, coulent mal et forment des bouchons. Quand la pression est trop forte, l'éruption
devient explosive. ${SOUL('Des nuées de gaz brûlants, de roches et de poussières')} dévalent les pentes appelées
${SOUL('coulées pyroclastiques')}.`)}
{{schema:chili-villarica}}
<p><b>Pourquoi ça explose ?</b> Les laves <mark>visqueuses</mark> coulent mal et forment des <mark>bouchons</mark>. Quand la
<mark>pression</mark> est trop forte, l'éruption devient <mark>explosive</mark>. Alors des nuées de gaz brûlants, de roches et de
poussières dévalent les pentes : les <mark>coulées pyroclastiques</mark>.</p>
<p style="margin:14px 0 6px"><b>Type d'éruption :</b> ${EXP('explosives')}</p>
${MC(['lave pâteuse', 'coulée pyroclastique'])}
<p class="astuce">Le mot du cours imprimé : pyro<b>clas</b>tique, avec « clas » (et pas « pyroplastique »).</p>
</div>

<div class="bloc">
<h2>Le piège : « le plus » ou « l'un des plus » ?</h2>
<div class="deux">
<div ${CASE('3px solid var(--encre)', '#fde6e0')}><b style="font:800 21px/1.2 var(--titre)">Villarica</b>
<p style="margin:6px 0">« Il est <mark>le volcan le plus dangereux</mark> du Chili. »</p><small>Un seul volcan est le plus dangereux : c'est lui.</small></div>
<div ${CASE('2px solid var(--trait)', '#fff')}><b style="font:800 21px/1.2 var(--titre)">Calbuco</b>
<p style="margin:6px 0">« Il est considéré comme <mark>l'un des volcans les plus dangereux</mark> du Chili. »</p><small>Il fait partie des volcans les plus dangereux, mais ce n'est pas LE plus dangereux.</small></div>
</div>
</div>

<div class="bloc">
<h2>Tableau = mots-clés ! (tiret)</h2>
<p>Dans ton cours, à côté de la consigne 4.4, une note en vert : <b style="color:#1f7a3a">« tableau = mots-clés ! (tiret) »</b>.
Au contrôle, dans un tableau, on ne répond pas par des phrases : on écrit des <mark>mots-clés</mark>, un après chaque
<mark>tiret</mark>.</p>
<div class="deux">
<div ${CASE('2px solid #e7b3a6', '#fff4f1')}><b>✗ En phrase : à éviter dans un tableau</b>
<p style="margin:6px 0 0">« Il rejette de la lave et des produits solides qui s'accumulent en couches de plusieurs mètres près du cratère. »</p></div>
<div ${CASE('2px solid #8fcca0', '#effaf2')}><b>✓ En mots-clés : ce qu'on attend</b>
<div style="font:700 19px/1.5 var(--titre);margin-top:6px">- lave<br>- projections volcaniques</div></div>
</div>
<h3>Les trois volcans : de la phrase aux mots-clés</h3>
<table class="tab">
<tr><th>Volcan</th><th>En phrase</th><th>En mots-clés</th></tr>
<tr><td><b>Osorno</b></td><td>Il rejette de la lave et des produits solides qui s'accumulent en couches de plusieurs mètres près du cratère.</td><td><b>- lave<br>- projections volcaniques</b></td></tr>
<tr><td><b>Calbuco</b></td><td>Il rejette des cendres, des nuages de poussières, des coulées de lave. Le volcan est considéré comme l'un des plus dangereux du Chili.</td><td><b>- lave<br>- nuée ardente</b></td></tr>
<tr><td><b>Villarica</b></td><td>Il rejette de la lave visqueuse, des nuées de gaz brûlants et des coulées pyroclastiques. Quand la pression est trop forte, l'éruption devient explosive. C'est le volcan le plus dangereux du Chili.</td><td><b>- lave pâteuse<br>- coulée pyroclastique</b></td></tr>
</table>
</div>

<div class="bloc">
<h2>4.4 Le tableau complété, à savoir refaire</h2>
<p>Consigne : « Complète le tableau suivant à l'aide des 3 documents. »</p>
<table class="tab">
<tr><th></th><th>Nom du volcan</th><th>Type d'éruption</th><th>Caractéristiques de l'éruption</th></tr>
<tr><td>1</td><td><b>Volcan d'Osorno</b></td><td>effusives</td><td>- lave<br>- projections volcaniques</td></tr>
<tr><td>2</td><td><b>Volcan Calbuco</b></td><td>explosives et effusives</td><td>- lave<br>- nuée ardente</td></tr>
<tr><td>3</td><td><b>Volcan Villarica</b></td><td>explosives</td><td>- lave pâteuse<br>- coulée pyroclastique</td></tr>
</table>
</div>

<div class="retiens">
<p><b>Volcan d'Osorno</b> : éruptions <mark>effusives</mark>. - lave - projections volcaniques.</p>
<p><b>Volcan Calbuco</b> : éruptions <mark>explosives et effusives</mark>. - lave - nuée ardente. L'un des volcans les plus dangereux du Chili.</p>
<p><b>Volcan Villarica</b> : éruptions <mark>explosives</mark>. - lave pâteuse - coulée pyroclastique. Le volcan le plus dangereux du Chili.</p>
<p>Dans un tableau : des <mark>mots-clés</mark>, avec des tirets.</p>
</div>`,
  mots: [
    ['Volcan d\'Osorno', 'Éruptions effusives. Mots-clés : - lave - projections volcaniques.'],
    ['Volcan Calbuco', 'Éruptions explosives et effusives. Mots-clés : - lave - nuée ardente. L\'un des volcans les plus dangereux du Chili.'],
    ['Volcan Villarica', 'Éruptions explosives. Mots-clés : - lave pâteuse - coulée pyroclastique. Le volcan le plus dangereux du Chili.'],
    ['Coulées pyroclastiques', 'Des nuées de gaz brûlants, de roches et de poussières qui dévalent les pentes (volcan Villarica).'],
    ['Laves visqueuses', 'Des laves qui coulent mal et forment des bouchons : quand la pression est trop forte, l\'éruption devient explosive (volcan Villarica).'],
    ['Mots-clés d\'Osorno', 'Dans le tableau : lave, projections volcaniques (éruptions effusives).'],
    ['Mots-clés du Calbuco', 'Dans le tableau : lave, nuée ardente (éruptions explosives et effusives).'],
    ['Mots-clés', 'Ce qu\'on écrit dans un tableau : pas de phrases, un mot-clé après chaque tiret.'],
  ],
};

export const QUESTIONS = [
  { type: 'classer', prio: true, q: 'Le tableau 4.4 en mots-clés : range chaque élément dans la colonne du bon volcan.', categories: ['Volcan d\'Osorno', 'Volcan Calbuco', 'Volcan Villarica'],
    items: [{ t: 'éruptions effusives', c: 0 }, { t: 'projections volcaniques', c: 0 }, { t: 'éruptions explosives et effusives', c: 1 }, { t: 'nuée ardente', c: 1 }, { t: 'éruptions explosives', c: 2 }, { t: 'lave pâteuse', c: 2 }, { t: 'coulée pyroclastique', c: 2 }],
    expl: 'Osorno : effusives, - lave, - projections volcaniques. Calbuco : explosives et effusives, - lave, - nuée ardente. Villarica : explosives, - lave pâteuse, - coulée pyroclastique.' },
  { type: 'relier', prio: true, q: 'Relie chaque volcan à son type d\'éruption.', paires: [['le volcan d\'Osorno', 'éruptions effusives'], ['le volcan Calbuco', 'éruptions explosives et effusives'], ['le volcan Villarica', 'éruptions explosives']],
    expl: 'Osorno : des éruptions effusives. Calbuco : principalement des éruptions explosives mais également des éruptions effusives. Villarica : des éruptions explosives.' },
  { type: 'qcm', prio: true, q: 'Au contrôle, comment remplis-tu la colonne « Caractéristiques de l\'éruption » du tableau ?', choix: ['Avec des mots-clés, un après chaque tiret.', 'Avec de longues phrases recopiées du texte.', 'Avec un dessin du volcan.', 'Avec le nom du pays.'], bonne: 0,
    expl: 'La note en vert dans ton cours : « tableau = mots-clés ! (tiret) ». Par exemple, pour Osorno : - lave - projections volcaniques.' },
  { type: 'trous', banque: true, prio: true, texte: 'Volcan d\'Osorno : éruptions {effusives} ; - lave ; - {projections volcaniques}. Volcan Calbuco : éruptions {explosives et effusives} ; - lave ; - {nuée ardente}. Volcan Villarica : éruptions {explosives} ; - {lave pâteuse} ; - {coulée pyroclastique}.', leurres: ['lave liquide'],
    expl: 'C\'est le tableau 4.4 en mots-clés. Attention : la lave du Villarica n\'est pas liquide, elle est visqueuse (pâteuse) et forme des bouchons.' },
  { type: 'qcm', prio: true, q: 'Quel est le volcan le plus dangereux du Chili ?', choix: ['le volcan Villarica', 'le volcan Calbuco', 'le volcan d\'Osorno', 'les trois sont aussi dangereux'], bonne: 0,
    expl: 'Villarica : « Il est le volcan le plus dangereux du Chili. » Calbuco est seulement considéré comme « l\'un des volcans les plus dangereux du Chili ».' },
  { type: 'vf', prio: true, q: 'Le volcan Calbuco est le volcan le plus dangereux du Chili.', vrai: false,
    expl: 'Faux, c\'est le piège : Calbuco est considéré comme l\'un des volcans les plus dangereux du Chili. Le plus dangereux, c\'est le Villarica.' },
  { type: 'relier', prio: true, q: 'Relie chaque volcan aux mots-clés de son tableau.', paires: [['volcan d\'Osorno', 'lave · projections volcaniques'], ['volcan Calbuco', 'lave · nuée ardente'], ['volcan Villarica', 'lave pâteuse · coulée pyroclastique']],
    expl: 'Les mots-clés écrits dans la marge de ton tableau : Osorno → lave, projections volcaniques ; Calbuco → lave, nuée ardente ; Villarica → lave pâteuse, coulée pyroclastique.' },
  { type: 'ecrire', prio: true, q: 'Quel type d\'éruption caractérise le volcan d\'Osorno ?', reponses: ['des éruptions effusives', 'éruptions effusives', 'effusives', 'effusive', 'éruption effusive', 'une éruption effusive', 'effusif', 'éruptions effusive'],
    expl: 'Le volcan d\'Osorno se caractérise par des éruptions effusives : de la lave et des produits solides noirs.' },
  { type: 'classer', q: 'Exercice 4.3 : souligne les produits rejetés. Range chaque morceau des étiquettes : produit rejeté ou pas ?', categories: ['produit rejeté (à souligner)', 'pas un produit rejeté'],
    items: [{ t: 'de la lave', c: 0 }, { t: 'des produits solides normalement noirs', c: 0 }, { t: 'des cendres', c: 0 }, { t: 'des nuages de poussières', c: 0 }, { t: 'des nuées de gaz brûlants, de roches et de poussières', c: 0 }, { t: 'des éruptions effusives', c: 1 }, { t: 'près du cratère', c: 1 }, { t: 'le volcan le plus dangereux du Chili', c: 1 }, { t: 'la pression', c: 1 }],
    expl: 'Les produits rejetés sortent du volcan : la lave, les produits solides noirs (Osorno), les cendres et les nuages de poussières (Calbuco), les nuées de gaz brûlants, de roches et de poussières (Villarica). Un type d\'éruption, un endroit ou le danger ne sont pas des produits rejetés.' },
  { type: 'legende', q: 'Reconnais les trois volcans d\'après les photos de ton cours.', schema: 'chili-trois',
    expl: 'Osorno : un cône parfait, au sommet enneigé, au bord d\'un lac. Calbuco : un énorme panache de cendres gris. Villarica : de nuit, de la lave orange au sommet.' },
  { type: 'legende', q: 'Le volcan Villarica : légende le croquis.', schema: 'chili-villarica',
    expl: 'Les laves visqueuses (pâteuses) coulent mal et forment des bouchons. Quand la pression est trop forte, l\'éruption devient explosive : des coulées pyroclastiques dévalent les pentes.' },
  { type: 'ordre', q: 'Volcan Villarica : remets dans l\'ordre ce qui se passe.', etapes: ['Les laves qu\'il émet, visqueuses, coulent mal.', 'Elles forment des bouchons.', 'La pression devient trop forte.', 'L\'éruption devient explosive.', 'Des nuées de gaz brûlants, de roches et de poussières dévalent les pentes.'],
    expl: 'Les laves visqueuses coulent mal et forment des bouchons. Quand la pression est trop forte, l\'éruption devient explosive. Des nuées de gaz brûlants, de roches et de poussières dévalent les pentes : les coulées pyroclastiques.' },
  { type: 'ecrire', q: 'Comment appelle-t-on les nuées de gaz brûlants, de roches et de poussières qui dévalent les pentes du volcan Villarica ?', reponses: ['des coulées pyroclastiques', 'coulées pyroclastiques', 'coulée pyroclastique', 'une coulée pyroclastique', 'des coulées pyroplastiques', 'coulées pyroplastiques', 'coulée pyroplastique', 'une coulée pyroplastique'],
    expl: '« Des nuées de gaz brûlants, de roches et de poussières dévalent les pentes appelées coulées pyroclastiques. » Le cours imprimé écrit pyroclastique, avec « clas ».' },
  { type: 'trous', texte: 'Le volcan Villarica se caractérise par des éruptions {explosives|explosive}. Les laves qu\'il émet, {visqueuses|visqueuse|pâteuses}, coulent mal et forment des {bouchons|bouchon}. Quand la {pression} est trop forte, l\'éruption devient explosive.',
    expl: 'C\'est l\'étiquette du Villarica : laves visqueuses → bouchons → pression trop forte → éruption explosive.' },
  { type: 'vf', q: 'Le volcan Calbuco a seulement des éruptions explosives.', vrai: false,
    expl: 'Faux. Le volcan Calbuco se caractérise principalement par des éruptions explosives mais également des éruptions effusives.' },
  { type: 'vf', q: 'Le volcan d\'Osorno rejette surtout des cendres et des nuages de poussières.', vrai: false,
    expl: 'Faux, ça, c\'est le Calbuco. Le volcan d\'Osorno rejette de la lave et des produits solides normalement noirs, qui s\'accumulent en couches près du cratère.' },
  { type: 'calcul', q: 'Volcan d\'Osorno : la lave est généralement inférieure à combien de mètres d\'épaisseur ?', reponse: 2, unite: 'm', tolerance: 0,
    expl: '« de la lave, généralement inférieure à deux mètres d\'épaisseur ».' },
  { type: 'qcm', q: 'Pourquoi l\'éruption du Villarica devient-elle explosive ?', vis: 'chili-villarica', choix: ['Ses laves visqueuses coulent mal et forment des bouchons ; quand la pression est trop forte, l\'éruption devient explosive.', 'Sa lave est très liquide et coule très vite.', 'Il se trouve au bord d\'un lac.', 'Son sommet est couvert de neige.'], bonne: 0,
    expl: 'Les laves qu\'il émet, visqueuses, coulent mal et forment des bouchons. Quand la pression est trop forte, l\'éruption devient explosive.' },
  { type: 'qcm', q: 'Que font les produits solides noirs rejetés par le volcan d\'Osorno ?', vis: 'chili-osorno', choix: ['Ils s\'accumulent en couches de plusieurs mètres près du cratère.', 'Ils montent à des dizaines de mètres de hauteur.', 'Ils dévalent les pentes en nuées brûlantes.', 'Ils forment des bouchons dans le volcan.'], bonne: 0,
    expl: '« des produits solides normalement noirs de tailles centimétriques et décimétriques qui s\'accumulent en couches de plusieurs mètres près du cratère ». Dans le tableau : projections volcaniques.' },
  { type: 'trous', banque: true, texte: 'Le volcan Calbuco se caractérise principalement par des éruptions {explosives} mais également des éruptions {effusives}. Les principaux produits rejetés sont des {cendres}, des nuages de {poussières} pouvant faire des dizaines de mètres de hauteur, des coulées de {lave}. Il est considéré comme {l\'un des volcans les plus dangereux} du Chili.', leurres: ['le volcan le plus dangereux'],
    expl: 'C\'est l\'étiquette du Calbuco. Le piège : Calbuco est l\'un des volcans les plus dangereux du Chili ; le plus dangereux, c\'est le Villarica.' },
];

export const PRIO = {
  video: { id: 'chili', titre: 'Trois volcans du Chili, et le tableau en mots-clés', duree: 'à regarder avant tout le reste' },
  minutes: 6,
  prio: [
    ['Tableau = mots-clés ! (tiret)', 'Dans un tableau, pas de phrases : un mot-clé après chaque tiret.'],
    ['Osorno : éruptions effusives', '- lave - projections volcaniques'],
    ['Calbuco : éruptions explosives et effusives', '- lave - nuée ardente. L\'un des volcans les plus dangereux du Chili.'],
    ['Villarica : éruptions explosives', '- lave pâteuse - coulée pyroclastique. LE volcan le plus dangereux du Chili.'],
    ['Pourquoi le Villarica explose', 'Ses laves visqueuses coulent mal et forment des bouchons : quand la pression est trop forte, l\'éruption devient explosive.'],
  ],
  prof: [
    ['Complète le tableau à l\'aide des 3 documents : nom du volcan, type d\'éruption, caractéristiques de l\'éruption.', '<b>Volcan d\'Osorno</b> : effusives ; - lave - projections volcaniques.<br><b>Volcan Calbuco</b> : explosives et effusives ; - lave - nuée ardente.<br><b>Volcan Villarica</b> : explosives ; - lave pâteuse - coulée pyroclastique.<br>En mots-clés, avec des tirets : pas de phrases !', 'Tableau à compléter'],
    ['Dans l\'étiquette du volcan Calbuco, souligne les produits rejetés : « Le volcan Calbuco se caractérise principalement par des éruptions explosives mais également des éruptions effusives. Les principaux produits rejetés sont des cendres, des nuages de poussières pouvant faire des dizaines de mètres de hauteur, des coulées de lave. Il est considéré comme l\'un des volcans les plus dangereux du Chili. »', 'À souligner : <b>des cendres</b>, <b>des nuages de poussières</b> (pouvant faire des dizaines de mètres de hauteur), <b>des coulées de lave</b>. Le type d\'éruption et le danger ne sont pas des produits rejetés.', 'Souligner dans un texte'],
    ['Quel est le volcan le plus dangereux du Chili ?', 'Le volcan Villarica. Le Calbuco, lui, est considéré comme l\'un des volcans les plus dangereux du Chili.', 'Question courte'],
    ['Pourquoi l\'éruption du volcan Villarica devient-elle explosive ?', 'Les laves qu\'il émet, visqueuses, coulent mal et forment des bouchons. Quand la pression est trop forte, l\'éruption devient explosive. Des nuées de gaz brûlants, de roches et de poussières dévalent les pentes : les coulées pyroclastiques.', 'Explication', { schema: 'chili-villarica' }],
    ['Quels sont les principaux produits rejetés par le volcan d\'Osorno ?', 'De la lave, généralement inférieure à deux mètres d\'épaisseur, et des produits solides normalement noirs qui s\'accumulent en couches de plusieurs mètres près du cratère. En mots-clés : - lave - projections volcaniques.', 'Lecture d\'un document', { schema: 'chili-osorno' }],
  ],
};
