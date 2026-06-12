"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import AddProductDialog from "@/components/admin/AddProductDialog";
import AddCategoryDialog from "@/components/admin/AddCategoryDialog";
import SpeedDialFab from "@/components/admin/SpeedDialFab";

export default function AdminHeader() {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);

  const handleSuccess = () => {
    setShowAddProduct(false);
    setShowAddCategory(false);
    window.location.reload();
  };

  return (
    <>
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 px-6 py-3 hidden md:flex items-center justify-end gap-3 lg:pl-4">
        <button
          onClick={() => setShowAddCategory(true)}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-900 transition-colors flex items-center gap-2 whitespace-nowrap"
        >
          <Plus size={16} />
          Add Category
        </button>
        <button
          onClick={() => setShowAddProduct(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-black transition-colors flex items-center gap-2 whitespace-nowrap"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      <SpeedDialFab
        onAddCategory={() => setShowAddCategory(true)}
        onAddProduct={() => setShowAddProduct(true)}
      />

      <AddProductDialog
        isOpen={showAddProduct}
        onClose={() => setShowAddProduct(false)}
        onSuccess={handleSuccess}
      />

      <AddCategoryDialog
        isOpen={showAddCategory}
        onClose={() => setShowAddCategory(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
}
