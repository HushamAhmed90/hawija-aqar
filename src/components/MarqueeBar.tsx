"use client";

const messages = [
  "🏠 مرحباً بكم في عقار الحويجة — منصتكم العقارية الأولى",
  "✨ أضف إعلانك مجاناً وتواصل مع آلاف المهتمين",
  "📍 متخصصون في قضاء الحويجة وجميع قراها",
  "🤝 نجمع البائعين والمشترين في مكان واحد",
  "🏡 بيوت • أراضي • محلات • شقق • مزارع — كل شيء هنا",
  "💰 خدمة مجانية 100% للجميع",
  "📞 تواصل مباشرة مع أصحاب العقارات بدون وسيط",
];

export default function MarqueeBar() {
  const repeated = [...messages, ...messages, ...messages, ...messages];

  return (
    <div className="bg-[#e8b86d] text-[#16213e] py-2 overflow-hidden whitespace-nowrap">
      <div className="inline-flex animate-marquee">
        {repeated.map((msg, i) => (
          <span key={i} className="mx-8 font-medium text-sm">
            {msg}
          </span>
        ))}
      </div>
    </div>
  );
}
