import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { About } from "@/components/sections/About";
import { ClientLogos } from "@/components/sections/ClientLogos";
import { Hero } from "@/components/sections/Hero";
import { Process } from "@/components/sections/Process";
import { Projects } from "@/components/sections/Projects";
import { RecentWorks } from "@/components/sections/RecentWorks";
import { Services } from "@/components/sections/Services";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ClientLogos />
        <About />
        <Services />
        <Projects />
        <Process />
        <RecentWorks />
      </main>
      <Footer />
    </>
  );
}
