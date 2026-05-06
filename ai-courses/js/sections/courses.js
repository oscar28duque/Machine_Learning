import { COURSES } from "../data/courses.js";
import { renderCourseCard } from "../components/courseCard.js";

export function renderCourses(container, courseId = null) {
  if (!courseId) {
    const cards = COURSES.map((course) => renderCourseCard(course)).join("");
    container.innerHTML = `
      <section class="section">
        <h1>Cursos de AI Academy</h1>
        <p>Selecciona un curso para ver su programa detallado.</p>
        <div class="courses-grid">${cards}</div>
      </section>
    `;
    return;
  }

  const course = COURSES.find((item) => item.id === courseId);
  if (!course) {
    container.innerHTML = `
      <section class="section">
        <h2>Curso no encontrado</h2>
        <a class="btn btn--outline" href="#courses" aria-label="Volver a cursos">← Volver a Cursos</a>
      </section>
    `;
    return;
  }

  const modules = course.syllabus
    .map(
      (module, idx) => `
        <article class="module-card">
          <h3>Modulo ${idx + 1}: ${module.title}</h3>
          <ul>${module.topics.map((topic) => `<li>${topic}</li>`).join("")}</ul>
        </article>
      `
    )
    .join("");

  container.innerHTML = `
    <section class="section">
      <a class="btn btn--ghost" href="#courses" aria-label="Volver al listado de cursos">← Volver a Cursos</a>
      <div class="course-detail-hero">
        <div style="font-size:2.5rem">${course.emoji}</div>
        <div class="course-card__badges">
          <span class="badge badge--level">${course.level}</span>
          <span class="badge badge--duration">${course.duration}</span>
          <span class="badge badge--modules">${course.modules} modulos</span>
        </div>
        <h1>${course.title}</h1>
        <p>${course.description}</p>
        <a class="btn btn--primary" href="#contact" aria-label="Inscribirme ahora en ${course.title}">Inscribirme Ahora →</a>
      </div>
      <h2>Programa del curso</h2>
      <div class="modules-grid">${modules}</div>
    </section>
  `;
}
