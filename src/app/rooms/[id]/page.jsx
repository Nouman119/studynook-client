'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { MapPin, Users, Calendar, CheckCircle2, ArrowLeft, ShieldCheck, Star, Heart, Lock, Sparkles, Award, Waves, X, Plus, Minus } from 'lucide-react';

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

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [bookingDate, setBookingDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
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

  const handleIncrement = () => {
    setGuests((prev) => {
      const current = Number(prev) || 1;
      const maxLimit = room?.capacity || 20;
      return current < maxLimit ? current + 1 : current;
    });
  };

  const handleDecrement = () => {
    setGuests((prev) => {
      const current = Number(prev) || 1;
      return current > 1 ? current - 1 : 1;
    });
  };

  const calculateTotal = () => {
    const basePrice = room?.pricePerHour || 61;
    const guestCount = Number(guests) || 1;
    return basePrice * guestCount;
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
        totalPrice: calculateTotal(),
        date: bookingDate,
        startTime,
        endTime,
        guests: Number(guests),
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
        setSuccessMessage('Booking confirmed successfully!');
        setTimeout(() => {
          setIsModalOpen(false);
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
      <div className="min-h-[70vh] flex items-center justify-center bg-white dark:bg-zinc-950">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Room Not Found</h2>
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

  const mainImage = room.images?.[0] || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-white dark:bg-zinc-950 min-h-screen text-[#0F172A] dark:text-white relative">
      
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-indigo-600 mb-6 transition cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Rooms
      </button>

      <div className="relative w-full h-[360px] sm:h-[460px] rounded-[2.5rem] overflow-hidden shadow-2xl mb-10 bg-gray-100 dark:bg-zinc-900">
        <img
          src={mainImage}
          alt={room.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
        <span className="absolute bottom-6 left-6 px-4 py-2 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md text-indigo-600 dark:text-indigo-400 text-xs font-extrabold rounded-2xl shadow-lg">
          {room.category || 'Study Space'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        <div className="lg:col-span-7 space-y-8">
          <div className="pb-6 border-b border-gray-200 dark:border-zinc-800">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              {room.title}
            </h1>
            <p className="text-sm text-gray-500 dark:text-zinc-400 mt-2 font-medium">
              {room.capacity || 4} seats • {room.category || 'Quiet Workspace'} • High-speed Wi-Fi
            </p>
          </div>

          <div className="space-y-6 pb-6 border-b border-gray-200 dark:border-zinc-800">
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">Great location</h4>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mt-0.5">100% of recent scholars gave the location a 5-star rating.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shrink-0">
                <Waves className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">Focused Environment</h4>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mt-0.5">This is one of the quietest study spots in the area with zero disturbance.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">Great check-in experience</h4>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mt-0.5">100% of recent guests gave the check-in process a 5-star rating.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">Free cancellation for 48 hours.</h4>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">About this space</h3>
            <p>{room.description}</p>
            <p>
              StudyNook provides an ideal professional environment designed to boost your productivity. Whether you need a solo desk or a collaborative space, our facilities are tailored to your absolute comfort.
            </p>
          </div>
        </div>

        <div className="lg:col-span-5 sticky top-24">
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-zinc-800">
              <div>
                <span className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">${room.pricePerHour || 61}</span>
                <span className="text-xs text-gray-500 dark:text-zinc-400 font-medium"> / hour</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800 dark:text-zinc-200">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>5.0</span>
                <span className="text-gray-400 font-normal">100 reviews</span>
              </div>
            </div>

            {user ? (
              <div className="space-y-4">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full py-4 bg-gray-900 hover:bg-indigo-600 dark:bg-white dark:text-gray-900 dark:hover:bg-indigo-600 dark:hover:text-white text-white font-extrabold rounded-2xl shadow-lg transition text-sm cursor-pointer"
                >
                  Book Now →
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <button
                  onClick={() => router.push('/login')}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-2xl shadow-lg shadow-indigo-600/25 transition flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  <Lock className="w-4 h-4" /> Login to Book
                </button>
              </div>
            )}

            <p className="text-center text-xs text-gray-400 font-medium">You won't be charged yet</p>
          </div>
        </div>

      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl border border-white/20 dark:border-zinc-800 w-full max-w-lg rounded-[2.5rem] shadow-2xl p-6 sm:p-8 relative space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-4">
              <div>
                <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">Reserve Study Space</h3>
                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">{room.title}</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-9 h-9 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

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

              <div className="grid grid-cols-2 gap-3 p-3.5 bg-gray-50 dark:bg-zinc-800/60 rounded-2xl border border-gray-100 dark:border-zinc-700">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Scholar Name</p>
                  <p className="text-xs font-bold text-gray-800 dark:text-white truncate mt-0.5">{user?.name || 'Scholar'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Email Address</p>
                  <p className="text-xs font-bold text-gray-800 dark:text-white truncate mt-0.5">{user?.email}</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase mb-1">Booking Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase mb-1">Start Time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase mb-1">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase mb-1">Number of Guests / Seats</label>
                <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl">
                  <span className="text-sm font-semibold text-gray-700 dark:text-zinc-300">{guests} Person(s)</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleDecrement}
                      className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 flex items-center justify-center text-gray-600 dark:text-zinc-200 hover:bg-gray-100 transition cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleIncrement}
                      className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 flex items-center justify-center text-gray-600 dark:text-zinc-200 hover:bg-gray-100 transition cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-zinc-800/80 rounded-2xl border border-gray-100 dark:border-zinc-700 space-y-2 text-xs">
                <div className="flex justify-between text-gray-600 dark:text-zinc-400">
                  <span>Rate per hour</span>
                  <span>${room.pricePerHour || 61}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-zinc-400">
                  <span>Selected guests</span>
                  <span>{guests} Person(s)</span>
                </div>
                <div className="pt-2 border-t border-gray-200 dark:border-zinc-700 flex justify-between font-extrabold text-sm text-gray-900 dark:text-white">
                  <span>Total Amount</span>
                  <span>${calculateTotal()}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={bookingLoading}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-2xl shadow-lg shadow-indigo-600/25 transition disabled:opacity-50 text-sm cursor-pointer"
              >
                {bookingLoading ? 'Processing...' : 'Confirm Booking'}
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}