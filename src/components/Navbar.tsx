"use client";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-[#16213e] text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-[#e8b86d]">
          🏠 عقار الحويجة
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/listings" className="hover:text-[#e8b86d] transition-colors">
            الإعلانات
          </Link>
          <Link
            href="/listings/new"
            className="bg-[#e8b86d] text-[#16213e] px-4 py-2 rounded-lg font-bold hover:bg-yellow-400 transition-colors"
          >
            + أضف إعلانك
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-[#0f172a] px-4 pb-4 flex flex-col gap-3 text-sm">
          <Link href="/listings" onClick={() => setMenuOpen(false)} className="hover:text-[#e8b86d]">
            الإعلانات
          </Link>
          <Link
            href="/listings/new"
            onClick={() => setMenuOpen(false)}
            className="bg-[#e8b86d] text-[#16213e] px-4 py-2 rounded-lg font-bold text-center"
          >
            + أضف إعلانك
          </Link>
        </div>
      )}
    </nav>
  );
}
