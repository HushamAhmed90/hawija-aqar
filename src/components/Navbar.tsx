"use client";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-[#16213e] text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="36" height="36" rx="8" fill="#e8b86d"/>
            <path d="M18 6 L10 14 L10 28 L15 28 L15 21 L21 21 L21 28 L26 28 L26 14 Z" fill="#16213e"/>
            <path d="M20 6 Q22 2 22 6 Q22 10 20 9 Q20 12 21 14 Q19 13 18 14 Q17 13 15 14 Q16 12 16 9 Q14 10 14 6 Q14 2 16 6 Z" fill="#16213e"/>
          </svg>
          <span className="text-xl font-bold text-[#e8b86d]">عقار الحويجة</span>
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
