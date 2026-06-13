"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  X,
  FolderPlus,
  PackagePlus,
} from "lucide-react";
import Logo from "@/components/Logo";
import { useAdminDialogs } from "@/components/admin/AdminDialogContext";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/inventory", label: "Products", icon: Package },
];

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const prevPathname = useRef(pathname);

  const { openAddCategory, openAddProduct } = useAdminDialogs();

  if (prevPathname.current !== pathname) {
    setFabOpen(false);
    setFabOpen(false);
    prevPathname.current = pathname;
  }

  useEffect(() => {
    if (fabOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [fabOpen]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const sidebarContent = (
    <>
      <div
        className={`flex items-center ${collapsed ? "justify-center p-3" : "p-4"}`}
      >
        <Logo href="/admin" collapsed={collapsed} />
      </div>

      <nav className="flex-1 p-2 space-y-4 mt-8">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium transition-all duration-200 active:scale-[0.97] ${
                isActive
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              } ${collapsed ? "justify-center" : ""} ${collapsed && isActive ? "ring-1 ring-gray-300" : ""}`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon size={20} className="shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-2 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors w-full ${
            collapsed ? "justify-center" : ""
          }`}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut size={20} className="shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </>
  );

  const fabActions = [
    {
      label: "Add Category",
      icon: FolderPlus,
      onClick: () => {
        setFabOpen(false);
        openAddCategory();
      },
    },
    {
      label: "Add Product",
      icon: PackagePlus,
      onClick: () => {
        setFabOpen(false);
        openAddProduct();
      },
    },
  ];

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex relative bg-white border-r border-gray-200 flex-col shrink-0 transition-all duration-300 ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-7 z-50 bg-white border border-gray-200 rounded-full p-1 text-gray-400 hover:text-gray-900 hover:border-gray-400 transition-colors shadow-sm"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <PanelLeftOpen size={20} />
          ) : (
            <PanelLeftClose size={20} />
          )}
        </button>
        {sidebarContent}
      </aside>

      {/* Mobile/tablet bottom navigation */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-gray-200 px-6">
        {/* FAB action menu */}
        {fabOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/30 backdrop-blur-xs"
              onClick={() => setFabOpen(false)}
              aria-hidden="true"
            />
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
              {fabActions.map((action, i) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    onClick={action.onClick}
                    className="flex items-center gap-2.5 px-4 py-2.5 bg-white rounded-xl shadow-lg border border-gray-100 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 active:scale-90 transition-all duration-300 motion-safe:animate-fade-in-up"
                    style={{
                      animationDelay: `${i * 60}ms`,
                      animationFillMode: "backwards",
                    }}
                    aria-label={action.label}
                  >
                    <Icon size={16} className="shrink-0 text-gray-900" />
                    <span className="whitespace-nowrap">{action.label}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}

        <div className="flex items-center justify-center h-16 gap-[5px]">
          {/* Dashboard */}
          <Link
            href="/admin"
            className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 ${
              pathname === "/admin"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-400 hover:text-gray-900 hover:bg-gray-50"
            }`}
            aria-label="Dashboard"
          >
            <LayoutDashboard size={22} />
          </Link>

          {/* FAB — raised higher */}
          <button
            onClick={() => setFabOpen((prev) => !prev)}
            className={`relative flex items-center justify-center w-14 h-14 rounded-full shadow-xl text-white transition-all duration-300 active:scale-95 -translate-y-3 ${
              fabOpen ? "bg-gray-800" : "bg-gray-900 hover:bg-black"
            }`}
            aria-label={fabOpen ? "Close menu" : "Open menu"}
            aria-expanded={fabOpen}
          >
            <Plus
              size={24}
              className={`absolute transition-transform duration-300 ${
                fabOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
              }`}
            />
            <X
              size={24}
              className={`absolute transition-transform duration-300 ${
                fabOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
              }`}
            />
          </button>

          {/* Inventory */}
          <Link
            href="/admin/inventory"
            className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 ${
              pathname === "/admin/inventory"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-400 hover:text-gray-900 hover:bg-gray-50"
            }`}
            aria-label="Inventory"
          >
            <Package size={22} />
          </Link>
        </div>
      </nav>
    </>
  );
}
