import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import API from '../../utils/api';
import { signupSchema, type SignupFormValues } from '../../utils/auth';

export default function Signup() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const submitSignup = async (values: SignupFormValues) => {
    try {
      const res = await API.post('/auth/register', values);
      if (res.data.status === 'success') {
        toast.success('Registration successful. Redirecting to login…');
        setTimeout(() => {
          router.push('/auth/login');
        }, 700);
      } else {
        toast.error(res.data.message || 'Registration failed. Please try again.');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
      console.error('Signup Error:', err.response?.data || err.message);
    }
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
            <p className="mb-3 text-sm uppercase tracking-[0.35em] text-emerald-600">Create account</p>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">
              Join <span className="text-emerald-600">EcoSpark</span>
            </h1>
            <p className="mt-2 text-sm text-slate-500">Register a secure account to manage ideas, votes, and community activity.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(submitSignup)} noValidate>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Full name</span>
              <input
                type="text"
                {...register('name')}
                disabled={isSubmitting}
                className={`w-full rounded-3xl border p-4 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 ${
                  errors.name ? 'border-rose-300 bg-rose-50' : 'border-slate-200 bg-slate-50'
                }`}
                placeholder="Your full name"
                aria-invalid={Boolean(errors.name)}
              />
              {errors.name ? <p className="mt-2 text-sm text-rose-600">{errors.name.message}</p> : null}
            </label>

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
                placeholder="Create a strong password"
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
                  Creating Account...
                </>
              ) : (
                'Sign Up Now'
              )}
            </button>
          </form>

          <div className="pt-8 mt-10 text-center border-t border-slate-100">
            <p className="text-sm font-semibold text-slate-500">
              Already have an account?{' '}
              <Link href="/auth/login" className="font-black text-emerald-600 hover:underline">
                Login Here
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
