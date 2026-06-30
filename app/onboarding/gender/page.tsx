'use client';

import { useRouter } from 'next/navigation';
import { User, UserRound } from '@/components/icons';
import { createClient } from '@/utils/supabase/client';
import { useState } from 'react';

export default function GenderSelectionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const selectGender = async (gender: 'male' | 'female') => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await supabase.from('profiles').update({ gender }).eq('id', session.user.id);
    }
    router.push('/onboarding/profile');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm border border-slate-100 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">أنا ...</h1>
        <p className="text-slate-500 mb-8">اختر الجنس، علماً بأنه لا يمكن تعديله لاحقاً</p>

        {loading ? (
          <div className="py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div></div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => selectGender('male')}
              className="flex flex-col items-center justify-center p-6 border-2 border-slate-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all"
            >
              <User className="w-16 h-16 text-indigo-600 mb-4" />
              <span className="font-bold text-lg text-slate-800">ذكر (عريس)</span>
            </button>

            <button
              onClick={() => selectGender('female')}
              className="flex flex-col items-center justify-center p-6 border-2 border-slate-200 rounded-xl hover:border-pink-500 hover:bg-pink-50 transition-all"
            >
              <UserRound className="w-16 h-16 text-pink-600 mb-4" />
              <span className="font-bold text-lg text-slate-800">أنثى (عروس)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
