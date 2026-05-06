export function renderCourseCard(course) {
  return `
    <article class="course-card">
      <div class="course-card__header">
        <div style="font-size:2rem">${course.emoji}</div>
        <div class="course-card__badges">
          <span class="badge badge--level">${course.level}</span>
          <span class="badge badge--duration">${course.duration}</span>
        </div>
      </div>
      <h3>${course.title}</h3>
      <p>${course.description}</p>
      <p><strong>Modulos:</strong> ${course.modules}</p>
      <a class="btn btn--outline" href="#courses/${course.id}" aria-label="Ver programa de ${course.title}">
        Ver Programa →
      </a>
    </article>
  `;
}
