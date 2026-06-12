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
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 animate-gradient"
        style={{
          background:
            "linear-gradient(-45deg, #f8f9fa, #e9ecef, #f1f3f5, #f8f9fa)",
          backgroundSize: "400% 400%",
        }}
      />

      {/* Decorative floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full border border-gray-200/50 animate-float-slow"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="absolute -bottom-32 -left-32 w-[30rem] h-[30rem] rounded-full border border-gray-200/40 animate-float-slower"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/4 left-1/6 w-16 h-16 rounded-full bg-gray-200/10 animate-float-slow"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-1/3 right-1/5 w-10 h-10 rounded-full bg-gray-200/10 animate-float-slower"
          style={{ animationDelay: "0.5s" }}
        />
      </div>

      <div className="relative w-full max-w-sm mx-4">
        <div className="text-center mb-8 flex flex-col items-center gap-2 motion-safe:animate-fade-in-up">
          <Logo />
          <p className="text-sm text-gray-500">Admin Dashboard Login</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 motion-safe:animate-scale-in">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="motion-safe:animate-fade-in-up" style={{ animationDelay: "0.1s", animationFillMode: "backwards" }}>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-all"
                autoFocus
              />
            </div>

            <div className="motion-safe:animate-fade-in-up" style={{ animationDelay: "0.15s", animationFillMode: "backwards" }}>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-all"
              />
            </div>

            {error && <p className="text-sm text-red-600 motion-safe:animate-fade-in">{error}</p>}

            <div className="motion-safe:animate-fade-in-up" style={{ animationDelay: "0.2s", animationFillMode: "backwards" }}>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-black transition-colors active:scale-[0.98] disabled:active:scale-100 disabled:opacity-50 flex items-center justify-center gap-2"
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
