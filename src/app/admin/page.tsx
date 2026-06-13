"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { Listing } from "@/types/listing";
import Navbar from "@/components/Navbar";
import Link from "next/link";

const ADMIN_PASS = "hawija2025";

export default function AdminPage() {
  const [auth, setAuth] = useState(false);
  const [pass, setPass] = useState("");
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);

  const login = () => {
    if (pass === ADMIN_PASS) setAuth(true);
    else alert("كلمة المرور غلط");
  };

  useEffect(() => {
    if (!auth) return;
    setLoading(true);
    fetch("/api/listings").then(r => r.json()).then(data => {
      setListings(data);
      setLoading(false);
    });
  }, [auth]);

  const deleteListing = async (id: string) => {
    if (!confirm("تأكيد الحذف؟")) return;
    await fetch(`/api/listings/${id}/admin`, { method: "DELETE" });
    setListings(prev => prev.filter(l => l.id !== id));
  };

  const toggleFeatured = async (id: string, current: boolean) => {
    await fetch(`/api/listings/${id}/admin`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !current }),
    });
    setListings(prev => prev.map(l => l.id === id ? { ...l, featured: !current } : l));
  };

  if (!auth) return (
    <>
      <Navbar />
      <div className="max-w-sm mx-auto px-4 py-20">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="text-4xl mb-4">🔐</div>
          <h1 className="text-xl font-bold text-[#16213e] mb-6">لوحة الإدارة</h1>
          <input type="password" value={pass} onChange={e => setPass(e.target.value)}
            onKeyDown={e => e.key === "Enter" && login()}
            placeholder="كلمة المرور"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:border-[#e8b86d]" />
          <button onClick={login}
            className="w-full bg-[#16213e] text-white py-2 rounded-lg font-bold hover:bg-[#0f172a]">
            دخول
          </button>
        </div>
      </div>
    </>
  );

  const total = listings.length;
  const forSale = listings.filter(l => l.listingType === "بيع").length;
  const forRent = listings.filter(l => l.listingType === "إيجار").length;
  const totalViews = listings.reduce((s, l) => s + (l.views || 0), 0);

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#16213e]">لوحة الإدارة</h1>
          <span className="text-gray-500 text-sm">{total} إعلان</span>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "إجمالي الإعلانات", value: total, icon: "📋", color: "bg-blue-50 text-blue-700" },
            { label: "للبيع", value: forSale, icon: "🏷️", color: "bg-green-50 text-green-700" },
            { label: "للإيجار", value: forRent, icon: "🔑", color: "bg-yellow-50 text-yellow-700" },
            { label: "إجمالي المشاهدات", value: totalViews, icon: "👁️", color: "bg-purple-50 text-purple-700" },
          ].map(s => (
            <div key={s.label} className={`rounded-xl p-4 ${s.color} border border-opacity-20`}>
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-xs mt-1 opacity-75">{s.label}</div>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">جاري التحميل...</div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">العنوان</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">النوع</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">المنطقة</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">الهاتف</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">السعر</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">👁️ مشاهدات</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">📲 واتساب</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">التاريخ</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {listings.map(l => (
                  <tr key={l.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-[#16213e] max-w-[160px] truncate">
                      {l.featured && <span className="text-yellow-500 ml-1">⭐</span>}
                      {l.title}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${l.listingType === "بيع" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                        {l.listingType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{l.village}</td>
                    <td className="px-4 py-3 text-gray-500 font-mono text-xs">{l.phone}</td>
                    <td className="px-4 py-3 font-bold text-[#16213e] whitespace-nowrap">{l.price.toLocaleString("ar-IQ")}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{l.views || 0}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{l.whatsappClicks || 0}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                      {l.createdAt ? new Date(l.createdAt).toLocaleDateString("ar-IQ") : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 items-center">
                        <Link href={`/listings/${l.id}`} target="_blank"
                          className="text-blue-500 hover:text-blue-700 text-xs px-2 py-1 border border-blue-200 rounded-lg hover:bg-blue-50">
                          عرض
                        </Link>
                        <button onClick={() => toggleFeatured(l.id, !!l.featured)}
                          className={`text-xs px-2 py-1 border rounded-lg transition-colors ${l.featured ? "bg-yellow-100 text-yellow-700 border-yellow-200" : "text-gray-400 border-gray-200 hover:bg-yellow-50"}`}>
                          {l.featured ? "⭐ مميز" : "تمييز"}
                        </button>
                        <button onClick={() => deleteListing(l.id)}
                          className="text-red-500 hover:text-red-700 text-xs px-2 py-1 border border-red-200 rounded-lg hover:bg-red-50">
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
