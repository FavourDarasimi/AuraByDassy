"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-50">
      {/* Subtle gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(-45deg, #f8f9fa, #e9ecef, #f1f3f5, #f8f9fa)",
        }}
      />

      <div className="relative w-full max-w-sm mx-4">
          <div className="text-center mb-10 flex flex-col items-center gap-1 motion-safe:animate-fade-in-up">
          <Logo />
          <p className="text-sm text-gray-500">Admin Dashboard Login</p>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8 motion-safe:animate-scale-in">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="motion-safe:animate-fade-in-up" style={{ animationDelay: "0.1s", animationFillMode: "backwards" }}>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-gray-500 mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-all"
                autoFocus
              />
            </div>

            <div className="motion-safe:animate-fade-in-up" style={{ animationDelay: "0.15s", animationFillMode: "backwards" }}>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-gray-500 mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-all"
              />
            </div>

            {error && <p className="text-sm text-red-600 motion-safe:animate-fade-in">{error}</p>}

            <div className="motion-safe:animate-fade-in-up" style={{ animationDelay: "0.2s", animationFillMode: "backwards" }}>
              <button
                type="submit"
                disabled={loading}
                  className="w-full py-2.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-black transition-colors active:scale-[0.98] disabled:active:scale-100 disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
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
                Sign In
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6 motion-safe:animate-fade-in" style={{ animationDelay: "0.3s", animationFillMode: "backwards" }}>
          Protected admin area
        </p>
      </div>
    </div>
  );
}
