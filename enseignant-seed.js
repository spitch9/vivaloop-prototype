/* ============================================================================
   enseignant-seed.js — Données statiques de l'univers enseignant
   ----------------------------------------------------------------------------
   Le champ profil.role conditionne le comportement des prompts IA :
   "specialiste" → une activité obligatoirement dans la spécialité + badge "TON DOMAINE"
   "titulaire"   → 3 matières libres, pas de contrainte ni de badge
   ========================================================================== */

const ENSEIGNANT_SEED = {
  version_schema: "1.0",

  profil: {
    civilite: "M.",
    prenom: "Patrick",
    nom: "Martin",
    role: "specialiste",               // "specialiste" | "titulaire"
    specialite: "Éducation physique"   // pertinent uniquement si role === "specialiste"
  },

  groupes: [
    {
      id: "5eA",
      nom_affichage: "5e A",
      niveau_scolaire: "5e année",
      nb_eleves: 24,
      tendances_7j: {
        sommeil:      "à soutenir",
        alimentation: "à surveiller",
        activite:     "belle énergie",
        emotions:     "à surveiller",
        ecrans:       "à surveiller"
      }
    }
  ]
};
