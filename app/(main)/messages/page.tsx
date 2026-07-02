import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { MessageSquare } from 'lucide-react';
import MessagesClient from './messages-client';

export default async function MessagesPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

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

      <MessagesClient currentUserId={user.id} />
    </div>
  );
}
