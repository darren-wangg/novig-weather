"use client";

import { EventConfig } from "@/components/EventConfig";
import { useForecast } from "@/hooks/useForecast";
import { reverseGeocode, useGeolocation } from "@/hooks/useGeolocation";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { getDefaultConfig } from "@/lib/constants";
import type { EventConfig as EventConfigType } from "@/lib/constants";
import { useCallback, useEffect, useRef, useState } from "react";

export default function Home() {
  const [config, setConfig] = useLocalStorage<EventConfigType>("event-config", getDefaultConfig());
  const [activeParams, setActiveParams] = useState<{
    location: string;
    day: string;
    window: string;
  } | null>(null);

  const geo = useGeolocation();
  const hasAutoDetected = useRef(false);

  // Auto-detect location on first visit (only if no saved location)
  useEffect(() => {
    if (hasAutoDetected.current) return;
    if (config.location) {
      // Saved location exists — use it immediately
      hasAutoDetected.current = true;
      setActiveParams({
        location: config.location,
        day: config.day,
        window: config.timeRange,
      });
      return;
    }
    hasAutoDetected.current = true;
    geo.request();
  }, [config.location, config.day, config.timeRange, geo.request]);

  // When geolocation resolves, reverse-geocode and set location
  useEffect(() => {
    if (!geo.coords) return;
    reverseGeocode(geo.coords.lat, geo.coords.lng).then((address) => {
      if (address) {
        setConfig((prev) => ({ ...prev, location: address }));
        setActiveParams({
          location: address,
          day: config.day,
          window: config.timeRange,
        });
      }
    });
  }, [geo.coords]);

  const { data, isLoading, error } = useForecast(activeParams);

  const handleSubmit = useCallback(() => {
    if (!config.location.trim()) return;
    setActiveParams({
      location: config.location,
      day: config.day,
      window: config.timeRange,
    });
  }, [config]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white px-4 py-3">
        <h1 className="text-lg font-semibold">weatherd.io</h1>
      </header>

      <main className="mx-auto max-w-5xl p-4">
        <section className="rounded-xl bg-white p-4 shadow-sm">
          <EventConfig config={config} onChange={setConfig} onSubmit={handleSubmit} />
        </section>

        <section className="mt-6">
          {(isLoading || geo.loading) && (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
              <span className="ml-3 text-sm text-gray-500">
                {geo.loading ? "Detecting location..." : "Loading forecast..."}
              </span>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-700">{error.message}</p>
              <button
                type="button"
                onClick={handleSubmit}
                className="mt-2 text-sm font-medium text-red-700 underline hover:text-red-800"
              >
                Try again
              </button>
            </div>
          )}

          {data && !isLoading && (
            <div>
              <p className="mb-4 text-sm text-gray-500">{data.resolvedAddress}</p>
              <div className="grid gap-6 md:grid-cols-2">
                {data.thisWeek && <WeekPreview label="This week" day={data.thisWeek} />}
                {data.nextWeek && <WeekPreview label="Next week" day={data.nextWeek} />}
              </div>
            </div>
          )}

          {!activeParams && !isLoading && !geo.loading && (
            <p className="py-12 text-center text-sm text-gray-400">
              Enter a location and press Enter to see the forecast.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}

/** Temporary minimal preview — will be replaced by WeatherCard in Step 3 */
function WeekPreview({
  label,
  day,
}: {
  label: string;
  day: {
    datetime: string;
    temp: number;
    conditions: string;
    humidity: number;
    windspeed: number;
    hours: unknown[];
  };
}) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <h3 className="mb-1 text-sm font-semibold text-gray-500">{label}</h3>
      <p className="text-lg font-bold">{day.datetime}</p>
      <p className="text-2xl font-semibold">{Math.round(day.temp)}°F</p>
      <p className="text-sm text-gray-600">{day.conditions}</p>
      <div className="mt-2 flex gap-4 text-xs text-gray-500">
        <span>Wind: {day.windspeed} mph</span>
        <span>Humidity: {day.humidity}%</span>
        <span>{day.hours.length} hourly points</span>
      </div>
    </div>
  );
}
