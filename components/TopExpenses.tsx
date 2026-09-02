"use client";

import React from "react";
import Link from "next/link";
import { Home, Utensils, Car, Ticket, MoreHorizontal, Trash2 } from "lucide-react";

export interface ExpenseItem {
  id?: string;
  title: string;
  amount: number;
  category: string;
  date?: string;
}

interface TopExpensesProps {
  expenses?: ExpenseItem[];
  onAddExpense?: () => void;
  onDeleteCategory?: (category: string) => void;
  onDeleteExpense?: (id: string) => void;
}

export default function TopExpenses({
  expenses,
  onAddExpense,
  onDeleteCategory,
}: TopExpensesProps) {
  // Compute category totals dynamically if expenses are provided
  const categoryTotals: Record<string, number> = {
    Accommodation: 0,
    "Food & Dining": 0,
    Transport: 0,
    Activities: 0,
    Others: 0,
  };

  const categoryCounts: Record<string, number> = {
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
      if (cat in categoryTotals) {
        categoryTotals[cat] += amt;
        categoryCounts[cat] += 1;
      } else {
        categoryTotals["Others"] += amt;
        categoryCounts["Others"] += 1;
      }
    });
  }

  const categoryConfigs = [
    {
      name: "Accommodation",
      amount: `$${categoryTotals["Accommodation"].toLocaleString()}`,
      rawAmount: categoryTotals["Accommodation"],
      count: categoryCounts["Accommodation"],
      color: "bg-blue-500",
      iconBg: "bg-blue-50",
      textColor: "text-blue-600",
      icon: Home,
    },
    {
      name: "Food & Dining",
      amount: `$${categoryTotals["Food & Dining"].toLocaleString()}`,
      rawAmount: categoryTotals["Food & Dining"],
      count: categoryCounts["Food & Dining"],
      color: "bg-emerald-500",
      iconBg: "bg-emerald-50",
      textColor: "text-emerald-600",
      icon: Utensils,
    },
    {
      name: "Transport",
      amount: `$${categoryTotals["Transport"].toLocaleString()}`,
      rawAmount: categoryTotals["Transport"],
      count: categoryCounts["Transport"],
      color: "bg-orange-500",
      iconBg: "bg-orange-50",
      textColor: "text-orange-500",
      icon: Car,
    },
    {
      name: "Activities",
      amount: `$${categoryTotals["Activities"].toLocaleString()}`,
      rawAmount: categoryTotals["Activities"],
      count: categoryCounts["Activities"],
      color: "bg-amber-500",
      iconBg: "bg-amber-50",
      textColor: "text-amber-500",
      icon: Ticket,
    },
    {
      name: "Others",
      amount: `$${categoryTotals["Others"].toLocaleString()}`,
      rawAmount: categoryTotals["Others"],
      count: categoryCounts["Others"],
      color: "bg-purple-500",
      iconBg: "bg-purple-50",
      textColor: "text-purple-600",
      icon: MoreHorizontal,
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col h-full min-h-[310px] transition-all hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[13px] font-bold text-[#0e1326] tracking-tight">
          Top Expenses
        </span>
        <div className="flex items-center gap-2">
          {onAddExpense && (
            <button
              onClick={onAddExpense}
              className="text-[11px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100/80 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
            >
              + Add Expense
            </button>
          )}
          <Link
            href="/expenses"
            className="text-[11.5px] font-bold text-slate-500 hover:text-blue-600 transition-colors"
          >
            View All
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-3.5 flex-1 justify-center">
        {categoryConfigs.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.name}
              className="flex items-center justify-between py-1 group"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-xl ${item.iconBg} flex items-center justify-center shrink-0 shadow-xs`}
                >
                  <Icon className={`w-4 h-4 ${item.textColor}`} />
                </div>
                <span className="text-[13px] text-[#0e1326] font-semibold tracking-tight">
                  {item.name}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-[13px] font-extrabold text-[#0e1326]">
                  {item.amount}
                </span>
                {onDeleteCategory && item.count > 0 && (
                  <button
                    onClick={() => onDeleteCategory(item.name)}
                    className="p-1 rounded-lg text-slate-300 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer opacity-80 hover:opacity-100"
                    title={`Delete all ${item.name} expenses (${item.count})`}
                    aria-label={`Delete ${item.name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
