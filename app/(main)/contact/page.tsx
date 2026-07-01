import { Phone, Mail, MapPin } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">اتصل بنا</h2>
      
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-100 mb-8">
        <h3 className="font-bold text-lg mb-4 text-slate-800">أرسل لنا رسالة</h3>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">الاسم</label>
            <input type="text" className="w-full rounded-md border-gray-300 py-2 px-3 border focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">البريد الإلكتروني</label>
            <input type="email" className="w-full rounded-md border-gray-300 py-2 px-3 border focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">الموضوع</label>
            <select className="w-full rounded-md border-gray-300 py-2 px-3 border focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white">
              <option>استفسار عام</option>
              <option>مشكلة فنية</option>
              <option>اقتراح</option>
              <option>شكوى</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">الرسالة</label>
            <textarea rows={5} className="w-full rounded-md border-gray-300 py-2 px-3 border focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"></textarea>
          </div>
          <button type="button" className="w-full bg-indigo-600 text-white rounded-md py-2 font-medium hover:bg-indigo-700 transition">
            إرسال
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="bg-white p-4 rounded-xl border border-slate-100 flex flex-col items-center">
          <Phone className="h-6 w-6 text-indigo-600 mb-2" />
          <span className="font-bold text-slate-800">رقم الهاتف</span>
          <span className="text-sm text-slate-500 mt-1">+20 100 000 0000</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100 flex flex-col items-center">
          <Mail className="h-6 w-6 text-indigo-600 mb-2" />
          <span className="font-bold text-slate-800">البريد الإلكتروني</span>
          <span className="text-sm text-slate-500 mt-1">support@mawada.app</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100 flex flex-col items-center">
          <MapPin className="h-6 w-6 text-indigo-600 mb-2" />
          <span className="font-bold text-slate-800">العنوان</span>
          <span className="text-sm text-slate-500 mt-1">القاهرة، مصر</span>
        </div>
      </div>
    </div>
  );
}
