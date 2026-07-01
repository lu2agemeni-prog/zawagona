import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function MyProfilePage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/login');

  const { data: member } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (!member) redirect('/login');

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900">ملفي الشخصي</h2>
        <Link href={`/profile/${member.id}`} className="text-indigo-600 hover:underline text-sm font-medium">
          معاينة كعضو آخر
        </Link>
      </div>
      
      {/* Profile Header */}
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 items-center md:items-start">
        <div className="w-32 h-32 rounded-full bg-slate-100 flex items-center justify-center text-5xl relative flex-shrink-0">
          {member.avatar_url?.includes('avatar') ? '👤' : '📸'}
        </div>
        
        <div className="flex-1 text-center md:text-right">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center justify-center md:justify-start gap-2">
            {member.username || 'عضو'}
          </h1>
          <p className="text-slate-600 mt-2">
            {member.age} سنة • {member.residence} ({member.nationality}) • {member.marital_status}
          </p>
        </div>

        <div className="w-full md:w-auto mt-4 md:mt-0">
          <Link href="/profile/edit" className="w-full md:w-auto px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-md font-medium text-sm transition inline-block text-center">
            تعديل البيانات
          </Link>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-indigo-700 mb-4 pb-2 border-b">نبذة عني</h2>
        <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
          {member.about_me || 'لم يكتب نبذة بعد.'}
        </p>
      </div>

      {/* Partner Specs */}
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-indigo-700 mb-4 pb-2 border-b">مواصفات شريك الحياة المطلوبة</h2>
        <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
          {member.partner_specs || 'لم يكتب المواصفات بعد.'}
        </p>
      </div>
    </div>
  );
}
