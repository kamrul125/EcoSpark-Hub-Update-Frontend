import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import API from '../../utils/api';
import { loginSchema, type LoginFormValues } from '../../utils/auth';

export default function Login() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const submitLogin = async (values: LoginFormValues) => {
    try {
      const res = await API.post('/auth/login', values);

      if (res.data.status === 'success' && res.data.data) {
        const { token, user } = res.data.data;
        localStorage.setItem('token', token);
        localStorage.setItem('accessToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        window.dispatchEvent(new Event('local-storage'));

        toast.success('Logged in successfully. Redirecting…');

        setTimeout(() => {
          if (user.role === 'ADMIN') {
            router.push('/dashboard/admin');
          } else {
            router.push('/dashboard/member');
          }
        }, 700);
      } else {
        toast.error(res.data.message || 'Login failed. Please try again.');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  const handleGoogleLogin = () => {
    toast.success('Google Sign-in initiated (Mock Flow)');
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans">
      <div className="flex flex-1 items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-[32px] border border-slate-200 bg-white p-10 shadow-2xl shadow-emerald-200/30"
        >
          <div className="mb-8 text-center">
            <p className="mb-3 text-sm uppercase tracking-[0.35em] text-emerald-600">Secure login</p>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">
              Welcome back <span className="text-emerald-600">again</span>
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Sign in to access your dashboard, ideas, and smart workflows.
            </p>
          </div>


          <button
            type="button"
            onClick={handleGoogleLogin}
            className="mb-6 inline-flex w-full items-center justify-center gap-3 rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50"
            disabled={isSubmitting}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.5 12.23c0-.88-.08-1.72-.24-2.53H12v4.78h5.82c-.25 1.38-1.02 2.55-2.17 3.34v2.78h3.5c2.04-1.88 3.22-4.68 3.22-8.37Z" fill="#4285F4" />
              <path d="M12 22.5c2.94 0 5.4-.96 7.2-2.6l-3.5-2.78c-.97.65-2.2 1.03-3.7 1.03-2.85 0-5.27-1.93-6.13-4.5H2.16v2.82C3.96 19.95 7.7 22.5 12 22.5Z" fill="#34A853" />
              <path d="M5.87 13.65a7.35 7.35 0 0 1 0-3.29V7.54H2.16a10.98 10.98 0 0 0 0 8.92l3.71-2.81Z" fill="#FBBC05" />
              <path d="M12 5.5c1.6 0 3.04.55 4.18 1.63l3.14-3.14C17.4 2.24 14.94 1.5 12 1.5 7.7 1.5 3.96 4.05 2.16 7.54l3.71 2.82C6.73 7.43 9.15 5.5 12 5.5Z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          <form className="space-y-5" onSubmit={handleSubmit(submitLogin)} noValidate>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Email address</span>
              <input
                type="email"
                {...register('email')}
                disabled={isSubmitting}
                className={`w-full rounded-3xl border p-4 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 ${
                  errors.email ? 'border-rose-300 bg-rose-50' : 'border-slate-200 bg-slate-50'
                }`}
                placeholder="you@example.com"
                aria-invalid={Boolean(errors.email)}
              />
              {errors.email ? <p className="mt-2 text-sm text-rose-600">{errors.email.message}</p> : null}
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Password</span>
              <input
                type="password"
                {...register('password')}
                disabled={isSubmitting}
                className={`w-full rounded-3xl border p-4 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 ${
                  errors.password ? 'border-rose-300 bg-rose-50' : 'border-slate-200 bg-slate-50'
                }`}
                placeholder="Enter your password"
                aria-invalid={Boolean(errors.password)}
              />
              {errors.password ? <p className="mt-2 text-sm text-rose-600">{errors.password.message}</p> : null}
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-3 rounded-3xl bg-emerald-600 px-5 py-4 text-sm font-black uppercase tracking-[0.25em] text-white shadow-xl transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Logging in...
                </>
              ) : (
                'Login Now'
              )}
            </button>
          </form>

          <div className="pt-8 mt-10 text-center border-t border-slate-100">
            <p className="text-sm font-semibold text-slate-500">
              Don&apos;t have an account?{' '}
              <Link href="/auth/signup" className="font-black text-emerald-600 hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
