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
if (empty($data->first_name) || empty($data->last_name) || empty($data->email) || empty($data->password)) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

// Validate email format
if (!filter_var($data->email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email format']);
    exit;
}

// Validate password strength
if (strlen($data->password) < 6) {
    http_response_code(400);
    echo json_encode(['error' => 'Password must be at least 6 characters long']);
    exit;
}

try {
    $database = new Database();
    $db = $database->connect();

    $user = new User($db);

    // Check if email already exists
    if ($user->emailExists($data->email)) {
        http_response_code(409);
        echo json_encode(['error' => 'Email already exists']);
        exit;
    }

    // Set user properties
    $user->first_name = $data->first_name;
    $user->last_name = $data->last_name;
    $user->email = $data->email;
    $user->phone = isset($data->phone) ? $data->phone : '';
    $user->password_hash = password_hash($data->password, PASSWORD_BCRYPT);
    $user->role = isset($data->role) && in_array($data->role, ['customer', 'supplier']) ? $data->role : 'customer';

    // Register user
    if ($user->register()) {
        // Generate token
        $token = $user->generateToken();

        // If user is registering as supplier, create supplier record
        if ($user->role === 'supplier' && isset($data->supplier_info)) {
            $supplier_query = "INSERT INTO suppliers (user_id, business_name, tribe, location, description) 
                              VALUES (?, ?, ?, ?, ?)";
            $stmt = $db->prepare($supplier_query);
            $stmt->execute([
                $user->id,
                $data->supplier_info->business_name ?? '',
                $data->supplier_info->tribe ?? '',
                $data->supplier_info->location ?? '',
                $data->supplier_info->description ?? ''
            ]);
        }

        http_response_code(201);
        echo json_encode([
            'message' => 'User registered successfully',
            'user' => [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'role' => $user->role
            ],
            'token' => $token
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Registration failed']);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
?>
