import { NextRequest, NextResponse } from "next/server";
import { getErrorMessage } from "@/lib/errorUtils";
import { validateTravelDestination } from "@/lib/geocoding";
import {
  getCohereApiKey,
  getCohereBaseUrl,
  selectCohereModels,
} from "@/lib/cohere";

export const maxDuration = 60; // Allow up to 60s for AI generation

const GENERATED_TRIP_CACHE_TTL_MS = 15 * 60 * 1000;
const generatedTripCache = new Map<string, { expiresAt: number; data: unknown }>();

function getTripCacheKey(destination: string, budget: number, days: number, style: string, group: string) {
  return [destination.trim().toLowerCase(), budget, days, style.trim().toLowerCase(), group.trim().toLowerCase()].join("|");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { destination, totalBudget = 1500, days = 5, travelStyle = "Balanced Explorer", groupSize = "Solo Traveler" } = body;
    const tripDays = Math.min(14, Math.max(1, Number(days) || 5));
    const tripBudget = Math.max(50, Number(totalBudget) || 1500);
    const perDayBudget = Math.round(tripBudget / tripDays);

    if (!destination || typeof destination !== "string" || !destination.trim()) {
      return NextResponse.json({ error: "Destination is required" }, { status: 400 });
    }

    const verifiedDestination = await validateTravelDestination(destination);
    if (!verifiedDestination) {
      return NextResponse.json(
        { error: "Please provide a real city or country before generating a trip plan." },
        { status: 400 }
      );
    }

    const cacheKey = getTripCacheKey(destination, tripBudget, tripDays, travelStyle, groupSize);
    const cachedTrip = generatedTripCache.get(cacheKey);
    if (cachedTrip && cachedTrip.expiresAt > Date.now()) {
      return NextResponse.json(cachedTrip.data);
    }
    if (cachedTrip) generatedTripCache.delete(cacheKey);

    const apiKey = getCohereApiKey();
    
    if (!apiKey) {
      return NextResponse.json(
        {
          error: "API key missing. Please configure COHERE_API_KEY in your .env.local file.",
        },
        { status: 401 }
      );
    }

    const systemPrompt = `Return only compact valid JSON for a ${tripDays}-day trip to "${destination}".
The traveler's TOTAL trip budget is $${tripBudget} USD. That is the full trip budget, not a daily amount.
Daily allocation is about $${perDayBudget} USD per day. Style: ${travelStyle}. Group: ${groupSize}.
Use only real, unique places in or near the destination. The itinerary must contain exactly days 1 through ${tripDays}, with morning, breakfast, afternoon, lunch, evening, dinner, and transport on every day. Do not use placeholder names.
All money values MUST be USD numbers that fit this trip. budgetBreakdown.accommodation + food + activities + transport + emergencyBuffer MUST equal ${tripBudget}.
Each day's dailySpendingTotal should be close to ${perDayBudget} (sum of that day's meals, activities, and local transport). hotelClass and nightlyRate must match a $${tripBudget} / ${tripDays}-day ${travelStyle} trip.
Write useful detail: summaries 2-3 sentences, activity descriptions 2-3 sentences, tips 1 sentence.
Root keys: destinationName, currency, localCurrency, currencySymbol, budgetBreakdown, itinerary.
budgetBreakdown keys: accommodation, food, activities, transport, emergencyBuffer, hotelClass, nightlyRate.
Each day keys: day, title, summary, morning, breakfast, afternoon, lunch, evening, dinner, transport, dailySpendingTotal.
Activity (morning, afternoon, evening) keys: spotName, description, duration, costEstimate, tip, lat, lng. Dinner uses spotName, recommendation, estimatedCost, tip, lat, lng. Breakfast and lunch use spotName, recommendation, estimatedCost, tip. Transport uses routeAdvice and estimatedCost.
Include accurate numeric coordinates for activities and dinner. currency, localCurrency, and currencySymbol must be USD / USD / $. Do not add duplicate title, estCost, rating, bookingLinks, or bookingQueries fields.`;

/* Legacy verbose schema retained below for reference only; it is not sent to the AI.
{
  "destinationName": "${destination}",
  "localCurrency": "CURRENCY_CODE",
  "currency": "CURRENCY_CODE",
  "currencySymbol": "SYMBOL",
  "budgetBreakdown": {
    "accommodation": 550,
    "food": 380,
    "activities": 270,
    "transport": 180,
    "emergencyBuffer": 120,
    "hotelClass": "Boutique 4-Star Hotel",
    "nightlyRate": 110
  },
  "bookingQueries": {
    "luxuryHotels": "5-Star Luxury Hotels in ${destination}",
    "taxiApp": "Careem / Uber / Local Taxi in ${destination}",
    "flights": "Flights to ${destination}"
  },
  "bookingLinks": {
    "hotels": [
      { "name": "Booking.com Luxury Hotels in ${destination}", "url": "https://www.booking.com/searchresults.html?ss=${encodeURIComponent(destination)}" }
    ],
    "taxis": [
      { "name": "Local Taxi & Rideshare", "url": "https://www.google.com/search?q=${encodeURIComponent(destination)}+taxi+careem+uber" }
    ],
    "flights": [
      { "name": "Google Flights to ${destination}", "url": "https://www.google.com/travel/flights?q=flights+to+${encodeURIComponent(destination)}" }
    ]
  },
  "itinerary": [
    {
      "day": 1,
      "title": "Day 1: Arrival & Exploring Specific Landmarks",
      "summary": "Summary of Day 1",
      "morning": {
        "title": "Real Landmark Name",
        "spotName": "Real Landmark Name",
        "description": "Concise 1-sentence tip and description.",
        "duration": "2.5 hrs",
        "estCost": 15,
        "costEstimate": 15,
        "rating": "4.8★",
        "tip": "Insider tip",
        "lat": 0.0,
        "lng": 0.0
      },
      "breakfast": {
        "title": "Real Local Breakfast Cafe",
        "spotName": "Real Local Breakfast Cafe",
        "recommendation": "Recommended dish",
        "description": "Fresh morning cafe experience.",
        "estimatedCost": 12,
        "estCost": 12,
        "rating": "4.7★",
        "tip": "Arrive early",
        "lat": 0.0,
        "lng": 0.0
      },
      "afternoon": {
        "title": "Real Afternoon Attraction",
        "spotName": "Real Afternoon Attraction",
        "description": "Concise 1-sentence tip.",
        "duration": "3.0 hrs",
        "estCost": 25,
        "costEstimate": 25,
        "rating": "4.9★",
        "tip": "Insider tip",
        "lat": 0.0,
        "lng": 0.0
      },
      "lunch": {
        "title": "Real Authentic Lunch Restaurant",
        "spotName": "Real Authentic Lunch Restaurant",
        "recommendation": "Recommended lunch special",
        "description": "Authentic regional lunch.",
        "estimatedCost": 18,
        "estCost": 18,
        "rating": "4.8★",
        "tip": "Try seasonal menu",
        "lat": 0.0,
        "lng": 0.0
      },
      "evening": {
        "title": "Real Evening Landmark or Market",
        "spotName": "Real Evening Landmark or Market",
        "description": "Concise 1-sentence tip.",
        "duration": "2.5 hrs",
        "estCost": 20,
        "costEstimate": 20,
        "rating": "4.8★",
        "tip": "Golden hour spot",
        "lat": 0.0,
        "lng": 0.0
      },
      "dinner": {
        "title": "Real Famous Local Dinner Spot",
        "spotName": "Real Famous Local Dinner Spot",
        "recommendation": "Recommended dinner dish",
        "description": "Fine local dining experience.",
        "estimatedCost": 35,
        "estCost": 35,
        "rating": "4.9★",
        "tip": "Book ahead",
        "lat": 0.0,
        "lng": 0.0
      },
      "transport": {
        "routeAdvice": "Specific transit guidance",
        "estimatedCost": 15
      },
      "dailySpendingTotal": 165
    }
  ]
}`;
*/

    const modelsToTry = selectCohereModels();
    if (modelsToTry.length === 0) {
      return NextResponse.json(
        { error: "No Cohere models are configured. Please set COHERE_MODEL or verify your Cohere API key." },
        { status: 503 }
      );
    }

    let lastError: Error | null = null;
    let longestRetryAfterSeconds = 0;
    let allFailuresWereRateLimits = true;
    // Each concise day is capped at roughly 550 output tokens. The old 4,000
    // minimum and 14,000 maximum reserved far more credit than the UI needs.
    const maxTokens = Math.min(12_000, Math.max(2_000, tripDays * 850));

    for (const model of modelsToTry) {
      try {
        const response = await fetch(`${getCohereBaseUrl()}/chat`, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model,
              messages: [
                {
                  role: "system",
                  content: "You are a professional travel planner. Generate only valid JSON; do not use markdown fences or commentary.",
                },
                {
                  role: "user",
                  content: systemPrompt,
                },
              ],
              response_format: { type: "json_object" },
              temperature: 0.2,
              max_tokens: maxTokens,
            }),
          });

        if (!response.ok) {
          const errBody = await response.text();
          console.warn(`Cohere model ${model} error (${response.status}):`, errBody);

          // A model-specific provider rate limit must not prevent the other
          // providers in this fallback list from serving the itinerary.
          if (response.status === 429) {
            longestRetryAfterSeconds = Math.max(
              longestRetryAfterSeconds,
              Number(response.headers.get("Retry-After")) || 30
            );
            lastError = new Error(`${model} is temporarily rate-limited. Trying another provider.`);
            continue;
          }

          allFailuresWereRateLimits = false;
          lastError = new Error(`Cohere (${response.status}): ${errBody}`);
          continue;
        }

        allFailuresWereRateLimits = false;
        const jsonRes: unknown = await response.json();
        const choiceContent = getCohereContent(jsonRes);
        if (choiceContent) {
          const parsedData = parseModelJson(choiceContent);
          if (!parsedData) {
            return NextResponse.json(
              { error: `${model} returned an invalid itinerary. Please retry once.` },
              { status: 502 }
            );
          }
          const normalizedData = normalizeAIData(parsedData);

          if (hasCompleteItinerary(normalizedData, tripDays)) {
            const payload = { success: true, source: "cohere", data: normalizedData };
            generatedTripCache.set(cacheKey, {
              expiresAt: Date.now() + GENERATED_TRIP_CACHE_TTL_MS,
              data: payload,
            });
            return NextResponse.json(payload);
          }

          return NextResponse.json(
            { error: `The model returned an incomplete itinerary. Expected ${tripDays} days. Please retry once.` },
            { status: 502 }
          );
        }
      } catch (err: unknown) {
        console.warn(`Cohere fetch failed for model ${model}:`, err);
        allFailuresWereRateLimits = false;
        lastError = err instanceof Error ? err : new Error("Cohere request failed.");
      }
    }

    if (allFailuresWereRateLimits) {
      const retryAfterSeconds = Math.max(30, longestRetryAfterSeconds);
      return NextResponse.json(
        {
          error: "All AI providers are temporarily busy. Please try again shortly.",
          retryAfterSeconds,
        },
        {
          status: 429,
          headers: { "Retry-After": String(retryAfterSeconds) },
        }
      );
    }

    throw lastError || new Error(`Unable to generate a complete ${tripDays}-day itinerary. Please try again.`);

  } catch (error: unknown) {
    console.error("Error in /api/generate-trip route:", error);
    return NextResponse.json(
      { error: getErrorMessage(error, "Failed to generate AI trip. Please verify your COHERE_API_KEY.") },
      { status: 500 }
    );
  }
}

type JsonRecord = Record<string, unknown>;

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getCohereContent(response: unknown): string | null {
  if (!isRecord(response) || !isRecord(response.message) || !Array.isArray(response.message.content)) {
    return null;
  }

  const text = response.message.content
    .flatMap((part) => isRecord(part) && typeof part.text === "string" ? [part.text] : [])
    .join("");
  return text || null;
}

function parseModelJson(content: string): unknown | null {
  const cleaned = content
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const objectStart = cleaned.indexOf("{");
    const objectEnd = cleaned.lastIndexOf("}");
    if (objectStart < 0 || objectEnd <= objectStart) return null;

    try {
      return JSON.parse(cleaned.slice(objectStart, objectEnd + 1));
    } catch {
      return null;
    }
  }
}

function getText(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function getNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function hasCompleteItinerary(data: unknown, tripDays: number): boolean {
  if (!isRecord(data) || !Array.isArray(data.itinerary) || data.itinerary.length !== tripDays) {
    return false;
  }

  const dayNumbers = data.itinerary.map((day) => isRecord(day) ? day.day : undefined);
  return dayNumbers.every((day, index) => day === index + 1);
}

function normalizeAIData(data: unknown): unknown {
  if (!isRecord(data)) return data;
  data.localCurrency = getText(data.localCurrency, getText(data.currency, "USD"));
  data.currency = getText(data.currency, getText(data.localCurrency, "USD"));

  if (Array.isArray(data.itinerary)) {
    data.itinerary = data.itinerary.map((day) => {
      if (!isRecord(day)) return day;
      ["morning", "afternoon", "evening", "breakfast", "lunch", "dinner"].forEach((key) => {
        const item = day[key];
        if (isRecord(item)) {
          const title = getText(item.title, getText(item.spotName, `${key} activity`));
          const cost = getNumber(item.estCost, getNumber(item.costEstimate, getNumber(item.estimatedCost, 15)));
          item.title = title;
          item.spotName = getText(item.spotName, title);
          item.estCost = cost;
          item.costEstimate = getNumber(item.costEstimate, cost);
          item.estimatedCost = getNumber(item.estimatedCost, cost);
          item.lat = getNumber(item.lat, 0);
          item.lng = getNumber(item.lng, 0);
        }
      });
      return day;
    });
  }

  return data;
}
