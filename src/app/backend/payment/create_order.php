<?php
header("Access-Control-Allow-Origin: *"); // Or set your specific origin
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
$key_id = 'rzp_test_Zh7oxA1PbVUnmk';
$key_secret = 'U3xxaqsDzzEvyYM4MuLOnV1v';

// 1. Receive input
$data = json_decode(file_get_contents('php://input'), true);
$amount = isset($data['amount']) ? intval($data['amount']) * 100 : 0;

if ($amount <= 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid amount']);
    exit;
}

// 2. Create Order on Razorpay
$receipt = "rcpt_" . rand(1000, 99999);
$orderData = [
    "amount" => $amount,
    "currency" => "INR",
    "receipt" => $receipt,
    "payment_capture" => 1
];

$ch = curl_init('https://api.razorpay.com/v1/orders');
curl_setopt($ch, CURLOPT_USERPWD, $key_id . ':' . $key_secret);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($orderData));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
$response = curl_exec($ch);
curl_close($ch);

$order = json_decode($response, true);

// 3. Save to database
$conn = new mysqli("localhost", "aquaxypk_root", "!!@@##Aqua@123", "aquaxypk_aquaxa");
if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'DB connection failed']));
}

$createTable = "
CREATE TABLE IF NOT EXISTS razorpay_orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    razorpay_order_id VARCHAR(255),
    receipt_id VARCHAR(255),
    amount INT,
    currency VARCHAR(10),
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";
$conn->query($createTable);

$stmt = $conn->prepare("INSERT INTO razorpay_orders (razorpay_order_id, receipt_id, amount, currency, status) VALUES (?, ?, ?, ?, ?)");
$status = $order['status'] ?? 'created';
$stmt->bind_param("ssiss", $order['id'], $receipt, $order['amount'], $order['currency'], $status);
$stmt->execute();

echo json_encode($order);
