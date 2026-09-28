import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { PlayReel } from "@/components/patterns/PlayReel";
import { about } from "@/content/about";

export function About() {
  return (
    <section id="about" aria-label="About" className="pt-[51px] lg:pt-[133px]">
      <Container>
        <Reveal>
          <p className="mx-auto max-w-[1092px] text-center text-[28px] leading-8 tracking-[-0.05em] lg:text-[40px] lg:leading-[48px] lg:tracking-[-0.04em]">
            <span className="font-semibold text-ink">{about.lead}</span>
            {"\u00a0 "}
            <span className="font-light text-body">{about.rest}</span>
          </p>
        </Reveal>
        <Reveal className="mt-[31px] lg:mt-[56px]">
          <PlayReel alt={about.reelAlt} className="ml-0.5 max-w-[325px] lg:ml-[288px] lg:max-w-[612px]" />
        </Reveal>
      </Container>
    </section>
  );
}
