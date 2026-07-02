'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { PartyPopper, CheckCircle2, ChevronRight, ChevronLeft } from '@/components/my-icons';

export default function ProfileSetupPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  
  const [step, setStep] = useState(1);
  const totalSteps = 6;
  const [showCelebration, setShowCelebration] = useState(false);

  const [formData, setFormData] = useState({
    age: '', nationality: '', residence: '', marital_status: '', children_count: '0', smoker: '',
    height: '', weight: '', skin_color: '', body_type: '', beard: '', health_status: '', disabilities: '',
    job: '', profession: '', qualification: '', income_level: '',
    religious_commitment: '', prayer_commitment: '',
    qayma_opinion: '', mahr_opinion: '', marriage_time: '', roya_opinion: '',
    hobbies: '', partner_specs: '', about_me: '', avatar_url: 'avatar1.png'
  });

  useEffect(() => {
    async function fetchGender() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('profiles').select('gender').eq('id', user.id).single();
        if (data?.gender) {
          setGender(data.gender);
        } else {
          router.push('/onboarding/gender');
        }
      }
    }
    fetchGender();

    // Load saved progress
    const savedData = localStorage.getItem('onboarding_form_data');
    const savedStep = localStorage.getItem('onboarding_step');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setTimeout(() => setFormData(parsed), 0);
      } catch (e) {}
    }
    if (savedStep) {
      const parsedStep = parseInt(savedStep, 10);
      setTimeout(() => setStep(parsedStep), 0);
    }
  }, [router, supabase]);

  useEffect(() => {
    // Auto-save progress
    if (step > 1 || formData.age !== '') {
      localStorage.setItem('onboarding_form_data', JSON.stringify(formData));
      localStorage.setItem('onboarding_step', step.toString());
    }
  }, [formData, step]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 6) {
      handleSubmit();
    } else {
      setStep(s => s + 1);
    }
  };

  const handlePrev = () => {
    setStep(s => Math.max(1, s - 1));
  };

  const saveAndExit = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not found');
      
      // Save what we have so far to DB
      const payload: any = {};
      Object.entries(formData).forEach(([key, value]) => {
        if (value) payload[key] = value;
      });

      if (Object.keys(payload).length > 0) {
        await supabase.from('profiles').update(payload).eq('id', user.id);
      }
      
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      router.push('/dashboard');
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    // Validate lengths for text areas
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
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not found. Please log in again.');
      }

      // Prepare payload
      const payload = {
        id: user.id,
        gender,
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
        beard: gender === 'male' ? formData.beard === 'yes' : null,
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
      };

      const { error: updateError } = await supabase
        .from('profiles')
        .update(payload)
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Clear auto-saved progress
      localStorage.removeItem('onboarding_form_data');
      localStorage.removeItem('onboarding_step');

      setShowCelebration(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
      
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء حفظ البيانات');
      setLoading(false);
    }
  };

  const selectClass = "mt-1 block w-full rounded-md border-gray-300 dark:border-slate-700 dark:bg-slate-800 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-white dark:bg-slate-900 border";

  if (showCelebration) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 p-10 rounded-2xl shadow-xl text-center max-w-md w-full animate-in zoom-in duration-500 border border-indigo-100 relative overflow-hidden">
          {/* Confetti simulation with css classes or we can just use simple emojis floating, but static is fine since we have transition */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-50">
             <div className="absolute top-10 left-10 text-2xl animate-bounce" style={{animationDelay: '0s'}}>🎉</div>
             <div className="absolute top-20 right-10 text-2xl animate-bounce" style={{animationDelay: '0.2s'}}>✨</div>
             <div className="absolute bottom-10 left-20 text-2xl animate-bounce" style={{animationDelay: '0.4s'}}>🎊</div>
             <div className="absolute bottom-20 right-20 text-2xl animate-bounce" style={{animationDelay: '0.1s'}}>🌟</div>
          </div>
          <div className="flex justify-center mb-6 relative z-10">
            <div className="bg-green-100 p-5 rounded-full text-green-600 animate-pulse">
              <PartyPopper className="h-16 w-16" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4 relative z-10">تهانينا! 🎉</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 relative z-10">
            تم استكمال ملفك الشخصي بنجاح.
          </p>
          <div className="flex justify-center items-center text-sm font-medium text-indigo-600 bg-indigo-50 py-3 px-6 rounded-full relative z-10">
            <CheckCircle2 className="w-5 h-5 mr-2 animate-spin-slow" style={{animationIterationCount: 1}} />
            جاري توجيهك للوحة التحكم...
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100">بناء الملف الشخصي</h1>
            <span className="text-sm font-bold text-indigo-700 bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100">
              {step === totalSteps ? 'الخطوة الأخيرة' : `متبقي ${totalSteps - step + 1} خطوات`}
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-full rounded-full transition-all duration-500 ease-out relative"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            >
              <div className="absolute inset-0 bg-white dark:bg-slate-900/20 w-full animate-[shimmer_2s_infinite]"></div>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-700 flex items-center border border-red-100">
             {error}
          </div>
        )}

        <form onSubmit={handleNext} className="space-y-6">
          
          {/* Step 1: Personal Info */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-semibold text-indigo-700 border-b border-indigo-100 pb-2">البيانات الشخصية</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">السن</label>
                  <select name="age" required value={formData.age} onChange={handleChange} className={selectClass}>
                    <option value="">اختر السن</option>
                    {Array.from({length: 50}, (_, i) => i + 18).map(age => (
                      <option key={age} value={age}>{age}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">الجنسية</label>
                  <select name="nationality" required value={formData.nationality} onChange={handleChange} className={selectClass}>
                    <option value="">اختر الجنسية</option>
                    <option value="مصر">مصر</option>
                    <option value="السعودية">السعودية</option>
                    <option value="الأردن">الأردن</option>
                    <option value="الإمارات">الإمارات</option>
                    <option value="البحرين">البحرين</option>
                    <option value="الجزائر">الجزائر</option>
                    <option value="السودان">السودان</option>
                    <option value="الصومال">الصومال</option>
                    <option value="العراق">العراق</option>
                    <option value="الكويت">الكويت</option>
                    <option value="المغرب">المغرب</option>
                    <option value="اليمن">اليمن</option>
                    <option value="تونس">تونس</option>
                    <option value="جزر القمر">جزر القمر</option>
                    <option value="جيبوتي">جيبوتي</option>
                    <option value="سوريا">سوريا</option>
                    <option value="عمان">عمان</option>
                    <option value="فلسطين">فلسطين</option>
                    <option value="قطر">قطر</option>
                    <option value="لبنان">لبنان</option>
                    <option value="ليبيا">ليبيا</option>
                    <option value="موريتانيا">موريتانيا</option>
                    <option disabled>──────────</option>
                    <option value="أستراليا">أستراليا</option>
                    <option value="ألمانيا">ألمانيا</option>
                    <option value="المملكة المتحدة">المملكة المتحدة</option>
                    <option value="الولايات المتحدة">الولايات المتحدة</option>
                    <option value="إيطاليا">إيطاليا</option>
                    <option value="تركيا">تركيا</option>
                    <option value="فرنسا">فرنسا</option>
                    <option value="كندا">كندا</option>
                    <option value="أخرى">أخرى</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">الإقامة الحالية</label>
                  <select name="residence" required value={formData.residence} onChange={handleChange} className={selectClass}>
                    <option value="">اختر الإقامة</option>
                    <option value="مصر">مصر</option>
                    <option value="السعودية">السعودية</option>
                    <option value="الأردن">الأردن</option>
                    <option value="الإمارات">الإمارات</option>
                    <option value="البحرين">البحرين</option>
                    <option value="الجزائر">الجزائر</option>
                    <option value="السودان">السودان</option>
                    <option value="الصومال">الصومال</option>
                    <option value="العراق">العراق</option>
                    <option value="الكويت">الكويت</option>
                    <option value="المغرب">المغرب</option>
                    <option value="اليمن">اليمن</option>
                    <option value="تونس">تونس</option>
                    <option value="جزر القمر">جزر القمر</option>
                    <option value="جيبوتي">جيبوتي</option>
                    <option value="سوريا">سوريا</option>
                    <option value="عمان">عمان</option>
                    <option value="فلسطين">فلسطين</option>
                    <option value="قطر">قطر</option>
                    <option value="لبنان">لبنان</option>
                    <option value="ليبيا">ليبيا</option>
                    <option value="موريتانيا">موريتانيا</option>
                    <option disabled>──────────</option>
                    <option value="أستراليا">أستراليا</option>
                    <option value="ألمانيا">ألمانيا</option>
                    <option value="المملكة المتحدة">المملكة المتحدة</option>
                    <option value="الولايات المتحدة">الولايات المتحدة</option>
                    <option value="إيطاليا">إيطاليا</option>
                    <option value="تركيا">تركيا</option>
                    <option value="فرنسا">فرنسا</option>
                    <option value="كندا">كندا</option>
                    <option value="أخرى">أخرى</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">الحالة الاجتماعية</label>
                  <select name="marital_status" required value={formData.marital_status} onChange={handleChange} className={selectClass}>
                    <option value="">اختر الحالة</option>
                    <option value="أعزب/عزباء">أعزب/عزباء</option>
                    <option value="متزوج/ـة">متزوج/ـة</option>
                    <option value="مطلق/ـة">مطلق/ـة</option>
                    <option value="أرمل/ـة">أرمل/ـة</option>
                    <option value="عاقد القران">عاقد القران</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">عدد الأولاد</label>
                  <select name="children_count" required value={formData.children_count} onChange={handleChange} className={selectClass}>
                    <option value="0">بدون أولاد</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7 أو أكثر</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">التدخين</label>
                  <select name="smoker" required value={formData.smoker} onChange={handleChange} className={selectClass}>
                    <option value="">هل تدخن؟</option>
                    <option value="no">لا</option>
                    <option value="yes">نعم</option>
                    <option value="sometimes">أحياناً</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Physical Info */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-semibold text-indigo-700 border-b border-indigo-100 pb-2">البيانات الجسمانية</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">الطول (سم)</label>
                  <select name="height" required value={formData.height} onChange={handleChange} className={selectClass}>
                    <option value="">اختر الطول</option>
                    {Array.from({length: 80}, (_, i) => i + 140).map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">الوزن (كجم)</label>
                  <select name="weight" required value={formData.weight} onChange={handleChange} className={selectClass}>
                    <option value="">اختر الوزن</option>
                    {Array.from({length: 100}, (_, i) => i + 40).map(w => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">لون البشرة</label>
                  <select name="skin_color" required value={formData.skin_color} onChange={handleChange} className={selectClass}>
                    <option value="">اختر لون البشرة</option>
                    <option value="أبيض">أبيض</option>
                    <option value="قمحي">قمحي</option>
                    <option value="أسمر">أسمر</option>
                    <option value="أسود">أسود</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">بنية الجسم</label>
                  <select name="body_type" required value={formData.body_type} onChange={handleChange} className={selectClass}>
                    <option value="">اختر بنية الجسم</option>
                    <option value="نحيف">نحيف</option>
                    <option value="متوسط">متوسط</option>
                    <option value="رياضي">رياضي</option>
                    <option value="ممتلئ">ممتلئ</option>
                    <option value="بدين">بدين</option>
                  </select>
                </div>
                {gender === 'male' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">اللحية</label>
                    <select name="beard" required value={formData.beard} onChange={handleChange} className={selectClass}>
                      <option value="">اختر</option>
                      <option value="yes">نعم، ملتحي</option>
                      <option value="no">لا</option>
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">الحالة الصحية</label>
                  <select name="health_status" required value={formData.health_status} onChange={handleChange} className={selectClass}>
                    <option value="">اختر</option>
                    <option value="سليم الحمد لله">سليم الحمد لله</option>
                    <option value="أعاني من مرض مزمن">أعاني من مرض مزمن</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">وجود إعاقة</label>
                  <select name="disabilities" required value={formData.disabilities} onChange={handleChange} className={selectClass}>
                    <option value="">اختر</option>
                    <option value="لا توجد">لا توجد</option>
                    <option value="توجد إعاقة حركية">توجد إعاقة حركية</option>
                    <option value="توجد إعاقة بصرية">توجد إعاقة بصرية</option>
                    <option value="توجد إعاقة سمعية">توجد إعاقة سمعية</option>
                    <option value="أخرى">أخرى</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Work Info */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-semibold text-indigo-700 border-b border-indigo-100 pb-2">بيانات العمل والمستوى الدخل</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">الوظيفة</label>
                  <input type="text" name="job" required value={formData.job} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-700 dark:bg-slate-800 py-2 px-3 border shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">المهنة</label>
                  <select name="profession" required value={formData.profession} onChange={handleChange} className={selectClass}>
                    <option value="">اختر المهنة</option>
                    <option value="طبيب">طبيب</option>
                    <option value="مهندس">مهندس</option>
                    <option value="معلم">معلم</option>
                    <option value="محاسب">محاسب</option>
                    <option value="محامي">محامي</option>
                    <option value="صيدلي">صيدلي</option>
                    <option value="إعلامي">إعلامي</option>
                    <option value="مبرمج">مبرمج</option>
                    <option value="صاحب عمل">صاحب عمل</option>
                    <option value="موظف حكومي">موظف حكومي</option>
                    <option value="موظف قطاع خاص">موظف قطاع خاص</option>
                    <option value="أعمال حرة">أعمال حرة</option>
                    <option value="طالب">طالب</option>
                    <option value="بدون عمل">بدون عمل</option>
                    <option value="أخرى">أخرى</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">المؤهل</label>
                  <select name="qualification" required value={formData.qualification} onChange={handleChange} className={selectClass}>
                    <option value="">اختر المؤهل</option>
                    <option value="بدون مؤهل">بدون مؤهل</option>
                    <option value="يقرأ ويكتب">يقرأ ويكتب</option>
                    <option value="ابتدائي">ابتدائي</option>
                    <option value="إعدادي">إعدادي</option>
                    <option value="ثانوي">ثانوي</option>
                    <option value="دبلوم">دبلوم</option>
                    <option value="جامعي">جامعي</option>
                    <option value="ماجستير">ماجستير</option>
                    <option value="دكتوراه">دكتوراه</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">مستوى الدخل</label>
                  <select name="income_level" required value={formData.income_level} onChange={handleChange} className={selectClass}>
                    <option value="">اختر مستوى الدخل</option>
                    <option value="ضعيف">ضعيف</option>
                    <option value="متوسط">متوسط</option>
                    <option value="جيد">جيد</option>
                    <option value="ممتاز">ممتاز</option>
                    <option value="لا أرغب في الإفصاح">لا أرغب في الإفصاح</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Religion Info */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-semibold text-indigo-700 border-b border-indigo-100 pb-2">بيانات التدين</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">الالتزام الديني</label>
                  <select name="religious_commitment" required value={formData.religious_commitment} onChange={handleChange} className={selectClass}>
                    <option value="">اختر</option>
                    <option value="ملتزم جداً">ملتزم جداً</option>
                    <option value="ملتزم">ملتزم</option>
                    <option value="متوسط">متوسط</option>
                    <option value="غير ملتزم">غير ملتزم</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">الالتزام بالصلاة</label>
                  <select name="prayer_commitment" required value={formData.prayer_commitment} onChange={handleChange} className={selectClass}>
                    <option value="">اختر</option>
                    <option value="أصلي دائماً">أصلي دائماً</option>
                    <option value="أغلب الأوقات">أغلب الأوقات</option>
                    <option value="متقطع">متقطع</option>
                    <option value="لا أصلي">لا أصلي</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Marriage Info */}
          {step === 5 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-semibold text-indigo-700 border-b border-indigo-100 pb-2">بيانات الارتباط</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">ما رأيك في القايمة؟</label>
                  <select name="qayma_opinion" required value={formData.qayma_opinion} onChange={handleChange} className={selectClass}>
                    <option value="">اختر</option>
                    <option value="موافق عليها">موافق عليها</option>
                    <option value="أرفضها تماماً">أرفضها تماماً</option>
                    <option value="حسب الاتفاق">حسب الاتفاق</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">ما رأيك في الشبكة والمهر؟</label>
                  <select name="mahr_opinion" required value={formData.mahr_opinion} onChange={handleChange} className={selectClass}>
                    <option value="">اختر</option>
                    <option value="ضروري ومهم">ضروري ومهم</option>
                    <option value="حسب الاستطاعة">حسب الاستطاعة (ميسر)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">الميعاد المتوقع للارتباط</label>
                  <select name="marriage_time" required value={formData.marriage_time} onChange={handleChange} className={selectClass}>
                    <option value="">اختر</option>
                    <option value="في أسرع وقت">في أسرع وقت</option>
                    <option value="خلال أشهر">خلال أشهر</option>
                    <option value="خلال سنة">خلال سنة أو أكثر</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">الرؤية الشرعية</label>
                  <select name="roya_opinion" required value={formData.roya_opinion} onChange={handleChange} className={selectClass}>
                    <option value="">اختر</option>
                    <option value="ضرورية في المنزل">ضرورية في المنزل بوجود الأهل</option>
                    <option value="ممكن في مكان عام">ممكن في مكان عام مع الأهل</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Texts & Avatar */}
          {step === 6 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-xl font-semibold text-indigo-700 border-b border-indigo-100 pb-2 mb-4">مواصفات وتفاصيل</h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">الهوايات والاهتمامات</label>
                    <input type="text" name="hobbies" required value={formData.hobbies} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-700 dark:bg-slate-800 py-2 px-3 border shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">مواصفات شريك الحياة (140 حرف كحد أدنى)</label>
                    <textarea name="partner_specs" required value={formData.partner_specs} onChange={handleChange} rows={4} className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-700 dark:bg-slate-800 py-2 px-3 border shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="تحدث بالتفصيل عما تبحث عنه..."></textarea>
                    <div className="text-xs mt-1 flex justify-end">
                      <span className={formData.partner_specs.length < 140 ? "text-red-500 font-medium" : "text-green-600 font-medium"}>
                        {formData.partner_specs.length} / 140
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">نبذة عني (140 حرف كحد أدنى)</label>
                    <textarea name="about_me" required value={formData.about_me} onChange={handleChange} rows={4} className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-700 dark:bg-slate-800 py-2 px-3 border shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="تحدث عن نفسك بالتفصيل..."></textarea>
                    <div className="text-xs mt-1 flex justify-end">
                      <span className={formData.about_me.length < 140 ? "text-red-500 font-medium" : "text-green-600 font-medium"}>
                        {formData.about_me.length} / 140
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-indigo-700 border-b border-indigo-100 pb-2 mb-4 mt-8">الصورة الرمزية (أفاتار)</h2>
                <div className="flex gap-4">
                  {gender === 'male' ? (
                    <>
                      <label className="cursor-pointer relative group">
                        <input type="radio" name="avatar_url" value="avatar1.png" checked={formData.avatar_url === 'avatar1.png'} onChange={handleChange} className="peer sr-only" />
                        <div className="w-16 h-16 rounded-full bg-indigo-50 border-2 border-transparent peer-checked:border-indigo-600 peer-checked:bg-indigo-100 flex items-center justify-center text-3xl transition-all group-hover:scale-105">👨</div>
                        {formData.avatar_url === 'avatar1.png' && <div className="absolute -top-1 -right-1 bg-indigo-600 rounded-full text-white p-0.5"><CheckCircle2 className="w-4 h-4" /></div>}
                      </label>
                      <label className="cursor-pointer relative group">
                        <input type="radio" name="avatar_url" value="avatar_m2.png" checked={formData.avatar_url === 'avatar_m2.png'} onChange={handleChange} className="peer sr-only" />
                        <div className="w-16 h-16 rounded-full bg-indigo-50 border-2 border-transparent peer-checked:border-indigo-600 peer-checked:bg-indigo-100 flex items-center justify-center text-3xl transition-all group-hover:scale-105">🧔</div>
                        {formData.avatar_url === 'avatar_m2.png' && <div className="absolute -top-1 -right-1 bg-indigo-600 rounded-full text-white p-0.5"><CheckCircle2 className="w-4 h-4" /></div>}
                      </label>
                    </>
                  ) : (
                    <>
                      <label className="cursor-pointer relative group">
                        <input type="radio" name="avatar_url" value="avatar2.png" checked={formData.avatar_url === 'avatar2.png'} onChange={handleChange} className="peer sr-only" />
                        <div className="w-16 h-16 rounded-full bg-pink-50 border-2 border-transparent peer-checked:border-pink-600 peer-checked:bg-pink-100 flex items-center justify-center text-3xl transition-all group-hover:scale-105">👩</div>
                        {formData.avatar_url === 'avatar2.png' && <div className="absolute -top-1 -right-1 bg-pink-600 rounded-full text-white p-0.5"><CheckCircle2 className="w-4 h-4" /></div>}
                      </label>
                      <label className="cursor-pointer relative group">
                        <input type="radio" name="avatar_url" value="avatar_f2.png" checked={formData.avatar_url === 'avatar_f2.png'} onChange={handleChange} className="peer sr-only" />
                        <div className="w-16 h-16 rounded-full bg-pink-50 border-2 border-transparent peer-checked:border-pink-600 peer-checked:bg-pink-100 flex items-center justify-center text-3xl transition-all group-hover:scale-105">🧕</div>
                        {formData.avatar_url === 'avatar_f2.png' && <div className="absolute -top-1 -right-1 bg-pink-600 rounded-full text-white p-0.5"><CheckCircle2 className="w-4 h-4" /></div>}
                      </label>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex flex-col gap-4 pt-6 border-t border-slate-100 dark:border-slate-800 mt-8">
            <div className="flex gap-4">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-4 py-2 border border-slate-300 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:bg-slate-950 font-medium transition flex items-center"
                >
                  <ChevronRight className="w-5 h-5 mr-1" />
                  السابق
                </button>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 font-bold transition flex items-center justify-center disabled:bg-indigo-400 text-lg shadow-sm"
              >
                {loading ? 'جاري الحفظ...' : step === totalSteps ? 'إنهاء وحفظ' : 'التالي'}
                {step < totalSteps && <ChevronLeft className="w-5 h-5 ml-1" />}
              </button>
            </div>
            
            {step < totalSteps && (
              <button
                type="button"
                onClick={saveAndExit}
                disabled={loading}
                className="w-full py-3 text-indigo-600 font-semibold rounded-xl bg-indigo-50 hover:bg-indigo-100 transition-colors"
              >
                حفظ التقدم والمتابعة لاحقاً
              </button>
            )}
          </div>
          
        </form>
      </div>
    </div>
  );
}
