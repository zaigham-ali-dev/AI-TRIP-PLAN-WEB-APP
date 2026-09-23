"use client";

import React from "react";

export default function FeaturesSection() {
  const features = [
    {
      id: "smart-budgeting",
      title: "Smart Budgeting",
      desc: "Maximize your funds with AI-driven budget recommendations and expense tracking.",
      icon: (
        <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
          <circle cx="19" cy="28" r="13" fill="#FEF08A" stroke="#CA8A04" strokeWidth="2.2" />
          <circle cx="19" cy="28" r="9.5" fill="#FDE047" />
          <text
            x="19"
            y="33"
            textAnchor="middle"
            fill="#A16207"
            fontSize="13"
            fontWeight="800"
            fontFamily="sans-serif"
          >
            $
          </text>
          <path
            d="M25 25L37 13M37 13H27M37 13V23"
            stroke="#16A34A"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      id: "optim-planning",
      title: "Optim Planning",
      desc: "Create efficient itineraries that save time and discover hidden gems.",
      icon: (
        <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
          <path
            d="M8 15L17 11L29 15L39 11V33L29 37L17 33L8 37V15Z"
            fill="#E0F2FE"
            stroke="#0284C7"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M17 11V33" stroke="#0284C7" strokeWidth="1.8" strokeDasharray="2.5 2.5" />
          <path d="M29 15V37" stroke="#0284C7" strokeWidth="1.8" strokeDasharray="2.5 2.5" />
          <path
            d="M17 21C21 19 25 23 29 20V32C25 34 21 30 17 32V21Z"
            fill="#86EFAC"
            fillOpacity="0.75"
          />
          <path
            d="M34 15C34 11.7 31.3 9 28 9C24.7 9 22 11.7 22 15C22 19.5 28 25.5 28 25.5C28 25.5 34 19.5 34 15Z"
            fill="#EF4444"
            stroke="#B91C1C"
            strokeWidth="1.5"
          />
          <circle cx="28" cy="15" r="2.2" fill="white" />
        </svg>
      ),
    },
    {
      id: "real-time-insights-1",
      title: "Real-Time Insights",
      desc: "Access live updates on weather, safety, and local events for a stress-free journey.",
      icon: (
        <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
          <rect x="6" y="10" width="36" height="28" rx="4" fill="#F0FDF4" stroke="#0D9488" strokeWidth="2" />
          <rect x="6" y="10" width="36" height="7" rx="4" fill="#0D9488" />
          <circle cx="11" cy="13.5" r="1.5" fill="#FEF08A" />
          <circle cx="16" cy="13.5" r="1.5" fill="#86EFAC" />
          <circle cx="21" cy="13.5" r="1.5" fill="#FCA5A5" />
          <rect x="12" y="24" width="4" height="9" rx="1" fill="#3B82F6" />
          <rect x="19" y="20" width="4" height="13" rx="1" fill="#10B981" />
          <rect x="26" y="26" width="4" height="7" rx="1" fill="#F59E0B" />
          <rect x="33" y="22" width="5" height="4" rx="1" fill="#6366F1" />
          <rect x="33" y="28" width="5" height="4" rx="1" fill="#EC4899" />
        </svg>
      ),
    },
    {
      id: "how-triply-works",
      title: "How Triply Works",
      desc: "Tell us your dream destination, budget, and style!",
      icon: (
        <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
          <circle cx="20" cy="22" r="13" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2" />
          <ellipse cx="20" cy="22" rx="6" ry="13" stroke="#38BDF8" strokeWidth="1.5" />
          <line x1="7" y1="22" x2="33" y2="22" stroke="#38BDF8" strokeWidth="1.5" />
          <circle cx="27" cy="24" r="9" fill="#F0FDFA" fillOpacity="0.85" stroke="#0F766E" strokeWidth="2.5" />
          <path d="M34 31L42 39" stroke="#0F766E" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M24 21C25 19.5 27 19.5 28 20" stroke="#14B8A6" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      id: "plan-smart",
      title: "Plan",
      desc: "Our smart planner generates a personalized, optimized itinerary.",
      icon: (
        <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
          <circle cx="17" cy="15" r="5" fill="#E2E8F0" stroke="#64748B" strokeWidth="2" strokeDasharray="3 2" />
          <circle cx="31" cy="13" r="4" fill="#CBD5E1" stroke="#475569" strokeWidth="1.8" strokeDasharray="3 2" />
          <rect x="10" y="18" width="28" height="22" rx="3" fill="#FFFFFF" stroke="#DC2626" strokeWidth="2" />
          <rect x="10" y="18" width="28" height="7" fill="#DC2626" />
          <line x1="16" y1="15" x2="16" y2="19" stroke="#991B1B" strokeWidth="2" strokeLinecap="round" />
          <line x1="32" y1="15" x2="32" y2="19" stroke="#991B1B" strokeWidth="2" strokeLinecap="round" />
          <circle cx="16" cy="30" r="1.5" fill="#64748B" />
          <circle cx="24" cy="30" r="1.5" fill="#64748B" />
          <circle cx="32" cy="30" r="1.5" fill="#2563EB" />
          <circle cx="16" cy="35" r="1.5" fill="#64748B" />
          <circle cx="24" cy="35" r="1.5" fill="#16A34A" />
          <circle cx="32" cy="35" r="1.5" fill="#64748B" />
        </svg>
      ),
    },
    {
      id: "real-time-insights-2",
      title: "Real-Time Insights",
      desc: "Access live updates on safety, and local events for a stress-free journey.",
      icon: (
        <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
          <rect x="8" y="14" width="16" height="22" rx="2.5" fill="#1E3A8A" stroke="#172554" strokeWidth="1.5" />
          <circle cx="16" cy="22" r="3.5" stroke="#FDE047" strokeWidth="1.2" />
          <rect x="12" y="28" width="8" height="2" rx="0.5" fill="#93C5FD" />
          <rect x="25" y="16" width="15" height="20" rx="3" fill="#F59E0B" stroke="#D97706" strokeWidth="1.8" />
          <line x1="29" y1="19" x2="29" y2="33" stroke="#B45309" strokeWidth="1.2" />
          <line x1="33" y1="19" x2="33" y2="33" stroke="#B45309" strokeWidth="1.2" />
          <line x1="37" y1="19" x2="37" y2="33" stroke="#B45309" strokeWidth="1.2" />
          <path d="M30 16V11H35V16" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="28" cy="37" r="1.5" fill="#334155" />
          <circle cx="37" cy="37" r="1.5" fill="#334155" />
        </svg>
      ),
    },
  ];

  return (
    <section id="features" className="w-full bg-[#f8fafd] py-20 lg:py-24 px-4 sm:px-6 lg:px-8 xl:px-12 flex justify-center">
      <div className="max-w-[1240px] w-full flex flex-col items-center">

        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-14">
          <h2 className="text-3xl sm:text-4xl md:text-[38px] font-extrabold text-[#0e1326] tracking-tight">
            Why Choose Triply?
          </h2>
        </div>

        {/* 6 Features Grid (3x2) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7 w-full">
          {features.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_32px_rgba(0,0,0,0.06)] hover:border-slate-200/80 transition-all flex flex-col items-start"
            >
              {/* Illustrated Icon */}
              <div className="mb-4">
                {item.icon}
              </div>

              {/* Title */}
              <h3 className="text-[17px] font-bold text-[#0e1326] tracking-tight mb-2">
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
