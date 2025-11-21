<?php
// Admin setup script - Run this once to create the initial admin user
require_once 'config/db.php';

try {
    $database = new Database();
    $db = $database->connect();

    // Check if admin user already exists
    $check_query = "SELECT id FROM users WHERE email = 'admin@nomadtreasures.com' AND role = 'admin'";
    $check_stmt = $db->prepare($check_query);
    $check_stmt->execute();

    if ($check_stmt->rowCount() > 0) {
        echo "Admin user already exists!\n";
        exit;
    }

    // Create admin user
    $admin_data = [
        'first_name' => 'Super',
        'last_name' => 'Admin',
        'email' => 'admin@nomadtreasures.com',
        'phone' => '+254700123456',
        'password_hash' => password_hash('admin123', PASSWORD_BCRYPT), // Change this password!
        'role' => 'admin',
        'status' => 'active'
    ];

    $insert_query = "INSERT INTO users (first_name, last_name, email, phone, password_hash, role, status) 
                     VALUES (:first_name, :last_name, :email, :phone, :password_hash, :role, :status)";
    
    $stmt = $db->prepare($insert_query);
    $stmt->bindParam(':first_name', $admin_data['first_name']);
    $stmt->bindParam(':last_name', $admin_data['last_name']);
    $stmt->bindParam(':email', $admin_data['email']);
    $stmt->bindParam(':phone', $admin_data['phone']);
    $stmt->bindParam(':password_hash', $admin_data['password_hash']);
    $stmt->bindParam(':role', $admin_data['role']);
    $stmt->bindParam(':status', $admin_data['status']);

    if ($stmt->execute()) {
        echo "✅ Admin user created successfully!\n";
        echo "📧 Email: admin@nomadtreasures.com\n";
        echo "🔑 Password: admin123\n";
        echo "⚠️  IMPORTANT: Change the password after first login!\n";
        echo "\n";
        echo "🌐 Admin Login URL: http://your-domain.com/admin/login\n";
    } else {
        echo "❌ Failed to create admin user\n";
    }

    // Also create some sample data for testing
    echo "\n--- Creating sample data ---\n";

    // Sample suppliers
    $suppliers_data = [
        [
            'first_name' => 'Maria', 
            'last_name' => 'Lokwang',
            'email' => 'maria@turkana.co.ke',
            'password_hash' => password_hash('supplier123', PASSWORD_BCRYPT),
            'role' => 'supplier',
            'business_name' => 'Turkana Heritage Crafts',
            'tribe' => 'Turkana',
            'location' => 'Lodwar, Kenya'
        ],
        [
            'first_name' => 'John',
            'last_name' => 'Sankale',
            'email' => 'john@maasai.co.ke', 
            'password_hash' => password_hash('supplier123', PASSWORD_BCRYPT),
            'role' => 'supplier',
            'business_name' => 'Maasai Beadwork Collective',
            'tribe' => 'Maasai',
            'location' => 'Kajiado, Kenya'
        ]
    ];

    foreach ($suppliers_data as $supplier) {
        // Create user account
        $user_query = "INSERT INTO users (first_name, last_name, email, password_hash, role) 
                       VALUES (?, ?, ?, ?, ?)";
        $user_stmt = $db->prepare($user_query);
        $user_stmt->execute([
            $supplier['first_name'],
            $supplier['last_name'], 
            $supplier['email'],
            $supplier['password_hash'],
            $supplier['role']
        ]);
        
        $user_id = $db->lastInsertId();

        // Create supplier profile
        $supplier_query = "INSERT INTO suppliers (user_id, business_name, tribe, location, verification_status) 
                          VALUES (?, ?, ?, ?, 'verified')";
        $supplier_stmt = $db->prepare($supplier_query);
        $supplier_stmt->execute([
            $user_id,
            $supplier['business_name'],
            $supplier['tribe'],
            $supplier['location']
        ]);

        echo "✅ Created supplier: {$supplier['business_name']}\n";
    }

    // Sample products
    $products_data = [
        [
            'supplier_id' => 1,
            'name' => 'Traditional Maasai Beaded Necklace',
            'description' => 'Handcrafted beaded necklace with traditional Maasai colors and patterns. Each bead is carefully selected and represents cultural significance.',
            'price' => 89.00,
            'original_price' => 120.00,
            'category' => 'Jewelry',
            'tribe' => 'Maasai',
            'stock_quantity' => 15,
            'images' => json_encode(['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80']),
            'status' => 'active',
            'is_featured' => true
        ],
        [
            'supplier_id' => 2,
            'name' => 'Turkana Woven Basket',
            'description' => 'Traditional sisal basket woven by Turkana artisans. Perfect for storage or as decorative piece.',
            'price' => 156.00,
            'category' => 'Baskets',
            'tribe' => 'Turkana',
            'stock_quantity' => 8,
            'images' => json_encode(['https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80']),
            'status' => 'active',
            'is_featured' => true
        ]
    ];

    foreach ($products_data as $product) {
        $product_query = "INSERT INTO products (supplier_id, name, description, price, original_price, category, tribe, stock_quantity, images, status, is_featured) 
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $product_stmt = $db->prepare($product_query);
        $product_stmt->execute([
            $product['supplier_id'],
            $product['name'],
            $product['description'],
            $product['price'],
            $product['original_price'] ?? null,
            $product['category'],
            $product['tribe'],
            $product['stock_quantity'],
            $product['images'],
            $product['status'],
            $product['is_featured']
        ]);

        echo "✅ Created product: {$product['name']}\n";
    }

    echo "\n🎉 Setup completed successfully!\n";
    echo "🔗 Access admin panel: /admin/login\n";
    echo "📧 Admin Email: admin@nomadtreasures.com\n";
    echo "🔑 Admin Password: admin123\n";

} catch (Exception $e) {
    echo "❌ Error during setup: " . $e->getMessage() . "\n";
}
?>
