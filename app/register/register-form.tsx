'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Sign up with Supabase
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          phone,
        }
      }
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (!data.session) {
      setError('تم التسجيل بنجاح. يرجى مراجعة بريدك الإلكتروني لتفعيل الحساب قبل تسجيل الدخول.');
      setLoading(false);
      return;
    }

    router.push('/onboarding/mithaq');
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleRegister}>
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}
      <div className="space-y-4 rounded-md shadow-sm">
        <div>
          <label htmlFor="email-address" className="sr-only">البريد الإلكتروني</label>
          <input
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="relative block w-full appearance-none rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            placeholder="البريد الإلكتروني"
          />
        </div>
        <div>
          <label htmlFor="phone" className="sr-only">رقم الموبايل</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="relative block w-full appearance-none rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            placeholder="رقم الموبايل (للتحقق)"
          />
        </div>
        <div>
          <label htmlFor="password" className="sr-only">كلمة المرور</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="relative block w-full appearance-none rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            placeholder="كلمة المرور"
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400"
        >
          {loading ? 'جاري التسجيل...' : 'تسجيل حساب جديد'}
        </button>
      </div>
      <div className="text-center text-sm">
        <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
          لديك حساب بالفعل؟ سجل دخولك
        </Link>
      </div>
    </form>
  );
}
