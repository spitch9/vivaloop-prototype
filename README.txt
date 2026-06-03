═══════════════════════════════════════════════════════════════════
  VIVALOOP — PROTOTYPE D'APPLICATION
  Projet TED6015 · TÉLUQ · 2026
═══════════════════════════════════════════════════════════════════

À PROPOS DU PROJET
─────────────────────────────────────────────────────────────────
Vivaloop est un prototype d'application web/mobile conçue pour
soutenir l'autorégulation des saines habitudes de vie chez les
élèves du primaire et du secondaire.

L'architecture pédagogique repose sur le modèle d'apprentissage
autorégulé de Barry J. Zimmerman, qui structure l'expérience en
trois phases cycliques :

  1. PRÉMÉDITATION : un défi quotidien personnalisé est généré
     par l'IA en fonction des données de l'élève.
  2. PERFORMANCE : l'élève remplit un journal express quotidien
     couvrant les 5 piliers de la santé (auto-observation).
  3. AUTO-RÉFLEXION : l'élève valide honnêtement son défi et
     reçoit une rétroaction bienveillante.


COMMENT EXPLORER LE PROTOTYPE
─────────────────────────────────────────────────────────────────
OPTION 1 — Menu de navigation (recommandé)
  Ouvre "index.html" dans ton navigateur.
  Tu y trouveras un menu visuel pour accéder à n'importe quel
  écran directement.

OPTION 2 — Parcours complet
  Ouvre "connexion.html" pour démarrer le parcours utilisateur
  comme le ferait un vrai utilisateur de l'application.


LES 15 ÉCRANS DU PROTOTYPE
─────────────────────────────────────────────────────────────────

  ENTRÉE PARTAGÉE
    01 · connexion.html .............. Choix du rôle (Élève/Enseignant)

  UNIVERS ÉLÈVE (Le parcours de Maya, 10 ans)
    02 · accueil.html ................ Tableau de bord avec avatar
    03 · journal-activite.html ....... Journal · Étape 1/5 (Activité)
    04 · journal-alimentation.html ... Journal · Étape 2/5 (Alimentation)
    05 · journal-sommeil.html ........ Journal · Étape 3/5 (Sommeil)
    06 · journal-emotions.html ....... Journal · Étape 4/5 (Émotions)
    07 · journal-ecrans.html ......... Journal · Étape 5/5 (Écrans)
    08 · defi-du-jour.html ........... Défi personnalisé par l'IA
    09 · validation-defi.html ........ Validation honnête le lendemain
    10 · stats.html .................. Mon évolution (5 piliers + trophées)
    11 · vestiaire.html .............. Personnalisation de l'avatar

  UNIVERS ENSEIGNANT (Le parcours de M. Martin, EPS au primaire)
    12 · enseignant-accueil.html ..... Vue macro des 6 groupes
    13 · enseignant-groupe.html ...... Détail du groupe 6A
    14 · enseignant-laboratoire.html . Activités IA interdisciplinaires
    15 · enseignant-recompenses.html . Envoi de badges aux élèves


PARCOURS UTILISATEUR RECOMMANDÉ POUR L'ÉVALUATION
─────────────────────────────────────────────────────────────────

  PARCOURS 1 — La routine matinale d'une élève
    connexion → accueil élève → journal (5 étapes) → défi du jour
    → retour à l'accueil

  PARCOURS 2 — Le retour le lendemain
    accueil élève → validation du défi (3 temps de réflexion)
    → retour à l'accueil

  PARCOURS 3 — L'exploration ludique
    accueil → vestiaire (collection de skins) → stats (trophées)

  PARCOURS 4 — La planification de l'enseignant
    connexion → accueil enseignant → groupe 6A
    → laboratoire IA (activités interdisciplinaires)
    → récompenses (envoi de badge collectif)


ASPECTS À ÉVALUER
─────────────────────────────────────────────────────────────────

UX / UI
  • Cohérence visuelle entre les 15 écrans
  • Style "jeu mobile" (Brawl Stars / Duolingo) adapté à
    l'éducation
  • Différenciation chromatique des deux univers
    (élève = violet/orange chaud · enseignant = bleu/cyan froid)
  • Animations subtiles pour la satisfaction tactile

PÉDAGOGIE
  • Application stricte du modèle Zimmerman
  • Filtre d'honnêteté (assiduité valorisée plutôt que perfection)
  • Approche non-punitive (jamais de rouge, jamais de jugement)
  • Anonymisation des données côté enseignant

TECHNOLOGIE
  • Prototype HTML autonome (aucune installation requise)
  • Tailwind CSS via CDN
  • Animations CSS pures
  • Logique JavaScript pour les interactions (sliders, sélecteurs,
    transitions multi-étapes)


LIMITATIONS DU PROTOTYPE
─────────────────────────────────────────────────────────────────

Ce prototype est destiné à la PHASE 3 du projet TED6015
(conception des interfaces utilisateur). Il s'agit donc d'une
maquette interactive haute fidélité qui présente les écrans et
les transitions, mais qui simule certaines fonctionnalités :

  • Les défis générés par l'IA sont pré-écrits (la connexion
    réelle à OpenAI/Claude est prévue pour la Phase 4).
  • Les données ne sont pas persistées entre les sessions.
  • La base de données et les comptes utilisateurs réels seront
    construits en Bubble.io lors de la Phase 4.


SUPPORT TECHNIQUE
─────────────────────────────────────────────────────────────────

Le prototype est testé sur les navigateurs modernes :
Chrome, Safari, Firefox, Edge (versions récentes).

Pour un visionnement optimal, consulter sur écran de bureau
ou tablette. Le format mobile est simulé dans une fenêtre
"téléphone" pour reproduire l'expérience finale.


HÉBERGEMENT EN LIGNE (NETLIFY DROP)
─────────────────────────────────────────────────────────────────

Pour partager le prototype via une URL publique cliquable
plutôt qu'en envoyant le ZIP :

  1. Va sur https://app.netlify.com/drop
  2. Glisse-dépose le dossier "vivaloop-prototype" complet
     dans la zone indiquée
  3. Attends quelques secondes (déploiement automatique)
  4. Récupère ton URL publique (ex: https://vivaloop-xxx.netlify.app)
  5. Partage cette URL avec ton correcteur

Avantages : aucune installation requise pour le destinataire,
le prototype fonctionne directement dans son navigateur.

Note : sans création de compte Netlify, le site est éphémère
(quelques jours). Avec un compte gratuit, l'URL est permanente
et tu peux re-déployer en cas de modifications.


═══════════════════════════════════════════════════════════════════
  Bonne exploration de Vivaloop !
═══════════════════════════════════════════════════════════════════
