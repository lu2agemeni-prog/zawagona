import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Users, User, History, Image as ImageIcon } from '@/components/my-icons';

export default async function VisitorsPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_premium')
    .eq('id', session.user.id)
    .single();

  if (!profile?.is_premium) {
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto text-center mt-12 animate-in fade-in duration-500">
        <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center">
          <div className="text-7xl mb-6 bg-amber-50 w-32 h-32 rounded-full flex items-center justify-center">👑</div>
          <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">ميزة حصرية للمتميزين</h1>
          <p className="text-slate-600 mb-8 max-w-md mx-auto text-lg font-medium leading-relaxed">
            ميزة معرفة من زار ملفك الشخصي متاحة فقط لأعضاء باقة التميز. اشترك الآن واعرف من يهتم بك!
          </p>
          <Link href="/premium" className="bg-amber-500 text-white px-10 py-4 rounded-xl font-bold hover:bg-amber-600 hover:-translate-y-1 hover:shadow-lg transition-all active:translate-y-0 text-lg">
            الانضمام لباقة التميز
          </Link>
        </div>
      </div>
    );
  }

  const { data: visits } = await supabase
    .from('profile_visits')
    .select('created_at, visitor:profiles!visitor_id(id, username, age, residence, avatar_url)')
    .eq('visited_id', session.user.id)
    .order('created_at', { ascending: false })
    .limit(50);

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="mb-8 flex items-center gap-3">
        <div className="bg-primary-100 p-2.5 rounded-xl">
          <Users className="h-6 w-6 text-primary-600" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">من زار ملفي</h1>
      </div>
      
      {(!visits || visits.length === 0) ? (
        <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-dashed border-slate-200 shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-5">
               {/* <History className="w-10 h-10 text-slate-400" /> */}
            </div>
            <h4 className="text-xl font-bold text-slate-800 mb-2">لا يوجد زيارات حالياً</h4>
            <p className="text-sm font-medium text-slate-500 max-w-md">لم يقم أحد بزيارة ملفك الشخصي مؤخراً.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visits.map((visit: any, idx: number) => {
            const visitor = Array.isArray(visit.visitor) ? visit.visitor[0] : visit.visitor;
            return (
            <Link key={idx} href={`/profile/${visitor.id}`} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md hover:border-primary-100 transition-all group">
              <div className="w-16 h-16 rounded-full bg-surface-50 flex items-center justify-center text-3xl group-hover:bg-primary-50 transition-colors">
                {visitor.avatar_url?.includes('avatar') ? (
                  <User className="w-8 h-8 text-slate-400 group-hover:text-primary-500 transition-colors" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-slate-400 group-hover:text-primary-500 transition-colors" />
                )}
              </div>
              <div className="flex-1">
                <div className="font-bold text-slate-900 group-hover:text-primary-700 transition-colors">{visitor.username || 'عضو'}</div>
                <div className="text-sm font-medium text-slate-500 mt-1">{visitor.age} سنة • {visitor.residence}</div>
              </div>
              <div className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                {new Date(visit.created_at).toLocaleDateString('ar-EG')}
              </div>
            </Link>
          )})}
        </div>
      )}
    </div>
  );
}
