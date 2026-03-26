import { z } from "zod/v4";

export const HourlyConditionsSchema = z.object({
  datetime: z.string(),
  temp: z.number(),
  humidity: z.number(),
  precip: z.number(),
  windspeed: z.number(),
  conditions: z.string(),
  icon: z.string(),
});

export const DayConditionsSchema = z.object({
  datetime: z.string(),
  temp: z.number(),
  tempmax: z.number(),
  tempmin: z.number(),
  humidity: z.number(),
  precip: z.number(),
  precipprob: z.number(),
  windspeed: z.number(),
  conditions: z.string(),
  icon: z.string(),
  hours: z.array(HourlyConditionsSchema).optional().default([]),
});

export const WeatherResponseSchema = z.object({
  resolvedAddress: z.string(),
  address: z.string(),
  timezone: z.string(),
  days: z.array(DayConditionsSchema),
});

export type HourlyConditions = z.infer<typeof HourlyConditionsSchema>;
export type DayConditions = z.infer<typeof DayConditionsSchema>;
export type WeatherResponse = z.infer<typeof WeatherResponseSchema>;
