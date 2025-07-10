import Navbar from "@/components/navbar";
import HeroSection from "@/components/hero-section";
import AboutSection from "@/components/about-section";
import TechnologySection from "@/components/technology-section";
import ServicesSection from "@/components/services-section";
import DemoSection from "@/components/demo-section";
import ResourcesSection from "@/components/resources-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <TechnologySection />
      <ServicesSection />
      <DemoSection />
      <ResourcesSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
