'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Heart, MessageCircle, Ban, Bookmark, EyeOff } from '@/components/my-icons';
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
    <div className="flex flex-col gap-3 w-full md:w-[280px]">
      <div className="flex flex-col gap-2">
        <button 
          onClick={() => handleAction('interested')}
          disabled={loading || status === 'interested'}
          className={`flex items-center justify-center px-4 py-3 rounded-xl font-bold text-sm transition-all ${
            status === 'interested' 
              ? 'bg-pink-50 text-pink-600 border border-pink-100 cursor-default'
              : 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-md active:scale-[0.98]'
          }`}
        >
          <Heart className={`h-4 w-4 ml-2 ${status === 'interested' ? 'fill-current' : ''}`} /> 
          {status === 'interested' ? 'تم إبداء الاهتمام' : 'إبداء الاهتمام'}
        </button>
        
        <button 
          onClick={handleMessage}
          className="flex items-center justify-center px-4 py-3 rounded-xl bg-white border border-primary-200 text-primary-700 hover:bg-primary-50 font-bold text-sm transition-all hover:shadow-sm active:scale-[0.98]"
        >
          <MessageCircle className="h-4 w-4 ml-2" /> 
          مراسلة
        </button>
      </div>
      
      <div className="flex gap-2">
        <button 
          onClick={() => handleAction('save')}
          disabled={loading || status === 'save'}
          className="flex-1 flex items-center justify-center px-2 py-2 rounded-lg bg-surface-50 text-slate-600 hover:bg-slate-100 border border-slate-100 text-xs font-bold transition-colors"
        >
          <Bookmark className={`h-3.5 w-3.5 ml-1.5 ${status === 'save' ? 'fill-current text-primary-600' : ''}`} /> 
          {status === 'save' ? 'محفوظ' : 'حفظ'}
        </button>
        
        <button 
          onClick={() => handleAction('ignore')}
          disabled={loading || status === 'ignore'}
          className="flex-1 flex items-center justify-center px-2 py-2 rounded-lg bg-surface-50 text-slate-600 hover:bg-slate-100 border border-slate-100 text-xs font-bold transition-colors"
        >
          <EyeOff className="h-3.5 w-3.5 ml-1.5" /> تجاهل
        </button>
        
        <button 
          onClick={() => handleAction('block')}
          disabled={loading || status === 'block'}
          className="flex items-center justify-center px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 text-xs font-bold transition-colors"
          title="حظر المستخدم"
        >
          <Ban className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
