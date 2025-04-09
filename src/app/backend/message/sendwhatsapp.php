<?php
// Allow CORS (optional, for development only)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Authorization, Content-Type");

// Accept parameters via GET or POST
$bookingIds = isset($_REQUEST['booking_ids']) ? $_REQUEST['booking_ids'] : '';
$refNo = isset($_REQUEST['ref_no']) ? $_REQUEST['ref_no'] : '';
$PhoneNo = isset($_REQUEST['PhoneNo']) ? $_REQUEST['PhoneNo'] : '';

// Validate required inputs
if (empty($bookingIds) || empty($refNo)) {
    header('Content-Type: application/json');
    echo json_encode([
        "success" => false,
        "message" => "Missing booking_ids or ref_no parameter."
    ]);
    exit;
}

// WhatsApp API URL and token
$url = "https://graph.facebook.com/v21.0/580483471820082/messages";
$token = "EAAB0kr0fMXQBO2McBwUYgfILQRiNOxN9ubrbDvQxuZAHZBZBef0F56mk1ADKhU6n78BqzFDEW4KKFgZBxFmB1FLc06YjET8b9a7bEVD9B4W8z828KLO0duGlm52lo3dFHBanRnFUvSdwZAD4BZAOob8RH03DC7HZAIEUmaQaNuwrRkO64F6mfWJspu6u3fO9ipzIzJsLVZAu0biZAdYI7ZCzZBjROTZCooTZAzQFtehZAj5tWNIHml8g8KespZB0dcDN2p9";

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

// Headers for WhatsApp API
$headers = [
    "Authorization: Bearer $token",
    "Content-Type: application/json"
];

// Make CURL request
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$curlError = curl_error($ch);
curl_close($ch);

// Return proper JSON response to frontend
header('Content-Type: application/json');

if ($curlError) {
    echo json_encode([
        "success" => false,
        "error" => $curlError
    ]);
} else {
    echo $response; // response is already JSON from WhatsApp
}
