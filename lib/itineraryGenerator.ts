export interface PlaceSpot {
  spotName: string;
  title?: string;
  description: string;
  duration: string;
  costEstimate: number;
  estCost?: number;
  rating?: string;
  tip?: string;
  lat?: number;
  lng?: number;
}

export interface MealRecommendation {
  spotName: string;
  title?: string;
  recommendation: string;
  description?: string;
  estimatedCost: number;
  estCost?: number;
  rating?: string;
  tip?: string;
  lat?: number;
  lng?: number;
}

export interface DetailedDayPlan {
  day: number;
  title: string;
  summary: string;
  morning: PlaceSpot;
  breakfast: MealRecommendation;
  afternoon: PlaceSpot;
  lunch: MealRecommendation;
  evening: PlaceSpot;
  dinner: MealRecommendation;
  transport: {
    routeAdvice: string;
    estimatedCost: number;
  };
  dailySpendingTotal: number;
}

export interface BudgetItem {
  category: string;
  sublabel: string;
  amount: number;
  percentage: number;
  color: string;
  details: string[];
}

export interface GranularBudget {
  totalBudget: number;
  perDayBudget: number;
  hotelClass: string;
  nightlyRate: number;
  accommodationTotal: number;
  foodTotal: number;
  activitiesTotal: number;
  transportTotal: number;
  bufferTotal: number;
  items: BudgetItem[];
  tierName: string;
  currencyCode?: string;
  currencySymbol?: string;
}

export interface BookingLinkItem {
  name: string;
  url: string;
}

export interface BookingLinksGroup {
  hotels: BookingLinkItem[];
  taxis: BookingLinkItem[];
  flights: BookingLinkItem[];
}

export interface BookingQueries {
  luxuryHotels: string;
  taxiApp: string;
  flights: string;
}

export interface AITripResponse {
  destinationName: string;
  currency: string;
  localCurrency?: string;
  currencySymbol?: string;
  budgetBreakdown: {
    accommodation: number;
    food: number;
    activities: number;
    transport: number;
    emergencyBuffer: number;
    hotelClass?: string;
    nightlyRate?: number;
  };
  bookingQueries?: BookingQueries;
  bookingLinks?: BookingLinksGroup;
  itinerary: DetailedDayPlan[];
}

interface AITripRequest {
  destination: string;
  totalBudget: number;
  days: number;
  travelStyle?: string;
  groupSize?: string;
}

const inFlightTripRequests = new Map<string, Promise<AITripResponse>>();
const retryAfterByRequest = new Map<string, number>();

function getTripRequestKey(params: AITripRequest) {
  return JSON.stringify({
    destination: params.destination.trim().toLowerCase(),
    totalBudget: params.totalBudget,
    days: params.days,
    travelStyle: params.travelStyle || "",
    groupSize: params.groupSize || "",
  });
}

function getRetryAfterSeconds(response: Response, result: unknown) {
  const headerValue = Number(response.headers.get("Retry-After"));
  if (Number.isFinite(headerValue) && headerValue > 0) return headerValue;

  const retryAfter = (result as { retryAfterSeconds?: unknown })?.retryAfterSeconds;
  return typeof retryAfter === "number" && retryAfter > 0 ? retryAfter : 120;
}

/**
 * Client-side helper to fetch dynamic AI-generated trip data strictly from /api/generate-trip
 */
export function fetchAIGeneratedTrip(params: AITripRequest): Promise<AITripResponse> {
  const requestKey = getTripRequestKey(params);
  const retryAt = retryAfterByRequest.get(requestKey);
  if (retryAt && retryAt > Date.now()) {
    const secondsRemaining = Math.ceil((retryAt - Date.now()) / 1000);
    return Promise.reject(new Error(`AI itinerary generation is temporarily busy. Please try again in about ${secondsRemaining} seconds.`));
  }

  const existingRequest = inFlightTripRequests.get(requestKey);
  if (existingRequest) return existingRequest;

  const request = (async () => {
    const response = await fetch("/api/generate-trip", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    const result = await response.json();

    if (!response.ok || !result.success || !result.data) {
      if (response.status === 429 || response.status === 402) {
        const retryAfterSeconds = getRetryAfterSeconds(response, result);
        retryAfterByRequest.set(requestKey, Date.now() + retryAfterSeconds * 1000);
        throw new Error(`AI itinerary generation is temporarily busy. Please try again in about ${retryAfterSeconds} seconds.`);
      }

      const errorMsg = result.error || "Failed to generate AI trip. Please check your network connection and API key.";
      throw new Error(errorMsg);
    }

    const data = result.data as AITripResponse;

  // Normalize spot titles and costs for UI display
  if (Array.isArray(data.itinerary)) {
    data.itinerary = data.itinerary.map((plan) => {
      if (plan.morning) {
        plan.morning.spotName = plan.morning.spotName || plan.morning.title || "Morning Landmark";
        plan.morning.title = plan.morning.title || plan.morning.spotName;
        plan.morning.costEstimate = plan.morning.costEstimate ?? plan.morning.estCost ?? 15;
      }
      if (plan.afternoon) {
        plan.afternoon.spotName = plan.afternoon.spotName || plan.afternoon.title || "Afternoon Landmark";
        plan.afternoon.title = plan.afternoon.title || plan.afternoon.spotName;
        plan.afternoon.costEstimate = plan.afternoon.costEstimate ?? plan.afternoon.estCost ?? 25;
      }
      if (plan.evening) {
        plan.evening.spotName = plan.evening.spotName || plan.evening.title || "Evening Landmark";
        plan.evening.title = plan.evening.title || plan.evening.spotName;
        plan.evening.costEstimate = plan.evening.costEstimate ?? plan.evening.estCost ?? 20;
      }
      if (plan.breakfast) {
        plan.breakfast.spotName = plan.breakfast.spotName || plan.breakfast.title || "Breakfast Spot";
        plan.breakfast.title = plan.breakfast.title || plan.breakfast.spotName;
        plan.breakfast.estimatedCost = plan.breakfast.estimatedCost ?? plan.breakfast.estCost ?? 12;
      }
      if (plan.lunch) {
        plan.lunch.spotName = plan.lunch.spotName || plan.lunch.title || "Lunch Bistro";
        plan.lunch.title = plan.lunch.title || plan.lunch.spotName;
        plan.lunch.estimatedCost = plan.lunch.estimatedCost ?? plan.lunch.estCost ?? 18;
      }
      if (plan.dinner) {
        plan.dinner.spotName = plan.dinner.spotName || plan.dinner.title || "Dinner House";
        plan.dinner.title = plan.dinner.title || plan.dinner.spotName;
        plan.dinner.estimatedCost = plan.dinner.estimatedCost ?? plan.dinner.estCost ?? 30;
      }
      return plan;
    });
  }

    return data;
  })();

  inFlightTripRequests.set(requestKey, request);
  void request.then(
    () => inFlightTripRequests.delete(requestKey),
    () => inFlightTripRequests.delete(requestKey)
  );

  return request;
}

/**
 * Calculates budget item structures for charts and UI display purely from AI budget breakdown
 */
export function formatGranularBudgetFromAI(
  aiData: AITripResponse,
  totalBudget: number,
  days: number
): GranularBudget {
  const breakdown = aiData.budgetBreakdown;
  const numDays = Math.max(1, days);
  const perDayBudget = Math.round(totalBudget / numDays);

  const accommodationTotal = breakdown.accommodation || Math.round(totalBudget * 0.38);
  const foodTotal = breakdown.food || Math.round(totalBudget * 0.26);
  const activitiesTotal = breakdown.activities || Math.round(totalBudget * 0.18);
  const transportTotal = breakdown.transport || Math.round(totalBudget * 0.10);
  const bufferTotal = breakdown.emergencyBuffer || Math.round(totalBudget * 0.08);

  const nightlyRate = breakdown.nightlyRate || Math.round(accommodationTotal / numDays);
  const hotelClass = breakdown.hotelClass || (perDayBudget >= 300 ? "Luxury 5-Star Hotel & Spa" : perDayBudget >= 150 ? "Boutique 4-Star Hotel" : "Comfort Stay");

  const sym = aiData.currencySymbol || "$";
  const currCode = aiData.localCurrency || aiData.currency || "USD";

  const items: BudgetItem[] = [
    {
      category: "Accommodation",
      sublabel: `${hotelClass} (~${sym}${nightlyRate}/night)`,
      amount: accommodationTotal,
      percentage: Math.round((accommodationTotal / totalBudget) * 100),
      color: "#2563eb",
      details: [
        `${numDays} nights in ${hotelClass}`,
        `Includes room taxes, free Wi-Fi & daily service`,
        `Estimated ~${sym}${nightlyRate} per night average`,
      ],
    },
    {
      category: "Food & Dining",
      sublabel: `Breakfast, Lunch & Dinner local recommendations`,
      amount: foodTotal,
      percentage: Math.round((foodTotal / totalBudget) * 100),
      color: "#10b981",
      details: [
        `Daily dining budget: ~${sym}${Math.round(foodTotal / numDays)}/day`,
        `Local street food, authentic lunch spots & evening bistros`,
        `Includes regional specialties & snacks`,
      ],
    },
    {
      category: "Activities & Landmark Entry",
      sublabel: "Museum passes, observation decks, local tours",
      amount: activitiesTotal,
      percentage: Math.round((activitiesTotal / totalBudget) * 100),
      color: "#8b5cf6",
      details: [
        `Skip-the-line attraction tickets & local landmarks`,
        `Guided walking & cultural heritage excursions`,
        `Entry fees to temples, museums & viewpoints`,
      ],
    },
    {
      category: "Local Transportation",
      sublabel: "Metro passes, express transit & local rideshare",
      amount: transportTotal,
      percentage: Math.round((transportTotal / totalBudget) * 100),
      color: "#f59e0b",
      details: [
        `Regional rideshare, taxis & metro pass budget`,
        `Airport transfers & intra-city travel advice`,
      ],
    },
    {
      category: "Emergency & Shopping Buffer",
      sublabel: "Incidental expenses, souvenirs & contingencies",
      amount: bufferTotal,
      percentage: Math.round((bufferTotal / totalBudget) * 100),
      color: "#ec4899",
      details: [
        `Souvenir shopping & local artisan markets`,
        `Emergency contingency reserve`,
      ],
    },
  ];

  return {
    totalBudget,
    perDayBudget,
    hotelClass,
    nightlyRate,
    accommodationTotal,
    foodTotal,
    activitiesTotal,
    transportTotal,
    bufferTotal,
    items,
    tierName: `Dynamic ${currCode} Budget Profile`,
    currencyCode: currCode,
    currencySymbol: sym,
  };
}
