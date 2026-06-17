import Navbar from "@/components/Navbar";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "مناطق الحويجة — عقار الحويجة",
  description: "تصفح العقارات حسب المنطقة في قضاء الحويجة وجميع قراه",
};

const VILLAGES = [
  { name: "الحويجة", icon: "🏙️" },
  { name: "الرياض", icon: "🌿" },
  { name: "العزيري", icon: "🏘️" },
  { name: "الخان", icon: "🏡" },
  { name: "حياش", icon: "🌾" },
  { name: "المنزلة", icon: "🏠" },
  { name: "أم الدنيا", icon: "🌳" },
  { name: "الحلاوة", icon: "🌄" },
];

export default function AreasPage() {
  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-[#16213e] mb-2">مناطق الحويجة</h1>
          <p className="text-gray-500">اختر منطقتك وتصفح الإعلانات المتاحة فيها</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {VILLAGES.map(v => (
            <Link key={v.name} href={`/areas/${encodeURIComponent(v.name)}`}
              className="bg-white border border-gray-100 rounded-2xl p-5 text-center shadow-sm hover:shadow-md hover:border-[#e8b86d] transition-all">
              <div className="text-4xl mb-2">{v.icon}</div>
              <div className="font-bold text-[#16213e] text-sm">{v.name}</div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
