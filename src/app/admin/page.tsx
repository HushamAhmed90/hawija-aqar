"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { Listing } from "@/types/listing";
import Navbar from "@/components/Navbar";

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

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#16213e]">لوحة الإدارة</h1>
          <span className="text-gray-500 text-sm">{listings.length} إعلان</span>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">جاري التحميل...</div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">العنوان</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">النوع</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">المنطقة</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">الهاتف</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">السعر</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {listings.map(l => (
                  <tr key={l.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-[#16213e] max-w-[200px] truncate">{l.title}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${l.listingType === "بيع" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                        {l.listingType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{l.village}</td>
                    <td className="px-4 py-3 text-gray-500">{l.phone}</td>
                    <td className="px-4 py-3 font-bold text-[#16213e]">{l.price.toLocaleString("ar-IQ")}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => deleteListing(l.id)}
                        className="text-red-500 hover:text-red-700 font-bold text-xs px-3 py-1 border border-red-200 rounded-lg hover:bg-red-50">
                        حذف
                      </button>
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
