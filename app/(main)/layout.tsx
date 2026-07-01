import Sidebar from '@/components/sidebar';
import BottomNav from '@/components/bottom-nav';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar profile={profile || {}} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          {children}
        </main>
        <div className="md:hidden">
          <BottomNav unreadCount={0} />
        </div>
      </div>
    </div>
  );
}
