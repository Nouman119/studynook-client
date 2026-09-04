'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { 
  MapPin, Calendar, ArrowLeft, ShieldCheck, 
  Lock, Waves, X, Layers, 
  BookmarkCheck, Edit3, Trash2, AlertTriangle, Clock, FileText, CheckSquare, Square
} from 'lucide-react';

const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const API_BASE_URL = rawUrl.replace(/\/api\/?$/, '').replace(/\/+$/, '');

const requiredAmenities = [
  'Whiteboard',
  'Projector',
  'Wi‑Fi',
  'Power Outlets',
  'Quiet Zone',
  'Air Conditioning'
];

const ALL_HOURLY_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00'
];

export default function RoomDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth() || {};

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Booking Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [specialNote, setSpecialNote] = useState('');

  // Edit Modal State (Owner only)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    floor: '',
    pricePerHour: '',
    capacity: '',
    image: '',
    description: '',
    amenities: []
  });

  // Delete Modal State (Owner only)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Minimum date selectable (today)
  const todayString = useMemo(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  }, []);

  const fetchRoomDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/rooms/${id}`);
      const data = await res.json();
      if (data?.success) {
        setRoom(data.data);
      } else {
        setRoom(null);
      }
    } catch (error) {
      console.error('Error fetching room details:', error);
      toast.error('Failed to load room details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchRoomDetails();
    }
  }, [id]);

  // Dynamic Browser Tab Title
  useEffect(() => {
    if (room?.title) {
      document.title = `StudyNook – ${room.title}`;
    }
  }, [room]);

  // Check if current user is the owner of this room
  const isOwner = user && (
    (room?.owner && (user?.id === room.owner || user?._id === room.owner)) ||
    (room?.ownerEmail && user?.email === room.ownerEmail) ||
    (room?.creatorEmail && user?.email === room.creatorEmail)
  );

  // Filter available End Times based on selected Start Time (Min 1 hour)
  const availableEndTimes = useMemo(() => {
    const startHour = parseInt(startTime.split(':')[0], 10);
    const possibleEnds = [
      '09:00', '10:00', '11:00', '12:00', '13:00',
      '14:00', '15:00', '16:00', '17:00', '18:00',
      '19:00', '20:00', '21:00'
    ];
    return possibleEnds.filter((slot) => parseInt(slot.split(':')[0], 10) > startHour);
  }, [startTime]);

  // Auto-adjust End Time if Start Time changes past it
  useEffect(() => {
    const startHour = parseInt(startTime.split(':')[0], 10);
    const endHour = parseInt(endTime.split(':')[0], 10);
    if (endHour <= startHour) {
      const nextHour = String(startHour + 1).padStart(2, '0') + ':00';
      setEndTime(nextHour);
    }
  }, [startTime, endTime]);

  // Total Cost: (endHour - startHour) * hourlyRate
  const totalCost = useMemo(() => {
    const startHour = parseInt(startTime.split(':')[0], 10);
    const endHour = parseInt(endTime.split(':')[0], 10);
    const duration = Math.max(endHour - startHour, 1);
    const hourlyRate = Number(room?.pricePerHour) || 0;
    return duration * hourlyRate;
  }, [startTime, endTime, room]);

  // Booking Submit Handler
  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!bookingDate) {
      return toast.error('Please select a booking date.');
    }

    if (bookingDate < todayString) {
      return toast.error('Booking date must be today or a future date.');
    }

    const startDateTime = new Date(`${bookingDate}T${startTime}:00`);
    const endDateTime = new Date(`${bookingDate}T${endTime}:00`);

    if (startDateTime >= endDateTime) {
      return toast.error('End time must be after start time.');
    }

    try {
      setBookingLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('studynook_token') : null;

      const headers = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Format date to Day Month Year (e.g., 15 Oct 2026)
      const formattedDate = new Date(`${bookingDate}T00:00:00`).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });

      const bookingPayload = {
        roomId: room?._id,
        roomTitle: room?.title,
        rawDate: bookingDate,
        date: formattedDate,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        timeSlot: `${startTime} - ${endTime}`,
        totalPrice: totalCost,
        price: totalCost,
        specialNote: specialNote.trim(),
        userName: user?.name,
      };

      const res = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: 'POST',
        credentials: 'include',
        headers,
        body: JSON.stringify(bookingPayload),
      });

      const data = await res.json();

      if (res.ok && data?.success) {
        toast.success('Room booked successfully!');
        setIsModalOpen(false);
        setSpecialNote('');
        fetchRoomDetails();
      } else {
        toast.error(data?.message || 'Conflict detected! This time slot is already booked.');
      }
    } catch (error) {
      console.error('Booking submission error:', error);
      toast.error('A network error occurred while confirming booking.');
    } finally {
      setBookingLoading(false);
    }
  };

  // Pre-fill fields for Owner Edit Modal
  const handleOpenEditModal = () => {
    setEditFormData({
      title: room.title || '',
      floor: room.floor || '1st Floor',
      pricePerHour: room.pricePerHour || '',
      capacity: room.capacity || '',
      image: room.image || room.images?.[0] || '',
      description: room.description || '',
      amenities: Array.isArray(room.amenities) ? room.amenities : []
    });
    setIsEditModalOpen(true);
  };

  const toggleEditAmenity = (amenity) => {
    setEditFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  // Submit Room Edit (Owner only)
  const handleUpdateRoom = async (e) => {
    e.preventDefault();
    try {
      setUpdateLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('studynook_token') : null;

      const headers = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const updatedPayload = {
        title: editFormData.title.trim(),
        floor: editFormData.floor.trim(),
        pricePerHour: Number(editFormData.pricePerHour),
        capacity: Number(editFormData.capacity),
        description: editFormData.description.trim(),
        amenities: editFormData.amenities,
        image: editFormData.image.trim(),
        images: editFormData.image.trim() ? [editFormData.image.trim()] : []
      };

      const res = await fetch(`${API_BASE_URL}/api/rooms/${room._id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers,
        body: JSON.stringify(updatedPayload)
      });

      const data = await res.json();

      if (res.ok && data?.success) {
        toast.success('Room updated successfully');
        setRoom((prev) => ({ ...prev, ...updatedPayload }));
        setIsEditModalOpen(false);
      } else {
        toast.error(data?.message || 'Failed to update room.');
      }
    } catch (error) {
      console.error('Update room error:', error);
      toast.error('Network error occurred while updating room.');
    } finally {
      setUpdateLoading(false);
    }
  };

  // Confirm Delete Room (Owner only)
  const confirmDeleteRoom = async () => {
    try {
      setDeleteLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('studynook_token') : null;

      const headers = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_BASE_URL}/api/rooms/${room._id}`, {
        method: 'DELETE',
        headers,
        credentials: 'include',
      });
      const data = await res.json();

      if (res.ok && data?.success) {
        toast.success('Room deleted successfully');
        router.push('/rooms');
      } else {
        toast.error(data?.message || 'Failed to delete room.');
      }
    } catch (error) {
      console.error('Delete room error:', error);
      toast.error('Network error while deleting room.');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Room Not Found</h2>
        <p className="text-gray-500 mb-6">The study room you are looking for does not exist or has been removed.</p>
        <button
          onClick={() => router.push('/rooms')}
          className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl text-sm cursor-pointer"
        >
          Back to Rooms
        </button>
      </div>
    );
  }

  const mainImage = room.image || room.images?.[0] || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-white min-h-screen text-[#0F172A] relative">
      
      {/* Top Bar: Back & Owner Controls */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-indigo-600 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Owner Controls */}
        {isOwner && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenEditModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold transition cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit Room
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete Room
            </button>
          </div>
        )}
      </div>

      {/* Main Image */}
      <div className="relative w-full h-[360px] sm:h-[460px] rounded-[2.5rem] overflow-hidden shadow-xl mb-10 bg-gray-100">
        <img
          src={mainImage}
          alt={room.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
        
        {/* Booking Count Badge */}
        <div className="absolute bottom-6 left-6 flex items-center gap-2">
          <span className="px-4 py-2 bg-white/95 backdrop-blur-md text-indigo-700 text-xs font-extrabold rounded-2xl shadow-lg flex items-center gap-1.5">
            <BookmarkCheck className="w-4 h-4 text-indigo-600" />
            Booked {room.bookingCount || 0} times
          </span>
          <span className="px-4 py-2 bg-white/95 backdrop-blur-md text-slate-700 text-xs font-bold rounded-2xl shadow-lg flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-slate-500" />
            {room.floor || '1st Floor'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Details */}
        <div className="lg:col-span-7 space-y-8">
          <div className="pb-6 border-b border-gray-200">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              {room.title}
            </h1>
            <p className="text-sm text-gray-500 mt-2 font-medium">
              {room.capacity || 4} seats • {room.floor || '1st Floor'} • Quiet Study Space
            </p>
          </div>

          {/* Amenities Badges */}
          {room.amenities?.length > 0 && (
            <div className="pb-6 border-b border-gray-200">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Amenities Included</h3>
              <div className="flex flex-wrap gap-2">
                {room.amenities.map((item, idx) => (
                  <span key={idx} className="px-3 py-1.5 rounded-xl bg-indigo-50/80 border border-indigo-100 text-indigo-700 text-xs font-bold">
                    ✓ {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-6 pb-6 border-b border-gray-200">
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Quiet Library Location</h4>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{room.floor || '1st Floor'}, Study Hall Wing</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 shrink-0">
                <Waves className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Focused Quiet Zone</h4>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Acoustically treated environment designed for maximum focus and zero distractions.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Free cancellation policy</h4>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Cancel anytime before the session starts from your bookings dashboard.</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
            <h3 className="text-lg font-bold text-gray-900">About this workspace</h3>
            <p className="whitespace-pre-line">{room.description}</p>
          </div>
        </div>

        {/* Right Column: Pricing & Booking Trigger */}
        <div className="lg:col-span-5 sticky top-24">
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <span className="text-3xl font-black text-gray-900">${room.pricePerHour || 5}</span>
                <span className="text-xs text-gray-500 font-medium"> / hour</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl">
                <BookmarkCheck className="w-4 h-4" />
                <span>{room.bookingCount || 0} Bookings</span>
              </div>
            </div>

            {user ? (
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-2xl shadow-lg shadow-indigo-600/25 transition text-sm cursor-pointer active:scale-98"
              >
                Book Now →
              </button>
            ) : (
              <button
                onClick={() => router.push(`/login?from=/rooms/${room._id}`)}
                className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-2xl shadow-lg transition flex items-center justify-center gap-2 text-sm cursor-pointer active:scale-98"
              >
                <Lock className="w-4 h-4" /> Login to Book
              </button>
            )}

            <p className="text-center text-xs text-gray-400 font-medium">
              Instant confirmation • Automated Conflict Check
            </p>
          </div>
        </div>

      </div>

      {/* Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 sm:p-8 relative space-y-5 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-xl font-extrabold text-gray-900">Book Study Space</h3>
                <p className="text-xs text-gray-500 mt-0.5">{room.title}</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              
              {/* Date Picker (Min today) */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Booking Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    required
                    min={todayString}
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium"
                  />
                </div>
              </div>

              {/* Start & End Times */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Start Time *
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium cursor-pointer"
                    >
                      {ALL_HOURLY_SLOTS.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    End Time *
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium cursor-pointer"
                    >
                      {availableEndTimes.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Special Note */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Special Note (Optional)
                </label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                  <textarea
                    rows="2"
                    value={specialNote}
                    onChange={(e) => setSpecialNote(e.target.value)}
                    placeholder="e.g., Requesting whiteboard markers or quiet study setup..."
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 resize-none font-medium"
                  />
                </div>
              </div>

              {/* Total Cost Calculation */}
              <div className="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-100 flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-slate-700 block">Total Cost</span>
                  <span className="text-[11px] text-slate-500">
                    {parseInt(endTime.split(':')[0], 10) - parseInt(startTime.split(':')[0], 10)} hr(s) × ${room.pricePerHour || 5}/hr
                  </span>
                </div>
                <span className="text-xl font-extrabold text-indigo-700">${totalCost}</span>
              </div>

              {/* Confirm Booking */}
              <button
                type="submit"
                disabled={bookingLoading}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-2xl shadow-lg shadow-indigo-600/25 transition disabled:opacity-50 text-sm cursor-pointer"
              >
                {bookingLoading ? 'Checking Conflict & Reserving...' : 'Confirm Booking'}
              </button>
            </form>

          </div>
        </div>
      )}

      {/* Owner Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <h2 className="text-xl font-extrabold text-slate-900">Edit Study Room</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 rounded-xl bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateRoom} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Room Name *</label>
                <input
                  type="text"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Floor *</label>
                  <input
                    type="text"
                    value={editFormData.floor}
                    onChange={(e) => setEditFormData({ ...editFormData, floor: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Rate ($/hr) *</label>
                  <input
                    type="number"
                    min="1"
                    value={editFormData.pricePerHour}
                    onChange={(e) => setEditFormData({ ...editFormData, pricePerHour: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Capacity *</label>
                  <input
                    type="number"
                    min="1"
                    value={editFormData.capacity}
                    onChange={(e) => setEditFormData({ ...editFormData, capacity: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Image URL</label>
                <input
                  type="url"
                  value={editFormData.image}
                  onChange={(e) => setEditFormData({ ...editFormData, image: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Amenities</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {requiredAmenities.map((amenity) => {
                    const isSelected = editFormData.amenities.includes(amenity);
                    return (
                      <div
                        key={amenity}
                        onClick={() => toggleEditAmenity(amenity)}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold cursor-pointer ${
                          isSelected ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        {isSelected ? <CheckSquare className="w-3.5 h-3.5 text-indigo-600 shrink-0" /> : <Square className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                        <span className="truncate">{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description *</label>
                <textarea
                  rows="3"
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateLoading}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer disabled:opacity-50"
                >
                  {updateLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Owner Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-100">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Delete Room Listing?</h3>
            <p className="text-xs text-slate-500 mt-2">
              Are you sure you want to delete <span className="font-bold text-slate-800">"{room.title}"</span>? This will permanently remove this room from StudyNook.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={deleteLoading}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteRoom}
                disabled={deleteLoading}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer disabled:opacity-50"
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}