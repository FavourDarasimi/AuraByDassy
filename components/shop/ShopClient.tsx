"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import FilterSidebar, { FilterState } from "@/components/shop/FilterSidebar";
import ProductCard, { Product } from "@/components/ProductCard";
import { SlidersHorizontal, X, ChevronDown, PackageSearch } from "lucide-react";

type CategoryWithCount = {
  name: string;
  count: number;
};

type Props = {
  products: Product[];
  allCategories: { id: string; name: string }[];
};

const SORT_OPTIONS = [
  { label: "Newest",           value: "newest" },
  { label: "Price: Low → High", value: "price_asc" },
  { label: "Price: High → Low", value: "price_desc" },
  { label: "Name A–Z",         value: "name_asc" },
];

const PRICE_MIN = 0;
const PRICE_MAX = 5000000;

function buildCategoryTree(
  allCategories: { id: string; name: string }[],
  products: Product[]
): CategoryWithCount[] {
  const countMap: Record<string, number> = {};
  products.forEach((p) => {
    const cName = p.category?.name;
    if (cName) countMap[cName] = (countMap[cName] || 0) + 1;
  });
  return allCategories.map((cat) => ({
    name: cat.name,
    count: countMap[cat.name] || 0,
  }));
}

// ── Skeleton card ─────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="flex flex-col animate-pulse">
      <div className="w-full aspect-[3/4] bg-gray-200" />
      <div className="pt-3 space-y-2">
        <div className="h-2.5 w-16 bg-gray-200 rounded" />
        <div className="h-3 w-3/4 bg-gray-200 rounded" />
        <div className="h-3 w-1/2 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

export default function ShopClient({ products, allCategories }: Props) {
  const searchParams = useSearchParams();
  const queryParam    = searchParams.get("query") || "";
  const categoryParam = searchParams.get("category") || "";

  const [filters, setFilters] = useState<FilterState>({
    categories: categoryParam ? [categoryParam] : [],
    priceMin: PRICE_MIN,
    priceMax: PRICE_MAX,
  });
  const [sort, setSort]               = useState("newest");
  const [sortOpen, setSortOpen]       = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [loading, setLoading]         = useState(true);

  // Simulate brief loading skeleton on mount
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  // Sync URL category param
  useEffect(() => {
    if (categoryParam) {
      setFilters((prev) => ({ ...prev, categories: [categoryParam] }));
    }
  }, [categoryParam]);

  const categoryTree = useMemo(
    () => buildCategoryTree(allCategories, products),
    [allCategories, products]
  );

  // ── Filtering + sorting ────────────────────────────────────
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (queryParam) {
      const q = queryParam.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category?.name?.toLowerCase().includes(q)
      );
    }

    if (filters.categories.length > 0) {
      result = result.filter((p) =>
        filters.categories.includes(p.category?.name || "")
      );
    }

    result = result.filter(
      (p) => p.price >= filters.priceMin && p.price <= filters.priceMax
    );

    switch (sort) {
      case "price_asc":  result.sort((a, b) => a.price - b.price); break;
      case "price_desc": result.sort((a, b) => b.price - a.price); break;
      case "name_asc":   result.sort((a, b) => a.name.localeCompare(b.name)); break;
      // newest → keep original order (most recent first)
    }

    return result;
  }, [products, filters, queryParam, sort]);

  // ── Applied chips ──────────────────────────────────────────
  const appliedChips = useMemo(() => {
    const chips: { label: string; onRemove: () => void }[] = [];
    filters.categories.forEach((cat) =>
      chips.push({
        label: cat,
        onRemove: () =>
          setFilters((prev) => ({
            ...prev,
            categories: prev.categories.filter((c) => c !== cat),
          })),
      })
    );
    if (filters.priceMin !== PRICE_MIN || filters.priceMax !== PRICE_MAX) {
      chips.push({
        label: `₦${filters.priceMin.toLocaleString()} – ₦${filters.priceMax.toLocaleString()}`,
        onRemove: () =>
          setFilters((prev) => ({ ...prev, priceMin: PRICE_MIN, priceMax: PRICE_MAX })),
      });
    }
    return chips;
  }, [filters]);

  const handleFiltersChange = useCallback((f: FilterState) => setFilters(f), []);
  const resetFilters = () =>
    setFilters({ categories: [], priceMin: PRICE_MIN, priceMax: PRICE_MAX });

  const currentSortLabel = SORT_OPTIONS.find((o) => o.value === sort)?.label || "Sort";

  return (
    <div className="min-h-screen bg-white">

      {/* ══════════════════════════════════════════════════════
          HERO / BANNER
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
            <a href="/" className="hover:text-white transition-colors duration-200">Home</a>
            <span className="text-gray-600">›</span>
            <span className="text-white">Shop</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            {/* Left: Title block */}
            <div className="max-w-xl">
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.25em] mb-4">
                AuraByDassy — Premium Fashion
              </p>
              <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.05] mb-5">
                Our<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400">
                  Collection
                </span>
              </h1>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-md">
                Bold silhouettes. Elevated essentials. Every piece curated for the modern style-forward individual.
              </p>
            </div>

            {/* Right: Stats */}
            <div className="flex items-stretch gap-2 sm:gap-4 lg:gap-6">
              <div className="border border-white/10 px-3 sm:px-5 py-3 sm:py-5 flex flex-col gap-1 min-w-0">
                <span className="text-xl sm:text-3xl font-black text-white tabular-nums">{products.length}</span>
                <span className="text-[9px] sm:text-[10px] text-gray-500 uppercase tracking-[0.15em] whitespace-nowrap">Products</span>
              </div>
              <div className="border border-white/10 px-3 sm:px-5 py-3 sm:py-5 flex flex-col gap-1 min-w-0">
                <span className="text-xl sm:text-3xl font-black text-white tabular-nums">{allCategories.length}</span>
                <span className="text-[9px] sm:text-[10px] text-gray-500 uppercase tracking-[0.15em] whitespace-nowrap">Categories</span>
              </div>
              <div className="border border-white/10 px-3 sm:px-5 py-3 sm:py-5 flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                  <span className="text-xl sm:text-3xl font-black text-white tabular-nums">
                    {products.filter((p) => p.available !== false).length}
                  </span>
                </div>
                <span className="text-[9px] sm:text-[10px] text-gray-500 uppercase tracking-[0.15em] whitespace-nowrap">In Stock</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          MAIN LAYOUT
      ══════════════════════════════════════════════════════ */}
      <div className="max-w-7xl xl:max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="flex gap-10 xl:gap-14 items-start">

          {/* ── Sidebar ─────────────────────────────────── */}
          <div className="hidden lg:block w-52 xl:w-56 flex-shrink-0 sticky top-24">
            <FilterSidebar
              categories={categoryTree}
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />
          </div>

          {/* ── Content area ────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 pb-5 border-b border-gray-100">
              {/* Left: result count + chips */}
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs text-gray-400 uppercase tracking-[0.15em]">
                  <span className="text-gray-900 font-bold">{filteredProducts.length}</span>
                  {" "}of{" "}
                  <span className="text-gray-900 font-bold">{products.length}</span>
                  {" "}results
                  {(queryParam || filters.categories.length > 0) && !loading && (
                    <span className="ml-1 italic normal-case tracking-normal text-gray-500">
                      {queryParam
                        ? `for "${queryParam}"`
                        : `in "${filters.categories.join(", ")}"`}
                    </span>
                  )}
                </p>

                {appliedChips.map((chip, i) => (
                  <button
                    key={i}
                    onClick={chip.onRemove}
                    className="flex items-center gap-1.5 px-2.5 py-1 border border-gray-300 text-[10px] font-semibold text-gray-600 uppercase tracking-widest hover:border-gray-900 hover:text-gray-900 transition-all duration-150"
                  >
                    {chip.label}
                    <X className="w-2.5 h-2.5" />
                  </button>
                ))}
              </div>

              {/* Right: mobile filter + sort */}
              <div className="flex items-center gap-2 ml-auto">
                {/* Mobile filter */}
                <button
                  onClick={() => setMobileOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-3.5 py-2 border border-gray-200 text-xs font-semibold uppercase tracking-widest text-gray-700 hover:border-gray-900 transition-colors"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Filter
                </button>

                {/* Sort */}
                <div className="relative">
                  <button
                    onClick={() => setSortOpen((p) => !p)}
                    className="flex items-center gap-2.5 px-3.5 py-2 border border-gray-200 text-xs font-semibold uppercase tracking-widest text-gray-700 hover:border-gray-900 transition-colors"
                  >
                    <span className="text-gray-400 normal-case tracking-normal font-normal">Sort:</span>
                    {currentSortLabel}
                    <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${sortOpen ? "rotate-180" : ""}`} />
                  </button>
                  {sortOpen && (
                    <>
                      <div className="fixed inset-0 z-20" onClick={() => setSortOpen(false)} />
                      <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-gray-200 shadow-xl z-30">
                        {SORT_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => { setSort(opt.value); setSortOpen(false); }}
                            className={`block w-full text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest transition-colors ${
                              sort === opt.value
                                ? "bg-gray-900 text-white"
                                : "text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Product Grid or States */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8 sm:gap-x-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              /* Empty state */
              <div className="flex flex-col items-center justify-center py-28 text-center">
                <PackageSearch className="w-12 h-12 text-gray-200 mb-5" />
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-[0.2em] mb-2">
                  No Products Found
                </h3>
                <p className="text-xs text-gray-400 max-w-[240px] leading-relaxed mb-6">
                  Try widening your filters or browsing a different category.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 bg-gray-900 text-white text-[11px] font-bold uppercase tracking-[0.18em] hover:bg-black transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          MOBILE FILTER DRAWER
      ══════════════════════════════════════════════════════ */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-[280px] bg-white overflow-y-auto flex flex-col">
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-900">
                Filter Products
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-900 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sidebar content */}
            <div className="flex-1 px-5 py-4 overflow-y-auto">
              <FilterSidebar
                categories={categoryTree}
                filters={filters}
                onFiltersChange={handleFiltersChange}
              />
            </div>

            {/* Footer CTA */}
            <div className="px-5 py-4 border-t border-gray-100">
              <button
                onClick={() => setMobileOpen(false)}
                className="w-full py-3 bg-gray-900 text-white text-xs font-bold uppercase tracking-[0.18em] hover:bg-black transition-colors"
              >
                View {filteredProducts.length} results
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
