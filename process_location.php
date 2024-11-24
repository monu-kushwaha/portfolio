<?php
header("Content-Type: application/json");
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (isset($data['latitude']) && isset($data['longitude'])) {
    $latitude = $data['latitude'];
    $longitude = $data['longitude'];

    // Fetch location details using Google Geocoding API
    $locationDetails = getLocationDetails($latitude, $longitude);
    if ($locationDetails['status'] == 'success') {
        $response = [
            "status" => "success",
            "latitude" => $latitude,
            "longitude" => $longitude,
            "address" => $locationDetails // Add address from API response
        ];
    } else {
        $response = [
            "status" => "error",
            "message" => $locationDetails['message'] // Error message from API
        ];
    }

    echo json_encode($response);
} else {
    $response = [
        "status" => "error",
        "message" => "Invalid location data"
    ];
    echo json_encode($response);
}

function getLocationDetails($latitude, $longitude) {
    $url = "https://nominatim.openstreetmap.org/reverse?format=json&lat=$latitude&lon=$longitude";
    
    // Create a stream context with the necessary headers
    $options = [
        "http" => [
            "header" => "User-Agent: MyAppName/1.0 (contact@example.com)\r\n"
        ]
    ];
    $context = stream_context_create($options);
    
    // Make the API request
    $response = file_get_contents($url, false, $context);
    
    if ($response === FALSE) {
        return [
            "status" => "error",
            "message" => "Unable to fetch location details"
        ];
    }

    $data = json_decode($response, true);
    if (isset($data['address'])) {
        $address = $data['address'];
        return [
            "status" => "success",
            "raw_data" => $address 
        ];
    } else {
        return [
            "status" => "error",
            "message" => "Unable to fetch location details"
        ];
    }
}


?>
