'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, MapPin, Users, Calendar, CheckCircle2 } from 'lucide-react';
import Footer from '@/components/Footer';

// কিছু ভিন্ন ভিন্ন হোস্ট এবং তাদের প্রোফাইল পিকচারের কালেকশন
const mockHosts = [
  { name: 'Maya Chen', email: 'maya@studynook.demo', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200' },
  { name: 'Tanvir Ahmed', email: 'tanvir@studynook.demo', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200' },
  { name: 'Sarah Jenkins', email: 'sarah@studynook.demo', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200' },
  { name: 'Rahim Chowdhury', email: 'rahim@studynook.demo', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200' },
  { name: 'Elena Rostova', email: 'elena@studynook.demo', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200' }
];

export default function SingleRoomPage() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function fetchRoomDetails() {
      try {
        const res = await fetch(`http://localhost:5000/api/rooms/${id}`);
        const result = await res.json();
        
        const roomData = result.success ? result.data : result;

        if (res.ok && roomData) {
          setRoom(roomData);
        }
      } catch (err) {
        console.error('Failed to fetch room details:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchRoomDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFB] flex flex-col justify-between">
        <div className="max-w-7xl mx-auto px-4 py-20 animate-pulse w-full">
          <div className="h-8 bg-zinc-200 rounded w-32 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 h-[400px] bg-zinc-200 rounded-3xl"></div>
            <div className="h-[300px] bg-zinc-200 rounded-3xl"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-[#FAFAFB] flex flex-col justify-between">
        <div className="max-w-7xl mx-auto px-4 py-32 text-center">
          <h2 className="text-2xl font-bold text-[#0F172A] mb-4">Room not found</h2>
          <button
            onClick={() => router.back()}
            className="px-6 py-2.5 bg-[#6366F1] text-white text-sm font-semibold rounded-xl shadow-sm"
          >
            Go Back
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  // রুমের আইডি বা টাইটেল দিয়ে একটি নির্দিষ্ট হোস্ট ও র‍্যান্ডম ডেট সিলেক্ট করা যাতে প্রতি রুমে আলাদা দেখায়
  const hostIndex = room._id ? room._id.charCodeAt(room._id.length - 1) % mockHosts.length : 0;
  const assignedHost = room.host || mockHosts[hostIndex];

  // র‍্যান্ডম বা ভিন্ন ডেট জেনারেট করার লজিক
  const formattedDate = room.createdAt 
    ? new Date(room.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'August 15, 2026';

  return (
    <div className="min-h-screen bg-[#FAFAFB] text-[#0F172A] flex flex-col justify-between">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#64748B] hover:text-[#6366F1] transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back</span>
        </button>

        {/* Main Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Image & Details */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Room Image */}
            <div className="relative h-[350px] sm:h-[450px] w-full rounded-3xl overflow-hidden bg-zinc-100 shadow-sm border border-[#E2E8F0]">
              <img
                src={room.images?.[0] || room.image || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000'}
                alt={room.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-xs font-semibold text-emerald-600 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Available Now
                </span>
              </div>
            </div>

            {/* Room Header Info */}
            <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A]">
                  {room.title}
                </h1>
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EEF2FF] border border-indigo-100 text-[#4F46E5] text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{room.bookingsCount || 12} bookings</span>
                </div>
              </div>

              <p className="text-xs font-medium text-[#64748B] mb-6">
                Listed on {formattedDate}
              </p>

              <p className="text-sm sm:text-base text-[#64748B] leading-relaxed mb-8">
                {room.description}
              </p>

              {/* Amenities Section */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F172A] mb-4">
                  Amenities
                </h3>
                <div className="flex flex-wrap gap-2">
                  {room.amenities?.map((amenity, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-[#FAFAFB] border border-[#E2E8F0] text-xs font-semibold text-zinc-700 flex items-center gap-1.5"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Pricing & Booking Widget / Host Info */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Pricing & Booking Card */}
            <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-sm">
              <div className="flex items-baseline justify-between mb-6 pb-6 border-b border-[#E2E8F0]">
                <div>
                  <span className="text-3xl font-extrabold text-[#0F172A]">
                    ${room.pricePerHour}
                  </span>
                  <span className="text-xs font-medium text-[#64748B] ml-1">/ hour</span>
                </div>
              </div>

              {/* Room Quick Specs */}
              <div className="space-y-3 mb-6 text-sm text-[#64748B]">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-[#6366F1]" />
                  <span>{room.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-[#6366F1]" />
                  <span>Up to {room.capacity} people</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-[#6366F1]" />
                  <span>{room.bookingsCount || 12} total bookings</span>
                </div>
              </div>

              {/* Booking Action Button */}
              <button
                onClick={() => alert('Booking feature coming up next!')}
                className="w-full py-3.5 px-4 rounded-xl bg-[#0F172A] hover:bg-zinc-800 text-white text-sm font-semibold transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Login to Book</span>
              </button>
            </div>

            {/* Listed By / Host Info Card (Dynamic & Varied) */}
            <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-4">
                Listed By
              </h4>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-100 border border-zinc-200">
                  <img
                    src={assignedHost.avatar}
                    alt={assignedHost.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-[#0F172A]">{assignedHost.name}</h5>
                  <p className="text-xs text-[#64748B]">{assignedHost.email}</p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}