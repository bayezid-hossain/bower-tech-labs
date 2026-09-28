"use client";

import type { ReactNode, RefObject } from "react";
import { cn } from "@/lib/cn";
import { IconButton } from "@/components/ui/IconButton";
import { ArrowIcon } from "@/components/ui/icons";

type CarouselTrackProps = {
  trackRef: RefObject<HTMLDivElement | null>;
  label: string;
  className?: string;
  children: ReactNode;
};

export function CarouselTrack({ trackRef, label, className, children }: CarouselTrackProps) {
  return (
    <div
      ref={trackRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      className={cn("flex snap-x snap-mandatory gap-6 overflow-x-auto scrollbar-none", className)}
    >
      {children}
    </div>
  );
}

type CarouselControlsProps = {
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
  className?: string;
};

export function CarouselControls({ onPrev, onNext, canPrev, canNext, className }: CarouselControlsProps) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <IconButton label="Previous" onClick={onPrev} disabled={!canPrev}>
        <ArrowIcon direction="left" />
      </IconButton>
      <IconButton label="Next" onClick={onNext} disabled={!canNext}>
        <ArrowIcon />
      </IconButton>
    </div>
  );
}
