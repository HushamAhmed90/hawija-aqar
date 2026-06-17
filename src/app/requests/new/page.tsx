"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { RequestCategory, RequestListingType } from "@/types/request";

const villages = [
  "الحويجة", "الرياض", "العزيري", "الخان", "حياش",
  "المنزلة", "أم الدنيا", "الحلاوة", "أخرى",
];

export default function NewRequestPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    category: "عقار" as RequestCategory,
    listingType: "شراء" as RequestListingType,
    village: "الحويجة",
    description: "",
    minPrice: "",
    maxPrice: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(await res.text());
      router.push("/requests");
    } catch (err) {
      alert("خطأ: " + (err instanceof Error ? err.message : String(err)));
    }
    setLoading(false);
  };

  const inp = "w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#e8b86d]";

  return (
    <>
      <Navbar />
      <div className="max-w-xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-[#16213e] mb-2">📋 أضف طلبك</h1>
        <p className="text-gray-500 text-sm mb-6">انشر طلبك وسيتواصل معك أصحاب العقارات والسيارات المناسبة</p>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-5">

          <div className="flex gap-4">
            <label className="flex-1">
              <span className="block text-sm font-medium text-gray-700 mb-1">الفئة</span>
              <select name="category" value={form.category} onChange={handleChange} className={inp}>
                <option value="عقار">🏠 عقار</option>
                <option value="سيارة">🚗 سيارة</option>
              </select>
            </label>
            <label className="flex-1">
              <span className="block text-sm font-medium text-gray-700 mb-1">نوع الطلب</span>
              <select name="listingType" value={form.listingType} onChange={handleChange} className={inp}>
                <option value="شراء">شراء</option>
                <option value="إيجار">إيجار</option>
              </select>
            </label>
          </div>

          <label>
            <span className="block text-sm font-medium text-gray-700 mb-1">اسمك *</span>
            <input required name="name" value={form.name} onChange={handleChange}
              placeholder="مثال: أحمد محمد" className={inp} />
          </label>

          <label>
            <span className="block text-sm font-medium text-gray-700 mb-1">رقم الواتساب *</span>
            <input required name="phone" value={form.phone} onChange={handleChange}
              placeholder="07xxxxxxxxx" className={inp} />
          </label>

          <label>
            <span className="block text-sm font-medium text-gray-700 mb-1">المنطقة المطلوبة</span>
            <select name="village" value={form.village} onChange={handleChange} className={inp}>
              {villages.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </label>

          <div className="flex gap-4">
            <label className="flex-1">
              <span className="block text-sm font-medium text-gray-700 mb-1">الحد الأدنى للسعر</span>
              <input type="number" name="minPrice" value={form.minPrice} onChange={handleChange}
                placeholder="اختياري" className={inp} />
            </label>
            <label className="flex-1">
              <span className="block text-sm font-medium text-gray-700 mb-1">الحد الأقصى للسعر</span>
              <input type="number" name="maxPrice" value={form.maxPrice} onChange={handleChange}
                placeholder="اختياري" className={inp} />
            </label>
          </div>

          <label>
            <span className="block text-sm font-medium text-gray-700 mb-1">تفاصيل الطلب *</span>
            <textarea required name="description" value={form.description} onChange={handleChange} rows={4}
              placeholder={form.category === "عقار"
                ? "مثال: أبحث عن بيت للإيجار بـ 3 غرف، قريب من المدرسة..."
                : "مثال: أبحث عن تويوتا كامري موديل 2018-2020، كيلومترات أقل من 100 ألف..."}
              className={inp + " resize-none"} />
          </label>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs text-yellow-700">
            ⚠️ سيظهر طلبك لمدة <strong>30 يوماً</strong> ثم يُحذف تلقائياً. رقم واتساب الخاص بك سيكون ظاهراً للمهتمين.
          </div>

          <button type="submit" disabled={loading}
            className="bg-[#16213e] text-white py-3 rounded-xl font-bold text-lg hover:bg-[#0f172a] transition-colors disabled:opacity-50">
            {loading ? "جاري النشر..." : "📋 نشر الطلب مجاناً"}
          </button>
        </form>
      </div>
    </>
  );
}
