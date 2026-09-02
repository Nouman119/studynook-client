'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, User, Mail, Image as ImageIcon, Lock, ArrowRight } from 'lucide-react';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { login, checkUserStatus, googleLogin } = useAuth() || {};

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    photoURL: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // সাধারণ ইমেইল-পাসওয়ার্ড দিয়ে রেজিস্ট্রেশন হ্যান্ডলার
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    // পাসওয়ার্ড ভ্যালিডেশন (কমপক্ষে ৬ ডিজিট)
    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    try {
      const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const baseUrl = rawUrl.replace(/\/api\/?$/, '').replace(/\/+$/, '');

      const res = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMessage('Registration successful! Redirecting to login...');
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      } else {
        setErrorMessage(data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setErrorMessage('Something went wrong. Please check your network.');
    } finally {
      setLoading(false);
    }
  };

  // গুগল দিয়ে রেজিস্ট্রেশন/লগইন হ্যান্ডলার (পিডিএফ অনুযায়ী সরাসরি হোম পেজে যাবে)
  const handleGoogleRegister = async () => {
    if (!googleLogin) return;
    setGoogleLoading(true);
    setErrorMessage('');

    try {
      const result = await googleLogin();
      if (result.success) {
        // সফল হলে সরাসরি হোম পেজে রিডাইরেক্ট
        router.push('/');
        router.refresh();
      } else {
        setErrorMessage(result.message || 'Google registration was unsuccessful.');
      }
    } catch (err) {
      console.error('Google register error:', err);
      setErrorMessage('Failed to connect to Google.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFB] text-[#0F172A] flex flex-col justify-between selection:bg-indigo-600 selection:text-white">
      
      {/* মেইন ফর্ম কন্টেইনার */}
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 bg-[#FAFAFB]">
        <div className="max-w-lg w-full bg-white border border-[#E2E8F0] rounded-3xl p-8 sm:p-12 shadow-sm relative overflow-hidden">
          
          {/* টপ অ্যাকসেন্ট বার */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-indigo-600"></div>

          {/* হেডার ও লোগো */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md mb-4">
              <BookOpen className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A]">
              Create an Account
            </h1>
            <p className="text-sm text-[#64748B] mt-1.5">
              Join StudyNook to reserve library study rooms seamlessly.
            </p>
          </div>

          {/* নোটিফিকেশন মেসেজ */}
          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-semibold text-center">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-semibold text-center">
              {successMessage}
            </div>
          )}

          {/* রেজিস্ট্রেশন ফর্ম */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] placeholder-zinc-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] placeholder-zinc-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all"
                />
              </div>
            </div>

            {/* Photo URL */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1.5">
                Profile Photo URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <input
                  type="url"
                  name="photoURL"
                  value={formData.photoURL}
                  onChange={handleChange}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] placeholder-zinc-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="•••••••• (Min. 6 chars)"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] placeholder-zinc-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <span>{loading ? 'Creating account...' : 'Register'}</span>
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {/* ডেকোরেটিভ ডিভাইডার */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E2E8F0]"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-[#64748B] font-semibold tracking-wider">OR</span>
            </div>
          </div>

          {/* Continue with Google বাটন */}
          <button
            type="button"
            onClick={handleGoogleRegister}
            disabled={googleLoading || loading}
            className="w-full py-3 px-4 rounded-xl bg-white hover:bg-zinc-50 border border-[#E2E8F0] text-[#0F172A] text-sm font-semibold transition-all flex items-center justify-center gap-2.5 shadow-sm active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.1 8.9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.7s.2-2 .4-2.7L1.6 6.4C.6 8.4 0 10.6 0 13s.6 4.6 1.6 6.6l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.1-6.7-5.3L1.6 15.9C3.5 19.7 7.4 23 12 23z"
              />
            </svg>
            <span>{googleLoading ? 'Connecting...' : 'Continue with Google'}</span>
          </button>

          {/* ফুটার লগইন লিংক */}
          <p className="text-center text-xs text-[#64748B] mt-6">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-indigo-600 hover:underline">
              Login
            </Link>
          </p>

        </div>
      </main>

      <Footer />
    </div>
  );
}