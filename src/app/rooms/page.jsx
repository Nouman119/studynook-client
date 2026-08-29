'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, MapPin, Users, ArrowRight, X, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import Footer from '@/components/Footer';

export default function AllRoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [maxPrice, setMaxPrice] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    async function fetchRooms() {
      try {
        const res = await fetch('http://localhost:5000/api/rooms');
        const data = await res.json();
        if (data && data.success) {
          setRooms(data.data || []);
        } else if (Array.isArray(data)) {
          setRooms(data);
        }
      } catch (err) {
        console.error('Failed to fetch rooms:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchRooms();
  }, []);

  const handleAmenityChange = (amenity) => {
    setCurrentPage(1);
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(item => item !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleReset = () => {
    setSearchQuery('');
    setSelectedAmenities([]);
    setMaxPrice('');
    setCurrentPage(1);
  };

  const filteredRooms = rooms.filter((room) => {
    const titleMatch = (room.title || room.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const priceVal = room.pricePerHour || room.price_per_hour || 0;
    const priceMatch = maxPrice === '' || priceVal <= Number(maxPrice);
    const roomAmenities = room.amenities || [];
    const amenityMatch = selectedAmenities.every(am => roomAmenities.includes(am));

    return titleMatch && priceMatch && amenityMatch;
  });

  const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstItem, indexOfLastItem);

  const amenitiesList = ['Wi-Fi', 'Whiteboard', 'Projector', 'Power Outlets', 'Quiet Zone', 'Air Conditioning'];

  return (
    <div className="min-h-screen bg-[#FAFAFB] text-[#0F172A] flex flex-col justify-between">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A]">
            All Study Rooms
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#64748B]">
            Browse the full catalog. Filter by amenity, price, or search by name.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          <aside className="lg:col-span-1 bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2 font-bold text-[#0F172A]">
                <Filter className="w-4 h-4 text-[#6366F1]" />
                <span>Refine</span>
              </div>
              <button
                onClick={handleReset}
                className="text-xs font-semibold text-[#64748B] hover:text-[#6366F1] transition-colors flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" /> Reset
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-2">
                Search by name
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="e.g. Quiet Pod"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-9 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-[#6366F1] transition-colors"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-3">
                Amenities
              </label>
              <div className="space-y-2.5">
                {amenitiesList.map((amenity, idx) => (
                  <label key={idx} className="flex items-center gap-3 text-sm text-zinc-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(amenity)}
                      onChange={() => handleAmenityChange(amenity)}
                      className="w-4 h-4 rounded border-zinc-300 text-[#6366F1] focus:ring-[#6366F1]"
                    />
                    <span>{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-2">
                Max Hourly Rate ($)
              </label>
              <input
                type="number"
                placeholder="e.g. 20"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-[#6366F1] transition-colors"
              />
            </div>
          </aside>

          <main className="lg:col-span-3">
            
            <div className="mb-6 text-sm font-medium text-[#64748B]">
              Showing <span className="text-[#0F172A] font-bold">{filteredRooms.length > 0 ? indexOfFirstItem + 1 : 0}</span>-
              <span className="text-[#0F172A] font-bold">{Math.min(indexOfLastItem, filteredRooms.length)}</span> of {filteredRooms.length} rooms
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="bg-white rounded-3xl p-4 h-96 animate-pulse border border-[#E2E8F0]">
                    <div className="bg-zinc-200 h-48 rounded-2xl w-full mb-4"></div>
                    <div className="bg-zinc-200 h-6 rounded w-3/4 mb-2"></div>
                    <div className="bg-zinc-200 h-4 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : currentRooms.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-[#E2E8F0]">
                <p className="text-base font-semibold text-[#0F172A]">No rooms match your filter criteria.</p>
                <button
                  onClick={handleReset}
                  className="mt-4 px-4 py-2 bg-[#6366F1] text-white text-xs font-semibold rounded-xl"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                  {currentRooms.map((room) => (
                    <div
                      key={room._id}
                      className="bg-white border border-[#E2E8F0] rounded-3xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-zinc-100 mb-4">
                          <img
                            src={room.images?.[0] || room.image || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000'}
                            alt={room.title || room.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>

                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="text-lg font-bold text-[#0F172A] tracking-tight">
                            {room.title || room.name}
                          </h3>
                          <span className="px-2.5 py-1 rounded-xl bg-[#EEF2FF] text-[#4F46E5] text-xs font-bold whitespace-nowrap">
                            ${room.pricePerHour || room.price_per_hour}/hr
                          </span>
                        </div>

                        <p className="text-xs text-[#64748B] line-clamp-2 mb-4 leading-relaxed">
                          {room.description}
                        </p>

                        <div className="grid grid-cols-2 gap-2 py-2.5 border-t border-b border-[#E2E8F0] text-xs font-medium text-[#64748B] mb-3">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#6366F1]" />
                            <span>{room.location || room.floor || 'Floor 1'}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-[#6366F1]" />
                            <span>{room.capacity} people</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mb-5">
                          {room.amenities?.slice(0, 3).map((amenity, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-lg bg-zinc-50 border border-zinc-200 text-[11px] font-medium text-zinc-600"
                            >
                              {amenity}
                            </span>
                          ))}
                          {room.amenities?.length > 3 && (
                            <span className="px-2 py-0.5 rounded-lg bg-zinc-50 border border-zinc-200 text-[11px] font-medium text-zinc-500">
                              +{room.amenities.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      <Link
                        href={`/rooms/${room._id}`}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-[#E2E8F0] text-[#0F172A] text-xs font-semibold hover:bg-zinc-50 transition-colors"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#6366F1]" />
                      </Link>
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 py-4">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-xl border border-[#E2E8F0] bg-white text-zinc-600 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                      <button
                        key={num}
                        onClick={() => setCurrentPage(num)}
                        className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${
                          currentPage === num
                            ? 'bg-[#6366F1] text-white shadow-sm shadow-indigo-500/25'
                            : 'bg-white border border-[#E2E8F0] text-zinc-700 hover:bg-zinc-50'
                        }`}
                      >
                        {num}
                      </button>
                    ))}

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-xl border border-[#E2E8F0] bg-white text-zinc-600 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}

          </main>

        </div>

      </div>

      <Footer />
    </div>
  );
}