import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Bell } from 'lucide-react';

export default async function NotificationsPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  // Basic UI since we don't have a notifications table setup yet
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
          <Bell className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">الإشعارات</h1>
          <p className="text-slate-500 mt-1">تنبيهاتك وتحديثاتك الجديدة</p>
        </div>
      </div>

      <div className="text-center py-16 bg-white rounded-3xl border border-slate-100">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Bell className="w-10 h-10 text-slate-300" />
        </div>
        <h3 className="text-xl font-bold text-slate-700 mb-2">لا توجد إشعارات</h3>
        <p className="text-slate-500">ليس لديك أي إشعارات جديدة في الوقت الحالي.</p>
      </div>
    </div>
  );
}
