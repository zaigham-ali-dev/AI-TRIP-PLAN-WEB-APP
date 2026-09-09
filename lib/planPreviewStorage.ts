import type {
  AITripResponse,
  DetailedDayPlan,
  GranularBudget,
} from "@/lib/itineraryGenerator";

const PLAN_PREVIEW_STORAGE_KEY = "saved_plan_preview";

export interface SavedPlanPreview {
  destination: string;
  budget: number;
  days: number;
  travelStyle: string;
  groupSize: string;
  itinerary: DetailedDayPlan[];
  aiResponse: AITripResponse | null;
  budgetAllocation: GranularBudget | null;
  savedAt: string;
}

/**
 * Keeps the complete AI response separate from pending_trip. The latter is
 * consumed when a trip is synced to Firestore, while this snapshot must remain
 * available until the user returns from authentication.
 */
export function savePlanPreview(plan: SavedPlanPreview) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PLAN_PREVIEW_STORAGE_KEY, JSON.stringify(plan));
}

export function getSavedPlanPreview(): SavedPlanPreview | null {
  if (typeof window === "undefined") return null;

  try {
    const rawPlan = localStorage.getItem(PLAN_PREVIEW_STORAGE_KEY);
    if (!rawPlan) return null;

    const plan = JSON.parse(rawPlan) as SavedPlanPreview;
    if (!plan.destination || !Array.isArray(plan.itinerary) || plan.itinerary.length === 0) {
      return null;
    }

    return plan;
  } catch (error) {
    console.error("Failed to restore saved plan preview:", error);
    return null;
  }
}
