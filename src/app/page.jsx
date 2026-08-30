'use client';

import Hero from '@/components/Hero';
import AvailableRooms from '@/components/AvailableRooms';
import WhyStudyNook from '@/components/WhyStudyNook';
import HowItWorks from '@/components/HowItWorks';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#FAFAFB] text-[#0F172A]">
      <Hero />
      <AvailableRooms />
      <WhyStudyNook />
      <HowItWorks />
      <Footer />
      <room />
    </main>
  );
}