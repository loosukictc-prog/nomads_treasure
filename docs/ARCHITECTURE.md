# Architecture Overview

Nomad Treasures uses a modern full-stack architecture with React frontend and Express backend.

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Browser/Client                        │
│  ┌──────────────────────────────────────────────────┐   │
│  │      React 18 + React Router 6 (SPA)             │   │
│  │  • Frontend UI Components                        │   │
│  │  • Client-side Routing                           │   │
│  │  • State Management                              │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          ↓ HTTP(S)
                    API Calls (/api/*)
                          ↓
┌─────────────────────────────────────────────────────────┐
│              Express.js Server (Port 8080)               │
│  ┌──────────────────────────────────────────────────┐   │
│  │  API Routes & Handlers                           │   │
│  │  • Authentication                                │   │
│  │  • Admin Dashboard                               │   │
│  │  • Product Management                            │   │
│  │  • Order Processing                              │   │
│  │  • Analytics                                     │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Middleware & Security                           │   │
│  │  • CORS                                          │   │
│  │  • Helmet (Security Headers)                     │   │
│  │  • Rate Limiting                                 │   │
│  │  • Authentication Guards                         │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          ↓
        PostgreSQL Database (Optional for Production)
```

## Directory Structure

### Frontend (`/client`)

```
client/
├── pages/              # Route components
│   ├── Index.tsx      # Home page
│   ├── Catalog.tsx    # Product catalog
│   ├── Cart.tsx       # Shopping cart
│   ├── Checkout.tsx   # Checkout flow
│   ├── About.tsx      # About page
│   ├── Tribes.tsx     # Tribes page
│   ├── AdminLogin.tsx
│   ├── AdminDashboard.tsx
│   ├── AdminProducts.tsx
│   ├── AdminOrders.tsx
│   ├── AdminUsers.tsx
│   ├── AdminAnalytics.tsx
│   ├── AdminPayments.tsx
│   ├── AdminReports.tsx
│   ├── AdminSettings.tsx
│   └── NotFound.tsx
│
├── components/         # Reusable components
│   ├── ui/            # UI library (Radix + TailwindCSS)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── input.tsx
│   │   └── ... (40+ UI components)
│   ├── Navigation.tsx
│   ├── AdminSidebar.tsx
│   ├── ChatBot.tsx
│   └── ... (other components)
│
├── hooks/             # Custom React hooks
│   ├── use-mobile.tsx
│   └── use-toast.ts
│
├── lib/               # Utilities & libraries
│   ├── api.ts        # API client
│   └── utils.ts      # Helper functions
│
├── App.tsx            # Root component with routing
├── main.tsx           # Entry point
├── global.css         # Global styles
└── vite-env.d.ts     # Vite environment types
```

### Backend (`/server`)

```
server/
├── routes/            # API route handlers
│   ├── admin.ts      # Admin endpoints
│   ├── demo.ts       # Demo endpoints
│   └── ... (other routes)
│
├── sql/              # Database schemas
│   └── nomad_treasures_postgres.sql
│
├── index.ts          # Express app setup
├── dev.ts            # Development entry point
└── node-build.ts     # Production entry point
```

### Shared (`/shared`)

```
shared/
└── api.ts            # Shared TypeScript interfaces
```

## Technology Stack

### Frontend

| Technology   | Version | Purpose               |
| ------------ | ------- | --------------------- |
| React        | 18.3    | UI framework          |
| TypeScript   | 5.5     | Type safety           |
| Vite         | 6.3     | Build tool            |
| React Router | 6.x     | Client-side routing   |
| TailwindCSS  | 3.x     | Styling               |
| Radix UI     | 1.x     | Accessible components |
| Lucide Icons | Latest  | Icon library          |
| Recharts     | Latest  | Charts/graphs         |

### Backend

| Technology | Version | Purpose              |
| ---------- | ------- | -------------------- |
| Express    | 4.18+   | Web framework        |
| Node.js    | 18+     | Runtime              |
| TypeScript | 5.5+    | Type safety          |
| Helmet     | 7.2+    | Security headers     |
| CORS       | 2.8+    | Cross-origin support |
| Rate Limit | 7.5+    | API protection       |

### Tools & Services

| Tool           | Purpose               |
| -------------- | --------------------- |
| npm            | Package manager       |
| TypeScript     | Type checking         |
| Prettier       | Code formatting       |
| Vitest         | Unit testing          |
| GitHub Actions | CI/CD                 |
| Vite           | Dev server & bundling |

## Data Flow

### User Authentication Flow

```
1. User submits email/password on login page
2. Frontend calls POST /api/login
3. Backend validates credentials
4. Backend generates JWT token (24h expiry)
5. Token returned to frontend
6. Frontend stores in localStorage
7. Token sent with Authorization header for protected endpoints
```

### API Request Flow

```
Client → Middleware (CORS, Auth) → Route Handler → Response
                                        ↓
                          Business Logic / Database
```

### Admin Dashboard Flow

```
1. User navigates to /admin/login
2. User authenticates with email/password
3. JWT token stored in localStorage
4. User redirected to /admin/dashboard
5. Dashboard requests data from protected endpoints
6. Middleware validates token
7. Handler returns user-specific data
8. Frontend renders dashboard with data
```

## Authentication & Authorization

### Token-Based Authentication

- **Type:** JWT (JSON Web Tokens)
- **Storage:** localStorage (client-side)
- **Duration:** 24 hours
- **Validation:** Backend validates on each protected request

### Authorization

- **Admin Routes:** Require valid token + admin role
- **Public Routes:** No authentication required
- **Protected Endpoints:** All `/api/admin/*` routes

### Password Security

- **Hashing:** PBKDF2 with SHA-512
- **Salt:** Generated per user (16 bytes)
- **Iterations:** 10,000
- **Storage:** Hashed password + salt (never plain text)

## API Architecture

### Endpoint Organization

```
Public Routes:
  GET  /api/ping          - Health check
  GET  /api/health        - Health status
  GET  /api/demo          - Demo endpoint

Auth Routes:
  POST /api/login                    - Admin login
  POST /api/logout                   - Admin logout
  POST /api/admin/forgot-password    - Forgot password
  POST /api/admin/reset-password     - Reset password

Protected Routes (require token):
  GET  /api/admin/dashboard    - Dashboard overview
  GET  /api/admin/analytics    - Analytics data
  GET  /api/admin/orders       - Order list
  POST /api/admin/orders/:id   - Update order
  GET  /api/admin/products     - Product list
  POST /api/admin/products     - Manage products
  GET  /api/admin/users        - User list
```

### Request/Response Format

**Request:**

```json
{
  "method": "POST",
  "headers": {
    "Content-Type": "application/json",
    "Authorization": "Bearer <token>"
  },
  "body": {
    "email": "user@example.com",
    "password": "secret123"
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "role": "admin"
    }
  }
}
```

## Security Architecture

### Security Layers

1. **Transport Layer**

   - HTTPS in production
   - Secure cookies with httpOnly flag

2. **API Layer**

   - CORS protection
   - Rate limiting on sensitive endpoints
   - Input validation with Zod

3. **Authentication Layer**

   - JWT tokens with expiry
   - Password hashing with salt

4. **Authorization Layer**

   - Role-based access control
   - Admin middleware guards

5. **Server Layer**
   - Helmet security headers
   - Express middleware stack

## Deployment Architecture

### Development

```
npm run dev
  ├── Frontend (Vite) - Port 5173
  └── Backend (Express) - Port 8080
      └── Proxy API requests
```

### Production (Node.js)

```
npm run build
npm start
  └── Express server serves built React SPA + API
      └── Single port (3000 or 8080)
```

### Cloud Deployment (GitHub Pages/Netlify)

```
GitHub Pages / Netlify
  ├── Static frontend (React SPA)
  └── Serverless backend (optional)
```

## Data Models

### User

```typescript
interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password_hash: string;
  salt: string;
  role: "admin" | "customer" | "supplier";
  status: "active" | "inactive" | "pending";
  created_at: string;
}
```

### Product

```typescript
interface Product {
  id: number;
  name: string;
  price: number;
  stock_quantity: number;
  tribe: string;
  category: string;
  status: "active" | "archived";
  description?: string;
  image?: string;
  created_at: string;
}
```

### Order

```typescript
interface Order {
  id: number;
  user_id: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  payment_status: "pending" | "completed" | "failed";
  total_amount: number;
  currency: "USD" | "KES";
  created_at: string;
  updated_at: string;
}
```

## Scalability Considerations

### Current (In-Memory)

- In-memory data storage
- Single server instance
- Good for: Development, prototyping

### Future (Recommended)

- PostgreSQL database
- Microservices architecture
- Caching layer (Redis)
- Load balancing
- CDN for static assets
- Separate admin API

## Performance Optimization

### Frontend

- Code splitting by route
- Vendor bundle separation
- Lazy loading components
- CSS purging with TailwindCSS
- Image optimization

### Backend

- Request caching
- Database query optimization
- Compression middleware
- Connection pooling
- Rate limiting

## Testing Strategy

### Unit Tests

- Component logic
- Utility functions
- API response handling

### Integration Tests

- API endpoint testing
- Database operations
- Authentication flow

### E2E Tests (Future)

- User workflows
- Admin operations
- Payment flows

## Monitoring & Logging

### Development

- Console logs for debugging
- Network tab for API calls
- DevTools for component inspection

### Production

- Error tracking (Sentry)
- Analytics (Google Analytics)
- Performance monitoring
- Log aggregation

## Future Architectural Improvements

1. **Microservices**

   - Separate payment service
   - Email service
   - Analytics service

2. **Real-time Features**

   - WebSocket for live notifications
   - Real-time inventory updates

3. **Advanced Caching**

   - Redis for session management
   - API response caching

4. **Search**

   - Elasticsearch for product search
   - Full-text search capabilities

5. **Media Handling**
   - Cloud storage (AWS S3)
   - Image optimization service
   - CDN integration

---

For more details, see:

- [README.md](../README.md)
- [DEPLOYMENT.md](../DEPLOYMENT.md)
- [API Documentation](./API.md) (if available)
