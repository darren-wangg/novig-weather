import { filterHoursByRange, getDateRange, getTimeRange } from "@/lib/date-utils";
import { describe, expect, it } from "vitest";

describe("getDateRange", () => {
  it("spans exactly 7 days", () => {
    const { startDate, endDate } = getDateRange("fri");
    const diff = (new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000;
    expect(diff).toBe(7);
  });

  it("throws for invalid day", () => {
    expect(() => getDateRange("xyz")).toThrow();
  });
});

describe("getTimeRange", () => {
  it("maps morning/afternoon/evening to correct hours", () => {
    expect(getTimeRange("morning")).toEqual({ start: 8, end: 12 });
    expect(getTimeRange("afternoon")).toEqual({ start: 12, end: 17 });
    expect(getTimeRange("evening")).toEqual({ start: 17, end: 21 });
  });
});

describe("filterHoursByRange", () => {
  const hours = [{ datetime: "08:00:00" }, { datetime: "12:00:00" }, { datetime: "17:00:00" }];

  it("filters hours to the given range", () => {
    expect(filterHoursByRange(hours, { start: 8, end: 12 })).toHaveLength(1);
    expect(filterHoursByRange(hours, { start: 12, end: 17 })).toHaveLength(1);
    expect(filterHoursByRange(hours, { start: 8, end: 21 })).toHaveLength(3);
  });
});
