import Image from "next/image";
import { Marquee } from "@/components/motion/Marquee";
import { clientLogos } from "@/content/clients";

export function ClientLogos() {
  return (
    <section aria-label="Clients" className="pt-[47px] lg:pt-[66px]">
      <Marquee className="mx-auto max-w-[1010px]">
        {clientLogos.map((logo, i) => (
          <Image
            key={i}
            src={logo.src}
            alt={logo.alt}
            width={logo.width}
            height={logo.height}
            className="h-[18px] w-auto lg:h-8"
          />
        ))}
      </Marquee>
    </section>
  );
}
