/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import { supabaseAdmin } from "@/supabase/lib/client";
import { Package, CheckCircle, ShoppingCart } from "lucide-react";

export const dynamic = "force-dynamic";

async function getDashboardStats() {
  const sb = supabaseAdmin as any;
  const [totalProducts, availableProducts] = await Promise.all([
    sb.from("products").select("*", { count: "exact", head: true }),
    sb
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("available", true),
  ]);

  const { data: recentProducts } = await sb
    .from("products")
    .select("*, category:categories(name)")
    .order("created_at", { ascending: false })
    .limit(5);

  return {
    totalCount: totalProducts.count || 0,
    availableCount: availableProducts.count || 0,
    recentProducts: (recentProducts || []) as Array<{
      id: string;
      name: string;
      price: number;
      image_url: string | null;
      sku: string;
      available: boolean;
      created_at: string;
      category: { name: string } | null;
    }>,
  };
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const cards = [
    {
      label: "Total Products",
      value: stats.totalCount,
      icon: Package,
      color: "text-gray-900",
      text: "All items listed in your store",
    },
    {
      label: "Available Products",
      value: stats.availableCount,
      icon: CheckCircle,
      color: "text-emerald-600",
      text: "Items currently in stock and ready to sell",
    },
    {
      label: "Total Orders",
      value: stats.availableCount,
      icon: ShoppingCart,
      color: "text-amber-600",
      text: "Number of orders placed by customers",
    },
  ];

  return (
    <div className="p-6 sm:p-8">
      <div className="mb-6 sm:mb-8 motion-safe:animate-fade-in-up">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Dashboard
        </h1>
        <p className="text-gray-400 text-sm mt-1">Welcome Back</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        {cards.map((card, index) => (
          <div
            key={card.label}
            className="group bg-white rounded-xl border border-gray-200 p-6 space-y-1 motion-safe:animate-fade-in-up hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            style={{
              animationDelay: `${index * 0.1}s`,
              animationFillMode: "backwards",
            }}
          >
            <div className="flex justify-between items-center">
              <p className="text-xs font-semibold text-gray-500">
                {card.label}
              </p>
              <div
                className={`${card.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}
              >
                <card.icon size={24} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            <p className="text-xs text-gray-500">{card.text}</p>
          </div>
        ))}
      </div>

      <div
        className="bg-white rounded-xl border border-gray-200 motion-safe:animate-fade-in-up"
        style={{ animationDelay: "0.3s", animationFillMode: "backwards" }}
      >
        <div className="px-6 py-4  ">
          <h2 className="text-xl font-semibold text-gray-900">
            Recent Products
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3.5 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="text-left py-3.5 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="text-left py-3.5 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="text-right py-3.5 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="text-center py-3.5 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {stats.recentProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    No products yet. Add your first product!
                  </td>
                </tr>
              ) : (
                stats.recentProducts.map((product, index) => (
                  <tr
                    key={product.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors motion-safe:animate-fade-in-up"
                    style={{
                      animationDelay: `${0.35 + index * 0.05}s`,
                      animationFillMode: "backwards",
                    }}
                  >
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0 ring-1 ring-black/5">
                          {product.image_url ? (
                            <Image
                              src={product.image_url}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                              N/A
                            </div>
                          )}
                        </div>
                        <span className="font-medium text-gray-900">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-6 text-gray-500 font-mono text-xs">
                      {product.sku}
                    </td>
                    <td className="py-3 px-6 text-gray-600">
                      {product.category?.name || "Uncategorized"}
                    </td>
                    <td className="py-3.5 px-6 text-right font-semibold text-gray-900">
                      ₦{product.price.toLocaleString()}
                    </td>
                    <td className="py-3 px-6 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.available
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {product.available ? "Available" : "Unavailable"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
