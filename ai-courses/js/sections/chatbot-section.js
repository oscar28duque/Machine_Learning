export function renderChatbotSection(container) {
  container.innerHTML = `
    <section class="section">
      <h1>Asistente IA</h1>
      <p>Consulta sobre cursos, instructor y la plataforma.</p>
      <div class="chatbot-page">
        <div id="chatbotPageMessages" class="chatbot-page__messages" aria-live="polite"></div>
        <div class="chatbot-suggestions">
          <button class="btn btn--ghost" onclick="window.sendSuggestion('Que curso recomiendas para empezar?')" aria-label="Sugerencia para curso inicial">Curso para empezar</button>
          <button class="btn btn--ghost" onclick="window.sendSuggestion('Que vere en Fundamentos de IA?')" aria-label="Sugerencia sobre fundamentos">Fundamentos IA</button>
          <button class="btn btn--ghost" onclick="window.sendSuggestion('Quien es el instructor?')" aria-label="Sugerencia sobre instructor">Instructor</button>
          <button class="btn btn--ghost" onclick="window.sendSuggestion('Cual es la historia de la IA?')" aria-label="Sugerencia sobre historia IA">Historia IA</button>
        </div>
        <form id="chatbotPageForm" class="chatbot-form">
          <input id="chatbotPageInput" class="chatbot-input" placeholder="Escribe tu pregunta..." required />
          <button class="btn btn--primary" type="submit" aria-label="Enviar mensaje al chatbot">Enviar</button>
        </form>
      </div>
    </section>
  `;
}
