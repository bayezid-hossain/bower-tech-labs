import Image from "next/image";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { LogoLockup } from "@/components/patterns/LogoLockup";
import { WhatsAppButton } from "@/components/patterns/WhatsAppButton";
import { footer, footerColumns } from "@/content/footer";
import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="pt-20 pb-10 lg:pt-[180px] lg:pb-[67px]">
      <Container>
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-[611px_261px_180px_1fr] lg:gap-0">
          <div className="col-span-2 lg:col-span-1">
            <LogoLockup variant="footer" />
            <p className="mt-6 max-w-[400px] text-base leading-6 text-body lg:mt-[18px] lg:text-[15px] lg:tracking-[-0.035em]">{footer.description}</p>
            <p className="mt-6 text-[15px] font-medium tracking-[-0.02em] text-whatsapp-text lg:tracking-[-0.05em]">{footer.emailLabel}</p>
            <div className="mt-3 flex flex-col gap-3 lg:mt-[5px] lg:flex-row lg:gap-4">
              <Button href={`mailto:${site.email}`} size="sm" className="w-full px-5 text-[14px] lg:w-auto lg:text-[13px]">
                {site.email}
              </Button>
              <WhatsAppButton href={site.whatsappUrl} label={site.whatsappLabel} size="sm" className="w-full lg:w-auto lg:text-[13px]" />
            </div>
            <p className="mt-12 hidden text-base text-ink lg:mt-[47px] lg:block lg:text-[15px] lg:tracking-[-0.03em]">{footer.copyright}</p>
          </div>
          {footerColumns.map((column, i) => (
            <nav key={i} aria-label={column.title} className={cn(i === 0 && "col-span-2 lg:col-span-1")}>
              <h2 className="text-xl font-medium tracking-[-0.02em] text-ink lg:leading-6 lg:tracking-[-0.07em]">{column.title}</h2>
              <ul className="mt-5 flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-base leading-6 text-body transition-colors hover:text-ink lg:tracking-[-0.09em]">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <p className="mt-10 text-center text-[15px] text-ink lg:hidden">{footer.copyright}</p>
        <div className="mt-6 border-t border-line lg:mt-[54px]" />
        <Image
          src="/brand/wordmark.png"
          alt={footer.wordmarkAlt}
          width={1180}
          height={141}
          className="mt-8 h-auto w-full lg:mt-[61px] lg:ml-[13px] lg:w-[1180px]"
        />
      </Container>
    </footer>
  );
}
