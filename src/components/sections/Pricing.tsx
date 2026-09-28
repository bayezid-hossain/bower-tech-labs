"use client";

import { Container } from "@/components/ui/Container";
import { LineBreaks } from "@/components/ui/LineBreaks";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { CarouselControls, CarouselTrack } from "@/components/patterns/Carousel";
import { PricingCard } from "@/components/patterns/PricingCard";
import { pricingPlans, pricingSection } from "@/content/pricing";
import { useCarousel } from "@/hooks/useCarousel";

export function Pricing() {
  const { trackRef, prev, next, canPrev, canNext } = useCarousel();
  const { before, emphasis, after } = pricingSection.subtitle;

  return (
    <section id="pricing" aria-labelledby="pricing-title" className="pt-20 lg:pt-[199px]">
      <Container>
        <Reveal>
          <SectionHeading
            titleId="pricing-title"
            align="center"
            title={pricingSection.title}
            subtitle={
              <>
                {before}
                <span className="font-medium">{emphasis}</span>
                <LineBreaks text={after} />
              </>
            }
            subtitleClassName="lg:text-[17px]"
          />
        </Reveal>
        <div className="mt-8 lg:mt-12 lg:mr-[calc(50%-50vw)]">
          <CarouselTrack trackRef={trackRef} label="Pricing plans">
            {pricingPlans.map((plan, i) => (
              <div key={i} className="w-full shrink-0 snap-start lg:w-[384px]">
                <PricingCard plan={plan} className="h-full" />
              </div>
            ))}
          </CarouselTrack>
        </div>
        <CarouselControls onPrev={prev} onNext={next} canPrev={canPrev} canNext={canNext} className="mt-6 justify-center" />
      </Container>
    </section>
  );
}
