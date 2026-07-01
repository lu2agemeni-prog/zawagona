'use client';

import { Heart, MessageCircle, Ban, Bookmark } from '@/components/my-icons';
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function ProfileActions({ profileId }: { profileId: string }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleLike = async () => {
    setIsLoading(true);
    try {
       const { data: { user } } = await supabase.auth.getUser();
       if (!user) return;
       
       if (isLiked) {
         await supabase.from('interests').delete().match({ sender_id: user.id, receiver_id: profileId });
         setIsLiked(false);
       } else {
         await supabase.from('interests').insert({ sender_id: user.id, receiver_id: profileId });
         setIsLiked(true);
       }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button 
        onClick={handleLike}
        disabled={isLoading}
        className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
          isLiked 
            ? 'bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100' 
            : 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm shadow-primary-200'
        }`}
      >
        <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500' : ''}`} />
        {isLiked ? 'إلغاء الإعجاب' : 'إعجاب'}
      </button>
      
      <button className="px-4 py-2 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
        <MessageCircle className="w-4 h-4" /> مراسلة
      </button>
      
      <div className="flex gap-2 mr-auto md:mr-4">
        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors" title="حفظ">
          <Bookmark className="w-5 h-5" />
        </button>
        <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors" title="حظر">
          <Ban className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
