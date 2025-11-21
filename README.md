# Nomad Treasures - E-Commerce Platform

A modern, full-stack e-commerce platform for authentic artifacts from Kenya's nomadic tribes. Built with React, Express, TypeScript, and TailwindCSS.

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-18.3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🚀 Features

### Customer Features
- Browse authentic nomadic tribe artifacts
- Advanced product filtering and search
- Secure user authentication and registration
- Shopping cart management
- Order tracking and history
- Multiple payment methods (M-Pesa, PayPal, Bank Transfer)
- Responsive design for all devices

### Admin Features
- Comprehensive admin dashboard
- Product management (CRUD operations)
- Order and payment tracking
- Customer analytics and reports
- User management
- Admin authentication with token-based security

## 📋 Tech Stack

**Frontend:**
- React 18.3 with TypeScript
- Vite for fast development and builds
- TailwindCSS 3 for styling
- React Router 6 for SPA routing
- Radix UI for accessible components
- Recharts for analytics visualization

**Backend:**
- Express.js for API server
- Node.js 18+
- TypeScript for type safety
- Helmet.js for security headers
- Express Rate Limit for API protection
- CORS support

**Testing:**
- Vitest for unit testing
- TypeScript for type checking

## 🛠️ Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- npm 9+ or yarn 3+
- Git for version control

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/nomad-treasures.git
cd nomad-treasures
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory using `.env.example` as a template:

```bash
cp .env.example .env
```

Edit `.env` and add your configuration values:

```env
NODE_ENV=development
PORT=8080
# Add other required variables as needed
```

⚠️ **Important:** Never commit `.env` files with real secrets to version control.

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:8080`
- Backend API: `http://localhost:8080/api/*`

## 📖 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Build frontend only
npm run build:client

# Build backend server only
npm run build:server

# Start production server
npm start

# Run tests
npm test

# Type checking
npm run typecheck

# Format code
npm run format.fix
```

## 🏗️ Project Structure

```
nomad-treasures/
├── client/                          # React frontend
│   ├── pages/                       # Route components
│   │   ├── Index.tsx               # Home page
│   │   ├── AdminLogin.tsx          # Admin login
│   │   ├── AdminDashboard.tsx      # Admin panel
│   │   ├── AdminProducts.tsx       # Product management
��   │   ├── AdminOrders.tsx         # Order management
│   │   ├── AdminPayments.tsx       # Payment tracking
│   │   ├── AdminUsers.tsx          # User management
│   │   └── AdminAnalytics.tsx      # Analytics
│   ├── components/
│   │   ├── ui/                     # Reusable UI components
│   │   ├── Navigation.tsx          # Header navigation
│   │   ├── AdminSidebar.tsx        # Admin sidebar
│   │   └── ...                     # Other components
│   ├── lib/
│   │   ├── api.ts                  # API client
│   │   └── utils.ts                # Utility functions
│   ├── App.tsx                      # App routing
│   ├── main.tsx                     # Entry point
│   └── global.css                   # Global styles
├── server/                          # Express backend
│   ├── routes/
│   │   ├── admin.ts                # Admin API endpoints
│   │   └── demo.ts                 # Demo endpoints
│   ├── sql/                        # Database scripts
│   └── index.ts                    # Server configuration
├── shared/                          # Shared types
│   └── api.ts                      # API interfaces
├── public/                          # Static assets
├── netlify/                         # Netlify functions
├── package.json                     # Dependencies
├── tailwind.config.ts               # Tailwind configuration
├── tsconfig.json                    # TypeScript configuration
├── vite.config.ts                   # Vite config
├── vite.config.server.ts            # Server build config
└── README.md                        # This file
```

## 🔐 Security Features

- **Password Hashing:** PBKDF2 with salt for user passwords
- **JWT Tokens:** Secure token-based authentication for admin endpoints
- **Rate Limiting:** API endpoints protected with rate limits
- **CORS Protection:** Configurable CORS settings
- **Helmet.js:** HTTP security headers
- **Input Validation:** Zod for request validation
- **Environment Variables:** Sensitive data stored in `.env`

## 🗄️ Database Setup

### PostgreSQL Database

For production deployments with a real database:

1. Create a PostgreSQL database
2. Run the SQL schema from `server/sql/nomad_treasures_postgres.sql`
3. Configure database connection in `.env`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/nomad_treasures
```

### Demo Mode

The application comes with in-memory demo data for testing without a database setup.

**Demo Admin Credentials (Development Only):**
```
Email: admin@nomadtreasures.com
Password: admin123
```

⚠️ Change these credentials immediately in production!

## 🚀 Deployment

### Netlify Deployment

1. **Connect Repository:**
   - Push code to GitHub
   - Visit https://app.netlify.com
   - Click "New site from Git"
   - Select your repository

2. **Configure Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `dist/spa`

3. **Set Environment Variables:**
   - Go to Site settings → Build & deploy → Environment
   - Add all variables from `.env.example`

4. **Deploy:**
   - Netlify automatically deploys on every push to main

### Docker Deployment

1. **Build Docker Image:**
   ```bash
   docker build -t nomad-treasures .
   ```

2. **Run Container:**
   ```bash
   docker run -p 8080:8080 \
     -e NODE_ENV=production \
     -e DATABASE_URL=your-db-url \
     nomad-treasures
   ```

### Traditional Server Deployment

1. **Build Application:**
   ```bash
   npm run build
   ```

2. **Start Production Server:**
   ```bash
   npm start
   ```

3. **Use Process Manager (PM2):**
   ```bash
   npm install -g pm2
   pm2 start dist/server/node-build.mjs --name "nomad-treasures"
   ```

## 🔧 Configuration

### Tailwind CSS

Customize colors and theme in `tailwind.config.ts`:

```typescript
extend: {
  colors: {
    'sahara-sand': '#F4E4C1',
    'tribal-brown': '#8B6F47',
    'earth-red': '#C85A54',
    // Add more custom colors
  }
}
```

### API Endpoints

Core admin endpoints are in `server/routes/admin.ts`:

- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/dashboard` - Dashboard data
- `GET /api/admin/orders` - Order list
- `PUT /api/admin/orders/:id` - Update order
- `GET /api/admin/products` - Product list
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/users` - User list
- `GET /api/admin/analytics` - Analytics data

## 🧪 Testing

Run tests with:

```bash
npm test
```

Tests are located alongside components with `.spec.ts` or `.spec.tsx` extensions.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make changes and test thoroughly
4. Commit with clear messages: `git commit -m "feat: add new feature"`
5. Push to your fork: `git push origin feature/my-feature`
6. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## 📝 Code Style

- TypeScript for type safety
- Prettier for code formatting
- ESLint for linting (when configured)
- Follow existing code patterns

Run code formatting:

```bash
npm run format.fix
```

## 🐛 Troubleshooting

### Port Already in Use

If port 8080 is already in use:

```bash
# Change port in .env
PORT=3000
```

### Module Not Found

Clear cache and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Build Errors

Ensure TypeScript is correct:

```bash
npm run typecheck
```

### Dev Server Won't Start

Check logs for errors:

```bash
npm run dev
# Look for error messages and check .env configuration
```

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Afripicx Pictures** - Initial development

## 📧 Support

For issues and questions:

1. Check [existing issues](https://github.com/yourusername/nomad-treasures/issues)
2. [Create a new issue](https://github.com/yourusername/nomad-treasures/issues/new)
3. Include error messages and steps to reproduce

## 🙏 Acknowledgments

- [Radix UI](https://www.radix-ui.com/) - Accessible component primitives
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS
- [Express.js](https://expressjs.com/) - Web framework
- Built with ❤️ for authentic African craftsmanship

---

**Last Updated:** 2024  
**Version:** 1.0.0
