<?php
require_once '../models/User.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Get posted data
$data = json_decode(file_get_contents("php://input"));

// Validate input
if (empty($data->email) || empty($data->password)) {
    http_response_code(400);
    echo json_encode(['error' => 'Email and password are required']);
    exit;
}

try {
    $database = new Database();
    $db = $database->connect();

    $user = new User($db);

    // Attempt login
    if ($user->login($data->email, $data->password)) {
        // Generate token
        $token = $user->generateToken();

        // Get supplier info if user is a supplier
        $supplier_info = null;
        if ($user->role === 'supplier') {
            $supplier_query = "SELECT * FROM suppliers WHERE user_id = ?";
            $stmt = $db->prepare($supplier_query);
            $stmt->execute([$user->id]);
            $supplier_info = $stmt->fetch();
        }

        http_response_code(200);
        echo json_encode([
            'message' => 'Login successful',
            'user' => [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => $user->role,
                'status' => $user->status
            ],
            'supplier_info' => $supplier_info,
            'token' => $token
        ]);
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid credentials']);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
?>
