import { Trophy } from 'lucide-react';

export default function SuccessStoriesPage() {
  const stories = [
    {
      id: 1,
      title: 'الحمد لله الذي بنعمته تتم الصالحات',
      content: 'تعرفت على زوجتي من خلال تطبيق مودة، وبعد الرؤية الشرعية والاتفاق مع الأهل، تم عقد القران. شكراً لإدارة التطبيق على هذا العمل المبارك.',
      author: 'عضو #12345',
      date: 'منذ أسبوعين'
    },
    {
      id: 2,
      title: 'زواج مبارك بفضل الله',
      content: 'كنت أبحث عن شريك حياة يخاف الله ومحافظ على صلاته، ووفقني الله في إيجاده عبر التطبيق. التطبيق يتميز بالجدية والخصوصية العالية.',
      author: 'عضو #87654',
      date: 'منذ شهر'
    }
  ];

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-full text-indigo-600 mb-4">
          <Trophy className="h-8 w-8" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">قصص النجاح</h2>
        <p className="text-slate-600">
          تجارب حقيقية لأعضاء وفقهم الله ووجدوا شريك حياتهم عبر تطبيق مودة. عقبالك!
        </p>
      </div>

      <div className="space-y-6">
        {stories.map(story => (
          <div key={story.id} className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-indigo-700 mb-2">{story.title}</h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              "{story.content}"
            </p>
            <div className="flex justify-between items-center text-sm text-slate-500 pt-4 border-t border-slate-50">
              <span className="font-medium">{story.author}</span>
              <span>{story.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
