import { WeatherResponseSchema } from "./schemas";
import type { WeatherResponse } from "./schemas";

const API_KEY = process.env.VISUAL_CROSSING_API_KEY;
const BASE_URL =
  process.env.VISUAL_CROSSING_API_ENDPOINT ||
  "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline";

export async function fetchWeather(
  location: string,
  startDate: string,
  endDate: string,
): Promise<WeatherResponse> {
  if (!API_KEY) {
    throw new Error("VISUAL_CROSSING_API_KEY is not configured");
  }

  const url = `${BASE_URL}/${encodeURIComponent(location)}/${startDate}/${endDate}?unitGroup=us&include=hours&key=${API_KEY}`;
  const res = await fetch(url);

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Visual Crossing API error ${res.status}: ${body}`);
  }

  const raw = await res.json();
  const parsed = WeatherResponseSchema.safeParse(raw);

  if (!parsed.success) {
    console.error("Schema validation failed:", parsed.error);
    throw new Error("Invalid response from weather API");
  }

  return parsed.data;
}
