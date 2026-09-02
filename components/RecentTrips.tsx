"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Compass } from "lucide-react";

export interface TripItem {
  id?: string;
  title: string;
  destination?: string;
  dates?: string;
  startDate?: string;
  endDate?: string;
  duration?: string;
  durationDays?: number;
  amount?: string;
  totalSpent?: number;
  budget?: number;
  progress?: number;
  image?: string;
}

interface RecentTripsProps {
  trips?: TripItem[];
  onAddTrip?: () => void;
  onDeleteTrip?: (tripId: string) => void;
}

// Helper to format date range
function formatDateRange(startDate?: string, endDate?: string, fallback?: string): string {
  if (!startDate) return fallback || "";
  try {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : start;
    const startMonth = start.toLocaleString("default", { month: "short" });
    const endMonth = end.toLocaleString("default", { month: "short" });
    const startDay = start.getDate();
    const endDay = end.getDate();
    const year = end.getFullYear();

    if (startMonth === endMonth) {
      return `${startMonth} ${startDay} - ${endDay}, ${year}`;
    }
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
  } catch {
    return fallback || startDate;
  }
}

export default function RecentTrips({
  trips = [],
  onAddTrip,
  onDeleteTrip,
}: RecentTripsProps) {
  const hasTrips = trips && trips.length > 0;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col h-full min-h-[310px] transition-all hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[13px] font-bold text-[#0e1326] tracking-tight">
          Recent Trips
        </span>
        <div className="flex items-center gap-2">
          {onAddTrip && (
            <button
              onClick={onAddTrip}
              className="text-[11px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100/80 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
            >
              + Add Trip
            </button>
          )}
          <Link
            href="/trips"
            className="text-[11.5px] font-bold text-slate-500 hover:text-blue-600 transition-colors"
          >
            View All
          </Link>
        </div>
      </div>

      {/* Trip List / Empty State */}
      {!hasTrips ? (
        <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center mb-2.5 shadow-xs">
            <Compass className="w-6 h-6" />
          </div>
          <p className="text-[13px] font-bold text-[#0e1326]">No trips yet</p>
          <p className="text-[11.5px] text-[#94a3b8] font-medium max-w-[200px] mt-0.5 mb-3">
            Plan your first vacation and budget your journey.
          </p>
          {onAddTrip && (
            <button
              onClick={onAddTrip}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-[12px] font-bold rounded-xl shadow-xs transition-all cursor-pointer"
            >
              + Add Your First Trip
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3 flex-1 justify-center">
          {trips.map((trip, idx) => {
            const dateStr =
              trip.dates ||
              formatDateRange(trip.startDate, trip.endDate, "Dates pending");
            const durationStr =
              trip.duration ||
              (trip.durationDays ? `${trip.durationDays} Days` : "1 Day");

            const spentAmount = trip.totalSpent !== undefined ? trip.totalSpent : 0;
            const amountStr = `$${spentAmount.toLocaleString()}`;

            const budgetAmount = trip.budget || 0;
            const progressVal =
              budgetAmount > 0
                ? Math.min(100, Math.round((spentAmount / budgetAmount) * 100))
                : 0;

            const imageSrc =
              trip.image ||
              (idx % 3 === 0
                ? "/images/greece-thumb.jpg"
                : idx % 3 === 1
                ? "/images/bali-thumb.jpg"
                : "/images/japan-thumb.jpg");

            return (
              <div
                key={trip.id || idx}
                className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100/80 bg-slate-50/40 hover:bg-slate-50 transition-colors group"
              >
                {/* Left: Thumbnail & Title/Dates */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-xs">
                    <Image
                      src={imageSrc}
                      alt={trip.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[13px] font-extrabold text-[#0e1326] truncate leading-tight">
                      {trip.title}
                    </h4>
                    <p className="text-[11px] text-[#94a3b8] font-medium mt-0.5 truncate">
                      {dateStr}
                    </p>
                  </div>
                </div>

                {/* Right: Duration, Cost, Progress, and Delete button */}
                <div className="flex items-center gap-3.5 text-right shrink-0">
                  <span className="hidden sm:inline text-[11.5px] text-[#64748b] font-semibold">
                    {durationStr}
                  </span>
                  <div>
                    <span className="text-[13px] font-extrabold text-[#0e1326] block">
                      {amountStr}
                    </span>
                    <div className="flex items-center justify-end gap-1.5 mt-1">
                      <div className="w-12 h-1.5 bg-slate-200/80 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${progressVal}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-[#94a3b8] font-bold">
                        {progressVal}%
                      </span>
                    </div>
                  </div>

                  {onDeleteTrip && trip.id && (
                    <button
                      onClick={() => onDeleteTrip(trip.id!)}
                      className="p-1 rounded-lg text-slate-300 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer opacity-80 hover:opacity-100"
                      title="Delete Trip"
                      aria-label="Delete trip"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
