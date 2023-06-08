window.addEventListener("load",function() {


    fetch("http://localhost:8000/flights")
        .then(response => response.json())
            .then(data => {
                // Handle the API response
                console.log(data);

            // Process and display flight data
            const flightData = data.flights;
            const container = document.getElementById('flight-container');

            flightData.forEach(flight => {
                const flightElement = document.createElement('div');
                flightElement.classList.add('flight');

                const identElement = document.createElement('p');
                identElement.textContent = `Flight ID: ${flight.ident}`;
                flightElement.appendChild(identElement);

                const originElement = document.createElement('p');
                originElement.textContent = `Origin: ${flight.origin.name}, ${flight.origin.city}`;
                flightElement.appendChild(originElement);

                // Create and append other elements for destination, actual_off, etc.

                container.appendChild(flightElement);
            });
        })
        .catch(error => {
            // Handle any errors
            console.error(error);
        });

})