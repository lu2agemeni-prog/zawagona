import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ChatClient from './chat-client';

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
    <ChatClient 
      currentUserId={session.user.id} 
      targetUserId={id} 
      targetUser={targetUser || {}} 
    />
  );
}
