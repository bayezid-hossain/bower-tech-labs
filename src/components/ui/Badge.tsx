import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type BadgeProps = { variant?: "status" | "tag"; children: ReactNode; className?: string };

export function Badge({ variant = "status", children, className }: BadgeProps) {
  if (variant === "tag") {
    return (
      <span className={cn("inline-flex h-9 shrink-0 items-center rounded-[4px] bg-navy px-3 text-[13px] text-white", className)}>
        {children}
      </span>
    );
  }
  return (
    <span className={cn("inline-flex h-8 items-center gap-2 rounded-full bg-surface pr-3.5 pl-3.5 text-[15px] text-body", className)}>
      <span aria-hidden="true" className="size-4 rounded-full bg-success" />
      {children}
    </span>
  );
}
