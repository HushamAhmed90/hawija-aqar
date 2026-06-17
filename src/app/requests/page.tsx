"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { PropertyRequest } from "@/types/request";
import Navbar from "@/components/Navbar";
import Link from "next/link";

function daysLeft(expiresAt: string) {
  const diff = new Date(expiresAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function RequestCard({ req }: { req: PropertyRequest & { expiresAt: string; createdAt: string } }) {
  const waMsg = encodeURIComponent(
    `مرحباً، رأيت طلبك على موقع حويجة للعقار والسيارات:\n\n` +
    `📌 ${req.description}\n` +
    `📍 ${req.village}\n` +
    `💰 ${req.minPrice ? req.minPrice.toLocaleString("ar-IQ") : "—"} — ${req.maxPrice ? req.maxPrice.toLocaleString("ar-IQ") : "—"} دينار\n\n` +
    `أنا مهتم، هل الطلب لا يزال متاحاً؟`
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex gap-2 flex-wrap">
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${req.category === "عقار" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"}`}>
            {req.category === "عقار" ? "🏠" : "🚗"} {req.category}
          </span>
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${req.listingType === "شراء" ? "bg-green-100 text-green-700" : "bg-purple-100 text-purple-700"}`}>
            {req.listingType}
          </span>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${daysLeft(req.expiresAt as unknown as string) <= 5 ? "bg-red-50 text-red-500" : "bg-gray-50 text-gray-400"}`}>
          ⏳ {daysLeft(req.expiresAt as unknown as string)} يوم
        </span>
      </div>

      <div>
        <p className="font-bold text-[#16213e] mb-1">{req.name}</p>
        <p className="text-sm text-gray-600 leading-relaxed">{req.description}</p>
      </div>

      <div className="flex gap-4 text-sm text-gray-500">
        <span>📍 {req.village}</span>
        {(req.minPrice > 0 || req.maxPrice > 0) && (
          <span>💰 {req.minPrice ? req.minPrice.toLocaleString("ar-IQ") : "—"} — {req.maxPrice ? req.maxPrice.toLocaleString("ar-IQ") : "—"} دينار</span>
        )}
      </div>

      <a href={`https://wa.me/964${req.phone.replace(/^0/, "")}?text=${waMsg}`}
        target="_blank" rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-2.5 rounded-xl font-bold text-sm hover:bg-green-600 transition-colors">
        💬 تواصل عبر واتساب
      </a>
    </div>
  );
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterType, setFilterType] = useState("");

  useEffect(() => {
    fetch("/api/requests").then(r => r.json()).then(data => {
      setRequests(Array.isArray(data) ? data : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = requests.filter(r => {
    if (filterCategory && r.category !== filterCategory) return false;
    if (filterType && r.listingType !== filterType) return false;
    return true;
  });

  const inp = "border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#e8b86d]";

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-[#16213e]">📋 لوحة الطلبات</h1>
          <Link href="/requests/new"
            className="bg-[#e8b86d] text-[#16213e] px-4 py-2 rounded-lg font-bold text-sm hover:bg-yellow-400 transition-colors">
            + أضف طلبك
          </Link>
        </div>
        <p className="text-gray-500 text-sm mb-6">اعرض طلبات الباحثين عن عقارات وسيارات وتواصل معهم مباشرة</p>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4 flex gap-3 flex-wrap">
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className={inp}>
            <option value="">عقار وسيارة</option>
            <option value="عقار">🏠 عقار</option>
            <option value="سيارة">🚗 سيارة</option>
          </select>
          <select value={filterType} onChange={e => setFilterType(e.target.value)} className={inp}>
            <option value="">شراء وإيجار</option>
            <option value="شراء">شراء</option>
            <option value="إيجار">إيجار</option>
          </select>
          <span className="text-xs text-gray-400 self-center">{filtered.length} طلب نشط</span>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">جاري التحميل...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">📋</div>
            <p>لا توجد طلبات بعد</p>
            <Link href="/requests/new"
              className="mt-4 inline-block bg-[#e8b86d] text-[#16213e] px-6 py-2 rounded-lg font-bold hover:bg-yellow-400">
              أضف أول طلب
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {filtered.map(r => <RequestCard key={r.id} req={r} />)}
          </div>
        )}
      </div>
    </>
  );
}
