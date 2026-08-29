'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-[#F8FAFC] to-[#FAFAFB] border-b border-[#E2E8F0]">
      {/* Background Soft Glow Effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-indigo-200/40 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Title, Description & Action Button */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF2FF] border border-indigo-100 text-[#4F46E5] text-xs font-semibold mb-6 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Quiet Spaces for Ultimate Focus</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0F172A] leading-[1.15]">
              Find Your Perfect <br />
              <span className="text-[#6366F1]">Study Room</span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-[#64748B] max-w-xl leading-relaxed">
              Browse and book quiet, private study rooms in your library. List your own room, manage bookings effortlessly, and boost your productivity.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/rooms"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-white bg-[#6366F1] hover:bg-[#4F46E5] active:scale-95 rounded-xl shadow-lg shadow-indigo-500/25 transition-all"
              >
                <span>Explore Rooms</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="mt-12 pt-8 border-t border-[#E2E8F0] grid grid-cols-3 gap-6 w-full max-w-lg">
              <div>
                <p className="text-2xl font-bold text-[#0F172A]">150+</p>
                <p className="text-xs text-[#64748B] mt-0.5">Study Rooms</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F172A]">50k+</p>
                <p className="text-xs text-[#64748B] mt-0.5">Happy Students</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F172A]">100%</p>
                <p className="text-xs text-[#64748B] mt-0.5">Secure Booking</p>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Card / Image Mockup */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 to-sky-400 rounded-3xl blur-xl opacity-20 animate-pulse"></div>
              
              <div className="relative bg-white border border-[#E2E8F0] rounded-3xl p-4 shadow-xl">
                <div className="relative h-80 sm:h-96 w-full rounded-2xl overflow-hidden bg-zinc-100">
                  <img
                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000&auto=format&fit=crop"
                    alt="Student studying in a quiet room"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
                    <div className="text-white">
                      <span className="px-3 py-1 bg-white/25 backdrop-blur-md rounded-full text-xs font-medium">
                        Quiet Zone
                      </span>
                      <h3 className="text-lg font-bold mt-2">Central Library Study Suite</h3>
                      <p className="text-xs text-zinc-200 mt-0.5">High-speed Wi-Fi • Power Outlets • Silent Environment</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}