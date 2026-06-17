"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { FuelType, Transmission, CarCondition, CarListingType } from "@/types/car";

const CLOUDINARY_CLOUD = "dstbkra00";
const CLOUDINARY_PRESET = "hawija-aqar";

const villages = [
  "الحويجة", "الرياض", "العلم", "الزيدية", "الكيلاني", "أبو عوجة",
  "السنية", "الكسارة", "المحمودية", "الدبس", "بركة", "الملك",
  "أم الزيتون", "الجنابيين", "السبعاوي", "أخرى",
];

const brands = [
  "تويوتا", "كيا", "هيونداي", "نيسان", "هوندا", "مازدا", "ميتسوبيشي",
  "سوزوكي", "شيفروليه", "فورد", "BMW", "مرسيدس", "أودي", "فولكسفاغن",
  "سوبارو", "دايهاتسو", "إيسوزو", "جيب", "رينو", "بيجو", "أخرى",
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

export default function NewCarPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    listingType: "بيع" as CarListingType,
    brand: "تويوتا",
    model: "",
    year: new Date().getFullYear().toString(),
    mileage: "",
    color: "",
    fuelType: "بنزين" as FuelType,
    transmission: "أوتوماتيك" as Transmission,
    condition: "مستعمل" as CarCondition,
    village: "الحويجة",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 8) { alert("الحد الأقصى 8 صور"); return; }
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
      const res = await fetch("/api/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          year: Number(form.year),
          mileage: Number(form.mileage),
          images: imageUrls,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      router.push("/cars");
    } catch (err: unknown) {
      alert("خطأ: " + (err instanceof Error ? err.message : String(err)));
    }
    setLoading(false);
  };

  const inp = "w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#e8b86d]";

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-[#16213e] mb-6">🚗 إضافة سيارة للبيع</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-5">

          {/* نوع العرض + الحالة */}
          <div className="flex gap-4">
            <label className="flex-1">
              <span className="block text-sm font-medium text-gray-700 mb-1">نوع العرض</span>
              <select name="listingType" value={form.listingType} onChange={handleChange} className={inp}>
                <option value="بيع">بيع</option>
                <option value="إيجار">إيجار</option>
              </select>
            </label>
            <label className="flex-1">
              <span className="block text-sm font-medium text-gray-700 mb-1">الحالة</span>
              <select name="condition" value={form.condition} onChange={handleChange} className={inp}>
                <option value="مستعمل">مستعمل</option>
                <option value="جديد">جديد</option>
              </select>
            </label>
          </div>

          {/* الماركة + الموديل */}
          <div className="flex gap-4">
            <label className="flex-1">
              <span className="block text-sm font-medium text-gray-700 mb-1">الماركة *</span>
              <select name="brand" value={form.brand} onChange={handleChange} className={inp}>
                {brands.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </label>
            <label className="flex-1">
              <span className="block text-sm font-medium text-gray-700 mb-1">الموديل *</span>
              <input required name="model" value={form.model} onChange={handleChange}
                placeholder="مثال: كامري، لاند كروزر" className={inp} />
            </label>
          </div>

          {/* السنة + الكيلومترات */}
          <div className="flex gap-4">
            <label className="flex-1">
              <span className="block text-sm font-medium text-gray-700 mb-1">سنة الصنع *</span>
              <input required type="number" name="year" value={form.year} onChange={handleChange}
                min="1990" max="2026" className={inp} />
            </label>
            <label className="flex-1">
              <span className="block text-sm font-medium text-gray-700 mb-1">الكيلومترات</span>
              <input type="number" name="mileage" value={form.mileage} onChange={handleChange}
                placeholder="0" className={inp} />
            </label>
          </div>

          {/* الوقود + ناقل الحركة */}
          <div className="flex gap-4">
            <label className="flex-1">
              <span className="block text-sm font-medium text-gray-700 mb-1">نوع الوقود</span>
              <select name="fuelType" value={form.fuelType} onChange={handleChange} className={inp}>
                {(["بنزين", "ديزل", "كهربائي", "هجين"] as FuelType[]).map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </label>
            <label className="flex-1">
              <span className="block text-sm font-medium text-gray-700 mb-1">ناقل الحركة</span>
              <select name="transmission" value={form.transmission} onChange={handleChange} className={inp}>
                <option value="أوتوماتيك">أوتوماتيك</option>
                <option value="يدوي">يدوي</option>
              </select>
            </label>
          </div>

          {/* اللون */}
          <label>
            <span className="block text-sm font-medium text-gray-700 mb-1">اللون</span>
            <input name="color" value={form.color} onChange={handleChange}
              placeholder="مثال: أبيض، أسود، فضي" className={inp} />
          </label>

          {/* عنوان الإعلان */}
          <label>
            <span className="block text-sm font-medium text-gray-700 mb-1">عنوان الإعلان *</span>
            <input required name="title" value={form.title} onChange={handleChange}
              placeholder="مثال: تويوتا كامري 2020 للبيع" className={inp} />
          </label>

          {/* المنطقة */}
          <label>
            <span className="block text-sm font-medium text-gray-700 mb-1">المنطقة *</span>
            <select name="village" value={form.village} onChange={handleChange} className={inp}>
              {villages.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </label>

          {/* السعر */}
          <label>
            <span className="block text-sm font-medium text-gray-700 mb-1">السعر (دينار عراقي) *</span>
            <input required type="number" name="price" value={form.price} onChange={handleChange}
              placeholder="مثال: 15000000" className={inp} />
          </label>

          {/* الهاتف */}
          <label>
            <span className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف *</span>
            <input required name="phone" value={form.phone} onChange={handleChange}
              placeholder="07xxxxxxxxx" className={inp} />
          </label>

          {/* الوصف */}
          <label>
            <span className="block text-sm font-medium text-gray-700 mb-1">تفاصيل إضافية</span>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3}
              placeholder="اكتب أي تفاصيل إضافية عن السيارة..."
              className={inp + " resize-none"} />
          </label>

          {/* الصور */}
          <div>
            <span className="block text-sm font-medium text-gray-700 mb-2">صور السيارة (حتى 8 صور)</span>
            {previews.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mb-3">
                {previews.map((src, i) => (
                  <div key={i} className="relative">
                    <img src={src} alt="" className="w-full h-20 object-cover rounded-lg border border-gray-200" />
                    <button type="button" onClick={() => removeImage(i)}
                      className="absolute top-1 left-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
            {images.length < 8 && (
              <label className="flex items-center gap-2 cursor-pointer border-2 border-dashed border-gray-300 rounded-lg px-4 py-3 hover:border-[#e8b86d] transition-colors">
                <span className="text-2xl">📸</span>
                <span className="text-sm text-gray-500">اضغط لإضافة صور السيارة</span>
                <input type="file" accept="image/*" multiple onChange={handleImages} className="hidden" />
              </label>
            )}
            {uploadProgress && <p className="text-sm text-blue-600 mt-2">{uploadProgress}</p>}
          </div>

          <button type="submit" disabled={loading}
            className="bg-[#16213e] text-white py-3 rounded-xl font-bold text-lg hover:bg-[#0f172a] transition-colors disabled:opacity-50">
            {loading ? (uploadProgress || "جاري النشر...") : "🚗 نشر الإعلان مجاناً"}
          </button>
        </form>
      </div>
    </>
  );
}
