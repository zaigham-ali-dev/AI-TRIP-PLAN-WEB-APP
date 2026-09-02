"use client";

import React, { useState } from "react";
import { X, Plane, Calendar, DollarSign, MapPin } from "lucide-react";

interface AddTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tripData: {
    title: string;
    destination: string;
    budget: number;
    startDate: string;
    endDate: string;
    durationDays: number;
    totalSpent: number;
    progress: number;
    image: string;
  }) => Promise<void>;
}

export default function AddTripModal({
  isOpen,
  onClose,
  onSubmit,
}: AddTripModalProps) {
  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Please enter a trip title.");
      return;
    }
    if (!destination.trim()) {
      setError("Please enter a destination.");
      return;
    }
    const numBudget = parseFloat(budget);
    if (isNaN(numBudget) || numBudget <= 0) {
      setError("Please enter a valid budget amount.");
      return;
    }
    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      setError("End date cannot be earlier than start date.");
      return;
    }

    // Calculate duration in days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const durationDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);

    // Pick image based on destination
    let image = "/images/greece-thumb.jpg";
    const destLower = destination.toLowerCase();
    if (destLower.includes("bali") || destLower.includes("indonesia") || destLower.includes("beach")) {
      image = "/images/bali-thumb.jpg";
    } else if (destLower.includes("japan") || destLower.includes("tokyo") || destLower.includes("asia")) {
      image = "/images/japan-thumb.jpg";
    }

    try {
      setLoading(true);
      await onSubmit({
        title: title.trim(),
        destination: destination.trim(),
        budget: numBudget,
        startDate,
        endDate,
        durationDays,
        totalSpent: 0,
        progress: 0,
        image,
      });
      // Reset form & close
      setTitle("");
      setDestination("");
      setBudget("");
      setStartDate("");
      setEndDate("");
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to add trip. Please try again.");
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
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-7 z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs">
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[17px] font-extrabold text-[#0e1326] tracking-tight">
                Add New Trip
              </h3>
              <p className="text-[12px] text-[#94a3b8] font-medium mt-0.5">
                Plan and budget your next adventure
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
          {/* Trip Title */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-bold text-[#0e1326] tracking-tight">
              Trip Title
            </label>
            <input
              type="text"
              placeholder="e.g. Greece Summer Vacation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              className="w-full h-11 px-3.5 bg-slate-50/70 border border-slate-200/80 rounded-xl text-[13.5px] text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all disabled:opacity-60"
            />
          </div>

          {/* Destination & Budget Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-bold text-[#0e1326] tracking-tight flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Destination
              </label>
              <input
                type="text"
                placeholder="e.g. Santorini, Greece"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                disabled={loading}
                className="w-full h-11 px-3.5 bg-slate-50/70 border border-slate-200/80 rounded-xl text-[13.5px] text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all disabled:opacity-60"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-bold text-[#0e1326] tracking-tight flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                Budget ($)
              </label>
              <input
                type="number"
                min="1"
                placeholder="e.g. 2500"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                disabled={loading}
                className="w-full h-11 px-3.5 bg-slate-50/70 border border-slate-200/80 rounded-xl text-[13.5px] text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all disabled:opacity-60"
              />
            </div>
          </div>

          {/* Start Date & End Date Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-bold text-[#0e1326] tracking-tight flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={loading}
                className="w-full h-11 px-3.5 bg-slate-50/70 border border-slate-200/80 rounded-xl text-[13.5px] text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all disabled:opacity-60"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-bold text-[#0e1326] tracking-tight flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={loading}
                className="w-full h-11 px-3.5 bg-slate-50/70 border border-slate-200/80 rounded-xl text-[13.5px] text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all disabled:opacity-60"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-4 pt-3 border-t border-slate-100">
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
              {loading ? "Adding Trip..." : "Add Trip"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
