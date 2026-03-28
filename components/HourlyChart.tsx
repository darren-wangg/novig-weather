"use client";

import type { HourlyConditions } from "@/lib/schemas";
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface HourlyChartProps {
  hours: HourlyConditions[];
  label: string;
  color: string;
}

interface ChartDataPoint {
  time: string;
  temp: number;
  precip: number;
  wind: number;
  humidity: number;
}

function formatHour(datetime: string): string {
  const hour = Number.parseInt(datetime.split(":")[0]!, 10);
  if (hour === 0) return "12 AM";
  if (hour === 12) return "12 PM";
  return hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
}

export function HourlyChart({ hours, label, color }: HourlyChartProps) {
  if (hours.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border bg-white p-4">
        <p className="text-sm text-gray-400">No hourly data available</p>
      </div>
    );
  }

  const data: ChartDataPoint[] = hours.map((h) => ({
    time: formatHour(h.datetime),
    temp: Math.round(h.temp),
    precip: Math.round(h.precip * 100) / 100,
    wind: Math.round(h.windspeed),
    humidity: Math.round(h.humidity),
  }));

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <h4 className="mb-3 text-sm font-semibold text-gray-600">{label} — Hourly Breakdown</h4>
      <ResponsiveContainer width="100%" height={240}>
        <ComposedChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="time" tick={{ fontSize: 11 }} tickLine={false} />
          <YAxis
            yAxisId="temp"
            orientation="left"
            tick={{ fontSize: 11 }}
            tickLine={false}
            domain={["auto", "auto"]}
            unit="°"
          />
          <YAxis yAxisId="precip" orientation="right" tick={{ fontSize: 11 }} tickLine={false} hide />
          <Tooltip
            contentStyle={{
              fontSize: 12,
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
            formatter={(value: number, name: string) => {
              if (name === "Temperature") return [`${value}°F`, name];
              if (name === "Precipitation") return [`${value} in`, name];
              if (name === "Wind") return [`${value} mph`, name];
              return [value, name];
            }}
          />
          <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
          <Area
            yAxisId="temp"
            type="monotone"
            dataKey="temp"
            name="Temperature"
            stroke={color}
            fill={color}
            fillOpacity={0.1}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Bar
            yAxisId="precip"
            dataKey="precip"
            name="Precipitation"
            fill="#60a5fa"
            fillOpacity={0.6}
            radius={[2, 2, 0, 0]}
            barSize={12}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
