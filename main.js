
// =====================================
// WDD231 - JAVASCRIPT
// Cursos e acompanhamento acadêmico
// =====================================


// 1. ARRAY ORIGINAL DE OBJETOS DOS CURSOS

const cursos = [
    {
        assunto: 'CSE',
        número: 110,
        título: 'Introdução à Programação',
        créditos: 2,
        Certificado: 'Programação Web e de Computadores',
        Descrição: 'Este curso apresentará aos alunos a programação. Ele apresentará os elementos básicos das linguagens de programação (variáveis, decisões, cálculos, loops, arrays e entrada/saída) e como usá-los para resolver problemas.',
        tecnologia: ['Python'],
        concluo: false
    },
    {
        assunto: 'WDD',
        número: 130,
        título: 'Fundamentos da Web',
        créditos: 2,
        Certificado: 'Programação Web e de Computadores',
        Descrição: 'Este curso apresenta aos alunos a World Wide Web e as carreiras em design e desenvolvimento de websites. O curso é prático, com os alunos participando ativamente de projetos simples de design e programação web. Espera-se que os alunos que concluírem este curso compreendam as áreas de design e desenvolvimento web e tenham uma boa ideia se desejam seguir essa área como graduação.',
        tecnologia: ['HTML', 'CSS'],
        concluo: false
    },
    {
        assunto: 'CSE',
        número: 111,
        título: 'Programação com Funções',
        créditos: 2,
        Certificado: 'Programação Web e de Computadores',
        Descrição: 'Os alunos de CSE 111 tornam-se programadores de computador mais organizados, eficientes e poderosos ao aprenderem a pesquisar e chamar funções escritas por outros; a escrever, chamar, depurar e testar suas próprias funções; e a lidar com erros dentro das funções. Os alunos de CSE 111 escrevem programas com funções para resolver problemas em diversas disciplinas, incluindo negócios, ciências físicas, desempenho humano e humanidades.',
        tecnologia: ['Python'],
        concluo: false
    },
    {
        assunto: 'CSE',
        número: 210,
        título: 'Programação com Classes',
        créditos: 2,
        Certificado: 'Programação Web e de Computadores',
        Descrição: 'Este curso apresentará a noção de classes e objetos. Ele apresentará o encapsulamento em um nível conceitual. Também abordará herança e polimorfismo.',
        tecnologia: ['C#'],
        concluo: false
    },
    {
        assunto: 'WDD',
        número: 131,
        título: 'Fundamentos da Web Dinâmica',
        créditos: 2,
        Certificado: 'Programação Web e de Computadores',
        Descrição: 'Este curso se baseia em experiências anteriores em fundamentos da Web e programação. Os alunos aprenderão a criar sites dinâmicos que usam JavaScript para responder a eventos, atualizar conteúdo e criar experiências de usuário responsivas.',
        tecnologia: ['HTML', 'CSS', 'JavaScript'],
        concluo: false
    },
    {
        assunto: 'WDD',
        número: 231,
        título: 'Desenvolvimento Web Frontend I',
        créditos: 2,
        Certificado: 'Programação Web e de Computadores',
        Descrição: 'Este curso se baseia na experiência prévia com Fundamentos da Web Dinâmica e programação. Os alunos se concentrarão em experiência do usuário, acessibilidade, conformidade, otimização de desempenho e uso básico de APIs.',
        tecnologia: ['HTML', 'CSS', 'JavaScript'],
        concluo: false
    }
];


// 2. ELEMENTOS HTML

const courseList = document.querySelector('#course-list');
const courseCount = document.querySelector('#course-count');
const totalCredits = document.querySelector('#total-credits');
const completedList = document.querySelector('#completed-list');
const completedCount = document.querySelector('#completed-count');

const filterButtons = document.querySelectorAll('.filter-button');

const menuButton = document.querySelector('#menu-button');
const mobileMenu = document.querySelector('#mobile-menu');


// 3. FILTRO ATUAL

let filtroAtual = 'Todos';


// 4. CARREGAR CURSOS CONCLUÍDOS

const cursosSalvos = JSON.parse(
    localStorage.getItem('cursosConcluidos') || '[]'
);

cursos.forEach((curso) => {
    const identificador = `${curso.assunto}-${curso.número}`;

    curso.concluo = cursosSalvos.includes(identificador);
});


// 5. IDENTIFICAR UM CURSO

function obterIdentificador(curso) {
    return `${curso.assunto}-${curso.número}`;
}


// 6. SALVAR CURSOS CONCLUÍDOS

function salvarCursos() {
    const concluidos = cursos
        .filter((curso) => curso.concluo)
        .map((curso) => obterIdentificador(curso));

    localStorage.setItem(
        'cursosConcluidos',
        JSON.stringify(concluidos)
    );
}


// 7. FILTRAR CURSOS

function filtrarCursos() {
    if (filtroAtual === 'Todos') {
        return cursos;
    }

    return cursos.filter((curso) => {
        return curso.assunto === filtroAtual;
    });
}


// 8. MOSTRAR CURSOS NA PÁGINA

function mostrarCursos(lista) {
    courseList.innerHTML = '';

    if (lista.length === 0) {
        courseList.innerHTML = '<p>Nenhum curso encontrado.</p>';
        return;
    }

    lista.forEach((curso) => {
        const card = document.createElement('article');

        card.className = 'curso-card';

        if (curso.concluo) {
            card.classList.add('concluido');
        }

        const tecnologias = curso.tecnologia.join(', ');

        const status = curso.concluo
            ? 'Curso concluído'
            : 'Curso em andamento';

        const botaoTexto = curso.concluo
            ? 'Desmarcar conclusão'
            : 'Marcar como concluído';

        card.innerHTML = `
            <span class="curso-categoria">
                ${curso.assunto} ${curso.número}
            </span>

            <h3>${curso.título}</h3>

            <p>
                <strong>Créditos:</strong>
                ${curso.créditos}
            </p>

            <p>
                <strong>Certificado:</strong>
                ${curso.Certificado}
            </p>

            <p>${curso.Descrição}</p>

            <p class="curso-tecnologias">
                Tecnologias: ${tecnologias}
            </p>

            <p class="curso-status">
                ${status}
            </p>

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
}


// 9. CALCULAR CRÉDITOS COM REDUCE()

function calcularCreditos(lista) {
    return lista.reduce((total, curso) => {
        return total + curso.créditos;
    }, 0);
}


// 10. ATUALIZAR RESUMO

function atualizarResumo(lista) {
    courseCount.textContent = lista.length;

    totalCredits.textContent = calcularCreditos(lista);

    const quantidadeConcluida = cursos.filter(
        (curso) => curso.concluo
    ).length;

    completedCount.textContent = quantidadeConcluida;
}


// 11. MOSTRAR CURSOS CONCLUÍDOS

function mostrarConcluidos() {
    const concluidos = cursos.filter(
        (curso) => curso.concluo
    );

    completedList.innerHTML = '';

    if (concluidos.length === 0) {
        completedList.innerHTML =
            '<p>Nenhum curso concluído ainda.</p>';
        return;
    }

    const lista = document.createElement('ul');

    concluidos.forEach((curso) => {
        const item = document.createElement('li');

        item.textContent =
            `${curso.assunto} ${curso.número} - ${curso.título}`;

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


// 13. EVENTOS DOS FILTROS

filterButtons.forEach((botao) => {
    botao.addEventListener('click', () => {
        filtroAtual = botao.dataset.filter;

        filterButtons.forEach((item) => {
            item.classList.remove('ativo');
            item.setAttribute('aria-pressed', 'false');
        });

        botao.classList.add('ativo');
        botao.setAttribute('aria-pressed', 'true');

        atualizarPagina();
    });
});


// 14. MARCAR CURSOS COMO CONCLUÍDOS

courseList.addEventListener('click', (evento) => {
    const botao = evento.target.closest('.botao-concluir');

    if (!botao) {
        return;
    }

    const identificador = botao.dataset.curso;

    const cursoSelecionado = cursos.find((curso) => {
        return obterIdentificador(curso) === identificador;
    });

    if (!cursoSelecionado) {
        return;
    }

    cursoSelecionado.concluo = !cursoSelecionado.concluo;

    salvarCursos();

    atualizarPagina();
});


// 15. MENU RESPONSIVO

menuButton.addEventListener('click', () => {
    const menuAberto = mobileMenu.classList.toggle('aberto');

    menuButton.setAttribute('aria-expanded', menuAberto);

    menuButton.setAttribute(
        'aria-label',
        menuAberto ? 'Fechar menu' : 'Abrir menu'
    );
});


// FECHAR MENU APÓS CLICAR EM UM LINK

mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('aberto');

        menuButton.setAttribute('aria-expanded', 'false');

        menuButton.setAttribute('aria-label', 'Abrir menu');
    });
});


// 16. ANO AUTOMÁTICO

document.querySelector('#year').textContent =
    new Date().getFullYear();


// 17. ÚLTIMA MODIFICAÇÃO

const ultimaModificacao = new Date(document.lastModified);

document.querySelector('#last-modified').textContent =
    ultimaModificacao.toLocaleString('pt-BR');


// 18. INICIALIZAR PÁGINA

atualizarPagina();

