export interface Destination {
  id: string;
  name: string;
  country: string;
  region: string;
  popular?: boolean;
}

// In-memory client cache to prevent repeated API calls for identical keystrokes
const suggestionCache = new Map<string, Destination[]>();

/**
 * Static fallback dataset for instant results while real-place geocoding loads.
 */
const WORLD_DESTINATIONS: Destination[] = [
  { id: "amsterdam", name: "Amsterdam", country: "Netherlands", region: "Europe" },
  { id: "athens", name: "Athens", country: "Greece", region: "Europe" },
  { id: "auckland", name: "Auckland", country: "New Zealand", region: "Oceania" },
  { id: "bali", name: "Bali", country: "Indonesia", region: "Asia" },
  { id: "bangkok", name: "Bangkok", country: "Thailand", region: "Asia" },
  { id: "barcelona", name: "Barcelona", country: "Spain", region: "Europe" },
  { id: "berlin", name: "Berlin", country: "Germany", region: "Europe" },
  { id: "cairo", name: "Cairo", country: "Egypt", region: "Africa" },
  { id: "cancun", name: "Cancun", country: "Mexico", region: "North America" },
  { id: "cape-town", name: "Cape Town", country: "South Africa", region: "Africa" },
  { id: "doha", name: "Doha", country: "Qatar", region: "Middle East" },
  { id: "dubai", name: "Dubai", country: "United Arab Emirates", region: "Middle East" },
  { id: "dublin", name: "Dublin", country: "Ireland", region: "Europe" },
  { id: "edinburgh", name: "Edinburgh", country: "United Kingdom", region: "Europe" },
  { id: "florence", name: "Florence", country: "Italy", region: "Europe" },
  { id: "frankfurt", name: "Frankfurt", country: "Germany", region: "Europe" },
  { id: "geneva", name: "Geneva", country: "Switzerland", region: "Europe" },
  { id: "hanoi", name: "Hanoi", country: "Vietnam", region: "Asia" },
  { id: "hong-kong", name: "Hong Kong", country: "Hong Kong", region: "Asia" },
  { id: "hunza", name: "Hunza Valley", country: "Pakistan", region: "South Asia" },
  { id: "islamabad", name: "Islamabad", country: "Pakistan", region: "South Asia" },
  { id: "istanbul", name: "Istanbul", country: "Turkey", region: "Europe/Asia" },
  { id: "jakarta", name: "Jakarta", country: "Indonesia", region: "Asia" },
  { id: "jeddah", name: "Jeddah", country: "Saudi Arabia", region: "Middle East" },
  { id: "karachi", name: "Karachi", country: "Pakistan", region: "South Asia" },
  { id: "kyoto", name: "Kyoto", country: "Japan", region: "Asia" },
  { id: "kuala-lumpur", name: "Kuala Lumpur", country: "Malaysia", region: "Asia" },
  { id: "lahore", name: "Lahore", country: "Pakistan", region: "South Asia" },
  { id: "lisbon", name: "Lisbon", country: "Portugal", region: "Europe" },
  { id: "london", name: "London", country: "United Kingdom", region: "Europe" },
  { id: "los-angeles", name: "Los Angeles", country: "United States", region: "North America" },
  { id: "madrid", name: "Madrid", country: "Spain", region: "Europe" },
  { id: "marrakech", name: "Marrakech", country: "Morocco", region: "Africa" },
  { id: "melbourne", name: "Melbourne", country: "Australia", region: "Oceania" },
  { id: "mumbai", name: "Mumbai", country: "India", region: "South Asia" },
  { id: "munich", name: "Munich", country: "Germany", region: "Europe" },
  { id: "new-york", name: "New York", country: "United States", region: "North America" },
  { id: "oslo", name: "Oslo", country: "Norway", region: "Europe" },
  { id: "osaka", name: "Osaka", country: "Japan", region: "Asia" },
  { id: "paris", name: "Paris", country: "France", region: "Europe" },
  { id: "phuket", name: "Phuket", country: "Thailand", region: "Asia" },
  { id: "prague", name: "Prague", country: "Czech Republic", region: "Europe" },
  { id: "reykjavik", name: "Reykjavik", country: "Iceland", region: "Europe" },
  { id: "rio-de-janeiro", name: "Rio de Janeiro", country: "Brazil", region: "South America" },
  { id: "riyadh", name: "Riyadh", country: "Saudi Arabia", region: "Middle East" },
  { id: "rome", name: "Rome", country: "Italy", region: "Europe" },
  { id: "san-francisco", name: "San Francisco", country: "United States", region: "North America" },
  { id: "santorini", name: "Santorini", country: "Greece", region: "Europe" },
  { id: "seoul", name: "Seoul", country: "South Korea", region: "Asia" },
  { id: "singapore", name: "Singapore", country: "Singapore", region: "Asia" },
  { id: "stockholm", name: "Stockholm", country: "Sweden", region: "Europe" },
  { id: "sydney", name: "Sydney", country: "Australia", region: "Oceania" },
  { id: "tokyo", name: "Tokyo", country: "Japan", region: "Asia" },
  { id: "toronto", name: "Toronto", country: "Canada", region: "North America" },
  { id: "vancouver", name: "Vancouver", country: "Canada", region: "North America" },
  { id: "venice", name: "Venice", country: "Italy", region: "Europe" },
  { id: "vienna", name: "Vienna", country: "Austria", region: "Europe" },
  { id: "zurich", name: "Zurich", country: "Switzerland", region: "Europe" },
];

/**
 * Fast synchronous search helper / fallback
 */
export function searchDestinations(query: string): Destination[] {
  if (!query || query.trim().length === 0) return [];
  const q = query.trim().toLowerCase();

  const matches = WORLD_DESTINATIONS.filter(
    (dest) =>
      dest.name.toLowerCase().includes(q) ||
      dest.country.toLowerCase().includes(q)
  );

  if (matches.length > 0) {
    return matches.slice(0, 5);
  }

  return [];
}

/**
 * Dynamic autocomplete backed by OpenStreetMap geocoding, not the AI provider.
 * This keeps destination typing completely free of AI token usage.
 */
export async function searchDestinationsAsync(query: string): Promise<Destination[]> {
  const trimmed = query ? query.trim() : "";
  if (trimmed.length < 2) {
    return [];
  }

  const cacheKey = trimmed.toLowerCase();
  if (suggestionCache.has(cacheKey)) {
    return suggestionCache.get(cacheKey)!;
  }

  try {
    const res = await fetch(`/api/suggest-destinations?query=${encodeURIComponent(trimmed)}`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data?.suggestions) && data.suggestions.length > 0) {
        suggestionCache.set(cacheKey, data.suggestions);
        return data.suggestions;
      }
    }
  } catch (err) {
    console.warn("Dynamic destination suggestion fetch failed, using fallback:", err);
  }

  return searchDestinations(trimmed);
}

/**
 * Performs quick client-side validation before the geocoding check at submit.
 */
export function isValidDestination(query: string): boolean {
  if (!query || typeof query !== "string") return false;
  return query.trim().length >= 2;
}

export function formatDestinationDisplay(dest: Destination): string {
  if (!dest.country || dest.name.toLowerCase() === dest.country.toLowerCase()) {
    return dest.name;
  }
  return `${dest.name}, ${dest.country}`;
}
