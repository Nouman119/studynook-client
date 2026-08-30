'use client';

import Link from 'next/link';
import { Search, Calendar, Sparkles, ArrowRight } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      stepNum: "01",
      icon: <Search className="w-6 h-6 text-[#6366F1]" />,
      title: "Browse Rooms",
      description: "Filter by floor, capacity, amenities, or hourly rate to find your fit."
    },
    {
      stepNum: "02",
      icon: <Calendar className="w-6 h-6 text-[#6366F1]" />,
      title: "Pick a Time",
      description: "Choose a date and an open time slot — we'll prevent any conflicts."
    },
    {
      stepNum: "03",
      icon: <Sparkles className="w-6 h-6 text-[#6366F1]" />,
      title: "Study Peacefully",
      description: "Get a confirmation, show up, and focus. Manage everything from your dashboard."
    }
  ];

  return (
    <section className="py-24 bg-[#FAFAFB] text-[#0F172A] relative overflow-hidden border-t border-[#E2E8F0]">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-indigo-100/50 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6366F1] bg-[#EEF2FF] px-3.5 py-1.5 rounded-full border border-indigo-100 shadow-2xs">
            Simple Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A] mt-4">
            How It Works
          </h2>
          <p className="mt-3 text-base text-[#64748B]">
            From browsing to booked in under a minute.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="relative bg-white border border-[#E2E8F0] rounded-3xl p-8 flex flex-col items-center text-center shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all group"
            >
              {/* Step Badge */}
              <div className="absolute -top-4 px-3.5 py-1 bg-[#EEF2FF] border border-indigo-100 text-[#4F46E5] rounded-full text-xs font-extrabold shadow-sm">
                {item.stepNum}
              </div>

              {/* Icon Box */}
              <div className="w-14 h-14 rounded-2xl bg-[#EEF2FF] border border-indigo-100 flex items-center justify-center mt-3 mb-6 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>

              <h3 className="text-xl font-bold text-[#0F172A] tracking-tight mb-3">
                {item.title}
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Call to Action Button */}
        <div className="flex justify-center">
          <Link
            href="/rooms"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-semibold text-white bg-[#0F172A] hover:bg-zinc-800 transition-all shadow-lg active:scale-95"
          >
            <span>Start Browsing</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}