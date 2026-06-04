/* ============================================================================
   vivaloop-data.js — Couche de données de Vivaloop (approche hybride)
   ----------------------------------------------------------------------------
   Rôle : au premier chargement, copie les données de MAYA_SEED dans le
   localStorage du navigateur, en transformant les décalages relatifs
   (jour_relatif) en vraies dates calculées à partir du jour réel.
   Ensuite, les écrans lisent et écrivent la "vie" de Maya via les trois
   fonctions publiques ci-dessous, sans jamais toucher au localStorage
   directement.

   À charger APRÈS maya-seed.js dans chaque page qui utilise les données :
       <script src="maya-seed.js"></script>
       <script src="vivaloop-data.js"></script>

   API publique (accessible partout via window.VivaData) :
       VivaData.charger()        -> lit les données (et amorce si besoin)
       VivaData.sauvegarder(obj) -> enregistre les données modifiées
       VivaData.reinitialiser()  -> remet la démo à zéro et renvoie les données
   ========================================================================== */

(function () {
  const CLE = "vivaloop_maya";   // clé unique dans le localStorage

  // Formate une date en chaîne locale "AAAA-MM-JJ" (sans décalage de fuseau).
  function formaterDateLocale(d) {
    const annee = d.getFullYear();
    const mois  = String(d.getMonth() + 1).padStart(2, "0");
    const jour  = String(d.getDate()).padStart(2, "0");
    return annee + "-" + mois + "-" + jour;
  }

  // Transforme un décalage (-1 = hier, -7 = il y a une semaine) en date réelle.
  function dateDepuisDecalage(decalage) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + decalage);   // décalage négatif = dans le passé
    return formaterDateLocale(d);
  }

  // Prépare une copie du seed avec de vraies dates (sans modifier MAYA_SEED).
  function preparerDepuisSeed() {
    const data = JSON.parse(JSON.stringify(MAYA_SEED));   // copie indépendante
    data.date_initialisation = new Date().toISOString();

    data.journal.forEach(function (j) {
      j.date = dateDepuisDecalage(j.jour_relatif);
    });
    data.defis.forEach(function (d) {
      d.date = dateDepuisDecalage(d.jour_relatif);
    });
    data.trophees.forEach(function (t) {
      if (typeof t.obtenu_jour_relatif === "number") {
        t.date_obtention = dateDepuisDecalage(t.obtenu_jour_relatif);
      }
    });
    return data;
  }

  // Amorce le localStorage si vide, illisible, ou si la version a changé.
  function amorcerSiNecessaire() {
    let brut = null;
    try {
      brut = localStorage.getItem(CLE);
    } catch (e) {
      brut = null;   // localStorage indisponible (rare)
    }

    if (brut) {
      try {
        const existant = JSON.parse(brut);
        if (existant && existant.version_schema === MAYA_SEED.version_schema) {
          return;   // déjà amorcé avec la bonne version : on ne touche à rien
        }
      } catch (e) {
        // données illisibles : on ré-amorce proprement ci-dessous
      }
    }

    localStorage.setItem(CLE, JSON.stringify(preparerDepuisSeed()));
  }

  // === API publique ===
  const VivaData = {
    charger: function () {
      amorcerSiNecessaire();
      return JSON.parse(localStorage.getItem(CLE));
    },
    sauvegarder: function (data) {
      localStorage.setItem(CLE, JSON.stringify(data));
    },
    reinitialiser: function () {
      const data = preparerDepuisSeed();
      localStorage.setItem(CLE, JSON.stringify(data));
      return data;
    }
  };

  // Amorçage automatique dès le chargement du script.
  amorcerSiNecessaire();

  // Rendre l'API accessible depuis toutes les pages.
  window.VivaData = VivaData;
})();
