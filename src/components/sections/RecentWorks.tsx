import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CurvedGallery } from "@/components/patterns/CurvedGallery";
import { recentWorksSection } from "@/content/recent-works";

export function RecentWorks() {
  return (
    <section aria-labelledby="recent-works-title" className="pt-20 lg:pt-[199px]">
      <Container>
        <SectionHeading
          titleId="recent-works-title"
          align="center"
          title={recentWorksSection.title}
          subtitle={recentWorksSection.subtitle}
        />
      </Container>
      <CurvedGallery images={recentWorksSection.gallery} label={recentWorksSection.galleryLabel} className="mt-12 lg:mt-0" />
    </section>
  );
}
