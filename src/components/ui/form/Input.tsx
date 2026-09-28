import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

export const fieldControlClasses =
  "mt-3 h-[46px] w-full border-b border-line bg-transparent text-base text-ink outline-none placeholder:text-hint transition-colors focus:border-navy aria-[invalid=true]:border-red-500";

export function Input({ className, ...props }: ComponentPropsWithoutRef<"input">) {
  return <input className={cn(fieldControlClasses, className)} {...props} />;
}
