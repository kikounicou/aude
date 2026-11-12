// Page « Coulisses » : comment ce site a été fabriqué, pour les enseignants et les parents qui voudraient faire pareil.
// Les nombres viennent des données du site (chapitres, expériences, exercices, capsules) : ils restent justes tout seuls.
export function coulisses({ chapitres, exercices, experiences, capsules }) {
  const etapes = [
    ['Photographier', 'Les feuilles du cours, telles quelles, au téléphone.', 'humain'],
    ['Retranscrire', 'Mot pour mot. Un mot illisible est marqué, jamais deviné.', 'ia'],
    ['Relire et trancher', 'Les doutes sont listés : c\'est l\'adulte qui décide.', 'humain'],
    ['Écrire les leçons', 'Mêmes mots, mêmes définitions, mêmes schémas que le cours.', 'ia'],
    ['Construire les expériences', 'Une expérience 3D par idée, à manipuler.', 'ia'],
    ['Préparer les exercices', 'Neuf formes de questions, chaque erreur expliquée.', 'ia'],
    ['Tourner les capsules', 'Une courte vidéo par chapitre, dessinée et racontée.', 'ia'],
    ['Essayer et corriger', 'L\'élève essaie, l\'adulte dit ce qui ne va pas, on recommence.', 'humain'],
  ];
  const regles = [
    ['Le cours est la seule source', 'L\'élève est interrogé sur les mots de son professeur, pas sur ceux d\'une encyclopédie. Rien n\'est ajouté au programme.'],
    ['Un doute se signale', 'Ce qui était illisible ou incertain sur les feuilles porte la mention « à vérifier dans ton cahier ».'],
    ['Vie privée d\'abord', 'Aucun nom d\'élève, de professeur ou d\'école. Les photos du cours ne sont pas en ligne. La capsule où l\'élève apparaît est chiffrée.'],
    ['Gratuit, sans compte', 'Pas d\'inscription, pas de publicité, pas de traceur. La progression reste dans le navigateur de l\'élève.'],
    ['Expliquer l\'erreur', 'Une mauvaise réponse n\'affiche pas seulement « faux » : elle dit pourquoi, avec les mots du cours.'],
    ['Vérifier avant de publier', 'Chaque exercice passe un test automatique, chaque expérience est essayée sur ordinateur et sur téléphone, chaque page est relue contre le cours.'],
  ];
  return `
  <div class="chap-tete" style="padding-left:0;padding-right:0"><span class="kicker">Les coulisses</span>
    <h1>Des feuilles de cours à ce site, en une journée</h1>
    <p>Ce site a été préparé par un parent pour sa fille, la veille d'un contrôle, avec l'aide d'une intelligence artificielle
    (Claude Code). Cette page explique comment, pour celles et ceux qui voudraient essayer avec leur propre cours.</p></div>

  <section class="co-chiffres">
    <div class="tuile"><b>35</b><span>pages de cours photographiées</span></div>
    <div class="tuile"><b>${chapitres}</b><span>chapitres expliqués</span></div>
    <div class="tuile"><b>${experiences}</b><span>expériences 3D à manipuler</span></div>
    <div class="tuile"><b>${exercices}</b><span>exercices corrigés</span></div>
    <div class="tuile"><b>${capsules}</b><span>courtes capsules vidéo</span></div>
    <div class="tuile"><b>&lt; 1 €</b><span>de voix et de vidéo générées</span></div>
  </section>

  <div class="theme-titre"><span class="kicker">Le chemin</span><h2>Huit étapes, trois pour l'humain</h2></div>
  <ol class="co-etapes">${etapes.map(([t, d, qui], i) => `<li class="${qui}"><i>${i + 1}</i><b>${t}</b><span>${d}</span><em>${qui === 'ia' ? 'l\'IA' : 'l\'adulte'}</em></li>`).join('')}</ol>

  <div class="theme-titre"><span class="kicker">Qui fait quoi</span><h2>L'IA fabrique, l'adulte décide</h2></div>
  <section class="co-duo">
    <div class="co-col humain"><h3>L'adulte</h3><ul>
      <li>photographie le cours et dit ce qu'il veut</li>
      <li>tranche chaque point douteux</li>
      <li>regarde, essaie, fait essayer</li>
      <li>dit ce qui va trop vite ou ce qui manque</li>
      <li>prête sa voix, s'il le souhaite</li>
      <li>décide de ce qui est publié</li></ul></div>
    <div class="co-col ia"><h3>L'IA</h3><ul>
      <li>retranscrit sans rien inventer</li>
      <li>écrit les leçons et les exercices</li>
      <li>programme les expériences 3D</li>
      <li>dessine et monte les capsules vidéo</li>
      <li>teste, corrige, met en ligne</li>
      <li>tient un journal de tout ce qui a été fait</li></ul></div>
  </section>

  <div class="theme-titre"><span class="kicker">Les règles</span><h2>Ce qui a été tenu du début à la fin</h2></div>
  <section class="co-regles">${regles.map(([t, d]) => `<div class="tuile"><h3>${t}</h3><p>${d}</p></div>`).join('')}</section>

  <div class="theme-titre"><span class="kicker">En toute honnêteté</span><h2>Ce que ce site ne fait pas</h2></div>
  <section class="co-limites">
    <div><b>Il ne remplace pas le cours.</b><span>Il aide à réviser ce qui a été vu en classe. L'élève avait déjà travaillé ses feuilles.</span></div>
    <div><b>Une IA peut se tromper.</b><span>Tout a été relu contre le cours, mais le dernier mot revient au cahier de l'élève et à son professeur.</span></div>
    <div><b>Une voix ne se copie pas sans accord.</b><span>Les capsules sont racontées avec la voix du parent, reproduite avec son accord à partir d'une trentaine de secondes de lecture.</span></div>
    <div><b>Un enfant ne s'expose pas en ligne.</b><span>La seule capsule où l'élève apparaît et parle ne s'ouvre qu'avec un mot de passe connu de la famille.</span></div>
  </section>

  <div class="theme-titre"><span class="kicker">La boîte à outils</span><h2>Avec quoi c'est fait</h2></div>
  <section class="co-outils">
    <div><b>Claude Code</b><span>l'IA qui a retranscrit, écrit, programmé et testé</span></div>
    <div><b>three.js</b><span>les expériences 3D, dans le navigateur</span></div>
    <div><b>Remotion</b><span>les capsules vidéo, écrites comme du code</span></div>
    <div><b>Voix de synthèse</b><span>la narration, calée mot à mot sur l'image</span></div>
    <div><b>GitHub Pages</b><span>l'hébergement, gratuit</span></div>
    <div><b>Aucun serveur</b><span>de simples fichiers : le site marche aussi hors ligne</span></div>
  </section>

  <div class="theme-titre"><span class="kicker">À vous</span><h2>Pour essayer avec votre cours</h2></div>
  <ol class="co-recette">
    <li><b>Commencez petit :</b> un seul chapitre, complet, avant les autres.</li>
    <li><b>Donnez la source :</b> vos feuilles, et la consigne de ne rien y ajouter.</li>
    <li><b>Exigez la retranscription d'abord :</b> vous la relisez avant que quoi que ce soit ne soit construit.</li>
    <li><b>Faites essayer un élève :</b> ses réactions valent mieux que tous les avis d'adultes.</li>
    <li><b>Gardez la main sur ce qui est publié :</b> ni noms, ni visages, ni photos sans décision claire.</li>
  </ol>
  <div class="hero-cta" style="margin:22px 0 10px"><a class="btn chaud" href="#/">Voir le site comme un élève</a><a class="btn ghost" href="#/c/propagation">Un chapitre en exemple</a></div>`;
}
