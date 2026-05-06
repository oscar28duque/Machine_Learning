export function renderInstructorCard(instructor) {
  const education = instructor.education.map((item) => `<li>${item}</li>`).join("");
  const technicalSkills = instructor.skills.technical
    .map((skill) => `<span class="skill-tag">${skill}</span>`)
    .join("");

  return `
    <article class="instructor-card">
      <div style="font-size:3rem">${instructor.avatar}</div>
      <h2>${instructor.name}</h2>
      <p><strong>${instructor.title}</strong></p>
      <p>${instructor.specialty}</p>
      <p>${instructor.bio}</p>
      <h3>Educacion</h3>
      <ul>${education}</ul>
      <h3>Skills tecnicos</h3>
      <div class="skill-tags">${technicalSkills}</div>
      <h3>Contacto</h3>
      <p>Email: <a href="mailto:${instructor.email}">${instructor.email}</a></p>
      <p><a href="${instructor.linkedin}" target="_blank" rel="noreferrer" aria-label="Abrir LinkedIn de ${instructor.name}">LinkedIn</a></p>
    </article>
  `;
}
