"use client";

import { importLibrary, setOptions } from "@googlemaps/js-api-loader";
import { useEffect, useRef, useState } from "react";

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
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
      const place = autocomplete.getPlace();
      const address = place.formatted_address || place.name || "";
      if (address) {
        onChangeRef.current(address);
        // Small delay so React state settles before submit reads it
        setTimeout(() => onSubmitRef.current(), 0);
      }
    });

    autocompleteRef.current = autocomplete;
  }, [loaded]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && value.trim()) {
      // Small delay to let Google Places selection fire first if dropdown is open
      setTimeout(() => onSubmitRef.current(), 150);
    }
  };

  return (
    <div>
      <label htmlFor="location-input" className="mb-1 block text-sm font-medium text-gray-700">
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
          className="w-full rounded-lg border border-gray-300 py-2 pr-3 pl-9 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          autoComplete="off"
        />
      </div>
    </div>
  );
}
