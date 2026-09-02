"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { ArrowDownRight } from "lucide-react";
import { ExpenseItem } from "./TopExpenses";

interface SpendingChartProps {
  expenses?: ExpenseItem[];
  dailyAverage?: number;
}

const emptyChartData = [
  { name: "Mon", value: 0 },
  { name: "Tue", value: 0 },
  { name: "Wed", value: 0 },
  { name: "Thu", value: 0 },
  { name: "Fri", value: 0 },
  { name: "Sat", value: 0 },
  { name: "Sun", value: 0 },
];

export default function SpendingChart({
  expenses = [],
  dailyAverage = 0,
}: SpendingChartProps) {
  let chartData = emptyChartData;
  let peakIndex = -1;
  let peakValue = 0;

  if (expenses && expenses.length > 0) {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const orderedDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const dayTotals: Record<string, number> = {
      Mon: 0,
      Tue: 0,
      Wed: 0,
      Thu: 0,
      Fri: 0,
      Sat: 0,
      Sun: 0,
    };

    expenses.forEach((exp) => {
      if (exp.date) {
        try {
          const d = new Date(exp.date);
          const dayName = days[d.getDay()];
          if (dayName in dayTotals) {
            dayTotals[dayName] += Number(exp.amount) || 0;
          }
        } catch {
          // ignore date parse errors
        }
      }
    });

    const hasAnyDayData = Object.values(dayTotals).some((v) => v > 0);

    if (hasAnyDayData) {
      chartData = orderedDays.map((day) => ({
        name: day,
        value: dayTotals[day],
      }));

      // Find peak
      let maxVal = 0;
      chartData.forEach((item, idx) => {
        if (item.value > maxVal) {
          maxVal = item.value;
          peakIndex = idx;
          peakValue = item.value;
        }
      });
    }
  }

  const CustomBadge = (props: any) => {
    const { x, y, index } = props;
    if (index !== peakIndex || peakValue <= 0) return null;

    return (
      <g>
        {/* Outer Glow */}
        <circle cx={x} cy={y} r={7} fill="#2563eb" opacity={0.25} />
        {/* Main Dot */}
        <circle cx={x} cy={y} r={4.5} fill="#2563eb" stroke="white" strokeWidth={2.5} />

        {/* Badge background */}
        <rect
          x={x - 22}
          y={y - 32}
          width={44}
          height={22}
          rx={6}
          fill="#0e1326"
          className="shadow-sm"
        />
        {/* Pointer triangle */}
        <polygon
          points={`${x - 4},${y - 10} ${x + 4},${y - 10} ${x},${y - 6}`}
          fill="#0e1326"
        />
        {/* Text */}
        <text
          x={x}
          y={y - 17}
          fill="white"
          fontSize={10}
          fontWeight="bold"
          textAnchor="middle"
        >
          ${peakValue}
        </text>
      </g>
    );
  };

  const maxValueInChart = Math.max(...chartData.map((d) => d.value), 100);
  const yDomainMax = Math.ceil(maxValueInChart / 50) * 50;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col h-full min-h-[310px] transition-all hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
      <div>
        <span className="text-[13px] font-semibold text-[#0e1326] tracking-tight">
          Daily Spending
        </span>
        <div className="mt-1">
          <span className="text-[10px] text-[#94a3b8] font-semibold uppercase tracking-wider block">
            Daily Average
          </span>
          <div className="flex items-center gap-2.5 mt-0.5">
            <span className="text-[26px] font-extrabold text-[#0e1326] tracking-tight leading-none">
              ${Math.round(dailyAverage).toLocaleString()}
            </span>
            {dailyAverage > 0 && (
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-bold border border-emerald-100/50">
                <ArrowDownRight className="w-3 h-3" />
                8% vs yesterday
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 mt-4 min-h-[190px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 35, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563eb" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#2563eb" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />

            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 500 }}
              dy={10}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={false}
              domain={[0, yDomainMax]}
            />

            <Tooltip
              cursor={{ stroke: "#cbd5e1", strokeWidth: 1, strokeDasharray: "2 2" }}
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

            <Area
              type="monotone"
              dataKey="value"
              stroke="#2563eb"
              strokeWidth={2.5}
              fill="url(#chartGradient)"
              label={<CustomBadge />}
              dot={{ r: 3, fill: "white", stroke: "#2563eb", strokeWidth: 2 }}
              activeDot={{ r: 5, fill: "#2563eb", stroke: "white", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
