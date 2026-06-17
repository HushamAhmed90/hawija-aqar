"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState, useMemo } from "react";
import { Listing } from "@/types/listing";
import { Office } from "@/types/office";
import Navbar from "@/components/Navbar";

const CLOUDINARY_CLOUD = "dstbkra00";
const CLOUDINARY_PRESET = "hawija-aqar";

async function uploadLogo(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file); fd.append("upload_preset", CLOUDINARY_PRESET);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`, { method: "POST", body: fd });
  const data = await res.json();
  if (!data.secure_url) throw new Error("فشل رفع الشعار");
  return data.secure_url;
}

const PASS_KEY = "hawija_admin_pass";
const DEFAULT_PASS = "hawija2025";

export default function AdminPage() {
  const [auth, setAuth] = useState(false);
  const [pass, setPass] = useState("");
  const [activeTab, setActiveTab] = useState<"listings" | "offices" | "requests">("listings");
  const [listings, setListings] = useState<Listing[]>([]);
  const [offices, setOffices] = useState<Office[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [showOfficeForm, setShowOfficeForm] = useState(false);
  const [officeForm, setOfficeForm] = useState({ name: "", description: "", phone: "", whatsapp: "", address: "", logo: "" });
  const [officeLogoFile, setOfficeLogoFile] = useState<File | null>(null);
  const [officeLogoPreview, setOfficeLogoPreview] = useState("");
  const [officeSaving, setOfficeSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("الكل");
  const [showChangePass, setShowChangePass] = useState(false);
  const [newPass, setNewPass] = useState("");
  const [newPass2, setNewPass2] = useState("");
  const [sortBy, setSortBy] = useState<"createdAt" | "price" | "views">("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const savedPass = () => (typeof window !== "undefined" ? localStorage.getItem(PASS_KEY) || DEFAULT_PASS : DEFAULT_PASS);

  const login = () => {
    if (pass === savedPass()) setAuth(true);
    else alert("كلمة المرور غلط");
  };

  const changePassword = () => {
    if (newPass.length < 6) return alert("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
    if (newPass !== newPass2) return alert("كلمتا المرور غير متطابقتين");
    localStorage.setItem(PASS_KEY, newPass);
    setShowChangePass(false);
    setNewPass(""); setNewPass2("");
    alert("تم تغيير كلمة المرور بنجاح ✓");
  };

  useEffect(() => {
    if (!auth) return;
    setLoading(true);
    Promise.all([
      fetch("/api/listings").then(r => r.json()),
      fetch("/api/offices").then(r => r.json()),
      fetch("/api/requests").then(r => r.json()),
    ]).then(([listingsData, officesData, requestsData]) => {
      setListings(listingsData);
      setOffices(Array.isArray(officesData) ? officesData : []);
      setRequests(Array.isArray(requestsData) ? requestsData : []);
      setLoading(false);
    });
  }, [auth]);

  const saveOffice = async () => {
    if (!officeForm.name || !officeForm.phone) return alert("الاسم والهاتف مطلوبان");
    setOfficeSaving(true);
    try {
      let logo = officeForm.logo;
      if (officeLogoFile) logo = await uploadLogo(officeLogoFile);
      const res = await fetch("/api/offices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...officeForm, logo }),
      });
      const data = await res.json();
      setOffices(prev => [{ id: data.id, ...officeForm, logo, createdAt: new Date() }, ...prev]);
      setOfficeForm({ name: "", description: "", phone: "", whatsapp: "", address: "", logo: "" });
      setOfficeLogoFile(null); setOfficeLogoPreview("");
      setShowOfficeForm(false);
    } catch (e) { alert("خطأ: " + String(e)); }
    setOfficeSaving(false);
  };

  const deleteOffice = async (id: string) => {
    if (!confirm("حذف المكتب؟")) return;
    await fetch(`/api/offices/${id}`, { method: "DELETE" });
    setOffices(prev => prev.filter(o => o.id !== id));
  };

  const deleteRequest = async (id: string) => {
    if (!confirm("حذف الطلب؟")) return;
    await fetch(`/api/requests/${id}`, { method: "DELETE" });
    setRequests(prev => prev.filter(r => r.id !== id));
  };

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

  const exportExcel = () => {
    const rows = [
      ["العنوان", "النوع", "نوع العقار", "المنطقة", "الهاتف", "السعر", "المشاهدات", "واتساب", "التاريخ"],
      ...filtered.map(l => [
        l.title, l.listingType, l.propertyType, l.village, l.phone,
        l.price, l.views || 0, l.whatsappClicks || 0,
        l.createdAt ? new Date(l.createdAt).toLocaleDateString("ar-IQ") : "",
      ]),
    ];
    const csv = "﻿" + rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "hawija-aqar.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const toggleSort = (col: "createdAt" | "price" | "views") => {
    if (sortBy === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortBy(col); setSortDir("desc"); }
  };

  const filtered = useMemo(() => {
    const f = listings.filter(l => {
      const matchSearch = l.title.includes(search) || l.village.includes(search) || l.phone.includes(search);
      const matchType = filterType === "الكل" || l.listingType === filterType;
      return matchSearch && matchType;
    });
    return f.sort((a, b) => {
      let av = sortBy === "price" ? a.price : sortBy === "views" ? (a.views || 0) : new Date(a.createdAt).getTime();
      let bv = sortBy === "price" ? b.price : sortBy === "views" ? (b.views || 0) : new Date(b.createdAt).getTime();
      return sortDir === "asc" ? av - bv : bv - av;
    });
  }, [listings, search, filterType, sortBy, sortDir]);

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
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#16213e]">لوحة الإدارة</h1>
          <div className="flex gap-2">
            <button onClick={() => setShowChangePass(true)}
              className="text-xs px-3 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
              🔑 تغيير كلمة المرور
            </button>
            <button onClick={exportExcel}
              className="text-xs px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              📥 تصدير Excel
            </button>
          </div>
        </div>

        {/* Change Password Modal */}
        {showChangePass && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-6 w-80 shadow-xl">
              <h2 className="font-bold text-[#16213e] mb-4">تغيير كلمة المرور</h2>
              <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)}
                placeholder="كلمة المرور الجديدة"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:border-[#e8b86d]" />
              <input type="password" value={newPass2} onChange={e => setNewPass2(e.target.value)}
                placeholder="تأكيد كلمة المرور"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:border-[#e8b86d]" />
              <div className="flex gap-2">
                <button onClick={changePassword}
                  className="flex-1 bg-[#16213e] text-white py-2 rounded-lg font-bold text-sm">حفظ</button>
                <button onClick={() => setShowChangePass(false)}
                  className="flex-1 border border-gray-200 py-2 rounded-lg text-sm text-gray-600">إلغاء</button>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "إجمالي الإعلانات", value: total, icon: "📋", color: "bg-blue-50 text-blue-700" },
            { label: "للبيع", value: forSale, icon: "🏷️", color: "bg-green-50 text-green-700" },
            { label: "للإيجار", value: forRent, icon: "🔑", color: "bg-yellow-50 text-yellow-700" },
            { label: "إجمالي المشاهدات", value: totalViews, icon: "👁️", color: "bg-purple-50 text-purple-700" },
          ].map(s => (
            <div key={s.label} className={`rounded-xl p-4 ${s.color}`}>
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-xs mt-1 opacity-75">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-100 pb-4">
          {([["listings", "🏠 الإعلانات"], ["offices", "🏢 المكاتب"], ["requests", "📋 الطلبات"]] as const).map(([tab, label]) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === tab ? "bg-[#16213e] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {label}
            </button>
          ))}
        </div>

        {/* Offices Tab */}
        {activeTab === "offices" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-[#16213e]">المكاتب العقارية ({offices.length})</h2>
              <button onClick={() => setShowOfficeForm(!showOfficeForm)}
                className="bg-[#e8b86d] text-[#16213e] px-4 py-2 rounded-lg font-bold text-sm hover:bg-yellow-400">
                + إضافة مكتب
              </button>
            </div>

            {showOfficeForm && (
              <div className="bg-white rounded-xl border border-gray-100 p-5 mb-5 shadow-sm">
                <h3 className="font-bold text-[#16213e] mb-4">مكتب جديد</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[["name","اسم المكتب *",""], ["phone","الهاتف *","07xxxxxxxxx"], ["whatsapp","واتساب","07xxxxxxxxx"], ["address","العنوان",""]].map(([k,l,p]) => (
                    <label key={k}>
                      <span className="block text-xs text-gray-500 mb-1">{l}</span>
                      <input value={(officeForm as any)[k]} onChange={e => setOfficeForm(f => ({...f, [k]: e.target.value}))}
                        placeholder={p} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#e8b86d]" />
                    </label>
                  ))}
                  <label className="sm:col-span-2">
                    <span className="block text-xs text-gray-500 mb-1">وصف المكتب</span>
                    <textarea value={officeForm.description} onChange={e => setOfficeForm(f => ({...f, description: e.target.value}))}
                      rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#e8b86d] resize-none" />
                  </label>
                  <label className="sm:col-span-2">
                    <span className="block text-xs text-gray-500 mb-1">شعار المكتب (اختياري)</span>
                    {officeLogoPreview && <img src={officeLogoPreview} alt="logo" className="w-16 h-16 rounded-xl object-cover mb-2 border" />}
                    <input type="file" accept="image/*" onChange={e => {
                      const f = e.target.files?.[0]; if (!f) return;
                      setOfficeLogoFile(f);
                      const r = new FileReader(); r.onload = ev => setOfficeLogoPreview(ev.target?.result as string); r.readAsDataURL(f);
                    }} className="text-sm text-gray-500" />
                  </label>
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={saveOffice} disabled={officeSaving}
                    className="bg-[#16213e] text-white px-5 py-2 rounded-lg font-bold text-sm disabled:opacity-50">
                    {officeSaving ? "جاري الحفظ..." : "حفظ المكتب"}
                  </button>
                  <button onClick={() => setShowOfficeForm(false)} className="border border-gray-200 px-4 py-2 rounded-lg text-sm text-gray-600">إلغاء</button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {offices.map(o => (
                <div key={o.id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    {o.logo ? <img src={o.logo} alt={o.name} className="w-12 h-12 rounded-xl object-cover" /> :
                      <div className="w-12 h-12 rounded-xl bg-[#16213e] text-white flex items-center justify-center font-bold text-lg">{o.name[0]}</div>}
                    <div>
                      <p className="font-bold text-[#16213e] text-sm">{o.name}</p>
                      <p className="text-xs text-gray-400">{o.address}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a href={`/offices/${o.id}`} target="_blank"
                      className="flex-1 text-center text-xs py-1.5 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50">عرض</a>
                    <button onClick={() => deleteOffice(o.id)}
                      className="flex-1 text-center text-xs py-1.5 border border-red-200 text-red-500 rounded-lg hover:bg-red-50">حذف</button>
                  </div>
                </div>
              ))}
              {offices.length === 0 && <p className="text-gray-400 text-sm col-span-3">لا توجد مكاتب بعد</p>}
            </div>
          </div>
        )}

        {/* Requests Tab */}
        {activeTab === "requests" && (
          <div>
            <h2 className="font-bold text-[#16213e] mb-4">الطلبات النشطة ({requests.length})</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-right px-4 py-3 font-medium text-gray-600">الاسم</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600">الفئة</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600">الطلب</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600">المنطقة</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600">الهاتف</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map(r => (
                    <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-[#16213e]">{r.name}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{r.category} · {r.listingType}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 max-w-[200px] truncate">{r.description}</td>
                      <td className="px-4 py-3 text-gray-500">{r.village}</td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">{r.phone}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => deleteRequest(r.id)}
                          className="text-red-500 text-xs px-2 py-1 border border-red-200 rounded-lg hover:bg-red-50">حذف</button>
                      </td>
                    </tr>
                  ))}
                  {requests.length === 0 && (
                    <tr><td colSpan={6} className="text-center py-10 text-gray-400">لا توجد طلبات</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "listings" && <>
        {/* Search & Filter */}
        <div className="flex gap-3 mb-4">
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="🔍 بحث بالعنوان أو المنطقة أو الهاتف..."
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#e8b86d]" />
          <select value={filterType} onChange={e => setFilterType(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#e8b86d]">
            <option>الكل</option>
            <option>بيع</option>
            <option>إيجار</option>
          </select>
          <span className="text-xs text-gray-400 self-center">{filtered.length} نتيجة</span>
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
                  <th className="text-right px-4 py-3 font-medium text-gray-600 cursor-pointer hover:text-[#16213e]" onClick={() => toggleSort("price")}>
                    السعر {sortBy === "price" ? (sortDir === "desc" ? "↓" : "↑") : ""}
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600 cursor-pointer hover:text-[#16213e]" onClick={() => toggleSort("views")}>
                    👁️ {sortBy === "views" ? (sortDir === "desc" ? "↓" : "↑") : ""}
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">📲</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600 cursor-pointer hover:text-[#16213e]" onClick={() => toggleSort("createdAt")}>
                    التاريخ {sortBy === "createdAt" ? (sortDir === "desc" ? "↓" : "↑") : ""}
                  </th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(l => (
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
                      <div className="flex gap-1 items-center">
                        <a href={`/listings/${l.id}`}
                          className="text-blue-500 hover:text-blue-700 text-xs px-2 py-1 border border-blue-200 rounded-lg hover:bg-blue-50">
                          عرض
                        </a>
                        <button onClick={() => toggleFeatured(l.id, !!l.featured)}
                          className={`text-xs px-2 py-1 border rounded-lg transition-colors ${l.featured ? "bg-yellow-100 text-yellow-700 border-yellow-200" : "text-gray-400 border-gray-200 hover:bg-yellow-50"}`}>
                          {l.featured ? "⭐" : "تمييز"}
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
        </>}
      </div>
    </>
  );
}
