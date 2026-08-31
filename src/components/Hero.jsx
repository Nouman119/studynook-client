'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen, Users, MapPin, Wifi, ShieldCheck } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#F8F9FA] dark:bg-zinc-950 text-[#0F172A] dark:text-white py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Split Layout: Left Text & Right Image Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-16">
          
          {/* Left Content Area */}
          <div className="lg:col-span-6 space-y-6 z-10">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-gray-900 dark:text-white">
              Find your quiet space <br />
              <span className="text-indigo-600">with art and focus.</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-zinc-400 max-w-lg leading-relaxed">
              Not only finding a functional study room, but also experiencing a peaceful environment designed for maximum productivity and collaboration.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/rooms"
                className="px-6 py-3.5 text-sm font-semibold text-white bg-gray-900 dark:bg-white dark:text-gray-900 hover:bg-indigo-600 dark:hover:bg-indigo-50 dark:hover:text-indigo-600 rounded-xl shadow-lg transition-all inline-flex items-center gap-2"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/rooms"
                className="px-6 py-3.5 text-sm font-semibold text-gray-700 dark:text-zinc-300 hover:text-indigo-600 transition-all inline-flex items-center gap-1"
              >
                Learn More <span>&gt;</span>
              </Link>
            </div>
          </div>

          {/* Right Image Cards Area (Matching Reference Layout) */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4 relative">
            {/* Center Tall Image */}
            <div className="relative h-[360px] sm:h-[420px] rounded-3xl overflow-hidden shadow-xl bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"
                alt="Study Room Interior"
                className="w-full h-full object-cover hover:scale-105 transition duration-500"
              />
            </div>

            {/* Right Side Image with Service Overlay Card */}
            <div className="relative h-[360px] sm:h-[420px] rounded-3xl overflow-hidden shadow-xl bg-slate-100 mt-6 lg:mt-10">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                alt="Collaborative Space"
                className="w-full h-full object-cover hover:scale-105 transition duration-500"
              />
              
              {/* Floating Service Card at Bottom of Right Image */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/20 dark:border-zinc-800 space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Our Features</p>
                
                <div className="flex items-center justify-between text-xs font-bold text-gray-800 dark:text-white py-1.5 border-b border-gray-100 dark:border-zinc-800">
                  <span className="flex items-center gap-2"><BookOpen className="w-3.5 h-3.5 text-indigo-600" /> Quiet Study Desks</span>
                  <span>&rarr;</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-gray-800 dark:text-white py-1.5 border-b border-gray-100 dark:border-zinc-800">
                  <span className="flex items-center gap-2"><Users className="w-3.5 h-3.5 text-indigo-600" /> Group Meeting Rooms</span>
                  <span>&rarr;</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-gray-800 dark:text-white py-1.5">
                  <span className="flex items-center gap-2"><Wifi className="w-3.5 h-3.5 text-indigo-600" /> High-Speed Wi-Fi</span>
                  <span>&rarr;</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Statistics Section (Matching the Reference 4-column layout) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 border-t border-gray-200 dark:border-zinc-800">
          <div>
            <p className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">321</p>
            <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-zinc-400 mt-1">Projects & Rooms Completed</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">25</p>
            <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-zinc-400 mt-1">Awards & Recognition</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">31</p>
            <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-zinc-400 mt-1">Expert Mentors & Staff</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">15</p>
            <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-zinc-400 mt-1">Years Experience</p>
          </div>
        </div>

      </div>
    </section>
  );
}