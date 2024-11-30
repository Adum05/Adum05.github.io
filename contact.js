document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '65ddabf4c6df8b308001c58f009fa6a8'; 
    const charities = {
        1: { name: "Local Food Bank", location: "New York" },
        2: { name: "Community Clothes Drive", location: "Los Angeles" },
        3: { name: "Animal Shelter Support", location: "Chicago" }
    };

    // Get charity ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    // Set charity name
    const charity = charities[id];
    if (charity) {
        document.querySelector('.charity-name').textContent = charity.name;
        document.querySelector('input[name="charity"]').value = charity.name;

        // Fetch and display weather information
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${charity.location}&appid=${apiKey}&units=metric`)
            .then(response => response.json())
            .then(data => {
                if (data.weather) {
                    const weatherInfo = `
                        <h3>Current Weather in ${charity.location}</h3>
                        <p>Temperature: ${data.main.temp}°C</p>
                        <p>Conditions: ${data.weather[0].description}</p>
                    `;
                    const weatherContainer = document.createElement('div');
                    weatherContainer.innerHTML = weatherInfo;
                    document.querySelector('main').appendChild(weatherContainer);
                } else {
                    console.error('Weather data not available');
                }
            })
            .catch(error => console.error('Error fetching weather data:', error));
    } else {
        document.querySelector('main').innerHTML = "<p>Charity not found.</p>";
    }
});
