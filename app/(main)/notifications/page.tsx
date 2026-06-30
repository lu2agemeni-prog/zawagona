import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Bell } from '@/components/icons';

export default async function NotificationsPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/login');

  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center gap-2">
        <Bell className="h-6 w-6 text-indigo-600" />
        <h2 className="text-2xl font-bold text-slate-900">الإشعارات</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 divide-y divide-slate-100">
        {notifications && notifications.length > 0 ? (
          notifications.map((notif) => (
            <div key={notif.id} className={`p-4 flex gap-4 transition hover:bg-slate-50 ${!notif.is_read ? 'bg-indigo-50/50' : ''}`}>
              <div className="bg-indigo-100 p-2 rounded-full h-fit">
                <Bell className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-slate-800">{notif.content}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {new Date(notif.created_at).toLocaleDateString('ar-EG')} - {new Date(notif.created_at).toLocaleTimeString('ar-EG')}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-slate-500">
            لا توجد إشعارات حالياً
          </div>
        )}
      </div>
    </div>
  );
}
