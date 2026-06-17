"use client";

const messages = [
  "🏠 عقارات الحويجة — بيوت، أراضي، شقق، محلات، مزارع",
  "🚗 سيارات للبيع والإيجار — جميع الماركات والموديلات",
  "🏢 مكاتب عقارية معتمدة — تواصل مع أفضل الوسطاء",
  "📋 انشر طلبك مجاناً وانتظر العروض تأتيك",
  "💰 خدمة مجانية 100% بدون عمولة أو وسيط",
  "📍 الحويجة • الرياض • العلم • الزيدية • وجميع قرى القضاء",
  "🤝 الموقع الأول للعقار والسيارات في قضاء الحويجة",
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
