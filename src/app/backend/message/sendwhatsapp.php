<?php
// Allow CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Authorization, Content-Type");

// Accept parameters
$bookingIds = isset($_REQUEST['booking_ids']) ? $_REQUEST['booking_ids'] : '';
$refNo = isset($_REQUEST['ref_no']) ? $_REQUEST['ref_no'] : '';
$PhoneNo = isset($_REQUEST['PhoneNo']) ? $_REQUEST['PhoneNo'] : '';
$timestamp = isset($_REQUEST['timestamp']) ? $_REQUEST['timestamp'] : '';

// Validate required inputs
if (empty($bookingIds) || empty($refNo) || empty($PhoneNo) || empty($timestamp)) {
    header('Content-Type: application/json');
    echo json_encode([
        "success" => false,
        "message" => "Missing booking_ids, ref_no, PhoneNo, or timestamp parameter."
    ]);
    exit;
}

// === Prevent duplicate based on PhoneNo and timestamp ===
$cacheKey = md5($PhoneNo . $timestamp);
$cacheFile = __DIR__ . "/.sent_cache_$cacheKey.txt";

if (file_exists($cacheFile)) {
    echo json_encode([
        "success" => false,
        "message" => "Duplicate message ignored for this timestamp and phone number."
    ]);
    exit;
}

// Mark as sent
file_put_contents($cacheFile, time());

// WhatsApp API details
$url = "https://graph.facebook.com/v21.0/580483471820082/messages";
$token = "EAAB0kr0fMXQBO2McBwUYgfILQRiNOxN9ubrbDvQxuZAHZBZBef0F56mk1ADKhU6n78BqzFDEW4KKFgZBxFmB1FLc06YjET8b9a7bEVD9B4W8z828KLO0duGlm52lo3dFHBanRnFUvSdwZAD4BZAOob8RH03DC7HZAIEUmaQaNuwrRkO64F6mfWJspu6u3fO9ipzIzJsLVZAu0biZAdYI7ZCzZBjROTZCooTZAzQFtehZAj5tWNIHml8g8KespZB0dcDN2p9"; // Replace with actual token

// Prepare data
$data = [
    "messaging_product" => "whatsapp",
    "recipient_type" => "individual",
    "to" => "91" . $PhoneNo,
    "type" => "template",
    "template" => [
        "name" => "bookingconfirm",
        "language" => [
            "policy" => "deterministic",
            "code" => "en"
        ],
        "components" => [
            [
                "type" => "body",
                "parameters" => [
                    [
                        "type" => "text",
                        "text" => $bookingIds
                    ]
                ]
            ],
            [
                "type" => "button",
                "sub_type" => "url",
                "index" => "0",
                "parameters" => [
                    [
                        "type" => "text",
                        "text" => "?refno=" . urlencode($refNo)
                    ]
                ]
            ]
        ]
    ]
];

// Send WhatsApp message
$headers = [
    "Authorization: Bearer $token",
    "Content-Type: application/json"
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$curlError = curl_error($ch);
curl_close($ch);

// Return result
header('Content-Type: application/json');

if ($curlError) {
    echo json_encode([
        "success" => false,
        "error" => $curlError
    ]);
} else {
    echo $response;
}
