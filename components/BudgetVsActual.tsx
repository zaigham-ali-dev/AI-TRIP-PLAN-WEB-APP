"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ExpenseItem } from "./TopExpenses";

interface BudgetVsActualProps {
  expenses?: ExpenseItem[];
}

const defaultCategoryBudgets: Record<string, number> = {
  Accommodation: 750,
  "Food & Dining": 450,
  Transport: 350,
  Activities: 250,
  Others: 250,
};

export default function BudgetVsActual({ expenses = [] }: BudgetVsActualProps) {
  const actualTotals: Record<string, number> = {
    Accommodation: 0,
    "Food & Dining": 0,
    Transport: 0,
    Activities: 0,
    Others: 0,
  };

  if (expenses && expenses.length > 0) {
    expenses.forEach((exp) => {
      const cat = exp.category;
      const amt = Number(exp.amount) || 0;
      if (cat in actualTotals) {
        actualTotals[cat] += amt;
      } else {
        actualTotals["Others"] += amt;
      }
    });
  }

  const data = [
    {
      name: "Accommodation",
      budget: defaultCategoryBudgets["Accommodation"],
      actual: actualTotals["Accommodation"],
    },
    {
      name: "Food & Dining",
      budget: defaultCategoryBudgets["Food & Dining"],
      actual: actualTotals["Food & Dining"],
    },
    {
      name: "Transport",
      budget: defaultCategoryBudgets["Transport"],
      actual: actualTotals["Transport"],
    },
    {
      name: "Activities",
      budget: defaultCategoryBudgets["Activities"],
      actual: actualTotals["Activities"],
    },
    {
      name: "Others",
      budget: defaultCategoryBudgets["Others"],
      actual: actualTotals["Others"],
    },
  ];

  const maxVal = Math.max(...data.map((d) => Math.max(d.budget, d.actual)), 800);
  const domainMax = Math.ceil(maxVal / 200) * 200;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col h-full min-h-[300px] transition-all hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
      {/* Header & Legend */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-[14px] font-extrabold text-[#0e1326] tracking-tight">
            Budget vs Actual
          </h3>
          <p className="text-[11px] text-[#94a3b8] font-medium mt-0.5">
            This Month
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11.5px] font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-blue-200" />
            <span className="text-[#94a3b8]">Budget</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-blue-600" />
            <span className="text-[#0e1326]">Actual</span>
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="flex-1 mt-2 min-h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 15, right: 10, left: -20, bottom: 0 }}
            barGap={4}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 500 }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 500 }}
              tickFormatter={(value) => `$${value}`}
              domain={[0, domainMax]}
            />
            <Tooltip
              cursor={{ fill: "#f8fafc" }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-[#0e1326] text-white p-2.5 rounded-xl shadow-md text-[11px]">
                      <p className="font-bold mb-1">{label}</p>
                      <p className="text-blue-200">
                        Budget:{" "}
                        <span className="font-bold">
                          ${payload[0]?.value?.toLocaleString()}
                        </span>
                      </p>
                      <p className="text-blue-400">
                        Actual:{" "}
                        <span className="font-bold">
                          ${payload[1]?.value?.toLocaleString()}
                        </span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="budget"
              fill="#bfdbfe"
              radius={[4, 4, 0, 0]}
              maxBarSize={22}
            />
            <Bar
              dataKey="actual"
              fill="#2563eb"
              radius={[4, 4, 0, 0]}
              maxBarSize={22}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
