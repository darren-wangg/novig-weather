"use client";

import type { DayConditions } from "@/lib/schemas";
import { useQuery } from "@tanstack/react-query";

export interface ForecastParams {
  location: string;
  day: string;
  window: string;
}

export interface ForecastData {
  resolvedAddress: string;
  timezone: string;
  thisWeek: DayConditions | null;
  nextWeek: DayConditions | null;
}

async function fetchForecast(params: ForecastParams): Promise<ForecastData> {
  const searchParams = new URLSearchParams({
    location: params.location,
    day: params.day,
    window: params.window,
  });

  const res = await fetch(`/api/forecast?${searchParams}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(body.error || `Request failed with status ${res.status}`);
  }
  return res.json();
}

export function useForecast(params: ForecastParams | null) {
  return useQuery({
    queryKey: ["forecast", params],
    queryFn: () => fetchForecast(params!),
    enabled: !!params && !!params.location.trim(),
  });
}
