"use client";

import React, { useState } from "react";
import { X, Building2, MapPin, Calendar, DollarSign, BedDouble, CheckCircle } from "lucide-react";

export interface AccommodationItem {
  id?: string;
  name: string;
  location: string;
  checkIn: string;
  checkOut: string;
  cost: number;
  roomType: string;
  status: "Confirmed" | "Pending" | "Cancelled";
  image?: string;
}

interface AddAccommodationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<AccommodationItem, "id">) => Promise<void>;
}

const ROOM_TYPES = [
  "Deluxe Suite",
  "Oceanfront Villa",
  "Boutique Hotel",
  "Private Apartment",
  "Standard Room",
  "Resort Stay",
];

const STATUS_OPTIONS: ("Confirmed" | "Pending" | "Cancelled")[] = [
  "Confirmed",
  "Pending",
  "Cancelled",
];

export default function AddAccommodationModal({
  isOpen,
  onClose,
  onSubmit,
}: AddAccommodationModalProps) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [cost, setCost] = useState("");
  const [roomType, setRoomType] = useState("Deluxe Suite");
  const [status, setStatus] = useState<"Confirmed" | "Pending" | "Cancelled">("Confirmed");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please enter the hotel or stay name.");
      return;
    }
    if (!location.trim()) {
      setError("Please enter the city or location.");
      return;
    }
    const numCost = parseFloat(cost);
    if (isNaN(numCost) || numCost < 0) {
      setError("Please enter a valid cost amount.");
      return;
    }
    if (!checkIn || !checkOut) {
      setError("Please select both check-in and check-out dates.");
      return;
    }
    if (new Date(checkOut) < new Date(checkIn)) {
      setError("Check-out date cannot be earlier than check-in date.");
      return;
    }

    // Default image thumbnail
    let image = "/images/greece-thumb.jpg";
    const lowerLoc = (location + name).toLowerCase();
    if (lowerLoc.includes("bali") || lowerLoc.includes("villa") || lowerLoc.includes("resort")) {
      image = "/images/bali-thumb.jpg";
    } else if (lowerLoc.includes("japan") || lowerLoc.includes("tokyo") || lowerLoc.includes("asia")) {
      image = "/images/japan-thumb.jpg";
    }

    try {
      setLoading(true);
      await onSubmit({
        name: name.trim(),
        location: location.trim(),
        checkIn,
        checkOut,
        cost: numCost,
        roomType,
        status,
        image,
      });

      // Reset
      setName("");
      setLocation("");
      setCheckIn("");
      setCheckOut("");
      setCost("");
      setRoomType("Deluxe Suite");
      setStatus("Confirmed");
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to add accommodation booking.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/45 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-7 z-10 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[17px] font-extrabold text-[#0e1326] tracking-tight">
                Add Accommodation
              </h3>
              <p className="text-[12px] text-[#94a3b8] font-medium mt-0.5">
                Record your hotel, resort, or villa booking
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200/80 rounded-xl text-red-600 text-[12.5px] font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Hotel Name */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-bold text-[#0e1326] tracking-tight">
              Hotel / Property Name
            </label>
            <input
              type="text"
              placeholder="e.g. Grand Oia Luxury Suites"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              className="w-full h-11 px-3.5 bg-slate-50/70 border border-slate-200/80 rounded-xl text-[13.5px] text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all disabled:opacity-60"
            />
          </div>

          {/* Location & Cost Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-bold text-[#0e1326] tracking-tight flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Location
              </label>
              <input
                type="text"
                placeholder="e.g. Santorini, Greece"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                disabled={loading}
                className="w-full h-11 px-3.5 bg-slate-50/70 border border-slate-200/80 rounded-xl text-[13.5px] text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all disabled:opacity-60"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-bold text-[#0e1326] tracking-tight flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                Total Cost ($)
              </label>
              <input
                type="number"
                step="any"
                min="0"
                placeholder="e.g. 650"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                disabled={loading}
                className="w-full h-11 px-3.5 bg-slate-50/70 border border-slate-200/80 rounded-xl text-[13.5px] text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all disabled:opacity-60"
              />
            </div>
          </div>

          {/* Room Type & Booking Status Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-bold text-[#0e1326] tracking-tight flex items-center gap-1">
                <BedDouble className="w-3.5 h-3.5 text-slate-400" />
                Room Type
              </label>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                disabled={loading}
                className="w-full h-11 px-3 bg-slate-50/70 border border-slate-200/80 rounded-xl text-[13.5px] text-slate-800 font-medium focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all disabled:opacity-60 cursor-pointer"
              >
                {ROOM_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-bold text-[#0e1326] tracking-tight flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-slate-400" />
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                disabled={loading}
                className="w-full h-11 px-3 bg-slate-50/70 border border-slate-200/80 rounded-xl text-[13.5px] text-slate-800 font-medium focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all disabled:opacity-60 cursor-pointer"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Check-in & Check-out Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-bold text-[#0e1326] tracking-tight flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Check-in Date
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                disabled={loading}
                className="w-full h-11 px-3.5 bg-slate-50/70 border border-slate-200/80 rounded-xl text-[13.5px] text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all disabled:opacity-60"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-bold text-[#0e1326] tracking-tight flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Check-out Date
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                disabled={loading}
                className="w-full h-11 px-3.5 bg-slate-50/70 border border-slate-200/80 rounded-xl text-[13.5px] text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all disabled:opacity-60"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-[13px] font-semibold hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-[13px] font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer disabled:opacity-60"
            >
              {loading ? "Adding Booking..." : "Add Accommodation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
