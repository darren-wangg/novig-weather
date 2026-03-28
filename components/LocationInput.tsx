"use client";

import { importLibrary, setOptions } from "@googlemaps/js-api-loader";
import { useEffect, useRef, useState } from "react";

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (address?: string) => void;
}

export function LocationInput({ value, onChange, onSubmit }: LocationInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Keep stable refs to avoid re-initializing autocomplete
  const onChangeRef = useRef(onChange);
  const onSubmitRef = useRef(onSubmit);
  onChangeRef.current = onChange;
  onSubmitRef.current = onSubmit;

  // Pending Enter submit — cancelled if place_changed fires first
  const pendingEnterSubmit = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load Google Places API
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
    if (!apiKey || loaded) return;

    setOptions({ key: apiKey, v: "weekly" });
    importLibrary("places").then(() => {
      setLoaded(true);
    });
  }, [loaded]);

  // Initialize autocomplete once API is loaded
  useEffect(() => {
    if (!loaded || !inputRef.current || autocompleteRef.current) return;

    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
      types: ["geocode", "establishment"],
      fields: ["formatted_address", "name"],
    });

    autocomplete.addListener("place_changed", () => {
      // Cancel any pending Enter submit — Places is handling the selection
      if (pendingEnterSubmit.current) {
        clearTimeout(pendingEnterSubmit.current);
        pendingEnterSubmit.current = null;
      }
      const place = autocomplete.getPlace();
      const address = place.formatted_address || place.name || "";
      if (address) {
        onChangeRef.current(address);
        onSubmitRef.current(address);
      }
    });

    autocompleteRef.current = autocomplete;
  }, [loaded]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && value.trim()) {
      // Delay briefly so place_changed can cancel if the user selected from the dropdown.
      // Value is captured now (no stale closure) — the delay is only for event ordering.
      const captured = value;
      if (pendingEnterSubmit.current) clearTimeout(pendingEnterSubmit.current);
      pendingEnterSubmit.current = setTimeout(() => {
        pendingEnterSubmit.current = null;
        onSubmitRef.current(captured);
      }, 50);
    }
  };

  return (
    <div>
      <label htmlFor="location-input" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
        Location
      </label>
      <div className="relative">
        <svg
          className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0 1 15 0Z"
          />
        </svg>
        <input
          ref={inputRef}
          id="location-input"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search for a park, city, or address..."
          className="w-full rounded-lg border border-gray-300 bg-white py-2 pr-3 pl-9 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
          autoComplete="off"
        />
      </div>
    </div>
  );
}
