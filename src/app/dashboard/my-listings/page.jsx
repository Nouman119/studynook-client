'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import PrivateRoute from '@/components/PrivateRoute';
import Link from 'next/link';

const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const API_BASE_URL = rawUrl.replace(/\/api\/?$/, '').replace(/\/+$/, '');

function MyListingsContent() {
  const { user } = useAuth();
  const [myRooms, setMyRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchMyRooms = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/my-rooms`, {
        credentials: 'include',
      });
      const data = await res.json();
      if (data?.success) {
        setMyRooms(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching my rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyRooms();
    }
  }, [user]);

  const handleDelete = async (roomId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this listing?');
    if (!confirmDelete) return;

    try {
      setActionLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/rooms/${roomId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();

      if (data?.success) {
        setMyRooms((prev) => prev.filter((room) => room._id !== roomId));
      } else {
        alert(data?.message || 'Failed to delete room');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Something went wrong while deleting');
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Listings</h1>
          <p className="text-sm text-gray-500">Manage the study rooms you have posted</p>
        </div>
        <Link
          href="/rooms/add"
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition"
        >
          Add New Room
        </Link>
      </div>

      {myRooms.length === 0 ? (
        <div className="bg-white border rounded-xl p-10 text-center text-gray-500">
          <p className="mb-4">You haven't added any study rooms yet.</p>
          <Link href="/rooms/add" className="text-indigo-600 font-medium hover:underline">
            Create your first listing
          </Link>
        </div>
      ) : (
        <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-gray-50 border-b text-gray-600 uppercase text-xs">
              <tr>
                <th className="py-3 px-6">Room Title</th>
                <th className="py-3 px-6">Location</th>
                <th className="py-3 px-6">Price / Hour</th>
                <th className="py-3 px-6">Capacity</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {myRooms.map((room) => (
                <tr key={room._id} className="hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium text-gray-900">{room.title}</td>
                  <td className="py-4 px-6 text-gray-600">{room.location}</td>
                  <td className="py-4 px-6 font-semibold">${room.pricePerHour}</td>
                  <td className="py-4 px-6 text-gray-600">{room.capacity} Persons</td>
                  <td className="py-4 px-6 text-right space-x-3">
                    <button
                      onClick={() => handleDelete(room._id)}
                      disabled={actionLoading}
                      className="text-rose-600 hover:text-rose-800 font-medium disabled:opacity-50"
                    >
                      Delete
                    </button>
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

export default function MyListingsPage() {
  return (
    <PrivateRoute>
      <MyListingsContent />
    </PrivateRoute>
  );
}