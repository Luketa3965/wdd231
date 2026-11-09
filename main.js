// =====================================
// WDD231 - JAVASCRIPT
// Cursos, filtros e acompanhamento
// =====================================

// 1. ARRAY ORIGINAL DE OBJETOS DOS CURSOS
const cursos = [
    {
        assunto: "CSE",
        número: 110,
        título: "Introdução à Programação",
        créditos: 2,
        Certificado: "Programação Web e de Computadores",
        Descrição: "Este curso apresentará aos alunos a programação. Ele apresentará os elementos básicos das linguagens de programação (variáveis, decisões, cálculos, loops, arrays e entrada/saída) e como usá-los para resolver problemas.",
        tecnologia: ["Python"],
        concluo: false
    },
    {
        assunto: "WDD",
        número: 130,
        título: "Fundamentos da Web",
        créditos: 2,
        Certificado: "Programação Web e de Computadores",
        Descrição: "Este curso apresenta aos alunos a World Wide Web e as carreiras em design e desenvolvimento de websites. O curso é prático, com os alunos participando ativamente de projetos simples de design e programação web. Espera-se que os alunos que concluírem este curso compreendam as áreas de design e desenvolvimento web e tenham uma boa ideia se desejam seguir essa área como graduação.",
        tecnologia: ["HTML", "CSS"],
        concluo: false
    },
    {
        assunto: "CSE",
        número: 111,
        título: "Programação com Funções",
        créditos: 2,
        Certificado: "Programação Web e de Computadores",
        Descrição: "Os alunos de CSE 111 tornam-se programadores de computador mais organizados, eficientes e poderosos ao aprenderem a pesquisar e chamar funções escritas por outros; a escrever, chamar, depurar e testar suas próprias funções; e a lidar com erros dentro das funções. Os alunos de CSE 111 escrevem programas com funções para resolver problemas em diversas disciplinas, incluindo negócios, ciências físicas, desempenho humano e humanidades.",
        tecnologia: ["Python"],
        concluo: false
    },
    {
        assunto: "CSE",
        número: 210,
        título: "Programação com Classes",
        créditos: 2,
        Certificado: "Programação Web e de Computadores",
        Descrição: "Este curso apresentará a noção de classes e objetos. Ele apresentará o encapsulamento em um nível conceitual. Também abordará herança e polimorfismo.",
        tecnologia: ["C#"],
        concluo: false
    },
    {
        assunto: "WDD",
        número: 131,
        título: "Fundamentos da Web Dinâmica",
        créditos: 2,
        Certificado: "Programação Web e de Computadores",
        Descrição: "Este curso se baseia em experiências anteriores em fundamentos da Web e programação. Os alunos aprenderão a criar sites dinâmicos que usam JavaScript para responder a eventos, atualizar conteúdo e criar experiências de usuário responsivas.",
        tecnologia: ["HTML", "CSS", "JavaScript"],
        concluo: false
    },
    {
        assunto: "WDD",
        número: 231,
        título: "Desenvolvimento Web Frontend I",
        créditos: 2,
        Certificado: "Programação Web e de Computadores",
        Descrição: "Este curso se baseia na experiência prévia com Fundamentos da Web Dinâmica e programação. Os alunos se concentrarão em experiência do usuário, acessibilidade, conformidade, otimização de desempenho e uso básico de APIs.",
        tecnologia: ["HTML", "CSS", "JavaScript"],
        concluo: false
    }
];

// 2. ELEMENTOS HTML
const courseList = document.querySelector("#course-list");
const courseCount = document.querySelector("#course-count");
const totalCredits = document.querySelector("#total-credits");
const completedList = document.querySelector("#completed-list");
const completedCount = document.querySelector("#completed-count");
const filterButtons = document.querySelectorAll(".filter-button");
const menuButton = document.querySelector("#menu-button");
const mobileMenu = document.querySelector("#mobile-menu");

// 3. VERIFICAR SE OS ELEMENTOS ESSENCIAIS EXISTEM
if (
    !courseList || !courseCount || !totalCredits ||
    !completedList || !completedCount
) {
    console.error("Não foi possível encontrar todos os elementos HTML dos cursos.");
} else {
    // 4. FILTRO ATUAL
    let filtroAtual = "Todos";

    // 5. IDENTIFICAR UM CURSO
    function obterIdentificador(curso) {
        return `${curso.assunto}-${curso.número}`;
    }

    // 6. CARREGAR CURSOS CONCLUÍDOS COM SEGURANÇA
    function carregarCursosSalvos() {
        try {
            const dados = JSON.parse(localStorage.getItem("cursosConcluidos") || "[]");
            return Array.isArray(dados) ? dados : [];
        } catch (erro) {
            console.error("Não foi possível ler os cursos salvos:", erro);
            return [];
        }
    }

    const cursosSalvos = carregarCursosSalvos();

    cursos.forEach((curso) => {
        curso.concluo = cursosSalvos.includes(obterIdentificador(curso));
    });

    // 7. SALVAR CURSOS CONCLUÍDOS
    function salvarCursos() {
        const concluidos = cursos
            .filter((curso) => curso.concluo)
            .map((curso) => obterIdentificador(curso));

        try {
            localStorage.setItem("cursosConcluidos", JSON.stringify(concluidos));
        } catch (erro) {
            console.error("Não foi possível salvar os cursos concluídos:", erro);
        }
    }

    // 8. FILTRAR CURSOS
    function filtrarCursos() {
        if (filtroAtual === "Todos") {
            return cursos;
        }

        return cursos.filter((curso) => curso.assunto === filtroAtual);
    }

    // 9. MOSTRAR CURSOS NA PÁGINA
    function mostrarCursos(lista) {
        courseList.innerHTML = "";

        if (lista.length === 0) {
            courseList.innerHTML = "<p>Nenhum curso encontrado.</p>";
            courseList.setAttribute("aria-busy", "false");
            return;
        }

        lista.forEach((curso) => {
            const card = document.createElement("article");
            card.className = "curso-card";

            if (curso.concluo) {
                card.classList.add("concluido");
            }

            const tecnologias = curso.tecnologia.join(", ");
            const status = curso.concluo ? "Curso concluído" : "Curso em andamento";
            const botaoTexto = curso.concluo
                ? "Desmarcar conclusão"
                : "Marcar como concluído";

            card.innerHTML = `
                <span class="curso-categoria">
                    ${curso.assunto} ${curso.número}
                </span>
                <h3>${curso.título}</h3>
                <p><strong>Créditos:</strong> ${curso.créditos}</p>
                <p><strong>Certificado:</strong> ${curso.Certificado}</p>
                <p>${curso.Descrição}</p>
                <p class="curso-tecnologias">
                    Tecnologias: ${tecnologias}
                </p>
                <p class="curso-status">${status}</p>
                <button
                    class="botao-concluir"
                    type="button"
                    aria-pressed="${curso.concluo}"
                    data-curso="${obterIdentificador(curso)}">
                    ${botaoTexto}
                </button>
            `;

            courseList.appendChild(card);
        });

        courseList.setAttribute("aria-busy", "false");
    }

    // 10. CALCULAR CRÉDITOS COM REDUCE()
    function calcularCreditos(lista) {
        return lista.reduce((total, curso) => total + curso.créditos, 0);
    }

    // 11. ATUALIZAR RESUMO
    function atualizarResumo(lista) {
        courseCount.textContent = lista.length;
        totalCredits.textContent = calcularCreditos(lista);

        const quantidadeConcluida = cursos.filter(
            (curso) => curso.concluo
        ).length;

        completedCount.textContent = quantidadeConcluida;
    }

    // 12. MOSTRAR CURSOS CONCLUÍDOS
    function mostrarConcluidos() {
        const concluidos = cursos.filter((curso) => curso.concluo);
        completedList.innerHTML = "";

        if (concluidos.length === 0) {
            completedList.innerHTML = "<p>Nenhum curso concluído ainda.</p>";
            return;
        }

        const lista = document.createElement("ul");

        concluidos.forEach((curso) => {
            const item = document.createElement("li");
            item.textContent = `${curso.assunto} ${curso.número} - ${curso.título}`;
            lista.appendChild(item);
        });

        completedList.appendChild(lista);
    }

    // 13. ATUALIZAR TODA A PÁGINA
    function atualizarPagina() {
        const cursosFiltrados = filtrarCursos();
        mostrarCursos(cursosFiltrados);
        atualizarResumo(cursosFiltrados);
        mostrarConcluidos();
    }

    // 14. EVENTOS DOS FILTROS
    filterButtons.forEach((botao) => {
        botao.addEventListener("click", () => {
            filtroAtual = botao.dataset.filter;

            filterButtons.forEach((item) => {
                item.classList.remove("ativo");
                item.setAttribute("aria-pressed", "false");
            });

            botao.classList.add("ativo");
            botao.setAttribute("aria-pressed", "true");

            atualizarPagina();
        });
    });

    // 15. MARCAR E DESMARCAR CURSOS CONCLUÍDOS
    courseList.addEventListener("click", (evento) => {
        const botao = evento.target.closest(".botao-concluir");

        if (!botao) {
            return;
        }

        const identificador = botao.dataset.curso;
        const cursoSelecionado = cursos.find(
            (curso) => obterIdentificador(curso) === identificador
        );

        if (!cursoSelecionado) {
            return;
        }

        cursoSelecionado.concluo = !cursoSelecionado.concluo;
        salvarCursos();
        atualizarPagina();
    });

    // 16. MENU RESPONSIVO
    if (menuButton && mobileMenu) {
        menuButton.addEventListener("click", () => {
            const menuAberto = mobileMenu.classList.toggle("aberto");

            menuButton.setAttribute("aria-expanded", String(menuAberto));
            menuButton.setAttribute(
                "aria-label",
                menuAberto ? "Fechar menu" : "Abrir menu"
            );
        });

        mobileMenu.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                mobileMenu.classList.remove("aberto");
                menuButton.setAttribute("aria-expanded", "false");
                menuButton.setAttribute("aria-label", "Abrir menu");
            });
        });
    }

    // 17. WAYFINDING - DESTACAR A SEÇÃO ATUAL
    const linksNavegacao = document.querySelectorAll("#mobile-menu a");

    function atualizarWayfinding() {
        const secaoAtual = window.location.hash || "#inicio";

        linksNavegacao.forEach((link) => {
            if (link.getAttribute("href") === secaoAtual) {
                link.setAttribute("aria-current", "location");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    }

    linksNavegacao.forEach((link) => {
        link.addEventListener("click", atualizarWayfinding);
    });

    window.addEventListener("hashchange", atualizarWayfinding);
    atualizarWayfinding();

    // 18. ANO AUTOMÁTICO
    const yearElement = document.querySelector("#year");
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // 19. DATA DA ÚLTIMA MODIFICAÇÃO
    const lastModifiedElement = document.querySelector("#last-modified");
    if (lastModifiedElement) {
        const ultimaModificacao = new Date(document.lastModified);
        lastModifiedElement.textContent = ultimaModificacao.toLocaleString("pt-BR");
        lastModifiedElement.dateTime = ultimaModificacao.toISOString();
    }

    // 20. INICIALIZAR PÁGINA
    atualizarPagina();
}
