'use client';

import { useState, useEffect, useCallback } from 'react';
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
  ChevronRight,
  Filter,
  Check,
  X
} from 'lucide-react';

const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const API_BASE_URL = rawUrl.replace(/\/api\/?$/, '').replace(/\/+$/, '');

// Common amenities based on StudyNook room listings
const AVAILABLE_AMENITIES = [
  'High-Speed Wi-Fi',
  'Whiteboard',
  'Projector / Display',
  'Power Outlets',
  'Ergonomic Chairs',
  'Air Conditioning',
  'Soundproofing',
  'Coffee / Water'
];

export default function AllRoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search and Filter States (PDF Requirement 7.2)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [maxPrice, setMaxPrice] = useState(100);
  const [sortBy, setSortBy] = useState('default');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Dynamic Browser Tab Title
  useEffect(() => {
    document.title = 'StudyNook – Available Rooms';
  }, []);

  // Fetch Rooms from Backend with dynamic query parameters ($regex, $in, $lte, sort)
  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }
      if (selectedCategory && selectedCategory !== 'All') {
        params.append('category', selectedCategory);
      }
      if (selectedAmenities.length > 0) {
        params.append('amenities', selectedAmenities.join(','));
      }
      if (maxPrice < 100) {
        params.append('maxPrice', maxPrice.toString());
      }
      if (sortBy !== 'default') {
        params.append('sort', sortBy);
      }

      const res = await fetch(`${API_BASE_URL}/api/rooms?${params.toString()}`);
      const data = await res.json();
      if (data?.success) {
        setRooms(data.data || []);
      } else {
        setRooms([]);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory, selectedAmenities, maxPrice, sortBy]);

  // Debounced search & filter trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRooms();
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [fetchRooms]);

  // Toggle Amenities Checkbox
  const toggleAmenity = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((item) => item !== amenity)
        : [...prev, amenity]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedAmenities([]);
    setMaxPrice(100);
    setSortBy('default');
  };

  // Pagination calculations
  const totalPages = Math.ceil(rooms.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRooms = rooms.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-white dark:bg-zinc-950 min-h-screen text-[#0F172A] dark:text-white">

      {/* Page Header */}
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-3 border border-indigo-100 dark:border-zinc-800">
          <Sparkles className="w-3.5 h-3.5" /> Explore Workspace Collection
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">Discover Study Rooms</h1>
        <p className="text-gray-500 dark:text-zinc-400 text-sm">
          Find quiet, fully-equipped spaces tailored for your productivity and team collaboration.
        </p>
      </div>

      {/* Main Filter & Search Hub */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-5 shadow-xl shadow-zinc-100 dark:shadow-none mb-8 space-y-4">

        {/* Top Controls: Search Bar, Filter Toggle & Sort */}
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by room title or floor (e.g. Quiet Nook)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
            <button
              onClick={() => setShowFilterDrawer(!showFilterDrawer)}
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold border transition cursor-pointer ${
                selectedAmenities.length > 0 || maxPrice < 100
                  ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800'
                  : 'bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 hover:bg-gray-100'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Amenities & Price</span>
              {(selectedAmenities.length > 0 || maxPrice < 100) && (
                <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              )}
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition cursor-pointer"
            >
              <option value="default">Default Sorting</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Collapsible Amenities & Range Filter Box (PDF 7.2 Requirement) */}
        {showFilterDrawer && (
          <div className="pt-4 border-t border-gray-100 dark:border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500 dark:text-zinc-400">
                Filter by Amenities ($in filter)
              </span>
              <button
                onClick={clearAllFilters}
                className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
              >
                Reset Filters
              </button>
            </div>

            {/* Checkbox grid for amenities */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {AVAILABLE_AMENITIES.map((amenity) => {
                const isChecked = selectedAmenities.includes(amenity);
                return (
                  <label
                    key={amenity}
                    onClick={() => toggleAmenity(amenity)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium cursor-pointer transition select-none ${
                      isChecked
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-gray-50 dark:bg-zinc-800/60 border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 hover:bg-gray-100'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                        isChecked ? 'border-white bg-indigo-600' : 'border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-900'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className="truncate">{amenity}</span>
                  </label>
                );
              })}
            </div>

            {/* Hourly Rate ($lte) range slider */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs font-semibold text-gray-600 dark:text-zinc-300">
                Max Hourly Rate: <span className="font-extrabold text-indigo-600">${maxPrice}/hr</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full sm:w-64 accent-indigo-600 cursor-pointer"
              />
            </div>
          </div>
        )}

      </div>

      {/* Room Cards Grid */}
      {loading ? (
        <div className="min-h-[50vh] flex flex-col items-center justify-center">
          <div className="w-9 h-9 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-xs text-slate-500 mt-3 font-medium tracking-wide">
            Filtering study rooms...
          </p>
        </div>
      ) : currentRooms.length === 0 ? (
        <div className="bg-gray-50 dark:bg-zinc-900 border border-dashed border-gray-200 dark:border-zinc-800 rounded-3xl p-16 text-center text-gray-500 dark:text-zinc-400 space-y-3">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">No matching rooms found</h3>
          <p className="text-xs sm:text-sm max-w-sm mx-auto">
            Try loosening your search query, adjusting the max price slider, or unchecking amenities.
          </p>
          <button
            onClick={clearAllFilters}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentRooms.map((room) => {
            const amenities = room.amenities || [];
            const visibleAmenities = amenities.slice(0, 3);
            const extraCount = amenities.length - 3;
            const thumbnail =
              room.image ||
              room.images?.[0] ||
              'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80';

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

                    {/* Amenities Chips */}
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
                  className={`w-10 h-10 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
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