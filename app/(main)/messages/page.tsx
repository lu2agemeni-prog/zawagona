import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { MessageSquare } from 'lucide-react';
import MessagesClient from './messages-client';
import { Suspense } from 'react';

export default async function MessagesPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  // Get conversations
  const { data: conversations } = await supabase
    .from('conversations')
    .select(`
      id,
      updated_at,
      participant1:participant1_id(id, username, display_name, avatar_url, gender),
      participant2:participant2_id(id, username, display_name, avatar_url, gender),
      messages!messages_conversation_id_fkey(
        content,
        created_at,
        sender_id,
        read_at
      )
    `)
    .or(`participant1_id.eq.${user.id},participant2_id.eq.${user.id}`)
    .order('updated_at', { ascending: false });

  // Format conversations
  const formattedConversations = conversations?.map(conv => {
    // Determine the other participant
    const isParticipant1 = (conv.participant1 as any).id === user.id;
    const otherParticipant = isParticipant1 ? conv.participant2 : conv.participant1;
    
    // Get latest message
    const msgs = Array.isArray(conv.messages) ? conv.messages : [];
    const latestMessage = msgs.sort((a: any, b: any) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0];
    
    const unreadCount = msgs.filter((m: any) => m.sender_id !== user.id && !m.read_at).length || 0;

    return {
      id: conv.id,
      user_id: (otherParticipant as any).id,
      name: (otherParticipant as any).display_name || (otherParticipant as any).username || 'عضو',
      avatar_url: (otherParticipant as any).avatar_url,
      gender: (otherParticipant as any).gender,
      lastMessage: latestMessage?.content || 'انقر لبدء المحادثة',
      time: latestMessage ? new Date(latestMessage.created_at).toLocaleDateString('ar-EG') : new Date(conv.updated_at).toLocaleDateString('ar-EG'),
      unread: unreadCount > 0,
      unreadCount,
    };
  }) || [];

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
          <MessageSquare className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">الرسائل</h1>
          <p className="text-slate-500 mt-1">تواصل مع الأعضاء بكل أمان وسرية</p>
        </div>
      </div>

      <Suspense fallback={<div>جاري تحميل المحادثات...</div>}>
        <MessagesClient currentUserId={user.id} initialConversations={formattedConversations} />
      </Suspense>
    </div>
  );
}
