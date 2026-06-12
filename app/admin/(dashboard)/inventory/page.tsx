"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, X } from "lucide-react";
import ProductsTable from "@/components/admin/ProductsTable";
import EditProductDialog from "@/components/admin/EditProductDialog";
import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog";

interface Category {
  id: string;
  name: string;
  product_count: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  category_id: string;
  available: boolean;
  sku: string;
  created_at: string;
  category: { name: string } | null;
}

export default function InventoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [loading, setLoading] = useState(true);

  const [showEditProduct, setShowEditProduct] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [editTarget, setEditTarget] = useState<Product | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", page.toString());
      params.set("pageSize", pageSize.toString());
      if (search) params.set("search", search);
      if (filterCategory) params.set("categoryId", filterCategory);

      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      setProducts(data.products || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 0);
    } catch {
      console.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, filterCategory]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data.categories || []);
    } catch {
      console.error("Failed to fetch categories");
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = () => {
    setPage(1);
    setSearch(searchInput);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearch("");
    setPage(1);
  };

  const handleCategoryFilter = (categoryId: string) => {
    setFilterCategory(categoryId);
    setPage(1);
  };

  const handleEdit = (product: Product) => {
    setEditTarget(product);
    setShowEditProduct(true);
  };

  const handleDelete = (product: Product) => {
    setDeleteTarget(product);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/products/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Delete failed");
      }
      setDeleteTarget(null);
      fetchProducts();
      fetchCategories();
    } catch {
      console.error("Failed to delete product");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSuccess = () => {
    setShowEditProduct(false);
    fetchProducts();
    fetchCategories();
  };

  return (
    <div className="p-6">
      <div className="flex items-center mb-6 motion-safe:animate-fade-in-up">
        <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
        <button
          onClick={() => handleCategoryFilter("")}
          className={`relative p-4 rounded-xl border text-left transition-all motion-safe:animate-fade-in-up hover:shadow-sm active:scale-[0.98] ${
            filterCategory === ""
              ? "bg-gray-50 border-gray-900 ring-1 ring-gray-900"
              : "bg-white border-gray-200 hover:border-gray-400"
          }`}
          style={{ animationDelay: "0.05s", animationFillMode: "backwards" }}
        >
          <div className="flex justify-between">
            <p className="text-xs font-medium text-gray-500">All</p>
            {filterCategory === "" && (
              <span className="animate-pulse w-3 h-3 bg-gray-900 rounded-full border-2 border-white" />
            )}
          </div>
          <p className="text-lg font-bold text-gray-900">{total}</p>
        </button>
        {categories.map((cat, index) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryFilter(cat.id)}
            className={`relative p-4 rounded-xl border text-left transition-all motion-safe:animate-fade-in-up hover:shadow-sm active:scale-[0.98] ${
              filterCategory === cat.id
                ? "bg-gray-50 border-gray-900 ring-1 ring-gray-900"
                : "bg-white border-gray-200 hover:border-gray-400"
            }`}
            style={{ animationDelay: `${0.05 + (index + 1) * 0.05}s`, animationFillMode: "backwards" }}
          >
            <div className="flex justify-between">
              <p className="text-xs font-medium text-gray-500">{cat.name}</p>
              {filterCategory === cat.id && (
                <span className="animate-pulse w-3 h-3 bg-gray-900 rounded-full border-2 border-white" />
              )}
            </div>
            <p className="text-lg font-bold text-gray-900">
              {cat.product_count}
            </p>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 mb-6 motion-safe:animate-fade-in-up" style={{ animationDelay: "0.15s", animationFillMode: "backwards" }}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-right ml-auto gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search products..."
                className="w-full pl-9 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-all"
              />
              {searchInput && (
                <button
                  onClick={clearSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

        <ProductsTable
          products={products}
          total={total}
          page={page}
          pageSize={pageSize}
          totalPages={totalPages}
          onPageChange={setPage}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />
      </div>

      <EditProductDialog
        isOpen={showEditProduct}
        product={editTarget}
        onClose={() => {
          setShowEditProduct(false);
          setEditTarget(null);
        }}
        onSuccess={handleSuccess}
      />

      <DeleteConfirmDialog
        isOpen={deleteTarget !== null}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteLoading}
      />
    </div>
  );
}
