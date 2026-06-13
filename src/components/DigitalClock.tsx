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
    <div className="flex flex-col items-center justify-center bg-[#16213e] rounded-2xl px-8 py-6 text-white shadow-lg">
      <div className="text-xs text-[#e8b86d] mb-2 font-medium">{time.date}</div>
      <div className="flex items-center gap-1 font-mono">
        <span className="text-4xl md:text-5xl font-bold text-white">{time.h}</span>
        <span className="text-3xl text-[#e8b86d] animate-pulse">:</span>
        <span className="text-4xl md:text-5xl font-bold text-white">{time.m}</span>
        <span className="text-3xl text-[#e8b86d] animate-pulse">:</span>
        <span className="text-4xl md:text-5xl font-bold text-[#e8b86d]">{time.s}</span>
      </div>
      <div className="text-xs text-gray-400 mt-2">🕌 الحويجة — كركوك، العراق</div>
    </div>
  );
}
