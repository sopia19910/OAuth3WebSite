import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Download, Check, Users, Code, Building2, FileText, ExternalLink, Shield, Network, Key } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Link } from "wouter";

export default function Resources() {
  const whitepaperFeatures = [
    "Hybrid Authentication Architecture",
    "Multi-Layered Blockchain Security", 
    "ZKP Integration for Privacy",
    "Cross-Chain Enterprise Solutions",
    "Token Economy & Incentive Models"
  ];

  const resourceCategories = [
    {
      icon: <Code className="w-16 h-16 text-primary mb-6" />,
      title: "For Developers",
      description: "Technical documentation, APIs, SDKs, and integration guides to build with OAuth 3.",
      resources: [
        "Technical Documentation",
        "API Reference",
        "SDK Downloads",
        "Integration Guides",
        "Code Examples"
      ]
    },
    {
      icon: <Building2 className="w-16 h-16 text-accent mb-6" />,
      title: "For Enterprises",
      description: "Strategic resources for organizations looking to implement OAuth 3 solutions.",
      resources: [
        "Enterprise Use Cases",
        "Implementation Roadmap",
        "Security Architecture",
        "Cost-Benefit Analysis",
        "Migration Guide"
      ]
    },
    {
      icon: <Users className="w-16 h-16 text-primary mb-6" />,
      title: "For Enthusiasts",
      description: "Educational materials and community resources for blockchain and authentication enthusiasts.",
      resources: [
        "Educational Blog Posts",
        "Community Forum",
        "Video Tutorials",
        "Research Papers",
        "Newsletter Updates"
      ]
    }
  ];

  const technicalTopics = [
    {
      icon: <Shield className="w-12 h-12 text-primary mb-4" />,
      title: "Security Architecture",
      description: "Deep dive into OAuth 3's multi-layered security model and cryptographic foundations."
    },
    {
      icon: <Network className="w-12 h-12 text-accent mb-4" />,
      title: "Cross-Chain Integration",
      description: "Learn how OAuth 3 enables seamless interaction across multiple blockchain networks."
    },
    {
      icon: <Key className="w-12 h-12 text-primary mb-4" />,
      title: "Zero-Knowledge Proofs",
      description: "Understand how ZKP technology ensures privacy while maintaining security and verifiability."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 gradient-bg tech-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 professional-heading">
              Resources
            </h1>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto tech-body leading-relaxed">
              Explore the Future of Decentralized Identity
            </p>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto tech-body mt-4">
              Whether you're a developer, enterprise leader, or blockchain enthusiast, OAuth 3 offers comprehensive resources to help you understand and engage with the next evolution of authentication. From high-level concepts to deep technical architecture, everything you need is just a click away.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        {/* OAuth 3 Whitepaper Section */}
        <div className="mb-20">
          <Card className="bg-card shadow-lg card-hover border-2 border-primary/20">
            <CardContent className="p-12">
              <div className="text-center mb-8">
                <BookOpen className="w-20 h-20 text-primary mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-foreground mb-4 professional-heading">📘 OAuth 3 Whitepaper</h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto tech-body">
                  Dive into the full technical and strategic vision behind OAuth 3. Learn how it combines Web2 simplicity, Web3 ownership, ZKP privacy, and multi-chain interoperability into a unified identity framework.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">What You'll Learn:</h3>
                  <ul className="space-y-3">
                    {whitepaperFeatures.map((feature, index) => (
                      <li key={index} className="flex items-center text-muted-foreground">
                        <Check className="w-5 h-5 text-primary mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="text-center">
                  <FileText className="w-32 h-32 text-primary/20 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Comprehensive technical documentation covering OAuth 3's architecture, implementation, and real-world applications.
                  </p>
                </div>
              </div>

              <div className="text-center">
                <Link href="/whitepaper">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-3 font-semibold">
                    <Download className="mr-2 h-5 w-5" />
                    👉 Download the OAuth 3 Whitepaper
                  </Button>
                </Link>
                <p className="text-muted-foreground text-sm mt-2">(Click to view the full PDF document)</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resource Categories */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4 professional-heading">Resource Categories</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto tech-body">
              Find the right resources for your specific needs and expertise level.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {resourceCategories.map((category, index) => (
              <Card key={index} className="bg-card shadow-lg card-hover">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    {category.icon}
                    <h3 className="text-xl font-semibold text-foreground mb-4">{category.title}</h3>
                    <p className="text-muted-foreground mb-6">{category.description}</p>
                  </div>
                  <ul className="space-y-3">
                    {category.resources.map((resource, resourceIndex) => (
                      <li key={resourceIndex} className="flex items-center text-muted-foreground">
                        <Check className="w-4 h-4 text-primary mr-3" />
                        {resource}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Technical Deep Dives */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4 professional-heading">Technical Deep Dives</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto tech-body">
              Explore the core technologies and concepts that make OAuth 3 revolutionary.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {technicalTopics.map((topic, index) => (
              <Card key={index} className="bg-card shadow-lg card-hover">
                <CardContent className="p-8">
                  <div className="text-center">
                    {topic.icon}
                    <h3 className="text-xl font-semibold text-foreground mb-4">{topic.title}</h3>
                    <p className="text-muted-foreground mb-6">{topic.description}</p>
                    <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Read More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Additional Resources */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4 professional-heading">Additional Resources</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto tech-body">
              Stay updated with the latest developments and join the OAuth 3 community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-card shadow-lg card-hover">
              <CardContent className="p-8">
                <div className="text-center">
                  <FileText className="w-16 h-16 text-accent mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-4">Research Papers</h3>
                  <p className="text-muted-foreground mb-6">
                    Access peer-reviewed research papers and academic publications on OAuth 3 technology.
                  </p>
                  <Button variant="outline" className="border-accent text-accent hover:bg-accent/10">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Browse Papers
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card shadow-lg card-hover">
              <CardContent className="p-8">
                <div className="text-center">
                  <Users className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-4">Community Forum</h3>
                  <p className="text-muted-foreground mb-6">
                    Join discussions, ask questions, and connect with other OAuth 3 developers and enthusiasts.
                  </p>
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Join Community
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6 professional-heading">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto tech-body mb-8">
            Begin your journey with OAuth 3 by exploring our comprehensive documentation and resources.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-3 font-semibold">
              <BookOpen className="mr-2 h-5 w-5" />
              Start with Documentation
            </Button>
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10 px-8 py-3 font-semibold">
              <Code className="mr-2 h-5 w-5" />
              View Code Examples
            </Button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}