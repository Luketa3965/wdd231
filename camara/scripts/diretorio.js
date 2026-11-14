
// ============================================
// WDD231 - CÂMARA DE COMÉRCIO DE JACAREÍ
// Diretório de empresas associadas
// ============================================

// ELEMENTOS HTML
const membersContainer = document.querySelector("#members-container");
const memberCount = document.querySelector("#member-count");

const gridButton = document.querySelector("#grid-view");
const listButton = document.querySelector("#list-view");

const menuToggle = document.querySelector("#menu-button");
const primaryNav = document.querySelector("#primary-nav");

const yearElement = document.querySelector("#current-year");
const modifiedElement = document.querySelector("#last-modified");

// NÍVEIS DE ASSOCIAÇÃO
const membershipNames = {
    1: "Membro",
    2: "Prata",
    3: "Ouro"
};

// ============================================
// CARREGAR MEMBROS DO ARQUIVO JSON
// ============================================

async function getMembers() {
    if (!membersContainer) return;

    try {
        const response = await fetch("dados/membros.json");

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const members = await response.json();

        if (!Array.isArray(members)) {
            throw new Error("O arquivo JSON não contém uma lista válida.");
        }

        displayMembers(members);

        if (memberCount) {
            memberCount.textContent =
                `${members.length} empresas associadas`;
        }

    } catch (error) {
        console.error("Erro ao carregar membros:", error);

        membersContainer.textContent =
            "Não foi possível carregar as empresas. Verifique o arquivo membros.json.";

        if (memberCount) {
            memberCount.textContent = "Diretório indisponível";
        }
    } finally {
        membersContainer.setAttribute("aria-busy", "false");
    }
}

// ============================================
// EXIBIR CARTÕES DAS EMPRESAS
// ============================================

function displayMembers(members) {
    membersContainer.replaceChildren();

    members.forEach((member) => {

        const card = document.createElement("article");
        card.className = "member-card";

        // LOGOTIPO
        const image = document.createElement("img");

        image.className = "member-logo";
        image.src = `imagens/${member.image}`;
        image.alt = `Logotipo de ${member.name}`;
        image.width = 104;
        image.height = 80;
        image.loading = "lazy";

        image.addEventListener("error", () => {
            image.alt = `Imagem indisponível para ${member.name}`;
        });

        // NOME
        const name = document.createElement("h3");
        name.textContent = member.name;

        // CATEGORIA
        const category = document.createElement("p");
        category.className = "member-category";

        category.textContent =
            `${member.category} • Associação ${membershipNames[member.membership] ?? "Membro"}`;

        // ENDEREÇO
        const address = document.createElement("p");
        address.className = "member-details";
        address.textContent = member.address;

        // TELEFONE
        const phone = document.createElement("p");
        phone.className = "member-details";
        phone.textContent = member.phone;

        // DESCRIÇÃO
        const description = document.createElement("p");
        description.className = "member-details";
        description.textContent = member.description;

        // WEBSITE
        const website = document.createElement("a");

        website.href = member.website;
        website.textContent = "Visitar site";
        website.target = "_blank";
        website.rel = "noopener noreferrer";

        // ADICIONAR ELEMENTOS AO CARTÃO
        card.append(
            image,
            name,
            category,
            address,
            phone,
            description,
            website
        );

        membersContainer.appendChild(card);
    });
}

// ============================================
// ALTERNAR ENTRE GRADE E LISTA
// ============================================

function setView(view) {

    const isGrid = view === "grid";

    membersContainer.classList.toggle("members-grid", isGrid);
    membersContainer.classList.toggle("members-list", !isGrid);

    if (gridButton && listButton) {

        gridButton.classList.toggle("is-active", isGrid);
        listButton.classList.toggle("is-active", !isGrid);

        gridButton.setAttribute("aria-pressed", String(isGrid));
        listButton.setAttribute("aria-pressed", String(!isGrid));
    }
}

if (gridButton) {
    gridButton.addEventListener("click", () => {
        setView("grid");
    });
}

if (listButton) {
    listButton.addEventListener("click", () => {
        setView("list");
    });
}

// ============================================
// MENU RESPONSIVO
// ============================================

if (menuToggle && primaryNav) {

    menuToggle.addEventListener("click", () => {

        const isOpen = primaryNav.classList.toggle("is-open");

        menuToggle.setAttribute("aria-expanded", String(isOpen));

        menuToggle.setAttribute(
            "aria-label",
            isOpen
                ? "Fechar menu de navegação"
                : "Abrir menu de navegação"
        );
    });

    primaryNav.querySelectorAll("a").forEach((link) => {

        link.addEventListener("click", () => {

            primaryNav.classList.remove("is-open");

            menuToggle.setAttribute("aria-expanded", "false");

            menuToggle.setAttribute(
                "aria-label",
                "Abrir menu de navegação"
            );
        });
    });
}

// ============================================
// ANO AUTOMÁTICO
// ============================================

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

// ============================================
// DATA DA ÚLTIMA MODIFICAÇÃO
// ============================================

if (modifiedElement) {

    const modifiedDate = new Date(document.lastModified);

    modifiedElement.textContent =
        Number.isNaN(modifiedDate.getTime())
            ? "Data indisponível"
            : modifiedDate.toLocaleString("pt-BR");
}

// ============================================
// INICIALIZAÇÃO
// ============================================

getMembers();
