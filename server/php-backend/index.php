<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'config/db.php';
require_once 'config/cors.php';

// Simple router
$request = $_SERVER['REQUEST_URI'];
$path = parse_url($request, PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// Remove base path if needed
$path = str_replace('/server/php-backend', '', $path);

// Route API endpoints
switch (true) {
    // Authentication routes
    case $path === '/api/register' && $method === 'POST':
        require 'api/register.php';
        break;
    case $path === '/api/login' && $method === 'POST':
        require 'api/login.php';
        break;
    case $path === '/api/logout' && $method === 'POST':
        require 'api/logout.php';
        break;
    
    // Product routes
    case $path === '/api/products' && $method === 'GET':
        require 'api/products.php';
        break;
    case preg_match('/^\/api\/product\/(\d+)$/', $path, $matches) && $method === 'GET':
        $_GET['id'] = $matches[1];
        require 'api/product.php';
        break;
    
    // Cart routes
    case $path === '/api/cart' && $method === 'POST':
        require 'api/cart.php';
        break;
    case $path === '/api/cart' && $method === 'GET':
        require 'api/get_cart.php';
        break;
    
    // Order routes
    case $path === '/api/order' && $method === 'POST':
        require 'api/create_order.php';
        break;
    case $path === '/api/orders' && $method === 'GET':
        require 'api/get_orders.php';
        break;
    
    // Payment routes
    case $path === '/api/payments/mpesa' && $method === 'POST':
        require 'api/payments/mpesa.php';
        break;
    case $path === '/api/payments/paypal' && $method === 'POST':
        require 'api/payments/paypal.php';
        break;
    
    // Admin routes
    case $path === '/api/admin/dashboard' && $method === 'GET':
        require 'api/admin/dashboard.php';
        break;
    case $path === '/api/admin/products' && $method === 'POST':
        require 'api/admin/manage_products.php';
        break;
    
    // Supplier routes
    case $path === '/api/supplier/dashboard' && $method === 'GET':
        require 'api/supplier/dashboard.php';
        break;
    case $path === '/api/supplier/products' && $method === 'POST':
        require 'api/supplier/add_product.php';
        break;
    
    // Contact form
    case $path === '/api/contact' && $method === 'POST':
        require 'api/contact.php';
        break;
    
    default:
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint not found']);
        break;
}
?>
