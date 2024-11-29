var search_place = document.getElementById("search");
var geolocationBtn = document.getElementById("geolocation-btn");

var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var months = ["January", "February", "March", "April", "May", "June", "July","August", "September", "October", "November", "December"];


async function search(loc) {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=374cabdc130843d2b7a161348242006&q=${loc}&days=3`
    );

    if (response.ok) {
      const data = await response.json();
      display_today_data(data.location, data.current);
      display_next_days(data.forecast.forecastday);
    } else {
      throw new Error("Location not found");
    }
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    document.getElementById("weather").innerHTML = `<p class="error">Unable to fetch weather data. Please try again.</p>`;
  }
}


async function searchByGeo(lat, lon) {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=374cabdc130843d2b7a161348242006&q=${lat},${lon}&days=3`
    );

    if (response.ok) {
      const data = await response.json();
      display_today_data(data.location, data.current);
      display_next_days(data.forecast.forecastday);
    } else {
      throw new Error("Unable to fetch weather data for this location.");
    }
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    document.getElementById("weather").innerHTML = `<p class="error">Unable to fetch weather data. Please try again.</p>`;
  }
}

search("Cairo");


search_place.addEventListener("keyup", function (event) {
  search(event.target.value);
});


geolocationBtn.addEventListener("click", function () {
  console.log("Geolocation button clicked");

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      console.log("Geolocation obtained:", lat, lon);
      searchByGeo(lat, lon);
    }, function (error) {
      console.error("Geolocation error:", error);
      alert("Geolocation not supported or permission denied.");
    });
  } else {
    alert("Geolocation is not supported by this browser.");
  }
});


function display_today_data(loc, respond) {
  const lastUpdated = new Date(respond.last_updated);
  const formattedDate = `${days[lastUpdated.getDay()]}, ${
    lastUpdated.getDate()} ${months[lastUpdated.getMonth()]
  }`;

  const cartona = `
    <div class="col-xs-12 col-md-12 col-lg-4">
      <div class="today weather-1">
        <div class="weather-header" id="today">
          <div class="days">${days[lastUpdated.getDay()]}</div>
          <div class="dates">${formattedDate}</div>
        </div>
        <div class="weather-content">
          <p class="loc">${loc.name}</p>
          <div class="degree">
            <div class="num">
              ${respond.temp_c}<sup>°C</sup>
            </div>
            <div class="weather-icon">
              <img src="https:${respond.condition.icon}" alt="weather-icon">
            </div>
          </div>
          <div class="clear">${respond.condition.text}</div>
          <span>
            <img src="images/icon-umberella.png" alt="icon-umberella">
            20%
          </span>
          <span>
            <img src="images/icon-wind.png" alt="icon-wind">
            ${respond.wind_kph} km/h
          </span>
          <span>
            <img src="images/icon-compass.png" alt="icon-compass">
            ${respond.wind_dir}
          </span>
        </div>
      </div>
    </div>
  `;

  document.getElementById("weather").innerHTML = cartona;
}

function display_next_days(forecastday_info) {
  let cartona = "";

  for (let i = 1; i < forecastday_info.length; i++) {
    const forecastDate = new Date(forecastday_info[i].date);
    cartona += `
      <div class="col-xs-12 col-md-12 col-lg-4 column-${i + 1}">
        <div class="weather-${i + 1}">
          <div class="weather-header">
            <div class="days mx-auto">${days[forecastDate.getDay()]}</div>
          </div>
          <div class="weather-content">
            <div class="weather-icon">
              <img src="https:${forecastday_info[i].day.condition.icon}" alt="forecast-icon">
            </div>
            <div class="degree">
              <div class="num">
                ${forecastday_info[i].day.maxtemp_c}<sup>°C</sup>
              </div>
              <small>
                ${forecastday_info[i].day.mintemp_c}<sup>°C</sup>
              </small>
            </div>
            <div class="clear mt-4">
              ${forecastday_info[i].day.condition.text}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  document.getElementById("weather").innerHTML += cartona;
}
