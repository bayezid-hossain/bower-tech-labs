import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/motion/FadeIn";
import { FaqAccordion } from "@/components/patterns/FaqAccordion";
import { faqs, faqSection } from "@/content/faq";

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="pt-20 lg:pt-[160px]">
      <Container>
        <SectionHeading titleId="faq-title" align="center" title={faqSection.title} subtitle={faqSection.subtitle} />
        <FadeIn className="mx-auto mt-8 max-w-[928px] lg:mt-10">
          <FaqAccordion items={faqs} />
        </FadeIn>
      </Container>
    </section>
  );
}
