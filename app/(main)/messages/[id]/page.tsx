import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  
  const { id } = await params;

  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_premium')
    .eq('id', session.user.id)
    .single();

  if (!profile?.is_premium) {
    redirect('/premium');
  }

  const { data: targetUser } = await supabase
    .from('profiles')
    .select('username, avatar_url')
    .eq('id', id)
    .single();

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] md:h-screen">
      <div className="bg-white border-b px-6 py-4 flex items-center">
        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-xl ml-3">
          {targetUser?.avatar_url?.includes('avatar') ? '👤' : '📸'}
        </div>
        <div className="font-bold">{targetUser?.username || 'عضو'}</div>
      </div>
      
      <div className="flex-1 bg-slate-50 p-6 overflow-y-auto">
        <div className="text-center text-sm text-slate-500 my-4">
          بداية المحادثة مع {targetUser?.username || 'العضو'}
        </div>
        {/* Chat messages would go here */}
      </div>
      
      <div className="bg-white border-t p-4">
        <form className="flex gap-2">
          <input 
            type="text" 
            placeholder="اكتب رسالتك هنا..." 
            className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:border-indigo-500"
          />
          <button type="submit" className="bg-indigo-600 text-white rounded-full px-6 py-2 font-medium hover:bg-indigo-700">
            إرسال
          </button>
        </form>
      </div>
    </div>
  );
}
