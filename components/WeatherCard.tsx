"use client";

import { scoreWeather } from "@/lib/recommendations";
import type { DayConditions } from "@/lib/schemas";
import {
  getBadgeClasses,
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
  const badgeClasses = getBadgeClasses(score.verdict);
  const scoreColor = getScoreColor(score.verdict);

  const dateStr = parseISO(day.datetime);
  const formattedDate = format(dateStr, "EEEE, MMMM d");

  return (
    <div
      className={`rounded-xl border bg-gradient-to-br p-5 shadow-sm transition-shadow hover:shadow-md ${gradient} ${border}`}
    >
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">{label}</p>
          <p className="mt-0.5 text-lg font-bold text-gray-900">{formattedDate}</p>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${badgeClasses}`}>
          {score.label}
        </span>
      </div>

      {/* Main weather */}
      <div className="mb-4 flex items-center gap-4">
        <span className="text-5xl" role="img" aria-label={day.conditions}>
          {icon}
        </span>
        <div>
          <p className="text-3xl font-bold text-gray-900">{Math.round(day.temp)}°F</p>
          <p className="text-sm text-gray-600">
            {Math.round(day.tempmin)}° / {Math.round(day.tempmax)}°
          </p>
        </div>
      </div>

      {/* Message */}
      <p className="mb-4 text-sm font-medium text-gray-700">{score.message}</p>

      {/* Stats grid */}
      <div className="mb-4 grid grid-cols-3 gap-3">
        <Stat icon="💨" label="Wind" value={`${day.windspeed} mph`} />
        <Stat icon="💧" label="Humidity" value={`${Math.round(day.humidity)}%`} />
        <Stat icon="🌧️" label="Rain" value={`${Math.round(day.precipprob)}%`} />
      </div>

      {/* Score bar */}
      <div>
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500">Outdoor Score</span>
          <span className="text-xs font-bold text-gray-700">{score.total}/100</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
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
    <div className="rounded-lg bg-white/60 px-2.5 py-2 text-center">
      <span className="text-sm">{icon}</span>
      <p className="mt-0.5 text-xs text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-gray-800">{value}</p>
    </div>
  );
}
