import { HeartHandshake, Phone, Calendar, Clock, Star } from 'lucide-react';

export default function CounselingPage() {
  const counselors = [
    { name: 'د. خالد عبد الرحمن', title: 'مستشار أسري وتربوي', rating: 4.9, sessions: 120, fee: '150 ر.س / جلسة' },
    { name: 'أ. مها عبد الله', title: 'أخصائية اجتماعية', rating: 4.8, sessions: 85, fee: '120 ر.س / جلسة' },
    { name: 'الشيخ عبد الرحمن السعيد', title: 'مستشار شرعي', rating: 5.0, sessions: 200, fee: 'مجاني' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 mb-2">استشارات للمقبلين على الزواج</h1>
        <p className="text-slate-500 dark:text-slate-400">احجز جلسة استشارية عن بعد مع نخبة من الخبراء والمستشارين</p>
      </div>

      <div className="space-y-6">
        {counselors.map((c, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/50 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 text-xl font-bold flex-shrink-0">
                {c.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{c.name}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">{c.title}</p>
                <div className="flex items-center text-xs text-slate-500">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 mr-1 ml-1" />
                  <span>{c.rating}</span>
                  <span className="mx-2">•</span>
                  <span>{c.sessions} جلسة</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              <div className="text-center sm:text-right w-full sm:w-auto">
                <span className="block text-sm text-slate-500 dark:text-slate-400">تكلفة الجلسة</span>
                <span className="font-bold text-slate-800 dark:text-slate-100">{c.fee}</span>
              </div>
              <button className="w-full sm:w-auto px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                <Calendar className="w-5 h-5" />
                حجز موعد
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
