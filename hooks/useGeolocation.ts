"use client";

import { useCallback, useState } from "react";

interface GeolocationState {
  loading: boolean;
  coords: { lat: number; lng: number } | null;
  error: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    loading: false,
    coords: null,
    error: null,
  });

  const request = useCallback(() => {
    if (!navigator.geolocation) {
      setState({ loading: false, coords: null, error: "Geolocation not supported" });
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          loading: false,
          coords: { lat: position.coords.latitude, lng: position.coords.longitude },
          error: null,
        });
      },
      (err) => {
        setState({ loading: false, coords: null, error: err.message });
      },
      { timeout: 10000, enableHighAccuracy: false },
    );
  }, []);

  return { ...state, request };
}

/** Reverse-geocode coordinates to a readable address using Google Places */
export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
  if (!apiKey) return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`,
    );
    const data = await res.json();
    const result = data.results?.[0];
    return result?.formatted_address ?? `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  } catch {
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
}
