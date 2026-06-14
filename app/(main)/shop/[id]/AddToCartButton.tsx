"use client";

import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/lib/cart";
import { showCartToast } from "@/components/CartToast";

type Product = {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  sku: string;
};

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem, isInCart } = useCart();
  const inCart = isInCart(product.id);

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      sku: product.sku,
    });
    showCartToast(product.name);
  };

  return (
    <button
      onClick={handleAdd}
      disabled={inCart}
      className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-xs font-bold tracking-wider uppercase transition-all duration-300 ${
        inCart
          ? "bg-gray-200 text-gray-500 cursor-default"
          : "bg-gray-900 text-white hover:bg-black active:bg-black"
      }`}
    >
      {inCart ? (
        <>
          <Check className="w-4 h-4" />
          Added to Cart
        </>
      ) : (
        <>
          <ShoppingBag className="w-4 h-4" />
          Add to Cart
        </>
      )}
    </button>
  );
}
