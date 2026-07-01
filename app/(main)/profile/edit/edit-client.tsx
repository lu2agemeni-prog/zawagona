'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { CheckCircle2, ChevronRight, Save } from 'lucide-react';
import Link from 'next/link';

export default function EditProfileClient({ profile }: { profile: any }) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    age: profile.age?.toString() || '',
    nationality: profile.nationality || '',
    residence: profile.residence || '',
    marital_status: profile.marital_status || '',
    children_count: profile.children_count?.toString() || '0',
    smoker: profile.smoker ? 'yes' : 'no',
    height: profile.height?.toString() || '',
    weight: profile.weight?.toString() || '',
    skin_color: profile.skin_color || '',
    body_type: profile.body_type || '',
    beard: profile.beard ? 'yes' : 'no',
    health_status: profile.health_status || '',
    disabilities: profile.disabilities || '',
    job: profile.job || '',
    profession: profile.profession || '',
    qualification: profile.qualification || '',
    income_level: profile.income_level || '',
    religious_commitment: profile.religious_commitment || '',
    prayer_commitment: profile.prayer_commitment || '',
    qayma_opinion: profile.qayma_opinion || '',
    mahr_opinion: profile.mahr_opinion || '',
    marriage_time: profile.marriage_time || '',
    roya_opinion: profile.roya_opinion || '',
    hobbies: profile.hobbies || '',
    partner_specs: profile.partner_specs || '',
    about_me: profile.about_me || '',
    avatar_url: profile.avatar_url || 'avatar1.png'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (formData.partner_specs.length < 140) {
      setError('مواصفات شريك الحياة يجب أن تكون 140 حرف على الأقل');
      setLoading(false);
      return;
    }
    if (formData.about_me.length < 140) {
      setError('نبذة عني يجب أن تكون 140 حرف على الأقل');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        age: parseInt(formData.age),
        nationality: formData.nationality,
        residence: formData.residence,
        marital_status: formData.marital_status,
        children_count: parseInt(formData.children_count) || 0,
        smoker: formData.smoker === 'yes',
        height: parseInt(formData.height),
        weight: parseInt(formData.weight),
        skin_color: formData.skin_color,
        body_type: formData.body_type,
        beard: profile.gender === 'male' ? formData.beard === 'yes' : null,
        health_status: formData.health_status,
        disabilities: formData.disabilities,
        job: formData.job,
        profession: formData.profession,
        qualification: formData.qualification,
        income_level: formData.income_level,
        religious_commitment: formData.religious_commitment,
        prayer_commitment: formData.prayer_commitment,
        qayma_opinion: formData.qayma_opinion,
        mahr_opinion: formData.mahr_opinion,
        marriage_time: formData.marriage_time,
        roya_opinion: formData.roya_opinion,
        hobbies: formData.hobbies,
        partner_specs: formData.partner_specs,
        about_me: formData.about_me,
        avatar_url: formData.avatar_url,
        updated_at: new Date().toISOString()
      };

      const { error: updateError } = await supabase
        .from('profiles')
        .update(payload)
        .eq('id', profile.id);

      if (updateError) throw updateError;
      
      setSuccess(true);
      setTimeout(() => {
        router.push('/pending-approval');
        router.refresh();
      }, 2000);
      
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء التحديث');
    } finally {
      setLoading(false);
    }
  };

  const selectClass = "block w-full rounded-md border-slate-300 py-2.5 px-3 border shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white";
  const inputClass = "block w-full rounded-md border-slate-300 py-2.5 px-3 border shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm";

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">تعديل الملف الشخصي</h1>
          <p className="text-sm text-slate-500 mt-1">قم بتحديث بياناتك الشخصية ومواصفاتك</p>
        </div>
        <Link href="/profile" className="flex items-center text-sm font-medium text-slate-600 hover:text-indigo-600">
          <ChevronRight className="w-4 h-4 mr-1" />
          عودة
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-amber-50 text-amber-700 rounded-lg text-sm border border-amber-200 flex items-center">
          <CheckCircle2 className="w-5 h-5 mr-2" />
          تم حفظ التعديلات. حسابك الآن قيد المراجعة من الإدارة مرة أخرى لضمان جودة المنصة.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-100">
        
        {/* Basic Info */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-800 border-b pb-2">البيانات الأساسية</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">السن</label>
              <input type="number" name="age" required value={formData.age} onChange={handleChange} className={inputClass} min="18" max="90" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">الجنسية</label>
              <select name="nationality" required value={formData.nationality} onChange={handleChange} className={selectClass}>
                <option value="">اختر الجنسية</option>
                <option value="مصر">مصر</option>
                <option value="السعودية">السعودية</option>
                <option value="الإمارات">الإمارات</option>
                <option value="المغرب">المغرب</option>
                <option value="الجزائر">الجزائر</option>
                <option value="تونس">تونس</option>
                <option value="أخرى">أخرى</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">مكان الإقامة</label>
              <input type="text" name="residence" required value={formData.residence} onChange={handleChange} className={inputClass} placeholder="مثال: القاهرة، مصر" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">الحالة الاجتماعية</label>
              <select name="marital_status" required value={formData.marital_status} onChange={handleChange} className={selectClass}>
                <option value="">اختر</option>
                <option value="أعزب/عزباء">أعزب/عزباء</option>
                <option value="متزوج/ـة">متزوج/ـة</option>
                <option value="مطلق/ـة">مطلق/ـة</option>
                <option value="أرمل/ـة">أرمل/ـة</option>
              </select>
            </div>
          </div>
        </div>

        {/* Texts */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-800 border-b pb-2">نبذة ومواصفات</h2>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">الهوايات والاهتمامات</label>
            <input type="text" name="hobbies" required value={formData.hobbies} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">نبذة عني (140 حرف كحد أدنى)</label>
            <textarea name="about_me" required value={formData.about_me} onChange={handleChange} rows={4} className={inputClass}></textarea>
            <div className="text-xs mt-1 flex justify-end">
              <span className={formData.about_me.length < 140 ? "text-red-500 font-medium" : "text-green-600 font-medium"}>
                {formData.about_me.length} / 140
              </span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">مواصفات شريك الحياة (140 حرف كحد أدنى)</label>
            <textarea name="partner_specs" required value={formData.partner_specs} onChange={handleChange} rows={4} className={inputClass}></textarea>
            <div className="text-xs mt-1 flex justify-end">
              <span className={formData.partner_specs.length < 140 ? "text-red-500 font-medium" : "text-green-600 font-medium"}>
                {formData.partner_specs.length} / 140
              </span>
            </div>
          </div>
        </div>

        {/* Avatar */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-800 border-b pb-2">الصورة الرمزية</h2>
          <div className="flex flex-wrap gap-4">
            {profile.gender === 'male' ? (
              <>
                <label className="cursor-pointer relative group">
                  <input type="radio" name="avatar_url" value="avatar1.png" checked={formData.avatar_url === 'avatar1.png'} onChange={handleChange} className="peer sr-only" />
                  <div className="w-16 h-16 rounded-full bg-indigo-50 border-2 border-transparent peer-checked:border-indigo-600 peer-checked:bg-indigo-100 flex items-center justify-center text-3xl">👨</div>
                  {formData.avatar_url === 'avatar1.png' && <div className="absolute -top-1 -right-1 bg-indigo-600 rounded-full text-white p-0.5"><CheckCircle2 className="w-4 h-4" /></div>}
                </label>
                <label className="cursor-pointer relative group">
                  <input type="radio" name="avatar_url" value="avatar_m2.png" checked={formData.avatar_url === 'avatar_m2.png'} onChange={handleChange} className="peer sr-only" />
                  <div className="w-16 h-16 rounded-full bg-indigo-50 border-2 border-transparent peer-checked:border-indigo-600 peer-checked:bg-indigo-100 flex items-center justify-center text-3xl">🧔</div>
                  {formData.avatar_url === 'avatar_m2.png' && <div className="absolute -top-1 -right-1 bg-indigo-600 rounded-full text-white p-0.5"><CheckCircle2 className="w-4 h-4" /></div>}
                </label>
              </>
            ) : (
              <>
                <label className="cursor-pointer relative group">
                  <input type="radio" name="avatar_url" value="avatar2.png" checked={formData.avatar_url === 'avatar2.png'} onChange={handleChange} className="peer sr-only" />
                  <div className="w-16 h-16 rounded-full bg-pink-50 border-2 border-transparent peer-checked:border-pink-600 peer-checked:bg-pink-100 flex items-center justify-center text-3xl">👩</div>
                  {formData.avatar_url === 'avatar2.png' && <div className="absolute -top-1 -right-1 bg-pink-600 rounded-full text-white p-0.5"><CheckCircle2 className="w-4 h-4" /></div>}
                </label>
                <label className="cursor-pointer relative group">
                  <input type="radio" name="avatar_url" value="avatar_f2.png" checked={formData.avatar_url === 'avatar_f2.png'} onChange={handleChange} className="peer sr-only" />
                  <div className="w-16 h-16 rounded-full bg-pink-50 border-2 border-transparent peer-checked:border-pink-600 peer-checked:bg-pink-100 flex items-center justify-center text-3xl">🧕</div>
                  {formData.avatar_url === 'avatar_f2.png' && <div className="absolute -top-1 -right-1 bg-pink-600 rounded-full text-white p-0.5"><CheckCircle2 className="w-4 h-4" /></div>}
                </label>
              </>
            )}
            
            {profile.is_premium && (
              <div className="flex-1 ml-4 self-center">
                <label className="block text-sm font-medium text-amber-700 mb-1">رفع صورة حقيقية (حصرية للتميز)</label>
                <input 
                  type="text" 
                  name="avatar_url" 
                  value={!formData.avatar_url?.includes('.png') ? formData.avatar_url : ''} 
                  onChange={handleChange} 
                  className={inputClass} 
                  placeholder="رابط الصورة (URL)" 
                />
                <p className="text-xs text-slate-500 mt-1">مؤقتاً يرجى وضع رابط الصورة المباشر هنا.</p>
              </div>
            )}
          </div>
        </div>

        <div className="pt-6 border-t flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition shadow-sm"
          >
            {loading ? 'جاري الحفظ...' : (
              <>
                <Save className="w-5 h-5 mr-2" /> حفظ التعديلات
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
