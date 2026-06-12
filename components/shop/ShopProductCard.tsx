"use client";

import Image from "next/image";
import { FaWhatsapp } from "react-icons/fa";
import { Product } from "@/components/ProductCard";

const COLOR_MAP: Record<string, string> = {
  black: "#1a1a1a",
  white: "#f5f5f5",
  gray: "#9ca3af",
  grey: "#9ca3af",
  red: "#ef4444",
  blue: "#3b82f6",
  navy: "#1e3a5f",
  green: "#22c55e",
  olive: "#6b7c3b",
  brown: "#92400e",
  beige: "#d4b896",
  cream: "#f5f0e8",
  khaki: "#c3b091",
  camel: "#c19a6b",
  tan: "#d2b48c",
  yellow: "#eab308",
  orange: "#f97316",
  pink: "#ec4899",
  purple: "#a855f7",
  burgundy: "#800020",
  maroon: "#800000",
  teal: "#14b8a6",
  charcoal: "#374151",
  sand: "#e8d5b0",
};

function getColorHex(colorName: string): string {
  const key = colorName.toLowerCase().trim();
  return COLOR_MAP[key] || "#e5e7eb";
}

export default function ShopProductCard({ product }: { product: Product }) {
  const imageUrl = product.image_url;

  const message = `Hello AuraByDassy, I want to order:\n\nProduct: ${product.name}\nPrice: ₦${product.price}\nProduct ID: ${product.sku}`.trim();

  // Extract color swatches from product name keywords
  const colorKeywords = Object.keys(COLOR_MAP).filter((c) =>
    product.name.toLowerCase().includes(c)
  );
  const swatches = colorKeywords.length > 0 ? colorKeywords.slice(0, 5) : [];

  return (
    <div className="group flex flex-col rounded-lg overflow-hidden bg-white hover:shadow-lg transition-shadow duration-300">
      {/* Image */}
      <div className="relative w-full aspect-[3/4] bg-gray-100 overflow-hidden rounded-lg">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
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
          </div>
        )}

        {/* WhatsApp CTA overlay on hover */}
        <a
          href={`https://wa.me/2349027458696?text=${encodeURIComponent(message)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 py-3 bg-[#25D366]/95 text-white text-xs font-bold tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          <FaWhatsapp className="w-4 h-4" />
          Order on WhatsApp
        </a>
      </div>

      {/* Info */}
      <div className="pt-3 pb-1 px-0.5">
        <h3 className="text-xs font-semibold text-gray-800 uppercase tracking-wide truncate leading-tight">
          {product.name}
        </h3>
        <div className="flex items-center justify-between mt-1">
          <span className="text-sm font-bold text-gray-900">
            ₦{product.price?.toLocaleString()}
          </span>
        </div>

        {/* Color swatches */}
        {swatches.length > 0 && (
          <div className="flex gap-1.5 mt-2">
            {swatches.map((color) => (
              <span
                key={color}
                className="w-4 h-4 rounded-full border border-gray-200 flex-shrink-0"
                style={{ backgroundColor: getColorHex(color) }}
                title={color}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
