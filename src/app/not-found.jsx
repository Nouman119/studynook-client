'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  useEffect(() => {
    document.title = 'StudyNook – 404 Not Found';
    // স্ক্রল বন্ধ রাখতে বডিতে ওভারফ্লো হিডেন সেট করা
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-40 w-screen h-screen bg-[#031538] flex flex-col items-center justify-center px-4 overflow-hidden font-sans select-none">
      
      {/* Background Ambient Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[18%] left-[15%] w-1.5 h-1.5 bg-white/70 rounded-full"></div>
        <div className="absolute top-[28%] right-[22%] w-2 h-2 bg-indigo-200/50 rounded-full blur-[0.5px]"></div>
        <div className="absolute bottom-[22%] left-[25%] w-1 h-1 bg-white/80 rounded-full"></div>
        <div className="absolute top-20 right-[15%] w-1.5 h-1.5 bg-amber-100/70 rounded-full"></div>
        <div className="absolute bottom-[30%] right-[18%] w-1.5 h-1.5 bg-white/60 rounded-full"></div>
        
        {/* Soft Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[28rem] h-[28rem] bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-xl mx-auto -mt-6 sm:-mt-10">
        
        {/* Visual 404 Graphic (4 - Stable Planet & Astronaut - 4) */}
        <div className="flex items-center justify-center gap-1 sm:gap-3 relative mb-2 sm:mb-4">
          
          {/* First "4" */}
          <span className="text-[110px] sm:text-[160px] md:text-[190px] font-black text-white tracking-tighter leading-none drop-shadow-[0_12px_20px_rgba(0,0,0,0.5)]">
            4
          </span>

          {/* Center Illustration: Planet with Ring and Stable Astronaut */}
          <div className="relative flex items-center justify-center w-32 h-32 sm:w-48 sm:h-48 md:w-56 md:h-56 mx-[-6px] sm:mx-[-12px]">
            
            {/* Planet Glow */}
            <div className="absolute inset-2 bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-300 rounded-full shadow-[0_0_50px_12px_rgba(245,158,11,0.3)]"></div>

            {/* Planet Surface Texture */}
            <svg 
              viewBox="0 0 200 200" 
              className="absolute inset-0 w-full h-full rounded-full overflow-hidden"
            >
              <defs>
                <radialGradient id="planetGrad" cx="35%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#FDE047" />
                  <stop offset="45%" stopColor="#F97316" />
                  <stop offset="85%" stopColor="#EA580C" />
                  <stop offset="100%" stopColor="#9A3412" />
                </radialGradient>
              </defs>
              <circle cx="100" cy="100" r="95" fill="url(#planetGrad)" />
              {/* Craters */}
              <circle cx="65" cy="75" r="14" fill="#C2410C" opacity="0.4" />
              <circle cx="60" cy="72" r="12" fill="#9A3412" opacity="0.3" />
              <circle cx="140" cy="125" r="20" fill="#C2410C" opacity="0.35" />
              <circle cx="105" cy="145" r="11" fill="#9A3412" opacity="0.35" />
              <circle cx="130" cy="65" r="9" fill="#EA580C" opacity="0.45" />
            </svg>

            {/* Orbital Ring */}
            <div className="absolute inset-[-14%] sm:inset-[-18%] pointer-events-none flex items-center justify-center">
              <svg viewBox="0 0 300 120" className="w-full h-full -rotate-[24deg]">
                <ellipse 
                  cx="150" 
                  cy="60" 
                  rx="135" 
                  ry="26" 
                  fill="none" 
                  stroke="#FDE047" 
                  strokeWidth="8" 
                  strokeLinecap="round"
                  className="drop-shadow-[0_0_10px_rgba(253,224,71,0.8)] opacity-95"
                />
              </svg>
            </div>

            {/* Stable Astronaut (No jumping/bouncing animation) */}
            <div className="absolute -top-10 sm:-top-14 left-1/2 -translate-x-1/2 w-14 sm:w-18 md:w-20 pointer-events-none drop-shadow-xl z-20">
              <svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                <rect x="25" y="32" width="50" height="42" rx="10" fill="#CBD5E1" />
                <rect x="30" y="36" width="40" height="42" rx="12" fill="#F8FAFC" />
                <circle cx="50" cy="26" r="20" fill="#F8FAFC" />
                <ellipse cx="50" cy="26" rx="13" ry="10" fill="#0F172A" />
                <path d="M43 23C45 20 54 20 57 23" stroke="#FDE047" strokeWidth="2" strokeLinecap="round" />
                <path d="M30 45L16 32C14 30 11 34 13 37L26 56" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />
                <path d="M70 45L84 38C87 36 89 40 87 43L74 56" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />
                <rect x="33" y="74" width="12" height="24" rx="6" fill="#F8FAFC" />
                <ellipse cx="38" cy="98" rx="8" ry="4" fill="#94A3B8" />
                <path d="M55 74L68 88C70 90 73 87 71 84L65 74" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />
                <ellipse cx="71" cy="87" rx="6" ry="4" fill="#94A3B8" />
                <rect x="42" y="44" width="16" height="8" rx="3" fill="#6366F1" />
              </svg>
            </div>

          </div>

          {/* Second "4" */}
          <span className="text-[110px] sm:text-[160px] md:text-[190px] font-black text-white tracking-tighter leading-none drop-shadow-[0_12px_20px_rgba(0,0,0,0.5)]">
            4
          </span>

        </div>

        {/* Message */}
        <p className="text-slate-300 text-xs sm:text-sm font-medium tracking-wide mb-6">
          Oops it seems you follow backlink
        </p>

        {/* Pill-shaped Back To Home Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/60 hover:border-white text-white text-xs sm:text-sm font-semibold hover:bg-white/10 active:scale-95 transition-all duration-200 cursor-pointer shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back To Home</span>
        </Link>

      </div>

    </div>
  );
}