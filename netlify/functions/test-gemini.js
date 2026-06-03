// Fonction de test : appelle l'API Google Gemini et retourne un défi santé
exports.handler = async function (event, context) {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, body: "" };
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: "Variable d'environnement GEMINI_API_KEY manquante.",
      }),
    };
  }

  const prompt =
    "Tu es un coach santé pour des élèves du primaire (6 à 12 ans). Génère UN SEUL défi santé court et concret que l'élève peut accomplir aujourd'hui.\n\n" +
    "CONTRAINTES STRICTES :\n" +
    "- Réponds UNIQUEMENT avec le défi, sans préambule comme 'Voici un défi' ou 'Super idée'\n" +
    "- Maximum 2 phrases\n" +
    "- Vocabulaire adapté à un enfant de 8-10 ans\n" +
    "- Le défi doit cibler un des 5 piliers : sommeil, alimentation, activité physique, gestion du stress, ou bien-être numérique\n" +
    "- Formule positive (action à faire, pas restriction)\n\n" +
    "Réponds directement avec le défi, sans aucun texte autour.";

  const generationConfig = {
    temperature: 0.8,
    maxOutputTokens: 500,
    thinkingConfig: {
      thinkingBudget: 0,
    },
  };

  console.log("=== APPEL GEMINI ===");
  console.log("Prompt envoyé:", prompt);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig,
        }),
      }
    );

    const data = await response.json();
    console.log("Réponse brute Gemini:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: "Erreur API Gemini",
          httpStatus: response.status,
          details: data,
        }),
      };
    }

    const defi =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Aucune réponse générée.";
    console.log("Defi extrait:", defi);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ defi }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: "Erreur réseau ou serveur",
        details: err.message,
      }),
    };
  }
};
