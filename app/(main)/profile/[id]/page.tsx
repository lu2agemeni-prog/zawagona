import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { Star } from 'lucide-react';
import ProfileActions from './profile-actions';
import ReportButton from './report-button';

export default async function MemberProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { id } = await params;

  const { data: { session } } = await supabase.auth.getSession();
  const currentUserId = session?.user.id;

  const { data: member, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !member) {
    notFound();
  }

  // Determine if the current user is premium
  const { data: currentUserProfile } = await supabase
    .from('profiles')
    .select('is_premium')
    .eq('id', currentUserId)
    .single();

  const isPremium = currentUserProfile?.is_premium || false;

  // Log profile visit (Incognito for premium)
  if (currentUserId && currentUserId !== id && !isPremium) {
    // Check if recently visited to avoid spam
    const { data: recentVisit } = await supabase
      .from('profile_visits')
      .select('id')
      .eq('visitor_id', currentUserId)
      .eq('visited_id', id)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .limit(1)
      .maybeSingle();

    if (!recentVisit) {
      await supabase.from('profile_visits').insert({
        visitor_id: currentUserId,
        visited_id: id
      });
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 items-center md:items-start">
        <div className="w-32 h-32 rounded-full bg-slate-100 flex items-center justify-center text-5xl relative flex-shrink-0">
          {member.avatar_url?.includes('avatar') ? '👤' : '📸'}
          {member.is_premium && (
            <div className="absolute -bottom-2 -right-2 bg-amber-500 text-white rounded-full p-2 border-4 border-white">
              <Star className="h-4 w-4 fill-current" />
            </div>
          )}
        </div>
        
        <div className="flex-1 text-center md:text-right">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center justify-center md:justify-start gap-2">
            {member.username || 'عضو'}
            <span className="text-sm font-normal text-slate-400">#{member.id.substring(0, 5)}</span>
          </h1>
          <p className="text-slate-600 mt-2">
            {member.age} سنة • {member.residence} ({member.nationality}) • {member.marital_status}
          </p>
          <div className="mt-4 text-sm text-slate-500">
            أخر تواجد: {new Date(member.updated_at).toLocaleDateString('ar-EG')}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full md:w-auto mt-4 md:mt-0">
          <ProfileActions targetUserId={member.id} currentUserId={currentUserId} isPremium={isPremium} />
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

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-4">البيانات الشخصية والاجتماعية</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex justify-between border-b pb-2"><span className="text-slate-500">العمر:</span> <span className="font-medium text-slate-900">{member.age}</span></li>
            <li className="flex justify-between border-b pb-2"><span className="text-slate-500">الحالة الاجتماعية:</span> <span className="font-medium text-slate-900">{member.marital_status}</span></li>
            <li className="flex justify-between border-b pb-2"><span className="text-slate-500">عدد الأولاد:</span> <span className="font-medium text-slate-900">{member.children_count}</span></li>
            <li className="flex justify-between border-b pb-2"><span className="text-slate-500">الإقامة:</span> <span className="font-medium text-slate-900">{member.residence}</span></li>
            <li className="flex justify-between border-b pb-2"><span className="text-slate-500">الجنسية:</span> <span className="font-medium text-slate-900">{member.nationality}</span></li>
          </ul>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-4">البيانات الجسمانية والصحية</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex justify-between border-b pb-2"><span className="text-slate-500">الطول:</span> <span className="font-medium text-slate-900">{member.height} سم</span></li>
            <li className="flex justify-between border-b pb-2"><span className="text-slate-500">الوزن:</span> <span className="font-medium text-slate-900">{member.weight} كجم</span></li>
            <li className="flex justify-between border-b pb-2"><span className="text-slate-500">لون البشرة:</span> <span className="font-medium text-slate-900">{member.skin_color}</span></li>
            <li className="flex justify-between border-b pb-2"><span className="text-slate-500">بنية الجسم:</span> <span className="font-medium text-slate-900">{member.body_type}</span></li>
            <li className="flex justify-between border-b pb-2"><span className="text-slate-500">الحالة الصحية:</span> <span className="font-medium text-slate-900">{member.health_status}</span></li>
            {member.gender === 'male' && (
              <li className="flex justify-between border-b pb-2"><span className="text-slate-500">اللحية:</span> <span className="font-medium text-slate-900">{member.beard ? 'نعم' : 'لا'}</span></li>
            )}
          </ul>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-4">الدراسة والعمل</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex justify-between border-b pb-2"><span className="text-slate-500">المؤهل:</span> <span className="font-medium text-slate-900">{member.qualification}</span></li>
            <li className="flex justify-between border-b pb-2"><span className="text-slate-500">الوظيفة:</span> <span className="font-medium text-slate-900">{member.job}</span></li>
            <li className="flex justify-between border-b pb-2"><span className="text-slate-500">المهنة:</span> <span className="font-medium text-slate-900">{member.profession}</span></li>
            <li className="flex justify-between border-b pb-2"><span className="text-slate-500">مستوى الدخل:</span> <span className="font-medium text-slate-900">{member.income_level}</span></li>
          </ul>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-4">التدين والارتباط</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex justify-between border-b pb-2"><span className="text-slate-500">الالتزام الديني:</span> <span className="font-medium text-slate-900">{member.religious_commitment}</span></li>
            <li className="flex justify-between border-b pb-2"><span className="text-slate-500">الصلاة:</span> <span className="font-medium text-slate-900">{member.prayer_commitment}</span></li>
            <li className="flex justify-between border-b pb-2"><span className="text-slate-500">القايمة:</span> <span className="font-medium text-slate-900">{member.qayma_opinion}</span></li>
            <li className="flex justify-between border-b pb-2"><span className="text-slate-500">الرؤية الشرعية:</span> <span className="font-medium text-slate-900">{member.roya_opinion}</span></li>
          </ul>
        </div>
      </div>
      
      <div className="flex justify-end pt-4">
        <ReportButton reportedId={member.id} currentUserId={currentUserId} />
      </div>
    </div>
  );
}
