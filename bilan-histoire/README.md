# Comment j'ai créé cette appli de révision avec Claude Code

**Durée totale : ~1h30**
**Outil : Claude Code (Claude Opus 4.5)**

---

## Étape 1 : Photographier les cours

Ma fille avait 22 pages de cours d'histoire à réviser :
- Des feuilles manuscrites (écrites à la main)
- Des documents imprimés avec tableaux
- Des fiches d'exercices

J'ai simplement pris en photo toutes les pages avec mon téléphone et les ai mises dans un dossier `photos_cours/`.

---

## Étape 2 : Création du PDF avec Python (10 min)

**Moi :** J'aimerais créer un PDF qui reprend tous les JPG du folder photos_cours

**Claude :** Je vais d'abord vérifier le contenu du dossier photos_cours.

```
→ Trouvé 22 fichiers JPG
```

Claude a ensuite généré automatiquement un script Python utilisant la librairie PIL (Pillow) :

```python
from PIL import Image
import os

photos_dir = "photos_cours"
images = sorted([f for f in os.listdir(photos_dir) if f.lower().endswith('.jpg')])

image_list = []
for img_name in images:
    img = Image.open(os.path.join(photos_dir, img_name))
    # Création d'une nouvelle image sans métadonnées EXIF problématiques
    clean_img = Image.new('RGB', img.size)
    clean_img.paste(img)
    # Rotation en portrait si nécessaire
    if clean_img.width > clean_img.height:
        clean_img = clean_img.rotate(-90, expand=True)
    image_list.append(clean_img)

# Export en PDF
first_image = image_list[0]
first_image.save("photos_cours.pdf", "PDF", save_all=True, append_images=image_list[1:])
```

**Problèmes rencontrés et résolus automatiquement :**
1. Métadonnées EXIF corrompues → Création d'images "propres" sans EXIF
2. Photos en paysage → Rotation automatique en portrait
3. Mauvais sens de rotation → Ajustement de -90° au lieu de 90°

**Résultat :** PDF `photos_cours.pdf` avec les 22 pages correctement orientées

---

## Étape 3 : Extraction du contenu par vision IA (5 min)

**Moi :** Ce PDF comprend mes feuilles de cours d'histoire (photos de manuscrit et ordi). J'aimerais obtenir le contenu afin de créer des aides à la révision et des quiz. Comment faire pour analyser le contenu sachant qu'il y a du manuscrit, des tableaux, etc ?

**Claude :** Bonne nouvelle : je peux lire directement les images et analyser leur contenu (texte manuscrit, tableaux, etc.) car je suis un modèle multimodal.

**Moi :** Analyse tout d'un coup

Claude a alors lu les 22 images une par une grâce à ses capacités de vision. Il a réussi à :

- **Lire le texte manuscrit** (écriture à la main de l'élève)
- **Comprendre les tableaux** (lignes, colonnes, en-têtes)
- **Identifier la structure** (titres, sous-titres, listes)
- **Extraire les définitions clés** encadrées ou surlignées
- **Repérer ce qui était en rouge** (éléments importants du cours)

### Contenu extrait :

**Introduction à l'Histoire :**
- Définition de l'Histoire (étude du passé avec documents écrits)
- La démarche de l'historien (S'interroger → Rechercher → Analyser → Communiquer)

**La Préhistoire :**
- 6 définitions : Histoire, Préhistoire, Nomade, Sédentaire, Paléolithique, Néolithique
- Tableau comparatif Paléolithique vs Néolithique

**L'évolution humaine :**
- Australopithèque, Homo habilis, Homo erectus, Néandertal, Homo sapiens
- Caractéristiques, dates, localisations géographiques
- "L'Homme ne descend pas du singe, ils ont un ancêtre commun"

**Méthode FO1 :**
- Critique externe (Nature + Origine du document)
- Critique interne (Contenu, période, ce qu'on apprend)

---

## Étape 4 : Vérification des consignes du bilan (2 min)

**Moi :** Les consignes pour le bilan sont sur la photo consignes_bilan.png, lis-les

Claude a lu l'image des consignes et identifié :

**Savoirs à connaître :**
- Les 6 définitions
- Tout ce qui est en rouge dans le cours

**Savoir-faire à maîtriser :**
- Voir si un document parle de la Préhistoire et justifier
- Critique externe : Nature et Origine du document
- Analyser les références (titre)
- Critique interne : contenu, période
- Compléter des tableaux (simple et double entrée)

---

## Étape 5 : Création de l'application web gamifiée (45 min)

**Moi :** Il faut maintenant que tu m'aides à créer des supports qui me permettront d'étudier l'essentiel de façon bien structurée. Donne-moi la meilleure façon pour apprendre tout ça en une heure. Ensuite, on fera des exercices e-learning interactif de fou afin que mes copains et moi puissions nous exercer en ligne.

Claude a généré un fichier HTML unique contenant :

1. **Fiches de révision** - Les 6 définitions, l'essentiel en rouge, méthode FO1
2. **Flashcards** - 6 cartes retournables pour mémoriser
3. **Quiz interactifs** - Questions à choix multiples avec feedback immédiat
4. **Exercice Documents** - Analyse critique externe/interne
5. **Tableaux à compléter** - Simple et double entrée
6. **Système de gamification** - XP, niveaux, badges, streak

---

## Étape 6 : Corrections et améliorations (15 min)

**Moi :** Les select sont en blanc sur fond blanc dans l'onglet documents et tableaux

→ Correction CSS immédiate

**Moi :** Est-ce que tu penses que tu as bien passé en revue tout ce que je dois savoir pour réussir mon bilan ?

Claude a identifié ce qui manquait :
- Détails sur Néandertal
- Localisations géographiques des Homo
- Dates clés (4,5 milliards d'années, 1800 Lamarck, 1859 Darwin)
- Plus d'exercices de documents

**Moi :** Ajoute tout ça

---

## Étape 7 : Killer features pour la gamification (20 min)

**Moi :** En tant qu'expert en gamification et pédagogie, vois-tu encore des killer features à ajouter ?

Ajouts :
1. **Section "5 min Express"** - Résumé ultra-court avant l'exam
2. **Astuces mnémotechniques** - "Paléo = je me PROMÈNE (Nomade)", etc.
3. **Mode Défi Chrono** - 10 questions en 2 minutes
4. **Images pour les documents** - Illustrations visuelles
5. **3 documents à analyser** au lieu d'un seul

---

## Étape 8 : Mise en ligne sur GitHub Pages (5 min)

**Moi :** Renomme le fichier en index.html et on va le rendre accessible sur GitHub

Actions réalisées :
- Renommage du fichier en `index.html`
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
- HTML/CSS/JavaScript (fichier unique, aucune dépendance externe)
- localStorage pour sauvegarder la progression
- Design responsive (fonctionne sur mobile)

---

*Créé avec Claude Code (Opus 4.5) en janvier 2025*
