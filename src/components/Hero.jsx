'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaArrowRight, FaMapMarkerAlt, FaDoorOpen, FaWifi } from 'react-icons/fa';

export default function Hero() {
  const slides = [
    {
      title: "Find your comfort working zone with StudyNook",
      subtitle: "Change your work environment by using a co-working place, to meet new people and gain a new network",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Collaborate and grow with dedicated group spaces",
      subtitle: "Book premium meeting and discussion rooms designed for focused group studies and projects.",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  // Auto slide effect (every 4 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const current = slides[currentIndex];

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-[#FAFAFB] text-[#0F172A] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        <div className="relative flex flex-col lg:flex-row items-center">
          
          <div className="w-full lg:w-[72%] relative rounded-2xl overflow-hidden shadow-2xl h-[420px] sm:h-[480px] z-0">
            <img 
              src={current.image} 
              alt="Study Room" 
              className="w-full h-full object-cover transition-all duration-500"
            />
            <div className="absolute inset-0 bg-black/10"></div>

            <div className="absolute bottom-6 left-6 flex items-center gap-3 bg-white/95 backdrop-blur-md p-2.5 rounded-xl shadow-lg z-10">
              <button 
                onClick={prevSlide}
                className="p-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition"
                aria-label="Previous Slide"
              >
                <FaArrowLeft size={12} />
              </button>
              <button 
                onClick={nextSlide}
                className="p-3 bg-[#848B79] hover:bg-[#6e7464] text-white rounded-lg transition"
                aria-label="Next Slide"
              >
                <FaArrowRight size={12} />
              </button>
              <div className="px-3 text-xs font-bold text-gray-700 tracking-wider flex items-center gap-2">
                <span>0{currentIndex + 1}</span>
                <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#848B79] transition-all duration-300" 
                    style={{ width: `${((currentIndex + 1) / slides.length) * 100}%` }}
                  ></div>
                </div>
                <span className="text-gray-400">0{slides.length}</span>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[44%] lg:-ml-36 mt-6 lg:mt-0 z-25 bg-white/75 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-2xl border border-white/60">
            <div className="flex items-center justify-between gap-3 mb-2">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                {current.title}
              </h2>
              <div className="w-10 h-0.5 bg-[#848B79] shrink-0"></div>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mt-2">
              {current.subtitle}
            </p>

            <div className="grid grid-cols-2 gap-y-3 gap-x-2 mt-6 pt-5 border-t border-gray-200/60 text-xs font-semibold text-gray-700">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-[10px]">✓</span> Virtual Office Setup
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-[10px]">✓</span> Open Workspace
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-[10px]">✓</span> Space for Event
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-[10px]">✓</span> Chill Out Zone
              </div>
            </div>
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 pt-10 border-t border-gray-200/60">
          <div className="flex flex-col items-start p-6 rounded-2xl bg-white shadow-sm border border-gray-100">
            <div className="p-3.5 bg-sky-50 text-sky-600 rounded-xl text-xl flex items-center justify-center shadow-inner mb-4">
              <FaMapMarkerAlt />
            </div>
            <h3 className="text-base font-bold text-gray-900">20+ Location</h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>

          <div className="flex flex-col items-start p-6 rounded-2xl bg-white shadow-sm border border-gray-100">
            <div className="p-3.5 bg-sky-50 text-sky-600 rounded-xl text-xl flex items-center justify-center shadow-inner mb-4">
              <FaDoorOpen />
            </div>
            <h3 className="text-base font-bold text-gray-900">324 Rooms Available</h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>

          <div className="flex flex-col items-start p-6 rounded-2xl bg-white shadow-sm border border-gray-100">
            <div className="p-3.5 bg-sky-50 text-sky-600 rounded-xl text-xl flex items-center justify-center shadow-inner mb-4">
              <FaWifi />
            </div>
            <h3 className="text-base font-bold text-gray-900">100% Internet Connected</h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}