"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X } from "lucide-react";
import type { DetailedDayPlan } from "@/lib/itineraryGenerator";

interface DayPlanModalProps {
  dayPlan: DetailedDayPlan;
  destination: string;
  onClose: () => void;
}

export default function DayPlanModal({
  dayPlan,
  destination,
  onClose,
}: DayPlanModalProps) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="day-plan-modal-root" role="presentation">
      <button
        type="button"
        className="day-plan-modal-backdrop"
        aria-label="Close day plan"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`day-${dayPlan.day}-modal-title`}
        className="day-plan-modal-panel"
      >
        <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_32px_90px_rgba(15,23,42,0.28)]">
          <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-100 px-6 py-6 sm:px-10 sm:py-8">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
                Triply day planner
              </span>
              <h3
                id={`day-${dayPlan.day}-modal-title`}
                className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl"
              >
                {dayPlan.title}
              </h3>
              <p className="mt-2 text-sm font-medium text-slate-500">
                {destination} · Day {dayPlan.day} personalized itinerary
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-900"
              aria-label={`Close Day ${dayPlan.day} details`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-1 overflow-y-auto overscroll-contain lg:grid-cols-[0.82fr_1.45fr]">
            <aside className="border-b border-slate-100 px-6 py-7 sm:px-10 sm:py-10 lg:border-b-0 lg:border-r">
              <div className="relative mb-6 h-40 overflow-hidden rounded-2xl sm:h-48">
                <Image
                  src={`/pic/${((dayPlan.day - 1) % 6) + 1}.jpg`}
                  alt={`Day ${dayPlan.day} cover`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 360px"
                  className="object-cover"
                />
              </div>

              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                Day overview
              </span>
              <h4 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
                Day {dayPlan.day}
              </h4>

              <div className="mt-8">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                  Daily budget
                </span>
                <p className="mt-2 text-xl font-black text-slate-900">
                  ${dayPlan.dailySpendingTotal}
                </p>
              </div>

              <div className="mt-7">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                  Schedule window
                </span>
                <ul className="mt-3 space-y-2 text-sm font-semibold text-slate-600">
                  <li>
                    <span className="mr-2 text-blue-600">•</span>09:00 – Morning excursion
                  </li>
                  <li>
                    <span className="mr-2 text-blue-600">•</span>12:30 – Afternoon exploration
                  </li>
                  <li>
                    <span className="mr-2 text-blue-600">•</span>17:30 – Evening experience
                  </li>
                </ul>
              </div>
            </aside>

            <section className="px-6 py-7 sm:px-10 sm:py-10">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                Your day plan
              </span>
              <p className="mt-3 text-base leading-relaxed text-slate-600">
                {dayPlan.summary ||
                  `A personalized ${destination} itinerary with local places, meals, and practical transport.`}
              </p>

              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-[72px_1fr] gap-4">
                  <span className="pt-0.5 text-xs font-black text-blue-600">09:00</span>
                  <div>
                    <h5 className="font-extrabold text-slate-900">{dayPlan.morning.spotName}</h5>
                    <p className="mt-1 text-sm leading-relaxed text-slate-500">
                      {dayPlan.morning.description}
                    </p>
                    <p className="mt-1.5 text-xs font-bold text-slate-600">
                      Breakfast: {dayPlan.breakfast.spotName}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-[72px_1fr] gap-4">
                  <span className="pt-0.5 text-xs font-black text-blue-600">12:30</span>
                  <div>
                    <h5 className="font-extrabold text-slate-900">{dayPlan.afternoon.spotName}</h5>
                    <p className="mt-1 text-sm leading-relaxed text-slate-500">
                      {dayPlan.afternoon.description}
                    </p>
                    <p className="mt-1.5 text-xs font-bold text-slate-600">
                      Lunch: {dayPlan.lunch.spotName}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-[72px_1fr] gap-4">
                  <span className="pt-0.5 text-xs font-black text-blue-600">17:30</span>
                  <div>
                    <h5 className="font-extrabold text-slate-900">{dayPlan.evening.spotName}</h5>
                    <p className="mt-1 text-sm leading-relaxed text-slate-500">
                      {dayPlan.evening.description}
                    </p>
                    <p className="mt-1.5 text-xs font-bold text-slate-600">
                      Dinner: {dayPlan.dinner.spotName}
                    </p>
                  </div>
                </div>
              </div>

              <blockquote className="mt-7 rounded-2xl bg-slate-50 px-5 py-4 text-sm italic leading-relaxed text-slate-500">
                “{dayPlan.transport.routeAdvice}”
              </blockquote>
            </section>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
