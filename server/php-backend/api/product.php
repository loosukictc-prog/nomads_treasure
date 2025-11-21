<?php
require_once '../models/Product.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Validate product ID
if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Valid product ID is required']);
    exit;
}

try {
    $database = new Database();
    $db = $database->connect();

    $productModel = new Product($db);
    $product = $productModel->getProduct($_GET['id']);

    if ($product) {
        http_response_code(200);
        echo json_encode(['product' => $product]);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Product not found']);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
?>
