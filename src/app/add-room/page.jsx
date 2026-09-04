'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { 
  Building, Layers, DollarSign, Users, Image as ImageIcon, 
  AlignLeft, PlusCircle, ArrowLeft
} from 'lucide-react';

const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const API_BASE_URL = rawUrl.replace(/\/api\/?$/, '').replace(/\/+$/, '');

// Requirement 4.1: নির্দিষ্ট ৬টি Amenities
const requiredAmenities = [
  'Whiteboard',
  'Projector',
  'Wi‑Fi',
  'Power Outlets',
  'Quiet Zone',
  'Air Conditioning'
];

export default function AddRoomPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth() || {};

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    floor: '',
    pricePerHour: '',
    capacity: '',
    image: '',
    description: '',
    amenities: []
  });

  // Dynamic Browser Tab Title
  useEffect(() => {
    document.title = 'StudyNook – Add Room';
  }, []);

  // Private Route Protection
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
        : [...prev.amenities, amenity]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) return toast.error('Room Name is required');
    if (!formData.floor.trim()) return toast.error('Floor is required');
    if (!formData.pricePerHour || Number(formData.pricePerHour) <= 0) {
      return toast.error('Please enter a valid hourly rate');
    }
    if (!formData.capacity || Number(formData.capacity) <= 0) {
      return toast.error('Please enter a valid capacity');
    }
    if (!formData.description.trim()) return toast.error('Description is required');

    try {
      setLoading(true);
      const roomData = {
        title: formData.title.trim(),
        floor: formData.floor.trim(),
        pricePerHour: Number(formData.pricePerHour),
        capacity: Number(formData.capacity),
        image: formData.image.trim(),
        images: formData.image.trim() ? [formData.image.trim()] : [],
        description: formData.description.trim(),
        amenities: formData.amenities
      };

      const res = await fetch(`${API_BASE_URL}/api/rooms`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(roomData),
      });

      const data = await res.json();

      if (res.ok && data?.success) {
        toast.success('Room added successfully');
        setFormData({
          title: '',
          floor: '',
          pricePerHour: '',
          capacity: '',
          image: '',
          description: '',
          amenities: []
        });
        router.push('/my-listings');
      } else {
        toast.error(data?.message || 'Failed to add room.');
      }
    } catch (error) {
      console.error('Add room error:', error);
      toast.error('An unexpected network error occurred.');
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
      <div className="max-w-5xl mx-auto">
        
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 mb-6 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">List a New Room</h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">Add detailed information about your study room to attract more scholars.</p>
        </div>

        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-6 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-10">
            
            {/* Basic Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-extrabold text-slate-800 border-b border-slate-100 pb-3">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Room Name *</label>
                  <div className="relative">
                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g., Silent Pod Gamma"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Floor *</label>
                  <div className="relative">
                    <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      name="floor"
                      value={formData.floor}
                      onChange={handleInputChange}
                      placeholder="e.g., 3rd Floor"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Hourly Rate ($) *</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      name="pricePerHour"
                      min="1"
                      value={formData.pricePerHour}
                      onChange={handleInputChange}
                      placeholder="e.g., 15"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Capacity (Seats) *</label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      name="capacity"
                      min="1"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      placeholder="e.g., 4"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Media Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-extrabold text-slate-800 border-b border-slate-100 pb-3">Media</h3>
              
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Image URL (from internet)</label>
                <div className="relative">
                  <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Amenities & Description */}
            <div className="space-y-6">
              <h3 className="text-lg font-extrabold text-slate-800 border-b border-slate-100 pb-3">Amenities & Details</h3>
              
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">Select Amenities</label>
                <div className="flex flex-wrap gap-2.5">
                  {requiredAmenities.map((amenity) => {
                    const isSelected = formData.amenities.includes(amenity);
                    return (
                      <button
                        type="button"
                        key={amenity}
                        onClick={() => toggleAmenity(amenity)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                          isSelected 
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/20 scale-105' 
                            : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50'
                        }`}
                      >
                        {amenity}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Room Description *</label>
                <div className="relative">
                  <AlignLeft className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
                  <textarea
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe the environment, rules, and vibe of the workspace..."
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all resize-none"
                    required
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Listed By Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
              <div>
                <p className="text-[10px] font-bold text-indigo-400 uppercase">Listed By</p>
                <p className="text-sm font-bold text-indigo-900 truncate mt-0.5">{user?.name || 'Authorized Scholar'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-indigo-400 uppercase">Contact Email</p>
                <p className="text-sm font-bold text-indigo-900 truncate mt-0.5">{user?.email}</p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-2xl shadow-lg shadow-indigo-600/25 transition-all disabled:opacity-50 text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center gap-2">Processing...</span>
                ) : (
                  <>
                    <PlusCircle className="w-5 h-5" /> Publish Room
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