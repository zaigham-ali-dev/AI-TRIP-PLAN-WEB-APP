"use client";

import React, { useState } from "react";
import { X, Receipt, DollarSign, Calendar, Tag } from "lucide-react";

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (expenseData: {
    title: string;
    amount: number;
    category: string;
    date: string;
  }) => Promise<void>;
}

const CATEGORIES = [
  "Accommodation",
  "Food & Dining",
  "Transport",
  "Activities",
  "Others",
];

export default function AddExpenseModal({
  isOpen,
  onClose,
  onSubmit,
}: AddExpenseModalProps) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food & Dining");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Please enter an expense title.");
      return;
    }
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid expense amount.");
      return;
    }
    if (!category) {
      setError("Please select a category.");
      return;
    }
    if (!date) {
      setError("Please select a date.");
      return;
    }

    try {
      setLoading(true);
      await onSubmit({
        title: title.trim(),
        amount: numAmount,
        category,
        date,
      });
      // Reset & close
      setTitle("");
      setAmount("");
      setCategory("Food & Dining");
      setDate(new Date().toISOString().split("T")[0]);
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to add expense. Please try again.");
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
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-xs">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[17px] font-extrabold text-[#0e1326] tracking-tight">
                Add New Expense
              </h3>
              <p className="text-[12px] text-[#94a3b8] font-medium mt-0.5">
                Record your travel expenses in real-time
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
          {/* Expense Title */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-bold text-[#0e1326] tracking-tight">
              Expense Description
            </label>
            <input
              type="text"
              placeholder="e.g. Seafood Dinner by the Sea"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              className="w-full h-11 px-3.5 bg-slate-50/70 border border-slate-200/80 rounded-xl text-[13.5px] text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all disabled:opacity-60"
            />
          </div>

          {/* Amount & Category Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-bold text-[#0e1326] tracking-tight flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                Amount ($)
              </label>
              <input
                type="number"
                step="any"
                min="0.01"
                placeholder="e.g. 85.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={loading}
                className="w-full h-11 px-3.5 bg-slate-50/70 border border-slate-200/80 rounded-xl text-[13.5px] text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all disabled:opacity-60"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-bold text-[#0e1326] tracking-tight flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={loading}
                className="w-full h-11 px-3 bg-slate-50/70 border border-slate-200/80 rounded-xl text-[13.5px] text-slate-800 font-medium focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all disabled:opacity-60 cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Expense Date */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-bold text-[#0e1326] tracking-tight flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={loading}
              className="w-full h-11 px-3.5 bg-slate-50/70 border border-slate-200/80 rounded-xl text-[13.5px] text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all disabled:opacity-60"
            />
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
              {loading ? "Adding Expense..." : "Add Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
