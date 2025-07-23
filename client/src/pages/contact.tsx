import Navbar from "@/components/navbar";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";

export default function Contact() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 gradient-bg tech-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-foreground mb-6 professional-heading">
              Contact Us
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto tech-body">
              Ready to implement OAuth 3 in your application? Get in touch with our team for personalized support and guidance.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <div className="bg-muted">
        <ContactSection />
      </div>
      
      <Footer />
    </div>
  );
}