export interface GeocodingResult {
  id: string;
  name: string;
  country: string;
  displayName: string;
  lat: number;
  lng: number;
  placeType?: string;
}

// In-memory cache for search queries to prevent redundant API hits
const cache = new Map<string, GeocodingResult[]>();

type JsonRecord = Record<string, unknown>;

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

/**
 * Searches global cities using OpenStreetMap Nominatim API
 */
/**
 * Finds real cities, regions, and countries through OpenStreetMap. This is
 * deliberately separate from the AI provider so autocomplete does not spend
 * any AI tokens while a traveler is typing.
 */
export async function searchTravelDestinations(query: string): Promise<GeocodingResult[]> {
  if (!query || query.trim().length === 0) return [];

  const trimmed = query.trim();
  const cacheKey = trimmed.toLowerCase();

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      trimmed
    )}&addressdetails=1&limit=6`;

    const res = await fetch(url, {
      headers: {
        "Accept-Language": "en",
        "User-Agent": "TriplyTravelPlannerApp/1.0 (contact@triply.app)",
      },
    });

    if (!res.ok) {
      console.warn("Geocoding fetch non-ok status:", res.status);
      return [];
    }

    const data: unknown = await res.json();
    if (!Array.isArray(data)) return [];

    const results: GeocodingResult[] = data.filter(isRecord).map((item) => {
      const address = isRecord(item.address) ? item.address : {};
      const cityName =
        readString(address.city) ||
        readString(address.town) ||
        readString(address.village) ||
        readString(address.municipality) ||
        readString(address.state_district) ||
        readString(item.name) ||
        trimmed;
      const country = readString(address.country);
      const displayName = country ? `${cityName}, ${country}` : readString(item.display_name).split(",")[0] || cityName;

      return {
        id: `${item.place_id || Math.random()}`,
        name: cityName,
        country: country,
        displayName: displayName,
        lat: parseFloat(readString(item.lat)),
        lng: parseFloat(readString(item.lon)),
        placeType: readString(item.type) || readString(item.class) || "city",
      };
    });

    // Remove duplicates based on displayName
    const unique = results.filter(
      (v, idx, a) => a.findIndex((t) => t.displayName === v.displayName) === idx
    );

    cache.set(cacheKey, unique);
    return unique;
  } catch (error) {
    console.error("Geocoding error:", error);
    return [];
  }
}

/**
 * Verifies that a user-entered destination resolves to a real city, region, or country.
 */
export async function validateTravelDestination(query: string): Promise<GeocodingResult | null> {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  if (normalizedQuery.length < 2) return null;

  const results = await searchTravelDestinations(query);
  const compactQuery = normalizedQuery.replace(/[^\p{L}\p{N}]/gu, "");

  return results.find((result) => {
    const candidates = [result.name, result.country, result.displayName]
      .map((value) => value.toLocaleLowerCase());
    return candidates.some((candidate) => {
      const compactCandidate = candidate.replace(/[^\p{L}\p{N}]/gu, "");
      return candidate === normalizedQuery ||
        candidate.startsWith(`${normalizedQuery},`) ||
        compactCandidate === compactQuery;
    });
  }) || null;
}
