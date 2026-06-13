"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, LogOut } from "lucide-react";
import Logo from "@/components/Logo";
import { useRouter } from "next/navigation";

export default function AdminHeader() {
  const [email, setEmail] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/admin/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user?.email) setEmail(data.user.email);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen]);

  const initials = email
    ? email
        .split("@")[0]
        .split(/[._-]/)
        .map((s) => s[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "A";

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <>
      {/* Desktop header — avatar only */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 px-6 py-3 hidden lg:flex items-center justify-end">
        <span className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold uppercase tracking-wide">
          {initials}
        </span>
      </div>

      {/* Mobile/tablet header — logo + avatar with dropdown */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 py-3 flex lg:hidden items-center justify-between">
        <Logo href="/admin" />

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-1.5 text-gray-700 hover:text-gray-900 transition-colors"
          >
            <span className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold uppercase tracking-wide">
              {initials}
            </span>
            <ChevronDown
              size={14}
              className={`transition-transform duration-200 ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-1">
              <div className="px-4 py-2.5 border-b border-gray-100">
                <p className="text-xs font-medium text-gray-900 truncate">
                  {email}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
