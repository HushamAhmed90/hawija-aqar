"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { PropertyType, ListingType } from "@/types/listing";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

const villages = [
  "الحويجة", "الرياض", "العلم", "الزيدية", "الكيلاني", "أبو عوجة",
  "السنية", "الكسارة", "المحمودية", "الدبس", "بركة", "الملك",
  "أم الزيتون", "الجنابيين", "السبعاوي", "أخرى",
];

export default function NewListingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    listingType: "بيع" as ListingType,
    propertyType: "بيت" as PropertyType,
    village: "الحويجة",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const imageUrls: string[] = [];
      for (const file of images) {
        const storageRef = ref(storage, `listings/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        imageUrls.push(url);
      }

      await addDoc(collection(db, "listings"), {
        ...form,
        price: Number(form.price),
        images: imageUrls,
        createdAt: serverTimestamp(),
      });

      router.push("/listings");
    } catch (err) {
      console.error(err);
      alert("حدث خطأ، حاول مرة أخرى");
    }
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-[#16213e] mb-6">إضافة إعلان جديد</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-5">

          <div className="flex gap-4">
            <label className="flex-1">
              <span className="block text-sm font-medium text-gray-700 mb-1">نوع العرض</span>
              <select name="listingType" value={form.listingType} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#e8b86d]">
                <option value="بيع">بيع</option>
                <option value="إيجار">إيجار</option>
              </select>
            </label>
            <label className="flex-1">
              <span className="block text-sm font-medium text-gray-700 mb-1">نوع العقار</span>
              <select name="propertyType" value={form.propertyType} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#e8b86d]">
                {(["أرض", "بيت", "شقة", "محل", "مزرعة", "أخرى"] as PropertyType[]).map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </label>
          </div>

          <label>
            <span className="block text-sm font-medium text-gray-700 mb-1">عنوان الإعلان *</span>
            <input required name="title" value={form.title} onChange={handleChange}
              placeholder="مثال: بيت للبيع في الحويجة"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#e8b86d]" />
          </label>

          <label>
            <span className="block text-sm font-medium text-gray-700 mb-1">المنطقة / القرية *</span>
            <select name="village" value={form.village} onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#e8b86d]">
              {villages.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </label>

          <label>
            <span className="block text-sm font-medium text-gray-700 mb-1">السعر (دينار عراقي) *</span>
            <input required type="number" name="price" value={form.price} onChange={handleChange}
              placeholder="مثال: 50000000"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#e8b86d]" />
          </label>

          <label>
            <span className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف *</span>
            <input required name="phone" value={form.phone} onChange={handleChange}
              placeholder="07xxxxxxxxx"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#e8b86d]" />
          </label>

          <label>
            <span className="block text-sm font-medium text-gray-700 mb-1">تفاصيل إضافية</span>
            <textarea name="description" value={form.description} onChange={handleChange} rows={4}
              placeholder="اكتب تفاصيل العقار هنا..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#e8b86d] resize-none" />
          </label>

          <label>
            <span className="block text-sm font-medium text-gray-700 mb-1">صور العقار</span>
            <input type="file" multiple accept="image/*"
              onChange={(e) => setImages(Array.from(e.target.files || []))}
              className="w-full text-sm text-gray-500 file:ml-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#16213e] file:text-white" />
            {images.length > 0 && (
              <p className="text-xs text-gray-400 mt-1">تم اختيار {images.length} صورة</p>
            )}
          </label>

          <button type="submit" disabled={loading}
            className="bg-[#16213e] text-white py-3 rounded-xl font-bold text-lg hover:bg-[#0f172a] transition-colors disabled:opacity-50">
            {loading ? "جاري النشر..." : "نشر الإعلان مجاناً"}
          </button>
        </form>
      </div>
    </>
  );
}
