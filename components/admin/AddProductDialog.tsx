"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import {
  Upload,
  X,
  Package,
  Tag,
  DollarSign,
  FileText,
  Grid,
  Sparkles,
  Eye,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface AddProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddProductDialog({
  isOpen,
  onClose,
  onSuccess,
}: AddProductDialogProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [available, setAvailable] = useState(true);
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const enterTimer = useRef<ReturnType<typeof requestAnimationFrame> | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      resetForm();
      enterTimer.current = requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
    } else {
      setVisible(false);
    }
    return () => {
      if (enterTimer.current) cancelAnimationFrame(enterTimer.current);
    };
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data.categories || []);
      if (!data.categories?.length) {
        setError("No categories available. Please add a category first.");
      }
    } catch {
      setError("Failed to load categories");
    }
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setCategoryId("");
    setAvailable(true);
    setDescription("");
    setImageFile(null);
    setImagePreview(null);
    setError("");
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) =>
        setImagePreview(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) =>
        setImagePreview(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleClose = useCallback(() => {
    if (loading) return;
    setVisible(false);
    setTimeout(() => onClose(), 300);
  }, [loading, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Product name is required");
      return;
    }
    if (!price || parseFloat(price) < 0) {
      setError("Valid price is required");
      return;
    }
    if (!categoryId) {
      setError("Please select a category");
      return;
    }

    setLoading(true);
    try {
      let imageUrl = "";

      if (imageFile) {
        const uploadForm = new FormData();
        uploadForm.append("file", imageFile);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadForm,
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok)
          throw new Error(uploadData.error || "Upload failed");
        imageUrl = uploadData.url;
      }

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          price: parseFloat(price),
          category_id: categoryId,
          available,
          image_url: imageUrl || undefined,
          description: description.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create product");
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen && !visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 motion-safe:transition-opacity motion-safe:duration-300 motion-safe:ease-in-out"
        style={{ opacity: visible ? 1 : 0 }}
        onClick={handleClose}
      />

      {/* Drawer Panel */}
      <div
        className="relative w-full max-w-lg bg-white h-full flex flex-col shadow-2xl motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
        style={{ transform: visible ? "translateX(0)" : "translateX(100%)" }}
      >
        {/* Gradient Header */}
        <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black px-6 pt-6 pb-8 overflow-hidden shrink-0">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/[0.03] rounded-full blur-2xl" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-white/[0.02] rounded-full blur-3xl" />
          <div className="absolute top-4 right-16 w-2 h-2 bg-white/10 rounded-full" />
          <div className="absolute bottom-6 right-8 w-1.5 h-1.5 bg-white/10 rounded-full" />

          <div className="flex items-start justify-between relative z-10">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-white/50 text-[10px] font-medium tracking-[0.25em] uppercase">
                <Package size={12} />
                AuraByDassy
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Add Product
              </h2>
              <p className="text-white/40 text-sm">
                Create a new product for your store
              </p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="p-1.5 text-white/40 hover:text-white rounded-lg transition-all duration-200 hover:bg-white/10 active:scale-90"
            >
              <X size={18} />
            </button>
          </div>

          {/* Step indicators */}
          <div className="flex items-center gap-3 mt-5 relative z-10">
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-white text-gray-900 flex items-center justify-center text-[10px] font-bold">
                1
              </span>
              <span className="text-[11px] font-medium text-white/80">
                Details
              </span>
            </div>
            <div className="w-6 h-px bg-white/20" />
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full border border-white/30 text-white/50 flex items-center justify-center text-[10px] font-bold">
                2
              </span>
              <span className="text-[11px] font-medium text-white/40">
                Media
              </span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-6 py-5 space-y-4"
        >
          {/* Section: Basic Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              <Sparkles size={12} />
              Basic Information
            </div>

            <div
              className="motion-safe:animate-field-in"
              style={{ animationDelay: "0ms" }}
            >
              <label
                htmlFor="productName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                <span className="flex items-center gap-1.5">
                  <Tag size={14} className="text-gray-400" />
                  Product Name
                </span>
              </label>
              <input
                id="productName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter product name"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all duration-200 placeholder:text-gray-300"
              />
            </div>

            <div
              className="motion-safe:animate-field-in"
              style={{ animationDelay: "60ms" }}
            >
              <label
                htmlFor="productPrice"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                <span className="flex items-center gap-1.5">
                  <DollarSign size={14} className="text-gray-400" />
                  Price (₦)
                </span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                  ₦
                </span>
                <input
                  id="productPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all duration-200 placeholder:text-gray-300"
                />
              </div>
            </div>

            <div
              className="motion-safe:animate-field-in"
              style={{ animationDelay: "120ms" }}
            >
              <label
                htmlFor="productDescription"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                <span className="flex items-center gap-1.5">
                  <FileText size={14} className="text-gray-400" />
                  Description
                </span>
              </label>
              <textarea
                id="productDescription"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter product description"
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all duration-200 placeholder:text-gray-300 resize-none"
              />
            </div>

            <div
              className="motion-safe:animate-field-in"
              style={{ animationDelay: "180ms" }}
            >
              <label
                htmlFor="productCategory"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                <span className="flex items-center gap-1.5">
                  <Grid size={14} className="text-gray-400" />
                  Category
                </span>
              </label>
              <select
                id="productCategory"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all duration-200 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20fill%3D%22%239ca3af%22%20d%3D%22M5.72%208.22a.75.75%200%200%201%201.06%200L10%2011.44l3.22-3.22a.75.75%200%201%201%201.06%201.06l-3.75%203.75a.75.75%200%200%201-1.06%200L5.72%209.28a.75.75%200%200%201%200-1.06z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[right_8px_center] bg-no-repeat pr-8"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-4">
              <Eye size={12} />
              Media & Status
            </div>

            {/* Image Upload */}
            <div
              className="motion-safe:animate-field-in mb-4"
              style={{ animationDelay: "240ms" }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="flex items-center gap-1.5">
                  <Upload size={14} className="text-gray-400" />
                  Product Image
                </span>
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all duration-200 ${
                  dragOver
                    ? "border-gray-900 bg-gray-50"
                    : imagePreview
                      ? "border-gray-300 hover:border-gray-900"
                      : "border-gray-200 hover:border-gray-400 hover:bg-gray-50/50"
                }`}
              >
                {imagePreview ? (
                  <div className="relative group">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      width={400}
                      height={160}
                      className="max-h-32 w-auto mx-auto rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-lg transition-colors duration-200 flex items-center justify-center">
                      <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        Click to change
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="py-3">
                    <Upload className="mx-auto h-7 w-7 text-gray-300" />
                    <p className="mt-1.5 text-sm text-gray-400">
                      {dragOver
                        ? "Drop image here"
                        : "Click or drag to upload"}
                    </p>
                    <p className="text-[10px] text-gray-300 mt-0.5">
                      PNG, JPG, WEBP
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>
            </div>

            {/* Availability Toggle */}
            <div
              className="motion-safe:animate-field-in flex items-center justify-between py-2"
              style={{ animationDelay: "300ms" }}
            >
              <span className="text-sm font-medium text-gray-700">
                Available for purchase
              </span>
              <button
                type="button"
                onClick={() => setAvailable(!available)}
                role="switch"
                aria-checked={available}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 cursor-pointer ${
                  available ? "bg-gray-900" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-200 ${
                    available ? "translate-x-[22px]" : "translate-x-[4px]"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="motion-safe:animate-field-in text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-black transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              {loading && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              )}
              {loading ? "Creating Product..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
