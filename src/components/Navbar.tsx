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
          <span className="text-xl font-bold text-[#e8b86d]">حويجة للعقار والسيارات</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/listings" className="hover:text-[#e8b86d] transition-colors">🏠 العقارات</Link>
          <Link href="/cars" className="hover:text-[#e8b86d] transition-colors">🚗 السيارات</Link>
          <Link href="/offices" className="hover:text-[#e8b86d] transition-colors">🏢 المكاتب</Link>
          <Link href="/requests" className="hover:text-[#e8b86d] transition-colors">📋 الطلبات</Link>
          <Link href="/areas" className="hover:text-[#e8b86d] transition-colors">المناطق</Link>
          <Link href="/about" className="hover:text-[#e8b86d] transition-colors">عن الموقع</Link>
          <div className="relative group">
            <button className="bg-[#e8b86d] text-[#16213e] px-4 py-2 rounded-lg font-bold hover:bg-yellow-400 transition-colors">
              + أضف إعلانك ▾
            </button>
            <div className="absolute left-0 top-full mt-1 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden hidden group-hover:block min-w-[160px] z-50">
              <Link href="/listings/new" className="flex items-center gap-2 px-4 py-3 text-sm text-[#16213e] hover:bg-[#f8f9fa]">🏠 عقار</Link>
              <Link href="/cars/new" className="flex items-center gap-2 px-4 py-3 text-sm text-[#16213e] hover:bg-[#f8f9fa]">🚗 سيارة</Link>
            </div>
          </div>
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
          <Link href="/listings" onClick={() => setMenuOpen(false)} className="hover:text-[#e8b86d] py-2 border-b border-white/10">🏠 العقارات</Link>
          <Link href="/cars" onClick={() => setMenuOpen(false)} className="hover:text-[#e8b86d] py-2 border-b border-white/10">🚗 السيارات</Link>
          <Link href="/offices" onClick={() => setMenuOpen(false)} className="hover:text-[#e8b86d] py-2 border-b border-white/10">🏢 المكاتب</Link>
          <Link href="/requests" onClick={() => setMenuOpen(false)} className="hover:text-[#e8b86d] py-2 border-b border-white/10">📋 الطلبات</Link>
          <Link href="/areas" onClick={() => setMenuOpen(false)} className="hover:text-[#e8b86d] py-2 border-b border-white/10">المناطق</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)} className="hover:text-[#e8b86d] py-2 border-b border-white/10">عن الموقع</Link>
          <Link href="/listings/new" onClick={() => setMenuOpen(false)}
            className="bg-[#e8b86d] text-[#16213e] px-4 py-3 rounded-lg font-bold text-center mt-1">
            🏠 أضف عقاراً
          </Link>
          <Link href="/cars/new" onClick={() => setMenuOpen(false)}
            className="bg-[#e8b86d] text-[#16213e] px-4 py-3 rounded-lg font-bold text-center mt-1">
            🚗 أضف سيارة
          </Link>
        </div>
      )}
    </nav>
  );
}
