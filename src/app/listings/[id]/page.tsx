"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Listing } from "@/types/listing";
import Navbar from "@/components/Navbar";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function ListingDetailPage() {
  const { id } = useParams();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      const docRef = doc(db, "listings", id as string);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setListing({ id: snap.id, ...snap.data(), createdAt: snap.data().createdAt?.toDate() } as Listing);
      }
      setLoading(false);
    };
    fetch();
  }, [id]);

  if (loading) return (
    <>
      <Navbar />
      <div className="text-center py-20 text-gray-400">جاري التحميل...</div>
    </>
  );

  if (!listing) return (
    <>
      <Navbar />
      <div className="text-center py-20 text-gray-400">الإعلان غير موجود</div>
    </>
  );

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/listings" className="text-sm text-gray-500 hover:text-[#16213e] mb-4 block">
          ← العودة للإعلانات
        </Link>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Images */}
          {listing.images?.length > 0 ? (
            <div>
              <img
                src={listing.images[currentImage]}
                alt={listing.title}
                className="w-full h-72 md:h-96 object-cover"
              />
              {listing.images.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {listing.images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      onClick={() => setCurrentImage(i)}
                      className={`h-16 w-20 object-cover rounded cursor-pointer border-2 ${i === currentImage ? "border-[#e8b86d]" : "border-transparent"}`}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="h-60 bg-gray-100 flex items-center justify-center text-6xl">🏠</div>
          )}

          <div className="p-6">
            {/* Badges */}
            <div className="flex gap-2 mb-3">
              <span className={`text-sm font-bold px-3 py-1 rounded-full ${listing.listingType === "بيع" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                {listing.listingType}
              </span>
              <span className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                {listing.propertyType}
              </span>
            </div>

            <h1 className="text-2xl font-bold text-[#16213e] mb-2">{listing.title}</h1>
            <p className="text-gray-500 mb-4">📍 {listing.village} — الحويجة، كركوك</p>

            <div className="text-3xl font-bold text-[#16213e] mb-6">
              {listing.price.toLocaleString("ar-IQ")} <span className="text-lg font-normal text-gray-500">دينار عراقي</span>
            </div>

            {listing.description && (
              <div className="mb-6">
                <h2 className="font-bold text-gray-700 mb-2">تفاصيل العقار</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{listing.description}</p>
              </div>
            )}

            {/* Contact */}
            <div className="bg-[#f8f9fa] rounded-xl p-4 border border-gray-100">
              <h2 className="font-bold text-gray-700 mb-3">التواصل مع المالك</h2>
              <a
                href={`tel:${listing.phone}`}
                className="flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-xl font-bold text-lg hover:bg-green-600 transition-colors"
              >
                📞 {listing.phone}
              </a>
              <a
                href={`https://wa.me/964${listing.phone.replace(/^0/, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity mt-2"
              >
                واتساب
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
