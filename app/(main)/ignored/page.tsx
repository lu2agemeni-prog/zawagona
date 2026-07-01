import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { UserX } from 'lucide-react';

export default async function IgnoredPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/login');

  const { data: ignored } = await supabase
    .from('interests')
    .select(`
      target_user_id,
      profiles!interests_target_user_id_fkey(id, username, age, residence, avatar_url)
    `)
    .eq('user_id', session.user.id)
    .in('status', ['ignore', 'block']);

  const ignoredProfiles = ignored?.map((i: any) => i.profiles) || [];

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center gap-2">
        <UserX className="h-6 w-6 text-slate-500" />
        <h2 className="text-2xl font-bold text-slate-900">قائمة التجاهل والحظر</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 divide-y divide-slate-100">
        {ignoredProfiles.length > 0 ? (
          ignoredProfiles.map((profile) => (
            <div key={profile.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-xl">
                  {profile.avatar_url?.includes('avatar') ? '👤' : '📸'}
                </div>
                <div>
                  <div className="font-bold text-slate-900">{profile.username || 'عضو'}</div>
                  <div className="text-sm text-slate-500">{profile.age} سنة • {profile.residence}</div>
                </div>
              </div>
              <Link href={`/profile/${profile.id}`} className="text-sm text-indigo-600 font-medium hover:underline">
                عرض الملف
              </Link>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-slate-500">
            القائمة فارغة.
          </div>
        )}
      </div>
    </div>
  );
}
