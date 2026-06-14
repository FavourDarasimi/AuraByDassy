import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getProductById } from "@/supabase/lib/queries";
import { SITE_KEYWORDS } from "@/lib/seo";
import { WHATSAPP_LINK } from "@/lib/constants";
import { HugeiconsIcon } from '@hugeicons/react';
import { WhatsappIcon } from '@hugeicons/core-free-icons';
import AddToCartButton from "./AddToCartButton";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return { title: "Product Not Found" };

  return {
    title: product.name,
    description: product.description || `Shop ${product.name} at AuraByDassy`,
    keywords: [...SITE_KEYWORDS, product.name, product.category?.name || ""].filter(Boolean),
    openGraph: {
      title: `${product.name} – AuraByDassy`,
      description: product.description || `Shop ${product.name} at AuraByDassy`,
      images: product.image_url ? [{ url: product.image_url }] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  const whatsappMessage = `Hello AuraByDassy, I want to order:\n\nProduct: ${product.name}\nPrice: ₦${product.price?.toLocaleString()}\nProduct ID: ${product.sku}`;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl xl:max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-[0.2em] mb-10">
          <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
          <span className="text-gray-300">/</span>
          <Link href="/shop" className="hover:text-gray-900 transition-colors">Shop</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-semibold">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          {/* Image */}
          <div className="relative w-full aspect-[4/5] bg-gray-50 rounded-xl overflow-hidden">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            {/* Category */}
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.25em] mb-3">
              {product.category?.name || "Uncategorized"}
            </p>

            {/* Name */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-4">
              ₦{product.price?.toLocaleString()}
            </p>

            {/* SKU + Availability */}
            <div className="flex items-center gap-4 mt-4">
              <span className="text-xs text-gray-500 font-mono">SKU: {product.sku}</span>
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                  product.available !== false
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {product.available !== false ? "Available" : "Unavailable"}
              </span>
            </div>

            {/* Description */}
            {product.description && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.18em] mb-3">
                  Description
                </p>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <AddToCartButton product={product} />
              <a
                href={WHATSAPP_LINK(whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3.5 text-xs font-bold tracking-wider uppercase transition-all duration-300 bg-[#25D366] text-white hover:bg-[#1da851]"
              >
                <HugeiconsIcon icon={WhatsappIcon} size={16} />
                Order on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
