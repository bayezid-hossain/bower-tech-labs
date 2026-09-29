import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { AnimatedText } from "@/components/motion/AnimatedText";
import { FadeIn } from "@/components/motion/FadeIn";
import { CurvedGallery } from "@/components/patterns/CurvedGallery";
import { WhatsAppButton } from "@/components/patterns/WhatsAppButton";
import { hero } from "@/content/hero";
import { site } from "@/content/site";

export function Hero() {
  return (
    <section aria-labelledby="hero-title">
      <Container className="relative pt-4 lg:pt-[124px]">
        <Image
          src="/brand/hero-glass.png"
          alt=""
          width={481}
          height={492}
          preload
          className="pointer-events-none absolute top-14 right-5 hidden lg:block"
        />
        <div className="relative max-w-[640px] md:mx-auto md:text-center lg:mx-0 lg:text-left">
          <FadeIn trigger="mount" y={10}>
            <Badge className="tracking-[-0.045em] lg:pr-[15px] lg:tracking-[0.015em]">{hero.status}</Badge>
          </FadeIn>
          <AnimatedText
            as="h1"
            id="hero-title"
            trigger="mount"
            text={hero.title}
            className="mt-[25px] max-w-[320px] text-[40px] md:max-w-none font-semibold leading-10 tracking-[-0.04em] text-ink lg:mt-10 lg:max-w-none lg:text-[56px] lg:leading-[60px] lg:tracking-[-0.04em]"
          />
          <AnimatedText
            as="p"
            trigger="mount"
            delay={0.5}
            text={hero.description}
            className="mt-[23px] text-[16px] leading-5 tracking-[-0.058em] text-body lg:mt-[25px] lg:text-[17px] lg:leading-6 lg:tracking-[-0.03em]"
          />
          <FadeIn trigger="mount" delay={0.8} className="mt-10 flex flex-col gap-4 md:flex-row md:justify-center lg:mt-[39px] lg:justify-start lg:gap-4">
            <Button href={hero.primaryCta.href} size="lg" className="h-12 w-full text-[15px] md:w-auto lg:h-14 lg:pt-1 lg:text-[17px]">
              {hero.primaryCta.label}
            </Button>
            <WhatsAppButton href={site.whatsappUrl} label={site.whatsappLabel} className="h-12 w-full text-[15px] md:w-auto lg:h-14 lg:pt-1 lg:text-[17px]" />
          </FadeIn>
        </div>
      </Container>
      <CurvedGallery images={hero.gallery} label={hero.galleryLabel} priority className="mt-[52px] lg:mt-[67px]" />
    </section>
  );
}
