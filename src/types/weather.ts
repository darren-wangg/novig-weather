/** Visual Crossing API response types (subset we use) */

export interface HourlyConditions {
  datetime: string; // "HH:mm:ss"
  temp: number;
  humidity: number;
  precip: number;
  windspeed: number;
  conditions: string;
  icon: string;
}

export interface DayConditions {
  datetime: string; // "YYYY-MM-DD"
  temp: number;
  tempmax: number;
  tempmin: number;
  humidity: number;
  precip: number;
  precipprob: number;
  windspeed: number;
  conditions: string;
  icon: string;
  hours: HourlyConditions[];
}

export interface WeatherResponse {
  resolvedAddress: string;
  address: string;
  timezone: string;
  days: DayConditions[];
}
