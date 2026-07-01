import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { Star, User, Image as ImageIcon, Info, Heart, Shield, Activity, GraduationCap } from '@/components/my-icons';
import ProfileActions from './profile-actions';
import ReportButton from './report-button';

export const dynamic = 'force-dynamic';

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
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Profile Header */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 items-center md:items-start relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary-50 to-surface-50 opacity-50"></div>
        <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center relative flex-shrink-0 shadow-md border-4 border-white z-10">
          {member.avatar_url?.includes('avatar') ? (
            <User className="w-16 h-16 text-slate-300" />
          ) : (
            <ImageIcon className="w-16 h-16 text-slate-300" />
          )}
          {member.is_premium && (
            <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white rounded-full p-2 border-2 border-white shadow-sm">
              <Star className="h-4 w-4 fill-current" />
            </div>
          )}
        </div>
        
        <div className="flex-1 text-center md:text-right z-10">
          <h1 className="text-3xl font-black text-slate-900 flex items-center justify-center md:justify-start gap-2 tracking-tight">
            {member.username || 'عضو'}
            <span className="text-sm font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">#{member.id.substring(0, 5)}</span>
          </h1>
          <p className="text-slate-600 font-medium mt-3 text-lg">
            {member.age} سنة • {member.residence} ({member.nationality}) • {member.marital_status}
          </p>
          <div className="mt-4 text-xs font-medium text-slate-500 bg-surface-50 inline-block px-3 py-1.5 rounded-full border border-slate-100">
            أخر تواجد: {new Date(member.updated_at).toLocaleDateString('ar-EG')}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full md:w-auto mt-6 md:mt-0 z-10">
          <ProfileActions targetUserId={member.id} currentUserId={currentUserId} isPremium={isPremium} />
        </div>
      </div>

      {/* About Section */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group hover:border-primary-100 transition-colors">
        <div className="absolute top-0 right-0 w-2 h-full bg-primary-500"></div>
        <h2 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-2">
          <Info className="h-5 w-5 text-primary-500" /> نبذة عني
        </h2>
        <p className="text-slate-700 whitespace-pre-wrap leading-relaxed font-medium bg-slate-50 p-5 rounded-xl border border-slate-100">
          {member.about_me || 'لم يكتب نبذة بعد.'}
        </p>
      </div>

      {/* Partner Specs */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group hover:border-pink-100 transition-colors">
        <div className="absolute top-0 right-0 w-2 h-full bg-pink-500"></div>
        <h2 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-2">
          <Heart className="h-5 w-5 text-pink-500" /> مواصفات شريك الحياة المطلوبة
        </h2>
        <p className="text-slate-700 whitespace-pre-wrap leading-relaxed font-medium bg-slate-50 p-5 rounded-xl border border-slate-100">
          {member.partner_specs || 'لم يكتب المواصفات بعد.'}
        </p>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2 pb-3 border-b border-slate-100">
             <User className="w-5 h-5 text-primary-600" /> البيانات الشخصية والاجتماعية
          </h3>
          <ul className="space-y-4 text-sm">
            <li className="flex justify-between items-center"><span className="text-slate-500 font-medium">العمر:</span> <span className="font-bold text-slate-900 bg-slate-50 px-2 py-1 rounded-md">{member.age}</span></li>
            <li className="flex justify-between items-center"><span className="text-slate-500 font-medium">الحالة الاجتماعية:</span> <span className="font-bold text-slate-900 bg-slate-50 px-2 py-1 rounded-md">{member.marital_status}</span></li>
            <li className="flex justify-between items-center"><span className="text-slate-500 font-medium">عدد الأولاد:</span> <span className="font-bold text-slate-900 bg-slate-50 px-2 py-1 rounded-md">{member.children_count}</span></li>
            <li className="flex justify-between items-center"><span className="text-slate-500 font-medium">الإقامة:</span> <span className="font-bold text-slate-900 bg-slate-50 px-2 py-1 rounded-md">{member.residence}</span></li>
            <li className="flex justify-between items-center"><span className="text-slate-500 font-medium">الجنسية:</span> <span className="font-bold text-slate-900 bg-slate-50 px-2 py-1 rounded-md">{member.nationality}</span></li>
          </ul>
        </div>
        
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2 pb-3 border-b border-slate-100">
            <Activity className="w-5 h-5 text-primary-600" /> البيانات الجسمانية والصحية
          </h3>
          <ul className="space-y-4 text-sm">
            <li className="flex justify-between items-center"><span className="text-slate-500 font-medium">الطول:</span> <span className="font-bold text-slate-900 bg-slate-50 px-2 py-1 rounded-md">{member.height} سم</span></li>
            <li className="flex justify-between items-center"><span className="text-slate-500 font-medium">الوزن:</span> <span className="font-bold text-slate-900 bg-slate-50 px-2 py-1 rounded-md">{member.weight} كجم</span></li>
            <li className="flex justify-between items-center"><span className="text-slate-500 font-medium">لون البشرة:</span> <span className="font-bold text-slate-900 bg-slate-50 px-2 py-1 rounded-md">{member.skin_color}</span></li>
            <li className="flex justify-between items-center"><span className="text-slate-500 font-medium">بنية الجسم:</span> <span className="font-bold text-slate-900 bg-slate-50 px-2 py-1 rounded-md">{member.body_type}</span></li>
            <li className="flex justify-between items-center"><span className="text-slate-500 font-medium">الحالة الصحية:</span> <span className="font-bold text-slate-900 bg-slate-50 px-2 py-1 rounded-md">{member.health_status}</span></li>
            {member.gender === 'male' && (
              <li className="flex justify-between items-center"><span className="text-slate-500 font-medium">اللحية:</span> <span className="font-bold text-slate-900 bg-slate-50 px-2 py-1 rounded-md">{member.beard ? 'نعم' : 'لا'}</span></li>
            )}
          </ul>
        </div>
        
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2 pb-3 border-b border-slate-100">
             <GraduationCap className="w-5 h-5 text-primary-600" /> الدراسة والعمل
          </h3>
          <ul className="space-y-4 text-sm">
            <li className="flex justify-between items-center"><span className="text-slate-500 font-medium">المؤهل:</span> <span className="font-bold text-slate-900 bg-slate-50 px-2 py-1 rounded-md text-left truncate w-2/3" title={member.qualification}>{member.qualification}</span></li>
            <li className="flex justify-between items-center"><span className="text-slate-500 font-medium">الوظيفة:</span> <span className="font-bold text-slate-900 bg-slate-50 px-2 py-1 rounded-md text-left truncate w-2/3" title={member.job}>{member.job}</span></li>
            <li className="flex justify-between items-center"><span className="text-slate-500 font-medium">المهنة:</span> <span className="font-bold text-slate-900 bg-slate-50 px-2 py-1 rounded-md text-left truncate w-2/3" title={member.profession}>{member.profession}</span></li>
            <li className="flex justify-between items-center"><span className="text-slate-500 font-medium">مستوى الدخل:</span> <span className="font-bold text-slate-900 bg-slate-50 px-2 py-1 rounded-md text-left truncate w-2/3" title={member.income_level}>{member.income_level}</span></li>
          </ul>
        </div>
        
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2 pb-3 border-b border-slate-100">
            <Shield className="w-5 h-5 text-primary-600" /> التدين والارتباط
          </h3>
          <ul className="space-y-4 text-sm">
            <li className="flex justify-between items-center"><span className="text-slate-500 font-medium">الالتزام الديني:</span> <span className="font-bold text-slate-900 bg-slate-50 px-2 py-1 rounded-md">{member.religious_commitment}</span></li>
            <li className="flex justify-between items-center"><span className="text-slate-500 font-medium">الصلاة:</span> <span className="font-bold text-slate-900 bg-slate-50 px-2 py-1 rounded-md">{member.prayer_commitment}</span></li>
            <li className="flex justify-between items-center"><span className="text-slate-500 font-medium">القايمة:</span> <span className="font-bold text-slate-900 bg-slate-50 px-2 py-1 rounded-md">{member.qayma_opinion}</span></li>
            <li className="flex justify-between items-center"><span className="text-slate-500 font-medium">الرؤية الشرعية:</span> <span className="font-bold text-slate-900 bg-slate-50 px-2 py-1 rounded-md">{member.roya_opinion}</span></li>
          </ul>
        </div>
      </div>
      
      <div className="flex justify-end pt-4">
        <ReportButton reportedId={member.id} currentUserId={currentUserId} />
      </div>
    </div>
  );
}
