let forecastData = null; // store forecast after first fetch

document.getElementById("search-btn").addEventListener("click", async () => {
  const city = document.getElementById("search-input").value.trim();
  if (!city) return alert("Enter a city name");

  // Geocode
  const geoRes = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
  );
  const geoData = await geoRes.json();
  if (!geoData.results || geoData.results.length === 0)
    return alert("City not found");

  const { latitude, longitude, name } = geoData.results[0];
  document.getElementById("city").textContent = name;

  // Fetch 7-day + hourly forecast
  const weatherRes = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,weathercode&hourly=temperature_2m,weathercode&forecast_days=7&timezone=auto`
  );
  forecastData = await weatherRes.json();

  // Fill your buttons
  const dayButtons = document.querySelectorAll(".day");
  forecastData.daily.time.forEach((date, i) => {
    if (dayButtons[i]) {
      const weekday = new Date(date).toLocaleDateString(undefined, {
        weekday: "short",
      });
      const tempMax = forecastData.daily.temperature_2m_max[i];
      dayButtons[i].innerHTML = `${weekday}
        <hr style="border-top:2px solid #3c4353;">${tempMax}°C`;
    }
  });

  // auto-load today (data-day="0")
  renderHourly(0);
});

// Add click handler to all buttons (only once)
document.querySelectorAll(".day").forEach(btn => {
  btn.addEventListener("click", () => {
    // highlight active
    document.querySelectorAll(".day").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const idx = parseInt(btn.dataset.day);
    renderHourly(idx);
  });
});

function renderHourly(dayIndex) {
  if (!forecastData) return;
  const selectedDate = forecastData.daily.time[dayIndex];
  const times = forecastData.hourly.time;
  const temps = forecastData.hourly.temperature_2m;
  const codes = forecastData.hourly.weathercode;

  const forecastDiv = document.getElementById("forecast");
  forecastDiv.innerHTML = "";

  times.forEach((t, i) => {
    if (t.startsWith(selectedDate)) {
      const hour = new Date(t).getHours().toString().padStart(2, "0") + ":00";
      const temp = temps[i];
      const status = mapWeatherCodeToStatus(codes[i]);
      forecastDiv.innerHTML += `<div class="hour-card">
        <h4>${hour}</h4>
        <p>${temp}°C</p>
        <p>${status}</p>
      </div>`;
    }
  });
}

function mapWeatherCodeToStatus(code) {
  const weatherCodes = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    95: "Thunderstorm",
  };
  return weatherCodes[code] || "Unknown";
}
