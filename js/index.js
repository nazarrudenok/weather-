let title = document.querySelector('title');
let locationTitle = document.querySelector('.location__title');
let temp = document.querySelector('.temp');
let statusS = document.querySelector('.status');
let nightTemp = document.querySelector('.night');
let dayTemp = document.querySelector('.day');
let detailed = document.querySelector('.detailed');



if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;

        const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${latitude},${longitude}?unitGroup=metric&key=KG74CYXJXMVQSAQYEQSHYBBMV&contentType=json`;

        const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=2279ecb2e8704d3eb4f71fa0bdbe7461&language=en`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const city = data.results[0].components.city;
                const country = data.results[0].components.country;

                title.innerHTML = `${city}, ${country}`
                locationTitle.innerHTML = `${city}, ${country}`
            })
            .catch(error => console.error("Error fetching data: " + error));

        const xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);

        xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const r = JSON.parse(xhr.responseText);

            temp.innerHTML = `${Math.round(r['currentConditions']['temp'])}°`;
            statusS.innerHTML = `${r['currentConditions']['conditions']}`;
            nightTemp.innerHTML = `${Math.round(r['days'][0]['tempmin'])}°`;
            dayTemp.innerHTML = `${Math.round(r['days'][0]['tempmax'])}`;
            detailed.innerHTML = `${r['days'][0]['description']}`;

        } else if (xhr.readyState === 4 && xhr.status !== 200) {
            console.error('Request failed with status:', xhr.status);
        }
        };

        xhr.send();
    }, function(error) {
        console.error("Error getting geolocation: " + error.message);
    });
} else {
    console.error("Geolocation is not supported by this browser.");
}