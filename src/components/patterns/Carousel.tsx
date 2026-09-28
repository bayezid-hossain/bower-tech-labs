"use client";

import type { CSSProperties, ReactNode, RefObject } from "react";
import { cn } from "@/lib/cn";
import { spacerCount } from "@/lib/carousel";
import { IconButton } from "@/components/ui/IconButton";
import { ArrowIcon } from "@/components/ui/icons";

type PerPage = { base: number; lg: number };

type CarouselTrackProps = {
  trackRef: RefObject<HTMLDivElement | null>;
  label: string;
  itemCount: number;
  perPage: PerPage;
  className?: string;
  /** Items must use className="carousel-item". */
  children: ReactNode;
};

export function CarouselTrack({ trackRef, label, itemCount, perPage, className, children }: CarouselTrackProps) {
  const style = { "--per-page-base": perPage.base, "--per-page-lg": perPage.lg } as CSSProperties;
  return (
    <div
      ref={trackRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      style={style}
      className={cn("carousel-track flex min-w-0 snap-x snap-mandatory gap-6 overflow-x-auto scrollbar-none", className)}
    >
      {children}
      {Array.from({ length: spacerCount(itemCount, perPage.base) }, (_, i) => (
        <div key={`base-${i}`} aria-hidden="true" className="carousel-item lg:hidden" />
      ))}
      {Array.from({ length: spacerCount(itemCount, perPage.lg) }, (_, i) => (
        <div key={`lg-${i}`} aria-hidden="true" className="carousel-item hidden lg:block" />
      ))}
    </div>
  );
}

type CarouselControlsProps = {
  onPrev: () => void;
  onNext: () => void;
  onGoTo: (page: number) => void;
  canPrev: boolean;
  canNext: boolean;
  page: number;
  pages: number;
  className?: string;
};

/** ‹ • • › — arrows disable at the ends; dots show and jump to pages (the "more items" tip). */
export function CarouselControls({ onPrev, onNext, onGoTo, canPrev, canNext, page, pages, className }: CarouselControlsProps) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <IconButton label="Previous" onClick={onPrev} disabled={!canPrev}>
        <ArrowIcon direction="left" />
      </IconButton>
      {pages > 1 && (
        <div role="group" aria-label="Pages" className="flex items-center">
          {Array.from({ length: pages }, (_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to page ${i + 1}`}
              aria-current={i === page ? "true" : undefined}
              onClick={() => onGoTo(i)}
              className="group/dot p-1.5 transition-transform active:scale-[0.9] focus-visible:outline-2 focus-visible:outline-navy"
            >
              <span
                className={cn(
                  "block size-2 rounded-full transition-colors duration-200",
                  i === page ? "bg-navy" : "bg-placeholder group-hover/dot:bg-navy/50",
                )}
              />
            </button>
          ))}
        </div>
      )}
      <IconButton label="Next" onClick={onNext} disabled={!canNext}>
        <ArrowIcon />
      </IconButton>
    </div>
  );
}
