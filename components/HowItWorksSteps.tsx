"use client";

import React from "react";

export default function HowItWorksSteps() {
  const steps = [
    {
      stepNumber: "1",
      title: "Search",
      desc: "Tell us your dream destination, budget, and style.",
      icon: (
        <svg className="w-14 h-14 shrink-0" viewBox="0 0 56 56" fill="none">
          {/* Globe */}
          <circle cx="24" cy="26" r="16" fill="#D1FAE5" stroke="#059669" strokeWidth="2.2" />
          <ellipse cx="24" cy="26" rx="7.5" ry="16" stroke="#10B981" strokeWidth="1.6" />
          <line x1="8" y1="26" x2="40" y2="26" stroke="#10B981" strokeWidth="1.6" />
          <line x1="12" y1="16" x2="36" y2="16" stroke="#10B981" strokeWidth="1.2" />
          <line x1="12" y1="36" x2="36" y2="36" stroke="#10B981" strokeWidth="1.2" />
          {/* Magnifying Glass */}
          <circle cx="33" cy="30" r="11" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2.5" />
          <path d="M41 38L50 47" stroke="#92400E" strokeWidth="4" strokeLinecap="round" />
          <path d="M29 26C30.5 24 33 24 34.5 25" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      stepNumber: "2",
      title: "Plan",
      desc: "Our smart planner generates a personalized, optimized itinerary.",
      icon: (
        <svg className="w-14 h-14 shrink-0" viewBox="0 0 56 56" fill="none">
          {/* Big Gear */}
          <circle cx="20" cy="32" r="7" fill="#F1F5F9" stroke="#334155" strokeWidth="2.5" strokeDasharray="3.5 2.5" />
          <circle cx="20" cy="32" r="3" fill="#334155" />
          {/* Small Gear */}
          <circle cx="37" cy="36" r="5" fill="#F1F5F9" stroke="#475569" strokeWidth="2" strokeDasharray="3 2" />
          <circle cx="37" cy="36" r="2" fill="#475569" />
          {/* Calendar on top */}
          <rect x="22" y="10" width="26" height="22" rx="3" fill="#FFFFFF" stroke="#DC2626" strokeWidth="2.2" />
          <rect x="22" y="10" width="26" height="7" fill="#DC2626" />
          <line x1="28" y1="7" x2="28" y2="11" stroke="#991B1B" strokeWidth="2" strokeLinecap="round" />
          <line x1="42" y1="7" x2="42" y2="11" stroke="#991B1B" strokeWidth="2" strokeLinecap="round" />
          {/* Calendar dots */}
          <circle cx="28" cy="22" r="1.3" fill="#64748B" />
          <circle cx="35" cy="22" r="1.3" fill="#64748B" />
          <circle cx="42" cy="22" r="1.3" fill="#2563EB" />
          <circle cx="28" cy="27" r="1.3" fill="#64748B" />
          <circle cx="35" cy="27" r="1.3" fill="#16A34A" />
          <circle cx="42" cy="27" r="1.3" fill="#64748B" />
        </svg>
      ),
    },
    {
      stepNumber: "3",
      title: "Book & Travel",
      desc: "Review your plan, book with one click, and enjoy your trip!",
      icon: (
        <svg className="w-14 h-14 shrink-0" viewBox="0 0 56 56" fill="none">
          {/* Passport Book */}
          <rect x="8" y="14" width="18" height="26" rx="2.5" fill="#1E3A8A" stroke="#0F172A" strokeWidth="2" />
          <circle cx="17" cy="24" r="4.5" stroke="#FDE047" strokeWidth="1.5" />
          <rect x="12" y="31" width="10" height="2.5" rx="0.5" fill="#93C5FD" />
          {/* Suitcase */}
          <rect x="27" y="17" width="19" height="24" rx="3.5" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
          {/* Suitcase ribs */}
          <line x1="32" y1="21" x2="32" y2="37" stroke="#B45309" strokeWidth="1.4" />
          <line x1="36.5" y1="21" x2="36.5" y2="37" stroke="#B45309" strokeWidth="1.4" />
          <line x1="41" y1="21" x2="41" y2="37" stroke="#B45309" strokeWidth="1.4" />
          {/* Handle */}
          <path d="M33 17V11H40V17" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {/* Wheels */}
          <circle cx="31" cy="42" r="1.8" fill="#1E293B" />
          <circle cx="42" cy="42" r="1.8" fill="#1E293B" />
        </svg>
      ),
    },
  ];

  return (
    <section id="how-it-works" className="w-full bg-[#f4f7fc] py-16 sm:py-20 px-4 sm:px-6 lg:px-8 xl:px-12 flex justify-center border-t border-slate-200/60">
      <div className="max-w-[1100px] w-full flex flex-col items-center">

        {/* Section Heading */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-[32px] font-extrabold text-[#0e1326] tracking-tight">
            How Triply Works
          </h2>
        </div>

        {/* 3 Step Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 w-full">
          {steps.map((item) => (
            <div key={item.stepNumber} className="flex flex-col items-start">
              {/* Number + Illustrated Icon */}
              <div className="flex items-center gap-3.5 mb-3.5">
                <span className="text-4xl sm:text-5xl font-black text-[#2563eb] leading-none tracking-tight">
                  {item.stepNumber}
                </span>
                <div>{item.icon}</div>
              </div>

              {/* Step Title */}
              <h3 className="text-lg font-bold text-[#0e1326] tracking-tight mb-1.5">
                {item.title}
              </h3>

              {/* Step Description */}
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
