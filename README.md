# Des cours papier transformés en révisions interactives

Ce dépôt rassemble de petits sites de révision préparés par un parent pour sa fille, élève du secondaire en Belgique
francophone. Chaque site part des feuilles de cours, photographiées, et les transforme en quelque chose qu'on peut
manipuler : leçons illustrées, expériences, exercices qui expliquent l'erreur.

Ils ont été construits avec un assistant de programmation par IA (Claude Code), sans écrire de code à la main.

## Les sites

| Site | Matière | Ce qu'on y trouve |
|---|---|---|
| [Chaleur et mélanges](https://kikounicou.github.io/aude/sciences-chaleur-melanges/) | Sciences, 2e secondaire | 11 chapitres, 12 expériences en 3D à manipuler, 127 exercices, 11 capsules vidéo |
| [Bilan d'histoire](https://kikounicou.github.io/aude/bilan-histoire/) | Histoire | Révisions sous forme de jeu, quiz |
| [L'Antiquité](https://kikounicou.github.io/aude/histoire-antiquite/) | Histoire | Fiches, cartes mémoire, schémas, quiz |
| [La multiplication végétative](https://kikounicou.github.io/aude/quiz-multiplication-vegetative/) | Sciences | Quiz |

Le plus abouti est le site de sciences. Sa page
[« Coulisses »](https://kikounicou.github.io/aude/sciences-chaleur-melanges/#/coulisses) raconte, étape par étape, comment
il a été fait : qui fait quoi entre le parent et l'IA, les règles suivies, les limites.

## Ce que c'est, et ce que ce n'est pas

- **Un complément, pas un remplacement.** Ces sites ne remplacent ni le cours ni les échanges en classe. L'élève étudie
  d'abord ses feuilles ; le site sert à revoir, manipuler et se tester.
- **Le cours est la seule source.** Les définitions et les schémas reprennent ceux des feuilles de l'enseignant, puisque
  c'est là-dessus que l'élève est interrogée. Rien n'est ajouté au programme.
- **Un essai, pas un produit.** Ces pages ont été faites pour une élève et un contrôle précis. Elles peuvent contenir des
  erreurs : si vous en voyez une, une [issue](https://github.com/kikounicou/aude/issues) est la bienvenue.

## Comment c'est fait

- Des pages statiques : HTML, CSS et JavaScript, sans serveur, sans compte, sans traceur. La progression est gardée dans le
  navigateur de l'élève.
- Les expériences en 3D du site de sciences utilisent [three.js](https://threejs.org/), copié dans le dépôt.
- Les capsules vidéo sont montées avec [Remotion](https://www.remotion.dev/) et racontées par la voix clonée du parent, avec
  son accord. Le fichier `etats.enc` est une capsule chiffrée, réservée à la famille.
- Hébergement : GitHub Pages.

## Vie privée et droits

- Aucune photo des feuilles de cours, aucun nom d'élève, d'enseignant ou d'école ne figure dans ce dépôt.
- Le contenu des leçons vient de cours donnés en classe : il appartient à leurs auteurs. Merci de ne pas le réutiliser tel
  quel. La démarche, elle, est faite pour être reprise : inspirez-vous-en librement pour vos propres cours.
