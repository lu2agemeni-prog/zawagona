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
    <div className="flex flex-col h-[calc(100vh-64px)] md:h-screen animate-in fade-in duration-500">
      <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center shadow-sm z-10 relative">
        <div className="w-12 h-12 bg-surface-50 border border-slate-100 rounded-full flex items-center justify-center text-xl ml-4 overflow-hidden">
          {targetUser?.avatar_url?.includes('avatar') ? (
            <User className="w-6 h-6 text-slate-400" />
          ) : (
            <ImageIcon className="w-6 h-6 text-slate-400" />
          )}
        </div>
        <div>
           <div className="font-bold text-slate-900 text-lg">{targetUser?.username || 'عضو'}</div>
           <div className="text-xs font-medium text-slate-500 flex items-center gap-1.5 mt-0.5">
             <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
             متصل الآن
           </div>
        </div>
      </div>
      
      <div className="flex-1 bg-stone-50 p-4 md:p-6 overflow-y-auto flex flex-col relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-[0.03] pointer-events-none"></div>
        <div className="text-center text-sm font-medium text-slate-500 my-6 bg-slate-100/50 backdrop-blur-sm self-center px-4 py-1.5 rounded-full border border-slate-200">
          بداية المحادثة مع {targetUser?.username || 'العضو'}
        </div>
        
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center text-primary-600">
            <Loader2 className="animate-spin h-10 w-10 mb-4" />
            <span className="font-medium">جاري تحميل الرسائل...</span>
          </div>
        ) : (
          <div className="flex-1 flex flex-col gap-4 relative z-10">
            {messages.map((msg) => {
              const isMine = msg.sender_id === currentUserId;
              return (
                <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                  <div 
                    className={`max-w-[75%] px-5 py-3 rounded-2xl shadow-sm ${
                      isMine 
                        ? 'bg-primary-600 text-white rounded-br-sm' 
                        : 'bg-white border border-slate-100 text-slate-900 rounded-bl-sm'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words text-sm font-medium leading-relaxed">{msg.content}</p>
                    <span className={`text-[10px] block mt-1.5 font-bold ${isMine ? 'text-primary-200 text-left' : 'text-slate-400 text-right'}`}>
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
      
      <div className="bg-white border-t border-slate-100 p-4 relative z-10">
        <form onSubmit={handleSend} className="flex gap-3 max-w-4xl mx-auto relative">
          <input 
            type="text" 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="اكتب رسالتك هنا..." 
            className="flex-1 border border-slate-200 bg-surface-50 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors shadow-sm"
          />
          <button 
            type="submit" 
            disabled={!newMessage.trim()}
            className="bg-primary-600 text-white rounded-2xl w-14 h-14 flex items-center justify-center font-bold hover:bg-primary-700 hover:shadow-md disabled:opacity-50 transition-all active:scale-[0.98]"
          >
            <Send className="h-5 w-5 -ml-1" />
          </button>
        </form>
      </div>
    </div>
  );
}
