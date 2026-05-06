import { CHATBOT, CONFIG, ensureConfigFromEnv } from "../config.js";
import { KNOWLEDGE_BASE } from "../data/knowledge-base.js";

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

function localFallbackReply(userMessage) {
  const text = userMessage.toLowerCase();

  if (text.includes("curso") || text.includes("programa") || text.includes("modulo")) {
    return "Tenemos 5 cursos: Fundamentos de IA, Introduccion al ML, ML con Algoritmos Geneticos, Deep Learning: Fundamentos y Aplicaciones de Deep Learning. Cada curso incluye 6 modulos y enfoque practico.";
  }

  if (text.includes("instructor") || text.includes("fabio") || text.includes("docente")) {
    return "El instructor principal es Fabio Alejandro Sastoque Rincon, especialista en Machine Learning, Deep Learning y optimizacion evolutiva, con experiencia en docencia y proyectos aplicados.";
  }

  if (text.includes("historia") || text.includes("ia") || text.includes("plataforma")) {
    return "AI Academy es una plataforma educativa de IA con enfoque practico. Incluye fundamentos, machine learning y deep learning, ademas de un recorrido historico desde Turing (1950) hasta la IA generativa actual.";
  }

  return CHATBOT.OUT_OF_SCOPE_MSG;
}

export async function sendMessageToGemini(userMessage, history = []) {
  await ensureConfigFromEnv();

  const contents = [
    { role: "user", parts: [{ text: KNOWLEDGE_BASE }] },
    { role: "model", parts: [{ text: "Entendido, respondere solo sobre la plataforma." }] },
    ...history,
    { role: "user", parts: [{ text: userMessage }] },
  ];

  try {
    let { response, data } = await callGemini(CONFIG.GEMINI_API_URL, CONFIG.GEMINI_API_KEY, contents);

    // Algunos proyectos no resuelven el alias "-latest"; reintenta con modelo estable.
    if (!response.ok && response.status === 404 && CONFIG.GEMINI_API_URL.includes("gemini-2.0-flash-latest")) {
      const fallbackUrl = CONFIG.GEMINI_API_URL.replace(
        "gemini-2.0-flash-latest:generateContent",
        "gemini-2.0-flash:generateContent"
      );
      ({ response, data } = await callGemini(fallbackUrl, CONFIG.GEMINI_API_KEY, contents));
    }

    if (!response.ok) {
      const apiMessage = data?.error?.message?.trim();
      if (response.status === 429) {
        return `Estoy temporalmente sin cuota de Gemini. Respuesta local: ${localFallbackReply(userMessage)}`;
      }
      throw new Error(apiMessage ? `Error HTTP ${response.status}: ${apiMessage}` : `Error HTTP ${response.status}`);
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!text) {
      throw new Error("Respuesta vacia del modelo.");
    }

    return text;
  } catch (error) {
    throw new Error(error.message || "No fue posible contactar al asistente.");
  }
}
