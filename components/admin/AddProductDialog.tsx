"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      resetForm();
    }
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
        if (!uploadRes.ok) throw new Error(uploadData.error || "Upload failed");
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 motion-safe:animate-fade-in" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl p-6 sm:p-8 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto motion-safe:animate-scale-in">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">Add Product</h3>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="p-1.5 text-gray-400 hover:text-gray-900 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="productName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Product Name
            </label>
            <input
              id="productName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter product name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
            />
          </div>

          <div>
            <label
              htmlFor="productPrice"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Price (₦)
            </label>
            <input
              id="productPrice"
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
            />
          </div>

          <div>
            <label
              htmlFor="productDescription"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="productDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter product description"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 resize-none"
            />
          </div>

          <div>
            <label
              htmlFor="productCategory"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category
            </label>
            <select
              id="productCategory"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Image
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-900 transition-colors"
            >
              {imagePreview ? (
                <div className="relative">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={400}
                    height={160}
                    className="max-h-40 w-auto mx-auto rounded-lg"
                  />
                  <p               className="text-xs text-gray-500 mt-2 cursor-pointer">
                    Click to change image
                  </p>
                </div>
              ) : (
                <div className="py-4">
                  <Upload className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    Click to upload an image
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

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Available for purchase
            </span>
            <button
              type="button"
              onClick={() => setAvailable(!available)}
              role="switch"
              aria-checked={available}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 cursor-pointer ${
                available ? "bg-gray-900" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                  available ? "translate-x-[22px]" : "translate-x-[4px]"
                }`}
              />
            </button>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-black transition-colors disabled:opacity-50 flex items-center gap-2"
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
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
