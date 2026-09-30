import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { LogoLockup } from "@/components/patterns/LogoLockup";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { navigation } from "@/content/navigation";
import { site } from "@/content/site";

export function Navbar() {
  return (
    <StickyHeader className="sticky top-0 z-40 bg-page/95 backdrop-blur-sm">
      <Container className="relative flex items-center justify-between py-6">
        <LogoLockup />
        <nav aria-label="Primary" className="hidden lg:absolute lg:left-1/2 lg:block lg:-translate-x-1/2">
          <ul className="flex items-center gap-5">
            {navigation.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="text-[15px] tracking-[-0.04em] text-body transition-colors hover:text-ink">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <Button
            href={site.primaryCta.href}
            variant="flat"
            size="sm"
            className="h-9 px-[17px] text-[13px] lg:h-11 lg:px-5 lg:text-[15px]"
          >
            {site.primaryCta.label}
          </Button>
          <MobileMenu />
        </div>
      </Container>
    </StickyHeader>
  );
}
