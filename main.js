
// =====================================
// WDD231 - JAVASCRIPT
// Cursos, filtros e acompanhamento
// =====================================


// 1. ARRAY DE OBJETOS DE CURSOS

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


// 2. SELEÇÃO DOS ELEMENTOS HTML

const courseList = document.querySelector("#course-list");

const totalCreditsElement =
    document.querySelector("#total-credits");

const courseCountElement =
    document.querySelector("#course-count");

const completedList =
    document.querySelector("#completed-list");

const completedCount =
    document.querySelector("#completed-count");

const filterButtons =
    document.querySelectorAll("[data-filter]");

const menuButton =
    document.querySelector("#menu-button");

const mobileMenu =
    document.querySelector("#mobile-menu");


// 3. CONFIGURAÇÃO INICIAL

let activeFilter = "Todos";

const storageKey = "timbuktu_course_completed_v1";


// 4. RECUPERAR CURSOS CONCLUÍDOS

function loadCompletedCourses() {

    try {

        const savedCourses =
            JSON.parse(localStorage.getItem(storageKey) || "[]");

        if (!Array.isArray(savedCourses)) {
            return new Set();
        }

        return new Set(

            savedCourses.filter((id) =>

                Number.isInteger(id) &&
                courses.some((course) => course.id === id)

            )

        );

    } catch (error) {

        console.warn(
            "Não foi possível recuperar o progresso salvo.",
            error
        );

        return new Set();

    }

}

const completedIds = loadCompletedCourses();


// 5. SALVAR O PROGRESSO

function saveCompletedCourses() {

    try {

        localStorage.setItem(
            storageKey,
            JSON.stringify([...completedIds])
        );

    } catch (error) {

        console.warn(
            "Não foi possível salvar o progresso.",
            error
        );

    }

}


// 6. FILTRAR OS CURSOS

function getFilteredCourses() {

    if (activeFilter === "Todos") {

        return courses;

    }

    return courses.filter((course) => {

        return course.category === activeFilter;

    });

}


// 7. CALCULAR TOTAL DE CRÉDITOS COM REDUCE()

function calculateTotalCredits(courseArray) {

    return courseArray.reduce((total, course) => {

        return total + course.credits;

    }, 0);

}


// 8. PROTEÇÃO DE TEXTO HTML

function escapeHTML(value) {

    return String(value)

        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


// 9. EXIBIR CURSOS DINAMICAMENTE COM MAP()

function renderCourses() {

    const filteredCourses = getFilteredCourses();

    const credits = calculateTotalCredits(filteredCourses);

    totalCreditsElement.textContent = credits;

    courseCountElement.textContent =

        `${filteredCourses.length} ${
            filteredCourses.length === 1 ? "curso" : "cursos"
        }`;


    if (filteredCourses.length === 0) {

        courseList.innerHTML = `

            <p class="empty-message">
                Nenhum curso encontrado.
            </p>

        `;

        return;

    }


    courseList.innerHTML = filteredCourses.map((course) => {

        const isCompleted = completedIds.has(course.id);

        return `

            <article class="course-card">

                <h4>
                    ${escapeHTML(course.title)}
                </h4>

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

                        <strong>Aulas:</strong>
                        ${course.lessons}

                    </div>

                    <div class="course-actions">

                        <button
                            type="button"
                            class="btn-course"
                            data-course-id="${course.id}"
                            aria-pressed="${isCompleted}">

                            ${
                                isCompleted
                                    ? "Concluído ✓"
                                    : "Marcar como concluído"
                            }

                        </button>

                    </div>

                    <p class="muted-note">

                        ${
                            isCompleted
                                ? "Você concluiu este curso."
                                : "Este curso ainda não foi concluído."
                        }

                    </p>

                </div>

            </article>

        `;

    }).join("");

}


// 10. EXIBIR CURSOS CONCLUÍDOS

function renderCompletedCourses() {

    const completedCourses = courses.filter((course) => {

        return completedIds.has(course.id);

    });


    completedCount.textContent =

        `${completedCourses.length} ${
            completedCourses.length === 1
                ? "concluído"
                : "concluídos"
        }`;


    if (completedCourses.length === 0) {

        completedList.innerHTML = `

            <li class="empty-completed">

                Nenhum curso concluído ainda.
                Marque um curso como concluído para
                acompanhar seu progresso aqui.

            </li>

        `;

        return;

    }


    completedList.innerHTML = completedCourses.map((course) => {

        return `

            <li>

                ✓ ${escapeHTML(course.title)}
                — ${course.credits} créditos

            </li>

        `;

    }).join("");

}


// 11. EVENTOS DOS FILTROS

filterButtons.forEach((button) => {

    button.addEventListener("click", () => {

        activeFilter = button.dataset.filter;

        filterButtons.forEach((filterButton) => {

            filterButton.setAttribute(

                "aria-pressed",

                String(filterButton === button)

            );

        });

        renderCourses();

    });

});


// 12. MARCAR E DESMARCAR CURSOS CONCLUÍDOS

courseList.addEventListener("click", (event) => {

    const button = event.target.closest("[data-course-id]");

    if (!button) {
        return;
    }

    const courseId = Number(button.dataset.courseId);

    if (!courses.some((course) => course.id === courseId)) {
        return;
    }


    if (completedIds.has(courseId)) {

        completedIds.delete(courseId);

    } else {

        completedIds.add(courseId);

    }


    saveCompletedCourses();

    renderCourses();

    renderCompletedCourses();

});


// 13. MENU RESPONSIVO

if (menuButton && mobileMenu) {

    menuButton.addEventListener("click", () => {

        const shouldOpen = mobileMenu.hidden;

        mobileMenu.hidden = !shouldOpen;

        menuButton.setAttribute(
            "aria-expanded",
            String(shouldOpen)
        );

        menuButton.setAttribute(
            "aria-label",
            shouldOpen
                ? "Fechar menu de navegação"
                : "Abrir menu de navegação"
        );

        menuButton.textContent = shouldOpen ? "✕" : "☰";

    });


    mobileMenu.querySelectorAll("a").forEach((link) => {

        link.addEventListener("click", () => {

            mobileMenu.hidden = true;

            menuButton.setAttribute(
                "aria-expanded",
                "false"
            );

            menuButton.setAttribute(
                "aria-label",
                "Abrir menu de navegação"
            );

            menuButton.textContent = "☰";

        });

    });

}


// 14. ANO AUTOMÁTICO

const yearElement = document.querySelector("#year");

if (yearElement) {

    yearElement.textContent = new Date().getFullYear();

}


// 15. DATA DA ÚLTIMA MODIFICAÇÃO

const lastModifiedElement =
    document.querySelector("#last-modified");

if (lastModifiedElement) {

    const modifiedDate = new Date(document.lastModified);

    lastModifiedElement.textContent =
        modifiedDate.toLocaleString("pt-BR");

}


// 16. INICIALIZAÇÃO DA PÁGINA

renderCourses();

renderCompletedCourses();

