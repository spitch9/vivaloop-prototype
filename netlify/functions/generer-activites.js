/* ============================================================================
   netlify/functions/generer-activites.js  (v2 — correction bugs 502)
   ----------------------------------------------------------------------------
   Corrections apportées :
   - Tous les break sur erreur/validation remplacés par continue (3 tentatives).
   - Suppression de l'enum sur duree_min (entier) et de minItems/maxItems :
     ces contraintes ne sont pas universellement supportées par Gemini.
   - Délai de retry réduit : 400 ms × tentative (évite le timeout Netlify 10 s).
   ========================================================================== */

const MODELE = "gemini-2.5-flash";

const MATIERES_AUTORISEES = [
  "Éducation physique",
  "Mathématiques",
  "Arts plastiques",
  "Français",
  "Sciences",
  "Univers social",
  "Musique"
];

const DESCRIPTIONS_PILIER = {
  "SOMMEIL":      "favoriser un sommeil suffisant et réparateur (durée adéquate, routine du coucher, hygiène du sommeil)",
  "ALIMENTATION": "favoriser une alimentation variée et l'hydratation",
  "ÉCRANS":       "favoriser un usage équilibré des écrans et des moments sans écran",
  "ÉMOTIONS":     "favoriser le bien-être émotionnel (reconnaître ses émotions, se calmer, exprimer ce qu'on ressent)",
  "ACTIVITÉ":     "favoriser le mouvement et l'activité physique au quotidien"
};

function construirePrompt(pilier, specialite, titresExclus) {
  const description = DESCRIPTIONS_PILIER[pilier] || DESCRIPTIONS_PILIER["SOMMEIL"];
  const titres = (titresExclus && titresExclus.length)
    ? titresExclus.join(", ")
    : "aucun pour l'instant";
  return [
    "Tu es Viva, une intelligence artificielle bienveillante qui assiste des",
    "enseignant.e.s du primaire au Québec à concevoir des activités pédagogiques.",
    "",
    "Pour un groupe de 5e année du primaire dont le point faible cette semaine",
    "est le pilier suivant : " + description,
    "",
    "Génère exactement 3 activités pédagogiques interdisciplinaires qui ciblent",
    "ce pilier. L'enseignant.e a pour spécialité : " + specialite,
    "",
    "Règles à respecter absolument :",
    "- Les 3 activités doivent porter sur 3 matières DIFFÉRENTES.",
    "- L'une des 3 doit obligatoirement relever de la spécialité de l'enseignant.e.",
    "- Les matières doivent être choisies parmi : " + MATIERES_AUTORISEES.join(", ") + ".",
    "- Ton positif et concret, sans culpabilisation des élèves.",
    "- Chaque activité doit être réalisable en classe par des élèves de 10 à 11 ans.",
    "",
    "N'utilise PAS ces titres déjà proposés récemment : " + titres,
    "",
    "Pour chaque activité, fournis :",
    "- matiere : la matière (exactement comme dans la liste autorisée)",
    "- titre : court et accrocheur (2 à 6 mots)",
    "- description : 1 à 2 phrases qui expliquent l'activité concrètement",
    "- duree_min : durée en minutes (entier : 15, 20, 30, 40, 45 ou 60)",
    "- audience : format de travail (ex. : \"Classe entière\", \"Équipes\", \"Duos\", \"Individuel\", \"Gymnase\")",
    "- difficulte : FACILE, MOYEN ou DIFFICILE"
  ].join("\n");
}

// Schéma JSON allégé : pas d'enum entier ni de minItems/maxItems.
const SCHEMA_ACTIVITE = {
  type: "object",
  properties: {
    matiere:     { type: "string", enum: MATIERES_AUTORISEES },
    titre:       { type: "string" },
    description: { type: "string" },
    duree_min:   { type: "integer" },
    audience:    { type: "string" },
    difficulte:  { type: "string", enum: ["FACILE", "MOYEN", "DIFFICILE"] }
  },
  required: ["matiere", "titre", "description", "duree_min", "audience", "difficulte"]
};

const SCHEMA = {
  type: "object",
  properties: {
    activites: { type: "array", items: SCHEMA_ACTIVITE }
  },
  required: ["activites"]
};

function appelerGemini(prompt, cle) {
  const url = "https://generativelanguage.googleapis.com/v1beta/models/" +
    MODELE + ":generateContent?key=" + cle;
  const corps = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.9,
      maxOutputTokens: 1500,
      thinkingConfig: { thinkingBudget: 0 },
      responseMimeType: "application/json",
      responseSchema: SCHEMA
    }
  };
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(corps)
  });
}

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ erreur: "Méthode non autorisée" }) };
  }

  const cle = process.env.GEMINI_API_KEY;
  if (!cle) {
    return { statusCode: 500, body: JSON.stringify({ erreur: "Clé API manquante" }) };
  }

  let pilier = "SOMMEIL";
  let specialite = "Éducation physique";
  let titresExclus = [];
  try {
    const donnees = JSON.parse(event.body || "{}");
    if (donnees.pilier)    pilier    = donnees.pilier;
    if (donnees.specialite) specialite = donnees.specialite;
    if (Array.isArray(donnees.titresExclus)) titresExclus = donnees.titresExclus;
  } catch (e) {
    // corps illisible : valeurs par défaut
  }

  const prompt = construirePrompt(pilier, specialite, titresExclus);
  let derniereErreur = "";

  for (let tentative = 1; tentative <= 3; tentative++) {
    try {
      const reponse = await appelerGemini(prompt, cle);

      if (reponse.status === 503 || reponse.status === 429) {
        derniereErreur = "Gemini occupé (" + reponse.status + ")";
        await new Promise(function (r) { setTimeout(r, 400 * tentative); });
        continue;  // attendre puis réessayer
      }
      if (!reponse.ok) {
        derniereErreur = "Réponse Gemini " + reponse.status;
        continue;  // réessayer même sur 400, le schéma allégé devrait éviter ces cas
      }

      const data = await reponse.json();
      const texte = data && data.candidates && data.candidates[0] &&
                    data.candidates[0].content && data.candidates[0].content.parts &&
                    data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text;
      if (!texte) {
        derniereErreur = "Réponse Gemini vide";
        continue;
      }

      const brut = JSON.parse(texte);
      if (!brut.activites || !Array.isArray(brut.activites) || brut.activites.length < 3) {
        derniereErreur = "Nombre d'activités insuffisant";
        continue;
      }

      const lesActivites = brut.activites.slice(0, 3);

      // Vérifier 3 matières distinctes.
      const matieres = lesActivites.map(function (a) { return a.matiere; });
      if (new Set(matieres).size !== 3) {
        derniereErreur = "Trois matières différentes attendues";
        continue;  // réessayer
      }

      // Vérifier qu'une activité correspond à la spécialité.
      const indexSpecialite = lesActivites.findIndex(function (a) {
        return a.matiere === specialite;
      });
      if (indexSpecialite === -1) {
        derniereErreur = "Aucune activité dans la spécialité de l'enseignant";
        continue;  // réessayer
      }

      // Marquer "TON DOMAINE" et placer la spécialité au centre.
      lesActivites.forEach(function (a) { a.est_domaine_enseignant = false; });
      lesActivites[indexSpecialite].est_domaine_enseignant = true;

      const epsAct  = lesActivites[indexSpecialite];
      const autres  = lesActivites.filter(function (_, i) { return i !== indexSpecialite; });
      const ordonnees = [autres[0], epsAct, autres[1]];

      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activites: ordonnees, source: "ia" })
      };

    } catch (e) {
      derniereErreur = (e && e.message) ? e.message : "Erreur inconnue";
      // réessayer automatiquement
    }
  }

  return {
    statusCode: 502,
    body: JSON.stringify({ erreur: "Génération impossible", detail: derniereErreur })
  };
};
