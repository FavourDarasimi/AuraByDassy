import { getFeaturedProducts } from "@/supabase/lib/queries";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl xl:max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <p className="text-[10px] font-bold text-gray-400 tracking-[0.25em] uppercase mb-3">
              Most Wanted
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight">
              Featured Products
            </h2>
            <div className="w-10 h-[3px] bg-gray-900 mt-4" />
          </div>
          <Link
            href="/shop"
            className="hidden sm:inline-flex items-center gap-2 text-xs font-bold text-gray-900 uppercase tracking-[0.18em] border-b border-gray-900 pb-0.5 hover:opacity-60 transition-opacity duration-200 whitespace-nowrap self-end"
          >
            View all
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 xl:gap-x-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-12 text-center sm:hidden">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gray-900 text-white text-xs font-bold uppercase tracking-[0.18em] hover:bg-black transition-colors whitespace-nowrap"
          >
            View All Collections
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Desktop bottom CTA (only shows if no sidebar header) */}
        <div className="mt-14 text-center hidden sm:block">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 px-10 py-3.5 border border-gray-900 text-gray-900 text-xs font-bold uppercase tracking-[0.18em] hover:bg-gray-900 hover:text-white transition-all duration-200 whitespace-nowrap"
          >
            View All Collections
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
