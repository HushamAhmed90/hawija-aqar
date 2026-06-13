const features = [
  { icon: "🆓", title: "مجاني 100%", desc: "أضف إعلانك بدون أي رسوم أو اشتراكات" },
  { icon: "📍", title: "محلي ومتخصص", desc: "متخصصون في الحويجة وقراها فقط" },
  { icon: "📞", title: "تواصل مباشر", desc: "تواصل مع المالك مباشرة بدون وسيط" },
  { icon: "⚡", title: "سريع وسهل", desc: "أنشر إعلانك في أقل من دقيقتين" },
];

export default function WhyUs() {
  return (
    <section className="bg-white py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-[#16213e] mb-1 text-center">لماذا عقار الحويجة؟</h2>
        <p className="text-gray-400 text-center mb-4 text-sm">نجمع كل إعلانات المنطقة في مكان واحد</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {features.map((f) => (
            <div key={f.title} className="text-center p-4 rounded-2xl border border-gray-100 hover:border-[#e8b86d] hover:shadow-md transition-all bg-gray-50">
              <div className="text-4xl mb-3">{f.icon}</div>
              <div className="font-bold text-[#16213e] mb-2">{f.title}</div>
              <div className="text-xs text-gray-500 leading-relaxed">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
