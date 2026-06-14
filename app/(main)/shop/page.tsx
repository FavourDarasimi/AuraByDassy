import type { Metadata } from "next";
import { Suspense } from "react";
import { getProducts, getCategories } from "@/supabase/lib/queries";
import { SITE_KEYWORDS } from "@/lib/seo";
import { ProductWithCategory } from "@/supabase/lib/types";
import ShopClient from "@/components/shop/ShopClient";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Shop",
    description:
      "Browse our full collection of premium fashion pieces. Filter by category, price and availability to find exactly what you're looking for.",
    keywords: [...SITE_KEYWORDS, "shop fashion online Nigeria", "premium fashion collection", "buy clothes Lagos"],
  openGraph: {
    title: "Shop – AuraByDassy",
    description:
      "Browse our full collection of premium fashion pieces. Filter by category, price and availability at AuraByDassy.",
  },
};

async function ShopPage() {
  const [products, categories] = await Promise.all([
    getProducts({ availableOnly: true }),
    getCategories(),
  ]);

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 border-2 border-gray-800 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-gray-500">Loading products…</p>
          </div>
        </div>
      }
    >
      <ShopClient products={products} allCategories={categories} />
    </Suspense>
  );
}

export default ShopPage;
