import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import SettingsClient from './settings-client';
import { Settings as SettingsIcon } from 'lucide-react';

export const metadata = {
  title: 'الإعدادات | مودة',
  description: 'إعدادات الملف الشخصي وتفضيلات البحث',
};

export default async function SettingsPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const { data: photos } = await supabase
    .from('user_photos')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
          <SettingsIcon className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">إعدادات الحساب</h1>
          <p className="text-slate-500 dark:text-slate-400">تعديل بيانات الملف الشخصي، الصور، وتفضيلات البحث</p>
        </div>
      </div>

      <SettingsClient profile={profile} initialPhotos={photos || []} />
    </div>
  );
}
