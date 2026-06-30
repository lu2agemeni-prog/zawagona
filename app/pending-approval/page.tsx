import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function PendingApprovalPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_approved, is_admin')
    .eq('id', session.user.id)
    .single();

  if (profile?.is_approved || profile?.is_admin) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
          ⏳
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-4">حسابك قيد المراجعة</h1>
        <p className="text-slate-600 mb-6 leading-relaxed">
          شكراً لتسجيلك وإكمال بياناتك. تقوم الإدارة حالياً بمراجعة ملفك الشخصي للتأكد من جديته ومطابقته للشروط.
        </p>
        <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-500 mb-6">
          يرجى الانتظار، سيتم تفعيل حسابك قريباً.
        </div>
        <Link href="/onboarding/profile" className="text-indigo-600 hover:underline font-medium text-sm">
          مراجعة أو تعديل بياناتي
        </Link>
      </div>
    </div>
  );
}
