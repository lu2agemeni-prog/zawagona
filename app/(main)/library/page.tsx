import { BookOpen, Search, UserRound } from 'lucide-react';

export default function LibraryPage() {
  const articles = [
    { title: 'أسس الاختيار الصحيح لشريك الحياة', category: 'فقه الزواج', author: 'د. أحمد صبحي', date: 'منذ يومين' },
    { title: 'كيف تدير فترة الخطوبة بوعي', category: 'تطوير الذات', author: 'أ. فاطمة سعيد', date: 'منذ أسبوع' },
    { title: 'الحقوق والواجبات الزوجية في الإسلام', category: 'فقه الزواج', author: 'د. يوسف محمد', date: 'منذ أسبوعين' },
    { title: 'التعامل مع الخلافات في بداية الزواج', category: 'استشارات', author: 'أ. ريم الشريف', date: 'منذ شهر' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 mb-2">مكتبة ومقالات</h1>
        <p className="text-slate-500 dark:text-slate-400">تصفح المقالات والفيديوهات التي تهم المقبلين على الزواج</p>
      </div>

      <div className="mb-6 relative">
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input 
          type="text" 
          placeholder="ابحث عن موضوع معين..." 
          className="block w-full rounded-2xl border-0 py-3.5 pr-11 text-slate-900 dark:text-slate-100 shadow-sm ring-1 ring-inset ring-slate-200 dark:ring-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map((article, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <span className="bg-primary-50 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 text-xs font-bold px-3 py-1 rounded-full">
                {article.category}
              </span>
              <BookOpen className="w-5 h-5 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">{article.title}</h3>
            <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
              <UserRound className="w-4 h-4 mr-1 ml-2" />
              <span>{article.author}</span>
              <span className="mx-2">•</span>
              <span>{article.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
