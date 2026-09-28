import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { About } from "@/components/sections/About";
import { ClientLogos } from "@/components/sections/ClientLogos";
import { Hero } from "@/components/sections/Hero";
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
      </main>
      <Footer />
    </>
  );
}
