"use client";

import { ComparisonBanner } from "@/components/ComparisonBanner";
import { EventConfig } from "@/components/EventConfig";
import { WeatherCard } from "@/components/WeatherCard";
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
      <header className="border-b border-gray-200 bg-white/80 px-4 py-3 backdrop-blur-sm">
        <h1 className="text-lg font-semibold tracking-tight text-gray-900">Tempora</h1>
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
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">{data.resolvedAddress}</p>
              </div>

              <ComparisonBanner thisWeek={data.thisWeek} nextWeek={data.nextWeek} />

              <div className="grid gap-6 md:grid-cols-2">
                {data.thisWeek && <WeatherCard label="This week" day={data.thisWeek} />}
                {data.nextWeek && <WeatherCard label="Next week" day={data.nextWeek} />}
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
