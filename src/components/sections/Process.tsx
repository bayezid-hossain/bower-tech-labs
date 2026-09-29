import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/motion/FadeIn";
import { StepCard } from "@/components/patterns/StepCard";
import { processSection, processSteps } from "@/content/process";

export function Process() {
  return (
    <section
      id="process"
      aria-labelledby="process-title"
      className="mt-20 bg-page-alt py-20 lg:mt-0 lg:bg-transparent lg:pt-[180px] lg:pb-0"
    >
      <Container>
        <SectionHeading
          titleId="process-title"
          align="center"
          title={processSection.title}
          subtitle={processSection.subtitle}
          titleClassName="lg:tracking-[-0.05em]"
        />
        <ol className="mx-auto mt-8 grid max-w-[1020px] gap-5 lg:mt-[47px] lg:grid-cols-2 lg:gap-6">
          {processSteps.map((step, i) => (
            <li key={step.step}>
              <FadeIn delay={(i % 2) * 0.1} className="h-full">
                <StepCard step={step} className="h-full" />
              </FadeIn>
            </li>
          ))}
        </ol>
        <div className="mt-8 flex justify-center">
          <Button href={processSection.cta.href} size="lg" className="h-12 w-full text-[15px] lg:h-14 lg:w-auto lg:text-[17px]">
            {processSection.cta.label}
          </Button>
        </div>
      </Container>
    </section>
  );
}
