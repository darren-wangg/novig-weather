import type { WeatherScore } from "./recommendations";

/** Map Visual Crossing icon codes to emoji (simple, no asset deps) */
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

/** Background gradient class based on weather verdict */
export function getCardGradient(verdict: WeatherScore["verdict"]): string {
  switch (verdict) {
    case "great":
      return "from-emerald-50 to-sky-50 dark:from-emerald-950/40 dark:to-sky-950/40";
    case "good":
      return "from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40";
    case "fair":
      return "from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40";
    case "poor":
      return "from-slate-100 to-gray-200 dark:from-slate-800/40 dark:to-gray-800/40";
  }
}

/** Border color based on verdict */
export function getCardBorder(verdict: WeatherScore["verdict"]): string {
  switch (verdict) {
    case "great":
      return "border-emerald-200 dark:border-emerald-800";
    case "good":
      return "border-blue-200 dark:border-blue-800";
    case "fair":
      return "border-amber-200 dark:border-amber-800";
    case "poor":
      return "border-slate-300 dark:border-slate-700";
  }
}

/** Badge colors for the verdict label */
export function getBadgeClasses(verdict: WeatherScore["verdict"]): string {
  switch (verdict) {
    case "great":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300";
    case "good":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300";
    case "fair":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300";
    case "poor":
      return "bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300";
  }
}

/** Score bar color */
export function getScoreColor(verdict: WeatherScore["verdict"]): string {
  switch (verdict) {
    case "great":
      return "bg-emerald-500";
    case "good":
      return "bg-blue-500";
    case "fair":
      return "bg-amber-500";
    case "poor":
      return "bg-red-500";
  }
}
