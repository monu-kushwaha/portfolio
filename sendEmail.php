<?php
// Allow access from any origin
header("Access-Control-Allow-Origin: *");

// Allow specific HTTP methods
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

// Allow specific headers
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight (OPTIONS) requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Function and logic go here
function sendEmail() {
    die('Email function called successfully.');
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    sendEmail();
}
?>
