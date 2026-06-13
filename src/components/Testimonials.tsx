const reviews = [
  { name: "أبو محمد الجبوري", text: "بعت أرضي خلال أسبوع واحد بس من خلال الموقع، خدمة ممتازة وسريعة", stars: 5, city: "الحويجة" },
  { name: "أم علي الكريم", text: "وجدت البيت اللي أبحث عنه بسهولة، الموقع واضح ومرتب وفيه كل التفاصيل", stars: 5, city: "الرياض" },
  { name: "حسن عبدالله", text: "أحسن موقع عقاري في المنطقة، أخيراً صار عندنا منصة محترمة مثل المدن الكبيرة", stars: 5, city: "العلم" },
];

export default function Testimonials() {
  return (
    <section className="bg-gray-50 py-14 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-[#16213e] mb-2 text-center">آراء المستخدمين</h2>
        <p className="text-gray-400 text-center mb-8 text-sm">تجارب حقيقية من أهل الحويجة</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {reviews.map((r) => (
            <div key={r.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="text-[#e8b86d] text-lg mb-3">{"⭐".repeat(r.stars)}</div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">"{r.text}"</p>
              <div className="flex items-center gap-3 border-t border-gray-50 pt-3">
                <div className="w-9 h-9 rounded-full bg-[#16213e] flex items-center justify-center text-[#e8b86d] font-bold text-sm">
                  {r.name[0]}
                </div>
                <div>
                  <div className="font-bold text-gray-800 text-sm">{r.name}</div>
                  <div className="text-xs text-gray-400">{r.city}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
