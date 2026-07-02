import Sidebar from '@/components/sidebar';
import BottomNav from '@/components/bottom-nav';
import { PrivacyGuard } from '@/components/privacy-guard';
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
  
  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch (err) {
    console.error(err);
  }
  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900 transition-colors">
      <div className="hidden md:flex w-64 flex-col border-l border-slate-100 dark:border-slate-800">
        <Sidebar profile={profile || {}} />
      </div>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-black text-primary-700 dark:text-primary-500 tracking-tight">مـودة</h2>
          <Sidebar profile={profile || {}} mobile={true} />
        </div>
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0 prevent-screenshot">
          <PrivacyGuard>
            {children}
          </PrivacyGuard>
        </main>
        <div className="md:hidden">
          <BottomNav unreadCount={0} />
        </div>
      </div>
    </div>
  );
}
