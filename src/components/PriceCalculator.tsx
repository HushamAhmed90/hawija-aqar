"use client";
import { useState } from "react";

export default function PriceCalculator() {
  const [mode, setMode] = useState<"عقار" | "سيارة">("عقار");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("شراء");
  const [years, setYears] = useState("20");
  const [down, setDown] = useState("20");
  const [carYears, setCarYears] = useState("3");
  const [carDown, setCarDown] = useState("30");

  const p = Number(price.replace(/,/g, "")) || 0;

  // Real estate calc
  const downAmount = p * (Number(down) / 100);
  const loan = p - downAmount;
  const monthly = type === "إيجار" ? p / 12 : loan > 0 ? loan / (Number(years) * 12) : 0;

  // Car calc
  const carDownAmount = p * (Number(carDown) / 100);
  const carLoan = p - carDownAmount;
  const carMonthly = type === "إيجار" ? p / 12 : carLoan > 0 ? carLoan / (Number(carYears) * 12) : 0;

  const inp = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#e8b86d]";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="font-bold text-[#16213e] text-lg mb-4">🧮 حاسبة السعر</h2>

      {/* Mode toggle */}
      <div className="flex gap-2 mb-5 bg-gray-100 p-1 rounded-xl">
        {(["عقار", "سيارة"] as const).map(m => (
          <button key={m} onClick={() => { setMode(m); setPrice(""); setType("شراء"); }}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${mode === m ? "bg-white text-[#16213e] shadow-sm" : "text-gray-500"}`}>
            {m === "عقار" ? "🏠 عقار" : "🚗 سيارة"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">السعر الكلي (دينار)</label>
          <input value={price} onChange={e => setPrice(e.target.value.replace(/[^0-9]/g, ""))}
            placeholder={mode === "عقار" ? "مثال: 50000000" : "مثال: 15000000"}
            className={inp} />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">نوع العملية</label>
          <select value={type} onChange={e => setType(e.target.value)} className={inp}>
            <option>شراء</option>
            <option>إيجار</option>
          </select>
        </div>

        {type === "شراء" && mode === "عقار" && <>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">الدفعة الأولى %</label>
            <input type="number" value={down} onChange={e => setDown(e.target.value)} min="0" max="100" className={inp} />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">مدة السداد (سنة)</label>
            <input type="number" value={years} onChange={e => setYears(e.target.value)} min="1" max="30" className={inp} />
          </div>
        </>}

        {type === "شراء" && mode === "سيارة" && <>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">الدفعة الأولى %</label>
            <input type="number" value={carDown} onChange={e => setCarDown(e.target.value)} min="0" max="100" className={inp} />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">مدة السداد (سنة)</label>
            <select value={carYears} onChange={e => setCarYears(e.target.value)} className={inp}>
              <option value="1">سنة واحدة</option>
              <option value="2">سنتان</option>
              <option value="3">3 سنوات</option>
              <option value="4">4 سنوات</option>
              <option value="5">5 سنوات</option>
            </select>
          </div>
        </>}
      </div>

      {p > 0 && (
        <div className="bg-[#f8f9fa] rounded-xl p-4 grid grid-cols-2 gap-3 text-center">
          {type === "شراء" && mode === "عقار" && <>
            <div className="bg-white rounded-lg p-3 border border-gray-100">
              <div className="text-xs text-gray-400 mb-1">الدفعة الأولى</div>
              <div className="font-bold text-[#16213e] text-sm">{downAmount.toLocaleString("ar-IQ")} د.ع</div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-100">
              <div className="text-xs text-gray-400 mb-1">المبلغ المتبقي</div>
              <div className="font-bold text-[#16213e] text-sm">{loan.toLocaleString("ar-IQ")} د.ع</div>
            </div>
            <div className="bg-[#16213e] rounded-lg p-3 col-span-2">
              <div className="text-xs text-gray-300 mb-1">القسط الشهري التقديري</div>
              <div className="font-bold text-[#e8b86d] text-lg">{Math.round(monthly).toLocaleString("ar-IQ")} د.ع / شهر</div>
            </div>
          </>}

          {type === "شراء" && mode === "سيارة" && <>
            <div className="bg-white rounded-lg p-3 border border-gray-100">
              <div className="text-xs text-gray-400 mb-1">الدفعة الأولى</div>
              <div className="font-bold text-[#16213e] text-sm">{carDownAmount.toLocaleString("ar-IQ")} د.ع</div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-gray-100">
              <div className="text-xs text-gray-400 mb-1">المبلغ المتبقي</div>
              <div className="font-bold text-[#16213e] text-sm">{carLoan.toLocaleString("ar-IQ")} د.ع</div>
            </div>
            <div className="bg-[#16213e] rounded-lg p-3 col-span-2">
              <div className="text-xs text-gray-300 mb-1">القسط الشهري لـ {carYears} سنة</div>
              <div className="font-bold text-[#e8b86d] text-lg">{Math.round(carMonthly).toLocaleString("ar-IQ")} د.ع / شهر</div>
            </div>
          </>}

          {type === "إيجار" && (
            <div className="bg-[#16213e] rounded-lg p-3 col-span-2">
              <div className="text-xs text-gray-300 mb-1">الإيجار الشهري التقديري</div>
              <div className="font-bold text-[#e8b86d] text-lg">{Math.round(mode === "عقار" ? monthly : carMonthly).toLocaleString("ar-IQ")} د.ع / شهر</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
