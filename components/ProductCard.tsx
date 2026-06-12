"use client";

import Image from "next/image";
import { FaWhatsapp } from "react-icons/fa";

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

  const message = `Hello AuraByDassy, I want to order:\n\nProduct: ${product.name}\nPrice: ₦${product.price?.toLocaleString()}\nProduct ID: ${product.sku}`;

  return (
    <article className="group flex flex-col bg-white">
      {/* ── Image container ── */}
      <div className="relative w-full aspect-4/5 bg-[#f5f5f5] overflow-hidden">
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

        {/* Hover overlay — desktop only */}
        <div className="hidden md:flex absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-400 ease-out flex-col items-center justify-end pb-5 gap-2.5 px-4"></div>
      </div>

      {/* ── Info ── */}
      <div className="pt-3 pb-4 px-0.5 flex flex-col gap-1">
        {/* Name */}
        <h3 className="text-sm sm:text-[13px] font-bold text-gray-900 uppercase tracking-wide leading-snug line-clamp-2">
          {product.name}
        </h3>

        {/* Price + availability row */}
        <div className="flex items-center justify-between mt-0.5">
          <span className="text-sm sm:text-base text-gray-600">
            ₦{product.price?.toLocaleString()}
          </span>
        </div>

        <a
          href={`https://wa.me/2349027458696?text=${encodeURIComponent(message)}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="w-full hidden md:flex items-center justify-center gap-2 py-2.5 bg-[#25D366] text-white text-xs font-bold tracking-wider uppercase  transition-all duration-300 delay-75 hover:bg-[#1ebd5a]"
        >
          <FaWhatsapp className="w-4 h-4" />
          Order on WhatsApp
        </a>

        {/* Mobile-only WhatsApp button — always visible, no hover needed */}
        <a
          href={`https://wa.me/2349027458696?text=${encodeURIComponent(message)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="md:hidden mt-2 flex items-center justify-center gap-2 w-full py-2.5 bg-[#25D366] active:bg-[#1ebd5a] text-white text-xs font-bold tracking-wider uppercase whitespace-nowrap transition-colors"
        >
          <FaWhatsapp className="w-4 h-4" />
          Order
        </a>
      </div>
    </article>
  );
}
