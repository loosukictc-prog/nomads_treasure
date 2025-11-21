<?php
class Order {
    private $conn;
    private $table = 'orders';

    public $id;
    public $user_id;
    public $order_number;
    public $total_amount;
    public $currency;
    public $status;
    public $shipping_address;
    public $payment_status;
    public $payment_method;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Create new order
    public function createOrder($items) {
        try {
            $this->conn->beginTransaction();

            // Generate unique order number
            $this->order_number = 'NT' . date('Y') . mt_rand(100000, 999999);
            
            // Create order
            $query = "INSERT INTO " . $this->table . " 
                      SET user_id = :user_id,
                          order_number = :order_number,
                          total_amount = :total_amount,
                          currency = :currency,
                          status = :status,
                          shipping_address = :shipping_address,
                          payment_status = :payment_status,
                          payment_method = :payment_method";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':user_id', $this->user_id);
            $stmt->bindParam(':order_number', $this->order_number);
            $stmt->bindParam(':total_amount', $this->total_amount);
            $stmt->bindParam(':currency', $this->currency);
            $stmt->bindParam(':status', $this->status);
            $stmt->bindParam(':shipping_address', $this->shipping_address);
            $stmt->bindParam(':payment_status', $this->payment_status);
            $stmt->bindParam(':payment_method', $this->payment_method);

            if (!$stmt->execute()) {
                throw new Exception("Failed to create order");
            }

            $this->id = $this->conn->lastInsertId();

            // Add order items
            $item_query = "INSERT INTO order_items 
                          SET order_id = :order_id,
                              product_id = :product_id,
                              supplier_id = :supplier_id,
                              quantity = :quantity,
                              price = :price,
                              total = :total";

            $item_stmt = $this->conn->prepare($item_query);

            foreach ($items as $item) {
                $item_stmt->bindParam(':order_id', $this->id);
                $item_stmt->bindParam(':product_id', $item['product_id']);
                $item_stmt->bindParam(':supplier_id', $item['supplier_id']);
                $item_stmt->bindParam(':quantity', $item['quantity']);
                $item_stmt->bindParam(':price', $item['price']);
                $item_stmt->bindParam(':total', $item['total']);

                if (!$item_stmt->execute()) {
                    throw new Exception("Failed to add order item");
                }

                // Update product stock
                $stock_query = "UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?";
                $stock_stmt = $this->conn->prepare($stock_query);
                $stock_stmt->execute([$item['quantity'], $item['product_id']]);
            }

            $this->conn->commit();
            return true;

        } catch (Exception $e) {
            $this->conn->rollBack();
            return false;
        }
    }

    // Get order by ID
    public function getOrder($order_id, $user_id = null) {
        $query = "SELECT o.*, u.first_name, u.last_name, u.email
                  FROM " . $this->table . " o
                  LEFT JOIN users u ON o.user_id = u.id
                  WHERE o.id = ?";
        
        $params = [$order_id];

        if ($user_id) {
            $query .= " AND o.user_id = ?";
            $params[] = $user_id;
        }

        $stmt = $this->conn->prepare($query);
        $stmt->execute($params);

        if ($stmt->rowCount() > 0) {
            $order = $stmt->fetch();

            // Get order items
            $items_query = "SELECT oi.*, p.name, p.images, p.tribe
                           FROM order_items oi
                           LEFT JOIN products p ON oi.product_id = p.id
                           WHERE oi.order_id = ?";
            
            $items_stmt = $this->conn->prepare($items_query);
            $items_stmt->execute([$order_id]);
            $items = $items_stmt->fetchAll();

            return [
                'id' => $order['id'],
                'order_number' => $order['order_number'],
                'total_amount' => floatval($order['total_amount']),
                'currency' => $order['currency'],
                'status' => $order['status'],
                'shipping_address' => json_decode($order['shipping_address'], true),
                'payment_status' => $order['payment_status'],
                'payment_method' => $order['payment_method'],
                'created_at' => $order['created_at'],
                'customer' => [
                    'first_name' => $order['first_name'],
                    'last_name' => $order['last_name'],
                    'email' => $order['email']
                ],
                'items' => array_map(function($item) {
                    return [
                        'id' => $item['id'],
                        'product_id' => $item['product_id'],
                        'name' => $item['name'],
                        'tribe' => $item['tribe'],
                        'quantity' => intval($item['quantity']),
                        'price' => floatval($item['price']),
                        'total' => floatval($item['total']),
                        'images' => json_decode($item['images'], true) ?: []
                    ];
                }, $items)
            ];
        }

        return null;
    }

    // Get orders by user
    public function getOrdersByUser($user_id, $limit = 10, $offset = 0) {
        $query = "SELECT * FROM " . $this->table . " 
                  WHERE user_id = ? 
                  ORDER BY created_at DESC 
                  LIMIT ?, ?";

        $stmt = $this->conn->prepare($query);
        $stmt->execute([$user_id, $offset, $limit]);

        $orders = [];
        while ($row = $stmt->fetch()) {
            $orders[] = [
                'id' => $row['id'],
                'order_number' => $row['order_number'],
                'total_amount' => floatval($row['total_amount']),
                'currency' => $row['currency'],
                'status' => $row['status'],
                'payment_status' => $row['payment_status'],
                'payment_method' => $row['payment_method'],
                'created_at' => $row['created_at']
            ];
        }

        return $orders;
    }

    // Update order status
    public function updateStatus($order_id, $status) {
        $query = "UPDATE " . $this->table . " SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([$status, $order_id]);
    }

    // Update payment status
    public function updatePaymentStatus($order_id, $payment_status) {
        $query = "UPDATE " . $this->table . " SET payment_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([$payment_status, $order_id]);
    }

    // Get orders by supplier
    public function getOrdersBySupplier($supplier_id, $limit = 10, $offset = 0) {
        $query = "SELECT DISTINCT o.*, u.first_name, u.last_name, u.email
                  FROM " . $this->table . " o
                  INNER JOIN order_items oi ON o.id = oi.order_id
                  LEFT JOIN users u ON o.user_id = u.id
                  WHERE oi.supplier_id = ?
                  ORDER BY o.created_at DESC
                  LIMIT ?, ?";

        $stmt = $this->conn->prepare($query);
        $stmt->execute([$supplier_id, $offset, $limit]);

        $orders = [];
        while ($row = $stmt->fetch()) {
            // Get items for this supplier only
            $items_query = "SELECT oi.*, p.name, p.images, p.tribe
                           FROM order_items oi
                           LEFT JOIN products p ON oi.product_id = p.id
                           WHERE oi.order_id = ? AND oi.supplier_id = ?";
            
            $items_stmt = $this->conn->prepare($items_query);
            $items_stmt->execute([$row['id'], $supplier_id]);
            $items = $items_stmt->fetchAll();

            $orders[] = [
                'id' => $row['id'],
                'order_number' => $row['order_number'],
                'total_amount' => floatval($row['total_amount']),
                'currency' => $row['currency'],
                'status' => $row['status'],
                'payment_status' => $row['payment_status'],
                'created_at' => $row['created_at'],
                'customer' => [
                    'first_name' => $row['first_name'],
                    'last_name' => $row['last_name'],
                    'email' => $row['email']
                ],
                'items' => array_map(function($item) {
                    return [
                        'product_id' => $item['product_id'],
                        'name' => $item['name'],
                        'tribe' => $item['tribe'],
                        'quantity' => intval($item['quantity']),
                        'price' => floatval($item['price']),
                        'total' => floatval($item['total']),
                        'images' => json_decode($item['images'], true) ?: []
                    ];
                }, $items)
            ];
        }

        return $orders;
    }

    // Get order statistics
    public function getOrderStats($supplier_id = null) {
        $base_query = "SELECT 
                          COUNT(*) as total_orders,
                          SUM(total_amount) as total_revenue,
                          AVG(total_amount) as avg_order_value,
                          SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as delivered_orders
                       FROM " . $this->table;

        if ($supplier_id) {
            $query = $base_query . " o INNER JOIN order_items oi ON o.id = oi.order_id WHERE oi.supplier_id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([$supplier_id]);
        } else {
            $stmt = $this->conn->prepare($base_query);
            $stmt->execute();
        }

        return $stmt->fetch();
    }
}
?>
