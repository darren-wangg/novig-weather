# Weather Meetup

A single-page React app that helps outdoor meetup organizers compare this week's forecast to next week's, and communicate what to expect.

## Tech Stack

- **React 19** + TypeScript
- **Vite** — build tooling
- **Tailwind CSS v4** — styling
- **Recharts** — weather charts
- **TanStack Query** — data fetching & caching
- **date-fns** — date utilities
- **Visual Crossing API** — weather data

## Getting Started

```bash
bun install
cp .env.example .env        # add your Visual Crossing API key
bun dev
```

## Deployment

```bash
bun run build   # outputs to dist/
```