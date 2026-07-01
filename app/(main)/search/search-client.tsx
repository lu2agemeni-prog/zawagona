'use client';

import { useState } from 'react';
import { Search, Filter, Heart, UserX, Star } from '@/components/my-icons';
import Link from 'next/link';

export default function SearchClient({ initialProfiles, currentUserId }: { initialProfiles: any[], currentUserId: string }) {
  const [profiles, setProfiles] = useState(initialProfiles);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProfiles = profiles.filter(p => 
    p.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.about_me?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex gap-4 mb-6">
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
        <button className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2">
          <Filter className="w-5 h-5" />
          <span className="hidden sm:inline">تصفية</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProfiles.map((profile) => (
          <Link href={`/profile/${profile.id}`} key={profile.id}>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
              <div className="h-48 bg-slate-200 relative">
                {/* Fallback avatar if no photo */}
                <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                  <span className="text-4xl">{profile.full_name?.charAt(0) || '?'}</span>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-slate-900 line-clamp-1">{profile.full_name}</h3>
                  <div className="flex gap-1 text-slate-400">
                    <Star className="w-5 h-5 hover:text-amber-400 transition-colors" />
                  </div>
                </div>
                <div className="text-sm text-slate-500 mb-4 flex-1 line-clamp-2">
                  {profile.about_me || 'لم يتم كتابة نبذة شخصية بعد.'}
                </div>
                <div className="flex gap-2 mt-auto">
                  <button className="flex-1 py-2 bg-primary-50 text-primary-600 rounded-lg text-sm font-medium hover:bg-primary-100 transition-colors flex justify-center items-center gap-1">
                    <Heart className="w-4 h-4" /> إعجاب
                  </button>
                  <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                    <UserX className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredProfiles.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-medium text-slate-900 mb-2">لا توجد نتائج</h3>
          <p className="text-slate-500">لم يتم العثور على أعضاء يطابقون بحثك.</p>
        </div>
      )}
    </div>
  );
}
