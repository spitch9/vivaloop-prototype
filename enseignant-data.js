/* ============================================================================
   enseignant-data.js — Accès aux données de l'univers enseignant
   ----------------------------------------------------------------------------
   Le seed est statique (ENSEIGNANT_SEED), lu directement. Seul élément
   mutable : le cache des trois activités proposées du moment, conservé
   dans le localStorage sous une clé dédiée pour ne pas se mêler à
   l'univers de Maya.

   À charger APRÈS enseignant-seed.js dans chaque page enseignant :
       <script src="enseignant-seed.js"></script>
       <script src="enseignant-data.js"></script>

   API publique (window.EnsData) :
       EnsData.profil()             -> profil de l'enseignant
       EnsData.groupe(id)           -> groupe par id (ou premier si omis)
       EnsData.lireCache()          -> objet cache, ou null si absent
       EnsData.ecrireCache(obj)     -> écrit dans le cache
       EnsData.viderCache()         -> efface le cache
   ========================================================================== */

(function () {
  const CLE = "vivaloop_enseignant";

  const EnsData = {
    profil: function () {
      return ENSEIGNANT_SEED.profil;
    },

    groupe: function (id) {
      if (id) {
        return ENSEIGNANT_SEED.groupes.find(function (g) { return g.id === id; });
      }
      return ENSEIGNANT_SEED.groupes[0];  // par défaut, premier groupe
    },

    lireCache: function () {
      try {
        const brut = localStorage.getItem(CLE);
        return brut ? JSON.parse(brut) : null;
      } catch (e) {
        return null;
      }
    },

    ecrireCache: function (obj) {
      try {
        localStorage.setItem(CLE, JSON.stringify(obj));
      } catch (e) {
        // localStorage indisponible : on ignore silencieusement
      }
    },

    viderCache: function () {
      try {
        localStorage.removeItem(CLE);
      } catch (e) {
        // idem
      }
    }
  };

  window.EnsData = EnsData;
})();
