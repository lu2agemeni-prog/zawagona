import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Users } from '@/components/my-icons';
import Link from 'next/link';

export default async function VisitorsPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const { data: visits } = await supabase
    .from('visitors')
    .select('*, visitor:profiles!visitors_visitor_id_fkey(*)')
    .eq('visited_id', user.id)
    .order('created_at', { ascending: false });

  const visitors = visits?.map(v => v.visitor) || [];

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
          <Users className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">الزوار</h1>
          <p className="text-slate-500 mt-1">أعضاء قاموا بزيارة ملفك الشخصي</p>
        </div>
      </div>

      {visitors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visitors.map((profile: any, index: number) => (
            <Link href={`/profile/${profile.id}`} key={`${profile.id}-${index}`}>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow flex items-center p-4 gap-4">
                 <div className="w-16 h-16 bg-slate-200 rounded-full flex-shrink-0 flex items-center justify-center text-slate-400 font-bold text-xl">
                   {profile.full_name?.charAt(0) || '?'}
                 </div>
                 <div>
                   <h3 className="font-bold text-slate-900">{profile.full_name}</h3>
                   <p className="text-sm text-slate-500 truncate">{profile.about_me || 'لا توجد نبذة'}</p>
                 </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-100">
           <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
             <Users className="w-10 h-10 text-slate-300" />
           </div>
           <h3 className="text-xl font-bold text-slate-700 mb-2">لا يوجد زوار بعد</h3>
           <p className="text-slate-500 mb-6">كن نشطاً في التطبيق لجذب المزيد من الزيارات</p>
           <Link href="/search" className="inline-block px-6 py-3 bg-primary-50 text-primary-600 font-medium rounded-xl hover:bg-primary-100 transition-colors">
             تصفح الأعضاء
           </Link>
        </div>
      )}
    </div>
  );
}
