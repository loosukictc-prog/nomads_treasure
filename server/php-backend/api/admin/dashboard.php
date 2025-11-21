<?php
require_once '../../models/Order.php';
require_once '../../models/Product.php';
require_once '../../models/User.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Simple authentication check (in production, implement proper JWT validation)
$headers = getallheaders();
if (!isset($headers['Authorization'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Authorization token required']);
    exit;
}

try {
    $database = new Database();
    $db = $database->connect();

    // Get overall statistics
    $stats_query = "SELECT 
                      (SELECT COUNT(*) FROM users WHERE role = 'customer') as total_customers,
                      (SELECT COUNT(*) FROM users WHERE role = 'supplier') as total_suppliers,
                      (SELECT COUNT(*) FROM products WHERE status = 'active') as total_products,
                      (SELECT COUNT(*) FROM orders) as total_orders,
                      (SELECT SUM(total_amount) FROM orders WHERE payment_status = 'paid') as total_revenue,
                      (SELECT COUNT(*) FROM orders WHERE status = 'pending') as pending_orders,
                      (SELECT COUNT(*) FROM products WHERE status = 'pending') as pending_products";
    
    $stmt = $db->prepare($stats_query);
    $stmt->execute();
    $stats = $stmt->fetch();

    // Get recent orders
    $recent_orders_query = "SELECT o.*, u.first_name, u.last_name, u.email 
                           FROM orders o 
                           LEFT JOIN users u ON o.user_id = u.id 
                           ORDER BY o.created_at DESC 
                           LIMIT 10";
    $stmt = $db->prepare($recent_orders_query);
    $stmt->execute();
    $recent_orders = $stmt->fetchAll();

    // Get top selling products
    $top_products_query = "SELECT p.*, SUM(oi.quantity) as total_sold
                          FROM products p
                          INNER JOIN order_items oi ON p.id = oi.product_id
                          INNER JOIN orders o ON oi.order_id = o.id
                          WHERE o.payment_status = 'paid'
                          GROUP BY p.id
                          ORDER BY total_sold DESC
                          LIMIT 5";
    $stmt = $db->prepare($top_products_query);
    $stmt->execute();
    $top_products = $stmt->fetchAll();

    // Get revenue by month (last 12 months)
    $revenue_query = "SELECT 
                        DATE_FORMAT(created_at, '%Y-%m') as month,
                        SUM(total_amount) as revenue
                      FROM orders 
                      WHERE payment_status = 'paid' 
                        AND created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
                      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
                      ORDER BY month";
    $stmt = $db->prepare($revenue_query);
    $stmt->execute();
    $revenue_data = $stmt->fetchAll();

    // Get orders by status
    $status_query = "SELECT status, COUNT(*) as count FROM orders GROUP BY status";
    $stmt = $db->prepare($status_query);
    $stmt->execute();
    $order_status_data = $stmt->fetchAll();

    http_response_code(200);
    echo json_encode([
        'stats' => [
            'total_customers' => intval($stats['total_customers']),
            'total_suppliers' => intval($stats['total_suppliers']),
            'total_products' => intval($stats['total_products']),
            'total_orders' => intval($stats['total_orders']),
            'total_revenue' => floatval($stats['total_revenue'] ?? 0),
            'pending_orders' => intval($stats['pending_orders']),
            'pending_products' => intval($stats['pending_products'])
        ],
        'recent_orders' => array_map(function($order) {
            return [
                'id' => $order['id'],
                'order_number' => $order['order_number'],
                'customer_name' => $order['first_name'] . ' ' . $order['last_name'],
                'customer_email' => $order['email'],
                'total_amount' => floatval($order['total_amount']),
                'status' => $order['status'],
                'payment_status' => $order['payment_status'],
                'created_at' => $order['created_at']
            ];
        }, $recent_orders),
        'top_products' => array_map(function($product) {
            return [
                'id' => $product['id'],
                'name' => $product['name'],
                'price' => floatval($product['price']),
                'tribe' => $product['tribe'],
                'category' => $product['category'],
                'total_sold' => intval($product['total_sold']),
                'images' => json_decode($product['images'], true) ?: []
            ];
        }, $top_products),
        'revenue_by_month' => array_map(function($data) {
            return [
                'month' => $data['month'],
                'revenue' => floatval($data['revenue'])
            ];
        }, $revenue_data),
        'orders_by_status' => array_map(function($data) {
            return [
                'status' => $data['status'],
                'count' => intval($data['count'])
            ];
        }, $order_status_data)
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
?>
