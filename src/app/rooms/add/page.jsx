'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import PrivateRoute from '@/components/PrivateRoute';

const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const API_BASE_URL = rawUrl.replace(/\/api\/?$/, '').replace(/\/+$/, '');

function AddRoomContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    const roomData = {
      title: form.title.value,
      location: form.location.value,
      pricePerHour: parseFloat(form.price.value),
      capacity: parseInt(form.capacity.value),
      images: [form.image.value],
      category: 'Study Pod',
      description: form.description.value,
      userEmail: user?.email,
      userName: user?.displayName || 'Anonymous',
      userPhoto: user?.photoURL || '',
    };

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(roomData),
      });

      const data = await res.json();
      if (data?.success) {
        alert('Room added successfully!');
        router.push('/rooms');
      } else {
        alert(data?.message || 'Failed to add room');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Add a New Study Room</h1>
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Room Title</label>
          <input type="text" name="title" required className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500" placeholder="e.g. Quiet Corner Study Pod" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location / Area</label>
            <input type="text" name="location" required className="w-full px-4 py-2 border rounded-lg" placeholder="e.g. Building 2, Floor 3" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price per Hour ($)</label>
            <input type="number" name="price" required className="w-full px-4 py-2 border rounded-lg" placeholder="e.g. 15" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Capacity (Persons)</label>
            <input type="number" name="capacity" required className="w-full px-4 py-2 border rounded-lg" placeholder="e.g. 4" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input type="url" name="image" required className="w-full px-4 py-2 border rounded-lg" placeholder="https://image-link.com" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea name="description" rows="4" required className="w-full px-4 py-2 border rounded-lg" placeholder="Write details about the study room..."></textarea>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Email (Logged in)</label>
            <input type="email" value={user?.email || ''} readOnly className="w-full px-4 py-2 border bg-gray-100 rounded-lg text-gray-500 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
            <input type="text" value={user?.displayName || 'User'} readOnly className="w-full px-4 py-2 border bg-gray-100 rounded-lg text-gray-500 cursor-not-allowed" />
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 mt-4">
          {loading ? 'Adding Room...' : 'Submit Room'}
        </button>
      </form>
    </div>
  );
}

export default function AddRoomPage() {
  return (
    <PrivateRoute>
      <AddRoomContent />
    </PrivateRoute>
  );
}