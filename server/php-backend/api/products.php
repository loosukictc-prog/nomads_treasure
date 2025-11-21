<?php
require_once '../models/Product.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

try {
    $database = new Database();
    $db = $database->connect();

    $product = new Product($db);

    // Get query parameters for filtering
    $filters = [];
    
    if (isset($_GET['tribe']) && !empty($_GET['tribe'])) {
        $filters['tribe'] = $_GET['tribe'];
    }
    
    if (isset($_GET['category']) && !empty($_GET['category'])) {
        $filters['category'] = $_GET['category'];
    }
    
    if (isset($_GET['min_price']) && is_numeric($_GET['min_price'])) {
        $filters['min_price'] = floatval($_GET['min_price']);
    }
    
    if (isset($_GET['max_price']) && is_numeric($_GET['max_price'])) {
        $filters['max_price'] = floatval($_GET['max_price']);
    }
    
    if (isset($_GET['search']) && !empty($_GET['search'])) {
        $filters['search'] = $_GET['search'];
    }
    
    if (isset($_GET['sort']) && !empty($_GET['sort'])) {
        $filters['sort'] = $_GET['sort'];
    }
    
    if (isset($_GET['limit']) && is_numeric($_GET['limit'])) {
        $filters['limit'] = intval($_GET['limit']);
    }
    
    if (isset($_GET['offset']) && is_numeric($_GET['offset'])) {
        $filters['offset'] = intval($_GET['offset']);
    }

    // Get products
    $products = $product->getProducts($filters);

    // Get total count for pagination
    $count_query = "SELECT COUNT(*) as total FROM products WHERE status = 'active'";
    $count_stmt = $db->prepare($count_query);
    $count_stmt->execute();
    $total_count = $count_stmt->fetch()['total'];

    http_response_code(200);
    echo json_encode([
        'products' => $products,
        'total_count' => intval($total_count),
        'filters_applied' => $filters
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
?>
