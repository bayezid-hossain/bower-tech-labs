import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/Badge";
import { BulletList } from "@/components/ui/BulletList";
import { Card } from "@/components/ui/Card";
import type { PricingPlan } from "@/types/content";

export function PricingCard({ plan, className }: { plan: PricingPlan; className?: string }) {
  return (
    <Card as="article" className={cn("p-5 lg:p-6 lg:pb-5", className)}>
      <div className="flex items-center justify-between gap-4 border-b border-line pb-6 lg:pb-[23px]">
        <h3 className="text-xl font-semibold tracking-[-0.04em] text-ink lg:pt-0.5 lg:text-2xl lg:tracking-[-0.05em]">{plan.title}</h3>
        <Badge variant="tag" className="lg:px-3.5 lg:pt-0.5 lg:tracking-[-0.03em]">
          {plan.tag}
        </Badge>
      </div>
      <div className="mt-5 flex items-center justify-between gap-4">
        <p className="text-base font-medium tracking-[-0.02em] text-ink lg:text-lg lg:tracking-[-0.05em]">{plan.packageName}</p>
        <p className="text-[26px] font-semibold leading-8 tracking-[-0.04em] text-ink lg:text-2xl lg:leading-8 lg:tracking-[-0.03em]">{plan.price}</p>
      </div>
      <BulletList items={plan.features} className="mt-4" itemClassName="text-base leading-8 text-body lg:gap-[9px] lg:text-[15px] lg:tracking-[-0.04em] lg:before:size-[5px] lg:before:-translate-y-[0.15em]" />
    </Card>
  );
}
