"use client";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CarouselControls, CarouselTrack } from "@/components/patterns/Carousel";
import { TestimonialCard } from "@/components/patterns/TestimonialCard";
import { testimonials, testimonialsSection } from "@/content/testimonials";
import { usePagedCarousel } from "@/hooks/usePagedCarousel";

export function Testimonials() {
  const carousel = usePagedCarousel(testimonials.length);
  const controls = {
    onPrev: carousel.prev,
    onNext: carousel.next,
    onGoTo: carousel.goTo,
    canPrev: carousel.canPrev,
    canNext: carousel.canNext,
    page: carousel.page,
    pages: carousel.pages,
  };

  return (
    <section id="testimonials" aria-labelledby="testimonials-title" className="pt-20 lg:pt-[113px]">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[400px_1fr] lg:gap-0 xl:grid-cols-[540px_1fr]">
          <div className="flex flex-col lg:justify-between">
            <SectionHeading titleId="testimonials-title" title={testimonialsSection.title} subtitle={testimonialsSection.subtitle} />
            <CarouselControls {...controls} className="hidden lg:flex" />
          </div>
          <CarouselTrack
            trackRef={carousel.trackRef}
            label="Testimonials"
            itemCount={testimonials.length}
            perPage={{ base: 1, lg: 2 }}
            className="xl:-mr-9"
          >
            {testimonials.map((testimonial, i) => (
              <div key={i} className="carousel-item">
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
