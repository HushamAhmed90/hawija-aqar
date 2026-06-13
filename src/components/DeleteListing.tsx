"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteListing({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    const res = await fetch(`/api/listings/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    const data = await res.json();
    if (res.ok) {
      router.push("/listings");
    } else {
      alert(data.error || "حدث خطأ");
    }
    setLoading(false);
  };

  return (
    <>
      <button onClick={() => setOpen(true)}
        className="text-sm text-red-500 border border-red-200 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors">
        🗑️ حذف إعلاني
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="font-bold text-[#16213e] text-lg mb-2">حذف الإعلان</h3>
            <p className="text-gray-500 text-sm mb-4">أدخل رقم هاتفك للتأكيد</p>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="07xxxxxxxxx"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:border-red-400"
            />
            <div className="flex gap-3">
              <button onClick={handleDelete} disabled={loading || !phone}
                className="flex-1 bg-red-500 text-white py-2 rounded-lg font-bold hover:bg-red-600 disabled:opacity-50">
                {loading ? "جاري الحذف..." : "تأكيد الحذف"}
              </button>
              <button onClick={() => setOpen(false)}
                className="flex-1 border border-gray-200 py-2 rounded-lg text-gray-600 hover:bg-gray-50">
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
