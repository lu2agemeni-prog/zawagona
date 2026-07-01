import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';

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
      <div className="p-4 md:p-8 max-w-4xl mx-auto text-center mt-12">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
          <div className="text-6xl mb-4">👑</div>
          <h1 className="text-2xl font-bold text-slate-900 mb-4">ميزة حصرية للمتميزين</h1>
          <p className="text-slate-600 mb-8 max-w-md mx-auto">
            ميزة معرفة من زار ملفك الشخصي متاحة فقط لأعضاء باقة التميز. اشترك الآن واعرف من يهتم بك!
          </p>
          <Link href="/premium" className="bg-amber-500 text-white px-8 py-3 rounded-full font-bold hover:bg-amber-600 transition">
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
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">من زار ملفي</h1>
      
      {(!visits || visits.length === 0) ? (
        <div className="bg-white p-12 text-center rounded-xl shadow-sm border border-slate-100 text-slate-500">
          لم يقم أحد بزيارة ملفك الشخصي مؤخراً
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visits.map((visit: any, idx: number) => {
            const visitor = Array.isArray(visit.visitor) ? visit.visitor[0] : visit.visitor;
            return (
            <Link key={idx} href={`/profile/${visitor.id}`} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-3xl">
                {visitor.avatar_url?.includes('avatar') ? '👤' : '📸'}
              </div>
              <div className="flex-1">
                <div className="font-bold text-slate-900">{visitor.username || 'عضو'}</div>
                <div className="text-xs text-slate-500">{visitor.age} سنة • {visitor.residence}</div>
              </div>
              <div className="text-xs text-slate-400">
                {new Date(visit.created_at).toLocaleDateString('ar-EG')}
              </div>
            </Link>
          )})}
        </div>
      )}
    </div>
  );
}
