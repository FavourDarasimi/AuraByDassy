"use client";

import { useEffect, useState } from "react";
import { HugeiconsIcon } from '@hugeicons/react';
import { CheckIcon } from '@hugeicons/core-free-icons';

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
  const [closing, setClosing] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    const handler = (e: CustomEvent<ToastEvent>) => {
      setName(e.detail.productName);
      setClosing(false);
      setVisible(true);
    };
    window.addEventListener("cart-toast", handler as EventListener);
    return () =>
      window.removeEventListener("cart-toast", handler as EventListener);
  }, []);

  useEffect(() => {
    if (!visible || closing) return;
    const t = setTimeout(() => setClosing(true), 2200);
    return () => clearTimeout(t);
  }, [visible, closing]);

  const handleAnimationEnd = () => {
    if (closing) setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed bottom-20 sm:bottom-24 right-4 sm:right-6 z-[100] ${
        closing ? "motion-safe:animate-cart-out" : "motion-safe:animate-cart-in"
      }`}
      onAnimationEnd={handleAnimationEnd}
    >
      <div className="flex items-center gap-4 md:gap-2.5 bg-gray-900 text-white px-5 py-3 rounded-full shadow-2xl text-sm font-medium">
        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/20">
          <HugeiconsIcon icon={CheckIcon} size={12} />
        </span>
        <div className="flex flex-col md:flex-row items-center gap-0 md:gap-2.5">
        <span className="truncate max-w-[220px] sm:max-w-xs">{name}</span>
        <span className="text-white/70">added to cart</span>
      </div></div>
    </div>
  );
}
