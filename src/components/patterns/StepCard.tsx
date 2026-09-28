import { cn } from "@/lib/cn";
import { Card } from "@/components/ui/Card";
import type { ProcessStep } from "@/types/content";
import { AnimatedText } from "@/components/motion/AnimatedText";

export function StepCard({ step, className }: { step: ProcessStep; className?: string }) {
  return (
    <Card as="article" className={cn("p-5 pb-10 lg:min-h-[260px] lg:p-6 lg:pt-[22px]", className)}>
      <AnimatedText as="p" text={step.step} className="text-[15px] leading-6 text-accent lg:tracking-[-0.04em]" />
      <h3 className="mt-6 text-xl font-semibold leading-7 tracking-[-0.04em] text-ink lg:mt-[46px] lg:text-[27px] lg:leading-8 lg:tracking-[-0.03em]">
        <AnimatedText text={step.title} />
      </h3>
      <AnimatedText as="p" text={step.description} className="mt-4 whitespace-pre-wrap text-[15px] leading-6 text-body lg:tracking-[-0.035em]" />
    </Card>
  );
}
