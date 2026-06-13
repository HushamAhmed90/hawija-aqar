import Link from "next/link";
import Navbar from "@/components/Navbar";
import MarqueeBar from "@/components/MarqueeBar";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <MarqueeBar />

      {/* Hero */}
      <section className="bg-[#16213e] text-white py-16 px-4 text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          عقار <span className="text-[#e8b86d]">الحويجة</span>
        </h1>
        <p className="text-gray-300 text-lg mb-8">
          منصتك الأولى لبيع وشراء وإيجار العقارات في قضاء الحويجة وقراها
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/listings"
            className="bg-[#e8b86d] text-[#16213e] px-8 py-3 rounded-xl font-bold text-lg hover:bg-yellow-400 transition-colors"
          >
            تصفح الإعلانات
          </Link>
          <Link
            href="/listings/new"
            className="border-2 border-white text-white px-8 py-3 rounded-xl font-bold text-lg hover:bg-white hover:text-[#16213e] transition-colors"
          >
            أضف إعلانك مجاناً
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-10 border-b">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-3 gap-4 text-center">
          {[
            { label: "إعلان نشط", value: "0", icon: "📋" },
            { label: "قرية مشمولة", value: "+50", icon: "🏘️" },
            { label: "نوع عقار", value: "6", icon: "🏠" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl mb-1">{stat.icon}</div>
              <div className="text-2xl font-bold text-[#16213e]">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-[#16213e] mb-6 text-center">تصفح حسب النوع</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {[
            { label: "أراضي", icon: "🌿", type: "أرض" },
            { label: "بيوت", icon: "🏠", type: "بيت" },
            { label: "شقق", icon: "🏢", type: "شقة" },
            { label: "محلات", icon: "🏪", type: "محل" },
            { label: "مزارع", icon: "🌾", type: "مزرعة" },
            { label: "أخرى", icon: "📦", type: "أخرى" },
          ].map((cat) => (
            <Link
              key={cat.type}
              href={`/listings?type=${encodeURIComponent(cat.type)}`}
              className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm hover:shadow-md hover:border-[#e8b86d] transition-all"
            >
              <div className="text-3xl mb-2">{cat.icon}</div>
              <div className="font-medium text-gray-700 text-sm">{cat.label}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#e8b86d] py-12 px-4 text-center">
        <h2 className="text-2xl font-bold text-[#16213e] mb-3">هل لديك عقار للبيع أو الإيجار؟</h2>
        <p className="text-[#16213e] mb-6">أضف إعلانك مجاناً وتواصل مع آلاف المهتمين</p>
        <Link
          href="/listings/new"
          className="bg-[#16213e] text-white px-8 py-3 rounded-xl font-bold text-lg hover:bg-[#0f172a] transition-colors"
        >
          أضف إعلانك الآن
        </Link>
      </section>

      <footer className="bg-[#16213e] text-gray-400 text-center py-4 text-sm">
        © 2025 عقار الحويجة — جميع الحقوق محفوظة
      </footer>
    </>
  );
}
