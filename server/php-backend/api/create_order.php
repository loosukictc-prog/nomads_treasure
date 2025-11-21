<?php
require_once '../models/Order.php';
require_once '../models/Product.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Get posted data
$data = json_decode(file_get_contents("php://input"));

// Validate required fields
if (empty($data->user_id) || empty($data->items) || empty($data->shipping_address) || empty($data->payment_method)) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

// Validate shipping address
$required_address_fields = ['first_name', 'last_name', 'email', 'phone', 'address', 'city', 'country'];
foreach ($required_address_fields as $field) {
    if (empty($data->shipping_address->$field)) {
        http_response_code(400);
        echo json_encode(['error' => "Missing shipping address field: $field"]);
        exit;
    }
}

try {
    $database = new Database();
    $db = $database->connect();

    $order = new Order($db);
    $product = new Product($db);

    // Validate and calculate order total
    $total_amount = 0;
    $order_items = [];

    foreach ($data->items as $item) {
        if (empty($item->product_id) || empty($item->quantity)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid item data']);
            exit;
        }

        // Get product details
        $product_data = $product->getProduct($item->product_id);
        if (!$product_data) {
            http_response_code(404);
            echo json_encode(['error' => "Product not found: {$item->product_id}"]);
            exit;
        }

        // Check stock availability
        if (!$product->hasStock($item->product_id, $item->quantity)) {
            http_response_code(400);
            echo json_encode(['error' => "Insufficient stock for product: {$product_data['name']}"]);
            exit;
        }

        $item_total = $product_data['price'] * $item->quantity;
        $total_amount += $item_total;

        $order_items[] = [
            'product_id' => $item->product_id,
            'supplier_id' => $product_data['supplier']['id'],
            'quantity' => $item->quantity,
            'price' => $product_data['price'],
            'total' => $item_total
        ];
    }

    // Add shipping cost if applicable
    $shipping_cost = $total_amount < 100 ? 15 : 0;
    $tax = $total_amount * 0.08;
    $final_total = $total_amount + $shipping_cost + $tax;

    // Set order properties
    $order->user_id = $data->user_id;
    $order->total_amount = $final_total;
    $order->currency = isset($data->currency) ? $data->currency : 'USD';
    $order->status = 'pending';
    $order->shipping_address = json_encode($data->shipping_address);
    $order->payment_status = 'pending';
    $order->payment_method = $data->payment_method;

    // Create order
    if ($order->createOrder($order_items)) {
        // Get complete order details
        $complete_order = $order->getOrder($order->id);

        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Order created successfully',
            'order' => $complete_order,
            'breakdown' => [
                'subtotal' => $total_amount,
                'shipping' => $shipping_cost,
                'tax' => $tax,
                'total' => $final_total
            ]
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to create order']);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
?>
