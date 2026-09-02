"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { ExpenseItem } from "./TopExpenses";

interface SpendingOverviewProps {
  expenses?: ExpenseItem[];
}

const categoryColors: Record<string, string> = {
  Accommodation: "#3b82f6",
  "Food & Dining": "#10b981",
  Transport: "#f97316",
  Activities: "#f59e0b",
  Others: "#a855f7",
};

export default function SpendingOverview({ expenses = [] }: SpendingOverviewProps) {
  const categoryTotals: Record<string, number> = {
    Accommodation: 0,
    "Food & Dining": 0,
    Transport: 0,
    Activities: 0,
    Others: 0,
  };

  let totalSpent = 0;

  if (expenses && expenses.length > 0) {
    expenses.forEach((exp) => {
      const cat = exp.category;
      const amt = Number(exp.amount) || 0;
      totalSpent += amt;
      if (cat in categoryTotals) {
        categoryTotals[cat] += amt;
      } else {
        categoryTotals["Others"] += amt;
      }
    });
  }

  const hasExpenses = totalSpent > 0;

  // If no expenses, render 1 neutral slice so donut ring stays visible
  const chartData = hasExpenses
    ? Object.keys(categoryTotals).map((cat) => ({
        name: cat,
        value: categoryTotals[cat],
        color: categoryColors[cat] || "#94a3b8",
      }))
    : [{ name: "No Expenses", value: 1, color: "#e2e8f0" }];

  const legendList = Object.keys(categoryTotals).map((cat) => {
    const val = categoryTotals[cat];
    const pct = totalSpent > 0 ? Math.round((val / totalSpent) * 100) : 0;
    return {
      name: cat,
      value: val,
      percentage: `${pct}%`,
      color: categoryColors[cat] || "#94a3b8",
    };
  });

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col h-full min-h-[300px] transition-all hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
      {/* Header */}
      <div>
        <h3 className="text-[14px] font-extrabold text-[#0e1326] tracking-tight">
          Spending Overview
        </h3>
        <p className="text-[11px] text-[#94a3b8] font-medium mt-0.5">
          This Month
        </p>
      </div>

      {/* Main Content (Donut Chart + Legend) */}
      <div className="flex-1 flex flex-col md:flex-row items-center justify-between gap-4 mt-2">
        {/* Donut Chart with Center Text */}
        <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={75}
                paddingAngle={hasExpenses ? 3 : 0}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              {hasExpenses && (
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-[#0e1326] text-white py-1.5 px-3 rounded-lg shadow-md">
                          <p className="text-[11px] font-semibold">
                            {payload[0].name}:{" "}
                            <span className="font-bold">${payload[0].value}</span>
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              )}
            </PieChart>
          </ResponsiveContainer>

          {/* Center Text Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-[11px] text-[#94a3b8] font-semibold">Total</span>
            <span className="text-[20px] font-extrabold text-[#0e1326] leading-tight">
              ${totalSpent.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div className="w-full md:w-auto flex-1 flex flex-col gap-2.5">
          {legendList.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between text-[12.5px] font-semibold"
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-sm shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-[#64748b]">{item.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#94a3b8] text-[11.5px] font-medium w-8 text-right">
                  {item.percentage}
                </span>
                <span className="text-[#0e1326] font-extrabold w-12 text-right">
                  ${item.value.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
