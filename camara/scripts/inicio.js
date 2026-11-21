
/* ==========================================
   CÂMARA DE COMÉRCIO DE JACAREÍ
   PÁGINA INICIAL
========================================== */

// CONFIGURAÇÃO DO OPENWEATHERMAP

const WEATHER_API_KEY = "SUA_CHAVE_API_AQUI";

const WEATHER_CITY = "Jacarei,BR";

const WEATHER_URL =
    "https://api.openweathermap.org/data/2.5";


// ==========================================
// FUNÇÕES AUXILIARES
// ==========================================

function showMessage(element, message, isError = false) {

    if (!element) return;

    const paragraph = document.createElement("p");

    paragraph.textContent = message;

    if (isError) {
        paragraph.classList.add("weather-error");
    }

    element.replaceChildren(paragraph);

}


// ==========================================
// CLIMA ATUAL
// ==========================================

async function getCurrentWeather() {

    const container = document.querySelector("#current-weather");

    if (!container) return;

    if (
        !WEATHER_API_KEY ||
        WEATHER_API_KEY === "SUA_CHAVE_API_AQUI"
    ) {

        showMessage(
            container,
            "Configure sua chave do OpenWeatherMap para visualizar o clima."
        );

        return;
    }

    try {

        const url =
            `${WEATHER_URL}/weather?q=${WEATHER_CITY}` +
            `&units=metric&lang=pt_br&appid=${WEATHER_API_KEY}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Não foi possível consultar o clima.");
        }

        const data = await response.json();

        const temperature = Math.round(data.main.temp);

        const description = data.weather[0].description;

        const icon = data.weather[0].icon;

        const iconUrl =
            `https://openweathermap.org/img/wn/${icon}@2x.png`;

        const iconImage = document.createElement("img");

        iconImage.src = iconUrl;
        iconImage.alt = description;
        iconImage.width = 90;
        iconImage.height = 90;

        const information = document.createElement("div");

        const temperatureElement = document.createElement("p");

        temperatureElement.className = "weather-temperature";
        temperatureElement.textContent = `${temperature} °C`;

        const descriptionElement = document.createElement("p");

        descriptionElement.className = "weather-description";
        descriptionElement.textContent = description;

        const feelsLike = document.createElement("p");

        feelsLike.textContent =
            `Sensação térmica: ${Math.round(data.main.feels_like)} °C`;

        information.append(
            temperatureElement,
            descriptionElement,
            feelsLike
        );

        container.replaceChildren(iconImage, information);

    } catch (error) {

        console.error("Erro ao consultar clima:", error);

        showMessage(
            container,
            "Não foi possível carregar o clima. Tente novamente mais tarde.",
            true
        );

    }

}


// ==========================================
// PREVISÃO PARA TRÊS DIAS
// ==========================================

async function getWeatherForecast() {

    const container =
        document.querySelector("#forecast-container");

    if (!container) return;

    if (
        !WEATHER_API_KEY ||
        WEATHER_API_KEY === "SUA_CHAVE_API_AQUI"
    ) {

        showMessage(
            container,
            "Configure sua chave de API para visualizar a previsão."
        );

        return;
    }

    try {

        const url =
            `${WEATHER_URL}/forecast?q=${WEATHER_CITY}` +
            `&units=metric&lang=pt_br&appid=${WEATHER_API_KEY}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Não foi possível consultar a previsão.");
        }

        const data = await response.json();

        const timezone = data.city.timezone;

        // Identifica os próximos três dias locais.

        const today = new Date(
            (Date.now() / 1000 + timezone) * 1000
        ).toISOString().slice(0, 10);

        const dailyForecast = new Map();

        data.list.forEach((item) => {

            const localDate = new Date(
                (item.dt + timezone) * 1000
            ).toISOString().slice(0, 10);

            // Não inclui o dia atual.

            if (localDate <= today) return;

            // Escolhe o horário mais próximo do meio-dia.

            const localHour = new Date(
                (item.dt + timezone) * 1000
            ).getUTCHours();

            const difference = Math.abs(localHour - 12);

            const existing = dailyForecast.get(localDate);

            if (
                !existing ||
                difference < existing.difference
            ) {

                dailyForecast.set(localDate, {
                    item,
                    difference
                });

            }

        });

        const forecastDays = [...dailyForecast.entries()]
            .slice(0, 3);

        if (forecastDays.length < 3) {
            throw new Error("Previsão de três dias indisponível.");
        }

        const cards = forecastDays.map(([date, forecast]) => {

            const item = forecast.item;

            const localDate = new Date(`${date}T12:00:00`);

            const dayName = localDate.toLocaleDateString(
                "pt-BR",
                {
                    weekday: "short",
                    timeZone: "UTC"
                }
            );

            const icon = item.weather[0].icon;

            const iconImage = document.createElement("img");

            iconImage.src =
                `https://openweathermap.org/img/wn/${icon}.png`;

            iconImage.alt = item.weather[0].description;
            iconImage.width = 55;
            iconImage.height = 55;

            const card = document.createElement("article");

            card.className = "forecast-card";

            const heading = document.createElement("h4");

            heading.textContent =
                dayName.replace(".", "");

            const temperature = document.createElement("p");

            temperature.className = "forecast-temp";

            temperature.textContent =
                `${Math.round(item.main.temp)} °C`;

            const description = document.createElement("p");

            description.textContent =
                item.weather[0].description;

            card.append(
                heading,
                iconImage,
                temperature,
                description
            );

            return card;

        });

        container.replaceChildren(...cards);

    } catch (error) {

        console.error("Erro na previsão do tempo:", error);

        showMessage(
            container,
            "Não foi possível carregar a previsão meteorológica.",
            true
        );

    }

}


// ==========================================
// EMPRESAS EM DESTAQUE
// ==========================================

async function getFeaturedMembers() {

    const container =
        document.querySelector("#featured-container");

    if (!container) return;

    try {

        const response = await fetch("dados/membros.json");

        if (!response.ok) {
            throw new Error("Não foi possível carregar os membros.");
        }

        const members = await response.json();

        // Nível 2 = Prata
        // Nível 3 = Ouro

        const eligibleMembers = members.filter(
            member =>
                Number(member.membership) === 2 ||
                Number(member.membership) === 3
        );

        // Embaralhamento aleatório.

        const shuffledMembers = [...eligibleMembers];

        for (let i = shuffledMembers.length - 1; i > 0; i--) {

            const j = Math.floor(Math.random() * (i + 1));

            [
                shuffledMembers[i],
                shuffledMembers[j]
            ] = [
                shuffledMembers[j],
                shuffledMembers[i]
            ];

        }

        // Seleciona três empresas.

        const selectedMembers =
            shuffledMembers.slice(0, 3);

        if (selectedMembers.length < 2) {
            throw new Error("Não existem membros suficientes.");
        }

        const cards = selectedMembers.map(member => {

            const card = document.createElement("article");

            card.className = "featured-card";

            // LOGOTIPO

            const logo = document.createElement("img");

            logo.src = `imagens/${member.image}`;

            logo.alt = `Logotipo de ${member.name}`;

            logo.width = 110;
            logo.height = 85;

            logo.loading = "lazy";

            logo.addEventListener("error", () => {
                logo.alt = "Logotipo indisponível";
            });

            // NOME

            const name = document.createElement("h3");

            name.textContent = member.name;

            // CATEGORIA

            const category = document.createElement("p");

            category.className = "member-category";

            category.textContent = member.category;

            // TELEFONE

            const phone = document.createElement("p");

            phone.textContent = `Telefone: ${member.phone}`;

            // ENDEREÇO

            const address = document.createElement("p");

            address.textContent = member.address;

            // SITE

            const website = document.createElement("a");

            website.href = member.website;

            website.textContent = "Visitar site";

            website.target = "_blank";

            website.rel = "noopener noreferrer";

            // NÍVEL DE ASSOCIAÇÃO

            const membership = document.createElement("span");

            membership.className = "membership-badge";

            membership.textContent =
                Number(member.membership) === 3
                    ? "Associado Ouro"
                    : "Associado Prata";

            card.append(
                logo,
                name,
                category,
                phone,
                address,
                website,
                membership
            );

            return card;

        });

        container.replaceChildren(...cards);

        container.setAttribute("aria-busy", "false");

    } catch (error) {

        console.error("Erro ao carregar empresas:", error);

        showMessage(
            container,
            "Não foi possível carregar as empresas em destaque."
        );

        container.setAttribute("aria-busy", "false");

    }

}


// ==========================================
// INICIALIZAÇÃO
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    getCurrentWeather();

    getWeatherForecast();

    getFeaturedMembers();

});
