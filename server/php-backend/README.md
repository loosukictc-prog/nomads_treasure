# Nomad Treasures PHP Backend API

A comprehensive backend API for the Nomad Treasures eCommerce platform, built with PHP and MySQL.

## 🚀 Features

- **User Authentication**: Registration, login, JWT tokens
- **Product Management**: CRUD operations with filtering and search
- **Order Processing**: Complete order lifecycle management
- **Payment Integration**: M-Pesa and PayPal support
- **Role-based Access**: Customer, Supplier, and Admin roles
- **Drop-shipping Support**: Supplier-specific order management
- **Security**: SQL injection prevention, CSRF protection, input sanitization

## 📋 Requirements

- PHP 7.4 or higher
- MySQL 5.7 or higher
- Apache/Nginx with mod_rewrite
- cURL extension enabled
- JSON extension enabled

## 🛠 Installation

1. **Clone/Copy the backend files** to your web server directory
2. **Configure Database**: Update `config/db.php` with your database credentials
3. **Set up M-Pesa**: Update M-Pesa credentials in `api/payments/mpesa.php`
4. **Configure Web Server**: Ensure `.htaccess` is working for URL rewriting

### Database Setup

The backend automatically creates all required tables on first run. Tables include:

- `users` - User accounts and authentication
- `suppliers` - Supplier/artisan information
- `products` - Product catalog
- `orders` - Order management
- `order_items` - Order line items
- `payments` - Payment transactions
- `messages` - Contact form messages
- `cart` - Persistent shopping cart

## 🔌 API Endpoints

### Authentication

- `POST /api/register` - Register new user/supplier
- `POST /api/login` - User authentication
- `POST /api/logout` - User logout

### Products

- `GET /api/products` - Get products with filtering
- `GET /api/product/{id}` - Get single product details

### Orders

- `POST /api/order` - Create new order
- `GET /api/orders` - Get user orders
- `PUT /api/order/{id}/status` - Update order status

### Payments

- `POST /api/payments/mpesa` - Process M-Pesa payment
- `POST /api/payments/paypal` - Process PayPal payment

### Admin

- `GET /api/admin/dashboard` - Admin dashboard statistics
- `POST /api/admin/products` - Manage products (admin only)

### Supplier

- `GET /api/supplier/dashboard` - Supplier dashboard
- `POST /api/supplier/products` - Add supplier product

## 🔐 Security Features

- **Password Hashing**: bcrypt for secure password storage
- **SQL Injection Prevention**: PDO prepared statements
- **Input Sanitization**: htmlspecialchars and validation
- **CORS Support**: Configurable cross-origin requests
- **JWT Authentication**: Secure token-based auth
- **Role-based Access**: Customer/Supplier/Admin permissions

## 💳 Payment Integration

### M-Pesa Setup

1. Get M-Pesa API credentials from Safaricom
2. Update credentials in `api/payments/mpesa.php`:
   ```php
   $consumer_key = 'YOUR_MPESA_CONSUMER_KEY';
   $consumer_secret = 'YOUR_MPESA_CONSUMER_SECRET';
   $business_short_code = 'YOUR_BUSINESS_SHORT_CODE';
   $passkey = 'YOUR_MPESA_PASSKEY';
   ```

### PayPal Setup

Configure PayPal API credentials for payment processing.

## 🔄 Frontend Integration

The backend is designed to work with the React frontend. Update your React app to make API calls:

```javascript
// Example: Get products
const response = await fetch("http://yourapi.com/api/products");
const data = await response.json();

// Example: User login
const loginResponse = await fetch("http://yourapi.com/api/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});
```

## 📁 File Structure

```
php-backend/
├── index.php              # Main router
├── config/
│   ├── db.php             # Database configuration
│   └── cors.php           # CORS configuration
├── models/
│   ├── User.php           # User model
│   ├── Product.php        # Product model
│   └── Order.php          # Order model
├── api/
│   ├── register.php       # User registration
│   ├── login.php          # User authentication
│   ├── products.php       # Product listing
│   ├── product.php        # Single product
│   ├── create_order.php   # Order creation
│   ├── payments/
│   │   ├── mpesa.php      # M-Pesa integration
│   │   └── paypal.php     # PayPal integration
│   ├── admin/
│   │   └── dashboard.php  # Admin dashboard
│   └── supplier/
│       └── dashboard.php  # Supplier dashboard
├── .htaccess              # URL rewriting
└── README.md              # This file
```

## 🌍 Environment Configuration

For production deployment:

1. **Update Database Credentials** in `config/db.php`
2. **Set Production URLs** for callbacks and CORS
3. **Enable HTTPS** for all API endpoints
4. **Configure Error Logging** in PHP settings
5. **Set Secure Headers** in web server configuration

## 🧪 Testing

Test API endpoints using tools like Postman or curl:

```bash
# Test product listing
curl -X GET "http://yourapi.com/api/products"

# Test user registration
curl -X POST "http://yourapi.com/api/register" \
  -H "Content-Type: application/json" \
  -d '{"first_name":"John","last_name":"Doe","email":"john@example.com","password":"password123"}'
```

## 🐛 Troubleshooting

### Common Issues:

1. **CORS Errors**: Update `config/cors.php` with your frontend URL
2. **Database Connection**: Check credentials in `config/db.php`
3. **URL Rewriting**: Ensure Apache mod_rewrite is enabled
4. **Permission Errors**: Check file permissions (644 for files, 755 for directories)

### Debug Mode:

Enable error reporting in development:

```php
error_reporting(E_ALL);
ini_set('display_errors', 1);
```

## 📞 Support

For technical support or questions about the Nomad Treasures backend API, please contact the development team.

---

**Note**: This backend is specifically designed for the Nomad Treasures platform and includes cultural-specific features for Kenyan nomadic tribes and M-Pesa payment integration.
