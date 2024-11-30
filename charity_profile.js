document.addEventListener('DOMContentLoaded', () => {
    const charities = {
        1: {
            name: "Local Food Bank",
            description: "The Local Food Bank provides essential food supplies to individuals and families facing food insecurity.",
            opportunities: ["Food drives", "Distribution events", "Community outreach programs"],
            contact: {
                email: "info@localfoodbank.org",
                phone: "(555) 123-4567"
            },
            image: "local-food-bank-photo.jpg",
            city: "New York" // Ciudad asociada
        },
        2: {
            name: "Community Clothes Drive",
            description: "We distribute clothes to those in need in our local community.",
            opportunities: ["Sorting clothes", "Distribution events", "Fundraising"],
            contact: {
                email: "info@clothesdrive.org",
                phone: "(555) 987-6543"
            },
            image: "clothing-drive.jpg",
            city: "Los Angeles" // Ciudad asociada
        },
        3: {
            name: "Animal Shelter Support",
            description: "Helping abandoned pets find loving homes.",
            opportunities: ["Animal care", "Shelter maintenance", "Adoption events"],
            contact: {
                email: "info@animalshelter.org",
                phone: "(555) 246-8101"
            },
            image: "animal-shelter.jpg",
            city: "Chicago" // Ciudad asociada
        }
    };

    // Obtener ID de la caridad desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const charity = charities[id];

    if (charity) {
        document.querySelector('.charity-name').textContent = charity.name;
        document.querySelector('.description p').textContent = charity.description;
        document.querySelector('.contact-email').textContent = charity.contact.email;
        document.querySelector('.contact-phone').textContent = charity.contact.phone;
        document.querySelector('.charity-image').src = charity.image;

        const opportunitiesList = document.querySelector('.volunteer-opportunities ul');
        opportunitiesList.innerHTML = '';
        charity.opportunities.forEach(opportunity => {
            const li = document.createElement('li');
            li.textContent = opportunity;
            opportunitiesList.appendChild(li);
        });

        // Actualizar el enlace "Volunteer Now"
        document.querySelector('.volunteer-now').href = `contact.html?id=${id}`;

        // Obtener clima para la ciudad asociada
        fetchWeather(charity.city);
    } else {
        document.querySelector('main').innerHTML = "<p>Charity not found.</p>";
    }
});

/**
 * Función para obtener el clima desde OpenWeatherMap
 */
function fetchWeather(city) {
    const apiKey = '65ddabf4c6df8b308001c58f009fa6a8'; 
    const weatherContainer = document.createElement('div');
    weatherContainer.className = 'weather-container';
    document.querySelector('main').appendChild(weatherContainer);

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch weather data');
            }
            return response.json();
        })
        .then(data => {
            const isEmergency = checkEmergencyConditions(data);

            weatherContainer.innerHTML = `
                <h3>Weather in ${data.name}</h3>
                <p><strong>Temperature:</strong> ${data.main.temp} °C</p>
                <p><strong>Condition:</strong> ${data.weather[0].description}</p>
                <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
                <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
                ${isEmergency ? '<p style="color:red; font-weight:bold;">⚠️ Emergency Alert: Severe Weather Conditions!</p>' : ''}
            `;

            if (isEmergency) {
                alert('Emergency Weather Alert: Severe weather conditions detected!');
            }
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            weatherContainer.innerHTML = `<p>Could not retrieve weather data. Please try again later.</p>`;
        });
}

/**
 * Verifica si las condiciones del clima representan una emergencia
 */
function checkEmergencyConditions(data) {
    const severeConditions = ["thunderstorm", "tornado", "hurricane", "extreme", "drizzle", "snow"];
    const condition = data.weather[0].main.toLowerCase();

    return severeConditions.some(sc => condition.includes(sc)) || data.wind.speed > 20 || data.main.temp < -5 || data.main.temp > 40;
}
