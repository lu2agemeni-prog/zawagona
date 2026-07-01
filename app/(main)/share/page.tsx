import { Share2 } from 'lucide-react';

export default function SharePage() {
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
          <Share2 className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">مشاركة التطبيق</h1>
          <p className="text-slate-500 mt-1">دعوة الأصدقاء لاستخدام مودة</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center">
        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Share2 className="w-10 h-10 text-indigo-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-700 mb-2">شارك التطبيق مع أصدقائك</h3>
        <p className="text-slate-500 mb-6">ساهم في نشر الخير ومساعدة الآخرين في العثور على شريك حياتهم.</p>
        <div className="flex justify-center gap-4">
          <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors">
            نسخ رابط التطبيق
          </button>
        </div>
      </div>
    </div>
  );
}
