
/* ==========================================
   CÂMARA DE COMÉRCIO DE JACAREÍ
   PÁGINA INICIAL
   Desenvolvido por Lucas Moreira Domingos
========================================== */

// ==========================================
// CONFIGURAÇÃO DO OPENWEATHERMAP
// ==========================================

const WEATHER_API_KEY = "SUA_CHAVE_API_AQUI";

const WEATHER_CITY = "Jacarei,BR";

const WEATHER_URL = "https://api.openweathermap.org/data/2.5";


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


function isWeatherConfigured() {

    return (
        WEATHER_API_KEY &&
        WEATHER_API_KEY !== "SUA_CHAVE_API_AQUI"
    );

}


async function fetchWeather(endpoint) {

    const url = new URL(`${WEATHER_URL}/${endpoint}`);

    url.search = new URLSearchParams({
        q: WEATHER_CITY,
        units: "metric",
        lang: "pt_br",
        appid: WEATHER_API_KEY
    });

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Erro na consulta meteorológica: ${response.status}`);
    }

    return response.json();

}


// ==========================================
// CLIMA ATUAL
// ==========================================

async function getCurrentWeather() {

    const container = document.querySelector("#current-weather");

    if (!container) return;

    if (!isWeatherConfigured()) {

        showMessage(
            container,
            "Configure sua chave do OpenWeatherMap para visualizar o clima."
        );

        return;

    }

    try {

        const data = await fetchWeather("weather");

        if (!data.main || !data.weather?.length) {
            throw new Error("Dados meteorológicos incompletos.");
        }

        const temperature = Math.round(data.main.temp);

        const description = data.weather[0].description;

        const icon = data.weather[0].icon;

        const iconImage = document.createElement("img");

        iconImage.src =
            `https://openweathermap.org/img/wn/${icon}@2x.png`;

        iconImage.alt = `Condição do tempo: ${description}`;

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

    const container = document.querySelector("#forecast-container");

    if (!container) return;

    if (!isWeatherConfigured()) {

        showMessage(
            container,
            "Configure sua chave de API para visualizar a previsão."
        );

        return;

    }

    try {

        const data = await fetchWeather("forecast");

        if (!data.list?.length || !data.city) {
            throw new Error("Dados da previsão indisponíveis.");
        }

        const timezone = data.city.timezone;

        // Data atual no horário local da cidade.

        const today = new Date(
            (Date.now() / 1000 + timezone) * 1000
        ).toISOString().slice(0, 10);

        const dailyForecast = new Map();

        // Agrupa as previsões por dia local.

        data.list.forEach((item) => {

            const localDate = new Date(
                (item.dt + timezone) * 1000
            ).toISOString().slice(0, 10);

            // Ignora o dia atual.

            if (localDate <= today) return;

            // Identifica o horário local da previsão.

            const localHour = new Date(
                (item.dt + timezone) * 1000
            ).getUTCHours();

            // Prioriza o horário mais próximo do meio-dia.

            const difference = Math.abs(localHour - 12);

            const existing = dailyForecast.get(localDate);

            if (!existing || difference < existing.difference) {

                dailyForecast.set(localDate, {
                    item,
                    difference
                });

            }

        });

        // Seleciona os três próximos dias disponíveis.

        const forecastDays = [...dailyForecast.entries()]
            .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
            .slice(0, 3);

        if (forecastDays.length === 0) {
            throw new Error("Nenhuma previsão futura encontrada.");
        }

        const cards = forecastDays.map(([date, forecast]) => {

            const item = forecast.item;

            // Utiliza UTC para evitar diferenças de fuso na exibição.

            const localDate = new Date(`${date}T12:00:00Z`);

            const dayName = localDate.toLocaleDateString(
                "pt-BR",
                {
                    weekday: "short",
                    timeZone: "UTC"
                }
            );

            const icon = item.weather[0].icon;

            const descriptionText = item.weather[0].description;

            const iconImage = document.createElement("img");

            iconImage.src =
                `https://openweathermap.org/img/wn/${icon}.png`;

            iconImage.alt = descriptionText;

            iconImage.width = 55;
            iconImage.height = 55;

            iconImage.loading = "lazy";

            const card = document.createElement("article");

            card.className = "forecast-card";

            const heading = document.createElement("h4");

            heading.textContent = dayName.replace(".", "");

            const temperature = document.createElement("p");

            temperature.className = "forecast-temp";

            temperature.textContent =
                `${Math.round(item.main.temp)} °C`;

            const description = document.createElement("p");

            description.textContent = descriptionText;

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

    const container = document.querySelector("#featured-container");

    if (!container) return;

    container.setAttribute("aria-busy", "true");

    try {

        const response = await fetch("dados/membros.json");

        if (!response.ok) {
            throw new Error("Não foi possível carregar os membros.");
        }

        const members = await response.json();

        if (!Array.isArray(members)) {
            throw new Error("O arquivo de membros possui formato inválido.");
        }

        // Nível 2 = Prata
        // Nível 3 = Ouro

        const eligibleMembers = members.filter((member) => {

            return (
                Number(member.membership) === 2 ||
                Number(member.membership) === 3
            );

        });

        if (eligibleMembers.length === 0) {

            showMessage(
                container,
                "Ainda não existem empresas disponíveis para destaque."
            );

            return;

        }

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

        // Seleciona até três empresas.

        const selectedMembers = shuffledMembers.slice(0, 3);

        // Criação dos cartões.

        const cards = selectedMembers.map((member) => {

            const card = document.createElement("article");

            card.className = "featured-card";

            // LOGOTIPO

            const logo = document.createElement("img");

            logo.src = `imagens/${member.image || ""}`;

            logo.alt = member.name
                ? `Logotipo de ${member.name}`
                : "Logotipo da empresa";

            logo.width = 110;
            logo.height = 85;

            logo.loading = "lazy";

            logo.addEventListener("error", () => {

                logo.alt = "Logotipo indisponível";

            });

            // NOME

            const name = document.createElement("h3");

            name.textContent = member.name || "Empresa associada";

            // CATEGORIA

            const category = document.createElement("p");

            category.className = "member-category";

            category.textContent = member.category || "Categoria não informada";

            // TELEFONE

            const phone = document.createElement("p");

            phone.textContent = member.phone
                ? `Telefone: ${member.phone}`
                : "Telefone não informado";

            // ENDEREÇO

            const address = document.createElement("p");

            address.textContent =
                member.address || "Endereço não informado";

            // SITE

            const website = document.createElement("a");

            const validWebsite = getValidWebsite(member.website);

            if (validWebsite) {

                website.href = validWebsite;

                website.textContent = "Visitar site";

                website.target = "_blank";

                website.rel = "noopener noreferrer";

            } else {

                website.textContent = "Site não disponível";

            }

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

    } catch (error) {

        console.error("Erro ao carregar empresas:", error);

        showMessage(
            container,
            "Não foi possível carregar as empresas em destaque."
        );

    } finally {

        container.setAttribute("aria-busy", "false");

    }

}


// ==========================================
// VALIDAÇÃO DO ENDEREÇO DO SITE
// ==========================================

function getValidWebsite(website) {

    if (typeof website !== "string" || !website.trim()) {
        return null;
    }

    try {

        const normalizedWebsite = /^https?:\/\//i.test(website)
            ? website
            : `https://${website}`;

        const url = new URL(normalizedWebsite);

        if (
            url.protocol !== "http:" &&
            url.protocol !== "https:"
        ) {
            return null;
        }

        return url.href;

    } catch {

        return null;

    }

}


// ==========================================
// INICIALIZAÇÃO DA PÁGINA
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    getCurrentWeather();

    getWeatherForecast();

    getFeaturedMembers();

});
