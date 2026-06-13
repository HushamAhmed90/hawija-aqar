"use client";
import { useEffect, useRef, useState } from "react";

function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) { setCount(target); clearInterval(timer); }
          else setCount(Math.floor(current));
        }, 1500 / steps);
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <div ref={ref} className="text-3xl font-bold text-[#16213e]">{count}{suffix}</div>;
}

export default function StatsCounter({ listingCount = 0 }: { listingCount?: number }) {
  return (
    <section className="bg-white py-6 border-b">
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {[
          { icon: "📋", label: "إعلان منشور", target: Math.max(listingCount, 1), suffix: "+" },
          { icon: "🏘️", label: "قرية مشمولة", target: 50, suffix: "+" },
          { icon: "🏠", label: "نوع عقار", target: 6, suffix: "" },
          { icon: "👥", label: "زيارة يومية", target: 100, suffix: "+" },
        ].map((stat) => (
          <div key={stat.label} className="bg-gray-50 rounded-2xl py-6 px-4 hover:shadow-md transition-shadow">
            <div className="text-4xl mb-2">{stat.icon}</div>
            <Counter target={stat.target} suffix={stat.suffix} />
            <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
