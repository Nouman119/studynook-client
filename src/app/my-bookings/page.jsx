'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { 
  ArrowLeft, Calendar, Clock, DollarSign, 
  Trash2, Building2, AlertTriangle, ChevronRight
} from 'lucide-react';

const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const API_BASE_URL = rawUrl.replace(/\/api\/?$/, '').replace(/\/+$/, '');

export default function MyBookingsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth() || {};

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Custom Cancel Modal States
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedBookingToCancel, setSelectedBookingToCancel] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Dynamic Browser Tab Title
  useEffect(() => {
    document.title = 'StudyNook – My Bookings';
  }, []);

  // Private route redirect
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?from=/my-bookings');
    } else if (user) {
      fetchMyBookings();
    }
  }, [user, authLoading, router]);

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/bookings/my-bookings`, {
        credentials: 'include',
      });
      const data = await res.json();
      if (data?.success) {
        setBookings(data.data || []);
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load your reservations.');
    } finally {
      setLoading(false);
    }
  };

  // Check if booking date/time is in the future (Requirement: today's future or later)
  const isBookingInFuture = (booking) => {
    try {
      if (booking.endTime && !isNaN(new Date(booking.endTime).getTime())) {
        return new Date(booking.endTime) > new Date();
      }
      if (booking.startTime && !isNaN(new Date(booking.startTime).getTime())) {
        return new Date(booking.startTime) > new Date();
      }
      if (booking.rawDate) {
        const todayStr = new Date().toISOString().split('T')[0];
        return booking.rawDate >= todayStr;
      }
      if (booking.date) {
        const parsed = new Date(booking.date);
        if (!isNaN(parsed.getTime())) {
          return parsed >= new Date(new Date().setHours(0, 0, 0, 0));
        }
      }
      return true;
    } catch (e) {
      return false;
    }
  };

  const triggerCancelPrompt = (booking) => {
    setSelectedBookingToCancel(booking);
    setCancelModalOpen(true);
  };

  const confirmCancel = async () => {
    if (!selectedBookingToCancel?._id) return;

    try {
      setActionLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/bookings/${selectedBookingToCancel._id}/cancel`, {
        method: 'PATCH',
        credentials: 'include',
      });
      const data = await res.json();

      if (res.ok && data?.success) {
        toast.success('Booking cancelled');
        setBookings((prev) =>
          prev.map((b) => (b._id === selectedBookingToCancel._id ? { ...b, status: 'cancelled' } : b))
        );
        setCancelModalOpen(false);
        setSelectedBookingToCancel(null);
      } else {
        toast.error(data?.message || 'Failed to cancel booking');
      }
    } catch (error) {
      console.error('Cancel error:', error);
      toast.error('Network error. Unable to cancel booking.');
    } finally {
      setActionLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFB]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 mb-2 transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">My Bookings</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-extrabold border border-indigo-100">
                {bookings.length}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Review and manage your scheduled study room reservation sessions.
            </p>
          </div>

          <Link
            href="/rooms"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-extrabold rounded-2xl shadow-lg shadow-indigo-600/20 transition cursor-pointer w-fit"
          >
            Find More Rooms <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Empty State (Requirement 5.2: Exact text) */}
        {bookings.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-200 rounded-[2rem] p-16 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">You have no bookings yet.</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Explore available campus workspaces and book your study slots.
              </p>
            </div>
            <Link
              href="/rooms"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-indigo-600 text-white font-bold rounded-xl text-xs transition cursor-pointer"
            >
              Browse Rooms
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-slate-100 rounded-[2rem] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                    <th className="py-4 px-6">Workspace</th>
                    <th className="py-4 px-6">Date & Slot</th>
                    <th className="py-4 px-6">Amount</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {bookings.map((booking) => {
                    // Populate correct room image
                    const thumbnail =
                      booking.roomImage ||
                      booking.roomDetails?.image ||
                      booking.roomDetails?.images?.[0] ||
                      booking.image ||
                      booking.room?.image ||
                      booking.room?.images?.[0] ||
                      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=300&q=80';

                    // Safeguard against 'Invalid Date' display
                    const displaySlot = 
                      booking.timeSlot && !booking.timeSlot.includes('Invalid')
                        ? booking.timeSlot
                        : (booking.startTime && !isNaN(new Date(booking.startTime).getTime())
                            ? `${new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                            : 'Reserved Hours');

                    const canCancel =
                      booking.status === 'confirmed' && isBookingInFuture(booking);

                    return (
                      <tr key={booking._id} className="hover:bg-slate-50/70 transition group">
                        
                        {/* Workspace Name & Image */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3.5">
                            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/60">
                              <img
                                src={thumbnail}
                                alt={booking.roomTitle || 'Room'}
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                              />
                            </div>
                            <div className="min-w-0 max-w-xs">
                              <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-indigo-600 transition">
                                {booking.roomTitle || booking.roomDetails?.title || 'Study Room'}
                              </h4>
                              {booking.specialNote && (
                                <p className="text-[11px] text-slate-400 italic truncate mt-0.5">
                                  Note: "{booking.specialNote}"
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Date & Slot */}
                        <td className="py-4 px-6">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                              <Calendar className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                              <span>{booking.date || (booking.startTime ? new Date(booking.startTime).toLocaleDateString('en-GB') : 'Reserved Date')}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                              <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                              <span>{displaySlot}</span>
                            </div>
                          </div>
                        </td>

                        {/* Total Cost */}
                        <td className="py-4 px-6">
                          <div className="font-extrabold text-sm text-slate-900 flex items-center">
                            ${booking.totalPrice ?? booking.price ?? 0}
                          </div>
                        </td>

                        {/* Status Badge */}
                        <td className="py-4 px-6">
                          {booking.status === 'confirmed' ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                              confirmed
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-extrabold bg-red-50 text-red-600 border border-red-200/60">
                              cancelled
                            </span>
                          )}
                        </td>

                        {/* Cancel Button (Only if confirmed AND future date) */}
                        <td className="py-4 px-6 text-right">
                          {canCancel ? (
                            <button
                              onClick={() => triggerCancelPrompt(booking)}
                              className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl transition cursor-pointer"
                            >
                              Cancel
                            </button>
                          ) : (
                            <span className="text-xs font-medium text-slate-400">
                              {booking.status === 'cancelled' ? 'Cancelled' : 'Completed'}
                            </span>
                          )}
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Custom Confirmation Modal */}
      {cancelModalOpen && selectedBookingToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white border border-slate-100 rounded-3xl shadow-2xl max-w-md w-full p-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-100">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Cancel Reservation?</h3>
            <p className="text-xs text-slate-500 mt-2">
              Are you sure you want to cancel your session for <span className="font-bold text-slate-800">"{selectedBookingToCancel.roomTitle}"</span>? This will free up the study slot for others.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setCancelModalOpen(false);
                  setSelectedBookingToCancel(null);
                }}
                disabled={actionLoading}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer disabled:opacity-50"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={confirmCancel}
                disabled={actionLoading}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition cursor-pointer shadow-md shadow-red-600/20 disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {actionLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" /> Confirm Cancel
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}