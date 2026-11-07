
// =====================================
// 1. ARRAY DE CURSOS
// =====================================

const courses = [
    {
        id: 1,
        title: "Marketing Digital",
        category: "Marketing",
        credits: 3,
        lessons: 8
    },
    {
        id: 2,
        title: "E-mail Marketing",
        category: "Marketing",
        credits: 2,
        lessons: 6
    },
    {
        id: 3,
        title: "Fundamentos de Front-End",
        category: "Tecnologia",
        credits: 4,
        lessons: 10
    },
    {
        id: 4,
        title: "JavaScript Essencial",
        category: "Tecnologia",
        credits: 3,
        lessons: 9
    },
    {
        id: 5,
        title: "Gestão para Pequenos Negócios",
        category: "Negócios",
        credits: 2,
        lessons: 7
    },
    {
        id: 6,
        title: "Plano de Crescimento",
        category: "Negócios",
        credits: 3,
        lessons: 8
    }
];

// =====================================
// 2. ELEMENTOS HTML
// =====================================

const courseList = document.querySelector("#course-list");
const totalCredits = document.querySelector("#total-credits");
const courseCount = document.querySelector("#course-count");
const completedList = document.querySelector("#completed-list");
const completedCount = document.querySelector("#completed-count");

const filterButtons = document.querySelectorAll("[data-filter]");

const menuButton = document.querySelector("#menu-button");
const mobileMenu = document.querySelector("#mobile-menu");

// =====================================
// 3. CONFIGURAÇÃO INICIAL
// =====================================

let activeFilter = "Todos";

const storageKey = "timbuktu_course_completed_v1";

function loadCompletedCourses() {
    try {
        const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");

        if (!Array.isArray(saved)) {
            return new Set();
        }

        return new Set(
            saved.filter(id =>
                Number.isInteger(id) &&
                courses.some(course => course.id === id)
            )
        );

    } catch (error) {
        console.error("Erro ao carregar cursos concluídos:", error);
        return new Set();
    }
}

const completedIds = loadCompletedCourses();

// =====================================
// 4. SALVAR CURSOS CONCLUÍDOS
// =====================================

function saveCompletedCourses() {
    try {
        localStorage.setItem(
            storageKey,
            JSON.stringify([...completedIds])
        );
    } catch (error) {
        console.error("Não foi possível salvar o progresso:", error);
    }
}

// =====================================
// 5. FILTRAR CURSOS
// =====================================

function getFilteredCourses() {

    if (activeFilter === "Todos") {
        return courses;
    }

    return courses.filter(course =>
        course.category === activeFilter
    );
}

// =====================================
// 6. CALCULAR TOTAL DE CRÉDITOS
// =====================================

function calculateTotalCredits(courseArray) {

    return courseArray.reduce((total, course) => {
        return total + course.credits;
    }, 0);

}

// =====================================
// 7. EXIBIR CURSOS DINAMICAMENTE
// =====================================

function renderCourses() {

    const filteredCourses = getFilteredCourses();

    const credits = calculateTotalCredits(filteredCourses);

    totalCredits.textContent = credits;

    courseCount.textContent =
        `${filteredCourses.length} ${filteredCourses.length === 1 ? "curso" : "cursos"}`;

    if (filteredCourses.length === 0) {

        courseList.innerHTML = `
            <p class="empty-message">
                Nenhum curso encontrado.
            </p>
        `;

        return;
    }

    courseList.innerHTML = filteredCourses.map(course => {

        const completed = completedIds.has(course.id);

        return `
            <article class="course-card">

                <header>
                    ${escapeHTML(course.title)}
                </header>

                <div class="course-body">

                    <div class="badges">

                        <span class="badge">
                            ${escapeHTML(course.category)}
                        </span>

                        <span class="badge">
                            ${course.credits} créditos
                        </span>

                    </div>

                    <div class="course-meta">

                        <p>
                            <strong>Aulas:</strong>
                            ${course.lessons}
                        </p>

                    </div>

                    <div class="course-actions">

                        <button
                            type="button"
                            class="btn-course"
                            data-toggle-completed="${course.id}"
                            aria-pressed="${completed}">

                            ${completed ? "Concluído ✓" : "Marcar Concluído"}

                        </button>

                    </div>

                    <p class="muted-note">

                        ${completed
                            ? "Você concluiu este curso."
                            : "Este curso ainda não foi concluído."
                        }

                    </p>

                </div>

            </article>
        `;

    }).join("");

}

// =====================================
// 8. FILTROS INTERATIVOS
// =====================================

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        activeFilter = button.dataset.filter;

        filterButtons.forEach(filterButton => {

            filterButton.setAttribute(
                "aria-pressed",
                String(filterButton === button)
            );

        });

        renderCourses();

    });

});

// =====================================
// 9. MARCAR CURSO COMO CONCLUÍDO
// =====================================

courseList.addEventListener("click", event => {

    const button = event.target.closest("[data-toggle-completed]");

    if (!button) {
        return;
    }

    const courseId = Number(button.dataset.toggleCompleted);

    if (completedIds.has(courseId)) {

        completedIds.delete(courseId);

    } else {

        completedIds.add(courseId);

    }

    saveCompletedCourses();

    renderCourses();

    renderCompletedCourses();

});

// =====================================
// 10. LISTA DE CURSOS CONCLUÍDOS
// =====================================

function renderCompletedCourses() {

    const completedCourses = courses.filter(course =>
        completedIds.has(course.id)
    );

    completedCount.textContent =
        `${completedCourses.length} concluídos`;

    if (completedCourses.length === 0) {

        completedList.innerHTML = `
            <li class="empty-completed">
                Nenhum curso concluído ainda.
                Marque um curso como concluído para acompanhar
                seu progresso aqui.
            </li>
        `;

        return;
    }

    completedList.innerHTML = completedCourses.map(course => {

        return `
            <li>
                ✓ ${escapeHTML(course.title)}
                — ${course.credits} créditos
            </li>
        `;

    }).join("");

}

// =====================================
// 11. MENU RESPONSIVO
// =====================================

if (menuButton && mobileMenu) {

    menuButton.addEventListener("click", () => {

        const isOpen =
            mobileMenu.dataset.open === "true";

        mobileMenu.dataset.open = String(!isOpen);

        menuButton.setAttribute(
            "aria-expanded",
            String(!isOpen)
        );

        menuButton.setAttribute(
            "aria-label",
            isOpen
                ? "Abrir menu de navegação"
                : "Fechar menu de navegação"
        );

        menuButton.textContent = isOpen ? "☰" : "✕";

    });

    mobileMenu.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", () => {

            mobileMenu.dataset.open = "false";

            menuButton.setAttribute("aria-expanded", "false");

            menuButton.setAttribute(
                "aria-label",
                "Abrir menu de navegação"
            );

            menuButton.textContent = "☰";

        });

    });

}

// =====================================
// 12. ANO AUTOMÁTICO
// =====================================

const yearElement = document.querySelector("#year");

if (yearElement) {

    yearElement.textContent = new Date().getFullYear();

}

// =====================================
// 13. DATA DA ÚLTIMA MODIFICAÇÃO
// =====================================

const lastModifiedElement =
    document.querySelector("#last-modified");

if (lastModifiedElement) {

    const modificationDate = new Date(document.lastModified);

    lastModifiedElement.textContent =
        modificationDate.toLocaleString("pt-BR");

}

// =====================================
// 14. PROTEÇÃO DE TEXTO HTML
// =====================================

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}

// =====================================
// 15. INICIALIZAÇÃO DO SITE
// =====================================

renderCourses();

renderCompletedCourses();
