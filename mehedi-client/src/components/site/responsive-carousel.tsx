"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Children, type ReactNode, useRef, useState } from "react";

export function ResponsiveCarousel({
  children,
  label,
  columnsClassName,
}: {
  children: ReactNode;
  label: string;
  columnsClassName: string;
}) {
  const items = Children.toArray(children);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  function scrollTo(index: number) {
    const track = trackRef.current;
    if (!track) return;
    const nextIndex = Math.max(0, Math.min(index, items.length - 1));
    const nextItem = track.children[nextIndex] as HTMLElement | undefined;
    if (!nextItem) return;
    track.scrollTo({
      left: nextItem.offsetLeft - track.offsetLeft - track.clientLeft,
      behavior: "smooth",
    });
    setActiveIndex(nextIndex);
  }

  function updateActiveIndex() {
    const track = trackRef.current;
    if (!track) return;
    setActiveIndex(
      Math.min(
        items.length - 1,
        Math.round(track.scrollLeft / track.clientWidth),
      ),
    );
  }

  if (!items.length) return null;

  return (
    <div>
      <div
        ref={trackRef}
        onScroll={updateActiveIndex}
        aria-label={label}
        className={`-mx-4 flex snap-x snap-mandatory overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:grid md:overflow-visible ${columnsClassName}`}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="w-full shrink-0 snap-center px-3 md:w-auto md:px-0"
          >
            {item}
          </div>
        ))}
      </div>
      {items.length > 1 ? (
        <div className="mt-5 flex items-center justify-center gap-4 md:hidden">
          <button
            type="button"
            onClick={() => scrollTo(activeIndex - 1)}
            disabled={activeIndex === 0}
            aria-label="Show previous card"
            className="grid h-10 w-10 place-items-center rounded-full border border-app text-body transition-colors hover:bg-elev disabled:opacity-40"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div
            className="flex items-center gap-2"
            aria-label={`${activeIndex + 1} of ${items.length}`}
          >
            {items.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => scrollTo(index)}
                aria-label={`Show card ${index + 1} of ${items.length}`}
                aria-current={index === activeIndex ? "true" : undefined}
                className={`h-2 rounded-full transition-all ${index === activeIndex ? "w-5 bg-brand-500" : "w-2 bg-subtle/50"}`}
              />
            ))}
          </div>
          <span className="text-xs tabular-nums text-muted">
            {activeIndex + 1} / {items.length}
          </span>
          <span className="sr-only" aria-live="polite">
            Card {activeIndex + 1} of {items.length}
          </span>
          <button
            type="button"
            onClick={() => scrollTo(activeIndex + 1)}
            disabled={activeIndex === items.length - 1}
            aria-label="Show next card"
            className="grid h-10 w-10 place-items-center rounded-full border border-app text-body transition-colors hover:bg-elev disabled:opacity-40"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
