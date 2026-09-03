'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  BookOpen, 
  LogOut, 
  Menu, 
  X, 
  List, 
  BookmarkCheck, 
  PlusCircle, 
  ChevronDown 
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth() || {};
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Rooms', href: '/rooms' },
    ...(user
      ? [
          { name: 'Add Room', href: '/add-room' },
          { name: 'My Listings', href: '/dashboard/my-listings' },
          { name: 'My Bookings', href: '/my-bookings' },
        ]
      : []),
  ];

  const isActive = (path) => pathname === path;

  return (
    <header className="w-full px-4 sm:px-6 lg:px-8 pt-4 relative z-50">
      <div className="max-w-7xl mx-auto">
        {/* Floating Pill Navbar */}
        <nav className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-[#E2E8F0] dark:border-zinc-800 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.06)] rounded-2xl px-5 py-3 transition-all">
          <div className="flex items-center justify-between">
            
{/* 1. Brand Logo */}
<Link href="/" className="flex items-center gap-2.5 group">
  <div className="w-10 h-10 rounded-2xl bg-zinc-900 dark:bg-zinc-800 text-indigo-400 flex items-center justify-center shadow-md group-hover:bg-indigo-600 group-hover:text-white transition-all">
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  </div>
  <span className="font-extrabold text-xl tracking-tight text-[#0F172A] dark:text-white">
    Study<span className="text-indigo-600">Nook</span>
  </span>
</Link>
            {/* 2. Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-semibold transition-colors ${
                    isActive(link.href)
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-[#64748B] hover:text-[#0F172A] dark:text-zinc-400 dark:hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* 3. Auth Section / Profile Dropdown (Desktop) */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  {/* Profile Trigger Button */}
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-transparent hover:border-[#E2E8F0] dark:hover:border-zinc-700 transition-all cursor-pointer"
                  >
                    <img
                      src={user?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                      alt={user?.name || 'User Avatar'}
                      className="w-8 h-8 rounded-full object-cover border border-indigo-200 dark:border-zinc-700 shadow-sm"
                    />
                    <span className="text-sm font-bold text-[#0F172A] dark:text-white max-w-[130px] truncate">
                      {user?.name || 'Scholar'}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-[#64748B] transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu Box */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-[#E2E8F0] dark:border-zinc-800 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      {/* User Info Header */}
                      <div className="px-3.5 py-3 border-b border-[#F1F5F9] dark:border-zinc-800 mb-1">
                        <p className="text-sm font-bold text-[#0F172A] dark:text-white truncate">
                          {user?.name || 'Guest Scholar'}
                        </p>
                        <p className="text-xs text-[#64748B] dark:text-zinc-400 truncate mt-0.5 font-medium">
                          {user?.email || 'user@studynook.com'}
                        </p>
                      </div>

                      {/* Dropdown Links */}
                      <div className="flex flex-col gap-1 py-1">
                        <Link
                          href="/rooms/add"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-[#334155] dark:text-zinc-300 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-zinc-800/80 rounded-xl transition-colors"
                        >
                          <PlusCircle className="w-4 h-4 text-[#64748B]" />
                          Add Room
                        </Link>
                        <Link
                          href="/dashboard/my-listings"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-[#334155] dark:text-zinc-300 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-zinc-800/80 rounded-xl transition-colors"
                        >
                          <List className="w-4 h-4 text-[#64748B]" />
                          My Listings
                        </Link>
                        <Link
                          href="/my-bookings"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-[#334155] dark:text-zinc-300 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-zinc-800/80 rounded-xl transition-colors"
                        >
                          <BookmarkCheck className="w-4 h-4 text-[#64748B]" />
                          My Bookings
                        </Link>
                      </div>

                      {/* Sign Out Button */}
                      <div className="pt-1 mt-1 border-t border-[#F1F5F9] dark:border-zinc-800">
                        <button
                          onClick={() => {
                            setIsDropdownOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-semibold text-[#0F172A] hover:text-indigo-600 dark:text-zinc-200 dark:hover:text-white transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/register"
                    className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-xl shadow-sm shadow-indigo-600/25 transition-all"
                  >
                    Register
                  </Link>
                </div>
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

          {/* 5. Mobile Drawer */}
          {isOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-[#E2E8F0] dark:border-zinc-800 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive(link.href)
                      ? 'bg-indigo-50 text-indigo-600 dark:bg-zinc-800 dark:text-indigo-400'
                      : 'text-[#64748B] hover:text-[#0F172A] hover:bg-zinc-50 dark:hover:bg-zinc-800'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              <div className="pt-3 border-t border-[#E2E8F0] dark:border-zinc-800 flex flex-col gap-2">
                {user ? (
                  <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-[#E2E8F0] dark:border-zinc-700 flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={user?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                        alt={user?.name || 'User'}
                        className="w-10 h-10 rounded-full object-cover border border-indigo-200"
                      />
                      <div className="overflow-hidden">
                        <p className="text-sm font-bold text-[#0F172A] dark:text-white truncate">
                          {user?.name || 'Scholar'}
                        </p>
                        <p className="text-xs text-[#64748B] dark:text-zinc-400 truncate">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign out
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="text-center py-2.5 text-sm font-semibold border border-[#E2E8F0] dark:border-zinc-700 text-[#0F172A] dark:text-white rounded-xl hover:bg-zinc-50"
                    >
                      Log In
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsOpen(false)}
                      className="text-center py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm"
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