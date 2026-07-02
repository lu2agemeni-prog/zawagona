'use client';
import { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';

export default function MessagesClient({ currentUserId }: { currentUserId: string }) {
  // Optimistic UI for messages
  const [conversations, setConversations] = useState([
    {
      id: '1',
      name: 'عضو محتمل 1',
      lastMessage: 'مرحباً، كيف حالك؟',
      time: 'منذ ساعتين',
      unread: true,
    },
    {
      id: '2',
      name: 'عضو محتمل 2',
      lastMessage: 'أهلاً بك',
      time: 'أمس',
      unread: false,
    }
  ]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{sender: string, text: string}[]>([
    { sender: 'them', text: 'مرحباً، كيف حالك؟ قرأت ملفك الشخصي.' },
    { sender: 'me', text: 'أهلاً بك، الحمد لله بخير.' }
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setChatHistory([...chatHistory, { sender: 'me', text: message }]);
    setMessage('');
  };

  return (
    <div className="flex h-[70vh] bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
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
              <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold flex-shrink-0">
                {conv.name.charAt(0)}
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
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
              <MessageSquare className="w-8 h-8 text-slate-300" />
            </div>
            <p>اختر محادثة للبدء</p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-white">
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
                <span className="text-xs text-emerald-500">متصل الآن</span>
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
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-100">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <input 
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="اكتب رسالتك هنا..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                />
                <button 
                  type="submit"
                  disabled={!message.trim()}
                  className="w-12 h-12 bg-primary-600 text-white rounded-xl flex items-center justify-center hover:bg-primary-700 disabled:opacity-50 disabled:hover:bg-primary-600 transition-colors"
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
