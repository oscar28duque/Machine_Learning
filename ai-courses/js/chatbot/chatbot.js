async function callBackend(userMessage, history) {
  const response = await fetch("/api/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userMessage, history }),
  });
  const data = await response.json().catch(() => ({}));
  return { response, data };
}

export async function sendMessageToGemini(userMessage, history = []) {
  try {
    const { response, data } = await callBackend(userMessage, history);

    if (!response.ok) {
      const apiMessage = data?.error?.message?.trim();
      throw new Error(apiMessage ? `Error HTTP ${response.status}: ${apiMessage}` : `Error HTTP ${response.status}`);
    }

    const text = data?.text?.trim();
    if (!text) {
      throw new Error("Respuesta vacia del servidor.");
    }
    return text;
  } catch (error) {
    throw new Error(error.message || "No fue posible contactar al asistente.");
  }
}
