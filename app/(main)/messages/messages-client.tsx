'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, UserPlus, Eye, X } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function MessagesClient({ currentUserId }: { currentUserId: string }) {
  const supabase = createClient();
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Record<string, boolean>>({});

  // Modals state
  const [showWaliModal, setShowWaliModal] = useState(false);
  const [showRoyaModal, setShowRoyaModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isTyping]);

  useEffect(() => {
    // Fetch potential conversations (for demo, we just fetch other profiles)
    // In a real app, this would be a query to get unique users who have exchanged messages
    const fetchConversations = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, full_name, last_seen')
        .neq('id', currentUserId)
        .limit(10);
      
      if (data) {
        setConversations(data.map(d => ({
          id: d.id,
          name: d.full_name || 'عضو',
          lastMessage: 'انقر لبدء المحادثة',
          time: '',
          unread: false,
          online: false
        })));
      }
    };
    fetchConversations();

    // Subscribe to presence (online status and typing indicator)
    const channel = supabase.channel('chat_presence')
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState();
        const online: Record<string, boolean> = {};
        let someoneTyping = false;
        
        Object.values(newState).forEach((presences: any) => {
          presences.forEach((p: any) => {
            if (p.user_id !== currentUserId) {
              online[p.user_id] = true;
              if (p.is_typing && p.typing_to === activeConversation) {
                someoneTyping = true;
              }
            }
          });
        });
        
        setOnlineUsers(online);
        
        // Only show typing if the active conversation partner is typing
        const activePartnerTyping = Object.values(newState).some((presences: any) => 
          presences.some((p: any) => p.user_id === activeConversation && p.is_typing && p.typing_to === currentUserId)
        );
        setIsTyping(activePartnerTyping);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ user_id: currentUserId, is_typing: false, typing_to: null });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId, activeConversation]);

  // Load chat history and subscribe to new messages
  useEffect(() => {
    if (!activeConversation) return;

    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${currentUserId},receiver_id.eq.${activeConversation}),and(sender_id.eq.${activeConversation},receiver_id.eq.${currentUserId})`)
        .order('created_at', { ascending: true });
        
      if (data) {
        setChatHistory(data.map(d => ({
          id: d.id,
          sender: d.sender_id === currentUserId ? 'me' : 'them',
          text: d.content,
        })));
      }
    };

    fetchMessages();

    // Subscribe to new messages
    const messageChannel = supabase.channel(`messages:${activeConversation}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `sender_id=eq.${activeConversation}`
      }, (payload) => {
        if (payload.new.receiver_id === currentUserId) {
          setChatHistory(prev => [...prev, {
            id: payload.new.id,
            sender: 'them',
            text: payload.new.content
          }]);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(messageChannel);
    };
  }, [activeConversation, currentUserId]);

  const handleTyping = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    // Broadcast typing status
    const channel = supabase.channel('chat_presence');
    if (channel.state === 'joined') {
      await channel.track({ user_id: currentUserId, is_typing: e.target.value.length > 0, typing_to: activeConversation });
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !activeConversation) return;
    
    const newMessage = { sender: 'me', text: message };
    setChatHistory([...chatHistory, newMessage]);
    setMessage('');
    
    // Clear typing status
    const channel = supabase.channel('chat_presence');
    if (channel.state === 'joined') {
      await channel.track({ user_id: currentUserId, is_typing: false, typing_to: null });
    }

    // Insert to DB
    await supabase.from('messages').insert({
      sender_id: currentUserId,
      receiver_id: activeConversation,
      content: newMessage.text
    });
  };

  return (
    <div className="flex h-[70vh] bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 transition-colors">
      
      {/* Wali Integration Modal */}
      {showWaliModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white p-6 rounded-3xl max-w-md w-full shadow-2xl relative">
            <button onClick={() => setShowWaliModal(false)} className="absolute left-4 top-4 text-slate-400 hover:text-slate-600">
              <X className="w-6 h-6" />
            </button>
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
              <UserPlus className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">إشراك الولي</h3>
            <p className="text-slate-600 mb-6 text-sm">
              أدخلي رقم هاتف ولي الأمر (مثل الوالد أو الأخ) ليتم إرسال نسخة من طلبات التعارف أو المحادثة إليه لضمان الشفافية والموثوقية.
            </p>
            <input type="tel" placeholder="رقم هاتف الولي" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mb-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
            <button onClick={() => { alert('تم الحفظ. سيتم إرسال نسخة من المحادثة إلى ولي الأمر.'); setShowWaliModal(false); }} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors">
              حفظ وتفعيل
            </button>
          </div>
        </div>
      )}

      {/* Ro'ya Shar'iya Modal */}
      {showRoyaModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white p-6 rounded-3xl max-w-md w-full shadow-2xl relative">
            <button onClick={() => setShowRoyaModal(false)} className="absolute left-4 top-4 text-slate-400 hover:text-slate-600">
              <X className="w-6 h-6" />
            </button>
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">طلب رؤية شرعية</h3>
            <p className="text-slate-600 mb-6 text-sm">
              يمكنك الآن طلب تحديد موعد للرؤية الشرعية بشكل رسمي ومحترم بحضور الأهل.
            </p>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">المكان المفضل</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                  <option>في منزل الأهل</option>
                  <option>في مكان عام بحضور الأهل</option>
                  <option>عبر مكالمة فيديو رسمية (مبدئياً)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">رسالة إضافية للأهل</label>
                <textarea rows={3} placeholder="يمكنك كتابة رسالة توضيحية..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"></textarea>
              </div>
            </div>
            <button onClick={() => { alert('تم إرسال طلب الرؤية الشرعية بنجاح.'); setShowRoyaModal(false); }} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-colors">
              إرسال الطلب
            </button>
          </div>
        </div>
      )}

      {/* Sidebar - Conversations list */}
      <div className={`w-full md:w-1/3 border-l border-slate-100 flex flex-col ${activeConversation ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-800 text-lg">المحادثات</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map(conv => (
            <button 
              key={conv.id}
              onClick={() => setActiveConversation(conv.id)}
              className={`w-full text-right p-4 border-b border-slate-50 transition-colors flex items-center gap-3 ${activeConversation === conv.id ? 'bg-primary-50' : 'hover:bg-slate-50'}`}
            >
              <div className="relative">
                <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold flex-shrink-0">
                  {conv.name.charAt(0)}
                </div>
                {onlineUsers[conv.id] && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className={`font-semibold truncate ${conv.unread ? 'text-slate-900' : 'text-slate-700'}`}>{conv.name}</h3>
                  <span className="text-xs text-slate-400">{conv.time}</span>
                </div>
                <p className={`text-sm truncate ${conv.unread ? 'text-slate-800 font-medium' : 'text-slate-500'}`}>{conv.lastMessage}</p>
              </div>
              {conv.unread && (
                <div className="w-3 h-3 bg-primary-500 rounded-full flex-shrink-0"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`w-full md:w-2/3 flex flex-col ${!activeConversation ? 'hidden md:flex bg-slate-50' : 'flex'}`}>
        {!activeConversation ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <div className="w-20 h-20 bg-white border border-slate-100 rounded-full flex items-center justify-center shadow-sm mb-4">
              <MessageSquare className="w-8 h-8 text-slate-300" />
            </div>
            <p>اختر محادثة للبدء</p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-3 bg-white">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setActiveConversation(null)}
                  className="md:hidden p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  ←
                </button>
                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold">
                  {conversations.find(c => c.id === activeConversation)?.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{conversations.find(c => c.id === activeConversation)?.name}</h3>
                  {activeConversation && onlineUsers[activeConversation] && (
                    <span className="text-xs text-emerald-500">متصل الآن</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowRoyaModal(true)}
                  title="طلب رؤية شرعية"
                  className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Eye className="w-4 h-4" />
                  <span className="text-xs font-bold hidden sm:inline">رؤية شرعية</span>
                </button>
                <button 
                  onClick={() => setShowWaliModal(true)}
                  title="إشراك الولي"
                  className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span className="text-xs font-bold hidden sm:inline">إشراك الولي</span>
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] p-3 rounded-2xl ${msg.sender === 'me' ? 'bg-primary-600 text-white rounded-br-sm' : 'bg-white text-slate-800 border border-slate-100 shadow-sm rounded-bl-sm'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-100 shadow-sm rounded-2xl rounded-bl-sm p-4 flex gap-2 items-center">
                    <span className="text-xs text-slate-500 font-medium">جاري الكتابة</span>
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-100">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <input 
                  type="text"
                  value={message}
                  onChange={handleTyping}
                  placeholder="اكتب رسالتك هنا..."
                  className="flex-1 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                />
                <button 
                  type="submit"
                  disabled={!message.trim()}
                  className="w-12 h-12 bg-primary-600 text-white rounded-xl flex items-center justify-center hover:bg-primary-700 disabled:opacity-50 disabled:hover:bg-primary-600 transition-colors flex-shrink-0"
                >
                  <Send className="w-5 h-5 rtl:rotate-180" />
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
