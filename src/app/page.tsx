import Link from "next/link";
import Navbar from "@/components/Navbar";
import MarqueeBar from "@/components/MarqueeBar";
import HeroSearch from "@/components/HeroSearch";
import StatsCounter from "@/components/StatsCounter";
import WhyUs from "@/components/WhyUs";
import Testimonials from "@/components/Testimonials";
import { getAdminDb } from "@/lib/firestore-admin";

export const dynamic = "force-dynamic";

async function getListingCount() {
  try {
    const db = getAdminDb();
    const snap = await db.collection("listings").count().get();
    return snap.data().count;
  } catch { return 0; }
}

export default async function HomePage() {
  const listingCount = await getListingCount();
  return (
    <>
      <Navbar />
      <MarqueeBar />

      {/* Hero */}
      <section className="relative text-white py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/hero.jpg')" }} />
        <div className="absolute inset-0 bg-[#16213e] opacity-75" />
        <div className="relative z-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg">
            عقار <span className="text-[#e8b86d]">الحويجة</span>
          </h1>
          <p className="text-gray-200 text-lg mb-2 drop-shadow">
            منصتك الأولى لبيع وشراء وإيجار العقارات في قضاء الحويجة وقراها
          </p>
          <HeroSearch />
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <Link href="/listings" className="bg-[#e8b86d] text-[#16213e] px-8 py-3 rounded-xl font-bold text-lg hover:bg-yellow-400 transition-colors">
              تصفح الإعلانات
            </Link>
            <Link href="/listings/new" className="border-2 border-white text-white px-8 py-3 rounded-xl font-bold text-lg hover:bg-white hover:text-[#16213e] transition-colors">
              أضف إعلانك مجاناً
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <StatsCounter listingCount={listingCount} />

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-[#16213e] mb-1 text-center">تصفح حسب النوع</h2>
        <p className="text-gray-400 text-center mb-4 text-sm">اختر نوع العقار الذي تبحث عنه</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {[
            { label: "أراضي", icon: "🌿", type: "أرض" },
            { label: "بيوت", icon: "🏠", type: "بيت" },
            { label: "شقق", icon: "🏢", type: "شقة" },
            { label: "محلات", icon: "🏪", type: "محل" },
            { label: "مزارع", icon: "🌾", type: "مزرعة" },
            { label: "أخرى", icon: "📦", type: "أخرى" },
          ].map((cat) => (
            <Link key={cat.type} href={`/listings?type=${encodeURIComponent(cat.type)}`}
              className="bg-white border border-gray-100 rounded-2xl p-5 text-center shadow-sm hover:shadow-md hover:border-[#e8b86d] transition-all">
              <div className="text-4xl mb-2">{cat.icon}</div>
              <div className="font-medium text-gray-700 text-sm">{cat.label}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why Us */}
      <WhyUs />

      {/* Testimonials */}
      <Testimonials />

      {/* CTA */}
      <section className="bg-[#16213e] py-10 px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">هل لديك عقار للبيع أو الإيجار؟</h2>
        <p className="text-gray-300 mb-8">أضف إعلانك مجاناً وتواصل مع آلاف المهتمين في الحويجة</p>
        <Link href="/listings/new"
          className="bg-[#e8b86d] text-[#16213e] px-10 py-4 rounded-xl font-bold text-lg hover:bg-yellow-400 transition-colors">
          أضف إعلانك الآن — مجاناً
        </Link>
      </section>

      <footer className="bg-[#0f172a] text-gray-500 py-8 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div>
            <div className="text-[#e8b86d] font-bold text-lg mb-2">🏠 عقار الحويجة</div>
            <p className="leading-relaxed">منصة عقارية متخصصة في قضاء الحويجة — كركوك، العراق</p>
          </div>
          <div>
            <div className="text-white font-bold mb-2">روابط سريعة</div>
            <div className="flex flex-col gap-1">
              <Link href="/listings" className="hover:text-[#e8b86d] transition-colors">الإعلانات</Link>
              <Link href="/listings/new" className="hover:text-[#e8b86d] transition-colors">أضف إعلانك</Link>
            </div>
          </div>
          <div>
            <div className="text-white font-bold mb-2">المنطقة المشمولة</div>
            <p>قضاء الحويجة وجميع قراه — محافظة كركوك، العراق</p>
          </div>
        </div>
        <div className="text-center mt-6 border-t border-gray-800 pt-4">
          © 2025 عقار الحويجة — جميع الحقوق محفوظة
        </div>
      </footer>
    </>
  );
}
