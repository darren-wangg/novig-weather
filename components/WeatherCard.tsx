"use client";

import { scoreWeather } from "@/lib/recommendations";
import type { DayConditions } from "@/lib/schemas";
import {
  getCardBorder,
  getCardGradient,
  getScoreColor,
  getWeatherIcon,
} from "@/lib/weather-styles";
import { format, parseISO } from "date-fns";

interface WeatherCardProps {
  label: string;
  day: DayConditions;
}

export function WeatherCard({ label, day }: WeatherCardProps) {
  const score = scoreWeather(day);
  const icon = getWeatherIcon(day.icon);
  const gradient = getCardGradient(score.verdict);
  const border = getCardBorder(score.verdict);
  const scoreColor = getScoreColor(score.verdict);

  const dateStr = parseISO(day.datetime);
  const formattedDate = format(dateStr, "EEEE, MMMM d");

  return (
    <div
      className={`rounded-xl border bg-gradient-to-br p-5 shadow-sm transition-shadow hover:shadow-md ${gradient} ${border}`}
    >
      {/* Header */}
      <div className="mb-3">
        <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">{label}</p>
        <p className="mt-0.5 text-lg font-bold text-gray-900 dark:text-white">{formattedDate}</p>
      </div>

      {/* Main weather */}
      <div className="mb-4 flex items-center gap-4">
        <span className="text-5xl" role="img" aria-label={day.conditions}>
          {icon}
        </span>
        <div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{Math.round(day.temp)}°F</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {Math.round(day.tempmin)}° / {Math.round(day.tempmax)}°
          </p>
        </div>
      </div>

      {/* Message */}
      <p className="mb-4 text-sm font-medium text-gray-700 dark:text-gray-300">{score.message}</p>

      {/* Stats grid */}
      <div className="mb-4 grid grid-cols-3 gap-3">
        <Stat icon="💨" label="Wind" value={`${day.windspeed} mph`} />
        <Stat icon="💧" label="Humidity" value={`${Math.round(day.humidity)}%`} />
        <Stat icon="🌧️" label="Rain" value={`${Math.round(day.precipprob)}%`} />
      </div>

      {/* Score bar */}
      <div>
        <div className="mb-1 flex items-center justify-between">
          <span className="group relative text-xs font-medium text-gray-500 dark:text-gray-400">
            Outdoor Score
            <svg className="ml-1 inline h-3 w-3 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
            </svg>
            <span className="pointer-events-none absolute bottom-full left-0 z-10 mb-1.5 hidden w-48 rounded-lg bg-gray-900 px-3 py-2 text-xs font-normal text-white shadow-lg group-hover:block dark:bg-gray-700">
              Weighted score based on temperature, wind speed, precipitation chance, and humidity.
            </span>
          </span>
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{score.total}</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700" role="progressbar" aria-valuenow={score.total} aria-valuemin={0} aria-valuemax={100} aria-label={`Outdoor score: ${score.total} out of 100`}>
          <div
            className={`h-full rounded-full transition-all duration-500 ${scoreColor}`}
            style={{ width: `${score.total}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white/60 px-2.5 py-2 text-center dark:bg-white/10">
      <span className="text-sm">{icon}</span>
      <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{value}</p>
    </div>
  );
}
