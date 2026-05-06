const AI_TIMELINE = [
  { year: "1950", event: "Test de Turing" },
  { year: "1956", event: "Conferencia de Dartmouth" },
  { year: "1966", event: "Primeros chatbots como ELIZA" },
  { year: "1974", event: "Primer invierno de IA" },
  { year: "1986", event: "Backpropagation popularizado" },
  { year: "1997", event: "Deep Blue vence a Kasparov" },
  { year: "2012", event: "AlexNet revoluciona vision" },
  { year: "2017", event: "Transformers en NLP" },
  { year: "Hoy", event: "IA generativa en produccion" },
];

export function renderHome(container) {
  const timelineHtml = AI_TIMELINE.map(
    (item, index) => `
      <article class="timeline-item" style="animation-delay:${index * 0.08}s">
        <h4>${item.year}</h4>
        <p>${item.event}</p>
      </article>
    `
  ).join("");

  container.innerHTML = `
    <section class="section">
      <div class="home-hero">
        <span class="hero-badge">Plataforma educativa de IA</span>
        <h1 class="hero-title">AI Academy: aprende IA con enfoque practico</h1>
        <p>Domina fundamentos, machine learning y deep learning con rutas claras y mentor experto.</p>
        <div class="hero-actions">
          <a href="#courses" class="btn btn--primary btn--lg" aria-label="Explorar cursos">Explorar Cursos</a>
          <a href="#chatbot" class="btn btn--outline btn--lg" aria-label="Hablar con asistente IA">Hablar con Asistente</a>
        </div>
      </div>

      <div class="stats-grid">
        <article class="stat-card"><h3>5</h3><p>Cursos</p></article>
        <article class="stat-card"><h3>256h</h3><p>Horas</p></article>
        <article class="stat-card"><h3>30+</h3><p>Modulos</p></article>
        <article class="stat-card"><h3>100%</h3><p>Practico</p></article>
      </div>

      <h2>Historia de la IA</h2>
      <div class="timeline">${timelineHtml}</div>

      <h2>Mision, vision y enfoque</h2>
      <div class="mission-grid">
        <article class="mission-card"><h3>Mision</h3><p>Formar talento competitivo en IA aplicada.</p></article>
        <article class="mission-card"><h3>Vision</h3><p>Ser referente regional en educacion de IA.</p></article>
        <article class="mission-card"><h3>Enfoque</h3><p>Aprendizaje por proyectos y casos reales.</p></article>
      </div>
    </section>
  `;
}
