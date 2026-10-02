import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/Badge";
import { BulletList } from "@/components/ui/BulletList";
import { ScrollFade } from "@/components/ui/ScrollFade";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { WhatsAppButton } from "@/components/patterns/WhatsAppButton";
import type { PricingOverlay, PricingPlan } from "@/types/content";

type PricingCardProps = { plan: PricingPlan; moreLabel: string; overlay?: PricingOverlay; className?: string };

export function PricingCard({ plan, moreLabel, overlay, className }: PricingCardProps) {
  return (
    <Card as="article" className={cn("group/card relative p-5 lg:p-6 lg:pb-5", className)}>
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
      <ScrollFade className="mt-4 max-h-48 lg:max-h-none" moreLabel={moreLabel}>
        <BulletList items={plan.features} itemClassName="text-[15px] leading-7 text-body lg:gap-[9px] lg:text-[15px] lg:leading-8 lg:tracking-[-0.04em] lg:before:size-[5px] lg:before:-translate-y-[0.15em]" />
      </ScrollFade>
      {overlay && (
        // Desktop only: on hover (or keyboard focus inside the card) the card blurs behind a call-to-action layer.
        <div className="pointer-events-none absolute inset-0 hidden flex-col items-center justify-center gap-6 rounded-3xl bg-surface/55 px-8 text-center opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-focus-within/card:pointer-events-auto group-focus-within/card:opacity-100 group-hover/card:pointer-events-auto group-hover/card:opacity-100 lg:flex">
          {/* Stronger blur behind the text and buttons, feathered out toward the edges. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-3xl bg-surface/70 backdrop-blur-md [mask-image:radial-gradient(ellipse_75%_50%_at_50%_50%,black_55%,transparent_100%)]"
          />
          <p className="relative max-w-[300px] text-[15px] leading-6 tracking-[-0.02em] text-ink">{overlay.text}</p>
          <div className="relative flex w-full flex-col gap-3">
            <Button href={overlay.bookHref} size="md" className="h-12 w-full text-[15px]">
              {overlay.bookLabel}
            </Button>
            <WhatsAppButton href={overlay.whatsappHref} label={overlay.whatsappLabel} size="sm" className="h-12 w-full text-[15px]" />
          </div>
        </div>
      )}
    </Card>
  );
}
