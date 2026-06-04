/* ============================================================================
   maya-seed.js — Données de départ de Maya (Vivaloop)
   ----------------------------------------------------------------------------
   Rôle : ces données pré-remplies sont copiées une seule fois dans le
   localStorage du navigateur au tout premier chargement de la démo
   (approche hybride). Ensuite, tout se lit et s'écrit dans localStorage.

   À charger dans les pages HTML via une balise classique :
       <script src="maya-seed.js"></script>
   La constante MAYA_SEED devient alors accessible partout.

   Note sur les dates : on stocke des décalages relatifs (jour_relatif).
   -1 = hier, ... -7 = il y a une semaine. La logique d'initialisation
   (à venir) transformera ces décalages en vraies dates à partir du jour
   réel, pour que la démo reste cohérente quel que soit le jour de l'éval.
   ========================================================================== */

const MAYA_SEED = {
  version_schema: "1.0",
  date_initialisation: null,   // rempli automatiquement au 1er chargement (date réelle ISO)

  // ---------- IDENTITÉ ----------
  profil: {
    prenom: "Maya",
    age: 10,
    niveau_scolaire: "5e année",
    groupe: "5e A",                 // rattache Maya au groupe de M. Martin
    avatar: {
      base: "renarde",
      items_equipes: ["tuque_hiver", "lunettes_etoiles"],
      items_possedes: ["tuque_hiver", "lunettes_etoiles", "cape_verte"]
    },
    niveau: 7,
    xp_actuel: 340,
    xp_palier_suivant: 500,
    xp_total: 3140,
    serie_assiduite: 5              // jours consécutifs avec journal rempli (écran accueil)
  },

  // ---------- TENDANCES SUR 7 JOURS ----------
  // Résumé pré-calculé pour stats.html et le tableau de bord enseignant.
  // Vocabulaire à 3 niveaux, sans rouge (grammaire pédagogique non punitive).
  tendances_7j: {
    sommeil:      "belle énergie",
    alimentation: "à surveiller",
    activite:     "belle énergie",
    emotions:     "à surveiller",
    ecrans:       "à soutenir"      // pilier faible : justifie le défi ÉCRANS du jour
  },

  // ---------- JOURNAL DES 7 DERNIERS JOURS ----------
  // jour_relatif : -1 = hier, ... -7 = il y a une semaine.
  journal: [
    {
      jour_relatif: -7,
      sommeil:      { coucher: "21:15", reveil: "07:00", duree_min: 585 },  // 9h45
      alimentation: { question_id: "q_couleurs", reponse: "oui" },
      activite:     { minutes: 45, type: "soccer" },
      emotions:     { humeur: "bien" },
      ecrans:       { minutes: 160 },
      vraisemblance: "ok"
    },
    {
      jour_relatif: -6,
      sommeil:      { coucher: "21:30", reveil: "06:30", duree_min: 540 },  // 9h00
      alimentation: { question_id: "q_eau", reponse: "un peu" },
      activite:     { minutes: 30, type: "vélo" },
      emotions:     { humeur: "moyen" },
      ecrans:       { minutes: 145 },
      vraisemblance: "ok"
    },
    {
      jour_relatif: -5,
      sommeil:      { coucher: "21:00", reveil: "06:15", duree_min: 555 },  // 9h15
      alimentation: { question_id: "q_fibres", reponse: "pas encore" },
      activite:     { minutes: 0, type: "repos" },
      emotions:     { humeur: "moyen" },
      ecrans:       { minutes: 180 },
      vraisemblance: "ok"
    },
    {
      jour_relatif: -4,
      sommeil:      { coucher: "22:00", reveil: "06:30", duree_min: 510 },  // 8h30
      alimentation: { question_id: "q_couleurs", reponse: "un peu" },
      activite:     { minutes: 50, type: "danse" },
      emotions:     { humeur: "difficile" },
      ecrans:       { minutes: 200 },
      vraisemblance: "ok"
    },
    {
      jour_relatif: -3,                                                     // JOUR "TROP PARFAIT"
      sommeil:      { coucher: "20:00", reveil: "07:30", duree_min: 690 },  // 11h30
      alimentation: { question_id: "q_eau", reponse: "oui" },
      activite:     { minutes: 120, type: "course" },
      emotions:     { humeur: "super" },
      ecrans:       { minutes: 10 },
      vraisemblance: "suspect",   // combinaison invraisemblable : filtre de vraisemblance déclenché
      note_filtre: "Rétroaction adaptée et non culpabilisante : invitation douce à noter ce qui s'est vraiment passé."
    },
    {
      jour_relatif: -2,
      sommeil:      { coucher: "21:20", reveil: "06:50", duree_min: 570 },  // 9h30
      alimentation: { question_id: "q_sans_ecran", reponse: "un peu" },
      activite:     { minutes: 40, type: "récréation active" },
      emotions:     { humeur: "moyen" },
      ecrans:       { minutes: 170 },
      vraisemblance: "ok"
    },
    {
      jour_relatif: -1,                                                     // hier
      sommeil:      { coucher: "21:10", reveil: "07:10", duree_min: 600 },  // 10h00
      alimentation: { question_id: "q_couleurs", reponse: "oui" },
      activite:     { minutes: 35, type: "marche" },
      emotions:     { humeur: "bien" },
      ecrans:       { minutes: 185 },
      vraisemblance: "ok"
    }
  ],

  // ---------- HISTORIQUE DES DÉFIS ----------
  // Sert à deux choses :
  //  1) éviter la répétition (originalité) : le défi d'hier était ÉCRANS,
  //     donc le défi du jour devra être un AUTRE défi ÉCRANS (différent).
  //  2) alimenter validation-defi.html : le défi d'hier est "accepté"
  //     mais PAS encore validé, donc l'écran de validation a de quoi afficher.
  defis: [
    {
      jour_relatif: -1,
      titre: "L'Explorateur Sans Écran",   // aligné sur le rappel codé en dur de validation-defi.html
      pilier: "ÉCRANS", emoji: "🌳", rarete: "ÉPIQUE", xp: 100,
      statut: "accepté",                   // accepté hier, en attente de validation aujourd'hui
      validation: null
    },
    {
      jour_relatif: -2,
      titre: "Le Funambule du Matin",
      pilier: "ACTIVITÉ", emoji: "🤸", rarete: "FACILE", xp: 40,
      statut: "validé",
      // Temps 1 = resultat ("yes" | "partial" | "no")
      // Temps 2 = reflexion (valeur d'option, ou null si "Passer cette étape")
      // Temps 3 = xp_obtenu (récompense effectivement accordée)
      validation: { resultat: "yes", reflexion: "energise", xp_obtenu: 40 }
    },
    {
      jour_relatif: -3,
      titre: "L'Arc-en-ciel dans l'assiette",
      pilier: "ALIMENTATION", emoji: "🥦", rarete: "FACILE", xp: 40,
      statut: "refusé",
      validation: null
    },
    {
      jour_relatif: -4,
      titre: "La Météo des Humeurs",
      pilier: "ÉMOTIONS", emoji: "🌤️", rarete: "MOYEN", xp: 60,
      statut: "validé",
      validation: { resultat: "partial", reflexion: "contexte", xp_obtenu: 30 }
    },
    {
      jour_relatif: -5,
      titre: "Le Gardien du Sommeil",
      pilier: "SOMMEIL", emoji: "🌙", rarete: "FACILE", xp: 40,
      statut: "refusé",
      validation: null
    }
  ],

  // Défi du jour courant : généré par Gemini au Chantier A. Vide au départ.
  // (Le défi de secours / fallback vivra dans la logique du Chantier A.)
  defi_du_jour: null,

  // ---------- ARMOIRE À TROPHÉES ----------
  trophees: [
    { id: "serie_5",       nom: "5 jours d'affilée",          emoji: "🔥", obtenu_jour_relatif: -1,  source: "auto" },
    { id: "nuit_complete", nom: "Trois belles nuits",         emoji: "🌙", obtenu_jour_relatif: -12, source: "auto" },
    { id: "bravo_martin",  nom: "Encouragement de M. Martin", emoji: "⭐", obtenu_jour_relatif: -4,  source: "enseignant" }
  ]
};
