import { getAdminDb } from "@/lib/firestore-admin";
import { Listing } from "@/types/listing";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import ImageGallery from "@/components/ImageGallery";
import DeleteListing from "@/components/DeleteListing";
import ShareListing from "@/components/ShareListing";
import StatTracker from "@/components/StatTracker";
import WhatsAppButton from "@/components/WhatsAppButton";
import SoldButton from "@/components/SoldButton";
import StarRating from "@/components/StarRating";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const listing = await getListing(id);
  if (!listing) return { title: "الإعلان غير موجود" };
  return {
    title: `${listing.title} — عقار الحويجة`,
    description: `${listing.listingType} ${listing.propertyType} في ${listing.village} — ${listing.price.toLocaleString("ar-IQ")} دينار`,
    openGraph: {
      title: listing.title,
      description: `${listing.propertyType} ${listing.listingType} في ${listing.village}`,
      images: listing.images?.[0] ? [listing.images[0]] : [],
    },
  };
}

async function getListing(id: string): Promise<Listing | null> {
  try {
    const db = getAdminDb();
    const snap = await db.collection("listings").doc(id).get();
    if (!snap.exists) return null;
    return { id: snap.id, ...snap.data(), createdAt: snap.data()?.createdAt?.toDate() ?? null } as Listing;
  } catch {
    return null;
  }
}

export default async function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = await getListing(id);

  if (!listing) return (
    <>
      <Navbar />
      <div className="text-center py-20 text-gray-400">الإعلان غير موجود</div>
    </>
  );

  const schema = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": listing.title,
    "description": listing.description,
    "url": `https://hawija-aqar.vercel.app/listings/${listing.id}`,
    "image": listing.images?.[0] ?? "",
    "offers": {
      "@type": "Offer",
      "price": listing.price,
      "priceCurrency": "IQD",
      "availability": listing.sold ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": listing.village,
      "addressRegion": "كركوك",
      "addressCountry": "IQ",
    },
  };

  const avgRating = listing.ratingCount && listing.ratingCount > 0
    ? Math.round((listing.ratingTotal ?? 0) / listing.ratingCount * 10) / 10
    : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <StatTracker id={id} />
        <div className="flex items-center justify-between mb-4">
          <Link href="/listings" className="text-sm text-gray-500 hover:text-[#16213e]">
            ← العودة للإعلانات
          </Link>
          <DeleteListing id={listing.id} />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {listing.images?.length > 0 ? (
            <ImageGallery images={listing.images} title={listing.title} />
          ) : (
            <div className="h-60 bg-gray-100 flex items-center justify-center text-6xl">🏠</div>
          )}

          <div className="p-6">
            {listing.sold && (
              <div className="bg-gray-800 text-white text-center py-2 rounded-xl mb-4 font-bold text-sm">
                ✅ تم البيع / الإيجار — هذا الإعلان لم يعد متاحاً
              </div>
            )}
            <div className="flex gap-2 mb-3 flex-wrap">
              <span className={`text-sm font-bold px-3 py-1 rounded-full ${listing.listingType === "بيع" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                {listing.listingType}
              </span>
              <span className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                {listing.propertyType}
              </span>
              {listing.sold && <span className="text-sm bg-gray-200 text-gray-600 px-3 py-1 rounded-full">مباع</span>}
              {avgRating && <span className="text-sm bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full">⭐ {avgRating} ({listing.ratingCount})</span>}
            </div>

            <h1 className="text-2xl font-bold text-[#16213e] mb-2">{listing.title}</h1>
            <Link href={`/areas/${encodeURIComponent(listing.village)}`} className="text-gray-500 mb-4 inline-block hover:text-[#e8b86d]">
              📍 {listing.village} — الحويجة، كركوك
            </Link>

            <div className="text-3xl font-bold text-[#16213e] mb-6">
              {listing.price.toLocaleString("ar-IQ")} <span className="text-lg font-normal text-gray-500">دينار عراقي</span>
            </div>

            {listing.description && (
              <div className="mb-6">
                <h2 className="font-bold text-gray-700 mb-2">تفاصيل العقار</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{listing.description}</p>
              </div>
            )}

            {/* Map */}
            <div className="mb-6 rounded-xl overflow-hidden border border-gray-100 h-48">
              <iframe
                src={`https://maps.google.com/maps?q=${encodeURIComponent(listing.village + " الحويجة كركوك العراق")}&output=embed&z=13`}
                className="w-full h-full border-0"
                loading="lazy"
              />
            </div>

            <div className="bg-[#f8f9fa] rounded-xl p-4 border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-gray-700">التواصل مع المالك</h2>
                <a href={`/owner/${encodeURIComponent(listing.phone)}`}
                  className="text-xs text-[#e8b86d] hover:underline">كل إعلاناته ←</a>
              </div>
              <a href={`tel:${listing.phone}`}
                className="flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-xl font-bold text-lg hover:bg-green-600 transition-colors">
                📞 {listing.phone}
              </a>
              <WhatsAppButton phone={listing.phone} listingId={listing.id} />
            </div>

            {listing.views && listing.views > 0 ? (
              <div className="flex gap-4 mt-3 text-xs text-gray-400">
                <span>👁️ {listing.views} مشاهدة</span>
                {listing.whatsappClicks ? <span>📲 {listing.whatsappClicks} تواصل واتساب</span> : null}
              </div>
            ) : null}

            <StarRating listingId={listing.id} />
            <SoldButton id={listing.id} phone={listing.phone} initialSold={!!listing.sold} />
            <ShareListing title={listing.title} id={listing.id} />
          </div>
        </div>
      </div>
    </>
  );
}
