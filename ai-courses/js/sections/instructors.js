import { INSTRUCTORS } from "../data/instructors.js";
import { renderInstructorCard } from "../components/instructorCard.js";

export function renderInstructors(container) {
  const content = INSTRUCTORS.map((instructor) => renderInstructorCard(instructor)).join("");
  container.innerHTML = `
    <section class="section">
      <h1>Instructor</h1>
      <div class="instructors-grid">${content}</div>
    </section>
  `;
}
