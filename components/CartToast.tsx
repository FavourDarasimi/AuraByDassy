"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";

type ToastEvent = { productName: string };

declare global {
  interface WindowEventMap {
    "cart-toast": CustomEvent<ToastEvent>;
  }
}

export function showCartToast(productName: string) {
  window.dispatchEvent(
    new CustomEvent<ToastEvent>("cart-toast", { detail: { productName } }),
  );
}

export default function CartToast() {
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    const handler = (e: CustomEvent<ToastEvent>) => {
      setName(e.detail.productName);
      setVisible(true);
    };
    window.addEventListener("cart-toast", handler as EventListener);
    return () =>
      window.removeEventListener("cart-toast", handler as EventListener);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setVisible(false), 2500);
    return () => clearTimeout(t);
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 z-[100] animate-fade-in-up">
      <div className="flex items-center gap-2.5 bg-gray-900 text-white px-5 py-3 rounded-full shadow-2xl text-sm font-medium">
        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/20">
          <Check className="w-3 h-3" />
        </span>
        <span className="truncate max-w-[220px] sm:max-w-xs">{name}</span>
        <span className="text-white/70">added to cart</span>
      </div>
    </div>
  );
}
