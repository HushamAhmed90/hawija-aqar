import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-12">

        <div className="text-center mb-10">
          <div className="text-6xl mb-4">🏠</div>
          <h1 className="text-3xl font-bold text-[#16213e] mb-3">عن عقار الحويجة</h1>
          <p className="text-gray-500 text-lg">منصتك العقارية الأولى في قضاء الحويجة</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
          <h2 className="text-xl font-bold text-[#16213e] mb-4">من نحن؟</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            عقار الحويجة هي منصة عقارية متخصصة تخدم قضاء الحويجة وجميع قراه في محافظة كركوك، العراق.
            هدفنا جمع إعلانات البيع والشراء والإيجار في مكان واحد بدل تشتتها على مجموعات الفيسبوك.
          </p>
          <p className="text-gray-600 leading-relaxed">
            الموقع مجاني بالكامل للمستخدمين — يمكنك نشر إعلانك والتواصل مع المالك مباشرة بدون أي رسوم أو وسيط.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            { icon: "🆓", title: "مجاني 100%", desc: "لا رسوم على الإعلانات" },
            { icon: "📍", title: "محلي ومتخصص", desc: "الحويجة وقراها فقط" },
            { icon: "📞", title: "تواصل مباشر", desc: "بدون وسيط أو عمولة" },
          ].map(f => (
            <div key={f.title} className="bg-gray-50 rounded-2xl p-5 text-center border border-gray-100">
              <div className="text-3xl mb-2">{f.icon}</div>
              <div className="font-bold text-[#16213e] mb-1">{f.title}</div>
              <div className="text-sm text-gray-500">{f.desc}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
          <h2 className="text-xl font-bold text-[#16213e] mb-4">المناطق المشمولة</h2>
          <div className="flex flex-wrap gap-2">
            {["الحويجة", "الرياض", "العلم", "الزيدية", "الكيلاني", "أبو عوجة", "السنية", "الكسارة", "المحمودية", "الدبس", "بركة", "الملك", "أم الزيتون", "الجنابيين", "السبعاوي"].map(v => (
              <span key={v} className="bg-[#16213e] text-white text-sm px-3 py-1 rounded-full">{v}</span>
            ))}
          </div>
        </div>

        <div className="bg-[#16213e] rounded-2xl p-8 text-center text-white">
          <h2 className="text-xl font-bold mb-2">تواصل معنا</h2>
          <p className="text-gray-300 mb-4">لأي استفسار أو مقترح</p>
          <a href="https://wa.me/9647761500949" target="_blank" rel="noopener noreferrer"
            className="inline-block bg-[#25D366] text-white px-8 py-3 rounded-xl font-bold hover:opacity-90">
            واتساب
          </a>
        </div>

        <div className="text-center mt-8">
          <Link href="/listings/new"
            className="bg-[#e8b86d] text-[#16213e] px-8 py-3 rounded-xl font-bold hover:bg-yellow-400 transition-colors">
            أضف إعلانك مجاناً
          </Link>
        </div>
      </div>
    </>
  );
}
