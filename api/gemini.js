const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
const GEMINI_FALLBACK_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

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

function localFallbackReply(userMessage) {
  const text = String(userMessage || "").toLowerCase();
  if (text.includes("curso") || text.includes("programa") || text.includes("modulo")) {
    return "Actualmente Gemini no tiene cuota disponible. Mientras tanto: ofrecemos 5 cursos (Fundamentos IA, Intro ML, ML con Algoritmos Geneticos, Deep Learning Fundamentos y Aplicaciones Deep Learning), cada uno con 6 modulos.";
  }
  if (text.includes("instructor") || text.includes("fabio") || text.includes("docente")) {
    return "Actualmente Gemini no tiene cuota disponible. Mientras tanto: el instructor principal es Fabio Alejandro Sastoque Rincon, especialista en ML, Deep Learning y optimizacion evolutiva.";
  }
  if (text.includes("historia") || text.includes("plataforma") || text.includes("ia")) {
    return "Actualmente Gemini no tiene cuota disponible. Mientras tanto: AI Academy es una plataforma de formacion practica en IA, con recorrido historico desde Turing (1950) hasta la IA generativa actual.";
  }
  return "Actualmente Gemini no tiene cuota disponible. Puedo ayudarte con informacion de cursos, instructor o plataforma de AI Academy.";
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

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function callGeminiWithRetry(url, apiKey, contents) {
  const delays = [0, 700, 1500];
  let lastResult = null;

  for (const delayMs of delays) {
    if (delayMs > 0) await sleep(delayMs);
    const result = await callGemini(url, apiKey, contents);
    lastResult = result;
    if (result.response.ok) return result;
    if (result.response.status !== 503) return result;
  }

  return lastResult;
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

  let { response, data } = await callGeminiWithRetry(GEMINI_API_URL, apiKey, contents);
  if (!response.ok && (response.status === 404 || response.status === 503)) {
    ({ response, data } = await callGeminiWithRetry(GEMINI_FALLBACK_URL, apiKey, contents));
  }

  if (!response.ok) {
    const message = data?.error?.message || `Error HTTP ${response.status}`;
    if (response.status === 429) {
      return res.status(200).json({ text: localFallbackReply(userMessage), fallback: true });
    }
    if (response.status === 503) {
      return res.status(200).json({
        text: "Gemini esta temporalmente saturado. Intenta en unos segundos. Mientras tanto: " + localFallbackReply(userMessage),
        fallback: true,
      });
    }
    return res.status(response.status).json({ error: { message } });
  }

  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!text) {
    return res.status(502).json({ error: { message: "Respuesta vacia del modelo." } });
  }

  return res.status(200).json({ text });
}
