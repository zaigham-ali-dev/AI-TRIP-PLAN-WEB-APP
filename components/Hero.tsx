"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react";

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState("");
  const popularDestinations = ["Bali", "Paris", "Dubai", "Tokyo", "New York"];

  return (
    <section className="relative w-full min-h-[96vh] flex flex-col justify-between bg-[#f8fafd]">

      {/* Background Subtle Gradient for Left Side */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f6f9fc] via-[#f8fafd] to-[#ffffff] pointer-events-none" />

      {/* Right-Side Panoramic Landscape Image */}
      <div className="absolute top-0 right-0 bottom-0 w-full lg:w-[72%] xl:w-[68%] z-0 select-none pointer-events-none overflow-hidden hidden lg:block">
        <Image
          src="/images/hero-view.jpg"
          alt="Scenic mountain lake travel view"
          fill
          priority
          className="object-cover object-[16%_center] lg:object-[14%_center]"
        />

        {/* Soft, wide misty gradient on the left edge blending seamlessly into #f8fafd */}
        <div className="absolute inset-y-0 left-0 w-44 sm:w-64 lg:w-96 bg-gradient-to-r from-[#f8fafd] via-[#f8fafd]/85 to-transparent z-10" />

        {/* Top edge fade for seamless navbar integration */}
        <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-[#f8fafd]/50 via-[#f8fafd]/20 to-transparent z-10" />

        {/* Bottom subtle blend */}
        <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#f8fafd]/60 to-transparent z-10" />
      </div>

      {/* Decorative Paper Airplane & Curved Dashed Trajectory */}
      <div className="absolute inset-0 z-10 pointer-events-none hidden lg:block overflow-hidden">
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Curved Dashed Flight Path */}
          <path
            d="M 600,430 C 720,260 850,180 1040,135"
            stroke="white"
            strokeWidth="2.5"
            strokeDasharray="7 7"
            strokeOpacity="0.85"
          />
        </svg>

        {/* Floating Paper Airplane in Upper Sky */}
        <div className="absolute top-[14%] right-[22%] rotate-[-4deg] drop-shadow-md animate-bounce-subtle">
          <svg
            className="w-12 h-12 text-white fill-white"
            viewBox="0 0 24 24"
          >
            <path d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-6.054-2.685z" />
          </svg>
        </div>
      </div>

      {/* Hero Main Content */}
      <div className="relative z-20 w-full px-4 sm:px-6 lg:px-8 xl:px-12 pt-28 pb-10 lg:pt-32 lg:pb-8 flex-1 flex flex-col justify-center">
        <div className="max-w-[1550px] w-full mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">

            {/* Left Column: Text & Search Content */}
            <div className="w-full lg:w-[48%] xl:w-[44%] flex flex-col items-start pl-2 lg:pl-6">



              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[62px] font-extrabold tracking-tight leading-[1.08] text-[#0e1326]">
                Plan smarter. <br />
                <span className="text-[#2563eb]">Travel better.</span>
              </h1>

              {/* Subtitle */}
              <p className="mt-5 text-[15.5px] sm:text-[16.5px] text-[#4b5563] leading-relaxed max-w-lg font-normal">
                Your all-in-one platform for budget planning, expense tracking, route optimization and real-time travel insights.
              </p>

              {/* Search Input Bar */}
              <div className="w-full max-w-[480px] mt-8">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                  }}
                  className="relative flex items-center bg-white border border-slate-200/80 rounded-2xl p-1.5 pl-4 sm:pl-5 shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:border-slate-300 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all"
                >
                  <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Where do you want to go?"
                    className="w-full bg-transparent text-slate-800 placeholder-slate-400 text-sm sm:text-[15px] font-normal outline-none"
                  />
                  <button
                    type="submit"
                    aria-label="Search destination"
                    className="w-11 h-11 bg-[#2563eb] hover:bg-blue-700 active:scale-95 text-white rounded-xl flex items-center justify-center shadow-md shadow-blue-500/25 transition-all shrink-0 cursor-pointer"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </form>
              </div>

              {/* Popular Destinations */}
              <div className="mt-6 flex flex-wrap items-center gap-2 sm:gap-2.5">
                <span className="text-xs font-bold text-slate-900 mr-1">
                  Popular destinations:
                </span>
                {popularDestinations.map((dest) => (
                  <button
                    key={dest}
                    onClick={() => setSearchQuery(dest)}
                    className="bg-[#f0f3f8] hover:bg-slate-200 text-slate-700 text-xs font-medium px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    {dest}
                  </button>
                ))}
              </div>

            </div>

            {/* Right Column: Floating AI Trip Estimate Card */}
            <div className="w-full lg:w-auto flex justify-center lg:justify-end lg:pr-2 xl:pr-6 mt-8 lg:mt-0">
              <div className="w-full max-w-[315px] sm:max-w-[325px] bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/90 transition-all duration-350 hover:-translate-y-1 hover:shadow-blue-500/15">

                {/* Card Header Badge */}
                <div className="flex items-center gap-2">
                  <div className="w-5.5 h-5.5 rounded-full bg-[#2563eb] flex items-center justify-center text-white shadow-xs">
                    <span className="text-xs font-bold leading-none">✦</span>
                  </div>
                  <span className="text-xs font-bold text-slate-800 tracking-tight">
                    Trip Estimate
                  </span>
                </div>

                {/* Destination & Duration Title */}
                <h3 className="text-base font-extrabold text-slate-900 mt-2.5">
                  7 Days in Greece
                </h3>

                {/* Estimated Cost Section */}
                <div className="mt-4 pt-1">
                  <span className="text-xs font-medium text-slate-400">
                    Estimated Cost
                  </span>
                  <div className="text-[26px] font-black text-slate-900 mt-0.5 tracking-tight">
                    $1,620 – $1,980
                  </div>

                  {/* Savings Pill */}
                  <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-semibold">
                    <svg
                      className="w-3.5 h-3.5 text-emerald-600"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 5v14M19 12l-7 7-7-7" />
                    </svg>
                    <span>16% less than average</span>
                  </div>
                </div>

                {/* CTA Action Button */}
                <button
                  type="button"
                  className="w-full mt-5 bg-[#3252ea] hover:bg-[#2543da] active:scale-[0.98] text-white font-semibold py-3 px-4 rounded-xl shadow-md shadow-blue-500/20 text-sm text-center transition-all cursor-pointer"
                >
                  View Full Plan
                </button>

              </div>
            </div>

          </div>
        </div>
      </div>

    </section>
  );
}
