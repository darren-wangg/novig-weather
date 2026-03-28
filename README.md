# Tempora

A weather comparison app for outdoor meetup organizers. Pick a day and time window, and Tempora shows this week's forecast side-by-side with next week's — with scoring, recommendations, and hourly charts to help you decide when to meet.

## Features

- **Week-over-week comparison** — see this week vs next week at a glance
- **Smart recommendations** — weighted scoring (0–100) across temperature, wind, precipitation, and humidity with actionable verdicts
- **Hourly charts** — temperature and precipitation overlaid for your selected time window
- **Google Places autocomplete** — search any park, city, or address
- **Auto-detect location** — uses browser geolocation on first visit
- **Day & time selectors** — Morning / Afternoon / Evening for any day of the week
- **Dark mode** — toggle with system preference detection
- **Persistent preferences** — location, day, time, and theme saved to localStorage

## Tech Stack

- **Next.js 16** (App Router) — server-side API proxy keeps API keys off the client
- **React 19** + TypeScript 5.7
- **Tailwind CSS v4** — styling
- **TanStack React Query v5** — data fetching & caching
- **Recharts** — composed charts (temperature area + precipitation bars)
- **Embla Carousel** — swipeable week navigation on mobile
- **Zod v4** — runtime API response validation
- **Biome** — linting & formatting
- **Vitest** + **Playwright** — unit & e2e tests
- **Visual Crossing API** — weather data
- **Google Places API** — location autocomplete

## Getting Started

```bash
bun install
cp .env.example .env   # add your API keys
bun dev                # http://localhost:3000
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `VISUAL_CROSSING_API_KEY` | [Visual Crossing](https://www.visualcrossing.com/) API key (server-side only) |
| `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY` | Google Maps/Places API key (client-side, for autocomplete) |

## Scripts

```bash
bun dev          # dev server
bun run build    # production build
bun test         # unit tests (Vitest)
bun run test:e2e # e2e tests (Playwright)
bun run lint     # Biome check
```

## Architecture

```
app/
  page.tsx              Main page — orchestrates state, geolocation, forecast
  api/forecast/route.ts Server-side proxy to Visual Crossing (validates with Zod)
components/             UI components (WeatherCard, HourlyChart, WeekCarousel, etc.)
hooks/                  Custom hooks (useForecast, useGeolocation, useLocalStorage, useTheme)
lib/                    Business logic (scoring, date utils, schemas, styles)
```

Key decisions:
- **Next.js over Vite** — needed server-side API routes to keep the Visual Crossing key off the client
- **Zod schemas as single source of truth** — runtime validation + TypeScript types inferred from the same schemas
- **Scoring engine** — weighted formula across 4 weather factors, producing verdicts that map to actionable advice
- **Ref-based callbacks in LocationInput** — avoids re-initializing Google Places autocomplete on every render
