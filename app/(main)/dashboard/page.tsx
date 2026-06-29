import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Search, Star, Users, ArrowLeft } from 'lucide-react';

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
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">مرحباً بك، {profile?.username || 'يا غالي'}</h2>
          <p className="mt-1 text-sm text-slate-500">هنا تجد خياراتك المتاحة للبحث عن شريك حياتك</p>
        </div>
      </div>

      {!profile?.is_premium && (
        <div className="mb-8 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 p-6 text-white shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Star className="h-6 w-6 fill-current" /> باقة التميز
              </h3>
              <p className="mt-2 text-amber-50 max-w-md">
                انضم لباقة التميز الآن واستمتع بإرسال رسائل غير محدودة، تصفح مخفي، ظهور في أعلى نتائج البحث والمزيد.
              </p>
            </div>
            <Link href="/premium" className="hidden md:flex rounded-full bg-white px-6 py-2 text-sm font-bold text-amber-600 shadow hover:bg-amber-50 transition">
              اشترك الآن
            </Link>
          </div>
          <Link href="/premium" className="mt-4 flex w-full md:hidden items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-bold text-amber-600 shadow">
            اشترك الآن
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Link href="/search" className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm border border-slate-100 hover:border-indigo-500 hover:shadow-md transition group">
          <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mb-4 group-hover:bg-indigo-100 transition">
            <Search className="h-8 w-8 text-indigo-600" />
          </div>
          <span className="font-bold text-slate-800">البحث المتقدم</span>
          <span className="text-sm text-slate-500 text-center mt-1">ابحث بالمواصفات الدقيقة</span>
        </Link>
        
        <Link href="/interested-in-me" className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm border border-slate-100 hover:border-pink-500 hover:shadow-md transition group">
          <div className="w-16 h-16 rounded-full bg-pink-50 flex items-center justify-center mb-4 group-hover:bg-pink-100 transition">
            <Users className="h-8 w-8 text-pink-600" />
          </div>
          <span className="font-bold text-slate-800">من يهتم بي</span>
          <span className="text-sm text-slate-500 text-center mt-1">شاهد من أبدى إعجابه بملفك</span>
        </Link>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900">أعضاء جدد</h3>
          <Link href="/search" className="text-sm font-medium text-indigo-600 flex items-center hover:underline">
            عرض الكل <ArrowLeft className="h-4 w-4 mr-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {recentMembers?.map((member) => (
            <Link key={member.id} href={`/profile/${member.id}`} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition block">
              <div className="aspect-square bg-slate-100 flex items-center justify-center relative">
                <span className="text-4xl">{member.avatar_url?.includes('avatar') ? '👤' : '📸'}</span>
                {/* Fallback image logic depending on what avatar_url actually holds */}
              </div>
              <div className="p-3 text-center">
                <div className="font-bold text-sm text-slate-900 truncate">{member.username || 'عضو'}</div>
                <div className="text-xs text-slate-500 mt-1">{member.age} سنة • {member.residence}</div>
              </div>
            </Link>
          ))}
          
          {(!recentMembers || recentMembers.length === 0) && (
            <div className="col-span-full py-8 text-center text-slate-500">
              لا يوجد أعضاء جدد حالياً
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
