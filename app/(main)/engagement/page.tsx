import { PauseCircle, CheckCircle, Shield } from 'lucide-react';

export default function EngagementPage() {
  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8">
      <div className="mb-8 text-center">
        <div className="w-20 h-20 bg-primary-50 dark:bg-primary-900/50 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-600 dark:text-primary-400">
          <PauseCircle className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 mb-2">إعلان الخطبة (تجميد الحساب)</h1>
        <p className="text-slate-500 dark:text-slate-400">قم بتجميد حسابك مؤقتاً عند اتفاقك مع شريك وإعلان الخطبة</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm mb-6">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">ماذا يعني تجميد الحساب؟</h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
            <span className="text-slate-600 dark:text-slate-300">إخفاء ملفك الشخصي عن جميع الأعضاء في نتائج البحث.</span>
          </li>
          <li className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
            <span className="text-slate-600 dark:text-slate-300">منع استقبال أي رسائل أو طلبات تواصل جديدة.</span>
          </li>
          <li className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
            <span className="text-slate-600 dark:text-slate-300">الاحتفاظ ببياناتك ومحادثاتك الحالية لتعود إليها متى شئت.</span>
          </li>
        </ul>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-3xl p-6 mb-8">
        <p className="text-amber-800 dark:text-amber-200 text-sm leading-relaxed text-center">
          "بمجرد تأكيد الخطبة، يُنصح بتجميد الحساب للتركيز على هذه المرحلة الهامة. يمكنك دائماً إلغاء التجميد أو حذف الحساب نهائياً لاحقاً."
        </p>
      </div>

      <button className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-2xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-sm">
        تجميد الحساب الآن
      </button>
    </div>
  );
}
