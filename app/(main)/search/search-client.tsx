'use client';
import { useState } from 'react';
import { Search, Filter, Heart, UserX, Star } from '@/components/my-icons';
import Link from 'next/link';

export default function SearchClient({ initialProfiles, currentUserId }: { initialProfiles: any[], currentUserId: string }) {
  const [profiles, setProfiles] = useState(initialProfiles);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Advanced filters state
  const [filters, setFilters] = useState({
    marital_status: '',
    religious_commitment: '',
  });

  const filteredProfiles = profiles.filter(p => {
    const matchSearch = p.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || p.about_me?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchMarital = filters.marital_status ? p.marital_status === filters.marital_status : true;
    const matchReligious = filters.religious_commitment ? p.religious_commitment === filters.religious_commitment : true;
    
    return matchSearch && matchMarital && matchReligious;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">الحالة الاجتماعية</label>
            <select 
              value={filters.marital_status}
              onChange={(e) => setFilters({...filters, marital_status: e.target.value})}
              className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            >
              <option value="">الكل</option>
              <option value="عازب/عزباء">عازب/عزباء</option>
              <option value="متزوج/ة">متزوج/ة</option>
              <option value="مطلق/ة">مطلق/ة</option>
              <option value="أرمل/ة">أرمل/ة</option>
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
              <option value="ملتزم/ة">ملتزم/ة</option>
              <option value="متوسط/ة">متوسط/ة</option>
              <option value="غير ملتزم/ة">غير ملتزم/ة</option>
            </select>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProfiles.map((profile) => (
          <Link href={`/profile/${profile.id}`} key={profile.id}>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col group">
              <div className="h-48 bg-slate-200 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-slate-400 bg-slate-100 group-hover:scale-105 transition-transform duration-500">
                  <span className="text-4xl">{profile.full_name?.charAt(0) || '?'}</span>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-slate-900 line-clamp-1">{profile.full_name}</h3>
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
        ))}
      </div>

      {filteredProfiles.length === 0 && (
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
