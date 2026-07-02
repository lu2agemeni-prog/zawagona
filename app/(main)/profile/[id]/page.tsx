import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import ProfileActions from './profile-actions';
import { ArrowLeft, Star } from '@/components/my-icons';
import Link from 'next/link';
import { PrivateImage } from '@/components/private-image';

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { id } = await params;
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (!profile) {
    notFound();
  }

  // Record visit
  if (user.id !== id) {
    // Only record visit if viewing someone else's profile
    await supabase.from('visitors').insert({
      visitor_id: user.id,
      visited_id: id,
    });
  }

  const isOwner = user.id === profile.id;
  
  // Check photo permissions if not owner
  let hasPhotoAccess = isOwner;
  if (!isOwner && profile.is_photo_private) {
    // Check if there is an approved request
    const { data: permission } = await supabase
      .from('photo_permissions')
      .select('status')
      .eq('requester_id', user.id)
      .eq('target_id', profile.id)
      .eq('status', 'approved')
      .single();
      
    if (permission) {
      hasPhotoAccess = true;
    }
  }

  const defaultAvatarUrl = profile.gender === 'female' ? '/avatars/avatar_f2.png' : '/avatars/avatar1.png';
  const avatarUrl = profile.avatar_url ? (profile.avatar_url.startsWith('http') ? profile.avatar_url : `/${profile.avatar_url}`) : defaultAvatarUrl;

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-6">
      <Link href="/search" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-4">
        <ArrowLeft className="w-4 h-4" /> العودة للبحث
      </Link>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="h-64 bg-indigo-50 relative overflow-hidden">
           {profile.avatar_url && (
             <PrivateImage 
               src={avatarUrl} 
               alt="Cover" 
               fill 
               className="object-cover opacity-40 blur-3xl"
               isPrivate={profile.is_photo_private}
               hasAccess={hasPhotoAccess}
             />
           )}
        </div>
        
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 -mt-16 md:-mt-20 mb-6 relative">
             <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full p-1 relative z-10 border-4 border-white shadow-sm flex items-center justify-center text-4xl font-bold text-slate-400 overflow-hidden">
                <PrivateImage 
                  src={avatarUrl} 
                  alt={profile.username || ''} 
                  fill 
                  className="object-cover rounded-full"
                  isPrivate={profile.is_photo_private}
                  hasAccess={hasPhotoAccess}
                />
             </div>
             
             {!isOwner && (
               <ProfileActions profileId={profile.id} />
             )}
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-2">
              {profile.full_name}
              {profile.is_premium && <Star className="w-6 h-6 text-amber-500 fill-amber-500" />}
            </h1>
            <p className="text-slate-500">
              {profile.gender === 'male' ? 'ذكر' : 'أنثى'} • العمر غير متاح
            </p>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4">نبذة عني</h2>
              <div className="bg-slate-50 p-6 rounded-2xl text-slate-700 leading-relaxed whitespace-pre-wrap">
                {profile.about_me || 'لم يقم هذا العضو بكتابة نبذة شخصية بعد.'}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
