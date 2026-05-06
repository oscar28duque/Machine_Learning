const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-latest:generateContent";

const KNOWLEDGE_BASE = `
REGLAS DE COMPORTAMIENTO DEL ASISTENTE
- Eres el asistente de AI Academy.
- Solo respondes sobre la plataforma, cursos e instructor.
- Si una pregunta esta fuera de contexto, responde exactamente:
"Lo siento, solo puedo responder preguntas sobre nuestra plataforma, cursos e instructores."
`;

function buildContents(userMessage, history = []) {
  return [
    { role: "user", parts: [{ text: KNOWLEDGE_BASE }] },
    { role: "model", parts: [{ text: "Entendido, respondere solo sobre la plataforma." }] },
    ...history,
    { role: "user", parts: [{ text: userMessage }] },
  ];
}

async function callGemini(url, apiKey, contents) {
  const response = await fetch(`${url}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents,
      generationConfig: {
        maxOutputTokens: 512,
        temperature: 0.3,
      },
    }),
  });
  const data = await response.json().catch(() => ({}));
  return { response, data };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: { message: "Metodo no permitido." } });
  }

  const apiKey = process.env.GEMINI_API_KEY || "";
  if (!apiKey) {
    return res.status(500).json({
      error: { message: "Falta GEMINI_API_KEY en variables de entorno del servidor." },
    });
  }

  const { userMessage = "", history = [] } = req.body || {};
  const contents = buildContents(userMessage, history);

  let { response, data } = await callGemini(GEMINI_API_URL, apiKey, contents);
  if (!response.ok && response.status === 404) {
    const fallbackUrl = GEMINI_API_URL.replace(
      "gemini-2.0-flash-latest:generateContent",
      "gemini-2.0-flash:generateContent"
    );
    ({ response, data } = await callGemini(fallbackUrl, apiKey, contents));
  }

  if (!response.ok) {
    const message = data?.error?.message || `Error HTTP ${response.status}`;
    return res.status(response.status).json({ error: { message } });
  }

  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!text) {
    return res.status(502).json({ error: { message: "Respuesta vacia del modelo." } });
  }

  return res.status(200).json({ text });
}
