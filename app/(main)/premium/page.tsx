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

  return <PremiumClient userId={session.user.id} />;
}
