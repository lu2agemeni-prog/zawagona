import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import Sidebar from '@/components/sidebar';
import BottomNav from '@/components/bottom-nav';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  // Fetch profile to see if it's completed
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (!profile || !profile.gender) {
    redirect('/onboarding/mithaq');
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Desktop Sidebar (hidden on mobile) */}
      <div className="hidden md:flex md:w-64 md:flex-col border-l bg-white">
        <Sidebar profile={profile} />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex h-16 items-center justify-between border-b bg-white px-4">
          <h1 className="text-xl font-bold text-indigo-600">تطبيق مودة</h1>
          {/* Mobile menu button could go here, or handled inside Sidebar component as a drawer */}
          <Sidebar profile={profile} mobile />
        </header>

        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          {children}
        </main>

        {/* Mobile Bottom Nav */}
        <div className="md:hidden">
          <BottomNav />
        </div>
      </div>
    </div>
  );
}
