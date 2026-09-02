"use client";

import React from "react";
import {
  Coins,
  Calculator,
  RefreshCw,
  Receipt,
  Hotel,
  Sparkles,
  Route,
  TrendingUp
} from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      id: "cost-of-living",
      titleLine1: "Cost of Living",
      titleLine2: "Comparison",
      desc: "Compare the real cost of living between office or countries to find the best destination that fits your budget.",
      icon: Coins,
      bgColor: "bg-[#eefcf3]",
      borderColor: "border-[#d1f7de]",
      textColor: "text-[#16a34a]"
    },
    {
      id: "budget-calculator",
      titleLine1: "Travel",
      titleLine2: "Budget Calculator",
      desc: "Plan your trip with our smart budget calculator. Set your duration, travel style, and get an estimated budget instantly.",
      icon: Calculator,
      bgColor: "bg-[#f5f3ff]",
      borderColor: "border-[#e4dcff]",
      textColor: "text-[#7c3aed]"
    },
    {
      id: "currency-converter",
      titleLine1: "Currency",
      titleLine2: "Converter",
      desc: "Real-time currency conversion with live exchange rates. Supports all major currencies worldwide.",
      icon: RefreshCw,
      bgColor: "bg-[#eff6ff]",
      borderColor: "border-[#dbeafe]",
      textColor: "text-[#2563eb]"
    },
    {
      id: "expense-tracking",
      titleLine1: "Expense",
      titleLine2: "Tracking",
      desc: "Track your daily expenses in real time. Categorize, analyze, and stay on top of your budget.",
      icon: Receipt,
      bgColor: "bg-[#fff7ed]",
      borderColor: "border-[#ffedd5]",
      textColor: "text-[#ea580c]"
    },
    {
      id: "accommodation-comparison",
      titleLine1: "Accommodation",
      titleLine2: "Comparison",
      desc: "Compare prices, ratings, and amenities from top booking platforms to find the best stay.",
      icon: Hotel,
      bgColor: "bg-[#fefce8]",
      borderColor: "border-[#fef08a]",
      textColor: "text-[#ca8a04]"
    },
    {
      id: "ai-budget-recommendations",
      titleLine1: "AI Budget",
      titleLine2: "Recommendations",
      desc: "Let our AI analyze your travel plans and suggest the perfect budget breakdown for you.",
      icon: Sparkles,
      bgColor: "bg-[#eff6ff]",
      borderColor: "border-[#bfdbfe]",
      textColor: "text-[#3b82f6]"
    },
    {
      id: "route-optimization",
      titleLine1: "Route",
      titleLine2: "Optimization",
      desc: "Get the best travel routes with optimized time, cost, and convenience.",
      icon: Route,
      bgColor: "bg-[#f0f9ff]",
      borderColor: "border-[#e0f2fe]",
      textColor: "text-[#0284c7]"
    },
    {
      id: "daily-spending-forecasts",
      titleLine1: "Daily Spending",
      titleLine2: "Forecasts",
      desc: "Get daily spending forecasts based on your destination, travel style, and habits.",
      icon: TrendingUp,
      bgColor: "bg-[#f0fdf4]",
      borderColor: "border-[#dcfce7]",
      textColor: "text-[#10b981]"
    }
  ];

  return (
    <section id="features" className="w-full bg-[#f8fafd] py-20 lg:py-28 px-4 sm:px-6 lg:px-8 xl:px-12 flex justify-center border-t border-slate-100/50">
      <div className="max-w-[1550px] w-full">

        {/* Section Header */}
        <div className="max-w-3xl flex flex-col items-start gap-4 pl-2 lg:pl-6">
          <h2 className="text-[36px] sm:text-[44px] md:text-[48px] font-extrabold text-[#0e1326] leading-[1.12] tracking-tight">
            Powerful features for
            <br />
            <span className="text-[#2563eb]">smarter travel planning</span>
          </h2>

          <p className="mt-2 text-[15px] sm:text-[16px] text-[#64748b] leading-relaxed max-w-2xl font-medium">
            Everything you need to plan, budget, and enjoy your trip with confidence.
          </p>
        </div>

        {/* Features Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-14 sm:mt-16">
          {features.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                className="bg-white rounded-[24px] border border-slate-100/90 p-8 sm:p-10 shadow-[0_2px_16px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.03)] hover:border-slate-200/50 transition-all flex flex-col items-start group"
              >
                {/* Card Header: Icon + Title */}
                <div className="flex items-center gap-4.5">
                  <div className={`w-14 h-14 rounded-2xl ${item.bgColor} border ${item.borderColor} flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform`}>
                    <Icon className={`w-6 h-6 ${item.textColor}`} />
                  </div>
                  <h3 className="text-[17px] sm:text-[18px] font-bold text-[#0e1326] leading-[1.25] tracking-tight flex flex-col">
                    <span>{item.titleLine1}</span>
                    <span className="text-slate-800 font-semibold">{item.titleLine2}</span>
                  </h3>
                </div>

                {/* Card Description */}
                <p className="mt-5 text-[13px] sm:text-[14px] text-[#64748b] leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
