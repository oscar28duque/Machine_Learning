import { COURSES } from "../data/courses.js";

export function renderContact(container) {
  container.innerHTML = `
    <section class="section">
      <h1>Contacto e Inscripcion</h1>
      <div class="contact-layout">
        <aside class="mission-card">
          <h2>Informacion de contacto</h2>
          <p><strong>Email:</strong> admisiones@aiacademy.edu</p>
          <p><strong>Telefono:</strong> +57 300 000 0000</p>
          <p><strong>LinkedIn:</strong> https://www.linkedin.com/company/ai-academy</p>
          <p><strong>Ubicacion:</strong> Colombia</p>
        </aside>
        <form id="contactForm" class="mission-card" novalidate>
          <div class="form-group">
            <label for="name">Nombre</label>
            <input id="name" name="name" required />
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input id="email" name="email" type="email" required />
          </div>
          <div class="form-group">
            <label for="course">Curso de interes</label>
            <select id="course" name="course" required>
              <option value="">Selecciona un curso</option>
              ${COURSES.map((c) => `<option value="${c.id}">${c.title}</option>`).join("")}
            </select>
          </div>
          <div class="form-group">
            <label for="message">Mensaje</label>
            <textarea id="message" name="message" required></textarea>
          </div>
          <button class="btn btn--primary btn--full" type="submit" aria-label="Enviar formulario de contacto">Enviar Solicitud</button>
          <p id="contactFeedback" class="feedback" aria-live="polite"></p>
        </form>
      </div>
    </section>
  `;

  const form = document.getElementById("contactForm");
  const feedback = document.getElementById("contactFeedback");
  if (!form || !feedback) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const course = String(data.get("course") || "").trim();
    const message = String(data.get("message") || "").trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!name || !email || !course || !message || !emailOk) {
      feedback.textContent = "Revisa los campos requeridos y el formato del email.";
      feedback.className = "feedback feedback--error";
      return;
    }

    feedback.textContent = "Formulario enviado correctamente. Te contactaremos pronto.";
    feedback.className = "feedback feedback--success";
    form.reset();
  });
}
