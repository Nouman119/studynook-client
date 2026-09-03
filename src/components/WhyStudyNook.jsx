'use client';

import { Sparkles, ShieldCheck, Zap, Clock, Wifi } from 'lucide-react';

const features = [
  {
    number: '01',
    title: 'Distraction-Free Zones',
    description:
      'Soundproofed acoustic rooms engineered to maximize concentration, deep focus, and productivity.',
    icon: ShieldCheck,
  },
  {
    number: '02',
    title: 'High-Speed Connectivity',
    description:
      'Enterprise-grade fiber Wi-Fi and dedicated desk power outlets ensuring zero interruptions.',
    icon: Wifi,
  },
  {
    number: '03',
    title: 'Flexible Hourly Booking',
    description:
      'Reserve exactly the hours you need with instant confirmation and effortless cancellation options.',
    icon: Clock,
  },
  {
    number: '04',
    title: 'Collaborative Gear',
    description:
      'Equipped with magnetic dry-erase whiteboards, ergonomic seating, and smart presentation displays.',
    icon: Zap,
  },
];

export default function WhyStudyNook() {
  return (
    <section className="relative py-20 lg:py-28 bg-[#EEF4FF] dark:bg-[#090D16] overflow-hidden font-sans border-y border-indigo-100/60 dark:border-zinc-800/80">
      
      {/* Background Subtle Gradient Glows for Depth & Contrast */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(199,210,254,0.35),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.12),rgba(0,0,0,0))] pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-400/20 dark:bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-cyan-400/20 dark:bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Heading + Collage Image Grid */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 text-xs font-extrabold uppercase tracking-wider mb-4 border border-indigo-100 dark:border-zinc-800 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Why Choose Us
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                Designed for Focus, Built for Productivity
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 mt-3 max-w-lg leading-relaxed font-normal">
                StudyNook bridges the gap between chaotic public cafes and expensive office leases, offering on-demand curated workspaces across campus.
              </p>
            </div>

            {/* Collage Grid (4-box layout) */}
            <div className="grid grid-cols-2 gap-3.5 sm:gap-4 pt-1">
              
              {/* Image 1 */}
              <div className="relative rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition duration-300 group h-44 sm:h-52 bg-slate-200 border border-white/60 dark:border-zinc-800">
                <img
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80"
                  alt="Modern Study Booth"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition duration-300" />
              </div>

              {/* Image 2 */}
              <div className="relative rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition duration-300 group h-44 sm:h-52 bg-slate-200 border border-white/60 dark:border-zinc-800">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80"
                  alt="Student Collaboration"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition duration-300" />
              </div>

              {/* Image 3 */}
              <div className="relative rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition duration-300 group h-44 sm:h-52 bg-slate-200 border border-white/60 dark:border-zinc-800">
                <img
                  src="https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=600&q=80"
                  alt="Quiet Work Area"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition duration-300" />
              </div>

              {/* Image 4 */}
              <div className="relative rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition duration-300 group h-44 sm:h-52 bg-slate-200 border border-white/60 dark:border-zinc-800">
                <img
                  src="https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80"
                  alt="Student Focused"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition duration-300" />
              </div>

            </div>
          </div>

          {/* Right Column: 4 Numbered Clean White Feature Cards */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 lg:pt-14">
            {features.map((item) => (
              <div
                key={item.number}
                className="bg-white dark:bg-zinc-900/90 border border-white/80 dark:border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-md shadow-indigo-100/50 dark:shadow-none hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Cyan Number Badge */}
                  <div className="inline-flex items-center justify-center text-sm font-black text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-zinc-800 px-3.5 py-1.5 rounded-2xl mb-4 group-hover:scale-105 transition duration-300">
                    {item.number}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    Learn More
                  </span>
                  <item.icon className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}