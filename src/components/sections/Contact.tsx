import { BulletList } from "@/components/ui/BulletList";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { ContactForm } from "@/components/patterns/ContactForm";
import { TeamMember } from "@/components/patterns/TeamMember";
import { contactForm, contactSection, team } from "@/content/contact";
import { site } from "@/content/site";

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="pt-20 lg:pt-[200px]">
      <Container className="grid gap-10 lg:grid-cols-[540px_1fr] lg:gap-0">
        <Reveal>
          <SectionHeading
            titleId="contact-title"
            title={contactSection.title}
            titleBreakOn="always"
            subtitle={contactSection.subtitle}
            titleClassName="text-navy-ink lg:leading-[58px]"
            subtitleClassName="max-w-[440px] text-base lg:mt-7 lg:text-lg"
          />
          <BulletList items={contactSection.bullets} className="mt-6 gap-3 lg:mt-10" itemClassName="text-[15px] leading-6 text-body" />
          <div className="mt-10 flex gap-11 lg:mt-[60px]">
            {team.map((member) => (
              <TeamMember key={member.name} member={member} />
            ))}
          </div>
        </Reveal>
        <Reveal delay={100}>
          <ContactForm
            fields={contactForm.fields}
            submitLabel={contactForm.submitLabel}
            altPrompt={contactForm.altPrompt}
            altCta={contactForm.altCta}
            altHref={site.bookCallUrl}
            successMessage={contactForm.successMessage}
          />
        </Reveal>
      </Container>
    </section>
  );
}
