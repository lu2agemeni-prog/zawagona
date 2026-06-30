import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import PremiumClient from './premium-client';

export default async function PremiumPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_premium, premium_until')
    .eq('id', session.user.id)
    .single();

  return <PremiumClient 
    userId={session.user.id} 
    isPremium={profile?.is_premium || false} 
    premiumUntil={profile?.premium_until} 
  />;
}
