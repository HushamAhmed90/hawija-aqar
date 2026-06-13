"use client";
import { useEffect, useState } from "react";

export default function DigitalClock() {
  const [time, setTime] = useState({ h: "00", m: "00", s: "00", date: "" });

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime({
        h: String(now.getHours()).padStart(2, "0"),
        m: String(now.getMinutes()).padStart(2, "0"),
        s: String(now.getSeconds()).padStart(2, "0"),
        date: now.toLocaleDateString("ar-IQ", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
      });
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center bg-[#16213e] rounded-2xl px-8 py-8 text-white shadow-lg w-full h-full">
      <div className="text-sm text-[#e8b86d] mb-3 font-medium">{time.date}</div>
      <div className="flex items-center gap-2 font-mono" dir="ltr">
        <span className="text-6xl md:text-7xl font-bold text-white">{time.h}</span>
        <span className="text-4xl text-[#e8b86d] animate-pulse">:</span>
        <span className="text-6xl md:text-7xl font-bold text-white">{time.m}</span>
        <span className="text-4xl text-[#e8b86d] animate-pulse">:</span>
        <span className="text-6xl md:text-7xl font-bold text-[#e8b86d]">{time.s}</span>
      </div>
      <div className="text-sm text-gray-400 mt-3">🕌 الحويجة — كركوك، العراق</div>
    </div>
  );
}
