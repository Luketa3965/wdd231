
// =====================================
// WDD231 - JAVASCRIPT
// Cursos, filtros e progresso acadêmico
// =====================================


// 1. ARRAY DE OBJETOS DOS CURSOS

const cursos = [
    {
        assunto: "CSE",
        numero: 110,
        titulo: "Introdução à Programação",
        creditos: 2,
        certificado: "Programação Web e de Computadores",
        descricao: "Este curso apresenta os fundamentos da programação, incluindo variáveis, decisões, cálculos, loops, arrays e entrada e saída de dados.",
        tecnologias: ["Python"]
    },

    {
        assunto: "WDD",
        numero: 130,
        titulo: "Fundamentos da Web",
        creditos: 2,
        certificado: "Programação Web e de Computadores",
        descricao: "Este curso apresenta a World Wide Web e os fundamentos do design e desenvolvimento de websites, com atividades práticas de HTML e CSS.",
        tecnologias: ["HTML", "CSS"]
    },

    {
        assunto: "CSE",
        numero: 111,
        titulo: "Programação com Funções",
        creditos: 2,
        certificado: "Programação Web e de Computadores",
        descricao: "Este curso desenvolve habilidades de programação com funções, depuração, testes e resolução de problemas utilizando a linguagem Python.",
        tecnologias: ["Python"]
    },

    {
        assunto: "CSE",
        numero: 210,
        titulo: "Programação com Classes",
        creditos: 2,
        certificado: "Programação Web e de Computadores",
        descricao: "Este curso apresenta classes, objetos, encapsulamento, herança e polimorfismo na programação orientada a objetos.",
        tecnologias: ["C#"]
    },

    {
        assunto: "WDD",
        numero: 131,
        titulo: "Fundamentos da Web Dinâmica",
        creditos: 2,
        certificado: "Programação Web e de Computadores",
        descricao: "Este curso ensina a desenvolver websites dinâmicos utilizando JavaScript para responder a eventos e atualizar conteúdos.",
        tecnologias: ["HTML", "CSS", "JavaScript"]
    },

    {
        assunto: "WDD",
        numero: 231,
        titulo: "Desenvolvimento Web Frontend I",
        creditos: 2,
        certificado: "Programação Web e de Computadores",
        descricao: "Este curso aborda experiência do usuário, acessibilidade, desempenho, conformidade e utilização de APIs no desenvolvimento web.",
        tecnologias: ["HTML", "CSS", "JavaScript"]
    }
];


// 2. SELECIONAR ELEMENTOS HTML

const courseList = document.querySelector("#course-list");
const courseCount = document.querySelector("#course-count");
const totalCredits = document.querySelector("#total-credits");
const completedList = document.querySelector("#completed-list");
const completedCount = document.querySelector("#completed-count");

const filterButtons = document.querySelectorAll(".filter-button");

const menuButton = document.querySelector("#menu-button");
const mobileMenu = document.querySelector("#mobile-menu");


// 3. FILTRO INICIAL

let filtroAtual = "Todos";


// 4. IDENTIFICADOR ÚNICO DO CURSO

function obterIdentificador(curso) {
    return `${curso.assunto}-${curso.numero}`;
}


// 5. CARREGAR CURSOS CONCLUÍDOS

function carregarCursosSalvos() {
    try {
        const dados = JSON.parse(
            localStorage.getItem("cursosConcluidos") || "[]"
        );

        return Array.isArray(dados) ? dados : [];

    } catch (erro) {
        console.error("Erro ao carregar cursos salvos:", erro);
        return [];
    }
}

const cursosSalvos = carregarCursosSalvos();

cursos.forEach((curso) => {
    curso.concluido = cursosSalvos.includes(
        obterIdentificador(curso)
    );
});


// 6. SALVAR CURSOS CONCLUÍDOS

function salvarCursos() {
    const concluidos = cursos
        .filter((curso) => curso.concluido)
        .map((curso) => obterIdentificador(curso));

    try {
        localStorage.setItem(
            "cursosConcluidos",
            JSON.stringify(concluidos)
        );

    } catch (erro) {
        console.error("Erro ao salvar cursos:", erro);
    }
}


// 7. FILTRAR CURSOS

function filtrarCursos() {
    if (filtroAtual === "Todos") {
        return cursos;
    }

    return cursos.filter(
        (curso) => curso.assunto === filtroAtual
    );
}


// 8. EXIBIR CURSOS DINAMICAMENTE

function mostrarCursos(lista) {
    courseList.innerHTML = "";

    if (lista.length === 0) {
        courseList.textContent = "Nenhum curso encontrado.";
        courseList.setAttribute("aria-busy", "false");
        return;
    }

    lista.forEach((curso) => {
        const card = document.createElement("article");
        card.className = "curso-card";

        if (curso.concluido) {
            card.classList.add("concluido");
        }

        const categoria = document.createElement("span");
        categoria.className = "curso-categoria";
        categoria.textContent = `${curso.assunto} ${curso.numero}`;

        const titulo = document.createElement("h3");
        titulo.textContent = curso.titulo;

        const creditos = document.createElement("p");
        creditos.textContent = `Créditos: ${curso.creditos}`;

        const certificado = document.createElement("p");
        certificado.textContent = `Certificado: ${curso.certificado}`;

        const descricao = document.createElement("p");
        descricao.textContent = curso.descricao;

        const tecnologias = document.createElement("p");
        tecnologias.className = "curso-tecnologias";
        tecnologias.textContent =
            `Tecnologias: ${curso.tecnologias.join(", ")}`;

        const status = document.createElement("p");
        status.className = "curso-status";
        status.textContent = curso.concluido
            ? "Curso concluído"
            : "Curso em andamento";

        const botao = document.createElement("button");
        botao.className = "botao-concluir";
        botao.type = "button";
        botao.dataset.curso = obterIdentificador(curso);
        botao.setAttribute("aria-pressed", String(curso.concluido));
        botao.textContent = curso.concluido
            ? "Desmarcar conclusão"
            : "Marcar como concluído";

        card.append(
            categoria,
            titulo,
            creditos,
            certificado,
            descricao,
            tecnologias,
            status,
            botao
        );

        courseList.appendChild(card);
    });

    courseList.setAttribute("aria-busy", "false");
}


// 9. CALCULAR CRÉDITOS COM REDUCE()

function calcularCreditos(lista) {
    return lista.reduce(
        (total, curso) => total + curso.creditos,
        0
    );
}


// 10. ATUALIZAR RESUMO DOS CURSOS

function atualizarResumo(lista) {
    courseCount.textContent = lista.length;

    totalCredits.textContent = calcularCreditos(lista);

    const quantidadeConcluida = cursos.filter(
        (curso) => curso.concluido
    ).length;

    completedCount.textContent = quantidadeConcluida;
}


// 11. EXIBIR CURSOS CONCLUÍDOS

function mostrarConcluidos() {
    const concluidos = cursos.filter(
        (curso) => curso.concluido
    );

    completedList.innerHTML = "";

    if (concluidos.length === 0) {
        const mensagem = document.createElement("p");
        mensagem.textContent = "Nenhum curso concluído ainda.";
        completedList.appendChild(mensagem);
        return;
    }

    const lista = document.createElement("ul");

    concluidos.forEach((curso) => {
        const item = document.createElement("li");

        item.textContent =
            `${curso.assunto} ${curso.numero} - ${curso.titulo}`;

        lista.appendChild(item);
    });

    completedList.appendChild(lista);
}


// 12. ATUALIZAR A PÁGINA

function atualizarPagina() {
    const cursosFiltrados = filtrarCursos();

    mostrarCursos(cursosFiltrados);
    atualizarResumo(cursosFiltrados);
    mostrarConcluidos();
}


// 13. EVENTOS DOS BOTÕES DE FILTRO

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


// 14. MARCAR E DESMARCAR CURSOS CONCLUÍDOS

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

    cursoSelecionado.concluido = !cursoSelecionado.concluido;

    salvarCursos();
    atualizarPagina();
});


// 15. MENU RESPONSIVO

if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", () => {
        const menuAberto = mobileMenu.classList.toggle("aberto");

        menuButton.setAttribute(
            "aria-expanded",
            String(menuAberto)
        );

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


// 16. WAYFINDING - DESTAQUE DA NAVEGAÇÃO

const linksNavegacao = document.querySelectorAll(
    "#mobile-menu a"
);

function atualizarWayfinding() {
    const secaoAtual = window.location.hash || "#inicio";

    linksNavegacao.forEach((link) => {
        if (link.getAttribute("href") === secaoAtual) {
            link.setAttribute("aria-current", "page");
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


// 17. ANO AUTOMÁTICO NO RODAPÉ

const yearElement = document.querySelector("#year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}


// 18. ÚLTIMA MODIFICAÇÃO DO DOCUMENTO

const lastModifiedElement = document.querySelector("#last-modified");

if (lastModifiedElement) {
    const ultimaModificacao = new Date(document.lastModified);

    lastModifiedElement.textContent =
        ultimaModificacao.toLocaleString("pt-BR");
}


// 19. INICIALIZAR A PÁGINA

if (
    courseList &&
    courseCount &&
    totalCredits &&
    completedList &&
    completedCount
) {
    atualizarPagina();

} else {
    console.error(
        "Não foi possível encontrar todos os elementos necessários no HTML."
    );
}
