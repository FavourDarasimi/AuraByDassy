"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, X, FolderPlus, PackagePlus } from "lucide-react";

interface SpeedDialFabProps {
  onAddCategory: () => void;
  onAddProduct: () => void;
}

export default function SpeedDialFab({
  onAddCategory,
  onAddProduct,
}: SpeedDialFabProps) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") close();
    },
    [close],
  );

  const actions = [
    {
      label: "Add Category",
      icon: FolderPlus,
      onClick: () => {
        close();
        onAddCategory();
      },
    },
    {
      label: "Add Product",
      icon: PackagePlus,
      onClick: () => {
        close();
        onAddProduct();
      },
    },
  ];

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs md:hidden"
          onClick={close}
          aria-hidden="true"
        />
      )}

      {/* Speed dial container — fixed at bottom-right on mobile only */}
      <div
        className="fixed bottom-6 right-0  z-50 md:hidden"
        onKeyDown={handleKeyDown}
      >
        {/* Mini action buttons */}
        <div className="flex flex-col items-end gap-3 mb-4">
          {actions.map((action, i) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={action.onClick}
                className={`
                  flex items-center gap-2.5 px-4 py-2.5 bg-white rounded-xl shadow-lg border border-gray-100
                  text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900
                  active:scale-90 transition-all duration-300
                  ${open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}
                `}
                style={{
                  transitionDelay: open
                    ? `${(actions.length - 1 - i) * 60}ms`
                    : "0ms",
                }}
                aria-label={action.label}
              >
                <Icon size={16} className="shrink-0 text-gray-900" />
                <span className="whitespace-nowrap">{action.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main FAB */}
        <button
          onClick={() => setOpen((prev) => !prev)}
          className={`
            relative flex items-center justify-center w-14 h-14 rounded-full shadow-xl
            text-white transition-all duration-300 active:scale-95 z-10
            ${open ? "bg-gray-800" : "bg-gray-900 hover:bg-black"}
          `}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <Plus
            size={24}
            className={`absolute transition-transform duration-300 ${open ? "rotate-90 opacity-0" : "rotate-0 opacity-100"}`}
          />
          <X
            size={24}
            className={`absolute transition-transform duration-300 ${open ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"}`}
          />
        </button>
      </div>
    </>
  );
}
