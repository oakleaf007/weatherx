
async function ip(){
          fetch('https://ipapi.co/json/')
  .then(res => res.json())
  .then(data => {
    const latitude = data.latitude;
    const longitude = data.longitude;
    
  
  });


}



document.getElementById("search-btn").addEventListener("click",async()=>{
    const city = document.getElementById("search-input").value.trim();

    if(!city){
        alert("Enter a City name")
    }

    try{
      
        const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`);
        const geoData = await geoResponse.json();


        if(geoData.results.length === 0){
            alert("city not found");
            return;
        }

        
        const {latitude, longitude, name, country} = geoData.results[0];

        

        
        const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`)
        const weatherData = await weatherResponse.json();




        if(!weatherData.current_weather){
            alert('Weather data not available for this location');
                return;
            
        }
     
        const {temperature, weathercode,windspeed} =weatherData.current_weather;
        const weatherStatus =mapWeatherCodeToStatus(weathercode);
        document.getElementById("msg").textContent="result found!";
        document.getElementById("city").textContent = `${name}, ${country}`;
        document.getElementById("long").textContent=`${longitude.toFixed(4)}`;
        document.getElementById("lat").textContent=`${latitude.toFixed(4)}`;
          document.getElementById("status").textContent=`${weatherStatus}`
        document.getElementById("temp").textContent=`${temperature}`
        document.getElementById("wind").textContent=`${windspeed}`;

  const weatherRes = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,weathercode&hourly=temperature_2m,weathercode&forecast_days=7&timezone=auto`
  );
  forecastData = await weatherRes.json();



  const dayButtons = document.querySelectorAll(".day");
  forecastData.daily.time.forEach((date, i) => {
    if (dayButtons[i]) {
      const weekday = new Date(date).toLocaleDateString(undefined, {
        weekday: "short",
      });
      const tempMax = forecastData.daily.temperature_2m_max[i];
      dayButtons[i].innerHTML = `${weekday}
        <hr style="border-top:2px solid #333;">${tempMax}°C`;
    }
  });

 renderHourly(0);








    } catch (error){
        console.error('Error fetching weather data: ', error);
        document.getElementById("msg").textContent="error: No data found for this location";
        
    }
});



document.querySelectorAll(".day").forEach(btn => {
  btn.addEventListener("click", () => {
    
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
        <span>${hour}</span>
        <hr style="border-top: 2px solid #3c4353;">
        <span>${temp}°C</span>
        <hr style="border-top: 2px solid #3c4353;">
        <span>${status}</span>
      </div>`;
    }
  });
}






function mapWeatherCodeToStatus(code) {
  const weatherCodes = {
    0: 'Clear',
    1: 'clear',
    2: 'cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'fog',
    51: 'drizzle',
    53: 'drizzle',
    55: 'drizzle',
    56: 'drizzle',
    57: 'drizzle',
    61: 'rain',
    63: 'rain',
    65: 'rain',
    66: 'rain',
    67: 'rain',
    71: 'snow',
    73: 'snow',
    75: 'snow',
    77: 'Snow',
    80: 'showers',
    81: 'showers',
    82: 'showers',
    85: 'showers',
    86: 'showers',
    95: 'thunderstorm',
    96: 'Thunderstorm',
    99: 'Thunderstorm'
  };
  return weatherCodes[code] || 'Unknown';
}