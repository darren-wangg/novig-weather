"use client";

import { DAYS, TIME_RANGES } from "@/lib/constants";
import type { DayValue, EventConfig as EventConfigType, TimeRangeValue } from "@/lib/constants";
import { ChipSelector } from "./ChipSelector";
import { LocationInput } from "./LocationInput";

interface EventConfigProps {
  config: EventConfigType;
  onChange: (config: EventConfigType) => void;
  onSubmit: (config?: EventConfigType) => void;
}

export function EventConfig({ config, onChange, onSubmit }: EventConfigProps) {
  const updateField = <K extends keyof EventConfigType>(key: K, value: EventConfigType[K]) => {
    const next = { ...config, [key]: value };
    onChange(next);
    if (key !== "location" && next.location.trim()) {
      onSubmit(next);
    }
  };

  return (
    <div className="space-y-4">
      <LocationInput
        value={config.location}
        onChange={(v) => updateField("location", v)}
        onSubmit={(address) => {
          if (address) {
            onSubmit({ ...config, location: address });
          } else {
            onSubmit();
          }
        }}
      />
      <div className="flex flex-wrap gap-6">
        <ChipSelector label="Day" options={DAYS} value={config.day} onChange={(v: DayValue) => updateField("day", v)} />
        <ChipSelector
          label="Time"
          options={TIME_RANGES}
          value={config.timeRange}
          onChange={(v: TimeRangeValue) => updateField("timeRange", v)}
        />
      </div>
    </div>
  );
}
