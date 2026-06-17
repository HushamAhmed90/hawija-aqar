import { getAdminDb } from "@/lib/firestore-admin";
import { Car } from "@/types/car";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import ImageGallery from "@/components/ImageGallery";
import ShareListing from "@/components/ShareListing";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

async function getCar(id: string): Promise<Car | null> {
  try {
    const db = getAdminDb();
    const snap = await db.collection("cars").doc(id).get();
    if (!snap.exists) return null;
    return { id: snap.id, ...snap.data(), createdAt: snap.data()?.createdAt?.toDate() ?? null } as Car;
  } catch { return null; }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const car = await getCar(id);
  if (!car) return { title: "السيارة غير موجودة" };
  return {
    title: `${car.title} — حويجة للعقار والسيارات`,
    description: `${car.brand} ${car.model} ${car.year} — ${car.price.toLocaleString("ar-IQ")} دينار`,
    openGraph: { title: car.title, images: car.images?.[0] ? [car.images[0]] : [] },
  };
}

export default async function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const car = await getCar(id);

  if (!car) return (
    <>
      <Navbar />
      <div className="text-center py-20 text-gray-400">السيارة غير موجودة</div>
    </>
  );

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <Link href="/cars" className="text-sm text-gray-500 hover:text-[#16213e]">← العودة للسيارات</Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {car.images?.length > 0 ? (
            <ImageGallery images={car.images} title={car.title} />
          ) : (
            <div className="h-60 bg-gray-100 flex items-center justify-center text-6xl">🚗</div>
          )}

          <div className="p-6">
            {car.sold && (
              <div className="bg-gray-800 text-white text-center py-2 rounded-xl mb-4 font-bold text-sm">
                ✅ تم البيع — هذه السيارة لم تعد متاحة
              </div>
            )}

            {/* Badges */}
            <div className="flex gap-2 mb-3 flex-wrap">
              <span className={`text-sm font-bold px-3 py-1 rounded-full ${car.listingType === "بيع" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                {car.listingType}
              </span>
              <span className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{car.condition}</span>
              {car.sold && <span className="text-sm bg-gray-200 text-gray-600 px-3 py-1 rounded-full">مباعة</span>}
            </div>

            <h1 className="text-2xl font-bold text-[#16213e] mb-2">{car.title}</h1>
            <p className="text-gray-500 mb-4">📍 {car.village} — الحويجة، كركوك</p>

            <div className="text-3xl font-bold text-[#16213e] mb-6">
              {car.price.toLocaleString("ar-IQ")} <span className="text-lg font-normal text-gray-500">دينار عراقي</span>
            </div>

            {/* Car specs grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {[
                { label: "الماركة", value: car.brand, icon: "🏷️" },
                { label: "الموديل", value: car.model, icon: "🚘" },
                { label: "سنة الصنع", value: car.year?.toString(), icon: "📅" },
                { label: "الكيلومترات", value: car.mileage ? car.mileage.toLocaleString() + " كم" : "—", icon: "⏱️" },
                { label: "نوع الوقود", value: car.fuelType, icon: "⛽" },
                { label: "ناقل الحركة", value: car.transmission, icon: "⚙️" },
                { label: "اللون", value: car.color || "—", icon: "🎨" },
                { label: "الحالة", value: car.condition, icon: "✅" },
              ].map(({ label, value, icon }) => (
                <div key={label} className="bg-[#f8f9fa] rounded-xl p-3 border border-gray-100">
                  <p className="text-xs text-gray-400 mb-1">{icon} {label}</p>
                  <p className="font-bold text-[#16213e] text-sm">{value}</p>
                </div>
              ))}
            </div>

            {car.description && (
              <div className="mb-6">
                <h2 className="font-bold text-gray-700 mb-2">تفاصيل إضافية</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{car.description}</p>
              </div>
            )}

            {/* Contact */}
            <div className="bg-[#f8f9fa] rounded-xl p-4 border border-gray-100 mb-4">
              <h2 className="font-bold text-gray-700 mb-3">التواصل مع البائع</h2>
              <a href={`tel:${car.phone}`}
                className="flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-xl font-bold text-lg hover:bg-green-600 transition-colors mb-3">
                📞 {car.phone}
              </a>
              <a href={`https://wa.me/964${car.phone.replace(/^0/, "")}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-xl font-bold hover:bg-green-600 transition-colors">
                💬 تواصل عبر واتساب
              </a>
            </div>

            <ShareListing title={car.title} id={car.id} />
          </div>
        </div>
      </div>
    </>
  );
}
