<?php
require_once '../../models/Order.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Get posted data
$data = json_decode(file_get_contents("php://input"));

// Validate input
if (empty($data->order_id) || empty($data->amount) || empty($data->currency)) {
    http_response_code(400);
    echo json_encode(['error' => 'Order ID, amount, and currency are required']);
    exit;
}

try {
    $database = new Database();
    $db = $database->connect();

    // Store payment attempt in database
    $payment_query = "INSERT INTO payments (order_id, payment_method, amount, currency, status, gateway_response) 
                      VALUES (?, 'bank_transfer', ?, ?, 'pending', ?)";
    
    $gateway_response = json_encode([
        'bank_name' => 'Equity Bank',
        'paybill' => '247247',
        'account_number' => '0748261019',
        'account_name' => 'Nomad Treasures',
        'reference' => 'ORDER-' . $data->order_id,
        'instructions' => 'Please complete payment using the provided bank details',
        'timestamp' => date('Y-m-d H:i:s')
    ]);

    $stmt = $db->prepare($payment_query);
    $stmt->execute([
        $data->order_id,
        $data->amount,
        $data->currency,
        $gateway_response
    ]);

    // Return bank details for frontend display
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Please complete payment using the bank details provided',
        'bank_details' => [
            'bank_name' => 'Equity Bank',
            'paybill' => '247247',
            'account_number' => '0748261019',
            'account_name' => 'Nomad Treasures',
            'amount' => floatval($data->amount),
            'currency' => $data->currency,
            'reference' => 'ORDER-' . $data->order_id,
            'payment_instructions' => [
                '1. Go to your bank or M-Pesa app',
                '2. Select "Pay Bill" or "Lipa na M-Pesa"',
                '3. Enter Paybill: 247247',
                '4. Enter Account: 0748261019',
                '5. Enter Amount: ' . $data->currency . ' ' . number_format($data->amount, 2),
                '6. Reference: ORDER-' . $data->order_id,
                '7. Complete the transaction',
                '8. Keep your transaction receipt for verification'
            ]
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
?>
