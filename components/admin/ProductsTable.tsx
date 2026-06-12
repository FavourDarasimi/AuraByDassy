'use client'

import { Pencil, Trash2 } from 'lucide-react'

interface Product {
  id: string
  name: string
  price: number
  image_url: string | null
  category_id: string
  available: boolean
  sku: string
  created_at: string
  category: { name: string } | null
}

interface ProductsTableProps {
  products: Product[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  onPageChange: (page: number) => void
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
  loading?: boolean
}

function ProductCardRow({ product, onEdit, onDelete }: { product: Product; onEdit: (p: Product) => void; onDelete: (p: Product) => void }) {
  return (
    <div className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg bg-white hover:border-gray-200 transition-colors">
      <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">N/A</div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
        <p className="text-xs text-gray-400 mt-0.5">
          {product.category?.name || 'Uncategorized'} · {product.sku}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-semibold text-gray-900">₦{product.price.toLocaleString()}</span>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
            product.available ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
          }`}>
            {product.available ? 'Available' : 'Unavailable'}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button onClick={() => onEdit(product)} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-150 active:scale-90" title="Edit">
          <Pencil size={16} />
        </button>
        <button onClick={() => onDelete(product)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-150 active:scale-90" title="Delete">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  )
}

export default function ProductsTable({
  products,
  total,
  page,
  pageSize,
  totalPages,
  onPageChange,
  onEdit,
  onDelete,
  loading,
}: ProductsTableProps) {
  return (
    <div>
      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-500">Product</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-500">SKU</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-500">Category</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-500">Price</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-500">Status</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="py-8 px-4">
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex items-center gap-4 motion-safe:animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                        <div className="w-10 h-10 rounded-lg bg-gray-200 shrink-0 animate-shimmer" style={{ background: "linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)", backgroundSize: "200% 100%" }} />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 w-40 rounded bg-gray-200 animate-shimmer" style={{ background: "linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)", backgroundSize: "200% 100%" }} />
                          <div className="h-2.5 w-24 rounded bg-gray-200 animate-shimmer" style={{ background: "linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)", backgroundSize: "200% 100%" }} />
                        </div>
                        <div className="h-3 w-16 rounded bg-gray-200 animate-shimmer" style={{ background: "linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)", backgroundSize: "200% 100%" }} />
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-gray-500">
                  No products found
                </td>
              </tr>
            ) : (
              products.map((product, index) => (
                <tr
                  key={product.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors motion-safe:animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.04}s`, animationFillMode: "backwards" }}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0 ring-1 ring-black/5">
                        {product.image_url ? (
                          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">N/A</div>
                        )}
                      </div>
                      <span className="font-medium text-gray-900 truncate max-w-[180px]">{product.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-500 font-mono text-xs">{product.sku}</td>
                  <td className="py-3 px-4 text-gray-600">{product.category?.name || 'Uncategorized'}</td>
                  <td className="py-3 px-4 text-right font-medium text-gray-900">
                    ₦{product.price.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.available
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {product.available ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(product)}
                        className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-150 active:scale-90"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(product)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-150 active:scale-90"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-3">
        {loading ? (
          <div className="py-8 px-4 space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 motion-safe:animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="w-12 h-12 rounded-lg bg-gray-200 shrink-0 animate-shimmer" style={{ background: "linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)", backgroundSize: "200% 100%" }} />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-36 rounded bg-gray-200 animate-shimmer" style={{ background: "linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)", backgroundSize: "200% 100%" }} />
                  <div className="h-2.5 w-20 rounded bg-gray-200 animate-shimmer" style={{ background: "linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)", backgroundSize: "200% 100%" }} />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="py-12 text-center text-gray-500 text-sm">No products found</div>
        ) : (
          products.map((product, index) => (
            <div key={product.id} className="motion-safe:animate-fade-in-up" style={{ animationDelay: `${index * 0.04}s`, animationFillMode: "backwards" }}>
              <ProductCardRow product={product} onEdit={onEdit} onDelete={onDelete} />
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 px-4">
          <p className="text-xs sm:text-sm text-gray-500">
            Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, total)} of {total}
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 active:scale-[0.97] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const start = Math.max(1, page - 2);
              const p = start + i;
              if (p > totalPages) return null;
              return (
                <button
                  key={p}
                  onClick={() => onPageChange(p)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 active:scale-[0.97] ${
                    p === page
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {p}
                </button>
              );
            })}
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 active:scale-[0.97] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
