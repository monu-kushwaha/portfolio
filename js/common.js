$(document).ready(function() {

    getLocation();
    $(document).on('click', '.send-message', function(e) {
        e.preventDefault();
        const form = $('.myFormData');
        const formData = form.serialize();

        // Send the AJAX request
        $.ajax({
            url: "http://developer-monu.000.pe/index.php", // Replace with your server URL
            type: "POST",
            data: formData, // Send the serialized form data
            success: function(response) {
                // Handle success
                $("#response").html(`<p>Response: ${response}</p>`);
            },
            error: function(xhr, status, error) {
                // Handle error
                $("#response").html(`<p>Error: ${error}</p>`);
            },
        });
    });

})

$(document).on('click', '.site-mobile-menu-body .mobile-ipad-location', function() {
    // alert('Button clicked!');
    $('#location-details span').click(); // Trigger click on #location-details
    $('body').removeClass('offcanvas-menu');
});

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                document.getElementById('location').innerText = `Latitude: ${lat}, Longitude: ${lon}`;
                sendLocationToServer(lat, lon);
            },
            function(error) {
                if (error.code === error.PERMISSION_DENIED) {
                    console.log("Location access denied. Using IP-based geolocation.");
                    getIPBasedLocation();
                }
            }
        );
    } else {
        document.getElementById('location').innerText = "Geolocation is not supported by this browser.";
    }
}

function getIPBasedLocation() {
    fetch('http://ip-api.com/json/')
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                const lat = data.lat;
                const lon = data.lon;
                document.getElementById('location').innerText = `Latitude (IP): ${lat}, Longitude (IP): ${lon}`;
                sendLocationToServer(lat, lon);
            } else {
                document.getElementById('location').innerText = "Unable to get location from IP.";
            }
        })
        .catch(error => {
            console.error("Error fetching IP-based location:", error);
            document.getElementById('location').innerText = "Error fetching location.";
        });
}

function sendLocationToServer(lat, lon) {
    fetch('process_location.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ latitude: lat, longitude: lon }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                displayLocationDetails(data.address.raw_data);
            } else {
                console.error('Error:', data.message);
            }
        })
        .catch(error => {
            console.error('Error sending location to server:', error);
        });
}

function displayLocationDetails(address) {
    // Initialize an array to store valid address components
    let addressParts = [];

    // Only add non-empty address components to the array
    if (address.house_number) {
        addressParts.push(address.house_number);
    }
    if (address.road) {
        addressParts.push(address.road);
    }
    if (address.suburb) {
        addressParts.push(address.suburb);
    }
    if (address.town) {
        addressParts.push(address.town);
    }
    if (address.state) {
        addressParts.push(address.state);
    }
    if (address.postcode) {
        addressParts.push(address.postcode);
    }
    if (address.country) {
        addressParts.push(address.country);
    }
    // Concatenate the address parts with commas (no unnecessary commas)
    let conciseAddress = addressParts.join(', ');

    // Truncate address if it exceeds a certain length (e.g., 50 characters)
    let truncatedAddress = conciseAddress.length > 50 ? conciseAddress.substring(0, 50) + '...' : conciseAddress;
    // Update the location details with the clickable, truncated address
    document.getElementById('location-details').innerHTML = `<span style="cursor: pointer;" onclick="showPopup('${address.house_number || ''}', '${address.road || ''}', '${address.suburb || ''}', '${address.town || ''}', '${address.state || ''}', '${address.postcode || ''}', '${address.country || ''}')"><i class="material-icons">location_on</i>${truncatedAddress}</span>`;
}


function showPopup(house_number, road, suburb, town, state, postcode, country) {
    // Initialize an empty string for the content
    let popupContent = "";

    // Only add details to popupContent if the value is available
    if (house_number && house_number !== 'N/A') {
        popupContent += `<strong>House Number:</strong> ${house_number} <br/>`;
    }
    if (road && road !== 'N/A') {
        popupContent += `<strong>Road:</strong> ${road} <br/>`;
    }
    if (suburb && suburb !== 'N/A') {
        popupContent += `<strong>Suburb:</strong> ${suburb} <br/>`;
    }
    if (town && town !== 'N/A') {
        popupContent += `<strong>Town:</strong> ${town} <br/>`;
    }
    if (state && state !== 'N/A') {
        popupContent += `<strong>State:</strong> ${state} <br/>`;
    }
    if (postcode && postcode !== 'N/A') {
        popupContent += `<strong>Postcode:</strong> ${postcode} <br/>`;
    }
    if (country && country !== 'N/A') {
        popupContent += `<strong>Country:</strong> ${country} <br/>`;
    }
    if (popupContent === "") {
        popupContent = "<strong>No location details available.</strong>";
    }

    // Set the popup content
    document.getElementById('popup-content').innerHTML = popupContent;

    // Show the popup
    document.getElementById('popup').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}

function closePopup() {
    // Hide the popup
    document.getElementById('popup').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}