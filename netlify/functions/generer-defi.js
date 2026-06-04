/* ============================================================================
   netlify/functions/generer-defi.js
   ----------------------------------------------------------------------------
   Génère UN défi quotidien Vivaloop via Gemini (gemini-2.5-flash), en sortie
   JSON structurée (responseSchema). La clé API reste côté serveur.

   Reçoit (POST, corps JSON) :
       { "pilier": "ÉCRANS", "titresExclus": ["Titre A", "Titre B"] }
   Renvoie (200) :
       { titre, pilier, emoji, description, rarete, xp, source: "ia" }
   En cas d'échec (Gemini occupé, quota, etc.), renvoie un code d'erreur :
   la page appelante bascule alors sur sa banque de secours.
   ========================================================================== */

const MODELE = "gemini-2.5-flash";

// Courte description de chaque pilier, insérée dans le prompt.
const DESCRIPTIONS_PILIER = {
  "SOMMEIL":      "favoriser un sommeil suffisant et réparateur (routine du soir, heure de coucher régulière, calme avant de dormir)",
  "ALIMENTATION": "favoriser une alimentation variée et une bonne hydratation (fruits, légumes, eau, repas en pleine conscience)",
  "ÉCRANS":       "favoriser des moments sans écran récréatif et un usage équilibré des écrans",
  "ÉMOTIONS":     "favoriser le bien-être émotionnel (reconnaître ses émotions, se calmer, exprimer ce qu'on ressent)",
  "ACTIVITÉ":     "favoriser le mouvement et l'activité physique au quotidien"
};

const XP_RARETE = { "FACILE": 40, "MOYEN": 60, "ÉPIQUE": 100 };

// Normalise la rareté renvoyée par l'IA (tolérant aux accents et à la casse).
function normaliserRarete(valeur) {
  const v = (valeur || "").toString().trim().toUpperCase();
  if (v.indexOf("FAC") === 0) return "FACILE";
  if (v.indexOf("MOY") === 0) return "MOYEN";
  if (v.indexOf("EPI") === 0 || v.indexOf("ÉPI") === 0) return "ÉPIQUE";
  return "MOYEN";
}

function construirePrompt(pilier, titresExclus) {
  const description = DESCRIPTIONS_PILIER[pilier] || DESCRIPTIONS_PILIER["ÉCRANS"];
  const titres = (titresExclus && titresExclus.length)
    ? titresExclus.join(", ")
    : "aucun pour l'instant";
  return [
    "Tu es Viva, une intelligence artificielle bienveillante qui accompagne des",
    "élèves du primaire dans le développement de saines habitudes de vie.",
    "",
    "Génère UN seul défi quotidien pour un élève de 10 ans, ciblant ce pilier :",
    description,
    "",
    "Règles à respecter absolument :",
    "- Ton positif, ludique et encourageant, jamais culpabilisant.",
    "- Propose une action à faire, jamais une interdiction ni une restriction.",
    "- Le défi doit être concret, simple, et réalisable en une seule journée par un enfant de 10 ans.",
    "- Aucun jugement négatif, aucune pression de performance.",
    "",
    "N'utilise PAS ces titres déjà proposés récemment : " + titres,
    "",
    "Champs attendus :",
    "- titre : court et accrocheur (2 à 4 mots), style petite aventure",
    "- emoji : un seul emoji qui représente le défi",
    "- description : 1 à 2 phrases qui expliquent l'action, ton positif",
    "- rarete : FACILE, MOYEN ou ÉPIQUE selon l'effort demandé"
  ].join("\n");
}

// Forme imposée à la réponse de Gemini.
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

  let pilier = "ÉCRANS";
  let titresExclus = [];
  try {
    const donnees = JSON.parse(event.body || "{}");
    if (donnees.pilier) pilier = donnees.pilier;
    if (Array.isArray(donnees.titresExclus)) titresExclus = donnees.titresExclus;
  } catch (e) {
    // corps illisible : on conserve les valeurs par défaut
  }

  const prompt = construirePrompt(pilier, titresExclus);
  let derniereErreur = "";

  // Jusqu'à 3 tentatives pour absorber les erreurs 503 / 429 fréquentes en gratuit.
  for (let tentative = 1; tentative <= 3; tentative++) {
    try {
      const reponse = await appelerGemini(prompt, cle);

      if (reponse.status === 503 || reponse.status === 429) {
        derniereErreur = "Gemini occupé (" + reponse.status + ")";
        await new Promise(function (r) { setTimeout(r, 600 * tentative); });
        continue;
      }
      if (!reponse.ok) {
        derniereErreur = "Réponse Gemini " + reponse.status;
        break;
      }

      const data = await reponse.json();
      const texte = data &&
        data.candidates &&
        data.candidates[0] &&
        data.candidates[0].content &&
        data.candidates[0].content.parts &&
        data.candidates[0].content.parts[0] &&
        data.candidates[0].content.parts[0].text;

      if (!texte) {
        derniereErreur = "Réponse Gemini vide";
        break;
      }

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
      // on retente si des tentatives restent
    }
  }

  return {
    statusCode: 502,
    body: JSON.stringify({ erreur: "Génération impossible", detail: derniereErreur })
  };
};
