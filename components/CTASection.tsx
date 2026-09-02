"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="w-full bg-[#f8fafd] pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 xl:px-12 flex justify-center">
      <div className="max-w-[1550px] w-full">
        {/* Banner Card */}
        <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-r from-[#0b122f] via-[#1c2356] to-[#0a102c] py-14 px-6 text-center shadow-[0_12px_40px_rgba(0,0,0,0.08)] border border-slate-900/10">

          {/* Background image overlay to get the subtle mountain silhouettes */}
          <div className="absolute inset-0 z-0 opacity-15 mix-blend-overlay pointer-events-none">
            <Image
              src="/images/hero-view.jpg"
              alt="Mountain background silhouette"
              fill
              className="object-cover object-center"
            />
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center gap-4">
            <h2 className="text-[24px] sm:text-[28px] md:text-[30px] font-extrabold text-white tracking-tight leading-tight">
              Ready to plan your next adventure?
            </h2>

            <p className="text-[13px] sm:text-[14px] text-slate-300/90 font-medium tracking-tight">
              Join thousands of smart travelers today.
            </p>

            <Link href="/signup" className="mt-2 bg-[#2563eb] hover:bg-blue-700 active:scale-95 text-white text-[13px] sm:text-[14px] font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2 cursor-pointer">
              <span>Get Started for Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
