"use client";

import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorksSteps from "@/components/HowItWorksSteps";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  // Force scroll to top on page refresh/reload
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.history && "scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 1. Navbar */}
      <Navbar />

      <main className="flex-1">
        {/* 2. Hero Section */}
        <Hero />

        {/* 3. Features Section (6-Card "Why Choose Triply?" Grid) */}
        <FeaturesSection />

        {/* 4. How It Works Section (3-Step Search -> Plan -> Book & Travel Banner) */}
        <HowItWorksSteps />

        {/* 5. Testimonials Section (What Our Travelers Say) */}
        <TestimonialsSection />

        {/* 6. Call to Action (CTA) Section */}
        <CTASection />
      </main>

      {/* 7. Footer */}
      <Footer />
    </div>
  );
}