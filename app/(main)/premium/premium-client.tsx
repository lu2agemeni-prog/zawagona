'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Star, CheckCircle, Smartphone, CreditCard, Shield } from 'lucide-react';

export default function PremiumClient({ userId, isPremium, premiumUntil }: { userId: string, isPremium?: boolean, premiumUntil?: string }) {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const supabase = createClient();

  const packages = [
    { name: 'أسبوعي', price: '50 جنيه', duration: '7 أيام' },
    { name: 'شهري', price: '150 جنيه', duration: '30 يوم', popular: true },
    { name: '3 شهور', price: '400 جنيه', duration: '90 يوم' },
    { name: '6 أشهر', price: '700 جنيه', duration: '180 يوم' },
    { name: 'سنوي', price: '1200 جنيه', duration: '365 يوم' },
  ];

  const handleSubscribe = async () => {
    if (!selectedPackage || !userId) return;
    
    setSubmitting(true);
    const { error } = await supabase
      .from('premium_requests')
      .insert({
        user_id: userId,
        package_name: selectedPackage
      });
      
    setSubmitting(false);
    
    if (!error) {
      setSuccess(true);
    }
  };

  if (isPremium) {
    const isExpired = premiumUntil ? new Date(premiumUntil) < new Date() : false;
    const formattedDate = premiumUntil ? new Date(premiumUntil).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }) : 'غير محدد';
    
    if (!isExpired) {
      return (
        <div className="p-4 md:p-8 max-w-2xl mx-auto text-center">
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
            <div className="w-20 h-20 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mb-6">
              <Star className="h-10 w-10 fill-current" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">أنت عضو في باقة التميز 👑</h2>
            <p className="text-slate-600 mb-2">
              تستمتع حالياً بجميع مزايا العضوية المميزة.
            </p>
            <div className="text-indigo-700 font-bold bg-indigo-50 px-4 py-2 rounded-lg mb-8">
              صالح حتى: {formattedDate}
            </div>
            <button 
              onClick={() => window.location.href = '/dashboard'}
              className="bg-indigo-600 text-white px-8 py-3 rounded-md font-medium hover:bg-indigo-700 transition"
            >
              العودة للرئيسية
            </button>
          </div>
        </div>
      );
    }
  }

  if (success) {
    return (
      <div className="p-4 md:p-8 max-w-2xl mx-auto text-center">
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">تم استلام طلب الاشتراك!</h2>
          <p className="text-slate-600 mb-8 max-w-md mx-auto">
            تم تسجيل طلبك للاشتراك في باقة ({selectedPackage}). 
            سيقوم فريق الدعم بالتواصل معك قريباً لتأكيد عملية الدفع وتفعيل الباقة.
          </p>
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="bg-indigo-600 text-white px-8 py-3 rounded-md font-medium hover:bg-indigo-700 transition"
          >
            العودة للرئيسية
          </button>
        </div>
      </div>
    );
  }

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
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 mb-2">اختر الباقة المناسبة:</h2>
          
          <div className="grid gap-4">
            {packages.map((pkg) => (
              <div 
                key={pkg.name} 
                onClick={() => setSelectedPackage(pkg.name)}
                className={`relative bg-white rounded-xl border-2 p-4 cursor-pointer transition ${
                  selectedPackage === pkg.name ? 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/50' : 
                  pkg.popular ? 'border-amber-300 shadow-sm hover:border-amber-400' : 'border-slate-200 hover:border-indigo-300'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    الأكثر طلباً
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedPackage === pkg.name ? 'border-amber-500' : 'border-slate-300'}`}>
                      {selectedPackage === pkg.name && <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{pkg.name}</h3>
                      <span className="text-sm text-slate-500">{pkg.duration}</span>
                    </div>
                  </div>
                  <div className="text-xl font-bold text-indigo-700">{pkg.price}</div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleSubscribe}
            disabled={!selectedPackage || submitting}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-md transition"
          >
            {submitting ? 'جاري إرسال الطلب...' : 'تأكيد الاشتراك'}
          </button>
        </div>
      </div>

      {/* Payment Options */}
      <div className="bg-slate-100 p-6 md:p-8 rounded-2xl mb-8">
        <h2 className="text-xl font-bold text-center text-slate-900 mb-6">طرق الدفع المتاحة (يتم التنسيق بعد الطلب)</h2>
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
    </div>
  );
}
