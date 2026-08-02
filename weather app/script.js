// ==========================
// API KEY
// ==========================

const apiKey = "7b683fda25f787f78f7595299b80345c";

// ==========================
// SELECT ELEMENTS
// ==========================

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const themeBtn = document.getElementById("themeBtn");

const city = document.getElementById("city");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const pressure = document.getElementById("pressure");
const visibility = document.getElementById("visibility");
const weatherIcon = document.getElementById("weatherIcon");

const loading = document.getElementById("loading");
const error = document.getElementById("error");
const forecastCards = document.getElementById("forecastCards");

const weatherCard = document.querySelector(".weather-card");

// ==========================
// SEARCH BUTTON
// ==========================

searchBtn.addEventListener("click", () => {

    const cityName = cityInput.value.trim();

    if (cityName === "") {
        showError("Please enter a city name.");
        return;
    }

    getWeather(cityName);

});

// ==========================
// ENTER KEY SEARCH
// ==========================

cityInput.addEventListener("keydown", (e) => {

    if (e.key === "Enter") {
        searchBtn.click();
    }

});

// ==========================
// GET WEATHER
// ==========================

async function getWeather(cityName) {

    hideError();

    loading.style.display = "block";

    searchBtn.disabled = true;

    try {

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`
        );

        if (!response.ok) {
            throw new Error("City not found");
        }

        const data = await response.json();

        displayWeather(data);

        weatherCard.style.display = "block";

        await getForecast(cityName);

        localStorage.setItem("lastCity", cityName.trim());

    } catch (err) {

        showError(err.message);

        weatherCard.style.display = "none";

        forecastCards.innerHTML = "";

    } finally {

        loading.style.display = "none";

        searchBtn.disabled = false;

    }

}

// ==========================
// DISPLAY WEATHER
// ==========================

function displayWeather(data) {

    city.textContent = `${data.name}, ${data.sys.country}`;

    temperature.textContent =
        `${Math.round(data.main.temp)}°C`;

    description.textContent =
        data.weather[0].description.replace(
            /\b\w/g,
            letter => letter.toUpperCase()
        );

    feelsLike.textContent =
        `${Math.round(data.main.feels_like)}°C`;

    humidity.textContent =
        `${data.main.humidity}%`;

    wind.textContent =
        `${(data.wind.speed * 3.6).toFixed(1)} km/h`;

    pressure.textContent =
        `${data.main.pressure} hPa`;

    visibility.textContent =
        `${Math.round(data.visibility / 1000)} km`;

    weatherIcon.src =
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    weatherIcon.alt =
        data.weather[0].description;

}

// ==========================
// FORECAST
// ==========================

async function getForecast(cityName) {

    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`
    );

    const data = await response.json();

    displayForecast(data.list);

}

// ==========================
// DISPLAY FORECAST
// ==========================

function displayForecast(forecastData) {

    forecastCards.innerHTML = "";

    const dailyForecast = [];

    forecastData.forEach(item => {

        if (item.dt_txt.includes("12:00:00")) {
            dailyForecast.push(item);
        }

    });

    dailyForecast.slice(0, 5).forEach(day => {

        const date = new Date(day.dt_txt);

        const dayName =
            date.toLocaleDateString("en-US", {
                weekday: "short"
            });

        const card = document.createElement("div");

        card.classList.add("forecast-card");

        card.innerHTML = `
            <h3>${dayName}</h3>

            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png">

            <h2>${Math.round(day.main.temp)}°C</h2>

            <p>${day.weather[0].main}</p>
        `;

        forecastCards.appendChild(card);

    });

}

// ==========================
// ERROR FUNCTIONS
// ==========================

function showError(message) {

    error.style.display = "block";

    error.textContent = message;

}

function hideError() {

    error.style.display = "none";

}

// ==========================
// THEME
// ==========================

themeBtn.addEventListener("click", () => {

    const isDark =
        document.body.classList.toggle("dark");

    themeBtn.textContent =
        isDark ? "☀️" : "🌙";

    localStorage.setItem(
        "theme",
        isDark ? "dark" : "light"
    );

});

// ==========================
// PAGE LOAD
// ==========================

window.addEventListener("load", () => {

    cityInput.focus();

    const savedTheme =
        localStorage.getItem("theme");

    if (savedTheme === "dark") {

        document.body.classList.add("dark");

        themeBtn.textContent = "☀️";

    }

    const lastCity =
        localStorage.getItem("lastCity");

    if (lastCity) {

        cityInput.value = lastCity;

        getWeather(lastCity);

    }

});