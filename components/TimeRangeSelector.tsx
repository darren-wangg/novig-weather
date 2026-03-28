"use client";

import { TIME_RANGES } from "@/lib/constants";
import type { TimeRangeValue } from "@/lib/constants";

interface TimeRangeSelectorProps {
  value: TimeRangeValue;
  onChange: (value: TimeRangeValue) => void;
}

export function TimeRangeSelector({ value, onChange }: TimeRangeSelectorProps) {
  return (
    <fieldset>
      <legend className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Time</legend>
      <div className="flex flex-wrap gap-1.5">
        {TIME_RANGES.map((range) => {
          const isSelected = value === range.value;
          return (
            <button
              key={range.value}
              type="button"
              onClick={() => onChange(range.value)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                isSelected
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              }`}
              aria-pressed={isSelected}
              title={range.description}
            >
              {range.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
