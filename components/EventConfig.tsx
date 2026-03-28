"use client";

import type { DayValue, EventConfig as EventConfigType, TimeRangeValue } from "@/lib/constants";
import { DaySelector } from "./DaySelector";
import { LocationInput } from "./LocationInput";
import { TimeRangeSelector } from "./TimeRangeSelector";

interface EventConfigProps {
  config: EventConfigType;
  onChange: (config: EventConfigType) => void;
  onSubmit: (config?: EventConfigType) => void;
}

export function EventConfig({ config, onChange, onSubmit }: EventConfigProps) {
  const updateField = <K extends keyof EventConfigType>(key: K, value: EventConfigType[K]) => {
    const next = { ...config, [key]: value };
    onChange(next);
    // Auto-submit with the NEW config when day or time range changes
    if (key !== "location" && next.location.trim()) {
      onSubmit(next);
    }
  };

  return (
    <div className="space-y-4">
      <LocationInput
        value={config.location}
        onChange={(v) => updateField("location", v)}
        onSubmit={() => onSubmit()}
      />
      <div className="flex flex-wrap gap-6">
        <DaySelector value={config.day} onChange={(v: DayValue) => updateField("day", v)} />
        <TimeRangeSelector
          value={config.timeRange}
          onChange={(v: TimeRangeValue) => updateField("timeRange", v)}
        />
      </div>
    </div>
  );
}
