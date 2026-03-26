import { fetchWeather } from "@/lib/weather";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get("location");
  const day = searchParams.get("day");
  const window = searchParams.get("window");

  if (!location || !day || !window) {
    return NextResponse.json(
      { error: "Missing required parameters: location, day, window" },
      { status: 400 },
    );
  }

  try {
    const { startDate, endDate } = getDateRange(day);
    const data = await fetchWeather(location, startDate, endDate);

    const thisWeekDay = findDayByWeekday(data.days, day, 0);
    const nextWeekDay = findDayByWeekday(data.days, day, 1);

    const timeRange = getTimeRange(window);

    return NextResponse.json({
      resolvedAddress: data.resolvedAddress,
      timezone: data.timezone,
      thisWeek: thisWeekDay
        ? {
            ...thisWeekDay,
            hours: filterHoursByRange(thisWeekDay.hours, timeRange),
          }
        : null,
      nextWeek: nextWeekDay
        ? {
            ...nextWeekDay,
            hours: filterHoursByRange(nextWeekDay.hours, timeRange),
          }
        : null,
    });
  } catch (error) {
    console.error("Forecast API error:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch forecast";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

const DAY_MAP: Record<string, number> = {
  sun: 0,
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
};

function getDateRange(day: string): { startDate: string; endDate: string } {
  const today = new Date();
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

  // Fetch from today to next week's target day
  return {
    startDate: formatDate(thisWeekDate),
    endDate: formatDate(nextWeekDate),
  };
}

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0]!;
}

function findDayByWeekday(
  days: { datetime: string; hours: { datetime: string }[] }[],
  targetDay: string,
  weekOffset: number,
): (typeof days)[number] | undefined {
  const target = DAY_MAP[targetDay.toLowerCase()];
  if (target === undefined) return undefined;

  const matches = days.filter((d) => new Date(d.datetime + "T00:00:00").getDay() === target);
  return matches[weekOffset];
}

type TimeRange = { start: number; end: number };

function getTimeRange(window: string): TimeRange {
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

function filterHoursByRange(
  hours: { datetime: string }[],
  range: TimeRange,
): typeof hours {
  return hours.filter((h) => {
    const hour = Number.parseInt(h.datetime.split(":")[0]!, 10);
    return hour >= range.start && hour < range.end;
  });
}
