import type { WeatherResponse } from "@/types/weather";

const API_KEY = import.meta.env.VITE_VISUAL_CROSSING_API_KEY as string;
const BASE_URL = import.meta.env.VITE_VISUAL_CROSSING_API_ENDPOINT as string;

export async function fetchWeather(
  location: string,
  startDate: string,
  endDate: string,
): Promise<WeatherResponse> {
  const url = `${BASE_URL}/${encodeURIComponent(location)}/${startDate}/${endDate}?unitGroup=us&include=hours&key=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Weather API error: ${res.status}`);
  }
  return res.json();
}
