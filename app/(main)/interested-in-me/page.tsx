import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Users } from 'lucide-react';

export default async function InterestedInMePage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/login');

  const { data: interestedInMe } = await supabase
    .from('interests')
    .select(`
      user_id,
      profiles!interests_user_id_fkey(id, username, age, residence, avatar_url)
    `)
    .eq('target_user_id', session.user.id)
    .eq('status', 'interested');

  const profiles = interestedInMe?.map((i: any) => i.profiles) || [];

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center gap-2">
        <Users className="h-6 w-6 text-pink-600" />
        <h2 className="text-2xl font-bold text-slate-900">من يهتم بي</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {profiles.map((profile) => (
          <div key={profile.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition flex flex-col">
            <div className="h-32 bg-slate-100 flex flex-col items-center justify-center relative">
              <span className="text-5xl">{profile.avatar_url?.includes('avatar') ? '👤' : '📸'}</span>
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <div className="font-bold text-slate-900 truncate">
                {profile.username || 'عضو'}
              </div>
              <div className="text-sm text-slate-600 mt-2 space-y-1">
                <div>{profile.age} سنة • {profile.residence}</div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                <Link 
                  href={`/profile/${profile.id}`}
                  className="block text-indigo-700 hover:bg-indigo-50 py-1.5 rounded-md text-sm font-medium transition"
                >
                  عرض الملف
                </Link>
              </div>
            </div>
          </div>
        ))}

        {profiles.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-xl border border-slate-100">
            لم يقم أحد بإبداء الاهتمام بملفك بعد. استكمل بياناتك وكن متفاعلاً لزيادة فرصك!
          </div>
        )}
      </div>
    </div>
  );
}
