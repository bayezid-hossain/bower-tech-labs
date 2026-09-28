import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { PlayReel } from "@/components/patterns/PlayReel";
import { about } from "@/content/about";

export function About() {
  return (
    <section id="about" aria-label="About" className="pt-20 lg:pt-[133px]">
      <Container>
        <Reveal>
          <p className="mx-auto max-w-[1092px] text-center text-[26px] leading-8 tracking-[-0.04em] lg:text-[40px] lg:leading-[48px]">
            <span className="font-semibold text-ink">{about.lead}</span>
            {"\u00a0 "}
            <span className="font-light text-body">{about.rest}</span>
          </p>
        </Reveal>
        <Reveal className="mt-10 lg:mt-[56px]">
          <PlayReel alt={about.reelAlt} className="lg:ml-[288px]" />
        </Reveal>
      </Container>
    </section>
  );
}
