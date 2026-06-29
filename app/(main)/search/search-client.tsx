'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { Search, Filter, ArrowLeft, Heart, UserX, UserMinus, Star } from 'lucide-react';

export default function SearchClient({ targetGender, isPremium }: { targetGender: string, isPremium: boolean }) {
  const supabase = createClient();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Filters
  const [ageRange, setAgeRange] = useState({ min: 18, max: 60 });
  const [nationality, setNationality] = useState('');
  const [residence, setResidence] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [sortBy, setSortBy] = useState('created_at');

  const handleSearch = async () => {
    setLoading(true);
    let query = supabase
      .from('profiles')
      .select('id, username, age, residence, marital_status, avatar_url, is_premium, created_at')
      .eq('gender', targetGender)
      .gte('age', ageRange.min)
      .lte('age', ageRange.max);

    if (nationality) query = query.eq('nationality', nationality);
    if (residence) query = query.eq('residence', residence);
    if (maritalStatus) query = query.eq('marital_status', maritalStatus);

    if (sortBy === 'created_at') query = query.order('created_at', { ascending: false });
    if (sortBy === 'age_asc') query = query.order('age', { ascending: true });
    if (sortBy === 'age_desc') query = query.order('age', { ascending: false });

    // In a real app, you'd filter out ignored/blocked users here

    const { data, error } = await query.limit(20);
    
    if (data) setResults(data);
    setLoading(false);
  };

  useEffect(() => {
    handleSearch();
  }, []);

  const selectClass = "block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 bg-white border";

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Filters Sidebar */}
      <div className="w-full md:w-64 space-y-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center">
            <Filter className="h-4 w-4 mr-2" /> بحث سريع
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">السن (من - إلى)</label>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  value={ageRange.min} 
                  onChange={e => setAgeRange({...ageRange, min: parseInt(e.target.value) || 18})}
                  className="w-full rounded-md border-gray-300 py-1.5 px-3 text-sm border"
                />
                <input 
                  type="number" 
                  value={ageRange.max} 
                  onChange={e => setAgeRange({...ageRange, max: parseInt(e.target.value) || 60})}
                  className="w-full rounded-md border-gray-300 py-1.5 px-3 text-sm border"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">الجنسية</label>
              <select value={nationality} onChange={e => setNationality(e.target.value)} className={selectClass}>
                <option value="">الكل</option>
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
              <label className="block text-xs font-medium text-gray-500 mb-1">الإقامة</label>
              <select value={residence} onChange={e => setResidence(e.target.value)} className={selectClass}>
                <option value="">الكل</option>
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
              <label className="block text-xs font-medium text-gray-500 mb-1">الحالة الاجتماعية</label>
              <select value={maritalStatus} onChange={e => setMaritalStatus(e.target.value)} className={selectClass}>
                <option value="">الكل</option>
                <option value="أعزب/عزباء">أعزب/عزباء</option>
                <option value="متزوج/ـة">متزوج/ـة</option>
                <option value="مطلق/ـة">مطلق/ـة</option>
                <option value="أرمل/ـة">أرمل/ـة</option>
                <option value="عاقد القران">عاقد القران</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">ترتيب النتائج</label>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className={selectClass}>
                <option value="created_at">الأحدث تسجيلاً</option>
                <option value="age_asc">الأصغر سناً</option>
                <option value="age_desc">الأكبر سناً</option>
              </select>
            </div>

            <button
              onClick={handleSearch}
              className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white font-medium text-sm hover:bg-indigo-700 transition"
            >
              بحث
            </button>
          </div>
        </div>
      </div>

      {/* Results Area */}
      <div className="flex-1">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div>
            <div className="mb-4 text-sm text-slate-500">
              تم العثور على {results.length} نتيجة
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {results.map((profile) => (
                <div key={profile.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition flex flex-col">
                  <div className="h-40 bg-slate-100 flex flex-col items-center justify-center relative">
                    <span className="text-5xl">{profile.avatar_url?.includes('avatar') ? '👤' : '📸'}</span>
                    {profile.is_premium && (
                      <div className="absolute top-2 right-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center">
                        <Star className="h-3 w-3 mr-1 fill-current" /> متميز
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="font-bold text-slate-900 truncate flex items-center justify-between">
                      {profile.username || 'عضو'}
                      <span className="text-xs text-slate-500 font-normal">#{profile.id.substring(0, 5)}</span>
                    </div>
                    <div className="text-sm text-slate-600 mt-2 space-y-1">
                      <div>{profile.age} سنة • {profile.residence}</div>
                      <div>{profile.maritalStatus}</div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                      <Link 
                        href={`/profile/${profile.id}`}
                        className="flex-1 text-center bg-indigo-50 text-indigo-700 hover:bg-indigo-100 py-1.5 rounded-md text-sm font-medium transition"
                      >
                        عرض الملف
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
              
              {results.length === 0 && (
                <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-xl border border-slate-100">
                  لا توجد نتائج تطابق بحثك. جرب تغيير فلاتر البحث.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
