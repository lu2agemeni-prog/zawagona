'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function ProfileSetupPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gender, setGender] = useState<'male' | 'female'>('male');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const g = sessionStorage.getItem('temp_gender') as 'male' | 'female';
      if (g) setGender(g);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // Validate lengths for text areas
    if ((data.partner_specs as string).length < 140) {
      setError('مواصفات شريك الحياة يجب أن تكون 140 حرف على الأقل');
      setLoading(false);
      return;
    }
    if ((data.about_me as string).length < 140) {
      setError('نبذة عني يجب أن تكون 140 حرف على الأقل');
      setLoading(false);
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not found. Please log in again.');
      }

      // Prepare payload
      const payload = {
        id: user.id,
        gender,
        age: parseInt(data.age as string),
        nationality: data.nationality,
        residence: data.residence,
        marital_status: data.marital_status,
        children_count: parseInt(data.children_count as string) || 0,
        smoker: data.smoker === 'yes',
        
        height: parseInt(data.height as string),
        weight: parseInt(data.weight as string),
        skin_color: data.skin_color,
        body_type: data.body_type,
        beard: gender === 'male' ? data.beard === 'yes' : null,
        health_status: data.health_status,
        disabilities: data.disabilities,
        
        job: data.job,
        profession: data.profession,
        qualification: data.qualification,
        income_level: data.income_level,
        
        religious_commitment: data.religious_commitment,
        prayer_commitment: data.prayer_commitment,
        
        qayma_opinion: data.qayma_opinion,
        mahr_opinion: data.mahr_opinion,
        marriage_time: data.marriage_time,
        roya_opinion: data.roya_opinion,
        
        hobbies: data.hobbies,
        partner_specs: data.partner_specs,
        about_me: data.about_me,
        avatar_url: data.avatar_url,
      };

      const { error: updateError } = await supabase
        .from('profiles')
        .update(payload)
        .eq('id', user.id);

      if (updateError) throw updateError;

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء حفظ البيانات');
    } finally {
      setLoading(false);
    }
  };

  const selectClass = "mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-white border";
  
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-100">
        <h1 className="text-2xl font-bold text-slate-900 mb-6 border-b pb-4">بناء الملف الشخصي</h1>
        
        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Info */}
          <section>
            <h2 className="text-xl font-semibold text-indigo-700 mb-4">البيانات الشخصية</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">السن</label>
                <select name="age" required className={selectClass}>
                  <option value="">اختر السن</option>
                  {Array.from({length: 50}, (_, i) => i + 18).map(age => (
                    <option key={age} value={age}>{age}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">الجنسية</label>
                <select name="nationality" required className={selectClass}>
                  <option value="">اختر الجنسية</option>
                  <option value="مصر">مصر</option>
                  <option value="السعودية">السعودية</option>
                  <option value="المغرب">المغرب</option>
                  <option value="الجزائر">الجزائر</option>
                  <option value="أخرى">أخرى</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">الإقامة الحالية</label>
                <select name="residence" required className={selectClass}>
                  <option value="">اختر الإقامة</option>
                  <option value="مصر">مصر</option>
                  <option value="السعودية">السعودية</option>
                  <option value="المغرب">المغرب</option>
                  <option value="أخرى">أخرى</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">الحالة الاجتماعية</label>
                <select name="marital_status" required className={selectClass}>
                  <option value="">اختر الحالة</option>
                  <option value="أعزب/عزباء">أعزب/عزباء</option>
                  <option value="متزوج/ـة">متزوج/ـة</option>
                  <option value="مطلق/ـة">مطلق/ـة</option>
                  <option value="أرمل/ـة">أرمل/ـة</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">عدد الأولاد</label>
                <select name="children_count" required className={selectClass}>
                  <option value="0">بدون أولاد</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4 أو أكثر</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">التدخين</label>
                <select name="smoker" required className={selectClass}>
                  <option value="">هل تدخن؟</option>
                  <option value="no">لا</option>
                  <option value="yes">نعم</option>
                </select>
              </div>
            </div>
          </section>

          {/* Physical Info */}
          <section>
            <h2 className="text-xl font-semibold text-indigo-700 mb-4">البيانات الجسمانية</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">الطول (سم)</label>
                <select name="height" required className={selectClass}>
                  <option value="">اختر الطول</option>
                  {Array.from({length: 80}, (_, i) => i + 140).map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">الوزن (كجم)</label>
                <select name="weight" required className={selectClass}>
                  <option value="">اختر الوزن</option>
                  {Array.from({length: 100}, (_, i) => i + 40).map(w => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">لون البشرة</label>
                <select name="skin_color" required className={selectClass}>
                  <option value="">اختر لون البشرة</option>
                  <option value="أبيض">أبيض</option>
                  <option value="قمحي">قمحي</option>
                  <option value="أسمر">أسمر</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">بنية الجسم</label>
                <select name="body_type" required className={selectClass}>
                  <option value="">اختر بنية الجسم</option>
                  <option value="نحيف">نحيف</option>
                  <option value="متوسط">متوسط</option>
                  <option value="رياضي">رياضي</option>
                  <option value="ممتلئ">ممتلئ</option>
                </select>
              </div>
              {gender === 'male' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">اللحية</label>
                  <select name="beard" required className={selectClass}>
                    <option value="">اختر</option>
                    <option value="yes">نعم، ملتحي</option>
                    <option value="no">لا</option>
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700">الحالة الصحية</label>
                <select name="health_status" required className={selectClass}>
                  <option value="">اختر</option>
                  <option value="سليم الحمد لله">سليم الحمد لله</option>
                  <option value="أعاني من مرض مزمن">أعاني من مرض مزمن</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">وجود إعاقة</label>
                <select name="disabilities" required className={selectClass}>
                  <option value="">اختر</option>
                  <option value="لا توجد">لا توجد</option>
                  <option value="توجد إعاقة حركية">توجد إعاقة حركية</option>
                  <option value="أخرى">أخرى</option>
                </select>
              </div>
            </div>
          </section>

          {/* Work Info */}
          <section>
            <h2 className="text-xl font-semibold text-indigo-700 mb-4">بيانات العمل والمستوى الدخل</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">الوظيفة</label>
                <input type="text" name="job" required className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 border shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">المهنة</label>
                <select name="profession" required className={selectClass}>
                  <option value="">اختر المهنة</option>
                  <option value="طبيب">طبيب</option>
                  <option value="مهندس">مهندس</option>
                  <option value="معلم">معلم</option>
                  <option value="أعمال حرة">أعمال حرة</option>
                  <option value="أخرى">أخرى</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">المؤهل</label>
                <select name="qualification" required className={selectClass}>
                  <option value="">اختر المؤهل</option>
                  <option value="ثانوي">ثانوي</option>
                  <option value="جامعي">جامعي</option>
                  <option value="دراسات عليا">دراسات عليا</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">مستوى الدخل</label>
                <select name="income_level" required className={selectClass}>
                  <option value="">اختر مستوى الدخل</option>
                  <option value="متوسط">متوسط</option>
                  <option value="جيد">جيد</option>
                  <option value="ممتاز">ممتاز</option>
                  <option value="لا أرغب في الإفصاح">لا أرغب في الإفصاح</option>
                </select>
              </div>
            </div>
          </section>

          {/* Religion Info */}
          <section>
            <h2 className="text-xl font-semibold text-indigo-700 mb-4">بيانات التدين</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">الالتزام الديني</label>
                <select name="religious_commitment" required className={selectClass}>
                  <option value="">اختر</option>
                  <option value="ملتزم جداً">ملتزم جداً</option>
                  <option value="ملتزم">ملتزم</option>
                  <option value="متوسط">متوسط</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">الالتزام بالصلاة</label>
                <select name="prayer_commitment" required className={selectClass}>
                  <option value="">اختر</option>
                  <option value="أصلي دائماً">أصلي دائماً</option>
                  <option value="أغلب الأوقات">أغلب الأوقات</option>
                  <option value="متقطع">متقطع</option>
                </select>
              </div>
            </div>
          </section>

          {/* Marriage Info */}
          <section>
            <h2 className="text-xl font-semibold text-indigo-700 mb-4">بيانات الارتباط</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">ما رأيك في القايمة؟</label>
                <select name="qayma_opinion" required className={selectClass}>
                  <option value="">اختر</option>
                  <option value="موافق عليها">موافق عليها</option>
                  <option value="أرفضها تماماً">أرفضها تماماً</option>
                  <option value="حسب الاتفاق">حسب الاتفاق</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ما رأيك في الشبكة والمهر؟</label>
                <select name="mahr_opinion" required className={selectClass}>
                  <option value="">اختر</option>
                  <option value="ضروري ومهم">ضروري ومهم</option>
                  <option value="حسب الاستطاعة">حسب الاستطاعة (ميسر)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">الميعاد المتوقع للارتباط</label>
                <select name="marriage_time" required className={selectClass}>
                  <option value="">اختر</option>
                  <option value="في أسرع وقت">في أسرع وقت</option>
                  <option value="خلال أشهر">خلال أشهر</option>
                  <option value="خلال سنة">خلال سنة أو أكثر</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">الرؤية الشرعية</label>
                <select name="roya_opinion" required className={selectClass}>
                  <option value="">اختر</option>
                  <option value="ضرورية في المنزل">ضرورية في المنزل بوجود الأهل</option>
                  <option value="ممكن في مكان عام">ممكن في مكان عام مع الأهل</option>
                </select>
              </div>
            </div>
          </section>

          {/* Texts */}
          <section>
            <h2 className="text-xl font-semibold text-indigo-700 mb-4">مواصفات وتفاصيل (يجب كتابة 140 حرف على الأقل)</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">الهوايات والاهتمامات</label>
                <input type="text" name="hobbies" required className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 border shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">مواصفات شريك الحياة</label>
                <textarea name="partner_specs" required rows={4} className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 border shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="تحدث بالتفصيل عما تبحث عنه (140 حرف كحد أدنى)"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">نبذة عني</label>
                <textarea name="about_me" required rows={4} className="mt-1 block w-full rounded-md border-gray-300 py-2 px-3 border shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="تحدث عن نفسك بالتفصيل (140 حرف كحد أدنى)"></textarea>
              </div>
            </div>
          </section>

          {/* Avatar */}
          <section>
            <h2 className="text-xl font-semibold text-indigo-700 mb-4">الصورة الرمزية (أفاتار)</h2>
            <div className="flex space-x-4 space-x-reverse">
              <label className="cursor-pointer">
                <input type="radio" name="avatar_url" value="avatar1.png" className="peer sr-only" defaultChecked />
                <div className="w-16 h-16 rounded-full bg-indigo-100 border-2 border-transparent peer-checked:border-indigo-600 flex items-center justify-center">1</div>
              </label>
              <label className="cursor-pointer">
                <input type="radio" name="avatar_url" value="avatar2.png" className="peer sr-only" />
                <div className="w-16 h-16 rounded-full bg-pink-100 border-2 border-transparent peer-checked:border-pink-600 flex items-center justify-center">2</div>
              </label>
              <label className="cursor-pointer">
                <input type="radio" name="avatar_url" value="avatar3.png" className="peer sr-only" />
                <div className="w-16 h-16 rounded-full bg-green-100 border-2 border-transparent peer-checked:border-green-600 flex items-center justify-center">3</div>
              </label>
            </div>
          </section>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-indigo-600 px-4 py-3 text-white font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-slate-300 transition-colors"
          >
            {loading ? 'جاري حفظ البيانات...' : 'إكمال التسجيل والدخول'}
          </button>
        </form>
      </div>
    </div>
  );
}
