import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Index from "./pages/Index";
import Catalog from "./pages/Catalog";
import Tribes from "./pages/Tribes";
import About from "./pages/About";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderTracking from "./pages/OrderTracking";
import AdminLogin from "./pages/AdminLogin";
import AdminForgotPassword from "./pages/AdminForgotPassword";
import AdminResetPassword from "./pages/AdminResetPassword";
import AdminDashboard from "./pages/AdminDashboard";
import AdminSettings from "./pages/AdminSettings";
import AdminOrders from "./pages/AdminOrders";
import AdminProducts from "./pages/AdminProducts";
import AdminUsers from "./pages/AdminUsers";
import AdminSuppliers from "./pages/AdminSuppliers";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminPayments from "./pages/AdminPayments";
import AdminReports from "./pages/AdminReports";
import AdminWebsite from "./pages/AdminWebsite";
import NotFound from "./pages/NotFound";
import ChatBot from "./components/ChatBot";

function CaseRedirect({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const lower = location.pathname.toLowerCase();
  if (location.pathname !== lower) {
    return (
      <Navigate to={`${lower}${location.search}${location.hash}`} replace />
    );
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <CaseRedirect>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/tribes" element={<Tribes />} />
          <Route path="/about" element={<About />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<OrderTracking />} />

          {/* Admin Routes - Standard Paths */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
          <Route path="/admin/reset-password" element={<AdminResetPassword />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/notifications" element={<AdminSettings />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/suppliers" element={<AdminSuppliers />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/payments" element={<AdminPayments />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/website" element={<AdminWebsite />} />

          {/* Catch all - 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </CaseRedirect>
      <ChatBot />
    </BrowserRouter>
  );
}
