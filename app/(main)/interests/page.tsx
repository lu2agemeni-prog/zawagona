import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Heart } from '@/components/my-icons';

export default async function InterestsPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/login');

  // Fetch users that the current user is interested in
  const { data: interests } = await supabase
    .from('interests')
    .select(`
      target_user_id,
      profiles!interests_target_user_id_fkey(id, username, age, residence, marital_status, avatar_url)
    `)
    .eq('user_id', session.user.id)
    .eq('status', 'interested');

  const interestedProfiles = interests?.map((i: any) => i.profiles) || [];

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center gap-2">
        <Heart className="h-6 w-6 text-pink-600" />
        <h2 className="text-2xl font-bold text-slate-900">قائمة الاهتمامات</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {interestedProfiles.map((profile) => (
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

        {interestedProfiles.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-xl border border-slate-100">
            لا توجد اهتمامات في قائمتك حالياً.
          </div>
        )}
      </div>
    </div>
  );
}
