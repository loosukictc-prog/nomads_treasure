<?php
class Product {
    private $conn;
    private $table = 'products';

    public $id;
    public $supplier_id;
    public $name;
    public $description;
    public $price;
    public $original_price;
    public $category;
    public $tribe;
    public $stock_quantity;
    public $images;
    public $status;
    public $is_featured;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Get all products with filters
    public function getProducts($filters = []) {
        $where_conditions = ["p.status = 'active'"];
        $params = [];

        // Apply filters
        if (!empty($filters['tribe'])) {
            $tribes = explode(',', $filters['tribe']);
            $placeholders = str_repeat('?,', count($tribes) - 1) . '?';
            $where_conditions[] = "p.tribe IN ($placeholders)";
            $params = array_merge($params, $tribes);
        }

        if (!empty($filters['category'])) {
            $categories = explode(',', $filters['category']);
            $placeholders = str_repeat('?,', count($categories) - 1) . '?';
            $where_conditions[] = "p.category IN ($placeholders)";
            $params = array_merge($params, $categories);
        }

        if (!empty($filters['min_price'])) {
            $where_conditions[] = "p.price >= ?";
            $params[] = $filters['min_price'];
        }

        if (!empty($filters['max_price'])) {
            $where_conditions[] = "p.price <= ?";
            $params[] = $filters['max_price'];
        }

        if (!empty($filters['search'])) {
            $where_conditions[] = "(p.name LIKE ? OR p.description LIKE ?)";
            $search_term = '%' . $filters['search'] . '%';
            $params[] = $search_term;
            $params[] = $search_term;
        }

        $where_clause = implode(' AND ', $where_conditions);

        // Order by
        $order_by = "p.created_at DESC";
        if (!empty($filters['sort'])) {
            switch ($filters['sort']) {
                case 'price_low':
                    $order_by = "p.price ASC";
                    break;
                case 'price_high':
                    $order_by = "p.price DESC";
                    break;
                case 'newest':
                    $order_by = "p.created_at DESC";
                    break;
                case 'featured':
                    $order_by = "p.is_featured DESC, p.created_at DESC";
                    break;
            }
        }

        $query = "SELECT p.*, s.business_name, s.tribe as supplier_tribe,
                         u.first_name as supplier_first_name, u.last_name as supplier_last_name
                  FROM " . $this->table . " p
                  LEFT JOIN suppliers s ON p.supplier_id = s.id
                  LEFT JOIN users u ON s.user_id = u.id
                  WHERE $where_clause
                  ORDER BY $order_by";

        // Add pagination if provided
        if (!empty($filters['limit'])) {
            $offset = !empty($filters['offset']) ? $filters['offset'] : 0;
            $query .= " LIMIT ?, ?";
            $params[] = (int)$offset;
            $params[] = (int)$filters['limit'];
        }

        $stmt = $this->conn->prepare($query);
        $stmt->execute($params);

        $products = [];
        while ($row = $stmt->fetch()) {
            $products[] = [
                'id' => $row['id'],
                'name' => $row['name'],
                'description' => $row['description'],
                'price' => floatval($row['price']),
                'original_price' => $row['original_price'] ? floatval($row['original_price']) : null,
                'category' => $row['category'],
                'tribe' => $row['tribe'],
                'stock_quantity' => intval($row['stock_quantity']),
                'images' => json_decode($row['images'], true) ?: [],
                'is_featured' => boolval($row['is_featured']),
                'supplier' => [
                    'id' => $row['supplier_id'],
                    'business_name' => $row['business_name'],
                    'first_name' => $row['supplier_first_name'],
                    'last_name' => $row['supplier_last_name']
                ],
                'created_at' => $row['created_at']
            ];
        }

        return $products;
    }

    // Get single product
    public function getProduct($id) {
        $query = "SELECT p.*, s.business_name, s.tribe as supplier_tribe, s.description as supplier_description,
                         u.first_name as supplier_first_name, u.last_name as supplier_last_name
                  FROM " . $this->table . " p
                  LEFT JOIN suppliers s ON p.supplier_id = s.id
                  LEFT JOIN users u ON s.user_id = u.id
                  WHERE p.id = ? AND p.status = 'active'";

        $stmt = $this->conn->prepare($query);
        $stmt->execute([$id]);

        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch();
            return [
                'id' => $row['id'],
                'name' => $row['name'],
                'description' => $row['description'],
                'price' => floatval($row['price']),
                'original_price' => $row['original_price'] ? floatval($row['original_price']) : null,
                'category' => $row['category'],
                'tribe' => $row['tribe'],
                'stock_quantity' => intval($row['stock_quantity']),
                'images' => json_decode($row['images'], true) ?: [],
                'is_featured' => boolval($row['is_featured']),
                'supplier' => [
                    'id' => $row['supplier_id'],
                    'business_name' => $row['business_name'],
                    'description' => $row['supplier_description'],
                    'first_name' => $row['supplier_first_name'],
                    'last_name' => $row['supplier_last_name'],
                    'tribe' => $row['supplier_tribe']
                ],
                'created_at' => $row['created_at']
            ];
        }

        return null;
    }

    // Add new product
    public function addProduct() {
        $query = "INSERT INTO " . $this->table . " 
                  SET supplier_id = :supplier_id,
                      name = :name,
                      description = :description,
                      price = :price,
                      original_price = :original_price,
                      category = :category,
                      tribe = :tribe,
                      stock_quantity = :stock_quantity,
                      images = :images,
                      status = :status";

        $stmt = $this->conn->prepare($query);

        // Sanitize input
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->category = htmlspecialchars(strip_tags($this->category));
        $this->tribe = htmlspecialchars(strip_tags($this->tribe));

        $stmt->bindParam(':supplier_id', $this->supplier_id);
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':description', $this->description);
        $stmt->bindParam(':price', $this->price);
        $stmt->bindParam(':original_price', $this->original_price);
        $stmt->bindParam(':category', $this->category);
        $stmt->bindParam(':tribe', $this->tribe);
        $stmt->bindParam(':stock_quantity', $this->stock_quantity);
        $stmt->bindParam(':images', $this->images);
        $stmt->bindParam(':status', $this->status);

        if ($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }

        return false;
    }

    // Update product
    public function updateProduct() {
        $query = "UPDATE " . $this->table . " 
                  SET name = :name,
                      description = :description,
                      price = :price,
                      original_price = :original_price,
                      category = :category,
                      tribe = :tribe,
                      stock_quantity = :stock_quantity,
                      images = :images,
                      status = :status
                  WHERE id = :id AND supplier_id = :supplier_id";

        $stmt = $this->conn->prepare($query);

        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->category = htmlspecialchars(strip_tags($this->category));
        $this->tribe = htmlspecialchars(strip_tags($this->tribe));

        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':description', $this->description);
        $stmt->bindParam(':price', $this->price);
        $stmt->bindParam(':original_price', $this->original_price);
        $stmt->bindParam(':category', $this->category);
        $stmt->bindParam(':tribe', $this->tribe);
        $stmt->bindParam(':stock_quantity', $this->stock_quantity);
        $stmt->bindParam(':images', $this->images);
        $stmt->bindParam(':status', $this->status);
        $stmt->bindParam(':id', $this->id);
        $stmt->bindParam(':supplier_id', $this->supplier_id);

        return $stmt->execute();
    }

    // Get products by supplier
    public function getProductsBySupplier($supplier_id) {
        $query = "SELECT * FROM " . $this->table . " WHERE supplier_id = ? ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$supplier_id]);

        $products = [];
        while ($row = $stmt->fetch()) {
            $products[] = [
                'id' => $row['id'],
                'name' => $row['name'],
                'description' => $row['description'],
                'price' => floatval($row['price']),
                'original_price' => $row['original_price'] ? floatval($row['original_price']) : null,
                'category' => $row['category'],
                'tribe' => $row['tribe'],
                'stock_quantity' => intval($row['stock_quantity']),
                'images' => json_decode($row['images'], true) ?: [],
                'status' => $row['status'],
                'is_featured' => boolval($row['is_featured']),
                'created_at' => $row['created_at']
            ];
        }

        return $products;
    }

    // Update stock quantity
    public function updateStock($product_id, $quantity) {
        $query = "UPDATE " . $this->table . " SET stock_quantity = stock_quantity - ? WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([$quantity, $product_id]);
    }

    // Check if product has sufficient stock
    public function hasStock($product_id, $required_quantity) {
        $query = "SELECT stock_quantity FROM " . $this->table . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$product_id]);
        
        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch();
            return $row['stock_quantity'] >= $required_quantity;
        }
        
        return false;
    }
}
?>
