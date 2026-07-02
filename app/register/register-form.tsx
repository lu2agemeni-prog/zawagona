'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Mail, Lock, Phone } from '@/components/my-icons';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صالح'),
  phone: z.string().min(8, 'رقم الجوال يجب أن يتكون من 8 أرقام على الأقل'),
  password: z.string().min(8, 'كلمة المرور يجب أن تتكون من 8 أحرف على الأقل'),
});

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
    
    const result = registerSchema.safeParse({ email, phone, password });
    if (!result.success) {
      setError(result.error.issues[0].message);
      setLoading(false);
      return;
    }

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
        <div className="rounded-xl bg-red-50 p-4 border border-red-100">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}
      <div className="space-y-4">
        <div className="relative">
          <label htmlFor="email-address" className="sr-only">البريد الإلكتروني</label>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
            <Mail className="h-5 w-5" />
          </div>
          <input
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full rounded-xl border border-slate-200 py-3 pr-10 pl-3 text-slate-900 placeholder-slate-400 focus:border-primary-500 focus:ring-primary-500 sm:text-sm transition-colors bg-surface-50"
            placeholder="البريد الإلكتروني"
          />
        </div>
        <div className="relative">
          <label htmlFor="phone" className="sr-only">رقم الموبايل</label>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
            <Phone className="h-5 w-5" />
          </div>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="block w-full rounded-xl border border-slate-200 py-3 pr-10 pl-3 text-slate-900 placeholder-slate-400 focus:border-primary-500 focus:ring-primary-500 sm:text-sm transition-colors bg-surface-50"
            placeholder="رقم الموبايل"
          />
        </div>
        <div className="relative">
          <label htmlFor="password" className="sr-only">كلمة المرور</label>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
            <Lock className="h-5 w-5" />
          </div>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full rounded-xl border border-slate-200 py-3 pr-10 pl-3 text-slate-900 placeholder-slate-400 focus:border-primary-500 focus:ring-primary-500 sm:text-sm transition-colors bg-surface-50"
            placeholder="كلمة المرور"
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="group relative flex w-full justify-center items-center rounded-xl border border-transparent bg-primary-600 py-3 px-4 text-sm font-bold text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:bg-primary-400 transition-all active:scale-[0.98] shadow-sm hover:shadow"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
              جاري التسجيل...
            </>
          ) : (
            'تسجيل حساب جديد'
          )}
        </button>
      </div>
      <div className="text-center text-sm mt-4">
        <Link href="/login" className="font-medium text-primary-600 hover:text-primary-700 transition-colors">
          لديك حساب بالفعل؟ سجل دخولك
        </Link>
      </div>
    </form>
  );
}
