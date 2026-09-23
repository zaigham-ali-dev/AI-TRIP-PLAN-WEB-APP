"use client";

import { useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

function DashboardContent() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/plan-preview");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#f8fafd] flex flex-col items-center justify-center p-6">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <span className="text-sm font-semibold text-slate-600">
          Redirecting to your trip preview…
        </span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f8fafd] flex flex-col items-center justify-center p-6">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
