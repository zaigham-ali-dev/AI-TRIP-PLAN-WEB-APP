"use client";

import React from "react";
import Image from "next/image";
import { Star } from "lucide-react";

export default function TestimonialsSection() {
  const testimonials = [
    {
      id: "1",
      name: "Sarah J.",
      role: "Solo Explorer",
      avatar: "/images/avatar-1.jpg",
      rating: 5,
      quote:
        "Triply made planning my SE Asia trip incredibly easy. The budget tool was a lifesaver! Highly recommended.",
    },
    {
      id: "2",
      name: "David K.",
      role: "Explorer",
      avatar: "/images/avatar-2.jpg",
      rating: 5,
      quote:
        "Triply made planning my SE Asia trip incredibly easy. The budget tool was a lifesaver! Highly recommended.",
    },
    {
      id: "3",
      name: "Elena R.",
      role: "Solo Explorer",
      avatar: "/images/avatar-3.jpg",
      rating: 5,
      quote:
        "Triply made planning my SE Asia trip incredibly easy. The budget tool was a lifesaver! Highly recommended.",
    },
  ];

  return (
    <section className="w-full bg-[#f8fafd] py-20 lg:py-24 px-4 sm:px-6 lg:px-8 xl:px-12 flex justify-center border-t border-slate-100/60">
      <div className="max-w-[1200px] w-full flex flex-col items-center">

        {/* Section Heading */}
        <div className="text-center mb-12 sm:mb-14">
          <h2 className="text-3xl sm:text-4xl md:text-[36px] font-extrabold text-[#0e1326] tracking-tight">
            What Our Travelers Say
          </h2>
        </div>

        {/* 3 Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-7 w-full">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_32px_rgba(0,0,0,0.06)] hover:border-slate-200/80 transition-all flex flex-col justify-between"
            >
              {/* Header: Avatar + Name/Role + Stars */}
              <div className="flex items-center gap-3.5 mb-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-slate-100">
                  <Image
                    src={item.avatar}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-col">
                  <span className="text-[14px] font-bold text-[#0e1326] leading-tight">
                    {item.name} <span className="font-normal text-slate-500">- {item.role}</span>
                  </span>

                  {/* 5 Stars */}
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5 fill-[#fbbf24] text-[#fbbf24]"
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Quote */}
              <p className="text-[13.5px] text-[#4b5563] leading-relaxed font-normal">
                &ldquo;{item.quote}&rdquo;
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
