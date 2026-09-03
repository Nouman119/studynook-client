'use client';

import { useState } from 'react';
import { HelpCircle, ChevronDown, Sparkles } from 'lucide-react';

const faqs = [
  {
    question: 'How do I book a study room on StudyNook?',
    answer:
      'Simply browse our Available Rooms page, select your preferred study space, choose an open date and time slot from the modal, and confirm your booking instantly.',
  },
  {
    question: 'Can I cancel or reschedule my booking?',
    answer:
      'Yes! You can manage and cancel your active sessions anytime from your "My Bookings" dashboard. Once cancelled, your slot is immediately freed for other learners.',
  },
  {
    question: 'What amenities are included in each room?',
    answer:
      'Most rooms come equipped with high-speed fiber Wi-Fi, power outlets at every desk, dry-erase whiteboards, and ergonomic seating. Check the specific room details card for exact equipment.',
  },
  {
    question: 'How does StudyNook prevent overlapping bookings?',
    answer:
      'Our intelligent booking engine automatically validates time conflicts on the server before confirming any session, guaranteeing that two people cannot book the same slot.',
  },
  {
    question: 'Is there a minimum or maximum booking duration?',
    answer:
      'Standard bookings are made in 1-hour increments. You can book from 1 hour up to full-day blocks depending on room availability.',
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="relative py-20 lg:py-28 bg-[#F4F6FB] dark:bg-zinc-900/60 font-sans overflow-hidden border-y border-slate-200/80 dark:border-zinc-800">
      
      {/* Soft Ambient Light Glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-indigo-200/30 dark:bg-indigo-950/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-blue-200/30 dark:bg-blue-950/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100/70 dark:bg-zinc-800 text-indigo-700 dark:text-indigo-400 text-xs font-extrabold uppercase tracking-wider mb-3.5 border border-indigo-200/60 dark:border-zinc-700">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> Got Questions?
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-zinc-400 mt-3 max-w-md mx-auto leading-relaxed">
            Everything you need to know about reserving study spaces, access policies, and room amenities.
          </p>
        </div>

        {/* Accordion List (Elevated White Cards on Light Soft Background) */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`rounded-2xl transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'bg-white dark:bg-zinc-900 border-2 border-indigo-500/40 shadow-lg shadow-indigo-100/60 dark:shadow-none'
                    : 'bg-white/90 dark:bg-zinc-900/80 border border-slate-200/80 dark:border-zinc-800 hover:border-indigo-300 hover:shadow-md'
                }`}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left cursor-pointer transition"
                >
                  <div className="flex items-center gap-3.5 pr-4">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isOpen
                          ? 'bg-indigo-50 dark:bg-zinc-800 text-indigo-600'
                          : 'bg-slate-100 dark:bg-zinc-800/60 text-slate-400'
                      }`}
                    >
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight">
                      {faq.question}
                    </span>
                  </div>
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen
                        ? 'rotate-180 bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-zinc-800 text-slate-500'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed border-t border-slate-100 dark:border-zinc-800">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}