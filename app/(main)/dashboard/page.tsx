import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Search, Star, Users, ArrowLeft, User, Heart, ImageIcon } from '@/components/icons';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: { session } } = await supabase.auth.getSession();
  
  // Get recent active members (opposite gender)
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session?.user.id)
    .single();

  const oppositeGender = profile?.gender === 'male' ? 'female' : 'male';

  const { data: recentMembers } = await supabase
    .from('profiles')
    .select('id, username, age, residence, avatar_url')
    .eq('gender', oppositeGender)
    .eq('is_approved', true)
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div className="p-4 md:p-8 animate-in fade-in duration-500">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">مرحباً بك، <span className="text-primary-600">{profile?.username || 'يا غالي'}</span></h2>
          <p className="mt-2 text-sm font-medium text-slate-500">هنا تجد خياراتك المتاحة للبحث عن شريك حياتك</p>
        </div>
      </div>

      {!profile?.is_premium && (
        <div className="mb-8 rounded-2xl bg-gradient-to-l from-amber-400 to-amber-600 p-6 md:p-8 text-white shadow-lg shadow-amber-500/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl transform group-hover:scale-110 transition-transform duration-700"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-right md:text-right w-full md:w-auto">
              <h3 className="text-2xl font-bold flex items-center gap-2 mb-2">
                <Star className="h-7 w-7 fill-white" /> باقة التميز
              </h3>
              <p className="text-amber-50 max-w-md font-medium leading-relaxed">
                انضم لباقة التميز الآن واستمتع بإرسال رسائل غير محدودة، تصفح مخفي، وظهور في أعلى نتائج البحث.
              </p>
            </div>
            <Link href="/premium" className="w-full md:w-auto flex items-center justify-center rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-amber-600 shadow-md hover:bg-amber-50 hover:shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0">
              اشترك الآن
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-10">
        <Link href="/search" className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-sm border border-slate-100 hover:border-primary-200 hover:shadow-md hover:bg-primary-50/30 transition-all duration-300 group">
          <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mb-5 group-hover:bg-primary-100 group-hover:scale-110 transition-all duration-300 shadow-sm border border-primary-100">
            <Search className="h-8 w-8 text-primary-600" />
          </div>
          <span className="font-bold text-lg text-slate-800">البحث المتقدم</span>
          <span className="text-sm font-medium text-slate-500 text-center mt-2">ابحث بالمواصفات الدقيقة</span>
        </Link>
        
        <Link href="/interested-in-me" className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-sm border border-slate-100 hover:border-pink-200 hover:shadow-md hover:bg-pink-50/30 transition-all duration-300 group">
          <div className="w-16 h-16 rounded-2xl bg-pink-50 flex items-center justify-center mb-5 group-hover:bg-pink-100 group-hover:scale-110 transition-all duration-300 shadow-sm border border-pink-100">
            <Heart className="h-8 w-8 text-pink-600" />
          </div>
          <span className="font-bold text-lg text-slate-800">من يهتم بي</span>
          <span className="text-sm font-medium text-slate-500 text-center mt-2">شاهد من أبدى إعجابه بملفك</span>
        </Link>
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="h-5 w-5 text-primary-600" /> أعضاء جدد
          </h3>
          <Link href="/search" className="text-sm font-bold text-primary-600 flex items-center hover:text-primary-700 transition-colors group bg-primary-50 px-3 py-1.5 rounded-lg">
            عرض الكل <ArrowLeft className="h-4 w-4 mr-1.5 transition-transform group-hover:-translate-x-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
          {recentMembers?.map((member) => (
            <Link key={member.id} href={`/profile/${member.id}`} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg hover:border-primary-100 hover:-translate-y-1 transition-all duration-300 block group">
              <div className="aspect-square bg-surface-50 flex items-center justify-center relative overflow-hidden group-hover:bg-primary-50/50 transition-colors">
                {member.avatar_url?.includes('avatar') ? (
                   <User className="w-16 h-16 text-slate-300 group-hover:text-primary-300 transition-colors" />
                ) : (
                   <ImageIcon className="w-16 h-16 text-slate-300 group-hover:text-primary-300 transition-colors" />
                )}
              </div>
              <div className="p-4 text-center border-t border-slate-50">
                <div className="font-bold text-sm text-slate-900 truncate group-hover:text-primary-700 transition-colors">{member.username || 'عضو'}</div>
                <div className="text-xs font-medium text-slate-500 mt-1.5 bg-slate-50 rounded-full py-1 px-2 inline-block">
                  {member.age} سنة • {member.residence}
                </div>
              </div>
            </Link>
          ))}
          
          {(!recentMembers || recentMembers.length === 0) && (
            <div className="col-span-full py-16 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-dashed border-slate-200">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h4 className="text-lg font-bold text-slate-700 mb-2">لا يوجد أعضاء جدد حالياً</h4>
              <p className="text-sm text-slate-500 max-w-sm">قم بتعديل خيارات البحث أو عد لاحقاً لاكتشاف أعضاء جدد انضموا للمنصة.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
