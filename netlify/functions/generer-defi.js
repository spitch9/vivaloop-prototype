/* ============================================================================
   netlify/functions/generer-defi.js  (v3 — prompts portables)
   ----------------------------------------------------------------------------
   Reçoit maintenant age et niveauScolaire depuis la page (lus dans le profil
   de l'élève). Le prompt s'adapte automatiquement selon le profil réel.
   Valeurs par défaut : 10 ans, 5e année (compatibilité si paramètres absents).
   ========================================================================== */

const MODELE = "gemini-2.5-flash";

const DESCRIPTIONS_PILIER = {
  "SOMMEIL":      "favoriser un sommeil suffisant et réparateur (durée adéquate, routine du coucher, hygiène du sommeil)",
  "ALIMENTATION": "favoriser une alimentation variée et une bonne hydratation (fruits, légumes, eau, repas en pleine conscience)",
  "ÉCRANS":       "favoriser des moments sans écran récréatif et un usage équilibré des écrans",
  "ÉMOTIONS":     "favoriser le bien-être émotionnel (reconnaître ses émotions, se calmer, exprimer ce qu'on ressent)",
  "ACTIVITÉ":     "favoriser le mouvement et l'activité physique au quotidien"
};

const XP_RARETE = { "FACILE": 40, "MOYEN": 60, "ÉPIQUE": 100 };

function normaliserRarete(valeur) {
  const v = (valeur || "").toString().trim().toUpperCase();
  if (v.indexOf("FAC") === 0) return "FACILE";
  if (v.indexOf("MOY") === 0) return "MOYEN";
  if (v.indexOf("EPI") === 0 || v.indexOf("ÉPI") === 0) return "ÉPIQUE";
  return "MOYEN";
}

function construirePrompt(pilier, age, niveauScolaire) {
  const description = DESCRIPTIONS_PILIER[pilier] || DESCRIPTIONS_PILIER["ÉCRANS"];
  return [
    "Tu es Viva, une intelligence artificielle bienveillante qui accompagne des",
    "élèves du primaire dans le développement de saines habitudes de vie.",
    "",
    "Génère UN seul défi quotidien pour un élève de " + age + " ans (" + niveauScolaire + "),",
    "ciblant ce pilier : " + description,
    "",
    "Règles à respecter absolument :",
    "- Ton positif, ludique et encourageant, jamais culpabilisant.",
    "- Propose une action à faire, jamais une interdiction ni une restriction.",
    "- Le défi doit être concret, simple, et réalisable en une seule journée par un enfant de " + age + " ans.",
    "- Aucun jugement négatif, aucune pression de performance.",
    "",
    "Champs attendus :",
    "- titre : court et accrocheur (2 à 4 mots), style petite aventure",
    "- emoji : un seul emoji qui représente le défi",
    "- description : 1 à 2 phrases qui expliquent l'action, ton positif",
    "- rarete : FACILE, MOYEN ou ÉPIQUE selon l'effort demandé"
  ].join("\n");
}

const SCHEMA = {
  type: "object",
  properties: {
    titre:       { type: "string" },
    emoji:       { type: "string" },
    description: { type: "string" },
    rarete:      { type: "string", enum: ["FACILE", "MOYEN", "ÉPIQUE"] }
  },
  required: ["titre", "emoji", "description", "rarete"]
};

function appelerGemini(prompt, cle) {
  const url = "https://generativelanguage.googleapis.com/v1beta/models/" +
    MODELE + ":generateContent?key=" + cle;
  const corps = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.8,
      maxOutputTokens: 500,
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

  // Paramètres du défi — age et niveauScolaire viennent du profil de l'élève.
  // Valeurs par défaut pour compatibilité ascendante.
  let pilier = "ÉCRANS";
  let age = 10;
  let niveauScolaire = "5e année";
  try {
    const donnees = JSON.parse(event.body || "{}");
    if (donnees.pilier) pilier = donnees.pilier;
    if (typeof donnees.age === "number" && donnees.age > 0) age = donnees.age;
    if (donnees.niveauScolaire) niveauScolaire = donnees.niveauScolaire;
  } catch (e) {
    // corps illisible : valeurs par défaut
  }

  const prompt = construirePrompt(pilier, age, niveauScolaire);
  let derniereErreur = "";

  for (let tentative = 1; tentative <= 3; tentative++) {
    try {
      const reponse = await appelerGemini(prompt, cle);

      if (reponse.status === 503 || reponse.status === 429) {
        derniereErreur = "Gemini occupé (" + reponse.status + ")";
        await new Promise(function (r) { setTimeout(r, 400 * tentative); });
        continue;
      }
      if (!reponse.ok) {
        derniereErreur = "Réponse Gemini " + reponse.status;
        continue;
      }

      const data = await reponse.json();
      const texte = data &&
        data.candidates && data.candidates[0] &&
        data.candidates[0].content && data.candidates[0].content.parts &&
        data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text;
      if (!texte) { derniereErreur = "Réponse Gemini vide"; continue; }

      const brut = JSON.parse(texte);
      const rarete = normaliserRarete(brut.rarete);
      const defi = {
        titre:       (brut.titre || "Défi du jour").toString().trim(),
        pilier:      pilier,
        emoji:       (brut.emoji || "✨").toString().trim(),
        description: (brut.description || "").toString().trim(),
        rarete:      rarete,
        xp:          XP_RARETE[rarete] || 40,
        source:      "ia"
      };
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(defi)
      };
    } catch (e) {
      derniereErreur = (e && e.message) ? e.message : "Erreur inconnue";
    }
  }

  return {
    statusCode: 502,
    body: JSON.stringify({ erreur: "Génération impossible", detail: derniereErreur })
  };
};
