"use client";

import { useState, useCallback } from "react";
import { ChevronDown } from "lucide-react";

export type FilterState = {
  categories: string[];
  priceMin: number;
  priceMax: number;
};

type CategoryWithCount = {
  name: string;
  count: number;
};

const PRICE_MIN = 0;
const PRICE_MAX = 5000000;

type Props = {
  categories: CategoryWithCount[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
};

export default function FilterSidebar({ categories, filters, onFiltersChange }: Props) {
  const [catOpen, setCatOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);

  const toggleCategory = useCallback(
    (name: string) => {
      const next = filters.categories.includes(name)
        ? filters.categories.filter((c) => c !== name)
        : [...filters.categories, name];
      onFiltersChange({ ...filters, categories: next });
    },
    [filters, onFiltersChange]
  );

  const clearAll = () =>
    onFiltersChange({ categories: [], priceMin: PRICE_MIN, priceMax: PRICE_MAX });

  const hasFilters =
    filters.categories.length > 0 ||
    filters.priceMin !== PRICE_MIN ||
    filters.priceMax !== PRICE_MAX;

  return (
    <aside className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xs lg:text-sm font-bold text-gray-900 uppercase tracking-[0.2em]">
          Filters
        </h2>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-[10px] lg:text-xs font-semibold text-gray-400 hover:text-gray-900 uppercase tracking-widest underline underline-offset-2 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* ── Category ── */}
      <div className="border-t border-gray-200 py-5">
        <button
          onClick={() => setCatOpen((p) => !p)}
          className="flex items-center justify-between w-full group"
        >
          <span className="text-[11px] lg:text-sm font-bold uppercase tracking-[0.18em] text-gray-900">
            Category
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
              catOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {catOpen && (
          <div className="mt-4 space-y-1">
            {categories.length === 0 && (
              <p className="text-xs lg:text-sm text-gray-400 italic">No categories found</p>
            )}
            {categories.map((cat) => {
              const checked = filters.categories.includes(cat.name);
              return (
                <label
                  key={cat.name}
                  className="flex items-center justify-between cursor-pointer py-1.5 group/item"
                >
                  <div className="flex items-center gap-2.5">
                    {/* Custom checkbox */}
                    <div
                      onClick={() => toggleCategory(cat.name)}
                      className={`w-4 h-4 border flex items-center justify-center flex-shrink-0 transition-all duration-150 ${
                        checked
                          ? "bg-gray-900 border-gray-900"
                          : "border-gray-300 group-hover/item:border-gray-600"
                      }`}
                    >
                      {checked && (
                        <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span
                      onClick={() => toggleCategory(cat.name)}
                      className={`text-xs lg:text-sm transition-colors ${
                        checked ? "text-gray-900 font-semibold" : "text-gray-500 group-hover/item:text-gray-900"
                      }`}
                    >
                      {cat.name}
                    </span>
                  </div>
                  <span className="text-[10px] lg:text-xs text-gray-400 tabular-nums">{cat.count}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Price Range ── */}
      <div className="border-t border-gray-200 py-5">
        <button
          onClick={() => setPriceOpen((p) => !p)}
          className="flex items-center justify-between w-full"
        >
          <span className="text-[11px] lg:text-sm font-bold uppercase tracking-[0.18em] text-gray-900">
            Price Range
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
              priceOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {priceOpen && (
          <div className="mt-5">
            {/* Slider track */}
            <div className="relative h-[3px] bg-gray-200 rounded-full mb-5">
              <div
                className="absolute h-full bg-gray-900 rounded-full"
                style={{
                  left: `${((filters.priceMin - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100}%`,
                  right: `${100 - ((filters.priceMax - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100}%`,
                }}
              />
              {/* Min thumb */}
              <input
                type="range"
                min={PRICE_MIN}
                max={PRICE_MAX}
                step={5000}
                value={filters.priceMin}
                onChange={(e) => {
                  const v = Math.min(Number(e.target.value), filters.priceMax - 5000);
                  onFiltersChange({ ...filters, priceMin: v });
                }}
                className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
                style={{ zIndex: filters.priceMin > PRICE_MAX - 5000 ? 5 : 3 }}
                aria-label="Minimum price"
              />
              {/* Max thumb */}
              <input
                type="range"
                min={PRICE_MIN}
                max={PRICE_MAX}
                step={5000}
                value={filters.priceMax}
                onChange={(e) => {
                  const v = Math.max(Number(e.target.value), filters.priceMin + 5000);
                  onFiltersChange({ ...filters, priceMax: v });
                }}
                className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
                style={{ zIndex: 4 }}
                aria-label="Maximum price"
              />
              {/* Visual thumb min */}
              <div
                className="absolute w-4 h-4 bg-white border-2 border-gray-900 rounded-full -translate-y-1/2 top-1/2 -translate-x-1/2 shadow-sm pointer-events-none"
                style={{ left: `${((filters.priceMin - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100}%` }}
              />
              {/* Visual thumb max */}
              <div
                className="absolute w-4 h-4 bg-white border-2 border-gray-900 rounded-full -translate-y-1/2 top-1/2 -translate-x-1/2 shadow-sm pointer-events-none"
                style={{ left: `${((filters.priceMax - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100}%` }}
              />
            </div>

            {/* Price inputs */}
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <p className="text-[10px] lg:text-xs uppercase tracking-wider text-gray-400 mb-1.5">Min</p>
                <div className="flex items-center border border-gray-200 px-2.5 py-2 gap-1 focus-within:border-gray-900 transition-colors">
                  <span className="text-xs text-gray-400">₦</span>
                  <input
                    type="number"
                    value={filters.priceMin}
                    onChange={(e) =>
                      onFiltersChange({ ...filters, priceMin: Math.max(PRICE_MIN, Number(e.target.value)) })
                    }
                    className="w-full text-xs text-gray-800 outline-none bg-transparent"
                  />
                </div>
              </div>
              <div className="w-4 h-px bg-gray-300 mt-5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-[10px] lg:text-xs uppercase tracking-wider text-gray-400 mb-1.5">Max</p>
                <div className="flex items-center border border-gray-200 px-2.5 py-2 gap-1 focus-within:border-gray-900 transition-colors">
                  <span className="text-xs text-gray-400">₦</span>
                  <input
                    type="number"
                    value={filters.priceMax}
                    onChange={(e) =>
                      onFiltersChange({ ...filters, priceMax: Math.min(PRICE_MAX, Number(e.target.value)) })
                    }
                    className="w-full text-xs text-gray-800 outline-none bg-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200" />
    </aside>
  );
}
