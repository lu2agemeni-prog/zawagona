import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Search, Star, Users, ArrowLeft } from '@/components/my-icons';
import Link from 'next/link';
import { cookies } from 'next/headers';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  
  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data?.user;
  } catch (err) {
    console.error('Supabase auth error:', err);
  }
  
  if (!user) {
    redirect('/login');
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">لوحة التحكم</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center space-y-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
            <Search className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800">البحث</h2>
          <Link href="/search" className="text-primary-600 hover:underline">
            ابحث عن شريك
          </Link>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center space-y-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
            <Star className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800">المميزات</h2>
          <Link href="/premium" className="text-amber-600 hover:underline">
            ترقية الحساب
          </Link>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center space-y-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800">المهتمين بي</h2>
          <Link href="/interested-in-me" className="text-emerald-600 hover:underline">
            عرض القائمة
          </Link>
        </div>
      </div>
    </div>
  );
}
