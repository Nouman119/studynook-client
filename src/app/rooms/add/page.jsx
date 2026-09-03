'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { 
  Building, DollarSign, Users, Image as ImageIcon, 
  AlignLeft, PlusCircle, ArrowLeft, Layers, CheckSquare, Square
} from 'lucide-react';

const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const API_BASE_URL = rawUrl.replace(/\/api\/?$/, '').replace(/\/+$/, '');

// Requirement 4.1: নির্দিষ্ট এই ৬টি Amenities চেকবক্সই থাকতে হবে
const requiredAmenities = [
  'Whiteboard',
  'Projector',
  'Wi‑Fi',
  'Power Outlets',
  'Quiet Zone',
  'Air Conditioning',
];

export default function AddRoomPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth() || {};

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    floor: '',
    capacity: '',
    pricePerHour: '',
    amenities: [],
  });

  // Dynamic Browser Tab Title
  useEffect(() => {
    document.title = 'StudyNook – Add Room';
  }, []);

  // Private Route Protection (লগইন না থাকলে রিডাইরেক্ট)
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?from=/add-room');
    }
  }, [user, authLoading, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleAmenity = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) return toast.error('Room Name is required');
    if (!formData.description.trim()) return toast.error('Description is required');
    if (!formData.floor.trim()) return toast.error('Floor information is required');
    if (!formData.capacity || Number(formData.capacity) <= 0) return toast.error('Please provide a valid capacity');
    if (!formData.pricePerHour || Number(formData.pricePerHour) <= 0) return toast.error('Please provide a valid hourly rate');

    setLoading(true);

    try {
      const roomPayload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        image: formData.image.trim(),
        images: formData.image.trim() ? [formData.image.trim()] : [],
        floor: formData.floor.trim(),
        capacity: Number(formData.capacity),
        pricePerHour: Number(formData.pricePerHour),
        amenities: formData.amenities, // joined into an array of strings
      };

      const res = await fetch(`${API_BASE_URL}/api/rooms`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roomPayload),
      });

      const data = await res.json();

      if (res.ok && data?.success) {
        // Requirement: toast "Room added successfully" and redirect to /my-listings or /rooms
        toast.success('Room added successfully');
        router.push('/rooms');
      } else {
        toast.error(data?.message || 'Failed to add study room.');
      }
    } catch (err) {
      console.error('Add room error:', err);
      toast.error('Network error. Failed to add room.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-800">
      <div className="max-w-3xl mx-auto">
        
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 mb-6 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Add a Study Room</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Create a new quiet space listing for scholars and students.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Room Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Room Name *
              </label>
              <div className="relative">
                <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Quiet Focus Pod A"
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Description *
              </label>
              <div className="relative">
                <AlignLeft className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                <textarea
                  name="description"
                  required
                  rows="3"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the noise level, table sizes, and study setup..."
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition resize-none"
                />
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Image URL (from internet)
              </label>
              <div className="relative">
                <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                />
              </div>
            </div>

            {/* Floor, Capacity & Hourly Rate Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Floor */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Floor *
                </label>
                <div className="relative">
                  <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="floor"
                    required
                    value={formData.floor}
                    onChange={handleInputChange}
                    placeholder="e.g., 3rd Floor"
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                  />
                </div>
              </div>

              {/* Capacity */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Capacity (Seats) *
                </label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    name="capacity"
                    min="1"
                    required
                    value={formData.capacity}
                    onChange={handleInputChange}
                    placeholder="e.g., 4"
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                  />
                </div>
              </div>

              {/* Hourly Rate */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Hourly Rate ($) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    name="pricePerHour"
                    min="1"
                    required
                    value={formData.pricePerHour}
                    onChange={handleInputChange}
                    placeholder="e.g., 5"
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                  />
                </div>
              </div>
            </div>

            {/* Amenities Checkboxes */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                Amenities (Check all that apply)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {requiredAmenities.map((amenity) => {
                  const isChecked = formData.amenities.includes(amenity);
                  return (
                    <div
                      key={amenity}
                      onClick={() => toggleAmenity(amenity)}
                      className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-semibold cursor-pointer transition select-none ${
                        isChecked
                          ? 'bg-indigo-50/80 border-indigo-200 text-indigo-700 shadow-2xs'
                          : 'bg-slate-50/50 border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-indigo-600 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                      <span>{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-600/20 transition disabled:opacity-50 text-sm flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4" />
                    <span>Add Room</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}