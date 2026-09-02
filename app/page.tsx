"use client";

import React, { useState, useEffect } from "react";
import { Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturesSection from "@/components/FeaturesSection";
import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import StatCard from "@/components/StatCard";
import SpendingChart from "@/components/SpendingChart";
import TopExpenses from "@/components/TopExpenses";
import CTASection from "@/components/CTASection";
import PricingSection from "@/components/PricingSection";
import Footer from "@/components/Footer";

export default function Home() {
  const [activeTab, setActiveTab] = useState("Dashboard");

  // Force scroll to top on page refresh/reload
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Prevent browser from restoring scroll position automatically
      if (window.history && "scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo(0, 0);
    }
  }, []);

  const benefits = [
    "Real-time pricing insights",
    "Personalized travel budgets",
    "Avoid overspending",
    "Perfect for travelers, digital nomads, expats & more",
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 1. Navbar at the top */}
      <Navbar />

      <main className="flex-1">
        {/* 2. Hero Section */}
        <Hero />

        {/* 3. Features Section */}
        <FeaturesSection />

        {/* 4. Triply Dashboard Section (rendered after the Hero/features ribbon) */}
        <section id="how-it-works" className="w-full bg-white py-20 lg:py-28 px-4 sm:px-6 lg:px-8 xl:px-12 flex justify-center border-t border-slate-100/50">
          <div className="max-w-[1550px] w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">

            {/* LEFT INTRODUCTION PANEL */}
            <div className="lg:col-span-4 bg-white rounded-[28px] border border-slate-100/90 p-8 sm:p-10 lg:p-12 xl:p-14 shadow-[0_4px_30px_rgba(0,0,0,0.02)] flex flex-col justify-center transition-all hover:shadow-[0_6px_36px_rgba(0,0,0,0.03)]">
              <h2 className="text-[28px] sm:text-[32px] lg:text-[35px] font-extrabold text-[#0e1326] leading-[1.18] tracking-tight">
                Smarter planning
                <br />
                every step of the way
              </h2>

              <p className="mt-5 text-[14px] sm:text-[15px] text-[#64748b] leading-relaxed font-medium">
                We combine travel planning with financial management to help you get the most out of your journey.
              </p>

              {/* Benefits checklist */}
              <div className="mt-8 flex flex-col gap-4">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3.5">
                    <div className="w-[18px] h-[18px] rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-0.5 border border-blue-100/50">
                      <Check className="w-3 h-3 text-blue-600 stroke-[3px]" />
                    </div>
                    <span className="text-[13.5px] text-[#1e293b] font-semibold leading-snug tracking-tight">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT TRIPLY DASHBOARD */}
            <div className="lg:col-span-8 bg-white rounded-[28px] border border-slate-100/90 shadow-[0_4px_30px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col sm:flex-row transition-all hover:shadow-[0_6px_36px_rgba(0,0,0,0.03)]">

              {/* Sidebar Navigation */}
              <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

              {/* Main Dashboard Content */}
              <div className="flex-1 p-6 sm:p-8 flex flex-col bg-[#f0f4fa]">
                <DashboardHeader />

                {/* Stat Cards Section */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <StatCard label="Total Budget" value="$2,500" />
                  <StatCard label="Total Spent" value="$1,620" />
                  <StatCard label="Days Left" value="7" />
                </div>

                {/* Spending Chart & Top Expenses Section */}
                <div className="grid grid-cols-1 xl:grid-cols-5 gap-5 flex-1 items-stretch">
                  <div className="xl:col-span-3 flex flex-col">
                    <SpendingChart />
                  </div>
                  <div className="xl:col-span-2 flex flex-col">
                    <TopExpenses />
                  </div>
                </div>

              </div>

            </div>

          </div>
        </section>

        {/* 5. Pricing Section */}
        <PricingSection />

        {/* 4. Call to Action (CTA) Section */}
        <CTASection />
      </main>

      {/* 5. Footer */}
      <Footer />
    </div>
  );
}