import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BarChart3,
  Users,
  Package,
  ShoppingCart,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  Bell,
  FileText,
  TrendingUp,
  Globe,
  CreditCard,
  UserCog,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiClient } from "@/lib/api";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function AdminSidebar({ isOpen, onToggle }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiClient.logout();
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Force logout even if API call fails
      apiClient.clearToken();
      navigate("/admin/login");
    }
  };

  const navigationItems = [
    {
      category: "Overview",
      items: [
        {
          label: "Dashboard",
          icon: BarChart3,
          href: "/admin/dashboard",
          active: location.pathname === "/admin/dashboard",
        },
        {
          label: "Analytics",
          icon: TrendingUp,
          href: "/admin/analytics",
          active: location.pathname === "/admin/analytics",
          badge: "Pro",
        },
      ],
    },
    {
      category: "Management",
      items: [
        {
          label: "Orders",
          icon: ShoppingCart,
          href: "/admin/orders",
          active: location.pathname.startsWith("/admin/orders"),
          badge: "12",
        },
        {
          label: "Products",
          icon: Package,
          href: "/admin/products",
          active: location.pathname.startsWith("/admin/products"),
        },
        {
          label: "Users",
          icon: Users,
          href: "/admin/users",
          active: location.pathname.startsWith("/admin/users"),
        },
        {
          label: "Suppliers",
          icon: UserCog,
          href: "/admin/suppliers",
          active: location.pathname.startsWith("/admin/suppliers"),
        },
      ],
    },
    {
      category: "Business",
      items: [
        {
          label: "Payments",
          icon: CreditCard,
          href: "/admin/payments",
          active: location.pathname.startsWith("/admin/payments"),
        },
        {
          label: "Reports",
          icon: FileText,
          href: "/admin/reports",
          active: location.pathname.startsWith("/admin/reports"),
        },
        {
          label: "Website",
          icon: Globe,
          href: "/admin/website",
          active: location.pathname.startsWith("/admin/website"),
        },
      ],
    },
    {
      category: "System",
      items: [
        {
          label: "Settings",
          icon: Settings,
          href: "/admin/settings",
          active: location.pathname.startsWith("/admin/settings"),
        },
        {
          label: "Notifications",
          icon: Bell,
          href: "/admin/notifications",
          active: location.pathname.startsWith("/admin/notifications"),
          badge: "3",
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:z-auto`}
        style={{ width: "280px" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-earth-red rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-tribal-brown">
                Admin Panel
              </h2>
              <p className="text-xs text-gray-500">Nomad Treasures</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="lg:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-4">
          <nav className="space-y-6">
            {navigationItems.map((section) => (
              <div key={section.category}>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                  {section.category}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => {
                        // Close mobile menu when navigating
                        if (window.innerWidth < 1024) {
                          onToggle();
                        }
                      }}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        item.active
                          ? "bg-earth-red text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <Badge
                          variant={item.active ? "secondary" : "default"}
                          className={`text-xs ${
                            item.active
                              ? "bg-white/20 text-white"
                              : "bg-earth-red text-white"
                          }`}
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-sahara-sand rounded-full flex items-center justify-center">
              <span className="text-xs font-semibold text-tribal-brown">
                SA
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                Super Admin
              </p>
              <p className="text-xs text-gray-500 truncate">
                admin@nomadtreasures.com
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="w-full text-gray-700 hover:text-red-600 hover:border-red-300"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </>
  );
}

export function AdminHeader({ onMenuToggle }: { onMenuToggle: () => void }) {
  return (
    <header className="bg-white border-b border-gray-200 lg:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <Button variant="ghost" size="sm" onClick={onMenuToggle}>
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-earth-red" />
          <span className="font-display font-bold text-tribal-brown">
            Admin Panel
          </span>
        </div>
        <div className="w-8"></div>
      </div>
    </header>
  );
}
