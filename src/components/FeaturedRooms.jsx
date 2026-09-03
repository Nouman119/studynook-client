'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Users, Layers, ArrowRight } from 'lucide-react';

export default function FeaturedRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const baseUrl = rawUrl.replace(/\/api\/?$/, '').replace(/\/+$/, '');

        const res = await fetch(`${baseUrl}/api/featured-rooms`);
        const data = await res.json();
        if (data.success) {
          setRooms(data.data);
        }
      } catch (err) {
        console.error('Error fetching featured rooms:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-xs text-slate-500 mt-3 font-medium">Loading available study rooms...</p>
      </div>
    );
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
          Featured Spaces
        </span>
        <h2 className="text-3xl font-extrabold text-slate-900 mt-3 tracking-tight">
          Available Study Rooms
        </h2>
        <p className="text-slate-600 text-sm mt-2">
          Discover quiet, fully-equipped study spaces designed for focused learning and collaboration.
        </p>
      </div>

      {/* Grid Layout: 3 col desktop, 2 tablet, 1 mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {rooms.map((room) => {
          // Truncate description to ~100 characters
          const truncatedDesc =
            room.description?.length > 100
              ? `${room.description.slice(0, 100)}...`
              : room.description || 'Comfortable and fully-equipped study environment.';

          // Amenities chips (max 3, rest as +X more)
          const amenities = room.amenities || [];
          const visibleAmenities = amenities.slice(0, 3);
          const extraCount = amenities.length - 3;

          const imageSrc =
            room.images?.[0] ||
            room.image ||
            'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80';

          return (
            <div
              key={room._id}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col h-full group"
            >
              {/* Room Image - uniform size, object-fit cover */}
              <div className="relative w-full h-52 bg-slate-100 overflow-hidden">
                <img
                  src={imageSrc}
                  alt={room.title || 'Study Room'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-extrabold text-indigo-600 shadow-sm">
                  ${room.pricePerHour || room.hourlyRate || 5}/hr
                </span>
              </div>

              {/* Card Body */}
              <div className="p-5 flex flex-col flex-grow justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-medium">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-slate-400" />
                      {room.floor || 'Floor 1'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      {room.capacity ? `${room.capacity} seats` : '2–4 people'}
                    </span>
                  </div>

                  {/* Room Name */}
                  <h3 className="text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                    {room.title || room.name}
                  </h3>

                  {/* Short Description */}
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {truncatedDesc}
                  </p>

                  {/* Amenities Chips */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {visibleAmenities.map((item, idx) => (
                      <span
                        key={idx}
                        className="bg-slate-100 text-slate-700 text-[11px] font-medium px-2.5 py-0.5 rounded-md"
                      >
                        {item}
                      </span>
                    ))}
                    {extraCount > 0 && (
                      <span className="bg-indigo-50 text-indigo-600 text-[11px] font-semibold px-2 py-0.5 rounded-md">
                        +{extraCount} more
                      </span>
                    )}
                  </div>
                </div>

                {/* View Details Button */}
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <Link
                    href={`/rooms/${room._id}`}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Explore All Rooms Link */}
      <div className="text-center mt-12">
        <Link
          href="/rooms"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-300 hover:border-indigo-600 text-slate-800 hover:text-indigo-600 font-semibold text-sm transition-all shadow-sm"
        >
          <span>Explore All Study Rooms</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}