<?php

// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// API Base URL
$base_url = "https://aquaxa.tensoftware.in/api/clientinfo";

// Fetch query parameters from the request
$stype = isset($_GET['stype']) ? $_GET['stype'] : 'USERDETAIL';
$dbase = isset($_GET['dbase']) ? $_GET['dbase'] : 'aquaxa2425';
$uname = isset($_GET['uname']) ? $_GET['uname'] : '';

// Build query parameters dynamically
$params = [
    'stype' => $stype,
    'dbase' => $dbase,
    'uname' => $uname
];

// Build full URL with query parameters
$url = $base_url . '?' . http_build_query($params);

// Initialize cURL session
$ch = curl_init();

// Set cURL options
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Disable SSL verification if needed
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json'
]);

// Execute cURL session
$response = curl_exec($ch);

// Check for errors
if (curl_errno($ch)) {
    echo 'cURL error: ' . curl_error($ch);
} else {
    // Decode JSON response
    $data = json_decode($response, true);
    
    // Return JSON response
    header('Content-Type: application/json');
    echo json_encode($data, JSON_PRETTY_PRINT);
}

// Close cURL session
curl_close($ch);

?>