"use client";

export default function ShareListing({ title, id }: { title: string; id: string }) {
  const url = `https://hawija-aqar.vercel.app/listings/${id}`;
  const text = `${title} — عقار الحويجة`;

  return (
    <div className="flex gap-3 mt-4">
      <a href={`https://wa.me/?text=${encodeURIComponent(text + "\n" + url)}`}
        target="_blank" rel="noopener noreferrer"
        className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white py-2 rounded-lg text-sm font-bold hover:opacity-90">
        📲 شارك واتساب
      </a>
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank" rel="noopener noreferrer"
        className="flex-1 flex items-center justify-center gap-2 bg-[#1877F2] text-white py-2 rounded-lg text-sm font-bold hover:opacity-90">
        📘 شارك فيسبوك
      </a>
      <button onClick={() => { navigator.clipboard.writeText(url); alert("تم نسخ الرابط!"); }}
        className="flex items-center justify-center gap-1 border border-gray-200 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
        🔗 نسخ
      </button>
    </div>
  );
}
