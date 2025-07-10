import Navbar from "@/components/navbar";
import HeroSection from "@/components/hero-section";
import DemoSection from "@/components/demo-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <DemoSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
