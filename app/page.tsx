"use client";

import { ComparisonBanner } from "@/components/ComparisonBanner";
import { EventConfig } from "@/components/EventConfig";
import { HourlyChart } from "@/components/HourlyChart";
import { ThemeToggle } from "@/components/ThemeToggle";
import { WeatherCard } from "@/components/WeatherCard";
import { WeekCarousel } from "@/components/WeekCarousel";
import { useForecast } from "@/hooks/useForecast";
import { reverseGeocode, useGeolocation } from "@/hooks/useGeolocation";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useTheme } from "@/hooks/useTheme";
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
  const [theme, toggleTheme] = useTheme();

  const geo = useGeolocation();
  const hasAutoDetected = useRef(false);

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

  useEffect(() => {
    if (!geo.coords) return;
    reverseGeocode(geo.coords.lat, geo.coords.lng).then((address) => {
      if (address) {
        setConfig((prev) => {
          const updated = { ...prev, location: address };
          setActiveParams({
            location: address,
            day: updated.day,
            window: updated.timeRange,
          });
          return updated;
        });
      }
    });
  }, [geo.coords, setConfig]);

  const { data, isLoading, error } = useForecast(activeParams);

  const handleSubmit = useCallback(
    (overrideConfig?: EventConfigType) => {
      const c = overrideConfig ?? config;
      if (!c.location.trim()) return;
      setActiveParams({
        location: c.location,
        day: c.day,
        window: c.timeRange,
      });
    },
    [config],
  );

  return (
    <div className="min-h-screen bg-gray-50 transition-colors dark:bg-gray-900">
      <header className="border-b border-gray-200 bg-white/80 px-4 py-3 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <h1 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
            Tempora
          </h1>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>
      </header>

      <main className="mx-auto max-w-5xl p-4">
        <section className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
          <EventConfig config={config} onChange={setConfig} onSubmit={handleSubmit} />
        </section>

        <section className="mt-6">
          {(isLoading || geo.loading) && (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 dark:border-gray-600 dark:border-t-blue-400" />
              <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">
                {geo.loading ? "Detecting location..." : "Loading forecast..."}
              </span>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/30">
              <p className="text-sm text-red-700 dark:text-red-400">{error.message}</p>
              <button
                type="button"
                onClick={() => handleSubmit()}
                className="mt-2 text-sm font-medium text-red-700 underline hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
              >
                Try again
              </button>
            </div>
          )}

          {data && !isLoading && (
            <div className="space-y-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">{data.resolvedAddress}</p>

              <ComparisonBanner thisWeek={data.thisWeek} nextWeek={data.nextWeek} />

              {data.thisWeek && data.nextWeek ? (
                <WeekCarousel labels={["This week", "Next week"]}>
                  {[
                    <div key="this" className="space-y-4">
                      <WeatherCard label="This week" day={data.thisWeek} />
                      <HourlyChart hours={data.thisWeek.hours} label="This week" color="#10b981" />
                    </div>,
                    <div key="next" className="space-y-4">
                      <WeatherCard label="Next week" day={data.nextWeek} />
                      <HourlyChart hours={data.nextWeek.hours} label="Next week" color="#6366f1" />
                    </div>,
                  ]}
                </WeekCarousel>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  {data.thisWeek && (
                    <div className="space-y-4">
                      <WeatherCard label="This week" day={data.thisWeek} />
                      <HourlyChart hours={data.thisWeek.hours} label="This week" color="#10b981" />
                    </div>
                  )}
                  {data.nextWeek && (
                    <div className="space-y-4">
                      <WeatherCard label="Next week" day={data.nextWeek} />
                      <HourlyChart hours={data.nextWeek.hours} label="Next week" color="#6366f1" />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {!activeParams && !isLoading && !geo.loading && (
            <p className="py-12 text-center text-sm text-gray-400 dark:text-gray-500">
              Enter a location and press Enter to see the forecast.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
