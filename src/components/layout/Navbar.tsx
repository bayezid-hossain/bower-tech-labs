import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { LogoLockup } from "@/components/patterns/LogoLockup";
import { navigation } from "@/content/navigation";
import { site } from "@/content/site";

export function Navbar() {
  return (
    <header className="relative z-10">
      <Container className="relative flex items-center justify-between py-6">
        <LogoLockup />
        <nav aria-label="Primary" className="hidden lg:absolute lg:left-1/2 lg:block lg:-translate-x-1/2">
          <ul className="flex items-center gap-5">
            {navigation.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="text-[15px] tracking-[-0.02em] text-body transition-colors hover:text-ink">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <Button
          href={site.primaryCta.href}
          variant="flat"
          size="sm"
          className="h-9 px-3.5 text-[13px] lg:h-11 lg:px-5 lg:text-[15px]"
        >
          {site.primaryCta.label}
        </Button>
      </Container>
    </header>
  );
}
