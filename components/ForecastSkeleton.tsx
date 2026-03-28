"use client";

function Pulse({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700 ${className}`} />;
}

function CardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 p-5 dark:border-gray-700">
        <div className="mb-3 flex items-start justify-between">
          <div>
            <Pulse className="mb-2 h-3 w-16" />
            <Pulse className="h-5 w-40" />
          </div>
          <Pulse className="h-6 w-20 rounded-full" />
        </div>
        <div className="mb-4 flex items-center gap-4">
          <Pulse className="h-12 w-12 rounded-full" />
          <div>
            <Pulse className="mb-1 h-8 w-20" />
            <Pulse className="h-4 w-16" />
          </div>
        </div>
        <Pulse className="mb-4 h-4 w-48" />
        <div className="mb-4 grid grid-cols-3 gap-3">
          <Pulse className="h-14" />
          <Pulse className="h-14" />
          <Pulse className="h-14" />
        </div>
        <Pulse className="h-2 w-full rounded-full" />
      </div>
      <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
        <Pulse className="mb-3 h-4 w-40" />
        <Pulse className="h-[240px] w-full" />
      </div>
    </div>
  );
}

export function ForecastSkeleton() {
  return (
    <div className="space-y-6">
      <Pulse className="h-4 w-48" />
      <Pulse className="h-10 w-full rounded-lg" />
      <div className="grid gap-6 md:grid-cols-2">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}
