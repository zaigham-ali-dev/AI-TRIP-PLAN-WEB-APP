import { NextRequest, NextResponse } from "next/server";
import { searchTravelDestinations } from "@/lib/geocoding";

export const dynamic = "force-dynamic";
export const maxDuration = 15;

/**
 * Real-place autocomplete. It intentionally does not call an LLM: a single
 * search box interaction can otherwise create several paid AI requests.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = (searchParams.get("query") || searchParams.get("q") || "").trim();

  if (query.length < 2) {
    return NextResponse.json({ suggestions: [] });
  }

  try {
    const matches = await searchTravelDestinations(query);
    const suggestions = matches.slice(0, 5).map((place) => ({
      id: place.id,
      name: place.name,
      country: place.country,
      region: place.placeType || "Destination",
    }));

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Destination autocomplete failed:", error);
    return NextResponse.json({ suggestions: [] });
  }
}
