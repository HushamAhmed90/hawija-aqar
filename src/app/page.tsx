import Link from "next/link";
import Navbar from "@/components/Navbar";
import MarqueeBar from "@/components/MarqueeBar";
import HeroSearch from "@/components/HeroSearch";
import StatsCounter from "@/components/StatsCounter";
import WhyUs from "@/components/WhyUs";
import Testimonials from "@/components/Testimonials";
import DigitalClock from "@/components/DigitalClock";
import PriceCalculator from "@/components/PriceCalculator";
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

      {/* Clock + Tip */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Digital Clock */}
          <div className="flex flex-col">
            <h2 className="text-lg font-bold text-[#16213e] mb-3 text-center">🕐 الوقت الحالي</h2>
            <div className="flex-1">
              <DigitalClock />
            </div>
          </div>
          {/* Daily Tip */}
          <div className="bg-gradient-to-br from-[#16213e] to-[#1a2a4a] rounded-2xl p-5 text-white shadow-lg flex flex-col justify-center mt-9">
            <div className="text-[#e8b86d] text-xl mb-1">💡</div>
            <h2 className="text-base font-bold mb-2 text-[#e8b86d]">نصيحة عقارية</h2>
            <p className="text-gray-200 leading-relaxed text-xs">
              قبل شراء أي عقار، تحقق دائماً من وثيقة الملكية الرسمية وتأكد أنها مسجلة في دائرة التسجيل العقاري.
              لا تدفع أي مبلغ قبل رؤية العقار على الطبيعة والتأكد من خلوه من الديون والحجوزات.
            </p>
            <p className="text-xs text-gray-400 mt-2">نصيحة من فريق عقار الحويجة</p>
          </div>
        </div>
      </section>

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

      {/* Price Calculator */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-[#16213e] mb-1 text-center">🧮 حاسبة السعر</h2>
        <p className="text-gray-400 text-center text-sm mb-6">احسب قسطك الشهري أو إيجارك التقديري</p>
        <div className="max-w-xl mx-auto">
          <PriceCalculator />
        </div>
      </section>

      {/* Iraqi Civilization */}
      <section className="py-10 px-4 bg-[#fdf8f0]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-[#16213e] text-center mb-1">🏛️ حضارات العراق العريقة</h2>
          <p className="text-gray-400 text-center text-sm mb-6">من بلاد الرافدين إلى اليوم — أرض الحضارة الأولى</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                name: "حضارة سومر",
                emoji: "🏺",
                desc: "أول حضارة كتابية في التاريخ، اخترعت الكتابة المسمارية والعجلة في جنوب العراق قبل 5000 عام.",
                color: "bg-amber-50 border-amber-200",
              },
              {
                name: "حضارة بابل",
                emoji: "🦁",
                desc: "مهد قانون حمورابي، أول قانون مكتوب في العالم، وموطن حدائق بابل المعلقة إحدى عجائب الدنيا.",
                color: "bg-blue-50 border-blue-200",
              },
              {
                name: "حضارة آشور",
                emoji: "🦅",
                desc: "إمبراطورية عظيمة أسست الجيوش المنظمة والمكتبات الملكية، وعاصمتها نينوى قرب الموصل.",
                color: "bg-orange-50 border-orange-200",
              },
            ].map((civ) => (
              <div key={civ.name} className={`rounded-2xl border p-5 shadow-sm ${civ.color}`}>
                <div className="text-5xl mb-3 text-center">{civ.emoji}</div>
                <h3 className="font-bold text-[#16213e] text-lg text-center mb-2">{civ.name}</h3>
                <p className="text-gray-600 text-sm leading-relaxed text-center">{civ.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <WhyUs />

      {/* Encouraging Phrases */}
      <section className="py-10 px-4 bg-[#16213e]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-[#e8b86d] text-center mb-6">✨ عبارات تشجيعية</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { text: "الأرض لا تكذب، استثمر فيها واطمئن على مستقبلك.", icon: "🌱" },
              { text: "بيتك الذي بنيته بيدك هو أعظم إرث لأبنائك.", icon: "🏠" },
              { text: "كل قطعة أرض في الحويجة تحمل قصة وتحمل مستقبلاً.", icon: "🌅" },
              { text: "الاستثمار العقاري اليوم هو الأمان الذي تبحث عنه غداً.", icon: "💎" },
            ].map((q, i) => (
              <div key={i} className="bg-white/10 backdrop-blur rounded-xl p-5 border border-white/10">
                <span className="text-3xl block mb-2">{q.icon}</span>
                <p className="text-white leading-relaxed text-sm font-medium">{q.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
