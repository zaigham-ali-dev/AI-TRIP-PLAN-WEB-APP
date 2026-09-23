"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("Pro");

  // Pricing plans data
  const plans = [
    {
      name: "Free",
      monthlyPrice: 0,
      yearlyPrice: 0,
      desc: "Perfect for getting started",
      buttonText: "Get Started",
      features: [
        "Basic budget calculator",
        "Cost of living comparison",
        "Currency converter",
        "Up to 2 saved trips",
      ],
    },
    {
      name: "Pro",
      monthlyPrice: 9.99,
      yearlyPrice: 7.99, // 20% savings approx
      desc: "For frequent travelers",
      buttonText: "Choose Pro",
      features: [
        "All Free features",
        "Expense tracking",
        "AI budget recommendations",
        "Route optimization",
        "Up to 10 saved trips",
        "Priority support",
      ],
    },
    {
      name: "Premium",
      monthlyPrice: 19.99,
      yearlyPrice: 15.99, // 20% savings approx
      desc: "For travel enthusiasts",
      buttonText: "Choose Premium",
      features: [
        "All Pro features",
        "Daily spending forecasts",
        "Accommodation comparison",
        "Advanced reports",
        "Unlimited saved trips",
        "24/7 support",
      ],
    },
  ];

  return (
    <section id="pricing" className="w-full bg-[#f8fafd] py-20 lg:py-28 px-4 sm:px-6 lg:px-8 xl:px-12 flex justify-center border-t border-slate-100/50">
      <div className="max-w-[1550px] w-full flex flex-col items-center">

        {/* Header Section */}
        <div className="text-center max-w-3xl flex flex-col items-center gap-3">
          <h2 className="text-[36px] sm:text-[44px] md:text-[48px] font-extrabold text-[#0e1326] leading-[1.12] tracking-tight">
            Simple pricing for
            <br />
            <span className="text-[#2563eb]">every traveler</span>
          </h2>

          {/* Toggle Switch */}
          <div className="mt-8 flex items-center justify-center bg-white rounded-full p-1.5 border border-slate-200/60 shadow-xs">
            <span className={`text-xs sm:text-[13px] font-bold px-4 py-1.5 transition-colors duration-200 ${!isYearly ? "text-slate-950" : "text-slate-400"}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="relative w-11 h-6 bg-blue-600 rounded-full transition-colors duration-200 cursor-pointer"
              aria-label="Toggle billing duration"
            >
              <span
                className={`absolute top-0.75 left-0.75 bg-white w-4.5 h-4.5 rounded-full shadow-xs transition-transform duration-200 ${isYearly ? "transform translate-x-5" : ""
                  }`}
              />
            </button>
            <span className={`text-xs sm:text-[13px] font-bold px-4 py-1.5 transition-colors duration-200 ${isYearly ? "text-slate-950" : "text-slate-400"}`}>
              Yearly <span className="text-blue-600 font-semibold">(Save 20%)</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-[1200px] mt-16 items-stretch">
          {plans.map((plan) => {
            const currentPrice = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
            const isActive = plan.name === selectedPlan;

            const checkmarkColor = isActive ? "text-white" : "text-emerald-500";
            const checkmarkBg = isActive ? "bg-blue-600" : "bg-emerald-50";
            const buttonStyles = isActive
              ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
              : "bg-white hover:bg-slate-50 text-blue-600 border border-blue-600/80 hover:border-blue-700";

            return (
              <div
                key={plan.name}
                onClick={() => setSelectedPlan(plan.name)}
                className={`bg-white rounded-[24px] p-8 sm:p-10 flex flex-col justify-between transition-all duration-350 cursor-pointer ${isActive
                    ? "border-2 border-blue-600 shadow-[0_20px_50px_rgba(37,99,235,0.08)] scale-[1.02] md:scale-[1.03] z-10"
                    : "border border-slate-100/90 shadow-[0_4px_30px_rgba(0,0,0,0.015)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.03)] hover:-translate-y-0.5"
                  }`}
              >
                {/* Upper Section */}
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl sm:text-2xl font-extrabold text-[#0e1326] tracking-tight">
                      {plan.name}
                    </h3>
                    {isActive && (
                      <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100/40">
                        Selected
                      </span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl sm:text-[44px] font-black text-[#0e1326] tracking-tight">
                      ${currentPrice === 0 ? "0" : currentPrice}
                    </span>
                    <span className="text-[14px] font-semibold text-slate-400">
                      / month
                    </span>
                  </div>

                  <p className="mt-3.5 text-[14px] text-[#64748b] font-medium leading-relaxed">
                    {plan.desc}
                  </p>

                  <div className="border-t border-slate-100/80 my-7" />

                  {/* Features List */}
                  <ul className="flex flex-col gap-4">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className={`w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0 mt-0.5 ${checkmarkBg} transition-colors duration-300`}>
                          <Check className={`w-3.5 h-3.5 ${checkmarkColor} stroke-[3px] transition-colors duration-300`} />
                        </div>
                        <span className="text-[13.5px] text-[#1e293b] font-medium leading-snug">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Lower Action Button */}
                <div className="mt-10">
                  <button
                    type="button"
                    className={`w-full font-bold py-3.5 px-6 rounded-xl text-center text-sm transition-all duration-200 active:scale-[0.98] cursor-pointer ${buttonStyles}`}
                  >
                    {plan.buttonText}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Subtext */}
        <p className="mt-12 text-[13.5px] text-slate-500 font-medium">
          All plans include a <span className="text-blue-600 font-semibold">7-day free trial</span>. Cancel anytime.
        </p>

      </div>
    </section>
  );
}
