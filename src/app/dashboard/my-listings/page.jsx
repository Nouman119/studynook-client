'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { 
  MapPin, Users, Trash2, Plus, ArrowLeft, 
  ExternalLink, Sparkles, Building2, ShieldAlert,
  Search, Edit3, X, Check, DollarSign, Image as ImageIcon,
  AlignLeft, Building
} from 'lucide-react';

const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const API_BASE_URL = rawUrl.replace(/\/api\/?$/, '').replace(/\/+$/, '');

const availableAmenities = [
  'High-speed Wi-Fi', 'AC Climate', 'Whiteboard', 'Projector', 
  'Ensuite Kitchen', 'Apple TV', 'Coffee Machine', 'Soundproof', 
  'Ergonomic Chairs', 'Natural Light'
];

export default function MyListingsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth() || {};

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Edit Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    category: 'Silent Study',
    pricePerHour: '',
    capacity: '',
    location: '',
    image: '',
    description: '',
    amenities: []
  });
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      fetchMyListings();
    }
  }, [user, authLoading, router]);

  const fetchMyListings = async () => {
    try {
      setLoading(true);
      
      const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
      };
      const token = getCookie('token') || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

      const res = await fetch(`${API_BASE_URL}/api/rooms`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
      });

      const data = await res.json();

      if (res.ok) {
        const allRooms = Array.isArray(data) ? data : (data?.data || data?.rooms || []);
        const currentUserEmail = (user?.email || '').toLowerCase().trim();

        const myRooms = allRooms.filter((room) => {
          if (!room || typeof room !== 'object') return false;

          const roomEmail = (
            room.creatorEmail ||
            room.addedBy?.email ||
            room.userEmail ||
            room.email ||
            ''
          ).toLowerCase().trim();

          return currentUserEmail && roomEmail === currentUserEmail;
        });

        setListings(myRooms);
      } else {
        setErrorMessage(data?.message || 'Failed to load listings.');
      }
    } catch (error) {
      console.error('Error fetching my listings:', error);
      setErrorMessage('Failed to load your listings.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;

    try {
      setActionLoading(id);
      
      const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
      };
      const token = getCookie('token') || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

      const res = await fetch(`${API_BASE_URL}/api/rooms/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      const data = await res.json();

      if (res.ok && data?.success !== false) {
        setListings((prev) => prev.filter((item) => item._id !== id));
      } else {
        alert(data?.message || 'Failed to delete listing.');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('An unexpected error occurred.');
    } finally {
      setActionLoading(null);
    }
  };

  // Open Edit Modal with Room Values
  const handleOpenEditModal = (room) => {
    setEditingRoom(room);
    setEditFormData({
      title: room.title || '',
      category: room.category || 'Silent Study',
      pricePerHour: room.pricePerHour || '',
      capacity: room.capacity || '',
      location: typeof room.location === 'string' ? room.location : (room.location?.address || ''),
      image: room.images?.[0] || room.image || '',
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

  // Submit Edit Form
  const handleUpdateRoom = async (e) => {
    e.preventDefault();
    if (!editingRoom?._id) return;

    try {
      setUpdateLoading(true);

      const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
      };
      const token = getCookie('token') || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

      const updatedPayload = {
        ...editFormData,
        pricePerHour: Number(editFormData.pricePerHour),
        capacity: Number(editFormData.capacity),
        images: editFormData.image ? [editFormData.image] : (editingRoom.images || [])
      };

      const res = await fetch(`${API_BASE_URL}/api/rooms/${editingRoom._id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(updatedPayload)
      });

      const data = await res.json();

      if (res.ok && data?.success !== false) {
        // লাইভ স্টেট আপডেট
        setListings((prev) =>
          prev.map((item) =>
            item._id === editingRoom._id ? { ...item, ...updatedPayload } : item
          )
        );
        setIsEditModalOpen(false);
        setEditingRoom(null);
      } else {
        alert(data?.message || 'Failed to update room details.');
      }
    } catch (error) {
      console.error('Update room error:', error);
      alert('An error occurred while updating the workspace.');
    } finally {
      setUpdateLoading(false);
    }
  };

  const safeSearch = (searchTerm || '').toLowerCase().trim();
  const safeListings = Array.isArray(listings) ? listings : [];
  
  const filteredListings = safeListings.filter((item) => {
    if (!item) return false;
    const title = String(item.title || '').toLowerCase();
    const location = typeof item.location === 'string' ? item.location.toLowerCase() : '';
    const category = String(item.category || '').toLowerCase();

    return title.includes(safeSearch) || location.includes(safeSearch) || category.includes(safeSearch);
  });

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
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
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">My Listings</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-extrabold border border-indigo-100">
                {safeListings.length}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Manage, update, and track workspaces you have published.</p>
          </div>

          <Link
            href="/rooms/add"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-extrabold rounded-2xl shadow-lg shadow-indigo-600/20 transition cursor-pointer w-fit"
          >
            <Plus className="w-4 h-4" /> Add New Room
          </Link>
        </div>

        {errorMessage && (
          <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-semibold rounded-2xl flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" /> {errorMessage}
          </div>
        )}

        {/* Listings Section */}
        {safeListings.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-200 rounded-[2rem] p-16 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">No rooms listed yet</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Once you add workspaces with this account, they will appear here.
              </p>
            </div>
            <Link
              href="/rooms/add"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-indigo-600 text-white font-bold rounded-xl text-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Create First Listing
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-slate-100 rounded-[2rem] shadow-sm overflow-hidden">
            
            {/* Search Filter Strip */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter by title, category, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                />
              </div>
              <div className="text-xs font-semibold text-slate-500 self-end sm:self-center">
                Showing <span className="font-bold text-slate-800">{filteredListings.length}</span> of {safeListings.length}
              </div>
            </div>

            {/* List Table View */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-6">Workspace</th>
                    <th className="py-3.5 px-6">Category</th>
                    <th className="py-3.5 px-6">Rate</th>
                    <th className="py-3.5 px-6">Capacity</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredListings.map((room) => {
                    const thumbnail =
                      room.images?.[0] ||
                      room.image ||
                      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=300&q=80';

                    return (
                      <tr 
                        key={room._id} 
                        className="hover:bg-slate-50/70 transition group"
                      >
                        {/* Thumbnail & Title */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3.5">
                            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/60 relative">
                              <img
                                src={thumbnail}
                                alt={room.title || 'Workspace'}
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                              />
                            </div>
                            <div className="min-w-0 max-w-xs sm:max-w-md">
                              <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-indigo-600 transition">
                                {room.title || 'Untitled Workspace'}
                              </h4>
                              <p className="flex items-center gap-1 text-xs text-slate-500 truncate mt-0.5">
                                <MapPin className="w-3 h-3 text-indigo-500 shrink-0" />
                                {room.location || 'Location not specified'}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-4 px-6">
                          <span className="inline-block px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200/60">
                            {room.category || 'Study Space'}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="py-4 px-6 font-bold text-slate-900 text-sm">
                          ${room.pricePerHour || 0}
                          <span className="text-xs font-normal text-slate-500"> / hr</span>
                        </td>

                        {/* Capacity */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-1 text-xs font-semibold text-slate-600">
                            <Users className="w-3.5 h-3.5 text-indigo-500" />
                            {room.capacity || 1} Seats
                          </div>
                        </td>

                        {/* Actions (View, Edit, Delete) */}
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/rooms/${room._id}`}
                              className="p-2 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 transition cursor-pointer"
                              title="View Room Page"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                            
                            {/* Edit Button */}
                            <button
                              onClick={() => handleOpenEditModal(room)}
                              className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-600 transition cursor-pointer"
                              title="Edit Room Details"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => handleDelete(room._id)}
                              disabled={actionLoading === room._id}
                              className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition cursor-pointer disabled:opacity-50"
                              title="Delete Listing"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
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

      {/* Modern Aesthetic Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative animate-scaleUp">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold mb-1 border border-indigo-100">
                  <Sparkles className="w-3 h-3" /> Quick Editor
                </div>
                <h2 className="text-xl font-extrabold text-slate-900">Update Workspace Info</h2>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Edit Form */}
            <form onSubmit={handleUpdateRoom} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Title</label>
                  <div className="relative">
                    <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={editFormData.title}
                      onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Category</label>
                  <select
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 cursor-pointer"
                  >
                    <option value="Silent Study">Silent Study</option>
                    <option value="Group Study">Group Study</option>
                    <option value="Meeting Room">Meeting Room</option>
                    <option value="Private Pod">Private Pod</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Price Per Hour ($)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      min="1"
                      value={editFormData.pricePerHour}
                      onChange={(e) => setEditFormData({ ...editFormData, pricePerHour: e.target.value })}
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Capacity</label>
                  <div className="relative">
                    <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      min="1"
                      value={editFormData.capacity}
                      onChange={(e) => setEditFormData({ ...editFormData, capacity: e.target.value })}
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Location Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={editFormData.location}
                    onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Image URL</label>
                <div className="relative">
                  <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="url"
                    value={editFormData.image}
                    onChange={(e) => setEditFormData({ ...editFormData, image: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Amenities</label>
                <div className="flex flex-wrap gap-2">
                  {availableAmenities.map((amenity) => {
                    const isSelected = editFormData.amenities.includes(amenity);
                    return (
                      <button
                        type="button"
                        key={amenity}
                        onClick={() => toggleEditAmenity(amenity)}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600 border-indigo-600 text-white'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-indigo-300'
                        }`}
                      >
                        {amenity}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Description</label>
                <div className="relative">
                  <AlignLeft className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <textarea
                    rows="3"
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 resize-none"
                  ></textarea>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateLoading}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-lg shadow-indigo-600/20 transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  {updateLoading ? 'Saving...' : (
                    <>
                      <Check className="w-3.5 h-3.5" /> Save Changes
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}