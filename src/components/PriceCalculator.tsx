"use client";
import { useState } from "react";

export default function PriceCalculator() {
  const [price, setPrice] = useState("");
  const [type, setType] = useState("شراء");
  const [years, setYears] = useState("20");
  const [down, setDown] = useState("20");

  const p = Number(price.replace(/,/g, "")) || 0;
  const downAmount = p * (Number(down) / 100);
  const loan = p - downAmount;
  const monthly = type === "إيجار" ? p / 12 : loan > 0 ? loan / (Number(years) * 12) : 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="font-bold text-[#16213e] text-lg mb-4">🧮 حاسبة السعر</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">السعر الكلي (دينار)</label>
          <input value={price} onChange={e => setPrice(e.target.value.replace(/[^0-9]/g, ""))}
            placeholder="مثال: 50000000"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#e8b86d]" />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">نوع العملية</label>
          <select value={type} onChange={e => setType(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#e8b86d]">
            <option>شراء</option>
            <option>إيجار</option>
          </select>
        </div>
        {type === "شراء" && <>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">الدفعة الأولى %</label>
            <input type="number" value={down} onChange={e => setDown(e.target.value)} min="0" max="100"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#e8b86d]" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">مدة السداد (سنة)</label>
            <input type="number" value={years} onChange={e => setYears(e.target.value)} min="1" max="30"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#e8b86d]" />
          </div>
        </>}
      </div>
      {p > 0 && (
        <div className="bg-[#f8f9fa] rounded-xl p-4 grid grid-cols-2 gap-3 text-center">
          {type === "شراء" && <>
            <div className="bg-white rounded-lg p-3 border border-gray-100">
              <div className="text-xs text-gray-400 mb-1">الدفعة الأولى</div>
              <div className="font-bold text-[#16213e] text-sm">{downAmount.toLocaleString("ar-IQ")} د.ع</div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-100">
              <div className="text-xs text-gray-400 mb-1">المبلغ المتبقي</div>
              <div className="font-bold text-[#16213e] text-sm">{loan.toLocaleString("ar-IQ")} د.ع</div>
            </div>
          </>}
          <div className="bg-[#16213e] rounded-lg p-3 col-span-2">
            <div className="text-xs text-gray-300 mb-1">{type === "إيجار" ? "الإيجار الشهري التقديري" : "القسط الشهري التقديري"}</div>
            <div className="font-bold text-[#e8b86d] text-lg">{Math.round(monthly).toLocaleString("ar-IQ")} د.ع / شهر</div>
          </div>
        </div>
      )}
    </div>
  );
}
