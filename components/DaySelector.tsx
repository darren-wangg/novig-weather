"use client";

import { DAYS } from "@/lib/constants";
import type { DayValue } from "@/lib/constants";

interface DaySelectorProps {
  value: DayValue;
  onChange: (value: DayValue) => void;
}

export function DaySelector({ value, onChange }: DaySelectorProps) {
  return (
    <fieldset>
      <legend className="mb-1 block text-sm font-medium text-gray-700">Day</legend>
      <div className="flex flex-wrap gap-1.5">
        {DAYS.map((day) => {
          const isSelected = value === day.value;
          return (
            <button
              key={day.value}
              type="button"
              onClick={() => onChange(day.value)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                isSelected
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              aria-pressed={isSelected}
            >
              {day.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
