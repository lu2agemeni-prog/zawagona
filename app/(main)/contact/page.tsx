import { Phone } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
          <Phone className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">اتصل بنا</h1>
          <p className="text-slate-500 mt-1">نحن هنا لمساعدتك</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">الاسم</label>
            <input type="text" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="اسمك الكريم" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">البريد الإلكتروني</label>
            <input type="email" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="البريد الإلكتروني" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">الرسالة</label>
            <textarea rows={5} className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="اكتب رسالتك هنا..."></textarea>
          </div>
          <button type="button" className="w-full bg-primary-600 text-white font-bold py-3 rounded-xl hover:bg-primary-700 transition-colors">
            إرسال الرسالة
          </button>
        </form>
      </div>
    </div>
  );
}
