import Link from "next/link";
import { Listing } from "@/types/listing";

export default function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link href={`/listings/${listing.id}`}>
      <div className="bg-white rounded-xl shadow hover:shadow-md transition-shadow overflow-hidden border border-gray-100">
        <div className="h-44 bg-gray-200 overflow-hidden">
          {listing.images?.[0] ? (
            <img
              src={listing.images[0]}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">
              🏠
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span
              className={`text-xs font-bold px-2 py-1 rounded-full ${
                listing.listingType === "بيع"
                  ? "bg-green-100 text-green-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {listing.listingType}
            </span>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {listing.propertyType}
            </span>
          </div>

          <h3 className="font-bold text-gray-800 mb-1 truncate">{listing.title}</h3>
          <p className="text-sm text-gray-500 mb-3">📍 {listing.village}</p>

          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-[#16213e]">
              {listing.price.toLocaleString("ar-IQ")} د.ع
            </span>
            <span className="text-xs text-[#e8b86d] font-medium">عرض التفاصيل ←</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
