"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";
import { PropertyType, ListingType } from "@/types/listing";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

const CLOUDINARY_CLOUD = "dstbkra00";
const CLOUDINARY_PRESET = "hawija-aqar";

const villages = [
  "الحويجة", "الرياض", "العزيري", "الخان", "حياش",
  "المنزلة", "أم الدنيا", "الحلاوة", "أخرى",
];

async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_PRESET);
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`,
    { method: "POST", body: formData }
  );
  const data = await res.json();
  if (!data.secure_url) throw new Error("فشل رفع الصورة");
  return data.secure_url;
}

export default function NewListingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState("");
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

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 5) {
      alert("الحد الأقصى 5 صور");
      return;
    }
    setImages((prev) => [...prev, ...files]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => setPreviews((prev) => [...prev, ev.target?.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (i: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== i));
    setPreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrls: string[] = [];
      if (images.length > 0) {
        setUploadProgress("جاري رفع الصور...");
        imageUrls = await Promise.all(images.map(uploadToCloudinary));
        setUploadProgress("");
      }

      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, price: Number(form.price), images: imageUrls }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(JSON.stringify(errData));
      }
      router.push("/listings");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "حدث خطأ";
      console.error(err);
      alert("خطأ: " + msg);
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

          {/* Image Upload */}
          <div>
            <span className="block text-sm font-medium text-gray-700 mb-2">صور العقار (حتى 5 صور)</span>

            {previews.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-3">
                {previews.map((src, i) => (
                  <div key={i} className="relative">
                    <img src={src} alt="" className="w-full h-24 object-cover rounded-lg border border-gray-200" />
                    <button type="button" onClick={() => removeImage(i)}
                      className="absolute top-1 left-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold hover:bg-red-600">
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {images.length < 5 && (
              <label className="flex items-center gap-2 cursor-pointer border-2 border-dashed border-gray-300 rounded-lg px-4 py-3 hover:border-[#e8b86d] transition-colors">
                <span className="text-2xl">📸</span>
                <span className="text-sm text-gray-500">اضغط لإضافة صور</span>
                <input type="file" accept="image/*" multiple onChange={handleImages} className="hidden" />
              </label>
            )}

            {uploadProgress && (
              <p className="text-sm text-blue-600 mt-2">{uploadProgress}</p>
            )}
          </div>

          <button type="submit" disabled={loading}
            className="bg-[#16213e] text-white py-3 rounded-xl font-bold text-lg hover:bg-[#0f172a] transition-colors disabled:opacity-50">
            {loading ? (uploadProgress || "جاري النشر...") : "نشر الإعلان مجاناً"}
          </button>
        </form>
      </div>
    </>
  );
}
