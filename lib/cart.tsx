"use client";

import {
  createContext,
  useContext,
  useCallback,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  sku: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  total: number;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (id: string) => boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "aurabydassy_cart";

function readStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CartItem[];
  } catch {
    return [];
  }
}

function writeStorage(items: CartItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* quota exceeded – silent */
  }
}

function subscribeToCart(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  window.addEventListener("cart-updated", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("cart-updated", callback);
  };
}

let cachedSnapshot: CartItem[] = [];
let cachedSnapshotKey = "";

function getCartSnapshot(): CartItem[] {
  const next = readStorage();
  const key = JSON.stringify(next);
  if (key !== cachedSnapshotKey) {
    cachedSnapshot = next;
    cachedSnapshotKey = key;
  }
  return cachedSnapshot;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribeToCart, getCartSnapshot, getCartSnapshot);

  const addItem = useCallback(
    (newItem: Omit<CartItem, "quantity">) => {
      const prev = readStorage();
      const existing = prev.find((i) => i.id === newItem.id);
      let next: CartItem[];
      if (existing) {
        next = prev.map((i) =>
          i.id === newItem.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        next = [...prev, { ...newItem, quantity: 1 }];
      }
      writeStorage(next);
      window.dispatchEvent(new Event("cart-updated"));
    },
    [],
  );

  const removeItem = useCallback((id: string) => {
    const prev = readStorage();
    const next = prev.filter((i) => i.id !== id);
    writeStorage(next);
    window.dispatchEvent(new Event("cart-updated"));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) return;
    const prev = readStorage();
    const next = prev.map((i) => (i.id === id ? { ...i, quantity } : i));
    writeStorage(next);
    window.dispatchEvent(new Event("cart-updated"));
  }, []);

  const clearCart = useCallback(() => {
    writeStorage([]);
    window.dispatchEvent(new Event("cart-updated"));
  }, []);

  const isInCart = useCallback(
    (id: string) => items.some((i) => i.id === id),
    [items],
  );

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        total,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
