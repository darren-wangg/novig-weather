import { DayConditionsSchema, WeatherResponseSchema } from "@/lib/schemas";
import { describe, expect, it } from "vitest";

describe("Zod schemas", () => {
  const validDay = {
    datetime: "2026-03-27",
    temp: 68,
    tempmax: 75,
    tempmin: 58,
    humidity: 50,
    precip: 0,
    precipprob: 10,
    windspeed: 7,
    conditions: "Clear",
    icon: "clear-day",
  };

  it("parses valid day and defaults hours to empty array", () => {
    const result = DayConditionsSchema.safeParse(validDay);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.hours).toEqual([]);
  });

  it("rejects incomplete data", () => {
    expect(DayConditionsSchema.safeParse({ datetime: "2026-03-27" }).success).toBe(false);
  });

  it("parses a full API response", () => {
    const result = WeatherResponseSchema.safeParse({
      resolvedAddress: "San Francisco, CA",
      address: "San Francisco",
      timezone: "America/Los_Angeles",
      days: [{ ...validDay, hours: [] }],
    });
    expect(result.success).toBe(true);
  });
});
