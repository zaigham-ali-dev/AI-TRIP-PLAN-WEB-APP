"use client";

import React from "react";

export default function HowItWorksSection() {
  const scrollToPlanner = () => {
    const input = document.getElementById("hero-destination");
    if (input) {
      input.focus();
      input.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const steps = [
    {
      id: "smart-budgeting",
      title: "Smart Budgeting",
      desc: "Maximize your funds with AI-driven budget recommendations and expense tracking.",
      icon: (
        <svg className="w-12 h-12" viewBox="0 0 52 52" fill="none">
          <circle cx="20" cy="30" r="14" fill="#FEF08A" stroke="#CA8A04" strokeWidth="2.2" />
          <circle cx="20" cy="30" r="10" fill="#FDE047" />
          <text
            x="20"
            y="35"
            textAnchor="middle"
            fill="#854D0E"
            fontSize="14"
            fontWeight="800"
            fontFamily="sans-serif"
          >
            $
          </text>
          <path
            d="M26 27L40 13M40 13H28M40 13V25"
            stroke="#16A34A"
            strokeWidth="3.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      id: "optimized-routes",
      title: "Optimized Routes",
      desc: "Create efficient itineraries that save time and discover hidden gems.",
      icon: (
        <svg className="w-12 h-12" viewBox="0 0 52 52" fill="none">
          <path
            d="M8 16L18 12L31 16L42 12V36L31 40L18 36L8 40V16Z"
            fill="#E0F2FE"
            stroke="#0284C7"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <path d="M18 12V36" stroke="#0284C7" strokeWidth="1.8" strokeDasharray="3 3" />
          <path d="M31 16V40" stroke="#0284C7" strokeWidth="1.8" strokeDasharray="3 3" />
          <path
            d="M18 24C23 20 27 26 31 22V34C27 38 23 32 18 36V24Z"
            fill="#86EFAC"
            fillOpacity="0.8"
          />
          <path
            d="M36 16C36 12.5 33 9.5 29.5 9.5C26 9.5 23 12.5 23 16C23 21 29.5 28 29.5 28C29.5 28 36 21 36 16Z"
            fill="#EF4444"
            stroke="#B91C1C"
            strokeWidth="1.8"
          />
          <circle cx="29.5" cy="16" r="2.4" fill="white" />
        </svg>
      ),
    },
    {
      id: "real-time-travel-insights",
      title: "Real-Time Travel Insights",
      desc: "Access live updates on weather, safety, and local events for a stress-free journey.",
      icon: (
        <svg className="w-12 h-12" viewBox="0 0 52 52" fill="none">
          <rect x="6" y="11" width="40" height="30" rx="5" fill="#F8FAFC" stroke="#334155" strokeWidth="2.2" />
          <rect x="6" y="11" width="40" height="8" rx="5" fill="#1E293B" />
          <circle cx="12" cy="15" r="1.8" fill="#EF4444" />
          <circle cx="17.5" cy="15" r="1.8" fill="#FBBF24" />
          <circle cx="23" cy="15" r="1.8" fill="#10B981" />
          <circle cx="18" cy="29" r="6" stroke="#06B6D4" strokeWidth="3" fill="none" />
          <path d="M18 23A6 6 0 0 1 24 29" stroke="#10B981" strokeWidth="3" fill="none" />
          <rect x="28" y="24" width="13" height="3" rx="1.5" fill="#3B82F6" />
          <rect x="28" y="29" width="9" height="3" rx="1.5" fill="#F59E0B" />
          <rect x="28" y="34" width="11" height="3" rx="1.5" fill="#8B5CF6" />
        </svg>
      ),
    },
  ];

  return (
    <section id="how-it-works" className="w-full bg-white py-20 lg:py-28 px-4 sm:px-6 lg:px-8 xl:px-12 flex justify-center border-t border-slate-100">
      <div className="max-w-[1200px] w-full flex flex-col items-center">

        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-12 sm:mb-14 flex flex-col items-center">
          <h2 className="text-3xl sm:text-4xl md:text-[38px] font-extrabold text-[#0e1326] tracking-tight">
            How Triply Works
          </h2>

          <p className="mt-3 text-[14px] sm:text-[15px] text-[#4b5563] leading-relaxed font-normal">
            Access live updates on weather, safety, and local events for a stress-free journey.
          </p>

          <button
            onClick={scrollToPlanner}
            className="mt-5 bg-[#0e1326] hover:bg-black active:scale-95 text-white text-sm font-semibold px-6 py-2.5 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
          >
            Plan Trip
          </button>
        </div>

        {/* 3-Card Single Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-7 w-full">
          {steps.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-100 p-7 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_32px_rgba(0,0,0,0.06)] hover:border-slate-200/80 transition-all flex flex-col items-start"
            >
              {/* Illustrated Icon */}
              <div className="mb-4">
                {item.icon}
              </div>

              {/* Title */}
              <h3 className="text-[17px] sm:text-[18px] font-bold text-[#0e1326] tracking-tight mb-2">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-[13.5px] text-[#4b5563] leading-relaxed font-normal">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
