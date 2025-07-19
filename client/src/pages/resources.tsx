import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, ChevronRight } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Link } from "wouter";

export default function Resources() {
  const resourceCategories = [
    {
      title: "Developers",
      tagline: "Build with OAuth 3",
      description: "Technical documentation, APIs, SDKs, and integration guides.",
      items: [
        { title: "API Documentation", description: "Complete reference for OAuth 3 APIs" },
        { title: "SDK & Libraries", description: "Ready-to-use SDKs for popular languages" },
        { title: "Code Examples", description: "Sample implementations and tutorials" },
        { title: "Integration Guide", description: "Step-by-step integration instructions" }
      ]
    },
    {
      title: "Enterprises",
      tagline: "Transform your organization",
      description: "Strategic resources for implementing OAuth 3 solutions.",
      items: [
        { title: "Use Cases", description: "Real-world enterprise implementations" },
        { title: "Security Architecture", description: "Enterprise-grade security design" },
        { title: "Migration Guide", description: "Transition from traditional systems" },
        { title: "Cost Analysis", description: "ROI and cost-benefit calculations" }
      ]
    },
    {
      title: "Community",
      tagline: "Learn and connect",
      description: "Educational materials and community resources.",
      items: [
        { title: "Blog & Articles", description: "Latest insights and developments" },
        { title: "Video Tutorials", description: "Visual learning resources" },
        { title: "Community Forum", description: "Connect with OAuth 3 users" },
        { title: "Newsletter", description: "Stay updated with OAuth 3 news" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Hero Section */}
      <section className="pt-24 pb-16 gradient-bg tech-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 professional-heading">Whitepaper</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto tech-body">The complete technical and strategic vision for OAuth 3's revolutionary authentication framework.</p>
          </div>
        </div>
      </section>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        {/* OAuth 3 Whitepaper Section */}
        <div className="mb-20">
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="p-12">
              <div className="text-center">
                <Link href="/whitepaper">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-3 font-semibold">
                    <Download className="mr-2 h-5 w-5" />
                    Download Whitepaper
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resource Categories */}
        <div className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {resourceCategories.map((category, index) => (
              <div key={index}>
                <h3 className="text-xl font-bold text-foreground mb-2">{category.title}</h3>
                <p className="text-primary font-semibold mb-4">{category.tagline}</p>
                <p className="text-muted-foreground text-sm mb-6">{category.description}</p>
                
                <div className="space-y-4">
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="group cursor-pointer">
                      <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                        <div>
                          <h4 className="text-sm font-semibold text-foreground mb-1">{item.title}</h4>
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        
      </div>
      <Footer />
    </div>
  );
}