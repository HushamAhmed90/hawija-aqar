import { getAdminDb } from "@/lib/firestore-admin";
import { Listing } from "@/types/listing";
import Navbar from "@/components/Navbar";
import ListingCard from "@/components/ListingCard";

export const dynamic = "force-dynamic";

export default async function OwnerPage({ params }: { params: Promise<{ phone: string }> }) {
  const { phone } = await params;
  const decodedPhone = decodeURIComponent(phone);

  let listings: Listing[] = [];
  try {
    const db = getAdminDb();
    const snap = await db.collection("listings").where("phone", "==", decodedPhone).orderBy("createdAt", "desc").get();
    listings = snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() ?? null,
    })) as Listing[];
  } catch {}

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#16213e] flex items-center justify-center text-[#e8b86d] text-2xl font-bold">
            👤
          </div>
          <div>
            <div className="font-bold text-[#16213e] text-lg">{decodedPhone}</div>
            <div className="text-gray-400 text-sm">{listings.length} إعلان منشور</div>
          </div>
          <a href={`https://wa.me/964${decodedPhone.replace(/^0/, "")}`}
            target="_blank" rel="noopener noreferrer"
            className="mr-auto bg-[#25D366] text-white px-4 py-2 rounded-lg text-sm font-bold hover:opacity-90">
            واتساب
          </a>
        </div>

        {listings.length === 0 ? (
          <div className="text-center py-20 text-gray-400">لا توجد إعلانات</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {listings.map(l => <ListingCard key={l.id} listing={l} />)}
          </div>
        )}
      </div>
    </>
  );
}
