'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function ChatClient({ 
  currentUserId, 
  targetUserId, 
  targetUser 
}: { 
  currentUserId: string, 
  targetUserId: string, 
  targetUser: { username?: string | null, avatar_url?: string | null } 
}) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const supabase = createClient();

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${currentUserId},receiver_id.eq.${targetUserId}),and(sender_id.eq.${targetUserId},receiver_id.eq.${currentUserId})`)
      .order('created_at', { ascending: true });
      
    if (data) {
      setMessages(data);
    }
    setLoading(false);
    scrollToBottom();
  };

  useEffect(() => {
    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel('public:messages')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `receiver_id=eq.${currentUserId}`
      }, (payload) => {
        if (payload.new.sender_id === targetUserId) {
          setMessages(prev => [...prev, payload.new]);
          scrollToBottom();
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [targetUserId]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageText = newMessage.trim();
    setNewMessage(''); // optimistic clear
    
    // Optimistic UI
    const tempMsg = {
      id: Math.random().toString(),
      sender_id: currentUserId,
      receiver_id: targetUserId,
      content: messageText,
      created_at: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, tempMsg]);
    scrollToBottom();

    const { error } = await supabase
      .from('messages')
      .insert({
        sender_id: currentUserId,
        receiver_id: targetUserId,
        content: messageText
      });
      
    if (error) {
      // Revert if error
      setMessages(prev => prev.filter(m => m.id !== tempMsg.id));
      setNewMessage(messageText);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] md:h-screen">
      <div className="bg-white border-b px-6 py-4 flex items-center shadow-sm">
        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-xl ml-3">
          {targetUser?.avatar_url?.includes('avatar') ? '👤' : '📸'}
        </div>
        <div className="font-bold text-slate-900">{targetUser?.username || 'عضو'}</div>
      </div>
      
      <div className="flex-1 bg-slate-50 p-4 md:p-6 overflow-y-auto flex flex-col">
        <div className="text-center text-sm text-slate-500 my-4">
          بداية المحادثة مع {targetUser?.username || 'العضو'}
        </div>
        
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col gap-3">
            {messages.map((msg) => {
              const isMine = msg.sender_id === currentUserId;
              return (
                <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                  <div 
                    className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                      isMine 
                        ? 'bg-indigo-600 text-white rounded-br-sm' 
                        : 'bg-white border border-slate-200 text-slate-900 rounded-bl-sm'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words text-sm">{msg.content}</p>
                    <span className={`text-[10px] block mt-1 ${isMine ? 'text-indigo-200 text-left' : 'text-slate-400 text-right'}`}>
                      {new Date(msg.created_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      <div className="bg-white border-t p-4">
        <form onSubmit={handleSend} className="flex gap-2 max-w-4xl mx-auto">
          <input 
            type="text" 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="اكتب رسالتك هنا..." 
            className="flex-1 border border-slate-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
          <button 
            type="submit" 
            disabled={!newMessage.trim()}
            className="bg-indigo-600 text-white rounded-full px-6 py-2 text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition"
          >
            إرسال
          </button>
        </form>
      </div>
    </div>
  );
}
