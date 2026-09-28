"use client";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/motion/FadeIn";
import { CarouselControls, CarouselTrack } from "@/components/patterns/Carousel";
import { TestimonialCard } from "@/components/patterns/TestimonialCard";
import { testimonials, testimonialsSection } from "@/content/testimonials";
import { useCarousel } from "@/hooks/useCarousel";

export function Testimonials() {
  const { trackRef, prev, next } = useCarousel();
  const controls = { onPrev: prev, onNext: next };

  return (
    <section id="testimonials" aria-labelledby="testimonials-title" className="pt-20 lg:pt-[113px]">
      <Container>
        <div className="grid gap-8 lg:mr-[calc(50%-50vw)] lg:grid-cols-[540px_1fr] lg:gap-0">
          <div className="flex flex-col lg:justify-between">
            <FadeIn>
              <SectionHeading
                titleId="testimonials-title"
                title={testimonialsSection.title}
                subtitle={testimonialsSection.subtitle}
              />
            </FadeIn>
            <CarouselControls {...controls} className="hidden lg:flex" />
          </div>
          <CarouselTrack trackRef={trackRef} label="Testimonials">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="w-full shrink-0 snap-start lg:w-[336px]">
                <TestimonialCard testimonial={testimonial} className="h-full" />
              </div>
            ))}
          </CarouselTrack>
          <CarouselControls {...controls} className="justify-center lg:hidden" />
        </div>
      </Container>
    </section>
  );
}
