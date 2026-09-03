'use client';

import Link from 'next/link';
import { 
  Search, 
  Calendar, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  Sparkles,
  ShieldCheck,
  Building
} from 'lucide-react';

export default function HowItWorks() {
  return (
    <section className="py-20 lg:py-28 bg-white dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 font-sans relative overflow-hidden">
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-24">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 text-xs font-extrabold uppercase tracking-wider mb-3 border border-indigo-100 dark:border-zinc-800">
            <Sparkles className="w-3.5 h-3.5" /> Simple 3-Step Process
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How it works
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-zinc-400 mt-3 max-w-md mx-auto leading-relaxed">
            Booking your distraction-free workspace takes less than two minutes from search to confirmation.
          </p>
        </div>

        {/* The 3 Steps Flow with Dotted Curve Path */}
        <div className="relative">
          
          {/* Connecting Curved Dotted Path (Visible on desktop/tablet) */}
          <div className="hidden md:block absolute top-1/4 left-10 right-10 -translate-y-6 pointer-events-none z-0">
            <svg 
              className="w-full h-24" 
              viewBox="0 0 900 120" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M 50,80 Q 250,-10 450,60 T 850,20" 
                stroke="#CBD5E1" 
                strokeWidth="2.5" 
                strokeDasharray="6 8" 
                strokeLinecap="round"
                className="opacity-70 dark:opacity-30"
              />
            </svg>
          </div>

          {/* 3 Step Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-10 relative z-10 items-start">
            
            {/* Step 1: Discover & Select */}
            <div className="flex flex-col items-center text-center space-y-5 group">
              
              {/* Floating UI Graphic (Search & Filter Card Mockup) */}
              <div className="h-44 flex items-center justify-center w-full relative">
                <div className="w-48 bg-slate-50 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-2xl p-3.5 shadow-xl shadow-slate-100 dark:shadow-none space-y-2.5 transition-transform duration-300 group-hover:-translate-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center">
                      <Search className="w-3.5 h-3.5" />
                    </div>
                    <div className="h-2.5 w-20 bg-slate-200 dark:bg-zinc-700 rounded-full" />
                  </div>
                  <div className="h-2 w-32 bg-slate-200/70 dark:bg-zinc-800 rounded-full" />
                  <div className="h-2 w-24 bg-slate-200/60 dark:bg-zinc-800 rounded-full" />
                </div>

                {/* Overlapping Badge Floating Front */}
                <div className="absolute -bottom-2 -left-2 sm:left-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-3 py-2 rounded-xl text-[11px] font-bold shadow-lg flex items-center gap-2 border border-slate-800 dark:border-zinc-200 transition-transform duration-300 group-hover:scale-105">
                  <div className="w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center">
                    <Building className="w-2.5 h-2.5 text-white" />
                  </div>
                  <div className="h-2 w-14 bg-slate-700 dark:bg-slate-200 rounded-full" />
                </div>
              </div>

              {/* Text Info */}
              <div className="space-y-2 pt-3 max-w-xs">
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Choose Workspace
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
                  Browse modern study rooms, quiet solo pods, or group discussion spaces with full amenity details.
                </p>
              </div>
            </div>

            {/* Step 2: Pick Time & Slot */}
            <div className="flex flex-col items-center text-center space-y-5 group">
              
              {/* Floating UI Graphic (Bar Chart & Time Slot Indicator) */}
              <div className="h-44 flex items-center justify-center w-full relative">
                
                {/* Visual Bar Slot Chart */}
                <div className="flex items-end gap-2.5 h-24 p-3 bg-slate-50 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-2xl shadow-xl shadow-slate-100 dark:shadow-none transition-transform duration-300 group-hover:-translate-y-1.5">
                  <div className="w-4 bg-slate-800 dark:bg-indigo-500/80 rounded-t-lg h-12" />
                  <div className="w-4 bg-indigo-600 rounded-t-lg h-18 shadow-md shadow-indigo-600/30" />
                  <div className="w-4 bg-slate-800 dark:bg-indigo-500/80 rounded-t-lg h-8" />
                  <div className="w-4 bg-slate-800 dark:bg-indigo-500/80 rounded-t-lg h-14" />
                </div>

                {/* Floating Shield/Security Badge */}
                <div className="absolute -top-1 -right-2 sm:right-6 w-9 h-9 rounded-2xl bg-pink-500 text-white flex items-center justify-center shadow-lg shadow-pink-500/30 transition-transform duration-300 group-hover:scale-110">
                  <Clock className="w-4 h-4" />
                </div>
              </div>

              {/* Text Info */}
              <div className="space-y-2 pt-3 max-w-xs">
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Select Time & Slot
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
                  Choose your preferred date and convenient hours. Our conflict check guarantees zero double-bookings.
                </p>
              </div>
            </div>

            {/* Step 3: Confirm & Focus */}
            <div className="flex flex-col items-center text-center space-y-5 group">
              
              {/* Floating UI Graphic (Confirmation Card Mockup) */}
              <div className="h-44 flex items-center justify-center w-full relative">
                
                {/* Main Dark Slate Card */}
                <div className="w-36 bg-slate-900 dark:bg-zinc-900 border border-slate-800 dark:border-zinc-700 text-white rounded-2xl p-4 shadow-2xl space-y-2 transition-transform duration-300 group-hover:-translate-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <CheckCircle2 className="w-3 h-3" />
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">Session</span>
                  </div>
                  <div className="text-base font-extrabold text-white">Confirmed</div>
                  <div className="text-[9px] text-slate-400">Door Pin • 5080</div>
                </div>

                {/* Mini Floating Add/Schedule Pill */}
                <div className="absolute left-0 sm:left-4 bottom-8 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-200 px-3 py-1.5 rounded-xl text-[11px] font-bold shadow-md flex items-center gap-1">
                  <span className="text-indigo-600 font-extrabold">+</span> Pass Sent
                </div>
              </div>

              {/* Text Info */}
              <div className="space-y-2 pt-3 max-w-xs">
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Instant Confirmation
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
                  Receive instant reservation confirmation. Manage or cancel sessions right from your personal dashboard.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom CTA Button */}
        <div className="mt-16 text-center">
          <Link
            href="/rooms"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-indigo-600/25 transition-all duration-200 cursor-pointer active:scale-95"
          >
            <span>Reserve a Study Space Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}