import { getAdminDb } from "@/lib/firestore-admin";
import { Office } from "@/types/office";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getOffices(): Promise<Office[]> {
  try {
    const db = getAdminDb();
    const snap = await db.collection("offices").orderBy("createdAt", "desc").get();
    return snap.docs.map(d => ({ id: d.id, ...d.data(), createdAt: d.data().createdAt?.toDate() ?? new Date() })) as Office[];
  } catch { return []; }
}

export default async function OfficesPage() {
  const offices = await getOffices();

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-[#16213e] mb-2">🏢 المكاتب العقارية</h1>
        <p className="text-gray-500 text-sm mb-6">تصفح مكاتب العقارات المعتمدة في الحويجة وكركوك</p>

        {offices.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">🏢</div>
            <p>لا توجد مكاتب مسجلة بعد</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {offices.map(o => (
              <Link key={o.id} href={`/offices/${o.id}`}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:-translate-y-1 transition-all flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  {o.logo ? (
                    <img src={o.logo} alt={o.name} className="w-14 h-14 rounded-xl object-cover border border-gray-100" />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-[#16213e] flex items-center justify-center text-white text-2xl font-bold">
                      {o.name[0]}
                    </div>
                  )}
                  <div>
                    <h2 className="font-bold text-[#16213e]">{o.name}</h2>
                    <p className="text-xs text-gray-400">📍 {o.address}</p>
                  </div>
                </div>
                {o.description && (
                  <p className="text-sm text-gray-500 line-clamp-2">{o.description}</p>
                )}
                <div className="flex gap-2 mt-auto">
                  <a href={`tel:${o.phone}`} onClick={e => e.stopPropagation()}
                    className="flex-1 text-center text-xs py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100">
                    📞 اتصال
                  </a>
                  <a href={`https://wa.me/964${o.whatsapp.replace(/^0/, "")}`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                    className="flex-1 text-center text-xs py-2 bg-green-50 border border-green-200 rounded-lg text-green-700 hover:bg-green-100">
                    💬 واتساب
                  </a>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
