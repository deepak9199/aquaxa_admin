<?php

// You can use either GET or POST method to send the variables
$bookingIds = isset($_REQUEST['booking_ids']) ? $_REQUEST['booking_ids'] : '';
$refNo = isset($_REQUEST['ref_no']) ? $_REQUEST['ref_no'] : '';

if (empty($bookingIds) || empty($refNo)) {
    die("Missing booking_ids or ref_no parameter.");
}

$url = "https://graph.facebook.com/v21.0/580483471820082/messages";
$token = "EAAB0kr0fMXQBO2McBwUYgfILQRiNOxN9ubrbDvQxuZAHZBZBef0F56mk1ADKhU6n78BqzFDEW4KKFgZBxFmB1FLc06YjET8b9a7bEVD9B4W8z828KLO0duGlm52lo3dFHBanRnFUvSdwZAD4BZAOob8RH03DC7HZAIEUmaQaNuwrRkO64F6mfWJspu6u3fO9ipzIzJsLVZAu0biZAdYI7ZCzZBjROTZCooTZAzQFtehZAj5tWNIHml8g8KespZB0dcDN2p9";

$data = [
    "messaging_product" => "whatsapp",
    "recipient_type" => "individual",
    "to" => "917004950075",
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
                        "text" => "https://print.aquaxa.in/aquaxa.php?refno=" . urlencode($refNo)
                    ]
                ]
            ]
        ]
    ]
];

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

if (curl_errno($ch)) {
    echo 'Curl error: ' . curl_error($ch);
} else {
    echo 'Response: ' . $response;
}

curl_close($ch);
