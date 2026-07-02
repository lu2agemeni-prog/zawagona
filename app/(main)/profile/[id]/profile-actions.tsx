'use client';

import { Heart, MessageCircle, Ban, Bookmark, Eye } from '@/components/my-icons';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function ProfileActions({ 
  profileId, 
  isPhotoPrivate, 
  initialPhotoAccessStatus 
}: { 
  profileId: string, 
  isPhotoPrivate?: boolean, 
  initialPhotoAccessStatus?: string | null 
}) {
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPhotoLoading, setIsPhotoLoading] = useState(false);
  const [isMessageLoading, setIsMessageLoading] = useState(false);
  const [photoStatus, setPhotoStatus] = useState<string | null>(initialPhotoAccessStatus || null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function checkStatus() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('interests')
        .select('*')
        .eq('user_id', user.id)
        .eq('target_user_id', profileId)
        .eq('status', 'interested')
        .maybeSingle();
      if (data) setIsLiked(true);
    }
    checkStatus();
  }, [profileId, supabase]);

  const handleLike = async () => {
    setIsLoading(true);
    try {
       const { data: { user } } = await supabase.auth.getUser();
       if (!user) return;
       
       if (isLiked) {
         await supabase.from('interests').delete().match({ user_id: user.id, target_user_id: profileId, status: 'interested' });
         setIsLiked(false);
       } else {
         await supabase.from('interests').insert({ user_id: user.id, target_user_id: profileId, status: 'interested' });
         setIsLiked(true);
       }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoRequest = async () => {
    setIsPhotoLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      if (photoStatus === 'pending') {
        await supabase.from('photo_permissions').delete().match({ requester_id: user.id, target_id: profileId });
        setPhotoStatus(null);
      } else if (!photoStatus) {
        await supabase.from('photo_permissions').insert({ requester_id: user.id, target_id: profileId, status: 'pending' });
        setPhotoStatus('pending');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsPhotoLoading(false);
    }
  };

  const handleMessage = async () => {
    setIsMessageLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data: conv } = await supabase
        .from('conversations')
        .select('id')
        .or(`and(participant1_id.eq.${user.id},participant2_id.eq.${profileId}),and(participant1_id.eq.${profileId},participant2_id.eq.${user.id})`)
        .maybeSingle();
      
      if (conv) {
        router.push(`/messages?id=${conv.id}`);
      } else {
        const { data: newConv } = await supabase
          .from('conversations')
          .insert({ participant1_id: user.id, participant2_id: profileId })
          .select('id')
          .single();
        if (newConv) {
           router.push(`/messages?id=${newConv.id}`);
        } else {
          router.push('/messages');
        }
      }
    } catch (e) {
      console.error(e);
      router.push('/messages');
    } finally {
      setIsMessageLoading(false);
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

      {isPhotoPrivate && photoStatus !== 'approved' && (
        <button 
          onClick={handlePhotoRequest}
          disabled={isPhotoLoading}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
            photoStatus === 'pending'
              ? 'bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-200'
          }`}
        >
          {isPhotoLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className={`w-4 h-4 ${photoStatus === 'pending' ? 'text-indigo-600' : 'text-white'}`} />}
          {photoStatus === 'pending' ? 'إلغاء طلب الصور' : 'طلب رؤية الصور'}
        </button>
      )}
      
      <button 
        onClick={handleMessage}
        disabled={isMessageLoading}
        className="px-4 py-2 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
      >
        {isMessageLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageCircle className="w-4 h-4" />} مراسلة
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
