'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { MapPin, Users, DollarSign, Calendar, Clock, CheckCircle2, ArrowLeft, ShieldCheck, Wifi } from 'lucide-react';

const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const API_BASE_URL = rawUrl.replace(/\/api\/?$/, '').replace(/\/+$/, '');

export default function RoomDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth() || {};

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Booking Form States
  const [bookingDate, setBookingDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  useEffect(() => {
    if (id) {
      fetchRoomDetails();
    }
  }, [id]);

  const fetchRoomDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/rooms/${id}`);
      const data = await res.json();
      if (data?.success) {
        setRoom(data.data);
      }
    } catch (error) {
      console.error('Error fetching room details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!user) {
      router.push('/login');
      return;
    }

    if (!bookingDate || !startTime || !endTime) {
      setErrorMessage('Please select date and time slots.');
      return;
    }

    try {
      setBookingLoading(true);
      const bookingData = {
        roomId: room._id,
        roomTitle: room.title,
        roomImage: room.images?.[0] || '',
        pricePerHour: room.pricePerHour,
        date: bookingDate,
        startTime,
        endTime,
        userEmail: user.email,
        userName: user.name || 'Scholar',
      };

      const res = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      const data = await res.json();

      if (res.ok && data?.success) {
        setSuccessMessage('Study room booked successfully!');
        setTimeout(() => {
          router.push('/dashboard/my-bookings');
        }, 1500);
      } else {
        setErrorMessage(data?.message || 'Failed to book room. Try again.');
      }
    } catch (error) {
      console.error('Booking error:', error);
      setErrorMessage('An unexpected error occurred.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
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
          className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl text-sm"
        >
          Back to Rooms
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-indigo-600 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Rooms
      </button>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left: Room Details */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
              {room.category || 'Study Space'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">{room.title}</h1>
            <p className="flex items-center gap-1.5 text-sm text-gray-500 mt-2">
              <MapPin className="w-4 h-4 text-indigo-600" /> {room.location}
            </p>
          </div>

          {/* Main Thumbnail */}
          <div className="rounded-3xl overflow-hidden shadow-lg h-[360px] sm:h-[420px] bg-gray-100">
            <img
              src={room.images?.[0] || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80'}
              alt={room.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Description */}
          <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-gray-900">About This Study Space</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{room.description}</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t">
              <div className="flex items-center gap-2.5 text-sm text-gray-700 font-medium">
                <Users className="w-4 h-4 text-indigo-600" /> Capacity: {room.capacity} Seats
              </div>
              <div className="flex items-center gap-2.5 text-sm text-gray-700 font-medium">
                <Wifi className="w-4 h-4 text-indigo-600" /> High-Speed Wi-Fi
              </div>
              <div className="flex items-center gap-2.5 text-sm text-gray-700 font-medium">
                <ShieldCheck className="w-4 h-4 text-indigo-600" /> Quiet Zone
              </div>
            </div>
          </div>
        </div>

        {/* Right: Booking Box / Card */}
        <div className="lg:col-span-5">
          <div className="bg-white border rounded-3xl p-6 sm:p-8 shadow-xl sticky top-24 space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Price Rate</p>
                <p className="text-3xl font-black text-gray-900 mt-0.5">
                  ${room.pricePerHour} <span className="text-xs font-normal text-gray-500">/ hour</span>
                </p>
              </div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full">
                Available Now
              </span>
            </div>

            {/* Booking Form */}
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              {successMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" /> {successMessage}
                </div>
              )}

              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-xl">
                  {errorMessage}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Booking Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Start Time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    required
                  />
                </div>
              </div>

              {/* User Info Readonly Box */}
              {user && (
                <div className="p-3.5 bg-gray-50 rounded-2xl border text-xs space-y-1">
                  <p className="text-gray-400 uppercase font-bold text-[10px]">Booking As</p>
                  <p className="font-semibold text-gray-800">{user.name || 'Scholar'}</p>
                  <p className="text-gray-500">{user.email}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={bookingLoading}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/25 transition disabled:opacity-50 text-sm cursor-pointer"
              >
                {bookingLoading ? 'Processing Booking...' : 'Confirm Room Booking'}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}