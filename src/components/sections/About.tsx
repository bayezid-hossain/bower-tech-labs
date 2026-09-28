import { Container } from "@/components/ui/Container";
import { AnimatedText } from "@/components/motion/AnimatedText";
import { FadeIn } from "@/components/motion/FadeIn";
import { PlayReel } from "@/components/patterns/PlayReel";
import { about } from "@/content/about";

const leadDelay = about.lead.split(" ").length * 0.05;

export function About() {
  return (
    <section id="about" aria-label="About" className="pt-[51px] lg:pt-[133px]">
      <Container>
        <p className="mx-auto max-w-[1092px] text-center text-[28px] leading-8 tracking-[-0.05em] lg:text-[40px] lg:leading-[48px] lg:tracking-[-0.04em]">
          <AnimatedText text={about.lead} className="font-semibold text-ink" />
          {"  "}
          <AnimatedText text={about.rest} delay={leadDelay} className="font-light text-body" />
        </p>
        <FadeIn className="mt-[31px] lg:mt-[56px]">
          <PlayReel alt={about.reelAlt} className="max-w-[325px] lg:max-w-[612px]" />
        </FadeIn>
      </Container>
    </section>
  );
}
