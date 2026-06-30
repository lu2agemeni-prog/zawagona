'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { Search, Filter, ArrowLeft, Heart, UserX, UserMinus, Star, User, Image as ImageIcon, SearchX, Loader2 } from '@/components/icons';

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
  
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const itemsPerPage = 20;

  const handleSearch = async (pageNum = 1) => {
    setLoading(true);

    // 1. Fetch blocked/ignored ids
    const { data: authData } = await supabase.auth.getUser();
    const currentUserId = authData.user?.id;
    
    let excludeIds: string[] = currentUserId ? [currentUserId] : [];
    
    if (currentUserId) {
      // Exclude ignored/blocked by me
      const { data: ignoredData } = await supabase
        .from('interests')
        .select('target_user_id')
        .eq('user_id', currentUserId)
        .in('status', ['ignore', 'block']);
        
      if (ignoredData) {
        excludeIds = [...excludeIds, ...ignoredData.map(i => i.target_user_id)];
      }
      
      // Exclude users who blocked me
      const { data: blockedByData } = await supabase
        .from('interests')
        .select('user_id')
        .eq('target_user_id', currentUserId)
        .eq('status', 'block');
        
      if (blockedByData) {
        excludeIds = [...excludeIds, ...blockedByData.map(i => i.user_id)];
      }
    }

    let query = supabase
      .from('profiles')
      .select('id, username, age, residence, marital_status, avatar_url, is_premium, created_at, is_approved', { count: 'exact' })
      .eq('gender', targetGender)
      .eq('is_approved', true)
      .gte('age', ageRange.min)
      .lte('age', ageRange.max);

    if (excludeIds.length > 0) {
      query = query.not('id', 'in', `(${excludeIds.join(',')})`);
    }

    if (nationality) query = query.eq('nationality', nationality);
    if (residence) query = query.eq('residence', residence);
    if (maritalStatus) query = query.eq('marital_status', maritalStatus);

    if (sortBy === 'created_at') query = query.order('created_at', { ascending: false });
    if (sortBy === 'age_asc') query = query.order('age', { ascending: true });
    if (sortBy === 'age_desc') query = query.order('age', { ascending: false });

    const from = (pageNum - 1) * itemsPerPage;
    const to = from + itemsPerPage - 1;

    const { data, count, error } = await query.range(from, to);
    
    if (data) {
      if (pageNum === 1) {
        setResults(data);
      } else {
        setResults(prev => [...prev, ...data]);
      }
      setHasMore(count !== null ? from + data.length < count : false);
      setPage(pageNum);
    }
    setLoading(false);
  };

  const handleLoadMore = () => {
    handleSearch(page + 1);
  };

  useEffect(() => {
    handleSearch(1);
  }, []);

  const selectClass = "block w-full rounded-xl border-slate-200 py-2.5 pl-3 pr-10 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-surface-50 border transition-colors";

  return (
    <div className="flex flex-col md:flex-row gap-6 animate-in fade-in duration-500">
      {/* Filters Sidebar */}
      <div className="w-full md:w-72 space-y-6 flex-shrink-0">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-black text-slate-800 mb-5 flex items-center text-lg">
            <Filter className="h-5 w-5 mr-2 text-primary-600" /> فلترة البحث
          </h3>
          
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2">السن (من - إلى)</label>
              <div className="flex gap-3">
                <input 
                  type="number" 
                  value={ageRange.min} 
                  onChange={e => setAgeRange({...ageRange, min: parseInt(e.target.value) || 18})}
                  className="w-full rounded-xl border-slate-200 py-2.5 px-3 text-sm border bg-surface-50 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                />
                <input 
                  type="number" 
                  value={ageRange.max} 
                  onChange={e => setAgeRange({...ageRange, max: parseInt(e.target.value) || 60})}
                  className="w-full rounded-xl border-slate-200 py-2.5 px-3 text-sm border bg-surface-50 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2">الجنسية</label>
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
              <label className="block text-xs font-bold text-slate-600 mb-2">الإقامة</label>
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
              <label className="block text-xs font-bold text-slate-600 mb-2">الحالة الاجتماعية</label>
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
              <label className="block text-xs font-bold text-slate-600 mb-2">ترتيب النتائج</label>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className={selectClass}>
                <option value="created_at">الأحدث تسجيلاً</option>
                <option value="age_asc">الأصغر سناً</option>
                <option value="age_desc">الأكبر سناً</option>
              </select>
            </div>

            <button
              onClick={() => handleSearch(1)}
              className="w-full rounded-xl bg-primary-600 px-4 py-3 text-white font-bold text-sm hover:bg-primary-700 hover:shadow-md transition-all active:scale-[0.98]"
            >
              بحث
            </button>
          </div>
        </div>
      </div>

      {/* Results Area */}
      <div className="flex-1">
        {loading && page === 1 ? (
          <div className="flex flex-col justify-center items-center h-64 text-primary-600">
            <Loader2 className="animate-spin h-10 w-10 mb-4" />
            <span className="font-medium">جاري البحث...</span>
          </div>
        ) : (
          <div>
            <div className="mb-4 text-sm font-medium text-slate-500 bg-white inline-block px-4 py-1.5 rounded-full border border-slate-100 shadow-sm">
              تم العثور على <span className="font-bold text-primary-600">{results.length}</span> نتيجة
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
              {results.map((profile, idx) => (
                <div key={profile.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg hover:border-primary-100 hover:-translate-y-1 transition-all duration-300 flex flex-col group animate-in zoom-in-95 fill-mode-both" style={{ animationDelay: `${idx * 50}ms` }}>
                  <div className="h-44 bg-surface-50 flex flex-col items-center justify-center relative group-hover:bg-primary-50/50 transition-colors">
                    {profile.avatar_url?.includes('avatar') ? (
                      <User className="w-16 h-16 text-slate-300 group-hover:text-primary-300 transition-colors" />
                    ) : (
                      <ImageIcon className="w-16 h-16 text-slate-300 group-hover:text-primary-300 transition-colors" />
                    )}
                    {profile.is_premium && (
                      <div className="absolute top-3 right-3 bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center shadow-sm">
                        <Star className="h-3 w-3 mr-1 fill-current" /> متميز
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="font-bold text-slate-900 truncate flex items-center justify-between group-hover:text-primary-700 transition-colors">
                      {profile.username || 'عضو'}
                      <span className="text-xs text-slate-400 font-normal">#{profile.id.substring(0, 5)}</span>
                    </div>
                    <div className="text-sm font-medium text-slate-600 mt-3 space-y-1.5">
                      <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-slate-200 ml-2"></span>{profile.age} سنة • {profile.residence}</div>
                      <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-slate-200 ml-2"></span>{profile.marital_status}</div>
                    </div>
                    <div className="mt-5 pt-4 border-t border-slate-50 flex items-center justify-between gap-2">
                      <Link 
                        href={`/profile/${profile.id}`}
                        className="flex-1 text-center bg-primary-50 text-primary-700 hover:bg-primary-100 py-2.5 rounded-xl text-sm font-bold transition-colors"
                      >
                        عرض الملف
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
              
              {results.length === 0 && !loading && (
                <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-dashed border-slate-200 shadow-sm">
                  <div className="w-20 h-20 bg-surface-50 rounded-full flex items-center justify-center mb-5">
                    <SearchX className="w-10 h-10 text-slate-400" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-800 mb-2">لا توجد نتائج تطابق بحثك</h4>
                  <p className="text-sm font-medium text-slate-500 max-w-sm">جرب تغيير فلاتر البحث أو توسيع النطاق العمري للحصول على نتائج أكثر.</p>
                </div>
              )}
            </div>
            
            {hasMore && results.length > 0 && (
              <div className="mt-10 flex justify-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="px-8 py-3 bg-white border border-primary-200 text-primary-700 rounded-full font-bold hover:bg-primary-50 hover:shadow-md transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <><Loader2 className="animate-spin h-5 w-5" /> جاري التحميل...</>
                  ) : (
                    'عرض المزيد'
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
