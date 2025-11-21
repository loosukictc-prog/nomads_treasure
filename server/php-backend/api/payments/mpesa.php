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
if (empty($data->phone_number) || empty($data->amount) || empty($data->order_id)) {
    http_response_code(400);
    echo json_encode(['error' => 'Phone number, amount, and order ID are required']);
    exit;
}

// M-Pesa configuration
$consumer_key = 'YOUR_MPESA_CONSUMER_KEY';
$consumer_secret = 'YOUR_MPESA_CONSUMER_SECRET';
$business_short_code = 'YOUR_BUSINESS_SHORT_CODE';
$passkey = 'YOUR_MPESA_PASSKEY';
$callback_url = 'https://yourdomain.com/api/payments/mpesa-callback';

try {
    $database = new Database();
    $db = $database->connect();

    // Generate access token
    $credentials = base64_encode($consumer_key . ':' . $consumer_secret);
    
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials');
    curl_setopt($curl, CURLOPT_HTTPHEADER, ['Authorization: Basic ' . $credentials]);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
    
    $response = curl_exec($curl);
    $token_data = json_decode($response);
    curl_close($curl);

    if (!isset($token_data->access_token)) {
        throw new Exception('Failed to get M-Pesa access token');
    }

    $access_token = $token_data->access_token;

    // Generate timestamp and password
    $timestamp = date('YmdHis');
    $password = base64_encode($business_short_code . $passkey . $timestamp);

    // Format phone number (remove + and ensure it starts with 254)
    $phone = preg_replace('/[^0-9]/', '', $data->phone_number);
    if (substr($phone, 0, 1) === '0') {
        $phone = '254' . substr($phone, 1);
    } elseif (substr($phone, 0, 3) !== '254') {
        $phone = '254' . $phone;
    }

    // Prepare STK Push request
    $stkpush_data = [
        'BusinessShortCode' => $business_short_code,
        'Password' => $password,
        'Timestamp' => $timestamp,
        'TransactionType' => 'CustomerPayBillOnline',
        'Amount' => intval($data->amount),
        'PartyA' => $phone,
        'PartyB' => $business_short_code,
        'PhoneNumber' => $phone,
        'CallBackURL' => $callback_url,
        'AccountReference' => 'NOMAD-' . $data->order_id,
        'TransactionDesc' => 'Nomad Treasures Payment'
    ];

    // Send STK Push request
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest');
    curl_setopt($curl, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $access_token,
        'Content-Type: application/json'
    ]);
    curl_setopt($curl, CURLOPT_POST, true);
    curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($stkpush_data));
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);

    $response = curl_exec($curl);
    $response_data = json_decode($response);
    curl_close($curl);

    // Store payment attempt in database
    $payment_query = "INSERT INTO payments (order_id, payment_method, transaction_id, amount, currency, status, gateway_response) 
                      VALUES (?, 'mpesa', ?, ?, 'KES', 'pending', ?)";
    $stmt = $db->prepare($payment_query);
    $stmt->execute([
        $data->order_id,
        $response_data->CheckoutRequestID ?? null,
        $data->amount,
        json_encode($response_data)
    ]);

    if (isset($response_data->ResponseCode) && $response_data->ResponseCode === '0') {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'STK Push sent successfully. Please check your phone.',
            'checkout_request_id' => $response_data->CheckoutRequestID,
            'merchant_request_id' => $response_data->MerchantRequestID
        ]);
    } else {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => $response_data->errorMessage ?? 'M-Pesa payment failed',
            'response' => $response_data
        ]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
?>
