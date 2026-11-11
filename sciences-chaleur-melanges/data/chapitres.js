// Les chapitres : la leçon, les « JE RETIENS » du cours (mot pour mot), les mots à retenir, les expériences.
// Source unique : cours/05-ca-va-chauffer.md et cours/06-les-melanges.md.
// Dans les textes : <mark>mot</mark> = mot à retenir (fluo). {{schema:id}} = schéma légendé (js/schemas.js).

export const THEMES = {
  5: { titre: 'Ça va chauffer…', sous: 'Chaleur, température, changements d\'état' },
  6: { titre: 'Les mélanges, pas toujours une solution ?', sous: 'Mélanges, séparations, dissolution' },
};

export const CHAPITRES = [
  /* ======================= THÈME 5 ======================= */
  {
    id: 'energie', theme: 5, titre: 'Réservoir, transformateur, receveur',
    accroche: 'D\'où vient la chaleur du salon d\'Églantine ? On suit l\'énergie à la trace.',
    etoiles: 2,
    sims: [{ id: 'chaine-energie', titre: 'La chaîne d\'énergie', sous: 'Construis la chaîne qui chauffe le salon' }],
    lecon: `
<div class="bloc essentiel">
  <h2>L'idée en 20 secondes</h2>
  <p>Pour chauffer quelque chose, il faut une <b>chaîne</b> : on part d'un <mark>réservoir</mark> d'énergie, on passe par un ou
  plusieurs <mark>transformateurs</mark>, et on arrive au <mark>receveur</mark>.</p>
  <p>Exemple du cours : <b>bûches de bois</b> (réservoir) → <i>énergie chimique</i> → <b>feu ouvert</b> (transformateur) →
  <i>énergie thermique et énergie lumineuse</i> → <b>salon d'Églantine</b> (receveur).</p>
</div>
<div class="bloc">
  <h2>Les réservoirs naturels</h2>
  <p>Il existe dans la nature des sources d'énergie thermique, ce sont des <mark>réservoirs naturels</mark> :</p>
  <ul><li>le soleil ;</li><li>le charbon, le gaz naturel, le pétrole ;</li><li>les aliments, …</li></ul>
  <h3>Dans le texte d'Églantine</h3>
  <table class="tab">
    <tr><th>Réservoirs naturels (soulignés)</th><th>Transformateurs (encadrés)</th></tr>
    <tr><td>le soleil · la raclette, la fondue (aliments) · le charbon · le mazout · les bûches de bois</td>
        <td>Églantine (« elle ») · la cuisinière électrique · la chaudière · le feu ouvert</td></tr>
  </table>
  <p class="astuce">Objet pour lequel on hésite : <b>la laine</b> (le tapis du chien). Elle ne produit pas de chaleur.</p>
</div>
<div class="retiens">
  <p>La production d'énergie thermique a pour but de fournir cette énergie à un <mark>receveur</mark>.</p>
  <p>Pour atteindre cet objectif, il est nécessaire de partir d'un <mark>réservoir</mark> d'énergie accompagné d'un ou de plusieurs
  <mark>transformateurs</mark>.</p>
  <p>Un transformateur reçoit de l'énergie sous une certaine forme et la restitue sous la même forme ou sous une autre forme.</p>
  <p>Le receveur est le dernier objet d'un montage, il reçoit l'énergie sous la forme appropriée à la finalité recherchée.</p>
  <p>Dans un montage, on constate une production non désirée d'énergie thermique (échauffement des objets). Cette énergie thermique
  non désirée, perdue pour le montage est une <mark>forme dégradée d'énergie</mark>.</p>
</div>`,
    mots: [
      ['Réservoir', 'Le point de départ de la chaîne : il contient l\'énergie. Réservoirs naturels : le soleil ; le charbon, le gaz naturel, le pétrole ; les aliments.'],
      ['Transformateur', 'Il reçoit de l\'énergie sous une certaine forme et la restitue sous la même forme ou sous une autre forme.'],
      ['Receveur', 'Le dernier objet d\'un montage : il reçoit l\'énergie sous la forme appropriée à la finalité recherchée.'],
      ['Forme dégradée d\'énergie', 'L\'énergie thermique non désirée (échauffement des objets), perdue pour le montage.'],
    ],
  },
  {
    id: 'thermoscope', theme: 5, titre: 'Chaud ou froid ? Le thermoscope',
    accroche: 'Ta peau se trompe. Le thermoscope, lui, compare sans tricher.',
    etoiles: 2,
    sims: [{ id: 'thermoscope', titre: 'Le thermoscope', sous: 'Plonge-le dans les 3 béchers et regarde le niveau' }],
    lecon: `
<div class="bloc essentiel">
  <h2>L'idée en 20 secondes</h2>
  <p>Les sensations de chaud ou de froid sont perçues par la peau de façon différente et sont <mark>subjectives</mark>.</p>
  <p>Un <mark>thermoscope</mark> (un ballon, un bouchon, un tube en verre fin, de l'eau colorée, un repère) permet de
  <b>comparer</b> : plus la température est élevée et plus l'eau colorée monte dans le tube.</p>
</div>
<div class="deux">
  <div class="bloc">
    <h2 style="color:var(--chaud)">Ça chauffe → dilatation</h2>
    <p>La <b>chaleur</b> de l'eau du bécher se transmet au thermoscope : le niveau d'eau colorée <b>s'élève</b>.</p>
    <p>Les <b>molécules</b> d'eau colorée reçoivent un supplément d'<b>énergie</b>, leur <mark>agitation moléculaire</mark>
    augmente. Elles occupent alors plus d'espace. C'est le phénomène de <mark>dilatation</mark>.</p>
  </div>
  <div class="bloc">
    <h2 style="color:var(--froid)">Ça refroidit → contraction</h2>
    <p>C'est l'eau colorée qui <b>transmet</b> son énergie à l'eau du bécher : l'agitation moléculaire <b>diminue</b>.</p>
    <p>Le liquide coloré occupe alors moins de place donc le niveau d'eau colorée <b>descend</b>. C'est le phénomène de
    <mark>contraction</mark>.</p>
  </div>
</div>
<div class="bloc">
  <h2>Les 2 variables de l'expérience</h2>
  <ul><li>la température ;</li><li>le niveau d'eau colorée.</li></ul>
  <p>Relation : <b>plus la température est élevée et plus l'eau colorée monte dans le tube.</b></p>
</div>
<div class="retiens">
  <p>Le thermoscope est un instrument qui permet de <mark>comparer</mark> de façon objective le niveau de chaud et de froid de
  différents corps.</p>
  <p>Si le niveau du thermoscope est plus élevé pour un corps A que pour un corps B, alors le niveau thermique du corps A est plus
  élevé que celui du corps B : la température du corps A est plus élevée que celle du corps B.</p>
</div>
<div class="bloc">
  <h2>La dilatation dans la vraie vie</h2>
  <table class="tab">
    <tr><th>Question</th><th>Réponse du cours</th></tr>
    <tr><td>Pourquoi existe-t-il un espace entre 2 rails ?</td><td>Pour éviter que les rails se déforment lors d'une élévation importante de la température (à cause de la dilatation).</td></tr>
    <tr><td>Quel est le rôle de la grille sur le tablier des ponts ?</td><td>L'espace permet les mouvements du tablier du pont suite à une élévation importante de la température (dilatation).</td></tr>
    <tr><td>Pourquoi la toile de la montgolfière se gonfle-t-elle si on lui fournit de la chaleur ?</td><td>Le brûleur chauffe l'air qui en se dilatant occupe plus de place et gonfle le ballon.</td></tr>
  </table>
</div>`,
    mots: [
      ['Thermoscope', 'Instrument qui permet de comparer de façon objective le niveau de chaud et de froid de différents corps. Il n\'a pas de graduations.'],
      ['Dilatation', 'Les molécules reçoivent un supplément d\'énergie, leur agitation moléculaire augmente, elles occupent plus d\'espace.'],
      ['Contraction', 'L\'agitation moléculaire diminue, le liquide occupe moins de place : le niveau descend.'],
      ['Agitation moléculaire', 'Le mouvement des molécules. Elle augmente quand les molécules reçoivent de l\'énergie.'],
      ['Subjectif', 'Qui dépend de la personne : les sensations de chaud ou de froid perçues par la peau sont subjectives.'],
    ],
  },
  {
    id: 'thermometre', theme: 5, titre: 'Le thermomètre et l\'échelle Celsius',
    accroche: 'Un thermoscope + des graduations = un thermomètre. Mais comment a-t-on choisi le 0 et le 100 ?',
    etoiles: 2,
    sims: [{ id: 'thermometre', titre: 'Gradue ton thermomètre', sous: 'Deux repères suffisent : 0 et 100' }],
    lecon: `
<div class="bloc essentiel">
  <h2>L'idée en 20 secondes</h2>
  <p>La sensation de froid ou de chaud acquise par notre sens du toucher est <b>imprécise</b> : il faut un thermomètre pour un
  repérage précis d'une température.</p>
  <p>Le thermomètre ressemble très fort à un thermoscope avec les <mark>graduations</mark> en plus. Pour le graduer, on a besoin de
  <mark>2 repères</mark>.</p>
</div>
<div class="deux">
  <div class="bloc">
    <h2>Les 4 parties du thermomètre</h2>
    {{schema:thermometre}}
  </div>
  <div class="bloc">
    <h2>Les 2 repères</h2>
    <table class="tab">
      <tr><th>Repère</th><th>Température connue sans thermomètre</th></tr>
      <tr><td><b>0 °C</b></td><td>la température de la <mark>glace fondante</mark> (mélange eau + glace)</td></tr>
      <tr><td><b>100 °C</b></td><td>la température de la vapeur d'eau, au-dessus de l'<mark>eau en ébullition</mark></td></tr>
    </table>
    <p>La lettre <b>C</b> sur le thermomètre désigne les degrés <mark>Celsius</mark> (°C).</p>
    <p>Chez nous, c'est l'échelle Celsius qui est utilisée mais l'échelle Fahrenheit est d'application dans d'autres pays et il en
    existe encore d'autres.</p>
  </div>
</div>
<div class="retiens">
  <p>Pour uniformiser les comparaisons, on a besoin de recourir à une <mark>échelle</mark>, donc de déterminer <mark>deux repères</mark>.</p>
  <p>Le thermomètre est un thermoscope gradué qui permet de repérer la température.</p>
  <p>Dans nos pays, <mark>l'échelle Celsius</mark> est utilisée.</p>
  <p>À la pression atmosphérique normale, le repère 0 correspond à la température de la glace fondante et le repère 100 correspond
  à la température de l'eau en ébullition.</p>
</div>`,
    mots: [
      ['Thermomètre', 'Un thermoscope gradué qui permet de repérer la température.'],
      ['Échelle Celsius', 'L\'échelle utilisée dans nos pays. Repère 0 : glace fondante. Repère 100 : eau en ébullition (à la pression atmosphérique normale).'],
      ['Repère 0', 'La température de la glace fondante (mélange eau + glace).'],
      ['Repère 100', 'La température de l\'eau en ébullition.'],
      ['Tube capillaire', 'Le tube très fin du thermomètre dans lequel le liquide monte.'],
      ['Réservoir (du thermomètre)', 'La partie du bas, qui contient le mercure ou l\'alcool coloré.'],
    ],
  },
  {
    id: 'chaleur-temperature', theme: 5, titre: 'Chaleur ≠ température',
    accroche: 'Le piège préféré des contrôles : deux mots qu\'on confond tout le temps.',
    etoiles: 3,
    sims: [{ id: 'deux-bechers', titre: 'Les deux béchers', sous: 'Même chaleur, températures différentes' }],
    lecon: `
<div class="bloc essentiel">
  <h2>L'idée en 20 secondes</h2>
  <p>La <mark>chaleur</mark> est une <b>forme d'énergie</b> (l'énergie thermique) : on la fournit, on la reçoit, on la perd.</p>
  <p>La <mark>température</mark> exprime le <b>niveau thermique</b> d'un corps : on la repère avec un thermomètre, en °C.</p>
  <p class="astuce"><b>Astuce :</b> la chaleur, ça <i>se donne</i> (« fournit de la chaleur ») ; la température, ça <i>se lit</i>
  (« 37,6 °C est la température »).</p>
</div>
<div class="bloc">
  <h2>Manipulation 4 : même chaleur, pas la même température</h2>
  <p>Deux béchers sur la même source de chaleur : 50 mL d'eau (thermomètre 1) et 100 mL d'eau (thermomètre 2).</p>
  <table class="tab">
    <tr><th></th><th>thermomètre 1 (50 mL)</th><th>thermomètre 2 (100 mL)</th></tr>
    <tr><td>Avant de chauffer</td><td>17 °C</td><td>17 °C</td></tr>
    <tr><td>1 minute</td><td>30 °C</td><td>28 °C</td></tr>
    <tr><td>2 minutes</td><td>62 °C</td><td>47 °C</td></tr>
    <tr><td>3 minutes</td><td>80 °C</td><td>56 °C</td></tr>
    <tr><td>4 minutes</td><td>95 °C</td><td>66 °C</td></tr>
    <tr><td>5 minutes</td><td>95 °C</td><td>81 °C</td></tr>
  </table>
  <p><b>Constatation :</b> la température repérée dans les deux berlins ne varie pas de la même manière. Après 5 minutes, on repère
  une température plus élevée sur le thermomètre 1.</p>
  <p><b>Conclusion :</b> nous avons apporté la même quantité de chaleur à l'eau contenue dans les berlins et pourtant la température
  de l'eau n'est pas la même : <mark>chaleur et température sont donc deux grandeurs différentes</mark>.</p>
</div>
<div class="bloc">
  <h2>Manipulation 5 : on chauffe encore… et la température ne bouge plus</h2>
  <p>À partir de l'ébullition, on note la température toutes les 30 secondes : 100 °C, 100 °C, 100 °C, 100 °C.</p>
  <p><b>Constatation :</b> la quantité de chaleur fournie à l'eau augmente et pourtant la température de celle-ci ne varie plus.</p>
  <p><b>Conclusion :</b> <mark>chaleur et température sont deux notions différentes mais liées</mark>.</p>
</div>
<div class="bloc">
  <h2>Interpréter des données</h2>
  <table class="tab">
    <tr><th>Expérience</th><th>Liquide chauffé</th><th>Masse</th><th>Durée</th><th>T° initiale</th><th>T° finale</th></tr>
    <tr><td>1</td><td>eau</td><td>250 g</td><td>5 min</td><td>20 °C</td><td>69 °C</td></tr>
    <tr><td>2</td><td>eau</td><td>500 g</td><td>5 min</td><td>20 °C</td><td>45 °C</td></tr>
    <tr><td>3</td><td>huile</td><td>250 g</td><td>5 min</td><td>20 °C</td><td>93 °C</td></tr>
  </table>
  <p>Les 3 liquides ont reçu la même quantité de chaleur, car le temps de chauffe est identique (5 minutes).</p>
  <p>Une même quantité de <b>chaleur</b> provoque une élévation de <b>température</b> différente suivant la <mark>masse</mark> du
  liquide chauffé et suivant sa <mark>nature</mark>.</p>
</div>
<div class="bloc">
  <h2>J'utilise correctement les deux mots</h2>
  <p>Le soleil est la source de <mark>chaleur</mark> qui fait grimper la <mark>température</mark>. Le feu de bois dans le salon
  d'Églantine fournit de la <mark>chaleur</mark> au salon. 37,6 °C est la <mark>température</mark> du corps humain. La doudoune
  d'Églantine ralentit les échanges de <mark>chaleur</mark> entre son corps et l'extérieur et lui permet de garder sa
  <mark>température</mark> constante.</p>
</div>
<div class="retiens">
  <p>La <mark>chaleur</mark> est une forme d'énergie appelée <mark>énergie thermique</mark>.<br>
  Cette énergie est capable de produire une élévation de température en favorisant une dilatation ou en provoquant un changement
  d'état de la matière.</p>
  <p>La <mark>température</mark> d'un corps exprime le <mark>niveau thermique</mark> de ce corps. C'est une grandeur basée sur une
  comparaison : plus chaud que…, moins chaud que…</p>
</div>`,
    mots: [
      ['Chaleur', 'Une forme d\'énergie appelée énergie thermique. Elle est capable de produire une élévation de température en favorisant une dilatation ou en provoquant un changement d\'état de la matière.'],
      ['Température', 'Elle exprime le niveau thermique d\'un corps. C\'est une grandeur basée sur une comparaison : plus chaud que…, moins chaud que…'],
      ['Énergie thermique', 'L\'autre nom de la chaleur.'],
      ['Masse et nature', 'Une même quantité de chaleur provoque une élévation de température différente suivant la masse du liquide chauffé et suivant sa nature.'],
    ],
  },
  {
    id: 'etats', theme: 5, titre: 'Les changements d\'état',
    accroche: 'Solide, liquide, gazeux : six passages, six noms à connaître sur le bout des doigts.',
    etoiles: 3,
    sims: [
      { id: 'etats-matiere', titre: 'Les 3 états de la matière', sous: 'Chauffe, refroidis et regarde les molécules' },
      { id: 'cycle-eau', titre: 'Le cycle de l\'eau', sous: 'Où se cachent les changements d\'état ?' },
    ],
    lecon: `
<div class="bloc essentiel">
  <h2>L'idée en 20 secondes</h2>
  <p>La matière peut se présenter sous <b>3 états</b> : l'état <mark>solide</mark>, l'état <mark>liquide</mark> et l'état
  <mark>gazeux</mark>. Une matière qui reçoit ou perd de la chaleur peut changer d'état.</p>
  <p>Point commun entre un liquide et un gaz : <b>les molécules se déplacent</b>. Un corps dont les molécules se déplacent sera
  appelé <mark>FLUIDE</mark> (par opposition au solide).</p>
</div>
<div class="bloc">
  <h2>Le triangle à connaître par cœur</h2>
  {{schema:triangle}}
  <p class="attention"><b>Attention :</b> dans ton cours, « <b>condensation</b> » sert deux fois : gaz → liquide <b>et</b> gaz →
  solide. Et la <b>vaporisation</b> peut se faire de deux façons : par <b>évaporation</b> ou par <b>ébullition</b>.</p>
</div>
<div class="bloc">
  <h2>La manipulation (marquée ⚠ dans ton cours)</h2>
  <table class="tab">
    <tr><th>Ce qu'on fait</th><th>Ce qu'on observe</th><th>Interprétation</th><th>Phénomène</th></tr>
    <tr><td>Les glaçons chauffent dans le bécher</td><td>les glaçons fondent</td><td>l'eau passe de l'état solide à l'état liquide</td><td><mark>FUSION</mark></td></tr>
    <tr><td>L'eau bout</td><td>des bulles se forment au sein du liquide ; de la vapeur se dégage</td><td>c'est l'ébullition : l'eau passe, au sein du liquide, de l'état liquide à l'état gazeux</td><td><mark>VAPORISATION</mark></td></tr>
    <tr><td>Quelques gouttes d'éther dans un verre de montre</td><td>après quelques minutes le liquide a disparu</td><td>c'est l'évaporation : l'éther est passé, à la surface du liquide, de l'état liquide à l'état gazeux</td><td><mark>VAPORISATION</mark></td></tr>
    <tr><td>Le verre de montre posé au-dessus de l'eau qui bout</td><td>des gouttes apparaissent</td><td>l'eau passe de l'état gazeux à l'état liquide</td><td><mark>CONDENSATION</mark></td></tr>
    <tr><td>Un bloc réfrigérant sorti du congélateur</td><td>du givre apparaît sur le bloc</td><td>l'eau contenue dans l'air ambiant passe de l'état gazeux à l'état solide</td><td><mark>CONDENSATION</mark></td></tr>
    <tr><td>Une ou deux gouttes d'eau sur le bloc réfrigérant</td><td>les gouttes d'eau gèlent</td><td>l'eau passe de l'état liquide à l'état solide</td><td><mark>SOLIDIFICATION</mark></td></tr>
    <tr><td>La tige chauffée d'une cuillère à combustion posée sur un glaçon</td><td>la glace se transforme en vapeur</td><td>l'eau passe de l'état solide à l'état gazeux</td><td><mark>SUBLIMATION</mark></td></tr>
  </table>
</div>
<div class="retiens">
  <p>Une matière qui reçoit ou perd de la chaleur peut changer d'état.<br>Les changements d'états sont donc des
  <mark>phénomènes réversibles</mark> :</p>
  <ul>
    <li>la <mark>fusion</mark> est le passage de l'état solide à l'état liquide ;</li>
    <li>la <mark>solidification</mark> est le passage de l'état liquide à l'état solide ;</li>
    <li>la <mark>vaporisation</mark> est le passage de l'état liquide à l'état gazeux ; elle peut se faire par évaporation ou par
      ébullition :<br>a) l'<mark>évaporation</mark> est une vaporisation qui se fait à la surface libre du liquide ;<br>
      b) l'<mark>ébullition</mark> est une vaporisation qui se fait au sein même du liquide ;</li>
    <li>la <mark>sublimation</mark> est le passage direct de l'état solide à l'état gazeux ;</li>
    <li>la <mark>condensation</mark> est le passage : a) de l'état gazeux à l'état liquide ; b) de l'état gazeux à l'état solide.</li>
  </ul>
</div>
<div class="bloc">
  <h2>L'eau sur Terre : cinq grands réservoirs</h2>
  <table class="tab">
    <tr><th>Réservoir</th><th>État de l'eau</th></tr>
    <tr><td>les mers et océans</td><td>liquide</td></tr>
    <tr><td>les glaciers et les calottes glaciaires</td><td>solide</td></tr>
    <tr><td>les eaux souterraines</td><td>liquide</td></tr>
    <tr><td>les lacs et les rivières</td><td>liquide</td></tr>
    <tr><td>l'atmosphère</td><td>gazeux</td></tr>
  </table>
  <p>L'eau circule entre ces différents réservoirs en effectuant un <mark>cycle</mark>. Au cours de ce cycle, l'eau subit plusieurs
  changements d'état :</p>
  <ul><li>l'<b>évaporation</b> (océans, végétaux…) ;</li><li>la <b>condensation</b> (nuages…) ;</li>
  <li>la <b>solidification</b> (neige, grêle…) ;</li><li>la <b>fusion</b> (glaciers…).</li></ul>
  <p class="astuce">Tous ces changements d'états ont lieu grâce à un échange d'énergie (apport ou retrait). L'apport d'énergie dans
  le cycle de l'eau provient du <b>SOLEIL</b>.</p>
</div>`,
    mots: [
      ['Fusion', 'Le passage de l\'état solide à l\'état liquide.'],
      ['Solidification', 'Le passage de l\'état liquide à l\'état solide.'],
      ['Vaporisation', 'Le passage de l\'état liquide à l\'état gazeux. Elle peut se faire par évaporation ou par ébullition.'],
      ['Évaporation', 'Une vaporisation qui se fait à la surface libre du liquide.'],
      ['Ébullition', 'Une vaporisation qui se fait au sein même du liquide.'],
      ['Sublimation', 'Le passage direct de l\'état solide à l\'état gazeux.'],
      ['Condensation', 'Le passage de l\'état gazeux à l\'état liquide, ou de l\'état gazeux à l\'état solide.'],
      ['Fluide', 'Un corps dont les molécules se déplacent (liquides et gaz), par opposition au solide.'],
      ['Phénomènes réversibles', 'Les changements d\'état peuvent se faire dans les deux sens (fusion ↔ solidification…).'],
      ['Les cinq grands réservoirs', 'Mers et océans (liquide), glaciers et calottes glaciaires (solide), eaux souterraines (liquide), lacs et rivières (liquide), atmosphère (gazeux).'],
    ],
  },
  {
    id: 'graphique', theme: 5, titre: 'L\'ébullition : le graphique et le palier',
    accroche: 'Une courbe qui monte… puis qui devient plate. Ce plat a un nom, et il dit si c\'est un corps pur.',
    etoiles: 3,
    sims: [{ id: 'ebullition-graphique', titre: 'Trace la courbe en direct', sous: 'Eau pure, eau salée, eau-grenadine : palier ou pas ?' }],
    lecon: `
<div class="bloc essentiel">
  <h2>L'idée en 20 secondes</h2>
  <p>Quand on chauffe de l'<b>eau pure</b>, sa température s'élève, puis elle <b>reste constante</b> pendant que l'eau bout : sur le
  graphique on voit un <mark>palier</mark>. Cette température est la <mark>température d'ébullition</mark>.</p>
  <p>Avec l'<b>eau salée</b> ou le mélange <b>eau-grenadine</b>, la température continue de monter : pas de palier.</p>
</div>
<div class="bloc">
  <h2>Construire le graphique</h2>
  <table class="tab">
    <tr><th>Question</th><th>Réponse</th></tr>
    <tr><td>Quelles sont les variables ?</td><td>le temps ; la température</td></tr>
    <tr><td>Quelle relation entre elles ?</td><td>si le temps augmente alors la température augmente</td></tr>
    <tr><td>Variable <mark>contrôlée</mark> ?</td><td><b>le temps</b> → axe <b>horizontal</b>, en minutes</td></tr>
    <tr><td>Variable <mark>dépendante</mark> ?</td><td><b>la température</b> → axe <b>vertical</b>, en degrés Celsius (°C)</td></tr>
    <tr><td>Titre</td><td>La température de l'eau pure varie en fonction du temps.</td></tr>
    <tr><td>Échelle (sur tes graphiques)</td><td>θ : 1 cm → 10 °C ; t : 1 cm → 1 min</td></tr>
  </table>
  <p>Ensuite : graduer les axes, reporter les points et les relier par un trait fin, au crayon et avec la latte.</p>
  <h3>Les données de l'eau pure</h3>
  <table class="tab">
    <tr><th>Temps (min)</th><td>0</td><td>3</td><td>5</td><td>7</td><td>9</td><td>10</td><td>12</td><td>14</td></tr>
    <tr><th>Température (°C)</th><td>20</td><td>49</td><td>69</td><td>89</td><td>96</td><td>99</td><td>99</td><td>99</td></tr>
  </table>
  <p><b>Lecture du graphique :</b> pendant 10 minutes, la température de l'eau augmente. Ensuite, elle reste constante et égale à
  100 degrés (99 °C dans le tableau). Quand la température de l'eau n'évolue plus, on parle de « <mark>palier</mark> ».</p>
</div>
<div class="deux">
  <div class="bloc">
    <h2>Ce que font les molécules</h2>
    <p><b>La courbe monte</b> — état liquide. En chauffant l'eau, on fournit de l'énergie : la température de l'eau augmente et par
    conséquent ses molécules s'agitent de plus en plus.</p>
    <p><b>Le palier</b> — état liquide + gazeux. La température reste constante. Durant ce laps de temps, l'énergie apportée est
    utilisée pour effectuer le <mark>changement d'état</mark> : l'eau passe de l'état liquide à l'état gazeux.</p>
  </div>
  <div class="bloc">
    <h2>Et quand on refroidit ? La solidification</h2>
    <p>En abaissant la température, il y a une <b>diminution</b> de l'agitation moléculaire due à la perte d'énergie des molécules
    qui la cèdent au milieu ambiant.</p>
    <p>La courbe descend (liquide), puis <b>palier</b> (liquide + solide), puis redescend (solide). Durant le palier, l'énergie cédée
    au milieu extérieur permet le changement d'état : l'eau passe de l'état liquide à l'état solide.</p>
  </div>
</div>
<div class="bloc">
  <h2>Eau salée, eau-grenadine : pas de palier</h2>
  <table class="tab">
    <tr><th colspan="8">Eau salée</th></tr>
    <tr><th>Temps (min)</th><td>0</td><td>2</td><td>4</td><td>6</td><td>8</td><td>9</td><td>10</td></tr>
    <tr><th>Température (°C)</th><td>48</td><td>67</td><td>92</td><td>100</td><td>103</td><td>104</td><td>105</td></tr>
  </table>
  <table class="tab">
    <tr><th colspan="11">Mélange eau-grenadine</th></tr>
    <tr><th>Temps (min)</th><td>0</td><td>2</td><td>4</td><td>6</td><td>8</td><td>10</td><td>12</td><td>14</td><td>18</td><td>20</td></tr>
    <tr><th>Température (°C)</th><td>18</td><td>42</td><td>57</td><td>89</td><td>100</td><td>102</td><td>103</td><td>104</td><td>106</td><td>110</td></tr>
  </table>
  <p>Sur le premier graphique (ébullition de l'eau pure), on constate la présence d'un <b>palier</b> qui n'apparaît pas sur le
  deuxième graphique (ébullition de l'eau salée). La différence entre les 2 liquides est que le premier est un
  <mark>corps pur</mark> et le deuxième, un <mark>mélange</mark>.</p>
  <p>Lors de l'ébullition, on observe simultanément 2 états de la matière : l'état liquide et l'état gazeux. Si en plus, on observe
  un palier alors on est en présence d'un corps pur.</p>
  <p class="plus-loin">ces phrases à trous n'étaient pas complétées sur ta feuille : vérifie les mots avec ton cahier ou ton
  professeur.</p>
</div>
<div class="retiens">
  <p>Lors de l'étude de l'ébullition de l'eau :</p>
  <ul><li>la variable contrôlée est <mark>le temps</mark> ;</li><li>la variable dépendante est <mark>la température</mark> ;</li>
  <li>les variables dont la valeur est maintenue constante, sont le débit <mark>d'énergie</mark> thermique et
  <mark>la masse</mark> d'eau chauffée.</li></ul>
  <p>Lorsqu'on chauffe de l'eau pure, on constate que :</p>
  <ul><li>d'abord la température de l'eau <mark>s'élève</mark> ;</li><li>ensuite la température de l'eau
  <mark>reste constante (palier)</mark>.</li></ul>
  <p>L'observation expérimentale montre que, pendant que la température reste constante, l'eau passe de l'état liquide à l'état
  gazeux : elle <mark>bout</mark>.<br>Cette température est appelée <mark>température d'ébullition</mark>.</p>
</div>`,
    mots: [
      ['Palier', 'La partie horizontale du graphique : la température n\'évolue plus pendant le changement d\'état.'],
      ['Température d\'ébullition', 'La température qui reste constante pendant que l\'eau passe de l\'état liquide à l\'état gazeux (elle bout).'],
      ['Variable contrôlée', 'Le temps. Elle se place sur l\'axe horizontal (en minutes).'],
      ['Variable dépendante', 'La température. Elle se place sur l\'axe vertical (en °C).'],
      ['Variables maintenues constantes', 'Le débit d\'énergie thermique et la masse d\'eau chauffée.'],
      ['Corps pur ou mélange ?', 'Un palier pendant l\'ébullition : corps pur (eau pure). Pas de palier : mélange (eau salée, eau-grenadine).'],
    ],
  },
  {
    id: 'propagation', theme: 5, titre: 'La chaleur se propage',
    accroche: 'Conduction, convection, rayonnement : trois façons de voyager pour la chaleur.',
    etoiles: 3,
    sims: [{ id: 'propagation', titre: 'Les 3 modes de propagation', sous: 'La spirale, la casserole et le Soleil' }],
    lecon: `
<div class="bloc essentiel">
  <h2>L'idée en 20 secondes</h2>
  <p>La chaleur peut se propager <b>avec</b> ou <b>sans</b> intervention de la matière.</p>
  <table class="tab">
    <tr><th>Mode</th><th>La matière…</th><th>Où ?</th><th>Exemple du cours</th></tr>
    <tr><td><mark>CONDUCTION</mark></td><td>ne se déplace pas, mais sert de support</td><td>les solides</td><td>le manche de la casserole devient très chaud</td></tr>
    <tr><td><mark>CONVECTION</mark></td><td>se déplace en propageant la chaleur</td><td>les fluides (liquides et gaz)</td><td>la spirale de papier tourne au-dessus de la source de chaleur</td></tr>
    <tr><td><mark>RAYONNEMENT</mark></td><td>ne sert pas de support et ne se déplace pas (ça marche même dans le vide)</td><td>le vide ou la matière</td><td>—</td></tr>
  </table>
</div>
<div class="deux">
  <div class="bloc">
    <h2>La spirale de papier</h2>
    <p>La spirale tourne, elle semble entraînée par l'air chaud. Il y a un <b>mouvement ascendant de l'air chaud</b>.</p>
    <p>En s'échauffant, les molécules des <mark>fluides</mark> (des liquides et des gaz) sont plus <b>agitées</b>. Les molécules du
    fluide chauffé <b>montent</b> et sont <b>remplacées</b> par des molécules à température <b>plus basse</b>. La chaleur est ainsi
    <b>transportée</b>.</p>
    <p>On appelle <mark>CONVECTION</mark> le transport de chaleur par la matière avec <b>déplacement</b> de la matière.</p>
  </div>
  <div class="bloc">
    <h2>Le manche de la casserole</h2>
    <p>Le manche de la casserole est très chaud s'il ne possède pas de poignée isolante, car la chaleur est répartie sur toute la
    surface de la casserole : il y a <mark>CONDUCTION</mark>.</p>
    <p class="attention"><b>À vérifier dans ton cahier :</b> sur ta feuille, le mot écrit en rouge ressemble à « condensation ».
    D'après ton « JE RETIENS », le bon mot ici est <b>conduction</b> (la condensation, c'est un changement d'état).</p>
  </div>
</div>
<div class="retiens">
  <p>La chaleur peut se propager avec ou sans intervention de la matière.<br>Pour deux modes de propagation, la matière est
  indispensable :</p>
  <ul><li>dans la <mark>CONDUCTION</mark>, elle ne se déplace pas mais constitue le support nécessaire à la propagation de la
  chaleur ;</li><li>dans la <mark>CONVECTION</mark>, elle se déplace en propageant la chaleur.</li></ul>
  <p>La conduction est liée à l'état solide. Cependant tous les solides ne sont pas de bons conducteurs thermiques : les mauvais
  conducteurs sont appelés <mark>isolants thermiques</mark>.</p>
  <p>Les fluides sont des <mark>convecteurs thermiques</mark>.</p>
  <p>La chaleur peut aussi se propager dans le vide ou dans la matière sans que celle-ci ne serve de support ni se déplace : c'est
  le <mark>RAYONNEMENT</mark>.</p>
</div>`,
    mots: [
      ['Conduction', 'La matière ne se déplace pas mais constitue le support nécessaire à la propagation de la chaleur. Elle est liée à l\'état solide.'],
      ['Convection', 'Le transport de chaleur par la matière avec déplacement de la matière. Les fluides sont des convecteurs thermiques.'],
      ['Rayonnement', 'La chaleur se propage dans le vide ou dans la matière sans que celle-ci ne serve de support ni se déplace.'],
      ['Isolants thermiques', 'Les mauvais conducteurs thermiques.'],
      ['Convecteurs thermiques', 'Les fluides (liquides et gaz).'],
    ],
  },

  /* ======================= THÈME 6 ======================= */
  {
    id: 'melanges', theme: 6, titre: 'Homogène ou hétérogène ?',
    accroche: 'Tout se joue à l\'œil nu : tu vois les constituants, ou pas ?',
    etoiles: 3,
    sims: [{ id: 'melanges', titre: 'Le tube à essai', sous: 'Mélange, agite, laisse reposer… et prédis' }],
    lecon: `
<div class="bloc essentiel">
  <h2>L'idée en 20 secondes</h2>
  <p>Un mélange est formé de plusieurs constituants :</p>
  <ul>
    <li>dans un <mark>mélange hétérogène</mark>, différents constituants sont <b>visibles à l'œil nu</b> ;</li>
    <li>dans un <mark>mélange homogène</mark>, on <b>ne peut distinguer</b> les différents constituants à l'œil nu.</li>
  </ul>
</div>
<div class="deux">
  <div class="bloc">
    <h2>Hétérogène : on voit</h2>
    <ul><li><b>eau + huile</b> : deux couches, l'huile au-dessus ;</li>
    <li><b>eau boueuse</b> : de l'eau plus claire au-dessus, un dépôt solide (boue) au fond.</li></ul>
  </div>
  <div class="bloc">
    <h2>Homogène : on ne voit pas</h2>
    <ul><li><b>eau + sel</b> ;</li><li><b>eau + sucre</b> ;</li><li><b>eau + sirop de menthe</b>.</li></ul>
  </div>
</div>
<div class="bloc">
  <p class="astuce"><b>Astuce :</b> « hétéro » = différent (on voit des parties différentes) ; « homo » = pareil (tout a l'air
  pareil partout).</p>
</div>`,
    mots: [
      ['Mélange', 'Il est formé de plusieurs constituants.'],
      ['Mélange hétérogène', 'Différents constituants sont visibles à l\'œil nu (eau + huile, eau boueuse).'],
      ['Mélange homogène', 'On ne peut distinguer les différents constituants à l\'œil nu (eau + sel, eau + sucre, eau + sirop de menthe).'],
    ],
  },
  {
    id: 'separations', theme: 6, titre: 'Séparer un mélange',
    accroche: 'Cinq méthodes. À chaque mélange la sienne.',
    etoiles: 3,
    sims: [
      { id: 'separations', titre: 'Décanter, tamiser, filtrer, évaporer', sous: 'Quatre mini-labos à manipuler' },
      { id: 'distillation', titre: 'L\'appareil à distillation', sous: 'Le schéma ⚠ de ton cours, en vrai' },
    ],
    lecon: `
<div class="bloc essentiel">
  <h2>Le tableau qui résume tout</h2>
  <table class="tab">
    <tr><th>Méthode</th><th>Pour quel mélange ?</th><th>Principe</th></tr>
    <tr><td><mark>1. La décantation</mark></td><td><b>hétérogène</b> : un solide et un liquide, ou deux liquides non miscibles</td><td>laisser reposer</td></tr>
    <tr><td><mark>2. Le tamisage</mark></td><td><b>hétérogène</b> : deux solides dont l'un est en morceaux plus petits que l'autre</td><td>un tamis retient les plus gros</td></tr>
    <tr><td><mark>3. La filtration</mark></td><td><b>hétérogène</b> : un liquide et un solide</td><td>un filtre retient les particules solides</td></tr>
    <tr><td><mark>4. L'évaporation</mark></td><td><b>homogène</b> : un solide dissout dans un liquide</td><td>transformer le liquide en vapeur, récupérer le solide</td></tr>
    <tr><td><mark>5. La distillation</mark></td><td><b>homogène</b> : deux liquides miscibles dont les températures d'ébullition sont différentes</td><td>chauffer, puis condenser la vapeur</td></tr>
  </table>
</div>
<div class="bloc">
  <h2>1. La décantation</h2>
  <p>→ Séparation de mélanges hétérogènes composés d'un solide et d'un liquide, ou de deux liquides non miscibles.</p>
  <div class="deux">
    <div><h3>Liquide + liquide</h3>
      <p>Il faut laisser reposer le mélange des deux liquides dans une <mark>ampoule à décanter</mark> et laisser s'écouler le
      liquide qui s'est déposé dans le fond.</p>{{schema:ampoule}}</div>
    <div><h3>Solide + liquide</h3>
      <p>Il faut laisser reposer le mélange pour que les particules en suspension dans le liquide se déposent dans le fond du
      récipient.</p></div>
  </div>
</div>
<div class="deux">
  <div class="bloc">
    <h2>2. Le tamisage</h2>
    <p>→ Séparation de mélanges hétérogènes composés de deux solides dont l'un est sous forme de morceaux plus petits que l'autre.</p>
    <p><b>Principe :</b> il faut faire passer les solides au travers d'un <mark>tamis</mark> qui retiendra les éléments les plus
    gros.</p>
  </div>
  <div class="bloc">
    <h2>4. L'évaporation</h2>
    <p>→ Séparation de mélanges homogènes formés d'un solide dissout dans un liquide.</p>
    <p><b>Principe :</b> méthode consistant à transformer le liquide du mélange homogène en vapeur afin de récupérer le solide qui
    était dissout. Matériel : un verre de montre, une source de chaleur.</p>
  </div>
</div>
<div class="bloc">
  <h2>3. La filtration</h2>
  <p>→ Séparation de mélanges hétérogènes composés d'un liquide et d'un solide.</p>
  <p><b>Principe :</b> il faut faire passer le mélange à travers un <mark>filtre</mark> qui retiendra les particules solides.</p>
  <p><mark>Filtrat</mark> = résultat d'une filtration.</p>
  {{schema:filtration}}
</div>
<div class="bloc">
  <h2>5. La distillation <span class="etoile"></span></h2>
  <p>→ Séparation de mélanges homogènes composés de deux liquides miscibles dont les températures d'ébullition sont différentes.</p>
  <p><b>Principe :</b> il faut chauffer le mélange jusqu'à ce que le liquide dont la température d'évaporation est la plus basse
  s'évapore. Ensuite, il faut condenser cette vapeur en la refroidissant pour pouvoir récolter le liquide évaporé.</p>
  <p>Le liquide récolté s'appelle le <mark>distillat</mark>.</p>
  <h3>L'appareil à distillation (ton schéma ⚠)</h3>
  {{schema:distillation}}
  <p class="astuce">Sur le schéma imprimé de la synthèse, tu trouves aussi : le ballon à distiller, le réfrigérant, des pierres
  poreuses, un mélange homogène, des bouchons, la sortie d'eau, l'entrée d'eau froide.</p>
  <p><b>Fabriquer de l'eau pure avec de l'eau de mer :</b> on chauffe l'eau de mer pour évaporer l'eau. Cette vapeur va dans le
  tube, qui va refroidir la vapeur et la transformer en eau pure.</p>
</div>`,
    mots: [
      ['Décantation', 'Séparation de mélanges hétérogènes (un solide et un liquide, ou deux liquides non miscibles) : on laisse reposer.'],
      ['Ampoule à décanter', 'La verrerie avec un robinet qui sert à séparer deux liquides non miscibles.'],
      ['Tamisage', 'Séparation de deux solides dont l\'un est en morceaux plus petits que l\'autre : le tamis retient les éléments les plus gros.'],
      ['Filtration', 'Séparation de mélanges hétérogènes composés d\'un liquide et d\'un solide : le filtre retient les particules solides.'],
      ['Filtrat', 'Le résultat d\'une filtration (le liquide qui a traversé le filtre).'],
      ['Évaporation (méthode)', 'Transformer le liquide d\'un mélange homogène en vapeur afin de récupérer le solide qui était dissout.'],
      ['Distillation', 'Séparation de mélanges homogènes composés de deux liquides miscibles dont les températures d\'ébullition sont différentes.'],
      ['Distillat', 'Le liquide récolté à la sortie du réfrigérant lors d\'une distillation.'],
    ],
  },
  {
    id: 'dissolution', theme: 6, titre: 'Dissoudre : solvant, soluté, solution',
    accroche: 'Le sucre a disparu ? Non. Il se cache entre les molécules d\'eau.',
    etoiles: 3,
    sims: [{ id: 'dissolution', titre: 'La dissolution', sous: 'Ajoute du sucre jusqu\'à la saturation' }],
    lecon: `
<div class="bloc essentiel">
  <h2>Ne confonds pas : fondre et dissoudre</h2>
  <table class="tab">
    <tr><th>La <mark>fusion</mark></th><th>La <mark>dissolution</mark></th></tr>
    <tr><td>le passage de l'état solide à l'état liquide <b>sous l'effet de la chaleur</b> (énergie thermique)</td>
        <td>la désagrégation d'un corps <b>au moyen d'un solvant</b></td></tr>
    <tr><td>Le glaçon <b>fond</b>.</td><td>Le sucre <b>se dissout</b>.</td></tr>
  </table>
</div>
<div class="bloc">
  <h2>Les mots de la dissolution</h2>
  <table class="tab">
    <tr><th>Mot</th><th>Définition du cours</th><th>Dans le café sucré</th></tr>
    <tr><td><mark>Solvant</mark></td><td>le liquide qui permet la désagrégation d'une autre substance liquide, solide ou gazeuse (le soluté)</td><td>l'eau (ou le café)</td></tr>
    <tr><td><mark>Soluté</mark></td><td>la substance liquide, solide ou gazeuse qui se dissout</td><td>le sucre</td></tr>
    <tr><td><mark>Solution</mark></td><td>un mélange homogène constitué d'un solvant qui dissout un ou plusieurs solutés</td><td>l'eau sucrée (le café sucré)</td></tr>
    <tr><td><mark>Solution aqueuse</mark></td><td>une solution dont le solvant est l'eau</td><td></td></tr>
  </table>
  <p>Une substance qui se dissout dans un liquide est <mark>soluble</mark> dans celui-ci. Dans le cas contraire, elle est
  <mark>insoluble</mark>.</p>
</div>
<div class="bloc">
  <h2>L'eau, un solvant</h2>
  <p>L'eau a le pouvoir de dissoudre de très nombreuses substances. Il existe d'autres solvants que l'eau : acétone, alcool…
  À la température ambiante, l'eau peut dissoudre :</p>
  <ul>
    <li>des <b>solides</b> : toutes les eaux naturelles renferment des solides dissous (sels minéraux) ;</li>
    <li>des <b>liquides</b> : les boissons alcoolisées sont des mélanges homogènes d'eau, d'alcool et d'autres substances ;</li>
    <li>des <b>gaz</b> : les boissons gazeuses contiennent un gaz, le dioxyde de carbone, identifiable par l'eau de chaux. Les
    milieux aquatiques contiennent de l'oxygène dissous que les êtres vivants peuvent consommer.</li>
  </ul>
</div>
<div class="bloc">
  <h2>Que se passe-t-il vraiment ?</h2>
  <p>Lors de la dissolution d'un soluté dans un solvant, ses molécules <mark>diffusent</mark> parmi celles du solvant : les
  molécules de sucre se séparent et se dispersent entre les molécules d'eau.</p>
  <p>La disparition du soluté n'est qu'<b>apparente</b> : il y a <mark>conservation de la masse</mark> (la masse de la solution est
  égale à la somme des masses du solvant et du soluté). De plus, il est toujours possible de retrouver le soluté dans son état
  physique initial.</p>
  <p>Un mélange est donc la juxtaposition de molécules différentes. Mélanger est un mécanisme <b>réversible</b> puisque les
  différentes substances peuvent toujours être séparées et que chacune d'elles conserve ses propriétés.</p>
</div>
<div class="bloc">
  <h2>Saturation et sursaturation</h2>
  <p>Un solvant ne peut dissoudre indéfiniment un soluté. À partir d'une certaine quantité, le soluté ne se dissout plus :
  <mark>la solution est dite saturée</mark>. Le mélange jusqu'alors homogène devient hétérogène (dépôt de soluté au fond de la
  solution). Si on ajoute alors encore du soluté, on dit que la solution devient sursaturée (il y a <mark>sursaturation</mark>).</p>
  <p class="astuce">Avant la saturation : le sucre ajouté peut encore se dissoudre. Après : le sucre ajouté reste à l'état solide.</p>
</div>`,
    mots: [
      ['Dissolution', 'La désagrégation d\'un corps au moyen d\'un solvant.'],
      ['Solvant', 'Le liquide qui permet la désagrégation d\'une autre substance liquide, solide ou gazeuse (le soluté).'],
      ['Soluté', 'La substance liquide, solide ou gazeuse qui se dissout.'],
      ['Solution', 'Un mélange homogène constitué d\'un solvant qui dissout un ou plusieurs solutés.'],
      ['Solution aqueuse', 'Une solution dont le solvant est l\'eau.'],
      ['Soluble / insoluble', 'Une substance qui se dissout dans un liquide est soluble dans celui-ci. Dans le cas contraire, elle est insoluble.'],
      ['Diffuser', 'Lors de la dissolution, les molécules du soluté diffusent parmi celles du solvant.'],
      ['Solution saturée', 'À partir d\'une certaine quantité, le soluté ne se dissout plus.'],
      ['Sursaturation', 'On ajoute encore du soluté à une solution saturée : il se dépose, le mélange devient hétérogène.'],
      ['Conservation de la masse', 'La masse de la solution est égale à la somme des masses du solvant et du soluté.'],
      ['Fusion (≠ dissolution)', 'Le passage de l\'état solide à l\'état liquide sous l\'effet de la chaleur.'],
    ],
  },
  {
    id: 'corps-purs', theme: 6, titre: 'Corps purs, concentration, air et eau potable',
    accroche: 'Une formule (C = m / V), deux mélanges célèbres et un corps vraiment pur.',
    etoiles: 2,
    sims: [],
    lecon: `
<div class="bloc essentiel">
  <h2>Corps pur</h2>
  <p>Un <mark>corps pur</mark> (substance) est constitué de <b>molécules identiques</b>.</p>
  <p>La distillation d'une solution aqueuse conduit à l'obtention d'une eau ne contenant plus aucune substance dissoute :
  l'<mark>eau pure</mark>.</p>
  <p>Pour l'eau pure : un litre occupe un volume d'un décimètre cube (<b>1 dm³</b>) ; un litre a une masse d'un kilogramme
  (<b>1 kg</b>).</p>
</div>
<div class="bloc">
  <h2>La concentration</h2>
  <p>La <mark>concentration</mark> (C) d'une solution est le quotient de la masse (m) de soluté par le volume (V) ou la capacité de
  la solution. Elle correspond à la masse de soluté dissous dans un litre de solution. Elle s'exprime en gramme par litre (g/L).</p>
  <p style="font:800 34px/1.2 var(--titre);text-align:center;margin:14px 0"><mark>C = m / V</mark> <small style="font-size:18px">(en g/L)</small></p>
  <table class="tab">
    <tr><th></th><th>Situation 1</th><th>Situation 2</th></tr>
    <tr><td>Je dissous…</td><td>1 g de sucre dans 1 L d'eau</td><td>5 g de sucre dans 1 L d'eau</td></tr>
    <tr><td>Concentration</td><td>1 g/L</td><td><b>5 g/L</b></td></tr>
  </table>
  <p>La solution la plus sucrée est la situation 2 : sa concentration en sucre est plus grande.</p>
  <p>Correspondance volume / capacité : une capacité d'un <b>litre (L)</b> correspond à un volume d'un <b>dm³</b> ; une capacité
  d'un <b>millilitre (mL)</b> correspond à un volume d'un <b>cm³</b>.</p>
  <p class="astuce"><b>Méthode :</b> 1) mets le volume en litres (500 mL = 0,5 L) ; 2) divise la masse (en g) par le volume (en L).</p>
</div>
<div class="deux">
  <div class="bloc">
    <h2>Un mélange : l'air</h2>
    <p>L'air est un mélange gazeux <mark>incolore, inodore et insipide</mark> (sans goût). Par rapport à l'eau, il a une faible
    masse : 1 litre d'air a une masse d'environ <b>1,2 g</b>.</p>
    <p>L'air contient : <b>azote</b> (environ <b>78 %</b> en volume), <b>oxygène</b> (environ <b>21 %</b> en volume) et, en très
    faibles proportions, de l'eau, du dioxyde de carbone et parfois des poussières, des polluants atmosphériques…</p>
    <p>Bien que mélangées, ces substances conservent leurs propriétés dans l'air.</p>
  </div>
  <div class="bloc">
    <h2>Un mélange : l'eau potable</h2>
    <p>L'eau potable <b>n'est pas un corps pur</b>. C'est une solution qui répond à une réglementation très stricte : elle doit
    être limpide et ne peut contenir de produits toxiques, de microbes et certaines substances en excès. Son goût, son odeur et sa
    couleur sont également contrôlés.</p>
    <p><b>a) L'épuration des eaux usées</b> (station d'épuration) : pour obtenir une eau limpide (mais non potable) rejetée dans un
    cours d'eau : le dégrillage et le tamisage, la décantation, la filtration.</p>
    <p><b>b) Le traitement des eaux de distribution :</b> les eaux souterraines sont captées, parfois mélangées à des eaux de
    surface, puis analysées, traitées (décantation, filtration…), désinfectées et contrôlées avant d'être distribuées.</p>
    <p>Les boissons sont des solutions aqueuses contenant un grand nombre de solutés (sucres, dioxyde de carbone…) et souvent des
    colorants.</p>
  </div>
</div>`,
    mots: [
      ['Corps pur', 'Une substance constituée de molécules identiques (exemple : l\'eau pure).'],
      ['Concentration', 'Le quotient de la masse (m) de soluté par le volume (V) de la solution : C = m / V, en g/L.'],
      ['g/L', 'Gramme par litre : l\'unité de la concentration.'],
      ['1 L d\'eau pure', 'Occupe un volume de 1 dm³ et a une masse de 1 kg.'],
      ['L\'air', 'Un mélange gazeux incolore, inodore et insipide : environ 78 % d\'azote et 21 % d\'oxygène en volume. 1 litre d\'air a une masse d\'environ 1,2 g.'],
      ['L\'eau potable', 'Ce n\'est pas un corps pur : c\'est une solution qui répond à une réglementation très stricte.'],
      ['Épuration des eaux usées', 'Dégrillage et tamisage, décantation, filtration : on obtient une eau limpide mais non potable.'],
    ],
  },
];

export const parId = Object.fromEntries(CHAPITRES.map((c) => [c.id, c]));
