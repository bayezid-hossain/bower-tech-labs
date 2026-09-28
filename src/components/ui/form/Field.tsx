import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type FieldProps = {
  id: string;
  label: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  className?: string;
  children: ReactNode;
};

export function Field({ id, label, required, optional, error, className, children }: FieldProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      <label htmlFor={id} className="text-[17px] font-medium leading-6 tracking-[-0.02em] text-label">
        {label}
        {required && "*"}
        {optional && <span className="ml-1 text-[11px] font-normal tracking-normal text-body">(Optional)</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-[13px] leading-4 text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
