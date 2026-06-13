import Navbar from "@/components/Navbar";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="text-6xl mb-4">📞</div>
          <h1 className="text-3xl font-bold text-[#16213e] mb-3">تواصل معنا</h1>
          <p className="text-gray-500">نحن هنا لمساعدتك في أي استفسار</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <a href="https://wa.me/9647761500949" target="_blank" rel="noopener noreferrer"
            className="bg-[#25D366] text-white rounded-2xl p-6 text-center hover:opacity-90 transition-opacity">
            <div className="text-4xl mb-3">💬</div>
            <div className="font-bold text-lg mb-1">واتساب</div>
            <div className="text-sm opacity-90">تواصل مباشر عبر واتساب</div>
          </a>
          <a href="tel:07761500949"
            className="bg-[#16213e] text-white rounded-2xl p-6 text-center hover:opacity-90 transition-opacity">
            <div className="text-4xl mb-3">📱</div>
            <div className="font-bold text-lg mb-1">اتصال مباشر</div>
            <div className="text-sm opacity-90 font-mono">07761500949</div>
          </a>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-[#16213e] mb-4">أوقات العمل</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between"><span>السبت — الخميس</span><span>٩ صباحاً — ١٠ مساءً</span></div>
            <div className="flex justify-between"><span>الجمعة</span><span>٢ ظهراً — ١٠ مساءً</span></div>
          </div>
        </div>
      </div>
    </>
  );
}
