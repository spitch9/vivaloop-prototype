/* ============================================================================
   enseignant-seed.js — Données statiques de l'univers enseignant
   ----------------------------------------------------------------------------
   Profil de M. Martin et liste de ses groupes, avec la tendance agrégée
   sur 7 jours par pilier (vocabulaire à 3 niveaux, sans rouge).
   Lecture seule : aucune réécriture côté navigateur.
   ========================================================================== */

const ENSEIGNANT_SEED = {
  version_schema: "1.0",

  profil: {
    civilite: "M.",
    prenom: "Patrick",
    nom: "Martin",
    specialite: "Éducation physique"
  },

  groupes: [
    {
      id: "5eA",
      nom_affichage: "5e A",       // aligné sur le groupe de Maya
      niveau_scolaire: "5e année",
      nb_eleves: 24,
      tendances_7j: {
        sommeil:      "à soutenir",     // pilier faible -> ciblé par le laboratoire
        alimentation: "à surveiller",
        activite:     "belle énergie",
        emotions:     "à surveiller",
        ecrans:       "à surveiller"
      }
    }
  ]
};
