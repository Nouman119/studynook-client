'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { BookOpen, LogOut, Menu, X, User } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth() || {};
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Rooms', href: '/rooms' },
    ...(user
      ? [
          { name: 'Add Room', href: '/rooms/add' },
          { name: 'My Listings', href: '/dashboard/my-listings' },
          { name: 'My Bookings', href: '/dashboard/my-bookings' },
        ]
      : []),
  ];

  const isActive = (path) => pathname === path;

  return (
    <header className="w-full px-4 sm:px-6 lg:px-8 pt-4">
      <div className="max-w-7xl mx-auto">
        {/* Floating Pill Container */}
        <nav className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-[#E2E8F0] dark:border-zinc-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] rounded-2xl px-4 sm:px-6 py-3 transition-all">
          <div className="flex items-center justify-between">
            
            {/* 1. Brand Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-[#6366F1] flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:bg-[#4F46E5] transition-colors">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl tracking-tight text-[#0F172A] dark:text-white">
                Study<span className="text-[#6366F1]">Nook</span>
              </span>
            </Link>

            {/* 2. Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-7">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? 'text-[#6366F1] font-semibold'
                      : 'text-[#64748B] hover:text-[#0F172A] dark:text-zinc-400 dark:hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* 3. Auth Actions (Desktop) */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#EEF2FF] dark:bg-zinc-800/60 border border-indigo-100 dark:border-zinc-700 text-xs font-medium text-[#4F46E5] dark:text-indigo-400">
                    <User className="w-3.5 h-3.5" />
                    <span className="max-w-[120px] truncate">{user?.name || user?.email || 'User'}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="p-2 text-[#EF4444] hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-medium text-[#0F172A] hover:text-[#6366F1] dark:text-zinc-200 dark:hover:text-white transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/register"
                    className="px-5 py-2 text-sm font-medium text-white bg-[#6366F1] hover:bg-[#4F46E5] active:scale-95 rounded-xl shadow-sm shadow-indigo-500/25 transition-all"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            {/* 4. Mobile Menu Toggle Button */}
            <div className="flex md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-[#0F172A] dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                aria-label="Toggle Menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* 5. Mobile / Tablet Drawer */}
          {isOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-[#E2E8F0] dark:border-zinc-800 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? 'bg-[#EEF2FF] text-[#6366F1] font-semibold dark:bg-zinc-800'
                      : 'text-[#64748B] hover:text-[#0F172A] hover:bg-zinc-50 dark:hover:bg-zinc-800'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              <div className="pt-3 border-t border-[#E2E8F0] dark:border-zinc-800 flex flex-col gap-2">
                {user ? (
                  <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800">
                    <span className="text-xs font-medium text-[#0F172A] dark:text-zinc-200 truncate">
                      {user?.name || user?.email || 'User'}
                    </span>
                    <button
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#EF4444] rounded-lg"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="text-center py-2 text-sm font-medium border border-[#E2E8F0] dark:border-zinc-700 text-[#0F172A] dark:text-white rounded-xl"
                    >
                      Log In
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsOpen(false)}
                      className="text-center py-2 text-sm font-medium text-white bg-[#6366F1] hover:bg-[#4F46E5] rounded-xl"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}