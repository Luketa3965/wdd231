// cursos.js (cole como um arquivo .js separado e conecte com <script src="cursos.js" defer></script>)
(() => {
  // ----- Critérios 8-11: array, filtro, créditos via reduce, concluídos -----
  const courses = [
    { id: 1, title: "Marketing Digital", category: "Marketing", credits: 3, lessons: 8 },
    { id: 2, title: "E-mail Marketing", category: "Marketing", credits: 2, lessons: 6 },
    { id: 3, title: "Fundamentos de Front-End", category: "Tecnologia", credits: 4, lessons: 10 },
    { id: 4, title: "JavaScript Essencial", category: "Tecnologia", credits: 3, lessons: 9 },
    { id: 5, title: "Gestão para Pequenos Negócios", category: "Negócios", credits: 2, lessons: 7 },
    { id: 6, title: "Plano de Crescimento", category: "Negócios", credits: 3, lessons: 8 }
  ];

  const storageKey = "timbuktu_course_completed_v1";

  const completedIds = new Set(JSON.parse(localStorage.getItem(storageKey) || "[]"));

  const courseListEl = document.getElementById("course-list");
  const totalCreditsEl = document.getElementById("total-credits");
  const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));

  if (!courseListEl || !totalCreditsEl || filterButtons.length === 0) return;

  let activeFilter = "Todos";

  const getFilteredCourses = () => {
    if (activeFilter === "Todos") return courses;
    return courses.filter(c => c.category === activeFilter);
  };

  // Critério 10: reduce para total de créditos do filtro atual
  const calcTotalCredits = (list) => list.reduce((sum, c) => sum + c.credits, 0);

  const renderCourses = () => {
    const filtered = getFilteredCourses();
    const totalCredits = calcTotalCredits(filtered);
    totalCreditsEl.textContent = String(totalCredits);

    courseListEl.innerHTML = filtered.map(c => {
      const completed = completedIds.has(c.id);
      return `
        <article class="course-card" aria-label="Curso: ${escapeHtml(c.title)}">
          <header>${escapeHtml(c.title)}</header>
          <div class="course-body">
            <div class="badges">
              <span class="badge">${escapeHtml(c.category)}</span>
              <span class="badge">${c.credits} créditos</span>
            </div>

            <div class="course-meta">
              <div><strong>Aulas:</strong> ${c.lessons}</div>
            </div>

            <div class="course-actions">
              <button
                type="button"
                class="btn-course"
                aria-pressed="${completed ? "true" : "false"}"
                data-toggle-completed="${c.id}">
                ${completed ? "Concluído ✓" : "Marcar Concluído"}
              </button>
            </div>

            <div class="muted-note">
              ${completed ? "Você concluiu este curso." : "Ainda não concluído."}
            </div>
          </div>
        </article>
      `;
    }).join("");
  };

  const saveCompleted = () => {
    localStorage.setItem(storageKey, JSON.stringify(Array.from(completedIds)));
  };

  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      activeFilter = btn.getAttribute("data-filter") || "Todos";
      filterButtons.forEach(b => b.setAttribute("aria-pressed", "false"));
      btn.setAttribute("aria-pressed", "true");
      renderCourses();
    });
  });

  // Critério 11: marcação clara ao usuário (botão + texto + aria-pressed)
  courseListEl.addEventListener("click", (e) => {
    const button = e.target.closest("[data-toggle-completed]");
    if (!button) return;

    const id = Number(button.getAttribute("data-toggle-completed"));
    if (!Number.isFinite(id)) return;

    if (completedIds.has(id)) completedIds.delete(id);
    else completedIds.add(id);

    saveCompleted();
    renderCourses();
  });

  renderCourses();

  // ----- Critério 12: ano e última modificação via JS no rodapé -----
  const yearEl = document.getElementById("year");
  const lastModifiedEl = document.getElementById("last-modified");

  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  if (lastModifiedEl) {
    const lm = document.lastModified ? new Date(document.lastModified) : new Date();
    lastModifiedEl.textContent = lm.toLocaleString();
  }

  // util
  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
})();
