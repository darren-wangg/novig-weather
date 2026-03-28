export const DAYS = [
  { value: "mon", label: "Mon" },
  { value: "tue", label: "Tue" },
  { value: "wed", label: "Wed" },
  { value: "thu", label: "Thu" },
  { value: "fri", label: "Fri" },
  { value: "sat", label: "Sat" },
  { value: "sun", label: "Sun" },
] as const;

export const TIME_RANGES = [
  { value: "morning", label: "Morning", description: "8 AM – 12 PM" },
  { value: "afternoon", label: "Afternoon", description: "12 PM – 5 PM" },
  { value: "evening", label: "Evening", description: "5 PM – 9 PM" },
] as const;

export type DayValue = (typeof DAYS)[number]["value"];
export type TimeRangeValue = (typeof TIME_RANGES)[number]["value"];

export interface EventConfig {
  location: string;
  day: DayValue;
  timeRange: TimeRangeValue;
}

// Ordered by JS getDay() index (0=Sun) for lookup
const DAY_BY_INDEX: DayValue[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

function getCurrentDay(): DayValue {
  return DAY_BY_INDEX[new Date().getDay()]!;
}

function getCurrentTimeRange(): TimeRangeValue {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

export function getDefaultConfig(): EventConfig {
  return {
    location: "",
    day: getCurrentDay(),
    timeRange: getCurrentTimeRange(),
  };
}
