"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Search, X, Plus, Pencil, Trash2 } from "lucide-react";
import ProductsTable from "@/components/admin/ProductsTable";
import EditProductDialog from "@/components/admin/EditProductDialog";
import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog";
import { useAdminDialogs } from "@/components/admin/AdminDialogContext";

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
  description: string | null;
  created_at: string;
  category: { name: string } | null;
}

export default function InventoryPage() {
  const { openAddCategory, openAddProduct } = useAdminDialogs();
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
  const [detailTarget, setDetailTarget] = useState<Product | null>(null);

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

  const handleSelect = (product: Product) => {
    setDetailTarget(product);
  };

  const handleEditFromDetail = () => {
    if (!detailTarget) return;
    setEditTarget(detailTarget);
    setShowEditProduct(true);
    setDetailTarget(null);
  };

  const handleDeleteFromDetail = () => {
    if (!detailTarget) return;
    setDeleteTarget(detailTarget);
    setDetailTarget(null);
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
    <div className="p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 motion-safe:animate-fade-in-up">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Inventory
        </h1>
        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={openAddCategory}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-900 active:scale-[0.97] transition-all duration-150 flex items-center gap-2 whitespace-nowrap"
          >
            <Plus size={16} />
            Add Category
          </button>
          <button
            onClick={openAddProduct}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-black active:scale-[0.97] transition-all duration-150 flex items-center gap-2 whitespace-nowrap"
          >
            <Plus size={16} />
            Add Product
          </button>
        </div>
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
          <div className="flex flex-col">
            <p className="text-xl font-bold text-gray-900">{total}</p>
            <p className="text-xs font-medium text-gray-500 mt-0.5">All</p>
          </div>
          {filterCategory === "" && (
            <span className="absolute top-3 right-3 w-2 h-2 bg-gray-900 rounded-full" />
          )}
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
            style={{
              animationDelay: `${0.05 + (index + 1) * 0.05}s`,
              animationFillMode: "backwards",
            }}
          >
            <div className="flex flex-col">
              <p className="text-xl font-bold text-gray-900">
                {cat.product_count}
              </p>
              <p className="text-xs font-medium text-gray-500 mt-0.5">
                {cat.name}
              </p>
            </div>
            {filterCategory === cat.id && (
              <span className="absolute top-3 right-3 w-2 h-2 bg-gray-900 rounded-full" />
            )}
          </button>
        ))}
      </div>

      <div
        className="bg-white rounded-xl border border-gray-200 mb-6 motion-safe:animate-fade-in-up"
        style={{ animationDelay: "0.15s", animationFillMode: "backwards" }}
      >
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-center justify-end gap-3">
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
                className="w-full pl-9 pr-8 py-2 border-[0.5px] border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-all"
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
          onSelect={handleSelect}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />
      </div>

      {/* Product Detail Slideover */}
      {detailTarget && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setDetailTarget(null)}
          />
          <div className="relative w-full max-w-lg bg-white shadow-2xl overflow-y-auto motion-safe:animate-slide-in-right">
            {/* Header */}
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Product Details</h2>
              <button
                onClick={() => setDetailTarget(null)}
                className="p-1.5 text-gray-400 hover:text-gray-900 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Image */}
              <div className="relative w-full aspect-[16/10] bg-gray-50 rounded-xl overflow-hidden ring-1 ring-black/5">
                {detailTarget.image_url ? (
                  <Image src={detailTarget.image_url} alt={detailTarget.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Name */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Product Name</p>
                <p className="text-lg font-bold text-gray-900">{detailTarget.name}</p>
              </div>

              {/* Price */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Price</p>
                <p className="text-xl font-bold text-gray-900">₦{detailTarget.price.toLocaleString()}</p>
              </div>

              {/* SKU */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">SKU</p>
                <p className="text-sm font-mono text-gray-700">{detailTarget.sku}</p>
              </div>

              {/* Category */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Category</p>
                <p className="text-sm text-gray-700">{detailTarget.category?.name || "Uncategorized"}</p>
              </div>

              {/* Availability */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Status</p>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                  detailTarget.available
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-red-50 text-red-700'
                }`}>
                  {detailTarget.available ? 'Available' : 'Unavailable'}
                </span>
              </div>

              {/* Description */}
              {detailTarget.description && (
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Description</p>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{detailTarget.description}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3">
              <button
                onClick={handleEditFromDetail}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold uppercase tracking-wider bg-gray-900 text-white rounded-lg hover:bg-black transition-colors"
              >
                <Pencil size={14} />
                Edit Product
              </button>
              <button
                onClick={handleDeleteFromDetail}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold uppercase tracking-wider bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

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
