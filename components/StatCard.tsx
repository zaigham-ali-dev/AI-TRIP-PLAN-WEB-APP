"use client";

import React from "react";
import { DollarSign, Car, Calendar, Activity, ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface DashboardStats {
  totalBudget: number;
  totalSpent: number;
  daysLeft: number;
  destination: string;
  dailyAverage: number;
  spentPercentage?: number;
}

interface SingleStatCardProps {
  label?: string;
  value?: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  stats?: DashboardStats;
}

function SingleStatCard({
  label,
  value,
  subtitle,
  icon: Icon,
  iconBg = "bg-blue-50",
  iconColor = "text-blue-600",
}: SingleStatCardProps) {
  if (label && value !== undefined && !Icon && !subtitle) {
    return (
      <div className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[105px] transition-all hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-[#94a3b8] tracking-tight">
            {label}
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-[#cbd5e1]" />
        </div>
        <div className="text-[24px] font-extrabold text-[#0e1326] mt-2 tracking-tight">
          {value}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center justify-between transition-all hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
      <div>
        <span className="text-[12px] font-semibold text-[#94a3b8] tracking-tight block">
          {label}
        </span>
        <div className="text-[26px] font-extrabold text-[#0e1326] mt-1 tracking-tight leading-none">
          {value}
        </div>
        {subtitle && (
          <span className="text-[11px] text-[#94a3b8] font-medium mt-1.5 block">
            {subtitle}
          </span>
        )}
      </div>

      {Icon && (
        <div
          className={`w-11 h-11 rounded-full ${iconBg} flex items-center justify-center shrink-0 shadow-xs`}
        >
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
      )}
    </div>
  );
}

export default function StatCards({
  label,
  value,
  subtitle,
  icon,
  iconBg,
  iconColor,
  stats,
}: SingleStatCardProps) {
  // If props are passed (e.g. from Landing page single card usage), render single card
  if (label || value) {
    return (
      <SingleStatCard
        label={label}
        value={value}
        subtitle={subtitle}
        icon={icon}
        iconBg={iconBg}
        iconColor={iconColor}
      />
    );
  }

  const budgetVal = stats ? `$${stats.totalBudget.toLocaleString()}` : "$0";
  const spentVal = stats ? `$${stats.totalSpent.toLocaleString()}` : "$0";
  const spentPct = stats
    ? stats.totalBudget > 0
      ? `${((stats.totalSpent / stats.totalBudget) * 100).toFixed(1)}% of budget`
      : "0% of budget"
    : "0% of budget";
  const daysLeftVal = stats ? `${stats.daysLeft}` : "0";
  const destinationVal = stats?.destination ? `In ${stats.destination}` : "No Active Trip";
  const dailyAvgVal = stats ? `$${Math.round(stats.dailyAverage).toLocaleString()}` : "$0";

  const cardsData = [
    {
      id: "budget",
      title: "Total Budget",
      amount: budgetVal,
      subtitle: "This Month",
      icon: DollarSign,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      id: "spent",
      title: "Total Spent",
      amount: spentVal,
      subtitle: spentPct,
      icon: Car,
      iconBg: "bg-[#f3e8ff]",
      iconColor: "text-purple-600",
    },
    {
      id: "days",
      title: "Days Left",
      amount: daysLeftVal,
      subtitle: destinationVal,
      icon: Calendar,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      id: "average",
      title: "Daily Average",
      amount: dailyAvgVal,
      subtitle: "Spent per day",
      icon: Activity,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cardsData.map((stat) => (
        <SingleStatCard
          key={stat.id}
          label={stat.title}
          value={stat.amount}
          subtitle={stat.subtitle}
          icon={stat.icon}
          iconBg={stat.iconBg}
          iconColor={stat.iconColor}
        />
      ))}
    </div>
  );
}
