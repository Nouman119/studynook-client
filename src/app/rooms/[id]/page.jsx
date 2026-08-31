'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, MapPin, Users, DollarSign, SlidersHorizontal, ArrowRight } from 'lucide-react';

const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const API_BASE_URL = rawUrl.replace(/\/api\/?$/, '').replace(/\/+$/, '');

export default function AllRoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // সার্চ, ফিল্টার এবং সর্টিং স্টেট
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');

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

  // ক্যাটাগরি লিস্ট ডাইনামিক্যালি তৈরি করা
  const categories = ['All', ...new Set(rooms.map((r) => r.category).filter(Boolean))];

  // ফিল্টারিং এবং সর্টিং লজিক
  const filteredRooms = rooms
    .filter((room) => {
      const matchesSearch =
        room.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.location?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || room.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'low-high') return a.pricePerHour - b.pricePerHour;
      if (sortBy === 'high-low') return b.pricePerHour - a.pricePerHour;
      return 0; // default
    });

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Explore Study Rooms</h1>
        <p className="text-gray-500 text-sm">Discover quiet, fully-equipped spaces tailored for your productivity.</p>
      </div>

      {/* Search, Filter & Sort Controls Bar */}
      <div className="bg-white border rounded-2xl p-4 shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by room title or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          />
        </div>

        {/* Category Filter & Sorting */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Sorting Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="default">Sort by: Default</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Room Cards Grid */}
      {filteredRooms.length === 0 ? (
        <div className="bg-white border rounded-2xl p-16 text-center text-gray-500 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">No rooms found</h3>
          <p className="text-sm">Try adjusting your search query or filter criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <div
              key={room._id}
              className="bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Thumbnail */}
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img
                    src={room.images?.[0] || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80'}
                    alt={room.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <span className="absolute top-3 right-3 px-3 py-1 bg-white/95 backdrop-blur-sm text-indigo-600 text-xs font-bold rounded-full shadow-sm">
                    ${room.pricePerHour} / hr
                  </span>
                </div>

                {/* Content */}
                <div className="p-5">
                  <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                    {room.category || 'Study Space'}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 mt-1 mb-2 line-clamp-1">{room.title}</h3>
                  <p className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-indigo-600" /> {room.location}
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">{room.description}</p>
                </div>
              </div>

              {/* Card Footer / Details Link */}
              <div className="px-5 pb-5 pt-0 flex items-center justify-between border-t border-gray-50 pt-4">
                <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                  <Users className="w-3.5 h-3.5 text-indigo-600" /> {room.capacity} Seats
                </div>
                <Link
                  href={`/rooms/${room._id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition"
                >
                  View Details <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}