
/* ==========================================
   CÂMARA DE COMÉRCIO DE JACAREÍ
   SCRIPT PRINCIPAL
   Desenvolvido por Lucas Moreira Domingos
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // MENU RESPONSIVO
    // ==========================================

    const menuButton = document.querySelector("#menu-button");
    const primaryNav = document.querySelector("#primary-nav");

    if (menuButton && primaryNav) {

        menuButton.addEventListener("click", () => {

            const isOpen = primaryNav.classList.toggle("is-open");

            menuButton.setAttribute("aria-expanded", String(isOpen));

            menuButton.setAttribute(
                "aria-label",
                isOpen
                    ? "Fechar menu de navegação"
                    : "Abrir menu de navegação"
            );

            menuButton.textContent = isOpen ? "✕" : "☰";

        });

        // Fecha o menu ao selecionar um link
        primaryNav.querySelectorAll("a").forEach((link) => {

            link.addEventListener("click", () => {

                primaryNav.classList.remove("is-open");

                menuButton.setAttribute("aria-expanded", "false");
                menuButton.setAttribute(
                    "aria-label",
                    "Abrir menu de navegação"
                );

                menuButton.textContent = "☰";

            });

        });

    }

    // ==========================================
    // ANO ATUAL
    // ==========================================

    const currentYear = document.querySelector("#current-year");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    // ==========================================
    // ÚLTIMA MODIFICAÇÃO
    // ==========================================

    const lastModified = document.querySelector("#last-modified");

    if (lastModified) {

        const modificationDate = new Date(document.lastModified);

        lastModified.textContent =
            Number.isNaN(modificationDate.getTime())
                ? "Data indisponível"
                : modificationDate.toLocaleString("pt-BR");

    }

});
