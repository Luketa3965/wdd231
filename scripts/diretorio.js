const membersContainer = document.querySelector("#members-container");
const memberCount = document.querySelector("#member-count");
const gridButton = document.querySelector("#grid-view");
const listButton = document.querySelector("#list-view");
const menuToggle = document.querySelector("#menu-toggle");
const primaryNav = document.querySelector("#primary-nav");

const membershipNames = {
    1: "Membro",
    2: "Prata",
    3: "Ouro"
};

async function getMembers() {
    try {
        const response = await fetch("dados/membros.json");

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const members = await response.json();
        displayMembers(members);
        memberCount.textContent = `${members.length} empresas associadas`;
    } catch (error) {
        console.error("Não foi possível carregar os membros:", error);
        membersContainer.innerHTML = '<p class="status-message">Não foi possível carregar o diretório. Verifique o arquivo JSON e tente novamente.</p>';
        memberCount.textContent = "Diretório indisponível";
    }
}

function displayMembers(members) {
    membersContainer.replaceChildren();

    members.forEach((member) => {
        const card = document.createElement("article");
        card.className = "member-card";

        const image = document.createElement("img");
        image.className = "member-logo";
        image.src = `imagens/${member.image}`;
        image.alt = `Logotipo ilustrativo de ${member.name}`;
        image.width = 104;
        image.height = 80;
        image.loading = "lazy";

        const name = document.createElement("h3");
        name.textContent = member.name;

        const category = document.createElement("p");
        category.className = "member-category";
        category.textContent = `${member.category} • Associação ${membershipNames[member.membership] ?? "Membro"}`;

        const address = document.createElement("p");
        address.className = "member-details";
        address.textContent = member.address;

        const phone = document.createElement("p");
        phone.className = "member-details";
        phone.textContent = member.phone;

        const description = document.createElement("p");
        description.className = "member-details";
        description.textContent = member.description;

        const website = document.createElement("a");
        website.href = member.website;
        website.textContent = "Visitar site";
        website.target = "_blank";
        website.rel = "noopener noreferrer";

        card.append(image, name, category, address, phone, description, website);
        membersContainer.append(card);
    });
}

function setView(view) {
    const isGrid = view === "grid";
    membersContainer.classList.toggle("members-grid", isGrid);
    membersContainer.classList.toggle("members-list", !isGrid);
    gridButton.classList.toggle("is-active", isGrid);
    listButton.classList.toggle("is-active", !isGrid);
    gridButton.setAttribute("aria-pressed", String(isGrid));
    listButton.setAttribute("aria-pressed", String(!isGrid));
}

gridButton.addEventListener("click", () => setView("grid"));
listButton.addEventListener("click", () => setView("list"));

menuToggle.addEventListener("click", () => {
    const isOpen = primaryNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu de navegação" : "Abrir menu de navegação");
});

document.querySelector("#current-year").textContent = new Date().getFullYear();

const modifiedDate = new Date(document.lastModified);
document.querySelector("#last-modified").textContent = Number.isNaN(modifiedDate.getTime())
    ? "Data indisponível"
    : modifiedDate.toLocaleString("pt-BR");

getMembers();
