"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";

interface WeekCarouselProps {
  children: [React.ReactNode, React.ReactNode];
  labels: [string, string];
}

export function WeekCarousel({ children, labels }: WeekCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div>
      {/* Navigation header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex gap-2">
          {labels.map((label, i) => (
            <button
              key={label}
              type="button"
              onClick={() => emblaApi?.scrollTo(i)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                selectedIndex === i
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:opacity-30"
            aria-label="Previous week"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            type="button"
            onClick={scrollNext}
            disabled={!canScrollNext}
            className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:opacity-30"
            aria-label="Next week"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Carousel viewport */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {children.map((child, i) => (
            <div key={labels[i]} className="min-w-0 flex-[0_0_100%] md:flex-[0_0_calc(50%-0.5rem)]">
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Dots indicator (mobile only) */}
      <div className="mt-3 flex justify-center gap-1.5 md:hidden">
        {labels.map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => emblaApi?.scrollTo(i)}
            className={`h-1.5 rounded-full transition-all ${
              selectedIndex === i ? "w-6 bg-gray-900" : "w-1.5 bg-gray-300"
            }`}
            aria-label={`Go to ${label}`}
          />
        ))}
      </div>
    </div>
  );
}
