import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { handleDemo } from "./routes/demo";
import {
  adminLogin,
  adminDashboard,
  adminAnalytics,
  getOrders,
  updateOrder,
  getProducts,
  manageProducts,
  getUsers,
  forgotPassword,
  resetPassword,
  validateToken,
  revokeToken,
} from "./routes/admin";

export function createServer() {
  const app = express();

  // Security & core middleware
  const isProd = process.env.NODE_ENV === "production";
  if (isProd) {
    app.use(helmet());
  } else {
    // Allow embedding in Builder preview iframe and relax CSP in dev
    app.use(
      helmet({
        contentSecurityPolicy: false,
        frameguard: false,
        crossOriginEmbedderPolicy: false,
      }),
    );
  }
  app.use(
    cors({
      origin: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
      optionsSuccessStatus: 200,
    }),
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Basic login rate limiter
  const loginLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Simple admin auth guard for demo server using in-memory token store
  const requireAdminAuth: express.RequestHandler = (req, res, next) => {
    const auth = req.headers.authorization || "";
    const token = auth.replace(/^Bearer\s+/i, "");
    if (!token)
      return res.status(401).json({ success: false, error: "Unauthorized" });
    const userId = validateToken(token);
    if (!userId)
      return res
        .status(401)
        .json({ success: false, error: "Invalid or expired token" });
    // Attach user id to request for future use
    (req as any).adminUserId = userId;
    next();
  };

  // Health check and debugging endpoints
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      endpoints: ["/api/ping", "/api/login", "/api/admin/dashboard"],
    });
  });

  app.get("/api/demo", handleDemo);

  // Auth endpoints
  app.post("/api/login", loginLimiter, adminLogin);
  app.post("/api/logout", (req, res) => {
    const auth = req.headers.authorization || "";
    const token = auth.replace(/^Bearer\s+/i, "");
    if (token) revokeToken(token);
    return res.json({ success: true });
  });

  // Password reset endpoints
  const forgotLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
  });
  const resetLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.post("/api/admin/forgot-password", forgotLimiter, forgotPassword);
  app.post("/api/admin/reset-password", resetLimiter, resetPassword);

  // Admin API routes (protected)
  app.get("/api/admin/dashboard", requireAdminAuth, adminDashboard);
  app.get("/api/admin/analytics", requireAdminAuth, adminAnalytics);
  app.get("/api/admin/orders", requireAdminAuth, getOrders);
  app.post("/api/admin/orders/:id", requireAdminAuth, updateOrder);
  app.get("/api/admin/products", requireAdminAuth, getProducts);
  app.post("/api/admin/products", requireAdminAuth, manageProducts);
  app.get("/api/admin/users", requireAdminAuth, getUsers);

  return app;
}
