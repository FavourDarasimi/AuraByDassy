"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import AddProductDialog from "@/components/admin/AddProductDialog";
import AddCategoryDialog from "@/components/admin/AddCategoryDialog";

interface AdminDialogContextValue {
  openAddCategory: () => void;
  openAddProduct: () => void;
}

const AdminDialogContext = createContext<AdminDialogContextValue | null>(null);

export function AdminDialogProvider({ children }: { children: ReactNode }) {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);

  const handleSuccess = () => {
    setShowAddProduct(false);
    setShowAddCategory(false);
    window.location.reload();
  };

  const openAddCategory = useCallback(() => setShowAddCategory(true), []);
  const openAddProduct = useCallback(() => setShowAddProduct(true), []);

  return (
    <AdminDialogContext.Provider value={{ openAddCategory, openAddProduct }}>
      {children}

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
    </AdminDialogContext.Provider>
  );
}

export function useAdminDialogs() {
  const ctx = useContext(AdminDialogContext);
  if (!ctx) {
    throw new Error("useAdminDialogs must be used within AdminDialogProvider");
  }
  return ctx;
}
