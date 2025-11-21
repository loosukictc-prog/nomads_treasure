import { Request, Response } from "express";
import crypto from "node:crypto";

// In-memory storage for demo purposes
// In production, this would connect to a real database

// Password hashing helpers
function generateSalt() {
  return crypto.randomBytes(16).toString("hex");
}

function hashPassword(password: string, salt: string) {
  // Use pbkdf2 for simple server-side hashing without extra deps
  const derived = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512");
  return derived.toString("hex");
}

// Users now store password_hash and salt
let users: any[] = [
  {
    id: 1,
    first_name: "Super",
    last_name: "Admin",
    email: "admin@nomadtreasures.com",
    role: "admin",
    status: "active",
    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    first_name: "John",
    last_name: "Doe",
    email: "john@example.com",
    role: "customer",
    status: "active",
    created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    first_name: "Jane",
    last_name: "Smith",
    email: "jane@example.com",
    role: "customer",
    status: "active",
    created_at: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 4,
    first_name: "Moses",
    last_name: "Otieno",
    email: "moses@samburu-art.com",
    role: "supplier",
    status: "active",
    created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 5,
    first_name: "Amina",
    last_name: "Hassan",
    email: "amina@maasai-crafts.com",
    role: "supplier",
    status: "pending",
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Initialize password hashes for demo users (only once at startup)
(function initPasswords() {
  const plainPasswords: Record<number, string> = {
    1: "admin123",
    2: "password",
    3: "password",
    4: "password",
    5: "password",
  };
  users = users.map((u) => {
    const pwd = plainPasswords[u.id] || "password";
    const salt = generateSalt();
    const password_hash = hashPassword(pwd, salt);
    return { ...u, password_hash, salt };
  });
})();

let products = [
  {
    id: 1,
    name: "Traditional Maasai Beaded Necklace",
    price: 89.0,
    stock_quantity: 15,
    status: "active",
    tribe: "Maasai",
    category: "Jewelry",
    created_at: new Date(Date.now() - 604800000).toISOString(),
  },
  {
    id: 2,
    name: "Turkana Woven Basket",
    price: 156.0,
    stock_quantity: 8,
    status: "active",
    tribe: "Turkana",
    category: "Baskets",
    created_at: new Date(Date.now() - 1209600000).toISOString(),
  },
  {
    id: 3,
    name: "Samburu Leather Sandals",
    price: 125.0,
    stock_quantity: 12,
    status: "active",
    tribe: "Samburu",
    category: "Footwear",
    created_at: new Date(Date.now() - 1814400000).toISOString(),
  },
  {
    id: 4,
    name: "Rendile Silver Bracelet",
    price: 67.0,
    stock_quantity: 20,
    status: "active",
    tribe: "Rendile",
    category: "Jewelry",
    created_at: new Date(Date.now() - 2419200000).toISOString(),
  },
  {
    id: 5,
    name: "Borana Clay Pot",
    price: 203.0,
    stock_quantity: 5,
    status: "pending",
    tribe: "Borana",
    category: "Pottery",
    created_at: new Date(Date.now() - 3024000000).toISOString(),
  },
];

let orders = [
  {
    id: 1,
    order_number: "ORD-001",
    status: "pending",
    total: 245.0,
    currency: "USD",
    customer: "John Doe",
    customer_email: "john@example.com",
    created_at: new Date().toISOString(),
    payment_status: "pending",
  },
  {
    id: 2,
    order_number: "ORD-002",
    status: "completed",
    total: 156.0,
    currency: "USD",
    customer: "Jane Smith",
    customer_email: "jane@example.com",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    payment_status: "paid",
  },
  {
    id: 3,
    order_number: "ORD-003",
    status: "processing",
    total: 89.0,
    currency: "USD",
    customer: "Mike Johnson",
    customer_email: "mike@example.com",
    created_at: new Date(Date.now() - 172800000).toISOString(),
    payment_status: "paid",
  },
  {
    id: 4,
    order_number: "ORD-004",
    status: "pending",
    total: 312.0,
    currency: "USD",
    customer: "Sarah Wilson",
    customer_email: "sarah@example.com",
    created_at: new Date(Date.now() - 259200000).toISOString(),
    payment_status: "pending",
  },
  {
    id: 5,
    order_number: "ORD-005",
    status: "completed",
    total: 178.0,
    currency: "USD",
    customer: "David Brown",
    customer_email: "david@example.com",
    created_at: new Date(Date.now() - 345600000).toISOString(),
    payment_status: "paid",
  },
];

// Simple order items linking orders to products for analytics
let orderItems: {
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
}[] = [
  { order_id: 2, product_id: 2, quantity: 1, price: 156.0 },
  { order_id: 3, product_id: 1, quantity: 1, price: 89.0 },
  { order_id: 5, product_id: 3, quantity: 1, price: 125.0 },
  { order_id: 5, product_id: 4, quantity: 1, price: 53.0 },
];

// In-memory password reset tokens (demo only)
let resetTokens: { token: string; userId: number; expiresAt: number }[] = [];

// In-memory active tokens store (token -> { userId, expiresAt })
const activeTokens = new Map<string, { userId: number; expiresAt: number }>();

export function revokeToken(token: string) {
  activeTokens.delete(token);
}

export function validateToken(token: string) {
  const entry = activeTokens.get(token);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    activeTokens.delete(token);
    return null;
  }
  return entry.userId;
}

export const forgotPassword = (req: Request, res: Response) => {
  const { email } = req.body as { email?: string };
  const genericResponse = {
    success: true,
    message: "If that account exists, a password reset email has been sent.",
  } as const;
  if (!email) return res.json(genericResponse);
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return res.json(genericResponse);
  const token = crypto.randomBytes(24).toString("hex");
  const expiresAt = Date.now() + 15 * 60 * 1000;
  resetTokens.push({ token, userId: user.id, expiresAt });
  console.log("Password reset link:", `/admin/reset-password?token=${token}`);
  return res.json(genericResponse);
};

export const resetPassword = (req: Request, res: Response) => {
  const { token, password } = req.body as { token?: string; password?: string };
  if (!token || !password) {
    return res
      .status(400)
      .json({ success: false, error: "Token and new password are required" });
  }
  const entryIdx = resetTokens.findIndex((t) => t.token === token);
  if (entryIdx === -1) {
    return res
      .status(400)
      .json({ success: false, error: "Invalid or expired token" });
  }
  const entry = resetTokens[entryIdx];
  if (Date.now() > entry.expiresAt) {
    resetTokens.splice(entryIdx, 1);
    return res
      .status(400)
      .json({ success: false, error: "Invalid or expired token" });
  }
  const user = users.find((u) => u.id === entry.userId);
  if (!user) {
    resetTokens.splice(entryIdx, 1);
    return res.status(400).json({ success: false, error: "Invalid token" });
  }
  // set new password hash and salt
  const newSalt = generateSalt();
  const newHash = hashPassword(password, newSalt);
  user.salt = newSalt;
  user.password_hash = newHash;
  resetTokens.splice(entryIdx, 1);
  return res.json({
    success: true,
    message: "Password has been reset. You can now sign in.",
  });
};

export const adminLogin = (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email);

  if (!user) {
    return res.status(401).json({
      success: false,
      error: "Invalid email or password",
    });
  }

  // Verify password using stored hash
  const attemptedHash = hashPassword(password, user.salt);
  if (attemptedHash !== user.password_hash) {
    return res.status(401).json({
      success: false,
      error: "Invalid email or password",
    });
  }

  if (user.role !== "admin") {
    return res.status(403).json({
      success: false,
      error: "Access denied. Admin role required.",
    });
  }

  // Generate a secure token and store in memory with expiry (24h)
  const token = `admin_token_${crypto.randomBytes(16).toString("hex")}`;
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  activeTokens.set(token, { userId: user.id, expiresAt });

  res.json({
    success: true,
    message: "Login successful",
    token,
    user: {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
    },
  });
};

export const adminDashboard = (req: Request, res: Response) => {
  // Calculate comprehensive dashboard statistics
  const completedOrders = orders.filter((o) => o.status === "completed");
  const pendingOrders = orders.filter((o) => o.status === "pending");
  const activeProducts = products.filter((p) => p.status === "active");

  // Calculate revenue from completed orders only
  const totalRevenue = completedOrders.reduce(
    (sum, order) => sum + order.total,
    0,
  );

  // Get recent orders (last 5, sorted by date)
  const recentOrders = orders
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .slice(0, 5)
    .map((order) => ({
      id: order.id,
      order_number: order.order_number,
      customer: order.customer,
      total: order.total,
      status: order.status,
      created_at: order.created_at,
    }));

  const stats = {
    total_orders: orders.length,
    pending_orders: pendingOrders.length,
    completed_orders: completedOrders.length,
    total_revenue: totalRevenue,
    total_products: products.length,
    active_products: activeProducts.length,
    pending_products: products.filter((p) => p.status === "pending").length,
    total_users: users.length,
    recent_orders: recentOrders,
    revenue_growth: 12.5, // Mock percentage
    order_growth: 8.3, // Mock percentage
    user_growth: 5.2, // Mock percentage
  };

  res.json({
    success: true,
    data: stats,
  });
};

export const adminAnalytics = (req: Request, res: Response) => {
  // Revenue by day for last 30 days (paid orders only)
  const days = 30;
  const now = new Date();
  const revenueByDay: { date: string; revenue: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const dayKey = day.toISOString().slice(0, 10);
    const dayRevenue = orders
      .filter(
        (o) =>
          o.payment_status === "paid" && o.created_at.slice(0, 10) === dayKey,
      )
      .reduce((sum, o) => sum + o.total, 0);
    revenueByDay.push({ date: dayKey, revenue: Number(dayRevenue.toFixed(2)) });
  }

  // Orders by status
  const ordersByStatus: { status: string; count: number }[] = [
    {
      status: "completed",
      count: orders.filter((o) => o.status === "completed").length,
    },
    {
      status: "processing",
      count: orders.filter((o) => o.status === "processing").length,
    },
    {
      status: "pending",
      count: orders.filter((o) => o.status === "pending").length,
    },
  ];

  // Sales by tribe (paid orders only)
  const paidOrderIds = new Set(
    orders.filter((o) => o.payment_status === "paid").map((o) => o.id),
  );
  const productById = new Map(products.map((p) => [p.id, p] as const));
  const tribeSalesMap = new Map<string, number>();
  const productSalesMap = new Map<
    number,
    { quantity: number; revenue: number }
  >();

  for (const item of orderItems) {
    if (!paidOrderIds.has(item.order_id)) continue;
    const product = productById.get(item.product_id);
    if (!product) continue;
    tribeSalesMap.set(
      product.tribe,
      (tribeSalesMap.get(product.tribe) || 0) + item.quantity * item.price,
    );
    const current = productSalesMap.get(product.id) || {
      quantity: 0,
      revenue: 0,
    };
    current.quantity += item.quantity;
    current.revenue += item.quantity * item.price;
    productSalesMap.set(product.id, current);
  }

  const salesByTribe = Array.from(tribeSalesMap.entries()).map(
    ([tribe, revenue]) => ({ tribe, revenue: Number(revenue.toFixed(2)) }),
  );

  const topProducts = Array.from(productSalesMap.entries())
    .map(([productId, stats]) => ({
      id: productId,
      name: productById.get(productId)?.name || `Product ${productId}`,
      tribe: productById.get(productId)?.tribe || "",
      category: productById.get(productId)?.category || "",
      total_sold: stats.quantity,
      revenue: Number(stats.revenue.toFixed(2)),
    }))
    .sort((a, b) => b.total_sold - a.total_sold)
    .slice(0, 5);

  // KPIs
  const paidOrders = orders.filter((o) => o.payment_status === "paid");
  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0);
  const avgOrderValue = paidOrders.length
    ? totalRevenue / paidOrders.length
    : 0;

  const recentOrders = orders
    .slice()
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .slice(0, 10);

  res.json({
    success: true,
    data: {
      kpis: {
        total_revenue: Number(totalRevenue.toFixed(2)),
        total_orders: orders.length,
        paid_orders: paidOrders.length,
        pending_orders: orders.filter((o) => o.status === "pending").length,
        avg_order_value: Number(avgOrderValue.toFixed(2)),
        total_customers: users.filter((u) => u.role === "customer").length,
        total_suppliers: users.filter((u) => u.role === "supplier").length,
      },
      revenue_by_day: revenueByDay,
      orders_by_status: ordersByStatus,
      sales_by_tribe: salesByTribe,
      top_products: topProducts,
      recent_orders: recentOrders,
    },
  });
};

// Get all orders
export const getOrders = (req: Request, res: Response) => {
  const { page = 1, limit = 10, status, search } = req.query;

  let filteredOrders = [...orders];

  if (status && status !== "all") {
    filteredOrders = filteredOrders.filter((order) => order.status === status);
  }

  if (search) {
    const searchTerm = search.toString().toLowerCase();
    filteredOrders = filteredOrders.filter(
      (order) =>
        order.order_number.toLowerCase().includes(searchTerm) ||
        order.customer.toLowerCase().includes(searchTerm) ||
        order.customer_email.toLowerCase().includes(searchTerm),
    );
  }

  // Sort by creation date (newest first)
  filteredOrders.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  const startIndex =
    (parseInt(page.toString()) - 1) * parseInt(limit.toString());
  const endIndex = startIndex + parseInt(limit.toString());
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  res.json({
    success: true,
    data: {
      orders: paginatedOrders,
      total: filteredOrders.length,
      page: parseInt(page.toString()),
      limit: parseInt(limit.toString()),
      totalPages: Math.ceil(filteredOrders.length / parseInt(limit.toString())),
    },
  });
};

// Get all products
export const getProducts = (req: Request, res: Response) => {
  const { page = 1, limit = 10, status, tribe, category, search } = req.query;

  let filteredProducts = [...products];

  if (status && status !== "all") {
    filteredProducts = filteredProducts.filter(
      (product) => product.status === status,
    );
  }

  if (tribe && tribe !== "all") {
    filteredProducts = filteredProducts.filter(
      (product) => product.tribe === tribe,
    );
  }

  if (category && category !== "all") {
    filteredProducts = filteredProducts.filter(
      (product) => product.category === category,
    );
  }

  if (search) {
    const searchTerm = search.toString().toLowerCase();
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.tribe.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm),
    );
  }

  // Sort by creation date (newest first)
  filteredProducts.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  const startIndex =
    (parseInt(page.toString()) - 1) * parseInt(limit.toString());
  const endIndex = startIndex + parseInt(limit.toString());
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  res.json({
    success: true,
    data: {
      products: paginatedProducts,
      total: filteredProducts.length,
      page: parseInt(page.toString()),
      limit: parseInt(limit.toString()),
      totalPages: Math.ceil(
        filteredProducts.length / parseInt(limit.toString()),
      ),
    },
  });
};

// Update an order (status/payment_status) — protected
export const updateOrder = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { status, payment_status } = req.body as {
    status?: string;
    payment_status?: string;
  };
  const orderIdx = orders.findIndex((o) => o.id === id);
  if (orderIdx === -1) {
    return res.status(404).json({ success: false, error: "Order not found" });
  }
  if (status) orders[orderIdx].status = status;
  if (payment_status) orders[orderIdx].payment_status = payment_status;
  return res.json({ success: true, data: { order: orders[orderIdx] } });
};

// Get all users
export const manageProducts = (req: Request, res: Response) => {
  const { action, id, ...payload } = req.body as any;
  try {
    if (action === "create") {
      const newId = products.length
        ? Math.max(...products.map((p) => p.id)) + 1
        : 1;
      const product = {
        id: newId,
        name: payload.name || `Product ${newId}`,
        price: Number(payload.price) || 0,
        stock_quantity: Number(payload.stock_quantity) || 0,
        status: payload.status || "active",
        tribe: payload.tribe || "",
        category: payload.category || "",
        created_at: new Date().toISOString(),
      };
      products.push(product);
      return res.json({ success: true, data: { product } });
    }

    if (!id) {
      return res
        .status(400)
        .json({ success: false, error: "Product id required" });
    }

    const idx = products.findIndex((p) => p.id === Number(id));
    if (idx === -1)
      return res
        .status(404)
        .json({ success: false, error: "Product not found" });

    if (action === "update") {
      const updated = { ...products[idx], ...payload };
      // coerce numeric fields
      if (payload.price !== undefined) updated.price = Number(payload.price);
      if (payload.stock_quantity !== undefined)
        updated.stock_quantity = Number(payload.stock_quantity);
      products[idx] = updated;
      return res.json({ success: true, data: { product: products[idx] } });
    }

    if (action === "delete") {
      const removed = products.splice(idx, 1)[0];
      return res.json({ success: true, data: { product: removed } });
    }

    if (action === "archive") {
      products[idx].status = "archived";
      return res.json({ success: true, data: { product: products[idx] } });
    }

    if (action === "set_stock") {
      products[idx].stock_quantity = Number(payload.stock_quantity) || 0;
      return res.json({ success: true, data: { product: products[idx] } });
    }

    if (action === "set_price") {
      products[idx].price = Number(payload.price) || products[idx].price;
      return res.json({ success: true, data: { product: products[idx] } });
    }

    return res.status(400).json({ success: false, error: "Unknown action" });
  } catch (err: any) {
    console.error("manageProducts error", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

export const getUsers = (req: Request, res: Response) => {
  const { page = 1, limit = 10, role, search } = req.query;

  let filteredUsers = users.filter((user) => user.role !== "admin"); // Exclude admin from user list

  if (role && role !== "all") {
    filteredUsers = filteredUsers.filter((user) => user.role === role);
  }

  if (search) {
    const searchTerm = search.toString().toLowerCase();
    filteredUsers = filteredUsers.filter(
      (user) =>
        user.first_name.toLowerCase().includes(searchTerm) ||
        user.last_name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm),
    );
  }

  const startIndex =
    (parseInt(page.toString()) - 1) * parseInt(limit.toString());
  const endIndex = startIndex + parseInt(limit.toString());
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Remove sensitive fields from response
  const safeUsers = paginatedUsers.map(
    ({ password_hash, salt, ...user }) => user,
  );

  res.json({
    success: true,
    data: {
      users: safeUsers,
      total: filteredUsers.length,
      page: parseInt(page.toString()),
      limit: parseInt(limit.toString()),
      totalPages: Math.ceil(filteredUsers.length / parseInt(limit.toString())),
    },
  });
};
