<?php

// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Fetch query parameters from the request
$stype = isset($_GET['stype']) ? $_GET['stype'] : 'GENERATECOUPON';
$dbase = isset($_GET['dbase']) ? $_GET['dbase'] : 'AQUAXA2425';
$intval = isset($_GET['intval']) ? $_GET['intval'] : '';
$refno = isset($_GET['refno']) ? $_GET['refno'] : '';
$item_code = isset($_GET['item_code']) ? $_GET['item_code'] : '';
$id = isset($_GET['id']) ? $_GET['id'] : '';
$phone = isset($_GET['phone']) ? $_GET['phone'] : '';
$agent = isset($_GET['agent']) ? $_GET['agent'] : '';

// Base API URL
$base_url = "https://aquaxa.tensoftware.in/api/customer";

// Build query parameters dynamically
$params = [
    'stype' => $stype,
    'dbase' => $dbase,
    'intval' => $intval,
    'refno' => $refno,
    'item_code' => $item_code,
    'id' => $id,
    'phone' => $phone,
    'agent' => $agent
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
