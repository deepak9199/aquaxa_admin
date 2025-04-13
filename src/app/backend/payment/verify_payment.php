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

$conn = new mysqli("localhost", "aquaxypk_root", "!!@@##Aqua@123", "aquaxypk_aquaxa");
if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'DB connection failed']));
}
// ... existing headers

// Create table if not exists
$createTableSQL = "
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    razorpay_payment_id VARCHAR(255),
    razorpay_order_id VARCHAR(255),
    amount INT,
    currency VARCHAR(10),
    name VARCHAR(255),
    email VARCHAR(255),
    contact VARCHAR(20),
    status VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";
$conn->query($createTableSQL);

// Receive Razorpay response
$data = json_decode(file_get_contents("php://input"), true);
$razorpay_order_id = $data['razorpay_order_id'];
$razorpay_payment_id = $data['razorpay_payment_id'];
$razorpay_signature = $data['razorpay_signature'];

$name = $data['name'] ?? '';
$email = $data['email'] ?? '';
$contact = $data['phone'] ?? '';

// Verify signature
$generated_signature = hash_hmac('sha256', $razorpay_order_id . "|" . $razorpay_payment_id, $key_secret);

if ($generated_signature === $razorpay_signature) {
    // Fetch payment details
    $ch = curl_init("https://api.razorpay.com/v1/payments/$razorpay_payment_id");
    curl_setopt($ch, CURLOPT_USERPWD, $key_id . ':' . $key_secret);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    curl_close($ch);

    $payment = json_decode($response, true);
    $amount = $payment['amount'];
    $currency = $payment['currency'];
    $status = $payment['status'];

    $stmt = $conn->prepare("INSERT INTO payments (razorpay_payment_id, razorpay_order_id, amount, currency, name, email, contact, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssisssss", $razorpay_payment_id, $razorpay_order_id, $amount, $currency, $name, $email, $contact, $status);
    $stmt->execute();

    echo json_encode(["success" => true, "message" => "Payment verified and saved."]);
} else {
    echo json_encode(["success" => false, "message" => "Signature mismatch!"]);
}
