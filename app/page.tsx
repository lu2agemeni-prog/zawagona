import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Heart, ShieldCheck, Users, Search, ArrowLeft } from 'lucide-react';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-stone-50 font-cairo selection:bg-primary-100 selection:text-primary-900">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-2">
              <Heart className="h-8 w-8 text-primary-600 fill-primary-600" />
              <span className="text-2xl font-black text-primary-800 tracking-tight">مـودة</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-bold text-slate-600 hover:text-primary-600 transition-colors">
                تسجيل الدخول
              </Link>
              <Link href="/register" className="bg-primary-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-primary-700 hover:shadow-md transition-all active:scale-[0.98]">
                حساب جديد
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-5"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute top-40 -left-40 w-96 h-96 bg-amber-100 rounded-full blur-3xl opacity-50"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <span className="bg-primary-50 text-primary-700 px-4 py-1.5 rounded-full text-sm font-bold border border-primary-100 inline-block mb-6 shadow-sm">
              ✨ المنصة الأولى للزواج الإسلامي
            </span>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-[1.3] md:leading-[1.4] mb-6 tracking-tight">
              ابحث عن <span className="text-primary-600">نصفك الآخر</span> <br/>
              بكل ثقة وأمان
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed font-medium">
              نوفر لك بيئة آمنة وموثوقة للتعارف بهدف الزواج الشرعي، مع الالتزام التام بالضوابط الإسلامية والسرية التامة.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link href="/register" className="w-full sm:w-auto bg-primary-600 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:bg-primary-700 hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center group">
                ابدأ رحلتك الآن
                <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
              </Link>
              <Link href="/success-stories" className="w-full sm:w-auto bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-2xl text-lg font-bold hover:bg-slate-50 hover:border-slate-300 transition-colors flex items-center justify-center">
                قصص النجاح
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-24 relative z-10 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 mb-4">لماذا تختار منصة مودة؟</h2>
            <p className="text-slate-600 font-medium max-w-2xl mx-auto">نحرص على تقديم أفضل تجربة للباحثين عن الزواج الشرعي من خلال مميزات حصرية</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-stone-50 p-8 rounded-3xl border border-slate-100 hover:border-primary-200 hover:shadow-lg transition-all duration-300 group">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 border border-slate-100 group-hover:scale-110 transition-transform">
                <ShieldCheck className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">خصوصية وأمان تام</h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                نحن نضمن سرية بياناتك الشخصية وحماية حسابك بأحدث التقنيات. صورك وبياناتك الحساسة في أمان.
              </p>
            </div>
            
            <div className="bg-stone-50 p-8 rounded-3xl border border-slate-100 hover:border-amber-200 hover:shadow-lg transition-all duration-300 group">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 border border-slate-100 group-hover:scale-110 transition-transform">
                <Search className="h-8 w-8 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">بحث متقدم ودقيق</h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                محرك بحث متطور يتيح لك البحث عن شريك حياتك بناءً على مواصفات دقيقة مثل العمر، التعليم، والمزيد.
              </p>
            </div>
            
            <div className="bg-stone-50 p-8 rounded-3xl border border-slate-100 hover:border-pink-200 hover:shadow-lg transition-all duration-300 group">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 border border-slate-100 group-hover:scale-110 transition-transform">
                <Users className="h-8 w-8 text-pink-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">أعضاء جادون فقط</h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                نحرص على مراجعة الحسابات والتأكد من جدية الأعضاء لضمان بيئة تعارف نظيفة وهادفة.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-slate-900 py-12 text-center text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Heart className="h-6 w-6 text-primary-500 fill-primary-500" />
            <span className="text-xl font-black text-white tracking-tight">مـودة</span>
          </div>
          <p className="text-sm font-medium">© {new Date().getFullYear()} منصة مودة للزواج الإسلامي. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
}
