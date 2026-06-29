import { Star, CheckCircle, Smartphone, CreditCard, Shield } from 'lucide-react';

export default function PremiumPage() {
  const packages = [
    { name: 'أسبوعي', price: '50 جنيه', duration: '7 أيام' },
    { name: 'شهري', price: '150 جنيه', duration: '30 يوم', popular: true },
    { name: '3 شهور', price: '400 جنيه', duration: '90 يوم' },
    { name: '6 أشهر', price: '700 جنيه', duration: '180 يوم' },
    { name: 'سنوي', price: '1200 جنيه', duration: '365 يوم' },
  ];

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-3 bg-amber-100 rounded-full text-amber-600 mb-4">
          <Star className="h-8 w-8 fill-current" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-4">باقة التميز</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          انضم لباقة التميز الآن وضاعف فرصتك في إيجاد شريك حياتك المناسب بطريقة أسرع وأكثر خصوصية.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Features */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 mb-6">مزايا الاشتراك:</h2>
          <ul className="space-y-4">
            <li className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
              <div>
                <strong className="block text-slate-900">إرسال رسائل غير محدودة</strong>
                <span className="text-sm text-slate-500">تواصل بحرية مع الأعضاء الذين تهتم بهم</span>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
              <div>
                <strong className="block text-slate-900">تعزيز الملف الشخصي</strong>
                <span className="text-sm text-slate-500">يظهر ملفك في المراتب الأولى في نتائج البحث</span>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
              <div>
                <strong className="block text-slate-900">رفع صورة شخصية حقيقية</strong>
                <span className="text-sm text-slate-500">خاصية حصرية للأعضاء المتميزين لزيادة الموثوقية</span>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
              <div>
                <strong className="block text-slate-900">التصفح المخفي</strong>
                <span className="text-sm text-slate-500">تصفح ملفات الأعضاء دون أن يظهر لهم أنك زرتهم</span>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
              <div>
                <strong className="block text-slate-900">تغيير اسم المستخدم</strong>
                <span className="text-sm text-slate-500">القدرة على تعديل اسم المستخدم الخاص بك متى شئت</span>
              </div>
            </li>
          </ul>
        </div>

        {/* Packages */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 mb-2">اختر الباقة المناسبة:</h2>
          
          <div className="grid gap-4">
            {packages.map((pkg) => (
              <div 
                key={pkg.name} 
                className={`relative bg-white rounded-xl border-2 p-4 cursor-pointer transition ${
                  pkg.popular ? 'border-amber-500 shadow-md' : 'border-slate-200 hover:border-indigo-300'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    الأكثر طلباً
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-slate-900">{pkg.name}</h3>
                    <span className="text-sm text-slate-500">{pkg.duration}</span>
                  </div>
                  <div className="text-xl font-bold text-indigo-700">{pkg.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Options */}
      <div className="bg-slate-100 p-6 md:p-8 rounded-2xl mb-8">
        <h2 className="text-xl font-bold text-center text-slate-900 mb-6">طرق الدفع المتاحة</h2>
        <div className="flex flex-wrap justify-center gap-4 md:gap-8">
          <div className="flex items-center bg-white px-6 py-3 rounded-lg shadow-sm">
            <Smartphone className="h-6 w-6 text-indigo-600 mr-2" /> محفظة كاش
          </div>
          <div className="flex items-center bg-white px-6 py-3 rounded-lg shadow-sm">
            <CreditCard className="h-6 w-6 text-indigo-600 mr-2" /> بطاقة ائتمانية
          </div>
          <div className="flex items-center bg-white px-6 py-3 rounded-lg shadow-sm">
            <Shield className="h-6 w-6 text-indigo-600 mr-2" /> جوجل بلاي
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="text-center p-6 border border-slate-200 rounded-xl bg-white">
        <h3 className="font-bold text-slate-900 mb-2">تحتاج مساعدة في الاشتراك؟</h3>
        <p className="text-slate-600 mb-4">فريق الدعم الفني متاح لمساعدتك والرد على استفساراتك.</p>
        <div className="flex justify-center gap-4">
          <button className="bg-indigo-50 text-indigo-700 px-6 py-2 rounded-md font-medium hover:bg-indigo-100 transition">
            محادثة أونلاين
          </button>
          <button className="bg-white border border-slate-300 text-slate-700 px-6 py-2 rounded-md font-medium hover:bg-slate-50 transition">
            اتصل بنا: 01000000000
          </button>
        </div>
      </div>
    </div>
  );
}
