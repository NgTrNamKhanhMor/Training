const apiKey = "15cde25a3d99403a5974870ad9171847";

function getWeatherNow(city, callback) {
    fetchCityCoordinates(city, (lat, lon, country) => {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

        $.get(apiUrl, function(data, status) {
            const weatherNow = {
                temp: data.main.temp,
                location: `${city}, ${country}`,
                iconUrl: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
                time: formatTimestampToHour(data.dt)
            };
            callback(weatherNow);
        });
    });
}

function getWeatherNext5Hours(city, callback) {
    fetchCityCoordinates(city, (lat, lon) => {
        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

        $.get(apiUrl, function(data, status) {
            const next5Hours = [];
            for (let i = 0; i < 5; i++) {
                next5Hours.push({
                    temp: data.list[i].main.temp,
                    iconUrl: `https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png`,
                    time: formatTimestampToHour(data.list[i].dt)
                });
            }
            callback(next5Hours);
        });
    });
}

function getWeatherNext5Days(city, callback) {
    fetchCityCoordinates(city, (lat, lon) => {
        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

        $.get(apiUrl, function(data, status) {
            const next5Days = [];
            let lastDay = '';
            let dayCount = 0;

            for (let i = 0; i < data.list.length; i++) {
                const day = formatTimestampToDay(data.list[i].dt);

                if (day !== lastDay && dayCount < 5) {
                    lastDay = day;
                    dayCount++;
                    next5Days.push({
                        temp: data.list[i].main.temp,
                        time: formatTimestampToHour(data.list[i].dt),
                        iconUrl: `https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png`,
                        day: day,
                    });
                }
            }
            callback(next5Days);
        });
    });
}

function fetchCityCoordinates(city, callback) {
    const cityUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`;
    
    $.get(cityUrl, function(data, status) {
        if (data && data.length > 0) {
            const lat = data[0].lat;
            const lon = data[0].lon;
            const country = data[0].state; 
            callback(lat, lon, country);
        } else {
            console.error('City not found');
        }
    }).fail(function() {
        console.error('Error fetching city coordinates');
    });
}

function formatTimestampToHour(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function formatTimestampToDay(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
}

