import { getAdminDb } from "@/lib/firestore-admin";
import { Office } from "@/types/office";
import { Listing } from "@/types/listing";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import ListingCard from "@/components/ListingCard";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

async function getOffice(id: string): Promise<Office | null> {
  try {
    const db = getAdminDb();
    const snap = await db.collection("offices").doc(id).get();
    if (!snap.exists) return null;
    return { id: snap.id, ...snap.data(), createdAt: snap.data()?.createdAt?.toDate() ?? new Date() } as Office;
  } catch { return null; }
}

async function getOfficeListings(officeId: string): Promise<Listing[]> {
  try {
    const db = getAdminDb();
    const snap = await db.collection("listings").where("officeId", "==", officeId).orderBy("createdAt", "desc").get();
    return snap.docs.map(d => ({ id: d.id, ...d.data(), createdAt: d.data().createdAt?.toDate() ?? new Date() })) as Listing[];
  } catch { return []; }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const office = await getOffice(id);
  if (!office) return { title: "المكتب غير موجود" };
  return { title: `${office.name} — حويجة للعقار والسيارات`, description: office.description };
}

export default async function OfficePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [office, listings] = await Promise.all([getOffice(id), getOfficeListings(id)]);

  if (!office) return (
    <>
      <Navbar />
      <div className="text-center py-20 text-gray-400">المكتب غير موجود</div>
    </>
  );

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/offices" className="text-sm text-gray-500 hover:text-[#16213e] mb-6 inline-block">← العودة للمكاتب</Link>

        {/* Office header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-start gap-5">
            {office.logo ? (
              <img src={office.logo} alt={office.name} className="w-20 h-20 rounded-xl object-cover border border-gray-100 flex-shrink-0" />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-[#16213e] flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
                {office.name[0]}
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-[#16213e] mb-1">{office.name}</h1>
              <p className="text-gray-500 text-sm mb-2">📍 {office.address}</p>
              {office.description && <p className="text-gray-600 text-sm leading-relaxed">{office.description}</p>}
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <a href={`tel:${office.phone}`}
              className="flex-1 text-center py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-100 transition-colors">
              📞 {office.phone}
            </a>
            <a href={`https://wa.me/964${office.whatsapp.replace(/^0/, "")}`} target="_blank" rel="noopener noreferrer"
              className="flex-1 text-center py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-colors">
              💬 تواصل عبر واتساب
            </a>
          </div>
        </div>

        {/* Listings */}
        <h2 className="text-xl font-bold text-[#16213e] mb-4">
          🏠 إعلانات المكتب <span className="text-sm font-normal text-gray-400">({listings.length})</span>
        </h2>
        {listings.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-4xl mb-3">📋</div>
            <p>لا توجد إعلانات بعد</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {listings.map(l => <ListingCard key={l.id} listing={l} />)}
          </div>
        )}
      </div>
    </>
  );
}
