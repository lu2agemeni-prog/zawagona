import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import SearchClient from './search-client';

export default async function SearchPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  // Fetch the current user profile to get their preferences
  const { data: currentUserProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Fetch profiles excluding the current user
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .neq('id', user.id)
    .limit(20);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">البحث والمطابقة الذكية</h1>
      <SearchClient 
        initialProfiles={profiles || []} 
        currentUserId={user.id} 
        currentUserProfile={currentUserProfile || {}}
      />
    </div>
  );
}
