"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ShoppingBag, Check, X, Eye } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useCart } from "@/lib/cart";
import { showCartToast } from "@/components/CartToast";
import { WHATSAPP_LINK } from "@/lib/constants";

export type Product = {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  category: { name: string } | { name: string };
  sku: string;
  available: boolean;
  description: string | null;
};

export default function ProductCard({ product }: { product: Product }) {
  const imageUrl = product.image_url;
  const isAvailable = product.available !== false;
  const { addItem, isInCart } = useCart();
  const inCart = isInCart(product.id);

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    if (!isPopupOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsPopupOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isPopupOpen]);

  const handleClose = useCallback(() => {
    setIsPopupOpen(false);
  }, []);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      sku: product.sku,
    });
    showCartToast(product.name);
  };

  const handleAddToCartPopup = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!inCart) {
      handleAddToCart();
    }
  };

  const openPopup = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPopupOpen(true);
  };

  return (
    <>
      <article className="group flex flex-col bg-white">
        {/* ── Image container ── */}
        <div className="relative w-full aspect-[4/5] bg-[#f5f5f5] overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-300">
              <svg
                className="w-12 h-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-xs tracking-widest uppercase">
                No image
              </span>
            </div>
          )}

          {/* Hover overlay with Add to Cart — desktop only */}
          <div className="hidden md:flex absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-400 ease-out flex-col items-center justify-end pb-5 gap-2.5 px-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!inCart) handleAddToCart();
              }}
              disabled={inCart}
              className={`w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold tracking-wider uppercase transition-all duration-300 ${
                inCart
                  ? "bg-white/90 text-gray-900 cursor-default"
                  : "bg-white text-gray-900 hover:bg-gray-100 cursor-pointer"
              }`}
            >
              {inCart ? (
                <>
                  <Check className="w-4 h-4" />
                  Added
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  Add to Cart
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── Info ── */}
        <div className="pt-3 pb-4 px-0.5 flex flex-col gap-1">
          {/* Name */}
          <h3 className="text-sm sm:text-[13px] font-bold text-gray-900 uppercase tracking-wide truncate">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-center justify-between mt-0.5">
            <span className="text-sm sm:text-base text-gray-600">
              ₦{product.price?.toLocaleString()}
            </span>
            <button
              onClick={openPopup}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-900 uppercase tracking-[0.18em] border-b border-gray-900 pb-0.5 hover:opacity-60 transition-opacity duration-200 whitespace-nowrap cursor-pointer"
            >
              <Eye className="w-3 h-3" />
              Quick View
            </button>
          </div>

          {/* Mobile-only Add to Cart — always visible */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!inCart) handleAddToCart();
            }}
            disabled={inCart}
            className={`md:hidden mt-2 flex items-center justify-center gap-2 w-full py-2.5 text-xs font-bold tracking-wider uppercase transition-all ${
              inCart
                ? "bg-gray-200 text-gray-500 cursor-default"
                : "bg-gray-900 text-white active:bg-black"
            }`}
          >
            {inCart ? (
              <>
                <Check className="w-4 h-4" />
                Added
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </article>

      {/* ── Product Detail Popup ── */}
      {isPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/50 motion-safe:animate-fade-in"
            onClick={handleClose}
          />
          <div className="relative bg-white rounded-xl shadow-xl p-5 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto motion-safe:animate-scale-reveal">
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-0 right-0 p-1.5 text-gray-400 hover:text-gray-900 rounded-lg transition-colors z-10"
            >
              <X size={20} />
            </button>

            {/* Image */}
            <div className="relative w-full aspect-[4/3] bg-[#f5f5f5] rounded-lg overflow-hidden mb-5">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 500px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-300">
                  <svg
                    className="w-16 h-16"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-xs tracking-widest uppercase">
                    No image
                  </span>
                </div>
              )}
            </div>

            {/* Name */}
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 uppercase tracking-wide leading-tight">
              {product.name}
            </h3>

            {/* Price */}
            <p className="text-xl font-bold text-gray-900 mt-2">
              ₦{product.price?.toLocaleString()}
            </p>

            {/* Meta row: category · SKU */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 text-xs text-gray-500">
              <span className="font-medium uppercase tracking-[0.12em]">
                {product.category?.name || "Uncategorized"}
              </span>
              <span className="text-gray-300">|</span>
              <span className="font-mono">{product.sku}</span>
            </div>

            {/* Availability */}
            <div className="mt-3">
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                  isAvailable
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {isAvailable ? "Available" : "Unavailable"}
              </span>
            </div>

            {/* Description */}
            {product.description && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.18em] mb-2">
                  Description
                </p>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {/* Action buttons */}
            <div className="mt-5 flex gap-3">
              <button
                onClick={handleAddToCartPopup}
                disabled={inCart}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold tracking-wider uppercase transition-all duration-300 ${
                  inCart
                    ? "bg-gray-200 text-gray-500 cursor-default"
                    : "bg-gray-900 text-white hover:bg-black cursor-pointer active:bg-black"
                }`}
              >
                {inCart ? (
                  <>
                    <Check className="w-4 h-4" />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    Add to Cart
                  </>
                )}
              </button>

              <a
                href={WHATSAPP_LINK(
                  `Hello AuraByDassy, I want to order:\n\nProduct: ${product.name}\nPrice: ₦${product.price?.toLocaleString()}\nProduct ID: ${product.sku}`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold tracking-wider uppercase transition-all duration-300 bg-[#25D366] text-white hover:bg-[#1da851] cursor-pointer"
              >
                <FaWhatsapp className="w-4 h-4" />
                Order
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
