export const CONFIG = {
  GEMINI_API_KEY: "",
  GEMINI_API_URL:
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-latest:generateContent",
  PLATFORM_NAME: "AI Academy",
  PLATFORM_TAGLINE: "Aprende IA con enfoque practico y profesional.",
};

let cachedEnvLoaded = false;

function parseEnvValue(rawText, key) {
  const lines = rawText.split(/\r?\n/);
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const separatorIndex = line.indexOf("=");
    if (separatorIndex === -1) continue;
    const envKey = line.slice(0, separatorIndex).trim();
    if (envKey !== key) continue;
    return line.slice(separatorIndex + 1).trim();
  }
  return "";
}

export async function ensureConfigFromEnv() {
  if (cachedEnvLoaded) return;
  cachedEnvLoaded = true;

  try {
    const response = await fetch("./.env.example", { cache: "no-store" });
    if (!response.ok) return;
    const envText = await response.text();
    const envApiKey = parseEnvValue(envText, "GEMINI_API_KEY");
    if (envApiKey) {
      CONFIG.GEMINI_API_KEY = envApiKey;
    }
  } catch {
    // Ignora errores de carga y usa valor actual de CONFIG.GEMINI_API_KEY.
  }
}

export const CHATBOT = {
  NAME: "Asistente AI Academy",
  WELCOME_MESSAGE:
    "Hola, soy tu asistente de AI Academy. Puedo ayudarte con cursos, instructor y la plataforma.",
  OUT_OF_SCOPE_MSG:
    "Lo siento, solo puedo responder preguntas sobre nuestra plataforma, cursos e instructores.",
  MAX_TOKENS: 512,
};
