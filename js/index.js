/**
 * Get The Respone from Weather API
 * @param {*} url 
 */
function get(url) {
    return new Promise((resolve, reject) => {
        let httpRequest = new XMLHttpRequest();

        httpRequest.open('GET', url);

        httpRequest.onload = function() {
            if (httpRequest.status === 200) {
                // Resolve the promise with the response text
                resolve(httpRequest.response);
            } else {
                // Reject the promise with the status text
                reject(Error(httpRequest.statusText));
            }
        };
  
        // Handle network errors
        httpRequest.onerror = function() {
            reject(Error('Network Error'));
        };
    
        httpRequest.send();
    });
}

/**
 * Push The Content to HTML File
 * @param {*} data 
 */
function successHandler(data) {
    const dataObj = JSON.parse(data);

    const div = `
          <h2 class="top">
          <img
              src="http://openweathermap.org/img/w/${dataObj.weather[0].icon}.png"
              alt="${dataObj.weather[0].description}"
              width="50"
              height="50"
          />${dataObj.name}
          </h2>
          <p>
            <span class="tempF">${tempToF(dataObj.main.temp)}&deg;</span> | 
            ${dataObj.weather[0].description}
          </p>
      `;
    return div;
    // weatherDiv.innerHTML = weatherFragment;
}

/**
 * Handle Error
 * @param {*} status 
 */
function failHandler(status) {
    console.log(status);
}
 
/**
 * Convert The Temparature from Kelvin to Farenheit
 * @param {*} kelvin 
 */
function tempToF(kelvin) {
    return ((kelvin - 273.15) * 1.8 + 32).toFixed(0);
}

/**
 * Bind Data with HTML in Content Loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    const apiKey = 'f97186e5c47899d83a20d9b3f47cc4d1';

    const weatherDiv = document.querySelector('#weather');
  
    const locations = [
        'los+angeles,us',
        'san+francisco,us',
        'lone+pine,us',
        'mariposa,us'
    ];

    const urls = locations.map((location) => {
        return `https://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=${apiKey}`;
    });
  
    // Return All Promise
    Promise.all([get(urls[0]), get(urls[1]), get(urls[2]), get(urls[3])])
        .then((responses) => {
            return responses.map((response) => {
                return successHandler(response);
            });
        })
        .then((literals) => {
            weatherDiv.innerHTML = `<h1>Weather</h1>${literals.join('')}`;
        })
        .catch((status) => {
            failHandler(status);
        })
        .finally(() => {
            weatherDiv.classList.remove('hidden');
        });
});
  