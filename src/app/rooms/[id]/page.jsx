'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { MapPin, Users, DollarSign, Calendar, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const API_BASE_URL = rawUrl.replace(/\/api\/?$/, '').replace(/\/+$/, '');

export default function RoomDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // বুকিং ফর্মের স্টেট
  const [bookingDate, setBookingDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('09:00 AM - 12:00 PM');
  const [guests, setGuests] = useState(1);

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

  // মোট ভাড়ার হিসাব (Price Calculation)
  const calculateTotal = () => {
    if (!room) return 0;
    return room.pricePerHour * guests * 3; // ধরে নিচ্ছি প্রতি স্লটে ৩ ঘণ্টা
  };

  // বুকিং সাবমিট হ্যান্ডলার
  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      router.push('/login');
      return;
    }

    const bookingPayload = {
      roomId: room._id,
      roomTitle: room.title,
      pricePerHour: room.pricePerHour,
      totalPrice: calculateTotal(),
      date: bookingDate,
      timeSlot,
      guests: Number(guests),
      userName: user.name,
      userEmail: user.email,
    };

    try {
      setActionLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(bookingPayload),
      });
      const data = await res.json();

      if (data?.success) {
        alert('Room booked successfully! Check your My Bookings page.');
        setIsModalOpen(false);
        router.push('/dashboard/my-bookings');
      } else {
        alert(data?.message || 'Failed to book room');
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Something went wrong during booking');
    } finally {
      setActionLoading(false);
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
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Room Not Found</h2>
        <Link href="/rooms" className="text-indigo-600 hover:underline">Back to All Rooms</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/rooms" className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-indigo-600 mb-6 transition">
        <ArrowLeft className="w-4 h-4" /> Back to Rooms
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left & Center: Room Details & Gallery */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl overflow-hidden border shadow-sm h-[400px] bg-gray-100">
            <img
              src={room.images?.[0] || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80'}
              alt={room.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-full uppercase tracking-wider">
              {room.category || 'Study Space'}
            </span>
            <h1 className="text-3xl font-extrabold text-gray-900 mt-2 mb-3">{room.title}</h1>
            <p className="flex items-center gap-1.5 text-gray-600 text-sm mb-6">
              <MapPin className="w-4 h-4 text-indigo-600" /> {room.location}
            </p>

            <div className="border-t border-b py-4 grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600"><DollarSign className="w-5 h-5" /></div>
                <div>
                  <p className="text-xs text-gray-500">Price / Hour</p>
                  <p className="font-bold text-gray-900">${room.pricePerHour}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600"><Users className="w-5 h-5" /></div>
                <div>
                  <p className="text-xs text-gray-500">Capacity</p>
                  <p className="font-bold text-gray-900">{room.capacity} Persons</p>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed">{room.description}</p>
          </div>
        </div>

        {/* Right: Booking Action Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white border rounded-2xl p-6 shadow-sm sticky top-6 space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-extrabold text-gray-900">${room.pricePerHour}</span>
              <span className="text-sm text-gray-500">/ hour</span>
            </div>

            <hr />

            {user ? (
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md transition"
              >
                Book Now
              </button>
            ) : (
              <Link
                href="/login"
                className="block text-center w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md transition"
              >
                Login to Book Room
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal (পপ-আপ) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Confirm Room Reservation</h2>
            <form onSubmit={handleConfirmBooking} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Your Name (Read-only)</label>
                <input
                  type="text"
                  value={user?.name || ''}
                  readOnly
                  className="w-full px-3 py-2 bg-gray-100 border rounded-lg text-sm text-gray-700 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Your Email (Read-only)</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  readOnly
                  className="w-full px-3 py-2 bg-gray-100 border rounded-lg text-sm text-gray-700 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Select Date</label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Time Slot</label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="09:00 AM - 12:00 PM">09:00 AM - 12:00 PM</option>
                  <option value="12:00 PM - 03:00 PM">12:00 PM - 03:00 PM</option>
                  <option value="03:00 PM - 06:00 PM">03:00 PM - 06:00 PM</option>
                  <option value="06:00 PM - 09:00 PM">06:00 PM - 09:00 PM</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Number of Guests / Seats</label>
                <input
                  type="number"
                  min="1"
                  max={room.capacity}
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>

              <div className="bg-indigo-50 p-3 rounded-xl flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700">Total Price:</span>
                <span className="text-lg font-bold text-indigo-600">${calculateTotal()}</span>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow transition disabled:opacity-50"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}