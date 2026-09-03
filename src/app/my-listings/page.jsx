'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
  Users, Trash2, Plus, ArrowLeft,
  Sparkles, Building2, Search, Edit3, X, Check, DollarSign, Image as ImageIcon,
  AlignLeft, Building, Layers, CheckSquare, Square, AlertTriangle
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

export default function MyListingsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth() || {};

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Delete Confirmation Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRoomToDelete, setSelectedRoomToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Edit Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    floor: '',
    pricePerHour: '',
    capacity: '',
    image: '',
    description: '',
    amenities: []
  });
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    document.title = 'StudyNook – My Listings';
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?from=/my-listings');
    } else if (user) {
      fetchMyListings();
    }
  }, [user, authLoading, router]);

  const fetchMyListings = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/rooms/my-rooms`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      if (res.ok && data?.success) {
        setListings(data.data || []);
      } else {
        setListings([]);
      }
    } catch (error) {
      console.error('Error fetching my listings:', error);
      toast.error('Failed to load your listings.');
    } finally {
      setLoading(false);
    }
  };

  // কাস্টম ডিলিট কনফার্মেশন মোডাল ওপেন
  const triggerDeletePrompt = (room) => {
    setSelectedRoomToDelete(room);
    setDeleteModalOpen(true);
  };

  // মোডাল থেকে ডিলিট এক্সিকিউট করা
  const confirmDelete = async () => {
    if (!selectedRoomToDelete?._id) return;

    try {
      setDeleteLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/rooms/${selectedRoomToDelete._id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();

      if (res.ok && data?.success) {
        toast.success('Room deleted successfully');
        setListings((prev) => prev.filter((item) => item._id !== selectedRoomToDelete._id));
        setDeleteModalOpen(false);
        setSelectedRoomToDelete(null);
      } else {
        toast.error(data?.message || 'Failed to delete listing.');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Network error. Failed to delete room.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleOpenEditModal = (room) => {
    setEditingRoom(room);
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

  const handleUpdateRoom = async (e) => {
    e.preventDefault();
    if (!editingRoom?._id) return;

    try {
      setUpdateLoading(true);

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

      const res = await fetch(`${API_BASE_URL}/api/rooms/${editingRoom._id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPayload)
      });

      const data = await res.json();

      if (res.ok && data?.success) {
        toast.success('Room updated successfully');
        setListings((prev) =>
          prev.map((item) =>
            item._id === editingRoom._id ? { ...item, ...updatedPayload } : item
          )
        );
        setIsEditModalOpen(false);
        setEditingRoom(null);
      } else {
        toast.error(data?.message || 'Failed to update room.');
      }
    } catch (error) {
      console.error('Update room error:', error);
      toast.error('Error occurred while updating workspace.');
    } finally {
      setUpdateLoading(false);
    }
  };

  const safeSearch = (searchTerm || '').toLowerCase().trim();
  const safeListings = Array.isArray(listings) ? listings : [];

  const filteredListings = safeListings.filter((item) => {
    if (!item) return false;
    const title = String(item.title || '').toLowerCase();
    const floor = String(item.floor || '').toLowerCase();
    return title.includes(safeSearch) || floor.includes(safeSearch);
  });

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
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">My Listings</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-extrabold border border-indigo-100">
                {safeListings.length}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Manage, update, and track workspaces you have published.</p>
          </div>

          <Link
            href="/add-room"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-extrabold rounded-2xl shadow-lg shadow-indigo-600/20 transition cursor-pointer w-fit"
          >
            <Plus className="w-4 h-4" /> Add New Room
          </Link>
        </div>

        {/* Listings Content */}
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
                  placeholder="Filter by title or floor..."
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
                    <th className="py-3.5 px-6">Floor</th>
                    <th className="py-3.5 px-6">Rate</th>
                    <th className="py-3.5 px-6">Capacity</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredListings.map((room) => {
                    const thumbnail =
                      room.image ||
                      room.images?.[0] ||
                      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=300&q=80';

                    return (
                      <tr
                        key={room._id}
                        className="hover:bg-slate-50/70 transition group"
                      >
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
                              <p className="text-xs text-slate-500 truncate mt-0.5">
                                {room.description || 'No description provided'}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200/60">
                            <Layers className="w-3 h-3 text-indigo-600" />
                            {room.floor || '1st Floor'}
                          </span>
                        </td>

                        <td className="py-4 px-6 font-bold text-slate-900 text-sm">
                          ${room.pricePerHour || 0}
                          <span className="text-xs font-normal text-slate-500"> / hr</span>
                        </td>

                        <td className="py-4 px-6">
                          <div className="flex items-center gap-1 text-xs font-semibold text-slate-600">
                            <Users className="w-3.5 h-3.5 text-indigo-500" />
                            {room.capacity || 1} Seats
                          </div>
                        </td>

                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditModal(room)}
                              className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-600 transition cursor-pointer"
                              title="Edit Room Details"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => triggerDeletePrompt(room)}
                              className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition cursor-pointer"
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

      {/* Custom Sleek Delete Confirmation Modal */}
      {deleteModalOpen && selectedRoomToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white border border-slate-100 rounded-3xl shadow-2xl max-w-md w-full p-6 text-center">

            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-100">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900">Delete Workspace?</h3>
            <p className="text-xs text-slate-500 mt-2">
              Are you sure you want to delete <span className="font-bold text-slate-800">"{selectedRoomToDelete.title}"</span>? This action cannot be undone.
            </p>

            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setDeleteModalOpen(false);
                  setSelectedRoomToDelete(null);
                }}
                disabled={deleteLoading}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleteLoading}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition cursor-pointer shadow-md shadow-red-600/20 disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {deleteLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Edit Room Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative">

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

            <form onSubmit={handleUpdateRoom} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Room Name *</label>
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

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Floor *</label>
                    <div className="relative">
                      <Layers className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={editFormData.floor}
                        onChange={(e) => setEditFormData({ ...editFormData, floor: e.target.value })}
                        required
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Rate ($/hr) *</label>
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
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Capacity *</label>
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
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {requiredAmenities.map((amenity) => {
                      const isSelected = editFormData.amenities.includes(amenity);
                      return (
                        <div
                          key={amenity}
                          onClick={() => toggleEditAmenity(amenity)}
                          className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition select-none ${isSelected
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                            : 'bg-slate-50/60 border-slate-200 text-slate-600 hover:border-slate-300'
                            }`}
                        >
                          {isSelected ? (
                            <CheckSquare className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          ) : (
                            <Square className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          )}
                          <span className="truncate">{amenity}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Description *</label>
                  <div className="relative">
                    <AlignLeft className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    <textarea
                      rows="3"
                      value={editFormData.description}
                      onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 resize-none"
                    ></textarea>
                  </div>
                </div>
              </div>

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