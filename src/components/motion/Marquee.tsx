import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type MarqueeProps = { children: ReactNode; className?: string; trackClassName?: string; duration?: number };

/** Infinite horizontal scroll with faded edges. Content is duplicated once; pauses on hover. */
export function Marquee({ children, className, trackClassName = "gap-6 pr-6 lg:gap-12 lg:pr-12", duration = 40 }: MarqueeProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]",
        className,
      )}
    >
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]" style={{ animationDuration: `${duration}s` }}>
        <div className={cn("flex shrink-0 items-center", trackClassName)}>{children}</div>
        <div aria-hidden="true" className={cn("flex shrink-0 items-center", trackClassName)}>
          {children}
        </div>
      </div>
    </div>
  );
}
