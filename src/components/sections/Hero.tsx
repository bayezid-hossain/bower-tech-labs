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
          <Badge>{hero.status}</Badge>
          <h1
            id="hero-title"
            className="mt-6 text-[36px] font-semibold leading-10 tracking-[-0.045em] text-ink lg:mt-10 lg:text-[60px] lg:leading-[60px]"
          >
            <LineBreaks text={hero.title} />
          </h1>
          <p className="mt-5 text-[15px] leading-5 text-body lg:mt-6 lg:text-[17px] lg:leading-6">
            <LineBreaks text={hero.description} />
          </p>
          <div className="mt-8 flex flex-col gap-3 lg:mt-10 lg:flex-row lg:gap-4">
            <Button href={hero.primaryCta.href} size="lg" className="h-12 w-full lg:h-14 lg:w-auto">
              {hero.primaryCta.label}
            </Button>
            <WhatsAppButton href={site.whatsappUrl} label={site.whatsappLabel} className="h-12 w-full lg:h-14 lg:w-auto" />
          </div>
        </Reveal>
      </Container>
      <CurvedGallery images={hero.gallery} label={hero.galleryLabel} priority className="mt-[54px] lg:mt-[67px]" />
    </section>
  );
}
