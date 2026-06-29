'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Heart, MessageCircle, Ban, Bookmark } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfileActions({ 
  targetUserId, 
  currentUserId,
  isPremium
}: { 
  targetUserId: string, 
  currentUserId?: string,
  isPremium: boolean
}) {
  const supabase = createClient();
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUserId) {
      checkStatus();
    }
  }, [currentUserId]);

  const checkStatus = async () => {
    const { data } = await supabase
      .from('interests')
      .select('status')
      .eq('user_id', currentUserId)
      .eq('target_user_id', targetUserId)
      .single();
      
    if (data) {
      setStatus(data.status);
    }
  };

  const handleAction = async (newStatus: string) => {
    if (!currentUserId) return;
    setLoading(true);
    
    // Upsert the interest
    const { error } = await supabase
      .from('interests')
      .upsert({
        user_id: currentUserId,
        target_user_id: targetUserId,
        status: newStatus
      }, { onConflict: 'user_id,target_user_id' });
      
    if (!error) {
      setStatus(newStatus);
    }
    setLoading(false);
  };

  const handleMessage = () => {
    if (!isPremium) {
      alert('خاصية إرسال الرسائل متاحة فقط للأعضاء المتميزين. يرجى الترقية!');
      router.push('/premium');
      return;
    }
    // Navigate to messages
    router.push(`/messages/${targetUserId}`);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <button 
          onClick={() => handleAction('interested')}
          disabled={loading || status === 'interested'}
          className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md font-medium text-sm transition ${
            status === 'interested' 
              ? 'bg-pink-100 text-pink-700 cursor-default'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          <Heart className={`h-4 w-4 mr-2 ${status === 'interested' ? 'fill-current' : ''}`} /> 
          {status === 'interested' ? 'مهتم' : 'إبداء الاهتمام'}
        </button>
        
        <button 
          onClick={handleMessage}
          className="flex-1 flex items-center justify-center px-4 py-2 rounded-md bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-medium text-sm transition"
        >
          <MessageCircle className="h-4 w-4 mr-2" /> 
          مراسلة
        </button>
      </div>
      
      <div className="flex gap-2">
        <button 
          onClick={() => handleAction('save')}
          disabled={loading || status === 'save'}
          className="flex-1 flex items-center justify-center px-3 py-1.5 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs transition"
        >
          <Bookmark className="h-3 w-3 mr-1" /> حفظ
        </button>
        
        <button 
          onClick={() => handleAction('ignore')}
          disabled={loading || status === 'ignore'}
          className="flex-1 flex items-center justify-center px-3 py-1.5 rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs transition"
        >
          تجاهل
        </button>
        
        <button 
          onClick={() => handleAction('block')}
          disabled={loading || status === 'block'}
          className="flex items-center justify-center px-3 py-1.5 rounded-md bg-red-50 text-red-600 hover:bg-red-100 text-xs transition"
        >
          <Ban className="h-3 w-3 mr-1" /> حظر
        </button>
      </div>
    </div>
  );
}
