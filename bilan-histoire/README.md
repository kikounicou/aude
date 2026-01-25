# Comment j'ai créé cette appli de révision avec Claude Code

**Durée totale : ~1h30**
**Outil : Claude Code (Claude Opus 4.5)**

---

## Étape 1 : Création du PDF des cours (10 min)

**Moi :** J'aimerais créer un PDF qui reprend tous les JPG du folder photos_cours

**Claude :** Je vais d'abord vérifier le contenu du dossier photos_cours.
- Trouvé 22 images JPG
- Création d'un script Python avec PIL pour générer le PDF
- Correction des problèmes de métadonnées EXIF
- Rotation des images en mode portrait

**Résultat :** PDF `photos_cours.pdf` créé avec les 22 pages de cours

---

## Étape 2 : Analyse du contenu des cours (5 min)

**Moi :** Ce PDF comprend mes feuilles de cours d'histoire (photos de manuscrit et ordi). J'aimerais obtenir le contenu afin de créer des aides à la révision et des quiz. Comment faire pour analyser le contenu sachant qu'il y a du manuscrit, des tableaux, etc ?

**Claude :** Bonne nouvelle : je peux lire directement les images et analyser leur contenu (texte manuscrit, tableaux, etc.) car je suis un modèle multimodal.

**Moi :** Analyse tout d'un coup

**Claude :** *[Lecture des 22 images et extraction du contenu]*

### Contenu extrait :
- **Introduction à l'Histoire** : définition, démarche de l'historien
- **La Préhistoire** : définitions (Préhistoire, Nomade, Sédentaire, Paléolithique, Néolithique)
- **L'évolution humaine** : Australopithèque, Homo habilis, Homo erectus, Néandertal, Homo sapiens
- **Darwin et Lamarck** : théorie de l'évolution
- **Méthode FO1** : critique externe et interne de documents

---

## Étape 3 : Vérification des consignes du bilan (2 min)

**Moi :** Les consignes pour le bilan sont sur la photo consignes_bilan.png, lis-les

**Claude :** *[Lecture de l'image]*

### Consignes du bilan :
**Savoirs :**
- Les définitions : Histoire, Préhistoire, Nomade, Sédentaire, Paléolithique, Néolithique
- Tout ce qui est en rouge dans le cours

**Savoir-faire :**
- Voir si un document parle de la Préhistoire et justifier
- Critique externe : Nature et Origine du document
- Analyser les références (titre)
- Critique interne : contenu, période
- Compléter des tableaux (simple et double entrée)

---

## Étape 4 : Création de l'application web gamifiée (45 min)

**Moi :** Il faut maintenant que tu m'aides à créer des supports qui me permettront d'étudier l'essentiel de façon bien structurée. Donne-moi la meilleure façon pour apprendre tout ça en une heure. Ensuite, on fera des exercices e-learning interactif de fou afin que mes copains et moi puissions nous exercer en ligne.

**Claude :** Je crée une application web de révision gamifiée complète !

### Fonctionnalités créées :
1. **Fiches de révision** - Les 6 définitions, l'essentiel en rouge, méthode FO1
2. **Flashcards** - 6 cartes retournables pour mémoriser
3. **Quiz interactifs** - Questions à choix multiples avec feedback
4. **Exercice Documents** - Analyse critique externe/interne
5. **Tableaux à compléter** - Simple et double entrée
6. **Système de gamification** - XP, niveaux, badges, streak

---

## Étape 5 : Corrections et améliorations (15 min)

**Moi :** Les select sont en blanc sur fond blanc dans l'onglet documents et tableaux

**Claude :** *[Correction des styles CSS]*

**Moi :** Est-ce que tu penses que tu as bien passé en revue tout ce que je dois savoir pour réussir mon bilan ?

**Claude :**
### Ce qui manquait :
- Détails sur Néandertal
- Localisations géographiques des Homo
- Dates clés (4,5 milliards, 1800 Lamarck, 1859 Darwin)
- Plus d'exercices de documents

**Moi :** Ajoute tout ça

---

## Étape 6 : Killer features (20 min)

**Moi :** En tant qu'expert en gamification et pédagogie, vois-tu encore des killer features à ajouter ?

**Claude :** Suggestions ajoutées :
1. **Section "5 min Express"** - Résumé ultra-court avant l'exam
2. **Astuces mnémotechniques** - "Paléo = je me PROMÈNE", etc.
3. **Mode Défi Chrono** - 10 questions en 2 minutes
4. **Images pour les documents** - Illustrations visuelles
5. **3 documents à analyser** au lieu d'un seul

---

## Étape 7 : Mise en ligne sur GitHub (5 min)

**Moi :** Renomme le fichier en index.html et on va le rendre accessible sur GitHub

**Claude :**
- Renommage du fichier
- Création du dossier `bilan-histoire`
- Push sur GitHub
- Activation de GitHub Pages

**URL finale :** https://kikounicou.github.io/aude/bilan-histoire/

---

## Résultat final

### L'application comprend :
- 📖 **Fiches complètes** avec tout le contenu du cours
- 🃏 **Flashcards** des 6 définitions
- ❓ **40+ questions de quiz** réparties en 6 catégories
- ⏱️ **Mode Défi Chrono** (10 questions en 2 min)
- ⚡ **Section "5 min Express"** avec astuces mnémotechniques
- 🔍 **3 documents à analyser** avec critique externe/interne
- 📊 **Tableaux interactifs** à compléter
- 🏆 **9 badges** à débloquer
- 🔥 **Système de streak** et XP

### Technologies utilisées :
- HTML/CSS/JavaScript (fichier unique, pas de dépendances)
- Stockage local (localStorage) pour la progression
- Design responsive (mobile-friendly)

---

## Ce qui m'a bluffé

1. **Lecture du manuscrit** - Claude a lu mes notes écrites à la main
2. **Extraction intelligente** - Il a compris les tableaux et la structure
3. **Adaptation pédagogique** - Contenu adapté pour des 12-13 ans
4. **Gamification pertinente** - XP, badges, chrono = motivation
5. **Astuces mnémotechniques** - Générées automatiquement

---

*Créé avec Claude Code (Opus 4.5) en janvier 2025*
