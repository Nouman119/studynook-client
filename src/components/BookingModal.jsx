'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function BookingModal({ room, isOpen, onClose, onBookingSuccess }) {
  const { user } = useAuth();
  const [bookingDate, setBookingDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to book a study room.');
      return;
    }

    setLoading(true);

    try {
      const bookingData = {
        roomId: room._id || room.id,
        roomTitle: room.title || room.name,
        userEmail: user.email,
        userName: user.name || 'User',
        date: bookingDate,
        timeSlot: timeSlot,
        price: room.price,
        status: 'Pending'
      };

      // Backend API call to save booking
      const res = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Room booked successfully!');
        if (onBookingSuccess) onBookingSuccess(data);
        onClose();
      } else {
        alert(data.message || 'Failed to book room.');
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Something went wrong. Please check your server connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden p-6 relative animate-fadeIn">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">Book Study Room</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 font-bold text-lg"
          >
            ✕
          </button>
        </div>

        <div className="mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
          <p className="text-sm font-semibold text-gray-800">{room?.title || room?.name}</p>
          <p className="text-xs text-gray-500 mt-1">Price: ${room?.price} / hour</p>
        </div>

        <form onSubmit={handleBookingSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Your Name</label>
            <input 
              type="text" 
              disabled 
              value={user?.name || user?.email || 'Authenticated User'} 
              className="w-full px-3 py-2 border border-gray-200 bg-gray-100 rounded-lg text-sm text-gray-600 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Booking Date</label>
            <input 
              type="date" 
              required
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Time Slot</label>
            <select 
              required
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">Select a time slot</option>
              <option value="09:00 AM - 12:00 PM">09:00 AM - 12:00 PM</option>
              <option value="12:00 PM - 03:00 PM">12:00 PM - 03:00 PM</option>
              <option value="03:00 PM - 06:00 PM">03:00 PM - 06:00 PM</option>
              <option value="06:00 PM - 09:00 PM">06:00 PM - 09:00 PM</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Confirming...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}