import { filterHoursByRange, findDayByWeekday, getDateRange, getTimeRange } from "@/lib/date-utils";
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
