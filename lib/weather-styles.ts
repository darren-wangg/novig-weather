import type { WeatherScore } from "./recommendations";

/** Map Visual Crossing icon codes to emoji */
export function getWeatherIcon(icon: string): string {
  const map: Record<string, string> = {
    "clear-day": "☀️",
    "clear-night": "🌙",
    "partly-cloudy-day": "⛅",
    "partly-cloudy-night": "☁️",
    cloudy: "☁️",
    rain: "🌧️",
    "showers-day": "🌦️",
    "showers-night": "🌧️",
    "thunder-rain": "⛈️",
    "thunder-showers-day": "⛈️",
    "thunder-showers-night": "⛈️",
    snow: "❄️",
    "snow-showers-day": "🌨️",
    "snow-showers-night": "🌨️",
    fog: "🌫️",
    wind: "💨",
    hail: "🧊",
    sleet: "🌨️",
  };
  return map[icon] || "🌤️";
}

/** Verdict → Tailwind classes for card gradient, border, badge, and score bar */
const VERDICT_STYLES: Record<
  WeatherScore["verdict"],
  { gradient: string; border: string; badge: string; score: string }
> = {
  great: {
    gradient: "from-emerald-50 to-sky-50 dark:from-emerald-950/40 dark:to-sky-950/40",
    border: "border-emerald-200 dark:border-emerald-800",
    badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300",
    score: "bg-emerald-500",
  },
  good: {
    gradient: "from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40",
    border: "border-blue-200 dark:border-blue-800",
    badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300",
    score: "bg-blue-500",
  },
  fair: {
    gradient: "from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40",
    border: "border-amber-200 dark:border-amber-800",
    badge: "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300",
    score: "bg-amber-500",
  },
  poor: {
    gradient: "from-slate-100 to-gray-200 dark:from-slate-800/40 dark:to-gray-800/40",
    border: "border-slate-300 dark:border-slate-700",
    badge: "bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300",
    score: "bg-red-500",
  },
};

export function getCardGradient(verdict: WeatherScore["verdict"]) {
  return VERDICT_STYLES[verdict].gradient;
}
export function getCardBorder(verdict: WeatherScore["verdict"]) {
  return VERDICT_STYLES[verdict].border;
}
export function getBadgeClasses(verdict: WeatherScore["verdict"]) {
  return VERDICT_STYLES[verdict].badge;
}
export function getScoreColor(verdict: WeatherScore["verdict"]) {
  return VERDICT_STYLES[verdict].score;
}
