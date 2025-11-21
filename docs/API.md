# API Documentation

Complete API reference for Nomad Treasures backend.

## Base URL

- **Development:** `http://localhost:8080/api`
- **Production:** `https://yourdomain.com/api`

## Authentication

### Token-Based Authentication

Protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <token>
```

**Token obtained from:**

```
POST /api/login
```

**Token lifespan:** 24 hours

**Error response if unauthorized:**

```json
{
  "success": false,
  "error": "Invalid or expired token"
}
```

## Public Endpoints

### Health Check

**Endpoint:** `GET /api/ping`

**Response:**

```json
{
  "message": "Hello from Express server v2!"
}
```

**Status Code:** `200 OK`

---

### Health Status

**Endpoint:** `GET /api/health`

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "endpoints": ["/api/ping", "/api/login", "/api/admin/dashboard"]
}
```

**Status Code:** `200 OK`

---

### Demo Endpoint

**Endpoint:** `GET /api/demo`

**Response:**

```json
{
  "hello": "world"
}
```

**Status Code:** `200 OK`

---

## Authentication Endpoints

### Admin Login

**Endpoint:** `POST /api/login`

**Rate Limit:** 10 requests per 5 minutes

**Request Body:**

```json
{
  "email": "admin@nomadtreasures.com",
  "password": "admin123"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@nomadtreasures.com",
    "first_name": "Super",
    "last_name": "Admin",
    "role": "admin",
    "status": "active"
  }
}
```

**Error Response (401):**

```json
{
  "success": false,
  "error": "Invalid email or password"
}
```

**Demo Credentials:**

- Email: `admin@nomadtreasures.com`
- Password: `admin123`

⚠️ Change these immediately in production!

---

### Admin Logout

**Endpoint:** `POST /api/logout`

**Headers:**

```
Authorization: Bearer <token>
```

**Success Response (200):**

```json
{
  "success": true
}
```

---

### Forgot Password

**Endpoint:** `POST /api/admin/forgot-password`

**Rate Limit:** 5 requests per 10 minutes

**Request Body:**

```json
{
  "email": "admin@nomadtreasures.com"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "If that account exists, a password reset email has been sent."
}
```

⚠️ Always returns success for security (no user enumeration)

---

### Reset Password

**Endpoint:** `POST /api/admin/reset-password`

**Rate Limit:** 20 requests per 10 minutes

**Request Body:**

```json
{
  "token": "reset-token-from-email",
  "password": "new-secure-password"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Password has been reset. You can now sign in."
}
```

**Error Response (400):**

```json
{
  "success": false,
  "error": "Invalid or expired token"
}
```

---

## Protected Admin Endpoints

All endpoints below require authentication. Include the token in the Authorization header:

```
Authorization: Bearer <token>
```

### Dashboard Overview

**Endpoint:** `GET /api/admin/dashboard`

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "totalOrders": 245,
    "totalRevenue": 12500,
    "activeProducts": 48,
    "totalCustomers": 156,
    "recentOrders": [
      {
        "id": 1,
        "user_id": 5,
        "status": "completed",
        "payment_status": "completed",
        "total_amount": 450.5,
        "currency": "USD",
        "created_at": "2024-01-15T10:30:00.000Z"
      }
    ]
  }
}
```

---

### Get Analytics

**Endpoint:** `GET /api/admin/analytics`

**Query Parameters:**

- `period` (optional): `day`, `week`, `month`, `year` (default: `month`)

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "revenue": [
      { "date": "2024-01-01", "amount": 1200 },
      { "date": "2024-01-02", "amount": 1500 }
    ],
    "orders": [
      { "date": "2024-01-01", "count": 15 },
      { "date": "2024-01-02", "count": 18 }
    ],
    "topProducts": [
      {
        "id": 1,
        "name": "Maasai Beaded Necklace",
        "sales": 25
      }
    ]
  }
}
```

---

### Get Orders

**Endpoint:** `GET /api/admin/orders`

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": 1,
        "user_id": 5,
        "status": "processing",
        "payment_status": "completed",
        "total_amount": 450.5,
        "currency": "USD",
        "created_at": "2024-01-15T10:30:00.000Z"
      }
    ],
    "total": 245,
    "page": 1,
    "limit": 10
  }
}
```

---

### Update Order

**Endpoint:** `POST /api/admin/orders/:id`

**URL Parameters:**

- `id`: Order ID (required)

**Request Body:**

```json
{
  "status": "completed",
  "payment_status": "completed"
}
```

**Valid Status Values:**

- `pending`, `processing`, `completed`, `cancelled`

**Valid Payment Status Values:**

- `pending`, `completed`, `failed`

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "order": {
      "id": 1,
      "user_id": 5,
      "status": "completed",
      "payment_status": "completed",
      "total_amount": 450.5,
      "currency": "USD",
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

**Error Response (404):**

```json
{
  "success": false,
  "error": "Order not found"
}
```

---

### Get Products

**Endpoint:** `GET /api/admin/products`

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": 1,
        "name": "Traditional Maasai Beaded Necklace",
        "price": 89.0,
        "stock_quantity": 15,
        "tribe": "Maasai",
        "category": "Jewelry",
        "status": "active",
        "created_at": "2024-01-10T10:30:00.000Z"
      }
    ],
    "total": 48,
    "page": 1,
    "limit": 10
  }
}
```

---

### Manage Products

**Endpoint:** `POST /api/admin/products`

**Request Body (Create):**

```json
{
  "action": "create",
  "name": "New Product",
  "price": 99.99,
  "tribe": "Maasai",
  "category": "Jewelry",
  "stock_quantity": 20
}
```

**Request Body (Update):**

```json
{
  "action": "update",
  "id": 1,
  "name": "Updated Name",
  "price": 109.99
}
```

**Request Body (Delete):**

```json
{
  "action": "delete",
  "id": 1
}
```

**Request Body (Archive):**

```json
{
  "action": "archive",
  "id": 1
}
```

**Request Body (Set Stock):**

```json
{
  "action": "set_stock",
  "id": 1,
  "stock_quantity": 50
}
```

**Request Body (Set Price):**

```json
{
  "action": "set_price",
  "id": 1,
  "price": 129.99
}
```

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "product": {
      "id": 1,
      "name": "Traditional Maasai Beaded Necklace",
      "price": 89.0,
      "stock_quantity": 15,
      "tribe": "Maasai",
      "category": "Jewelry",
      "status": "active",
      "created_at": "2024-01-10T10:30:00.000Z"
    }
  }
}
```

---

### Get Users

**Endpoint:** `GET /api/admin/users`

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `role` (optional): Filter by role (`admin`, `customer`, `supplier`)
- `status` (optional): Filter by status (`active`, `inactive`, `pending`)

**Success Response (200):**

```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": 1,
        "first_name": "Super",
        "last_name": "Admin",
        "email": "admin@nomadtreasures.com",
        "role": "admin",
        "status": "active",
        "created_at": "2024-01-01T10:30:00.000Z"
      }
    ],
    "total": 156,
    "page": 1,
    "limit": 10
  }
}
```

---

## Error Responses

### Common Error Codes

| Status | Error                 | Meaning                                           |
| ------ | --------------------- | ------------------------------------------------- |
| 400    | Bad Request           | Invalid request format or missing required fields |
| 401    | Unauthorized          | Missing or invalid authentication token           |
| 404    | Not Found             | Resource not found                                |
| 429    | Too Many Requests     | Rate limit exceeded                               |
| 500    | Internal Server Error | Server error (check logs)                         |

### Error Response Format

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

---

## Rate Limiting

### Limits by Endpoint

| Endpoint                     | Limit        | Window     |
| ---------------------------- | ------------ | ---------- |
| `/api/login`                 | 10 requests  | 5 minutes  |
| `/api/admin/forgot-password` | 5 requests   | 10 minutes |
| `/api/admin/reset-password`  | 20 requests  | 10 minutes |
| All other endpoints          | 100 requests | 15 minutes |

### Rate Limit Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642257600
```

---

## Data Types

### Currency

```typescript
type Currency = "USD" | "KES";
```

### Order Status

```typescript
type OrderStatus = "pending" | "processing" | "completed" | "cancelled";
```

### Payment Status

```typescript
type PaymentStatus = "pending" | "completed" | "failed";
```

### User Role

```typescript
type UserRole = "admin" | "customer" | "supplier";
```

### Product Status

```typescript
type ProductStatus = "active" | "archived";
```

---

## Code Examples

### cURL

```bash
# Login
curl -X POST http://localhost:8080/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@nomadtreasures.com","password":"admin123"}'

# Get dashboard (with token)
curl -X GET http://localhost:8080/api/admin/dashboard \
  -H "Authorization: Bearer <token>"
```

### JavaScript/Fetch

```javascript
// Login
const response = await fetch("/api/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "admin@nomadtreasures.com",
    password: "admin123",
  }),
});

const data = await response.json();
const token = data.token;

// Get dashboard
const dashResponse = await fetch("/api/admin/dashboard", {
  headers: { Authorization: `Bearer ${token}` },
});
```

### TypeScript with API Client

See `client/lib/api.ts` for the built-in API client with type safety.

---

## Changelog

### Latest Changes

- Added password reset functionality
- Improved error handling and validation
- Added analytics endpoints
- Rate limiting on sensitive endpoints

See [CHANGELOG.md](../CHANGELOG.md) for complete history.

---

For implementation examples, see:

- [Architecture Documentation](./ARCHITECTURE.md)
- [README.md](../README.md)
- [server/routes/admin.ts](../server/routes/admin.ts)
