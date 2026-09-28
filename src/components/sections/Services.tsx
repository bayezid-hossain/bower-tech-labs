import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { ServiceCard } from "@/components/patterns/ServiceCard";
import { services, servicesSection } from "@/content/services";

export function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="pt-[78px] lg:pt-[156px]">
      <Container>
        <Reveal>
          <SectionHeading titleId="services-title" title={servicesSection.title} subtitle={servicesSection.subtitle} />
        </Reveal>
        <ul className="mt-[31px] grid gap-5 lg:mt-12 lg:grid-cols-2">
          {services.map((service, i) => (
            <li key={service.title}>
              <Reveal delay={(i % 2) * 100} className="h-full">
                <ServiceCard service={service} className="h-full" />
              </Reveal>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex justify-center">
          <Button href={servicesSection.cta.href} size="lg" className="h-12 w-full text-[15px] lg:h-14 lg:w-auto lg:text-[17px]">
            {servicesSection.cta.label}
          </Button>
        </div>
      </Container>
    </section>
  );
}
