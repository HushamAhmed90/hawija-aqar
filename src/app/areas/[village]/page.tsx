import { getAdminDb } from "@/lib/firestore-admin";
import { Listing } from "@/types/listing";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

const VILLAGES = ["الحويجة","الرياض","العلم","الزيدية","الكيلاني","أبو عوجة","السنية","الكسارة","المحمودية","الدبس","بركة","الملك","أم الزيتون","الجنابيين","السبعاوي"];

export async function generateStaticParams() {
  return VILLAGES.map(v => ({ village: encodeURIComponent(v) }));
}

export async function generateMetadata({ params }: { params: Promise<{ village: string }> }): Promise<Metadata> {
  const { village } = await params;
  const name = decodeURIComponent(village);
  return {
    title: `عقارات ${name} — الحويجة | عقار الحويجة`,
    description: `تصفح إعلانات بيع وشراء وإيجار العقارات في ${name} — قضاء الحويجة، كركوك`,
  };
}

async function getAreaListings(village: string): Promise<Listing[]> {
  try {
    const db = getAdminDb();
    const snap = await db.collection("listings").where("village", "==", village).orderBy("createdAt", "desc").get();
    return snap.docs.map(d => ({ id: d.id, ...d.data(), createdAt: d.data().createdAt?.toDate()?.toISOString() ?? null })) as Listing[];
  } catch { return []; }
}

export default async function AreaPage({ params }: { params: Promise<{ village: string }> }) {
  const { village } = await params;
  const name = decodeURIComponent(village);
  const listings = await getAreaListings(name);

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/areas" className="text-sm text-gray-400 hover:text-[#16213e]">← كل المناطق</Link>
          <h1 className="text-3xl font-bold text-[#16213e] mt-2">عقارات {name}</h1>
          <p className="text-gray-500 mt-1">{listings.length} إعلان متاح في {name} — الحويجة، كركوك</p>
        </div>

        {/* Map */}
        <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm mb-8 h-64">
          <iframe
            src={`https://maps.google.com/maps?q=${encodeURIComponent(name + " الحويجة كركوك العراق")}&output=embed&z=13`}
            className="w-full h-full border-0"
            loading="lazy"
          />
        </div>

        {listings.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-4">🏘️</div>
            <p>لا توجد إعلانات في {name} حالياً</p>
            <Link href="/listings/new" className="mt-4 inline-block bg-[#e8b86d] text-[#16213e] px-6 py-2 rounded-xl font-bold">
              أضف أول إعلان
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {listings.map(l => (
              <Link key={l.id} href={`/listings/${l.id}`}
                className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-4">
                {l.images?.[0] ? (
                  <img src={l.images[0]} alt={l.title} className="w-full h-36 object-cover rounded-lg mb-3" />
                ) : (
                  <div className="w-full h-36 bg-gray-100 rounded-lg mb-3 flex items-center justify-center text-4xl">🏠</div>
                )}
                <div className="flex gap-1 mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${l.listingType === "بيع" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>{l.listingType}</span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{l.propertyType}</span>
                </div>
                <h3 className="font-bold text-[#16213e] text-sm truncate">{l.title}</h3>
                <p className="text-[#e8b86d] font-bold mt-1 text-sm">{l.price.toLocaleString("ar-IQ")} د.ع</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
