"use client";
import { useState } from "react";

export default function StarRating({ listingId }: { listingId: string }) {
  const key = `rating_${listingId}`;
  const saved = typeof window !== "undefined" ? localStorage.getItem(key) : null;
  const [rated, setRated] = useState<number>(saved ? Number(saved) : 0);
  const [hover, setHover] = useState(0);
  const [submitted, setSubmitted] = useState(!!saved);

  const submit = async (star: number) => {
    if (submitted) return;
    await fetch(`/api/listings/${listingId}/rate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ star }),
    }).catch(() => {});
    localStorage.setItem(key, String(star));
    setRated(star);
    setSubmitted(true);
  };

  return (
    <div className="mt-4 flex items-center gap-2">
      <span className="text-xs text-gray-400">قيّم هذا الإعلان:</span>
      <div className="flex gap-1">
        {[1,2,3,4,5].map(s => (
          <button key={s} onClick={() => submit(s)}
            onMouseEnter={() => !submitted && setHover(s)}
            onMouseLeave={() => setHover(0)}
            className="text-2xl transition-transform hover:scale-110"
            disabled={submitted}>
            <span className={(hover || rated) >= s ? "text-yellow-400" : "text-gray-300"}>★</span>
          </button>
        ))}
      </div>
      {submitted && <span className="text-xs text-green-600">شكراً لتقييمك!</span>}
    </div>
  );
}
