const reviews = [
  { name: "أبو محمد الجبوري", text: "بعت أرضي خلال أسبوع بس، خدمة ممتازة وسريعة", stars: 5, city: "الحويجة" },
  { name: "أم علي الكريم", text: "وجدت البيت اللي أبحث عنه بسهولة، الموقع واضح ومرتب", stars: 5, city: "الرياض" },
  { name: "حسن عبدالله", text: "أحسن موقع عقاري في المنطقة، منصة محترمة مثل المدن الكبيرة", stars: 5, city: "العلم" },
  { name: "خالد السعدون", text: "أجرت محلي بيوم واحد، ما توقعت تكون بهالسرعة", stars: 5, city: "الكيلاني" },
  { name: "أبو عمر التكريتي", text: "سهل جداً تضيف الإعلان، وصلتني اتصالات من أول يوم", stars: 5, city: "السنية" },
  { name: "فاطمة الدليمي", text: "أخيراً موقع يخص منطقتنا، شكراً على هذا المشروع الرائع", stars: 5, city: "الزيدية" },
];

export default function Testimonials() {
  return (
    <section className="bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-[#16213e] mb-1 text-center">آراء المستخدمين</h2>
        <p className="text-gray-400 text-center mb-4 text-sm">تجارب حقيقية من أهل الحويجة</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {reviews.map((r) => (
            <div key={r.name} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="text-[#e8b86d] text-sm mb-2">{"⭐".repeat(r.stars)}</div>
              <p className="text-gray-600 text-xs leading-relaxed mb-3">"{r.text}"</p>
              <div className="flex items-center gap-2 border-t border-gray-50 pt-2">
                <div className="w-7 h-7 rounded-full bg-[#16213e] flex items-center justify-center text-[#e8b86d] font-bold text-xs">
                  {r.name[0]}
                </div>
                <div>
                  <div className="font-bold text-gray-800 text-xs">{r.name}</div>
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
