"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import icon from "@/app/(main)/icon.png";

type Category = { id: string; name: string };

const Navbar = ({ categories = [] }: { categories?: Category[] }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchBtnRef = useRef<HTMLButtonElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?query=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setIsMobileMenuOpen(false);
      setSearchQuery("");
    }
  };

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const outsideOverlay = searchRef.current && !searchRef.current.contains(e.target as Node);
      const outsideBtn = searchBtnRef.current && !searchBtnRef.current.contains(e.target as Node);
      if (outsideOverlay && outsideBtn) {
        setIsSearchOpen(false);
        setSearchQuery("");
      }
    };
    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSearchOpen]);

  // Focus input when search opens
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl xl:max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center md:h-18 h-16">

          {/* Logo — left */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            <Image
              src={icon}
              alt="AuraByDassy Icon"
              width={80}
              height={80}
              className="object-contain -ml-4 -mr-3 md:-mr-4"
              priority
            />
            <h1 className="md:text-2xl text-xl font-semibold tracking-tight text-gray-900 transition-colors duration-300">
              AuraBy<span className="text-gray-500">Dassy</span>
            </h1>
          </Link>

          {/* Desktop Nav — centered absolutely */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center space-x-10">
            <Link href="/" className="text-gray-700 hover:text-black font-medium transition-colors duration-200">
              Home
            </Link>
            <Link href="/shop" className="text-gray-700 hover:text-black font-medium transition-colors duration-200">
              Shop
            </Link>

            {/* Category Dropdown */}
            <div className="relative group">
              <button
                className="flex items-center text-gray-700 hover:text-black font-medium transition-colors duration-200 focus:outline-none"
                aria-expanded="false"
              >
                Categories
                <svg className="ml-1 w-4 h-4 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 rounded-md shadow-lg bg-white ring-[0.2px] ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2" role="menu">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/shop?category=${encodeURIComponent(cat.name)}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                      role="menuitem"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right side — search icon + hamburger */}
          <div className="ml-auto flex items-center gap-2">
            {/* Search Icon (all breakpoints) */}
            <button
              ref={searchBtnRef}
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-gray-600 hover:text-black transition-colors rounded-full hover:bg-gray-100"
              aria-label="Search"
            >
              {isSearchOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            </button>

            {/* Hamburger (mobile only) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-black hover:bg-gray-100 focus:outline-none transition-colors"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Search Overlay — floats over page content ── */}
      <div
        ref={searchRef}
        className={`absolute left-0 right-0 top-full z-40 transition-all duration-300 ease-in-out ${
          isSearchOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="bg-white/0 border-t border-gray-100  px-4 sm:px-6 lg:px-8 py-4">
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-5 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
            />
            <button
              type="submit"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Menu — floats over page content */}
      <div
        className={`md:hidden absolute left-0 right-0 top-full z-40 transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2 pointer-events-none"
        } bg-white border-t border-gray-100 shadow-xl`}
        id="mobile-menu"
      >
        <div className="px-4 pt-4 pb-6 space-y-1 flex flex-col items-center">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-center w-full px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/shop"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-center w-full px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 transition-colors"
          >
            Shop
          </Link>

          {/* Mobile Categories */}
          <div className="w-full">
            <button
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="flex justify-center items-center w-full px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50 transition-colors"
            >
              Categories
              <svg
                className={`ml-2 w-4 h-4 transition-transform duration-200 ${isCategoryOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isCategoryOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
              <div className="flex flex-col items-center bg-gray-50 py-2 rounded-b-md">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/shop?category=${encodeURIComponent(cat.name)}`}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsCategoryOpen(false);
                    }}
                    className="block w-full text-center px-4 py-2 text-sm text-gray-600 hover:text-black hover:bg-gray-100 transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
