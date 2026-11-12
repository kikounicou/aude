// Ce qu'il faut savoir en priorité, et ce que la prof peut demander, chapitre par chapitre.
// prio : [ce qu'il faut savoir dire, précision]   ·   prof : [question type contrôle, bonne réponse (mots du cours), genre de question]
// minutes : temps conseillé la veille du contrôle.  Source : cours/05-ca-va-chauffer.md et cours/06-les-melanges.md.
export const PRIO = {
  energie: {
    video: { id: 'energie', titre: 'La chaîne d\'énergie : réservoir, transformateur, receveur', duree: 'à regarder avant tout le reste' },
    minutes: 5,
    prio: [
      ['Réservoir → transformateur(s) → receveur', 'L\'ordre de la chaîne, et le rôle de chacun.'],
      ['La chaîne du salon', 'Bûches de bois → énergie chimique → feu ouvert → énergie thermique et lumineuse → salon.'],
      ['Forme dégradée d\'énergie', 'L\'énergie thermique non désirée, perdue pour le montage.'],
    ],
    prof: [
      ['Construis une chaîne ayant pour receveur le salon d\'Églantine.', 'Bûches de bois (réservoir) → énergie chimique → feu ouvert (transformateur) → énergie thermique et énergie lumineuse → salon d\'Églantine (receveur).', 'Schéma à compléter'],
      ['Cite trois réservoirs naturels d\'énergie.', 'Le soleil ; le charbon, le gaz naturel, le pétrole ; les aliments.', 'Restitution'],
      ['Qu\'est-ce qu\'un transformateur ?', 'Il reçoit de l\'énergie sous une certaine forme et la restitue sous la même forme ou sous une autre forme.', 'Définition'],
      ['Qu\'appelle-t-on une forme dégradée d\'énergie ?', 'L\'énergie thermique non désirée (échauffement des objets), perdue pour le montage.', 'Définition'],
    ],
  },
  thermoscope: {
    video: { id: 'thermoscope', titre: 'Le thermoscope : il compare, il ne mesure pas', duree: 'à regarder avant tout le reste' },
    minutes: 6,
    prio: [
      ['Dilatation et contraction', 'Plus d\'agitation moléculaire → plus d\'espace → le niveau monte. Et l\'inverse.'],
      ['Le thermoscope compare', 'Il n\'a pas de graduations : il ne mesure pas.'],
      ['Les rails, le pont, la montgolfière', 'Trois exemples de dilatation à savoir expliquer.'],
    ],
    prof: [
      ['Explique pourquoi le niveau d\'eau colorée monte dans le bécher d\'eau chaude.', 'La chaleur de l\'eau du bécher se transmet au thermoscope. Les molécules d\'eau colorée reçoivent un supplément d\'énergie, leur agitation moléculaire augmente, elles occupent plus d\'espace : c\'est la dilatation.', 'Explication'],
      ['Pourquoi existe-t-il un espace entre 2 rails ?', 'Pour éviter que les rails se déforment lors d\'une élévation importante de la température (à cause de la dilatation).', 'Vie courante'],
      ['À quoi sert un thermoscope ?', 'À comparer de façon objective le niveau de chaud et de froid de différents corps.', 'Définition'],
      ['Quelles sont les 2 variables de l\'expérience, et leur relation ?', 'La température et le niveau d\'eau colorée. Plus la température est élevée et plus l\'eau colorée monte dans le tube.', 'Variables'],
    ],
  },
  thermometre: {
    video: { id: 'thermometre', titre: 'Le thermomètre : d\'où viennent le 0 et le 100 ?', duree: 'à regarder avant tout le reste' },
    minutes: 5,
    prio: [
      ['Les 2 repères', '0 = glace fondante ; 100 = eau en ébullition (pression atmosphérique normale).'],
      ['Les 4 parties du thermomètre', 'Tube capillaire, vide d\'air, graduation, réservoir de mercure ou d\'alcool coloré.'],
      ['Thermomètre = thermoscope gradué', 'Il permet de repérer la température, en degrés Celsius.'],
    ],
    prof: [
      ['Annote le schéma d\'un thermomètre.', 'De haut en bas : le tube capillaire, le vide d\'air, une graduation, le réservoir de mercure ou d\'alcool coloré.', 'Schéma à légender', { schema: 'thermometre' }],
      ['Comment a-t-on gradué le thermomètre ?', 'Avec deux repères : le repère 0 correspond à la température de la glace fondante et le repère 100 à la température de l\'eau en ébullition, à la pression atmosphérique normale.', 'Explication'],
      ['Quelle différence entre un thermoscope et un thermomètre ?', 'Le thermomètre est un thermoscope gradué : il permet de repérer la température, alors que le thermoscope permet seulement de comparer.', 'Comparaison'],
    ],
  },
  'chaleur-temperature': {
    video: { id: 'chaleur-temperature', titre: 'Chaleur et température : ne les confonds plus', duree: 'à regarder avant tout le reste' },
    minutes: 8,
    prio: [
      ['Chaleur = énergie thermique', 'Une forme d\'énergie : on la fournit, on l\'échange.'],
      ['Température = niveau thermique', 'On la repère avec un thermomètre.'],
      ['Même chaleur, températures différentes', 'Cela dépend de la masse du liquide chauffé et de sa nature.'],
      ['Savoir placer les deux mots dans une phrase', 'Le texte à trous d\'Églantine (soleil, feu de bois, 37,6 °C, doudoune).'],
    ],
    prof: [
      ['Complète avec « chaleur » ou « température » : Le feu de bois fournit de la … au salon. 37,6 °C est la … du corps humain.', 'Le feu de bois fournit de la chaleur au salon. 37,6 °C est la température du corps humain.', 'Texte à trous'],
      ['50 mL et 100 mL d\'eau chauffés de la même façon : que constates-tu, que conclus-tu ?', 'La température ne varie pas de la même manière : après 5 minutes elle est plus élevée dans le bécher de 50 mL. On a apporté la même quantité de chaleur et pourtant la température n\'est pas la même : chaleur et température sont deux grandeurs différentes.', 'Interpréter une expérience'],
      ['Eau 250 g, eau 500 g, huile 250 g chauffées 5 minutes : ont-elles reçu la même quantité de chaleur ? Pourquoi les températures finales diffèrent-elles ?', 'Oui, car le temps de chauffe est identique. Une même quantité de chaleur provoque une élévation de température différente suivant la masse du liquide chauffé et suivant sa nature.', 'Interpréter des données'],
      ['Définis la chaleur et la température.', 'La chaleur est une forme d\'énergie appelée énergie thermique. La température d\'un corps exprime le niveau thermique de ce corps.', 'Définition'],
    ],
  },
  etats: {
    minutes: 12,
    prio: [
      ['Les 6 flèches du triangle', 'Fusion, solidification, vaporisation, condensation, sublimation, condensation.'],
      ['« Condensation » sert deux fois', 'Gaz → liquide (les gouttes) ET gaz → solide (le givre).'],
      ['Évaporation ≠ ébullition', 'Deux façons de vaporiser : à la surface libre du liquide, ou au sein même du liquide.'],
      ['Fluide', 'Un corps dont les molécules se déplacent : les liquides et les gaz.'],
      ['Le cycle de l\'eau', 'Évaporation, condensation, solidification, fusion. L\'énergie vient du Soleil.'],
    ],
    prof: [
      ['Complète le triangle : écris le nom de chaque changement d\'état.', 'Solide → liquide : fusion. Liquide → solide : solidification. Liquide → gaz : vaporisation. Gaz → liquide : condensation. Solide → gaz : sublimation. Gaz → solide : condensation.', 'Schéma à compléter', { schema: 'triangle' }],
      ['Du givre apparaît sur un bloc réfrigérant sorti du congélateur. Interprète et nomme le phénomène.', 'L\'eau contenue dans l\'air ambiant passe de l\'état gazeux à l\'état solide : c\'est une condensation.', 'Observation → phénomène'],
      ['Quelle est la différence entre l\'évaporation et l\'ébullition ?', 'Ce sont deux vaporisations (liquide → gazeux). L\'évaporation se fait à la surface libre du liquide ; l\'ébullition se fait au sein même du liquide.', 'Comparaison'],
      ['Modélise les 3 états de la matière.', 'Solide : molécules serrées et rangées. Liquide : molécules proches mais désordonnées. Gazeux : molécules très espacées, dans tout l\'espace.', 'Modélisation'],
      ['Qu\'est-ce qu\'un fluide ?', 'Un corps dont les molécules se déplacent (un liquide ou un gaz), par opposition au solide.', 'Définition'],
      ['Cite les changements d\'état du cycle de l\'eau, avec un exemple pour chacun.', 'L\'évaporation (océans, végétaux…), la condensation (nuages…), la solidification (neige, grêle…), la fusion (glaciers…). L\'apport d\'énergie provient du Soleil.', 'Restitution'],
      ['Pourquoi dit-on que les changements d\'état sont réversibles ?', 'Parce qu\'une matière qui reçoit ou perd de la chaleur peut changer d\'état dans les deux sens : la fusion et la solidification, la vaporisation et la condensation.', 'Explication'],
    ],
    cartes: [
      ['Les glaçons fondent dans le bécher chauffé.', 'FUSION', 'L\'eau passe de l\'état solide à l\'état liquide.'],
      ['L\'eau bout : des bulles se forment au sein du liquide.', 'VAPORISATION', 'C\'est l\'ébullition : l\'eau passe, au sein du liquide, de l\'état liquide à l\'état gazeux.'],
      ['Quelques gouttes d\'éther : après quelques minutes, le liquide a disparu.', 'VAPORISATION', 'C\'est l\'évaporation : l\'éther est passé, à la surface du liquide, de l\'état liquide à l\'état gazeux.'],
      ['Des gouttes apparaissent sur le verre de montre placé au-dessus de l\'eau qui bout.', 'CONDENSATION', 'L\'eau passe de l\'état gazeux à l\'état liquide.'],
      ['Du givre apparaît sur le bloc réfrigérant sorti du congélateur.', 'CONDENSATION', 'L\'eau contenue dans l\'air ambiant passe de l\'état gazeux à l\'état solide.'],
      ['Les gouttes d\'eau déposées sur le bloc réfrigérant gèlent.', 'SOLIDIFICATION', 'L\'eau passe de l\'état liquide à l\'état solide.'],
      ['La tige chaude d\'une cuillère à combustion touche un glaçon : la glace se transforme en vapeur.', 'SUBLIMATION', 'L\'eau passe directement de l\'état solide à l\'état gazeux.'],
    ],
    video: { id: 'etats-public', titre: 'Les changements d\'état : 6 passages, 5 noms, 2 pièges', duree: 'à regarder avant tout le reste' },
    videoFamille: { id: 'etats', chiffre: true },
  },
  graphique: {
    minutes: 10,
    video: { id: 'graphique', titre: 'Le graphique et le palier en une minute', duree: 'à regarder avant tout le reste' },
    prio: [
      ['Le palier', 'La température reste constante pendant le changement d\'état.'],
      ['Variable contrôlée / dépendante', 'Le temps (axe horizontal, min) ; la température (axe vertical, °C).'],
      ['Palier = corps pur, pas de palier = mélange', 'Eau pure : palier. Eau salée, eau-grenadine : la température continue de monter.'],
      ['Pendant le palier : 2 états en même temps', 'Liquide + gazeux à l\'ébullition ; liquide + solide à la solidification.'],
    ],
    prof: [
      ['Sur ce graphique, quelle est la variable contrôlée ? la variable dépendante ? leurs unités ?', 'La variable contrôlée est le temps (axe horizontal, en minutes). La variable dépendante est la température (axe vertical, en degrés Celsius).', 'Lire un graphique', { graphe: 'pure' }],
      ['Décris la courbe de l\'ébullition de l\'eau pure.', 'D\'abord la température de l\'eau s\'élève ; ensuite elle reste constante : c\'est un palier. Pendant ce temps, l\'eau passe de l\'état liquide à l\'état gazeux : elle bout. Cette température est la température d\'ébullition.', 'Décrire une courbe'],
      ['Pourquoi la température ne monte-t-elle plus pendant le palier, alors qu\'on chauffe toujours ?', 'Parce que l\'énergie apportée est utilisée pour effectuer le changement d\'état : l\'eau passe de l\'état liquide à l\'état gazeux.', 'Explication'],
      ['Voici deux graphiques : l\'un a un palier, l\'autre pas. Lequel est celui de l\'eau salée ?', 'Celui sans palier : l\'eau salée est un mélange, sa température continue de monter. L\'eau pure, un corps pur, présente un palier.', 'Comparer deux graphiques', { graphe: 'deux' }],
      ['Quelles variables sont maintenues constantes lors de l\'étude de l\'ébullition ?', 'Le débit d\'énergie thermique et la masse d\'eau chauffée.', 'Restitution'],
    ],
  },
  propagation: {
    video: { id: 'propagation', titre: 'Conduction, convection, rayonnement en une minute', duree: 'à regarder avant tout le reste' },
    minutes: 8,
    prio: [
      ['Conduction', 'Dans les solides : la matière ne se déplace pas mais sert de support.'],
      ['Convection', 'Dans les fluides : la matière se déplace en propageant la chaleur.'],
      ['Rayonnement', 'Sans support : possible dans le vide.'],
      ['Isolants thermiques', 'Les mauvais conducteurs thermiques.'],
    ],
    prof: [
      ['Cite les 3 modes de propagation de la chaleur et dis pour chacun si la matière se déplace.', 'La conduction : la matière ne se déplace pas mais constitue le support. La convection : la matière se déplace en propageant la chaleur. Le rayonnement : la chaleur se propage dans le vide ou dans la matière sans que celle-ci ne serve de support ni se déplace.', 'Restitution'],
      ['Pourquoi la spirale de papier tourne-t-elle au-dessus de la source de chaleur ?', 'Elle est entraînée par le mouvement ascendant de l\'air chaud. Les molécules du fluide chauffé montent et sont remplacées par des molécules à température plus basse : c\'est la convection.', 'Explication'],
      ['Le manche de la casserole est très chaud. Quel mode de propagation ?', 'La conduction : la chaleur se propage dans le solide sans déplacement de matière.', 'Vie courante'],
      ['Qu\'appelle-t-on un isolant thermique ?', 'Un mauvais conducteur thermique.', 'Définition'],
    ],
  },
  melanges: {
    video: { id: 'melanges', titre: 'Homogène ou hétérogène ? Tout se joue à l’œil nu', duree: 'à regarder avant tout le reste' },
    minutes: 4,
    prio: [
      ['Hétérogène', 'Différents constituants sont visibles à l\'œil nu (eau + huile, eau boueuse).'],
      ['Homogène', 'On ne peut distinguer les constituants à l\'œil nu (eau + sel, eau + sucre, eau + sirop).'],
    ],
    prof: [
      ['Définis un mélange homogène et un mélange hétérogène.', 'Dans un mélange hétérogène, différents constituants sont visibles à l\'œil nu. Dans un mélange homogène, on ne peut distinguer les différents constituants à l\'œil nu.', 'Définition'],
      ['Classe : eau + huile, eau + sel, eau boueuse, eau + sirop de menthe.', 'Hétérogènes : eau + huile, eau boueuse. Homogènes : eau + sel, eau + sirop de menthe.', 'Classement'],
    ],
  },
  separations: {
    video: { id: 'separations', titre: 'Séparer un mélange : 5 méthodes, 1 piège', duree: 'à regarder avant tout le reste' },
    minutes: 12,
    prio: [
      ['Le schéma de l\'appareil à distillation ⚠', 'Les 9 légendes, et le sens de l\'eau froide (entre en bas, sort en haut).'],
      ['Quelle méthode pour quel mélange', 'Hétérogène : décantation, tamisage, filtration. Homogène : évaporation, distillation.'],
      ['Filtrat et distillat', 'Le résultat d\'une filtration ; le liquide récolté par distillation.'],
      ['Le principe de la distillation', 'Chauffer, évaporer, condenser la vapeur en la refroidissant, récolter.'],
    ],
    prof: [
      ['Légende le schéma de l\'appareil à distillation.', 'Le bouchon, le ballon à fond plat, le liquide, la plaque chauffante, le tube réfrigérant, la sortie d\'eau froide, l\'entrée d\'eau froide, le berlin, le distillat.', 'Schéma à légender', { schema: 'distillation' }],
      ['Explique le principe de la distillation.', 'Il faut chauffer le mélange jusqu\'à ce que le liquide dont la température d\'évaporation est la plus basse s\'évapore. Ensuite, il faut condenser cette vapeur en la refroidissant pour pouvoir récolter le liquide évaporé.', 'Explication'],
      ['Quelle méthode utilises-tu pour séparer : a) de l\'eau et de l\'huile ; b) du sable et des cailloux ; c) le sel de l\'eau salée ?', 'a) La décantation (deux liquides non miscibles). b) Le tamisage. c) L\'évaporation.', 'Choisir une méthode'],
      ['Comment « fabriquer » de l\'eau pure à partir d\'eau de mer ?', 'On chauffe l\'eau de mer pour évaporer l\'eau. La vapeur va dans le tube, qui la refroidit et la transforme en eau pure. C\'est une distillation.', 'Explication'],
      ['Qu\'est-ce que le filtrat ?', 'Le résultat d\'une filtration : le liquide qui a traversé le filtre.', 'Définition'],
    ],
  },
  dissolution: {
    video: { id: 'dissolution', titre: 'Dissoudre : le sucre ne fond pas !', duree: 'à regarder avant tout le reste' },
    minutes: 10,
    prio: [
      ['Solvant, soluté, solution', 'Le liquide qui dissout ; ce qui se dissout ; le mélange homogène obtenu.'],
      ['Fondre ≠ dissoudre', 'Fusion : sous l\'effet de la chaleur. Dissolution : au moyen d\'un solvant.'],
      ['Saturée, sursaturation', 'Le soluté ne se dissout plus ; on en ajoute encore, il se dépose.'],
      ['Conservation de la masse', 'Masse de la solution = masse du solvant + masse du soluté.'],
    ],
    prof: [
      ['Complète : le liquide dans lequel le corps se dissout est appelé … ; le corps dissous s\'appelle le … ; le liquide obtenu est une … .', 'Le solvant ; le soluté ; une solution (un mélange homogène).', 'Texte à trous'],
      ['Peut-on dire que le sucre « fond » dans le café ? Justifie.', 'Non, il se dissout. La fusion est le passage de l\'état solide à l\'état liquide sous l\'effet de la chaleur ; la dissolution est la désagrégation d\'un corps au moyen d\'un solvant.', 'Question à justifier'],
      ['Je dissous 20 g de sel dans 200 g d\'eau. Quelle est la masse de la solution ? Pourquoi ?', '220 g : il y a conservation de la masse, la masse de la solution est égale à la somme des masses du solvant et du soluté.', 'Calcul'],
      ['Que se passe-t-il si on continue d\'ajouter du sucre dans l\'eau ?', 'À partir d\'une certaine quantité, le soluté ne se dissout plus : la solution est saturée. Si on en ajoute encore, il se dépose : il y a sursaturation et le mélange devient hétérogène.', 'Explication'],
    ],
  },
  'corps-purs': {
    video: { id: 'corps-purs', titre: 'Corps pur ou mélange ? Tout se joue dans les molécules', duree: 'à regarder avant tout le reste' },
    minutes: 8,
    prio: [
      ['C = m / V, en g/L', 'Masse de soluté divisée par le volume de la solution.'],
      ['Corps pur', 'Constitué de molécules identiques (l\'eau pure).'],
      ['L\'air', 'Un mélange : environ 78 % d\'azote et 21 % d\'oxygène ; incolore, inodore, insipide.'],
      ['L\'eau potable n\'est pas un corps pur', 'C\'est une solution, très contrôlée.'],
    ],
    prof: [
      ['Je dissous 10 g de sucre dans 2 L d\'eau. Calcule la concentration.', 'C = m / V = 10 g ÷ 2 L = 5 g/L.', 'Calcul'],
      ['Vrai ou faux : l\'air est un corps pur.', 'Faux : l\'air est un mélange gazeux (oxygène, azote, un peu d\'eau, de dioxyde de carbone…).', 'Vrai ou faux'],
      ['Qu\'est-ce qu\'un corps pur ? Donne un exemple.', 'Un corps pur est constitué de molécules identiques. Exemple : l\'eau pure, obtenue par distillation.', 'Définition'],
      ['Donne la composition de l\'air.', 'Environ 78 % d\'azote et 21 % d\'oxygène en volume, et en très faibles proportions de l\'eau, du dioxyde de carbone et parfois des poussières et des polluants.', 'Restitution'],
    ],
  },
};
