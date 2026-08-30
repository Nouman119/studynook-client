'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Users, MapPin } from 'lucide-react';

export default function AvailableRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getRooms() {
      try {
        const res = await fetch('http://localhost:5000/api/rooms');
        const data = await res.json();
        if (data && data.success) {
          // Slice to show only first 6 rooms on the homepage
          setRooms((data.data || []).slice(0, 6));
        } else if (Array.isArray(data)) {
          setRooms(data.slice(0, 6));
        }
      } catch (err) {
        console.error('Failed to fetch rooms:', err);
      } finally {
        setLoading(false);
      }
    }

    getRooms();
  }, []);

  return (
    <section className="py-24 bg-gradient-to-b from-[#EEF2FF]/60 via-white to-[#FAFAFB] relative overflow-hidden">
      {/* Decorative Blur Elements */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-indigo-100/50 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-sky-100/40 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#6366F1] bg-white px-3.5 py-1.5 rounded-full border border-indigo-100 shadow-2xs">
              Explore Spaces
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A] mt-4">
              Featured Study Rooms
            </h2>
            <p className="mt-2 text-base text-[#64748B] max-w-2xl">
              Find the perfect environment for your academic focus. Discover our top-rated quiet spaces and essential amenities.
            </p>
          </div>
          <Link
            href="/rooms"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#0F172A] hover:bg-zinc-800 transition-colors shadow-sm self-start md:self-auto"
          >
            View All Rooms
          </Link>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white/80 backdrop-blur-md rounded-3xl p-4 h-96 animate-pulse border border-[#E2E8F0]">
                <div className="bg-zinc-200 h-48 rounded-2xl w-full mb-4"></div>
                <div className="bg-zinc-200 h-6 rounded w-3/4 mb-2"></div>
                <div className="bg-zinc-200 h-4 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-12 bg-white/80 backdrop-blur-md rounded-3xl border border-[#E2E8F0]">
            <p className="text-[#64748B] text-sm font-medium">No study rooms found in the database yet.</p>
          </div>
        ) : (
          /* Room Cards Grid (Max 6 Items) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room) => (
              <div
                key={room._id}
                className="bg-white/90 backdrop-blur-md border border-indigo-50/80 rounded-3xl p-5 shadow-[0_10px_30px_-10px_rgba(99,102,241,0.08)] hover:shadow-[0_20px_40px_-15px_rgba(99,102,241,0.15)] hover:border-indigo-200 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Room Image & Badge */}
                  <div className="relative h-52 w-full rounded-2xl overflow-hidden bg-zinc-100 mb-5">
                    <img
                      src={room.images?.[0] || room.image || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000'}
                      alt={room.title || room.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-semibold text-emerald-600 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Available Now
                      </span>
                    </div>
                  </div>

                  {/* Title & Price */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-xl font-bold text-[#0F172A] tracking-tight">
                      {room.title || room.name}
                    </h3>
                    <span className="px-3 py-1 rounded-xl bg-[#EEF2FF] text-[#4F46E5] text-xs font-bold whitespace-nowrap">
                      ${room.pricePerHour || room.price_per_hour}/hr
                    </span>
                  </div>

                  <p className="text-sm text-[#64748B] line-clamp-2 mb-4">
                    {room.description}
                  </p>

                  {/* Meta Details */}
                  <div className="grid grid-cols-2 gap-2 py-3 border-t border-b border-indigo-50 text-xs font-medium text-[#64748B] mb-4">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-[#6366F1]" />
                      <span>{room.location || room.floor}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-[#6366F1]" />
                      <span>Up to {room.capacity} Person</span>
                    </div>
                  </div>

                  {/* Amenities Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {room.amenities?.map((amenity, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-[#FAFAFB] border border-zinc-200/60 text-xs font-medium text-zinc-600"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                {/* View Details Button */}
                <Link
                  href={`/rooms/${room._id}`}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#EEF2FF] border border-indigo-100 text-[#4F46E5] text-sm font-semibold hover:bg-[#6366F1] hover:text-white hover:border-[#6366F1] transition-all shadow-2xs"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}