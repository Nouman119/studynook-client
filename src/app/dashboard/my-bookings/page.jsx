'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import PrivateRoute from '@/components/PrivateRoute';
import Link from 'next/link';

const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const API_BASE_URL = rawUrl.replace(/\/api\/?$/, '').replace(/\/+$/, '');

function MyBookingsContent() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // ইউজারের বুকিংগুলো ফেচ করা
  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/bookings/my-bookings`, {
        credentials: 'include',
      });
      const data = await res.json();
      if (data?.success) {
        setBookings(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyBookings();
    }
  }, [user]);

  // বুকিং ক্যান্সেল করার হ্যান্ডলার
  const handleCancelBooking = async (bookingId) => {
    const confirmCancel = window.confirm('Are you sure you want to cancel this booking?');
    if (!confirmCancel) return;

    try {
      setActionLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}/cancel`, {
        method: 'PATCH',
        credentials: 'include',
      });
      const data = await res.json();

      if (data?.success) {
        // সফলভাবে ক্যান্সেল হলে স্টেট আপডেট করে স্ট্যাটাস বদলে দেওয়া
        setBookings((prev) =>
          prev.map((b) => (b._id === bookingId ? { ...b, status: 'cancelled' } : b))
        );
      } else {
        alert(data?.message || 'Failed to cancel booking');
      }
    } catch (error) {
      console.error('Cancel error:', error);
      alert('Something went wrong while cancelling');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
        <p className="text-sm text-gray-500">View and manage your study room reservation slots</p>
      </div>

      {bookings.length === 0 ? (
        // Empty State রিকুইরমেন্ট অনুযায়ী
        <div className="bg-white border rounded-xl p-12 text-center max-w-lg mx-auto shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No Bookings Found</h3>
          <p className="text-sm text-gray-500 mb-6">You haven't booked any study rooms yet. Explore available rooms and make your first reservation.</p>
          <Link
            href="/rooms"
            className="inline-block px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
          >
            Explore Rooms
          </Link>
        </div>
      ) : (
        <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-gray-50 border-b text-gray-600 uppercase text-xs">
              <tr>
                <th className="py-3 px-6">Room Title</th>
                <th className="py-3 px-6">Date & Time Slot</th>
                <th className="py-3 px-6">Total Price</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium text-gray-900">{booking.roomTitle || 'Study Room'}</td>
                  <td className="py-4 px-6 text-gray-600">
                    {booking.date ? (
                      <span>{booking.date} ({booking.timeSlot})</span>
                    ) : (
                      <span>
                        {new Date(booking.startTime).toLocaleDateString()} 
                        ({new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                        {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 font-semibold">${booking.totalPrice || booking.price || 0}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        booking.status === 'confirmed'
                          ? 'bg-emerald-100 text-emerald-700'
                          : booking.status === 'cancelled'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    {booking.status !== 'cancelled' && (
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        disabled={actionLoading}
                        className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 font-medium rounded-lg text-xs transition disabled:opacity-50"
                      >
                        Cancel Booking
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function MyBookingsPage() {
  return (
    <PrivateRoute>
      <MyBookingsContent />
    </PrivateRoute>
  );
}