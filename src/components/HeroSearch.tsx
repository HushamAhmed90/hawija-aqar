"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HeroSearch() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [listing, setListing] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (type) params.set("type", type);
    if (listing) params.set("listing", listing);
    router.push(`/listings?${params.toString()}`);
  };

  return (
    <div className="mt-8 bg-white rounded-2xl p-3 flex flex-col sm:flex-row gap-2 max-w-3xl mx-auto shadow-xl">
      <input
        type="text"
        placeholder="ابحث عن عقار، قرية، منطقة..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        className="flex-1 px-4 py-2 text-gray-700 text-sm focus:outline-none rounded-xl"
      />
      <select
        value={listing}
        onChange={(e) => setListing(e.target.value)}
        className="px-3 py-2 text-gray-600 text-sm focus:outline-none border-r border-gray-100 rounded-xl"
      >
        <option value="">بيع أو إيجار</option>
        <option value="بيع">بيع</option>
        <option value="إيجار">إيجار</option>
      </select>
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="px-3 py-2 text-gray-600 text-sm focus:outline-none border-r border-gray-100 rounded-xl"
      >
        <option value="">كل الأنواع</option>
        {["أرض", "بيت", "شقة", "محل", "مزرعة", "أخرى"].map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
      <button
        onClick={handleSearch}
        className="bg-[#e8b86d] text-[#16213e] px-6 py-2 rounded-xl font-bold text-sm hover:bg-yellow-400 transition-colors"
      >
        🔍 بحث
      </button>
    </div>
  );
}
