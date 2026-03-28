/** Day-of-week abbreviation → JS getDay() index */
export const DAY_MAP: Record<string, number> = {
  sun: 0,
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
};

export type TimeRange = { start: number; end: number };

/** Compute the date range spanning this-week and next-week occurrences of a target day */
export function getDateRange(day: string, today = new Date()): { startDate: string; endDate: string } {
  const targetDay = DAY_MAP[day.toLowerCase()];
  if (targetDay === undefined) {
    throw new Error(`Invalid day: ${day}`);
  }

  const currentDay = today.getDay();
  let daysUntilTarget = targetDay - currentDay;
  if (daysUntilTarget < 0) daysUntilTarget += 7;

  const thisWeekDate = new Date(today);
  thisWeekDate.setDate(today.getDate() + daysUntilTarget);

  const nextWeekDate = new Date(thisWeekDate);
  nextWeekDate.setDate(thisWeekDate.getDate() + 7);

  return {
    startDate: formatDate(thisWeekDate),
    endDate: formatDate(nextWeekDate),
  };
}

export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0]!;
}

/** Find a specific day-of-week from a list, by week offset (0 = first match, 1 = second) */
export function findDayByWeekday<T extends { datetime: string }>(
  days: T[],
  targetDay: string,
  weekOffset: number,
): T | undefined {
  const target = DAY_MAP[targetDay.toLowerCase()];
  if (target === undefined) return undefined;

  const matches = days.filter((d) => new Date(d.datetime + "T00:00:00").getDay() === target);
  return matches[weekOffset];
}

/** Map time-of-day window name to hour range */
export function getTimeRange(window: string): TimeRange {
  switch (window.toLowerCase()) {
    case "morning":
      return { start: 6, end: 12 };
    case "afternoon":
      return { start: 12, end: 18 };
    case "evening":
      return { start: 18, end: 22 };
    default:
      return { start: 6, end: 22 };
  }
}

/** Filter hourly entries to those within the given hour range */
export function filterHoursByRange<T extends { datetime: string }>(hours: T[], range: TimeRange): T[] {
  return hours.filter((h) => {
    const hour = Number.parseInt(h.datetime.split(":")[0]!, 10);
    return hour >= range.start && hour < range.end;
  });
}
