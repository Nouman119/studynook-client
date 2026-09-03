'use client';

import { useState } from 'react';
import { ChevronUp, ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    id: 1,
    question: 'How do I reserve a study room on StudyNook?',
    answer:
      'Simply browse our available study rooms, select the room that matches your team size or focus needs, choose an open date and time slot, and confirm your reservation directly.',
  },
  {
    id: 2,
    question: 'Can I cancel or reschedule my reservation?',
    answer:
      'Yes, you can cancel any upcoming confirmed booking from your "My Bookings" dashboard. Please note that past bookings cannot be cancelled.',
  },
  {
    id: 3,
    question: 'Are amenities like Wi-Fi and whiteboards included in the price?',
    answer:
      'Yes! All listed amenities for each room—such as high-speed Wi-Fi, power outlets, silent zones, and whiteboards—are fully included in the hourly rate without hidden fees.',
  },
  {
    id: 4,
    question: 'What happens if two users try to book the exact same time slot?',
    answer:
      'Our system has an automated overlap conflict prevention system. If a slot is already confirmed, conflicting bookings are blocked immediately to ensure double-booking never occurs.',
  },
  {
    id: 5,
    question: 'Can I list my private study room or library space?',
    answer:
      'Absolutely! Once logged in, navigate to the "Add Room" section, input room specifications, upload images, select amenities, and list your study space for students and professionals.',
  },
];

export default function FaqSection() {
  // প্রথম FAQ ডিফল্টভাবে ওপেন থাকবে (ছবির মতো)
  const [openId, setOpenId] = useState(1);

  const toggleFaq = (id) => {
    setOpenId((prevId) => (prevId === id ? null : id));
  };

  return (
    <section className="py-20 lg:py-28 bg-[#FAFAFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Heading & Subtext (Col 5) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold mb-6">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Frequently asked questions</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0F172A] leading-[1.15]">
              Frequently asked <br className="hidden sm:inline" />
              <span className="text-indigo-600">questions</span>
            </h2>

            <p className="mt-4 text-sm sm:text-base text-[#64748B] leading-relaxed max-w-md">
              Find quick answers to common questions about room reservations, amenities, conflict protection, and managing your study schedules.
            </p>
          </div>

          {/* Right Column: Accordion Items (Col 7) */}
          <div className="lg:col-span-7 space-y-4">
            {faqs.map((faq) => {
              const isOpen = openId === faq.id;

              return (
                <div
                  key={faq.id}
                  className={`bg-white border transition-all duration-300 rounded-3xl p-6 sm:p-7 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] ${
                    isOpen
                      ? 'border-indigo-100 shadow-indigo-100/30'
                      : 'border-[#E2E8F0] hover:border-indigo-100'
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full flex items-center justify-between gap-4 text-left cursor-pointer focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span className="text-base sm:text-lg font-bold text-[#0F172A] tracking-tight">
                      {faq.question}
                    </span>

                    {/* Circular Gradient Icon (As in the image) */}
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 shadow-sm ${
                        isOpen
                          ? 'bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-indigo-200'
                          : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                      }`}
                    >
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200" />
                      ) : (
                        <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200" />
                      )}
                    </div>
                  </button>

                  {/* Smooth Collapse Content */}
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen
                        ? 'grid-rows-[1fr] opacity-100 mt-4'
                        : 'grid-rows-[0fr] opacity-0 mt-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed pr-8 pt-1">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}