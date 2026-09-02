"use client";

import React from "react";

export default function SmartPlanning() {
  return (
    <section className="w-full bg-[#f8fafd] py-20 lg:py-28 px-6 sm:px-10 lg:px-14 xl:px-20">
      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center gap-14 lg:gap-20">

        {/* Left Side - Text Content */}
        <div className="w-full lg:w-[40%] flex flex-col items-start">
          <h2 className="text-[32px] sm:text-[38px] lg:text-[42px] font-extrabold text-[#0e1326] leading-[1.15] tracking-tight">
            Smarter planning{" "}
            <br />
            every step of the way
          </h2>

          <p className="mt-5 text-[15px] sm:text-[16px] text-[#4b5563] leading-relaxed max-w-md">
            We combine travel planning with financial management to help you get the most out of your journey.
          </p>

          {/* Checklist */}
          <div className="mt-8 flex flex-col gap-4">
            {[
              "Real-time pricing insights",
              "Personalized travel budgets",
              "Avoid overspending",
              "Perfect for travelers, digital nomads, expats & more",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#2563eb] flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span className="text-[15px] text-[#1e293b] font-medium leading-snug">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Dashboard Mockup */}
        <div className="w-full lg:w-[60%] flex justify-center lg:justify-end">
          <div className="w-full max-w-[700px] bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden">
            <div className="flex min-h-[420px]">

              {/* Sidebar */}
              <div className="w-[170px] shrink-0 border-r border-slate-100 py-5 px-4 hidden sm:flex flex-col">
                {/* Logo */}
                <div className="flex items-center gap-2 mb-6 px-1">
                  <div className="w-6 h-6 rounded-full bg-[#2563eb] flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-white">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z" />
                    </svg>
                  </div>
                  <span className="text-[13px] font-extrabold text-[#0e1326]">Triply</span>
                </div>

                {/* Nav Items */}
                <nav className="flex flex-col gap-0.5">
                  {[
                    { name: "Dashboard", active: true, icon: "grid" },
                    { name: "Trips", active: false, icon: "compass" },
                    { name: "Budget", active: false, icon: "wallet" },
                    { name: "Expenses", active: false, icon: "receipt" },
                    { name: "Routes", active: false, icon: "map" },
                    { name: "Accommodation", active: false, icon: "building" },
                    { name: "Currency", active: false, icon: "currency" },
                    { name: "Cost of Living", active: false, icon: "chart" },
                    { name: "AI Planner", active: false, icon: "sparkle" },
                    { name: "Reports", active: false, icon: "file" },
                    { name: "Settings", active: false, icon: "settings" },
                  ].map((item) => (
                    <div
                      key={item.name}
                      className={`flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg text-[11.5px] font-medium cursor-pointer transition-colors ${item.active
                          ? "bg-[#eff4ff] text-[#2563eb] font-semibold"
                          : "text-[#64748b] hover:bg-slate-50"
                        }`}
                    >
                      <SidebarIcon type={item.icon} active={item.active} />
                      <span>{item.name}</span>
                    </div>
                  ))}
                </nav>
              </div>

              {/* Main Dashboard Content */}
              <div className="flex-1 p-5 sm:p-6 flex flex-col gap-5 overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-[16px] font-bold text-[#0e1326]">
                      Good morning, Alex <span>👋</span>
                    </h3>
                    <p className="text-[11.5px] text-[#94a3b8] mt-0.5">Here&apos;s your travel overview</p>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-[#64748b]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                      </svg>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#2563eb] flex items-center justify-center">
                      <span className="text-white text-[11px] font-bold">A</span>
                    </div>
                  </div>
                </div>

                {/* Stat Cards Row */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Total Budget", value: "$2,500" },
                    { label: "Total Spent", value: "$1,620" },
                    { label: "Days Left", value: "7" },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-[#f8fafd] rounded-xl p-3.5 border border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-[#94a3b8] font-medium">{stat.label}</span>
                        <svg className="w-3 h-3 text-[#cbd5e1]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </div>
                      <div className="text-[18px] sm:text-[20px] font-extrabold text-[#0e1326] mt-1">{stat.value}</div>
                    </div>
                  ))}
                </div>

                {/* Bottom Row: Chart + Expenses */}
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 flex-1">

                  {/* Daily Spending Chart */}
                  <div className="sm:col-span-3 bg-[#f8fafd] rounded-xl p-4 border border-slate-100 flex flex-col">
                    <span className="text-[12px] font-semibold text-[#0e1326]">Daily Spending</span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-[22px] font-extrabold text-[#0e1326]">$120</span>
                    </div>
                    <span className="text-[10px] text-[#94a3b8] -mt-0.5">Daily Average</span>

                    {/* Chart Area */}
                    <div className="flex-1 mt-4 relative min-h-[100px]">
                      <svg viewBox="0 0 300 100" className="w-full h-full" preserveAspectRatio="none">
                        {/* Grid lines */}
                        <line x1="0" y1="25" x2="300" y2="25" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="3 3" />
                        <line x1="0" y1="50" x2="300" y2="50" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="3 3" />
                        <line x1="0" y1="75" x2="300" y2="75" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="3 3" />

                        {/* Area fill */}
                        <path
                          d="M0,65 C25,60 50,55 75,50 C100,45 125,48 150,42 C175,36 200,30 225,20 C237,22 262,35 300,55 L300,100 L0,100 Z"
                          fill="url(#areaGradient)"
                        />

                        {/* Line */}
                        <path
                          d="M0,65 C25,60 50,55 75,50 C100,45 125,48 150,42 C175,36 200,30 225,20 C237,22 262,35 300,55"
                          fill="none"
                          stroke="#2563eb"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />

                        {/* Dots */}
                        <circle cx="0" cy="65" r="3" fill="white" stroke="#2563eb" strokeWidth="1.5" />
                        <circle cx="50" cy="55" r="3" fill="white" stroke="#2563eb" strokeWidth="1.5" />
                        <circle cx="100" cy="48" r="3" fill="white" stroke="#2563eb" strokeWidth="1.5" />
                        <circle cx="150" cy="42" r="3" fill="white" stroke="#2563eb" strokeWidth="1.5" />
                        <circle cx="200" cy="30" r="3" fill="white" stroke="#2563eb" strokeWidth="1.5" />
                        <circle cx="225" cy="20" r="3.5" fill="#2563eb" stroke="white" strokeWidth="1.5" />
                        <circle cx="275" cy="45" r="3" fill="white" stroke="#2563eb" strokeWidth="1.5" />

                        <defs>
                          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.12" />
                            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.02" />
                          </linearGradient>
                        </defs>
                      </svg>

                      {/* $135 label near peak */}
                      <div className="absolute" style={{ top: "6%", right: "18%" }}>
                        <span className="text-[10px] font-bold text-[#0e1326]">$135</span>
                      </div>
                    </div>

                    {/* X-axis labels */}
                    <div className="flex justify-between mt-2 px-0.5">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                        <span key={day} className="text-[9px] text-[#94a3b8] font-medium">{day}</span>
                      ))}
                    </div>
                  </div>

                  {/* Top Expenses */}
                  <div className="sm:col-span-2 bg-[#f8fafd] rounded-xl p-4 border border-slate-100 flex flex-col">
                    <span className="text-[12px] font-semibold text-[#0e1326] mb-4">Top Expenses</span>
                    <div className="flex flex-col gap-3.5">
                      {[
                        { name: "Accommodation", amount: "$650", color: "#2563eb" },
                        { name: "Food & Dining", amount: "$220", color: "#f59e0b" },
                        { name: "Transport", amount: "$260", color: "#8b5cf6" },
                        { name: "Activities", amount: "$180", color: "#ef4444" },
                        { name: "Others", amount: "$190", color: "#f97316" },
                      ].map((expense) => (
                        <div key={expense.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: expense.color }}
                            />
                            <span className="text-[11px] text-[#64748b] font-medium">{expense.name}</span>
                          </div>
                          <span className="text-[11px] font-bold text-[#0e1326]">{expense.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Sidebar icon component */
function SidebarIcon({ type, active }: { type: string; active: boolean }) {
  const color = active ? "#2563eb" : "#94a3b8";
  const size = "w-4 h-4";

  const icons: Record<string, React.ReactNode> = {
    grid: (
      <svg className={size} viewBox="0 0 24 24" fill={color}>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
    compass: (
      <svg className={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" />
      </svg>
    ),
    wallet: (
      <svg className={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M16 14h.01" />
      </svg>
    ),
    receipt: (
      <svg className={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
        <path d="M8 10h8" />
        <path d="M8 14h4" />
      </svg>
    ),
    map: (
      <svg className={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3z" />
        <path d="M9 3v15" />
        <path d="M15 6v15" />
      </svg>
    ),
    building: (
      <svg className={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18" />
        <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
        <path d="M9 9h1M14 9h1M9 13h1M14 13h1" />
      </svg>
    ),
    currency: (
      <svg className={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v10" />
        <path d="M9 10h6a2 2 0 0 1 0 4H9" />
      </svg>
    ),
    chart: (
      <svg className={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="m19 9-5 5-4-4-3 3" />
      </svg>
    ),
    sparkle: (
      <svg className={size} viewBox="0 0 24 24" fill={color}>
        <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
      </svg>
    ),
    file: (
      <svg className={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        <path d="M10 12h4" />
        <path d="M10 16h4" />
      </svg>
    ),
    settings: (
      <svg className={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  };

  return <>{icons[type] || null}</>;
}
