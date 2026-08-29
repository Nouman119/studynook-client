'use client';

import { CalendarCheck, ShieldCheck, LayoutDashboard } from 'lucide-react';

export default function WhyStudyNook() {
  const features = [
    {
      icon: <CalendarCheck className="w-6 h-6 text-[#6366F1]" />,
      title: "Easy Booking",
      description: "Pick a date, choose an hour, see the cost — done. No back-and-forth emails or paperwork."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#6366F1]" />,
      title: "Conflict-Free Scheduling",
      description: "Smart overlap detection prevents double-bookings, so the room you reserve is the room you get."
    },
    {
      icon: <LayoutDashboard className="w-6 h-6 text-[#6366F1]" />,
      title: "Manage Your Listings",
      description: "Own a room? List it, set your hourly rate, and keep full control from your dashboard."
    }
  ];

  return (
    <section className="py-20 bg-[#0F172A] text-white relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Why StudyNook?
          </h2>
          <p className="mt-3 text-base text-zinc-400">
            Built around the way real students study — quiet, focused, and on your schedule.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800/80 rounded-3xl p-8 shadow-sm hover:border-indigo-500/50 hover:shadow-[0_10px_30px_-10px_rgba(99,102,241,0.2)] transition-all duration-300 flex flex-col items-start"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF]/10 border border-indigo-500/20 flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight mb-3">
                {feature.title}
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}