"use client";

import { compareWeeks, scoreWeather } from "@/lib/recommendations";
import type { DayConditions } from "@/lib/schemas";

interface ComparisonBannerProps {
  thisWeek: DayConditions | null;
  nextWeek: DayConditions | null;
}

export function ComparisonBanner({ thisWeek, nextWeek }: ComparisonBannerProps) {
  const recommendation = compareWeeks(thisWeek, nextWeek);
  if (!recommendation || !thisWeek || !nextWeek) return null;

  const thisScore = scoreWeather(thisWeek);
  const nextScore = scoreWeather(nextWeek);
  const betterWeek = thisScore.total >= nextScore.total ? "this" : "next";

  return (
    <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 dark:border-indigo-800 dark:bg-indigo-950/40">
      <div className="flex items-center gap-2">
        <span className="text-lg">💡</span>
        <p className="text-sm font-medium text-indigo-900 dark:text-indigo-200">{recommendation}</p>
      </div>
      <div className="mt-2 flex gap-4 text-xs text-indigo-700 dark:text-indigo-300">
        <span className={betterWeek === "this" ? "font-bold" : ""}>
          This week: {thisScore.total}/100
        </span>
        <span className={betterWeek === "next" ? "font-bold" : ""}>
          Next week: {nextScore.total}/100
        </span>
      </div>
    </div>
  );
}
