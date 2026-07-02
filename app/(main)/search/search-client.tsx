'use client';
import { useState, useEffect, useRef } from 'react';
import { Search, Filter, Heart, UserX, Star, Save, BellRing } from '@/components/my-icons';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { MARITAL_STATUS_OPTIONS, RELIGIOUS_COMMITMENT_OPTIONS } from '@/lib/constants';

export default function SearchClient({ initialProfiles, currentUserId, currentUserProfile }: { initialProfiles: any[], currentUserId: string, currentUserProfile: any }) {
  const supabase = createClient();
  const [profiles, setProfiles] = useState(initialProfiles);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(initialProfiles.length >= 20);
  
  // Advanced filters state
  const [filters, setFilters] = useState({
    marital_status: '',
    religious_commitment: '',
  });
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const savedFilters = localStorage.getItem('saved_search_filters');
    if (savedFilters) {
      try {
        const parsed = JSON.parse(savedFilters);
        setTimeout(() => {
          setFilters(parsed);
          setShowNotification(true);
        }, 1500);
      } catch (e) {}
    }
  }, []);

  const saveFilters = () => {
    localStorage.setItem('saved_search_filters', JSON.stringify(filters));
    alert('تم حفظ معايير البحث بنجاح!');
  };

  const calculateCompatibility = (profile: any) => {
    let score = 50; 
    let matchCount = 0;
    let filterCount = 0;

    if (filters.marital_status) {
      filterCount++;
      if (profile.marital_status === filters.marital_status) matchCount++;
    }
    if (filters.religious_commitment) {
      filterCount++;
      if (profile.religious_commitment === filters.religious_commitment) matchCount++;
    }
    
    if (filterCount > 0) {
       return Math.min(100, Math.round((matchCount / filterCount) * 40 + 60));
    }

    if (currentUserProfile) {
      if (profile.religious_commitment === currentUserProfile.religious_commitment) score += 20;
      if (profile.qualification === currentUserProfile.qualification) score += 10;
      if (profile.marital_status === currentUserProfile.marital_status) score += 10;
    }
    return Math.min(100, score);
  };

  const observerTarget = useRef<HTMLDivElement>(null);

  const loadMoreProfiles = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    
    let query = supabase
      .from('profiles')
      .select('*')
      .neq('id', currentUserId);

    if (filters.marital_status) {
      query = query.eq('marital_status', filters.marital_status);
    }
    if (filters.religious_commitment) {
      query = query.eq('religious_commitment', filters.religious_commitment);
    }
    if (searchQuery) {
      query = query.or(`display_name.ilike.%${searchQuery}%,username.ilike.%${searchQuery}%,about_me.ilike.%${searchQuery}%`);
    }

    const { data } = await query.range(page * 20, (page + 1) * 20 - 1);

    if (data && data.length > 0) {
      setProfiles(prev => {
        const newProfiles = data.filter(d => !prev.find((p: any) => p.id === d.id));
        return [...prev, ...newProfiles];
      });
      setPage(p => p + 1);
      if (data.length < 20) setHasMore(false);
    } else {
      setHasMore(false);
    }
    setLoadingMore(false);
  };

  useEffect(() => {
    const target = observerTarget.current;
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loadingMore && hasMore) {
          loadMoreProfiles();
        }
      },
      { threshold: 0.1 }
    );

    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [loadingMore, hasMore, page, filters, searchQuery]);

  // Handle filter changes (reset pagination and fetch)
  useEffect(() => {
    let isMounted = true;
    const fetchFiltered = async () => {
      setLoadingMore(true);
      let query = supabase
        .from('profiles')
        .select('*')
        .neq('id', currentUserId);

      if (filters.marital_status) {
        query = query.eq('marital_status', filters.marital_status);
      }
      if (filters.religious_commitment) {
        query = query.eq('religious_commitment', filters.religious_commitment);
      }
      if (searchQuery) {
        query = query.or(`display_name.ilike.%${searchQuery}%,username.ilike.%${searchQuery}%,about_me.ilike.%${searchQuery}%`);
      }

      const { data } = await query.limit(20);
      
      if (isMounted) {
        setProfiles(data || []);
        setPage(1);
        setHasMore(data?.length === 20);
        setLoadingMore(false);
      }
    };

    // Skip initial render if no filters/search
    if (searchQuery || filters.marital_status || filters.religious_commitment) {
      const timeout = setTimeout(() => {
        fetchFiltered();
      }, 500);
      return () => {
        isMounted = false;
        clearTimeout(timeout);
      };
    } else {
      // Don't call setState synchronously in an effect
      queueMicrotask(() => {
        if (isMounted) {
          setProfiles(initialProfiles);
          setPage(1);
          setHasMore(initialProfiles.length >= 20);
        }
      });
      return () => {
        isMounted = false;
      };
    }
  }, [filters, searchQuery, currentUserId, initialProfiles, supabase]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {showNotification && (
        <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-start gap-3 relative">
          <div className="bg-indigo-100 p-2 rounded-full text-indigo-600 flex-shrink-0">
            <BellRing className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-indigo-900 text-sm">تطابق ذكي جديد!</h4>
            <p className="text-indigo-700 text-xs mt-1">يوجد أعضاء جدد يطابقون تماماً معايير البحث المحفوظة الخاصة بك.</p>
          </div>
          <button onClick={() => setShowNotification(false)} className="absolute left-4 top-4 text-indigo-400 hover:text-indigo-600">✕</button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="ابحث بالاسم أو المواصفات..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
        </div>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-3 border rounded-xl transition-colors flex items-center justify-center gap-2 ${showFilters ? 'bg-primary-50 text-primary-600 border-primary-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
        >
          <Filter className="w-5 h-5" />
          <span>تصفية متقدمة</span>
        </button>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">الحالة الاجتماعية</label>
              <select 
                value={filters.marital_status}
                onChange={(e) => setFilters({...filters, marital_status: e.target.value})}
                className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              >
                <option value="">الكل</option>
                {MARITAL_STATUS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">الالتزام الديني</label>
              <select 
                value={filters.religious_commitment}
                onChange={(e) => setFilters({...filters, religious_commitment: e.target.value})}
                className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              >
                <option value="">الكل</option>
                {RELIGIOUS_COMMITMENT_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end pt-2 border-t border-slate-100">
            <button 
              onClick={saveFilters}
              className="flex items-center gap-2 text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors bg-primary-50 hover:bg-primary-100 px-4 py-2 rounded-lg"
            >
              <Save className="w-4 h-4" />
              حفظ معايير البحث
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.map((profile) => {
          const compScore = calculateCompatibility(profile);
          return (
          <Link href={`/profile/${profile.id}`} key={profile.id}>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col group relative">
              
              {/* Compatibility Badge */}
              <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur shadow-sm px-2 py-1 rounded-full flex items-center gap-1 text-xs font-bold text-indigo-700">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                تطابق {compScore}%
              </div>

              <div className="h-48 bg-slate-200 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-slate-400 bg-slate-100 group-hover:scale-105 transition-transform duration-500">
                  <span className="text-4xl">{(profile.display_name || profile.username)?.charAt(0) || '?'}</span>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-slate-900 line-clamp-1">{profile.display_name || profile.username || 'عضو'}</h3>
                  {profile.is_premium && (
                    <div className="flex gap-1 text-amber-500">
                      <Star className="w-5 h-5 fill-amber-500" />
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {profile.age && <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md">{profile.age}</span>}
                  {profile.marital_status && <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md">{profile.marital_status}</span>}
                  {profile.residence && <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md">{profile.residence}</span>}
                </div>

                <div className="text-sm text-slate-500 mb-4 flex-1 line-clamp-2">
                  {profile.about_me || 'لم يتم كتابة نبذة شخصية بعد.'}
                </div>
                <div className="flex gap-2 mt-auto">
                  <button 
                    onClick={(e) => { e.preventDefault(); /* Optimistic Like Action */ }}
                    className="flex-1 py-2 bg-primary-50 text-primary-600 rounded-lg text-sm font-medium hover:bg-primary-100 transition-colors flex justify-center items-center gap-1"
                  >
                    <Heart className="w-4 h-4" /> إعجاب
                  </button>
                  <button 
                    onClick={(e) => { e.preventDefault(); }}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <UserX className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </Link>
        )})}
      </div>
      
      {hasMore && (
        <div ref={observerTarget} className="flex justify-center p-4">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {profiles.length === 0 && !loadingMore && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 animate-in fade-in">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-medium text-slate-900 mb-2">لا توجد نتائج</h3>
          <p className="text-slate-500">لم يتم العثور على أعضاء يطابقون بحثك المتطور.</p>
        </div>
      )}
    </div>
  );
}
