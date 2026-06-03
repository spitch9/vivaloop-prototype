// Fonction de test : appelle l'API Google Gemini et retourne un défi santé
exports.handler = async function (event, context) {
  // Refuse les requêtes autres que GET et POST
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
    "Génère un défi santé court et motivant pour un élève du primaire (2-3 phrases maximum). " +
    "Le défi doit porter sur l'activité physique, l'alimentation, le sommeil, les émotions ou le temps d'écran. " +
    "Utilise un ton encourageant et accessible pour un enfant de 8 à 12 ans.";

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 150,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    return {
      statusCode: response.status,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Erreur API Gemini", details: errorBody }),
    };
  }

  const data = await response.json();
  const defi =
    data.candidates?.[0]?.content?.parts?.[0]?.text ||
    "Aucune réponse générée.";

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ defi }),
  };
};
