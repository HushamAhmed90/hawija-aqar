"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Listing, PropertyType, ListingType } from "@/types/listing";
import Navbar from "@/components/Navbar";
import ListingCard from "@/components/ListingCard";
import { useSearchParams } from "next/navigation";

const propertyTypes: PropertyType[] = ["أرض", "بيت", "شقة", "محل", "مزرعة", "أخرى"];

export default function ListingsPage() {
  const searchParams = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<PropertyType | "">(
    (searchParams.get("type") as PropertyType) || ""
  );
  const [filterListing, setFilterListing] = useState<ListingType | "">("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, "listings"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
        })) as Listing[];
        setListings(data);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    fetchListings();
  }, []);

  const filtered = listings.filter((l) => {
    if (filterType && l.propertyType !== filterType) return false;
    if (filterListing && l.listingType !== filterListing) return false;
    if (search && !l.title.includes(search) && !l.village.includes(search)) return false;
    return true;
  });

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-[#16213e] mb-6">الإعلانات العقارية</h1>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="ابحث بالعنوان أو القرية..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 flex-1 text-sm focus:outline-none focus:border-[#e8b86d]"
          />
          <select
            value={filterListing}
            onChange={(e) => setFilterListing(e.target.value as ListingType | "")}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#e8b86d]"
          >
            <option value="">بيع وإيجار</option>
            <option value="بيع">بيع</option>
            <option value="إيجار">إيجار</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as PropertyType | "")}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#e8b86d]"
          >
            <option value="">كل الأنواع</option>
            {propertyTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">جاري التحميل...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">🔍</div>
            <p>لا توجد إعلانات حالياً</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {filtered.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
