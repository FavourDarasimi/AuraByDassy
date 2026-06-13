"use client";

import Image from "next/image";
import { ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/lib/cart";
import { showCartToast } from "@/components/CartToast";

export type Product = {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  category: { name: string } | { name: string };
  sku: string;
  available: boolean;
};

export default function ProductCard({ product }: { product: Product }) {
  const imageUrl = product.image_url;
  const isAvailable = product.available !== false;
  const { addItem, isInCart } = useCart();
  const inCart = isInCart(product.id);

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

  return (
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
            <span className="text-xs tracking-widest uppercase">No image</span>
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
        <h3 className="text-sm sm:text-[13px] font-bold text-gray-900 uppercase tracking-wide leading-snug line-clamp-2">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-center justify-between mt-0.5">
          <span className="text-sm sm:text-base text-gray-600">
            ₦{product.price?.toLocaleString()}
          </span>
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
  );
}
