<?php
require_once '../../models/User.php';

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
        // Check if user has admin role
        if ($user->role !== 'admin') {
            http_response_code(403);
            echo json_encode(['error' => 'Access denied. Admin privileges required.']);
            exit;
        }

        // Generate admin token with extended expiry
        $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
        $payload = json_encode([
            'user_id' => $user->id,
            'email' => $user->email,
            'role' => $user->role,
            'is_admin' => true,
            'exp' => time() + (7 * 24 * 60 * 60) // 7 days for admin sessions
        ]);

        $headerEncoded = base64url_encode($header);
        $payloadEncoded = base64url_encode($payload);
        
        $signature = hash_hmac('sha256', $headerEncoded . '.' . $payloadEncoded, 'nomad_treasures_admin_secret', true);
        $signatureEncoded = base64url_encode($signature);

        $admin_token = $headerEncoded . '.' . $payloadEncoded . '.' . $signatureEncoded;

        // Log admin login
        $log_query = "INSERT INTO admin_logs (user_id, action, ip_address, user_agent, created_at) 
                      VALUES (?, 'admin_login', ?, ?, NOW())";
        
        // Create admin_logs table if it doesn't exist
        $create_logs_table = "CREATE TABLE IF NOT EXISTS admin_logs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            action VARCHAR(100) NOT NULL,
            details TEXT,
            ip_address VARCHAR(45),
            user_agent TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )";
        $db->exec($create_logs_table);

        $log_stmt = $db->prepare($log_query);
        $log_stmt->execute([
            $user->id,
            $_SERVER['REMOTE_ADDR'] ?? 'unknown',
            $_SERVER['HTTP_USER_AGENT'] ?? 'unknown'
        ]);

        http_response_code(200);
        echo json_encode([
            'message' => 'Admin login successful',
            'user' => [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'role' => $user->role,
                'status' => $user->status
            ],
            'token' => $admin_token,
            'expires_in' => 7 * 24 * 60 * 60, // 7 days in seconds
            'permissions' => [
                'manage_users',
                'manage_products', 
                'manage_orders',
                'manage_suppliers',
                'view_analytics',
                'system_settings'
            ]
        ]);
    } else {
        // Log failed login attempt
        $fail_log = "INSERT INTO admin_logs (user_id, action, details, ip_address, user_agent, created_at) 
                     VALUES (0, 'admin_login_failed', ?, ?, ?, NOW())";
        $fail_stmt = $db->prepare($fail_log);
        $fail_stmt->execute([
            'Failed login attempt for email: ' . $data->email,
            $_SERVER['REMOTE_ADDR'] ?? 'unknown',
            $_SERVER['HTTP_USER_AGENT'] ?? 'unknown'
        ]);

        http_response_code(401);
        echo json_encode(['error' => 'Invalid admin credentials']);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}

function base64url_encode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}
?>
