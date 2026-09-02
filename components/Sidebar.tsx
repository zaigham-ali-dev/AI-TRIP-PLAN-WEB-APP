"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  MapPin, 
  LayoutGrid, 
  Compass, 
  Wallet, 
  Receipt, 
  Route, 
  Building2, 
  RefreshCw, 
  Coins, 
  Sparkles, 
  BarChart3, 
  Settings,
  Crown,
  X
} from "lucide-react";

interface SidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onCloseMobile?: () => void;
}

interface MenuItem {
  name: string;
  icon: any;
  href: string;
}

export default function Sidebar({ 
  activeTab, 
  onTabChange,
  onCloseMobile 
}: SidebarProps) {
  const pathname = usePathname();

  const menuItems: MenuItem[] = [
    { name: "Dashboard", icon: LayoutGrid, href: "/dashboard" },
    { name: "Trips", icon: Compass, href: "/trips" },
    { name: "Budget", icon: Wallet, href: "/budget" },
    { name: "Expenses", icon: Receipt, href: "/expenses" },
    { name: "Routes", icon: Route, href: "/routes" },
    { name: "Accommodation", icon: Building2, href: "/accommodation" },
    { name: "Currency", icon: RefreshCw, href: "/currency" },
    { name: "Cost of Living", icon: Coins, href: "/cost-of-living" },
    { name: "AI Planner", icon: Sparkles, href: "/ai-planner" },
    { name: "Reports", icon: BarChart3, href: "/reports" },
    { name: "Settings", icon: Settings, href: "/settings" },
  ];

  // Determine active item based on activeTab prop or current URL pathname
  const getIsActive = (item: MenuItem) => {
    if (activeTab) {
      return item.name.toLowerCase() === activeTab.toLowerCase();
    }
    if (pathname === item.href) return true;
    if (item.href !== "/dashboard" && pathname.startsWith(item.href)) return true;
    if (item.name === "Dashboard" && pathname === "/dashboard") return true;
    return false;
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 sm:p-5 bg-white border-r border-slate-100 select-none">
      {/* Top Header Logo */}
      <div>
        <div className="flex items-center justify-between mb-7 px-2">
          <Link href="/dashboard" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <MapPin className="w-4 h-4 text-white fill-white/20" />
            </div>
            <span className="text-xl font-extrabold text-[#0e1326] tracking-tight">
              Triply
            </span>
          </Link>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = getIsActive(item);

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => {
                  onTabChange?.(item.name);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13.5px] font-semibold transition-all ${
                  isActive
                    ? "bg-[#eef2ff] text-blue-600 font-bold shadow-xs"
                    : "text-[#64748b] hover:bg-slate-50 hover:text-[#0e1326]"
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? "text-blue-600" : "text-[#94a3b8]"
                  }`}
                />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Upgrade to Pro Card */}
      <div className="mt-8 pt-4">
        <div className="bg-gradient-to-b from-slate-50 to-blue-50/40 border border-slate-100 rounded-2xl p-4 flex flex-col gap-2.5 relative overflow-hidden">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
              <Crown className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
            </div>
            <span className="text-[13px] font-extrabold text-[#0e1326] tracking-tight">
              Upgrade to Pro
            </span>
          </div>

          <p className="text-[11.5px] text-[#64748b] font-medium leading-snug">
            Unlock all features and plan like a pro.
          </p>

          <button className="w-full mt-1.5 py-2 px-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-[12.5px] font-bold rounded-xl shadow-xs transition-all cursor-pointer">
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
}
