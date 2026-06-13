"use client";

import Link from "next/link";
import Image from "next/image";
import { FaWhatsapp } from "react-icons/fa";
import { ShoppingBag, Trash2, Minus, Plus, ArrowLeft } from "lucide-react";
import { useCart } from "@/lib/cart";
import { WHATSAPP_LINK } from "@/lib/constants";

export default function CartPage() {
  const { items, itemCount, total, removeItem, updateQuantity, clearCart } =
    useCart();

  const buildWhatsAppMessage = () => {
    const lines = items.map(
      (item, i) =>
        `${i + 1}. ${item.name} (${item.sku}) × ${item.quantity} — ₦${(item.price * item.quantity).toLocaleString()}`,
    );
    return [
      "Hello AuraByDassy, I would like to place an order:",
      "",
      ...lines,
      "",
      `🛒 Total: ₦${total.toLocaleString()}`,
    ].join("\n");
  };

  const handleWhatsAppOrder = () => {
    if (items.length === 0) return;
    const url = WHATSAPP_LINK(buildWhatsAppMessage());
    window.open(url, "_blank", "noopener,noreferrer");
    clearCart();
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-28">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
          <ShoppingBag className="w-8 h-8 text-gray-300" />
        </div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight mb-2">
          Your cart is empty
        </h1>
        <p className="text-sm text-gray-400 mb-8 max-w-xs">
          Looks like you haven&apos;t added anything yet. Browse our collection
          and find your style.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white text-xs font-bold uppercase tracking-[0.18em] hover:bg-black transition-colors"
        >
          <ShoppingBag className="w-4 h-4" />
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ══════════════════════════════════════════════════════
          HERO / BANNER  (matches shop page)
      ══════════════════════════════════════════════════════ */}
      <section className="relative bg-[#0a0a0a] overflow-hidden">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Right-side accent */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-white/[0.03] to-transparent" />

        <div className="relative max-w-7xl xl:max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-[0.2em] mb-8">
            <Link href="/" className="hover:text-white transition-colors duration-200">Home</Link>
            <span className="text-gray-600">›</span>
            <span className="text-white">Cart</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            {/* Left: Title block */}
            <div className="max-w-xl">
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.25em] mb-4">
                Your Selection
              </p>
              <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.05] mb-5">
                Shopping<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400">
                  Cart
                </span>
              </h1>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-md">
                {itemCount} {itemCount === 1 ? "item" : "items"} in your bag —
                review and place your order.
              </p>
            </div>

            {/* Right: Continue Shopping link */}
            <div className="flex-shrink-0">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-5 py-3 border border-white/10 text-[10px] font-bold text-gray-400 uppercase tracking-[0.18em] hover:text-white hover:border-white/30 transition-all duration-200"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Cart content */}
      <div className="max-w-7xl xl:max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
          {/* Items list */}
          <div className="flex-1 min-w-0">
            <div className="divide-y divide-gray-100">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 sm:gap-5 py-5 sm:py-6">
                  {/* Image */}
                  <div className="relative w-20 h-24 sm:w-24 sm:h-28 bg-[#f5f5f5] flex-shrink-0 overflow-hidden">
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-200">
                        <ShoppingBag className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide truncate">
                          {item.name}
                        </h3>
                        <p className="text-[11px] text-gray-400 mt-0.5 font-mono">
                          {item.sku}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 text-red-500 hover:text-red-600 transition-colors flex-shrink-0"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2 sm:mt-0">
                      {/* Quantity controls */}
                      <div className="flex items-center border border-gray-200">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        </button>
                        <span className="w-8 sm:w-10 text-center text-xs sm:text-sm font-semibold text-gray-900 tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-900 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <span className="text-sm sm:text-base font-bold text-gray-900">
                          ₦{(item.price * item.quantity).toLocaleString()}
                        </span>
                        {item.quantity > 1 && (
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            ₦{item.price.toLocaleString()} each
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="w-full lg:w-80 xl:w-96 flex-shrink-0">
            <div className="bg-[#f9f9f9] p-6 sm:p-8 lg:sticky lg:top-28">
              <h2 className="text-[10px] font-bold text-gray-400 tracking-[0.25em] uppercase mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Items</span>
                  <span className="font-medium text-gray-900">{itemCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium text-gray-900">
                    ₦{total.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 mt-4 pt-4">
                <div className="flex justify-between text-base">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-black text-gray-900 text-lg">
                    ₦{total.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={handleWhatsAppOrder}
                className="mt-6 w-full flex items-center justify-center gap-2.5 py-3.5 bg-[#25D366] text-white text-sm font-bold uppercase tracking-[0.15em] hover:bg-[#1ebd5a] transition-all duration-200 shadow-[0_0_24px_rgba(37,211,102,0.2)]"
              >
                <FaWhatsapp className="w-5 h-5" />
                Order via WhatsApp
              </button>

              <p className="text-[10px] text-gray-400 text-center mt-3 leading-relaxed">
                You&apos;ll be redirected to WhatsApp to confirm your order.
                Your cart will be cleared after sending.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
