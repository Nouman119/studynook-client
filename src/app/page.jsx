'use client';

import Hero from '@/components/Hero';
import WhyStudyNook from '@/components/WhyStudyNook';
import HowItWorks from '@/components/HowItWorks';
import FaqSection from '@/components/FaqSection';
import FeaturedRooms from '@/components/FeaturedRooms';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#FAFAFB] text-[#0F172A]">
      <Hero />
      <FeaturedRooms />
      <WhyStudyNook />
      <FaqSection />
      <HowItWorks />
      <Footer />
      <room />
    </main>
  );
}