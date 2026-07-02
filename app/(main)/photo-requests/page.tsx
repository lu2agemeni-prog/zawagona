import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import PhotoRequestsClient from './photo-requests-client';
import { Eye } from '@/components/my-icons';

export const metadata = {
  title: 'طلبات الصور | مودة',
  description: 'إدارة طلبات رؤية الصور الشخصية',
};

export default async function PhotoRequestsPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  // Requests I received
  const { data: receivedRequests } = await supabase
    .from('photo_permissions')
    .select(`
      id,
      status,
      created_at,
      requester:requester_id (id, full_name, username, avatar_url, gender)
    `)
    .eq('target_id', user.id)
    .order('created_at', { ascending: false });

  // Requests I sent
  const { data: sentRequests } = await supabase
    .from('photo_permissions')
    .select(`
      id,
      status,
      created_at,
      target:target_id (id, full_name, username, avatar_url, gender)
    `)
    .eq('requester_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
          <Eye className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">طلبات رؤية الصور</h1>
          <p className="text-slate-500 dark:text-slate-400">إدارة طلبات الصلاحية الخاصة برؤية الصور الشخصية</p>
        </div>
      </div>

      <PhotoRequestsClient 
        receivedRequests={receivedRequests || []} 
        sentRequests={sentRequests || []} 
      />
    </div>
  );
}
