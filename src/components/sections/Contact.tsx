import { BulletList } from "@/components/ui/BulletList";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/motion/FadeIn";
import { ContactForm } from "@/components/patterns/ContactForm";
import { TeamMember } from "@/components/patterns/TeamMember";
import { contactForm, contactSection, team } from "@/content/contact";
import { site } from "@/content/site";

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="pt-20 lg:pt-[200px]">
      <Container className="grid gap-10 lg:grid-cols-[540px_1fr] lg:gap-0">
        <div>
          <SectionHeading
            titleId="contact-title"
            title={contactSection.title}
            titleBreakOn="always"
            subtitle={contactSection.subtitle}
            titleClassName="text-navy-ink lg:leading-[56px]"
            subtitleClassName="max-w-[440px] text-base lg:mt-6 lg:text-[17px] lg:leading-6 lg:tracking-[-0.03em]"
          />
          <FadeIn>
            <BulletList items={contactSection.bullets} className="mt-6 gap-3 lg:mt-[33px]" itemClassName="text-[15px] leading-6 text-body lg:tracking-[-0.035em]" />
            <div className="mt-10 flex gap-11 lg:mt-[55px]">
              {team.map((member) => (
                <TeamMember key={member.name} member={member} />
              ))}
            </div>
          </FadeIn>
        </div>
        <FadeIn delay={0.1}>
          <ContactForm
            fields={contactForm.fields}
            submitLabel={contactForm.submitLabel}
            altPrompt={contactForm.altPrompt}
            altCta={contactForm.altCta}
            altHref={site.bookCallUrl}
            successMessage={contactForm.successMessage}
          />
        </FadeIn>
      </Container>
    </section>
  );
}
