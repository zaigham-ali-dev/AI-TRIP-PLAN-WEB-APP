import React from "react";
import { MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-slate-100 py-12 md:py-16 px-4 sm:px-6 lg:px-8 xl:px-12 flex flex-col items-center">
      <div className="max-w-[1550px] w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 mb-12">

        {/* Column 1: Brand Logo & Tagline & Socials */}
        <div className="lg:col-span-3 flex flex-col items-start gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4.5 h-4.5 text-blue-600 fill-blue-600/10" />
            <span className="text-[16px] font-extrabold text-[#0e1326] tracking-tight">Triply</span>
          </div>
          <p className="text-[12px] text-[#64748b] font-medium max-w-[220px] leading-relaxed">
            The smart way to plan, budget and enjoy your travels.
          </p>
          <div className="flex items-center gap-3 mt-1">
            <Link href="#" className="w-7 h-7 rounded-full bg-[#f8fafd] hover:bg-slate-100 flex items-center justify-center text-[#0e1326] transition-colors">
              <svg className="w-3.5 h-3.5 fill-[#0e1326]" viewBox="0 0 24 24">
                <path d="M9 8H7v3h2v9h4v-9h3.6l.4-3H13V6c0-.5.5-1 1-1h3V1H13c-2.8 0-5 2.2-5 5v2z" />
              </svg>
            </Link>
            <Link href="#" className="w-7 h-7 rounded-full bg-[#f8fafd] hover:bg-slate-100 flex items-center justify-center text-[#0e1326] transition-colors">
              <svg className="w-3.5 h-3.5 fill-[#0e1326]" viewBox="0 0 24 24">
                <path d="M18.2 2.4h3.3L14.3 11l8.5 11.3h-6.7l-5.2-6.9-6 6.9H1.6l7.6-8.7L1.1 2.4h6.9l4.7 6.2 5.5-6.2zm-1.2 17.6h1.8L7.1 4.2H5.2l11.8 15.8z" />
              </svg>
            </Link>
            <Link href="#" className="w-7 h-7 rounded-full bg-[#f8fafd] hover:bg-slate-100 flex items-center justify-center text-[#0e1326] transition-colors">
              <svg className="w-3.5 h-3.5 text-[#0e1326]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01" />
              </svg>
            </Link>
            <Link href="#" className="w-7 h-7 rounded-full bg-[#f8fafd] hover:bg-slate-100 flex items-center justify-center text-[#0e1326] transition-colors">
              <svg className="w-3.5 h-3.5 fill-[#0e1326]" viewBox="0 0 24 24">
                <path d="M23.5 6.2c-.3-1.1-1.1-2-2.2-2.2C19.3 3.5 12 3.5 12 3.5s-7.3 0-9.3.5c-1.1.2-1.9 1.1-2.2 2.2C0 8.2 0 12 0 12s0 3.8.5 5.8c.3 1.1 1.1 2 2.2 2.2 2 .5 9.3.5 9.3.5s7.3 0 9.3-.5c1.1-.2 1.9-1.1 2.2-2.2.5-2 .5-5.8.5-5.8s0-3.8-.5-5.8z" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Column 2: Product */}
        <div className="lg:col-span-2 flex flex-col items-start gap-3">
          <h4 className="text-[13px] font-extrabold text-[#0e1326] tracking-tight">Product</h4>
          <ul className="flex flex-col gap-2.5">
            {["Features", "Budget Calculator", "AI Planner", "Cost of Living"].map((item) => (
              <li key={item}>
                <Link href="#" className="text-[12px] text-[#64748b] hover:text-blue-600 font-semibold transition-colors">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Company */}
        <div className="lg:col-span-2 flex flex-col items-start gap-3">
          <h4 className="text-[13px] font-extrabold text-[#0e1326] tracking-tight">Company</h4>
          <ul className="flex flex-col gap-2.5">
            {["About Us", "Blog", "Careers", "Contact Us"].map((item) => (
              <li key={item}>
                <Link href="#" className="text-[12px] text-[#64748b] hover:text-blue-600 font-semibold transition-colors">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Support */}
        <div className="lg:col-span-2 flex flex-col items-start gap-3">
          <h4 className="text-[13px] font-extrabold text-[#0e1326] tracking-tight">Support</h4>
          <ul className="flex flex-col gap-2.5">
            {["Help Center", "Privacy Policy", "Terms of Service", "Refund Policy"].map((item) => (
              <li key={item}>
                <Link href="#" className="text-[12px] text-[#64748b] hover:text-blue-600 font-semibold transition-colors">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 5: Newsletter */}
        <div className="lg:col-span-3 flex flex-col items-start gap-3">
          <h4 className="text-[13px] font-extrabold text-[#0e1326] tracking-tight">Newsletter</h4>
          <p className="text-[12px] text-[#64748b] font-medium leading-relaxed">
            Get travel tips & exclusive deals
          </p>
          <div className="w-full max-w-[260px] relative flex items-center bg-white border border-slate-200/80 rounded-xl p-1.5 pl-3 hover:border-slate-300 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/5 transition-all mt-1">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full bg-transparent text-slate-800 placeholder-slate-400/80 text-[12px] font-semibold outline-none"
            />
            <button className="w-7 h-7 bg-transparent hover:bg-slate-50 text-[#0e1326] rounded-lg flex items-center justify-center transition-colors shrink-0 cursor-pointer">
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Copyright text at the bottom */}
      <div className="w-full max-w-[1550px] border-t border-slate-100/80 pt-8 text-center">
        <span className="text-[11.5px] text-[#94a3b8] font-semibold tracking-tight">
          © 2026 Triply. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
