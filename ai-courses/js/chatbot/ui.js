import { CHATBOT } from "../config.js";
import { sendMessageToGemini } from "./chatbot.js";

const conversationHistory = [];
const MAX_HISTORY = 20;

function limitHistory() {
  if (conversationHistory.length > MAX_HISTORY) {
    conversationHistory.splice(0, conversationHistory.length - MAX_HISTORY);
  }
}

export function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function addMessage(container, text, role) {
  const safeText = role === "user" ? escapeHtml(text) : text;
  const avatar = role === "bot" ? "🤖 " : "";
  container.insertAdjacentHTML(
    "beforeend",
    `<div class="msg msg--${role}"><div class="msg__bubble">${avatar}${safeText}</div></div>`
  );
  container.scrollTop = container.scrollHeight;
}

function addThinking(container) {
  container.insertAdjacentHTML(
    "beforeend",
    `<div class="msg msg--bot" data-thinking="true"><div class="msg__bubble"><span class="thinking-dots"><span></span><span></span><span></span></span></div></div>`
  );
  container.scrollTop = container.scrollHeight;
}

function clearThinking(container) {
  const thinking = container.querySelector("[data-thinking='true']");
  if (thinking) thinking.remove();
}

function bindChat(form, input, messagesContainer) {
  if (!form || !input || !messagesContainer) return;

  if (!messagesContainer.dataset.hasWelcome) {
    addMessage(messagesContainer, CHATBOT.WELCOME_MESSAGE, "bot");
    messagesContainer.dataset.hasWelcome = "true";
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    addMessage(messagesContainer, text, "user");
    conversationHistory.push({ role: "user", parts: [{ text }] });
    limitHistory();
    input.value = "";
    addThinking(messagesContainer);

    try {
      const response = await sendMessageToGemini(text, conversationHistory);
      clearThinking(messagesContainer);
      addMessage(messagesContainer, response, "bot");
      conversationHistory.push({ role: "model", parts: [{ text: response }] });
      limitHistory();
    } catch (error) {
      clearThinking(messagesContainer);
      addMessage(messagesContainer, `Error: ${escapeHtml(error.message)}`, "bot");
    }
  });
}

export function initChatbotWidget() {
  if (document.getElementById("chatbotFab")) return;

  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <button id="chatbotFab" class="chatbot-fab" aria-label="Abrir o cerrar chat flotante">🤖</button>
    <section id="chatbotWidget" class="chatbot-widget" hidden>
      <header class="chatbot-header">${CHATBOT.NAME}</header>
      <div id="chatbotWidgetMessages" class="chatbot-messages" aria-live="polite"></div>
      <form id="chatbotWidgetForm" class="chatbot-form">
        <input id="chatbotWidgetInput" class="chatbot-input" placeholder="Pregunta algo..." required />
        <button class="btn btn--primary" type="submit" aria-label="Enviar mensaje desde chat flotante">Enviar</button>
      </form>
    </section>
  `;
  document.body.appendChild(wrapper);

  const fab = document.getElementById("chatbotFab");
  const widget = document.getElementById("chatbotWidget");
  const form = document.getElementById("chatbotWidgetForm");
  const input = document.getElementById("chatbotWidgetInput");
  const messages = document.getElementById("chatbotWidgetMessages");

  bindChat(form, input, messages);

  fab?.addEventListener("click", () => {
    if (!widget) return;
    widget.hidden = !widget.hidden;
  });
}

export function initChatbotPage() {
  const form = document.getElementById("chatbotPageForm");
  const input = document.getElementById("chatbotPageInput");
  const messages = document.getElementById("chatbotPageMessages");
  bindChat(form, input, messages);
}

window.sendSuggestion = (text) => {
  const input =
    document.getElementById("chatbotPageInput") || document.getElementById("chatbotWidgetInput");
  const form = document.getElementById("chatbotPageForm") || document.getElementById("chatbotWidgetForm");
  if (!input || !form) return;
  input.value = text;
  form.requestSubmit();
};
