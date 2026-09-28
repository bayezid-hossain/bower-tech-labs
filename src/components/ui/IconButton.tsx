import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

type IconButtonProps = Omit<ComponentPropsWithoutRef<"button">, "children"> & { label: string; children: ReactNode };

/** 40px outlined circle. Disabled state has no visual change (design shows arrows always enabled). */
export function IconButton({ label, className, children, ...props }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-full border border-ink text-ink",
        "transition-transform duration-150 enabled:hover:-translate-y-0.5 disabled:cursor-default",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
