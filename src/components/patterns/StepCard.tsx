import { cn } from "@/lib/cn";
import { Card } from "@/components/ui/Card";
import type { ProcessStep } from "@/types/content";

export function StepCard({ step, className }: { step: ProcessStep; className?: string }) {
  return (
    <Card as="article" className={cn("p-5 pb-10 lg:p-6", className)}>
      <p className="text-[15px] leading-6 text-accent">{step.step}</p>
      <h3 className="mt-6 text-xl font-semibold leading-7 tracking-[-0.04em] text-ink lg:mt-12 lg:text-[26px] lg:leading-8">
        {step.title}
      </h3>
      <p className="mt-4 whitespace-pre-wrap text-[15px] leading-6 text-body">{step.description}</p>
    </Card>
  );
}
