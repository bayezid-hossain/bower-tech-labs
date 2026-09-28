"use client";

import { Container } from "@/components/ui/Container";
import { LineBreaks } from "@/components/ui/LineBreaks";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CarouselControls, CarouselTrack } from "@/components/patterns/Carousel";
import { PricingCard } from "@/components/patterns/PricingCard";
import { pricingPlans, pricingSection } from "@/content/pricing";
import { usePagedCarousel } from "@/hooks/usePagedCarousel";

export function Pricing() {
  const carousel = usePagedCarousel(pricingPlans.length);
  const { before, emphasis, after } = pricingSection.subtitle;

  return (
    <section id="pricing" aria-labelledby="pricing-title" className="pt-20 lg:pt-[199px]">
      <Container>
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
        <CarouselTrack
          trackRef={carousel.trackRef}
          label="Pricing plans"
          itemCount={pricingPlans.length}
          perPage={{ base: 1, lg: 3 }}
          className="mt-8 lg:mt-12"
        >
          {pricingPlans.map((plan, i) => (
            <div key={i} className="carousel-item">
              <PricingCard plan={plan} className="h-full" />
            </div>
          ))}
        </CarouselTrack>
        <CarouselControls
          onPrev={carousel.prev}
          onNext={carousel.next}
          onGoTo={carousel.goTo}
          canPrev={carousel.canPrev}
          canNext={carousel.canNext}
          page={carousel.page}
          pages={carousel.pages}
          className="mt-6 justify-center"
        />
      </Container>
    </section>
  );
}
