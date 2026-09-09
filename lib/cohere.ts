const DEFAULT_COHERE_BASE_URL = "https://api.cohere.com/v2";
// A second model is used only when the first provider is unavailable. Trying
// four models after a bad response can spend several full itinerary outputs.
const MAX_FALLBACK_MODELS = 2;

export function getCohereApiKey(): string | undefined {
  return process.env.COHERE_API_KEY;
}

export function getCohereBaseUrl(): string {
  return (process.env.COHERE_API_BASE_URL || DEFAULT_COHERE_BASE_URL).replace(/\/$/, "");
}

export function selectCohereModels(): string[] {
  const selected: string[] = [];
  const add = (model: string | undefined) => {
    if (model && !selected.includes(model)) selected.push(model);
  };

  add(process.env.COHERE_MODEL);
  [
    "command-a-plus-05-2026",
    "command-a-03-2025",
    "command-r7b-12-2024",
    "command-r-08-2024",
  ].forEach(add);

  return selected.slice(0, MAX_FALLBACK_MODELS);
}
