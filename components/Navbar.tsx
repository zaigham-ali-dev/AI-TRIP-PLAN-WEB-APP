"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full absolute top-0 left-0 right-0 z-50 bg-transparent">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-full bg-[#2563eb] flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4.5 h-4.5 text-white"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z" />
              </svg>
            </div>
            <span className="text-2xl font-extrabold text-[#0e1326] tracking-tight">
              Triply
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-9 text-[15px] font-medium text-slate-700">
            <button
              onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
              className="hover:text-blue-600 transition-colors py-1 cursor-pointer"
            >
              Features
            </button>
            <button
              onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
              className="hover:text-blue-600 transition-colors py-1 cursor-pointer"
            >
              How It Works
            </button>
          </nav>

          {/* Desktop Right CTAs */}
          <div className="hidden md:flex items-center gap-7">
            <Link
              href="/signin"
              className="text-[15px] font-medium text-slate-700 hover:text-slate-900 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="bg-[#0e1326] hover:bg-black text-white text-[15px] font-medium px-6 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Sign up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-3">
            <Link
              href="/signup"
              className="bg-[#0e1326] text-white text-xs font-medium px-3.5 py-2 rounded-lg"
            >
              Sign up
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100/80 transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 px-3 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-100 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-150">
            <button
              onClick={() => { setMobileMenuOpen(false); document.getElementById("features")?.scrollIntoView({ behavior: "smooth" }); }}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 text-left cursor-pointer"
            >
              Features
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" }); }}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 text-left cursor-pointer"
            >
              How It Works
            </button>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between px-3">
              <Link
                href="/signin"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-slate-700 hover:text-blue-600"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="bg-[#0e1326] text-white text-sm font-medium px-5 py-2 rounded-xl"
              >
                Sign up
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
