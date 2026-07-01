import { Trophy } from 'lucide-react';

export default function SuccessStoriesPage() {
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
          <Trophy className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">قصص النجاح</h1>
          <p className="text-slate-500 mt-1">تجارب أعضاء وجدوا شريك حياتهم عبر مودة</p>
        </div>
      </div>

      <div className="text-center py-16 bg-white rounded-3xl border border-slate-100">
        <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-10 h-10 text-amber-300" />
        </div>
        <h3 className="text-xl font-bold text-slate-700 mb-2">قصص ملهمة قريباً</h3>
        <p className="text-slate-500">نعمل على جمع أفضل قصص النجاح لمشاركتها معكم.</p>
      </div>
    </div>
  );
}
