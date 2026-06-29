import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import RegisterForm from './register-form';

export default async function RegisterPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-sm border border-slate-100">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">
            إنشاء حساب جديد
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            خطوتك الأولى نحو زواج إسلامي ناجح
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
