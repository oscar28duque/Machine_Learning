import { CONFIG } from "./config.js";
import { Router } from "./router.js";
import { renderSidebar, initSidebarToggle } from "./components/sidebar.js";
import { renderHome } from "./sections/home.js";
import { renderCourses } from "./sections/courses.js";
import { renderInstructors } from "./sections/instructors.js";
import { renderContact } from "./sections/contact.js";
import { renderChatbotSection } from "./sections/chatbot-section.js";
import { initChatbotPage, initChatbotWidget } from "./chatbot/ui.js";

document.addEventListener("DOMContentLoaded", () => {
  const sidebarContainer = document.getElementById("sidebarContainer");
  const mainContent = document.getElementById("mainContent");
  if (!sidebarContainer || !mainContent) return;

  sidebarContainer.innerHTML = renderSidebar(CONFIG.PLATFORM_NAME);
  initSidebarToggle();

  const router = new Router(
    {
      home: () => renderHome(mainContent),
      courses: (courseId) => renderCourses(mainContent, courseId),
      instructors: () => renderInstructors(mainContent),
      contact: () => renderContact(mainContent),
      chatbot: () => {
        renderChatbotSection(mainContent);
        initChatbotPage();
      },
    },
    "home"
  );

  router.init();
  if (!window.location.hash) {
    router.navigate("home");
  }

  initChatbotWidget();
});
