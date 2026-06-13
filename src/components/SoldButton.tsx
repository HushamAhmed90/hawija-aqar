"use client";
import { useState } from "react";

export default function SoldButton({ id, phone, initialSold }: { id: string; phone: string; initialSold: boolean }) {
  const [sold, setSold] = useState(initialSold);
  const [loading, setLoading] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [inputPhone, setInputPhone] = useState("");

  const confirm = async () => {
    if (inputPhone !== phone) return alert("رقم الهاتف غير صحيح");
    setLoading(true);
    await fetch(`/api/listings/${id}/admin`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sold: !sold }),
    });
    setSold(!sold);
    setShowPrompt(false);
    setLoading(false);
  };

  return (
    <>
      <button onClick={() => setShowPrompt(true)}
        className={`w-full mt-2 py-2 rounded-xl font-bold text-sm border transition-colors ${sold ? "bg-gray-100 text-gray-500 border-gray-200" : "bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100"}`}>
        {sold ? "✅ تم البيع/الإيجار" : "🏁 تحديد كـ: تم البيع"}
      </button>
      {showPrompt && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl p-6 w-80 shadow-xl">
            <h2 className="font-bold text-[#16213e] mb-3">تأكيد التحديث</h2>
            <p className="text-sm text-gray-500 mb-3">أدخل رقم هاتفك للتأكيد</p>
            <input value={inputPhone} onChange={e => setInputPhone(e.target.value)}
              placeholder="رقم الهاتف"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:border-[#e8b86d]" />
            <div className="flex gap-2">
              <button onClick={confirm} disabled={loading}
                className="flex-1 bg-[#16213e] text-white py-2 rounded-lg font-bold text-sm">
                {loading ? "..." : "تأكيد"}
              </button>
              <button onClick={() => setShowPrompt(false)}
                className="flex-1 border border-gray-200 py-2 rounded-lg text-sm text-gray-600">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
