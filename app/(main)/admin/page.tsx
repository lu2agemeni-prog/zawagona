import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Users, CreditCard, ShieldAlert } from 'lucide-react';
import AdminClient from './admin-client';

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', session.user.id)
    .single();

  if (!profile?.is_admin) {
    redirect('/dashboard');
  }

  // Fetch some stats
  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  const { count: premiumUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('is_premium', true);
    
  const { count: pendingReports } = await supabase
    .from('reports')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">لوحة تحكم الإدارة</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center">
          <div className="bg-indigo-100 p-4 rounded-full mr-4 ml-4">
            <Users className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <div className="text-slate-500 text-sm">إجمالي الأعضاء</div>
            <div className="text-2xl font-bold text-slate-900">{totalUsers || 0}</div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center">
          <div className="bg-amber-100 p-4 rounded-full mr-4 ml-4">
            <CreditCard className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <div className="text-slate-500 text-sm">الأعضاء المتميزين</div>
            <div className="text-2xl font-bold text-slate-900">{premiumUsers || 0}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center">
          <div className="bg-red-100 p-4 rounded-full mr-4 ml-4">
            <ShieldAlert className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <div className="text-slate-500 text-sm">بلاغات معلقة</div>
            <div className="text-2xl font-bold text-slate-900">{pendingReports || 0}</div>
          </div>
        </div>
      </div>

      <AdminClient />
    </div>
  );
}
