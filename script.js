function getWeather() {
  let city = document.getElementById("cityInput").value.trim();
  if (!city) {
    alert("Please enter a city name");
    return;
  }

  let geoUrl = "https://geocoding-api.open-meteo.com/v1/search?name=" + encodeURIComponent(city);

  fetch(geoUrl)
    .then(res => res.json())
    .then(geoData => {
      if (!geoData.results || geoData.results.length === 0) {
        showError("City not found");
        return;
      }

      let lat = geoData.results[0].latitude;
      let lon = geoData.results[0].longitude;

      let weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`;

      return fetch(weatherUrl);
    })
    .then(res => res ? res.json() : null)
    .then(weatherData => {
      if (!weatherData) return;

      let temp = weatherData.current.temperature_2m;
      let humidity = weatherData.current.relative_humidity_2m;
      let wind = weatherData.current.wind_speed_10m;

      document.getElementById("location").textContent = city;
      document.getElementById("temp").textContent = `${temp}°C`;
      document.getElementById("humidity").textContent = `Humidity: ${humidity}%`;
      document.getElementById("wind").textContent = `Wind Speed: ${wind} m/s`;
    })
    .catch(err => {
      console.error(err);
      showError("Error fetching weather");
    });
}

function showError(message) {
  document.getElementById("location").textContent = message;
  document.getElementById("temp").textContent = "--°C";
  document.getElementById("humidity").textContent = "Humidity: --%";
  document.getElementById("wind").textContent = "Wind Speed: -- m/s";
}
