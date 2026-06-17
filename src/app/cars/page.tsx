"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Car } from "@/types/car";
import Navbar from "@/components/Navbar";
import Link from "next/link";

const brands = ["تويوتا", "كيا", "هيونداي", "نيسان", "هوندا", "مازدا", "ميتسوبيشي", "سوزوكي", "شيفروليه", "فورد", "BMW", "مرسيدس", "أودي", "فولكسفاغن", "سوبارو", "دايهاتسو", "إيسوزو", "جيب", "رينو", "بيجو", "أخرى"];

function CarCard({ car }: { car: Car }) {
  return (
    <Link href={`/cars/${car.id}`} className="block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all">
      {car.images?.[0] ? (
        <img src={car.images[0]} alt={car.title} className="w-full h-48 object-cover" />
      ) : (
        <div className="h-48 bg-gray-100 flex items-center justify-center text-5xl">🚗</div>
      )}
      <div className="p-4">
        <div className="flex gap-2 mb-2 flex-wrap">
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${car.listingType === "بيع" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
            {car.listingType}
          </span>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{car.condition}</span>
          {car.sold && <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">مباعة</span>}
        </div>
        <h3 className="font-bold text-[#16213e] mb-1 line-clamp-2">{car.title}</h3>
        <p className="text-xs text-gray-500 mb-2">📍 {car.village} · {car.year} · {car.mileage ? car.mileage.toLocaleString() + " كم" : "—"}</p>
        <div className="flex gap-2 text-xs text-gray-500 mb-3">
          <span>⛽ {car.fuelType}</span>
          <span>⚙️ {car.transmission}</span>
          {car.color && <span>🎨 {car.color}</span>}
        </div>
        <p className="text-lg font-bold text-[#16213e]">{car.price.toLocaleString("ar-IQ")} <span className="text-xs font-normal text-gray-400">دينار</span></p>
      </div>
    </Link>
  );
}

function CarsContent() {
  const searchParams = useSearchParams();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterBrand, setFilterBrand] = useState(searchParams.get("brand") || "");
  const [filterListing, setFilterListing] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetch("/api/cars").then(r => r.json()).then(data => {
      setCars(Array.isArray(data) ? data : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = cars.filter((c) => {
    if (filterBrand && c.brand !== filterBrand) return false;
    if (filterListing && c.listingType !== filterListing) return false;
    if (search && !c.title.includes(search) && !c.brand.includes(search) && !c.model.includes(search)) return false;
    if (minPrice && c.price < Number(minPrice)) return false;
    if (maxPrice && c.price > Number(maxPrice)) return false;
    return true;
  });

  const inp = "border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#e8b86d]";

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#16213e]">🚗 السيارات</h1>
          <Link href="/cars/new" className="bg-[#e8b86d] text-[#16213e] px-4 py-2 rounded-lg font-bold text-sm hover:bg-yellow-400 transition-colors">
            + أضف سيارتك
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-3 flex flex-col sm:flex-row gap-3">
          <input type="text" placeholder="ابحث بالماركة أو الموديل..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className={inp + " flex-1"} />
          <select value={filterListing} onChange={(e) => setFilterListing(e.target.value)} className={inp}>
            <option value="">بيع وإيجار</option>
            <option value="بيع">بيع</option>
            <option value="إيجار">إيجار</option>
          </select>
          <select value={filterBrand} onChange={(e) => setFilterBrand(e.target.value)} className={inp}>
            <option value="">كل الماركات</option>
            {brands.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          <button onClick={() => setShowFilters(!showFilters)} className={inp + " text-gray-600 hover:border-[#e8b86d] whitespace-nowrap"}>
            🔧 فلتر السعر
          </button>
        </div>

        {showFilters && (
          <div className="bg-white rounded-xl border border-gray-100 p-4 mb-3 flex gap-3 items-center">
            <span className="text-sm text-gray-600 whitespace-nowrap">السعر:</span>
            <input type="number" placeholder="من" value={minPrice} onChange={e => setMinPrice(e.target.value)} className={inp + " flex-1"} />
            <span className="text-gray-400">—</span>
            <input type="number" placeholder="إلى" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className={inp + " flex-1"} />
            <span className="text-xs text-gray-400">دينار</span>
            <button onClick={() => { setMinPrice(""); setMaxPrice(""); }} className="text-xs text-red-400 hover:text-red-600">مسح</button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-gray-400">جاري التحميل...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">🔍</div>
            <p>لا توجد سيارات مطابقة</p>
            <Link href="/cars/new" className="mt-4 inline-block bg-[#e8b86d] text-[#16213e] px-6 py-2 rounded-lg font-bold hover:bg-yellow-400 transition-colors">
              أضف أول سيارة
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {filtered.map(c => <CarCard key={c.id} car={c} />)}
          </div>
        )}
      </div>
    </>
  );
}

export default function CarsPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-400">جاري التحميل...</div>}>
      <CarsContent />
    </Suspense>
  );
}
