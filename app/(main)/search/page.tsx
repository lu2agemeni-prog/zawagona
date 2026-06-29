import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import SearchClient from './search-client';

export default async function SearchPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: { session } } = await supabase.auth.getSession();
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('gender, is_premium')
    .eq('id', session?.user.id)
    .single();

  const oppositeGender = profile?.gender === 'male' ? 'female' : 'male';

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">البحث</h2>
        <p className="mt-1 text-sm text-slate-500">ابحث عن شريك حياتك بالمواصفات التي تريدها</p>
      </div>

      <SearchClient targetGender={oppositeGender} isPremium={profile?.is_premium} />
    </div>
  );
}
