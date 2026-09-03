'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  MapPin,
  Users,
  Layers,
  SlidersHorizontal,
  ArrowRight,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const API_BASE_URL = rawUrl.replace(/\/api\/?$/, '').replace(/\/+$/, '');

export default function AllRoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Dynamic Browser Tab Title (Requirement: All Rooms Page)
 useEffect(() => {
    if (typeof window !== 'undefined') {
      document.title = 'StudyNook – All Rooms';
    }
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/rooms`);
      const data = await res.json();
      if (data?.success) {
        setRooms(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Categories list
  const categories = useMemo(() => {
    return ['All', ...new Set(rooms.map((r) => r.category).filter(Boolean))];
  }, [rooms]);

  // Optimized Search, Filter, and Sort using useMemo
  const filteredRooms = useMemo(() => {
    return rooms
      .filter((room) => {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          room.title?.toLowerCase().includes(query) ||
          room.description?.toLowerCase().includes(query) ||
          room.floor?.toLowerCase().includes(query) ||
          room.location?.toLowerCase().includes(query);
        const matchesCategory =
          selectedCategory === 'All' || room.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === 'low-high') return (a.pricePerHour || 0) - (b.pricePerHour || 0);
        if (sortBy === 'high-low') return (b.pricePerHour || 0) - (a.pricePerHour || 0);
        return 0;
      });
  }, [rooms, searchQuery, selectedCategory, sortBy]);

  // Reset to page 1 when search or filter criteria change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, sortBy]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstItem, indexOfLastItem);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white dark:bg-zinc-950">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-xs text-slate-500 mt-3 font-medium tracking-wide">
          Loading available study rooms...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-white dark:bg-zinc-950 min-h-screen text-[#0F172A] dark:text-white">

      {/* Page Header */}
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-3 border border-indigo-100 dark:border-zinc-800">
          <Sparkles className="w-3.5 h-3.5" /> Explore Workspace Collection
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">Discover Study Rooms</h1>
        <p className="text-gray-500 dark:text-zinc-400 text-sm">Find quiet, fully-equipped spaces tailored for your productivity and team collaboration.</p>
      </div>

      {/* Horizontal Filter & Search Bar */}
      <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-gray-100 dark:border-zinc-800 rounded-3xl p-4 sm:p-5 shadow-xl shadow-zinc-100 dark:shadow-none mb-10 space-y-4">

        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-[420px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by room title, floor, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50/80 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full md:w-auto px-4 py-3 bg-gray-50/80 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition cursor-pointer"
            >
              <option value="default">Default Order</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Filter Chips */}
        {categories.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-none border-t border-gray-100 dark:border-zinc-800/80">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Categories:
            </span>
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 scale-105'
                      : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-700'
                    }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}

      </div>

      {/* Room Cards Grid (Uniform aspect ratio & size) */}
      {currentRooms.length === 0 ? (
        <div className="bg-gray-50 dark:bg-zinc-900 border border-dashed border-gray-200 dark:border-zinc-800 rounded-3xl p-16 text-center text-gray-500 dark:text-zinc-400">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">No rooms found</h3>
          <p className="text-sm">Try adjusting your search query or selected category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentRooms.map((room) => {
            const amenities = room.amenities || [];
            const visibleAmenities = amenities.slice(0, 3);
            const extraCount = amenities.length - 3;
            const thumbnail = room.image || room.images?.[0] || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80';

            return (
              <div
                key={room._id}
                className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-52 overflow-hidden bg-gray-100 dark:bg-zinc-800">
                    <img
                      src={thumbnail}
                      alt={room.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                    <span className="absolute top-3.5 right-3.5 px-3.5 py-1.5 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md text-indigo-600 dark:text-indigo-400 text-xs font-extrabold rounded-full shadow-lg">
                      ${room.pricePerHour} <span className="text-[10px] font-normal text-gray-500">/ hr</span>
                    </span>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-2 font-medium">
                      <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                        {room.category || 'Study Space'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Layers className="w-3 h-3 text-indigo-500" />
                        {room.floor || '1st Floor'}
                      </span>
                    </div>

                    <h3 className="text-lg font-extrabold text-gray-900 dark:text-white mb-2 line-clamp-1">
                      {room.title}
                    </h3>

                    <p className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-zinc-400 mb-3 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span className="truncate">{room.location || room.floor || 'Campus Library'}</span>
                    </p>

                    <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400 line-clamp-2 leading-relaxed mb-4">
                      {room.description}
                    </p>

                    {/* Amenities Chips with +X more */}
                    {amenities.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {visibleAmenities.map((amenity, idx) => (
                          <span
                            key={idx}
                            className="bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 text-[10px] font-semibold px-2 py-0.5 rounded-md"
                          >
                            {amenity}
                          </span>
                        ))}
                        {extraCount > 0 && (
                          <span className="bg-indigo-50 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold px-2 py-0.5 rounded-md">
                            +{extraCount} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-6 pb-6 pt-3 flex items-center justify-between border-t border-gray-100 dark:border-zinc-800/80">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-zinc-400 font-semibold">
                    <Users className="w-4 h-4 text-indigo-600" /> {room.capacity} Seats
                  </div>
                  <Link
                    href={`/rooms/${room._id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition"
                  >
                    View Details <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-600 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalPages }, (_, index) => {
              const pageNumber = index + 1;
              const isActive = currentPage === pageNumber;
              return (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`w-10 h-10 rounded-xl text-xs font-bold transition-all cursor-pointer ${isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 scale-105'
                      : 'bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800'
                    }`}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-600 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
}