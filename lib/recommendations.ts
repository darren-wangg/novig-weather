import type { DayConditions } from "./schemas";

export interface WeatherScore {
  total: number; // 0–100, higher = better for outdoor activity
  verdict: "great" | "good" | "fair" | "poor";
  label: string;
  message: string;
  details: string[];
}

/** Generate a human-friendly weather message based on conditions */
export function getWeatherMessage(day: DayConditions): string {
  const { temp, humidity, precipprob, windspeed, conditions } = day;
  const lower = conditions.toLowerCase();

  if (lower.includes("rain") || lower.includes("storm") || lower.includes("thunder")) {
    return "Rainy — consider rescheduling";
  }
  if (lower.includes("snow") || lower.includes("ice")) {
    return "Snowy — probably best to stay in";
  }
  if (windspeed > 25) return "Very windy — not ideal outdoors";
  if (windspeed > 15) return "Breezy — secure loose items";
  if (precipprob > 60) return "Likely rain — bring umbrellas";
  if (precipprob > 30) return "Chance of rain — pack layers";
  if (temp > 95) return "Dangerously hot — stay hydrated";
  if (temp > 85) return "Hot — find some shade";
  if (temp >= 60 && temp <= 75 && humidity < 60 && windspeed < 15) return "Perfect day outside";
  if (temp >= 55 && temp <= 80) return "Nice day for a meetup";
  if (temp < 40) return "Bundle up — it's cold";
  if (temp < 55) return "Cool — bring a jacket";
  if (humidity > 80) return "Humid — dress light";

  return "Decent weather";
}

/** Score weather on a 0-100 scale for outdoor meetup suitability */
export function scoreWeather(day: DayConditions): WeatherScore {
  let score = 100;
  const details: string[] = [];

  // Temperature scoring (ideal: 60-75°F)
  const { temp, humidity, precipprob, windspeed, precip } = day;
  if (temp >= 60 && temp <= 75) {
    details.push("Comfortable temperature");
  } else if (temp >= 50 && temp <= 85) {
    score -= 10;
    details.push(temp < 60 ? "A bit cool" : "A bit warm");
  } else if (temp >= 40 && temp <= 95) {
    score -= 25;
    details.push(temp < 50 ? "Cold" : "Hot");
  } else {
    score -= 45;
    details.push(temp < 40 ? "Very cold" : "Dangerously hot");
  }

  // Precipitation scoring
  if (precipprob > 70) {
    score -= 35;
    details.push("High chance of rain");
  } else if (precipprob > 40) {
    score -= 20;
    details.push("Moderate rain chance");
  } else if (precipprob > 20) {
    score -= 8;
    details.push("Slight rain chance");
  } else {
    details.push("Dry conditions");
  }

  if (precip > 0.5) {
    score -= 10;
  }

  // Wind scoring (ideal: < 10 mph)
  if (windspeed > 25) {
    score -= 25;
    details.push("Very windy");
  } else if (windspeed > 15) {
    score -= 12;
    details.push("Breezy");
  } else if (windspeed > 10) {
    score -= 5;
    details.push("Light breeze");
  } else {
    details.push("Calm winds");
  }

  // Humidity scoring
  if (humidity > 80) {
    score -= 10;
    details.push("Very humid");
  } else if (humidity > 65) {
    score -= 5;
  }

  score = Math.max(0, Math.min(100, score));

  let verdict: WeatherScore["verdict"];
  let label: string;
  if (score >= 75) {
    verdict = "great";
    label = "Go ahead";
  } else if (score >= 55) {
    verdict = "good";
    label = "Looks good";
  } else if (score >= 35) {
    verdict = "fair";
    label = "Bring gear";
  } else {
    verdict = "poor";
    label = "Consider rescheduling";
  }

  return {
    total: score,
    verdict,
    label,
    message: getWeatherMessage(day),
    details,
  };
}

/** Compare two weeks and return a recommendation */
export function compareWeeks(
  thisWeek: DayConditions | null,
  nextWeek: DayConditions | null,
): string | null {
  if (!thisWeek || !nextWeek) return null;

  const thisScore = scoreWeather(thisWeek);
  const nextScore = scoreWeather(nextWeek);
  const diff = thisScore.total - nextScore.total;

  if (diff > 15) return "This week looks better — go for it!";
  if (diff < -15) return "Next week looks more favorable";
  return "Both weeks look similar";
}
