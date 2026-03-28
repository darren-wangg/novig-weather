import { compareWeeks, getWeatherMessage, scoreWeather } from "@/lib/recommendations";
import type { DayConditions } from "@/lib/schemas";
import { describe, expect, it } from "vitest";

function makeDay(overrides: Partial<DayConditions> = {}): DayConditions {
  return {
    datetime: "2026-03-27",
    temp: 68,
    tempmax: 75,
    tempmin: 58,
    humidity: 45,
    precip: 0,
    precipprob: 5,
    windspeed: 5,
    conditions: "Clear",
    icon: "clear-day",
    hours: [],
    ...overrides,
  };
}

describe("scoreWeather", () => {
  it("scores ideal conditions as great", () => {
    const score = scoreWeather(makeDay());
    expect(score.verdict).toBe("great");
    expect(score.total).toBeGreaterThanOrEqual(75);
  });

  it("scores bad conditions as poor", () => {
    const score = scoreWeather(makeDay({ temp: 10, precipprob: 90, windspeed: 30 }));
    expect(score.verdict).toBe("poor");
  });

  it("clamps to 0–100", () => {
    const score = scoreWeather(makeDay({ temp: 10, precipprob: 90, windspeed: 40, humidity: 95, precip: 1 }));
    expect(score.total).toBeGreaterThanOrEqual(0);
    expect(score.total).toBeLessThanOrEqual(100);
  });
});

describe("getWeatherMessage", () => {
  it("returns rain message for rainy conditions", () => {
    expect(getWeatherMessage(makeDay({ conditions: "Rain" }))).toContain("Rainy");
  });

  it("returns perfect day for ideal conditions", () => {
    expect(getWeatherMessage(makeDay())).toBe("Perfect day outside");
  });
});

describe("compareWeeks", () => {
  it("returns null when either week is missing", () => {
    expect(compareWeeks(null, makeDay())).toBeNull();
  });

  it("recommends the better week", () => {
    const good = makeDay();
    const bad = makeDay({ temp: 20, precipprob: 80, windspeed: 30 });
    expect(compareWeeks(good, bad)).toContain("This week");
    expect(compareWeeks(bad, good)).toContain("Next week");
  });
});
