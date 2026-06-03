# Vivaloop — Prototype d'application

> Projet académique TED6015 · TÉLUQ · 2026

Vivaloop est un prototype d'application web conçu pour soutenir l'**autorégulation des saines habitudes de vie** chez les élèves du primaire et du secondaire. Il s'appuie sur le modèle d'apprentissage autorégulé de **Barry J. Zimmerman** (préméditation, performance, auto-réflexion).

---

## Structure du projet

```
vivaloop-prototype/
├── index.html                      # Menu de navigation entre les écrans
│
├── connexion.html                  # Choix du rôle (Élève / Enseignant)
│
├── accueil.html                    # Tableau de bord élève
├── journal-activite.html           # Journal · Étape 1/5
├── journal-alimentation.html       # Journal · Étape 2/5
├── journal-sommeil.html            # Journal · Étape 3/5
├── journal-emotions.html           # Journal · Étape 4/5
├── journal-ecrans.html             # Journal · Étape 5/5
├── defi-du-jour.html               # Défi personnalisé (IA)
├── validation-defi.html            # Validation du défi (lendemain)
├── stats.html                      # Statistiques et trophées
├── vestiaire.html                  # Personnalisation de l'avatar
│
├── enseignant-accueil.html         # Vue macro des groupes
├── enseignant-groupe.html          # Détail d'un groupe
├── enseignant-laboratoire.html     # Activités IA interdisciplinaires
├── enseignant-recompenses.html     # Envoi de badges
│
└── netlify/
    └── functions/                  # Fonctions serverless (Phase 4)
```

## Technologies utilisées

- **HTML5 / CSS3 / JavaScript** — interfaces statiques autonomes
- **Tailwind CSS** via CDN — design utilitaire
- **Lucide Icons** — iconographie
- **Netlify Functions** — backend serverless (Phase 4)
- **Google Gemini API** — génération de défis par l'IA (Phase 4)

## Comment explorer le prototype

**Option 1 — Menu de navigation (recommandé)**
Ouvre `index.html` dans ton navigateur.

**Option 2 — Parcours complet**
Commence par `connexion.html` pour vivre l'expérience utilisateur.

### Parcours suggérés

| Parcours | Écrans |
|---|---|
| Routine matinale d'une élève | `connexion` → `accueil` → `journal` (5 étapes) → `defi-du-jour` |
| Retour le lendemain | `accueil` → `validation-defi` |
| Exploration ludique | `accueil` → `vestiaire` → `stats` |
| Vue enseignant | `connexion` → `enseignant-accueil` → `enseignant-groupe` → `enseignant-laboratoire` |

## Phases de développement

| Phase | Description | Statut |
|---|---|---|
| Phase 1 | Conception pédagogique | Terminé |
| Phase 2 | Architecture et design système | Terminé |
| Phase 3 | Prototype haute fidélité (15 écrans) | Terminé |
| Phase 4 | Intégration IA (Gemini) via Netlify Functions | En cours |

## Contexte académique

Ce prototype est réalisé dans le cadre du cours **TED6015** à la **TÉLUQ** (Université du Québec). Il s'agit d'une maquette interactive haute fidélité destinée à valider les choix de conception UX/UI et pédagogiques avant le développement complet.
