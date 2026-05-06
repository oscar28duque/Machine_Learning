export const NAV_ITEMS = [
  { route: "home", label: "Inicio", icon: "🏠" },
  { route: "courses", label: "Cursos", icon: "📚" },
  { route: "instructors", label: "Instructores", icon: "👨‍🏫" },
  { route: "contact", label: "Contacto", icon: "✉️" },
  { route: "chatbot", label: "Asistente IA", icon: "🤖" },
];

export function renderSidebar(platformName) {
  const links = NAV_ITEMS.map(
    (item) => `
      <a class="sidebar__link" href="#${item.route}" data-route="${item.route}" aria-label="Ir a ${item.label}">
        <span class="sidebar__icon">${item.icon}</span>
        <span class="sidebar__text">${item.label}</span>
      </a>
    `
  ).join("");

  return `
    <aside class="sidebar" id="sidebar">
      <div class="sidebar__top">
        <button id="sidebarToggle" aria-label="Colapsar o expandir barra lateral">☰</button>
        <strong class="sidebar__brand">${platformName}</strong>
      </div>
      <nav class="sidebar__nav">${links}</nav>
    </aside>
  `;
}

export function initSidebarToggle() {
  const button = document.getElementById("sidebarToggle");
  const sidebar = document.getElementById("sidebar");
  const main = document.getElementById("main");
  if (!button || !sidebar || !main) return;

  button.addEventListener("click", () => {
    sidebar.classList.toggle("sidebar--collapsed");
    main.classList.toggle("main--expanded");
  });
}
