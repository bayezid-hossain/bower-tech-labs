import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { LineBreaks } from "@/components/ui/LineBreaks";
import { Reveal } from "@/components/motion/Reveal";
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
        <Reveal className="relative max-w-[640px]">
          <Badge className="tracking-[-0.045em] lg:pr-[15px] lg:tracking-[0.015em]">{hero.status}</Badge>
          <h1
            id="hero-title"
            className="mt-[25px] max-w-[320px] text-[40px] font-semibold leading-10 tracking-[-0.04em] text-ink lg:mt-10 lg:max-w-none lg:text-[56px] lg:leading-[60px] lg:tracking-[-0.04em]"
          >
            <LineBreaks text={hero.title} />
          </h1>
          <p className="mt-[23px] text-[16px] leading-5 tracking-[-0.058em] text-body lg:mt-[25px] lg:text-[17px] lg:leading-6 lg:tracking-[-0.03em]">
            <LineBreaks text={hero.description} />
          </p>
          <div className="mt-10 flex flex-col gap-4 lg:mt-[39px] lg:flex-row lg:gap-4">
            <Button href={hero.primaryCta.href} size="lg" className="h-12 w-full text-[15px] lg:h-14 lg:w-auto lg:pt-1 lg:text-[17px]">
              {hero.primaryCta.label}
            </Button>
            <WhatsAppButton href={site.whatsappUrl} label={site.whatsappLabel} className="h-12 w-full text-[15px] lg:h-14 lg:w-auto lg:pt-1 lg:text-[17px]" />
          </div>
        </Reveal>
      </Container>
      <CurvedGallery images={hero.gallery} label={hero.galleryLabel} priority className="mt-[52px] lg:mt-[67px]" />
    </section>
  );
}
