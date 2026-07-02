import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Bell } from 'lucide-react';
import NotificationsClient from './notifications-client';

export default async function NotificationsPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  // Fetch notifications
  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

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

      <NotificationsClient initialNotifications={notifications || []} />
    </div>
  );
}
