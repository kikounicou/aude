// Chapitre 3 : Les trois types de volcanisme. Source unique : cours/03-types-de-volcanisme.md, page 12 (tableau 2.3).
// La page 13 (planisphère) et le « Retenons » appartiennent au chapitre `zones`.
// Un fichier par chapitre : la leçon et les mots (CHAPITRE), les exercices (QUESTIONS), les priorités et questions de contrôle (PRIO).
// Formats : voir BRIEF-CHAPITRES.md à la racine du projet.
import { miniSVG } from '../../js/schemas/volcanisme.js';

// le petit schéma à refaire, montré dans la réponse d'une question de contrôle
const schemaReponse = (type) => `<span style="display:block;max-width:300px;margin:10px 0 2px;background:#fff;border:1px solid var(--trait);border-radius:12px;padding:6px">${miniSVG(type).replace('<svg ', '<svg style="display:block;width:100%;height:auto" ')}</span>`;

// une carte de « L'idée en 20 secondes » : l'icône, le nom, l'idée en trois mots
const carte = (id, nom, idee) => `<div style="text-align:center;min-width:0">{{schema:${id}}}<b style="display:block;font-size:15px;line-height:1.2">${nom}</b><small style="display:block;color:var(--encre2);line-height:1.25">${idee}</small></div>`;

export const CHAPITRE = {
  id: 'volcanisme', theme: 3, titre: 'Les trois types de volcanisme',
  accroche: 'Une plaque qui plonge, deux plaques qui s\'écartent, un magma qui perce la croûte : trois façons de faire naître un volcan.',
  etoiles: 3,
  sims: [{ id: 'volcanisme-mecanismes', titre: 'Les trois types de volcanisme', sous: 'Choisis un type, fais bouger les plaques et regarde le magma monter' }],
  lecon: `
<div class="bloc essentiel">
<h2>L'idée en 20 secondes</h2>
<p>Ton cours décrit <b>trois types de volcanisme</b>. Ce qui les distingue : ce que font les plaques.</p>
<div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:10px 0 12px">
${carte('volcanisme-icone-subduction', 'Subduction', 'une plaque <mark>plonge</mark> sous l\'autre')}
${carte('volcanisme-icone-accretion', 'Accrétion', 'deux plaques <mark>s\'écartent</mark>')}
${carte('volcanisme-icone-point-chaud', 'Point chaud', 'le magma <mark>perce</mark> la croûte')}
</div>
<p>Pour chaque type, tu dois savoir : son <b>nom</b>, son <b>explication</b>, un <b>exemple</b>, et refaire son <b>petit schéma</b>
(en bleu et en rouge).</p>
</div>

<div class="bloc">
<h2>Le tableau 2.3 en un coup d'œil</h2>
<table class="tab">
<tr><th>Type de volcanisme</th><th>Ce qui se passe</th><th>Exemples</th><th>Zones</th></tr>
<tr><td><b>Zone de volcanisme de subduction</b></td><td>les plaques se chevauchent : la plus lourde plonge sous la plus légère</td><td>Villarica, Etna</td><td>PM + CFP</td></tr>
<tr><td><b>Zone de volcanisme d'accrétion</b></td><td>deux plaques s'écartent : une fissure (rift/dorsale) se crée</td><td>Islande</td><td>DMA + RA</td></tr>
<tr><td><b>Volcanisme de point chaud</b></td><td>les remontées de magma percent la croûte terrestre</td><td>Hawaï</td><td>—</td></tr>
</table>
<p class="astuce"><b>Les abréviations</b> : <b>PM</b> = Pourtour méditerranéen · <b>CFP</b> = Ceinture de feu du Pacifique ·
<b>DMA</b> = Dorsale médio-Atlantique · <b>RA</b> = Rift africain. Tu les retrouves sur le planisphère des grandes zones de
volcanisme, dans le chapitre suivant.</p>
</div>

<div class="bloc">
<h2>1. La zone de volcanisme de subduction</h2>
<div class="deux">
<div>{{schema:volcanisme-subduction}}</div>
<div>
<p><b>Ce qui se passe :</b></p>
<ol style="margin:0 0 10px;padding-left:1.3em">
<li>Les plaques se <mark>chevauchent</mark>.</li>
<li>La plus <mark>lourde</mark> (océanique) <mark>plonge</mark> sous la plus <mark>légère</mark> (continentale).</li>
<li>En s'enfonçant dans le manteau terrestre, la plaque devient du <mark>magma</mark>…</li>
<li>… qui remonte → <b>volcan</b>.</li>
</ol>
<p><b>Exemples :</b> Villarica, Etna.<br><b>Zones :</b> PM + CFP (Pourtour méditerranéen + Ceinture de feu du Pacifique).</p>
<p class="astuce">Sur ce schéma, tu as ajouté à la main : <b>océan (72 %)</b>, <b>croûte</b>, <b>manteau</b> et
<b>cellule de convection</b>.</p>
</div>
</div>
<h3>Ton petit schéma à savoir refaire, pas à pas <small style="font-weight:600;color:var(--encre2)">(compare avec ta farde)</small></h3>
{{schema:volcanisme-pas-subduction}}
</div>

<div class="bloc">
<h2>2. La zone de volcanisme d'accrétion</h2>
<div class="deux">
<div>{{schema:volcanisme-accretion}}</div>
<div>
<p><b>Ce qui se passe :</b></p>
<ol style="margin:0 0 10px;padding-left:1.3em">
<li>Deux plaques <mark>s'écartent</mark>.</li>
<li>Une <mark>fissure</mark> (rift/dorsale) se crée.</li>
<li>Le <mark>magma</mark> remonte par cette fissure.</li>
</ol>
<p><b>Exemple :</b> l'Islande.<br><b>Zones :</b> DMA + RA (Dorsale médio-Atlantique + Rift africain).</p>
<p class="astuce">Ne confonds pas : en <b>subduction</b>, les plaques se <b>chevauchent</b> (l'une passe dessous) ; en
<b>accrétion</b>, elles <b>s'écartent</b>.</p>
</div>
</div>
<h3>Ton petit schéma à savoir refaire, pas à pas <small style="font-weight:600;color:var(--encre2)">(compare avec ta farde)</small></h3>
{{schema:volcanisme-pas-accretion}}
</div>

<div class="bloc">
<h2>3. Le volcanisme de point chaud</h2>
<div class="deux">
<div>{{schema:volcanisme-point-chaud}}</div>
<div>
<p><b>Ce qui se passe :</b></p>
<ol style="margin:0 0 10px;padding-left:1.3em">
<li>Les remontées de <mark>magma</mark> <mark>percent</mark> la croûte terrestre et forment le volcan <mark>effusif</mark>.</li>
<li>Suite aux mouvements des plaques, le premier volcan n'est plus <mark>alimenté</mark> : il <mark>s'éteint</mark>, se décale…</li>
<li>… et un autre se forme, jusqu'à <mark>épuisement</mark> du point chaud.</li>
</ol>
<p><b>Exemple :</b> Hawaï.</p>
<p class="astuce">Sur le schéma « Chaînon de volcans », le <b>volcan le plus jeune</b> est juste au-dessus du magma ; le
<b>volcan le plus vieux</b> est le plus loin. Sur ton petit schéma, le volcan entouré de rouge est celui qui est alimenté ;
l'autre est l'ancien volcan, qui s'est décalé avec la plaque.</p>
</div>
</div>
<h3>Ton petit schéma à savoir refaire, pas à pas <small style="font-weight:600;color:var(--encre2)">(compare avec ta farde)</small></h3>
{{schema:volcanisme-pas-point-chaud}}
</div>

<div class="bloc">
<h2>Les trois schémas, sur une feuille</h2>
<p>Prends un bic <b style="color:#2747b8">bleu</b> et un bic <b style="color:#d62839">rouge</b>.</p>
<ul style="margin:0 0 10px;padding-left:1.3em">
<li>En <b style="color:#2747b8">bleu</b> : la surface, les plaques, le volcan. (Sur ta feuille, les traits de la plaque du point chaud
sont repassés en noir : bleu ou noir, c'est la même idée.)</li>
<li>En <b style="color:#d62839">rouge</b> : le magma qui monte et les boucles de convection.</li>
</ul>
<p class="astuce">Refais les trois schémas sans regarder, puis compare avec la case 4 de chaque « pas à pas ». Recommence
celui que tu as raté.</p>
<p class="astuce" style="border:2px solid var(--chaud)"><b>Vérifie bien dans ta farde.</b> Ces trois petits schémas sont refaits d'après une photo
de ta feuille : il n'est pas sûr qu'ils soient reproduits exactement (le sens des boucles, la flèche du point chaud).
Si ton dessin est différent, <b>c'est ta feuille qui a raison</b>.</p>
</div>

<div class="retiens">
<p><b>Zone de volcanisme de subduction</b> (ex. : Villarica, Etna ; PM + CFP) : là où les plaques se
<mark>chevauchent</mark>, la plus lourde (océanique) plonge sous la plus légère (continentale). En s'enfonçant dans le
manteau terrestre, la plaque devient du magma qui remonte… → volcan.</p>
<p><b>Zone de volcanisme d'accrétion</b> (ex. : Islande ; DMA + RA) : quand deux plaques <mark>s'écartent</mark>, une
fissure (rift/dorsale) se crée, par laquelle le magma remonte…</p>
<p><b>Volcanisme de point chaud</b> (ex. : Hawaï) : ce sont les remontées de magma qui <mark>percent</mark> la croûte
terrestre et forment le volcan effusif. Suite aux mouvements des plaques, le premier volcan n'est plus alimenté, il
s'éteint, se décale et un autre se forme jusqu'à épuisement du point chaud.</p>
</div>`,
  mots: [
    ['Zone de volcanisme de subduction', 'Là où les plaques se chevauchent, la plus lourde (océanique) plonge sous la plus légère (continentale) ; en s\'enfonçant, elle devient du magma qui remonte → volcan.'],
    ['Zone de volcanisme d\'accrétion', 'Quand deux plaques s\'écartent, une fissure (rift/dorsale) se crée, par laquelle le magma remonte.'],
    ['Volcanisme de point chaud', 'Les remontées de magma percent la croûte terrestre et forment le volcan effusif. Les plaques bougent : le volcan s\'éteint, se décale, un autre se forme.'],
    ['Fissure (rift/dorsale)', 'Ce qui se crée quand deux plaques s\'écartent : le magma remonte par là.'],
    ['PM + CFP', 'Pourtour méditerranéen + Ceinture de feu du Pacifique : les zones du volcanisme de subduction.'],
    ['DMA + RA', 'Dorsale médio-Atlantique + Rift africain : les zones du volcanisme d\'accrétion.'],
    ['Volcan le plus jeune', 'Sur le schéma « Chaînon de volcans » : celui qui est juste au-dessus des remontées de magma.'],
  ],
};

export const QUESTIONS = [
  { type: 'classer', prio: true, q: 'Range chaque élément dans son type de volcanisme.', categories: ['Subduction', 'Accrétion', 'Point chaud'],
    items: [{ t: 'Villarica', c: 0 }, { t: 'Etna', c: 0 }, { t: 'PM + CFP', c: 0 }, { t: 'la plus lourde plonge sous la plus légère', c: 0 },
      { t: 'Islande', c: 1 }, { t: 'DMA + RA', c: 1 }, { t: 'une fissure (rift/dorsale) se crée', c: 1 },
      { t: 'Hawaï', c: 2 }, { t: 'le magma perce la croûte terrestre', c: 2 }],
    expl: 'Subduction : Villarica, Etna, PM + CFP, une plaque plonge. Accrétion : Islande, DMA + RA, une fissure. Point chaud : Hawaï, le magma perce la croûte terrestre.' },
  { type: 'relier', prio: true, q: 'Relie chaque type de volcanisme à son explication.', paires: [
    ['Zone de volcanisme de subduction', 'Là où les plaques se chevauchent, la plus lourde (océanique) plonge sous la plus légère (continentale).'],
    ['Zone de volcanisme d\'accrétion', 'Quand deux plaques s\'écartent, une fissure (rift/dorsale) se crée.'],
    ['Volcanisme de point chaud', 'Les remontées de magma percent la croûte terrestre et forment le volcan effusif.']],
    expl: 'Subduction = les plaques se chevauchent, l\'une plonge. Accrétion = elles s\'écartent. Point chaud = le magma perce la croûte terrestre.' },
  { type: 'ecrire', prio: true, q: 'Ce petit schéma de ton cours : quel type de volcanisme montre-t-il ?', vis: 'volcanisme-icone-accretion',
    reponses: ['zone de volcanisme d\'accrétion', 'volcanisme d\'accrétion', 'zone d\'accrétion', 'accrétion', 'la zone de volcanisme d\'accrétion', 'zone de volcanisme par accrétion'],
    expl: 'Les deux flèches bleues partent en sens opposés (← →) : les plaques s\'écartent. C\'est la zone de volcanisme d\'accrétion.' },
  { type: 'qcm', prio: true, q: 'Et ce petit schéma-ci, quel type de volcanisme montre-t-il ?', vis: 'volcanisme-icone-point-chaud',
    choix: ['le volcanisme de point chaud', 'la zone de volcanisme de subduction', 'la zone de volcanisme d\'accrétion'], bonne: 0,
    expl: 'Le magma (en rouge) perce la plaque (les trois traits) ; la flèche montre que la plaque bouge, et l\'ancien volcan s\'est décalé : c\'est le volcanisme de point chaud.' },
  { type: 'legende', prio: true, q: 'Légende ton petit schéma de subduction.', schema: 'volcanisme-mini-subduction', leurres: ['la plaque qui s\'écarte'],
    expl: 'En bleu : la surface (1), le volcan qui fume (2), la flèche qui descend en biais = la plaque qui plonge (3). En rouge : le magma qui remonte sous le volcan (4) et les cellules de convection (5).' },
  { type: 'legende', prio: true, q: 'Légende ton petit schéma d\'accrétion.', schema: 'volcanisme-mini-accretion', leurres: ['la plaque qui plonge'],
    expl: 'En bleu : les deux flèches ← → = les deux plaques qui s\'écartent (1), le volcan entre les deux (2). En rouge : le magma qui remonte (3) et une boucle de convection de chaque côté (4).' },
  { type: 'legende', prio: true, q: 'Légende ton petit schéma de point chaud.', schema: 'volcanisme-mini-point-chaud',
    expl: 'Les trois traits bleus = la plaque (1) ; la flèche = la plaque se déplace (2). Le volcan entouré de rouge est alimenté, juste au-dessus du magma (3) ; l\'autre est l\'ancien volcan, éteint et décalé (4). En rouge : le magma qui perce la croûte (5) et les cellules de convection (6).' },
  { type: 'trous', banque: true, prio: true, texte: 'Là où les plaques se {chevauchent}, la plus {lourde} (océanique) plonge sous la plus {légère} ({continentale}). En s\'enfonçant dans le {manteau} terrestre, la plaque devient du {magma} qui remonte… → volcan.', leurres: ['s\'écartent', 'croûte'],
    expl: 'C\'est l\'explication de la zone de volcanisme de subduction : la plaque la plus lourde, océanique, plonge sous la plus légère, continentale.' },
  { type: 'trous', prio: true, texte: 'Quand deux plaques s\'{écartent}, une {fissure} (rift/{dorsale}) se crée, par laquelle le {magma} remonte…',
    expl: 'C\'est l\'explication de la zone de volcanisme d\'accrétion : deux plaques s\'écartent, une fissure (rift/dorsale) se crée, le magma remonte.' },
  { type: 'ordre', prio: true, q: 'Volcanisme de point chaud : remets l\'histoire dans l\'ordre.', etapes: [
    'Les remontées de magma percent la croûte terrestre.', 'Elles forment le volcan effusif.', 'Suite aux mouvements des plaques, le premier volcan n\'est plus alimenté.',
    'Il s\'éteint et se décale.', 'Un autre volcan se forme.', 'Et ainsi de suite, jusqu\'à épuisement du point chaud.'],
    expl: 'Ton cours : « Ce sont les remontées de magma qui percent la croûte terrestre et forment le volcan effusif. Suite aux mouvements des plaques, le premier volcan n\'est plus alimenté, il s\'éteint, se décale et un autre se forme jusqu\'à épuisement du point chaud. »' },
  { type: 'relier', prio: true, q: 'Que veulent dire ces abréviations ?', paires: [['PM', 'Pourtour méditerranéen'], ['CFP', 'Ceinture de feu du Pacifique'], ['DMA', 'Dorsale médio-Atlantique'], ['RA', 'Rift africain']],
    expl: 'PM + CFP : les zones de la subduction. DMA + RA : les zones de l\'accrétion.' },
  { type: 'vf', prio: true, q: 'Dans une zone de subduction, c\'est la plaque la plus légère (continentale) qui plonge sous la plus lourde.', vrai: false,
    expl: 'Faux : c\'est l\'inverse. La plus lourde (océanique) plonge sous la plus légère (continentale).' },
  { type: 'ordre', q: 'Zone de volcanisme de subduction : remets les étapes dans l\'ordre.', etapes: [
    'Les plaques se chevauchent.', 'La plus lourde (océanique) plonge sous la plus légère (continentale).', 'Elle s\'enfonce dans le manteau terrestre.', 'La plaque devient du magma.', 'Le magma remonte… → volcan.'],
    expl: 'Ton cours : « Là où les plaques se chevauchent, la plus lourde (océanique) plonge sous la plus légère (continentale). En s\'enfonçant dans le manteau terrestre, la plaque devient du magma qui remonte… → volcan. »' },
  { type: 'trous', banque: true, texte: 'Ce sont les remontées de {magma} qui percent la {croûte} terrestre et forment le volcan {effusif}. Suite aux mouvements des {plaques}, le premier volcan n\'est plus {alimenté}, il s\'éteint, se {décale} et un autre se forme jusqu\'à {épuisement} du point chaud.', leurres: ['explosif', 'manteau'],
    expl: 'C\'est l\'explication du volcanisme de point chaud : le premier volcan n\'est plus alimenté, il s\'éteint, se décale, et un autre se forme.' },
  { type: 'qcm', q: 'Sur le schéma « Chaînon de volcans », quel est le volcan le plus jeune ?', vis: 'volcanisme-point-chaud',
    choix: ['le volcan 2, juste au-dessus des remontées de magma', 'le volcan 1, le plus loin des remontées de magma', 'le volcan qui est au milieu de la chaîne', 'ils ont tous le même âge'], bonne: 0,
    expl: 'Le volcan le plus jeune (2) est celui qui est au-dessus du magma : il est alimenté. La plaque glisse (flèche 4) et emporte les anciens volcans : le plus vieux (1) est le plus loin.' },
  { type: 'vf', q: 'Au point chaud, le premier volcan reste alimenté, même quand la plaque bouge.', vrai: false,
    expl: 'Faux. Suite aux mouvements des plaques, le premier volcan n\'est plus alimenté : il s\'éteint, se décale, et un autre se forme.' },
  { type: 'vf', q: 'Dans une zone d\'accrétion, une fissure se crée : on l\'appelle rift ou dorsale.', vrai: true,
    expl: 'Vrai. Quand deux plaques s\'écartent, une fissure (rift/dorsale) se crée, par laquelle le magma remonte.' },
  { type: 'ecrire', q: 'Quel exemple de volcanisme de point chaud ton cours donne-t-il ?', reponses: ['Hawaï', 'Hawai', 'Hawaii', 'les îles Hawaï', 'îles Hawaï', 'Hawaï (point chaud)'],
    expl: 'L\'exemple du cours pour le volcanisme de point chaud : Hawaï.' },
  { type: 'qcm', q: 'L\'Islande est un exemple de…', choix: ['zone de volcanisme d\'accrétion', 'zone de volcanisme de subduction', 'volcanisme de point chaud'], bonne: 0,
    expl: 'Dans ton cours, l\'Islande est l\'exemple de la zone de volcanisme d\'accrétion (DMA + RA) : deux plaques s\'écartent.' },
  { type: 'classer', q: 'Sur tes petits schémas, qu\'est-ce qui se dessine en bleu, et qu\'est-ce qui se dessine en rouge ?', vis: 'volcanisme-icone-subduction', categories: ['en bleu', 'en rouge'],
    items: [{ t: 'la surface', c: 0 }, { t: 'les plaques', c: 0 }, { t: 'le volcan', c: 0 }, { t: 'le magma qui monte', c: 1 }, { t: 'les boucles de convection', c: 1 }],
    expl: 'En bleu : la surface, les plaques, le volcan. En rouge : le magma qui monte et les boucles (cellules) de convection.' },
  { type: 'legende', q: 'Légende le schéma de la ligne 1 (subduction), avec les mots imprimés et ceux que tu as ajoutés à la main.', schema: 'volcanisme-subduction',
    expl: 'Imprimés : volcans d\'arc insulaire, magma, fusion partielle de la lithosphère. Ajoutés à la main : océan (72 %), croûte, manteau, cellule de convection.' },
];

export const PRIO = {
  video: { id: 'volcanisme', titre: 'Les trois types de volcanisme', duree: 'à regarder avant tout le reste' },
  minutes: 10,
  prio: [
    ['Subduction : une plaque plonge', 'Là où les plaques se chevauchent, la plus lourde (océanique) plonge sous la plus légère (continentale) et devient du magma qui remonte → volcan. Ex. : Villarica, Etna. PM + CFP.'],
    ['Accrétion : deux plaques s\'écartent', 'Une fissure (rift/dorsale) se crée, par laquelle le magma remonte. Ex. : Islande. DMA + RA.'],
    ['Point chaud : le magma perce la croûte', 'Il forme le volcan effusif. La plaque bouge : le premier volcan n\'est plus alimenté, il s\'éteint, se décale, un autre se forme. Ex. : Hawaï.'],
    ['Les trois petits schémas', 'En bleu : la surface, les plaques, le volcan. En rouge : le magma qui monte et les boucles de convection.'],
    ['Les abréviations', 'PM = Pourtour méditerranéen · CFP = Ceinture de feu du Pacifique · DMA = Dorsale médio-Atlantique · RA = Rift africain.'],
  ],
  prof: [
    ['Détermine le type de volcanisme de ce schéma et explique-le.', 'C\'est la <b>zone de volcanisme de subduction</b>. Là où les plaques se chevauchent, la plus lourde (océanique) plonge sous la plus légère (continentale). En s\'enfonçant dans le manteau terrestre, la plaque devient du magma qui remonte… → volcan. Exemples : Villarica, Etna. Son petit schéma :' + schemaReponse('subduction'), 'Tableau 2.3 à compléter', { schema: 'volcanisme-subduction' }],
    ['Fais le schéma de la zone de volcanisme d\'accrétion.', 'En bleu : deux flèches qui partent en sens opposés (← →), les deux plaques qui s\'écartent, et un petit volcan qui fume entre les deux. En rouge : le magma qui monte sous le volcan, et une boucle de convection de chaque côté.' + schemaReponse('accretion'), 'Schéma à refaire'],
    ['Fais le schéma du volcanisme de point chaud.', 'En bleu : trois traits épais l\'un sous l\'autre (la plaque), une petite flèche (la plaque se déplace), deux petits volcans côte à côte. En rouge : le magma qui traverse la plaque jusqu\'au volcan alimenté (entouré de rouge), et une boucle de convection de chaque côté.' + schemaReponse('point-chaud'), 'Schéma à refaire'],
    ['Explique comment se forme une chaîne de volcans de point chaud.', 'Ce sont les remontées de magma qui percent la croûte terrestre et forment le volcan effusif. Suite aux mouvements des plaques, le premier volcan n\'est plus alimenté, il s\'éteint, se décale et un autre se forme jusqu\'à épuisement du point chaud.', 'Explication', { schema: 'volcanisme-point-chaud' }],
    ['Donne un exemple pour chaque type de volcanisme.', 'Zone de volcanisme de subduction : Villarica, Etna. Zone de volcanisme d\'accrétion : l\'Islande. Volcanisme de point chaud : Hawaï.', 'Question courte'],
    ['Que veulent dire PM + CFP et DMA + RA ?', 'PM = Pourtour méditerranéen et CFP = Ceinture de feu du Pacifique : les zones de volcanisme de subduction. DMA = Dorsale médio-Atlantique et RA = Rift africain : les zones de volcanisme d\'accrétion.', 'Abréviations'],
  ],
};
